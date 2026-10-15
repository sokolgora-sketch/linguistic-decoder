# CMUDICT PATH B DOWNSTREAM NORMALIZATION CONFORMANCE AUTHORITY v0.1

Status: proposed; pending DF scientific review. This document is an additive
normalization-contract authority proposal only. It does not authorize
`SAME_REPRESENTATION`, Gate 2, Gate 3, Voice relationship output, runtime
integration, Bridge changes, or the CMUdict-aware comparison projector.

## 1. Bounded decision

This lane resolves the normalization question at the narrowest defensible
boundary: the verified physical CMUdict source-form domain already carried by
the Level A shared source-pronunciation contract.

The existing candidate and production algorithms remain distinct. They are
not renamed, replaced, coerced, or declared algorithmically identical. A new
proposed downstream conformance contract may permit both producers to satisfy
one exact contract only for the explicitly frozen CMUdict domain, with a
fail-closed validator and complete source-domain provenance.

```text
NORMALIZATION_ALGORITHM_IDENTITY=NO
NORMALIZATION_DECLARED_CONTRACT_IDENTITY=NO
NORMALIZATION_FROZEN_DOMAIN_OUTPUT_EQUALITY=YES
COMMON_NORMALIZATION_CONTRACT_FEASIBLE=YES
COMMON_NORMALIZATION_CONTRACT_CURRENTLY_AUTHORIZED=NO
NEW_NORMALIZER_REQUIRED=NO
NEW_CONFORMANCE_VALIDATOR_REQUIRED=YES
NEW_EVIDENCE_EXPOSURE_REQUIRED=YES
NEW_BOUNDED_CONFORMANCE_ADAPTER_REQUIRED=YES
EXPLICIT_DF_AUTHORITY_DECISION_REQUIRED=YES
GATE2_SAME_CURRENTLY_AUTHORIZED=NO
```

The proposal is a contract-conformance boundary, not an equivalence class.
Every accepted result remains bound to one verified physical source record and
one exact normalized output string. Inputs outside the domain return blocked
or Null; they are never coerced into the domain.

## 2. Frozen authority and scope

The proposal preserves the following frozen doctrine:

```text
SAME_REPRESENTATION_IDENTITY_MODEL=A_EXACT_CONTRACT_IDENTITY
EQUIVALENCE_CLASS_POLICY=FORBIDDEN_BY_THIS_CONTRACT
VOICE_RELATIONSHIP_REQUIRED_TO_DEFINE_SAME=NO
VOICE_PATH_EQUALITY_REQUIRED_FOR_SAME=NO
```

Canonical Seven Voices remain `A E I O U Y Ë`. This document does not select a
winner, collapse a variant, infer semantics, or alter `no_single_winner` or
`user_decides=true` boundaries.

The inspected frozen authority hashes are:

| Artifact | SHA-256 |
| --- | --- |
| `functional-motivation-v0.2-same-representation-authority-v0.1.md` | `cf579fdf3c2b28798ee38a93ec0c6d2fe7f4ce29e37e8b02c1b1f58d347a19b1` |
| `functional-motivation-v0.2-cmudict-path-b-same-representation-adapter-authority-v0.1.md` | `b93366325db31b900c3216e01e2e764503d06fa80d4a2f1cf5610886a5102a6c` |
| `functional-motivation-v0.2-cmudict-path-b-representation-contract-alignment-authority-v0.1.md` | `754c1fd8d642b69b4675df978699b57172eadaa67b2907aebcb6f1a853a4932e` |
| `functional-motivation-v0.2-cmudict-path-b-shared-representation-evidence-exposure-authority-v0.1.md` | `1c2482e5b26a0e77c19b83b93737b495afc5d00f131bbd00a40573a6e471b84b` |
| `functional-motivation-v0.2-cmudict-path-b-same-representation-adapter-authority-revision-v0.1.md` | `0027358ad5a3a309519f9f16b41a19dbe30c44f9b5c4e28ed26cebab18d5084b` |

No frozen authority is edited by this proposal.

## 3. Actual candidate normalization

The candidate function is defined at
`src/shared/openInstrument/englishLexicalSenseSourceContract.v0_1.ts:137-142`:

```text
normalizeEnglishLexicalJoinKeyV0_1(sourceForm: string)
= sourceForm.normalize("NFC")
    .toLocaleLowerCase("en-US")
    .normalize("NFC")
```

