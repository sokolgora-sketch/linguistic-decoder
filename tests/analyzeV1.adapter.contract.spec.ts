import { adaptAnalyzeV1ToUI } from "@/shared/analyzeV1Adapter";

describe("analyze-v1 adapter — UI contract invariants", () => {
  it("ensures candidates have vowelPath when voiceSequence exists", () => {
    const raw = {
      word: "study",
      sanitized: "study",
      engineVersion: "0.2.0-symbolic",
      candidates: [
        {
          id: "latin-studium",
          language: "Latin",
          form: "studium",
          voices: { voiceSequence: ["U", "I"], ringPath: [1, 1] },
        },
      ],
    };

    const ui = adaptAnalyzeV1ToUI(raw as any);

    expect(ui.word).toBe("study");
    expect(ui.candidates[0].vowelPath).toBe("U-I");
  });

  it("ensures primaryPath.voicePath[] exists when best candidate has a vowel path", () => {
    const raw = {
      word: "study",
      sanitized: "study",
      engineVersion: "0.2.0-symbolic",
      candidates: [
        {
          language: "Latin",
          form: "studium",
          voices: { voiceSequence: ["U", "I"], ringPath: [1, 1] },
        },
      ],
    };

    const ui = adaptAnalyzeV1ToUI(raw as any);

    expect(ui.primaryPath).not.toBeNull();
    expect(ui.primaryPath?.voicePath).toEqual(["U", "I"]);
  });

  it('normalizes arrow vowelPath like "U → I" to "U-I"', () => {
    const raw = {
      word: "study",
      sanitized: "study",
      engineVersion: "0.2.0-symbolic",
      candidates: [
        {
          language: "Latin",
          form: "studium",
          vowelPath: "U → I",
        },
      ],
    };

    const ui = adaptAnalyzeV1ToUI(raw as any);
    expect(ui.candidates[0].vowelPath).toBe("U-I");
  });

  it("preserves candidate source kind from candidateRecord", () => {
    const raw = {
      word: "study",
      sanitized: "study",
      engineVersion: "0.2.0-symbolic",
      candidates: [
        {
          language: "Latin",
          form: "studium",
          candidateRecord: {
            source: {
              kind: "SEED",
              ref: "canonCandidates.ts",
              version: "canon.v0.1",
            },
          },
        },
      ],
    };

    const ui = adaptAnalyzeV1ToUI(raw as any);
    expect(ui.candidates[0].sourceKind).toBe("SEED");
  });

  it("preserves the typed embryo-first candidate fields", () => {
    const raw = {
      word: "study",
      sanitized: "study",
      engineVersion: "0.2.0-symbolic",
      candidates: [
        {
          id: "albanian-study",
          language: "Albanian",
          form: "shtu + di",
          candidateId: "albanian-shtu-di-study-functional",
          displayForm: "Albanian shtu + di study",
          candidateLanguage: "Albanian",
          claimType: "functionalMotivation",
          originClaim: "not_claimed",
          historicalRelation: "not_evaluated",
          embryo: "di",
          embryoAuthority: "source_attested_exact_form",
          embryoSize: 2,
          embryoLanguage: "Albanian",
          isolatedStandaloneForm: "di",
          plainStandaloneGloss: "to know",
          sourceNote: "independent source note",
          segmentation: null,
          semanticBridge: "study as know",
          expansionChain: ["di", "study"],
          validationOutcome: "partial",
          validationReasons: [],
          rankGroup: "partialFunctionalMotivation",
          rankScore: 60,
          rankReason: "partial evidence",
          claimBoundary: "not historical origin",
          userDecisionPosture: "user_decides",
        },
      ],
    };

    expect(adaptAnalyzeV1ToUI(raw).candidates[0]).toMatchObject({
      candidateId: "albanian-shtu-di-study-functional",
      claimType: "functionalMotivation",
      embryo: "di",
      validationOutcome: "partial",
      rankGroup: "partialFunctionalMotivation",
      userDecisionPosture: "user_decides",
    });
  });
});
