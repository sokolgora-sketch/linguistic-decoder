import { execSync } from "node:child_process";
import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { createHash } from "node:crypto";
// EVALS-5 — Markdown renderer v0.1
// Used by baseline-lock runner. Deterministic formatting.

import type {
  EvalReportBundleV0_1,
  EvalTaskReportV0_1,
  BucketReportV0_1,
  SlopeReportV0_1,
  IntermediateTaskReportV0_1,
} from "./report.v0.1";

function fmt(x: number, d = 3): string {
  if (!Number.isFinite(x)) return "NaN";
  return x.toFixed(d);
}

function fmtP(x: number): string {
  if (!Number.isFinite(x)) return "p=NaN";
  return x < 0.001 ? "p < 0.001" : `p=${x.toFixed(3)}`;
}

function joinList(xs: string[]): string {
  return xs.length ? xs.join(", ") : "(none)";
}

function fmtMetaText(x: unknown): string {
  if (typeof x !== "string") return "not set";
  const v = x.trim();
  return v.length ? v : "not set";
}

function renderSlope(label: string, s: SlopeReportV0_1 | null): string[] {
  if (!s)
    return [
      `### Slope — ${label}`,
      "",
      "_not computed (needs >= 2 buckets)_",
      "",
    ];
  return [
    `### Slope — ${label}`,
    "",
    `- pearson r: ${fmt(s.pearson_r)} (parametric ${fmtP(s.p_pearson)})`,
    `- spearman ρ: ${fmt(s.spearman_rho)} (parametric ${fmtP(s.p_spearman)})`,
    `- permutation test: iters=${s.iters}, seed=${s.seed}`,
    "",
  ];
}

function renderIntermediate(
  s: IntermediateTaskReportV0_1 | null | undefined,
): string[] {
  if (!s)
    return [
      "### Intermediate Position — aperturePresenceMean",
      "",
      "_not computed_",
      "",
    ];

  return [
    "### Intermediate Position — aperturePresenceMean",
    "",
    `- vowelUnderTest: ${s.vowelUnderTest}`,
    `- anchorLow: ${s.anchorLow}`,
    `- anchorHigh: ${s.anchorHigh}`,
    `- mean(anchor_low): ${fmt(s.mean_anchor_low)}`,
    `- mean(x_vowel): ${fmt(s.mean_x_vowel)}`,
    `- mean(anchor_high): ${fmt(s.mean_anchor_high)}`,
    `- gap_low: ${fmt(s.gap_low)}`,
    `- gap_high: ${fmt(s.gap_high)}`,
    `- normalizedPosition: ${fmt(s.normalizedPosition)} (0=collapsed to low, 1=collapsed to high, 0.5=midpoint)`,
    `- verdict: ${s.verdict}`,
    `- permutation p: ${fmtP(s.ordinalPermutation.p_value)}`,
    `- permutation test: iters=${s.ordinalPermutation.iters}, seed=${s.ordinalPermutation.seed}, observedOrder=${s.ordinalPermutation.observed_order}`,
    "",
  ];
}

function renderBuckets(buckets: BucketReportV0_1[]): string[] {
  const lines: string[] = [];
  lines.push(
    "| Bucket | expectedN | providedN | validN | invalidN | dupN | mean(primary) | mean(presenceMean) |",
  );
  lines.push("|---|---:|---:|---:|---:|---:|---:|---:|");
  for (const b of buckets) {
    lines.push(
      `| ${b.bucket} | ${b.expectedN} | ${b.providedN} | ${b.validN} | ${b.invalidN} | ${b.duplicateN} | ${fmt(b.mean_aperturePrimary)} | ${fmt(b.mean_aperturePresenceMean)} |`,
    );
  }
  return lines;
}

function renderTask(t: EvalTaskReportV0_1): string[] {
  const lines: string[] = [];
  lines.push(`## ${t.taskId} — ${t.title}`);
  lines.push("");
  lines.push(`- kind: ${t.kind}`);
  lines.push(`- languageHint: ${t.languageHint}`);
  lines.push(`- targetBuckets: ${t.targetBuckets.join(", ")}`);
  lines.push(`- nPerBucket: ${t.nPerBucket}`);
  lines.push("");

  lines.push("### Buckets");
  lines.push("");
  lines.push(...renderBuckets(t.buckets));
  lines.push("");

  if (t.intermediate_aperturePresenceMean !== undefined) {
    lines.push(...renderIntermediate(t.intermediate_aperturePresenceMean));
  } else {
    lines.push(...renderSlope("aperturePrimary", t.slope_aperturePrimary));
    lines.push(
      ...renderSlope("aperturePresenceMean", t.slope_aperturePresenceMean),
    );
  }

  lines.push("### Diagnostics");
  lines.push("");
  lines.push(`- missingBuckets: ${joinList(t.diagnostics.missingBuckets)}`);
  lines.push(`- extraBuckets: ${joinList(t.diagnostics.extraBuckets)}`);
  lines.push(`- emptyTokenCount: ${t.diagnostics.emptyTokenCount}`);
  lines.push(`- whitespaceTokenCount: ${t.diagnostics.whitespaceTokenCount}`);
  lines.push(`- noVowelTokenCount: ${t.diagnostics.noVowelTokenCount}`);
  lines.push(
    `- totalInvalidTokenCount: ${t.diagnostics.totalInvalidTokenCount}`,
  );
  if (t.diagnostics.notes.length) {
    lines.push(
      `- notes: ${t.diagnostics.notes.map((x) => String(x)).join(" | ")}`,
    );
  } else {
    lines.push(`- notes: (none)`);
  }
  lines.push("");

  return lines;
}

