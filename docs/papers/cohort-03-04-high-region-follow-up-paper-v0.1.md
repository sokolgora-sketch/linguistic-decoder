# High-Region Hindi `/i/` Follow-Up Paper v0.1

Status: expanded draft  
Publication status: not published  
Scope: Cohort 03 Hindi `/i/` + Cohort 04 Hindi `/i/`

## Abstract

This draft examines Hindi `/i/` as a high-region pressure case in the ZË-RO vowel-bracket battery. Cohort 03 provides the primary traceable evidence lane. Cohort 04 tests a narrower mechanism: whether final-shape distribution changes the behavior of the same `V6→V7` bracket. Across Cohort 04, all eight runs remained `INTERMEDIATE`; open-final target and replication rows carried no diagnostic flags, while closed-final/reference/baseline/mixed rows preserved or repeated `BOUNDARY_UNCERTAIN_HIGH`. The combined evidence supports a cautious mechanism claim: Hindi `/i/` behavior in these packs is sensitive to token geometry, especially final-shape distribution. The evidence does not prove the full high-region model standalone.

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

The bucket geometry is balanced:

- `10/10/10` means 10 low-anchor tokens, 10 target-vowel tokens, and 10 high-anchor tokens.

Open-final and closed-final refer to token final-shape classes:

- open-final: a token form ending in a vowel sound/letter in the working romanized token set;
- closed-final: a token form ending in a consonant sound/letter in the working romanized token set.

Diagnostic wording:

- clean row: no diagnostic flags;
- high-boundary pressure: `BOUNDARY_UNCERTAIN_HIGH`, meaning the scored target position sits near the high boundary of the tested bracket.

The paper does not treat the output as broad statistical proof. It treats the outputs as traceable battery evidence under a fixed scoring framework.

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

- all 8 Cohort 04 runs: `INTERMEDIATE`;
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
- Cohort 04 checkpoint index;
- ZIP hashes recorded inside each checkpoint;
- run IDs and bucket pointers recorded inside each checkpoint;
- result docs linked from each checkpoint.

No new reproduction archive is created by this draft.

## 11. Evidence appendix draft

Minimum future appendix entries:

| Item | Required source |
|---|---|
| Cohort 03 checkpoint | `docs/papers/cohort-03-hi-i-evidence-checkpoint-index-v0.1.md` |
| Cohort 04 checkpoint | `docs/papers/cohort-04-hi-i-evidence-checkpoint-index-v0.1.md` |
| Shared mechanism overview | `docs/evals/cohort-03-04-high-region-mechanism-overview-v0.1.md` |
| Draft section source | `docs/papers/cohort-03-04-high-region-follow-up-section-v0.1.md` |

## 12. Publication boundary

This file is an expanded draft paper.

Do not update README.

Do not create Zenodo archive.

Do not submit to LingBuzz.

Do not claim publication complete.


## 13. Statistical falsification plan

The mechanism claim is not that Hindi `/i/` proves the high-region model.

The mechanism claim is narrower:

> The diagnostic flag pattern is associated with final-shape distribution in the tested Cohort 04 packs.

### 13.1 Null hypothesis

Null hypothesis:

> Diagnostic flag status is independent of final-shape label.

In this null, `BOUNDARY_UNCERTAIN_HIGH` should not cluster systematically on closed-final/reference/baseline/mixed rows more than expected by chance.

### 13.2 Observed pattern

Observed Cohort 04 simplified pattern:

| Final-shape class | Clean rows | Flagged rows |
|---|---:|---:|
| open-final-like | 4 | 0 |
| non-open / closed-like | 0 | 4 |

Observed test statistic:

`T = flag_rate(non_open) - flag_rate(open)`

Observed value:

`T = 4/4 - 0/4 = 1.0`

### 13.3 Exact permutation test

Permutation unit:

- run row.

Fixed quantities:

- 8 total rows;
- 4 flagged rows;
- 4 clean rows;
- 4 open-final-like labels;
- 4 non-open / closed-like labels.

