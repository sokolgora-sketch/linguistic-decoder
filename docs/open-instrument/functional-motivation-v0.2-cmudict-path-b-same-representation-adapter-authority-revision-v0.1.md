# OPEN INSTRUMENT / FUNCTIONAL MOTIVATION v0.2
# CMUDICT PATH B SAME_REPRESENTATION AUTHORITY REVISION v0.1

Status: proposed revision pending DF review. This artifact is an additive
authority decision record. It does not modify the frozen authorities, emit a
runtime `SAME_REPRESENTATION` result, implement a SAME adapter, or authorize
downstream Gate 2 behavior.

## 1. Decision summary

```text
REVISION_STATUS=PROPOSED_PENDING_DF_REVIEW
AUTHORITY_REVISION_CLASSIFICATION=B_SHARED_SOURCE_IDENTITY_ESTABLISHED_GATE2_STILL_BLOCKED
EXACT_SHARED_REPRESENTATION_AUTHORITY=ESTABLISHED_AT_LEVEL_A_ONLY
FUNCTIONAL_GATE2_SAME_AUTHORITY=NOT_ESTABLISHED
RUNTIME_SAME_REPRESENTATION_AUTHORIZED=NO
SAME_DOCTRINE_WEAKENING_AUTHORIZED=NO
EQUIVALENCE_CLASS_POLICY=FORBIDDEN_BY_THIS_CONTRACT
GATE2_SAME_REQUIRES_VOICE_RELATIONSHIP_AUTHORITY=NO
GATE3_VOICE_RELATIONSHIP_AUTHORITY=SEPARATE
VOICE_OUTPUT_EQUALITY_REQUIRED_FOR_SAME=NO
VOICE_OUTPUT_EQUALITY_SUFFICIENT_FOR_SAME=NO
FOUR_GATE_EXPERIMENT_REQUIRES_INDEPENDENT_GATE2_AND_GATE3_AUTHORITY=YES
```

The decision has two deliberately separate levels:

1. **Level A — raw source-pronunciation representation.** The independently
   constructed candidate and production instances satisfy the exact shared
   contract `open-instrument.cmudict-shared-source-pronunciation.v0_1` for the
   tested physical CMUdict record. The shared comparator proves exact equality
   of the declared shared evidence fields and returns the closed shared-evidence
   reason code.
2. **Level B — Functional Motivation candidate/production comparison.** Level A
   is only an upstream evidence representation. It does not identify the
   candidate-derived and production-spoken representations that Gate 2 would
   compare after role-specific parsing, normalization, applicable projection
   methodology/profile authority, and variant treatment. Gate 2 remains
   blocked.

Therefore:

```text
SOURCE_REPRESENTATION_IDENTITY_DOES_NOT_ESTABLISH_FUNCTIONAL_GATE2_IDENTITY=YES
```

