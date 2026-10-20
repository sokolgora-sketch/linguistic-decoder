# Open Instrument — M2 Fresh Candidate Pool Exclusion Ledger and Opaque-ID Authority Proposal v0.1

Status: `PROPOSED_PENDING_DF_AUTHORITY_REVIEW`

This document is an additive, non-normative proposal. It does not amend the
frozen M2 preregistration, create an M2 target-pool artifact, assign a real
opaque candidate ID, select a target, perform structural discovery, or
authorize research or runtime execution.

## 1. Purpose and authority boundary

The frozen M2 preregistration defines the future pool by rules only. Its
`targetPoolRule` requires a stable opaque identity, one independently
reviewable target sense or an explicit unresolved state, pinned source
authority, exclusion from the 57-case baseline, exclusion from prior target,
reveal, control and research use, and deduplication by source profile,
normalized lexical form and authoritative sense identifier
(`docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/preregistration.json:20-39`).

Its `targetSelectionRule` requires opaque IDs to be assigned before structural
discovery and preserves code-unit lexical ordering of the complete opaque ID
(`docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/preregistration.json:41-53`). The selection rule does not authorize
population or selection in this lane.

The frozen preregistration and its README remain the highest authority. This
proposal may describe an implementation-ready evidence boundary, but cannot
change the frozen rules, make the current Cambridge pool fresh, or convert
historical records into a new selection authority.

## 2. Evidence inventory within this inspection scope

### 2.1 Frozen M2 procedure

| Source | Status and authority | Prior-use relevance | Identity and coverage | Sufficiency and gap |
|---|---|---|---|---|
| `docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/preregistration.json` | Frozen M2 procedure; normative for this lane | Defines baseline, prior target, reveal, control, research and prior embryo/replication exclusions | Requires NFC/trim/lowercase comparison and source-profile + normalized lexical + sense-ID deduplication | Sufficient as rule authority; does not contain a populated pool or exclusion ledger |
| `docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/README.md` | Frozen package explanation | Confirms that no real pool, target, payload, discovery or reveal is embedded | States that the future pool and selection artifacts must be durable and hash-pinned | Sufficient to prohibit treating this package as a populated pool |
| `docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/hash-manifest.json` | Frozen tracked-artifact manifest | Covers only the README and preregistration | No M2 pool definition or selection record is listed | Missing required pool artifacts; therefore M2 cannot advance |

### 2.2 Target-sense authority

| Source | Status and authority | Prior-use relevance | Identity and coverage | Sufficiency and gap |
|---|---|---|---|---|
| `src/data/openInstrument/targetSenseAuthorityPool.v0_1.json` | Frozen Cambridge target-sense pool | Contains seven resolved and two unresolved records; it does not record complete prior-use state | Uses case IDs, lexical forms, POS, Cambridge sense IDs and locators | Sufficient as target-sense evidence only; not sufficient as a fresh M2 pool |
| `src/shared/openInstrument/targetSenseAuthorityPool.v0_1.ts` | Runtime validator for the Cambridge pool | Rejects unresolved/conflicting sense authority and non-Cambridge source status | Enforces deterministic IDs and exact source fields | Reusable for sense validation; does not perform contamination screening |
| `tests/openInstrument.targetSenseAuthorityPool.v0_1.spec.ts` | Focused contract tests | Confirms seven resolved, two unresolved and source-only boundaries | Tests deterministic serialization and fail-closed unresolved polysemy | Does not establish fresh-pool authority |

### 2.3 Baseline and prior research records