Its declared source contract is
`OPEN_INSTRUMENT_ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_V0_1`, version `v0.1`
(`englishLexicalSenseSourceContract.v0_1.ts:13-20,214-245`). Its join policy
declares exact joining, no trim, no semantic/morphological/fuzzy/phonetic
expansion, and no collision resolution.

The function is used by the English lexical source path and by the CMUdict
candidate adapter. The candidate adapter requires a nonempty string source
form, English language, and `normalizedForm` equal to this function’s output
(`cmudictCandidateSourceAdapter.v0_1.ts:419-430`). Candidate parsing applies
the same function to the numeric-variant-stripped base source form
(`cmudictCandidateSourceAdapter.v0_1.ts:364-367`).

Runtime invalid-input behavior is not a conformance contract: a non-string
value throws because `.normalize` is called directly. The typed input domain is
therefore string-only; the future validator must reject non-strings before
normalization.

## 4. Actual production normalization

The production function is defined at
`src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts:30-32,99-101`:

```text
normalizeCmuDictLexicalWordV0_1(word: string)
= String(word ?? "").normalize("NFC").trim().toLowerCase()
```

The production envelope records the declared identity
`normalizeCmuDictLexicalWordV0_1:NFC->trim->lowercase` and parser identity
`loadCmuDictV0_1:existing-production-parser`
(`cmudictProductionSpokenBridgePrerequisites.v0_1.ts:26-43`).

The production loader trims each physical line and pronunciation, removes the
terminal numeric variant suffix before normalization, skips malformed/empty
rows, and stores normalized lookup keys
(`cmudictArpabetPronunciation.v0_1.ts:43-76`). The production prerequisite
index independently uses the same base-form and normalizer sequence
(`cmudictProductionSpokenBridgePrerequisites.v0_1.ts:276-315`).

Its runtime implementation coerces `null`, `undefined`, numbers, objects, and
booleans to strings, unlike the candidate function. Those values are outside
the proposed typed conformance domain and must be rejected, not normalized.

## 5. Identity determinations

### 5.1 Algorithm identity

`NORMALIZATION_ALGORITHM_IDENTITY=NO`.

The transformation order and whitespace behavior differ. Candidate performs
no trim and performs a final NFC normalization. Production trims and uses
default `toLowerCase()` without a final NFC step.

The single-scalar Unicode probe found zero case-only differences between
`toLocaleLowerCase("en-US")` and default `toLowerCase()` for the tested
Unicode scalar range. That observation does not erase the declared locale
operation or the different trim/final-NFC algorithms.

### 5.2 Declared contract identity

`NORMALIZATION_DECLARED_CONTRACT_IDENTITY=NO`.

The candidate join policy belongs to the English lexical-source authority and
explicitly forbids trim. The production identity belongs to the CMUdict
production resolver/prerequisite envelope and explicitly requires trim. The
Bridge correctly exposes both identities separately and records only
per-instance output equality (`cmudictCandidateProductionSpokenRepresentationBridge.v0_1.ts:410-422`).

### 5.3 Frozen-domain output equality

`NORMALIZATION_FROZEN_DOMAIN_OUTPUT_EQUALITY=YES`.

The exact existing audit returned:

```text
totalPhysicalSourceRecords=135166
totalDistinctSourceForms=135166
normalizationEqualRecordCount=135166
normalizationMismatchRecordCount=0
normalizationMismatchDistinctFormCount=0
sharedNormalizationArtifactDomainVerified=true
```

The independent conformance probe used the actual loader domain and stripped
the same terminal numeric suffix before comparing base forms:

```text
physicalRecords=135166
distinctBaseSourceForms=126052
variantRecords=9114
baseWithWhitespace=0
baseNonAscii=0
candidateProductionBaseOutputMismatches=0
```

The domain is bound to:

```text
sourcePath=src/data/openInstrument/pronunciation/cmudict.dict
sourceProfileId=open-instrument.cmudict-arpabet-en-us.v0_1
sourceRevision=74790861f652b15e4ac49015a90074ad62a27690
sourceNotation=ARPABET
sourceArtifactBytes=3618488
sourceArtifactSha256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
```

This is finite-domain output equality, not algorithm identity and not a
positive SAME result.

## 6. Executable counterexamples and test matrix

The actual exported functions produced these results:

