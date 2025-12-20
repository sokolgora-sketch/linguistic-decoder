#!/usr/bin/env bash
set -euo pipefail

tag="${1:-}"
branch="${2:-}"

if [[ -z "$tag" || -z "$branch" ]]; then
  echo "Usage: bash scripts/restore-archived-branch.sh <tag> <new-branch-name>"
  echo
  echo "Example:"
  echo "  bash scripts/restore-archived-branch.sh archive-20251219-feature-word-matrix-ui-v2 feature/word-matrix-ui-v2"
  exit 1
fi

git rev-parse -q --verify "$tag" >/dev/null || {
  echo "Tag not found: $tag"
  echo "Try: git tag --list 'archive-*' | sort | tail -n 50"
  exit 1
}

echo "Creating branch '$branch' from tag '$tag'..."
git switch -c "$branch" "$tag"
echo "Done."