| Source | Status and authority | Prior-use relevance | Identity and coverage | Sufficiency and gap |
|---|---|---|---|---|
| `tests/fixtures/openInstrument/analysis-capability-baseline.v1.manifest.json` | Current committed 57-case baseline manifest | Hard exclusion for every normalized baseline word | 57 cases, 56 unique normalized lexical forms; SHA-256 `80e161d14538875e3cd9225cd6d43b8db2c40f7f68ca2fef661da216430e7d0a` | Sufficient for baseline comparison; not a complete prior-use ledger |
| `tests/fixtures/openInstrument/analysis-capability-baseline.v1.json` | Current baseline evidence artifact | Confirms the baseline aggregate and repeatability record | SHA-256 `1cf20269b3d9516c66b8470b60208699e48e0a3ff78608107054078e91bc6d6d` | Sufficient with the manifest; no target/research history beyond baseline membership |
| `docs/open-instrument/research-artifacts/frozen-target-functional-research-trial-v0_1/restart-01.json` | Historical frozen trial record marked invalid for a preselection firewall breach | Records a prior eligible set, a selected case and target-bound sense material | Directly inspectable target and selection identity; prior trial status is explicit | Sufficient to exclude its recorded prior-use identities; not a general ledger |
| `docs/open-instrument/research-artifacts/m6-one-embryo-proof-v1/one-embryo-proof-v1.archival.json` | Archival prior M6 record; original canonical bytes not independently recovered | Records prior target-research material and a no-reveal-at-freeze state | Lexical and sense identity are inspectable, but archival integrity is qualified | Sufficient as prior-use evidence when classified as archival; not sufficient to recreate missing bytes |
| `docs/open-instrument/research-artifacts/m7-three-case-replication-v1/preregistration.json` | Frozen M7 replication preregistration | Records prior target/controller use and explicit first-experiment exclusions | Contains target/sense/controller records and payload leakage audit | Sufficient for the identities explicitly recorded there; M7 selection rules are not M2 rules |
| `docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/preregistration.json` | Frozen strict-blind replication-series preregistration | Records prior exclusions, an eight-entry candidate pool and a current-baseline exclusion rule | Preserves source order and a separate series selection policy | Useful exclusion evidence, but cannot be silently reused as an M2 pool |
| `docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/README.md` | Research-only series boundary | Prohibits treating the series as production or M2 authority | Confirms no production/runtime mutation or outcome promotion | Sufficient to preserve lane separation |

The inspected set is exhaustive for the declared M2 readiness scope. It is
not claimed to be a universal history of every repository or external use.
Absence of a record is never evidence of non-use.

## 3. Observed freshness result

The current Cambridge pool contains seven resolved and two unresolved records.
Under the frozen M2 normalization rule (NFC, trim, lowercase for comparison),
all nine current lexical forms occur in the 57-case baseline. The baseline
therefore excludes every current pool record before sense eligibility could
produce a fresh candidate.

The resulting count is **zero eligible current-pool candidates under the
frozen M2 rules**. This is a deterministic evidence result, not a claim that
a complete real-pool validator has already run.

The M2 artifact directory contains no `M2_TARGET_POOL_DEFINITION` or sealed
`M2_TARGET_SELECTION_RECORD`. Consequently, no fresh M2 pool currently
exists, even though a frozen Cambridge sense-authority pool exists.

## 4. Proposed exclusion-ledger contract

The future controller-private ledger should be a canonical, hash-pinned record
with one row per candidate identity and zero real rows in this proposal.

Each row should contain:

- a registry schema/version and ledger artifact identity;
- source-profile identity and exact source artifact/revision references;
- preserved source lexical form and the NFC/trim/lowercase comparison key;
- part of speech and authoritative sense identifier;
- source URL, locator, revision or access date, and review status;
- a duplicate key composed of source-profile identity, normalized lexical form
  and authoritative sense identifier;
- prior-use evidence references with category, artifact path, artifact hash,
  record locator, inspectability status and evidence classification;
- eligibility status, deterministic reason codes and independent review status;
- the assigned opaque candidate ID only inside the sealed controller registry.

Prior-use categories must include at least:

`BASELINE`, `PRIOR_TARGET`, `PRIOR_REVEAL`, `PRIOR_CONTROL`,
`PRIOR_RESEARCH`, `PRIOR_EMBRYO_OR_REPLICATION`, and
`UNKNOWN_OR_UNVERIFIABLE`.

The proposed decision precedence is:

1. Frozen M2 rules and artifact-integrity requirements.
2. Hash-verified baseline and frozen research/control/reveal records.
3. Reviewed target-sense authority and source-attestation records.
4. Candidate-level review evidence.

