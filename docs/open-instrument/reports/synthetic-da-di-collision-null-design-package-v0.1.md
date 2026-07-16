# Synthetic DA/DI Collision and Null Design Package v0.1

Status: `SYNTHETIC_COLLISION_NULL_DESIGN_ONLY`

Project: ZË-RO / Open Instrument
Date recorded: 2026-07-16
Base inspected: `bc87d9f49d8a0647ee0ed53d85dd6f565ccdf0c5`

Decision:

- `SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_CREATED`
- next: `SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_ACCEPTANCE_REVIEW`
- blocked action: `SYNTHETIC_DA_DI_COLLISION_NULL_RUNTIME_OR_BASELINE_IMPLEMENTATION`

## Purpose

This package records a bounded set of deterministic synthetic probes for future DA/DI collision and Null evaluation.

The probes are test instruments only.

They do not assert that a probe is:

- a natural-language word;
- a historical form;
- a lexical carrier;
- a functional embryo;
- semantically related to DA or DI;
- evidence for DA or DI;
- a candidate-truth statement.

Accidental resemblance to a real word does not create lexical, historical, functional, or semantic authority.

## Why synthetic probes are used

Repository word corpora did not provide a balanced set of fresh candidate-only, DA/DI collision-Null, and broad-Null controls.

Artificial boundary coverage must not be disguised as lexical evidence.

Therefore this design uses explicitly synthetic probes generated from:

- the locked surfaces `da` and `di`;
- bounded prefix, suffix, and wrapper operations;
- bounded one-edit substitution, insertion, and deletion;
- bounded consonant-vowel and consonant-vowel-consonant grids.

## Generation contract

Canonical surfaces:

- `da`
- `di`

Canonical operator IDs:

- `DA`
- `DI`

Canonical vowels:

- `A`
- `E`
- `I`
- `O`
- `U`
- `Y`
- `Ë`

Y posture:

- `Y_IS_A_CANONICAL_VOWEL`
- `NO_CONSONANTAL_Y_MODE`

Probe families:

- `embedded_prefix`
- `embedded_suffix`
- `embedded_wrapper`
- `one_edit_substitution`
- `one_edit_insertion`
- `one_edit_deletion`
- `broad_consonant_vowel`
- `broad_vowel_consonant`
- `broad_consonant_vowel_consonant`

Required exclusions:

- all current 19-case reuse-matrix inputs;
- all DA/DI positive proof words;
- all DA/DI negative control words.

Generated inspection count:

- `3952` probes

Inspection results:

- reviewed-evidence leaks: `0`
- discovery errors: `0`
- determinism failures: `0`

## Selected control set

## Embedded candidate-only probes

Selected count: `8`

| Probe | Family | Base operator | Derivation | Expected candidates | Reviewed evidence |
|---|---|---|---|---|---|
| `ada` | `embedded_prefix` | `DA` | `prefix:a+da` | `[DA]` | `absent` |
| `adi` | `embedded_prefix` | `DI` | `prefix:a+di` | `[DI]` | `absent` |
| `bda` | `embedded_prefix` | `DA` | `prefix:b+da` | `[DA]` | `absent` |
| `bdi` | `embedded_prefix` | `DI` | `prefix:b+di` | `[DI]` | `absent` |
| `cda` | `embedded_prefix` | `DA` | `prefix:c+da` | `[DA]` | `absent` |
| `cdi` | `embedded_prefix` | `DI` | `prefix:c+di` | `[DI]` | `absent` |
| `eda` | `embedded_prefix` | `DA` | `prefix:e+da` | `[DA]` | `absent` |
| `edi` | `embedded_prefix` | `DI` | `prefix:e+di` | `[DI]` | `absent` |
## Embedded exact-surface Null probes

Selected count: `0`

| Probe | Family | Base operator | Derivation | Expected candidates | Reviewed evidence |
|---|---|---|---|---|---|
| `none selected` | `none` | `none` | `none` | `[]` | `absent` |
## One-edit operation Null probes

Selected count: `8`

| Probe | Family | Base operator | Derivation | Expected candidates | Reviewed evidence |
|---|---|---|---|---|---|
| `a` | `one_edit_deletion` | `DA` | `delete:index=0` | `[]` | `absent` |
| `i` | `one_edit_deletion` | `DI` | `delete:index=0` | `[]` | `absent` |
| `d` | `one_edit_deletion` | `DA` | `delete:index=1` | `[]` | `absent` |
| `ai` | `one_edit_substitution` | `DI` | `substitute:index=0;value=a` | `[]` | `absent` |
| `aa` | `one_edit_substitution` | `DA` | `substitute:index=0;value=a` | `[]` | `absent` |
| `bi` | `one_edit_substitution` | `DI` | `substitute:index=0;value=b` | `[]` | `absent` |
| `ba` | `one_edit_substitution` | `DA` | `substitute:index=0;value=b` | `[]` | `absent` |
| `ci` | `one_edit_substitution` | `DI` | `substitute:index=0;value=c` | `[]` | `absent` |
## Broad synthetic Null probes

