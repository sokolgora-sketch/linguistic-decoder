import {
  adaptCmuDictCandidateSourceEvidenceV0_1,
  type CmuDictCandidateAdapterInputV0_1,
  type CmuDictCandidatePronunciationEvidenceVariantV0_1,
} from "@/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1";
import {
  buildCmuDictProductionSpokenBridgePrerequisitesV0_1,
  type CmuDictProductionSpokenBridgePrerequisiteVariantV0_1,
} from "@/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1";
import {
  CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1,
  CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_V0_1,
  CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1,
  buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1,
  buildCmuDictProductionSharedSourcePronunciationInstanceV0_1,
  compareCmuDictSharedSourcePronunciationInstancesV0_1,
  fingerprintCmuDictSharedSourcePronunciationV0_1,
  serializeCmuDictSharedSourcePronunciationInstanceV0_1,
  validateCmuDictSharedSourcePronunciationInstanceV0_1,
} from "@/shared/openInstrument/cmudictSharedRepresentationEvidenceExposure.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";

function candidateInput(sourceForm = "stone"): CmuDictCandidateAdapterInputV0_1 {
  return {
    candidateId: `candidate.${sourceForm}.v0_1`,
    sourceId: `source.${sourceForm}.v0_1`,
    sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    sourceRecordId: `record.${sourceForm}.v0_1`,
    sourceForm,
    normalizedForm: normalizeEnglishLexicalJoinKeyV0_1(sourceForm),
    language: "English",
    sourceProvenance: {
      sourceId: `source.${sourceForm}.v0_1`,
      sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    },
  };
}

function candidateVariant(
  sourceForm = "stone",
): CmuDictCandidatePronunciationEvidenceVariantV0_1 {
  const result = adaptCmuDictCandidateSourceEvidenceV0_1(candidateInput(sourceForm));
  if (result.status !== "defined") throw new Error(result.reasonCode);
  return result.variants[0];
}

function productionVariant(
  sourceForm = "stone",
): CmuDictProductionSpokenBridgePrerequisiteVariantV0_1 {
  return buildCmuDictProductionSpokenBridgePrerequisitesV0_1(sourceForm).variants[0];
}

