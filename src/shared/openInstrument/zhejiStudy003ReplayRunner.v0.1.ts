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

function buildOutputJsonSkeleton(): string {
  return [
    "<OUTPUT_JSON_SKELETON>",
    "{",
    '  "word": "study",',
    '  "segmentationId": "study.segmentation.003",',
    '  "chunkCandidates": [',
    "    {",
    '      "chunk": "SHTU",',
    '      "segmentationId": "study.segmentation.003",',
    '      "language": "Albanian",',
    '      "candidateForm": "candidate form here",',
    '      "meaning": "short meaning here",',
    '      "functionFit": "direct",',
    '      "sourceNote": "short auditable evidence or limitation note",',
    '      "evidenceType": "living_lexical",',
    '      "candidateType": "weak_resonance",',
    '      "falseFriendRisk": "medium",',
    '      "nullCandidate": false,',
    '      "notes": ["short audit note"],',
    '      "analysisLayers": {',
    '        "formal": { "isPresent": false, "evidenceNote": null },',
    '        "symbolic": { "isPresent": false, "evidenceNote": null }',
    "      },",
    '      "semanticTransparency": {',
    '        "level": "opaque",',
    '        "reason": "short auditable semantic/function motivation reason",',
    '        "decomposition": []',
    "      }",
    "    }",
    "  ],",
    '  "nullCandidates": [],',
    '  "warnings": [],',
    '  "claimBoundary": {',
    '    "originClaim": false,',
    '    "winnerClaim": false,',
    '    "historicalProof": false,',
    '    "candidateTruthProof": false,',
    '    "modelQualityEvidence": false,',
    '    "providerDefaultChangeReason": false',
    "  }",
    "}",
    "</OUTPUT_JSON_SKELETON>",
  ].join("\n");
}

function buildSystemPrompt(): string {
  return [
    "You are the Brain in the Open Instrument Heart-to-Brain Candidate Search Protocol.",
    "Return strict JSON only. No prose outside JSON.",
    "",
    "<STRUCTURAL_CONTRACT>",
    "The structural contract is non-negotiable.",
    "Return exactly one JSON object.",
    "Top-level keys must include word, segmentationId, chunkCandidates, nullCandidates, warnings, and claimBoundary.",
    "Use top-level chunkCandidates. Do not use top-level candidates.",
    "Use top-level nullCandidates, even when empty.",
    "Use top-level warnings, even when empty.",
    "Use top-level claimBoundary as a non-null object.",
    "Every non-null chunkCandidates[] object must preserve the existing Brain candidate fields.",
    "Required candidate fields are chunk, segmentationId, language, candidateForm, meaning, functionFit, sourceNote, evidenceType, candidateType, falseFriendRisk, nullCandidate, and notes.",
    "For non-null candidates, nullCandidate must be false.",
    "Null candidates must be placed only in nullCandidates and must preserve traceability.",
    "If structural fields are missing, the result is STRUCTURAL_FAILURE.",
    "</STRUCTURAL_CONTRACT>",
    "",
    "<LINGUISTIC_EVALUATION_RULES>",
    "Brain searches candidate meanings only.",
    "Brain does not own segmentation, vowel path, legal transforms, validation, derived contrast, or origin verdict.",
    "Use only Heart-approved chunks and target languages.",
    "Do not claim origin. Do not treat resonance as proof.",
    "Do not score, rank, choose a winner, claim history, or declare a true source.",
    "Inspect semantic/function motivation only.",
    "Zheji enrichment fields are additive only.",
    "Add analysisLayers and semanticTransparency only after preserving the structural candidate fields.",
    "Missing or incomplete Zheji enrichment is ENRICHMENT_WARNING, not a reason to collapse the structural contract.",
    "analysisLayers.formal.evidenceNote and analysisLayers.symbolic.evidenceNote must be string or null.",
    "When an analysis layer is not present, set evidenceNote to null.",
    "semanticTransparency.level must be atomic, metaphorical, or opaque.",
    "semanticTransparency.reason must be short and auditable.",
    "If semanticTransparency.decomposition is uncertain, use an empty array []. Do not use null.",
    "Brain must not return transparencyContrast.",
    "Brain must not return transparencyContrastNote.",
    "candidateType must not be changed by Zheji fields.",
    "</LINGUISTIC_EVALUATION_RULES>",
  ].join("\n");
}

function buildUserPrompt(
  zhejiPromptSection: string,
): string {
  const promptSection = buildZhejiPromptContractSectionV0_1({
    word: ZHEJI_STUDY003_HEART_INPUT_V0_1.word,
    segmentationId: ZHEJI_STUDY003_HEART_INPUT_V0_1.segmentationId,
    chunks: ZHEJI_STUDY003_HEART_INPUT_V0_1.chunks,
    voicePathHint: ZHEJI_STUDY003_HEART_INPUT_V0_1.voicePath.join(" → "),
    doctrineHints: ZHEJI_STUDY003_HEART_INPUT_V0_1.doctrineHints,
  });

  return [
    "HEART_APPROVED_INPUT_JSON:",
    JSON.stringify(ZHEJI_STUDY003_HEART_INPUT_V0_1, null, 2),
    "",
    promptSection.section,
    "",
    "TASK:",
    "Search candidate meanings for each Heart-approved chunk across targetLanguages.",
    "Return strict JSON matching the structural contract and the output skeleton below.",
    "Do not use top-level candidates.",
    "Use top-level chunkCandidates, nullCandidates, warnings, and claimBoundary.",
    "Preserve every required Brain candidate field before adding Zheji fields.",
    "If Zheji enrichment is uncertain, preserve structure and use null or [] fallbacks as specified.",
    "Do not add prose.",
    "",
    buildOutputJsonSkeleton(),
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
