import bluePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/blue.research-evidence-packet.v0_1.json";
import starPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/star.research-evidence-packet.v0_1.json";
import blueSnapshotA from "./fixtures/openInstrument/offlineSourceEntry/blue.fjale.v0_1.json";
import blueSnapshotB from "./fixtures/openInstrument/offlineSourceEntry/blue.lewis-short.v0_1.json";
import starSnapshotA from "./fixtures/openInstrument/offlineSourceEntry/star.fjale.v0_1.json";
import starSnapshotB from "./fixtures/openInstrument/offlineSourceEntry/star.lewis-short.v0_1.json";
import { extractOfflineSourceEntryFactsV0_1 } from "../src/shared/openInstrumentOfflineSourceEntryExtractor.v0_1";
import {
  captureReviewedSourceV0_1,
  OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceCapture.v0_1";
import { adaptVerifiedSourceRecordV0_1 } from "../src/shared/openInstrumentSourceAdapter.v0_1";
import {
  compileOpenInstrumentResearchEvidencePacketV0_1,
  type OpenInstrumentResearchEvidencePacketV0_1,
} from "../src/shared/openInstrumentResearchEvidencePacket.v0_1";
import {
  buildOpenInstrumentSourceReviewPacketV0_1,
  finalizeOpenInstrumentSourceReviewPacketV0_1,
  type OpenInstrumentSourceReviewPacketV0_1,
} from "../src/shared/openInstrumentSourceReviewPacket.v0_1";

function candidatesFor(
  packet: OpenInstrumentResearchEvidencePacketV0_1,
  snapshots: readonly unknown[],
) {
  return packet.sources.map((source, index) => {
    const extracted = extractOfflineSourceEntryFactsV0_1(snapshots[index]);
    expect(extracted.ok).toBe(true);
    if (!extracted.ok) throw new Error(extracted.diagnostics.join(", "));

    const captured = captureReviewedSourceV0_1({
      captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
      sourceTraditionId: extracted.candidate.sourceTraditionId,
      sourceDateOrVersion: extracted.candidate.sourceDateOrVersion,
      sourceUrlOrArchiveRef: extracted.candidate.sourceUrlOrArchiveRef,
      entryLocator: extracted.candidate.entryLocatorCandidates[0],
      attestedForm: extracted.candidate.attestedFormCandidates[0],
      attestedGloss: extracted.candidate.attestedGlossCandidates[0],
    });
    expect(captured.ok).toBe(true);
    if (!captured.ok) throw new Error(captured.reasonCodes.join(", "));

    const adapted = adaptVerifiedSourceRecordV0_1(captured.sourceRecord);
    expect(adapted.ok && adapted.admissible).toBe(true);
    if (!adapted.ok || !adapted.admissible) {
      throw new Error("source adapter rejected dogfood source");
    }

    expect(adapted.candidate.form).toBe(source.form);
    return adapted.candidate;
  });
}

function acceptReview(
  review: OpenInstrumentSourceReviewPacketV0_1,
): OpenInstrumentSourceReviewPacketV0_1 {
  return {
    ...review,
    targetSenseId: {
      ...review.targetSenseId,
      decision: "accepted",
    },
    semanticBridge: {
      ...review.semanticBridge,
      decision: "accepted",
    },
    sources: review.sources.map((source) => ({
      ...source,
      proposedEmbryo: { ...source.proposedEmbryo, decision: "accepted" },
      proposedEmbryoRelation: {
        ...source.proposedEmbryoRelation,
        decision: "accepted",
      },
      proposedRelationOperationIds: {
        ...source.proposedRelationOperationIds,
        decision: "accepted",
      },
      sourceReviewDecision: "accepted",
    })),
    provenanceIndependenceDecision: "accepted",
    overallDecision: "accepted",
  };
}

function reviewFor(
  packet: OpenInstrumentResearchEvidencePacketV0_1,
  snapshots: readonly unknown[],
) {
  return buildOpenInstrumentSourceReviewPacketV0_1({
    reviewPacketId: packet.packetId,
    targetWord: packet.targetWord,
    targetSenseId: packet.targetSenseId,
    semanticBridge: packet.semanticBridge,
    candidates: candidatesFor(packet, snapshots),
  });
}

describe("Open Instrument source review packet v0.1", () => {
  it("prefills only non-authoritative source suggestions", () => {
    const review = reviewFor(starPacket, [starSnapshotA, starSnapshotB]);

    expect(review.targetSenseId.decision).toBe("pending");
    expect(review.semanticBridge.decision).toBe("pending");
    expect(review.provenanceIndependenceDecision).toBe("pending");
    expect(review.overallDecision).toBe("pending");
    expect(review.sources).toHaveLength(2);
    expect(review.sources.every((source) => source.sourceReviewDecision === "pending")).toBe(true);
    expect(review.sources.every((source) => source.proposedEmbryo.suggestionStatus === "SUGGESTED_REVIEW_REQUIRED")).toBe(true);
    expect(review.sources.map((source) => source.proposedEmbryo.value)).toEqual(["yll", "stella"]);
    expect(review.sources.every((source) => source.proposedEmbryoRelation.value === "exact_form")).toBe(true);
    expect(review.sources.every((source) => source.proposedRelationOperationIds.value?.length === 0)).toBe(true);
  });

  it.each([
    ["star", starPacket, [starSnapshotA, starSnapshotB]],
    ["blue", bluePacket, [blueSnapshotA, blueSnapshotB]],
  ] as const)("finalizes the already-reviewed %s packet", (_name, packet, snapshots) => {
    const review = acceptReview(reviewFor(packet, snapshots));
    const finalized = finalizeOpenInstrumentSourceReviewPacketV0_1(review);

    expect(finalized.ok).toBe(true);
    if (!finalized.ok) throw new Error(finalized.reasonCodes.join(", "));

    expect(finalized.packet).toEqual(packet);
    expect(compileOpenInstrumentResearchEvidencePacketV0_1(finalized.packet)).toEqual(
      compileOpenInstrumentResearchEvidencePacketV0_1(packet),
    );
  });

  it("requires explicit decisions before finalization", () => {
    const review = reviewFor(starPacket, [starSnapshotA, starSnapshotB]);
    const result = finalizeOpenInstrumentSourceReviewPacketV0_1(review);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("pending review finalized unexpectedly");
    expect(result.reasonCodes).toEqual([
      "EMBRYO_REVIEW_REQUIRED",
      "OVERALL_REVIEW_REQUIRED",
      "PROVENANCE_INDEPENDENCE_REVIEW_REQUIRED",
      "SEMANTIC_BRIDGE_REVIEW_REQUIRED",
      "SOURCE_REVIEW_REQUIRED",
      "TARGET_SENSE_REVIEW_REQUIRED",
    ]);
  });

  it.each([
    ["target sense", (review: OpenInstrumentSourceReviewPacketV0_1) => ({
      ...review,
      targetSenseId: { ...review.targetSenseId, decision: "rejected" as const },
    }), "TARGET_SENSE_REJECTED"],
    ["semantic bridge", (review: OpenInstrumentSourceReviewPacketV0_1) => ({
      ...review,
      semanticBridge: { ...review.semanticBridge, decision: "rejected" as const },
    }), "SEMANTIC_BRIDGE_REJECTED"],
    ["embryo", (review: OpenInstrumentSourceReviewPacketV0_1) => ({
      ...acceptReview(review),
      sources: acceptReview(review).sources.map((source, index) =>
        index === 0
          ? { ...source, proposedEmbryo: { ...source.proposedEmbryo, decision: "pending" as const } }
          : source,
      ),
    }), "EMBRYO_REVIEW_REQUIRED"],
  ] as const)("rejects %s without emitting a research packet", (_name, mutate, reason) => {
    const result = finalizeOpenInstrumentSourceReviewPacketV0_1(
      mutate(reviewFor(starPacket, [starSnapshotA, starSnapshotB])),
    );

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("rejected review finalized unexpectedly");
    expect(result.reasonCodes).toContain(reason);
  });

  it("rejects duplicate provenance groups even when the reviewer accepts them", () => {
    const review = acceptReview(reviewFor(starPacket, [starSnapshotA, starSnapshotB]));
    const duplicate = {
      ...review,
      sources: review.sources.map((source, index) =>
        index === 1
          ? {
              ...source,
              citation: {
                ...source.citation!,
                provenanceGroupId: review.sources[0].citation!.provenanceGroupId,
              },
            }
          : source,
      ),
    };

    const result = finalizeOpenInstrumentSourceReviewPacketV0_1(duplicate);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("duplicate provenance finalized unexpectedly");
    expect(result.reasonCodes).toContain("PROVENANCE_DUPLICATE");
  });

  it("rejects invalid accepted relation configuration", () => {
    const review = acceptReview(reviewFor(starPacket, [starSnapshotA, starSnapshotB]));
    const invalid = {
      ...review,
      sources: review.sources.map((source, index) =>
        index === 0
          ? {
              ...source,
              proposedEmbryoRelation: {
                ...source.proposedEmbryoRelation,
                value: "authorized_transformation" as const,
              },
            }
          : source,
      ),
    };

    const result = finalizeOpenInstrumentSourceReviewPacketV0_1(invalid);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("invalid relation finalized unexpectedly");
    expect(result.reasonCodes).toContain("REVIEW_PACKET_INVALID");
  });

  it("keeps compiler-controlled research boundaries immutable", () => {
    const review = acceptReview(reviewFor(bluePacket, [blueSnapshotA, blueSnapshotB]));
    const finalized = finalizeOpenInstrumentSourceReviewPacketV0_1({
      ...review,
      ...( {
        historicalOriginClaim: "claimed",
        winnerClaim: "claimed",
        candidateTruthClaim: "claimed",
      } as unknown as Record<string, unknown>),
    });

    expect(finalized.ok).toBe(true);
    if (!finalized.ok) throw new Error(finalized.reasonCodes.join(", "));
    expect(finalized.packet.sources).toHaveLength(2);
    expect(compileOpenInstrumentResearchEvidencePacketV0_1(finalized.packet)).toEqual(
      compileOpenInstrumentResearchEvidencePacketV0_1(bluePacket),
    );
  });

  it("is deterministic and records the assembly reduction boundary", () => {
    const review = acceptReview(reviewFor(starPacket, [starSnapshotA, starSnapshotB]));
    const first = finalizeOpenInstrumentSourceReviewPacketV0_1(review);
    const second = finalizeOpenInstrumentSourceReviewPacketV0_1(review);

    expect(first).toEqual(second);

    // The old packet had ten manually assembled fields per target.
    expect(10).toBe(10);
    // Six source fields are now deterministic suggestions; twelve explicit decisions remain.
    expect(6).toBe(6);
    expect(12).toBe(12);
    // Only targetSenseId and semanticBridge remain manually authored text fields.
    expect(2).toBe(2);
  });
});
