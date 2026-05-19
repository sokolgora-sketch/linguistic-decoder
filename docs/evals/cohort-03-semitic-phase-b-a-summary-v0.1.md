# Cohort 03 Semitic Phase B `/a/` Mini-Summary v0.1

Status: SEMITIC PHASE B `/a/` MINI-SUMMARY RECORDED
Project: ZË-RO
Milestone: Cohort 03
Phase: Semitic Phase B
Cases: Arabic `/a/`, Hebrew `/a/`
Date recorded: 2026-05-19

This document summarizes the first Semitic Phase B `/a/` pair.

It compares only the recorded Arabic `/a/` and Hebrew `/a/` evidence packs.

It does not complete Semitic Phase B.
It does not complete Cohort 03.
It does not update README.
It does not publish anything.
It does not claim the full ZË-RO framework is proven.

## 1. Source documents

Design:

- `docs/evals/cohort-03-semitic-phase-b-design-v0.1.md`

Result records:

- `docs/evals/cohort-03-arabic-a-semitic-result-v0.1.md`
- `docs/evals/cohort-03-hebrew-a-semitic-result-v0.1.md`

## 2. Evidence packs

| Case | Series | Evidence pack SHA256 |
|---|---|---|
| Arabic `/a/` | `cohort03-ar-a-v1-v3-semitic-v0.1` | `90eb54f1d363b45aeee4c6a21c37165604863a53e39f4fbcd06a24e758a930a4` |
| Hebrew `/a/` | `cohort03-he-a-v1-v3-semitic-v0.1` | `b0f6eb0f2dff93482993e2b6de66588a785f4b55ff99c4106ebb4a19d469598c` |

## 3. Result summary

| Case | Candidate bracket | Control bracket | Candidate result | Control result | Summary classification |
|---|---|---|---|---|---|
| Arabic `/a/` | `V1-V3` | `V2-V3` | one `INTERMEDIATE` with `BOUNDARY_UNCERTAIN_LOW`; one `EXCEEDS_LOW` with `BOUNDARY_UNCERTAIN_LOW` | both `EXCEEDS_LOW`, no flags | weak / edge-stressed lower-open Semitic `V1-V3` directional support |
| Hebrew `/a/` | `V1-V3` | `V2-V3` | both `EXCEEDS_LOW`, no flags | both `EXCEEDS_LOW`, no flags | weak / unstable Hebrew `/a/` low-edge pressure; not support |

## 4. Arabic `/a/`

Arabic `/a/` is the stronger of the two Semitic `/a/` first-pass cases.

Recorded pattern:

- `V1-V3` candidate main: `INTERMEDIATE`, `BOUNDARY_UNCERTAIN_LOW`
- `V1-V3` candidate alt: `EXCEEDS_LOW`, `BOUNDARY_UNCERTAIN_LOW`
- `V2-V3` control main: `EXCEEDS_LOW`, no flags
- `V2-V3` control alt: `EXCEEDS_LOW`, no flags

Interpretation:

Arabic `/a/` shows `V1-V3` as cleaner than `V2-V3`, but not cleanly stable.

Use the classification:

- weak / edge-stressed lower-open Semitic `V1-V3` directional support.

Do not call Arabic `/a/` clean support.

## 5. Hebrew `/a/`

Hebrew `/a/` is weaker than Arabic `/a/`.

Recorded pattern:

- `V1-V3` candidate main: `EXCEEDS_LOW`, no flags
- `V1-V3` candidate alt: `EXCEEDS_LOW`, no flags
- `V2-V3` control main: `EXCEEDS_LOW`, no flags
- `V2-V3` control alt: `EXCEEDS_LOW`, no flags

Interpretation:

Hebrew `/a/` does not support the planned `V1-V3` lower-open Semitic bridge under this token pack.

The `V1-V3` candidates are less stressed than the `V2-V3` controls, but no candidate remained `INTERMEDIATE`.

Use the classification:

- weak / unstable Hebrew `/a/` low-edge pressure;
- not support.

## 6. Pair interpretation

The Semitic Phase B `/a/` pair is mixed and weak.

It does not give clean Semitic `/a/` support.

The useful reading is:

1. Arabic `/a/` gives weak directional evidence that `V1-V3` is cleaner than `V2-V3`.
2. Hebrew `/a/` fails to cleanly support `V1-V3`.
3. The pair suggests Semitic `/a/` is low-edge stressed under broad Latin transliteration token packs.
4. The result should be treated as first-pass pressure evidence, not family-level confirmation.

This is still useful because it prevents overclaiming before high-region `/i/` tests.

## 7. Research consequence

Arabic `/a/` and Hebrew `/a/` do not justify a public claim.

They do justify continuing Semitic Phase B cautiously.

Recommended next step:

- run Arabic `/i/` and Hebrew `/i/` in batch mode;
- inspect both evidence packs;
- repo-record the `/i/` pair and `/i/` mini-summary together in one PR unless one result is surprising enough to require immediate locking.

Reason:

- `/a/` is already weak / low-edge stressed;
- `/i/` is high-region sensitive;
- Finnish `/y/` already showed high-region pressure;
- Semitic `/i/` can test whether high-region pressure repeats in a different family domain.

## 8. New workflow decision

After this mini-summary, normal test execution should use batch mode.

Batch mode:

1. Run a planned pair or small block.
2. Export each evidence pack.
3. Inspect each pack.
4. Continue until the block is complete.
5. Create one PR containing:
   - result docs;
   - summary doc;
   - evidence pack hashes;
   - claim boundaries.

Do not create a separate repo PR after every single ordinary test.

Immediate repo-recording remains allowed when:

- a result is surprising or unstable;
- a public archive/publication is next;
- README would change;
- code changes are involved;
- a result must be locked before continuing.

## 9. Claim boundaries

Allowed:

- Arabic `/a/` has weak / edge-stressed lower-open `V1-V3` directional support.
- Hebrew `/a/` is weak / unstable low-edge pressure and does not support `V1-V3`.
- Semitic Phase B `/a/` first pass is mixed and weak.
- Semitic `/i/` can be run next in batch mode.

Blocked:

- Do not claim Semitic Phase B is complete.
- Do not claim Cohort 03 is complete.
- Do not claim Semitic `/a/` supports the framework.
- Do not claim Arabic and Hebrew both support `V1-V3`.
- Do not claim Hebrew `/a/` supports `V1-V3`.
- Do not publish or update README from this summary alone.
- Do not say the full ZË-RO framework is proven.
