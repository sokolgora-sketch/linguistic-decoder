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
});