A positive prior-use record is a hard exclusion. An unknown, conflicting,
missing or unverifiable record is not treated as clean; it yields
`INELIGIBLE` or `BLOCKED` pending review. Conflicting source or sense identity
also fails closed. No later proposal can erase a higher-authority exclusion.

Deduplication must occur before eligibility and selection. Multiple genuine
senses remain separate only when the frozen authority explicitly permits them;
a one-sense proof requires one independently reviewable, resolved sense.

The ledger must preserve exact source order and provenance where source order
is part of the authority. It must not infer non-use from an absent row.

### 4.1 Word-level freshness versus source-sense deduplication

These are separate operations:

- **Prior-use exclusion** is word-level. A positive prior-use finding for one
  normalized lexical form excludes that lexical form across every source
  profile, part of speech and authoritative sense identifier. Changing the
  dictionary, sense or source profile cannot make a previously used word
  fresh.
- **Source-sense deduplication** is record-level. The frozen key remains
  `sourceProfileId + normalizedLexicalForm + authoritativeSenseId`; it
  prevents duplicate representations of the same source-sense record and
  does not weaken word-level prior-use exclusion.

The only identity normalization permitted for either comparison is Unicode
NFC, trim, then lowercase. No stemming, lemmatization, plural collapsing,
phonetic normalization, transliteration equivalence or other canonicalization
is proposed. Unknown or unverifiable prior use is not evidence of freshness.
Any exclusion stronger than this exact frozen procedure requires a separate
DF scientific-authority decision.

### 4.2 Independent exclusion-coverage review

Before a candidate can be eligible, a versioned controller-private coverage
review must inspect the declared sources for baseline cases, prior targets,
reveals, controls, previous functional research, M6/M7 records, strict-blind
replication, previously used embryo cases and any other source discovered
within the declared inspection scope.

Each inventory row must record: stable path or reference, exact revision or
artifact SHA-256, categories covered, extraction rule or record locator,
declared coverage scope, evidence status, limitations, conflicts or unresolved
state, and an independent-review decision/reference. The review artifact must
have canonical bytes, schema/version, SHA-256, byte length and an immutable
freeze record.

The result must distinguish `COVERAGE_VERIFIED_FOR_DECLARED_SCOPE` from
`UNIVERSAL_HISTORICAL_COMPLETENESS`. Only the former can be claimed here;
the latter is not established. Incomplete, unverifiable or conflicting
coverage makes the candidate ineligible. The absence of a row in an
incomplete ledger never proves non-use.

The reviewer identity, signature mechanism and private storage location are
not invented by this proposal. DF must approve the independent reviewer role,
access arrangement and storage controls before the coverage artifact can be
accepted.

## 5. Proposed opaque-ID authority

No real opaque IDs are assigned here. The smallest proposed authority is a
sealed controller-private registry with these properties:

1. The ID is derived from the sealed canonical candidate identity through a
   proposed controller-private keyed namespace mechanism. That identity may
   contain the lexical form, source profile and authoritative sense ID; the
   resulting opaque ID must not disclose those fields to the blind operator
   or enable their practical recovery without controller-private material.
   Expected function, structural hypotheses and insertion order must not
   influence ID assignment.
2. The registry records the canonical identity preimage, assignment method
   version, registry version, and exact registry hash for independent review by
   an authorized reviewer. The namespace secret, if required by the approved
   mechanism, is never operator-visible.
3. Assignment occurs only after duplicate and exclusion review and before any
   structural discovery.
4. Selection continues to use the frozen selector and code-unit lexical order
   of the complete opaque ID. The selector itself is not changed.
5. Registry edits, reassignment, insertion-order changes or candidate removal
   after freeze invalidate the registry hash and any dependent selection.
6. Public payloads contain only the opaque case identity and approved
   structural fields. They do not contain the registry, its preimages or
   source-sense material.

This avoids an insertion-order oracle and makes IDs independent of operator
preference. A plain public hash of a guessable lexical identity is not
acceptable because it would provide an avoidable lexical-identification
oracle. The exact namespace mechanism, reviewer access and key custody are
pending DF authority review.

### 5.1 Mechanism comparison

