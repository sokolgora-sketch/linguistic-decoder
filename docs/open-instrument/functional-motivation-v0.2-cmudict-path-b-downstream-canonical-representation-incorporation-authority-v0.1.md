# OPEN INSTRUMENT / ZË-RO
# CMUDICT PATH B DOWNSTREAM CANONICAL REPRESENTATION INCORPORATION AUTHORITY v0.1

Status: proposed; pending DF scientific review. This document does not
authorize runtime `SAME_REPRESENTATION`, Gate 2, Gate 3, a Bridge positive, or
any change to the existing candidate or production producer.

## 1. Decision summary

This lane selects a proposed layered downstream representation boundary:

1. one exact, ordered record for every retained frozen-CMUdict physical
   pronunciation record; and
2. one explicit aggregate-resolution ledger derived from those records.

The layers are one typed canonical contract, not an equivalence class. The
physical layer preserves multiplicity, duplicate records, source order, raw
ARPABET evidence, opaque annotations, and role-independent source identity.
The aggregate ledger records the independently defined lexical resolution
result without selecting a winner. Divergent paths, annotated records, failed
variant projections, absent pronunciation, and malformed evidence remain
typed Null outcomes with deterministic reason codes.

This is a proposed incorporation boundary, not an assertion that the current
candidate and production envelopes already instantiate it. The current
normalizer identities, parser identities, invocation modes, projection
envelopes, and role-specific provenance remain distinct. A future additive
adapter and validator must prove conformance independently for each producer.

```text
SCIENTIFIC_AUTHORITY_DECISION=PROPOSE_LAYERED_CANONICAL_DOWNSTREAM_CONTRACT_PENDING_DF_REVIEW
CANONICAL_REPRESENTATION_BOUNDARY_SELECTED=PER_PHYSICAL_VARIANT_EVIDENCE_PLUS_EXPLICIT_AGGREGATE_RESOLUTION_LEDGER
CANONICAL_REPRESENTATION_CONTRACT_ID=OPEN_INSTRUMENT_CMUDICT_PATH_B_DOWNSTREAM_CANONICAL_REPRESENTATION_V0_1
PROPOSED_CANONICAL_CONTRACT=YES
IMPLEMENTED_CANONICAL_CONTRACT=NO
VALIDATED_CANONICAL_CONTRACT=NO
AUTHORIZED_GATE2_SAME_PRODUCER=NO
CANONICAL_DOWNSTREAM_GATE2_CONTRACT_IDENTITY=NOT_ESTABLISHED
GATE2_SAME_AUTHORIZED=NO
FOUR_GATE_REACHABILITY_ESTABLISHED=NO
```

The selected boundary is the smallest one that can represent both facts that
are already present in evidence: production-spoken output has lexical
aggregate status, while candidate evidence is produced and retained per
physical variant. It does not replace the production aggregate with a
physical-record shortcut and does not force the candidate into its current
top-level status semantics.

## 2. Frozen doctrine and scope

The following remain unchanged:

```text
SAME_REPRESENTATION_IDENTITY_MODEL=A_EXACT_CONTRACT_IDENTITY
EQUIVALENCE_CLASS_POLICY=FORBIDDEN_BY_THIS_CONTRACT
LEVEL_A_SHARED_SOURCE_IDENTITY=ESTABLISHED
GATE3_VOICE_AUTHORITY=INDEPENDENT
VOICE_RELATIONSHIP_REQUIRED_TO_DEFINE_SAME=NO
VOICE_PATH_EQUALITY_REQUIRED_FOR_SAME=NO
GATE2_SAME_AUTHORIZED=NO
```

`SAME_REPRESENTATION_REQUIRES_OUTPUT_VALUE_EQUALITY=NO`. The canonical
comparison material is not lexical spelling alone, normalized string output
alone, a Voice path, a Gamma/ZC value, Bridge compatibility, or a common source
artifact. Representation identity is established by independent authorization
under the same exact contract, schema, scope, policy, provenance, and
reproducibility rules. A valid candidate and production instance may therefore
contain different source words, physical records, raw pronunciations,
normalized segments, nuclei, Voice paths, or serialized payloads when the
contract scope permits those differences; those differences are not by
themselves incompatibility. Conversely, equal payloads do not establish
contract identity without that authority. A bounded same-record parity control
may require exact value equality for the same frozen physical record or group,
but that is reproducibility evidence and is not the definition of Gate 2 SAME.
No semantic, functional, historical, etymological, or phonetic resemblance is
authority.

