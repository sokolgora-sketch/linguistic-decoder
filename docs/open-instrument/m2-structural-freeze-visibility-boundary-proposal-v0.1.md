# M2 Structural Freeze Visibility Boundary Proposal v0.1

Status: proposed implementation-boundary decision; not frozen authority.

## Scope

This proposal defines a synthetic-only separation between the controller-private
`M2_STRUCTURAL_EMBRYO_FREEZE` record and the existing operator-visible
`M2BlindPayloadV0_1`. It does not authorize real M2 selection, persistence,
research, reveal, M3 research, or production-evidence promotion.

## Authority interpretation

The frozen M2 preregistration requires the structural-freeze artifact to retain
`hypothesisId`, `embryo`, `voicePath`, `reductionSteps`, `expansionChain`,
`reasonCodes`, and `evidenceRefs`, while the existing `M2BlindPayloadV0_1` is a
narrower pre-reveal contract. The frozen rule
`containsTargetSemantics=false` does not, by itself, prohibit a sealed
controller record from retaining provenance. It does prohibit exposing target
semantics to the blind operator.

The current conclusion is therefore a bounded visibility interpretation, not a
change to the frozen scientific rule. The interpretation remains pending
separate authority review because the frozen materials do not themselves prove
the operating-system access boundary.

## Controller-private record

The proposed synthetic record is
`M2ControllerPrivateStructuralFreezeRecordV0_1`:

- `schemaVersion`
- `visibility=CONTROLLER_PRIVATE`
- `artifactId=M2_STRUCTURAL_EMBRYO_FREEZE`
- complete `StructuralHypothesisV0_1` provenance, including `hypothesisId`,
  `basis`, reduction steps, expansion chain, reason codes, and evidence refs
- `structuralFingerprint`, computed as SHA-256 of a domain-separated canonical
  serialization of only the authorized visible structural inputs:
  `structuralEmbryo` and its canonical Seven-Voice `voicePath`
- canonical UTF-8 byte length
- `controllerArtifactSha256`, computed over the canonical controller-private
  artifact envelope (with its checksum fields excluded to avoid circularity)
- `controllerArtifactByteLength`, the exact byte length of that envelope

The complete record is available only through the explicitly controller-side
record-builder function. It is not returned as a field of the operator-facing
builder result or projection result. The record is held in memory by the
synthetic builder; this proposal adds no filesystem persistence.

## Operator-visible projection

The operator receives only the existing `M2BlindPayloadV0_1` shape:

- schema version and synthetic opaque case ID
- structural embryo and structural fingerprint
- canonical Seven-Voice path, including Y when present
- supplied source-universe, search-policy, stop-rule, and claim-boundary IDs
- `targetRevealStatus=FORBIDDEN_UNTIL_REVEAL_GATE`

The projection does not contain the complete hypothesis, `hypothesisId`,
original lexical basis, reduction steps, expansion chain, evidence references,
or target-sense fields. Its exact allowlist is validated at runtime, copied
into a fresh operator object, and serialized only after validation. Extra
enumerable, non-enumerable, or symbol keys are rejected. A runtime key/value
validator fails closed and returns reason codes only; it does not log private
values. Failed projections and operator-facing results never retain a
controller-private record field, so object enumeration, spreading, and JSON
serialization cannot expose the private structural material through this
boundary.

## Integrity relationship

The operator projection's `structuralFingerprint` must equal the fingerprint
of the authorized visible structural inputs in the controller-private record:
the exact `structuralEmbryo` and canonical Seven-Voice `voicePath`, serialized
under `open-instrument.m2.shared-structural-fingerprint.v0.1`. It must not
include `basis`, `hypothesisId`, reduction history, expansion chain, source
sense, or other controller-private fields.

The controller-private `controllerArtifactSha256` is computed over the
canonical private artifact envelope and therefore commits to the complete
structural hypothesis and its provenance. Private-only provenance changes can
leave the shared fingerprint unchanged while changing this private artifact
checksum. The projection's canonical payload bytes receive a third, separate
deterministic `payloadSha256` and byte length.

These are three different identities: `structuralFingerprint` identifies the
authorized shared structural projection, `controllerArtifactSha256` identifies
the controller-private canonical artifact envelope, and `payloadSha256`
identifies the operator-visible payload bytes. The shared structural
fingerprint is an integrity/link identifier, not a confidentiality mechanism;
even a projection-only fingerprint does not hide an enumerable embryo, and
hashes do not prevent enumeration or disclosure from another available
channel. Any tampered private record, invalid synthetic context, extra key,
forbidden key, or forbidden value blocks projection.

Structural order is preserved: the existing first selected hypothesis is used
without reranking. Structural Null remains Null and does not trigger candidate
replacement. No semantic result, target identity, or winner claim is inferred.

## Remaining required authority

This proposal does not prove that a real isolated operator cannot access the
controller-private record. Before real M2 execution, a separately reviewed
boundary must define and verify:

1. The sealed controller storage and transport boundary.
2. The exact operator-facing serialization boundary.
3. The process/filesystem access proof preventing private-record access.
4. Hash-manifest and reveal-gate integration for any persisted artifact.

The synthetic projection is implementation evidence only. It is not proof of
macOS Seatbelt isolation, worker isolation, real-target blindness, or research
authorization.

## Decision

`M2_SYNTHETIC_VISIBILITY_BOUNDARY=PROPOSED_PENDING_AUTHORITY_REVIEW`

`M2_REAL_STRUCTURAL_FREEZE_AUTHORIZED=NO`

`REAL_M2_TARGET_SELECTED=NO`

`M3_RESEARCH_EXECUTED=NO`

`REAL_EXECUTION_AUTHORIZED=NO`
