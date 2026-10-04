# Open Instrument — Comparison Export / Reproducibility v0.1

```text
CONTRACT_ID=OPEN_INSTRUMENT_COMPARISON_EXPORT_REPRODUCIBILITY_V0_1
VERSION=v0.1
STATUS=FROZEN_COMPARISON_ARTIFACT_CONTRACT_ONLY
```

## 1. Purpose

This contract freezes the smallest portable local artifact for preserving and
reopening exactly two already-established Open Instrument results and their
deterministic structural/authority comparison.

The authority chain is:

```text
existing single-result reproducible bundles
  -> existing deterministic comparison projection
  -> this comparison-artifact envelope
  -> future local export/import presentation
```

This contract preserves existing results. It does not create a new analysis,
semantic interpretation, linguistic authority, pronunciation authority, or
user-decision recommendation.

```text
REANALYSIS_ON_EXPORT=NO
REANALYSIS_ON_IMPORT=NO
PROVIDER_CALL_ON_EXPORT=NO
PROVIDER_CALL_ON_IMPORT=NO
NETWORK_REQUIRED_FOR_REPLAY=NO
SPELLING_FALLBACK=NO
SEMANTIC_REINTERPRETATION=NO
```

## 2. Existing authorities reused

The comparison artifact reuses, without changing, these frozen authorities:

```text
SINGLE_RESULT_BUNDLE_CONTRACT=open-instrument.reproducible-run-bundle.v0.1
SINGLE_RESULT_FINGERPRINT_ALGORITHM=sha256
SINGLE_RESULT_FINGERPRINT_CANONICALIZATION=stable-json-v0.1
SINGLE_RESULT_FINGERPRINT_INPUT=schemaVersion + input + result
SINGLE_RESULT_CREATED_AT_IDENTITY_EFFECT=EXCLUDED
COMPARISON_CONTRACT_ID=OPEN_INSTRUMENT_WORD_TO_WORD_STRUCTURAL_AND_AUTHORITY_COMPARISON_V0_1
COMPARISON_SCHEMA_VERSION=open-instrument.word-to-word-structural-authority-comparison.v0_1
COMPARISON_PROJECTION_AUTHORITY=compareTelemetryViewModelsV0_1
LEFT_RIGHT_IDENTITY_RULE=ORDERED_SIDE_LABEL_PLUS_EXISTING_RESULT_CONTEXT
NULL_STATE_AUTHORITY=EXISTING_COMPARISON_STATE_AND_REASON_VALUES
VARIANT_AUTHORITY=EXACT_VARIANT_ID_MATCH_ONLY
PROVENANCE_AUTHORITY=SOURCE_RESULT_BUNDLE_AND_COMPARISON_SCHEMA_METADATA
```

The existing single-result bundle remains the only source-result schema. This
contract composes two complete validated bundles; it does not define a second
single-result representation.

The existing stable JSON authority orders object keys recursively, preserves
array order, excludes prototype keys, and serializes with the repository's
`stable-json-v0.1` rule. The existing single-result parser remains responsible
for validating each embedded source bundle and its fingerprint.

## 3. Artifact identity and cardinality

The durable artifact is JSON with this exact conceptual identity:

```text
ARTIFACT_KIND=open-instrument.comparison-export-reproducibility
SCHEMA_VERSION=open-instrument.comparison-export-reproducibility.v0.1
EXACT_RESULT_COUNT=2
ORDERED_SIDES=LEFT,RIGHT
```

The allowed top-level fields are exactly:

```text
artifactKind
schemaVersion
comparisonContractId
left
right
sourceFingerprints
comparison
artifactFingerprint
```

`left` and `right` are complete validated
`open-instrument.reproducible-run-bundle.v0.1` values. No third result,
unordered collection, or implicit current result is allowed.

`LEFT` and `RIGHT` are presentation/comparison roles only. They do not mean
preferred, earlier, better, winner, source, target, cause, or effect. Export
and import preserve the order exactly. They must not sort by word, Voice path,
fingerprint, status, or timestamp.

The optional `createdAt` field inside a source bundle is provenance only. It is
not a comparison identity key and does not affect deterministic comparison
equality or the comparison-artifact fingerprint.

## 4. Source result representation

Each side is authoritative only after successful validation by the existing
single-result bundle authority:

```text
LEFT_SOURCE_RESULT=complete validated single-result reproducible bundle
RIGHT_SOURCE_RESULT=complete validated single-result reproducible bundle
SOURCE_RESULT_MUTATION=FORBIDDEN
```