Selected count: `8`

| Probe | Family | Base operator | Derivation | Expected candidates | Reviewed evidence |
|---|---|---|---|---|---|
| `be` | `broad_consonant_vowel` | `none` | `broad-cv:b+e` | `[]` | `absent` |
| `ce` | `broad_consonant_vowel` | `none` | `broad-cv:c+e` | `[]` | `absent` |
| `fe` | `broad_consonant_vowel` | `none` | `broad-cv:f+e` | `[]` | `absent` |
| `ge` | `broad_consonant_vowel` | `none` | `broad-cv:g+e` | `[]` | `absent` |
| `he` | `broad_consonant_vowel` | `none` | `broad-cv:h+e` | `[]` | `absent` |
| `je` | `broad_consonant_vowel` | `none` | `broad-cv:j+e` | `[]` | `absent` |
| `ke` | `broad_consonant_vowel` | `none` | `broad-cv:k+e` | `[]` | `absent` |
| `le` | `broad_consonant_vowel` | `none` | `broad-cv:l+e` | `[]` | `absent` |


## Expected behavioral boundaries

### Embedded candidate-only probes

These probes may expose an unreviewed DA or DI structural candidate.

They must not receive reviewed evidence.

They must not become positive proof words.

They must not authorize runtime lexical projection.

### Embedded exact-surface Null probes

These probes contain an exact DA or DI surface but produce no canonical candidate under the inspected discovery contract.

Substring containment alone is insufficient.

### One-edit operation Null probes

These probes are one bounded edit from `da` or `di`.

Unsupported substitutions, insertions, or deletions must remain Null.

Edit distance is a test-generation mechanism, not an allowed evidence operation.

### Broad synthetic Null probes

These probes provide deterministic controls outside DA/DI reviewed scope.

Null is valid and expected when no canonical candidate is supported.

## Acceptance requirements for a future implementation review

A later implementation review must require all of the following:

1. the current 19-case matrix remains unchanged;
2. canonical DA and DI profiles remain unchanged;
3. no positive proof word is added;
4. no negative control word is added;
5. no runtime source row is added;
6. no runtime authorization is added;
7. no evidence operation is added;
8. no carrier form is added;
9. no API or UI branch is added;
10. every selected probe remains deterministic;
11. every selected probe has zero reviewed-evidence eligibility;
12. candidate-only expectations remain candidate-only;
13. Null expectations remain candidate-free;
14. Y remains a canonical vowel;
15. JO and PO remain frozen.

## Claim boundaries

Locked:

- `NO_LEXICAL_CLAIM`
- `NO_SEMANTIC_CLAIM`
- `NO_HISTORICAL_ORIGIN_CLAIM`
- `NO_HISTORICAL_TRANSMISSION_CLAIM`
- `NO_WINNER_CLAIM`
- `NO_LANGUAGE_SUPERIORITY_CLAIM`
- `NO_OWNERSHIP_CLAIM`
- `NO_CANDIDATE_TRUTH_CLAIM`
- `NO_PUBLICATION_EVIDENCE_CLAIM`
- `NO_SCIENTIFIC_EVIDENCE_CLAIM`
- `USER_DECIDES`

## Current repository boundaries

This design package does not modify:

- `src/shared/canonicalOperatorProfile.v0_1.ts`
- `src/shared/canonicalOperatorDiscovery.v0_1.ts`
- `src/shared/canonicalOperatorReuseMatrix.v0_1.ts`
- reviewed source-row registries;
- operation or carrier policy;
- DeepRoot runtime;
- analysis adapters;
- API routes;
- UI components;
- live-smoke cases.

Current state remains:

- DA: `canon_locked`
- DI: `canon_locked`
- JO: frozen
- PO: frozen
- reuse baseline: 19 cases and 12 categories

## Non-goals

This package does not:

- implement a synthetic corpus owner;
- extend the 19-case matrix;
- change discovery;
- change projection;
- authorize vocabulary;
- create lexical fixtures;
- claim arbitrary-vocabulary coverage;
- create runtime behavior;
- merge or promote any operator.

## Next

`SYNTHETIC_DA_DI_COLLISION_NULL_DESIGN_PACKAGE_ACCEPTANCE_REVIEW`
