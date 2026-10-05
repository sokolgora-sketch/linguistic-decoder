import {
  FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_ID_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_IDS_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_REASON_CODES_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_UNIT_OF_ANALYSIS_V0_1,
  canonicalPropertyIdToMatchingTermV0_1,
  evaluateFunctionalOutcomeMatchingV0_1,
  findExactCanonicalPropertyMatchesV0_1,
  normalizeFunctionalOutcomeMatchingTextV0_1,
  validateFunctionalOutcomeNormalizationInputV0_1,
  type FunctionalOutcomeSourceSenseInputV0_1,
} from "@/shared/openInstrument/functionalOutcomeNormalizationContract.v0_1";
import { readFileSync } from "node:fs";

const contractDoc = readFileSync(
  "docs/open-instrument/functional-outcome-normalization-adjudication-contract-v0.1.md",
  "utf8",
);

const sourceSense: FunctionalOutcomeSourceSenseInputV0_1 = {
  schemaVersion: FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1,
  inputKind: "SOURCE_SENSE",
  sourceProfileId: FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1,
  sourceArtifactSha256: FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1,
  sourceRecordId: "line-0000001",
  sourceRecordOrdinal: 1,
  sourceForm: "sample",
  language: "English",
  languageCode: "en",
  pos: "noun",
  senseId: "1",
  senseOrdinal: 1,
  glosses: ["A hard substance"],
  tags: [],
  rawTags: [],
  examples: [{ text: "A stone" }],
};

function sourceWithGlosses(
  glosses: readonly string[],
  overrides: Partial<FunctionalOutcomeSourceSenseInputV0_1> = {},
): FunctionalOutcomeSourceSenseInputV0_1 {
  return {
    ...sourceSense,
    glosses,
    tags: [],
    rawTags: [],
    examples: [],
    ...overrides,
  };
}

