#!/usr/bin/env bash

# Deploy the current production branch from this repository directory.
# Optional overrides:
#   SERVICE_NAME=init.energy BRANCH=main ./deploy.sh

set -Eeuo pipefail

readonly SERVICE_NAME="${SERVICE_NAME:-init.energy}"
readonly BRANCH="${BRANCH:-main}"
readonly PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

fail() {
  printf 'Deploy failed: %s\n' "$1" >&2
  exit 1
}

command -v git >/dev/null || fail "git is not installed"
command -v npm >/dev/null || fail "npm is not installed"
command -v systemctl >/dev/null || fail "systemctl is not available"

cd "$PROJECT_DIR"

if ! git diff --quiet || ! git diff --cached --quiet; then
  fail "the working tree has local changes; commit or discard them before deploying"
fi

printf 'Updating %s...\n' "$BRANCH"
git switch "$BRANCH"
git pull --ff-only origin "$BRANCH"

printf 'Installing dependencies...\n'
npm ci

printf 'Building production bundle...\n'
npm run build

printf 'Restarting %s...\n' "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl --no-pager --full status "$SERVICE_NAME"

printf 'Deploy completed successfully.\n'