The source bundles preserve the existing result fields, including input/result
context, engine version, pronunciation authority, canonical Voice path,
Heart/structural data, Gamma, ZC, evidence, candidates, functional status,
claim boundaries, and existing Null values where present. No field is
reinterpreted by this envelope.

The future implementation must recover each source result through the trusted
existing adapter path before deriving a comparison projection. It must not
rerun `/api/analyze-v1` or reconstruct a result from spelling.

## 5. Source fingerprints

The artifact copies the exact source fingerprints already embedded in `left`
and `right`:

```text
sourceFingerprints.left = left.fingerprint
sourceFingerprints.right = right.fingerprint
```

Both copied values must match their corresponding embedded bundle values
exactly, including algorithm and canonicalization. A mismatch rejects the
artifact. Fingerprint equality or difference is integrity/identity information
only; it is not semantic similarity or difference.

## 6. Stored comparison projection

`comparison` is exactly one existing
`ComparisonProjectionV0_1` value under the frozen comparison schema:

```text
comparison.schemaVersion=COMPARISON_SCHEMA_VERSION
comparison.left={ word: left.result.word }
comparison.right={ word: right.result.word }
comparison.rows=<existing ordered comparison rows>
comparison.claimBoundary=structural_authority_comparison_only
```

The projection preserves the existing comparison state vocabulary:

```text
VALUE
NULL
MISSING
EMPTY_VALID
UNSUPPORTED
NOT_APPLICABLE
```

and relation vocabulary:

```text
EQUAL
DIFFERENT
LEFT_ONLY
RIGHT_ONLY
BOTH_NULL
```

No new relation, score, confidence, ranking, similarity, distance, or winner
field is authorized.

## 7. Stored projection versus deterministic recomputation

The source bundles are the authoritative inputs. The stored `comparison`
projection is preserved for traceability and portable inspection, but it never
overrides deterministic recomputation.

On import, after both source bundles and their fingerprints are validated, the
future implementation must:

1. adapt the two validated source results through the existing trusted VM
   adapter;
2. invoke the existing deterministic comparison projection;
3. compare the recomputed projection with the stored `comparison` under the
   frozen comparison schema and stable serialization rule; and
4. accept the artifact only when they agree exactly.

Stored projection mismatch is fail-closed. A stale, edited, or otherwise
inconsistent stored projection must never become authority and must never be
silently replaced by recomputed rows.

```text
STORED_PROJECTION_AUTHORITATIVE=NO
RECOMPUTED_PROJECTION_AUTHORITATIVE=YES
STORED_PROJECTION_MUST_AGREE=YES
STORED_PROJECTION_MISMATCH=REJECT
```

## 8. Null, unavailable, and feature preservation

The artifact preserves each side's exact state and reason/reasonCode values.
It must not normalize away any of these distinctions:

```text
NULL != MISSING
EMPTY_VALID != NULL
UNSUPPORTED != MISSING
NOT_APPLICABLE != UNSUPPORTED
```

No import repair may manufacture a value. In particular:

```text
NO_SPELLING_FALLBACK=YES
NO_FAKE_GAMMA=YES
NO_FAKE_ZC=YES
NO_FAKE_FUNCTIONAL_EVIDENCE=YES
NO_SYNTHETIC_PROVENANCE=YES
```

Pronunciation Null, canonical-path Null, structural Null, functional Null,
and their existing reason values remain side-specific and independently
inspectable.

## 9. Variant preservation

The existing variant authority is preserved exactly:

```text
VARIANT_COMPARISON_RULE=EXACT_VARIANT_ID_MATCH_ONLY
VARIANT_ORDER_PRESERVED=YES
NO_VARIANT_WINNER_SELECTION=YES
NO_VARIANT_CROSS_PAIRING=YES
```

Variants must not be paired by array position, similarity, Voice path, or any
heuristic. Unmatched variant IDs remain `LEFT_ONLY` or `RIGHT_ONLY`, and
unresolvable variant structure remains Null/unavailable under the existing
comparison semantics.

## 10. Information and provenance preservation

The artifact must preserve or deterministically reproduce:

