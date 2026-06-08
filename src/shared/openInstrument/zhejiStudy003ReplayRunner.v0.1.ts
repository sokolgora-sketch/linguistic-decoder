import { buildZhejiPromptContractSectionV0_1 } from "./zhejiTransparencyPrompt.v0.1";
import type { ZhejiPromptContractMetadataV0_1 } from "./zhejiTransparencyTypes.v0.1";

export const ZHEJI_STUDY003_REPLAY_RUNNER_VERSION_V0_1 =
  "zheji-study003-replay-runner.v0.1" as const;

export const ZHEJI_STUDY003_ARTIFACT_VERSION_V0_1 = "v0.1" as const;

export const ZHEJI_STUDY003_HEART_INPUT_V0_1 = Object.freeze({
  word: "study",
  normalizedWord: "study",
  segmentationId: "study.segmentation.003",
  chunks: ["SHTU", "DI"] as const,
  voicePath: ["U", "I"] as const,
  legalTransforms: ["S_TO_SH", "FINAL_Y_TO_I"] as const,
  chunkVariants: [
    {
      chunk: "SHTU",
      variantOf: "STU",
      legalTransform: "S_TO_SH",
      note: "SHTU is an S_TO_SH soft comparison variant of STU.",
    },
    {
      chunk: "DI",
      variantOf: "DY",
      legalTransform: "FINAL_Y_TO_I",
      note: "DI is a final Y_TO_I comparison variant of DY.",
    },
  ] as const,
  doctrineHints: {
    U: "container, inside, adding, holding, depth",
    I: "insight, intellect, knowing, line, point",
  },
  targetLanguages: ["Albanian", "Latin", "Chinese", "Germanic"] as const,
  searchMode: "zheji_study003_candidate_search_v0.1",
});

export interface BuildZhejiStudy003ReplayPlanOptionsV0_1 {
  date: string;
  provider?: "openai_compat";
  model?: "llama3.1:8b";
  baseUrl?: "http://localhost:11434/v1";
  endpoint?: "http://localhost:11434/v1/chat/completions";
}

export interface ZhejiStudy003ReplayPlanV0_1 {
  runnerVersion: typeof ZHEJI_STUDY003_REPLAY_RUNNER_VERSION_V0_1;
  artifactVersion: typeof ZHEJI_STUDY003_ARTIFACT_VERSION_V0_1;
  mode: "PLAN_ONLY_NO_MODEL_CALL";
  modelCallPermittedByThisHelper: false;
  artifactWritePermittedByThisHelper: false;
  runtimeWiringPermitted: false;
  providerDefaultChanged: false;
  openAiApiAllowed: false;
  provider: "openai_compat";
  model: "llama3.1:8b";
  baseUrl: "http://localhost:11434/v1";
  endpoint: "http://localhost:11434/v1/chat/completions";
  heartInput: typeof ZHEJI_STUDY003_HEART_INPUT_V0_1;
  zhejiPromptMetadata: ZhejiPromptContractMetadataV0_1;
  systemPrompt: string;
  userPrompt: string;
  artifactPath: string;
  reportPath: string;
  expectedNextExecutionStep: string;
  claimBoundary: {
    developmentOnly: true;
    semanticFunctionMotivationOnly: true;
    originClaim: false;
    winnerClaim: false;
    historicalProof: false;
    candidateTruthProof: false;
    modelQualityEvidence: false;
    providerDefaultChangeReason: false;
  };
}

function buildSystemPrompt(): string {
  return [
    "You are the Brain in the Open Instrument Heart-to-Brain Candidate Search Protocol.",
    "Return strict JSON only. No prose outside JSON.",
    "Brain searches candidate meanings only.",
    "Brain does not own segmentation, vowel path, legal transforms, validation, derived contrast, or origin verdict.",
    "Use only Heart-approved chunks and target languages.",
    "Brain output must include top-level word and top-level segmentationId.",
    "Do not claim origin. Do not treat resonance as proof.",
    "Do not score, rank, choose a winner, claim history, or declare a true source.",
    "Inspect semantic/function motivation only.",
    "Every non-null chunk candidate must include analysisLayers and semanticTransparency.",
    "Brain must not return transparencyContrast.",
    "Brain must not return transparencyContrastNote.",
    "candidateType must not be changed by Zheji fields.",
  ].join("\n");
}

function buildUserPrompt(
  zhejiPromptSection: string,
): string {
  const heartInput = JSON.stringify(ZHEJI_STUDY003_HEART_INPUT_V0_1, null, 2);

  return [
    "HEART_APPROVED_INPUT_JSON:",
    heartInput,
    "",
    zhejiPromptSection,
    "",
    "Task:",
    "Search candidate meanings for each Heart-approved chunk across targetLanguages.",
    "Return candidates and null candidates as strict JSON matching the current Brain candidate schema plus the Zheji candidate-level fields.",
    "Do not add prose.",
  ].join("\n");
}

export function buildZhejiStudy003ReplayPlanV0_1(
  options: BuildZhejiStudy003ReplayPlanOptionsV0_1,
): ZhejiStudy003ReplayPlanV0_1 {
  const provider = options.provider ?? "openai_compat";
  const model = options.model ?? "llama3.1:8b";
  const baseUrl = options.baseUrl ?? "http://localhost:11434/v1";
  const endpoint =
    options.endpoint ?? "http://localhost:11434/v1/chat/completions";

  const zhejiPrompt = buildZhejiPromptContractSectionV0_1({
    word: ZHEJI_STUDY003_HEART_INPUT_V0_1.word,
    segmentationId: ZHEJI_STUDY003_HEART_INPUT_V0_1.segmentationId,
    chunks: ZHEJI_STUDY003_HEART_INPUT_V0_1.chunks,
    voicePathHint: ZHEJI_STUDY003_HEART_INPUT_V0_1.voicePath.join(" → "),
    doctrineHints: ZHEJI_STUDY003_HEART_INPUT_V0_1.doctrineHints,
  });

  const artifactPath = [
    "docs/open-instrument/artifacts/heart-brain-prototype",
    `${options.date}-study-heart-brain-llama3-1-8b-segmentation-003-zheji-replay-v0.1.json`,
  ].join("/");

  return {
    runnerVersion: ZHEJI_STUDY003_REPLAY_RUNNER_VERSION_V0_1,
    artifactVersion: ZHEJI_STUDY003_ARTIFACT_VERSION_V0_1,
    mode: "PLAN_ONLY_NO_MODEL_CALL",
    modelCallPermittedByThisHelper: false,
    artifactWritePermittedByThisHelper: false,
    runtimeWiringPermitted: false,
    providerDefaultChanged: false,
    openAiApiAllowed: false,
    provider,
    model,
    baseUrl,
    endpoint,
    heartInput: ZHEJI_STUDY003_HEART_INPUT_V0_1,
    zhejiPromptMetadata: zhejiPrompt.metadata,
    systemPrompt: buildSystemPrompt(),
    userPrompt: buildUserPrompt(zhejiPrompt.section),
    artifactPath,
    reportPath:
      "docs/open-instrument/study-segmentation-003-zheji-replay-result-v0.1.md",
    expectedNextExecutionStep:
      "Run a separate controlled artifact PR that performs one explicit local-provider model call.",
    claimBoundary: {
      developmentOnly: true,
      semanticFunctionMotivationOnly: true,
      originClaim: false,
      winnerClaim: false,
      historicalProof: false,
      candidateTruthProof: false,
      modelQualityEvidence: false,
      providerDefaultChangeReason: false,
    },
  };
}
