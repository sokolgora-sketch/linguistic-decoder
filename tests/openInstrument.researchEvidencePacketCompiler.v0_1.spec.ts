import fs from "node:fs";
import path from "node:path";

import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
  compileOpenInstrumentResearchEvidencePacketV0_1,
  OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1,
  parseOpenInstrumentResearchEvidencePacketV0_1,
} from "@/shared/openInstrumentResearchEvidencePacket.v0_1";
import {
  parseMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import {
  buildSourceAttestedFunctionalResearchInputGroupsV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import {
  validateCohortGEvidencePacketV0_1,
} from "@/tests/helpers/openInstrumentCohortGEvidencePacketValidator.v0_1";

const fixturePath = path.join(
  process.cwd(),
  "tests/fixtures/openInstrument/researchEvidencePacket.v0_1.json",
);

function fixture(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8")) as Record<string, unknown>;
}

function rowsFromFixture() {
  return compileOpenInstrumentResearchEvidencePacketInputV0_1(fixture());
}

describe("Open Instrument research evidence packet compiler v0.1", () => {
  it("parses the normalized reviewer-approved packet", () => {
    const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(fixture());
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.packet.packetVersion).toBe(
        OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1,
      );
      expect(parsed.packet.sources).toHaveLength(2);
    }
  });

  it("is byte-stable and independent of source input order", () => {
    const input = fixture();
    const reversed = {
      ...input,
      sources: [...(input.sources as unknown[])].reverse(),
    };

    const first = JSON.stringify({ rows: compileOpenInstrumentResearchEvidencePacketInputV0_1(input) });
    const second = JSON.stringify({ rows: compileOpenInstrumentResearchEvidencePacketInputV0_1(reversed) });
    expect(first).toBe(second);
    expect(first).not.toContain("createdAt");
  });

  it("generates stable distinct IDs and canonical ordering", () => {
    const rows = rowsFromFixture();
    expect(rows.map((row) => row.researchEvidenceId)).toEqual([
      "research.external.open-instrument-research-evidence-packet-v0-1.fixture-packet-compiler-v0-1.source-a",
      "research.external.open-instrument-research-evidence-packet-v0-1.fixture-packet-compiler-v0-1.source-b",
    ]);
    expect(new Set(rows.map((row) => row.researchEvidenceId)).size).toBe(2);
  });

  it.each([
    ["missing packet version", (value: Record<string, unknown>) => delete value.packetVersion],
    ["wrong packet version", (value: Record<string, unknown>) => { value.packetVersion = "wrong"; }],
    ["missing packet ID", (value: Record<string, unknown>) => delete value.packetId],
    ["missing target word", (value: Record<string, unknown>) => delete value.targetWord],
    ["missing target sense", (value: Record<string, unknown>) => delete value.targetSenseId],
    ["missing semantic bridge", (value: Record<string, unknown>) => delete value.semanticBridge],
    ["missing provenance", (value: Record<string, unknown>) => delete (value.sources as Array<Record<string, unknown>>)[0].citation.provenanceGroupId],
    ["missing citation metadata", (value: Record<string, unknown>) => delete (value.sources as Array<Record<string, unknown>>)[0].citation.entryLocator],
    ["citation form mismatch", (value: Record<string, unknown>) => { (value.sources as Array<Record<string, unknown>>)[0].citation.attestedForm = "different"; }],
    ["duplicate source key", (value: Record<string, unknown>) => { (value.sources as Array<Record<string, unknown>>)[1].sourceKey = "source-b"; }],
    ["duplicate citation ID", (value: Record<string, unknown>) => { (value.sources as Array<Record<string, unknown>>)[1].citation.citationId = "fixture.citation.b.v0_1"; }],
    ["malformed evidence family", (value: Record<string, unknown>) => { (value.sources as Array<Record<string, unknown>>)[0].evidenceFamily = "invented"; }],
    ["malformed relation", (value: Record<string, unknown>) => { (value.sources as Array<Record<string, unknown>>)[0].embryoRelation = "unsupported"; }],
    ["unsupported operation", (value: Record<string, unknown>) => { (value.sources as Array<Record<string, unknown>>)[0].relationOperationIds = ["invented_op"]; }],
    ["unsupported exact-form reduction", (value: Record<string, unknown>) => { (value.sources as Array<Record<string, unknown>>)[0].embryo = "GAMMA"; }],
  ])("fails closed for %s", (_name, mutate) => {
    const value = fixture();
    mutate(value);
    const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(value);
    expect(parsed.ok).toBe(false);
  });

  it("does not allow input to override compiler truth boundaries", () => {
    const value = fixture();
    (value.sources as Array<Record<string, unknown>>)[0].sourceStatus = "reviewed_candidate";
    const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(value);
    expect(parsed.ok).toBe(false);
  });

  it("emits rows accepted by the existing catalog parser and registry adapter", () => {
    const rows = rowsFromFixture();
    const parsedCatalog = parseMultiSourceFunctionalResearchEvidenceCatalogV0_1({
      catalogVersion: "open-instrument.multi-source-functional-research-evidence-catalog.v0_1",
      rows,
    });
    expect(parsedCatalog).toEqual(rows);
    expect(buildSourceAttestedFunctionalResearchInputGroupsV0_1({
      targetWord: "compiler-fixture",
      rows: parsedCatalog,
    })).toHaveLength(2);
  });

  it("sets only bounded research truth and never promotes the packet", () => {
    for (const row of rowsFromFixture()) {
      expect(row.attestationTruth).toBe("fact");
      expect(row.sourceStatus).toBe("research_candidate");
      expect(row.functionalHypotheses[0]).toMatchObject({
        targetWord: "compiler-fixture",
        targetSenseId: "fixture_exact_form",
        functionalBridgeTruth: "hypothesis",
        claimBoundary: "functional_hypothesis_only",
      });
      expect(row.historicalOriginClaim).toBe("not_claimed");
      expect(row.historicalTransmissionClaim).toBe("not_claimed");
      expect(row.winnerClaim).toBe("not_claimed");
      expect(row.languageSuperiorityClaim).toBe("not_claimed");
      expect(row.candidateTruthClaim).toBe("not_claimed");
      expect(row.userDecisionPosture).toBe("user_decides");
    }
  });

  it("passes the Cohort-G validator with two provenance groups", () => {
    const rows = rowsFromFixture();
    const result = validateCohortGEvidencePacketV0_1(rows, {
      targetWord: "compiler-fixture",
      targetSenseId: "fixture_exact_form",
      minimumRows: 2,
      minimumProvenanceGroups: 2,
    });
    expect(result.ready).toBe(true);
    expect(result.provenanceGroupIds).toEqual([
      "fixture-provenance-a",
      "fixture-provenance-b",
    ]);
  });

  it("does not treat repeated provenance as independent", () => {
    const value = fixture();
    (value.sources as Array<Record<string, unknown>>)[1].citation.provenanceGroupId =
      "fixture-provenance-b";
    const rows = compileOpenInstrumentResearchEvidencePacketInputV0_1(value);
    const result = validateCohortGEvidencePacketV0_1(rows, {
      targetWord: "compiler-fixture",
      targetSenseId: "fixture_exact_form",
      minimumRows: 2,
      minimumProvenanceGroups: 2,
    });
    expect(result.ready).toBe(false);
    expect(result.reasonCodes).toContain("minimum_provenance_groups_not_met");
  });

  it("matches the manually authored equivalent row shape", () => {
    const rows = rowsFromFixture();
    const manual = JSON.parse(JSON.stringify(rows));
    expect(compileOpenInstrumentResearchEvidencePacketV0_1(
      parseOpenInstrumentResearchEvidencePacketV0_1(fixture()).ok
        ? parseOpenInstrumentResearchEvidencePacketV0_1(fixture()).packet
        : (() => { throw new Error("fixture must parse"); })(),
    )).toEqual(manual);
  });
});
