# High-Region Pressure Mechanisms Evidence Map v0.1

Status: internal evidence map  
Scope: documentation only  
Date recorded: 2026-05-25

## 1. Purpose

This document maps what evidence already exists and what is still missing before the high-region pressure mechanisms outline can become paper-ready.

It follows:

- `docs/papers/high-region-pressure-mechanisms-outline-v0.1.md`
- `docs/evals/cohort-03-04-high-region-mechanism-overview-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-mechanism-synthesis-v0.1.md`

This is not a paper.  
This is not publication-ready.  
This does not update README.  
This does not authorize Zenodo or LingBuzz publication.

## 2. Current internal claim boundary

Allowed internal claim:

> Cohort 03/04 isolated a repeatable final-shape pressure mechanism in Hindi `/i/`.

More specific internal reading:

> Open-final-heavy Hindi `/i/` buckets repeatedly reduced high-boundary stress, while closed-final-heavy buckets repeatedly preserved `BOUNDARY_UNCERTAIN_HIGH`.

Blocked claims:

- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim final-shape distribution is proven globally.
- Do not claim Cohort 03/04 is publication-ready.
- Do not publish this as public evidence.
- Do not update README with Cohort 03/04 claims.

## 3. Evidence already present

### 3.1 Cohort 03 pressure synthesis

Source:

- `docs/evals/cohort-03-hi-i-mechanism-synthesis-v0.1.md`

Role:

- Establishes Hindi `/i/` as a high-region pressure case.
- Shows length matching helped but did not fully resolve high-boundary stress.
- Blocks simple `V6-V7` support framing.

Status:

> Present internally.

### 3.2 Cohort 03/04 mechanism overview

Source:

- `docs/evals/cohort-03-04-high-region-mechanism-overview-v0.1.md`

Role:

- Connects Cohort 03 pressure with Cohort 04 final-shape results.
- Preserves the cautious combined mechanism reading.

Status:

> Present internally.

### 3.3 Cohort 04 final-shape comparison

Source:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-result-v0.1.md`

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-closed-final-v0.1.v0.1.zip`

SHA256:

- `9e6904f18f65a25a505ce92bd8e55bb57dcb95520e0d4322ebf28ea572a287ef`

Role:

- Open-final controlled lane reduced high-boundary pressure.
- Closed-final, mixed-final, and baseline lanes retained `BOUNDARY_UNCERTAIN_HIGH`.

Status:

> Present internally.

### 3.4 Cohort 04 open-final replication

Source:

- `docs/evals/cohort-04-hi-i-open-final-replication-result-v0.1.md`

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-replication-v0.1.v0.1.zip`

SHA256:

- `9cd4a2934ca3a1fedd5e50115d4e930813f495775b7acb4ae91a40933bf2a82a`

Role:

- Prior open-final reference repeated cleanly.
- Two independent open-final lanes returned `INTERMEDIATE` with no flags.
- Closed-final reference retained `BOUNDARY_UNCERTAIN_HIGH`.

Status:

> Present internally.

### 3.5 Cohort 04 mechanism synthesis

Source:

- `docs/evals/cohort-04-hi-i-open-final-mechanism-synthesis-v0.1.md`

Role:

- Synthesizes the final-shape comparison and replication packs.
- States that final shape is an active token-geometry mechanism variable.

Status:

> Present internally.

## 4. Evidence still missing before paper readiness

### 4.1 Cohort 03 evidence ZIP index

Needed:

- exact Cohort 03 Hindi `/i/` evidence ZIP names;
- SHA256 values;
- run IDs;
- source result docs;
- run-summary tables.

Status:

> Missing / incomplete.

### 4.2 Consolidated paper tables

Needed:

1. Cohort 03 pressure trajectory table.
2. Cohort 04 final-shape comparison table.
3. Cohort 04 open-final replication table.
4. Allowed claims versus blocked claims.
5. Remaining uncertainty table.

Status:

> Partially present, not paper-ready.

### 4.3 Figure plan

Needed:

1. high-boundary pressure diagram;
2. open-final versus closed-final comparison;
3. Cohort 03 to Cohort 04 mechanism-narrowing diagram.

Status:

> Missing.

### 4.4 Reproduction notes

Needed:

- exact `/evals` task settings;
- run order;
- export naming;
- inspection commands;
- expected ZIP file inventory.

Status:

> Partially present, not consolidated.

### 4.5 Extension decision

Needed decision:

- keep the future paper narrow as a Hindi `/i/` mechanism note;
- or add one cross-language comparison;
- or design a VoiceLab/acoustic bridge.

Status:

> Not decided.

## 5. Paper-readiness checklist

The high-region pressure mechanisms paper is not ready until:

- [ ] Cohort 03 evidence packs are identified and hashed.
- [ ] Cohort 04 evidence packs are verified and listed.
- [ ] All run IDs are listed.
- [ ] All verdict tables are consolidated.
- [ ] Token buckets are linked to curation docs.
- [ ] Claim boundaries are written in final form.
- [ ] Reproduction notes are assembled.
- [ ] Figure/table plan is completed.
- [ ] Cross-language/acoustic extension decision is made.
- [ ] Full paper draft is created in a separate PR.

## 6. Current decision

Current status:

> Internal evidence map only, not publication-ready.

Recommended next action:

> Stop eval work and assemble the missing Cohort 03 ZIP/checkpoint index before drafting a full paper.

## 7. Do not do yet

Do not:

- Do not publish to Zenodo;
- Do not publish to LingBuzz;
- Do not update README;
- Do not claim Cohort 03/04 is publication-ready;
- Do not add more Hindi `/i/` evals without a new design doc;
- Do not reopen TypeScript 6 migration inside this research lane.