function ensureSingleTrailingNewline(s: string): string {
  // Linear-time trim of trailing CR/LF, then force exactly one \n.
  let end = s.length;
  while (end > 0) {
    const c = s.charCodeAt(end - 1);
    if (c === 10 /* \n */ || c === 13 /* \r */) end--;
    else break;
  }
  return s.slice(0, end) + "\n";
}

function taskVersionFromTaskIdV0_1(taskId: string): string {
  const m = /_(V\d+_\d+)$/.exec(String(taskId ?? ""));
  return m ? m[1].toLowerCase().replace("_", ".") : "—";
}

function promptHashFromTaskIdV0_1(taskId: string): string {
  const prompt =
    EVAL_SPEC_V0_1.tasks.find((t) => t.taskId === taskId)?.prompt ?? "";
  return String(prompt).trim()
    ? createHash("sha256").update(prompt).digest("hex")
    : "not available";
}

type RenderEvalReportMdOptionsV0_1 = {
  exportedAtUtc?: string;
};

export function renderEvalReportMdV0_1(
  report: EvalReportBundleV0_1,
  opts: RenderEvalReportMdOptionsV0_1 = {},
): string {
  const lines: string[] = [];
  lines.push(`# ZË-RO Evals Report v0.1`);
  lines.push("");
  lines.push(`- evalSpecVersion: ${report.evalSpecVersion}`);

  const devicePlateTask =
    report.tasks.find((t) => t.kind === "byo") ?? report.tasks[0];

  const devicePlateTaskId =
    typeof (devicePlateTask as any)?.taskId === "string"
      ? String((devicePlateTask as any).taskId)
      : "—";

  const devicePlateSlopePrimary =
    (devicePlateTask as any)?.slope_aperturePrimary ?? null;

  const devicePlateSlopePresence =
    (devicePlateTask as any)?.slope_aperturePresenceMean ?? null;

  const devicePlateSeedPrimary =
    typeof devicePlateSlopePrimary?.seed === "number"
      ? String(devicePlateSlopePrimary.seed)
      : "—";

  const devicePlateSeedPresence =
    typeof devicePlateSlopePresence?.seed === "number"
      ? String(devicePlateSlopePresence.seed)
      : "—";

  const devicePlatePermItersPrimary =
    typeof devicePlateSlopePrimary?.iters === "number"
      ? String(devicePlateSlopePrimary.iters)
      : "—";

  const devicePlatePermItersPresence =
    typeof devicePlateSlopePresence?.iters === "number"
      ? String(devicePlateSlopePresence.iters)
      : "—";

  function resolveScorerBuildV0_1() {
    const short = (value: unknown) => {
      const s = String(value ?? "").trim();
      return s ? s.slice(0, 7) : "";
    };

    const isTest =
      process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);

    if (isTest) return "unknown";

    try {
      return (
        short(
          execSync("git rev-parse --short HEAD", {
            stdio: ["ignore", "pipe", "ignore"],
          }).toString("utf8"),
        ) || "unknown"
      );
    } catch {}

    return (
      short(process.env.VERCEL_GIT_COMMIT_SHA) ||
      short(process.env.GIT_SHA) ||
      short(process.env.NEXT_PUBLIC_GIT_SHA) ||
      short(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA) ||
      "unknown"
    );
  }

  const scorerBuild = resolveScorerBuildV0_1();

  lines.push(`- engineVersion: scoreEvalRun.v0.1`);
  const exportedAtUtc = String(opts.exportedAtUtc ?? "—");

  lines.push(`- taskId: ${devicePlateTaskId}`);
  lines.push(`- taskVersion: ${taskVersionFromTaskIdV0_1(devicePlateTaskId)}`);
  lines.push(`- promptHash: ${promptHashFromTaskIdV0_1(devicePlateTaskId)}`);
  lines.push(`- exportedAtUtc: ${exportedAtUtc}`);
  lines.push(`- seedPrimary: ${devicePlateSeedPrimary}`);
  lines.push(`- seedPresenceMean: ${devicePlateSeedPresence}`);
  lines.push(`- permItersPrimary: ${devicePlatePermItersPrimary}`);
  lines.push(`- permItersPresenceMean: ${devicePlatePermItersPresence}`);
  lines.push(`- scorerBuild: ${scorerBuild}`);
  lines.push(`- baselineRef: paper.v0.1 · LingBuzz/009799 · LingBuzz/009808`);
  lines.push(`- specId: ${report.specId}`);
  lines.push(`- runId: ${report.runId}`);
  if (report.meta) {
    lines.push(`- provider: ${fmtMetaText(report.meta.provider)}`);
    lines.push(`- model: ${fmtMetaText(report.meta.model)}`);
    lines.push(`- label: ${fmtMetaText(report.meta.label)}`);
    lines.push(`- sourceEngineId: ${fmtMetaText(report.meta.sourceEngineId)}`);
    lines.push(
      `- sourceEngineVersion: ${fmtMetaText(report.meta.sourceEngineVersion)}`,
    );
    lines.push(
      `- sourceEngineBuild: ${fmtMetaText(report.meta.sourceEngineBuild)}`,
    );
  }
  lines.push("");
  lines.push(
    "Aperture proxy (fixed): A=1.0, O=0.8, E=0.6, Ë=0.5, U=0.4, Y=0.3, I=0.1.",
  );
  lines.push("");

  for (const t of report.tasks) {
    lines.push(...renderTask(t));
  }

  const out = lines.join("\n");
  return ensureSingleTrailingNewline(out);
}