| Mechanism | Security and reproducibility | Selection-manipulation risk | Review and freeze consequence |
|---|---|---|---|
| Sequential IDs in a private registry | Confidential only while the registry is private; reproducible from a frozen canonical roster; exposes cardinality or additions if IDs escape | High if assignment follows insertion order or the controller can reorder, add or remove candidates; the minimum ID can be deliberately chosen | Requires a precommitted complete roster, independent assignment review and immutable registry hash; otherwise incompatible with the frozen selector |
| Keyed HMAC over canonical identity | Deterministic and independent of insertion order; dictionary enumeration is resisted without the key; HMAC is stronger than an ordinary hash for this purpose | The controller can alter the selected minimum by choosing or rotating the key, changing the pool, or changing the canonicalization unless the key commitment and roster are frozen before intake | Requires a registry-scoped key commitment before candidate composition, private custody, fixed algorithm/version, collision handling and invalidation on key rotation |
| Salted ordinary hash | Deterministic if the private salt is retained; enumeration is resisted only while the salt is secret; mathematical dependence on identity remains | Salt choice, pool composition, canonicalization and post-freeze registry edits can change the minimum; weaker construction than HMAC and not a confidentiality guarantee | Requires salt commitment, private custody, fixed version and full registry manifest; any salt rotation invalidates all dependent IDs |

The controller can manipulate any deterministic minimum selector through pool
composition unless the complete declared universe, exclusion coverage, ID
namespace commitment and registry bytes are independently reviewed before
freeze. A secret key or salt alone does not solve that governance problem.
Likewise, mathematical dependence on lexical identity is distinct from whether
the identity is exposed or recoverable.

**Technical proposal, pending DF decision:** use a registry-scoped keyed HMAC
with a precommitted key commitment, fixed canonical identity serialization,
fixed algorithm/version and independent review of the sealed registry. The
key is never exposed to the operator. Key rotation, registry edits, pool
composition changes or canonicalization changes invalidate the selection.
Sequential IDs remain acceptable only if an independently reviewed canonical
roster is frozen before assignment; salted ordinary hashes are not preferred.
This recommendation creates no key or ID in this lane and does not alter the
frozen selector.

## 6. Proposed sealed candidate record

The minimum controller-private record is:

```text
schemaVersion
candidateRegistryVersion
opaqueCandidateId
preservedLexicalForm
normalizedIdentityKey
partOfSpeech
sourceProfileId
authoritativeSenseId
sourceAuthorityStatus
sourceUrl
sourceLocator
sourceRevisionOrAccessDate
polysemyStatus
identityConflictStatus
priorUseEvidenceRefs[]
eligibilityDecision
reasonCodes[]
independentReviewStatus
recordFingerprint
```

The record must be canonicalized, byte-length recorded, SHA-256 hashed and
made immutable before selection. Missing, malformed or mismatched fields fail
closed. It must not include structural hypotheses, embryo results, expected
functions, translations, etymology or post-selection interpretations.

Existing source attestation contracts are reusable for provenance and
source-only review, but their target-blind restrictions remain in force:

- `src/shared/openInstrument/sourceEntryAttestation.v1.ts:31-49,142-160,235-285`
- `src/shared/openInstrument/targetBlindReviewedSourceAttestation.v1.ts:25-36,99-120,232-285`

Those contracts do not themselves create an M2 candidate pool or authorize a
target selection.

## 7. Visibility and integrity boundary

| Boundary | Permitted content | Prohibited content |
|---|---|---|
| Public proposal | Schema IDs, rules, aggregate counts, claim boundaries, validation outcomes | Real candidate words, senses, locators, opaque-ID mappings, selection records |
| Controller-private ledger | Full candidate identity, sense authority, provenance, exclusion evidence, registry preimages and hashes | Runtime authorization or post-hoc semantic conclusions |
| Sealed selection record | Selected opaque case identity, target-bearing source-sense binding, immutable hashes and review record | Blind-operator access before the reveal gate |
| Blind operator payload | Opaque case identity, frozen structural embryo/fingerprint, approved source/search/stop IDs and claim boundaries | Word, pronunciation, sense, gloss, translation, etymology, target locator or expected function |

