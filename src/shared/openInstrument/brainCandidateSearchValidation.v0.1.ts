import {
  BRAIN_CANDIDATE_TYPES,
  BRAIN_EVIDENCE_TYPES,
  BRAIN_FALSE_FRIEND_RISKS,
  type BrainCandidateSearchInput,
  type BrainCandidateType,
  type BrainEvidenceType,
  type BrainFalseFriendRisk,
} from "./brainCandidateSearchPrompt.v0.1";

export type BrainChunkCandidate = {
  segmentationId: string;
  chunk: string;
  language: string;
  candidateForm: string;
  meaning: string;
  functionFit: string;
  sourceNote: string;
  evidenceType: BrainEvidenceType;
  candidateType: BrainCandidateType;
  falseFriendRisk: BrainFalseFriendRisk;
  nullCandidate: boolean;
  notes: string;
};

export type BrainCandidateSearchOutput = {
  word: string;
  segmentationId: string;
  chunkCandidates: BrainChunkCandidate[];
  nullCandidates: BrainChunkCandidate[];
  warnings: string[];
  claimBoundary: {
    originClaim: false;
    scientificEvidence: false;
    publicationEvidence: false;
    developmentCandidateSearchOnly: true;
  };
};

export type BrainCandidateSearchValidationIssue = {
  code:
    | "OUTPUT_NOT_OBJECT"
    | "WORD_MISMATCH"
    | "SEGMENTATION_ID_MISMATCH"
    | "UNKNOWN_CHUNK"
    | "MISSING_FIELD"
    | "INVALID_CANDIDATE_TYPE"
    | "INVALID_EVIDENCE_TYPE"
    | "INVALID_FALSE_FRIEND_RISK"
    | "INVALID_CLAIM_BOUNDARY"
    | "INVALID_NULL_CANDIDATE"
    | "MISSING_CHUNK_RESULT"
    | "STRONG_CANDIDATE_MISSING_SOURCE"
    | "DOCTRINE_ONLY_STRONG_CANDIDATE"
    | "FORBIDDEN_ORIGIN_CLAIM";
  severity: "error" | "warning";
  message: string;
  path: string;
};

export type BrainCandidateSearchValidationResult = {
  ok: boolean;
  issues: BrainCandidateSearchValidationIssue[];
  summary: {
    checkedCandidates: number;
    checkedNullCandidates: number;
    chunksCovered: string[];
    missingChunks: string[];
  };
};

export type BrainCandidateSearchValidationInput = {
  heartInput: BrainCandidateSearchInput;
  brainOutput: unknown;
};

const REQUIRED_TOP_LEVEL_FIELDS = [
  "word",
  "segmentationId",
  "chunkCandidates",
  "nullCandidates",
  "warnings",
  "claimBoundary",
] as const;

const REQUIRED_CANDIDATE_FIELDS = [
  "segmentationId",
  "chunk",
  "language",
  "candidateForm",
  "meaning",
  "functionFit",
  "sourceNote",
  "evidenceType",
  "candidateType",
  "falseFriendRisk",
  "nullCandidate",
  "notes",
] as const;

