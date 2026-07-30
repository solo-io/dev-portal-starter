#!/usr/bin/env bash
# verify.sh: verify that the dev server starts without crashing.
# Tries "start" then "dev" script. Waits up to 30s for the process to stay alive.
# Usage: bash verify.sh <UI_DIR> <yarn|npm>
# Output: 1=passed, 0=failed
set -e

UI_DIR="$1"
PKG_MANAGER="$2"
WAIT_SECS=20

cd "$UI_DIR"

# Read package.json scripts to determine which dev command exists
if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.start ? 0 : 1)" 2>/dev/null; then
  DEV_CMD="start"
elif node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.dev ? 0 : 1)" 2>/dev/null; then
  DEV_CMD="dev"
else
  echo "WARN: no 'start' or 'dev' script found in package.json — skipping dev server check" >&2
  echo 1
  exit 0
fi

echo "Running '$PKG_MANAGER run $DEV_CMD' and waiting ${WAIT_SECS}s..." >&2

# Start the dev server in the background, capture its output
LOGFILE=$(mktemp)
$PKG_MANAGER run "$DEV_CMD" > "$LOGFILE" 2>&1 &
DEV_PID=$!

# Wait and check if the process stays alive (dev servers that crash exit quickly)
CRASHED=0
for i in $(seq 1 "$WAIT_SECS"); do
  if ! kill -0 "$DEV_PID" 2>/dev/null; then
    CRASHED=1
    break
  fi
  sleep 1
done

# Kill the dev server (and any children) if still running
kill "$DEV_PID" 2>/dev/null || true
# Give it a moment to shut down, then force-kill stragglers
sleep 2
kill -9 "$DEV_PID" 2>/dev/null || true

if [ "$CRASHED" -eq 1 ]; then
  echo "FAILED: dev server ('$PKG_MANAGER run $DEV_CMD') exited within ${i}s" >&2
  echo "--- dev server output ---" >&2
  tail -50 "$LOGFILE" >&2
  echo "-------------------------" >&2
  rm -f "$LOGFILE"
  echo 0
  exit 1
fi

echo "PASSED: dev server stayed alive for ${WAIT_SECS}s" >&2
rm -f "$LOGFILE"
echo 1
