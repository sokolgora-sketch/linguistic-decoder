import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { adaptAnalyzeV1ToUI } from "@/shared/analyzeV1Adapter";
import {
  AnalyzeWordResultV1ContractSchema,
  toAnalyzeWordResultV1Contract,
} from "@/shared/analyzeWordResult.v1.contract";
import { ensurePrimaryAndCandidatePaths } from "@/shared/ensurePaths";

const PRIMARY_PATH_CASES = [
  { word: "study", expected: ["U", "Y"] },
  { word: "damage", expected: ["A", "E"] },
  { word: "data", expected: ["A"] },
  { word: "dij", expected: ["I"] },
  { word: "mode", expected: ["O", "E"] },
  { word: "xyz", expected: ["Y"] },
] as const;

describe("Open Instrument authoritative primary path v0.1", () => {
  it.each(PRIMARY_PATH_CASES)(
    "preserves the deterministic engine path for $word",
    async ({ word, expected }) => {
      const payload = await runAnalysisDeterministic(
        word,
        {
          mode: "strict",
          alphabet: "auto",
        },
      );

      expect(payload.primaryPath.voicePath)
        .toEqual(expected);

      const out =
        enginePayloadToAnalysisResult(payload);

      expect(out.primaryPath).toEqual({
        voicePath: expected.join("-"),
        levelPath:
          payload.primaryPath.levelPath.join("-"),
        ringPath:
          payload.primaryPath.ringPath.join("-"),
      });

      const projected =
        toAnalyzeWordResultV1Contract(out);

      expect(projected.primaryPath)
        .toEqual(out.primaryPath);

      expect(
        AnalyzeWordResultV1ContractSchema.safeParse(
          projected,
        ).success,
      ).toBe(true);

      const ui =
        adaptAnalyzeV1ToUI(out);

      expect(ui.primaryPath?.voicePath)
        .toEqual(expected);

      expect(ui.primaryPath?.ringPath)
        .toEqual(
          payload.primaryPath.ringPath,
        );

      const ensured =
        ensurePrimaryAndCandidatePaths(ui);

      expect(ensured.primaryPath?.voicePath)
        .toEqual(expected);
    },
  );

  it("prefers the emitted engine path over a conflicting seed-candidate path", () => {
    const raw = {
      word: "damage",
      sanitized: "damage",
      engineVersion: "0.2.0-symbolic",
      mode: "strict",
      alphabet: "auto",
      primaryPath: {
        voicePath: "A-E",
        levelPath: "3-2",
        ringPath: "3-2",
      },
      candidates: [
        {
          language: "Latin",
          form: "damnum",
          voices: {
            voiceSequence: ["U", "I"],
            ringPath: [1, 1],
          },
        },
      ],
    };

    const ui =
      adaptAnalyzeV1ToUI(raw as any);

    expect(ui.primaryPath?.voicePath)
      .toEqual(["A", "E"]);

    expect(ui.primaryPath?.ringPath)
      .toEqual([3, 2]);

    expect(ui.candidates[0].vowelPath)
      .toBe("U-I");
  });

  it("does not copy a word-level primary path into a candidate row", () => {
    const raw = {
      word: "damage",
      sanitized: "damage",
      engineVersion: "0.2.0-symbolic",
      mode: "strict",
      alphabet: "auto",
      primaryPath: {
        voicePath: "A-E",
        levelPath: "3-2",
        ringPath: "3-2",
      },
      candidates: [
        {
          language: "Latin",
          form: "damnum",
        },
      ],
    };

    const ui =
      adaptAnalyzeV1ToUI(raw as any);

    const ensured =
      ensurePrimaryAndCandidatePaths(ui);

    expect(ensured.primaryPath?.voicePath)
      .toEqual(["A", "E"]);

    expect(ensured.candidates[0].vowelPath)
      .toBeUndefined();
  });
});
