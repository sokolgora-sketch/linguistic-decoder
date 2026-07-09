# Open Instrument — DA to DI Gap Matrix v0.1

## Status
Drafted for DA canon closeout.

## Purpose

This document compares **DA** and **DI** against the DA canon template so the next scaling lane is explicit and non-guessy.

The goal is not to promote DI here.
The goal is to show exactly what DA has that DI still lacks.

---

## Executive result

DA is the current reusable canon operator.

DI is **not** blocked because its meaning is weak.
DI is blocked because its **reviewed production-live evidence path is not closed**.

Current DI posture is:

- semantically supported
- carrier-visible in runtime
- reviewed-runtime blocked
- intentionally absent from production-live reviewed evidence projection

---

## Gap matrix

| Layer | DA | DI | Gap |
|---|---|---|---|
| Reviewed source row | Present | Present | No gap at metadata level |
| Review-note posture | Closed enough for runtime use | Explicitly says direct authoritative locator/archive still required | DI blocker remains open |
| Promotion checklist | Passes production-live path | Fails direct authoritative locator/archive requirement | DI cannot promote |
| Evidence validator | Runtime-safe | Not eligible for runtime reviewed projection | DI blocked before runtime |
| Runtime projection | Reviewed evidence projects | Reviewed evidence intentionally absent | DI not production-live |
| RootMap live visibility | Reviewed DA evidence visible | Ordinary DI carrier only | DI lacks reviewed runtime projection |
| Live smoke | DA positive proof words present | DI only negative/blocker assertions present | DI smoke is blocker posture only |
| Docs/runbook | DA now canon-documented | DI documented as blocked | DI still needs closure lane |
| Smallest next lane | closeout docs | authoritative locator/archive closure plan | DI needs source-closure-first lane |

---

## Exact DI blocker

DI still fails because the repo posture says:

- direct authoritative locator or archived authoritative dictionary snapshot is still required
- reviewed DI must remain outside production rows until that closure is explicit
- reviewed DI runtime projection must remain absent until then

This is why DI can appear as ordinary carrier evidence without being allowed to project reviewed runtime evidence.

---

## What DA already proves for future operators

DA already proves the reusable operator path:

1. reviewed source row
2. promotion checklist closure
3. validator-safe reviewed evidence
4. runtime projection
5. RootMap visibility
6. live smoke proof
7. docs/runbook obligations

---

## What DI still needs to match DA

DI still needs, at minimum:

1. direct authoritative locator or archived authoritative dictionary closure
2. promotion-checklist pass on that blocker
3. validator-eligible reviewed evidence posture
4. runtime projection enablement
5. RootMap reviewed-runtime visibility
6. live smoke expectation update
7. follow-up docs/runbook sync

---

## Smallest next safe lane

The smallest next safe DI lane is:

**inspect-first authoritative locator/archive closure lane**

Not a runtime patch.
Not a wording patch.
Not a promotion patch by itself.

The closure source must be explicit first.

---

## Decision

- DA remains the canon template
- DI remains intentionally reviewed-runtime blocked
- DA milestone closeout can proceed independently
- DI promotion work should start only after authoritative locator/archive closure is explicitly documented
