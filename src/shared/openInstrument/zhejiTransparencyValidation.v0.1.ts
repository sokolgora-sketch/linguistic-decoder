import {
  ZHEJI_FORBIDDEN_RAW_FIELDS_V0_1,
  isZhejiTransparencyLevelV0_1,
} from "./zhejiTransparencyTypes.v0.1";

export type ZhejiValidationSeverityV0_1 = "error" | "warning";

export interface ZhejiValidationIssueV0_1 {
  severity: ZhejiValidationSeverityV0_1;
  code: string;
  path: string;
  message: string;
}

export interface ValidateZhejiTransparencyOutputInputV0_1 {
  chunkCandidates: readonly unknown[];
  nullCandidates?: readonly unknown[];
  rawBrainOutput?: unknown;
}

export interface ValidateZhejiTransparencyOutputResultV0_1 {
  ok: boolean;
  issues: ZhejiValidationIssueV0_1[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function pushIssue(
  issues: ZhejiValidationIssueV0_1[],
  code: string,
  path: string,
  message: string,
): void {
  issues.push({
    severity: "error",
    code,
    path,
    message,
  });
}

function validateNoForbiddenRawFields(
  value: unknown,
  path: string,
  issues: ZhejiValidationIssueV0_1[],
): void {
  if (!isRecord(value)) return;

  for (const field of ZHEJI_FORBIDDEN_RAW_FIELDS_V0_1) {
    if (hasOwn(value, field)) {
      pushIssue(
        issues,
        "ZHEJI_FORBIDDEN_RAW_FIELD",
        path ? `${path}.${field}` : field,
        `${field} is forbidden in raw Brain output for Zheji replay scaffold.`,
      );
    }
  }

  for (const [key, child] of Object.entries(value)) {
    const nextPath = path ? `${path}.${key}` : key;
    if (Array.isArray(child)) {
      child.forEach((item, index) => {
        validateNoForbiddenRawFields(item, `${nextPath}.${index}`, issues);
      });
    } else if (isRecord(child)) {
      validateNoForbiddenRawFields(child, nextPath, issues);
    }
  }
}

function validatePresenceLayer(
  value: unknown,
  path: string,
  issues: ZhejiValidationIssueV0_1[],
): void {
  if (!isRecord(value)) {
    pushIssue(
      issues,
      "INVALID_ZHEJI_ANALYSIS_LAYER",
      path,
      "analysis layer must be an object.",
    );
    return;
  }

  if (typeof value.isPresent !== "boolean") {
    pushIssue(
      issues,
      "INVALID_ZHEJI_ANALYSIS_LAYER",
      `${path}.isPresent`,
      "isPresent must be boolean.",
    );
  }

  if (
    value.evidenceNote !== null &&
    typeof value.evidenceNote !== "string"
  ) {
    pushIssue(
      issues,
      "INVALID_ZHEJI_ANALYSIS_LAYER",
      `${path}.evidenceNote`,
      "evidenceNote must be string or null.",
    );
  }

  if (value.isPresent === true && !isNonEmptyString(value.evidenceNote)) {
    pushIssue(
      issues,
      "INVALID_ZHEJI_ANALYSIS_LAYER",
      `${path}.evidenceNote`,
      "evidenceNote must be a non-empty short string when isPresent is true.",
    );
  }
}

function validateAnalysisLayers(
  value: unknown,
  path: string,
  issues: ZhejiValidationIssueV0_1[],
): void {
  if (!isRecord(value)) {
    pushIssue(
      issues,
      "INVALID_ZHEJI_ANALYSIS_LAYERS",
      path,
      "analysisLayers must be an object.",
    );
    return;
  }

  validatePresenceLayer(value.formal, `${path}.formal`, issues);
  validatePresenceLayer(value.symbolic, `${path}.symbolic`, issues);

  for (const key of Object.keys(value)) {
    if (key !== "formal" && key !== "symbolic") {
      pushIssue(
        issues,
        "INVALID_ZHEJI_ANALYSIS_LAYERS",
        `${path}.${key}`,
        "analysisLayers v0.1 allows only formal and symbolic.",
      );
    }
  }
}

function validateSemanticTransparency(
  value: unknown,
  path: string,
  issues: ZhejiValidationIssueV0_1[],
): void {
  if (!isRecord(value)) {
    pushIssue(
      issues,
      "INVALID_ZHEJI_SEMANTIC_TRANSPARENCY",
      path,
      "semanticTransparency must be an object.",
    );
    return;
  }

  if (!isZhejiTransparencyLevelV0_1(value.level)) {
    pushIssue(
      issues,
      "INVALID_ZHEJI_TRANSPARENCY_LEVEL",
      `${path}.level`,
      "semanticTransparency.level must be atomic, metaphorical, or opaque.",
    );
  }

  if (!isNonEmptyString(value.reason)) {
    pushIssue(
      issues,
      "INVALID_ZHEJI_SEMANTIC_TRANSPARENCY",
      `${path}.reason`,
      "semanticTransparency.reason must be a non-empty short string.",
    );
  }

  if (
    hasOwn(value, "decomposition") &&
    !(
      Array.isArray(value.decomposition) &&
      value.decomposition.every((item) => isNonEmptyString(item))
    )
  ) {
    pushIssue(
      issues,
      "INVALID_ZHEJI_SEMANTIC_TRANSPARENCY",
      `${path}.decomposition`,
      "semanticTransparency.decomposition must be an array of non-empty strings when present.",
    );
  }
}

function isNullCandidate(candidate: Record<string, unknown>): boolean {
  return candidate.nullCandidate === true;
}

export function validateZhejiTransparencyOutputV0_1(
  input: ValidateZhejiTransparencyOutputInputV0_1,
): ValidateZhejiTransparencyOutputResultV0_1 {
  const issues: ZhejiValidationIssueV0_1[] = [];

  if (input.rawBrainOutput !== undefined) {
    validateNoForbiddenRawFields(input.rawBrainOutput, "", issues);
  }

  input.chunkCandidates.forEach((candidate, index) => {
    const path = `chunkCandidates.${index}`;

    if (!isRecord(candidate)) {
      pushIssue(
        issues,
        "INVALID_ZHEJI_CANDIDATE",
        path,
        "chunk candidate must be an object.",
      );
      return;
    }

    if (isNullCandidate(candidate)) return;

    if (!hasOwn(candidate, "analysisLayers")) {
      pushIssue(
        issues,
        "MISSING_ZHEJI_ANALYSIS_LAYERS",
        `${path}.analysisLayers`,
        "non-null chunk candidate must include analysisLayers.",
      );
    } else {
      validateAnalysisLayers(candidate.analysisLayers, `${path}.analysisLayers`, issues);
    }

    if (!hasOwn(candidate, "semanticTransparency")) {
      pushIssue(
        issues,
        "MISSING_ZHEJI_SEMANTIC_TRANSPARENCY",
        `${path}.semanticTransparency`,
        "non-null chunk candidate must include semanticTransparency.",
      );
    } else {
      validateSemanticTransparency(
        candidate.semanticTransparency,
        `${path}.semanticTransparency`,
        issues,
      );
    }
  });

  return {
    ok: issues.length === 0,
    issues,
  };
}
