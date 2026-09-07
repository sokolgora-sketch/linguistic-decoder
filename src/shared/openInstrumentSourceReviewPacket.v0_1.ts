import type {
  OpenInstrumentNormalizedSourceCandidateV0_1,
} from "./openInstrumentSourceAdapter.v0_1";
import {
  OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1,
  parseOpenInstrumentResearchEvidencePacketV0_1,
  type OpenInstrumentResearchEvidencePacketV0_1,
  type OpenInstrumentResearchEvidencePacketSourceV0_1,
} from "./openInstrumentResearchEvidencePacket.v0_1";
import { normalizeToAllowedOpId } from "./ops/allowedOps.v0.1";

export const OPEN_INSTRUMENT_SOURCE_REVIEW_PACKET_VERSION_V0_1 =
  "open-instrument.source-review-packet.v0_1" as const;

export type OpenInstrumentSourceReviewDecisionV0_1 =
  | "pending"
  | "accepted"
  | "rejected";

export type OpenInstrumentSourceReviewSuggestionV0_1 =
  | "SUGGESTED_REVIEW_REQUIRED"
  | "HUMAN_AUTHORED";

export type OpenInstrumentSourceReviewFieldV0_1<T> = {
  value: T | null;
  decision: OpenInstrumentSourceReviewDecisionV0_1;
  suggestionStatus: OpenInstrumentSourceReviewSuggestionV0_1;
};

export type OpenInstrumentSourceReviewPacketSourceV0_1 = {
  sourceKey: string;
  evidenceFamily: OpenInstrumentResearchEvidencePacketSourceV0_1["evidenceFamily"] | null;
  language: string | null;
  form: string | null;
  gloss: string | null;
  citation: OpenInstrumentNormalizedSourceCandidateV0_1["citation"];
  proposedEmbryo: OpenInstrumentSourceReviewFieldV0_1<string>;
  proposedEmbryoRelation: OpenInstrumentSourceReviewFieldV0_1<
    OpenInstrumentResearchEvidencePacketSourceV0_1["embryoRelation"]
  >;
  proposedRelationOperationIds: OpenInstrumentSourceReviewFieldV0_1<readonly string[]>;
  sourceReviewDecision: OpenInstrumentSourceReviewDecisionV0_1;
};

export type OpenInstrumentSourceReviewPacketV0_1 = {
  reviewVersion: typeof OPEN_INSTRUMENT_SOURCE_REVIEW_PACKET_VERSION_V0_1;
  reviewPacketId: string;
  targetWord: string;
  targetSenseId: OpenInstrumentSourceReviewFieldV0_1<string>;
  semanticBridge: OpenInstrumentSourceReviewFieldV0_1<string>;
  sources: readonly OpenInstrumentSourceReviewPacketSourceV0_1[];
  provenanceIndependenceDecision: OpenInstrumentSourceReviewDecisionV0_1;
  overallDecision: OpenInstrumentSourceReviewDecisionV0_1;
};

export type FinalizeOpenInstrumentSourceReviewPacketResultV0_1 =
  | {
      ok: true;
      packet: OpenInstrumentResearchEvidencePacketV0_1;
    }
  | {
      ok: false;
      reasonCodes: readonly OpenInstrumentSourceReviewPacketReasonCodeV0_1[];
    };

export type OpenInstrumentSourceReviewPacketReasonCodeV0_1 =
  | "REVIEW_PACKET_INVALID"
  | "TARGET_SENSE_REVIEW_REQUIRED"
  | "TARGET_SENSE_REJECTED"
  | "SEMANTIC_BRIDGE_REVIEW_REQUIRED"
  | "SEMANTIC_BRIDGE_REJECTED"
  | "SOURCE_REVIEW_REQUIRED"
  | "SOURCE_REJECTED"
  | "EMBRYO_REVIEW_REQUIRED"
  | "PROVENANCE_INDEPENDENCE_REVIEW_REQUIRED"
  | "PROVENANCE_DUPLICATE"
  | "OVERALL_REVIEW_REQUIRED"
  | "OVERALL_REJECTED";

const EMBRYO_RELATIONS_V0_1 = [
  "exact_form",
  "authorized_transformation",
  "reconstructed_form",
  "phonetic_resemblance",
  "semantic_resemblance",
] as const;