| Input | Candidate | Production | Conformance status |
| --- | --- | --- | --- |
| `stone` | `stone` | `stone` | equal; representative domain value |
| `STONE` | `stone` | `stone` | equal output; not by itself domain authority |
| `StOnE` | `stone` | `stone` | equal output; not by itself domain authority |
| ` stone ` | ` stone ` | `stone` | reject outside domain |
| NBSP + `stone` + NBSP | preserved | `stone` | reject outside domain |
| EM SPACE + `stone` + EM SPACE | preserved | `stone` | reject outside domain |
| `Cafe` + combining acute | normalized NFC | normalized NFC | equal output; not sufficient alone |
| `Café` | `café` | `café` | equal output; not sufficient alone |
| `İ`, `I`, `ı` | deterministic | deterministic | locale observation; outside ASCII domain |
| empty string | empty | empty | reject; empty source form is not in domain |
| whitespace-only | preserved | empty | reject outside domain |
| `read(2)` | variant form | variant form | normalize `read` base after suffix removal |
| `mormonism` | `mormonism` | `mormonism` | representative multi-variant base |
| `null`, number, object | throws | string coercion | reject before invocation |

The CMUdict source-form audit found zero leading/trailing/internal Unicode
whitespace and zero non-ASCII source-form code points. This makes the restricted
domain explicit and independently testable; it does not silently hide a
disagreement in an open lexical domain.

## 7. Proposed exact conformance contract

The following contract is proposed, not authorized:

```text
CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONTRACT_ID_V0_1=
  OPEN_INSTRUMENT_CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONFORMANCE_V0_1
CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_CONTRACT_VERSION_V0_1=v0.1
CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_STATUS=PROPOSED_PENDING_DF_REVIEW
CMUDICT_PATH_B_DOWNSTREAM_NORMALIZATION_SCOPE=VERIFIED_CMUDICT_BASE_SOURCE_FORM_DOMAIN_ONLY
```

### 7.1 Input-domain authority

An accepted input is a nonempty `baseSourceForm` derived from one physical
Level A shared-source instance whose source artifact identity exactly matches
the frozen path, profile, revision, notation, byte count, and SHA-256 above.

The base form is derived only by the existing terminal numeric suffix rule.
The validator must assert:

- the physical source record is present and losslessly identified;
- the source form is nonempty and contains no Unicode whitespace;
- the source form is ASCII in the verified artifact domain;
- the base/variant relationship is exact;
- the artifact identity is exact;
- no source-form expansion, trim, punctuation rewrite, transliteration, or
  semantic normalization is performed.

The domain is the frozen artifact-bound set, not the set of all strings that
happen to produce equal outputs. A changed artifact fails closed and does not
expand the contract automatically.

### 7.2 Transformation and output policy

Both existing producer functions remain unchanged and remain independently
observable. For each accepted base source form `s`, the conformance relation is
valid only when:

```text
candidateKey = normalizeEnglishLexicalJoinKeyV0_1(s)
productionKey = normalizeCmuDictLexicalWordV0_1(s)
candidateKey === productionKey
```

The common contract output is that exact string. It is not a set of strings,
case-folding class, whitespace-insensitive class, pronunciation class, or
equivalence class. It does not authorize normalization of an input outside
the domain.

### 7.3 Validation, Null, and reason codes

A future bounded validator must return a closed result with the original role
identities and exact source evidence. It must fail closed for:

```text
CMUDICT_PATH_B_NORMALIZATION_ARTIFACT_MISMATCH
CMUDICT_PATH_B_NORMALIZATION_DOMAIN_MISMATCH
CMUDICT_PATH_B_NORMALIZATION_VARIANT_BASE_MISMATCH
CMUDICT_PATH_B_NORMALIZATION_CANDIDATE_OUTPUT_MISMATCH
CMUDICT_PATH_B_NORMALIZATION_PRODUCTION_OUTPUT_MISMATCH
CMUDICT_PATH_B_NORMALIZATION_ROLE_IDENTITY_MISSING
CMUDICT_PATH_B_NORMALIZATION_INPUT_INVALID
CMUDICT_PATH_B_NORMALIZATION_PROVENANCE_INCOMPLETE
CMUDICT_PATH_B_NORMALIZATION_AUTHORITY_NOT_APPROVED
```

These are proposed authority vocabulary only. No runtime reason-code or gate
predicate is changed by this document.

### 7.4 Evidence and reproducibility requirements

Each future conformance result must retain:

- proposed contract ID/version;
- candidate and production normalizer identities separately;
- exact physical record ID and source line/order;
- base source form and variant identity;
- source artifact path, revision, bytes, and SHA-256;
- candidate output and production output;
- explicit domain membership result;
- exact equality result;
- deterministic canonical serialization and SHA-256 fingerprint;
- original rejection/Null reason when blocked.

