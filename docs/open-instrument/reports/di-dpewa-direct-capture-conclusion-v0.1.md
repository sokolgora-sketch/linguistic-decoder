# Open Instrument — DI DPEWA Direct Capture Conclusion v0.1

## Status
Direct DPEWA capture attempted. DI remains blocked.

## Purpose

This report closes the current DPEWA direct-capture inspection lane.

The goal was to verify whether the preferred DI authority path could be captured cleanly enough to support a DI source-row patch.

That did **not** succeed from the current environment.

---

## Result

The DPEWA target URL responded, but the fetched content did **not** expose the DI lemma data needed for source-row closure.

Observed result:

- HTML exists
- direct DI lemma content was not visible
- direct DPEWA signals for `di`, `dita`, `ditur`, and `to know` were absent
- raw page content reported:
  - `You don't have permission to access /dictionary/`

Therefore:

- direct DPEWA closure is **not currently verified**
- DI source-row patch is **not approved**
- DI blocker remains open

---

## What is still true

DI is still:

- semantically supported
- carrier-visible
- reviewed-runtime blocked

DA remains closed and unaffected.

---

## What this means

Option B was the chosen authority path:

- require direct DPEWA closure

But the current inspection proves that Option B is **not operationally capturable from this environment right now**.

So there is still no honest basis to:
- patch the DI row
- remove the blocker review note
- sync DI blocker tests toward promotion
- inspect runtime promotion as if metadata closure already happened

---

## Exact current blocker

The blocker is now more precise:

1. current DI row still uses indirect-source posture
2. current DI row still contains explicit blocker review note
3. chosen direct DPEWA closure path could not be verified from this environment
4. therefore checklist hard fail remains legitimate

---

## Available next decisions

### Decision A — keep Option B strict
Keep DI blocked until a manual or alternate verified DPEWA artifact is obtained outside this environment.

This is the strictest canon-safe choice.

### Decision B — explicitly switch to Option A
Accept `https://fjale.al/di` as authoritative enough for DI reviewed-source closure.

Only then would the next lane become:
- DI source-row patch
- DI blocker test sync
- focused proof
- follow-up promotion inspection

---

## Current recommendation

Remain honest and keep DI blocked.

Do **not** patch DI row from bridge metadata.
Do **not** pretend DPEWA closure was captured.
Do **not** reuse unrelated source identifiers.

If DI must move soon, then the only clean path is an explicit project decision to accept Option A.

---

## Next safe lane

Smallest safe lane from here:

**docs-only DI authority-decision closeout**

That lane should state one of:

- Option B remains blocked pending manual DPEWA artifact capture
- or Option A is now accepted and DI patch lane may start
