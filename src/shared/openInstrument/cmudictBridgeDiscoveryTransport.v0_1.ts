import {
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1,
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1,
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1,
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1,
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_DOMAIN_V0_1,
  CMUDICT_REPRESENTATION_BRIDGE_AUTHORITY_BOUNDARY_V0_1,
  projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1,
  type CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1,
  type CmuDictCandidateProductionSpokenRepresentationBridgeStatusV0_1,
  type CmuDictCandidateProductionSpokenRepresentationBridgeV0_1,
  type CmuDictCandidateProductionSpokenRepresentationBridgeVariantPairV0_1,
} from "./cmudictCandidateProductionSpokenRepresentationBridge.v0_1";
import type { CmuDictCandidateGammaProjectionV0_1 } from "./cmudictCandidateGammaProjection.v0_1";
import type { CmuDictCandidateVoiceProjectionV0_1 } from "./cmudictCandidateVoiceProjection.v0_1";
import type { CmuDictCandidateZcProjectionV0_1 } from "./cmudictCandidateZcProjection.v0_1";
import type { CmuDictProductionSpokenBridgePrerequisitesV0_1 } from "./cmudictProductionSpokenBridgePrerequisites.v0_1";

export const CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_SCHEMA_V0_1 =
  "open-instrument.cmudict-bridge-discovery-transport.v0_1" as const;
export const CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1 =
  "open-instrument.cmudict-bridge-discovery-transport.unit.v0_1" as const;
export const CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_AUTHORITY_BOUNDARY_V0_1 =
  "EVIDENCE_ONLY_NO_DISCOVERY_CONSUMER_NO_FOUR_GATE_AUTHORITY" as const;
export const CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_CONSUMER_V0_1 =
  "NONE" as const;

export type CmuDictBridgeDiscoveryTransportUnitV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1;
  bridgeVariantPairSchemaVersion: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_VARIANT_PAIR_SCHEMA_V0_1;
  pair: CmuDictCandidateProductionSpokenRepresentationBridgeVariantPairV0_1;
}>;

export type CmuDictBridgeDiscoveryTransportEnvelopeV0_1 = Readonly<{
  schemaVersion: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_SCHEMA_V0_1;
  unitSchemaVersion: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1;
  bridgeSchemaVersion: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1;
  bridgeProjectorId: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1;
  bridgeStatus: CmuDictCandidateProductionSpokenRepresentationBridgeStatusV0_1;
  bridgeReason: CmuDictCandidateProductionSpokenRepresentationBridgeReasonCodeV0_1 | null;
  preservedBridgeAuthorityTag: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1;
  candidateLedger: CmuDictCandidateVoiceProjectionV0_1 | null;
  productionLedger: CmuDictProductionSpokenBridgePrerequisitesV0_1 | null;
  candidateGammaProjection: CmuDictCandidateGammaProjectionV0_1 | null;
  candidateZcProjection: CmuDictCandidateZcProjectionV0_1 | null;
  units: readonly CmuDictBridgeDiscoveryTransportUnitV0_1[];
  exactArtifactIdentity: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["exactArtifactIdentity"];
  sourceRevision: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["sourceRevision"];
  notation: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["notation"];
  profile: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["profile"];
  normalizationIdentity: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["normalizationIdentity"];
  parserIdentity: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["parserIdentity"];
  mappingIdentity: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["mappingIdentity"];
  mappingTable: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["mappingTable"];
  representationDomain: typeof CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_DOMAIN_V0_1;
  variantCardinality: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["variantCardinality"];
  provenanceCompleteness: boolean;
  annotationEligibility: CmuDictCandidateProductionSpokenRepresentationBridgeV0_1["annotationEligibility"];
  bridgeAuthorityBoundary: typeof CMUDICT_REPRESENTATION_BRIDGE_AUTHORITY_BOUNDARY_V0_1;
  authorityBoundary: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_AUTHORITY_BOUNDARY_V0_1;
  consumer: typeof CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_CONSUMER_V0_1;
}>;

type RecordValue = Record<string, unknown>;

function isRecordV0_1(value: unknown): value is RecordValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function deepCloneAndFreezeV0_1<T>(
  value: T,
  seen = new WeakMap<object, unknown>(),
): T {
  if (value === null || typeof value !== "object") return value;
  const existing = seen.get(value);
  if (existing !== undefined) return existing as T;
  if (Array.isArray(value)) {
    const copy: unknown[] = [];
    seen.set(value, copy);
    for (const child of value) copy.push(deepCloneAndFreezeV0_1(child, seen));
    return Object.freeze(copy) as T;
  }
  const copy: RecordValue = {};
  seen.set(value, copy);
  for (const [key, child] of Object.entries(value)) {
    copy[key] = deepCloneAndFreezeV0_1(child, seen);
  }
  return Object.freeze(copy) as T;
}

function sameDataV0_1(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => sameDataV0_1(value, right[index]))
    );
  }
  if (!isRecordV0_1(left) || !isRecordV0_1(right)) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key, index) =>
        key === rightKeys[index] && sameDataV0_1(left[key], right[key]),
    )
  );
}

