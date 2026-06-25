import { createHash } from "crypto";
import { readFileSync } from "fs";
import path from "path";

import { symbolicMathOrder } from "../src/shared/sevenVoiceOrderedViews.v0.1";

const repoRoot = path.resolve(__dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("seven-voice ordered views symbolic core wiring v0.1", () => {
  it("keeps symbolicMathOrder stable", () => {
    expect(symbolicMathOrder).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
  });

  it("wires direct symbolic core sources to symbolicMathOrder", () => {
    const math7 = readRepoFile("src/shared/math7.core.ts");
    const core = readRepoFile("src/core/sevenVowelsCore.ts");
    const doctrine = readRepoFile("src/shared/doctrine/voiceDoctrine.v0.1.ts");

    expect(math7).toContain(
      'import { symbolicMathOrder, type SevenVoiceKey } from "./sevenVoiceOrderedViews.v0.1";',
    );
    expect(math7).toContain("export const SEVEN_VOWELS = symbolicMathOrder;");
    expect(math7).toContain("export type SevenVowel = SevenVoiceKey;");

    expect(core).toContain(
      'import { symbolicMathOrder, type SevenVoiceKey } from "../shared/sevenVoiceOrderedViews.v0.1";',
    );
    expect(core).toContain("export const VOWELS = symbolicMathOrder;");
    expect(core).toContain("export type Vowel = SevenVoiceKey;");

    expect(doctrine).toContain(
      'import { symbolicMathOrder, type SevenVoiceKey } from "../sevenVoiceOrderedViews.v0.1";',
    );
    expect(doctrine).toContain("export const VOICES_V0_1 = symbolicMathOrder;");
    expect(doctrine).toContain("export type VoiceV0_1 = SevenVoiceKey;");
  });

  it("keeps sevenPrinciples as an indirect symbolic consumer through core aliases", () => {
    const sevenPrinciples = readRepoFile("src/shared/sevenPrinciples.v1.ts");

    expect(sevenPrinciples).toContain('import {');
    expect(sevenPrinciples).toContain('} from "@/core/sevenVowelsCore";');
    expect(sevenPrinciples).toContain('import { SEVEN_VOWELS, VOWEL_INDEX as M7_INDEX } from "@/shared/math7.core";');
    expect(sevenPrinciples).toContain("export const VOWELS_7 = VOWELS;");
    expect(sevenPrinciples).not.toContain('["A", "E", "I", "O", "U", "Y", "Ë"]');
  });

  it("removes direct symbolic literal arrays from wired source consumers", () => {
    for (const relativePath of [
      "src/shared/math7.core.ts",
      "src/core/sevenVowelsCore.ts",
      "src/shared/doctrine/voiceDoctrine.v0.1.ts",
    ]) {
      const text = readRepoFile(relativePath);

      expect(text).not.toContain('["A", "E", "I", "O", "U", "Y", "Ë"]');
      expect(text).not.toContain("['A', 'E', 'I', 'O', 'U', 'Y', 'Ë']");
    }
  });

  it("keeps reviewed replay artifact unchanged", () => {
    const artifactPath = path.join(
      repoRoot,
      "docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json",
    );
    const artifact = readFileSync(artifactPath);
    expect(createHash("sha256").update(artifact).digest("hex")).toBe(
      "51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65",
    );
  });

  it("keeps source and candidate replay guards unchanged", () => {
    const replayScript = readRepoFile("scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs");

    expect(replayScript).toContain("GENERALIZATION_REPLAY_SOURCE_LANGUAGE_SCOPE_POLICY_V0_1");
    expect(replayScript).toContain('sourceScope: "english_source_only"');
    expect(replayScript).toContain("GENERALIZATION_REPLAY_CANDIDATE_LANGUAGE_POLICY_V0_1");
    expect(replayScript).toContain(
      'activeTargetGridCandidateLanguageIds: Object.freeze(["albanian", "latin", "greek", "sanskrit"])',
    );
  });
});