This document is limited to the CMUdict Path B downstream representation
boundary. It changes no frozen authority, runtime gate predicate, source data,
Voice/Gamma/ZC behavior, Bridge behavior, Discovery/API/UI, S5, Linear, or
DF_BRAIN.

## 3. Repository and evidence checkpoint

The inspected repository is `sokolgora-sketch/linguistic-decoder` at the
verified main checkpoint `7ced5e08f1f587ec56e12da2958ad20f750e6848`. The frozen
artifact is `src/data/openInstrument/pronunciation/cmudict.dict`, with the
verified identity used by the existing source contract: 3,618,488 bytes and
SHA-256 `81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22`.

The prior bounded audit reported 135,166 physical records, 126,052 base
forms, 8,447 multi-variant forms, and 22 annotated records. It reported
135,144/135,166 full per-variant projection parity, with the 22 mismatches
coinciding with annotation-bearing records; nuclei, Voice-path, and reason
code parity were each 135,166/135,166. Those are finite evidence results, not
an authority shortcut. The existing focused CMUdict suite passed 5 suites and
109 tests in the verified main checkout.

The frozen authority hashes verified at this checkpoint are recorded in the
task inspection and remain unchanged. No current implementation emits the
proposed canonical contract ID or a Gate 2 positive.

## 4. Existing representation objects and exact references

### 4.1 Level A shared physical evidence

The existing shared contract is explicitly before normalization, projection,
Bridge compatibility, role-specific ambiguity, and SAME. Its contract says
`NOT_APPLICABLE_AT_SHARED_BOUNDARY` for normalization, ordered raw ARPABET
tokens, source-line and variant ordering, preservation of physical variants,
and fail-closed annotation/multiplicity policy
(`src/shared/openInstrument/cmudictSharedRepresentationEvidenceExposure.v0_1.ts:129-186,227-256`).

The existing shared instance already contains source artifact identity,
physical locator, raw pronunciation, raw tokens, opaque annotation and
eligibility, provenance references, and SHA-256 reproducibility fields
(`src/shared/openInstrument/cmudictSharedRepresentationEvidenceExposure.v0_1.ts:154-186`). Its validator derives tokens from the annotation-free raw
pronunciation, derives variant and physical identity, validates provenance,
and validates input/output fingerprints
(`src/shared/openInstrument/cmudictSharedRepresentationEvidenceExposure.v0_1.ts:960-1074`).

This is the correct immutable source layer. It is not by itself the
downstream projection contract because its projection methodology and profile
are deliberately null.

### 4.2 Candidate evidence and projection

The candidate parser preserves source line, raw line, form/base form, variant
identity/order, raw pronunciation, ordered ARPABET tokens, stress views, and
opaque annotation (`src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts:117-136`). It separates an annotation after the exact `" # "` delimiter and
validates the raw pronunciation/token sequence
(`src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts:315-381`).

The candidate projection has its own schema, mapping identity, per-variant
segments, nuclei, Voice path, status, and reason code
(`src/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1.ts:30-82`). It
invokes the shared resolver once per physical variant
(`src/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1.ts:674-700`)
and reports top-level status from per-variant failure, not from an aggregate
same-path rule (`src/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1.ts:702-738`).

### 4.3 Production-spoken evidence and projection

The production prerequisite exposes `representationKind=production_spoken`,
its production normalizer and parser identities, physical evidence, ordered
production source units, normalized segments, nuclei, Voice path, aggregate
status, and annotation-contamination status
(`src/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1.ts:26-120`).
It invokes the existing production resolver and verifies physical-record
cardinality/order against the frozen index
(`src/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1.ts:469-505`).

The shared resolver returns aggregate Null for divergent canonical Voice paths
with `PRONUNCIATION_VARIANT_AMBIGUOUS`; it retains all normalized variants and
does not select a winner
(`src/shared/openInstrument/pronunciationToVoice.v0_1.ts:326-390`).

### 4.4 Existing Bridge boundary