## 2. Repository and protected checkpoint

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
WORKTREE=/private/tmp/open-instrument-prepush-workflow-health
BASE_BRANCH=main
BASE_SHA=964ce8cf8c0b8f76aa8f20fa7c8392b955434420
LOCAL_ORIGIN_MAIN=964ce8cf8c0b8f76aa8f20fa7c8392b955434420
LOCAL_DIVERGENCE=0/0
WORKTREE_BEFORE_BRANCH=CLEAN
REMOTE=https://github.com/sokolgora-sketch/linguistic-decoder.git
LIVE_PUBLISHED_MAIN=UNKNOWN_DNS_UNAVAILABLE
PROTECTED_S5_BRANCH=codex/s5-sanskrit-gloss-contract-resolution-v0-1
PROTECTED_S5_HEAD=6d5bf985f1ca2763b8d41f3d4fa0735d689a1c30
```

The active worktree and local checkpoint matched the required task preflight.
The protected S5 checkout remained separate and unchanged. A direct read-only
`git ls-remote` query could not resolve `github.com`; live published-main state
is therefore not asserted by this document.

## 3. Frozen authority lineage

The four pre-existing authority artifacts were independently hashed before this
revision:

| Artifact | SHA-256 |
| --- | --- |
| `functional-motivation-v0.2-same-representation-authority-v0.1.md` | `cf579fdf3c2b28798ee38a93ec0c6d2fe7f4ce29e37e8b02c1b1f58d347a19b1` |
| `functional-motivation-v0.2-cmudict-path-b-same-representation-adapter-authority-v0.1.md` | `b93366325db31b900c3216e01e2e764503d06fa80d4a2f1cf5610886a5102a6c` |
| `functional-motivation-v0.2-cmudict-path-b-representation-contract-alignment-authority-v0.1.md` | `754c1fd8d642b69b4675df978699b57172eadaa67b2907aebcb6f1a853a4932e` |
| `functional-motivation-v0.2-cmudict-path-b-shared-representation-evidence-exposure-authority-v0.1.md` | `1c2482e5b26a0e77c19b83b93737b495afc5d00f131bbd00a40573a6e471b84b` |

The lineage is:

- **PR #2185** established the shared SAME doctrine and exact-contract identity
  model. It explicitly rejected equality of Voice, pronunciation, source,
  Bridge, structural, semantic, functional, or historical outputs as a SAME
  proof (`functional-motivation-v0.2-same-representation-authority-v0.1.md:18-35,111-132`).
- **PR #2186** identified the Path B role-specific blockers: missing shared
  contract identity, normalization/parser/projection differences, incomplete
  provenance, and missing reproducibility at the comparison boundary
  (`functional-motivation-v0.2-cmudict-path-b-same-representation-adapter-authority-v0.1.md:83-114,147-156`).
- **PR #2187** ratified the narrow common boundary
  `RAW_ARPABET_PRONUNCIATION_RECORD`, before normalization, Voice, Gamma, ZC,
  Bridge compatibility, and SAME
  (`functional-motivation-v0.2-cmudict-path-b-representation-contract-alignment-authority-v0.1.md:82-108`).
- **PR #2188** authorized additive, lossless, deterministic shared-evidence
  exposure only. It explicitly denied SAME, Voice, Gate 1, Gate 4, Discovery,
  API, and UI authorization
  (`functional-motivation-v0.2-cmudict-path-b-shared-representation-evidence-exposure-authority-v0.1.md:481-500`).
- **PR #2189** implemented that exact exposure contract in
  `src/shared/openInstrument/cmudictSharedRepresentationEvidenceExposure.v0_1.ts`
  and tests it in
  `tests/openInstrument.cmudictSharedRepresentationEvidenceExposure.v0_1.spec.ts`.

No earlier blocker is retroactively erased. The blockers resolved by #2189 are
resolved only at the Level A shared evidence boundary.

## 4. Frozen source and implementation evidence

```text
CMUDICT_SOURCE_PATH=src/data/openInstrument/pronunciation/cmudict.dict
CMUDICT_SOURCE_BYTES=3618488
CMUDICT_SOURCE_SHA256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
CMUDICT_SOURCE_REVISION=74790861f652b15e4ac49015a90074ad62a27690
CMUDICT_SOURCE_NOTATION=ARPABET
CMUDICT_SOURCE_PROFILE=open-instrument.cmudict-arpabet-en-us.v0_1
REAL_RECORD_LINE=116395
REAL_RECORD_RAW_TOKENS=S T OW1 N
```

The implementation declares the shared contract identity and tags at
`src/shared/openInstrument/cmudictSharedRepresentationEvidenceExposure.v0_1.ts:20-37`.
The contract type and instance contain the exact scope, raw segmentation,
ordering, variant policy, annotation policy, provenance, and reproducibility
fields at `:129-187`.

The paired comparator's exact cross-side field list is defined at `:307-338`.
The candidate and production builders are independent exports at `:885-915`.
Serialization, fingerprints, and validation are exported at `:917-1065`.

The focused test independently builds both sides from physical record line
`116395`, then compares them as shared evidence:

- `tests/openInstrument.cmudictSharedRepresentationEvidenceExposure.v0_1.spec.ts:77-99`
- `tests/openInstrument.cmudictSharedRepresentationEvidenceExposure.v0_1.spec.ts:131-176`

The test also covers annotation ineligibility, malformed tokens, unknown
fields, accessors, cycles, tampered fingerprints, variant identity, provenance
mismatch, raw-token mismatch, deep immutability, and the absence of SAME output
(`tests/openInstrument.cmudictSharedRepresentationEvidenceExposure.v0_1.spec.ts:112-189,222-351`).

## 5. Level A — shared raw-source representation determination

### Level A contract

The implemented shared contract is:

```text
CONTRACT_ID=open-instrument.cmudict-shared-source-pronunciation.v0_1
CONTRACT_VERSION=v0.1
CONTRACT_REVISION=representation-contract-alignment-authority-v0.1
SCHEMA=open-instrument.cmudict-shared-source-pronunciation.v0_1
LANGUAGE_SCOPE=English
VARIETY_SCOPE=en-US
NOTATION=ARPABET
NORMALIZATION_IDENTITY=NOT_APPLICABLE_AT_SHARED_BOUNDARY
SEGMENTATION=ORDERED_RAW_ARPABET_TOKEN_SEQUENCE
ORDERING=SOURCE_LINE_ORDER_AND_VARIANT_ORDER
PROJECTION_METHODOLOGY=NONE_AT_SHARED_BOUNDARY
PROJECTION_PROFILE=NONE_AT_SHARED_BOUNDARY
VARIANT_POLICY=PRESERVE_PHYSICAL_RECORDS_AND_VARIANTS
AMBIGUITY_POLICY=PRESERVE_ANNOTATION_AND_MULTIPLICITY_FAIL_CLOSED
SOURCE_AUTHORITY=RATIFIED_CMUDICT_SOURCE_ARTIFACT
REPRODUCIBILITY=SHA-256_OVER_FIXED_CANONICAL_ARRAYS
```

These values are frozen in the runtime contract object at
`cmudictSharedRepresentationEvidenceExposure.v0_1.ts:227-256` and are
validated against exact own-key arrays at `:258-338` and `:960-1065`.
That validation claim is limited to the shared-instance fields and their
exact own-key arrays.  The contract-only policies above (normalization,
segmentation, ordering, projection, variant, and ambiguity) remain frozen
authority metadata; this document does not claim that the runtime validator
revalidates those policies as per-instance values or that a separate
contract-object validator exists.

### Level A dimension determination

| Dimension | Determination | Evidence and limitation |
| --- | --- | --- |
| Contract ID/version/revision | `RESOLVED_AT_SHARED_BOUNDARY` | Exact fields are present in both independently built instances. |
| Schema identity | `RESOLVED_AT_SHARED_BOUNDARY` | Candidate and production builders target the same frozen instance schema. |
| English/en-US scope | `RESOLVED_AT_SHARED_BOUNDARY` | Exact literal fields are validated. |
| ARPABET notation | `RESOLVED_AT_SHARED_BOUNDARY` | Exact literal field and frozen source profile. |
| Normalization | `NOT_APPLICABLE_AT_SHARED_BOUNDARY` | The shared object is intentionally before role-specific normalization. |
| Raw token segmentation | `RESOLVED_AT_SHARED_BOUNDARY` | Raw tokens are derived from each side's own raw source pronunciation. |
| Source ordering | `RESOLVED_AT_SHARED_BOUNDARY` | Source line and variant order are retained and compared. |
| Projection policy | `RESOLVED_AT_SHARED_BOUNDARY` | No downstream projection is claimed at this level. |
| Physical variant policy | `RESOLVED_AT_SHARED_BOUNDARY` | Physical records, duplicates, and variant identity are preserved. |
| Ambiguity/annotation | `RESOLVED_AT_SHARED_BOUNDARY` | Annotation is preserved; eligibility is explicit; malformed boundaries fail closed. |
| Source provenance | `RESOLVED_AT_SHARED_BOUNDARY` | Exactly derived artifact and record references are required and cross-side compared. |
| Independent construction | `RESOLVED_AT_SHARED_BOUNDARY` | Candidate and production builders consume separate role-specific inputs. |
| Instance authority | `RESOLVED_AT_SHARED_BOUNDARY` | Both alignment and evidence-exposure authority tags are required. |
| Input fingerprint | `RESOLVED_AT_SHARED_BOUNDARY` | Frozen physical evidence tuple is canonicalized and hashed. |
| Output fingerprint | `RESOLVED_AT_SHARED_BOUNDARY` | Canonical shared-instance array is hashed without self-reference. |
| Parser identity | `NOT_APPLICABLE_AT_SHARED_BOUNDARY` | The shared contract exposes source evidence, not role-specific parser identity. |
| Role-specific producer semantics | `NOT_APPLICABLE_AT_SHARED_BOUNDARY` | Candidate/production normalization and projection remain outside the object. |
| SAME runtime result | `STILL_BLOCKED` | The comparator returns `CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED`, not SAME. |

### Level A decision

```text
EXACT_SHARED_REPRESENTATION_AUTHORITY_ESTABLISHED
```

This means exact identity of two independently instantiated values under the
declared shared raw-source contract is established for the covered evidence
boundary. It does not mean that the runtime may emit `SAME_REPRESENTATION`.
The tested record's equal physical identity is evidence of the contract
comparison, not the definition of the contract itself: the builders derive and
validate the full declared field set independently before comparison.

## 6. Level B — Functional Motivation Gate 2 determination

The actual Functional Motivation representation relation is part of
`FunctionalMotivationCandidateCorrespondenceV0_2`:

- `functionalMotivationInterpretation.v0_2.ts:105-137` includes representation
  compatibility, candidate Voice status, Voice relationship, Gamma, ZC,
  operation IDs, and unresolved fields.
- `functionalMotivationInterpretation.v0_2.ts:400-414` requires
  `STRUCTURAL_MOTIVATION_CANDIDATE`, `SAME_REPRESENTATION`, an authorized Voice
  relationship, and Gate 4-shaped support.
- `functionalMotivationInterpretation.v0_2.ts:439-465` returns valid Null when
  the relation or evidence is not authorized.

The current generic builder does not consume the Level A shared object. It
assigns known representations to `CROSS_REPRESENTATION`, candidate-side
representation to `orthographic_profile_derived`, and Voice relation to
`NOT_COMPARABLE_ACROSS_REPRESENTATIONS` (`motivationEngineDiscovery.v0_1.ts:334-388`).
That current Voice value is a downstream Gate 3/runtime observation; it is not
a prerequisite for defining Gate 2 `SAME_REPRESENTATION`.
The downstream `structuralRelationAuthorizedV0_2` guard rejects only
`NOT_COMPARABLE_ACROSS_REPRESENTATIONS` among the Voice values; its other
checks can therefore admit an `UNKNOWN` or `NO_AUTHORIZED_VOICE_RELATION`
value. That guard does not establish Voice relationship authority or Gate 2
SAME authority.

The CMUdict-aware comparison authority explicitly defines a separate
preauthorization output and forbids reuse of the generic comparison shape:

- `functional-motivation-v0.2-cmudict-aware-comparison-authority-v0.1.md:185-229`
- `:243-280`

The same authority requires a future comparison input containing the transport
plus independently authorized, target-bound Gate 4 evidence. It explicitly
states that Bridge compatibility, Voice data, Gamma, ZC, and generic witness
evidence do not establish Gate 1, Gate 2, Gate 3, or Gate 4.

### Level B dimension determination

| Gate 2 requirement | Determination | Current evidence |
| --- | --- | --- |
| Candidate canonical representation instance | `PARTIALLY_RESOLVED` | Level A instance exists; candidate role-specific normalized/Voice representation remains outside it. |
| Production canonical representation instance | `PARTIALLY_RESOLVED` | Level A instance exists; production-spoken role-specific representation remains outside it. |
| Candidate normalization identity | `STILL_BLOCKED` | Not part of the shared object; candidate contract must be separately bound. |
| Production normalization identity | `STILL_BLOCKED` | Not part of the shared object; production contract must be separately bound. |
| Normalizer contract identity equality | `STILL_BLOCKED` | Equal outputs are not sufficient and no common downstream normalization contract is ratified. |
| Candidate parser authority | `STILL_BLOCKED` | Role-specific parser identity is intentionally outside Level A. |
| Production parser authority | `STILL_BLOCKED` | Role-specific parser identity is intentionally outside Level A. |
| Candidate projection methodology/profile authority | `STILL_BLOCKED` | The candidate-side applicable projection methodology/profile authority is not yet bound to the Gate 2 representation contract. |
| Production projection methodology/profile authority | `STILL_BLOCKED` | The production-side applicable projection methodology/profile authority is not yet bound to the Gate 2 representation contract. |
| Ordered nuclei/moving-nucleus treatment | `PARTIALLY_RESOLVED` | Raw physical token order is preserved; downstream role-specific nucleus alignment is not established. |
| Variant pairing | `PARTIALLY_RESOLVED` | Level A preserves physical pairing; downstream candidate/production ambiguity policy remains separate. |
| Role-specific provenance | `PARTIALLY_RESOLVED` | Source provenance is complete at Level A; downstream producer and projection provenance remain separate. |
| Representation-instance authority | `STILL_BLOCKED` | Evidence-exposure authority is not SAME authority. |
| Comparison-level authority | `STILL_BLOCKED` | No SAME adapter or Gate 2 comparison result exists. |
| Functional Motivation Gate 2 | `STILL_BLOCKED` | Current predicate cannot receive an authorized Path B SAME relation. |

### Level B decision

```text
SOURCE_REPRESENTATION_IDENTITY_DOES_NOT_ESTABLISH_FUNCTIONAL_GATE2_IDENTITY
PATH_B_GATE2_REPRESENTATION_LEVEL=DOWNSTREAM_ROLE_SPECIFIC_CANDIDATE_PRODUCTION_COMPARISON
PATH_B_GATE2_SAME_CURRENTLY_AUTHORIZED=NO
PATH_B_GATE2_SAME_EVIDENCE_SUFFICIENT=NO
```

The shared source contract is the correct evidence carrier and prerequisite,
but it is not the represented object currently consumed by the Functional
Motivation Gate 2 predicate.

## 7. Existing blocker reevaluation

| PR #2186 blocker | Current classification | Explanation | Smallest next seam |
| --- | --- | --- | --- |
| Missing candidate canonical representation identity | `RESOLVED_AT_SHARED_BOUNDARY` / `STILL_BLOCKED_FOR_GATE2` | Shared contract ID/schema now exists; candidate downstream identity does not. | Separate comparison input and downstream authority. |
| Candidate/production schema differences | `RESOLVED_AT_SHARED_BOUNDARY` / `STILL_BLOCKED_FOR_GATE2` | Both can instantiate the shared schema; role-specific schemas remain different. | Preserve both ledgers in a dedicated comparison type. |
| Distinct normalizer contracts | `NOT_APPLICABLE_AT_SHARED_BOUNDARY` / `STILL_BLOCKED` | Shared normalization is explicitly not applicable. | Ratify exact role-specific normalization relation before SAME. |
| Different parser authority | `NOT_APPLICABLE_AT_SHARED_BOUNDARY` / `STILL_BLOCKED` | Shared evidence validates source fields, not parser identity. | Carry and validate role-specific parser provenance in the next authority seam. |
| Projection-methodology differences | `NOT_APPLICABLE_AT_SHARED_BOUNDARY` / `STILL_BLOCKED` | Level A has no projection. | Establish candidate/production projection scope separately. |
| Variant and ambiguity differences | `RESOLVED_AT_SHARED_BOUNDARY` / `PARTIALLY_RESOLVED` | Physical variant and annotation policy is exact; downstream eligibility and pairing remain separate. | Preserve one ordered unit per physical variant in comparison. |
| Incomplete comparison provenance | `RESOLVED_AT_SHARED_BOUNDARY` / `STILL_BLOCKED_FOR_GATE2` | Shared artifact/record refs and fingerprints are complete; role-level comparison provenance is absent. | Dedicated comparison authority and output provenance. |
| Missing deterministic fingerprints | `RESOLVED_AT_SHARED_BOUNDARY` | Input/output fingerprints are implemented and tamper-validated. | Reuse as upstream evidence; do not call them SAME. |
| Missing SAME adapter authority | `STILL_BLOCKED` | #2189 explicitly does not authorize SAME and no adapter exists. | Use the already-ratified CMUdict-aware preauthorization seam as an optional evidence-transport step, or proceed to separately authorize the exact role-specific Gate 2 relation. |

No new source data is required for the Level A result. The unresolved Level B
items require deterministic contract/authority work and independent evidence,
not source acquisition. A substantive authority decision is still required for
the role-specific representation relation. Gate 3 Voice relationship
authority is a separate decision and is not required to define Gate 2 SAME.

## 8. Gate 2 decision fields

```text
PATH_B_SHARED_SOURCE_IDENTITY_STATUS=EXACT_SHARED_REPRESENTATION_AUTHORITY_ESTABLISHED
PATH_B_SHARED_SOURCE_IDENTITY_REASON=Candidate and production independently construct and validate the same exact raw-source contract instance shape; the paired comparator checks every declared cross-side field and returns only shared-evidence authorization.
PATH_B_GATE2_REPRESENTATION_LEVEL=DOWNSTREAM_ROLE_SPECIFIC_CANDIDATE_PRODUCTION_COMPARISON
PATH_B_GATE2_SAME_CURRENTLY_AUTHORIZED=NO
PATH_B_GATE2_SAME_EVIDENCE_SUFFICIENT=NO
PATH_B_SAME_ADAPTER_IMPLEMENTATION_READY=BLOCKED
REMAINING_GATE2_BLOCKERS=Role-specific normalization identity; parser authority; applicable candidate/production projection methodology/profile authority; downstream variant and ambiguity alignment; role-specific provenance; comparison-level authority.
GATE2_SAME_REQUIRES_VOICE_RELATIONSHIP_AUTHORITY=NO
GATE3_VOICE_RELATIONSHIP_AUTHORITY=SEPARATE_AND_NOT_REQUIRED_TO_DEFINE_GATE2_SAME
VOICE_OUTPUT_EQUALITY_REQUIRED_FOR_SAME=NO
VOICE_OUTPUT_EQUALITY_SUFFICIENT_FOR_SAME=NO
FOUR_GATE_EXPERIMENT_REQUIRES_INDEPENDENT_GATE2_AND_GATE3_AUTHORITY=YES
NEXT_MINIMAL_SEAM=CMUDICT_AWARE_COMPARISON_IMPLEMENTATION
```

The proposed comparison implementation is not a SAME adapter. Its existing
authority contract permits a separate preauthorization projector consuming the
frozen transport, while explicitly keeping Gate 1, Gate 2, Gate 3, and Gate 4
unresolved (`functional-motivation-v0.2-cmudict-aware-comparison-authority-v0.1.md:362-400`).
It is not a strict prerequisite for a future Path B SAME adapter: the SAME
adapter may consume independently authorized candidate and production
representation evidence directly, provided the exact contract identity,
applicable projection methodology/profile authority, provenance, variant and
ambiguity policy, and deterministic reproducibility requirements are satisfied.
The comparison projector remains an authorized, useful evidence-transport
option because it preserves the frozen Bridge ledger and exposes a bounded
preauthorization result without granting Gate 1, Gate 2, Gate 3, or Gate 4.

## 9. Proposed future seam, without runtime authorization

The already specified `CMUDICT_AWARE_COMPARISON_IMPLEMENTATION` lane is an
authorized, useful engineering option, not a strict prerequisite for a future
Path B SAME adapter. It should:

1. Consume one ordered Bridge transport unit.
2. Preserve candidate and production ledgers independently.
3. Validate the exact transport and comparison authority tags.
4. Preserve upstream Bridge status/reason separately from comparison status/reason.
5. Accept only the two typed, independently authorized Gate 4 evidence families.
6. Never create Gate 4 operation IDs, expansion chains, or proto roots.
7. Emit `PREAUTHORIZATION_READY`, `BLOCKED_BY_MISSING_AUTHORITY`, or `NULL`.
8. Preserve variants, duplicates, annotation status, provenance, and Null.
9. Never emit `SAME_REPRESENTATION`, an authorized Voice relationship, a generic
   structural candidate, a winner, or an aggregate.

The applicable future test matrix is already frozen at
`functional-motivation-v0.2-cmudict-aware-comparison-authority-v0.1.md:377-381`.
This revision does not define a second comparison API and does not authorize
its implementation. It remains the best immediate next lane only if DF wants
the bounded preauthorization/evidence-transport result first; otherwise the
actual remaining scientific Gate 2 lane is a separately authorized Path B SAME
representation adapter authority/implementation that proves the exact
representation-contract identity and applicable projection methodology/profile
authority. Neither option may emit SAME without that authority. Gate 3 Voice
relationship authority remains separate, and Voice output equality is neither
required nor sufficient for SAME.

## 10. Scientific firewalls

This proposed revision does not authorize:

- Runtime `SAME_REPRESENTATION` emission.
- A Path B SAME adapter implementation.
- Voice relationship authority.
- Gate 1 structural-candidate authority.
- Gate 4 structural-support authority.
- Functional interpretation or semantic claims.
- Historical, cognacy, borrowing, or cross-language claims.
- Discovery, API, or UI wiring.
- Positive-control or false-null execution.
- Provider/model execution or source acquisition.
- Winner selection, ranking, aggregation, or variant collapse.
- Any Voice, Gamma, ZC, Bridge, CMUdict, S5, Evals, or VoiceLab change.

The valid output for an unresolved downstream requirement remains blocked or
Null with an explicit reason. Equal raw-source evidence must not be promoted
through any implicit equivalence class.

Gate 2 exact representation identity and Gate 3 Voice relationship authority
remain separate independently authorized gates. The complete four-gate
experiment requires both gates, but Gate 3 is not a prerequisite for defining
Gate 2 `SAME_REPRESENTATION`; Voice output equality is neither required nor
sufficient for SAME.

## 11. Ratification state and next lane

```text
AUTHORITY_REVISION_RATIFICATION_STATUS=PENDING_DF_REVIEW
RUNTIME_AUTHORITY_TAG_ISSUED_BY_THIS_REVISION=NO
SAME_ADAPTER_AUTHORIZED_BY_THIS_REVISION=NO
NEXT_RECOMMENDED_LANE=CMUDICT_AWARE_COMPARISON_IMPLEMENTATION
NEXT_RECOMMENDED_LANE_REASON=The shared raw-source identity is established, while the earliest unsatisfied Gate 2 work is exact downstream representation-contract identity and applicable projection methodology/profile authority. CMUDICT_AWARE_COMPARISON_IMPLEMENTATION remains the best immediate engineering option only when DF wants its bounded evidence-transport/preauthorization result first; it is not a strict prerequisite for a future Path B SAME adapter and it grants no Gate 1, Gate 2, Gate 3, or Gate 4 authority.
NEXT_ACTION=AWAIT_DF_REVIEW
```

This document is an evidence-backed revision decision, not a ratification of
Gate 2. It must be reviewed by DF before any later authority or implementation
lane proceeds.

## 12. Scope record

```text
EXISTING_FROZEN_AUTHORITIES_MODIFIED=NO
CMUDICT_SOURCE_MODIFIED=NO
RUNTIME_CODE_MODIFIED=NO
SAME_RUNTIME_MODIFIED=NO
FUNCTIONAL_MOTIVATION_GATE_MODIFIED=NO
DISCOVERY_API_UI_MODIFIED=NO
VOICE_GAMMA_ZC_MODIFIED=NO
BRIDGE_TRANSPORT_MODIFIED=NO
S5_MODIFIED=NO
SOURCE_ACQUISITION=NO
PROVIDER_OR_MODEL_EXECUTION=NO
POSITIVE_CONTROL_EXECUTION=NO
LINEAR_MODIFIED=NO
DF_BRAIN_MODIFIED=NO
```
