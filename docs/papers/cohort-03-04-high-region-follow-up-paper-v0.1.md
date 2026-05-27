# High-Region Hindi `/i/` Follow-Up Paper v0.1

Status: expanded draft  
Publication status: not published  
Scope: Cohort 03 Hindi `/i/` + Cohort 04 Hindi `/i/`

## Abstract

This follow-up paper examines Hindi `/i/` as a high-region pressure case in the ZË-RO vowel-bracket battery. Cohort 03 provides the primary traceable evidence lane. Cohort 04 refines the mechanism account by testing final-shape distribution under the same `V6→V7` bracket. Across Cohort 04, all eight runs remained `INTERMEDIATE`; open-final target and replication rows carried no diagnostic flags, while closed-final/reference/baseline/mixed rows preserved or repeated `BOUNDARY_UNCERTAIN_HIGH`. The combined evidence supports a cautious mechanism claim: Hindi `/i/` behavior in these packs is sensitive to token geometry, especially final-shape distribution. The evidence does not prove the full high-region model standalone.

## 1. Claim boundary

Allowed claim:

> Hindi `/i/` provides internally traceable high-region pressure evidence, and Cohort 04 strengthens the mechanism account by showing final-shape sensitivity.

Not allowed:

> Hindi `/i/` proves the high-region model.

Not allowed:

> Cohort 04 should be published alone.

Not allowed:

> Cohort 03/04 authorizes README, Zenodo, or LingBuzz updates.

## 2. Evidence sources

Primary checkpoint sources:

- `docs/papers/cohort-03-hi-i-evidence-checkpoint-index-v0.1.md`
- `docs/papers/cohort-04-hi-i-evidence-checkpoint-index-v0.1.md`
- `docs/papers/cohort-03-04-high-region-follow-up-section-v0.1.md`
- `docs/evals/cohort-03-04-high-region-mechanism-overview-v0.1.md`

## 3. Method summary

The evidence uses the `T5_INTERMEDIATE_V0_1` battery shape with `intermediate_triple` inputs.

The relevant tested bracket is:

- `V6→V7`

The relevant language/vowel target is:

- `languageHint: hi`
- `vowelUnderTest: i`

The paper does not treat the output as a broad statistical proof. It treats the outputs as traceable battery evidence under a fixed scoring framework.

## 4. Cohort 03 role

Cohort 03 is the primary high-region pressure lane.

Use it for:

- primary Hindi `/i/` evidence framing;
- traceable checkpoint provenance;
- high-region pressure interpretation;
- comparison against Cohort 04.

Do not treat Cohort 03 alone as proof.

## 5. Cohort 04 role

Cohort 04 is the refinement lane.

Use it for:

- final-shape distribution mechanism;
- replication-support framing;
- open-final versus closed-final comparison;
- token-geometry sensitivity.

Key pattern:

- all 8 runs: `INTERMEDIATE`;
- open-final target/replication rows: no diagnostic flags;
- closed-final/reference/baseline/mixed rows: `BOUNDARY_UNCERTAIN_HIGH`;
- task shape: `T5_INTERMEDIATE_V0_1 / intermediate_triple / hi / i / V6→V7`;
- bucket counts: `10/10/10`.

## 6. Evidence table

| Evidence lane | Role | Runs | Verdict pattern | Diagnostic pattern | Interpretation |
|---|---|---:|---|---|---|
| Cohort 03 Hindi `/i/` | Primary pressure lane | checkpoint-backed | high-region pressure evidence | checkpoint-specific | establishes the primary traceable lane |
| Cohort 04 open-final / closed-final pack | mechanism test | 4 | all `INTERMEDIATE` | open-final target clean; closed/baseline/mixed high-boundary pressure | supports final-shape sensitivity |
| Cohort 04 open-final replication pack | replication-support | 4 | all `INTERMEDIATE` | open-final rows clean; closed-final reference high-boundary pressure | repeats the mechanism direction |

## 7. Combined interpretation

Hindi `/i/` remains a pressure case. Cohort 04 suggests the pressure is not only about the bracket. It is also shaped by token geometry and final-shape distribution inside the tested packs.

This keeps the claim narrow, traceable, and falsifiable.

The claim is:

> Hindi `/i/` gives traceable high-region pressure evidence, and Cohort 04 sharpens the mechanism account by showing final-shape sensitivity.

The claim is not:

> Hindi `/i/` proves the high-region model.

## 8. Draft result paragraph

The Hindi `/i/` evidence lane was treated as a high-region pressure case rather than as a standalone confirmation case. Cohort 03 established the primary traceable lane. Cohort 04 then tested final-shape distribution under the same `V6→V7` bracket. Across eight Cohort 04 runs, all outputs remained `INTERMEDIATE`; open-final target and replication rows carried no diagnostic flags, while closed-final/reference/baseline/mixed rows preserved or repeated `BOUNDARY_UNCERTAIN_HIGH`. This pattern supports a cautious interpretation: Hindi `/i/` behavior in the tested packs is sensitive to token geometry, especially final-shape distribution.

## 9. Limitations

This draft does not claim:

- a general proof of the high-region model;
- a standalone Hindi `/i/` publication result;
- a cross-linguistic rule for final-shape distribution;
- readiness for README, Zenodo, or LingBuzz updates.

Cohort 03 and Cohort 04 are internally traceable, but public publication still requires a separate release chain.

## 10. Reproduction notes

Future reproduction material should point to:

- Cohort 03 checkpoint index;
- Coh should point to:

- Cohort 03 checkpoint index;
- Cohort 04 checkpoint index;
- ZIP hashes recorded inside each checkpoint;
- run IDs and bucket pointers recorded inside each checkpoint;
- result docs linked from each checkpoint.

No new reproduction archive is created by this draft.

## 11. Publication boundary

This file is an expanded draft paper.

Do not update README.

Do not create Zenodo archive.

Do not submit to LingBuzz.

Do not claim publication complete.

## 12. Next step

Next useful PR:

> Add a formal references/evidence appendix section for Cohort 03/04.

That future PR should still avoid public publication actions.
