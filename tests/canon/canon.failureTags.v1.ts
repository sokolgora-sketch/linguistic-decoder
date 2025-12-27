export type FailureTag = "OK" | "EMPTY" | "WARN" | "AMBIGUOUS";

export interface FailureTaxonomyConfig {
  ambiguousThreshold?: number; // default 6
}

export interface FailureClassification {
  tags: FailureTag[];
  reasons: string[];
  counts: {
    candidates: number;
    warnings: number;
    errors: number;
  };
}

/**
 * Canon Failure Taxonomy (v1)
 * This classifies engine output WITHOUT judging correctness.
 * It only answers: "is there output?" "is it noisy?" "is it warning/error flagged?"
 */
export function classifyAnalysisResult(
  payload: unknown,
  config: FailureTaxonomyConfig = {},
): FailureClassification {
  const ambiguousThreshold = config.ambiguousThreshold ?? 6;

  const candidatesCount = getCandidatesCount(payload);
  const warningsCount = getWarningsCount(payload);
  const errorsCount = getErrorsCount(payload);

  const tags: FailureTag[] = [];
  const reasons: string[] = [];

  if (candidatesCount === 0) {
    tags.push("EMPTY");
    reasons.push("No candidates returned (candidatesCount=0).");
  } else {
    tags.push("OK");
    reasons.push(`Candidates present (candidatesCount=${candidatesCount}).`);
  }

  if (candidatesCount >= ambiguousThreshold) {
    tags.push("AMBIGUOUS");
    reasons.push(
      `Candidate count meets/exceeds ambiguous threshold (${candidatesCount} >= ${ambiguousThreshold}).`,
    );
  }

  if (warningsCount > 0) {
    tags.push("WARN");
    reasons.push(`Warnings present (warningsCount=${warningsCount}).`);
  }

  if (errorsCount > 0) {
    // We do not add a separate ERROR tag (yet). We record errors as WARN + reason.
    // This keeps the v1 tag set minimal and avoids overfitting to transient error formats.
    if (!tags.includes("WARN")) tags.push("WARN");
    reasons.push(`Errors present (errorsCount=${errorsCount}).`);
  }

  return {
    tags: uniq(tags),
    reasons,
    counts: {
      candidates: candidatesCount,
      warnings: warningsCount,
      errors: errorsCount,
    },
  };
}

/**
 * Attempts to count candidates across a few known shapes.
 * We prefer "candidates" at top-level. Fallbacks are defensive.
 */
function getCandidatesCount(payload: unknown): number {
  const obj = asObj(payload);

  // Most likely shape
  const direct = obj?.candidates;
  if (Array.isArray(direct)) return direct.length;

  // Defensive fallbacks
  const deepRoot = asObj(obj?.deepRoot);
  if (Array.isArray(deepRoot?.candidates)) return deepRoot.candidates.length;

  const analysis = asObj(obj?.analysis);
  if (Array.isArray(analysis?.candidates)) return analysis.candidates.length;

  return 0;
}

/**
 * Warnings: supports common locations without assuming a single schema.
 */
function getWarningsCount(payload: unknown): number {
  const obj = asObj(payload);

  // Common: top-level warnings
  if (Array.isArray(obj?.warnings)) return obj.warnings.length;

  // Sometimes nested under engine_meta
  const meta = asObj(obj?.engine_meta);
  if (Array.isArray(meta?.warnings)) return meta.warnings.length;

  // Sometimes nested in a "notes" array, but we don't treat that as warnings.
  return 0;
}

/**
 * Errors: supports common locations without assuming a single schema.
 */
function getErrorsCount(payload: unknown): number {
  const obj = asObj(payload);

  if (Array.isArray(obj?.errors)) return obj.errors.length;

  const meta = asObj(obj?.engine_meta);
  if (Array.isArray(meta?.errors)) return meta.errors.length;

  const err = obj?.error;
  if (typeof err === "string" && err.trim().length > 0) return 1;

  return 0;
}

function asObj(x: unknown): Record<string, any> | null {
  if (!x || typeof x !== "object") return null;
  return x as Record<string, any>;
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
