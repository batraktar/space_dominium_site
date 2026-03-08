<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function sd_read_env(string $key, array $aliases = []): string
{
  $keys = array_merge([$key], $aliases);
  foreach ($keys as $name) {
    $direct = getenv($name);
    if (is_string($direct) && trim($direct) !== '') {
      return trim($direct);
    }

    $serverValue = $_SERVER[$name] ?? '';
    if (is_string($serverValue) && trim($serverValue) !== '') {
      return trim($serverValue);
    }

    $fromFile = sd_read_env_file_value($name);
    if ($fromFile !== '') {
      return $fromFile;
    }
  }

  return '';
}

function sd_read_env_file_value(string $key): string
{
  static $envMap = null;
  if (is_array($envMap)) {
    return $envMap[$key] ?? '';
  }

  $envMap = [];
  $candidates = [
    __DIR__ . '/.env',
    __DIR__ . '/.env.local',
    dirname(__DIR__) . '/.env',
    dirname(__DIR__) . '/.env.local',
  ];

  foreach ($candidates as $path) {
    if (!is_file($path) || !is_readable($path)) {
      continue;
    }

    $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
      continue;
    }

    foreach ($lines as $line) {
      $trimmed = trim((string) $line);
      if ($trimmed === '' || substr($trimmed, 0, 1) === '#') {
        continue;
      }

      if (strpos($trimmed, 'export ') === 0) {
        $trimmed = trim(substr($trimmed, 7));
      }

      $separator = strpos($trimmed, '=');
      if ($separator === false) {
        continue;
      }

      $name = trim(substr($trimmed, 0, $separator));
      $value = trim(substr($trimmed, $separator + 1));
      if ($name === '') {
        continue;
      }

      $isQuoted =
        (substr($value, 0, 1) === '"' && substr($value, -1) === '"')
        || (substr($value, 0, 1) === "'" && substr($value, -1) === "'");
      if ($isQuoted && strlen($value) >= 2) {
        $value = substr($value, 1, -1);
      }

      $envMap[$name] = trim($value);
    }
  }

  return $envMap[$key] ?? '';
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'allowed' => false, 'error' => 'Method not allowed']);
  exit;
}

$secret = sd_read_env('THANKS_GATE_SECRET', ['VITE_THANKS_GATE_SECRET']);
$cookie = $_COOKIE['sd_thanks_gate'] ?? '';

if (trim($secret) === '' || !is_string($cookie) || trim($cookie) === '') {
  echo json_encode(['ok' => true, 'allowed' => false]);
  exit;
}

$encoded = trim($cookie);
$padding = strlen($encoded) % 4;
if ($padding > 0) {
  $encoded .= str_repeat('=', 4 - $padding);
}

$decoded = base64_decode(strtr($encoded, '-_', '+/'), true);
if (!is_string($decoded) || $decoded === '' || strpos($decoded, '|') === false) {
  echo json_encode(['ok' => true, 'allowed' => false]);
  exit;
}

[$expiresAtRaw, $signatureRaw] = explode('|', $decoded, 2);
$expiresAt = ctype_digit($expiresAtRaw) ? (int) $expiresAtRaw : 0;
$signature = trim($signatureRaw);

if ($expiresAt <= time() || $signature === '') {
  echo json_encode(['ok' => true, 'allowed' => false]);
  exit;
}

$expectedSignature = hash_hmac('sha256', (string) $expiresAt, trim((string) $secret));
if (!hash_equals($expectedSignature, $signature)) {
  echo json_encode(['ok' => true, 'allowed' => false]);
  exit;
}

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || ((int) ($_SERVER['SERVER_PORT'] ?? 0) === 443);

setcookie('sd_thanks_gate', '', [
  'expires' => time() - 3600,
  'path' => '/',
  'secure' => $isHttps,
  'httponly' => true,
  'samesite' => 'Lax',
]);

echo json_encode(['ok' => true, 'allowed' => true]);
