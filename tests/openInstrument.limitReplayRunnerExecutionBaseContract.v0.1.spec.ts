import fs from "node:fs";
import path from "node:path";

const runnerPath = path.join(
  process.cwd(),
  "scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs",
);

const source = fs.readFileSync(runnerPath, "utf8");

describe("Open Instrument limit replay runner execution-base contract v0.1", () => {
  it("does not hardcode the stale reviewed execution base SHA", () => {
    expect(source).not.toContain(["const EXPECTED", "MAIN_SHA"].join("_"));
    expect(source).not.toContain(["4a4b2dc411b929c486e91ff80923fc728", "c44bfc6"].join(""));
  });

  it("requires reviewed execution base as an explicit argument", () => {
    expect(source).toContain('"reviewed-execution-base"');
    expect(source).toContain('reviewedExecutionBase: args["reviewed-execution-base"]');
    expect(source).toContain("ensureOnReviewedMainBase(args.reviewedExecutionBase)");
  });

  it("validates reviewed execution base as a full git SHA", () => {
    expect(source).toContain("const FULL_GIT_SHA_PATTERN = /^[0-9a-f]{40}$/;");
    expect(source).toContain("reviewed-execution-base must be a full 40-character git SHA");
  });

  it("keeps main-branch and current-HEAD fail-closed prechecks", () => {
    expect(source).toContain('runner must execute from main');
    expect(source).toContain("main SHA does not match the reviewed execution base");
    expect(source).toContain("expected: reviewedExecutionBase");
    expect(source).toContain("actual: headSha");
  });

  it("preserves the reviewed exact limit replay scope", () => {
    expect(source).toContain('const EXPECTED_WORD = "limit";');
    expect(source).toContain(
      'const EXPECTED_STAGE = "MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY";',
    );
    expect(source).toContain('const EXPECTED_SEGMENTATION = "LI + MIT";');
    expect(source).toContain('const EXPECTED_PROVIDER_FAMILY = "local_only_openai_compatible";');
    expect(source).toContain('const EXPECTED_PROVIDER_NAME = "ollama_openai_compat";');
    expect(source).toContain('const EXPECTED_MODEL = "llama3.1:8b";');
    expect(source).toContain('const EXPECTED_ENDPOINT_CLASS = "localhost_only";');
    expect(source).toContain('const EXPECTED_BASE_URL = "http://127.0.0.1:11434/v1";');
  });

  it("preserves localhost-only and claim-boundary protections", () => {
    expect(source).toContain("OPENAI_BASE_URL must be localhost-only");
    expect(source).toContain("OPENAI_API_KEY must be the reviewed local dummy value");
    expect(source).toContain("publicationEvidence");
    expect(source).toContain("originEvidence");
    expect(source).toContain("modelQualityEvidence");
    expect(source).toContain("candidateTruthEvidence");
    expect(source).toContain("evidencePromotion");
    expect(source).toContain("winnerCrowned");
  });
});
