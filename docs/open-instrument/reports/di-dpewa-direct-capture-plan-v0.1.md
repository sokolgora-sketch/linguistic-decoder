# Open Instrument — DI DPEWA Direct Capture Plan v0.1

## Status
Next accepted DI lane.

## Purpose

This plan locks the next DI task after choosing Option B.

The goal is not to patch the DI row yet.
The goal is to verify and capture the direct DPEWA source artifact cleanly enough to support a later DI source-row patch.

---

## Chosen authority path

DI must close on direct DPEWA capture:

`https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=14150`

This is now the preferred authority path over FJALË-only closure.

---

## What still must be captured from DPEWA

- final source title as it appears on the direct host
- final author/editor attribution as it appears on the direct host or project metadata
- final publisher/host wording
- stable direct source URL
- exact entry locator wording
- attested DI form
- attested gloss
- attested grammar note if visible
- source hash/archive hash strategy
- honest replacement review note

---

## Hard rule

Do not patch the DI row yet.
Do not sync DI blocker tests yet.
Do not touch runtime promotion yet.

Patch only after the direct DPEWA artifact is captured and reviewed.

---

## Exact next implementation lane

### Lane name
DI direct DPEWA capture inspection v0.1

### Goal
Inspect and capture the direct DPEWA artifact fields needed for the later DI row patch.

### Output
- one inspect report
- one filled authoritative-source intake
- then one DI row patch lane