The Bridge performs exact physical and projection-field pairing, but it is a
compatibility/evidence boundary, not SAME authority. It explicitly blocks
annotation contamination and unresolved aggregate variant policy
(`src/shared/openInstrument/cmudictCandidateProductionSpokenRepresentationBridge.v0_1.ts:526-625`). Its exact pair fields are useful conformance evidence but
must not be reused as a positive representation identity claim.

### 4.5 Normalization evidence

The existing validator retains the candidate and production normalizer
identities separately, validates the frozen source-form domain, compares each
role's output, and records equality as evidence only
(`src/shared/openInstrument/cmudictPathBDownstreamNormalizationConformanceValidator.v0_1.ts:30-105,537-615`). It does not rename the two algorithms, replace either
implementation, or emit Gate 2 authority.

## 5. Proposed canonical contract

The proposal remains pending DF review and future implementation validation.
It defines one exact object with two explicit layers. A producer must create
the object from its own evidence; copying a completed object from the other
role is forbidden.

### 5.1 Contract identity and scope

```text
contractId=OPEN_INSTRUMENT_CMUDICT_PATH_B_DOWNSTREAM_CANONICAL_REPRESENTATION_V0_1
contractVersion=v0.1
contractRevision=R0
schemaVersion=open-instrument.cmudict-path-b-downstream-canonical-representation.v0_1
languageScope=English
varietyScope=en-US
notation=ARPABET
sourceArtifact=src/data/openInstrument/pronunciation/cmudict.dict
documentReviewStatus=PROPOSED_PENDING_DF_REVIEW
runtimeImplementationStatus=NOT_IMPLEMENTED
gate2AuthorizationStatus=NOT_AUTHORIZED
```

`contractId`, `contractVersion`, and `contractRevision=R0` are the immutable
identity of this proposed contract revision. Review status, runtime
implementation status, and Gate 2 authorization are separate status fields and
must not be encoded into the contract identity. The contract is scoped to
physical records from the frozen CMUdict artifact. Group membership is derived
from the exact Level A `baseSourceForm` and physical record identity, not from
an open-ended set of strings that happen to normalize equally. Candidate and
production normalized lexical outputs are retained as role provenance and must
pass the already proposed bounded conformance validator; they are not silently
renamed as one algorithm.

The positive representation-instance authority applies only to
`canonicalResultKind=PHYSICAL_GROUP`. `ABSENT_PRONUNCIATION` is a typed Null
lookup-result envelope, not an empty physical group and not a positive
representation instance. A valid absence request must be in the reviewed
CMUdict source-form lookup domain, preserve the exact request form, retain both
role-specific normalization identities and outputs, verify the frozen artifact
identity and lookup-index identity, and prove zero matching physical records.
The domain is not broadened to arbitrary strings merely because a normalizer
accepts them. An invalid/out-of-domain request, malformed source, missing or
mismatched artifact, missing provenance, or unresolved lookup index is a
different typed Null reason and must not be relabeled `PRONUNCIATION_NOT_FOUND`.
No physical line, raw-source locator, variant, or fabricated record may be
created for absence.

### 5.2 Per-physical-variant layer

`variants` is a nonempty ordered array. Each element is one physical record,
including duplicate records, in source-line/variant-order order. Its exact
canonical fields are:

```text
contractId
contractVersion
contractRevision
schemaVersion
languageScope
varietyScope
notation
sourcePath
sourceRevision
sourceArtifactBytes
sourceArtifactSha256
physicalRecordId
sourceLineNumber
rawSourceLine
sourceForm
baseSourceForm
variantId
variantOrder
rawPronunciation
orderedRawArpabetTokens
opaqueAnnotationText
annotationEligibility
projectionMethodologyId
projectionProfileVersion
normalizedSegments
nuclei
canonicalVoicePath
projectionStatus
projectionReasonCode
```

The first source fields are the existing Level A fields. `rawPronunciation` and
`orderedRawArpabetTokens` exclude the opaque annotation exactly as the shared
contract requires; `opaqueAnnotationText` preserves it separately. An
annotation-bearing record is retained but has the exact canonical Null payload
`annotationEligibility=INELIGIBLE`, `normalizedSegments=[]`, `nuclei=[]`,
`canonicalVoicePath=null`, `projectionStatus=NULL`, and
`projectionReasonCode=CMUDICT_PATH_B_CANONICAL_ANNOTATION_INELIGIBLE`. Its
role-specific computed values remain evidence outside this exact canonical
comparison object; no producer may strip the annotation and claim that its
original parser output changed. A malformed annotation boundary instead uses
the existing `CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_EVIDENCE_MALFORMED`
reason and the higher-priority malformed-input rule in §5.3.

