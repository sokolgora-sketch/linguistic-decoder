import type { EvalReportBundleV0_1, EvalTaskReportV0_1 } from "@/shared/evals/report.v0.1";

export type GuidedPromptLevelV0_1 = "heavy" | "light" | "minimal" | "skip";

export type GuidedPromptV0_1 = {
  level: GuidedPromptLevelV0_1;
  issues: string[];
  baselinePrompt: string;
  correctionPrompt: string | null;
  mainTaskId: string | null;
  primaryMeans: number[];
  presenceMeans: number[];
  controlHealthStatus: string;
  t3PSpearman: number | null;
  t4PSpearman: number | null;
};

const BUCKETS = ["V1", "V2", "V3", "V4", "V5", "V6", "V7"] as const;
const ISSUE_EPSILON = 0.02;

export const EVALS_GUIDED_BASELINE_PROMPT_V0_1 = `Return STRICT JSON only. No prose.

Goal: produce a full ladder: 10 SINGLE-TOKEN words per bucket V1..V7.
Rules: each entry must be a single orthographic token (no spaces). Avoid punctuation.

STRICT CONSTRAINT: Each of the 70 tokens must be a unique, single-word entry. Do not repeat any word across different buckets.
Before outputting the final JSON, perform a self-audit to ensure zero duplicates.

Semantic intent:
- V1 = expansion / openness / wide space
- V2 = force / weight / mass / solidity
- V3 = interior / depth / enclosure
- V4 = balance / center / ground / stability
- V5 = motion / flow / direction / travel
- V6 = sharpness / thinness / tension / edge
- V7 = point / focus / precision / targeting

Output shape:
{
  "V1": ["..."],
  "V2": ["..."],
  "V3": ["..."],
  "V4": ["..."],
  "V5": ["..."],
  "V6": ["..."],
  "V7": ["..."]
}`;

function asFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function fmtMetric(value: number | null): string {
  if (value === null) return "n/a";
  return value.toFixed(3);
}

function findMainTask(report: EvalReportBundleV0_1): EvalTaskReportV0_1 | null {
  const tasks = Array.isArray(report.tasks) ? report.tasks : [];
  return (
    tasks.find((task) => task?.kind === "byo") ??
    tasks.find((task) => String(task?.taskId ?? "").includes("LADDER")) ??
    tasks[0] ??
    null
  );
}

function readMeans(
  task: EvalTaskReportV0_1 | null,
  key: "mean_aperturePrimary" | "mean_aperturePresenceMean",
): number[] {
  if (!task?.buckets?.length) return [];
  const byBucket = new Map(task.buckets.map((bucket) => [bucket.bucket, bucket]));
  return BUCKETS.map((bucketId) => {
    const bucket = byBucket.get(bucketId);
    return asFiniteNumber(bucket?.[key]) ?? Number.NaN;
  });
}

function readTaskPSpearman(
  report: EvalReportBundleV0_1,
  taskId: string,
): number | null {
  const task = report.controlHealth?.tasks?.find((item) => item.taskId === taskId);
  return asFiniteNumber(task?.p_spearman);
}

function isTightEndpoint(primaryMeans: number[], presenceMeans: number[]): boolean {
  if (primaryMeans.length !== 7 || presenceMeans.length !== 7) return false;
  const p6 = asFiniteNumber(primaryMeans[5]);
  const p7 = asFiniteNumber(primaryMeans[6]);
  const m6 = asFiniteNumber(presenceMeans[5]);
  const m7 = asFiniteNumber(presenceMeans[6]);
  if (p6 === null || p7 === null || m6 === null || m7 === null) return false;
  return p7 < p6 && m7 < m6;
}

