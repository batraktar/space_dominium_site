<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/lib/sd-bootstrap.php';

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

function sd_strlen(string $value): int
{
  if (function_exists('mb_strlen')) {
    return (int) mb_strlen($value, 'UTF-8');
  }
  return strlen($value);
}

function sd_normalize_spaces(string $value): string
{
  return trim((string) preg_replace('/\s+/u', ' ', $value));
}

function sd_validate_form_values(array $values): array
{
  $errors = [];

  $firstName = sd_normalize_spaces((string) ($values['firstName'] ?? ''));
  $company = sd_normalize_spaces((string) ($values['company'] ?? ''));
  $email = trim((string) ($values['email'] ?? ''));
  $phone = sd_normalize_spaces((string) ($values['phone'] ?? ''));
  $message = sd_normalize_spaces((string) ($values['message'] ?? ''));

  $phoneDigits = preg_replace('/\D+/', '', $phone);
  if (!is_string($phoneDigits)) {
    $phoneDigits = '';
  }
  if (strlen($phoneDigits) <= 3) {
    $phone = '';
    $phoneDigits = '';
  }

  if ($firstName === '') {
    $errors['firstName'] = 'First name is required';
  } else {
    $nameLen = sd_strlen($firstName);
    if ($nameLen < 2) {
      $errors['firstName'] = 'First name must be at least 2 characters';
    } elseif ($nameLen > 80) {
      $errors['firstName'] = 'First name is too long';
    } elseif (!preg_match('/^[\p{L}\p{M}\'’\-\s]+$/u', $firstName)) {
      $errors['firstName'] = 'First name contains invalid characters';
    }
  }

  if ($company !== '' && sd_strlen($company) > 120) {
    $errors['company'] = 'Company name is too long';
  }

  if ($email === '' && $phone === '') {
    $errors['email'] = 'Email or phone is required';
    $errors['phone'] = 'Email or phone is required';
  }

  if ($email !== '') {
    if (sd_strlen($email) > 254) {
      $errors['email'] = 'Email is too long';
    } elseif (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
      $errors['email'] = 'Invalid email format';
    }
  }

  if ($phone !== '') {
    if (!preg_match('/^[+\d()\-\s]+$/', $phone)) {
      $errors['phone'] = 'Phone contains invalid characters';
    } elseif (strlen($phoneDigits) < 7 || strlen($phoneDigits) > 15) {
      $errors['phone'] = 'Invalid phone format';
    }
  }

  if ($message === '') {
    $errors['message'] = 'Message is required';
  } else {
    $messageLen = sd_strlen($message);
    if ($messageLen < 10) {
      $errors['message'] = 'Message must be at least 10 characters';
    } elseif ($messageLen > 2000) {
      $errors['message'] = 'Message is too long';
    }
  }

  return [
    'errors' => $errors,
    'normalized' => [
      'firstName' => $firstName,
      'company' => $company,
      'email' => $email,
      'phone' => $phone,
      'message' => $message,
    ],
  ];
}

function sd_resolve_allowed_origins(): array
{
  $configured = sd_parse_delimited_values(sd_read_env('CONTACT_ALLOWED_ORIGINS', ['ALLOWED_ORIGINS']));
  $siteUrl = sd_read_env('VITE_SITE_URL');
  if ($siteUrl !== '') {
    $configured[] = $siteUrl;
  }

  $currentOrigin = sd_current_origin();
  if ($currentOrigin !== '') {
    $configured[] = $currentOrigin;
  }

  $normalized = [];
  foreach ($configured as $origin) {
    $value = sd_normalize_origin((string) $origin);
    if ($value === '' || in_array($value, $normalized, true)) {
      continue;
    }
    $normalized[] = $value;
  }

  return $normalized;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  sd_json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
  exit;
}

$allowedOrigins = sd_resolve_allowed_origins();
if (!sd_request_origin_allowed($allowedOrigins)) {
  sd_json_response(['ok' => false, 'error' => 'Origin is not allowed'], 403);
  exit;
}

$csrfHeader = trim((string) ($_SERVER['HTTP_X_SD_CSRF'] ?? ''));
$csrfCookie = rawurldecode(trim((string) ($_COOKIE['sd_csrf'] ?? '')));
if ($csrfHeader === '' || $csrfCookie === '' || !hash_equals($csrfCookie, $csrfHeader)) {
  sd_json_response(['ok' => false, 'error' => 'CSRF validation failed'], 403);
  exit;
}

$rateLimit = sd_rate_limit('contact-submit', sd_client_ip(), 8, 300);
header('X-RateLimit-Limit: 8');
header('X-RateLimit-Remaining: ' . (string) ($rateLimit['remaining'] ?? 0));
if (!($rateLimit['allowed'] ?? false)) {
  $retryAfter = (int) ($rateLimit['retry_after'] ?? 60);
  header('Retry-After: ' . (string) max($retryAfter, 1));
  sd_json_response([
    'ok' => false,
    'error' => 'Too many requests. Try again later.',
    'retryAfter' => max($retryAfter, 1),
  ], 429);
  exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody ?: '', true);
if (!is_array($data)) {
  sd_json_response(['ok' => false, 'error' => 'Invalid JSON payload'], 400);
  exit;
}

$values = isset($data['values']) && is_array($data['values']) ? $data['values'] : [];
$honeypot = isset($values['website']) ? trim((string) $values['website']) : '';
if ($honeypot !== '') {
  sd_json_response(['ok' => true]);
  exit;
}

$source = trim((string) ($data['source'] ?? 'Unknown'));
$pageUrl = trim((string) ($data['pageUrl'] ?? ''));

$validation = sd_validate_form_values($values);
$errors = is_array($validation['errors'] ?? null) ? $validation['errors'] : [];
$normalized = is_array($validation['normalized'] ?? null) ? $validation['normalized'] : [];
if (count($errors) > 0) {
  sd_json_response([
    'ok' => false,
    'error' => 'Validation failed',
    'fields' => $errors,
  ], 422);
  exit;
}

$firstName = (string) ($normalized['firstName'] ?? '');
$company = (string) ($normalized['company'] ?? '');
$email = (string) ($normalized['email'] ?? '');
$phone = (string) ($normalized['phone'] ?? '');
$message = (string) ($normalized['message'] ?? '');

$token = sd_read_env('TELEGRAM_BOT_TOKEN', ['VITE_TELEGRAM_BOT_TOKEN']);
$chatIdRaw = sd_read_env('TELEGRAM_CHAT_ID', ['VITE_TELEGRAM_CHAT_ID']);
$chatIds = sd_parse_delimited_values($chatIdRaw);
if (trim($token) === '' || count($chatIds) === 0) {
  sd_json_response(['ok' => false, 'error' => 'Telegram env is not configured'], 500);
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
  $firstFailure = $failedSends[0]['error'] ?? 'Telegram send failed';
  sd_json_response([
    'ok' => false,
    'error' => $firstFailure,
  ], 502);
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

sd_json_response([
  'ok' => true,
  'partial' => count($failedSends) > 0,
]);
