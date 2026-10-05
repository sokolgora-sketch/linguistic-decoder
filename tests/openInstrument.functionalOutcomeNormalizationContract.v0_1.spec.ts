import {
  FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_ID_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_IDS_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1,
  FUNCTIONAL_OUTCOME_NORMALIZATION_UNIT_OF_ANALYSIS_V0_1,
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
  sourceForm: "stone",
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
});