For an eligible record, projection input is exactly the ordered raw ARPABET
token sequence. The proposed methodology is the existing reviewed resolver
profile and mapping, not a new projection. The concrete identities are bound to
the exported values in `pronunciationToVoice.v0_1.ts:19,40-68` and the
candidate/production mapping declarations:

```text
projectionMethodologyId=pronunciation-to-voice.open-instrument.cmudict-arpabet-en-us.v0_1.v0_1
projectionProfileVersion=open-instrument.cmudict-arpabet-en-us.v0_1
mappingTable=CMUDICT_ARPABET_VOICE_PROFILE_V0_1
```

The actual exported constants and table remain the source of truth. A future
validator must check the literal identity and the ordered segments, nuclei,
path, status, and reason fields. Equal paths alone are not sufficient.

### 5.3 Aggregate-resolution layer

The top-level canonical result is a tagged union. It contains
`canonicalResultKind=PHYSICAL_GROUP` or `canonicalResultKind=ABSENT_PRONUNCIATION`,
and `lookupBaseSourceForm`. For `PHYSICAL_GROUP`, `variants` is the nonempty
array below and `aggregate` is attached to the same exact physical group. For
`ABSENT_PRONUNCIATION`, `variants=[]`, `aggregate=null`, and the exact
`absence` object is required:

```text
absence.reasonCode=PRONUNCIATION_NOT_FOUND
absence.lookupRequestForm
absence.candidateNormalizedLookupKey
absence.productionNormalizedLookupKey
absence.candidateNormalizerIdentity
absence.productionNormalizerIdentity
absence.sourceArtifactBytes
absence.sourceArtifactRevision
absence.sourceArtifactSha256
absence.lookupBaseSourceForm
absence.lookupIndexRevision
absence.lookupIndexFingerprint
absence.verifiedPhysicalMatchCount=0
absence.absenceInputFingerprint
absence.absenceOutputFingerprint
```

`absence.lookupRequestForm` is the exact validated caller form; the two
normalized lookup keys and their identities are evidence, not a permission to
silently trim, coerce, or merge the role-specific algorithms. The artifact and
lookup-index fields must be verified before a zero-match result is accepted.
No synthetic physical record or source-line fields may be created for the
absence variant. This is the typed Null representation of the
missing-pronunciation control; it is not an empty physical group. If any
required artifact, domain, provenance, or index evidence is missing or
unresolved, the validator emits the applicable invalid/provenance Null reason
instead of `PRONUNCIATION_NOT_FOUND`.

For `PHYSICAL_GROUP`, `aggregate` contains:

```text
groupBaseSourceForm
variantCount
retainedVariantPhysicalRecordIds
variantOrder
aggregateStatus
aggregateReasonCode
aggregateCanonicalVoicePath
```

The aggregate reason taxonomy and precedence are fixed for this proposal:

```text
CMUDICT_PATH_B_CANONICAL_INPUT_INVALID
CMUDICT_PATH_B_CANONICAL_PROVENANCE_INCOMPLETE
CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_EVIDENCE_MALFORMED
CMUDICT_PATH_B_CANONICAL_ANNOTATION_INELIGIBLE
CMUDICT_PATH_B_CANONICAL_VARIANT_PROJECTION_NULL
PRONUNCIATION_VARIANT_AMBIGUOUS
PRONUNCIATION_NOT_FOUND
```

The first matching condition in this order wins, and only that one code is
serialized in `aggregateReasonCode`; `aggregateReasonCode=null` is permitted
only for `DEFINED`. `CMUDICT_PATH_B_CANONICAL_INPUT_INVALID` covers empty or
reordered physical arrays, lost duplicates, cardinality mismatch, malformed
source/token evidence, and artifact identity mismatch. The absence variant is
handled before aggregate evaluation and uses only
`PRONUNCIATION_NOT_FOUND`. Incomplete provenance outranks annotation and
projection findings; malformed annotation outranks a valid annotation's
ineligibility; annotation ineligibility outranks per-variant projection Null;
projection Null outranks divergent defined paths. This precedence applies even
when several conditions coexist, so independently conforming producers cannot
choose different Null reasons for the same group.

