# Recovery Playbook — keep main clean, keep reality deterministic

This repo is PR-only. If you see confusing Git messages, do **not** improvise. Use these known-safe moves.

---

## A) Local `main` is “ahead of origin/main” (local-only commits)

**Symptoms**
- `git status` shows: “Your branch is ahead of 'origin/main' by N commits.”
- You merged/pulled locally, but the real truth is already merged via PR.

**Goal**
- Make local `main` match `origin/main` exactly.

**Steps (safe if everything important is already merged to GitHub)**
```bash
git switch main
git fetch origin

# See what commits exist only locally (if any)
git log --oneline origin/main..HEAD

# Hard reset local main to remote main (wipes local-only commits)
git reset --hard origin/main

# Confirm aligned + clean
git status
git rev-parse HEAD
git rev-parse origin/main

# Sanity gate
npm run lint
npm run gate:quick
```

**Notes**
- `reset --hard` discards uncommitted work. If you have local work you care about, stash first:
```bash
git stash -u
```

---

## B) “error: unable to delete '<branch>': remote ref does not exist”

**What it means**
- GitHub already auto-deleted the remote branch after merge.
- Your delete command is trying to delete something already gone.
- This is not a credential failure. It is noise.

**Safe delete pattern**
```bash
# delete local branch (safe after merge)
git branch -d <branch> || true

# delete remote branch only if it still exists
git ls-remote --heads origin <branch> | grep -q . && git push origin --delete <branch> || true
```

---

## C) PR-only rule blocks pushing to main

**Symptom**
- `git push` to `main` is rejected because the repo requires PRs.

**Fix**
```bash
git switch -c <type/short-name>
git push -u origin <type/short-name>
```

---

## D) Quick “am I clean?” checklist

```bash
git status
git rev-parse --abbrev-ref HEAD
git rev-parse HEAD
git rev-parse origin/main
npm run gate:quick
```

- Clean working tree
- On intended branch
- `HEAD == origin/main` when you expect to be aligned
- Gate passes