```text
LEFT_SOURCE_RESULT=YES
RIGHT_SOURCE_RESULT=YES
ORDERED_ROLES=YES
SOURCE_FINGERPRINTS=YES
PRONUNCIATION_AUTHORITY=YES
CANONICAL_VOICE_PATH_V=YES
SOURCE_CONSONANT_STRUCTURE_GAMMA=YES
ZC_P_I_S_D_A_R=YES
FUNCTIONAL_AND_CANDIDATE_STATUS=YES
EVIDENCE_AND_PROVENANCE=YES
VARIANT_ID_ORDER_AND_SOURCE_DATA=YES
NULL_STATES_AND_REASONS=YES
COMPARISON_ROWS=YES
COMPARISON_SCHEMA=YES
```

No UI state is part of the artifact meaning. The artifact must not serialize
expanded/collapsed panels, selected tabs, picker state, scroll position,
styling, browser state, local file paths, or download filenames.

## 11. Comparison-artifact fingerprint

The artifact fingerprint is:

```text
ALGORITHM=sha256
CANONICALIZATION=stable-json-v0.1
```

`artifactFingerprint.value` is computed over the canonical stable JSON of the
artifact body excluding `artifactFingerprint` itself:

```text
{
  artifactKind,
  schemaVersion,
  comparisonContractId,
  left=<validated left bundle with createdAt omitted>,
  right=<validated right bundle with createdAt omitted>,
  sourceFingerprints,
  comparison
}
```

The optional source-bundle `createdAt` values remain preserved in the stored
source bundles but are excluded from comparison-artifact identity, consistent
with the existing single-result fingerprint rule. Object-key order,
whitespace, download filename, local path, browser state, and UI state do not
affect the digest.

The artifact is rejected on fingerprint mismatch. Import must not silently
recompute and accept corrupted content.

## 12. Import validation order

The future importer must fail closed in this order:

1. parse JSON;
2. validate exact `artifactKind`;
3. validate supported `schemaVersion`;
4. validate exact top-level shape and exactly two sides;
5. validate the `left` source bundle through the existing single-result
   parser;
6. validate the `right` source bundle through the existing single-result
   parser;
7. validate copied source fingerprints against both embedded bundles;
8. validate `comparisonContractId` and comparison schema version;
9. validate the stored comparison projection shape;
10. validate the comparison-artifact fingerprint;
11. adapt the validated source results through the trusted VM path;
12. deterministically recompute the comparison;
13. require exact agreement with the stored projection; and
14. accept only the fully validated artifact.

The importer must reject malformed JSON, unknown/future schema versions,
unknown required-shape keys, missing sides, source-bundle failures, source
fingerprint mismatches, comparison schema mismatches, artifact fingerprint
mismatches, and stored-projection mismatches. It must not best-effort import
or silently downgrade a future schema.

Conceptual contract-level rejection categories are bounded to:

```text
MALFORMED_JSON
UNSUPPORTED_ARTIFACT_KIND
UNSUPPORTED_SCHEMA_VERSION
INVALID_ARTIFACT_SHAPE
INVALID_LEFT_SOURCE_BUNDLE
INVALID_RIGHT_SOURCE_BUNDLE
SOURCE_FINGERPRINT_MISMATCH
COMPARISON_SCHEMA_MISMATCH
ARTIFACT_FINGERPRINT_MISMATCH
STORED_PROJECTION_MISMATCH
```

These are artifact-validation outcomes, not new linguistic or semantic
authority codes.

## 13. Export semantics

Future export consumes two already-established ordered results and:

1. validates each existing source bundle;
2. preserves the source bundles and their fingerprints;
3. derives the comparison through the existing deterministic comparison
   authority;
4. serializes the artifact with stable-json-v0.1; and
5. computes the comparison-artifact SHA-256.

Export must not rerun analysis, contact providers or external evidence,
mutate source results, choose a variant, select a winner, or add semantic
interpretation.

## 14. Replay / reopen semantics

For v0.1, reopening means:

1. validate the local artifact;
2. recover the exact validated LEFT result;
3. recover the exact validated RIGHT result;
4. restore the ordered comparison roles;
5. deterministically derive the comparison projection;
6. verify agreement with the stored projection; and
7. render through the existing comparison semantics without reanalysis.

This contract does not authorize database history, cloud sync, accounts,
authentication, autosave, comparison search, or a comparison-history browser.

## 15. Claim boundary

The artifact preserves and reproduces an Open Instrument structural and
authority comparison between two established results. It does not establish:

```text
SEMANTIC_SIMILARITY=NO
HISTORICAL_RELATIONSHIP=NO
ETYMOLOGICAL_PRIORITY=NO
CAUSAL_RELATION=NO
PREFERRED_OR_WINNING_RESULT=NO
```

