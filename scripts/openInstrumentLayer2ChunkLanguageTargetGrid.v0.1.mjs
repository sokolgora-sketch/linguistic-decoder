#!/usr/bin/env node

const TARGET_GRID_SCHEMA_VERSION = "open-instrument.layer2-chunk-language-target-grid.scaffold.v0.1";

const REVIEWED_WORD = "comic";
const REVIEWED_STAGE = "MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY";
const REVIEWED_SEGMENTATION = "COM + IC";
const REVIEWED_SOURCE_LANGUAGE = "English";

const REVIEWED_CHUNKS = Object.freeze(["COM", "IC"]);
const REVIEWED_CANDIDATE_LANGUAGES = Object.freeze(["Albanian", "Latin", "Greek", "Sanskrit"]);

const ALLOWED_TARGET_STATUSES = Object.freeze(["pending", "executed", "skipped"]);

const AGGREGATE_CLASSIFICATIONS = Object.freeze([
  "TARGET_GRID_SIGNAL_PRESENT",
  "TARGET_GRID_ALL_NULL_ACCEPTED",
  "TARGET_GRID_DEGENERATE_BLOCKED",
  "TARGET_GRID_PARTIAL_INVALIDATED",
  "TARGET_GRID_EXECUTION_BLOCKED",
]);

const NON_DEVELOPMENT_CLAIM_FIELDS = Object.freeze([
  "publicationEvidence",
  "originEvidence",
  "ownershipEvidence",
  "modelQualityEvidence",
  "providerOutputCorrectnessEvidence",
  "candidateTruthEvidence",
  "evidencePromotion",
  "winnerCrowned",
]);

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeComparableText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase();
}

function normalizeIdentifierPart(value) {
  return String(value ?? "").trim().replace(/\s+/g, "_");
}

function equalsComparableText(left, right) {
  return normalizeComparableText(left) === normalizeComparableText(right);
}

function glossMentionsWholeInputWord(gloss, word) {
  const normalizedGloss = normalizeComparableText(gloss).replace(/[^a-z0-9ë]+/g, "");
  const normalizedWord = normalizeComparableText(word).replace(/[^a-z0-9ë]+/g, "");
  return Boolean(normalizedWord) && normalizedGloss.includes(normalizedWord);
}

function buildTargetId({ word, chunk, candidateLanguage }) {
  return `${word}::${chunk}::${normalizeIdentifierPart(candidateLanguage)}`;
}

function buildTargetGrid({
  word = REVIEWED_WORD,
  stage = REVIEWED_STAGE,
  segmentation = REVIEWED_SEGMENTATION,
  sourceLanguage = REVIEWED_SOURCE_LANGUAGE,
  chunks = REVIEWED_CHUNKS,
  candidateLanguages = REVIEWED_CANDIDATE_LANGUAGES,
} = {}) {
  return chunks.flatMap((chunk) =>
    candidateLanguages.map((candidateLanguage) => ({
      word,
      stage,
      segmentation,
      chunk,
      candidateLanguage,
      sourceLanguage,
      targetId: buildTargetId({ word, chunk, candidateLanguage }),
      targetStatus: "pending",
    })),
  );
}