The aggregate rule is deterministic and fail closed:

- `DEFINED` is allowed only when every retained variant is canonical,
  annotation-eligible, projection-defined, and has the same ordered Voice
  path. The path is then copied as the aggregate value; no variant is chosen.
- `NULL` with `PRONUNCIATION_VARIANT_AMBIGUOUS` is required when two eligible
  defined variants have different ordered Voice paths.
- `NULL` with an annotation, per-variant Null, malformed evidence, or
  incomplete provenance uses the first applicable code from the fixed
  precedence above.
- `PRONUNCIATION_NOT_FOUND` is represented only by the tagged absence variant;
  it is distinct from an unresolved multi-variant group and is not ambiguity.
- Empty, reordered, duplicated-without-source-evidence, or cardinality-
  inconsistent arrays fail closed and never become a positive result.

This ledger incorporates the production-spoken aggregate policy without
discarding per-variant evidence. It also provides a canonical aggregate view
for candidate evidence without changing the candidate producer's current
per-variant top-level status. A future adapter must derive the ledger from the
candidate's retained variants and must not read the production result to do
so.

### 5.4 Role provenance and reproducibility

The exact comparison material must contain the common fields above. Each
independent producer must additionally retain, outside the common equality
material but inside the validated evidence envelope:

```text
producerRole
producerIdentity
parserIdentity
normalizerIdentity
normalizerContractIdentity
projectionInvocationMode
sourceEvidenceFingerprint
fingerprintScope
canonicalInputFingerprint
canonicalOutputFingerprint
```

The candidate and production values for these role fields must remain
distinct and visible. Independent producer conformance validates each producer's
own complete object against this exact schema; it does not require arbitrary
candidate and production instances to have equal values. When the same frozen
physical record or group is deliberately paired as a reproducibility control,
the paired canonical fields may be required to match exactly. That parity
control is separate from contract identity and from Gate 2 authorization. The
role fields authenticate independent construction; they do not become an
equivalence class or a substitute for common contract identity.

The proposed serialization is fixed now rather than deferred to a future
implementation. The top-level canonical JSON object has exactly this key order:

```text
contractId
contractVersion
contractRevision
schemaVersion
languageScope
varietyScope
notation
sourcePath
sourceRevision
sourceArtifactBytes
sourceArtifactSha256
canonicalResultKind
lookupBaseSourceForm
variants
aggregate
absence
```

The per-variant, aggregate, and absence key orders are the field lists in
§5.2, §5.3, and the absence list above, respectively. The lists are closed:
all listed fields are required, typed Null uses the JSON `null` literal where
specified, arrays retain their declared order, and unknown or omitted fields
are rejected. Strings are serialized as the exact UTF-8 JSON strings supplied
by the contract; serialization performs no additional Unicode normalization.
RFC 8259 escaping and no insignificant whitespace are required; integer counts
use their decimal JSON form; object member order is the declared order. This is
a versioned canonical byte representation, not a semantic equivalence rule.

The fingerprint scopes are also fixed and are never interchangeable:

1. `fingerprintScope=PHYSICAL_VARIANT` sets
   `canonicalInputFingerprint` to SHA-256 over the ordered physical input
   fields: source artifact path/revision/bytes/SHA-256, physical record ID,
   source line number, raw source line, source/base form, variant ID/order, raw
   pronunciation, ordered raw tokens, and opaque annotation/eligibility. It
   does not use an aggregate or absence preimage.
2. `fingerprintScope=AGGREGATE_GROUP` sets
   `canonicalInputFingerprint` to SHA-256 over the ordered group form, retained
   physical-record IDs and variant order, each validated physical-variant input
   fingerprint, and the aggregate policy identity. It does not invent a
   physical locator.
3. `fingerprintScope=ABSENT_LOOKUP` sets
   `canonicalInputFingerprint` to SHA-256 over the exact validated lookup form,
   both normalization identities and outputs, frozen artifact identity,
   lookup-index revision/fingerprint, verified zero-match count, and the
   absence reason. It contains no physical line or raw-source locator.

