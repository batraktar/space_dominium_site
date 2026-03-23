#!/usr/bin/env bash
set -euo pipefail

if ! command -v php >/dev/null 2>&1; then
  echo "php binary is not available; skipping PHP endpoint smoke tests"
  exit 0
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOST="127.0.0.1"
PORT="${SD_PHP_TEST_PORT:-18081}"
BASE_URL="http://${HOST}:${PORT}"
TMP_DIR="$(mktemp -d)"
SERVER_PID=""

cleanup() {
  if [[ -n "${SERVER_PID}" ]]; then
    kill "${SERVER_PID}" >/dev/null 2>&1 || true
    wait "${SERVER_PID}" >/dev/null 2>&1 || true
  fi
  rm -rf "${TMP_DIR}"
}

trap cleanup EXIT

CONTACT_ALLOWED_ORIGINS="${BASE_URL}" \
THANKS_GATE_SECRET="test-thanks-secret" \
php -S "${HOST}:${PORT}" -t "${ROOT_DIR}/public" >"${TMP_DIR}/php-server.log" 2>&1 &
SERVER_PID="$!"

wait_for_server() {
  for _ in $(seq 1 50); do
    if curl -sS "${BASE_URL}/thanks-access.php" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.1
  done

  echo "PHP test server failed to start"
  cat "${TMP_DIR}/php-server.log"
  return 1
}

assert_status() {
  local expected="$1"
  shift
  local body_path="${TMP_DIR}/response.json"
  local status
  status="$(curl -sS -o "${body_path}" -w "%{http_code}" "$@")"
  if [[ "${status}" != "${expected}" ]]; then
    echo "Expected HTTP ${expected}, got ${status}"
    cat "${body_path}"
    return 1
  fi
}

assert_body_contains() {
  local expected="$1"
  local body_path="${TMP_DIR}/response.json"
  if ! grep -q "${expected}" "${body_path}"; then
    echo "Expected body to contain: ${expected}"
    cat "${body_path}"
    return 1
  fi
}

wait_for_server

# thanks-access: no cookie -> allowed false
assert_status "200" "${BASE_URL}/thanks-access.php"
assert_body_contains '"allowed":false'

# contact-submit: missing origin -> blocked
assert_status "403" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"source":"Test","pageUrl":"http://example.test","values":{"firstName":"","company":"","email":"","phone":"","message":"","website":""}}' \
  "${BASE_URL}/contact-submit.php"
assert_body_contains 'Origin is not allowed'

# contact-submit: csrf mismatch -> blocked
assert_status "403" \
  -X POST \
  -H "Origin: ${BASE_URL}" \
  -H "X-SD-CSRF: token-a" \
  -H "Content-Type: application/json" \
  --cookie "sd_csrf=token-b" \
  -d '{"source":"Test","pageUrl":"http://example.test","values":{"firstName":"","company":"","email":"","phone":"","message":"","website":""}}' \
  "${BASE_URL}/contact-submit.php"
assert_body_contains 'CSRF validation failed'

# contact-submit: valid security context, invalid payload -> validation error
assert_status "422" \
  -X POST \
  -H "Origin: ${BASE_URL}" \
  -H "X-SD-CSRF: token-ok" \
  -H "Content-Type: application/json" \
  --cookie "sd_csrf=token-ok" \
  -d '{"source":"Test","pageUrl":"http://example.test","values":{"firstName":"","company":"","email":"","phone":"","message":"","website":""}}' \
  "${BASE_URL}/contact-submit.php"
assert_body_contains 'Validation failed'

# honeypot branch should short-circuit successfully
assert_status "200" \
  -X POST \
  -H "Origin: ${BASE_URL}" \
  -H "X-SD-CSRF: token-hp" \
  -H "Content-Type: application/json" \
  --cookie "sd_csrf=token-hp" \
  -d '{"source":"Test","pageUrl":"http://example.test","values":{"firstName":"","company":"","email":"","phone":"","message":"","website":"bot-fill"}}' \
  "${BASE_URL}/contact-submit.php"
assert_body_contains '"ok":true'

echo "PHP endpoint smoke tests passed"