Permutation procedure:

1. Hold the observed flag statuses fixed.
2. Shuffle the final-shape labels across the 8 rows.
3. Recompute `T = flag_rate(non_open) - flag_rate(open)`.
4. Repeat over all exact assignments, or use at least 10,000 random permutations if implemented by simulation.

Exact combinatoric count:

`C(8,4) = 70`

One-sided probability of all 4 flags landing in the 4 non-open rows by chance:

`1 / 70 ≈ 0.0143`

Two-sided extreme-separation probability:

`2 / 70 ≈ 0.0286`

### 13.4 Support condition

The mechanism claim is supported only if:

- the observed `T` remains at the extreme edge of the permutation distribution;
- the one-sided permutation probability remains small;
- row labels are not confounded by token length, morphology, source list, or loanword status.

### 13.5 Kill condition

The mechanism claim is killed or downgraded if:

- random label permutation often produces equal or stronger separation;
- bucket-level resampling loses the open-clean / closed-flagged split;
- the open-final and closed-final token sets differ mainly by length, morphology, word source, or loan status;
- an independent replication language with the same geometry fails to show any final-shape sensitivity.

This test does not prove the high-region model. It only tests whether the final-shape diagnostic pattern is stronger than label-randomized chance.


### 13.6 Exact permutation check result

A local exact permutation check was run after the falsification plan was added.

Observed simplified Cohort 04 pattern:

| Final-shape class | Clean rows | Flagged rows |
|---|---:|---:|
| open-final-like | 4 | 0 |
| non-open / closed-like | 0 | 4 |

Result:

| Quantity | Value |
|---|---:|
| Total rows | 8 |
| Flagged rows | 4 |
| Open-like labels | 4 |
| Non-open / closed-like labels | 4 |
| Exact assignments | 70 |
| Observed `T` | 1.0 |
| One-sided p-value | 0.014285714285714285 |
| Two-sided p-value | 0.02857142857142857 |

Interpretation:

> The observed flag separation is unlikely under row-label permutation, supporting an association between final-shape label and diagnostic flag status in the tested Cohort 04 rows.

Boundary:

> This supports the final-shape association under row-label permutation. It does not prove independence from token-level confounds such as length, morphology, word-source, loanword status, or bucket construction artifacts.

Next falsification step:

> The claim still needs either bucket-level resampling or an independent same-geometry replication, with Georgian currently selected as the first replication target.

## 14. Replication target

Recommended first replication language:

> Georgian.

Reason:

- Georgian orthography is comparatively transparent;
- the vowel inventory is simpler than Arabic’s written-vowel problem;
- consonant clusters make open/closed final contrasts available;
- it is independent enough from Hindi to test whether final-shape sensitivity is language-specific or mechanism-level.

Arabic is not the first pick because short vowels are often not written, making final-shape classification unstable unless fully vocalized controlled data is used.

Finnish is not the first pick because the orthography is clean but vowel harmony, suffix-heavy morphology, long vowels, and many open-final forms may create a separate morphology confound.

### 14.1 Georgian replication requirements

Use the same geometry:

- `T5_INTERMEDIATE_V0_1`;
- `intermediate_triple`;
- `V6→V7`;
- `10/10/10` buckets;
- target vowel selected before curation;
- open-final and closed-final labels fixed before scoring.

### 14.2 Georgian disqualifying conditions

Reject Georgian as the replication if:

- clean `10/10/10` buckets cannot be built;
- target tokens are dominated by one suffix or morphology class;
- open-final and closed-final buckets are not length-balanced;
- wordlist quality is dominated by names, loans, or transliteration artifacts;
- transliteration loses final-vowel information;
- closed-final rows and open-final rows come from different grammatical categories.

## 15. Publication boundary

This file remains an expanded draft paper.

Do not update README.

Do not create Zenodo archive.

Do not submit to LingBuzz.

Do not claim publication complete.

The next useful work is not more wording polish. It is either:

- implement the permutation falsification check; or
- design the Georgian replication pack.
