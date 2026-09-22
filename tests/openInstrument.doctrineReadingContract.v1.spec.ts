import {
  DOCTRINE_READING_CLAIM_BOUNDARY_V1,
  DOCTRINE_READING_COMPOSITION_MODE_V1,
  DOCTRINE_READING_CONTRACT_SCHEMA_V1,
  DOCTRINE_READING_PATH_COMPOSITION_V1,
  projectDoctrineReadingV1,
} from "../src/shared/openInstrument/doctrineReadingContract.v1";
import {
  SEVEN_VOICE_DOCTRINE_PROFILES_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_COMPLETENESS_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1,
} from "../src/shared/openInstrument/doctrineFunctionalProfile.v0_1";
import { SEVEN_PRINCIPLES } from "../src/shared/sevenPrinciples.v1";

function successfulReading(inputPath: unknown) {
  const result = projectDoctrineReadingV1(inputPath);

  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`Expected doctrine reading success: ${result.reasonCodes.join(",")}`);
  }

  expect(result.schemaVersion).toBe(DOCTRINE_READING_CONTRACT_SCHEMA_V1);
  expect(result.doctrineReading).not.toBeNull();
  if (!result.doctrineReading) {
    throw new Error("Expected non-null doctrine reading");
  }

  return result.doctrineReading;
}

describe("Open Instrument Seven-Voices doctrine reading contract v1", () => {
  test("projects one canonical Voice with its canonical role and profile", () => {
    const reading = successfulReading(["A"]);
    const profile = SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A;

    expect(reading.analyzedVoicePath).toEqual(["A"]);
    expect(reading.entries).toHaveLength(1);
    expect(reading.entries[0]).toMatchObject({
      pathIndex: 0,
      voice: "A",
      doctrineRole: SEVEN_PRINCIPLES.A.role,
      functionalProperties: profile.functionalProperties,
      profileSchemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
      profileEngineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
      profileNormalizationStatus:
        DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
      profileCompleteness: DOCTRINE_FUNCTIONAL_PROFILE_COMPLETENESS_V0_1,
      profileTruthClassification:
        DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1,
    });
  });

  test("preserves exact order and repeated Voices", () => {
    const reading = successfulReading(["A", "E", "A"]);

    expect(reading.analyzedVoicePath).toEqual(["A", "E", "A"]);
    expect(
      reading.entries.map((entry) => [entry.pathIndex, entry.voice]),
    ).toEqual([
      [0, "A"],
      [1, "E"],
      [2, "A"],
    ]);
    expect(reading.entries[0]?.functionalProperties).toBe(
      SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A.functionalProperties,
    );
    expect(reading.entries[2]?.functionalProperties).toBe(
      SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A.functionalProperties,
    );
  });

  test("uses the locked doctrine boundaries without transition semantics", () => {
    const reading = successfulReading(["A", "E"]);

    expect(reading).toMatchObject({
      compositionMode: DOCTRINE_READING_COMPOSITION_MODE_V1,
      pathComposition: DOCTRINE_READING_PATH_COMPOSITION_V1,
      providerIndependent: true,
      externalEvidenceIndependent: true,
      candidateWinnerIndependent: true,
      claimBoundary: DOCTRINE_READING_CLAIM_BOUNDARY_V1,
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(reading).not.toHaveProperty("startState");
    expect(reading).not.toHaveProperty("terminalState");
    expect(reading).not.toHaveProperty("transitions");
    expect(reading).not.toHaveProperty("semanticBridge");
    expect(reading).not.toHaveProperty("functionalStatement");
    expect(reading).not.toHaveProperty("evidenceRefs");
    expect(reading).not.toHaveProperty("candidate");
    expect(reading).not.toHaveProperty("consonantMeaning");
  });

  test("is deterministic and carries no historical or lexical claims", () => {
    const first = projectDoctrineReadingV1(["Y", "Ë", "Y"]);
    const second = projectDoctrineReadingV1(["Y", "Ë", "Y"]);

    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(first).toMatchObject({
      ok: true,
      doctrineReading: {
        claimBoundary: {
          historicalOriginClaim: "not_claimed",
          historicalTransmissionClaim: "not_claimed",
          winnerClaim: "not_claimed",
          languageSuperiorityClaim: "not_claimed",
          candidateTruthClaim: "not_claimed",
          lexicalMeaningClaim: "not_claimed",
        },
      },
    });
  });

  test("returns doctrine null for an absent or empty Voice path", () => {
    expect(projectDoctrineReadingV1([])).toEqual({
      ok: true,
      schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
      doctrineReading: null,
    });
    expect(projectDoctrineReadingV1(undefined)).toEqual({
      ok: true,
      schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
      doctrineReading: null,
    });
  });

  test("rejects malformed and unsupported Voice paths deterministically", () => {
    expect(projectDoctrineReadingV1(["A", null])).toEqual({
      ok: false,
      schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
      reasonCodes: ["malformed_path_entry"],
      invalidIndex: 1,
    });
    expect(projectDoctrineReadingV1(["X"])).toEqual({
      ok: false,
      schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
      reasonCodes: ["unsupported_voice"],
      invalidIndex: 0,
    });
  });
});
