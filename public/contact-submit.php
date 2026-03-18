<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

/**
 * Reads env value from (in order):
 * 1) real server env (getenv)
 * 2) $_SERVER injected env
 * 3) local .env / .env.local files (for shared hosting fallback)
 */
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

function sd_parse_chat_ids(string $raw): array
{
  $parts = preg_split('/[\s,;]+/', trim($raw));
  if (!is_array($parts)) return [];

  $ids = [];
  foreach ($parts as $part) {
    $value = trim((string) $part);
    if ($value === '') continue;
    if (!in_array($value, $ids, true)) {
      $ids[] = $value;
    }
  }

  return $ids;
}

function sd_send_telegram_request(string $url, string $payload, int &$statusCode): ?array
{
  $responseBody = null;
  $statusCode = 0;

  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $responseBody = curl_exec($ch);
    $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
  }

  if (!is_string($responseBody) || $responseBody === '') {
    $context = stream_context_create([
      'http' => [
        'method' => 'POST',
        'timeout' => 10,
        'header' => "Content-Type: application/json\r\n",
        'content' => $payload,
      ],
    ]);
    $responseBody = @file_get_contents($url, false, $context);
    $statusCode = $responseBody === false ? 0 : 200;
  }

  return is_string($responseBody) ? json_decode($responseBody, true) : null;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody ?: '', true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid JSON payload']);
  exit;
}

$values = isset($data['values']) && is_array($data['values']) ? $data['values'] : [];
$honeypot = isset($values['website']) ? trim((string) $values['website']) : '';
if ($honeypot !== '') {
  echo json_encode(['ok' => true]);
  exit;
}

$source = trim((string) ($data['source'] ?? 'Unknown'));
$pageUrl = trim((string) ($data['pageUrl'] ?? ''));

$firstName = trim((string) ($values['firstName'] ?? ''));
$company = trim((string) ($values['company'] ?? ''));
$email = trim((string) ($values['email'] ?? ''));
$phone = trim((string) ($values['phone'] ?? ''));
$message = trim((string) ($values['message'] ?? ''));

if ($firstName === '' || $message === '' || ($email === '' && $phone === '')) {
  http_response_code(422);
  echo json_encode(['ok' => false, 'error' => 'Validation failed']);
  exit;
}

$token = sd_read_env('TELEGRAM_BOT_TOKEN', ['VITE_TELEGRAM_BOT_TOKEN']);
$chatIdRaw = sd_read_env('TELEGRAM_CHAT_ID', ['VITE_TELEGRAM_CHAT_ID']);
$chatIds = sd_parse_chat_ids($chatIdRaw);
if (trim($token) === '' || count($chatIds) === 0) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Telegram env is not configured']);
  exit;
}

$lines = [
  "🆕 Нова заявка з форми",
  "Розділ: " . ($source !== '' ? $source : 'Unknown'),
  "Сторінка: " . ($pageUrl !== '' ? $pageUrl : '—'),
  "Час: " . date('Y-m-d H:i:s'),
  "",
  "Імʼя: " . ($firstName !== '' ? $firstName : '—'),
  "Компанія: " . ($company !== '' ? $company : '—'),
  "Email: " . ($email !== '' ? $email : '—'),
  "Телефон: " . ($phone !== '' ? $phone : '—'),
  "",
  "Повідомлення:",
  ($message !== '' ? $message : '—'),
];

$telegramUrl = 'https://api.telegram.org/bot' . trim($token) . '/sendMessage';
$successfulSends = 0;
$failedSends = [];

foreach ($chatIds as $chatId) {
  $telegramPayload = json_encode([
    'chat_id' => $chatId,
    'text' => implode("\n", $lines),
    'disable_web_page_preview' => true,
  ], JSON_UNESCAPED_UNICODE);

  if ($telegramPayload === false) {
    continue;
  }

  $statusCode = 0;
  $telegramResponse = sd_send_telegram_request($telegramUrl, $telegramPayload, $statusCode);
  $ok = is_array($telegramResponse) && ($telegramResponse['ok'] ?? false) === true;
  $statusOk = $statusCode === 0 || ($statusCode >= 200 && $statusCode < 300);

  if ($ok && $statusOk) {
    $successfulSends += 1;
    continue;
  }

  $description = is_array($telegramResponse) ? (string) ($telegramResponse['description'] ?? '') : '';
  $failedSends[] = [
    'chatId' => $chatId,
    'error' => $description !== '' ? $description : 'Telegram send failed',
  ];
}

if ($successfulSends === 0) {
  http_response_code(502);
  $firstFailure = $failedSends[0]['error'] ?? 'Telegram send failed';
  echo json_encode([
    'ok' => false,
    'error' => $firstFailure,
  ]);
  exit;
}

$thanksSecret = sd_read_env('THANKS_GATE_SECRET', ['VITE_THANKS_GATE_SECRET']);
if (trim($thanksSecret) !== '') {
  $expiresAt = time() + 30;
  $signature = hash_hmac('sha256', (string) $expiresAt, trim($thanksSecret));
  $encoded = rtrim(strtr(base64_encode($expiresAt . '|' . $signature), '+/', '-_'), '=');
  $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || ((int) ($_SERVER['SERVER_PORT'] ?? 0) === 443);

  setcookie('sd_thanks_gate', $encoded, [
    'expires' => $expiresAt,
    'path' => '/',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Lax',
  ]);
}

echo json_encode([
  'ok' => true,
  'partial' => count($failedSends) > 0,
]);