function detectIssues(
  primaryMeans: number[],
  presenceMeans: number[],
  controlHealthStatus: string,
): string[] {
  const issues: string[] = [];

  const p = primaryMeans;
  const m = presenceMeans;

  if (p.length !== 7 || m.length !== 7) {
    return ["Bucket means are incomplete; cannot generate a guided correction safely."];
  }

  if (p[1] > p[0] + ISSUE_EPSILON) {
    issues.push("V2 is too open relative to V1");
  }

  if (p[2] > p[1] + ISSUE_EPSILON) {
    issues.push("V3 is too open relative to V2");
  }

  if (p[3] > p[2] + ISSUE_EPSILON || p[3] > p[4] + ISSUE_EPSILON) {
    issues.push("V4 is too open relative to V3 and V5");
  }

  if (p[4] > p[3] + ISSUE_EPSILON) {
    issues.push("V5 is too open relative to V4");
  }

  if (m[5] > m[4] + ISSUE_EPSILON) {
    issues.push("V6 is too open relative to V5 in presence-mean");
  }

  if (p[6] >= p[5] || m[6] >= m[5]) {
    issues.push("V7 should remain the tightest / least open endpoint");
  }

  if (controlHealthStatus === "controlWarn") {
    issues.push("Null controls are warning; keep the revision conservative");
  }

  if (controlHealthStatus === "controlFail") {
    issues.push("Null controls are failing; prioritize cleaning controls before pushing the ladder shape");
  }

  return issues;
}

function getShapeIssueCount(issues: string[]): number {
  return issues.filter(
    (issue) =>
      !issue.startsWith("Null controls") &&
      !issue.startsWith("Bucket means are incomplete"),
  ).length;
}

function detectLevel(
  task: EvalTaskReportV0_1 | null,
  primaryMeans: number[],
  presenceMeans: number[],
  controlHealthStatus: string,
  issues: string[],
): GuidedPromptLevelV0_1 {
  const slopePresence = task?.slope_aperturePresenceMean ?? null;
  const spearman =
    asFiniteNumber(slopePresence?.spearman_rho) ??
    asFiniteNumber(task?.slope_aperturePrimary?.spearman_rho);

  const shapeIssueCount = getShapeIssueCount(issues);
  const tightEndpoint = isTightEndpoint(primaryMeans, presenceMeans);

  if (controlHealthStatus === "controlFail") return "heavy";
  if (controlHealthStatus === "controlWarn") {
    return shapeIssueCount >= 2 ? "heavy" : "light";
  }

  if (spearman !== null && spearman <= -0.97 && tightEndpoint && shapeIssueCount === 0) {
    return "skip";
  }

  if (spearman !== null && spearman <= -0.90 && tightEndpoint && shapeIssueCount <= 1) {
    return "minimal";
  }

  if (spearman !== null && spearman <= -0.78 && shapeIssueCount <= 2) {
    return "light";
  }

  return "heavy";
}

function buildCorrectionRuleLine(
  level: GuidedPromptLevelV0_1,
  shapeIssueCount: number,
): string[] {
  switch (level) {
    case "heavy":
      return [
        "- improve monotonic descent from V1 toward V7",
        "- revise aggressively where the readout flags shape problems; stable buckets may stay unchanged",
        "- prioritize endpoint repair first, then middle-bucket cleanup",
      ];
    case "light":
      return [
        "- improve monotonic descent from V1 toward V7",
        "- revise only the flagged buckets and preserve stable buckets where possible",
        shapeIssueCount <= 2
          ? "- make targeted edits rather than a full rewrite"
          : "- keep the rewrite focused even if more than one bucket needs cleanup",
      ];
    case "minimal":
      return [
        "- improve monotonic descent from V1 toward V7",
        "- revise only the minimum set of flagged buckets",
        "- preserve already-stable buckets verbatim where possible",
      ];
    case "skip":
      return ["- this run is already converged; use the next fresh-chat baseline instead of revising"];
  }
}

function buildIssueDirectives(issues: string[]): string[] {
  const directives: string[] = [];

  if (issues.includes("V2 is too open relative to V1")) {
    directives.push("- tighten V2 so it stays below V1 and remains heavier than V3");
  }

  if (issues.includes("V3 is too open relative to V2")) {
    directives.push("- tighten V3 so it stays below V2 and above V4");
  }

  if (issues.includes("V4 is too open relative to V3 and V5")) {
    directives.push("- tighten V4 toward the center; it should not open above V3 or V5");
  }

  if (issues.includes("V5 is too open relative to V4")) {
    directives.push("- tighten V5 slightly so motion does not reopen the ladder after V4");
  }

  if (issues.includes("V6 is too open relative to V5 in presence-mean")) {
    directives.push("- tighten V6 in presence-mean so the edge/tension region does not reopen after V5");
  }

  if (issues.includes("V7 should remain the tightest / least open endpoint")) {
    directives.push("- tighten V7 first; it must be the least open endpoint and finish below V6 in both metrics");
  }

  if (issues.includes("Null controls are warning; keep the revision conservative")) {
    directives.push("- keep lexical changes conservative so the null controls do not drift toward significance");
  }

  if (issues.includes("Null controls are failing; prioritize cleaning controls before pushing the ladder shape")) {
    directives.push("- prioritize cleaning the null controls before any ambitious ladder rewrite");
  }

  return directives;
}