function validNullableBridgeV0_1(
  value: RecordValue,
): value is CmuDictCandidateProductionSpokenRepresentationBridgeV0_1 {
  const canonicalNull =
    projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(null);
  const candidateLedger = value.candidateLedger;
  const productionLedger = value.productionLedger;
  const candidateValid =
    candidateLedger === null ||
    (isRecordV0_1(candidateLedger) &&
      sameDataV0_1(
        projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1({
          candidateVoiceProjection: candidateLedger,
          productionPrerequisites: null,
        }).candidateLedger,
        candidateLedger,
      ));
  const productionValid =
    productionLedger === null || isRecordV0_1(productionLedger);
  const candidateVariantCount =
    isRecordV0_1(candidateLedger) && Array.isArray(candidateLedger.variants)
      ? candidateLedger.variants.length
      : 0;
  const productionVariantCount =
    isRecordV0_1(productionLedger) && Array.isArray(productionLedger.variants)
      ? productionLedger.variants.length
      : 0;
  if (
    value.status !== "NULL" ||
    typeof value.reasonCode !== "string" ||
    !Array.isArray(value.variantPairs) ||
    value.variantPairs.length !== 0 ||
    value.candidateGammaProjection !== null ||
    value.candidateZcProjection !== null ||
    !candidateValid ||
    !productionValid ||
    value.exactArtifactIdentity === null ||
    !isRecordV0_1(value.exactArtifactIdentity) ||
    value.exactArtifactIdentity.sourcePath !==
      canonicalNull.exactArtifactIdentity.sourcePath ||
    value.exactArtifactIdentity.bytes !== canonicalNull.exactArtifactIdentity.bytes ||
    value.exactArtifactIdentity.sha256 !== canonicalNull.exactArtifactIdentity.sha256 ||
    value.exactArtifactIdentity.verifiedOnBothLedgers !== false ||
    value.provenanceCompleteness !== false ||
    !isRecordV0_1(value.variantCardinality) ||
    value.variantCardinality.candidate !== candidateVariantCount ||
    value.variantCardinality.production !== productionVariantCount ||
    value.variantCardinality.paired !== 0 ||
    value.variantCardinality.oneToOne !== false ||
    value.variantCardinality.recordsLost !== 0
  ) {
    return false;
  }
  if (isRecordV0_1(productionLedger)) {
    if (
      !sameDataV0_1(
        projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1({
          candidateVoiceProjection: null,
          productionPrerequisites: productionLedger,
        }).productionLedger,
        productionLedger,
      )
    ) {
      return false;
    }
  }
  return true;
}

function validBridgeV0_1(
  value: unknown,
): value is CmuDictCandidateProductionSpokenRepresentationBridgeV0_1 {
  if (!isRecordV0_1(value)) return false;
  if (
    value.schemaVersion !==
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_SCHEMA_V0_1 ||
    value.projectorId !==
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_PROJECTOR_ID_V0_1 ||
    value.runtimeAuthorityTag !==
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1 ||
    value.representationDomain !==
      CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_DOMAIN_V0_1
  ) {
    return false;
  }
  if (
    value.candidateLedger === null &&
    value.productionLedger === null
  ) {
    return sameDataV0_1(
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(null),
      value,
    );
  }
  if (
    (value.candidateLedger !== null && !isRecordV0_1(value.candidateLedger)) ||
    (value.productionLedger !== null && !isRecordV0_1(value.productionLedger))
  ) {
    return false;
  }
  if (
    value.candidateLedger === null ||
    value.productionLedger === null
  ) {
    return validNullableBridgeV0_1(value);
  }
  const rebuilt =
    projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1({
      candidateVoiceProjection: value.candidateLedger,
      productionPrerequisites: value.productionLedger,
      candidateGammaProjection: value.candidateGammaProjection ?? null,
      candidateZcProjection: value.candidateZcProjection ?? null,
    });
  return sameDataV0_1(rebuilt, value);
}

export function projectCmuDictBridgeDiscoveryTransportV0_1(
  input: unknown,
): CmuDictBridgeDiscoveryTransportEnvelopeV0_1 | null {
  try {
    if (!validBridgeV0_1(input)) return null;
    return deepCloneAndFreezeV0_1({
      schemaVersion: CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_SCHEMA_V0_1,
      unitSchemaVersion: CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1,
      bridgeSchemaVersion: input.schemaVersion,
      bridgeProjectorId: input.projectorId,
      bridgeStatus: input.status,
      bridgeReason: input.reasonCode,
      preservedBridgeAuthorityTag: input.runtimeAuthorityTag,
      candidateLedger: input.candidateLedger,
      productionLedger: input.productionLedger,
      candidateGammaProjection: input.candidateGammaProjection,
      candidateZcProjection: input.candidateZcProjection,
      units: input.variantPairs.map((pair) => ({
        schemaVersion: CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1,
        bridgeVariantPairSchemaVersion: pair.schemaVersion,
        pair,
      })),
      exactArtifactIdentity: input.exactArtifactIdentity,
      sourceRevision: input.sourceRevision,
      notation: input.notation,
      profile: input.profile,
      normalizationIdentity: input.normalizationIdentity,
      parserIdentity: input.parserIdentity,
      mappingIdentity: input.mappingIdentity,
      mappingTable: input.mappingTable,
      representationDomain: input.representationDomain,
      variantCardinality: input.variantCardinality,
      provenanceCompleteness: input.provenanceCompleteness,
      annotationEligibility: input.annotationEligibility,
      bridgeAuthorityBoundary: input.authorityBoundary,
      authorityBoundary:
        CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_AUTHORITY_BOUNDARY_V0_1,
      consumer: CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_CONSUMER_V0_1,
    });
  } catch {
    return null;
  }
}
