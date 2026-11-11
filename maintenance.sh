#!/usr/bin/env bash

# Toggle the public maintenance screen, rebuild the app and restart systemd.
# Run from the repository root on the server:
#   ./maintenance.sh
# Optional service override:
#   SERVICE_NAME=init.energy ./maintenance.sh

set -Eeuo pipefail

readonly SERVICE_NAME="${SERVICE_NAME:-init.energy}"
readonly PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly STATUS_FILE="$PROJECT_DIR/src/config/site-status.ts"

fail() {
  printf 'Maintenance toggle failed: %s\n' "$1" >&2
  exit 1
}

command -v npm >/dev/null || fail "npm is not installed"
command -v systemctl >/dev/null || fail "systemctl is not available"
[[ -f "$STATUS_FILE" ]] || fail "site status file was not found"

cd "$PROJECT_DIR"

if grep -Fq "enabled: false," "$STATUS_FILE"; then
  sed -i "s/enabled: false,/enabled: true,/" "$STATUS_FILE"
  readonly STATE="enabled"
elif grep -Fq "enabled: true," "$STATUS_FILE"; then
  sed -i "s/enabled: true,/enabled: false,/" "$STATUS_FILE"
  readonly STATE="disabled"
else
  fail "could not determine the current maintenance state"
fi

printf 'Maintenance mode %s. Building production bundle...\n' "$STATE"
npm run build

printf 'Restarting %s...\n' "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl --no-pager --full status "$SERVICE_NAME"

printf 'Maintenance mode is now %s.\n' "$STATE"
