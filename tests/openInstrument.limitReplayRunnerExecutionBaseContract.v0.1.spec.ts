import fs from "node:fs";
import path from "node:path";

const runnerPath = path.join(
  process.cwd(),
  "scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs",
);

const source = fs.readFileSync(runnerPath, "utf8");

describe("Open Instrument limit replay runner execution-base contract v0.1", () => {
  it("does not hardcode the stale reviewed execution base SHA", () => {
    expect(source).not.toContain(["EXPECTED", "MAIN", "SHA"].join("_"));
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


  it("passes verified current main SHA into artifact construction", () => {
    const buildArtifactSignature = source.match(/function buildArtifact\(\{[\s\S]*?\n\}\) \{/);
    expect(buildArtifactSignature?.[0]).toContain("currentHeadSha");

    const artifactCall = source.match(/const artifact = buildArtifact\(\{[\s\S]*?\n  \}\);/);
    expect(artifactCall?.[0]).toContain("currentHeadSha");

    expect(source).toContain("reviewedExecutionBaseSha: currentHeadSha");
    expect(source).toContain("currentHeadSha,");
    expect(source).not.toContain("currentHeadSha: EXPECTED_MAIN_SHA");
    expect(source).not.toContain(["EXPECTED", "MAIN", "SHA"].join("_"));
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


  it("emits invalidation diagnostics for invalidated replay artifacts", () => {
    expect(source).toContain("function buildInvalidationDiagnostics(");
    expect(source).toContain("invalidationCode");
    expect(source).toContain("invalidationStage");
    expect(source).toContain("invalidationReason");
    expect(source).toContain("failedCheck");
    expect(source).toContain("expectedShape");
    expect(source).toContain("receivedShapeSummary");
    expect(source).toContain("parserStatus");
    expect(source).toContain("validatorStatus");
    expect(source).toContain("providerOutputPresent");
    expect(source).toContain("providerOutputParseable");
    expect(source).toContain("claimBoundaryStatus");
    expect(source).toContain("diagnosticMessages");

    expect(source).toContain("PROVIDER_OUTPUT_MISSING");
    expect(source).toContain("PROVIDER_OUTPUT_UNPARSEABLE");
    expect(source).toContain("VALIDATION_FAILED");
    expect(source).toContain("INVALIDATED_WITHOUT_ATTACHED_CAUSE");

    expect(source).toContain("invalidationCode: invalidationDiagnostics.invalidationCode");
    expect(source).toContain("invalidationReason: invalidationDiagnostics.invalidationReason");
    expect(source).toContain("invalidationDiagnostics");
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