The frozen preregistration distinguishes `M2_TARGET_POOL_DEFINITION` as
`containsTargetSemantics=false` from
`M2_TARGET_SELECTION_RECORD` as `containsTargetSemantics=true`
(`docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/preregistration.json:128-136`). This proposal interprets that distinction
as a visibility boundary: the pool-definition artifact may expose rules,
schema and non-target-bearing integrity metadata, while target-bearing
candidate and selection material remains sealed. Because the exact artifact
serialization and storage boundary are not yet authorized, this interpretation
must be reviewed by DF and does not authorize real operation.

The current structural visibility proposal remains synthetic and non-normative:
`docs/open-instrument/m2-structural-freeze-visibility-boundary-proposal-v0.1.md:3-25,101-126`.
Its projection fingerprints are not a substitute for candidate secrecy,
filesystem isolation or a sealed M2 registry.

### 7.1 Pool-definition and private-registry relationships

The three available linkage designs are:

| Relationship | Public exposure and verification | Leakage and integrity consequence |
|---|---|---|
| Registry commitment hash | The nonsemantic pool definition exposes a commitment hash; an authorized reviewer can verify it only when given the exact private registry bytes | The hash is not confidentiality. Reuse can reveal correlation; a changed registry is detectable, but the public hash alone proves neither contents nor secrecy |
| Nonsemantic registry version/reference | The pool definition exposes a version or opaque reference without target-bearing fields; authorized reviewers resolve it through the private manifest | Enables lifecycle and correlation linkage and may reveal existence or cardinality indirectly; integrity depends on the private manifest binding the reference to exact bytes |
| No explicit public reference; sealed manifest linkage | The public artifact contains no registry link; a private manifest binds pool-definition SHA, registry SHA, selection dependencies and review records | Lowest public linkage leakage, but public readers cannot independently associate the two artifacts without authorized manifest access; tamper detection remains strong inside the sealed manifest |

No option automatically proves confidentiality. Each requires a private,
canonical manifest containing the exact artifact paths or stable references,
byte lengths, SHA-256 values, freeze state and dependency edges, with storage
access approved by DF. The choice between auditability and public linkage
leakage is an unresolved DF authority decision.

The minimum proposed non-target-semantic pool-definition schema is limited to
schema/version, artifact identity, frozen M2 contract ID and SHA-256,
normalization and deduplication policy IDs, declared coverage-review status,
serialization profile, freeze state and the approved registry-linkage mode.
The pool-definition artifact's own exact byte length and SHA-256 must be
recorded in a separate, controller-private hash-pinned manifest after the
pool-definition bytes are finalized; they must not be embedded in the bytes
they fingerprint. Candidate words, senses, locators,
opaque-ID mappings and target-bearing records remain controller-private. A
candidate count is not required by this proposal because cardinality can be a
linkage signal; adding it requires DF review.

The private registry and sealed manifest may contain the full candidate and
exclusion records, namespace commitment, registry SHA-256, pool-definition
SHA-256, selection dependencies and independent-review attestation. The exact
serialization, linkage mode and storage boundary remain pending; no real
pool-definition or target-bearing artifact is created here.

## 8. Reusable components and missing seam

The following existing components can be reused without modification:

- `src/shared/openInstrument/m2SyntheticArtifactBuilderCore.v0_1.ts:44-104,156-360`
  for fail-closed candidate declaration validation and reason-code shape.
- `src/shared/openInstrument/oneEmbryoProofM2Preregistration.v0_1.ts:129-149`
  for deterministic eligible filtering and opaque-ID selection order.
- `src/shared/openInstrument/sourceEntryAttestation.v1.ts` for source-only
  provenance validation and canonical attestation fingerprints.
- `src/shared/openInstrument/targetBlindReviewedSourceAttestation.v1.ts` for
  independent source-attestation review without target-semantic promotion.

The missing seam is not another selector or parser. It is an authority-bound,
controller-private intake and exclusion-ledger procedure that produces a
hash-pinned M2 pool definition and, only after review, a sealed selection
record. No implementation should be added before DF approves that boundary.

