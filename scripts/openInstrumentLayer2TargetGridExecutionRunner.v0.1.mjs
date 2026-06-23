#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

import {
  TARGET_GRID_SCHEMA_VERSION,
  buildAggregateArtifact,
  buildTargetGrid,
  classifyAggregate,
  safeClaimBoundary,
  validateTarget,
  validateTargetResponse,
} from "./openInstrumentLayer2ChunkLanguageTargetGrid.v0.1.mjs";

const RUNNER_SCHEMA_VERSION = "open-instrument.layer2-target-grid-execution-runner.v0.1";

const REVIEWED_WORD = "comic";
const REVIEWED_STAGE = "MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY";
const REVIEWED_SEGMENTATION = "COM + IC";
const REVIEWED_SOURCE_LANGUAGE = "English";

const REVIEWED_PROVIDER_IDENTITY = Object.freeze({
  providerFamily: "local_only_openai_compatible",
  providerName: "ollama_openai_compat",
  model: "llama3.1:8b",
  endpointClass: "localhost_only",
  baseUrl: "http://127.0.0.1:11434/v1",
  apiKey: "ollama",
});

const REVIEWED_OUTPUT_PATH = "docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json";
const CHAT_COMPLETIONS_PATH = "/chat/completions";

const REQUIRED_EXECUTION_FLAG = "--execute-reviewed-layer2-target-grid";
const SELF_CHECK_FLAG = "--self-check";
const PRINT_REQUESTS_FLAG = "--print-reviewed-requests";

const cliSchema = Object.freeze({
  reviewedExecutionBaseSha: "--reviewed-execution-base-sha",
  providerFamily: "--provider-family",
  providerName: "--provider-name",
  model: "--model",
  endpointClass: "--endpoint-class",
  baseUrl: "--base-url",
  apiKey: "--api-key",
  output: "--output",
});

