import {
  DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1,
  SEVEN_VOICE_DOCTRINE_PROFILE_RELATIONS_V0_1,
  SEVEN_VOICE_DOCTRINE_PROFILE_TENSIONS_V0_1,
  SEVEN_VOICE_DOCTRINE_PROFILES_V0_1,
  getSevenVoiceDoctrineFunctionalProfileV0_1,
  validateSevenVoiceDoctrineFunctionalProfileV0_1,
  validateSevenVoiceDoctrineProfilesV0_1,
} from "../src/shared/openInstrument/doctrineFunctionalProfile.v0_1";

describe("Open Instrument Seven Voices doctrine functional profile v0.1", () => {
  test("contains exactly seven profiles in canonical order", () => {
    expect(Object.keys(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1)).toEqual([
      "A",
      "E",
      "I",
      "O",
      "U",
      "Y",
      "Ë",
    ]);
    expect(Object.keys(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1)).not.toContain("Ẽ");
    expect(validateSevenVoiceDoctrineProfilesV0_1()).toEqual({
      ok: true,
      schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
      reasonCodes: [],
    });
  });

  test("uses the explicit engine-authorized doctrine-profile boundary", () => {
    const profile = getSevenVoiceDoctrineFunctionalProfileV0_1("A");

    expect(profile).toMatchObject({
      schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
      engineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
      truthClassification: DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1,
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
      claimBoundary: {
        lexicalEvidence: "NOT_CLAIMED",
        historicalEvidence: "NOT_CLAIMED",
        etymologicalEvidence: "NOT_CLAIMED",
        empiricalScientificEvidence: "NOT_CLAIMED",
        targetSenseBinding: "NOT_APPLICABLE",
        pathComposition: "NOT_AUTHORIZED",
        productionCandidate: "NOT_CLAIMED",
      },
    });
    expect(profile).not.toHaveProperty("evidenceRefs");
    expect(profile).not.toHaveProperty("semanticBridge");
    expect(profile).not.toHaveProperty("targetSense");
  });

  test("keeps functional properties separate from Chapter 4 principles", () => {
    expect(
      SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A.functionalProperties.map(
        (property) => property.id,
      ),
    ).toEqual(["beginning", "creation", "activation", "life_pulse"]);
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A.principleAssociation.label).toBe(
      "Bashkimi",
    );
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.E.principleAssociation.label).toBe(
      "Vibrimi",
    );
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.I.principleAssociation.label).toBe(
      "Ritmi",
    );
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.O.principleAssociation.label).toBe(
      "Balanca",
    );
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.U.principleAssociation.label).toBe(
      "Ndryshimi",
    );
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.Y.principleAssociation.label).toBe(
      "Nisma",
    );
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1["Ë"].principleAssociation.label).toBe(
      "Dashuria",
    );
  });

  test("keeps current PrincipleRole authority external", () => {
    const serialized = JSON.stringify(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1);

    expect(serialized).not.toContain("Initiation/Source");
    expect(serialized).not.toContain("Expansion/Bridge");
    expect(serialized).not.toContain("Direction/Focus");
    expect(serialized).not.toContain("Mediation/Balance");
    expect(serialized).not.toContain("Containment/Depth");
    expect(serialized).not.toContain("Reflection/Mirror");
    expect(serialized).not.toContain("Completion/Unit");
  });

  test("represents O relations as profile data, not path behavior", () => {
    expect(SEVEN_VOICE_DOCTRINE_PROFILE_RELATIONS_V0_1).toMatchObject({
      "o-high-low-mediation": {
        subject: "O",
        relationType: "MEDIATES_HIGH_LOW_GROUPINGS",
        relatedVoices: ["A", "E", "I", "U", "Y", "Ë"],
      },
      "o-non-domination-balance": {
        subject: "O",
        relationType: "NON_DOMINATING_BALANCE",
      },
    });
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.O.relationalPropertyIds).toEqual([
      "o-high-low-mediation",
      "o-non-domination-balance",
    ]);
    expect(JSON.stringify(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1)).not.toContain(
      "transitions",
    );
  });

  test("represents A and Ë complementarity without path algebra", () => {
    expect(SEVEN_VOICE_DOCTRINE_PROFILE_RELATIONS_V0_1[
      "a-eh-complementarity"
    ]).toMatchObject({
      subject: "A",
      relatedVoices: ["Ë"],
      relationType: "COMPLEMENTARY_OPPOSITION",
      directionality: "SYMMETRIC",
    });
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A.relationalPropertyIds).toEqual([
      "a-eh-complementarity",
    ]);
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1["Ë"].relationalPropertyIds).toEqual([
      "a-eh-complementarity",
    ]);
  });

  test("preserves the Ë frequency tension without selecting a winner", () => {
    expect(SEVEN_VOICE_DOCTRINE_PROFILE_TENSIONS_V0_1).toHaveLength(1);
    expect(SEVEN_VOICE_DOCTRINE_PROFILE_TENSIONS_V0_1[0]).toMatchObject({
      tensionId: "seven-voices.frequency-grouping.v0_1",
      dimension: "frequency_or_level_association",
      status: "UNRESOLVED_OR_CONFLICTING",
      noSingleWinner: true,
      competingClaims: [
        { claimId: "chapter-01-high-light" },
        { claimId: "chapter-01-lower-anchoring" },
        { claimId: "chapter-02-o-high-low-mediation" },
        { claimId: "chapter-03-frequency-variation" },
      ],
    });
    expect(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1["Ë"].symbolicMetadata).toEqual({
      color: {
        value: "violet",
        sourceRefs: [
          expect.objectContaining({
            sourceId: "seven-voices.author-source.chapter-03.sq",
          }),
        ],
      },
      frequencyTensionIds: ["seven-voices.frequency-grouping.v0_1"],
    });
  });

  test("keeps every normalized datum traceable to verbatim author sources", () => {
    for (const profile of Object.values(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1)) {
      expect(profile.principleAssociation.sourceRefs.length).toBeGreaterThan(0);
      expect(profile.symbolicMetadata.color.sourceRefs.length).toBeGreaterThan(0);
      for (const property of profile.functionalProperties) {
        expect(property.sourceRefs.length).toBeGreaterThan(0);
        for (const sourceRef of property.sourceRefs) {
          expect(sourceRef).toMatchObject({
            sourceKind: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_KIND_V0_1,
            sourceStatus: DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_STATUS_V0_1,
            engineAuthority:
              DOCTRINE_FUNCTIONAL_PROFILE_SOURCE_ENGINE_AUTHORITY_V0_1,
          });
        }
      }
    }
  });

  test("keeps source imagery outside the executable profile vocabulary", () => {
    const serialized = JSON.stringify(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1);

    expect(serialized).not.toContain("newborn");
    expect(serialized).not.toContain("gravity");
    expect(serialized).not.toContain("galaxy");
    expect(serialized).not.toContain("dream");
    expect(serialized).not.toContain("digesting");
  });

  test("does not authorize lexical, target-sense, or generic path semantics", () => {
    const serialized = JSON.stringify(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1);

    expect(serialized).not.toContain("evidenceRefs");
    expect(serialized).not.toContain("semanticBridge");
    expect(serialized).not.toContain('"targetSense":');
    expect(serialized).not.toContain("startState");
    expect(serialized).not.toContain("resultState");
    expect(serialized).not.toContain("becomes");
    expect(serialized).not.toContain("pairwise");
    expect(serialized).not.toContain("self-transition");
    expect(serialized).not.toContain("terminal dominance");
    expect(serialized).not.toContain("uToILearning");
    expect(serialized).not.toContain("iToUDigesting");
    expect(serialized).not.toContain("digesting");
  });

  test("is deterministic and immutable", () => {
    const first = getSevenVoiceDoctrineFunctionalProfileV0_1("U");
    const second = getSevenVoiceDoctrineFunctionalProfileV0_1("U");

    expect(first).toBe(second);
    expect(first).toEqual(second);
    expect(Object.isFrozen(SEVEN_VOICE_DOCTRINE_PROFILES_V0_1)).toBe(true);
    expect(Object.isFrozen(first)).toBe(true);
  });

  test("deep-freezes exported tension and relation registries", () => {
    const tension = SEVEN_VOICE_DOCTRINE_PROFILE_TENSIONS_V0_1[0];
    const relation = SEVEN_VOICE_DOCTRINE_PROFILE_RELATIONS_V0_1[
      "o-high-low-mediation"
    ];

    expect(Object.isFrozen(tension)).toBe(true);
    expect(Object.isFrozen(tension.competingClaims)).toBe(true);
    expect(Object.isFrozen(relation)).toBe(true);
    expect(Object.isFrozen(relation.relatedVoices)).toBe(true);
  });

  test("rejects unknown closed-world IDs and registry key swaps", () => {
    const malformedProperty = {
      ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A,
      functionalProperties: [
        { ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A.functionalProperties[0], id: "typo" },
      ],
    };
    const malformedPrinciple = {
      ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A,
      principleAssociation: {
        ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A.principleAssociation,
        label: "Unknown",
      },
    };
    const swapped = {
      ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1,
      A: { ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A, voice: "E" },
      E: { ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.E, voice: "A" },
    };

    expect(validateSevenVoiceDoctrineFunctionalProfileV0_1(malformedProperty).ok).toBe(
      false,
    );
    expect(validateSevenVoiceDoctrineFunctionalProfileV0_1(malformedPrinciple).ok).toBe(
      false,
    );
    expect(validateSevenVoiceDoctrineProfilesV0_1(swapped).reasonCodes).toEqual([
      "VOICE_INVALID",
    ]);
  });

  test("rejects forbidden fields nested inside profile data", () => {
    const malformed = {
      ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A,
      functionalProperties: [
        {
          ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A.functionalProperties[0],
          evidenceRefs: [],
        },
      ],
    };

    expect(validateSevenVoiceDoctrineFunctionalProfileV0_1(malformed).ok).toBe(
      false,
    );
  });

  test.each([null, undefined, "Ẽ", "V1", 1, [], {}])(
    "fails closed for invalid Voice %p",
    (voice: unknown) => {
      expect(getSevenVoiceDoctrineFunctionalProfileV0_1(voice)).toBeNull();
    },
  );

  test("rejects a profile with lexical or path fields added", () => {
    const malformed = {
      ...SEVEN_VOICE_DOCTRINE_PROFILES_V0_1.A,
      evidenceRefs: [],
      startState: "A",
    };

    expect(validateSevenVoiceDoctrineFunctionalProfileV0_1(malformed)).toEqual({
      ok: false,
      schemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
      reasonCodes: [
        "LEXICAL_EVIDENCE_FIELD_PRESENT",
        "PATH_COMPOSITION_FIELD_PRESENT",
      ],
    });
  });
});
