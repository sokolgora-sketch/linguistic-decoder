# Open Instrument — DI Authoritative Artifact Intake Template v0.1

## Status
Option B selected. Direct DPEWA closure required before DI patch.

## Purpose

This file captures the strongest DI evidence currently verified.

It is **not yet a patch approval**.
It is a prefilled intake so the final DI lane stops guessing.

---

## 1. authoritative source identity

- sourceTitle: di
- sourceAuthorOrEditor: Demiraj, Bardhyl et al. (for DPEWA reference path); Wiktionary contributors for bridge metadata
- sourcePublisherOrHost: UNRESOLVED — choose one:
  - DPEWA. Digital Philological-Etymological Dictionary of Old Albanian
  - FJALË / Fjalor Shqip
- sourceDateOrVersion: 2021 for DPEWA reference path; 2006 for FGJSH further-reading path

## 2. authoritative source locator

- sourceUrlOrArchiveRef: UNRESOLVED — choose one:
  - https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=14150
  - https://fjale.al/di
- entryLocator: di

## 3. attested DI evidence

- attestedForm: di
- attestedGloss: to know
- attestedGrammarNote: aorist dita; participle ditur

## 4. source integrity

- sourceHashOrArchiveHash: UNRESOLVED — use one that matches the final chosen host, not DA DOI and not fake placeholder text

## 5. replacement posture text

### replacement sourceNote
- Reviewed citation candidate for Albanian di as a free operator meaning know / knowledge. Source host must be finalized on a direct authoritative artifact before production-live promotion is claimed.

### replacement reviewNote
- Prefilled from verified DI evidence. Final authoritative host decision is still required before removing the production-live blocker.

---

## 6. closure check

Mark each only when truly satisfied.

- [ ] host is authoritative, not indirect reference-listing posture (blocked until direct DPEWA capture is verified)
- [ ] URL/archive ref is stable
- [x] entry locator is exact enough at lemma level
- [x] attested form is exact
- [x] attested gloss is exact
- [ ] review note no longer says authoritative closure is still required
- [ ] data is ready for DI row patch
- [ ] data is ready for DI blocker test sync

---

## 7. verified evidence already in hand

### Verified from Wiktionary bridge metadata
- Albanian verb: di
- gloss: to know
- aorist: dita
- participle: ditur
- DPEWA reference exists for di
- FGJSH further-reading reference exists for di

### Verified from FJALË
- direct Albanian lexical entry page exists for di
- direct sense material is present on page

---

## 8. authority decision

Chosen path:

### Option B
Require direct DPEWA closure using:
`https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=14150`

Option A is intentionally not accepted for the DI row at this time.

---

## 9. hard rule

Do not patch DI row yet.
Do not sync DI blocker tests yet.
Do not touch checklist/runtime code yet.

Patch only after Option A or Option B is explicitly accepted.

---

## 10. next action

After choosing A or B:
1. patch DI source row
2. sync DI blocker tests
3. run focused proof
4. inspect whether DI becomes production-live eligible
