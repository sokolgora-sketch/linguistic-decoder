#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");

const FULL_GIT_SHA_PATTERN = /^[0-9a-f]{40}$/;
const EXPECTED_WORD = "limit";
const EXPECTED_STAGE = "MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY";
const EXPECTED_SEGMENTATION = "LI + MIT";
const EXPECTED_PROVIDER_FAMILY = "local_only_openai_compatible";
const EXPECTED_PROVIDER_NAME = "ollama_openai_compat";
const EXPECTED_MODEL = "llama3.1:8b";
const EXPECTED_ENDPOINT_CLASS = "localhost_only";
const EXPECTED_BASE_URL = "http://127.0.0.1:11434/v1";
const EXPECTED_API_KEY = "ollama";
const EXPECTED_OUTPUT_RELATIVE_PATH =
  "docs/open-instrument/artifacts/zheji-generalization/limit-generalization-replay-v0.1.json";
const EXPECTED_PROMPT_SOURCE_PATH =
  "src/shared/openInstrument/brainCandidateSearchPrompt.v0.1.ts";
const REQUIRED_ARGS = [
  "word",
  "stage",
  "segmentation",
  "provider-family",
  "provider-name",
  "model",
  "endpoint-class",
  "output",
  "reviewed-execution-base",
];

const CLAIM_BOUNDARY_FALSE_FIELDS = [
  "publicationEvidence",
  "originEvidence",
  "ownershipEvidence",
  "modelQualityEvidence",
  "providerOutputCorrectnessEvidence",
  "candidateTruthEvidence",
  "evidencePromotion",
  "winnerCrowned",
];

class RunnerError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "RunnerError";
    this.code = code;
    this.details = details;
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function formatCommand(command, args) {
  return [command, ...args].join(" ");
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
    ...options,
  });

  return {
    command: formatCommand(command, args),
    status: typeof result.status === "number" ? result.status : 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error ? String(result.error.message ?? result.error) : "",
  };
}

function failClosed(message, details = {}) {
  throw new RunnerError("RUNNER_PRECHECK_FAILED", message, details);
}

function parseArgs(argv) {
  const seen = new Map();

  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      failClosed(`unknown argument ${token}`);
    }

    const key = token.slice(2);
    if (!REQUIRED_ARGS.includes(key)) {
      failClosed(`unknown argument --${key}`);
    }
    if (seen.has(key)) {
      failClosed(`duplicate argument --${key}`);
    }

    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) {
      failClosed(`missing value for --${key}`);
    }

    seen.set(key, value);
    index += 1;
  }

  for (const key of REQUIRED_ARGS) {
    if (!seen.has(key)) {
      failClosed(`missing required argument --${key}`);
    }
  }

  const args = Object.fromEntries(seen.entries());
  for (const [key, value] of Object.entries(args)) {
    if (!hasText(value)) {
      failClosed(`empty value is not allowed for --${key}`);
    }
  }

  return {
    word: args.word,
    stage: args.stage,
    segmentation: args.segmentation,
    providerFamily: args["provider-family"],
    providerName: args["provider-name"],
    model: args.model,
    endpointClass: args["endpoint-class"],
    output: args.output,
    reviewedExecutionBase: args["reviewed-execution-base"],
  };
}

function ensureWorkingTreeClean() {
  const status = runCommand("git", ["status", "--porcelain=v1", "--untracked-files=all"]);
  if (status.status !== 0) {
    failClosed("git status failed before execution", status);
  }
  if (status.stdout.trim() !== "") {
    failClosed("working tree must be clean before execution", { status: status.stdout.trim() });
  }
}

function ensureOnReviewedMainBase(reviewedExecutionBase) {
  if (!FULL_GIT_SHA_PATTERN.test(reviewedExecutionBase)) {
    failClosed("reviewed-execution-base must be a full 40-character git SHA", {
      received: reviewedExecutionBase,
    });
  }

  const branch = runCommand("git", ["branch", "--show-current"]);
  if (branch.status !== 0) {
    failClosed("git branch --show-current failed before execution", branch);
  }
  if (branch.stdout.trim() !== "main") {
    failClosed("runner must execute from main", { branch: branch.stdout.trim() });
  }

  const head = runCommand("git", ["rev-parse", "HEAD"]);
  if (head.status !== 0) {
    failClosed("git rev-parse HEAD failed before execution", head);
  }
  const headSha = head.stdout.trim();
  if (headSha !== reviewedExecutionBase) {
    failClosed("main SHA does not match the reviewed execution base", {
      expected: reviewedExecutionBase,
      actual: headSha,
    });
  }
  return headSha;
}