The existing comparison boundary remains:

> This comparison reports established structural, authority, status, and
> provenance differences. It does not assign semantic meaning, historical
> origin, or a winner.

## 16. Control cases

The future implementation must preserve these deterministic controls:

### STONE vs HOME

- ordered pair remains `STONE` LEFT and `HOME` RIGHT;
- V remains `EQUAL`, both `O -> U`;
- Γ remains `DIFFERENT`; and
- no semantic inference is emitted.

### MAKE vs NAME

- V remains `EQUAL`, both `E -> I`;
- Γ remains `DIFFERENT` in exact source order; and
- equal lossy ZC fields do not erase Γ differences.

### STUDY vs STONE

- evidence and status remain side-specific;
- reviewed evidence is not transferred; and
- no winner is selected.

### VALID vs PRONUNCIATION-NULL

- the valid side remains valid;
- the Null side preserves `PRONUNCIATION_NOT_FOUND`;
- no orthographic fallback is created; and
- unavailable relations remain explicit.

### LEFT/RIGHT reversal

`STONE/HOME` and `HOME/STONE` are distinct ordered artifacts. The artifact
must not canonicalize an unordered pair.

### Integrity controls

Corrupted fingerprints, unsupported schema versions, and stored projection
mismatches all reject the artifact.

## 17. Security and trust boundary

Imported JSON is untrusted input. Future validation must not execute embedded
code, trust arbitrary prototypes, interpret paths as executable resources,
fetch URLs, invoke providers, invoke network services, or accept unsupported
schema extensions as authority.

Validation must use the existing safe JSON parsing, exact-shape, stable
serialization, and fingerprint-validation patterns. This contract does not
authorize a general security redesign.

## 18. Explicitly out of scope

```text
CROSS_SESSION_DATABASE_HISTORY=NO
FIRESTORE_ACTIVATION=NO
CLOUD_SYNC=NO
ACCOUNTS_OR_AUTHENTICATION=NO
AUTOMATIC_AUTOSAVE=NO
COMPARISON_SEARCH=NO
COMPARISON_HISTORY_BROWSER=NO
MORE_THAN_TWO_RESULTS=NO
CANDIDATE_RANKING=NO
SIMILARITY_OR_DISTANCE=NO
WINNER_SELECTION=NO
SEMANTIC_COMPARISON=NO
SEMANTIC_TRANSFER=NO
ETYMOLOGICAL_OR_HISTORICAL_INFERENCE=NO
INDIVIDUAL_CONSONANT_MEANING=NO
NEW_VOICE_AUTHORITY=NO
NEW_GAMMA_AUTHORITY=NO
NEW_ZC_FORMULA=NO
NEW_PRONUNCIATION_AUTHORITY=NO
NEW_FUNCTIONAL_EVIDENCE=NO
NEW_RESEARCH=NO
PROVIDER_EXECUTION=NO
API_REDESIGN=NO
VM_SEMANTIC_REDESIGN=NO
COMPARISON_UI_REDESIGN=NO
```

## 19. Architecture and implementation boundary

The additive architecture is:

```text
existing single-result bundle authority
  + existing deterministic comparison authority
  + new comparison-artifact envelope
```

The future implementation must reuse the existing single-result schema,
comparison formula, relation semantics, stable serialization, and fingerprint
concept. It must not duplicate or alter those authorities.

```text
CONTRACT_FREEZE_DOES_NOT_IMPLEMENT_FEATURE=YES
IMPLEMENTATION_AUTHORIZED_BY_THIS_PR=NO
IMPLEMENTATION_REQUIRES_SEPARATE_POST_MERGE_LANE=YES
RUNTIME_CHANGED_BY_THIS_CONTRACT=NO
API_CHANGED_BY_THIS_CONTRACT=NO
VM_SEMANTICS_CHANGED_BY_THIS_CONTRACT=NO
PERSISTENCE_ADDED_BY_THIS_CONTRACT=NO
```

After this contract is merged, implementation requires a separate lane from
verified new `main`.

## 20. Freeze declaration

```text
CONTRACT_FROZEN=YES
CONTRACT_ONLY=YES
IMPLEMENTATION_STARTED=NO
IMPLEMENTATION_AUTHORIZED_BY_THIS_DOCUMENT=NO
MERGE_OF_IMPLEMENTATION_AUTHORIZED_BY_THIS_DOCUMENT=NO
```