`canonicalOutputFingerprint` is SHA-256 over the complete canonical object in
declared order after excluding all fingerprint fields and the role-specific
evidence envelope itself; it includes ordered variants, aggregate/absence
fields, typed Null values, and the selected reason code. All SHA-256 inputs are
the exact UTF-8 bytes of their specified serialization. There is no
self-reference. `sourceEvidenceFingerprint` remains the existing Level A
source-evidence fingerprint and must not be relabeled as any downstream
projection fingerprint. The proposal does not claim that this serialization or
fingerprinting is implemented or validated at runtime.

## 6. Conformance requirements and Null boundaries

### 6.1 Normalization

The candidate algorithm remains
`normalizeEnglishLexicalJoinKeyV0_1:NFC->en-US-lowercase->NFC:no-trim` and the
production algorithm remains
`normalizeCmuDictLexicalWordV0_1:NFC->trim->lowercase`. Their declarations and
runtime semantics remain distinct. The frozen artifact's verified source-form
domain currently permits bounded output conformance, but finite output
equality is not algorithm identity or contract identity.

The future canonical adapter must run the existing bounded conformance
validator over the exact Level A base form and retain both role identities and
outputs. It must fail closed for artifact/domain/variant-base/output/role/
provenance/authority errors. No trim, coercion, hidden Unicode normalization,
or input-domain expansion is permitted.

This validator establishes bounded producer conformance only after it verifies
the exact reviewed domain, frozen source identity, both normalized outputs, and
all required provenance. It does not establish downstream Gate 2
`SAME_REPRESENTATION` contract identity. A later Gate 2 authority must
independently decide whether this bounded conformance contract is incorporated
into one exact canonical downstream representation contract. Gate 3 Voice
relationship authority remains independent and is neither required to define
this contract nor supplied by it.

### 6.2 Parser and annotation

Candidate and production parser identities remain distinct. They may
independently conform because both expose enough physical source evidence to
construct the Level A instance, but conformance must validate raw-line,
source-form, variant, order, raw-pronunciation, token, and annotation fields
against the frozen artifact. A shared parser is not required and must not be
introduced merely to make identities appear equal.

The 22 annotation-bearing records are not dropped. They remain in the
physical layer, are marked ineligible for canonical projection comparison, and
cause the applicable aggregate Null. The existing role-specific projection
values for those records remain evidence outside the canonical object.

### 6.3 Projection

The existing resolver/profile identity is sufficient as a methodology
candidate, but current envelope and invocation identity is not yet proven
canonical. Candidate execution is per variant; production execution is
aggregate. The canonical adapter must first validate or derive the same
per-variant projection fields, then apply the explicit aggregate ledger rule.
It must not compare only Voice paths, and it must not treat the shared mapping
profile as proof of downstream identity.

### 6.4 Variants and ambiguity

Physical records are never collapsed. Variant order is source order plus the
existing variant order. Duplicates are retained. The aggregate ledger may
report one defined path only when every retained eligible variant has the same
path; this is a deterministic all-variants rule, not winner selection. A
divergent group remains Null with all variants retained.

## 7. Alternatives A-D

| Alternative | Classification | Determination |
| --- | --- | --- |
| A. Per-physical-record projection only | `BLOCKED_BY_CONTRACT_CONFLICT` | Exact physical records are supported by Level A evidence, but this alone is not the `production_spoken` lexical aggregate required by the production boundary. Treating it as the whole downstream contract would substitute an easier raw-record alignment for the required aggregate object. |
| B. Aggregate lexical-pronunciation object only | `BLOCKED_BY_MISSING_EVIDENCE` | The production aggregate rule exists, but the candidate current top-level status does not apply the divergent-path rule. An aggregate-only object would hide retained physical evidence, annotation eligibility, and per-variant Null reasons, or would require an unreviewed candidate aggregate authority. |
| C. Explicit layered canonical representation | `DEFENSIBLE_WITH_EXPLICIT_NEW_AUTHORITY` | The existing objects already expose the required physical evidence, per-variant projection fields, and production aggregate evidence. A fixed layered schema preserves all of them and adds only a future additive adapter/validator and canonical fingerprints. It does not alter either producer. **Selected.** |
| D. Not currently defensible | `NOT_SELECTED` | The evidence demonstrates a bounded, reviewable future contract seam rather than an actual incompatibility. Current implementation and validation are still insufficient, so this selection does not authorize the contract or Gate 2. |