function sha256Text(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function parseArgs(argv) {
  const parsed = {
    execute: argv.includes(REQUIRED_EXECUTION_FLAG),
    selfCheck: argv.includes(SELF_CHECK_FLAG),
    printRequests: argv.includes(PRINT_REQUESTS_FLAG),
    values: {},
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (Object.values(cliSchema).includes(arg)) {
      parsed.values[arg] = argv[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function requireText(value, message) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(message);
  }

  return value;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`);
  }
}

function assertTrue(value, message) {
  if (value !== true) {
    throw new Error(message);
  }
}

function assertFalse(value, message) {
  if (value !== false) {
    throw new Error(message);
  }
}

function assertReviewedExecutionBaseSha(value) {
  requireText(value, "reviewed execution base sha is required");

  if (!/^[0-9a-f]{40}$/.test(value)) {
    throw new Error("reviewed execution base sha must be a full git SHA");
  }
}

function currentGitHead() {
  return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
}

function validateReviewedExecutionBaseOrThrow(reviewedExecutionBaseSha) {
  assertReviewedExecutionBaseSha(reviewedExecutionBaseSha);
  const currentHead = currentGitHead();
  assertEqual(currentHead, reviewedExecutionBaseSha, "current HEAD must equal reviewed execution base");
  return currentHead;
}

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl ?? "").replace(/\/+$/u, "");
}

function validateProviderIdentityOrThrow(identity) {
  assertEqual(identity.providerFamily, REVIEWED_PROVIDER_IDENTITY.providerFamily, "providerFamily");
  assertEqual(identity.providerName, REVIEWED_PROVIDER_IDENTITY.providerName, "providerName");
  assertEqual(identity.model, REVIEWED_PROVIDER_IDENTITY.model, "model");
  assertEqual(identity.endpointClass, REVIEWED_PROVIDER_IDENTITY.endpointClass, "endpointClass");
  assertEqual(normalizeBaseUrl(identity.baseUrl), REVIEWED_PROVIDER_IDENTITY.baseUrl, "baseUrl");
  assertEqual(identity.apiKey, REVIEWED_PROVIDER_IDENTITY.apiKey, "apiKey");

  if (!normalizeBaseUrl(identity.baseUrl).startsWith("http://127.0.0.1:11434/v1")) {
    throw new Error("baseUrl must be reviewed localhost Ollama OpenAI-compatible endpoint");
  }
}

function validateOutputPathOrThrow(outputPath) {
  assertEqual(outputPath, REVIEWED_OUTPUT_PATH, "output path");
}

function buildTargetPrompt(target) {
  const promptObject = {
    task: "Open Instrument Layer 2 target-grid candidate check",
    instruction: "Return exactly one JSON object. Do not use markdown. Do not add prose outside JSON.",
    word: target.word,
    stage: target.stage,
    segmentation: target.segmentation,
    chunk: target.chunk,
    candidateLanguage: target.candidateLanguage,
    sourceLanguage: target.sourceLanguage,
    requirements: {
      candidateMustBeStandaloneInCandidateLanguage: true,
      candidateChunkMustEqualTargetChunk: true,
      candidateLanguageMustEqualTargetCandidateLanguage: true,
      candidateMustNotBeFullInputWord: true,
      glossMustNotMerelyDefineFullInputWord: true,
      nullIsValidWhenNoCandidateFound: true,
      evidencePromotionAllowed: false,
      publicationFramingAllowed: false,
      winnerCrowningAllowed: false,
    },
    responseShape: {
      word: target.word,
      stage: target.stage,
      segmentation: target.segmentation,
      chunk: target.chunk,
      candidateLanguage: target.candidateLanguage,
      candidate: null,
      nullAccepted: true,
      claimBoundary: safeClaimBoundary(),
    },
  };

  return JSON.stringify(promptObject, null, 2);
}

function buildRequestBody(target, providerIdentity) {
  const prompt = buildTargetPrompt(target);

  const body = {
    model: providerIdentity.model,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "You are a strict JSON-only local development checker for Open Instrument Layer 2 target-grid candidates.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  return {
    prompt,
    promptSha256: sha256Text(prompt),
    requestBody: body,
    requestBodySha256: sha256Text(stableStringify(body)),
  };
}

function extractOpenAiCompatibleMessageContent(payload) {
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("provider payload missing choices[0].message.content string");
  }

  return content;
}

function parseJsonObjectFromText(text) {
  const trimmed = String(text ?? "").trim();

  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    throw new Error("provider message content must be one JSON object");
  }

  const parsed = JSON.parse(trimmed);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("provider message content must parse to a JSON object");
  }

  return parsed;
}

function classifyTargetOutcome(validation, response) {
  if (!validation.ok) {
    if (validation.errors.some((error) => error.includes("full input word") || error.includes("merely define the full input word"))) {
      return "TARGET_DEGENERATE_BLOCKED";
    }

    return "TARGET_INVALIDATED";
  }

  if (response.candidate === null) {
    return "TARGET_NULL_ACCEPTED";
  }

  return "TARGET_SIGNAL_PRESENT";
}

function buildTargetResult({ target, response, promptSha256, requestBodySha256, responseSha256, providerRawPayloadSha256 }) {
  const validation = validateTargetResponse(response, target);
  const outcomeClassification = classifyTargetOutcome(validation, response);

  return {
    targetId: target.targetId,
    target,
    outcomeClassification,
    validation: {
      status: validation.ok ? "passed" : "failed",
      errors: validation.errors,
    },
    promptSha256,
    requestBodySha256,
    responseSha256,
    providerRawPayloadSha256,
    response,
  };
}

function buildExecutionArtifact({ reviewedExecutionBaseSha, providerIdentity, endpointIdentity, targetGrid, targetResults }) {
  const aggregate = buildAggregateArtifact({ targetGrid, targetResults });

  return {
    schemaVersion: RUNNER_SCHEMA_VERSION,
    scaffoldSchemaVersion: TARGET_GRID_SCHEMA_VERSION,
    word: REVIEWED_WORD,
    stage: REVIEWED_STAGE,
    segmentation: REVIEWED_SEGMENTATION,
    reviewedExecutionBaseSha,
    providerIdentity: {
      providerFamily: providerIdentity.providerFamily,
      providerName: providerIdentity.providerName,
      model: providerIdentity.model,
    },
    endpointIdentity,
    targetGrid,
    targetResults,
    aggregateClassification: classifyAggregate(targetResults),
    scaffoldAggregateClassification: aggregate.aggregateClassification,
    claimBoundary: safeClaimBoundary(),
  };
}

async function callProviderForTarget({ target, providerIdentity }) {
  const request = buildRequestBody(target, providerIdentity);
  const endpoint = `${normalizeBaseUrl(providerIdentity.baseUrl)}${CHAT_COMPLETIONS_PATH}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${providerIdentity.apiKey}`,
    },
    body: JSON.stringify(request.requestBody),
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`provider request failed for ${target.targetId}: HTTP ${response.status}`);
  }

  const rawPayload = JSON.parse(rawText);
  const messageContent = extractOpenAiCompatibleMessageContent(rawPayload);
  const parsedResponse = parseJsonObjectFromText(messageContent);

  return buildTargetResult({
    target,
    response: parsedResponse,
    promptSha256: request.promptSha256,
    requestBodySha256: request.requestBodySha256,
    responseSha256: sha256Text(messageContent),
    providerRawPayloadSha256: sha256Text(rawText),
  });
}

async function executeReviewedTargetGrid({ reviewedExecutionBaseSha, providerIdentity, outputPath }) {
  validateReviewedExecutionBaseOrThrow(reviewedExecutionBaseSha);
  validateProviderIdentityOrThrow(providerIdentity);
  validateOutputPathOrThrow(outputPath);

  const targetGrid = buildTargetGrid();
  const targetResults = [];

  for (const target of targetGrid) {
    const targetValidation = validateTarget(target);
    if (!targetValidation.ok) {
      throw new Error(`target validation failed for ${target.targetId}: ${targetValidation.errors.join("; ")}`);
    }

    targetResults.push(await callProviderForTarget({ target, providerIdentity }));
  }

  const artifact = buildExecutionArtifact({
    reviewedExecutionBaseSha,
    providerIdentity,
    endpointIdentity: {
      endpointClass: providerIdentity.endpointClass,
      baseUrl: providerIdentity.baseUrl,
      chatCompletionsPath: CHAT_COMPLETIONS_PATH,
    },
    targetGrid,
    targetResults,
  });

  writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  return artifact;
}

function buildReviewedRequests(providerIdentity = REVIEWED_PROVIDER_IDENTITY) {
  return buildTargetGrid().map((target) => {
    const request = buildRequestBody(target, providerIdentity);

    return {
      targetId: target.targetId,
      target,
      promptSha256: request.promptSha256,
      requestBodySha256: request.requestBodySha256,
      requestBody: request.requestBody,
    };
  });
}

function runSelfCheck() {
  const errors = [];

  const targetGrid = buildTargetGrid();
  const reviewedRequests = buildReviewedRequests();

  if (targetGrid.length !== 8) {
    errors.push("target grid must contain 8 targets");
  }

  if (reviewedRequests.length !== 8) {
    errors.push("reviewed request count must be 8");
  }

  if (!reviewedRequests.every((request) => /^[0-9a-f]{64}$/.test(request.promptSha256))) {
    errors.push("every request must expose a prompt sha256");
  }

  if (!reviewedRequests.every((request) => /^[0-9a-f]{64}$/.test(request.requestBodySha256))) {
    errors.push("every request must expose a request body sha256");
  }

  for (const target of targetGrid) {
    const validation = validateTarget(target);
    if (!validation.ok) {
      errors.push(...validation.errors.map((error) => `${target.targetId}: ${error}`));
    }
  }

  const nullResponse = {
    word: targetGrid[0].word,
    stage: targetGrid[0].stage,
    segmentation: targetGrid[0].segmentation,
    chunk: targetGrid[0].chunk,
    candidateLanguage: targetGrid[0].candidateLanguage,
    candidate: null,
    nullAccepted: true,
    claimBoundary: safeClaimBoundary(),
  };

  const nullTargetResult = buildTargetResult({
    target: targetGrid[0],
    response: nullResponse,
    promptSha256: reviewedRequests[0].promptSha256,
    requestBodySha256: reviewedRequests[0].requestBodySha256,
    responseSha256: sha256Text(JSON.stringify(nullResponse)),
    providerRawPayloadSha256: sha256Text(JSON.stringify({ choices: [{ message: { content: JSON.stringify(nullResponse) } }] })),
  });

  if (nullTargetResult.outcomeClassification !== "TARGET_NULL_ACCEPTED") {
    errors.push("null target result classification mismatch");
  }

  const signalResponse = {
    ...nullResponse,
    candidate: {
      chunk: targetGrid[0].chunk,
      language: targetGrid[0].candidateLanguage,
      isolatedStandaloneForm: "kom",
      plainStandaloneDefinitionGloss: "standalone development-only test gloss",
      notes: [],
    },
    nullAccepted: false,
  };

  const signalTargetResult = buildTargetResult({
    target: targetGrid[0],
    response: signalResponse,
    promptSha256: reviewedRequests[0].promptSha256,
    requestBodySha256: reviewedRequests[0].requestBodySha256,
    responseSha256: sha256Text(JSON.stringify(signalResponse)),
    providerRawPayloadSha256: sha256Text(JSON.stringify({ choices: [{ message: { content: JSON.stringify(signalResponse) } }] })),
  });

  if (signalTargetResult.outcomeClassification !== "TARGET_SIGNAL_PRESENT") {
    errors.push("signal target result classification mismatch");
  }

  const allNullArtifact = buildExecutionArtifact({
    reviewedExecutionBaseSha: "f8ea719810489ade54cc63d37b3dc92dc04cfc5c",
    providerIdentity: REVIEWED_PROVIDER_IDENTITY,
    endpointIdentity: {
      endpointClass: REVIEWED_PROVIDER_IDENTITY.endpointClass,
      baseUrl: REVIEWED_PROVIDER_IDENTITY.baseUrl,
      chatCompletionsPath: CHAT_COMPLETIONS_PATH,
    },
    targetGrid,
    targetResults: targetGrid.map((target, index) => buildTargetResult({
      target,
      response: {
        word: target.word,
        stage: target.stage,
        segmentation: target.segmentation,
        chunk: target.chunk,
        candidateLanguage: target.candidateLanguage,
        candidate: null,
        nullAccepted: true,
        claimBoundary: safeClaimBoundary(),
      },
      promptSha256: reviewedRequests[index].promptSha256,
      requestBodySha256: reviewedRequests[index].requestBodySha256,
      responseSha256: sha256Text(`${target.targetId}:null`),
      providerRawPayloadSha256: sha256Text(`${target.targetId}:payload`),
    })),
  });

  if (allNullArtifact.aggregateClassification !== "TARGET_GRID_ALL_NULL_ACCEPTED") {
    errors.push("all-null artifact aggregate classification mismatch");
  }

  try {
    validateProviderIdentityOrThrow({ ...REVIEWED_PROVIDER_IDENTITY, providerName: "other" });
    errors.push("provider identity mismatch should fail closed");
  } catch (error) {
    if (!String(error.message).includes("providerName")) {
      errors.push("provider identity mismatch emitted unexpected error");
    }
  }

  try {
    validateOutputPathOrThrow("docs/open-instrument/artifacts/zheji-generalization/other.json");
    errors.push("output path mismatch should fail closed");
  } catch (error) {
    if (!String(error.message).includes("output path")) {
      errors.push("output path mismatch emitted unexpected error");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    schemaVersion: RUNNER_SCHEMA_VERSION,
    scaffoldSchemaVersion: TARGET_GRID_SCHEMA_VERSION,
    targetCount: targetGrid.length,
    requestCount: reviewedRequests.length,
    reviewedOutputPath: REVIEWED_OUTPUT_PATH,
    providerIdentity: {
      providerFamily: REVIEWED_PROVIDER_IDENTITY.providerFamily,
      providerName: REVIEWED_PROVIDER_IDENTITY.providerName,
      model: REVIEWED_PROVIDER_IDENTITY.model,
      endpointClass: REVIEWED_PROVIDER_IDENTITY.endpointClass,
    },
    allNullClassification: allNullArtifact.aggregateClassification,
  };
}

function providerIdentityFromArgs(values) {
  return {
    providerFamily: values[cliSchema.reviewedExecutionBaseSha] ? values[cliSchema.providerFamily] : undefined,
    providerName: values[cliSchema.providerName],
    model: values[cliSchema.model],
    endpointClass: values[cliSchema.endpointClass],
    baseUrl: values[cliSchema.baseUrl],
    apiKey: values[cliSchema.apiKey],
  };
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.selfCheck) {
    const result = runSelfCheck();
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) {
      process.exitCode = 1;
    }
    return;
  }

  if (parsed.printRequests) {
    console.log(JSON.stringify(buildReviewedRequests(), null, 2));
    return;
  }

  if (!parsed.execute) {
    throw new Error(`Refusing to run: missing explicit ${REQUIRED_EXECUTION_FLAG}`);
  }

  const artifact = await executeReviewedTargetGrid({
    reviewedExecutionBaseSha: parsed.values[cliSchema.reviewedExecutionBaseSha],
    providerIdentity: providerIdentityFromArgs(parsed.values),
    outputPath: parsed.values[cliSchema.output],
  });

  console.log(JSON.stringify({
    ok: true,
    output: parsed.values[cliSchema.output],
    aggregateClassification: artifact.aggregateClassification,
  }, null, 2));
}

const currentFilePath = resolve(fileURLToPath(import.meta.url));
const invokedFilePath = process.argv[1] ? resolve(process.argv[1]) : "";

if (currentFilePath === invokedFilePath) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

export {
  REQUIRED_EXECUTION_FLAG,
  REVIEWED_OUTPUT_PATH,
  REVIEWED_PROVIDER_IDENTITY,
  RUNNER_SCHEMA_VERSION,
  buildExecutionArtifact,
  buildRequestBody,
  buildReviewedRequests,
  buildTargetPrompt,
  buildTargetResult,
  callProviderForTarget,
  classifyTargetOutcome,
  executeReviewedTargetGrid,
  extractOpenAiCompatibleMessageContent,
  parseArgs,
  parseJsonObjectFromText,
  runSelfCheck,
  validateOutputPathOrThrow,
  validateProviderIdentityOrThrow,
  validateReviewedExecutionBaseOrThrow,
};