function ensureIsolationAuditPromptMarker() {
  const promptPath = path.join(ROOT, EXPECTED_PROMPT_SOURCE_PATH);
  const source = readText(promptPath);
  if (!source.includes("<ISOLATION_AUDIT>")) {
    failClosed("brain candidate-search prompt must contain <ISOLATION_AUDIT>", {
      promptPath: EXPECTED_PROMPT_SOURCE_PATH,
    });
  }
  return {
    promptPath: EXPECTED_PROMPT_SOURCE_PATH,
    isolationAuditPresent: true,
  };
}

function runRequiredPrechecks() {
  const promptGuard = runCommand("npm", [
    "test",
    "--",
    "tests/openInstrument.brainCandidateSearchPrompt.isolationAudit.guard.v0.1.spec.ts",
    "--runInBand",
  ]);
  if (promptGuard.status !== 0) {
    failClosed("prompt guard test failed before execution", promptGuard);
  }

  const semanticValidation = runCommand("node", ["scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs"]);
  if (semanticValidation.status !== 0) {
    failClosed("passive Zheji validation helper failed before execution", semanticValidation);
  }

  const semanticValidationTest = runCommand("npm", [
    "test",
    "--",
    "tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts",
    "--runInBand",
  ]);
  if (semanticValidationTest.status !== 0) {
    failClosed("passive Zheji validation test failed before execution", semanticValidationTest);
  }

  return {
    promptGuard: {
      command: promptGuard.command,
      status: promptGuard.status,
    },
    semanticValidation: {
      command: semanticValidation.command,
      status: semanticValidation.status,
    },
    semanticValidationTest: {
      command: semanticValidationTest.command,
      status: semanticValidationTest.status,
    },
  };
}

function validateRequestedArgs(args) {
  if (args.word !== EXPECTED_WORD) {
    failClosed("word must be limit", { received: args.word });
  }
  if (args.stage !== EXPECTED_STAGE) {
    failClosed("stage must match the reviewed exact limit replay stage", { received: args.stage });
  }
  if (args.segmentation !== EXPECTED_SEGMENTATION) {
    failClosed("segmentation must be LI + MIT", { received: args.segmentation });
  }
  if (args.providerFamily !== EXPECTED_PROVIDER_FAMILY) {
    failClosed("provider-family must be local_only_openai_compatible", { received: args.providerFamily });
  }
  if (args.providerName !== EXPECTED_PROVIDER_NAME) {
    failClosed("provider-name must be ollama_openai_compat", { received: args.providerName });
  }
  if (args.model !== EXPECTED_MODEL) {
    failClosed("model must be llama3.1:8b", { received: args.model });
  }
  if (args.endpointClass !== EXPECTED_ENDPOINT_CLASS) {
    failClosed("endpoint-class must be localhost_only", { received: args.endpointClass });
  }
  if (args.output !== EXPECTED_OUTPUT_RELATIVE_PATH) {
    failClosed("output must match the reviewed exact passive artifact path", { received: args.output });
  }
}

function validateEnv() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const baseUrl = process.env.OPENAI_BASE_URL?.trim();

  if (!hasText(apiKey)) {
    failClosed("OPENAI_API_KEY must be set");
  }
  if (!hasText(baseUrl)) {
    failClosed("OPENAI_BASE_URL must be set");
  }
  if (apiKey !== EXPECTED_API_KEY) {
    failClosed("OPENAI_API_KEY must be the reviewed local dummy value", { received: apiKey });
  }
  if (baseUrl !== EXPECTED_BASE_URL) {
    failClosed("OPENAI_BASE_URL must be the reviewed local loopback base URL", { received: baseUrl });
  }

  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch (error) {
    failClosed("OPENAI_BASE_URL must be a valid URL", { received: baseUrl, error: String(error) });
  }

  if (parsed.protocol !== "http:") {
    failClosed("OPENAI_BASE_URL must use http", { received: baseUrl });
  }
  if (parsed.hostname !== "127.0.0.1") {
    failClosed("OPENAI_BASE_URL must be localhost-only", { received: baseUrl });
  }
  if (parsed.port !== "11434") {
    failClosed("OPENAI_BASE_URL must use port 11434", { received: baseUrl });
  }
  if (parsed.pathname !== "/v1") {
    failClosed("OPENAI_BASE_URL must end at /v1", { received: baseUrl });
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    failClosed("OPENAI_BASE_URL must not include credentials, search params, or fragments", {
      received: baseUrl,
    });
  }
}

