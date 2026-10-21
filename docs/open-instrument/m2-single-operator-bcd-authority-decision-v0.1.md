# Open Instrument — M2 Single-Operator B/C/D Authority Record v0.1

Status: `APPROVED_PROCEDURAL_DIRECTION_PENDING_OPERATIONAL_VERIFICATION`

Decision reference: DF direction recorded in Linear ZE-14, “M2 real-intake
authority decision: independent reviewer, key custody and sealed storage”.

This record materializes approved procedure only. The frozen M2
preregistration remains normative and unchanged. This record does not create a
candidate pool, generate a key, assign an opaque ID, select a target, execute
structural or blind research, reveal a target, or authorize runtime evidence.

## Normative boundary

The sole normative frozen contract is
`docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/preregistration.json`.
The package README is explanatory documentation, not an additional normative
contract. The frozen contract requires a predeclared reviewed source-backed
pool, stable opaque identities assigned before structural discovery,
deterministic code-unit minimum selection over the complete eligible set, and
one resolved reviewable target sense or an explicitly unresolved state. When
one sense is required, unresolved or conflicting authority fails closed. It
also requires target-blind payloads, exact hash-pinned artifacts, valid Null,
and no replacement attempt after Null or mismatch.

The existing proposal
`docs/open-instrument/m2-fresh-candidate-pool-exclusion-ledger-and-opaque-id-authority-proposal-v0.1.md`
is supporting design evidence, not a replacement frozen contract. The
existing audit and synthetic builder are reusable implementation seams; their
successful synthetic results do not establish real eligibility or selection.

## B — Opaque identity and key custody

The approved direction is:

1. Derive each opaque candidate ID with HMAC-SHA256 over a frozen canonical
   source-sense identity and a fixed namespace/version.
2. Record the namespace/key commitment before candidate-universe composition.
   Keep the key, canonical preimages, and registry controller-private.
3. Prohibit key rotation, reassignment, insertion-order influence, manual
   preference, pool editing after freeze, and repeated selection attempts.
4. Preserve the frozen selector: choose the code-unit minimum over the
   complete eligible opaque-ID set only.

This is a procedural direction, not evidence that a key commitment or registry
exists. Key generation, custody, backup, commitment chronology and registry
immutability must be verified before real intake. No key or opaque ID exists
under this record.

## C — Prior-use exclusion and reproducible audit

The controller prepares a declared-scope, versioned, hash-pinned inventory
covering the frozen 57-case baseline and the declared prior targets, reveals,
controls, research, embryo and replication records. Each reference records its
source/revision or access date, exact artifact identity, byte length, locator,
coverage scope, status, limitations and deterministic reason codes.

Prior-use exclusion is applied at normalized-word level using the frozen NFC,
trim, lowercase comparison rule. Source-profile, lexical-form and authoritative
sense identifiers remain separate for record deduplication and provenance.
Missing, conflicting, unknown or unverifiable coverage is not clean evidence;
it fails closed as ineligible or blocked. The result may claim only
`COVERAGE_VERIFIED_FOR_DECLARED_SCOPE`, never universal historical completeness.

The audit classification is exactly
`SINGLE_OPERATOR_REPRODUCIBLE_AUDIT`. It records accountable controller
provenance and independently reproducible machine checks. It must not claim or
fabricate independent human review, a second signature, or reviewer evidence.

## D — Private registry and sealed linkage

The public `M2_TARGET_POOL_DEFINITION` contains only nonsemantic rules,
schema/version information and permitted integrity metadata. It contains no
target words, senses, locators, opaque-ID mappings or selection record.

Candidate identities, source attestations, exclusion evidence, canonical
preimages, the registry, key material, and the target-bearing
`M2_TARGET_SELECTION_RECORD` remain controller-private. Linkage uses
`SEALED_MANIFEST_ONLY`: a private manifest binds the finalized nonsemantic
pool definition, private registry, coverage review and dependent selection
artifacts without exposing target-bearing material to the blind operator.

Every applicable controller-created M2 record uses canonical UTF-8 bytes,
exact byte length, SHA-256, stable artifact identity, explicit dependency
references and immutable freeze chronology. External source evidence remains
in its exact original pinned bytes; it is verified, referenced and fingerprinted
without canonicalizing or rewriting the source material. The manifest
fingerprint is recorded outside the manifest. Hashes prove byte identity and
dependency integrity; they do not by themselves prove custody, chronology,
secrecy or human review.

## Reusable implementation seams

- The frozen preregistration and `oneEmbryoProofM2Preregistration.v0_1.ts`
  preserve the selector, blind-payload boundary, Null behavior and hash-chain
  rules.
- `m2SingleOperatorReproducibleAudit.v0_1.ts` supplies canonical hashing,
  artifact byte/length checks, declared-scope reason codes, explicit
  `SINGLE_OPERATOR_REPRODUCIBLE_AUDIT`, and false execution locks.
- `sourceEntryAttestation.v1.ts` and
  `targetBlindReviewedSourceAttestation.v1.ts` validate source provenance and
  source-entry/sense evidence, including source identity, locator and
  revision/hash. They do not by themselves establish M2 target-sense
  authority, create a fresh pool or authorize selection. The separate
  `targetSenseAuthorityPool.v0_1.ts` policy supplies the target-sense authority
  boundary; its current pool is not thereby a fresh M2 candidate pool.
- `m2SyntheticArtifactBuilderCore.v0_1.ts` and the synthetic tests exercise
  deterministic eligibility and structural projection only. They cannot be
  promoted as proof of real artifact custody or real candidate eligibility.

## Operational gates before any real intake

All of the following remain outstanding and must be checked against actual
private artifacts and the frozen procedure:

1. Private storage root, permissions, access separation, backup/recovery and
   symlink/path protections.
2. Key generation and pre-composition commitment chronology, fixed HMAC
   namespace/version, custody record, and no-rotation invalidation rule.
3. Complete declared-scope exclusion inventory, source/sense attestations,
   exact fingerprints, byte lengths, dependencies and fail-closed coverage.
4. Canonical pool definition, sealed registry, manifest, external manifest
   fingerprint and immutable freeze sequence.
5. Blind-operator isolation proving that target-bearing registry and selection
   material are inaccessible before the reveal gate.
6. A separate explicit authorization for real candidate intake, ID assignment,
   deterministic selection, M3 research, reveal and any execution.

Until these gates are verified, the state remains:

`M2_BCD_DIRECTION_APPROVED=YES`

`M2_REAL_CANDIDATE_INTAKE_AUTHORIZED=NO`

`M2_HMAC_KEY_CREATED=NO`

`M2_REAL_OPAQUE_IDS_ASSIGNED=NO`

`M2_REAL_SELECTION_EXECUTED=NO`

`M3_RESEARCH_EXECUTED=NO`

`REAL_EXECUTION_AUTHORIZED=NO`