describe("CMUdict Path B shared representation evidence exposure v0.1", () => {
  it("publishes the exact contract identity and authority tags immutably", () => {
    expect(CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_V0_1).toMatchObject({
      contractId: "open-instrument.cmudict-shared-source-pronunciation.v0_1",
      contractVersion: "v0.1",
      contractRevision: "representation-contract-alignment-authority-v0.1",
      schemaVersion: "open-instrument.cmudict-shared-source-pronunciation.v0_1",
      languageScope: "English",
      varietyScope: "en-US",
      notation: "ARPABET",
      normalizationIdentity: "NOT_APPLICABLE_AT_SHARED_BOUNDARY",
      segmentationIdentity: "ORDERED_RAW_ARPABET_TOKEN_SEQUENCE",
      orderingIdentity: "SOURCE_LINE_ORDER_AND_VARIANT_ORDER",
      projectionMethodology: null,
      projectionProfileVersion: null,
      variantPolicy: "PRESERVE_PHYSICAL_RECORDS_AND_VARIANTS",
      ambiguityPolicy: "PRESERVE_ANNOTATION_AND_MULTIPLICITY_FAIL_CLOSED",
      sourceAuthority: "RATIFIED_CMUDICT_SOURCE_ARTIFACT",
    });
    expect(Object.isFrozen(CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_V0_1)).toBe(true);
    expect(Object.isFrozen(CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_V0_1.authorityProvenanceRequirements)).toBe(true);
    expect(Object.isFrozen(CMUDICT_SHARED_SOURCE_PRONUNCIATION_CONTRACT_V0_1.reproducibilityRequirements)).toBe(true);
  });

  it("independently builds equal shared evidence from one frozen physical record", () => {
    const candidate = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    const production = buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(
      productionVariant(),
    );
    expect(candidate.status).toBe("authorized");
    expect(production.status).toBe("authorized");
    expect(compareCmuDictSharedSourcePronunciationInstancesV0_1(candidate.instance, production.instance)).toEqual({
      status: "match",
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_AUTHORIZED",
    });
    expect(candidate.instance).toMatchObject({
      contractId: "open-instrument.cmudict-shared-source-pronunciation.v0_1",
      physicalRecordId: "cmudict-physical-v0_1|sha256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22|line=116395",
      orderedRawArpabetTokens: ["S", "T", "OW1", "N"],
      opaqueAnnotationText: null,
      annotationEligibility: "ELIGIBLE",
      alignmentAuthorityTag: CMUDICT_SHARED_SOURCE_PRONUNCIATION_ALIGNMENT_TAG_V0_1,
      evidenceExposureAuthorityTag: CMUDICT_SHARED_SOURCE_PRONUNCIATION_EVIDENCE_TAG_V0_1,
    });
  });

  it("uses production raw physical pronunciation rather than production source units", () => {
    const source = productionVariant();
    const altered = {
      ...source,
      orderedProductionSourceUnits: ["NOT", "SHARED", "TOKENS"],
    } as unknown as CmuDictProductionSpokenBridgePrerequisiteVariantV0_1;
    const result = buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(altered);
    expect(result.status).toBe("authorized");
    expect(result.instance.orderedRawArpabetTokens).toEqual(["S", "T", "OW1", "N"]);
  });

  it("preserves annotated evidence while marking it ineligible", () => {
    const candidate = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant("aalborg"),
    );
    const production = buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(
      productionVariant("aalborg"),
    );
    expect(candidate).toMatchObject({
      status: "authorized",
      instance: {
        orderedRawArpabetTokens: ["AO1", "L", "B", "AO0", "R", "G"],
        opaqueAnnotationText: "place, danish",
        annotationEligibility: "INELIGIBLE",
      },
    });
    expect(production.instance.annotationEligibility).toBe("INELIGIBLE");
    expect(compareCmuDictSharedSourcePronunciationInstancesV0_1(candidate.instance, production.instance).status).toBe("match");
  });

  it("derives exactly two deterministic provenance references", () => {
    const result = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    expect(result.instance.sourceProvenanceRefs).toEqual([
      "CMUDICT_SOURCE_ARTIFACT_V0_1|path=src/data/openInstrument/pronunciation/cmudict.dict|revision=74790861f652b15e4ac49015a90074ad62a27690|bytes=3618488|sha256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22",
      "CMUDICT_SOURCE_RECORD_V0_1|artifactSha256=81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22|line=116395",
    ]);
    expect(result.instance.sourceProvenanceRefs).toHaveLength(2);
  });

  it("serializes a fixed-order compact JSON array without reproducibility fields", () => {
    const result = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    const serialized = serializeCmuDictSharedSourcePronunciationInstanceV0_1(result.instance);
    const parsed = JSON.parse(serialized) as unknown[];
    expect(serialized.endsWith("\n")).toBe(false);
    expect(parsed).toHaveLength(26);
    expect(parsed[0]).toBe("open-instrument.cmudict-shared-source-pronunciation.v0_1");
    expect(parsed[11]).toBe(result.instance.physicalRecordId);
    expect(parsed[23]).toEqual(result.instance.sourceProvenanceRefs);
    expect(serialized).not.toContain("deterministicReproducibility");
  });

  it("keeps input and output fingerprints deterministic and distinct", () => {
    const result = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    const input = {
      scope: "INPUT" as const,
      sourcePath: result.instance.sourcePath,
      sourceRevision: result.instance.sourceRevision,
      sourceArtifactBytes: result.instance.sourceArtifactBytes,
      sourceArtifactSha256: result.instance.sourceArtifactSha256,
      sourceLineNumber: result.instance.sourceLineNumber,
      rawSourceLine: result.instance.rawSourceLine,
    };
    const inputFingerprint = fingerprintCmuDictSharedSourcePronunciationV0_1(input);
    const outputFingerprint = fingerprintCmuDictSharedSourcePronunciationV0_1(result.instance);
    expect(inputFingerprint).toMatch(/^[0-9a-f]{64}$/u);
    expect(outputFingerprint).toMatch(/^[0-9a-f]{64}$/u);
    expect(inputFingerprint).toBe(result.instance.deterministicReproducibility.inputFingerprint);
    expect(outputFingerprint).toBe(result.instance.deterministicReproducibility.outputFingerprint);
    expect(inputFingerprint).not.toBe(outputFingerprint);
  });

  it("deep-freezes instances, arrays, and reproducibility evidence", () => {
    const result = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    expect(Object.isFrozen(result.instance)).toBe(true);
    expect(Object.isFrozen(result.instance.orderedRawArpabetTokens)).toBe(true);
    expect(Object.isFrozen(result.instance.sourceProvenanceRefs)).toBe(true);
    expect(Object.isFrozen(result.instance.deterministicReproducibility)).toBe(true);
    expect(() => {
      (result.instance.orderedRawArpabetTokens as string[]).push("AA1");
    }).toThrow();
  });

  it("fails closed for malformed tokens and empty annotation evidence", () => {
    const candidate = candidateVariant();
    const malformedCandidate = {
      ...candidate,
      rawPronunciation: "S ZZ1 N",
      orderedRawArpabetTokens: ["S", "ZZ1", "N"],
      rawSourceLine: "stone S ZZ1 N",
    } as unknown as CmuDictCandidatePronunciationEvidenceVariantV0_1;
    expect(buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(malformedCandidate)).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_TOKEN_MALFORMED",
      instance: null,
    });

    const production = productionVariant();
    const malformedProduction = {
      ...production,
      physicalEvidence: {
        ...production.physicalEvidence,
        rawProductionPronunciation: "S T OW1 N # ",
        opaqueAnnotationText: "",
        terminalOpaqueAnnotationDetected: true,
      },
    } as unknown as CmuDictProductionSpokenBridgePrerequisiteVariantV0_1;
    expect(buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(malformedProduction)).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_ANNOTATION_EVIDENCE_MALFORMED",
      instance: null,
    });
  });

  it("rejects unknown fields, accessors, cycles, and tampered fingerprints", () => {
    const result = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    const unknownField = { ...result.instance, unexpected: true };
    expect(validateCmuDictSharedSourcePronunciationInstanceV0_1(unknownField)).toBe(
      "CMUDICT_PATH_B_SHARED_EVIDENCE_UNKNOWN_FIELD_OR_MALFORMED_EVIDENCE",
    );

    const accessor = Object.defineProperty({ ...result.instance }, "sourceForm", {
      get: () => "stone",
      enumerable: true,
    });
    expect(validateCmuDictSharedSourcePronunciationInstanceV0_1(accessor)).toBe(
      "CMUDICT_PATH_B_SHARED_EVIDENCE_UNKNOWN_FIELD_OR_MALFORMED_EVIDENCE",
    );

    const cycle: Record<string, unknown> = {};
    cycle.self = cycle;
    expect(validateCmuDictSharedSourcePronunciationInstanceV0_1(cycle)).toBe(
      "CMUDICT_PATH_B_SHARED_EVIDENCE_UNKNOWN_FIELD_OR_MALFORMED_EVIDENCE",
    );

    const tampered = JSON.parse(JSON.stringify(result.instance)) as typeof result.instance;
    tampered.deterministicReproducibility.outputFingerprint = "0".repeat(64);
    expect(validateCmuDictSharedSourcePronunciationInstanceV0_1(tampered)).toBe(
      "CMUDICT_PATH_B_SHARED_EVIDENCE_OUTPUT_FINGERPRINT_FAILURE",
    );

    const rawLineTampered = JSON.parse(JSON.stringify(result.instance)) as typeof result.instance;
    rawLineTampered.rawSourceLine = "stone S T AA1 N";
    expect(validateCmuDictSharedSourcePronunciationInstanceV0_1(rawLineTampered)).toBe(
      "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_SOURCE_LINE_MISMATCH",
    );
  });

  it("derives and verifies the physical variant identity on both construction paths", () => {
    const candidate = candidateVariant();
    const malformedCandidate = {
      ...candidate,
      sourceForm: "stone(2)",
      baseSourceForm: "stone",
      variantId: "1",
      rawSourceLine: "stone(2) S T OW1 N",
    } as unknown as CmuDictCandidatePronunciationEvidenceVariantV0_1;
    expect(buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(malformedCandidate)).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_IDENTITY_MISMATCH",
      instance: null,
    });

    const production = productionVariant();
    const malformedProduction = {
      ...production,
      physicalEvidence: {
        ...production.physicalEvidence,
        sourceForm: "stone(2)",
        baseSourceForm: "stone",
        variantId: "1",
        rawSourceLine: "stone(2) S T OW1 N",
      },
    } as unknown as CmuDictProductionSpokenBridgePrerequisiteVariantV0_1;
    expect(buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(malformedProduction)).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_VARIANT_IDENTITY_MISMATCH",
      instance: null,
    });
  });

  it("returns deterministic first mismatch reasons without emitting SAME", () => {
    const candidate = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    const production = buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(
      productionVariant("read"),
    );
    const mismatch = compareCmuDictSharedSourcePronunciationInstancesV0_1(
      candidate.instance,
      production.instance,
    );
    expect(mismatch).toEqual({
      status: "mismatch",
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_PHYSICAL_RECORD_ID_MISMATCH",
    });
    expect(JSON.stringify(mismatch)).not.toContain("SAME_REPRESENTATION");
  });

  it("detects provenance and raw-token mismatches through the paired comparator", () => {
    const candidate = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    const production = buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(
      productionVariant(),
    );
    const provenanceTampered = JSON.parse(JSON.stringify(production.instance)) as typeof production.instance;
    provenanceTampered.sourceProvenanceRefs = ["CMUDICT_SOURCE_RECORD_V0_1|bad"];
    provenanceTampered.deterministicReproducibility.outputFingerprint = "0".repeat(64);
    expect(compareCmuDictSharedSourcePronunciationInstancesV0_1(candidate.instance, provenanceTampered)).toEqual({
      status: "mismatch",
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_SOURCE_PROVENANCE_MISMATCH",
    });

    const rawTokenProduction = {
      ...productionVariant(),
      physicalEvidence: {
        ...productionVariant().physicalEvidence,
        rawSourceLine: "stone S T AA1 N",
        rawPhysicalPronunciation: "S T AA1 N",
        rawProductionPronunciation: "S T AA1 N",
      },
    } as unknown as CmuDictProductionSpokenBridgePrerequisiteVariantV0_1;
    const rawTokenResult = buildCmuDictProductionSharedSourcePronunciationInstanceV0_1(rawTokenProduction);
    expect(rawTokenResult.status).toBe("authorized");
    expect(compareCmuDictSharedSourcePronunciationInstancesV0_1(candidate.instance, rawTokenResult.instance)).toEqual({
      status: "mismatch",
      reasonCode: "CMUDICT_PATH_B_SHARED_EVIDENCE_RAW_SOURCE_LINE_MISMATCH",
    });
  });

  it("does not add Bridge, Discovery, API, UI, or semantic authority", () => {
    const result = buildCmuDictCandidateSharedSourcePronunciationInstanceV0_1(
      candidateVariant(),
    );
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("SAME_REPRESENTATION");
    expect(serialized).not.toContain("BRIDGE_COMPATIBLE");
    expect(serialized).not.toContain("Discovery");
    expect(serialized).not.toContain("winner");
    expect(serialized).not.toContain("ranking");
  });
});