## 9. Fail-closed acceptance criteria for future intake

Future real candidate intake may proceed only after DF review authorizes this
proposal and all of the following are true:

1. The candidate source and target-sense authority are explicitly pinned.
2. The complete declared exclusion inventory is materialized and hash-pinned.
3. Every candidate has independently reviewable lexical, POS, sense and
   provenance fields.
4. Baseline, target, reveal, control and research exclusions are checked
   against all declared evidence sources.
5. No unknown or conflicting prior-use state remains eligible.
6. Duplicate source-profile/normalized-lexical/sense identities are rejected
   or resolved before ID assignment.
7. Opaque IDs are assigned before structural discovery and are independent of
   insertion order and operator preference.
8. The pool-definition artifact contains no target-bearing material beyond
   the approved non-semantic metadata boundary.
9. The registry, pool definition and later selection record have exact byte
   lengths, SHA-256 fingerprints and immutable freeze timestamps.
10. Missing or unverifiable artifacts produce `NO_ADVANCE_TO_REVEAL` and do
    not trigger replacement or candidate substitution.

## 10. Authority decision protocol and pending DF decisions

The correction status is explicitly separated as follows:

- **Correction A:** FACT — the frozen procedure uses NFC, trim and lowercase
  and separately names word-level prior-use exclusions and the composite
  source-sense deduplication key. INFERENCE — a positive prior-use word match
  must exclude that word across source profiles and senses. PROPOSAL — encode
  both checks separately in the future ledger. UNKNOWN — none for the exact
  normalization; stronger equivalence remains outside scope.
  `CORRECTION_A_REQUIRES_DF_DECISION=NO` for the exact frozen procedure.
- **Correction B:** FACT — the existing validator checks the opaque-ID shape
  and the selector sorts IDs by code-unit order. INFERENCE — insertion order,
  namespace choice, pool composition and post-freeze mutation can influence
  the selected minimum. PROPOSAL — precommitted registry-scoped HMAC with
  independent registry review. UNKNOWN — key custody and reviewer access.
  `CORRECTION_B_REQUIRES_DF_DECISION=YES`.
- **Correction C:** FACT — the inspected evidence is distributed across
  baseline, target, M6, M7 and strict-blind artifacts. INFERENCE — it is not a
  universal historical ledger. PROPOSAL — a versioned coverage-review
  artifact for the declared scope. UNKNOWN — universal historical completeness
  and final storage/reviewer arrangements.
  `CORRECTION_C_REQUIRES_DF_DECISION=YES`.
- **Correction D:** FACT — the frozen preregistration distinguishes the
  nonsemantic pool definition from the target-bearing selection record.
  INFERENCE — each linkage design trades public leakage against independent
  verifiability. PROPOSAL — keep the public schema nonsemantic and bind private
  artifacts through an approved sealed manifest. UNKNOWN — the final linkage
  mode, serialization and storage boundary.
  `CORRECTION_D_REQUIRES_DF_DECISION=YES`.

These are proposals and technical interpretations, not independent scientific
approval, reviewer signatures or secret-custody decisions.

DF approval is required for:

- this exclusion-ledger contract and its authority precedence;
- the controller-private registry and namespace/key custody model;
- the interpretation and serialization of `M2_TARGET_POOL_DEFINITION`;
- independent-review access to sealed candidate preimages;
- the exact storage and immutability boundary;
- any future authorization to populate real candidates.

Until those decisions are recorded, the current state remains:

```text
M2_FRESH_POOL_EXISTS=NO
M2_CURRENT_POOL_ELIGIBLE_COUNT=0
M2_REAL_CANDIDATE_INTAKE_AUTHORIZED=NO
M2_REAL_TARGET_SELECTED=NO
M3_RESEARCH_EXECUTED=NO
REAL_EXECUTION_AUTHORIZED=NO
```

## 11. Next smallest lane

After DF review, the smallest next lane is a bounded authority-resolution
review of this proposal. It should either approve the ledger/registry boundary
or return a precise correction. It must not populate candidates, assign real
opaque IDs, perform structural discovery, or begin M3 research in the same
lane.