function normalizeTextV0_1(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").trim();
  return normalized || null;
}

function sortReasonCodesV0_1(
  reasonCodes: Iterable<OpenInstrumentSourceReviewPacketReasonCodeV0_1>,
): OpenInstrumentSourceReviewPacketReasonCodeV0_1[] {
  return [...new Set(reasonCodes)].sort();
}

function suggestedFieldV0_1<T>(value: T | null): OpenInstrumentSourceReviewFieldV0_1<T> {
  return {
    value,
    decision: "pending",
    suggestionStatus: "SUGGESTED_REVIEW_REQUIRED",
  };
}

function humanFieldV0_1<T>(value: T | null): OpenInstrumentSourceReviewFieldV0_1<T> {
  return {
    value,
    decision: "pending",
    suggestionStatus: "HUMAN_AUTHORED",
  };
}

export function buildOpenInstrumentSourceReviewPacketV0_1(options: {
  reviewPacketId: string;
  targetWord: string;
  targetSenseId: string | null;
  semanticBridge: string | null;
  candidates: readonly OpenInstrumentNormalizedSourceCandidateV0_1[];
}): OpenInstrumentSourceReviewPacketV0_1 {
  return {
    reviewVersion: OPEN_INSTRUMENT_SOURCE_REVIEW_PACKET_VERSION_V0_1,
    reviewPacketId: options.reviewPacketId,
    targetWord: options.targetWord,
    targetSenseId: humanFieldV0_1(options.targetSenseId),
    semanticBridge: humanFieldV0_1(options.semanticBridge),
    sources: options.candidates.map((candidate) =>
      ({
        sourceKey: candidate.sourceKey,
        evidenceFamily: candidate.evidenceFamily,
        language: candidate.language,
        form: candidate.form,
        gloss: candidate.gloss,
        citation: candidate.citation,
        proposedEmbryo: suggestedFieldV0_1(candidate.form),
        proposedEmbryoRelation: suggestedFieldV0_1(
          candidate.form ? "exact_form" : null,
        ),
        proposedRelationOperationIds: suggestedFieldV0_1([]),
        sourceReviewDecision: "pending",
      }) satisfies OpenInstrumentSourceReviewPacketSourceV0_1,
    ),
    provenanceIndependenceDecision: "pending",
    overallDecision: "pending",
  };
}

function acceptedFieldV0_1<T>(
  field: OpenInstrumentSourceReviewFieldV0_1<T>,
): boolean {
  return field.decision === "accepted" && field.value !== null;
}

function sourceFactsAreUsableV0_1(
  source: OpenInstrumentSourceReviewPacketSourceV0_1,
): boolean {
  return Boolean(
    normalizeTextV0_1(source.sourceKey) &&
      source.evidenceFamily &&
      normalizeTextV0_1(source.language) &&
      normalizeTextV0_1(source.form) &&
      normalizeTextV0_1(source.gloss) &&
      source.citation &&
      normalizeTextV0_1(source.citation.citationId) &&
      normalizeTextV0_1(source.citation.provenanceGroupId) &&
      normalizeTextV0_1(source.citation.attestedForm) &&
      normalizeTextV0_1(source.citation.attestedGloss),
  );
}

function relationConfigurationIsValidV0_1(
  source: OpenInstrumentSourceReviewPacketSourceV0_1,
): boolean {
  const embryo = source.proposedEmbryo.value;
  const relation = source.proposedEmbryoRelation.value;
  const operationIds = source.proposedRelationOperationIds.value;

  if (
    !normalizeTextV0_1(embryo) ||
    !relation ||
    !(EMBRYO_RELATIONS_V0_1 as readonly string[]).includes(relation) ||
    !operationIds ||
    operationIds.some((operationId) => !normalizeToAllowedOpId(operationId))
  ) {
    return false;
  }

  if (relation === "exact_form") {
    return normalizeTextV0_1(embryo) === normalizeTextV0_1(source.form);
  }

  return relation !== "authorized_transformation" || operationIds.length > 0;
}

