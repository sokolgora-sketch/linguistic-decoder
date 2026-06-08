import {
  ZHEJI_STUDY003_HEART_INPUT_V0_1,
  buildZhejiStudy003ReplayPlanV0_1,
} from "@/shared/openInstrument/zhejiStudy003ReplayRunner.v0.1";

describe("Zheji study003 replay runner scaffold v0.1", () => {
  it("locks the fixed study003 Heart input", () => {
    expect(ZHEJI_STUDY003_HEART_INPUT_V0_1).toMatchObject({
      word: "study",
      normalizedWord: "study",
      segmentationId: "study.segmentation.003",
      chunks: ["SHTU", "DI"],
      voicePath: ["U", "I"],
      legalTransforms: ["S_TO_SH", "FINAL_Y_TO_I"],
      targetLanguages: ["Albanian", "Latin", "Chinese", "Germanic"],
    });
  });

  it("builds a plan-only replay payload without model or artifact execution", () => {
    const plan = buildZhejiStudy003ReplayPlanV0_1({
      date: "2026-06-08",
    });

    expect(plan).toMatchObject({
      runnerVersion: "zheji-study003-replay-runner.v0.1",
      artifactVersion: "v0.1",
      mode: "PLAN_ONLY_NO_MODEL_CALL",
      modelCallPermittedByThisHelper: false,
      artifactWritePermittedByThisHelper: false,
      runtimeWiringPermitted: false,
      providerDefaultChanged: false,
      openAiApiAllowed: false,
      provider: "openai_compat",
      model: "llama3.1:8b",
      baseUrl: "http://localhost:11434/v1",
      endpoint: "http://localhost:11434/v1/chat/completions",
      artifactPath:
        "docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-replay-v0.1.json",
      reportPath:
        "docs/open-instrument/study-segmentation-003-zheji-replay-result-v0.1.md",
    });

    expect(plan.zhejiPromptMetadata).toMatchObject({
      zhejiPromptContractApplied: true,
      sevenVoiceDoctrineReferenceIncluded: true,
      symbolicEvaluationAllowed: true,
      zhejiFieldsRequested: ["analysisLayers", "semanticTransparency"],
      transparencyContrastRequestedFromBrain: false,
    });
  });

  it("forbids Brain-authored contrast, winner, history, origin, and candidateType mutation in prompts", () => {
    const plan = buildZhejiStudy003ReplayPlanV0_1({
      date: "2026-06-08",
    });

    expect(plan.systemPrompt).toContain("Do not claim origin");
    expect(plan.systemPrompt).toContain("Do not score, rank, choose a winner");
    expect(plan.systemPrompt).toContain("Inspect semantic/function motivation only");
    expect(plan.systemPrompt).toContain("Brain must not return transparencyContrast");
    expect(plan.systemPrompt).toContain("Brain must not return transparencyContrastNote");
    expect(plan.systemPrompt).toContain("candidateType must not be changed by Zheji fields");

    expect(plan.userPrompt).toContain("analysisLayers");
    expect(plan.userPrompt).toContain("semanticTransparency");
    expect(plan.userPrompt).toContain("Do not return transparencyContrast.");
    expect(plan.userPrompt).toContain("Do not return transparencyContrastNote.");
  });

  it("keeps the claim boundary development-only and non-adjudicative", () => {
    const plan = buildZhejiStudy003ReplayPlanV0_1({
      date: "2026-06-08",
    });

    expect(plan.claimBoundary).toEqual({
      developmentOnly: true,
      semanticFunctionMotivationOnly: true,
      originClaim: false,
      winnerClaim: false,
      historicalProof: false,
      candidateTruthProof: false,
      modelQualityEvidence: false,
      providerDefaultChangeReason: false,
    });
  });
  it("reinforces structural contract before Zheji enrichment", () => {
    const plan = buildZhejiStudy003ReplayPlanV0_1({
      date: "2026-06-08",
    });

    expect(plan.systemPrompt).toContain("<STRUCTURAL_CONTRACT>");
    expect(plan.systemPrompt).toContain("The structural contract is non-negotiable.");
    expect(plan.systemPrompt).toContain("Top-level keys must include word, segmentationId, chunkCandidates, nullCandidates, warnings, and claimBoundary.");
    expect(plan.systemPrompt).toContain("Use top-level chunkCandidates. Do not use top-level candidates.");
    expect(plan.systemPrompt).toContain("If structural fields are missing, the result is STRUCTURAL_FAILURE.");
  });

  it("isolates linguistic evaluation rules from the structural contract", () => {
    const plan = buildZhejiStudy003ReplayPlanV0_1({
      date: "2026-06-08",
    });

    expect(plan.systemPrompt).toContain("<LINGUISTIC_EVALUATION_RULES>");
    expect(plan.systemPrompt).toContain("Zheji enrichment fields are additive only.");
    expect(plan.systemPrompt).toContain("Missing or incomplete Zheji enrichment is ENRICHMENT_WARNING");
    expect(plan.systemPrompt).toContain("If semanticTransparency.decomposition is uncertain, use an empty array []. Do not use null.");
  });

  it("puts an exact JSON output skeleton at the bottom of the user prompt", () => {
    const plan = buildZhejiStudy003ReplayPlanV0_1({
      date: "2026-06-08",
    });

    expect(plan.userPrompt).toContain("<OUTPUT_JSON_SKELETON>");
    expect(plan.userPrompt).toContain('"chunkCandidates": [');
    expect(plan.userPrompt).toContain('"nullCandidates": []');
    expect(plan.userPrompt).toContain('"warnings": []');
    expect(plan.userPrompt).toContain('"claimBoundary": {');
    expect(plan.userPrompt).toContain('"analysisLayers": {');
    expect(plan.userPrompt).toContain('"semanticTransparency": {');
    expect(plan.userPrompt).toContain('"decomposition": []');
    expect(plan.userPrompt.trim().endsWith("</OUTPUT_JSON_SKELETON>")).toBe(true);
  });

  it("forbids the failed top-level candidates replacement shape", () => {
    const plan = buildZhejiStudy003ReplayPlanV0_1({
      date: "2026-06-08",
    });

    expect(plan.userPrompt).toContain("Do not use top-level candidates.");
    expect(plan.userPrompt).toContain("Use top-level chunkCandidates, nullCandidates, warnings, and claimBoundary.");
    expect(plan.userPrompt).not.toContain('"candidates": [');
  });
});
