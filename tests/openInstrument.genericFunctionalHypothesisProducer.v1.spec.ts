import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  discoverStructuralHypothesesV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  produceGenericFunctionalHypothesisV1,
  validateGenericFunctionalHypothesisV1,
} from "@/shared/openInstrument/genericFunctionalHypothesisProducer.v1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

// Frozen before observing its generated embryo or profile projection. It is
// absent from the repository's semantic registries, catalogs, and fixtures.
const BLIND_POSITIVE_WORD = "lantra";

function blindStructuralHypothesis() {
  const hypothesis = discoverStructuralHypothesesV0_1(BLIND_POSITIVE_WORD)[0];
  if (!hypothesis) throw new Error("blind positive must be structurally valid");
  return hypothesis;
}

describe("generic functional hypothesis producer v1", () => {
  test("projects an unseen single-Voice input without lexical inputs", () => {
    const structuralHypothesis = blindStructuralHypothesis();
    const built = produceGenericFunctionalHypothesisV1({
      targetWord: BLIND_POSITIVE_WORD,
      structuralHypothesis,
      voicePath: ["A"],
    });

    expect(built.ok).toBe(true);
    if (!built.ok) return;

    expect(built.hypothesis.voicePath).toEqual(["A"]);
    expect(built.hypothesis.functionalComponents).toHaveLength(1);
    expect(built.hypothesis.functionalComponents[0]).toMatchObject({
      position: 0,
      voice: "A",
      principleAssociation: { label: "Bashkimi" },
      profileAuthority: "ENGINE_AUTHORIZED_DOCTRINE_PROFILE",
    });
    expect(built.hypothesis.functionalStatement).toBeNull();
    expect(built.hypothesis.semanticBridge).toBeNull();
    expect(built.hypothesis.evidenceRefs).toEqual([]);
    expect(built.hypothesis.truthClassification).toBe("hypothesis");
    expect(built.hypothesis.targetBinding).toBe("NOT_EVALUATED");
    expect(built.hypothesis.semanticInteraction).toBe("NOT_AUTHORIZED");
    expect(built.hypothesis.userDecisionPosture).toBe("user_decides");
    expect(built.hypothesis.noSingleWinner).toBe(true);
    expect(
      Object.prototype.hasOwnProperty.call(built.hypothesis, "targetSense"),
    ).toBe(false);
    expect(
      Object.prototype.hasOwnProperty.call(
        built.hypothesis,
        "semanticAlignment",
      ),
    ).toBe(false);
    expect(validateGenericFunctionalHypothesisV1(built.hypothesis)).toEqual({
      ok: true,
      reasonCodes: [],
    });
  });

  test("preserves ordered independent components for a multi-Voice path", () => {
    const built = produceGenericFunctionalHypothesisV1({
      targetWord: BLIND_POSITIVE_WORD,
      structuralHypothesis: blindStructuralHypothesis(),
      voicePath: ["U", "I"],
    });

    expect(built.ok).toBe(true);
    if (!built.ok) return;

    expect(built.hypothesis.voicePath).toEqual(["U", "I"]);
    expect(
      built.hypothesis.functionalComponents.map((component) => [
        component.position,
        component.voice,
      ]),
    ).toEqual([
      [0, "U"],
      [1, "I"],
    ]);
    expect(built.hypothesis.compositionMode).toBe(
      "ORDERED_INDEPENDENT_COMPONENTS",
    );
    expect(built.hypothesis.semanticInteraction).toBe("NOT_AUTHORIZED");
    expect(built.hypothesis.claimBoundary.pathComposition).toBe(
      "NOT_AUTHORIZED",
    );
  });

  test("fails closed for Null and noncanonical Voices", () => {
    const nullResult = produceGenericFunctionalHypothesisV1({
      targetWord: BLIND_POSITIVE_WORD,
      structuralHypothesis: null as never,
      voicePath: ["A"],
    });
    const invalidVoice = produceGenericFunctionalHypothesisV1({
      targetWord: BLIND_POSITIVE_WORD,
      structuralHypothesis: blindStructuralHypothesis(),
      voicePath: ["Ẽ"] as never,
    });

    expect(nullResult).toEqual({
      ok: false,
      reasonCodes: ["STRUCTURAL_HYPOTHESIS_MISSING"],
    });
    expect(invalidVoice).toEqual({
      ok: false,
      reasonCodes: ["VOICE_PATH_INVALID"],
    });
    expect(discoverStructuralHypothesesV0_1("zzxqv")).toEqual([]);
  });

  test("does not consume conflicting answer-bearing input fields", () => {
    const structuralHypothesis = blindStructuralHypothesis();
    const clean = produceGenericFunctionalHypothesisV1({
      targetWord: BLIND_POSITIVE_WORD,
      structuralHypothesis,
      voicePath: ["A"],
    });
    const contaminated = produceGenericFunctionalHypothesisV1({
      targetWord: BLIND_POSITIVE_WORD,
      structuralHypothesis,
      voicePath: ["A"],
      targetSense: { id: "answer", label: "answer" },
      semanticAlignment: { alignmentStatus: "proposed" },
      semanticBridge: "answer-bearing bridge",
      evidenceRefs: ["reviewed-row"],
      provider: "forbidden-provider",
    } as never);

    expect(contaminated).toEqual(clean);
  });

  test("runtime integration emits a bounded candidate without answer fields", () => {
    const result = enginePayloadToAnalysisResult({
      engineVersion: "test-engine",
      word: BLIND_POSITIVE_WORD,
      mode: "strict",
      alphabet: "auto",
      primaryPath: {
        voicePath: ["A", "O"],
        ringPath: [0, 1],
        levelPath: [1, 1],
        ops: [],
        checksums: { V: 0, E: 0, C: 0 },
        kept: 0,
      },
      frontierPaths: [],
      windows: [],
      windowClasses: [],
      signals: [],
      inputs: {
        targetSenseId: "ignored",
        targetSenseLabel: "ignored",
        semanticAlignmentByStructuralHypothesisId: {
          ignored: { semanticBridge: "ignored" },
        },
      },
    } as never) as any;

    const candidates = Array.isArray(result.candidates)
      ? result.candidates
      : [];
    const generic = candidates.find(
      (candidate: any) =>
        candidate.sourceKind ===
        "logic_derived_generic_functional_hypothesis",
    );

    expect(generic).toBeDefined();
    expect(generic.claimType).toBe("genericFunctionalHypothesis");
    expect(generic.functionalComponents.length).toBeGreaterThan(0);
    expect(generic.functionalStatement).toBeNull();
    expect(generic.semanticBridge).toBeNull();
    expect(generic.evidenceRefs).toEqual([]);
    expect(generic.targetSenseId).toBeUndefined();
    expect(generic.targetSenseLabel).toBeUndefined();
    expect(generic.semanticAlignmentStatus).toBeUndefined();
    expect(result.analysisStatusV0_1.status).toBe("candidate_only");

    const genericRow = adaptAnalysisToTelemetryVM(result).candidates.find(
      (candidate) => candidate.id === generic.id,
    );
    expect(genericRow?.functionalComponents).toEqual({
      kind: "present",
      value: [
        expect.objectContaining({
          embryo: generic.functionalComponents[0].voice,
          language: { kind: "present", value: "voice-profile" },
          evidenceState: {
            kind: "present",
            value: generic.functionalComponents[0].profileTruthClassification,
          },
        }),
      ],
    });
  });

  test("is deterministic and immutable", () => {
    const input = {
      targetWord: BLIND_POSITIVE_WORD,
      structuralHypothesis: blindStructuralHypothesis(),
      voicePath: ["A", "O"] as const,
    };
    const first = produceGenericFunctionalHypothesisV1(input);
    const second = produceGenericFunctionalHypothesisV1(input);

    expect(second).toEqual(first);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(Object.isFrozen(first.hypothesis)).toBe(true);
    expect(Object.isFrozen(first.hypothesis.functionalComponents)).toBe(true);
  });

  test("validator rejects profile-component drift", () => {
    const built = produceGenericFunctionalHypothesisV1({
      targetWord: BLIND_POSITIVE_WORD,
      structuralHypothesis: blindStructuralHypothesis(),
      voicePath: ["A"],
    });

    expect(built.ok).toBe(true);
    if (!built.ok) return;

    const tampered = {
      ...built.hypothesis,
      functionalComponents: [
        {
          ...built.hypothesis.functionalComponents[0],
          functionalProperties: [],
        },
      ],
    };
    const validation = validateGenericFunctionalHypothesisV1(tampered);

    expect(validation.ok).toBe(false);
    expect(validation.reasonCodes).toContain("FUNCTIONAL_COMPONENTS_INVALID");

    const flattenedSemanticFields = {
      ...built.hypothesis,
      targetSenseId: "answer-bearing-sense",
      targetSenseLabel: "answer-bearing label",
      semanticAlignmentStatus: "proposed",
    };
    const flattenedValidation = validateGenericFunctionalHypothesisV1(
      flattenedSemanticFields,
    );

    expect(flattenedValidation.ok).toBe(false);
    expect(flattenedValidation.reasonCodes).toContain(
      "PROHIBITED_SEMANTIC_FIELD_PRESENT",
    );
  });
});