Alternative C is not a wrapper that hides disagreement: its common material is
fixed and exact; its two layers have independent required fields and Null
rules; annotations and multiplicity remain visible; role-specific provenance
remains separate; and every field is compared exactly. It is therefore
compatible with the frozen SAME doctrine while preserving the current
producer semantics.

## 8. Required future implementation and validation

This authority proposal authorizes no runtime implementation by itself. After
DF review, the smallest implementation lane is one additive canonical
adapter/validator plus focused tests. It should:

1. independently construct the Level A physical instance for candidate and
   production;
2. validate bounded normalization conformance without changing either
   normalizer;
3. validate distinct parser provenance and exact physical-record fields;
4. construct per-variant canonical projection fields from each role's own
   evidence;
5. derive the aggregate ledger with the explicit fail-closed rule;
6. compute and validate canonical input/output fingerprints; and
7. validate each producer independently, and use exact same-record value parity
   only for explicitly paired reproducibility controls while retaining
   role-specific evidence and the first deterministic mismatch reason.

No shared parser, new normalizer, new projection methodology, annotation
stripping, source-data change, winner selection, equivalence class, Bridge
authority broadening, or SAME emission is required or authorized.

Required future controls include:

- a single defined variant such as `stone`;
- a divergent multi-variant form such as `read`, which must remain aggregate
  Null with both variants retained;
- a same-path multi-variant form such as `mormonism`;
- an annotated record such as `aalborg`, which must remain physically present
  and canonical-projection-ineligible;
- missing pronunciation, malformed source, artifact mismatch, reordered
  variants, duplicate loss, normalization mismatch, and per-variant Null;
- a changed source artifact and changed parser/normalizer/profile identity;
- fingerprint tampering and unknown-field rejection.

The control suite must test exact field equality, not only equal Voice output.
Successful future conformance remains evidence for a later Gate 2 authority
review. It is not a Gate 2 positive control.

## 9. Current status and remaining blockers

```text
NORMALIZATION_INCORPORATION_STATUS=CONDITIONALLY_RESOLVABLE_BY_AUTHORIZED_BOUNDED_CONFORMANCE
PARSER_INCORPORATION_STATUS=CONDITIONALLY_RESOLVABLE_BY_INDEPENDENT_SHARED-EVIDENCE_CONFORMANCE
PROJECTION_INCORPORATION_STATUS=PROFILE_IDENTITY_ESTABLISHED_ENVELOPE_AND_INVOCATION_CONFORMANCE_PENDING
VARIANT_AMBIGUITY_INCORPORATION_STATUS=EXPLICIT_LAYERED_POLICY_REQUIRED_PHYSICAL_VARIANTS_PRESERVED_AGGREGATE_FAIL_CLOSED
ANNOTATION_INCORPORATION_STATUS=OPAQUE_PRESERVED_CANONICAL_PROJECTION_INELIGIBLE
DOWNSTREAM_PROVENANCE_STATUS=PARTIAL_ADDITIVE_CANONICAL_ENVELOPE_AND_FINGERPRINTS_REQUIRED
EXISTING_PROVENANCE_ALREADY_SUFFICIENT=PARTIAL
NEW_EVIDENCE_IMPLEMENTATION_REQUIRED=YES
```

Remaining scientific blockers are:

- DF review and ratification of this proposed contract and exact field
  serialization;
- additive independent construction and validation by both producers;
- explicit comparison-level contract/schema/revision and fingerprints;
- exact validated absence lookup-domain, artifact/index, and typed-Null
  evidence, without fabricating a physical source locator;
- proof that role-specific parser and normalizer provenance satisfies the
  proposed canonical adapter without semantic coercion;
- proof of per-variant projection-envelope conformance, including the 22
  annotated records' fail-closed status; and
- a later, separately reviewed Gate 2 SAME authority and implementation.

Gate 3 Voice relationship authority remains independent. The proposed
canonical object does not establish Voice relationship, functional relation,
or any other relation. Equal Voice paths are neither necessary nor sufficient
for SAME.

## 10. Validation and lane boundary

This artifact is documentation only. The following lane boundaries remain in
force:

