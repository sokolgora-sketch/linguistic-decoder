import type { MotivationDiscoveryCandidateV0_1VM } from "@/ui/telemetry/types";

export const MOTIVATION_DISCOVERY_PRESENTATION_AGGREGATION_SCHEMA_V0_1 =
  "open-instrument.motivation-discovery-presentation-aggregation.v0_1" as const;

export type MotivationDiscoveryAggregationKeyV0_1 = Readonly<{
  sourceFamilyId: string;
  normalizedSourceForm: string;
  candidateStatus: MotivationDiscoveryCandidateV0_1VM["candidateStatus"];
  sourceStatus: string;
  entryReason: string;
  structuralRelation: Readonly<{
    matchClassification: string;
    presentationClassification: string;
    matchedQuery: string;
    candidateEmbryo: string;
    voiceRelationship: string;
    reasonCodes: readonly string[];
    authorizedOperationIds: readonly string[];
    expansionOrCompositionChain: readonly string[];
  }>;
  representationCompatibility: string;
  carrierRelationship: string;
  reviewedFunctionalEvidenceAuthority: Readonly<{
    status: string;
    evidenceKind: string;
    reason: string | null;
  }>;
  functionalHypothesisAuthority: Readonly<{
    truthClassification: string;
    statement: string | null;
    reason: string | null;
  }>;
}>;

export type MotivationDiscoveryPrimaryWitnessV0_1 = Readonly<{
  schemaVersion: typeof MOTIVATION_DISCOVERY_PRESENTATION_AGGREGATION_SCHEMA_V0_1;
  primaryWitnessId: string;
  representative: MotivationDiscoveryCandidateV0_1VM;
  aggregationKey: MotivationDiscoveryAggregationKeyV0_1;
  records: readonly MotivationDiscoveryCandidateV0_1VM[];
}>;

export type MotivationDiscoveryAggregationMetricsV0_1 = Readonly<{
  rawCandidateRecordCount: number;
  primaryWitnessCount: number;
  aggregatedRecordCount: number;
  aggregationReductionRatio: number;
  aggregationReductionPercentage: number;
  evidenceLedgerRecordCount: number;
  recordsLost: number;
}>;

function normalizeSourceFormV0_1(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}
function sourceFamilyForKeyV0_1(
  candidate: MotivationDiscoveryCandidateV0_1VM,
): string {
  // Missing source-family metadata must never cause unrelated records to
  // over-merge. Production projections carry sourceTraditionId here; the
  // per-record fallback keeps legacy/malformed payloads separate.
  return candidate.sourceFact.sourceFamilyId ?? `__missing__:${candidate.sourceFact.sourceId}`;
}

function buildAggregationKeyV0_1(
  candidate: MotivationDiscoveryCandidateV0_1VM,
): MotivationDiscoveryAggregationKeyV0_1 {
  const comparison = candidate.structuralComparison;
  const interpretation = candidate.functionalInterpretation;
  return Object.freeze({
    sourceFamilyId: sourceFamilyForKeyV0_1(candidate),
    normalizedSourceForm: normalizeSourceFormV0_1(candidate.candidateForm),
    candidateStatus: candidate.candidateStatus,
    sourceStatus: candidate.sourceFact.sourceStatus,
    entryReason: comparison.matchReason.trim(),
    structuralRelation: Object.freeze({
      matchClassification: comparison.matchClassification,
      presentationClassification: comparison.presentationClassification,
      matchedQuery: comparison.matchedQuery,
      candidateEmbryo: candidate.candidateEmbryo,
      voiceRelationship: comparison.voiceRelationship,
      reasonCodes: Object.freeze([...comparison.reasonCodes]),
      authorizedOperationIds: Object.freeze([...comparison.authorizedOperationIds]),
      expansionOrCompositionChain: Object.freeze([...comparison.expansionOrCompositionChain]),
    }),
    representationCompatibility: comparison.representationCompatibility,
    carrierRelationship: comparison.consonantalCarrierRelationship,
    reviewedFunctionalEvidenceAuthority: Object.freeze({
      status: interpretation.status,
      evidenceKind: interpretation.evidenceKind,
      reason: interpretation.reason,
    }),
    functionalHypothesisAuthority: Object.freeze({
      truthClassification: interpretation.truthClassification,
      statement: interpretation.statement,
      reason: interpretation.reason,
    }),
  });
}

function aggregationKeyStringV0_1(
  key: MotivationDiscoveryAggregationKeyV0_1,
): string {
  return JSON.stringify(key);
}

function primaryWitnessIdV0_1(
  key: MotivationDiscoveryAggregationKeyV0_1,
): string {
  return `motivation-discovery-primary:${encodeURIComponent(aggregationKeyStringV0_1(key))}`;
}

export function aggregateMotivationDiscoveryCandidatesV0_1(
  candidates: readonly MotivationDiscoveryCandidateV0_1VM[],
): readonly MotivationDiscoveryPrimaryWitnessV0_1[] {
  const groups = new Map<
    string,
    {
      key: MotivationDiscoveryAggregationKeyV0_1;
      records: MotivationDiscoveryCandidateV0_1VM[];
    }
  >();

  for (const candidate of candidates) {
    const key = buildAggregationKeyV0_1(candidate);
    const keyString = aggregationKeyStringV0_1(key);
    const group = groups.get(keyString);
    if (group) {
      group.records.push(candidate);
    } else {
      groups.set(keyString, { key, records: [candidate] });
    }
  }

  return Object.freeze(
    [...groups.values()].map((group) =>
      Object.freeze({
        schemaVersion: MOTIVATION_DISCOVERY_PRESENTATION_AGGREGATION_SCHEMA_V0_1,
        primaryWitnessId: primaryWitnessIdV0_1(group.key),
        representative: group.records[0],
        aggregationKey: group.key,
        records: Object.freeze([...group.records]),
      }),
    ),
  );
}

export function measureMotivationDiscoveryAggregationV0_1(
  candidates: readonly MotivationDiscoveryCandidateV0_1VM[],
  primaryWitnesses: readonly MotivationDiscoveryPrimaryWitnessV0_1[] =
    aggregateMotivationDiscoveryCandidatesV0_1(candidates),
): MotivationDiscoveryAggregationMetricsV0_1 {
  const rawCandidateRecordCount = candidates.length;
  const primaryWitnessCount = primaryWitnesses.length;
  const aggregationReductionRatio = rawCandidateRecordCount === 0
    ? 0
    : 1 - primaryWitnessCount / rawCandidateRecordCount;
  return Object.freeze({
    rawCandidateRecordCount,
    primaryWitnessCount,
    aggregatedRecordCount: primaryWitnesses.reduce(
      (total, witness) => total + witness.records.length,
      0,
    ),
    aggregationReductionRatio,
    aggregationReductionPercentage: aggregationReductionRatio * 100,
    evidenceLedgerRecordCount: primaryWitnesses.reduce(
      (total, witness) => total + witness.records.length,
      0,
    ),
    recordsLost: rawCandidateRecordCount - primaryWitnesses.reduce(
      (total, witness) => total + witness.records.length,
      0,
    ),
  });
}