export function finalizeOpenInstrumentSourceReviewPacketV0_1(
  reviewPacket: OpenInstrumentSourceReviewPacketV0_1,
): FinalizeOpenInstrumentSourceReviewPacketResultV0_1 {
  const reasonCodes = new Set<OpenInstrumentSourceReviewPacketReasonCodeV0_1>();

  if (
    reviewPacket.reviewVersion !== OPEN_INSTRUMENT_SOURCE_REVIEW_PACKET_VERSION_V0_1 ||
    !normalizeTextV0_1(reviewPacket.reviewPacketId) ||
    !normalizeTextV0_1(reviewPacket.targetWord) ||
    reviewPacket.sources.length === 0
  ) {
    reasonCodes.add("REVIEW_PACKET_INVALID");
  }

  if (reviewPacket.targetSenseId.decision === "pending" || !acceptedFieldV0_1(reviewPacket.targetSenseId)) {
    reasonCodes.add(
      reviewPacket.targetSenseId.decision === "rejected"
        ? "TARGET_SENSE_REJECTED"
        : "TARGET_SENSE_REVIEW_REQUIRED",
    );
  }

  if (reviewPacket.semanticBridge.decision === "pending" || !acceptedFieldV0_1(reviewPacket.semanticBridge)) {
    reasonCodes.add(
      reviewPacket.semanticBridge.decision === "rejected"
        ? "SEMANTIC_BRIDGE_REJECTED"
        : "SEMANTIC_BRIDGE_REVIEW_REQUIRED",
    );
  }

  if (reviewPacket.provenanceIndependenceDecision !== "accepted") {
    reasonCodes.add("PROVENANCE_INDEPENDENCE_REVIEW_REQUIRED");
  }

  if (reviewPacket.overallDecision !== "accepted") {
    reasonCodes.add(
      reviewPacket.overallDecision === "rejected"
        ? "OVERALL_REJECTED"
        : "OVERALL_REVIEW_REQUIRED",
    );
  }

  const provenanceGroupIds = new Set<string>();
  const packetSources: OpenInstrumentResearchEvidencePacketSourceV0_1[] = [];

  for (const source of reviewPacket.sources) {
    if (!sourceFactsAreUsableV0_1(source)) {
      reasonCodes.add("REVIEW_PACKET_INVALID");
      continue;
    }

    if (source.sourceReviewDecision === "pending") {
      reasonCodes.add("SOURCE_REVIEW_REQUIRED");
    } else if (source.sourceReviewDecision === "rejected") {
      reasonCodes.add("SOURCE_REJECTED");
    }

    if (
      !acceptedFieldV0_1(source.proposedEmbryo) ||
      !acceptedFieldV0_1(source.proposedEmbryoRelation) ||
      !acceptedFieldV0_1(source.proposedRelationOperationIds)
    ) {
      reasonCodes.add("EMBRYO_REVIEW_REQUIRED");
    } else if (!relationConfigurationIsValidV0_1(source)) {
      reasonCodes.add("REVIEW_PACKET_INVALID");
    }

    const provenanceGroupId = normalizeTextV0_1(source.citation?.provenanceGroupId);
    if (!provenanceGroupId) {
      reasonCodes.add("REVIEW_PACKET_INVALID");
    } else if (provenanceGroupIds.has(provenanceGroupId)) {
      reasonCodes.add("PROVENANCE_DUPLICATE");
    } else {
      provenanceGroupIds.add(provenanceGroupId);
    }

    packetSources.push({
      sourceKey: source.sourceKey,
      embryo: source.proposedEmbryo.value ?? "",
      evidenceFamily: source.evidenceFamily ?? "other",
      language: source.language ?? "",
      form: source.form ?? "",
      gloss: source.gloss ?? "",
      embryoRelation: source.proposedEmbryoRelation.value ?? "exact_form",
      relationOperationIds: source.proposedRelationOperationIds.value ?? [],
      citation: source.citation!,
    });
  }

  if (reasonCodes.size > 0) {
    return { ok: false, reasonCodes: sortReasonCodesV0_1(reasonCodes) };
  }

  const parsed = parseOpenInstrumentResearchEvidencePacketV0_1({
    packetVersion: OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1,
    packetId: reviewPacket.reviewPacketId,
    targetWord: reviewPacket.targetWord,
    targetSenseId: reviewPacket.targetSenseId.value,
    semanticBridge: reviewPacket.semanticBridge.value,
    sources: packetSources,
  });

  if (!parsed.ok) {
    return {
      ok: false,
      reasonCodes: ["REVIEW_PACKET_INVALID"],
    };
  }

  return { ok: true, packet: parsed.packet };
}