function validateTarget(target) {
  const errors = [];

  for (const key of ["word", "stage", "segmentation", "chunk", "candidateLanguage", "sourceLanguage", "targetId", "targetStatus"]) {
    if (!hasText(target?.[key])) {
      errors.push(`target.${key} must be present`);
    }
  }

  if (!REVIEWED_CHUNKS.includes(target?.chunk)) {
    errors.push("target.chunk must be one of the reviewed chunks");
  }

  if (!REVIEWED_CANDIDATE_LANGUAGES.includes(target?.candidateLanguage)) {
    errors.push("target.candidateLanguage must be one of the reviewed seed languages");
  }

  if (!ALLOWED_TARGET_STATUSES.includes(target?.targetStatus)) {
    errors.push("target.targetStatus must be pending, executed, or skipped");
  }

  if (target?.targetId !== buildTargetId({
    word: target?.word,
    chunk: target?.chunk,
    candidateLanguage: target?.candidateLanguage,
  })) {
    errors.push("target.targetId must match canonical target id");
  }

  if (equalsComparableText(target?.candidateLanguage, target?.sourceLanguage)) {
    errors.push("target.candidateLanguage must not equal sourceLanguage");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

function validateClaimBoundary(claimBoundary) {
  const errors = [];

  if (claimBoundary?.developmentOnly !== true) {
    errors.push("claimBoundary.developmentOnly must be true");
  }

  for (const field of NON_DEVELOPMENT_CLAIM_FIELDS) {
    if (claimBoundary?.[field] !== false) {
      errors.push(`claimBoundary.${field} must be false`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

function validateTargetResponse(response, target) {
  const errors = [];

  const targetValidation = validateTarget(target);
  if (!targetValidation.ok) {
    errors.push(...targetValidation.errors.map((error) => `target invalid: ${error}`));
  }

  for (const key of ["word", "stage", "segmentation", "chunk", "candidateLanguage", "nullAccepted", "claimBoundary"]) {
    if (response?.[key] === undefined) {
      errors.push(`response.${key} must be present`);
    }
  }

  if (response?.word !== target?.word) {
    errors.push("response.word must equal target.word");
  }

  if (response?.stage !== target?.stage) {
    errors.push("response.stage must equal target.stage");
  }

  if (response?.segmentation !== target?.segmentation) {
    errors.push("response.segmentation must equal target.segmentation");
  }

  if (response?.chunk !== target?.chunk) {
    errors.push("response.chunk must equal target.chunk");
  }

  if (response?.candidateLanguage !== target?.candidateLanguage) {
    errors.push("response.candidateLanguage must equal target.candidateLanguage");
  }

  const claimBoundaryValidation = validateClaimBoundary(response?.claimBoundary);
  if (!claimBoundaryValidation.ok) {
    errors.push(...claimBoundaryValidation.errors);
  }

  if (response?.candidate === null) {
    if (response?.nullAccepted !== true) {
      errors.push("null target response must set nullAccepted true");
    }
  } else {
    const candidate = response?.candidate;

    if (candidate === undefined || typeof candidate !== "object") {
      errors.push("response.candidate must be object or null");
    } else {
      for (const key of ["chunk", "language", "isolatedStandaloneForm", "plainStandaloneDefinitionGloss", "notes"]) {
        if (candidate?.[key] === undefined) {
          errors.push(`candidate.${key} must be present`);
        }
      }

      if (candidate?.chunk !== target?.chunk) {
        errors.push("candidate.chunk must equal target.chunk");
      }

      if (candidate?.language !== target?.candidateLanguage) {
        errors.push("candidate.language must equal target.candidateLanguage");
      }

      if (!REVIEWED_CANDIDATE_LANGUAGES.includes(candidate?.language)) {
        errors.push("candidate.language must be in reviewed seed language set");
      }

      if (equalsComparableText(candidate?.language, target?.sourceLanguage)) {
        errors.push("candidate.language must not equal sourceLanguage");
      }

      if (equalsComparableText(candidate?.isolatedStandaloneForm, target?.word)) {
        errors.push("candidate.isolatedStandaloneForm must not equal the full input word");
      }

      if (glossMentionsWholeInputWord(candidate?.plainStandaloneDefinitionGloss, target?.word)) {
        errors.push("candidate.plainStandaloneDefinitionGloss must not merely define the full input word");
      }

      if (!Array.isArray(candidate?.notes)) {
        errors.push("candidate.notes must be an array");
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

function classifyAggregate(targetResults) {
  if (!Array.isArray(targetResults) || targetResults.length === 0) {
    return "TARGET_GRID_EXECUTION_BLOCKED";
  }

  if (targetResults.some((result) => result.validation?.status !== "passed")) {
    return "TARGET_GRID_PARTIAL_INVALIDATED";
  }

  if (targetResults.some((result) => result.outcomeClassification === "TARGET_SIGNAL_PRESENT")) {
    return "TARGET_GRID_SIGNAL_PRESENT";
  }

  if (targetResults.some((result) => result.outcomeClassification === "TARGET_DEGENERATE_BLOCKED")) {
    return "TARGET_GRID_DEGENERATE_BLOCKED";
  }

  if (targetResults.every((result) => result.outcomeClassification === "TARGET_NULL_ACCEPTED")) {
    return "TARGET_GRID_ALL_NULL_ACCEPTED";
  }

  return "TARGET_GRID_EXECUTION_BLOCKED";
}

function safeClaimBoundary() {
  return {
    developmentOnly: true,
    publicationEvidence: false,
    originEvidence: false,
    ownershipEvidence: false,
    modelQualityEvidence: false,
    providerOutputCorrectnessEvidence: false,
    candidateTruthEvidence: false,
    evidencePromotion: false,
    winnerCrowned: false,
  };
}

function buildAggregateArtifact({ targetGrid, targetResults }) {
  return {
    schemaVersion: TARGET_GRID_SCHEMA_VERSION,
    word: REVIEWED_WORD,
    stage: REVIEWED_STAGE,
    segmentation: REVIEWED_SEGMENTATION,
    targetGrid,
    targetResults,
    aggregateClassification: classifyAggregate(targetResults),
    claimBoundary: safeClaimBoundary(),
  };
}

function makeNullTargetResult(target) {
  const response = {
    word: target.word,
    stage: target.stage,
    segmentation: target.segmentation,
    chunk: target.chunk,
    candidateLanguage: target.candidateLanguage,
    candidate: null,
    nullAccepted: true,
    claimBoundary: safeClaimBoundary(),
  };

  const validation = validateTargetResponse(response, target);

  return {
    targetId: target.targetId,
    outcomeClassification: "TARGET_NULL_ACCEPTED",
    validation: {
      status: validation.ok ? "passed" : "failed",
      errors: validation.errors,
    },
    response,
  };
}

function runSelfCheck() {
  const targetGrid = buildTargetGrid();
  const errors = [];

  const expectedTargetIds = [
    "comic::COM::Albanian",
    "comic::COM::Latin",
    "comic::COM::Greek",
    "comic::COM::Sanskrit",
    "comic::IC::Albanian",
    "comic::IC::Latin",
    "comic::IC::Greek",
    "comic::IC::Sanskrit",
  ];

  const targetIds = targetGrid.map((target) => target.targetId);

  if (JSON.stringify(targetIds) !== JSON.stringify(expectedTargetIds)) {
    errors.push("target grid ids do not match reviewed initial grid");
  }

  for (const target of targetGrid) {
    const validation = validateTarget(target);
    if (!validation.ok) {
      errors.push(...validation.errors.map((error) => `${target.targetId}: ${error}`));
    }
  }

  const nullResults = targetGrid.map((target) => makeNullTargetResult(target));
  const allNullArtifact = buildAggregateArtifact({ targetGrid, targetResults: nullResults });

  if (allNullArtifact.aggregateClassification !== "TARGET_GRID_ALL_NULL_ACCEPTED") {
    errors.push("all-null aggregate classification mismatch");
  }

  const signalResponse = {
    word: targetGrid[0].word,
    stage: targetGrid[0].stage,
    segmentation: targetGrid[0].segmentation,
    chunk: targetGrid[0].chunk,
    candidateLanguage: targetGrid[0].candidateLanguage,
    candidate: {
      chunk: targetGrid[0].chunk,
      language: targetGrid[0].candidateLanguage,
      isolatedStandaloneForm: "kom",
      plainStandaloneDefinitionGloss: "standalone test gloss",
      notes: [],
    },
    nullAccepted: false,
    claimBoundary: safeClaimBoundary(),
  };

  const signalValidation = validateTargetResponse(signalResponse, targetGrid[0]);
  if (!signalValidation.ok) {
    errors.push(...signalValidation.errors.map((error) => `signal target invalid: ${error}`));
  }

  const badWholeWordResponse = {
    ...signalResponse,
    candidate: {
      ...signalResponse.candidate,
      isolatedStandaloneForm: "comic",
    },
  };

  const badWholeWordValidation = validateTargetResponse(badWholeWordResponse, targetGrid[0]);
  if (!badWholeWordValidation.errors.includes("candidate.isolatedStandaloneForm must not equal the full input word")) {
    errors.push("whole-word candidate rejection did not trigger");
  }

  const badLanguageResponse = {
    ...signalResponse,
    candidateLanguage: "Imaginary",
    candidate: {
      ...signalResponse.candidate,
      language: "Imaginary",
    },
  };

  const badLanguageValidation = validateTargetResponse(badLanguageResponse, targetGrid[0]);
  if (!badLanguageValidation.errors.some((error) => error.includes("candidateLanguage must equal target.candidateLanguage"))) {
    errors.push("target language equality rejection did not trigger");
  }

  return {
    ok: errors.length === 0,
    errors,
    schemaVersion: TARGET_GRID_SCHEMA_VERSION,
    targetCount: targetGrid.length,
    targetIds,
    allNullClassification: allNullArtifact.aggregateClassification,
    allowedAggregateClassifications: AGGREGATE_CLASSIFICATIONS,
  };
}

if (process.argv.includes("--print-grid")) {
  console.log(JSON.stringify(buildTargetGrid(), null, 2));
} else if (process.argv.includes("--self-check")) {
  const result = runSelfCheck();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    process.exitCode = 1;
  }
}

export {
  AGGREGATE_CLASSIFICATIONS,
  ALLOWED_TARGET_STATUSES,
  REVIEWED_CANDIDATE_LANGUAGES,
  REVIEWED_CHUNKS,
  TARGET_GRID_SCHEMA_VERSION,
  buildAggregateArtifact,
  buildTargetGrid,
  buildTargetId,
  classifyAggregate,
  runSelfCheck,
  safeClaimBoundary,
  validateClaimBoundary,
  validateTarget,
  validateTargetResponse,
};
