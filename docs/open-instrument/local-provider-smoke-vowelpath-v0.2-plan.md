# Open Instrument Local Provider Smoke vowelPath v0.2 Plan

Status: planning only.

This document plans the next Open Instrument local-provider smoke protocol step: requiring `vowelPath` presence in future v0.2 local smoke artifacts.

No artifacts are added by this document.

No tests are changed by this document.

No existing artifacts are rewritten by this document.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, and not a reason to change the default provider from `mock`.

---

## 1. Purpose

Open Instrument local-provider smoke now has a working archive path.

The next weakness is that the current accepted local smoke candidates can pass without providing `vowelPath`.

This plan defines a v0.2 local smoke direction where future artifacts must require `vowelPath.present=true`.

The goal is to improve local smoke quality without invalidating existing v0.1 artifacts.

---

## 2. Background

Recent Open Instrument local-provider work:

- PR #1140 recorded weak `qwen2.5:0.5b` local provider-pipe smoke.
- PR #1141 recorded cleaner `llama3.1:8b` single-word smoke.
- PR #1142 recorded five-word `llama3.1:8b` smoke.
- PR #1143 defined local-provider smoke archive design.
- PR #1144 archived the exact five-word `llama3.1:8b` smoke artifact.
- PR #1145 added the local-provider smoke archive guard.
- PR #1146 defined the ten-word local smoke set.
- PR #1147 archived the exact ten-word `llama3.1:8b` smoke artifact and result doc.

Current preferred local smoke model:

`llama3.1:8b`

Default provider remains:

`mock`

---

## 3. Current v0.1 limitation

The current v0.1 verifier behavior allows `PATH_MATCH` to pass when no `vowelPath` is provided.

The current archived local smoke artifacts record this honestly.

Observed archive state:

`candidateSummary.vowelPath.present=false`

This is present across the current five-word and ten-word local smoke artifacts.

That means the current local-provider path is proven as a provider/parser/verifier smoke path, but not yet as a full Seven-Voices path-quality smoke.

---

## 4. Why this is not a defect in old artifacts

The existing v0.1 artifacts should not be rewritten or treated as broken.

They were created under the v0.1 archive contract.

They correctly preserve:

- raw proposer text;
- candidate summaries;
- verifier summaries;
- `vowelPath.present`;
- claim boundaries.

The important point is that they expose the limitation instead of hiding it.

Therefore:

- PR #1144 remains valid as a five-word v0.1 local smoke artifact.
- PR #1147 remains valid as a ten-word v0.1 local smoke artifact.
- The archive history stays honest.

---

## 5. v0.2 target

Future local smoke v0.2 artifacts must require:

`candidateSummary.vowelPath.present === true`

That means future captures should not accept a candidate unless the local smoke output includes a non-empty `vowelPath`.

This is a protocol change for future artifacts, not a retroactive correction to prior v0.1 artifacts.

---

## 6. Compatibility policy

Compatibility rules for the v0.2 change:

- do not rewrite old artifacts;
- do not fail old v0.1 artifacts;
- add new v0.2 artifact naming instead;
- keep the current v0.1 archive guard valid for historical artifacts;
- add a separate v0.2 guard later.

The archive should evolve by version, not by mutating prior evidence.

---

## 7. Planned future artifact naming

Future v0.2 artifact naming should follow:

`YYYY-MM-DD-open-instrument-local-smoke-<provider>-<model-slug>-<word-set-slug>-v0.2.json`

Examples:

- `2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.2.json`
- `2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-ten-word-v0.2.json`

The exact date and word-set slug will depend on the capture.

---

## 8. Planned prompt strictness improvement

The next prompt/runbook change should force candidate output to include `vowelPath`.

Planned strictness rules:

- output must remain JSON-only;
- `vowelPath` must be present;
- `vowelPath` must not be empty;
- uppercase Seven-Voice symbols should be used where applicable;
- no silent omission of `vowelPath`.

This is intended to make local smoke artifacts structurally stronger, not to make them a proof of scientific validity.

---

## 9. Planned guard evolution

The current v0.1 guard remains valid for the existing v0.1 artifacts.

A separate v0.2 guard should later enforce:

`candidateSummary.vowelPath.present === true`

That guard should be version-aware so it only applies to v0.2 artifacts.

The guard should not retroactively reject the archived v0.1 artifacts.

---

## 10. Suggested next PRs

Recommended next PR sequence:

1. Prompt/runbook update for v0.2 local smoke.
2. v0.2 archive guard.
3. v0.2 five-word artifact capture.
4. v0.2 ten-word artifact capture only if the five-word v0.2 run is clean enough.

This keeps the protocol change small and reviewable.

---

## 11. Claim boundary

This plan is not scientific evidence.

It is not publication evidence.

It is not eval evidence.

It is not Cohort evidence.

It is not a reason to change the default provider from `mock`.

The doc only plans a future archive protocol improvement.

---

## 12. Completion definition

This planning doc is complete when:

- the v0.1 limitation is clearly stated;
- compatibility rules are preserved;
- future v0.2 artifact naming is specified;
- prompt strictness direction is spelled out;
- guard evolution is scoped;
- the claim boundary stays conservative.