const FORBIDDEN_CLAIM_PATTERNS = [
  /proves origin/i,
  /is the origin/i,
  /definitive origin/i,
  /scientific proof/i,
  /publication evidence/i,
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addIssue(
  issues: BrainCandidateSearchValidationIssue[],
  code: BrainCandidateSearchValidationIssue["code"],
  message: string,
  path: string,
  severity: BrainCandidateSearchValidationIssue["severity"] = "error",
): void {
  issues.push({ code, severity, message, path });
}

function hasNonEmptyText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function containsForbiddenClaim(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return FORBIDDEN_CLAIM_PATTERNS.some((pattern) => pattern.test(value));
}

function validateClaimBoundary(
  output: Record<string, unknown>,
  issues: BrainCandidateSearchValidationIssue[],
): void {
  const boundary = output.claimBoundary;
  if (!isRecord(boundary)) {
    addIssue(
      issues,
      "INVALID_CLAIM_BOUNDARY",
      "claimBoundary must be an object.",
      "claimBoundary",
    );
    return;
  }

  const expected = {
    originClaim: false,
    scientificEvidence: false,
    publicationEvidence: false,
    developmentCandidateSearchOnly: true,
  } as const;

  for (const [key, value] of Object.entries(expected)) {
    if (boundary[key] !== value) {
      addIssue(
        issues,
        "INVALID_CLAIM_BOUNDARY",
        `claimBoundary.${key} must be ${String(value)}.`,
        `claimBoundary.${key}`,
      );
    }
  }
}

function validateCandidate(
  candidate: unknown,
  path: string,
  heartInput: BrainCandidateSearchInput,
  issues: BrainCandidateSearchValidationIssue[],
  coveredChunks: Set<string>,
): void {
  if (!isRecord(candidate)) {
    addIssue(issues, "MISSING_FIELD", "candidate must be an object.", path);
    return;
  }

  for (const field of REQUIRED_CANDIDATE_FIELDS) {
    if (!(field in candidate)) {
      addIssue(
        issues,
        "MISSING_FIELD",
        `candidate missing required field: ${field}`,
        `${path}.${field}`,
      );
    }
  }

  if (candidate.segmentationId !== heartInput.segmentationId) {
    addIssue(
      issues,
      "SEGMENTATION_ID_MISMATCH",
      "candidate segmentationId must match Heart input segmentationId.",
      `${path}.segmentationId`,
    );
  }

  if (typeof candidate.chunk !== "string" || !heartInput.chunks.includes(candidate.chunk)) {
    addIssue(
      issues,
      "UNKNOWN_CHUNK",
      "candidate chunk must be one of Heart-approved chunks.",
      `${path}.chunk`,
    );
  } else {
    coveredChunks.add(candidate.chunk);
  }

  if (
    typeof candidate.candidateType !== "string" ||
    !BRAIN_CANDIDATE_TYPES.includes(candidate.candidateType as BrainCandidateType)
  ) {
    addIssue(
      issues,
      "INVALID_CANDIDATE_TYPE",
      "candidateType must be one of the allowed Brain candidate types.",
      `${path}.candidateType`,
    );
  }

  if (
    typeof candidate.evidenceType !== "string" ||
    !BRAIN_EVIDENCE_TYPES.includes(candidate.evidenceType as BrainEvidenceType)
  ) {
    addIssue(
      issues,
      "INVALID_EVIDENCE_TYPE",
      "evidenceType must be one of the allowed Brain evidence types.",
      `${path}.evidenceType`,
    );
  }

  if (
    typeof candidate.falseFriendRisk !== "string" ||
    !BRAIN_FALSE_FRIEND_RISKS.includes(candidate.falseFriendRisk as BrainFalseFriendRisk)
  ) {
    addIssue(
      issues,
      "INVALID_FALSE_FRIEND_RISK",
      "falseFriendRisk must be one of the allowed values.",
      `${path}.falseFriendRisk`,
    );
  }

  if (candidate.nullCandidate === true) {
    if (candidate.candidateType !== "null_candidate") {
      addIssue(
        issues,
        "INVALID_NULL_CANDIDATE",
        "nullCandidate=true requires candidateType=null_candidate.",
        `${path}.candidateType`,
      );
    }

    if (candidate.evidenceType !== "none") {
      addIssue(
        issues,
        "INVALID_NULL_CANDIDATE",
        "nullCandidate=true requires evidenceType=none.",
        `${path}.evidenceType`,
      );
    }

    if (candidate.falseFriendRisk !== "none") {
      addIssue(
        issues,
        "INVALID_NULL_CANDIDATE",
        "nullCandidate=true requires falseFriendRisk=none.",
        `${path}.falseFriendRisk`,
      );
    }

    if (!hasNonEmptyText(candidate.sourceNote) && !hasNonEmptyText(candidate.notes)) {
      addIssue(
        issues,
        "INVALID_NULL_CANDIDATE",
        "null candidate must explain absence in sourceNote or notes.",
        `${path}.sourceNote`,
      );
    }
  }

  if (candidate.candidateType === "strong_living_match") {
    if (!hasNonEmptyText(candidate.sourceNote)) {
      addIssue(
        issues,
        "STRONG_CANDIDATE_MISSING_SOURCE",
        "strong_living_match requires non-empty sourceNote.",
        `${path}.sourceNote`,
      );
    }

    if (candidate.evidenceType === "none") {
      addIssue(
        issues,
        "STRONG_CANDIDATE_MISSING_SOURCE",
        "strong_living_match must not use evidenceType=none.",
        `${path}.evidenceType`,
      );
    }

    if (candidate.evidenceType === "doctrine_alignment") {
      addIssue(
        issues,
        "DOCTRINE_ONLY_STRONG_CANDIDATE",
        "doctrine_alignment alone cannot support strong_living_match.",
        `${path}.evidenceType`,
      );
    }
  }

  for (const field of ["notes", "functionFit", "sourceNote"] as const) {
    if (containsForbiddenClaim(candidate[field])) {
      addIssue(
        issues,
        "FORBIDDEN_ORIGIN_CLAIM",
        `candidate ${field} contains forbidden origin/proof claim.`,
        `${path}.${field}`,
      );
    }
  }
}

export function validateBrainCandidateSearchOutput({
  heartInput,
  brainOutput,
}: BrainCandidateSearchValidationInput): BrainCandidateSearchValidationResult {
  const issues: BrainCandidateSearchValidationIssue[] = [];
  const coveredChunks = new Set<string>();

  if (!isRecord(brainOutput)) {
    addIssue(issues, "OUTPUT_NOT_OBJECT", "Brain output must be an object.", "$");
    return {
      ok: false,
      issues,
      summary: {
        checkedCandidates: 0,
        checkedNullCandidates: 0,
        chunksCovered: [],
        missingChunks: [...heartInput.chunks],
      },
    };
  }

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(field in brainOutput)) {
      addIssue(
        issues,
        "MISSING_FIELD",
        `Brain output missing required field: ${field}`,
        field,
      );
    }
  }

  if (brainOutput.word !== heartInput.word) {
    addIssue(
      issues,
      "WORD_MISMATCH",
      "Brain output word must match Heart input word.",
      "word",
    );
  }

  if (brainOutput.segmentationId !== heartInput.segmentationId) {
    addIssue(
      issues,
      "SEGMENTATION_ID_MISMATCH",
      "Brain output segmentationId must match Heart input segmentationId.",
      "segmentationId",
    );
  }

  if (!Array.isArray(brainOutput.chunkCandidates)) {
    addIssue(issues, "MISSING_FIELD", "chunkCandidates must be an array.", "chunkCandidates");
  }

  if (!Array.isArray(brainOutput.nullCandidates)) {
    addIssue(issues, "MISSING_FIELD", "nullCandidates must be an array.", "nullCandidates");
  }

  if (!Array.isArray(brainOutput.warnings)) {
    addIssue(issues, "MISSING_FIELD", "warnings must be an array.", "warnings");
  }

  validateClaimBoundary(brainOutput, issues);

  const chunkCandidates = Array.isArray(brainOutput.chunkCandidates)
    ? brainOutput.chunkCandidates
    : [];
  const nullCandidates = Array.isArray(brainOutput.nullCandidates)
    ? brainOutput.nullCandidates
    : [];

  chunkCandidates.forEach((candidate, index) => {
    validateCandidate(candidate, `chunkCandidates.${index}`, heartInput, issues, coveredChunks);
  });

  nullCandidates.forEach((candidate, index) => {
    validateCandidate(candidate, `nullCandidates.${index}`, heartInput, issues, coveredChunks);
  });

  const missingChunks = heartInput.chunks.filter((chunk) => !coveredChunks.has(chunk));
  for (const chunk of missingChunks) {
    addIssue(
      issues,
      "MISSING_CHUNK_RESULT",
      "Every Heart-approved chunk must have at least one candidate or null candidate.",
      `chunks.${chunk}`,
    );
  }

  return {
    ok: issues.every((issue) => issue.severity !== "error"),
    issues,
    summary: {
      checkedCandidates: chunkCandidates.length,
      checkedNullCandidates: nullCandidates.length,
      chunksCovered: [...coveredChunks],
      missingChunks,
    },
  };
}
