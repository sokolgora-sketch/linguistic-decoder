#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-list}"  # list | delete

# Protected branch name patterns (do not delete even if merged)
PROTECT_REGEX='^(main|master|backup|backup/|safety|safety/|studio-sync|heart-v1-main)$'

current_branch="$(git branch --show-current)"

# Get merged branches (local), clean formatting, remove current branch marker
mapfile -t merged < <(git branch --merged main | sed 's/^[* ]*//' | sed '/^$/d')

candidates=()
for b in "${merged[@]}"; do
  [[ "$b" == "$current_branch" ]] && continue
  [[ "$b" =~ $PROTECT_REGEX ]] && continue
  candidates+=("$b")
done

if [[ "${#candidates[@]}" -eq 0 ]]; then
  echo "No merged branches eligible for deletion."
  exit 0
fi

echo "Merged branches eligible for deletion (${#candidates[@]}):"
printf '  %s\n' "${candidates[@]}"

if [[ "$MODE" == "delete" ]]; then
  echo
  echo "Deleting..."
  for b in "${candidates[@]}"; do
    git branch -d "$b"
  done
  echo "Done."
else
  echo
  echo "Dry run only. To delete: bash scripts/cleanup-merged-branches.sh delete"
fi
