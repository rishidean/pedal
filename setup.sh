#!/usr/bin/env bash
# Prereq checks. The repo has no package manifest at `defined` — Booking S1 creates it —
# so this script verifies the environment and stops there.
set -euo pipefail

fail=0

if command -v node >/dev/null 2>&1; then
  major=$(node -v | sed 's/^v//' | cut -d. -f1)
  minor=$(node -v | sed 's/^v//' | cut -d. -f2)
  # Booking S1 installs Vite 7, which refuses to build below Node 20.19. Checking only the
  # major version lets Node 18 or early 20 pass here and then fail at the first build.
  if [ "$major" -lt 20 ] || { [ "$major" -eq 20 ] && [ "$minor" -lt 19 ]; }; then
    echo "✗ Node 20.19+ required (found $(node -v)); Vite 7 will not build below it."; fail=1
  else
    echo "✓ Node $(node -v)"
  fi
else
  echo "✗ Node not found (20.19+ required)"; fail=1
fi

command -v npm >/dev/null 2>&1 && echo "✓ npm $(npm -v)" || { echo "✗ npm not found"; fail=1; }

if command -v claude >/dev/null 2>&1; then
  echo "✓ claude CLI"
else
  echo "✗ claude CLI not found. Install Claude Code, then run 'claude' once to authenticate (or export ANTHROPIC_API_KEY)."
  fail=1
fi

echo "Installing Playwright Chromium (used by the QA gate from Booking S1 onward)..."
npx --yes playwright install chromium >/dev/null 2>&1 && echo "✓ Playwright Chromium" || echo "△ Playwright install deferred; the gate will install it on first E2E run."

[ "$fail" -eq 0 ] && echo "Ready. ./run.sh starts the loop." || { echo "Fix the items above, then re-run."; exit 1; }