function renderMetricLine(label: string, values: number[]): string {
  const cells = BUCKETS.map((bucket, index) => `${bucket}=${fmtMetric(asFiniteNumber(values[index]))}`);
  return `- ${label}:\n  ${cells.join("  ")}`;
}

function buildCorrectionPrompt(params: {
  level: GuidedPromptLevelV0_1;
  issues: string[];
  primaryMeans: number[];
  presenceMeans: number[];
  controlHealthStatus: string;
  t3PSpearman: number | null;
  t4PSpearman: number | null;
}): string | null {
  if (params.level === "skip") return null;

  const shapeIssueCount = getShapeIssueCount(params.issues);
  const issueLines = params.issues.map((issue) => `- ${issue}`);
  const directiveLines = buildIssueDirectives(params.issues);
  const ruleLines = buildCorrectionRuleLine(params.level, shapeIssueCount);

  return `Return STRICT JSON only. No prose.

You are revising your previous ladder using a ZË-RO instrument readout.

Hard constraints:
- 10 SINGLE-TOKEN words per bucket V1..V7
- 70 total unique words across the full ladder
- preserve semantic coherence by bucket
- do not intentionally game letters or vowels
- use natural English words
- make only one revised ladder

Target semantic ladder:
- V1 = expansion / openness / wide space
- V2 = force / weight / mass / solidity
- V3 = interior / depth / enclosure
- V4 = balance / center / ground / stability
- V5 = motion / flow / direction / travel
- V6 = sharpness / thinness / tension / edge
- V7 = point / focus / precision / targeting

ZË-RO readout:
${renderMetricLine("aperturePrimary means", params.primaryMeans)}
${renderMetricLine("aperturePresenceMean means", params.presenceMeans)}
- controlHealth status: ${params.controlHealthStatus || "n/a"}
- T3 p_spearman: ${fmtMetric(params.t3PSpearman)}
- T4 p_spearman: ${fmtMetric(params.t4PSpearman)}

Revision rule:
${ruleLines.join("\n")}
- preserve already-stable buckets unless the readout explicitly flags them
- keep the null controls clean
- avoid artificial or repetitive token choices

Priority fixes:
${directiveLines.length > 0 ? directiveLines.join("\n") : "- no additional bucket-specific directives"}

Detected issues:
${issueLines.join("\n")}

Output shape:
{
  "V1": ["..."],
  "V2": ["..."],
  "V3": ["..."],
  "V4": ["..."],
  "V5": ["..."],
  "V6": ["..."],
  "V7": ["..."]
}`;
}

export function getGuidedPromptV0_1(
  report: EvalReportBundleV0_1 | null | undefined,
): GuidedPromptV0_1 | null {
  if (!report) return null;

  const mainTask = findMainTask(report);
  const primaryMeans = readMeans(mainTask, "mean_aperturePrimary");
  const presenceMeans = readMeans(mainTask, "mean_aperturePresenceMean");
  const controlHealthStatus = String(report.controlHealth?.status ?? "").trim() || "unknown";
  const t3PSpearman = readTaskPSpearman(report, "T3_NEGATIVE_CONTROL_SHUFFLE_V0_1");
  const t4PSpearman = readTaskPSpearman(report, "T4_NEGATIVE_CONTROL_SHUFFLE_ALT_V0_1");
  const issues = detectIssues(primaryMeans, presenceMeans, controlHealthStatus);
  const level = detectLevel(mainTask, primaryMeans, presenceMeans, controlHealthStatus, issues);

  return {
    level,
    issues,
    baselinePrompt: EVALS_GUIDED_BASELINE_PROMPT_V0_1,
    correctionPrompt: buildCorrectionPrompt({
      level,
      issues,
      primaryMeans,
      presenceMeans,
      controlHealthStatus,
      t3PSpearman,
      t4PSpearman,
    }),
    mainTaskId: mainTask?.taskId ?? null,
    primaryMeans,
    presenceMeans,
    controlHealthStatus,
    t3PSpearman,
    t4PSpearman,
  };
}
