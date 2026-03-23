<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/sd-bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  sd_json_response(['ok' => false, 'allowed' => false, 'error' => 'Method not allowed'], 405);
  exit;
}

$secret = sd_read_env('THANKS_GATE_SECRET', ['VITE_THANKS_GATE_SECRET']);
$cookie = $_COOKIE['sd_thanks_gate'] ?? '';

if (trim($secret) === '' || !is_string($cookie) || trim($cookie) === '') {
  sd_json_response(['ok' => true, 'allowed' => false]);
  exit;
}

$encoded = trim($cookie);
$padding = strlen($encoded) % 4;
if ($padding > 0) {
  $encoded .= str_repeat('=', 4 - $padding);
}

$decoded = base64_decode(strtr($encoded, '-_', '+/'), true);
if (!is_string($decoded) || $decoded === '' || strpos($decoded, '|') === false) {
  sd_json_response(['ok' => true, 'allowed' => false]);
  exit;
}

[$expiresAtRaw, $signatureRaw] = explode('|', $decoded, 2);
$expiresAt = ctype_digit($expiresAtRaw) ? (int) $expiresAtRaw : 0;
$signature = trim($signatureRaw);

if ($expiresAt <= time() || $signature === '') {
  sd_json_response(['ok' => true, 'allowed' => false]);
  exit;
}

$expectedSignature = hash_hmac('sha256', (string) $expiresAt, trim((string) $secret));
if (!hash_equals($expectedSignature, $signature)) {
  sd_json_response(['ok' => true, 'allowed' => false]);
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

sd_json_response(['ok' => true, 'allowed' => true]);
