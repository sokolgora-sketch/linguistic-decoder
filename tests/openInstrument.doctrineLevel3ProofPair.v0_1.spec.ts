import {
  DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1,
  isDoctrineLevel3ProofPairReadingV0_1,
  projectLevel3DoctrineReadingV0_1,
} from "@/shared/openInstrument/doctrineLevel3ProofPair.v0_1";

describe("Open Instrument Level-3 U to Y proof pair v0.1", () => {
  test("registers exactly one deterministic U to Y reading", () => {
    expect(DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1).toMatchObject({
      schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
      ruleId: "level3.proof-pair.u-y.v0_1",
      level: 3,
      analyzedVoicePath: ["U", "Y"],
      reading: "grounded depth with reflective exploration",
      truthClassification: "inference",
      doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
      outputShape: "bounded_phrase_or_short_clause",
      genericComposition: "NOT_AUTHORIZED",
      level4TransitionSemantics: "NOT_AUTHORIZED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(
      isDoctrineLevel3ProofPairReadingV0_1(
        DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1,
      ),
    ).toBe(true);
  });

  test.each([
    ["U to Y", ["U", "Y"], true],
    ["Y to U", ["Y", "U"], false],
    ["A to E", ["A", "E"], false],
    ["U to U", ["U", "U"], false],
    ["single Voice", ["A"], false],
    ["three Voices", ["A", "U", "Y"], false],
    ["empty path", [], false],
  ])("projects %s without generalizing", (_label, path, supported) => {
    const result = projectLevel3DoctrineReadingV0_1(path);
    expect(Boolean(result)).toBe(supported);
    if (supported) {
      expect(result).toBe(DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1);
    }
  });

  test("rejects invalid and non-canonical inputs without a reading", () => {
    expect(projectLevel3DoctrineReadingV0_1(null)).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1(["X", "Y"])).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1(["U", "Y", "U"])).toBeNull();
  });

  test("is repeatable and independent of word or target-sense data", () => {
    const first = projectLevel3DoctrineReadingV0_1(["U", "Y"]);
    const second = projectLevel3DoctrineReadingV0_1(["U", "Y"]);

    expect(first).toEqual(second);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(JSON.stringify(first)).not.toContain("study");
    expect(JSON.stringify(first)).not.toContain("targetSenseId");
    expect(JSON.stringify(first)).not.toContain("semanticBridge");
    expect(JSON.stringify(first)).not.toContain("transition");
  });
});