No Voice path, Gamma, ZC, Bridge compatibility, or SAME authority field is
part of this normalization contract.

## 8. Alternative evaluation

| Alternative | Decision | Reason |
| --- | --- | --- |
| A. Reuse one existing exact contract | Reject | Existing candidate and production contracts differ in trim, operation declaration, runtime invalid-input behavior, and role authority. |
| B. Explicit restricted-domain conformance | Select as proposal | The frozen artifact identity and exact source-form domain are explicit, stable, independently audited, and output-equal for every accepted physical record. |
| C. New shared normalization algorithm | Not required | A new algorithm would change or duplicate existing semantics without evidence. The required seam is validation/conformance, not replacement. |
| D. Fully blocked | Not selected | Current evidence supports future feasibility, but authority and implementation are still pending. |

The selected option is B implemented through an additive conformance boundary.
It does not authorize existing role contracts to be renamed or treated as
identical outside the frozen domain.

## 9. Remaining Gate 2 blockers

This proposal resolves only the normalization question conditionally. Gate 2
remains blocked by:

- parser identity/conformance;
- candidate and production projection-envelope identity;
- variant and ambiguity policy alignment;
- downstream role/projection provenance and reproducibility;
- comparison-level representation authority;
- the separate future SAME adapter authority.

Gate 3 Voice relationship authority remains independent and is not required to
define Gate 2 SAME. Voice output equality remains neither necessary nor
sufficient.

```text
NORMALIZATION_AUTHORITY_DECISION=
  PROPOSE_RESTRICTED_FROZEN_CMUDICT_DOMAIN_CONFORMANCE_NO_NEW_NORMALIZER
NORMALIZATION_CONFORMANCE_AUTHORIZED_NOW=NO
GATE2_SAME_CURRENTLY_AUTHORIZED=NO
```

## 10. Minimal next implementation seam

After DF review, the smallest implementation would be one additive validator
and focused tests for the contract above. It would consume existing Level A
physical evidence and existing normalizers, expose no new normalization
semantics, and fail closed on artifact/domain/output/provenance mismatch.

It must not:

- modify either normalizer;
- add a shared parser;
- alter candidate or production lookup behavior;
- implement SAME_REPRESENTATION;
- change Functional Motivation predicates;
- emit a Voice relationship;
- wire Bridge, Discovery, API, UI, Gamma, ZC, or S5.

## 11. Validation record for this proposal

Read-only executable evidence:

- actual candidate and production functions imported and exercised;
- Unicode scalar case comparison;
- whitespace and non-breaking-space counterexamples;
- invalid-input behavior probe;
- exact frozen CMUdict source-domain audit;
- variant-base coverage audit;
- representative `stone`, `read`, and `mormonism` cases.

Focused existing tests before document creation:

```text
4 suites passed
83 tests passed
0 snapshots
```

No positive scientific controls were executed. No runtime, source data, test,
frozen authority, Bridge, Voice/Gamma/ZC, gate predicate, API, UI, Linear, or
DF_BRAIN mutation occurred in this lane.

## 12. Proposed status

```text
NORMALIZATION_ALGORITHM_IDENTITY=NO
NORMALIZATION_DECLARED_CONTRACT_IDENTITY=NO
NORMALIZATION_FROZEN_DOMAIN_OUTPUT_EQUALITY=YES
COMMON_NORMALIZATION_CONTRACT_FEASIBLE=YES
COMMON_NORMALIZATION_CONTRACT_CURRENTLY_AUTHORIZED=NO
NEW_NORMALIZER_REQUIRED=NO
NEW_CONFORMANCE_VALIDATOR_REQUIRED=YES
NEW_EVIDENCE_EXPOSURE_REQUIRED=YES
NORMALIZATION_AUTHORITY_DECISION=PROPOSE_RESTRICTED_FROZEN_CMUDICT_DOMAIN_CONFORMANCE_NO_NEW_NORMALIZER
REMAINING_NORMALIZATION_BLOCKERS=DF_AUTHORITY_REVIEW; CONFORMANCE_VALIDATOR; CONFORMANCE_EVIDENCE_EXPOSURE; DOWNSTREAM_PARSER_PROJECTION_VARIANT_PROVENANCE_AUTHORITY
GATE2_SAME_CURRENTLY_AUTHORIZED=NO
```

Next action: `AWAIT_DF_REVIEW`.
