<?php
declare(strict_types=1);

$allowedGids = [
  '0',
  '1942219183',
  '1925531033',
  '338318137',
];

$gid = isset($_GET['gid']) ? (string)$_GET['gid'] : '';
if ($gid === '' || !in_array($gid, $allowedGids, true)) {
  http_response_code(400);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Invalid gid';
  exit;
}

$baseUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQe_2b7SqCf4At0pw-SvLPavigCx3XqY2Ht1ikJjFvlxni3jV0PynxifiiABhhjK-t3Nn205SQMXXzM/pub';
$remoteUrl = $baseUrl . '?gid=' . $gid . '&single=true&output=csv';

$cacheDir = __DIR__ . '/faq-cache';
$cacheFile = $cacheDir . '/faq-' . $gid . '.csv';
$ttlSeconds = 24 * 60 * 60;

if (!is_dir($cacheDir)) {
  @mkdir($cacheDir, 0755, true);
}

$isFresh = file_exists($cacheFile) && (time() - filemtime($cacheFile) < $ttlSeconds);
if ($isFresh) {
  header('Content-Type: text/csv; charset=utf-8');
  header('Cache-Control: public, max-age=3600');
  readfile($cacheFile);
  exit;
}

function fetchRemote(string $url): ?string
{
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    $data = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($data !== false && $status >= 200 && $status < 300) {
      return (string) $data;
    }
  }

  $context = stream_context_create([
    'http' => [
      'method' => 'GET',
      'timeout' => 8,
    ],
  ]);
  $data = @file_get_contents($url, false, $context);
  if ($data !== false) {
    return (string) $data;
  }

  return null;
}

$data = fetchRemote($remoteUrl);
if ($data !== null) {
  @file_put_contents($cacheFile, $data);
  header('Content-Type: text/csv; charset=utf-8');
  header('Cache-Control: public, max-age=3600');
  echo $data;
  exit;
}

if (file_exists($cacheFile)) {
  header('Content-Type: text/csv; charset=utf-8');
  header('Cache-Control: public, max-age=3600');
  readfile($cacheFile);
  exit;
}

http_response_code(502);
header('Content-Type: text/plain; charset=utf-8');
echo 'FAQ cache is unavailable';
