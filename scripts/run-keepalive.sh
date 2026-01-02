#!/usr/bin/env bash
set -euo pipefail

echo "== cwd =="; pwd
echo

# Run whatever command(s) you pass to this script.
# Example: scripts/run-keepalive.sh npm run lint
echo "== running =="
printf '%q ' "$@"; echo
echo

# Run, but do NOT kill the terminal UX on failure; print exit code.
set +e
"$@"
code=$?
set -e

echo
echo "== exit code: $code =="
echo "DONE. Press Enter to close..."
read -r _
exit $code
