import fs from "node:fs";
import path from "node:path";

const runnerPath = path.join(
  process.cwd(),
  "scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs",
);

const source = fs.readFileSync(runnerPath, "utf8");

describe("Open Instrument request-scoped replay runner execution-base contract v0.1", () => {
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

  it("preserves request-scoped replay inputs without default target assumptions", () => {
    expect(source).toContain("GENERIC_REPLAY_SCOPE_V0_1");
    expect(source).toContain("word must be a non-empty reviewed replay word");
    expect(source).toContain("stage must be a non-empty reviewed replay stage");
    expect(source).toContain("segmentation must be a non-empty reviewed replay segmentation");
    expect(source).toContain('const EXPECTED_PROVIDER_FAMILY = "local_only_openai_compatible";');
    expect(source).toContain('const EXPECTED_PROVIDER_NAME = "ollama_openai_compat";');
    expect(source).toContain('const EXPECTED_MODEL = "llama3.1:8b";');
    expect(source).toContain('const EXPECTED_ENDPOINT_CLASS = "localhost_only";');
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



  it("extracts OpenAI-compatible chat completion message content before validation", () => {
    expect(source).toContain("function extractOpenAiCompatibleMessageContentPayload(parsedPayload)");
    expect(source).toContain("parsedPayload?.choices?.[0]?.message?.content");
    expect(source).toContain("const rawParsedProviderResponse = JSON.parse(rawResponseText);");
    expect(source).toContain("parsed = extractOpenAiCompatibleMessageContentPayload(rawParsedProviderResponse);");
  });

  it("wires invalidation diagnostics to actual analysis and provider payload", () => {
    expect(source).toContain("outcomeClassification: analysis?.outcomeClassification");
    expect(source).toContain("providerOutput: rawProviderResponse ?? rawErrorText");
    expect(source).toContain("rawText: capturedText");
    expect(source).toContain("responseText: capturedText");
    expect(source).toContain("parsedOutput: analysis");
    expect(source).toContain("parsedJson: analysis?.normalizedCandidatePayload");
    expect(source).toContain("validation: analysis?.validationOutcome");
    expect(source).toContain("validationResult: analysis?.validationOutcome");
    expect(source).toContain("validationErrors: analysis?.validationOutcome?.errors");
    expect(source).toContain("parseError: analysis?.parseError ?? null");
    expect(source).toContain("claimBoundary: analysis?.validationOutcome");

    expect(source).not.toContain('outcomeClassification: typeof outcomeClassification === "undefined"');
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

  it("keeps comic replay scope representable without weakening local-only safeguards", () => {
    expect(source).toContain("GENERIC_REPLAY_SCOPE_V0_1");
    expect(source).toContain("\"word\"");
    expect(source).toContain("\"stage\"");
    expect(source).toContain("\"segmentation\"");
    expect(source).toContain("\"output\"");
    expect(source).toContain("requestContext.word");
    expect(source).toContain("requestContext.stage");
    expect(source).toContain("requestContext.segmentation");
    expect(source).toContain("ARTIFACT_OUTPUT_ROOT");
    expect(source).toContain("outputPath: args.output");
    expect(source).toContain("output must stay inside reviewed Open Instrument artifact root and end with .json");
    expect(source).toContain("choices?.[0]?.message?.content");
    expect(source).toContain("local_only_openai_compatible");
    expect(source).toContain("localhost_only");

    const reviewedComicScope = {
      word: "comic",
      stage: "MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY",
      segmentation: "COM + IC",
      output: "docs/open-instrument/artifacts/zheji-generalization/comic-generalization-replay-v0.1.json",
    };

    expect(reviewedComicScope.word).toBe("comic");
    expect(reviewedComicScope.segmentation).toBe("COM + IC");
    expect(reviewedComicScope.output).toContain("comic-generalization-replay-v0.1.json");
  });


  it("passes request-scoped word stage and segmentation into analyzeResponse on provider success", () => {
    expect(source).toContain("analysis = analyzeResponse(rawProviderResponse, {");
    expect(source).toContain("word: args.word");
    expect(source).toContain("stage: args.stage");
    expect(source).toContain("segmentation: args.segmentation");
    expect(source).toContain("systemPrompt: request.systemPrompt");
    expect(source).toContain("userPrompt: request.userPrompt");
    expect(source).toContain("promptSha256: request.promptSha256");
    expect(source).toContain("requestBodyText");
    expect(source).toContain('["word", requestContext.word]');
    expect(source).toContain('["stage", requestContext.stage]');
    expect(source).toContain('["segmentation", requestContext.segmentation]');
  });


  it("requires chunk and language on non-null candidates", () => {
    expect(source).toContain("chunk: String(candidate.chunk");
    expect(source).toContain("language: String(candidate.language");
    expect(source).toContain("candidate.chunk must be a non-empty reviewed segmentation chunk");
    expect(source).toContain("candidate.language must be a non-empty candidate language");
  });

  it("rejects anti-tautology failures as degenerate signal instead of success", () => {
    expect(source).toContain("candidate.isolatedStandaloneForm must not equal input word");
    expect(source).toContain("candidate.plainStandaloneDefinitionGloss must not merely define the full input word");
    expect(source).toContain("candidate.language must not equal source language");
    expect(source).toContain("GENERALIZATION_SIGNAL_DEGENERATE_CIRCULAR_INPUT_WORD");
  });

  it("limits non-null candidates to reviewed segmentation chunks", () => {
    expect(source).toContain("parseReviewedSegmentationChunks");
    expect(source).toContain("candidate.chunk must be one of the reviewed segmentation chunks");
    expect(source).toContain("sourceLanguage: sourceLanguageForRequest(args)");
  });

  it("prompts Brain away from whole-word dictionary definitions", () => {
    expect(source).toContain("Do not define the full input word.");
    expect(source).toContain("Do not return the full input word as candidate.isolatedStandaloneForm.");
    expect(source).toContain("Every non-null candidate must include candidate.chunk.");
    expect(source).toContain("Every non-null candidate must include candidate.language.");
    expect(source).toContain("Return nullAccepted true with candidate null when no chunk-language candidate is found.");
  });

});
