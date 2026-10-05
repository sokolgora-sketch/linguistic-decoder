# Functional outcome normalization and adjudication contract v0.1

Status: `FROZEN_CONTRACT_ONLY`.

Contract ID: `OPEN_INSTRUMENT_FUNCTIONAL_OUTCOME_NORMALIZATION_ADJUDICATION_V0_1`.

This contract defines the source-only boundary needed after the frozen English
lexical-sense source authority. It does not run a population projection, create
a semantic slice, or authorize a manifestation experiment.

## 1. Authority chain and scope

The boundary is:

`English lexical source sense -> source-only functional outcome observation -> later separately authorized comparison`

The input is the frozen English Wiktionary -> Wiktextract -> Kaikki source
profile from #2090. Its external artifact remains identified by SHA-256
`9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195`.

The source contract remains source-only and retains no functional outcome
authority by itself. This contract adds a typed, reviewable envelope; it does
not promote a source gloss to functional truth.

No `V`, `Γ`, `ZC`, Level-3, Math7, manifestation result, candidate ranking,
target sense, provider output, historical origin, Albanian evidence, or spelling
shape may enter normalization.

## 2. Unit of analysis

The smallest unit is `SOURCE_RECORD_POS_SENSE`: one source JSONL record identity,
its POS, and one source sense identity. The source-record identity is an
opaque stable record ID with a positive source-record ordinal supplied by the
hash-bound source population. The sense ID and sense ordinal are preserved.

This is not a lexical-form-level winner. Multiple source records, POS records,
and senses remain separate observations. No primary sense is selected, senses
are not merged, and outcomes are not ranked.

## 3. Reused outcome vocabulary

The property IDs are exactly the existing doctrine functional-property IDs;
this contract adds no property labels. The allowed property outcomes are the
already frozen blind-validation terms:

`DIRECT_MATCH`, `CONTRADICTION`, `NO_MATCH`, `UNKNOWN`, `NOT_TESTABLE`.

The contract uses these IDs only as source-to-property observations. It does
not attach a Voice path, PrincipleRole, Chapter-4 principle, or causal meaning
to a source observation.

The normalization rule is `EXACT_CANONICAL_PROPERTY_TERM_ONLY`: no synonym
expansion, translation, embedding, model inference, metaphor, or evaluator
intuition. A source sense may preserve multiple property observations.

## 4. Input and output

The typed input contains only the admitted #2090 source fields plus the
hash-bound source-record identity needed to distinguish duplicate records:

`sourceProfileId`, `sourceArtifactSha256`, `sourceRecordId`,
`sourceRecordOrdinal`, `sourceForm`, `language`, `languageCode`, `pos`,
`senseId`, `senseOrdinal`, `glosses`, `tags`, `rawTags`, and `examples`.

The missing-source input contains only the frozen join key, source identity,
and `LEXICAL_SENSE_SOURCE_NOT_FOUND`.

The output envelope preserves the source unit, zero or more source-to-property
observations, deterministic reason codes, adjudication state, provenance
references, `user_decides`, and `noSingleWinner`. It distinguishes:

`claimBoundary: SOURCE_TO_OUTCOME_NORMALIZATION_ONLY`.

- `SOURCE_NOT_FOUND`;
- `SOURCE_PRESENT_OUTCOME_UNRESOLVED`;
- `SOURCE_PRESENT_OUTCOME_ADJUDICATED`.

`SOURCE_PRESENT_OUTCOME_UNRESOLVED` covers insufficient text, unsupported
source text, unresolved sense ambiguity, conflicting evidence, and missing
authorized information. It is a valid Null outcome.

## 5. Adjudication boundary

The deterministic layer preserves source identity, source order, source text,
and multiplicity. Human review, when separately performed, may adjudicate only
the source-to-property outcome using the exact frozen matching rule. Reviewers
must not inspect or use `V`, `Γ`, `ZC`, Level-3, Math7, manifestation results,
target-specific desired results, or provider output to choose a label.

Review states are `NOT_STARTED`, `PENDING`, `COMPLETE`, and `DISAGREEMENT`.
Disagreement fails closed; it is not averaged, majority-voted, or converted to
a winner. A reviewed observation is not production authority and remains
`user_decides` with `noSingleWinner=true`.

Existing target-bound review machinery is reused only as a pattern for review
status, human provenance, Null, and disagreement. Its target binding and
doctrine `voicePath` are deliberately not imported into this source-only
contract.

## 6. Firewalls

This contract does not authorize:

- functional causality or manifestation;
- consonant meaning;
- historical origin or etymology;
- target-sense binding;
- production/runtime/API/UI authority;
- IPA-to-Voice mapping;
- provider/model execution;
- source gloss promotion into candidate truth.

It is not a population runner and does not bundle the 3.3 GB source artifact.
No derived semantic slice is created here.

## 7. Freeze declaration

The source-only normalization boundary is frozen as a contract. A future
population projection lane must separately materialize source records, apply
the exact matching rule, preserve all units and provenance, and fail closed on
ambiguity or disagreement. That future lane may not change this contract,
choose a winner, or use structural predictors.