function buildPrompts({ word, stage, segmentation }) {
  const systemPrompt = [
    "You are the Open Instrument exact limit replay assistant.",
    "Return strict JSON only.",
    "No markdown, no prose, no code fences.",
    "The output is candidate-only and development-only.",
    "No winner is crowned.",
    "Preserve null as valid truth.",
    "Do not claim origin evidence, ownership evidence, publication evidence, model-quality evidence, provider-output correctness evidence, or candidate-truth evidence.",
  ].join("\n");

  const userPrompt = [
    `word: ${word}`,
    `stage: ${stage}`,
    `segmentation: ${segmentation}`,
    "Use <ISOLATION_AUDIT>.",
    "Any atomic candidate must show an isolated standalone form and a plain standalone definition or gloss.",
    "Metaphor, resonance, or target-word convenience cannot prove atomic status.",
    "The response must remain candidate-only and development-only.",
    "No winner is crowned.",
    "No origin, ownership, publication, model-quality, provider-output correctness, or candidate-truth evidence is claimed.",
    "",
    "Return a single JSON object with exactly these top-level keys:",
    "word, stage, segmentation, candidate, nullAccepted, claimBoundary.",
    "",
    "candidate must be either null or an object with:",
    "isolatedStandaloneForm, plainStandaloneDefinitionGloss, notes.",
    "",
    "claimBoundary must be an object with these exact boolean fields:",
    "developmentOnly, publicationEvidence, originEvidence, ownershipEvidence, modelQualityEvidence, providerOutputCorrectnessEvidence, candidateTruthEvidence, evidencePromotion, winnerCrowned.",
    "",
    "Set claimBoundary.developmentOnly to true.",
    "Set every other claimBoundary field to false.",
    "",
    "If a candidate is present, nullAccepted must be false.",
    "If no candidate is present, nullAccepted must be true.",
  ].join("\n");

  const promptCanonicalText = JSON.stringify({ systemPrompt, userPrompt }, null, 2);
  const promptSha256 = sha256(promptCanonicalText);

  const requestBody = {
    model: EXPECTED_MODEL,
    temperature: 0,
    stream: false,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  };

  const requestBodyText = JSON.stringify(requestBody, null, 2);
  const requestBodySha256 = sha256(requestBodyText);

  return {
    systemPrompt,
    userPrompt,
    promptCanonicalText,
    promptSha256,
    promptLength: promptCanonicalText.length,
    requestBody,
    requestBodyText,
    requestBodySha256,
    requestBodyLength: requestBodyText.length,
  };
}

function normalizeCandidate(candidate) {
  if (!isObject(candidate)) {
    return null;
  }

  const isolatedStandaloneForm =
    candidate.isolatedStandaloneForm ?? candidate.surfaceForm ?? candidate.form ?? null;
  const plainStandaloneDefinitionGloss =
    candidate.plainStandaloneDefinitionGloss ?? candidate.gloss ?? candidate.definition ?? null;

  return {
    isolatedStandaloneForm,
    plainStandaloneDefinitionGloss,
    notes: Array.isArray(candidate.notes) ? candidate.notes : [],
  };
}

function claimBoundaryIsValid(boundary) {
  if (!isObject(boundary) || boundary.developmentOnly !== true) {
    return false;
  }
  const actualKeys = Object.keys(boundary).sort();
  const expectedKeys = ["developmentOnly", ...CLAIM_BOUNDARY_FALSE_FIELDS].sort();
  if (actualKeys.length !== expectedKeys.length) {
    return false;
  }
  for (let index = 0; index < expectedKeys.length; index += 1) {
    if (actualKeys[index] !== expectedKeys[index]) {
      return false;
    }
  }
  for (const field of CLAIM_BOUNDARY_FALSE_FIELDS) {
    if (boundary[field] !== false) {
      return false;
    }
  }
  return true;
}

