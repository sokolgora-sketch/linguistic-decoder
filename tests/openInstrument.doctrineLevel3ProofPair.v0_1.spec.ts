import {
  DOCTRINE_LEVEL3_PROOF_PAIR_A_E_RULE_ID_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_A_E_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_AUTHORITY_REGISTRY_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_E_A_RULE_ID_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_E_A_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_I_O_RULE_ID_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_I_O_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1,
  DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1,
  isDoctrineLevel3ProofPairReadingV0_1,
  projectLevel3DoctrineReadingV0_1,
} from "@/shared/openInstrument/doctrineLevel3ProofPair.v0_1";

describe("Open Instrument Level-3 proof pair authority v0.1", () => {
  test("registers exactly four deterministic proof-pair readings", () => {
    expect(DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1).toMatchObject({
      schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
      ruleId: "level3.proof-pair.u-y.v0_1",
      level: 3,
      analyzedVoicePath: ["U", "Y"],
      reading: "grounded depth with reflective exploration",
      truthClassification: "inference",
      doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
      outputShape: "bounded_phrase_or_short_clause",
      genericComposition: "AUTHORIZED",
      level4TransitionSemantics: "NOT_AUTHORIZED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(
      isDoctrineLevel3ProofPairReadingV0_1(
        DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1,
      ),
    ).toBe(true);

    expect(DOCTRINE_LEVEL3_PROOF_PAIR_A_E_V0_1).toMatchObject({
      schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
      ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_A_E_RULE_ID_V0_1,
      level: 3,
      analyzedVoicePath: ["A", "E"],
      reading: "initiating beginning with expanding growth",
      truthClassification: "inference",
      doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
      outputShape: "bounded_phrase_or_short_clause",
      genericComposition: "AUTHORIZED",
      level4TransitionSemantics: "NOT_AUTHORIZED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(
      isDoctrineLevel3ProofPairReadingV0_1(
        DOCTRINE_LEVEL3_PROOF_PAIR_A_E_V0_1,
      ),
    ).toBe(true);

    expect(DOCTRINE_LEVEL3_PROOF_PAIR_E_A_V0_1).toMatchObject({
      schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
      ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_E_A_RULE_ID_V0_1,
      level: 3,
      analyzedVoicePath: ["E", "A"],
      reading: "expanding growth with initiating beginning",
      truthClassification: "inference",
      doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
      outputShape: "bounded_phrase_or_short_clause",
      genericComposition: "AUTHORIZED",
      level4TransitionSemantics: "NOT_AUTHORIZED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(
      isDoctrineLevel3ProofPairReadingV0_1(
        DOCTRINE_LEVEL3_PROOF_PAIR_E_A_V0_1,
      ),
    ).toBe(true);

    expect(DOCTRINE_LEVEL3_PROOF_PAIR_I_O_V0_1).toMatchObject({
      schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
      ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_I_O_RULE_ID_V0_1,
      level: 3,
      analyzedVoicePath: ["I", "O"],
      reading: "clear understanding with balanced mediation",
      truthClassification: "inference",
      doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
      outputShape: "bounded_phrase_or_short_clause",
      genericComposition: "AUTHORIZED",
      level4TransitionSemantics: "NOT_AUTHORIZED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(
      isDoctrineLevel3ProofPairReadingV0_1(
        DOCTRINE_LEVEL3_PROOF_PAIR_I_O_V0_1,
      ),
    ).toBe(true);
    expect(DOCTRINE_LEVEL3_PROOF_PAIR_AUTHORITY_REGISTRY_V0_1).toHaveLength(4);
    expect(
      DOCTRINE_LEVEL3_PROOF_PAIR_AUTHORITY_REGISTRY_V0_1.map((entry) => entry.ruleId),
    ).toEqual([
      "level3.proof-pair.u-y.v0_1",
      "level3.proof-pair.a-e.v0_1",
      "level3.proof-pair.e-a.v0_1",
      "level3.proof-pair.i-o.v0_1",
    ]);
  });

  test.each([
    ["U to Y", ["U", "Y"], true],
    ["A to E", ["A", "E"], true],
    ["E to A", ["E", "A"], true],
    ["I to O", ["I", "O"], true],
    ["Y to U", ["Y", "U"], true],
    ["I to U formerly review-only pair", ["I", "U"], true],
    ["O to I formerly review-only pair", ["O", "I"], true],
    ["A to A", ["A", "A"], false],
    ["E to E", ["E", "E"], false],
    ["I to I", ["I", "I"], false],
    ["O to O", ["O", "O"], false],
    ["U to U", ["U", "U"], false],
    ["Y to Y", ["Y", "Y"], false],
    ["Ë to Ë", ["Ë", "Ë"], false],
    ["single Voice", ["A"], false],
    ["three Voices", ["A", "U", "Y"], false],
    ["selected pair inside triple", ["I", "O", "A"], false],
    ["selected pair with repeated Voice", ["I", "I", "O"], false],
    ["empty path", [], false],
  ])("projects %s by exact whole-path registry lookup", (label, path, supported) => {
    const result = projectLevel3DoctrineReadingV0_1(path);
    expect(Boolean(result)).toBe(supported);
    if (supported) {
      expect(result).toMatchObject({
        ruleId: DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1,
        analyzedVoicePath: path,
        truthClassification: "inference",
        genericComposition: "AUTHORIZED",
      });
    }
  });

  test("rejects invalid and non-canonical inputs without a reading", () => {
    expect(projectLevel3DoctrineReadingV0_1(null)).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1(["X", "Y"])).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1(["U", "Y", "U"])).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1(["A", "E", "A"])).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1(["E", "A", "E"])).toBeNull();
    expect(projectLevel3DoctrineReadingV0_1(["A", "A", "E"])).toBeNull();
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

  test("keeps the A to E phrase independent of target-sense data", () => {
    const reading = projectLevel3DoctrineReadingV0_1(["A", "E"]);

    expect(reading).toMatchObject({
      ruleId: DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1,
      analyzedVoicePath: ["A", "E"],
      reading: DOCTRINE_LEVEL3_PROOF_PAIR_A_E_V0_1.reading,
    });
    expect(JSON.stringify(reading)).not.toContain("water");
    expect(JSON.stringify(reading)).not.toContain("targetSenseId");
    expect(JSON.stringify(reading)).not.toContain("study");
    expect(JSON.stringify(reading)).not.toContain("semanticBridge");
    expect(JSON.stringify(reading)).not.toContain("transition");
  });

  test("keeps the E to A reversal distinct and independently bounded", () => {
    const reading = projectLevel3DoctrineReadingV0_1(["E", "A"]);

    expect(reading).toMatchObject({
      ruleId: DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1,
      analyzedVoicePath: ["E", "A"],
      reading: DOCTRINE_LEVEL3_PROOF_PAIR_E_A_V0_1.reading,
    });
    expect(reading?.analyzedVoicePath).toEqual(["E", "A"]);
    expect(reading?.reading).toBe("expanding growth with initiating beginning");
    expect(reading?.reading).not.toBe(
      DOCTRINE_LEVEL3_PROOF_PAIR_A_E_V0_1.reading,
    );
    expect(JSON.stringify(reading)).not.toContain("transition");
    expect(JSON.stringify(reading)).not.toContain("targetSenseId");
  });

  test("keeps the independent-family I to O reading exact and target-independent", () => {
    const reading = projectLevel3DoctrineReadingV0_1(["I", "O"]);

    expect(reading).toMatchObject({
      ruleId: DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1,
      analyzedVoicePath: ["I", "O"],
      reading: DOCTRINE_LEVEL3_PROOF_PAIR_I_O_V0_1.reading,
    });
    expect(reading?.analyzedVoicePath).toEqual(["I", "O"]);
    expect(reading?.reading).toBe("clear understanding with balanced mediation");
    expect(reading?.reading).not.toContain("transition");
    expect(JSON.stringify(reading)).not.toContain("targetSenseId");
  });
});
