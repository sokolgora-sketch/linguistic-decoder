#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-list}"   # list | delete-redundant | tag-unique | tag-unique-and-delete
TAG_PREFIX="${2:-archive}"

# Branches we never touch
PROTECT_REGEX='^(main|master)$'

current_branch="$(git branch --show-current)"

# All local branches
mapfile -t branches < <(git for-each-ref refs/heads --format='%(refname:short)' | sort)

redundant=()
unique=()

for b in "${branches[@]}"; do
  [[ "$b" == "$current_branch" ]] && continue
  [[ "$b" =~ $PROTECT_REGEX ]] && continue

  # "+" lines are commits whose patch is NOT in main
  plus_count="$(git cherry -v main "$b" | grep -c '^+' || true)"

  if [[ "$plus_count" -eq 0 ]]; then
    redundant+=("$b")
  else
    unique+=("$b")
  fi
done

echo "REDUNDANT (all patches already in main): ${#redundant[@]}"
printf '  %s\n' "${redundant[@]:-}"

echo
echo "UNIQUE (has patches not in main): ${#unique[@]}"
printf '  %s\n' "${unique[@]:-}"

if [[ "$MODE" == "delete-redundant" ]]; then
  echo
  echo "Deleting redundant branches..."
  for b in "${redundant[@]}"; do
    git branch -D "$b"
  done
  echo "Done."
fi

if [[ "$MODE" == "tag-unique" || "$MODE" == "tag-unique-and-delete" ]]; then
  echo
  echo "Tagging unique branches..."
  for b in "${unique[@]}"; do
    sha="$(git rev-parse --short "$b")"
    tag="${TAG_PREFIX}--${b//\//--}--${sha}"
    git tag -a "$tag" "$b" -m "Archive: $b @ $sha"
    echo "  tagged $b -> $tag"
  done
  echo "Done tagging."
fi

if [[ "$MODE" == "tag-unique-and-delete" ]]; then
  echo
  echo "Deleting unique branches after tagging..."
  for b in "${unique[@]}"; do
    git branch -D "$b"
  done
  echo "Done."
fi