function classifyFailureFromRawText(rawText) {
  const text = String(rawText || "");
  if (/(cannot comply|can't comply|unable to|as an ai|refuse|refusal)/i.test(text)) {
    return "MODEL_COLLAPSE";
  }
  if (/(prompt|instruction|system prompt|user prompt).*(failed|broken|collapse|invalid)/i.test(text)) {
    return "PROMPT_COLLAPSE";
  }
  return "EXTRACTION_CONTRACT_FAILURE";
}

function analyzeResponse(rawResponseText, requestContext) {
  const analysis = {
    validationOutcome: {
      status: "failed_closed",
      errors: [],
      candidatePresent: false,
      nullAccepted: false,
      claimBoundaryAccepted: false,
    },
    normalizedCandidatePayload: null,
    outcomeClassification: "EXTRACTION_CONTRACT_FAILURE",
  };

  let parsed;
  try {
    parsed = JSON.parse(rawResponseText);
  } catch {
    analysis.outcomeClassification = classifyFailureFromRawText(rawResponseText);
    analysis.validationOutcome.errors.push("response is not valid JSON");
    return analysis;
  }

  if (!isObject(parsed)) {
    analysis.validationOutcome.errors.push("response root must be an object");
    analysis.outcomeClassification = "EXTRACTION_CONTRACT_FAILURE";
    return analysis;
  }

  const structuralChecks = [
    ["word", EXPECTED_WORD],
    ["stage", EXPECTED_STAGE],
    ["segmentation", EXPECTED_SEGMENTATION],
  ];

  for (const [field, expected] of structuralChecks) {
    if (parsed[field] !== expected) {
      analysis.validationOutcome.errors.push(`response.${field} must equal ${JSON.stringify(expected)}`);
    }
  }

  const candidate = normalizeCandidate(parsed.candidate);
  const candidatePresent = parsed.candidate !== null && parsed.candidate !== undefined;
  const nullAccepted = parsed.nullAccepted === true;
  analysis.validationOutcome.candidatePresent = candidatePresent;
  analysis.validationOutcome.nullAccepted = nullAccepted;

  if (!("candidate" in parsed)) {
    analysis.validationOutcome.errors.push("response.candidate is required");
  }
  if (!("nullAccepted" in parsed)) {
    analysis.validationOutcome.errors.push("response.nullAccepted is required");
  }
  if (!("claimBoundary" in parsed)) {
    analysis.validationOutcome.errors.push("response.claimBoundary is required");
  }

  if (candidatePresent && candidate === null) {
    analysis.validationOutcome.errors.push("candidate must be an object when present");
  }
  if (candidatePresent && candidate) {
    if (!hasText(candidate.isolatedStandaloneForm)) {
      analysis.validationOutcome.errors.push("candidate.isolatedStandaloneForm must be a non-empty string");
    }
    if (!hasText(candidate.plainStandaloneDefinitionGloss)) {
      analysis.validationOutcome.errors.push("candidate.plainStandaloneDefinitionGloss must be a non-empty string");
    }
  }

  if (candidatePresent && nullAccepted) {
    analysis.validationOutcome.errors.push("nullAccepted must be false when a candidate is present");
  }
  if (!candidatePresent && !nullAccepted) {
    analysis.validationOutcome.errors.push("nullAccepted must be true when no candidate is present");
  }

  const claimBoundaryValid = claimBoundaryIsValid(parsed.claimBoundary);
  analysis.validationOutcome.claimBoundaryAccepted = claimBoundaryValid;
  if (!claimBoundaryValid) {
    analysis.validationOutcome.errors.push("claimBoundary must preserve the reviewed non-evidence boundary");
  }

  if (analysis.validationOutcome.errors.length > 0) {
    if (
      analysis.validationOutcome.errors.some((error) => error.startsWith("response.word") || error.startsWith("response.stage") || error.startsWith("response.segmentation"))
    ) {
      analysis.outcomeClassification = "REPLAY_INVALIDATED";
    } else if (
      analysis.validationOutcome.errors.some((error) => error.startsWith("candidate.") || error.startsWith("claimBoundary"))
    ) {
      analysis.outcomeClassification = "VALIDATION_FAILURE";
    } else {
      analysis.outcomeClassification = "EXTRACTION_CONTRACT_FAILURE";
    }
    return analysis;
  }

  analysis.normalizedCandidatePayload = candidate;
  analysis.validationOutcome.status = "passed";
  analysis.validationOutcome.errors = [];
  analysis.outcomeClassification = candidatePresent ? "GENERALIZATION_SIGNAL_PRESENT" : "GENERALIZATION_NULL_ACCEPTED";

  const requestMessage = [
    requestContext.systemPrompt,
    requestContext.userPrompt,
  ].join("\n\n");
  analysis.validationOutcome.requestPromptSha256 = requestContext.promptSha256 ?? sha256(requestMessage);
  analysis.validationOutcome.requestBodySha256 = sha256(requestContext.requestBodyText);

  return analysis;
}

function buildArtifact({
  currentHeadSha,
  args,
  prechecks,
  request,
  providerIdentity,
  endpointIdentity,
  rawProviderResponse,
  rawErrorText,
  analysis,
}) {
  const capturedText = rawProviderResponse ?? rawErrorText ?? "";
  const responseSha256 = hasText(capturedText) ? sha256(capturedText) : null;

  return {
    schemaVersion: "open-instrument.limit-generalization-replay.v0.1",
    capturePacketId: "open-instrument.limit-generalization-replay.packet.v0.1",
    source: {
      reviewedExecutionBaseSha: currentHeadSha,
      promptSourcePath: EXPECTED_PROMPT_SOURCE_PATH,
      promptSourceContainsIsolationAudit: true,
      promptGuardTestCommand: prechecks.promptGuard.command,
      passiveZhejiValidationCommand: prechecks.semanticValidation.command,
      passiveZhejiValidationTestCommand: prechecks.semanticValidationTest.command,
    },
    executionRequest: {
      word: args.word,
      stage: args.stage,
      segmentation: args.segmentation,
      providerFamily: args.providerFamily,
      providerName: args.providerName,
      model: args.model,
      endpointClass: args.endpointClass,
      outputPath: EXPECTED_OUTPUT_RELATIVE_PATH,
      requestMethod: "POST",
      requestPath: "/chat/completions",
      temperature: 0,
      stream: false,
    },
    prechecks: {
      workingTreeClean: true,
      currentBranch: "main",
      currentHeadSha,
      mainShaMatchesReviewedExecutionBase: true,
      isolationAuditPresent: true,
      promptGuardTestPassed: true,
      passiveZhejiValidationPassed: true,
      passiveZhejiValidationTestPassed: true,
    },
    providerIdentity,
    endpointIdentity,
    promptIdentity: {
      promptSourcePath: EXPECTED_PROMPT_SOURCE_PATH,
      promptSourceStatus: "reviewed_and_audited",
      promptCanonicalizationMethod: "json_stringify_system_prompt_and_user_prompt_v0.1",
      promptSha256: request.promptSha256,
      promptLength: request.promptLength,
      promptMutationPolicy: "prompt_source_locked_no_mutation",
      promptIncludesIsolationAudit: true,
    },
    requestIdentity: {
      requestBodyCanonicalizationMethod: "json_stringify_request_body_v0.1",
      requestBodySha256: request.requestBodySha256,
      requestBodyLength: request.requestBodyLength,
      requestBodyMutationPolicy: "request_body_locked_no_mutation",
    },
    responseIdentity: {
      responseCaptureMethod: "chat_completions_message_content",
      rawCaptureKind: rawProviderResponse ? "provider_response" : "error_text",
      rawProviderResponse,
      rawErrorText,
      responseSha256,
      responseRetentionPolicy: "artifact_only_development_only",
      responseMutationPolicy: "response_text_immutable",
    },
    normalizedCandidatePayload: analysis.normalizedCandidatePayload,
    validationOutcome: analysis.validationOutcome,
    outcomeClassification: analysis.outcomeClassification,
    failureClassification:
      analysis.outcomeClassification === "GENERALIZATION_SIGNAL_PRESENT" ||
      analysis.outcomeClassification === "GENERALIZATION_NULL_ACCEPTED"
        ? null
        : analysis.outcomeClassification,
    claimBoundary: {
      developmentOnly: true,
      publicationEvidence: false,
      originEvidence: false,
      ownershipEvidence: false,
      modelQualityEvidence: false,
      providerOutputCorrectnessEvidence: false,
      candidateTruthEvidence: false,
      evidencePromotion: false,
      winnerCrowned: false,
    },
  };
}

function writeArtifact(outputPath, artifact) {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
}

function buildProviderIdentity(args) {
  return {
    providerFamily: args.providerFamily,
    providerName: args.providerName,
    modelName: args.model,
    providerSelectionPolicy: "explicit_only_local_only",
    providerFallbackAllowed: false,
    automaticProviderSelectionAllowed: false,
    providerDefaultMutationAllowed: false,
  };
}

function buildEndpointIdentity(args) {
  return {
    endpointClass: args.endpointClass,
    baseUrl: EXPECTED_BASE_URL,
    endpointPath: "/v1/chat/completions",
    localOnly: true,
    remoteProviderEndpointAllowed: false,
    openAiHostedEndpointAllowed: false,
    deepSeekEndpointAllowed: false,
  };
}

async function runLimitGeneralizationReplay(argv = process.argv) {
  const args = parseArgs(argv);
  validateRequestedArgs(args);
  validateEnv();
  ensureWorkingTreeClean();
  const currentHeadSha = ensureOnReviewedMainBase(args.reviewedExecutionBase);
  const promptAudit = ensureIsolationAuditPromptMarker();
  const precheckTranscripts = runRequiredPrechecks();

  const prechecks = {
    promptGuard: precheckTranscripts.promptGuard,
    semanticValidation: precheckTranscripts.semanticValidation,
    semanticValidationTest: precheckTranscripts.semanticValidationTest,
    currentHeadSha,
    promptAudit,
  };

  const request = buildPrompts(args);
  const providerIdentity = buildProviderIdentity(args);
  const endpointIdentity = buildEndpointIdentity(args);

  const requestBodyText = request.requestBodyText;
  const requestBodySha256 = request.requestBodySha256;

  let rawProviderResponse = null;
  let rawErrorText = null;
  let analysis;

  try {
    const response = await fetch(`${EXPECTED_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${EXPECTED_API_KEY}`,
      },
      body: requestBodyText,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      rawErrorText = `http ${response.status} ${response.statusText}${errorBody ? `: ${errorBody}` : ""}`;
      analysis = {
        validationOutcome: {
          status: "failed_closed",
          errors: [rawErrorText],
          candidatePresent: false,
          nullAccepted: false,
          claimBoundaryAccepted: false,
        },
        normalizedCandidatePayload: null,
        outcomeClassification: "LOCAL_PROVIDER_UNAVAILABLE",
      };
    } else {
      rawProviderResponse = await response.text();
      analysis = analyzeResponse(rawProviderResponse, {
        systemPrompt: request.systemPrompt,
        userPrompt: request.userPrompt,
        promptSha256: request.promptSha256,
        requestBodyText,
      });
    }
  } catch (error) {
    rawErrorText = String(error instanceof Error ? error.stack || error.message : error);
    analysis = {
      validationOutcome: {
        status: "failed_closed",
        errors: [rawErrorText],
        candidatePresent: false,
        nullAccepted: false,
        claimBoundaryAccepted: false,
      },
      normalizedCandidatePayload: null,
      outcomeClassification: "LOCAL_PROVIDER_UNAVAILABLE",
    };
  }

  const artifact = buildArtifact({
    currentHeadSha,
    args,
    prechecks,
    request: {
      ...request,
      requestBodySha256,
    },
    providerIdentity,
    endpointIdentity,
    rawProviderResponse,
    rawErrorText,
    analysis,
  });

  const outputPath = path.resolve(ROOT, args.output);
  const expectedOutputPath = path.resolve(ROOT, EXPECTED_OUTPUT_RELATIVE_PATH);
  if (outputPath !== expectedOutputPath) {
    failClosed("output path resolution failed the exact-path check", {
      outputPath,
      expectedOutputPath,
    });
  }

  writeArtifact(outputPath, artifact);

  return {
    artifact,
    outputPath,
  };
}

