#!/usr/bin/env node

/**
 * Zheji study003 replay runner scaffold.
 *
 * This script is intentionally plan-only in v0.1.
 * It does not call a model.
 * It does not write artifacts.
 * It does not touch runtime routes.
 * It does not change provider defaults.
 *
 * The actual controlled replay must happen in a separate artifact PR.
 */

const today = new Date().toISOString().slice(0, 10);

const plan = {
  runnerVersion: "zheji-study003-replay-runner.v0.1",
  mode: "PLAN_ONLY_NO_MODEL_CALL",
  date: today,
  word: "study",
  segmentationId: "study.segmentation.003",
  chunks: ["SHTU", "DI"],
  provider: "openai_compat",
  model: "llama3.1:8b",
  endpoint: "http://localhost:11434/v1/chat/completions",
  modelCallMade: false,
  artifactWritten: false,
  runtimeWiringChanged: false,
  providerDefaultChanged: false,
  openAiApiUsed: false,
  nextStep:
    "Use the TypeScript helper to build the controlled replay payload, then run the actual model call in a separate artifact PR.",
};

console.log(JSON.stringify(plan, null, 2));
