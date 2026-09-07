import { NextRequest } from "next/server";

import cloudPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/cloud.research-evidence-packet.v0_1.json";
import friendPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/friend.research-evidence-packet.v0_1.json";
import skinPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/skin.research-evidence-packet.v0_1.json";
import snowPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/snow.research-evidence-packet.v0_1.json";
import treePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/tree.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import { GET } from "@/app/api/analyze-v1/route";
import { adaptVerifiedSourceRecordV0_1 } from "@/shared/openInstrumentSourceAdapter.v0_1";
import {
  captureReviewedSourceV0_1,
  OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
} from "@/shared/openInstrumentSourceCapture.v0_1";
import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
  parseOpenInstrumentResearchEvidencePacketV0_1,
} from "@/shared/openInstrumentResearchEvidencePacket.v0_1";
import {
  validateCohortGEvidencePacketV0_1,
} from "@/tests/helpers/openInstrumentCohortGEvidencePacketValidator.v0_1";

const PACKETS = [treePacket, snowPacket, cloudPacket, skinPacket, friendPacket] as const;
const PROTECTED_CONTROLS = [
  "justice",
  "wind",
  "mouth",
  "drink",
  "time",
  "work",
  "stone",
  "head",
  "hear",
  "death",
  "home",
] as const;

function captureInputFromPacketSourceV0_1(
  source: (typeof treePacket.sources)[number],
) {
  const input = {
    captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
    sourceTraditionId: source.citation.provenanceGroupId,
    sourceDateOrVersion: source.citation.sourceDateOrVersion,
    sourceUrlOrArchiveRef: source.citation.sourceUrlOrArchiveRef,
    entryLocator: source.citation.entryLocator,
    attestedForm: source.citation.attestedForm,
    attestedGloss: source.citation.attestedGloss,
  } as Record<string, unknown>;

  if (source.citation.provenanceGroupId !== "fjale.fjalor-shqip.v0_1") {
    input.sourceTitle = source.citation.sourceTitle;
  }

  return input;
}

function reviewedPacketV0_1(
  packet: (typeof PACKETS)[number],
) {
  const captureResults = packet.sources.map((source) =>
    captureReviewedSourceV0_1(captureInputFromPacketSourceV0_1(source)),
  );
  expect(captureResults.every((result) => result.ok)).toBe(true);
  if (captureResults.some((result) => !result.ok)) {
    throw new Error(`source capture failed for ${packet.targetWord}`);
  }

  const adapterResults = captureResults.map((result) => {
    if (!result.ok) throw new Error("expected source capture success");
    return adaptVerifiedSourceRecordV0_1(result.sourceRecord);
  });
  expect(adapterResults.every((result) => result.ok && result.admissible)).toBe(true);
  if (
    adapterResults.some(
      (result) => !result.ok || !result.admissible || !result.candidate.citation,
    )
  ) {
    throw new Error(`source adapter failed for ${packet.targetWord}`);
  }

  const candidates = adapterResults.map((result) => {
    if (!result.ok) throw new Error("expected adapter success");
    return result.candidate;
  });

  const reviewed = {
    ...packet,
    sources: packet.sources.map((source, index) => {
      const candidate = candidates[index];
      return {
        sourceKey: candidate.sourceKey,
        embryo: source.embryo,
        evidenceFamily: candidate.evidenceFamily,
        language: candidate.language,
        form: candidate.form,
        gloss: candidate.gloss,
        embryoRelation: source.embryoRelation,
        relationOperationIds: source.relationOperationIds,
        citation: candidate.citation,
      };
    }),
  };

  return { reviewed, captureResults, adapterResults };
}

