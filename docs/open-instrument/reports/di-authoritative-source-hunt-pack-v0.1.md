# Open Instrument — DI Authoritative Source Hunt Pack v0.1

## Status
Repo-extracted source hunt pack.

## Purpose
This file gathers every DI-related source candidate and blocker anchor already present in the repo so the next step is evidence collection, not guessing.

## 1. current DI blocker

- current DI row is still indirect-source posture
- current DI row still carries explicit blocker review note
- checklist hard-fails before runtime promotion

## 2. source URLs already present in repo/tests

- https://doi.org/10.3765/plsa.v8i1.5501
- https://en.wiktionary.org/wiki/di#Albanian
- https://fjale.al/di
- https://iecor.clld.org/cognatesets/426

## 3. exact blocker phrases already present

- Wiktionary / DPEWA reference listing
- Direct DPEWA/FGJSH locator or archived authoritative dictionary snapshot is still required before production-live promotion.
- direct_authoritative_locator_or_archive
- entry_locator_finalized
- still required before production-live promotion

## 4. source-hunt decision rule

Use the first source that is truly authoritative enough to replace the current indirect posture.

Acceptable closure targets:
- direct authoritative dictionary locator
- authoritative archived dictionary snapshot

Not enough by itself:
- secondary reference listing
- bridge source that only points to authority

## 5. fill this once you verify a real authoritative source

- sourceTitle:
- sourceAuthorOrEditor:
- sourcePublisherOrHost:
- sourceDateOrVersion:
- sourceUrlOrArchiveRef:
- entryLocator:
- attestedForm:
- attestedGloss:
- attestedGrammarNote:
- sourceHashOrArchiveHash:
- replacement sourceNote:
- replacement reviewNote:

## 6. manual verification checklist

- [ ] host is authoritative, not indirect
- [ ] URL/archive is stable
- [ ] locator is exact
- [ ] attested form is exact
- [ ] attested gloss is exact
- [ ] new review note removes blocker wording honestly
- [ ] ready for DI row patch
- [ ] ready for DI blocker test sync

## 7. next move after this file is filled

1. patch DI source row
2. sync DI blocker tests
3. run focused proof
4. inspect whether DI becomes production-live eligible

## 8. current decision

- Accepted path: Option B
- DI must close on direct DPEWA capture, not FJALË alone
- No DI row patch before direct DPEWA capture is verified
