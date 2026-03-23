<?php
declare(strict_types=1);

function sd_bootstrap_dotenv(): void
{
  static $isLoaded = false;
  if ($isLoaded) {
    return;
  }
  $isLoaded = true;

  $autoloadCandidates = [
    dirname(__DIR__, 2) . '/vendor/autoload.php',
    dirname(__DIR__) . '/vendor/autoload.php',
  ];

  foreach ($autoloadCandidates as $autoloadPath) {
    if (!is_file($autoloadPath)) {
      continue;
    }

    require_once $autoloadPath;
    break;
  }

  if (!class_exists('Dotenv\\Dotenv')) {
    return;
  }

  try {
    $dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2), ['.env', '.env.local']);
    $dotenv->safeLoad();
  } catch (Throwable $error) {
    // Silent fallback to file/env parser below.
  }
}

function sd_read_env_file_value(string $key): string
{
  static $envMap = null;
  if (is_array($envMap)) {
    return $envMap[$key] ?? '';
  }

  $envMap = [];
  $candidates = [
    dirname(__DIR__) . '/.env',
    dirname(__DIR__) . '/.env.local',
    dirname(__DIR__, 2) . '/.env',
    dirname(__DIR__, 2) . '/.env.local',
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

function sd_read_env(string $key, array $aliases = []): string
{
  sd_bootstrap_dotenv();

  $keys = array_merge([$key], $aliases);
  foreach ($keys as $name) {
    $direct = getenv($name);
    if (is_string($direct) && trim($direct) !== '') {
      return trim($direct);
    }

    $envValue = $_ENV[$name] ?? '';
    if (is_string($envValue) && trim($envValue) !== '') {
      return trim($envValue);
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

function sd_json_response(array $payload, int $statusCode = 200): void
{
  http_response_code($statusCode);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
}

function sd_parse_delimited_values(string $raw): array
{
  $parts = preg_split('/[\s,;]+/', trim($raw));
  if (!is_array($parts)) {
    return [];
  }

  $result = [];
  foreach ($parts as $part) {
    $value = trim((string) $part);
    if ($value === '' || in_array($value, $result, true)) {
      continue;
    }
    $result[] = $value;
  }

  return $result;
}

function sd_normalize_origin(string $value): string
{
  $parts = parse_url(trim($value));
  if (!is_array($parts)) {
    return '';
  }

  $scheme = strtolower((string) ($parts['scheme'] ?? ''));
  $host = strtolower((string) ($parts['host'] ?? ''));
  if ($scheme === '' || $host === '') {
    return '';
  }

  $origin = $scheme . '://' . $host;
  $port = (int) ($parts['port'] ?? 0);
  if (
    $port > 0
    && !($scheme === 'http' && $port === 80)
    && !($scheme === 'https' && $port === 443)
  ) {
    $origin .= ':' . $port;
  }

  return $origin;
}

function sd_current_origin(): string
{
  $host = trim((string) ($_SERVER['HTTP_HOST'] ?? ''));
  if ($host === '') {
    return '';
  }

  $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || ((int) ($_SERVER['SERVER_PORT'] ?? 0) === 443);
  $scheme = $isHttps ? 'https' : 'http';

  return sd_normalize_origin($scheme . '://' . $host);
}

function sd_request_origin_candidate(): string
{
  $origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
  if ($origin !== '') {
    return sd_normalize_origin($origin);
  }

  $referer = trim((string) ($_SERVER['HTTP_REFERER'] ?? ''));
  if ($referer === '') {
    return '';
  }

  return sd_normalize_origin($referer);
}

function sd_request_origin_allowed(array $allowedOrigins): bool
{
  $candidate = sd_request_origin_candidate();
  if ($candidate === '') {
    return false;
  }

  $normalized = [];
  foreach ($allowedOrigins as $origin) {
    $next = sd_normalize_origin((string) $origin);
    if ($next !== '' && !in_array($next, $normalized, true)) {
      $normalized[] = $next;
    }
  }

  if (count($normalized) === 0) {
    return false;
  }

  return in_array($candidate, $normalized, true);
}

function sd_client_ip(): string
{
  $candidates = [
    $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
    $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '',
    $_SERVER['REMOTE_ADDR'] ?? '',
  ];

  foreach ($candidates as $candidate) {
    $value = trim((string) $candidate);
    if ($value === '') {
      continue;
    }

    if (strpos($value, ',') !== false) {
      $parts = explode(',', $value);
      $value = trim((string) ($parts[0] ?? ''));
    }

    if (filter_var($value, FILTER_VALIDATE_IP)) {
      return $value;
    }
  }

  return 'unknown';
}

function sd_rate_limit(string $bucket, string $identifier, int $limit, int $windowSeconds): array
{
  if ($limit <= 0 || $windowSeconds <= 0) {
    return ['allowed' => true, 'remaining' => 0, 'retry_after' => 0];
  }

  $safeIdentifier = trim($identifier) !== '' ? trim($identifier) : 'unknown';
  $storageDir = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'sd-rate-limit';
  if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0775, true);
  }

  $filePath = $storageDir . DIRECTORY_SEPARATOR . hash('sha256', $bucket . '|' . $safeIdentifier) . '.json';
  $now = time();
  $state = [
    'window_start' => $now,
    'count' => 0,
  ];

  $handle = @fopen($filePath, 'c+');
  if (!is_resource($handle)) {
    return ['allowed' => true, 'remaining' => $limit, 'retry_after' => 0];
  }

  try {
    if (!flock($handle, LOCK_EX)) {
      return ['allowed' => true, 'remaining' => $limit, 'retry_after' => 0];
    }

    $raw = stream_get_contents($handle);
    if (is_string($raw) && trim($raw) !== '') {
      $decoded = json_decode($raw, true);
      if (is_array($decoded)) {
        $windowStart = (int) ($decoded['window_start'] ?? 0);
        $count = (int) ($decoded['count'] ?? 0);
        if ($windowStart > 0 && $count >= 0) {
          $state = ['window_start' => $windowStart, 'count' => $count];
        }
      }
    }

    if (($now - (int) $state['window_start']) >= $windowSeconds) {
      $state['window_start'] = $now;
      $state['count'] = 0;
    }

    $state['count'] = (int) $state['count'] + 1;
    $allowed = (int) $state['count'] <= $limit;
    $remaining = max($limit - (int) $state['count'], 0);
    $retryAfter = $allowed ? 0 : max($windowSeconds - ($now - (int) $state['window_start']), 1);

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($state));
    fflush($handle);
    flock($handle, LOCK_UN);

    return [
      'allowed' => $allowed,
      'remaining' => $remaining,
      'retry_after' => $retryAfter,
    ];
  } finally {
    fclose($handle);
  }
}