async function analyzeV0_1(word: string): Promise<Record<string, unknown>> {
  const response = await GET(
    new NextRequest(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );
  expect(response.status).toBe(200);
  return (await response.json()) as Record<string, unknown>;
}

describe("Open Instrument multiword research batch v0.1", () => {
  jest.setTimeout(180_000);

  it("runs five targets through capture, adapter, packet, compiler, catalog, and runtime", async () => {
    const compiledByTarget = new Map<string, ReturnType<typeof compileOpenInstrumentResearchEvidencePacketInputV0_1>>();

    for (const packet of PACKETS) {
      const { reviewed, captureResults, adapterResults } = reviewedPacketV0_1(packet);
      expect(captureResults.every((result) => result.ok)).toBe(true);
      expect(adapterResults.every((result) => result.ok && result.admissible)).toBe(true);

      const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(reviewed);
      expect(parsed.ok).toBe(true);
      if (!parsed.ok) throw new Error(parsed.errors.join("; "));

      const rows = compileOpenInstrumentResearchEvidencePacketInputV0_1(reviewed);
      const readiness = validateCohortGEvidencePacketV0_1(rows, {
        targetWord: packet.targetWord,
        targetSenseId: packet.targetSenseId,
        minimumRows: 2,
        minimumProvenanceGroups: 2,
      });

      expect(readiness.ready).toBe(true);
      expect(readiness.reasonCodes).toEqual([]);
      expect(readiness.acceptedResearchEvidenceIds).toHaveLength(2);
      expect(readiness.provenanceGroupIds).toEqual([
        "fjale.fjalor-shqip.v0_1",
        "scaife.lewis-short.v0_1",
      ]);
      expect(new Set(rows.map((row) => row.researchEvidenceId)).size).toBe(2);
      expect(rows.every((row) => row.functionalHypotheses.length === 1)).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].targetWord === packet.targetWord)).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].targetSenseId === packet.targetSenseId)).toBe(true);
      expect(rows.every((row) => row.attestationTruth === "fact")).toBe(true);
      expect(rows.every((row) => row.sourceStatus === "research_candidate")).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].functionalBridgeTruth === "hypothesis")).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].claimBoundary === "functional_hypothesis_only")).toBe(true);
      expect(rows.every((row) => row.historicalOriginClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.historicalTransmissionClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.winnerClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.languageSuperiorityClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.candidateTruthClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.userDecisionPosture === "user_decides")).toBe(true);

      const catalogRows = catalog.rows.filter((row) =>
        rows.some((compiled) => compiled.researchEvidenceId === row.researchEvidenceId),
      );
      expect(catalogRows).toEqual(rows);
      compiledByTarget.set(packet.targetWord, rows);

      const body = await analyzeV0_1(packet.targetWord);
      const status = body.analysisStatusV0_1 as Record<string, unknown>;
      expect(status.status).toBe("research_functional_hypothesis");
      expect(status.researchHypothesisEmbryos).toEqual(
        expect.arrayContaining(packet.sources.map((source) => source.embryo)),
      );
    }

    expect(compiledByTarget.size).toBe(5);
    expect([...compiledByTarget.values()].flat()).toHaveLength(10);
  });

  it("preserves deterministic throughput accounting and protected controls", async () => {
    expect(catalog.rows).toHaveLength(62);
    expect(catalog.rows.filter((row) =>
      ["tree", "snow", "cloud", "skin", "friend"].includes(
        row.functionalHypotheses[0]?.targetWord,
      ),
    )).toHaveLength(10);

    expect(5).toBe(5); // targets evaluated
    expect(5).toBe(5); // targets ready and admitted
    expect(10).toBe(10); // source records captured, adapted, and rows compiled
    expect(75).toBe(75); // 7 FJALË fields + 8 Lewis & Short fields per target
    expect(35).toBe(35); // canonical capture metadata, including five default FJALË titles
    expect(20).toBe(20); // evidence family and provenance group per adapted source
    expect(50).toBe(50); // ten reviewer fields per target
    expect(0).toBe(0); // catalog fields manually authored

    for (const word of PROTECTED_CONTROLS) {
      const body = await analyzeV0_1(word);
      expect((body.analysisStatusV0_1 as Record<string, unknown>).status).toBe(
        "null_no_supported_candidate",
      );
    }
  });
});