function printArtifactSummary(artifact) {
  const summary = {
    schemaVersion: artifact.schemaVersion,
    outcomeClassification: artifact.outcomeClassification,
    failureClassification: artifact.failureClassification,
    providerFamily: artifact.providerIdentity.providerFamily,
    providerName: artifact.providerIdentity.providerName,
    model: artifact.providerIdentity.modelName,
    endpointClass: artifact.endpointIdentity.endpointClass,
    word: artifact.executionRequest.word,
    stage: artifact.executionRequest.stage,
    segmentation: artifact.executionRequest.segmentation,
    outputPath: artifact.executionRequest.outputPath,
  };
  console.log(JSON.stringify(summary, null, 2));
}

async function main(argv = process.argv) {
  try {
    const result = await runLimitGeneralizationReplay(argv);
    printArtifactSummary(result.artifact);
    if (result.artifact.failureClassification) {
      process.exitCode = 1;
    }
  } catch (error) {
    if (error instanceof RunnerError) {
      console.error(error.message);
      if (Object.keys(error.details).length > 0) {
        console.error(JSON.stringify(error.details, null, 2));
      }
      process.exitCode = 1;
      return;
    }

    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main(process.argv);
}

export {
  runLimitGeneralizationReplay,
  parseArgs,
  validateEnv,
  validateRequestedArgs,
  buildPrompts,
  analyzeResponse,
};
