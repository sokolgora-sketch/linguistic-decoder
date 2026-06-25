import { createHash } from "crypto";
import { readFileSync } from "fs";
import path from "path";

const repoRoot = path.resolve(__dirname, "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("seven-voice ordered views safe consumer wiring v0.1", () => {
  it("wires eval TypeScript bucket spec to evalBucketOrder without touching JSON bucket fixtures", () => {
    const evalSpec = readRepoFile("src/shared/evals/spec.v0.1.ts");
    const evalSpecJson = readRepoFile("tests/evals/evals.spec.v0.1.json");

    expect(evalSpec).toContain('import { evalBucketOrder } from "../sevenVoiceOrderedViews.v0.1";');
    expect(evalSpec).toContain("evalBucketOrder");

    expect(evalSpecJson).toContain('"V1"');
    expect(evalSpecJson).toContain('"V7"');
    expect(evalSpecJson).not.toContain("sevenVoiceOrderedViews");
    expect(evalSpecJson).not.toContain("evalBucketOrder");
  });

  it("wires eval chart guard to acousticVoiceLabOrder while keeping acoustic order explicit through SSOT", () => {
    const evalChartGuard = readRepoFile("tests/evals/evals.chart.canonical-dot-colors.guard.v0.1.spec.ts");

    expect(evalChartGuard).toContain(
      'import { acousticVoiceLabOrder } from "../../src/shared/sevenVoiceOrderedViews.v0.1";',
    );
    expect(evalChartGuard).toContain("acousticVoiceLabOrder");
    const evalUi = readRepoFile("src/ui/evals/EvalsPageClient.v0.1.tsx");
    expect(evalUi).toContain("acousticVoiceLabOrder[");
    expect(evalUi).not.toContain('(["A", "O", "E", "Ë", "U", "Y", "I"] as const)');
  });

  it("keeps JSON VoiceLab fixture and reviewed replay artifact unwired and unchanged", () => {
    const voicelabFixture = readRepoFile("tests/fixtures/voicelab/sgi-seed-locked-2026-03-28.v0.2.json");
    expect(voicelabFixture).toContain('"A"');
    expect(voicelabFixture).toContain('"I"');
    expect(voicelabFixture).not.toContain("sevenVoiceOrderedViews");
    expect(voicelabFixture).not.toContain("acousticVoiceLabOrder");

    const artifactPath = path.join(
      repoRoot,
      "docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json",
    );
    const artifact = readFileSync(artifactPath);
    expect(createHash("sha256").update(artifact).digest("hex")).toBe(
      "51cd3d8eece9ace9f498f801675088a1c2f613a47c47ba673d83cd6b911f1c65",
    );
  });

  it("keeps source and candidate language replay guards unchanged", () => {
    const replayScript = readRepoFile("scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs");

    expect(replayScript).toContain("GENERALIZATION_REPLAY_SOURCE_LANGUAGE_SCOPE_POLICY_V0_1");
    expect(replayScript).toContain('sourceScope: "english_source_only"');
    expect(replayScript).toContain("GENERALIZATION_REPLAY_CANDIDATE_LANGUAGE_POLICY_V0_1");
    expect(replayScript).toContain(
      'activeTargetGridCandidateLanguageIds: Object.freeze(["albanian", "latin", "greek", "sanskrit"])',
    );
  });
});
