# Cohort 05 Georgian `/i/` Final-Shape Replication Design v0.1

Status: design only  
Run status: not started  
Publication status: not published  
Language: Georgian  
Language hint: `ka`  
Target vowel: `/i/`  
Battery: `T5_INTERMEDIATE_V0_1`  
Input shape: `intermediate_triple`  
Bracket: `V6→V7`  
Bucket geometry: `10/10/10`

## 1. Purpose

This design defines the first independent replication test for the Cohort 03/04 Hindi `/i/` final-shape mechanism claim.

The Hindi paper currently supports a narrow association:

> final-shape label is associated with diagnostic flag status under row-label permutation.

This Georgian replication is designed to test whether that mechanism survives outside Hindi.

## 2. Why Georgian

Georgian is selected before curation because it gives a cleaner first falsification target than Arabic or Finnish.

Reasons:

- comparatively transparent orthography;
- stable written vowels;
- simpler written-vowel problem than Arabic;
- enough consonant-final material to test open-final versus closed-final contrast;
- independent enough from Hindi to challenge a Hindi-specific artifact explanation.

Arabic is deferred because unwritten short vowels can make final-shape labeling unstable unless fully vocalized controlled data is used.

Finnish is deferred because vowel harmony, suffix-heavy morphology, long vowels, and many open-final forms can create morphology confounds.

## 3. Fixed test contract

All planned runs must use:

- `taskId: T5_INTERMEDIATE_V0_1`
- `inputShape: intermediate_triple`
- `languageHint: ka`
- `vowelUnderTest: i`
- bracket: `V6→V7`
- bucket count: `10/10/10`
- buckets:
  - `anchor_low`: 10 tokens
  - `x_vowel`: 10 tokens
  - `anchor_high`: 10 tokens

No scorer, threshold, diagnostic, UI, or API change is allowed for this replication.

## 4. Final-shape variable

Final-shape is the experimental variable.

Definitions:

- open-final: token form ends in a vowel in the working romanized token set;
- closed-final: token form ends in a consonant in the working romanized token set.

The open/closed label must be assigned before scoring.

The label must not be changed after verdicts or flags are known.

## 5. Control requirement

To isolate final-shape distribution:

- anchors should be held stable across paired open-final and closed-final target runs where possible;
- target bucket final-shape distribution should be the main changed variable;
- open-final and closed-final target buckets should be length-balanced;
- source list and lexical class should be kept as similar as possible.

If anchors cannot be held stable, the design must record that as a limitation before any run is interpreted.

## 6. Planned run set

Planned first pack:

| runId | Purpose | Target bucket final-shape condition |
|---|---|---|
| `cohort05-ka-i-baseline-reference-r01` | baseline/reference | mixed or neutral |
| `cohort05-ka-i-open-final-target-r01` | open-final mechanism test | open-final target tokens |
| `cohort05-ka-i-closed-final-target-r01` | closed-final mechanism test | closed-final target tokens |
| `cohort05-ka-i-mixed-final-target-r01` | mixed comparison | mixed target tokens |

Planned replication pack, only if first pack is valid:

| runId | Purpose | Target bucket final-shape condition |
|---|---|---|
| `cohort05-ka-i-open-final-reference-r01` | open-final reference | open-final target tokens |
| `cohort05-ka-i-open-final-replication-a-r01` | open-final replication A | open-final target tokens |
| `cohort05-ka-i-open-final-replication-b-r01` | open-final replication B | open-final target tokens |
| `cohort05-ka-i-closed-final-reference-r01` | closed-final reference | closed-final target tokens |

## 7. Pre-run disqualifying conditions

Reject the Georgian replication before scoring if:

- clean `10/10/10` buckets cannot be built;
- target tokens are dominated by one suffix or morphology class;
- open-final and closed-final buckets are not length-balanced;
- wordlist quality is dominated by names, loans, or transliteration artifacts;
- transliteration loses final-vowel information;
- closed-final and open-final rows come from different grammatical categories;
- target `/i/` cannot be isolated consistently.

## 8. Support condition

The Hindi final-shape mechanism receives replication support only if Georgian shows a comparable directional pattern:

- open-final-like rows stay cleaner;
- closed-final or non-open rows show more high-boundary diagnostic pressure;
- the result is not explainable by obvious token-length or morphology imbalance.

## 9. Kill / downgrade condition

The mechanism claim is killed or downgraded if:

- Georgian shows no meaningful difference between open-final and closed-final conditions;
- flags cluster randomly with respect to final-shape labels;
- the effect reverses without a plausible phonological explanation;
- the apparent effect is better explained by token length, suffix class, source list, or transliteration artifact.

## 10. Publication boundary

This is a design document only.

Do not run scoring from this document alone.

Do not update README.

Do not create Zenodo archive.

Do not submit to LingBuzz.

Do not claim publication complete.

## 11. Next step

Next useful PR after this design:

> create Georgian token-curation instructions.

That next PR should still be curation-instructions only, not token JSON and not scored evidence.