describe("functional outcome normalization and adjudication contract v0.1", () => {
  it("freezes identity, source binding, unit, and existing property vocabulary", () => {
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_ID_V0_1).toBe(
      "OPEN_INSTRUMENT_FUNCTIONAL_OUTCOME_NORMALIZATION_ADJUDICATION_V0_1",
    );
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1.status).toBe(
      "FROZEN_CONTRACT_ONLY",
    );
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_UNIT_OF_ANALYSIS_V0_1).toBe(
      "SOURCE_RECORD_POS_SENSE",
    );
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_IDS_V0_1).toHaveLength(44);
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1.normalizationRule).toBe(
      "EXACT_CANONICAL_PROPERTY_TERM_ONLY",
    );
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1.matchingOperator).toMatchObject({
      fieldScope: "GLOSSES_ONLY",
      propertyTermRule: "PROPERTY_ID_UNDERSCORE_TO_ASCII_SPACE_ONLY",
      matchGranularity: "NORMALIZED_CONTIGUOUS_WHOLE_TOKEN_SEQUENCE",
      multiplePropertyMatches: "PRESERVE_ALL",
      multipleGlosses: "INSPECT_EACH_GLOSS_PRESERVE_ALL_EVIDENCE",
      zeroExactMatch: "SOURCE_PRESENT_NO_EXACT_MATCH_UNRESOLVED",
      insufficientGlossText: "SOURCE_TEXT_INSUFFICIENT",
    });
  });

  it("accepts only the hash-bound source/sense input shape", () => {
    expect(validateFunctionalOutcomeNormalizationInputV0_1(sourceSense)).toEqual({
      ok: true,
      input: sourceSense,
    });
  });

  it("rejects structural, target, and provider inputs at the boundary", () => {
    const invalid = {
      ...sourceSense,
      voicePath: ["A"],
      gamma: ["T"],
      zc: { P: 1 },
      level3: "hidden",
      math7: 1,
      targetSense: "hidden",
      providerOutput: "hidden",
    };
    const result = validateFunctionalOutcomeNormalizationInputV0_1(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("FORBIDDEN_STRUCTURAL_OR_TARGET_INPUT");
      expect(result.reasonCodes).toContain("UNEXPECTED_FIELD_PRESENT");
    }
  });

  it("preserves source-not-found as distinct from source-present unresolved", () => {
    const missing = validateFunctionalOutcomeNormalizationInputV0_1({
      schemaVersion: FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1,
      inputKind: "SOURCE_NOT_FOUND",
      sourceProfileId: FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1,
      sourceArtifactSha256: FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1,
      normalizedJoinKey: "missing-word",
      reasonCode: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
    });
    expect(missing).toEqual({ ok: true, input: expect.any(Object) });
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1.missingness).toEqual({
      sourceNotFound: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      sourcePresentOutcomeUnresolved: "SOURCE_PRESENT_OUTCOME_UNRESOLVED",
      spellingFallback: false,
      modelInferenceFallback: false,
    });
  });

  it("freezes multiplicity, adjudication, and winner boundaries", () => {
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1.multiplicity).toEqual({
      sourceRecordsPreserved: true,
      posRecordsPreserved: true,
      sensesPreserved: true,
      outcomesPreserved: true,
      primarySenseSelection: false,
      senseMerging: false,
      outcomeRanking: false,
      winnerSelection: false,
    });
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1.adjudication).toMatchObject({
      sourceOnly: true,
      structuralPredictorsAvailable: false,
      targetSenseAvailable: false,
      providerOutputAvailable: false,
      disagreementFailsClosed: true,
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
  });

  it("documents the authority and production firewalls", () => {
    expect(contractDoc).toContain("SOURCE_TO_OUTCOME_NORMALIZATION_ONLY");
    expect(contractDoc).toContain("No `V`, `Γ`, `ZC`");
    expect(contractDoc).toContain("Disagreement fails closed");
    expect(contractDoc).toContain("noSingleWinner=true");
    expect(contractDoc).toContain("does not bundle the 3.3 GB source artifact");
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1.authorityFirewalls).toMatchObject({
      functionalOutcomeEmpiricalAuthority: "NO",
      productionRuntimeAuthority: "NO",
      manifestationAuthority: "NO",
      consonantMeaningAuthority: "NO",
      historicalOriginAuthority: "NO",
      ipaToVoiceAuthority: "NO",
    });
  });

  it("matches glosses only and excludes tags, raw tags, and examples", () => {
    const input = sourceWithGlosses([], {
      tags: ["growth"],
      rawTags: ["growth"],
      examples: [{ text: "growth" }],
    });
    expect(findExactCanonicalPropertyMatchesV0_1(input)).toEqual([]);
  });

  it("derives every canonical term only by replacing underscores with ASCII spaces", () => {
    expect(canonicalPropertyIdToMatchingTermV0_1("growth")).toBe("growth");
    expect(canonicalPropertyIdToMatchingTermV0_1("learning_from_experience")).toBe(
      "learning from experience",
    );
    expect(canonicalPropertyIdToMatchingTermV0_1("emotional_interiority")).toBe(
      "emotional interiority",
    );
  });

  it("normalizes NFC, case, punctuation, and whitespace deterministically", () => {
    expect(normalizeFunctionalOutcomeMatchingTextV0_1("Cafe\u0301\tGROWTH.")).toBe(
      "café growth",
    );
    expect(findExactCanonicalPropertyMatchesV0_1(sourceWithGlosses(["GROWTH."]))).toEqual([
      expect.objectContaining({ propertyId: "growth", outcome: "DIRECT_MATCH" }),
    ]);
    expect(findExactCanonicalPropertyMatchesV0_1(sourceWithGlosses(["growth-related"]))).toEqual([
      expect.objectContaining({ propertyId: "growth", outcome: "DIRECT_MATCH" }),
    ]);
  });

  it("requires whole-token equality and rejects substring matches", () => {
    expect(findExactCanonicalPropertyMatchesV0_1(
      sourceWithGlosses(["growths overgrowth regrowth"]),
    )).toEqual([]);
  });

  it("requires an ordered contiguous token sequence for multi-token properties", () => {
    expect(findExactCanonicalPropertyMatchesV0_1(
      sourceWithGlosses(["learning from experience"]),
    )).toEqual([
      expect.objectContaining({ propertyId: "learning_from_experience" }),
    ]);
    expect(findExactCanonicalPropertyMatchesV0_1(
      sourceWithGlosses(["learning through long practical experience"]),
    )).toEqual([]);
  });

  it("preserves all exact properties without ranking or choosing a primary property", () => {
    const outcomes = findExactCanonicalPropertyMatchesV0_1(
      sourceWithGlosses(["growth and stability"]),
    );
    expect(outcomes.map((outcome) => outcome.propertyId)).toEqual([
      "growth",
      "stability",
    ]);
    expect(outcomes.every((outcome) => outcome.outcome === "DIRECT_MATCH")).toBe(true);
  });

  it("inspects every gloss and preserves duplicate evidence references", () => {
    const outcomes = findExactCanonicalPropertyMatchesV0_1(
      sourceWithGlosses(["growth", "growth growth"]),
    );
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0].propertyId).toBe("growth");
    expect(outcomes[0].evidenceRefs).toHaveLength(3);
    expect(outcomes[0].evidenceRefs.map((ref) => ref.locator)).toEqual([
      "glosses[0].tokens[0..0]",
      "glosses[1].tokens[0..0]",
      "glosses[1].tokens[1..1]",
    ]);
  });

  it("keeps zero exact matches unresolved rather than calling them contradiction", () => {
    const evaluation = evaluateFunctionalOutcomeMatchingV0_1(
      sourceWithGlosses(["a neutral description"]),
    );
    expect(evaluation).toEqual({
      outcomes: [],
      reasonCode: "NO_EXACT_CANONICAL_PROPERTY_TERM",
    });
    expect(evaluation.outcomes.some((outcome) => outcome.outcome === "CONTRADICTION")).toBe(
      false,
    );
  });

  it("keeps insufficient gloss text distinct from source-present zero-match", () => {
    expect(evaluateFunctionalOutcomeMatchingV0_1(sourceWithGlosses([]))).toEqual({
      outcomes: [],
      reasonCode: "SOURCE_TEXT_INSUFFICIENT",
    });
    expect(evaluateFunctionalOutcomeMatchingV0_1(sourceWithGlosses(["ordinary text"])))
      .toEqual({ outcomes: [], reasonCode: "NO_EXACT_CANONICAL_PROPERTY_TERM" });
    expect(FUNCTIONAL_OUTCOME_NORMALIZATION_REASON_CODES_V0_1).toContain(
      "NO_EXACT_CANONICAL_PROPERTY_TERM",
    );
  });

  it("uses the same canonical-ID pipeline uniformly for all 44 property IDs", () => {
    for (const propertyId of FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_IDS_V0_1) {
      const canonicalTerm = canonicalPropertyIdToMatchingTermV0_1(propertyId);
      expect(canonicalTerm).toBe(propertyId.replace(/_/gu, " "));
      const outcomes = findExactCanonicalPropertyMatchesV0_1(
        sourceWithGlosses([canonicalTerm]),
      );
      expect(outcomes.map((outcome) => outcome.propertyId)).toEqual([propertyId]);
    }
  });
});
