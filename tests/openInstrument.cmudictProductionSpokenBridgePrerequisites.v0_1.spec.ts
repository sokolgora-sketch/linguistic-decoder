import fs from "node:fs";

import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
} from "@/shared/openInstrument/cmudictArpabetPronunciation.v0_1";
import {
  normalizeEnglishLexicalJoinKeyV0_1,
} from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";
import {
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1,
  CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SCHEMA_V0_1,
  auditCmuDictNormalizationDomainV0_1,
  buildCmuDictProductionSpokenBridgePrerequisitesV0_1,
  validateCmuDictProductionSpokenBridgePrerequisitesV0_1,
} from "@/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1";

const SOURCE_PATH = "src/data/openInstrument/pronunciation/cmudict.dict";

describe("CMUdict production spoken bridge prerequisites v0.1", () => {
  it("exposes the exact production envelope identity and authority", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone");

    expect(result).toMatchObject({
      schemaVersion: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_SCHEMA_V0_1,
      projectorId: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PROJECTOR_ID_V0_1,
      representationKind: "production_spoken",
      originalLexicalInput: "stone",
      productionNormalizedLexicalKey: "stone",
      sourcePath: SOURCE_PATH,
      artifactBytes: CMUDICT_DATA_BYTES_V0_1,
      artifactSha256: CMUDICT_DATA_SHA256_V0_1,
      sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
      sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
      sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
      artifactIdentityVerified: true,
      voiceMappingId: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_ID_V0_1,
      voiceMappingTable: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_MAPPING_TABLE_V0_1,
      normalizationIdentity:
        CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_NORMALIZATION_IDENTITY_V0_1,
      parserIdentity: CMUDICT_PRODUCTION_SPOKEN_BRIDGE_PREREQUISITES_PARSER_IDENTITY_V0_1,
      status: "defined",
      reasonCode: null,
    });
    expect(result.variants).toHaveLength(1);
  });

  it("preserves production normalization provenance without candidate comparison", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("  STONE  ");
    expect(result.originalLexicalInput).toBe("  STONE  ");
    expect(result.productionNormalizedLexicalKey).toBe("stone");
    expect(JSON.stringify(result)).not.toContain("NORMALIZATION_COMPATIBLE");
    expect(JSON.stringify(result)).not.toContain("BRIDGE_COMPATIBLE");
    expect(JSON.stringify(result)).not.toContain("SAME_REPRESENTATION");
  });

  it("keeps candidate and production lexical policies independently observable", () => {
    expect(normalizeEnglishLexicalJoinKeyV0_1(" stone")).toBe(" stone");
    expect(normalizeEnglishLexicalJoinKeyV0_1("stone ")).toBe("stone ");
    expect(buildCmuDictProductionSpokenBridgePrerequisitesV0_1(" stone").productionNormalizedLexicalKey).toBe("stone");
    expect(buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone ").productionNormalizedLexicalKey).toBe("stone");
    expect(normalizeEnglishLexicalJoinKeyV0_1("Cafe\u0301")).toBe("café");
  });

  it("preserves physical locator, raw line, source units, and moving nuclei", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone");
    const variant = result.variants[0];
    expect(variant).toBeDefined();
    expect(variant.physicalEvidence.sourceLineNumber).toBeGreaterThan(0);
    expect(variant.physicalEvidence.rawSourceLine).toBe("stone S T OW1 N");
    expect(variant.physicalEvidence.sourceForm).toBe("stone");
    expect(variant.physicalEvidence.variantId).toBe("1");
    expect(variant.physicalEvidence.variantOrder).toBe(0);
    expect(variant.rawProductionPronunciation).toBe("S T OW1 N");
    expect(variant.orderedProductionSourceUnits).toEqual(["S", "T", "OW1", "N"]);
    expect(variant.nuclei[0]).toMatchObject({
      baseCategory: "OW",
      kind: "moving_nucleus",
    });
    expect(variant.canonicalVoicePath).toEqual(["O", "U"]);
  });

  it("marks all terminal opaque annotation records bridge-ineligible", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("aalborg");
    const variant = result.variants[0];
    expect(variant.physicalEvidence.rawSourceLine).toBe(
      "aalborg AO1 L B AO0 R G # place, danish",
    );
    expect(variant.physicalEvidence.rawPhysicalPronunciation).toBe(
      "AO1 L B AO0 R G",
    );
    expect(variant.rawProductionPronunciation).toBe(
      "AO1 L B AO0 R G # place, danish",
    );
    expect(variant.orderedProductionSourceUnits).toEqual([
      "AO1",
      "L",
      "B",
      "AO0",
      "R",
      "G",
      "#",
      "place,",
      "danish",
    ]);
    expect(variant.annotationContamination).toEqual({
      detected: true,
      opaqueAnnotationText: "place, danish",
      eligibility: "INELIGIBLE_FOR_FUTURE_BRIDGE_EVALUATION",
    });
    expect(result.physicalEvidenceIndex.annotatedRecordCount).toBe(22);
  });

  it("marks every frozen annotated physical record without collapsing records", () => {
    const annotatedBaseForms = new Set(
      fs
        .readFileSync(SOURCE_PATH, "utf8")
        .split(/\r?\n/u)
        .filter((line) => line.includes(" # "))
        .map((line) => line.trim().split(/\s+/u)[0].replace(/\(\d+\)$/u, "")),
    );
    const annotatedEvidence = [...annotatedBaseForms].flatMap((sourceForm) =>
      buildCmuDictProductionSpokenBridgePrerequisitesV0_1(sourceForm).variants.filter(
        (variant) => variant.annotationContamination.detected,
      ),
    );
    expect(annotatedEvidence).toHaveLength(22);
    expect(
      annotatedEvidence.every(
        (variant) =>
          variant.annotationContamination.eligibility ===
          "INELIGIBLE_FOR_FUTURE_BRIDGE_EVALUATION",
      ),
    ).toBe(true);
  });

  it("preserves ordered duplicate physical variants without collapse or winner selection", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("mormonism");
    expect(result.variants).toHaveLength(2);
    expect(result.variants.map((variant) => variant.physicalEvidence.variantOrder)).toEqual([0, 1]);
    expect(result.variants[0].physicalEvidence.sourceLineNumber).toBeLessThan(
      result.variants[1].physicalEvidence.sourceLineNumber,
    );
    expect(result.variants[0].canonicalVoicePath).toEqual(
      result.variants[1].canonicalVoicePath,
    );
  });

  it("preserves numeric physical variant suffix identity and order", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("read");
    expect(result.variants.map((variant) => variant.physicalEvidence.sourceForm)).toEqual([
      "read",
      "read(2)",
    ]);
    expect(result.variants.map((variant) => variant.physicalEvidence.variantId)).toEqual([
      "1",
      "2",
    ]);
  });

  it("preserves production ambiguous Null while retaining physical evidence", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("read");
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("PRONUNCIATION_VARIANT_AMBIGUOUS");
    expect(result.variants).toHaveLength(2);
    expect(result.variants.map((variant) => variant.status)).toEqual(["defined", "defined"]);
    expect(result.variants.map((variant) => variant.canonicalVoicePath)).toEqual([
      ["E"],
      ["I"],
    ]);
  });

  it("uses top-level production Null with an empty ledger when no source exists", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1(
      "word-not-in-cmudict-v0-1",
    );
    expect(result).toMatchObject({
      status: "null",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
      variants: [],
    });
  });

  it("uses the source-level failure shape rather than fabricating variants", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1(
      undefined as unknown as string,
    );
    expect(result.status).toBe("null");
    expect(result.variants).toEqual([]);
    expect(result.reasonCode).toBe("PRONUNCIATION_NOT_FOUND");
  });

  it("deep-freezes the envelope, ledger, evidence, and structural output", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone");
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.variants)).toBe(true);
    expect(Object.isFrozen(result.variants[0])).toBe(true);
    expect(Object.isFrozen(result.variants[0].physicalEvidence)).toBe(true);
    expect(Object.isFrozen(result.variants[0].normalizedSegments)).toBe(true);
    expect(Object.isFrozen(result.variants[0].nuclei)).toBe(true);
  });

  it("rejects tampered provenance by rebuilding from the frozen authority", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone");
    const tampered = JSON.parse(JSON.stringify(result)) as typeof result;
    tampered.variants[0].physicalEvidence.rawSourceLine = "stone S T AA1 N";
    expect(validateCmuDictProductionSpokenBridgePrerequisitesV0_1(result)).toBe(true);
    expect(validateCmuDictProductionSpokenBridgePrerequisitesV0_1(tampered)).toBe(false);
    expect(validateCmuDictProductionSpokenBridgePrerequisitesV0_1(null)).toBe(false);
  });

  it("audits every physical source form with the canonical normalizers", () => {
    const audit = auditCmuDictNormalizationDomainV0_1();
    expect(audit).toEqual({
      totalPhysicalSourceRecords: 135166,
      totalDistinctSourceForms: 135166,
      normalizationEqualRecordCount: 135166,
      normalizationMismatchRecordCount: 0,
      normalizationMismatchDistinctFormCount: 0,
      normalizationMismatchForms: [],
      sharedNormalizationArtifactDomainVerified: true,
    });
  });

  it("keeps the evidence index provenance-only and does not emit forbidden authority", () => {
    const result = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone");
    expect(result.physicalEvidenceIndex.role).toBe(
      "READ_ONLY_PHYSICAL_SOURCE_PROVENANCE",
    );
    expect(JSON.stringify(result)).not.toContain(
      "CMUDICT_CANDIDATE_TO_PRODUCTION_SPOKEN_DOMAIN_COMPATIBILITY_AUTHORITY_V0_1",
    );
    expect(JSON.stringify(result)).not.toContain("SAME_REPRESENTATION");
    expect(JSON.stringify(result)).not.toContain("candidateCompatibility");
    expect(JSON.stringify(result)).not.toContain("semanticEquivalence");
    expect(JSON.stringify(result)).not.toContain("functionalEquivalence");
    expect(result).not.toHaveProperty("canonicalVoicePath");
    expect(result).not.toHaveProperty("winner");
  });

  it("is repeatable and remains valid after independent reconstruction", () => {
    const first = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone");
    const second = buildCmuDictProductionSpokenBridgePrerequisitesV0_1("stone");
    expect(second).toEqual(first);
    expect(validateCmuDictProductionSpokenBridgePrerequisitesV0_1(first)).toBe(true);
    expect(validateCmuDictProductionSpokenBridgePrerequisitesV0_1(second)).toBe(true);
  });

  it("reads the frozen artifact without changing its bytes", () => {
    expect(fs.statSync(SOURCE_PATH).size).toBe(CMUDICT_DATA_BYTES_V0_1);
    expect(fs.readFileSync(SOURCE_PATH, "utf8")).toContain("stone S T OW1 N");
  });
});
