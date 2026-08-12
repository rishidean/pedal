#!/usr/bin/env bash
# PEDAL outer loop. Dumb on purpose: all the intelligence is in the files it reads.
set -euo pipefail

MAX_TURNS="${MAX_TURNS:-4}"

for turn in $(seq 1 "$MAX_TURNS"); do
  if grep -q '⛔' docs/Roadmap.md; then
    echo "run.sh: a sprint is blocked (⛔). A human steps in here. See PROGRESS.md."
    exit 1
  fi
  remaining=$(sed -n '/## Sprints/,/## Current Status/p' docs/Roadmap.md | grep -c '🔲' || true)
  if [ "$remaining" -eq 0 ]; then
    echo "run.sh: every Booking sprint is done. Open the app and take the ride."
    exit 0
  fi
  echo "── Turn $turn: $remaining sprint(s) remaining. Launching a fresh session."
  claude -p "$(cat prompt.md)"
done

echo "run.sh: reached MAX_TURNS=$MAX_TURNS. Check docs/Roadmap.md for state."