```text
RUNTIME_FILES_CHANGED=NO
TEST_FILES_CHANGED=NO
SOURCE_DATA_CHANGED=NO
FROZEN_AUTHORITIES_CHANGED=NO
S5_CHANGED=NO
SAME_RUNTIME_IMPLEMENTED=NO
GATE_PREDICATES_CHANGED=NO
LINEAR_UPDATED=NO
DF_BRAIN_UPDATED=NO
```

The focused existing CMUdict suite was run before the original document was
created: 5 suites passed, 109 tests passed, 0 snapshots. The repository and
validation values in the original authoring checkpoint were historical
pre-PR observations; they are not current PR state and must not be read as
current CI or merge evidence. The resulting correction's actual checks and
hosted CI are reported outside this authority artifact.

## 11. Final classification

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
BASE_MAIN_SHA=7ced5e08f1f587ec56e12da2958ad20f750e6848
BRANCH=codex/cmudict-path-b-downstream-canonical-representation-incorporation-v0-1
REPORTING_METADATA_STATUS=HISTORICAL_PRE_PR_AUTHORING_CHECKPOINT
HISTORICAL_HEAD=7ced5e08f1f587ec56e12da2958ad20f750e6848
HISTORICAL_WORKTREE_STATUS=ONE_PROPOSED_MARKDOWN_DOCUMENT_PENDING_VALIDATION
SCIENTIFIC_AUTHORITY_DECISION=PROPOSE_LAYERED_CANONICAL_DOWNSTREAM_CONTRACT_PENDING_DF_REVIEW
CANONICAL_REPRESENTATION_BOUNDARY_SELECTED=PER_PHYSICAL_VARIANT_EVIDENCE_PLUS_EXPLICIT_AGGREGATE_RESOLUTION_LEDGER
CANONICAL_REPRESENTATION_CONTRACT_ID=OPEN_INSTRUMENT_CMUDICT_PATH_B_DOWNSTREAM_CANONICAL_REPRESENTATION_V0_1
NORMALIZATION_INCORPORATION_STATUS=CONDITIONALLY_RESOLVABLE_BY_AUTHORIZED_BOUNDED_CONFORMANCE
PARSER_INCORPORATION_STATUS=CONDITIONALLY_RESOLVABLE_BY_INDEPENDENT_SHARED_EVIDENCE_CONFORMANCE
PROJECTION_INCORPORATION_STATUS=PROFILE_IDENTITY_ESTABLISHED_ENVELOPE_AND_INVOCATION_CONFORMANCE_PENDING
VARIANT_AMBIGUITY_INCORPORATION_STATUS=EXPLICIT_LAYERED_POLICY_REQUIRED_PHYSICAL_VARIANTS_PRESERVED_AGGREGATE_FAIL_CLOSED
ANNOTATION_INCORPORATION_STATUS=OPAQUE_PRESERVED_CANONICAL_PROJECTION_INELIGIBLE
DOWNSTREAM_PROVENANCE_STATUS=PARTIAL_ADDITIVE_CANONICAL_ENVELOPE_AND_FINGERPRINTS_REQUIRED
EXISTING_PROVENANCE_ALREADY_SUFFICIENT=PARTIAL
NEW_EVIDENCE_IMPLEMENTATION_REQUIRED=YES
PROPOSED_CANONICAL_CONTRACT=YES
IMPLEMENTED_CANONICAL_CONTRACT=NO
VALIDATED_CANONICAL_CONTRACT=NO
AUTHORIZED_GATE2_SAME_PRODUCER=NO
CANONICAL_DOWNSTREAM_GATE2_CONTRACT_IDENTITY=NOT_ESTABLISHED
GATE2_SAME_AUTHORIZED=NO
FOUR_GATE_REACHABILITY_ESTABLISHED=NO
FILES_CHANGED=ONE_MARKDOWN_DOCUMENT
HISTORICAL_PR_STATUS=NOT_YET_OPENED
HISTORICAL_CI_REQUIRED_CHECKS=NOT_YET_RUN
MERGED=NO
NEXT_RECOMMENDED_LANE=DF_REVIEW_OF_PROPOSED_LAYERED_CANONICAL_CONTRACT_THEN_ADDITIVE_CONFORMANCE_IMPLEMENTATION
NEXT_ACTION=AWAIT_DF_FINAL_SCIENTIFIC_REVIEW
```
