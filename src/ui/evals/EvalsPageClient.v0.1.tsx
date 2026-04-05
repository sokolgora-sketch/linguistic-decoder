"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MT } from "@/ui/typography/marketingType.v0.1";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { COLORS_HEX_BY_VOICE_V0_1 } from "@/shared/doctrine/voiceDoctrine.v0.1";
import { getSpearmanDiagnosisMeta } from "@/shared/evals/getSpearmanDiagnosis.v0.1";
import type {
  EvalReportBundleV0_1,
  EvalTaskReportV0_1,
} from "@/shared/evals/report.v0.1";
import {
  applySeriesRunIdTemplate,
  formatSeriesOrdinal,
  makeDefaultRunSeries,
  makeSavedRunId,
  readRunSeries,
  readSavedRuns,
  writeRunSeries,
  writeSavedRuns,
} from "@/ui/evals/evalsRunStore.v0.1";
import type {
  EvalsRunSeriesV0_1,
  EvalsSavedRunRecordV0_1,
  EvalsWorkbenchStateV0_1,
} from "@/ui/evals/evalsRunStore.v0.1";
import { getSeriesExportVerdictV0_1 } from "@/ui/evals/evalsSeriesExportVerdict.v0.1";
import {
  formatBatterySummaryRunIdV0_1,
  summarizeEvalsBatterySeriesV0_1,
} from "@/ui/evals/evalsBatterySummary.v0.1";
import { normalizeEvalsMetaTextV0_1 } from "@/ui/evals/evalsRunMetadata.v0.1";
import {
  EVALS_GUIDED_BASELINE_PROMPT_V0_1,
  getGuidedPromptV0_1,
} from "@/ui/evals/evalsGuidedPrompt.v0.1";
import { buildSavedRunSeriesGroupsV0_1 } from "@/ui/evals/evalsSavedRunGroups.v0.1";


type ApiOk = { ok: true; report: EvalReportBundleV0_1; md: string };
type ApiErr = { ok: false; code: string; message: string };

const EVALS_BETA_INTRO_TITLE = "Public beta — bring model outputs, not prompts";
const EVALS_BETA_INTRO_BODY =
  "Use this page to score model-generated ladder or evalRun JSON against ZË-RO's deterministic eval instrument.";
const EVALS_BETA_INTRO_HELP_1 =
  "Paste either a full evalRun.v0.1 bundle or raw V1..V7 bucket JSON.";
const EVALS_BETA_INTRO_HELP_2 =
  "Do not paste private data, secrets, or anything you would not want copied into exports.";
const EVALS_BETA_INTRO_HELP_3 =
  "ZË-RO does not call models from this page. You generate outputs elsewhere, then score them here.";

type InputProbe =
  | { kind: "empty" }
  | { kind: "invalid_json"; error: string }
  | { kind: "bucket_only"; parsed: Record<string, string[]> }
  | { kind: "corpus70_meta"; parsed: any }
  | { kind: "other_json"; parsed: unknown };

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function looksLikeBucketsOnly(x: unknown): x is Record<string, string[]> {
  if (!isPlainObject(x)) return false;
  const keys = Object.keys(x).sort();
  const want = ["V1", "V2", "V3", "V4", "V5", "V6", "V7"];
  if (keys.length !== want.length) return false;
  for (let i = 0; i < want.length; i++) if (keys[i] !== want[i]) return false;

  for (const k of want) {
    const v = (x as any)[k];
    if (!Array.isArray(v)) return false;
    for (const it of v) if (typeof it !== "string") return false;
  }
  return true;
}

function looksLikeCorpus70Meta(x: unknown): boolean {
  if (!isPlainObject(x)) return false;
  if (typeof (x as any).version !== "string") return false;
  if (!Array.isArray((x as any).allowedTags)) return false;
  if (!isPlainObject((x as any).tags)) return false;
  return true;
}

function probeInput(text: string): InputProbe {
  const raw = text.trim();
  if (!raw) return { kind: "empty" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return {
      kind: "invalid_json",
      error: e instanceof Error ? e.message : String(e),
    };
  }
  if (looksLikeBucketsOnly(parsed)) return { kind: "bucket_only", parsed };
  if (looksLikeCorpus70Meta(parsed))
    return { kind: "corpus70_meta", parsed: parsed as any };
  return { kind: "other_json", parsed };
}

function fmt(x: number, d = 3) {
  if (!Number.isFinite(x)) return "NaN";
  return x.toFixed(d);
}

function fmtP(x: number) {
  if (!Number.isFinite(x)) return "NaN";
  return x < 0.001 ? "< 0.001" : x.toFixed(3);
}

function fmtPLabel(x: number) {
  if (!Number.isFinite(x)) return "p=NaN";
  return x < 0.001 ? "p < 0.001" : `p=${x.toFixed(3)}`;
}

function joinList(xs: string[]) {
  return xs.length ? xs.join(", ") : "(none)";
}


function TaskCard({ t }: { t: EvalTaskReportV0_1 }) {
  const isDerived = t.kind !== "byo";
  const cardToneClass = isDerived
    ? "border-[#4a3b25] bg-[#171411]"
    : "border-[#274436] bg-[#131914]";
  const hierarchyToneClass = isDerived ? "text-[#f3d38b]" : "text-[#86efac]";
  const hierarchyLabel = isDerived ? "Validation control" : "Primary scored task";
  const hierarchyNote = isDerived
    ? "Derived control used to sanity-check bucket behavior and scorer stability."
    : "Direct score report for the user-supplied task.";

  return (
    <section className={`rounded-[12px] border px-6 py-6 space-y-6 ${cardToneClass}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#b8b8b8]">
            {t.taskId}
          </div>
          <h2 className="text-[20px] font-semibold leading-tight text-white">
            {t.title}
          </h2>
            <div className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${hierarchyToneClass}`}>
              {hierarchyLabel}
            </div>
            <div className="text-[12px] leading-6 text-[#9f9f9f]">
              {hierarchyNote}
            </div>
          </div>

        <div className="flex flex-wrap gap-3 text-[12px]">
          <span className="rounded-full border border-[#3a3a3a] bg-[#101010] px-3.5 py-2 text-[#d8d8d8]">
            taskType <span className="font-mono text-white">{t.kind}</span>
          </span>
          <span className="rounded-full border border-[#3a3a3a] bg-[#101010] px-3.5 py-2 text-[#d8d8d8]">
            language <span className="font-mono text-white">{t.languageHint}</span>
          </span>
          <span className="rounded-full border border-[#3a3a3a] bg-[#101010] px-3.5 py-2 text-[#d8d8d8]">
            targetBuckets{" "}
            <span className="font-mono text-white">
              {t.targetBuckets.join(", ")}
            </span>
          </span>
          <span className="rounded-full border border-[#3a3a3a] bg-[#101010] px-3.5 py-2 text-[#d8d8d8]">
            nPerBucket{" "}
            <span className="font-mono text-white">{t.nPerBucket}</span>
          </span>
        </div>
      </div>
        <div className="space-y-1">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">
            Bucket ledger
          </div>
          <div className="text-[12px] leading-6 text-[#8f8f8f]">
            Expected versus provided tokens, validity counts, and mean aperture values.
          </div>
        </div>

      <div className="overflow-x-auto rounded-[8px] border border-[#303030] bg-[#101010]">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-[#303030] bg-[#121212]">
              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                Bucket
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                Expected
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                Provided
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                Valid
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                Invalid
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                Dup
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                Mean primary
              </th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">
                Mean presence
              </th>
            </tr>
          </thead>
          <tbody>
            {t.buckets.map((b) => {
              const validToneClass =
                Number(b.validN ?? 0) === Number(b.expectedN ?? 0)
                  ? "text-[#4ade80]"
                  : "text-[#fbbf24]";
              const invalidToneClass =
                Number(b.invalidN ?? 0) === 0
                  ? "text-[#555]"
                  : "text-[#f87171]";
              const dupToneClass =
                Number(b.duplicateN ?? 0) === 0
                  ? "text-[#555]"
                  : "text-[#f59e0b]";
              const isNegativeControl = /^T3\b/i.test(t.taskId);
              const meanPrimaryToneClass = isNegativeControl
                ? "text-[#a3a3a3]"
                : Number(b.mean_aperturePrimary ?? 0) >= 0.7
                  ? "text-[#4ade80]"
                  : Number(b.mean_aperturePrimary ?? 0) >= 0.4
                    ? "text-[#fbbf24]"
                    : "text-[#f87171]";
              const meanPresenceToneClass = isNegativeControl
                ? "text-[#a3a3a3]"
                : "text-[#f2f2f2]";

              return (
                <tr
                  key={b.bucket}
                  className="border-t border-[#262626] hover:bg-[#141414]"
                >
                  <td className="px-3 py-2.5 font-mono text-white">
                    {b.bucket}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[#f2f2f2]">
                    {b.expectedN}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[#f2f2f2]">
                    {b.providedN}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono ${validToneClass}`}
                  >
                    {b.validN}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono ${invalidToneClass}`}
                  >
                    {b.invalidN}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono ${dupToneClass}`}
                  >
                    {b.duplicateN}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono ${meanPrimaryToneClass}`}
                  >
                    {fmt(b.mean_aperturePrimary)}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-mono ${meanPresenceToneClass}`}
                  >
                    {fmt(b.mean_aperturePresenceMean)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        <div className="space-y-1">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">
            Slope diagnostics
          </div>
          <div className="text-[12px] leading-6 text-[#8f8f8f]">
            Correlation strength and permutation details for both aperture views.
          </div>
        </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[10px] border border-[#303030] bg-[#101010] px-5 py-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">
            Slope — aperturePrimary
          </div>
          {t.slope_aperturePrimary ? (
            <div className="mt-4 space-y-3 text-[12px] leading-7 text-[#cfcfcf]">
              <div>
                pearson r{" "}
                <span className="font-mono text-white">
                  {fmt(t.slope_aperturePrimary.pearson_r)}
                </span>{" "}
                <span className="text-[#8a8a8a]">
                  (parametric {fmtPLabel(t.slope_aperturePrimary.p_pearson)})
                </span>
              </div>
              <div>
                spearman ρ{" "}
                <span className="font-mono text-white">
                  {fmt(t.slope_aperturePrimary.spearman_rho)}
                </span>{" "}
                <span className="text-[#8a8a8a]">
                  (parametric {fmtPLabel(t.slope_aperturePrimary.p_spearman)})
                </span>
              </div>
              <div className="text-[#a8a8a8]">
                permutation test{" "}
                <span className="font-mono text-white">
                  iters={t.slope_aperturePrimary.iters}
                </span>{" "}
                <span className="text-[#666]">·</span>{" "}
                <span className="font-mono text-white">
                  seed={t.slope_aperturePrimary.seed}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-[12px] text-[#8a8a8a]">not computed</div>
          )}
        </div>

        <div className="rounded-[10px] border border-[#303030] bg-[#101010] px-5 py-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">
            Slope — aperturePresenceMean
          </div>
          {t.slope_aperturePresenceMean ? (
            <div className="mt-4 space-y-3 text-[12px] leading-7 text-[#cfcfcf]">
              <div>
                pearson r{" "}
                <span className="font-mono text-white">
                  {fmt(t.slope_aperturePresenceMean.pearson_r)}
                </span>{" "}
                <span className="text-[#8a8a8a]">
                  (parametric{" "}
                  {fmtPLabel(t.slope_aperturePresenceMean.p_pearson)})
                </span>
              </div>
              <div>
                spearman ρ{" "}
                <span className="font-mono text-white">
                  {fmt(t.slope_aperturePresenceMean.spearman_rho)}
                </span>{" "}
                <span className="text-[#8a8a8a]">
                  (parametric{" "}
                  {fmtPLabel(t.slope_aperturePresenceMean.p_spearman)})
                </span>
              </div>
              <div className="text-[#a8a8a8]">
                permutation test{" "}
                <span className="font-mono text-white">
                  iters={t.slope_aperturePresenceMean.iters}
                </span>{" "}
                <span className="text-[#666]">·</span>{" "}
                <span className="font-mono text-white">
                  seed={t.slope_aperturePresenceMean.seed}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-[12px] text-[#8a8a8a]">not computed</div>
          )}
        </div>
      </div>

      <details className="overflow-hidden rounded-[10px] border border-[#2f2f2f] bg-[#101010]">
        <summary className="cursor-pointer px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">
          Diagnostics
        </summary>
        <div className="border-t border-[#262626] bg-[#0c0c0c] px-5 py-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[8px] border border-[#242424] bg-[#111111] px-4 py-4">
              <div className={`${MT.sectionLabel} text-[#b3b3b3]`}>
                Missing buckets
              </div>
              <div className="mt-2 font-mono text-[14px] leading-7 text-[#f2f2f2]">
                {joinList(t.diagnostics.missingBuckets)}
              </div>
            </div>
            <div className="rounded-[8px] border border-[#242424] bg-[#111111] px-4 py-4">
              <div className={`${MT.sectionLabel} text-[#b3b3b3]`}>
                Extra buckets
              </div>
              <div className="mt-2 font-mono text-[14px] leading-7 text-[#f2f2f2]">
                {joinList(t.diagnostics.extraBuckets)}
              </div>
            </div>
            <div className="rounded-[8px] border border-[#242424] bg-[#111111] px-4 py-4">
              <div className={`${MT.sectionLabel} text-[#b3b3b3]`}>
                Empty tokens
              </div>
              <div className="mt-2 font-mono text-[14px] text-[#f2f2f2]">
                {t.diagnostics.emptyTokenCount}
              </div>
            </div>
            <div className="rounded-[8px] border border-[#242424] bg-[#111111] px-4 py-4">
              <div className={`${MT.sectionLabel} text-[#b3b3b3]`}>
                Whitespace tokens
              </div>
              <div className="mt-2 font-mono text-[14px] text-[#f2f2f2]">
                {t.diagnostics.whitespaceTokenCount}
              </div>
            </div>
            <div className="rounded-[8px] border border-[#242424] bg-[#111111] px-4 py-4">
              <div className={`${MT.sectionLabel} text-[#b3b3b3]`}>
                No-vowel tokens
              </div>
              <div className="mt-2 font-mono text-[14px] text-[#f2f2f2]">
                {t.diagnostics.noVowelTokenCount}
              </div>
            </div>
            <div className="rounded-[8px] border border-[#242424] bg-[#111111] px-4 py-4">
              <div className={`${MT.sectionLabel} text-[#b3b3b3]`}>
                Total invalid
              </div>
              <div className="mt-2 font-mono text-[14px] text-[#f2f2f2]">
                {t.diagnostics.totalInvalidTokenCount}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-[#242424] bg-[#111111] px-4 py-4">
            <div className={`${MT.sectionLabel} text-[#b3b3b3]`}>Notes</div>
            <div className="mt-2 font-mono text-[14px] leading-7 text-[#f2f2f2]">
              {t.diagnostics.notes.length
                ? t.diagnostics.notes.join(" | ")
                : "(none)"}
            </div>
          </div>
        </div>
      </details>
    </section>
  );
}

function StickyNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-[#333333] bg-[#1a1a1a]">
      <div className="mx-auto flex h-12 w-full max-w-[1200px] items-center justify-between px-10">
        <Link
          href="/"
          aria-label="ZË-RO home"
          className="inline-flex items-center"
        >
          <Image
            src="/zero_logo_hero_white.svg"
            alt="ZË-RO"
            width={140}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.14em] text-neutral-300 transition hover:text-white"
        >
          ← home
        </Link>
      </div>
    </div>
  );
}


async function sha256HexV0_1(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function taskVersionFromTaskIdV0_1(taskId: string | null | undefined): string {
  const m = /_(V\d+_\d+)$/.exec(String(taskId ?? ""));
  return m ? m[1].toLowerCase().replace("_", ".") : "—";
}
function extractMdFrontMatterValueV0_1(md: string, key: string): string {
  const prefix = "- " + String(key ?? "") + ": ";
  const line = String(md ?? "")
    .split(/\r?\n/g)
    .find((x) => x.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : "—";
}

export function EvalsPageClientV0_1() {
  const byoTasks = useMemo(
    () => EVAL_SPEC_V0_1.tasks.filter((t) => t.kind === "byo"),
    [],
  );

  const [mode, setMode] = useState<"run_bundle" | "task_buckets">("run_bundle");
  const [taskId, setTaskId] = useState<string>("T2_LADDER_V0_1");

  const [runId, setRunId] = useState<string>("ui.run.v0.1");
  const [provider, setProvider] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [sourceEngineId, setSourceEngineId] = useState<string>("");
  const [sourceEngineVersion, setSourceEngineVersion] = useState<string>("");
  const [sourceEngineBuild, setSourceEngineBuild] = useState<string>("");

  const [inputText, setInputText] = useState<string>("");
  const [pickedFileName, setPickedFileName] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const [apiErr, setApiErr] = useState<ApiErr | null>(null);
  const [report, setReport] = useState<EvalReportBundleV0_1 | null>(null);
  const [md, setMd] = useState<string>("");

  const [notice, setNotice] = useState<string | null>(null);
  const TOAST_TIMEOUT_MS = 7000;

  const showWarnNotice = React.useCallback((message: string) => {
    setNotice(message);
  }, []);

  const noticeIsWarn = useMemo(() => {
    if (!notice) return false;
    return /^(Save \+ Next Run:|Delete Active Series:|Delete Saved Run:|Open Saved Run:|Duplicate cleanup:|Clipboard unavailable|Copy failed:|Copy Raw JSON:|Copy CSV Row:|Export Active Series CSV:|Export All Series CSV:|Export Active Series JSON:)/.test(
      notice,
    );
  }, [notice]);
  const [savedRuns, setSavedRuns] = useState<EvalsSavedRunRecordV0_1[]>([]);
  const [selectedSavedRunId, setSelectedSavedRunId] = useState<string>("");
  const [openSavedRunGroupIds, setOpenSavedRunGroupIds] = useState<string[]>([]);
  const [runSeries, setRunSeries] = useState<EvalsRunSeriesV0_1[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");
  const [seriesLabelDraft, setSeriesLabelDraft] = useState<string>("fresh-chat");
  const [saveNextGuidedReminderArmed, setSaveNextGuidedReminderArmed] = useState<boolean>(false);
  const [seriesTargetCountDraft, setSeriesTargetCountDraft] = useState<string>("15");

  useEffect(() => {
    const rows = readSavedRuns();
    setSavedRuns(rows);
    setSelectedSavedRunId(rows[0]?.id ?? "");

    const seriesRows = readRunSeries();
    setRunSeries(seriesRows);
    setSelectedSeriesId(seriesRows[0]?.id ?? "");
  }, []);

  useEffect(() => {
    if (!savedRuns.length) {
      setSelectedSavedRunId("");
      return;
    }
    setSelectedSavedRunId((prev) =>
      prev && savedRuns.some((row) => row.id === prev) ? prev : savedRuns[0].id,
    );
  }, [savedRuns]);


  const savedRunSeriesGroups = useMemo(
    () => buildSavedRunSeriesGroupsV0_1(savedRuns, runSeries),
    [savedRuns, runSeries],
  );

  useEffect(() => {
    setOpenSavedRunGroupIds((prev) =>
      prev.filter((id) => savedRunSeriesGroups.some((group) => group.id === id)),
    );
  }, [savedRunSeriesGroups]);

  const activeRunSeries = useMemo(
    () => runSeries.find((row) => row.id === selectedSeriesId) ?? null,
    [runSeries, selectedSeriesId],
  );

  const activeSeriesSavedRuns = useMemo(
    () =>
      activeRunSeries
        ? savedRuns.filter((row) => row.seriesId === activeRunSeries.id)
        : [],
    [savedRuns, activeRunSeries],
  );

  const activeSeriesSavedCount = activeSeriesSavedRuns.length;
  const activeSeriesRemainingCount = activeRunSeries
    ? Math.max(activeRunSeries.targetCount - activeSeriesSavedCount, 0)
    : 0;
  const activeSeriesNextOrdinal = activeRunSeries
    ? formatSeriesOrdinal(activeRunSeries.nextOrdinal)
    : null;
  const activeSeriesRunIdPreview = activeRunSeries
    ? runId || applySeriesRunIdTemplate(activeRunSeries.runIdTemplate, activeRunSeries.nextOrdinal)
    : runId;
  const activeSeriesLabelPreview = activeRunSeries
    ? label || makeSeriesLabel(activeRunSeries.label, activeRunSeries.nextOrdinal)
    : label;

  const activeSeriesScoredRuns = useMemo(
    () => activeSeriesSavedRuns.filter((row) => Boolean(row.workbench.report)),
    [activeSeriesSavedRuns],
  );

  const activeSeriesScoredCount = activeSeriesScoredRuns.length;
  const activeSeriesUnscoredCount = Math.max(
    activeSeriesSavedCount - activeSeriesScoredCount,
    0,
  );

  const activeSeriesMissingOrdinals = useMemo(() => {
    if (!activeRunSeries) return [];
    const present = new Set(
      activeSeriesSavedRuns
        .map((row) => row.ordinal)
        .filter((n): n is number => typeof n === "number" && Number.isFinite(n)),
    );
    return Array.from({ length: activeRunSeries.targetCount }, (_, i) => i + 1).filter(
      (n) => !present.has(n),
    );
  }, [activeRunSeries, activeSeriesSavedRuns]);

  const activeSeriesDuplicateOrdinals = useMemo(() => {
    const counts = new Map<number, number>();
    for (const row of activeSeriesSavedRuns) {
      if (typeof row.ordinal !== "number" || !Number.isFinite(row.ordinal)) continue;
      counts.set(row.ordinal, (counts.get(row.ordinal) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([ordinal]) => ordinal)
      .sort((a, b) => a - b);
  }, [activeSeriesSavedRuns]);

  const activeSeriesDuplicateRunIds = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of activeSeriesSavedRuns) {
      const rid = String(
        row.workbench.report?.runId ?? row.workbench.runId ?? "",
      ).trim();
      if (!rid) continue;
      counts.set(rid, (counts.get(rid) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([rid]) => rid)
      .sort();
  }, [activeSeriesSavedRuns]);

  const activeSeriesExportReady =
    activeSeriesScoredCount > 0 &&
    activeSeriesDuplicateOrdinals.length === 0 &&
    activeSeriesDuplicateRunIds.length === 0;

  const activeSeriesHasHardWarnings =
    activeSeriesDuplicateOrdinals.length > 0 ||
    activeSeriesDuplicateRunIds.length > 0;

  const activeSeriesNeedsAttention =
    activeSeriesHasHardWarnings ||
    activeSeriesScoredCount === 0 ||
    activeSeriesUnscoredCount > 0 ||
    activeSeriesMissingOrdinals.length > 0;

  const activeSeriesExportMode =
    activeSeriesExportReady
      ? "ready"
      : activeSeriesHasHardWarnings
        ? "blocked"
        : "warn";

  const formatOrdinalList = (items: number[]) => {
    if (!items.length) return "none";
    const shown = items.slice(0, 8).map((n) => formatSeriesOrdinal(n));
    return items.length > 8 ? `${shown.join(", ")} +${items.length - 8} more` : shown.join(", ");
  };

  const formatRunIdList = (items: string[]) => {
    if (!items.length) return "none";
    const shown = items.slice(0, 4);
    return items.length > 4 ? `${shown.join(", ")} +${items.length - 4} more` : shown.join(", ");
  };

  const activeSeriesHealthReasons = useMemo(() => {
    const reasons: string[] = [];
    if (activeSeriesDuplicateOrdinals.length > 0) {
      reasons.push(`Duplicate ordinals: ${formatOrdinalList(activeSeriesDuplicateOrdinals)}`);
    }
    if (activeSeriesDuplicateRunIds.length > 0) {
      reasons.push(`Duplicate runIds: ${formatRunIdList(activeSeriesDuplicateRunIds)}`);
    }
    if (activeSeriesMissingOrdinals.length > 0) {
      reasons.push(`Missing ordinals: ${formatOrdinalList(activeSeriesMissingOrdinals)}`);
    }
    if (activeSeriesUnscoredCount > 0) {
      reasons.push(`Unscored runs: ${activeSeriesUnscoredCount}`);
    }
    if (activeSeriesScoredCount === 0) {
      reasons.push("No scored runs yet");
    }
    return reasons;
  }, [
    activeSeriesDuplicateOrdinals,
    activeSeriesDuplicateRunIds,
    activeSeriesMissingOrdinals,
    activeSeriesScoredCount,
    activeSeriesUnscoredCount,
  ]);

  const activeSeriesDuplicateCleanupPlan = useMemo(() => {
    if (!activeRunSeries) {
      return { removeIds: [] as string[], removeCount: 0 };
    }

    const sorted = [...activeSeriesSavedRuns].sort((a, b) => {
      if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
      if (a.updatedAt !== b.updatedAt) return a.updatedAt - b.updatedAt;
      return a.id.localeCompare(b.id);
    });

    const keepOrdinal = new Map<number, string>();
    const keepRunId = new Map<string, string>();
    const removeIds = new Set<string>();

    for (const row of sorted) {
      if (typeof row.ordinal === "number" && Number.isFinite(row.ordinal)) {
        const keeper = keepOrdinal.get(row.ordinal);
        if (!keeper) keepOrdinal.set(row.ordinal, row.id);
        else if (keeper !== row.id) removeIds.add(row.id);
      }

      const rid = String(row.workbench.report?.runId ?? row.workbench.runId ?? "").trim();
      if (rid) {
        const keeper = keepRunId.get(rid);
        if (!keeper) keepRunId.set(rid, row.id);
        else if (keeper !== row.id) removeIds.add(row.id);
      }
    }

    const ids = Array.from(removeIds);
    return { removeIds: ids, removeCount: ids.length };
  }, [activeRunSeries, activeSeriesSavedRuns]);

  function cleanupActiveSeriesDuplicates() {
    const series = getSelectedRunSeries();
    if (!series) {
      showWarnNotice("Duplicate cleanup: choose an active series first.");
      return;
    }

    const removeIds = new Set(activeSeriesDuplicateCleanupPlan.removeIds);
    if (!removeIds.size) {
      showWarnNotice(`Duplicate cleanup: ${series.label} has no removable duplicates.`);
      return;
    }

    const remaining = savedRuns.filter((row) => !removeIds.has(row.id));
    writeSavedRuns(remaining);
    setSavedRuns(remaining);
    setSelectedSavedRunId((prev) =>
      prev && remaining.some((row) => row.id === prev) ? prev : remaining[0]?.id ?? "",
    );
    setNotice(
      `Duplicate cleanup: removed ${removeIds.size} later duplicate saved run${removeIds.size === 1 ? "" : "s"} from ${series.label}.`,
    );
  }



  const operatorSeriesRows = useMemo(() => {
    return runSeries
      .map((series) => {
        const rows = savedRuns.filter((row) => row.seriesId === series.id);
        const scoredCount = rows.filter((row) => Boolean(row.workbench.report)).length;
        const unscoredCount = Math.max(rows.length - scoredCount, 0);

        const ordinalCounts = new Map<number, number>();
        const runIdCounts = new Map<string, number>();

        for (const row of rows) {
          if (typeof row.ordinal === "number" && Number.isFinite(row.ordinal)) {
            ordinalCounts.set(row.ordinal, (ordinalCounts.get(row.ordinal) ?? 0) + 1);
          }

          const rid = String(row.workbench.report?.runId ?? row.workbench.runId ?? "").trim();
          if (rid) {
            runIdCounts.set(rid, (runIdCounts.get(rid) ?? 0) + 1);
          }
        }

        const hasHardWarnings =
          Array.from(ordinalCounts.values()).some((count) => count > 1) ||
          Array.from(runIdCounts.values()).some((count) => count > 1);

        const missingCount = Math.max(series.targetCount - rows.length, 0);
        const exportReady = scoredCount > 0 && !hasHardWarnings;
        const healthLabel = hasHardWarnings
          ? "hard warning"
          : missingCount > 0 || unscoredCount > 0 || scoredCount === 0
            ? "attention"
            : "clean";

        const rowUpdatedAt = rows.length
          ? Math.max(series.updatedAt, ...rows.map((row) => row.updatedAt))
          : series.updatedAt;

        return {
          id: series.id,
          label: series.label,
          targetCount: series.targetCount,
          savedCount: rows.length,
          scoredCount,
          nextOrdinal: formatSeriesOrdinal(series.nextOrdinal),
          healthLabel,
          exportReady,
          updatedAt: rowUpdatedAt,
          isActive: series.id === selectedSeriesId,
        };
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [runSeries, savedRuns, selectedSeriesId]);

  const bucketsOnlyTasks = useMemo(
    () => byoTasks.filter((t) => t.inputShape === "bucketed_single_tokens"),
    [byoTasks],
  );

  const defaultBucketsTask = useMemo(
    () =>
      bucketsOnlyTasks.find((t) => t.taskId === "T2_LADDER_V0_1") ??
      bucketsOnlyTasks[0] ??
      null,
    [bucketsOnlyTasks],
  );

  const selectedTask = useMemo(() => {
    const pool = mode === "task_buckets" ? bucketsOnlyTasks : byoTasks;
    return (
      pool.find((t) => t.taskId === taskId) ??
      (mode === "task_buckets" ? defaultBucketsTask : pool[0] ?? null)
    );
  }, [mode, taskId, byoTasks, bucketsOnlyTasks, defaultBucketsTask]);

  const operatorChecklistItems = useMemo(() => {
    const providerValue = provider.trim();
    const modelValue = model.trim();
    const activeLabel = activeRunSeries?.label ?? "none";
    const taskLabel = selectedTask?.taskId ?? "none";
    const progressLabel = activeRunSeries
      ? `${activeSeriesSavedCount}/${activeRunSeries.targetCount}`
      : "0/0";

    return [
      {
        key: "series",
        label: "Active series selected",
        tone: activeRunSeries ? "good" : "warn",
        note: activeLabel,
      },
      {
        key: "task",
        label: "Task ready",
        tone: selectedTask?.taskId ? "good" : "warn",
        note: taskLabel,
      },
      {
        key: "metadata",
        label: "Provider + model set",
        tone: providerValue && modelValue ? "good" : "warn",
        note: `${providerValue || "provider?"} / ${modelValue || "model?"}`,
      },
      {
        key: "progress",
        label: "Runs captured",
        tone: activeSeriesSavedCount > 0 ? "good" : "warn",
        note: progressLabel,
      },
      {
        key: "duplicates",
        label: "Duplicates cleaned",
        tone: activeSeriesHasHardWarnings ? "bad" : "good",
        note: activeSeriesHasHardWarnings
          ? `${activeSeriesDuplicateCleanupPlan.removeCount} removable`
          : "clean",
      },
      {
        key: "export",
        label: "Export ready",
        tone:
          activeSeriesExportMode === "ready"
            ? "good"
            : activeSeriesExportMode === "blocked"
              ? "bad"
              : "warn",
        note:
          activeSeriesExportMode === "ready"
            ? "ready"
            : activeSeriesExportMode === "warn"
              ? "warning"
              : "blocked",
      },
    ];
    }, [
      activeRunSeries,
      selectedTask,
      provider,
      model,
      activeSeriesSavedCount,
      activeSeriesExportMode,
      activeSeriesHasHardWarnings,
      activeSeriesDuplicateCleanupPlan.removeCount,
    ]);

  const inputProbe = useMemo(() => probeInput(inputText), [inputText]);
  const showAnalyzeV1Autofill = mode === "run_bundle";
  const hasSourceEngineMeta = Boolean(
    sourceEngineId.trim() || sourceEngineVersion.trim() || sourceEngineBuild.trim(),
  );

  useEffect(() => {
    if (!notice) return;
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => setNotice(null), TOAST_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!apiErr) return;
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => setApiErr(null), TOAST_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [apiErr]);


  const readyToScore =
    Boolean(inputText.trim()) &&
    inputProbe.kind !== "invalid_json" &&
    inputProbe.kind !== "corpus70_meta";

  const summaryTask: any =
    report?.tasks?.find(
      (x: any) =>
        x?.kind === "byo" || String(x?.taskId ?? "").includes("LADDER"),
    ) ??
    report?.tasks?.[0] ??
    null;

  const summarySlopePrimary: any = summaryTask?.slope_aperturePrimary ?? null;

  const summarySlopePresence: any =
    summaryTask?.slope_aperturePresenceMean ??
    summaryTask?.slopes?.aperturePresenceMean ??
    summaryTask?.aperturePresenceMean ??
    null;

  const summaryPearson =
    typeof summarySlopePrimary?.pearson_r === "number"
      ? summarySlopePrimary.pearson_r
      : null;

  const summarySpearman =
    typeof summarySlopePrimary?.spearman_rho === "number"
      ? summarySlopePrimary.spearman_rho
      : null;

  const summaryPPerm =
    typeof summarySlopePresence?.p_spearman === "number"
      ? summarySlopePresence.p_spearman
      : typeof summarySlopePresence?.p_perm_spearman === "number"
        ? summarySlopePresence.p_perm_spearman
        : typeof summarySlopePrimary?.p_spearman === "number"
          ? summarySlopePrimary.p_spearman
          : null;

  const guidedPrompt = useMemo(() => getGuidedPromptV0_1(report ?? null), [report]);
  const shouldRemindGuidedCorrection =
    Boolean(report) &&
    Boolean(guidedPrompt?.correctionPrompt) &&
    guidedPrompt?.level !== "skip";


  const guidedPromptTone =
    guidedPrompt?.level === "skip"
      ? "border-[#2a5f3b] bg-[#122016] text-[#9ae6b4]"
      : guidedPrompt?.level === "minimal"
        ? "border-[#355a7a] bg-[#111a24] text-[#9fd3ff]"
        : guidedPrompt?.level === "light"
          ? "border-[#6a5a2f] bg-[#1c1810] text-[#f1d48a]"
          : guidedPrompt?.level === "heavy"
            ? "border-[#6b3737] bg-[#211717] text-[#e6a0a0]"
            : "border-[#3f3f46] bg-[#151515] text-[#b8b8b8]";

  const summaryPermItersPrimary =
    typeof summarySlopePrimary?.iters === "number"
      ? summarySlopePrimary.iters
      : null;

  const summaryPermItersPresence =
    typeof summarySlopePresence?.iters === "number"
      ? summarySlopePresence.iters
      : null;

  const summaryPermSeedPrimary =
    typeof summarySlopePrimary?.seed === "number"
      ? summarySlopePrimary.seed
      : null;

  const summaryPermSeedPresence =
    typeof summarySlopePresence?.seed === "number"
      ? summarySlopePresence.seed
      : null;

  const summaryPermIters =
    summaryPermItersPresence ?? summaryPermItersPrimary ?? null;

  const summaryPermSeed =
    summaryPermSeedPresence ?? summaryPermSeedPrimary ?? null;

  const summaryBuckets: any[] = Array.isArray(summaryTask?.buckets)
    ? summaryTask.buckets
    : [];

  const compliantBuckets = summaryBuckets.filter(
    (b: any) =>
      Number(b?.invalidN ?? 0) === 0 && Number(b?.duplicateN ?? 0) === 0,
  ).length;

  const complianceText = summaryBuckets.length
    ? `${compliantBuckets} / ${summaryBuckets.length}`
    : "—";

  const summaryCounts = summaryBuckets.reduce(
    (acc: { validN: number; invalidN: number }, b: any) => {
      acc.validN += Number(b?.validN ?? 0);
      acc.invalidN += Number(b?.invalidN ?? 0);
      return acc;
    },
    { validN: 0, invalidN: 0 },
  );

  const stateLabel = busy
    ? "SCORING"
    : apiErr
      ? "ERROR"
      : report
        ? "RUN SCORED"
        : readyToScore
          ? "READY TO SCORE"
          : "IDLE";

  const stateToneClass = busy
    ? "border-[#666] bg-[#1a1a1a]"
    : apiErr
      ? "border-[#6b2a2a] bg-[#221313]"
      : report
        ? "border-[#14532d] bg-[#052e16]"
        : readyToScore
          ? "border-[#1f4d2e] bg-[#0d1f14]"
          : "border-[#383838] bg-[#111111]";

  const stateDotClass = busy
    ? "bg-[#999]"
    : apiErr
      ? "bg-[#ef4444]"
      : report
        ? "bg-[#22c55e]"
        : readyToScore
          ? "bg-[#16a34a]"
          : "bg-[#666]";

  const consistencyBarWidth =
    typeof summarySpearman === "number"
      ? Math.max(0, Math.min(100, Math.abs(summarySpearman) * 100))
      : 0;

  const consistencyBarClass =
    typeof summarySpearman !== "number"
      ? "bg-[#666]"
      : summarySpearman > 0
        ? "bg-[#d93333]"
        : summarySpearman <= -0.7
          ? "bg-[#22c55e]"
          : "bg-[#f59e0b]";

  async function onPickFile(f: File | null) {
    if (!f) return;
    const txt = await f.text();
    setInputText(txt);
  }

  function buildRunJsonFromUi(opts?: {
    forceMode?: "run_bundle" | "task_buckets";
    parsed?: unknown;
  }): unknown {
    const rid = runId.trim() || "ui.run.v0.1";
    const providerValue = provider.trim();
    const modelValue = model.trim();
    const labelValue = label.trim();
    const sourceEngineIdValue = sourceEngineId.trim();
    const sourceEngineVersionValue = sourceEngineVersion.trim();
    const sourceEngineBuildValue = sourceEngineBuild.trim();

    const prob: InputProbe =
      opts?.parsed !== undefined
        ? { kind: "other_json", parsed: opts.parsed }
        : probeInput(inputText);

    if (prob.kind === "invalid_json") throw new Error(prob.error);
    if (prob.kind === "empty") throw new Error("Empty input");
    if (mode === "run_bundle" && prob.kind === "corpus70_meta") {
      throw new Error(
        "This looks like a Corpus70 meta-tags JSON (version/allowedTags/tags). Evals expects evalRun.v0.1 or buckets V1..V7.",
      );
    }

    const parsed = (prob as any).parsed as unknown;
    const effectiveMode = opts?.forceMode ?? mode;
    const taskPool =
      effectiveMode === "task_buckets" || looksLikeBucketsOnly(parsed)
        ? bucketsOnlyTasks
        : byoTasks;
    const taskForMode =
      taskPool.find((t) => t.taskId === taskId) ?? taskPool[0] ?? null;
    // Auto-wrap only when the input is strictly buckets-only.
    if (effectiveMode === "run_bundle" && looksLikeBucketsOnly(parsed)) {
        const wrapTask = defaultBucketsTask ?? taskForMode;
        if (!wrapTask) throw new Error("No task selected");
      return {
        evalRunVersion: "evalRun.v0.1",
        evalSpecVersion: "evalSpec.v0.1",
        specId: "public-grounding-probe.v0.1",
        runId: rid,
        meta: {
          ...(providerValue ? { provider: providerValue } : {}),
          ...(modelValue ? { model: modelValue } : {}),
          ...(labelValue ? { label: labelValue } : {}),
          ...(sourceEngineIdValue
            ? { sourceEngineId: sourceEngineIdValue }
            : {}),
          ...(sourceEngineVersionValue
            ? { sourceEngineVersion: sourceEngineVersionValue }
            : {}),
          ...(sourceEngineBuildValue
            ? { sourceEngineBuild: sourceEngineBuildValue }
            : {}),
        },
        tasks: [
          {
              taskId: wrapTask.taskId,
            inputShape: "bucketed_single_tokens",
            buckets: parsed,
          },
        ],
      };
    }

    if (effectiveMode === "run_bundle") {
      // Patch meta if provided (best-effort)
      if (
        providerValue ||
        modelValue ||
        labelValue ||
        sourceEngineIdValue ||
        sourceEngineVersionValue ||
        sourceEngineBuildValue
      ) {
        const obj = parsed as any;
        if (typeof obj !== "object" || obj === null) return parsed;
        obj.meta = {
          ...(obj.meta ?? {}),
          ...(providerValue ? { provider: providerValue } : {}),
          ...(modelValue ? { model: modelValue } : {}),
          ...(labelValue ? { label: labelValue } : {}),
          ...(sourceEngineIdValue
            ? { sourceEngineId: sourceEngineIdValue }
            : {}),
          ...(sourceEngineVersionValue
            ? { sourceEngineVersion: sourceEngineVersionValue }
            : {}),
          ...(sourceEngineBuildValue
            ? { sourceEngineBuild: sourceEngineBuildValue }
            : {}),
        };
        if (!obj.runId) obj.runId = rid;
        return obj;
      }
      return parsed;
    }

    // effectiveMode === task_buckets (wrap raw buckets -> full run bundle)
    if (!looksLikeBucketsOnly(parsed)) {
      throw new Error(
        "Buckets-only mode expects exactly keys V1..V7 with string arrays.",
      );
    }
    if (!taskForMode) throw new Error("No task selected");
    return {
      evalRunVersion: "evalRun.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: rid,
      meta: {
        ...(providerValue ? { provider: providerValue } : {}),
        ...(modelValue ? { model: modelValue } : {}),
        ...(labelValue ? { label: labelValue } : {}),
        ...(sourceEngineIdValue ? { sourceEngineId: sourceEngineIdValue } : {}),
        ...(sourceEngineVersionValue
          ? { sourceEngineVersion: sourceEngineVersionValue }
          : {}),
        ...(sourceEngineBuildValue
          ? { sourceEngineBuild: sourceEngineBuildValue }
          : {}),
      },
      tasks: [
        {
          taskId: taskForMode.taskId,
          inputShape: "bucketed_single_tokens",
          buckets: parsed,
        },
      ],
    };
  }

  function snapshotWorkbench(): EvalsWorkbenchStateV0_1 {
    return {
      mode,
      taskId,
      runId: runId.trim(),
      provider: provider.trim(),
      model: model.trim(),
      label: label.trim(),
      sourceEngineId: sourceEngineId.trim(),
      sourceEngineVersion: sourceEngineVersion.trim(),
      sourceEngineBuild: sourceEngineBuild.trim(),
      inputText,
      pickedFileName,
      report,
      md,
    };
  }

  function restoreWorkbench(snapshot: EvalsWorkbenchStateV0_1) {
    setMode(snapshot.mode);
    setTaskId(snapshot.taskId);
    setRunId(snapshot.runId);
    setProvider(snapshot.provider);
    setModel(snapshot.model);
    setLabel(snapshot.label);
    setSourceEngineId(snapshot.sourceEngineId);
    setSourceEngineVersion(snapshot.sourceEngineVersion);
    setSourceEngineBuild(snapshot.sourceEngineBuild);
    setInputText(snapshot.inputText);
    setPickedFileName(snapshot.pickedFileName);
    setReport(snapshot.report);
    setMd(snapshot.md);
    setApiErr(null);
    setNotice("Saved run opened.");
  }

  function parseSeriesTargetCount(raw: string) {
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 1 ? parsed : 15;
  }

  function slugifySeriesPart(raw: string) {
    const next = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return next || "series";
  }

  function buildRunSeriesTemplate(labelValue: string) {
    const providerPart = slugifySeriesPart(provider || "provider");
    const modelPart = slugifySeriesPart(model || "model");
    const labelPart = slugifySeriesPart(labelValue);
    return `battery.v0.1.${providerPart}.${modelPart}.${labelPart}.{NN}`;
  }

  function makeSeriesLabel(labelValue: string, ordinal: number) {
    return `${labelValue}.${formatSeriesOrdinal(ordinal).slice(1)}`;
  }

  function getSelectedRunSeries() {
    return runSeries.find((row) => row.id === selectedSeriesId) ?? null;
  }

  function prefillNextSeriesRun(series: EvalsRunSeriesV0_1) {
    setRunId(applySeriesRunIdTemplate(series.runIdTemplate, series.nextOrdinal));
    setLabel(makeSeriesLabel(series.label, series.nextOrdinal));
  }

  function createRunSeries() {
    const cleanedLabel = seriesLabelDraft.trim() || "fresh-chat";
    const targetCount = parseSeriesTargetCount(seriesTargetCountDraft);
    const nextSeries = makeDefaultRunSeries(
      cleanedLabel,
      buildRunSeriesTemplate(cleanedLabel),
      targetCount,
    );

    setRunSeries((prev) => {
      const nextRows = [nextSeries, ...prev];
      writeRunSeries(nextRows);
      return nextRows;
    });

    setSelectedSeriesId(nextSeries.id);
    setSeriesLabelDraft(cleanedLabel);
    setSeriesTargetCountDraft(String(targetCount));
    prefillNextSeriesRun(nextSeries);
    setNotice(`Created series: ${cleanedLabel}`);
  }

  function saveCurrentRun(seriesOverride?: EvalsRunSeriesV0_1 | null) {
    const snapshot = snapshotWorkbench();
    const now = Date.now();
    const series = seriesOverride ?? null;
    const seriesOrdinal = series?.nextOrdinal ?? null;
    const title =
      label.trim() ||
      runId.trim() ||
      (series ? makeSeriesLabel(series.label, series.nextOrdinal) : "Saved run");

    const nextRecord: EvalsSavedRunRecordV0_1 = {
      id: makeSavedRunId(),
      title,
      createdAt: now,
      updatedAt: now,
      seriesId: series?.id ?? null,
      ordinal: seriesOrdinal,
      workbench: snapshot,
    };

    setSavedRuns((prev) => {
      const nextRows = [nextRecord, ...prev];
      writeSavedRuns(nextRows);
      return nextRows;
    });

    if (!series) {
      setNotice(`Saved run: ${title}`);
    }

    return nextRecord;
  }

  function findSeriesDuplicate(series: EvalsRunSeriesV0_1) {
    const nextRunId =
      runId.trim() ||
      applySeriesRunIdTemplate(series.runIdTemplate, series.nextOrdinal);

    const sameOrdinal = savedRuns.find(
      (row) => row.seriesId === series.id && row.ordinal === series.nextOrdinal,
    );
    if (sameOrdinal) {
      return { kind: "ordinal" as const, row: sameOrdinal, nextRunId };
    }

    const sameRunId = savedRuns.find(
      (row) =>
        row.seriesId === series.id &&
        String(row.workbench.runId || "").trim() === nextRunId,
    );
    if (sameRunId) {
      return { kind: "runId" as const, row: sameRunId, nextRunId };
    }

    return null;
  }

  function saveAndAdvanceSeries() {
    const series = getSelectedRunSeries();
    if (!series) {
      showWarnNotice("Save + Next Run: create or select a series first.");
      return;
    }

    if (shouldRemindGuidedCorrection && !saveNextGuidedReminderArmed) {
      setSaveNextGuidedReminderArmed(true);
      showWarnNotice(
        "Save + Next Run: Copy Correction Prompt before advancing if you want to run the guided correction step. Click Save + Next Run again to continue anyway.",
      );
      return;
    }

    const duplicate = findSeriesDuplicate(series);
    if (duplicate?.kind === "ordinal") {
      showWarnNotice(
        `Duplicate guard: ${series.label} already has ${formatSeriesOrdinal(series.nextOrdinal)}.`,
      );
      return;
    }

    if (duplicate?.kind === "runId") {
      showWarnNotice(
        `Duplicate guard: active series already contains runId ${duplicate.nextRunId}.`,
      );
      return;
    }

    saveCurrentRun(series);

    const nextSeries: EvalsRunSeriesV0_1 = {
      ...series,
      nextOrdinal: series.nextOrdinal + 1,
      updatedAt: Date.now(),
    };

    setRunSeries((prev) => {
      const nextRows = prev.map((row) => (row.id === series.id ? nextSeries : row));
      writeRunSeries(nextRows);
      return nextRows;
    });

    setInputText("");
    setPickedFileName("");
    setApiErr(null);
    setReport(null);
    setMd("");
      setSaveNextGuidedReminderArmed(false);
    prefillNextSeriesRun(nextSeries);
    setNotice(
      `Saved ${series.label} ${formatSeriesOrdinal(series.nextOrdinal)}. Ready for ${formatSeriesOrdinal(nextSeries.nextOrdinal)}.`,
    );
  }

  function deleteSelectedRunSeries() {
    const series = getSelectedRunSeries();
    if (!series) {
      showWarnNotice("Delete Active Series: choose an active series first.");
      return;
    }

    const linkedRuns = savedRuns.filter((row) => row.seriesId === series.id);
    if (linkedRuns.length > 0) {
      showWarnNotice(`Delete Active Series: ${series.label} has ${linkedRuns.length} saved runs. Delete saved runs first.`);
      return;
    }

    const remaining = runSeries.filter((row) => row.id !== series.id);
    writeRunSeries(remaining);
    setRunSeries(remaining);
    setSelectedSeriesId(remaining[0]?.id ?? "");
    if (remaining[0]) {
      setSeriesLabelDraft(remaining[0].label);
      setSeriesTargetCountDraft(String(remaining[0].targetCount));
      prefillNextSeriesRun(remaining[0]);
    } else {
      setSeriesLabelDraft("fresh-chat");
      setSeriesTargetCountDraft("15");
      setRunId("ui.run.v0.1");
      setLabel("");
    }
    setNotice(`Deleted active series: ${series.label}`);
  }

  function deleteSelectedSavedRun() {
    const selected = savedRuns.find((row) => row.id === selectedSavedRunId);
    if (!selected) {
      showWarnNotice("Delete Saved Run: choose a saved run first.");
      return;
    }

    const remaining = savedRuns.filter((row) => row.id !== selected.id);
    writeSavedRuns(remaining);
    setSavedRuns(remaining);
    setSelectedSavedRunId(remaining[0]?.id ?? "");
    setNotice(`Deleted saved run: ${selected.title}`);
  }

  function openSelectedSavedRun() {
    const selected = savedRuns.find((row) => row.id === selectedSavedRunId);
    if (!selected) {
      showWarnNotice("Open Saved Run: choose a saved run first.");
      return;
    }
    restoreWorkbench(selected.workbench);
  }
  function resetWorkbench() {
    setInputText("");
    setPickedFileName("");
    setApiErr(null);
    setReport(null);
    setMd("");
    setNotice("Workbench reset.");
  }

  async function onScore() {
    setApiErr(null);
    setNotice(null);
    setReport(null);
    setMd("");
    setBusy(true);
    try {
      const shouldAutoWrap =
        mode === "run_bundle" && probeInput(inputText).kind === "bucket_only";
      if (shouldAutoWrap) {
        setNotice(
          "Detected buckets-only JSON while in Full run bundle mode. Auto-wrapping into evalRun.v0.1.",
        );
        setMode("task_buckets");
      }
      const runJson = buildRunJsonFromUi({
        forceMode: shouldAutoWrap ? "task_buckets" : undefined,
      });
      const body = JSON.stringify(runJson);

      const res = await fetch("/api/evals/score", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });

      const data: unknown = await res.json();

      if (!data || typeof data !== "object") {
        setApiErr({
          ok: false,
          code: "BAD_JSON",
          message: "Server returned non-object JSON.",
        });
        return;
      }
      if ((data as any).ok !== true) {
        const e = data as any;
        setApiErr({
          ok: false,
          code: String(e?.code ?? "UNKNOWN"),
          message: String(e?.message ?? "Unknown error"),
        });
        return;
      }

      const j = data as ApiOk;
      setReport(j.report);
      setMd(j.md);
    } catch (e) {
      setApiErr({
        ok: false,
        code: "CLIENT_ERROR",
        message: (e as Error)?.message ?? "Client error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function onDownloadBundle() {
    setApiErr(null);
    setNotice(null);

    try {
      const shouldAutoWrap =
        mode === "run_bundle" && probeInput(inputText).kind === "bucket_only";
      if (shouldAutoWrap) {
        setMode("task_buckets");
      }

      const runJson = buildRunJsonFromUi({
        forceMode: shouldAutoWrap ? "task_buckets" : undefined,
      });

      const blob = new Blob([JSON.stringify(runJson, null, 2) + "\n"], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);

      const effectiveRunId =
        typeof (runJson as any)?.runId === "string" &&
        (runJson as any).runId.trim()
          ? String((runJson as any).runId)
          : String(runId || "run");

      const rid = effectiveRunId
        .replace(/[^a-zA-Z0-9._-]+/g, "_")
        .slice(0, 120);

      const a = document.createElement("a");
      a.href = url;
      a.download = `evals.${rid}.v0.1.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      setNotice(
        shouldAutoWrap
          ? "Downloaded evalRun bundle. Raw V1..V7 input was auto-wrapped through T2_LADDER_V0_1."
          : "Downloaded evalRun bundle.",
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setApiErr({ ok: false, code: "CLIENT_ERROR", message: msg });
    }
  }

  async function onDownloadPdf() {
    setApiErr(null);
    setNotice(null);
    setBusy(true);
    try {
      const shouldAutoWrap =
        mode === "run_bundle" && probeInput(inputText).kind === "bucket_only";
      if (shouldAutoWrap) {
        setNotice(
          "Detected buckets-only JSON while in Full run bundle mode. Auto-wrapping into evalRun.v0.1.",
        );
        setMode("task_buckets");
      }
      const runJson = buildRunJsonFromUi({
        forceMode: shouldAutoWrap ? "task_buckets" : undefined,
      });
      const body = JSON.stringify(runJson);

      const res = await fetch("/api/evals/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setApiErr({
          ok: false,
          code: String(data?.code ?? "PDF_ERROR"),
          message: String(data?.message ?? `HTTP ${res.status}`),
        });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const rid = String(runId || "run")
        .replace(/[^a-zA-Z0-9._-]+/g, "_")
        .slice(0, 120);

      const a = document.createElement("a");
      a.href = url;
      a.download = `evals.${rid}.v0.1.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setApiErr({ ok: false, code: "CLIENT_ERROR", message: msg });
    } finally {
      setBusy(false);
    }
  }

  const devicePlateTaskId =
    report?.tasks?.find((t) => t.kind === "byo")?.taskId ??
    report?.tasks?.[0]?.taskId ??
    null;
  const devicePlateTaskVersion = taskVersionFromTaskIdV0_1(devicePlateTaskId);
  const [devicePlatePromptHash, setDevicePlatePromptHash] = useState("—");

  useEffect(() => {
    let active = true;

    const promptText =
      EVAL_SPEC_V0_1.tasks.find((t) => t.taskId === devicePlateTaskId)
        ?.prompt ?? "";

    if (!String(promptText).trim()) {
      setDevicePlatePromptHash("not available");
      return () => {
        active = false;
      };
    }

    void sha256HexV0_1(String(promptText))
      .then((hex) => {
        if (!active) return;
        setDevicePlatePromptHash(hex.slice(0, 16));
      })
      .catch(() => {
        if (!active) return;
        setDevicePlatePromptHash("hash error");
      });

    return () => {
      active = false;
    };
  }, [devicePlateTaskId]);
  const devicePlateExportedAtUtc = useMemo(
    () => extractMdFrontMatterValueV0_1(md, "exportedAtUtc"),
    [md],
  );
  const devicePlateScorerBuild = useMemo(
    () => extractMdFrontMatterValueV0_1(md, "scorerBuild") || "unknown",
    [md],
  );
  async function autofillAnalyzeV1SourceEngine() {
    try {
      const res = await fetch("/api/evals/source-engine-provenance", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await res.json()) as {
        ok?: boolean;
        sourceEngineId?: string;
        sourceEngineVersion?: string;
        sourceEngineBuild?: string;
        message?: string;
      };

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Could not load analyze-v1 provenance.");
      }

      setSourceEngineId(String(data.sourceEngineId ?? "analyze-v1"));
      setSourceEngineVersion(String(data.sourceEngineVersion ?? ""));
      setSourceEngineBuild(String(data.sourceEngineBuild ?? ""));
      setNotice("Filled sourceEngine* from live /api/analyze-v1 provenance.");
    } catch (err) {
      setNotice(
        err instanceof Error
          ? err.message
          : "Could not autofill /api/analyze-v1 provenance."
      );
    }
  }

  function clearSourceEngineProvenance() {
    setSourceEngineId("");
    setSourceEngineVersion("");
    setSourceEngineBuild("");
    setNotice("Cleared sourceEngine* metadata.");
  }

  function loadExample() {
    // Synthetic calibration ladder (non-semantic): each bucket is dominated by one vowel carrier.
    setMode("task_buckets");
    setTaskId("T2_LADDER_V0_1");
    setRunId("example.synthetic.ladder.v0.1");
    setInputText(
      JSON.stringify(
        {
          V1: [
            "a",
            "aa",
            "aaa",
            "aaaa",
            "aaaaa",
            "aaaaaa",
            "aaaaaaa",
            "aaaaaaaa",
            "aaaaaaaaa",
            "aaaaaaaaaa",
          ],
          V2: [
            "o",
            "oo",
            "ooo",
            "oooo",
            "ooooo",
            "oooooo",
            "ooooooo",
            "oooooooo",
            "ooooooooo",
            "oooooooooo",
          ],
          V3: [
            "e",
            "ee",
            "eee",
            "eeee",
            "eeeee",
            "eeeeee",
            "eeeeeee",
            "eeeeeeee",
            "eeeeeeeee",
            "eeeeeeeeee",
          ],
          V4: [
            "ë",
            "ëë",
            "ëëë",
            "ëëëë",
            "ëëëëë",
            "ëëëëëë",
            "ëëëëëëë",
            "ëëëëëëëë",
            "ëëëëëëëëë",
            "ëëëëëëëëëë",
          ],
          V5: [
            "u",
            "uu",
            "uuu",
            "uuuu",
            "uuuuu",
            "uuuuuu",
            "uuuuuuu",
            "uuuuuuuu",
            "uuuuuuuuu",
            "uuuuuuuuuu",
          ],
          V6: [
            "y",
            "yy",
            "yyy",
            "yyyy",
            "yyyyy",
            "yyyyyy",
            "yyyyyyy",
            "yyyyyyyy",
            "yyyyyyyyy",
            "yyyyyyyyyy",
          ],
          V7: [
            "i",
            "ii",
            "iii",
            "iiii",
            "iiiii",
            "iiiiii",
            "iiiiiii",
            "iiiiiiii",
            "iiiiiiiii",
            "iiiiiiiiii",
          ],
        },
        null,
        2,
      ),
    );
  }

  // ---- Clipboard helpers (battery logging) ----
  const dfNowIso = () => new Date().toISOString();

  const dfSplitCsvSafe = (s: any) =>
    String(s ?? "")
      .replaceAll("\n", " ")
      .replaceAll("\r", " ")
      .replaceAll(",", " ");

  const dfTryParseBucketsOnly = (raw: any) => {
    try {
      const j = JSON.parse(String(raw ?? ""));
      const keys = ["V1", "V2", "V3", "V4", "V5", "V6", "V7"];
      for (const k of keys) {
        if (!Array.isArray(j?.[k])) return null;
      }
      // Preserve key order
      return {
        V1: j.V1,
        V2: j.V2,
        V3: j.V3,
        V4: j.V4,
        V5: j.V5,
        V6: j.V6,
        V7: j.V7,
      };
    } catch {
      return null;
    }
  };

  const dfCopyText = async (labelMsg: string, text: string) => {
    try {
      if (!globalThis?.navigator?.clipboard?.writeText) {
        showWarnNotice("Clipboard unavailable in this browser.");
        return;
      }
      await navigator.clipboard.writeText(String(text ?? ""));
      setNotice(labelMsg);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      showWarnNotice("Copy failed: " + msg);
    }
  };

  const onCopyGuidedBaselinePrompt = async () => {
    await dfCopyText("Copy Baseline Prompt: copied.", EVALS_GUIDED_BASELINE_PROMPT_V0_1);
  };

  const onCopyGuidedCorrectionPrompt = async () => {
    if (!guidedPrompt) {
      showWarnNotice("Copy Correction Prompt: score a run first.");
      return;
    }
    if (!guidedPrompt.correctionPrompt) {
      showWarnNotice("Copy Correction Prompt: no correction needed for this run.");
      return;
    }
    await dfCopyText(
      `Copy Correction Prompt: copied (${guidedPrompt.level}).`,
      guidedPrompt.correctionPrompt,
    );
    setSaveNextGuidedReminderArmed(false);
  };

  const dfCsvCell = (value: unknown) => {
    const text = String(value ?? "");
    const escaped = text.replaceAll('"', '""');
    return /[",\n\r]/.test(text) ? `"${escaped}"` : text;
  };

  const dfDownloadTextFile = (filename: string, text: string, mimeType: string) => {
    if (typeof window === "undefined") return;
    const blob = new Blob([text], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const buildSeriesCsvRow = (row: EvalsSavedRunRecordV0_1, seriesLabel: string) => {
    const rep = row.workbench.report;
    if (!rep) return null;

    const ts = rep && rep.tasks ? rep.tasks : [];
    const byo = Array.isArray(ts)
      ? ts.find((x: any) => x?.kind === 'byo' || String(x?.taskId ?? '').includes('LADDER'))
      : null;
    const task = byo ?? (Array.isArray(ts) ? ts[0] : null);
    const slope = dfGetSlopePresence(task);
    const { validN, invalidN } = dfSumValidInvalid(task);

    const pearson_r =
      (slope as any)?.pearson_r ?? (slope as any)?.pearson?.r ?? '';
    const spearman_rho =
      (slope as any)?.spearman_rho ??
      (slope as any)?.spearman?.rho ??
      (slope as any)?.spearman?.r ??
      '';
    const p_perm =
      (slope as any)?.p_spearman ?? (slope as any)?.p_perm_spearman ?? '';
    const iters = (slope as any)?.iters ?? '';
    const seed = (slope as any)?.seed ?? '';

    const diag = (task as any)?.diagnostics ?? (task as any)?.diag ?? {};
    const noVowelTokenCount =
      diag?.noVowelTokenCount ?? diag?.no_vowel_token_count ?? '';

    const reportMeta = rep.meta ?? {};
    const csvRunId = normalizeEvalsMetaTextV0_1((rep as any)?.runId ?? row.workbench.runId ?? "");
    const csvProvider = normalizeEvalsMetaTextV0_1(reportMeta?.provider ?? row.workbench.provider ?? "");
    const csvModel = normalizeEvalsMetaTextV0_1(reportMeta?.model ?? row.workbench.model ?? "");
    const csvLabel = normalizeEvalsMetaTextV0_1(reportMeta?.label ?? row.workbench.label ?? "");
    const csvSourceEngineId = normalizeEvalsMetaTextV0_1(reportMeta?.sourceEngineId ?? row.workbench.sourceEngineId ?? "");
    const csvSourceEngineBuild = normalizeEvalsMetaTextV0_1(reportMeta?.sourceEngineBuild ?? row.workbench.sourceEngineBuild ?? "");
    const controlHealthStatus = normalizeEvalsMetaTextV0_1((rep as any)?.controlHealth?.status ?? "");
    const controlHealthReason = dfSplitCsvSafe((rep as any)?.controlHealth?.reason ?? "");
    const ordinal = row.ordinal != null ? formatSeriesOrdinal(row.ordinal) : '';

    return [
      new Date(row.updatedAt || row.createdAt).toISOString(),
      seriesLabel,
      ordinal,
      csvRunId,
      csvProvider,
      csvModel,
      csvLabel,
      pearson_r,
      spearman_rho,
      p_perm,
      validN,
      invalidN,
      noVowelTokenCount,
      `iters=${iters}; seed=${seed}; p_perm_src=p_spearman; sourceEngineId=${csvSourceEngineId || ""}; sourceEngineBuild=${csvSourceEngineBuild || ""}; controlHealth=${controlHealthStatus || ""}; controlReason=${controlHealthReason || ""}`,
    ].map(dfCsvCell).join(',');
  };

  function exportActiveSeriesCsv() {
  const series = getSelectedRunSeries();
  if (!series) {
    showWarnNotice("Export Active Series CSV: choose an active series first.");
    return;
  }

  const allRows = savedRuns
    .filter((row) => row.seriesId === series.id)
    .sort((a, b) => {
      const ao = a.ordinal ?? Number.MAX_SAFE_INTEGER;
      const bo = b.ordinal ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.createdAt - b.createdAt;
    });

  const verdict = getSeriesExportVerdictV0_1(series, allRows);
  const rows = allRows.filter((row) => Boolean(row.workbench.report));

  if (!rows.length) {
    showWarnNotice(`Export Active Series CSV: ${series.label} has no scored saved runs yet.`);
    return;
  }

  if (verdict.hasHardWarnings) {
    showWarnNotice(`Export Active Series CSV: ${series.label} blocked — ${verdict.reason}. Clean the active series first.`);
    return;
  }

  const header = [
    'timestamp',
    'seriesLabel',
    'ordinal',
    'runId',
    'provider',
    'model',
    'label',
    'pearson_r',
    'spearman_rho',
    'p_perm',
    'validN',
    'invalidN',
    'noVowelTokenCount',
    'notes',
  ].join(',');

  const body = rows
    .map((row) => buildSeriesCsvRow(row, series.label))
    .filter(Boolean)
    .join('\n');

  const filename = `evals.${slugifySeriesPart(series.label)}.${rows.length}runs.csv`;
  dfDownloadTextFile(filename, [header, body].join('\n'), 'text/csv;charset=utf-8');
  setNotice(
    verdict.exportMode === "ready"
      ? `Exported active series CSV: ${series.label} (${rows.length} runs)`
      : `Exported active series CSV with warning: ${series.label} (${rows.length} scored runs; ${verdict.reason}).`,
  );
}

  function exportAllSeriesCsv() {
  const seriesVerdicts = runSeries
    .map((series) => ({
      series,
      rows: savedRuns.filter((row) => row.seriesId === series.id),
    }))
    .filter(({ rows }) => rows.length > 0)
    .map(({ series, rows }) => ({
      series,
      verdict: getSeriesExportVerdictV0_1(series, rows),
    }));

  const blockedSeries = seriesVerdicts.filter(({ verdict }) => verdict.hasHardWarnings);
  if (blockedSeries.length) {
    showWarnNotice(
      `Export All Series CSV: blocked — clean duplicates in ${blockedSeries
        .map(({ series }) => series.label)
        .join(", ")} first.`
    );
    return;
  }

  const rows = savedRuns
    .filter((row) => Boolean(row.workbench.report))
    .map((row) => ({
      row,
      seriesLabel:
        runSeries.find((series) => series.id === row.seriesId)?.label ??
        (String(row.seriesId ?? '').trim() || 'unassigned'),
    }))
    .sort((a, b) => {
      const labelCompare = a.seriesLabel.localeCompare(b.seriesLabel);
      if (labelCompare !== 0) return labelCompare;
      const ao = a.row.ordinal ?? Number.MAX_SAFE_INTEGER;
      const bo = b.row.ordinal ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.row.createdAt - b.row.createdAt;
    });

  if (!rows.length) {
    showWarnNotice('Export All Series CSV: no scored saved runs yet.');
    return;
  }

  const header = [
    'timestamp',
    'seriesLabel',
    'ordinal',
    'runId',
    'provider',
    'model',
    'label',
    'pearson_r',
    'spearman_rho',
    'p_perm',
    'validN',
    'invalidN',
    'noVowelTokenCount',
    'notes',
  ].join(',');

  const body = rows
    .map(({ row, seriesLabel }) => buildSeriesCsvRow(row, seriesLabel))
    .filter(Boolean)
    .join('\n');

  const filename = `evals.all-series.${rows.length}runs.csv`;
  dfDownloadTextFile(filename, [header, body].join('\n'), 'text/csv;charset=utf-8');

  const warnedSeriesCount = seriesVerdicts.filter(({ verdict }) => verdict.exportMode === "warn").length;
  setNotice(
    warnedSeriesCount > 0
      ? `Exported all series CSV with warning: ${warnedSeriesCount} incomplete or partially scored series included.`
      : `Exported all series CSV (${rows.length} runs)`
  );
}

  function exportActiveSeriesJson() {
  const series = getSelectedRunSeries();
  if (!series) {
    showWarnNotice("Export Active Series JSON: choose an active series first.");
    return;
  }

  const rows = savedRuns
    .filter((row) => row.seriesId === series.id)
    .sort((a, b) => {
      const ao = a.ordinal ?? Number.MAX_SAFE_INTEGER;
      const bo = b.ordinal ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.createdAt - b.createdAt;
    });

  if (!rows.length) {
    showWarnNotice(`Export Active Series JSON: ${series.label} has no saved runs yet.`);
    return;
  }

  const verdict = getSeriesExportVerdictV0_1(series, rows);
  if (verdict.hasHardWarnings) {
    showWarnNotice(`Export Active Series JSON: ${series.label} blocked — ${verdict.reason}. Clean the active series first.`);
    return;
  }

  const payload = {
    exportVersion: "evals.activeSeriesExport.v0.1",
    exportedAt: new Date().toISOString(),
    series: {
      id: series.id,
      label: series.label,
      targetCount: series.targetCount,
      nextOrdinal: series.nextOrdinal,
      runIdTemplate: series.runIdTemplate,
      createdAt: new Date(series.createdAt).toISOString(),
      updatedAt: new Date(series.updatedAt).toISOString(),
    },
    summary: {
      savedCount: verdict.savedCount,
      scoredCount: verdict.scoredCount,
      unscoredCount: verdict.unscoredCount,
      exportMode: verdict.exportMode,
      exportReason: verdict.reason,
    },
    savedRuns: rows.map((row) => ({
      ...row,
      workbench: {
        ...row.workbench,
        runId: String(row.workbench.runId ?? '').trim(),
        provider: String(row.workbench.provider ?? '').trim(),
        model: String(row.workbench.model ?? '').trim(),
        label: String(row.workbench.label ?? '').trim(),
        sourceEngineId: String(row.workbench.sourceEngineId ?? '').trim(),
        sourceEngineVersion: String(row.workbench.sourceEngineVersion ?? '').trim(),
        sourceEngineBuild: String(row.workbench.sourceEngineBuild ?? '').trim(),
      },
      createdAtIso: new Date(row.createdAt).toISOString(),
      updatedAtIso: new Date(row.updatedAt).toISOString(),
    })),
  };

  const filename = `evals.${slugifySeriesPart(series.label)}.${rows.length}runs.json`;
  dfDownloadTextFile(
    filename,
    JSON.stringify(payload, null, 2),
    'application/json;charset=utf-8',
  );
  setNotice(
    verdict.exportMode === "ready"
      ? `Exported active series JSON: ${series.label} (${rows.length} runs)`
      : `Exported active series JSON with warning: ${series.label} (${verdict.reason}).`,
  );
}

  const dfGetPrimaryTask = () => {
    const ts = report && report.tasks ? report.tasks : [];
    // Prefer a by-run task if present; else first task.
    const byo = Array.isArray(ts)
      ? ts.find(
          (x) =>
            x?.kind === "byo" || String(x?.taskId ?? "").includes("LADDER"),
        )
      : null;
    return byo ?? (Array.isArray(ts) ? ts[0] : null);
  };

  const dfGetSlopePresence = (task: any) => {
    // Try a few likely shapes (defensive).
    const s =
      task?.slopes?.aperturePresenceMean ??
      task?.slope_aperturePresenceMean ??
      task?.aperturePresenceMean ??
      null;
    return s;
  };

  const dfSumValidInvalid = (task: any) => {
    const bs = task?.buckets ?? task?.bucketReports ?? task?.bucketStats ?? [];
    let validN = 0;
    let invalidN = 0;
    if (Array.isArray(bs)) {
      for (const b of bs) {
        validN += Number(b?.validN ?? 0);
        invalidN += Number(b?.invalidN ?? 0);
      }
    }
    return { validN, invalidN };
  };

  const onCopyRawJson = async () => {
    const b = dfTryParseBucketsOnly(inputText);
    if (!b) {
      showWarnNotice("Copy Raw JSON: input is not buckets-only JSON (V1..V7).");
      return;
    }
    await dfCopyText(
      "Copied buckets JSON (V1..V7).",
      JSON.stringify(b, null, 2),
    );
  };

  const onCopyPageLink = async () => {
    if (typeof window === "undefined") return;
    const href = new URL("/evals", window.location.origin).toString();
    await dfCopyText("Copied page link.", href);
  };

  const onCopyCsvRow = async () => {
    if (!report) {
      showWarnNotice("Copy CSV Row: score first.");
      return;
    }
    const task = dfGetPrimaryTask();
    const slope = dfGetSlopePresence(task); // aperturePresenceMean block shown in UI.
    const pearson_r =
      (slope as any)?.pearson_r ?? (slope as any)?.pearson?.r ?? null;
    const spearman_rho =
      (slope as any)?.spearman_rho ??
      (slope as any)?.spearman?.rho ??
      (slope as any)?.spearman?.r ??
      null;

    // IMPORTANT: battery CSV p_perm comes from aperturePresenceMean.p_spearman.
    const p_perm =
      (slope as any)?.p_spearman ?? (slope as any)?.p_perm_spearman ?? null;

    const iters = (slope as any)?.iters ?? null;
    const seed = (slope as any)?.seed ?? null;

    const diag = (task as any)?.diagnostics ?? (task as any)?.diag ?? {};
    const noVowelTokenCount =
      diag?.noVowelTokenCount ?? diag?.no_vowel_token_count ?? "";

    const { validN, invalidN } = dfSumValidInvalid(task);

    const reportMeta = report.meta ?? {};
    const csvRunId = String((report as any)?.runId ?? "").trim();
    const csvProvider = String(reportMeta?.provider ?? "").trim();
    const csvModel = String(reportMeta?.model ?? "").trim();
    const csvLabel = String(reportMeta?.label ?? "").trim();
    const csvSourceEngineId = String(reportMeta?.sourceEngineId ?? "").trim();
    const csvSourceEngineBuild = String(reportMeta?.sourceEngineBuild ?? "").trim();

    const row = [
      dfNowIso(),
      dfSplitCsvSafe(csvRunId),
      dfSplitCsvSafe(csvProvider),
      dfSplitCsvSafe(csvModel),
      dfSplitCsvSafe(csvLabel),
      pearson_r ?? "",
      spearman_rho ?? "",
      p_perm ?? "",
      validN ?? "",
      invalidN ?? "",
      noVowelTokenCount ?? "",
      `iters=${iters ?? ""}; seed=${seed ?? ""}; p_perm_src=p_spearman; sourceEngineId=${csvSourceEngineId || ""}; sourceEngineBuild=${csvSourceEngineBuild || ""}`,
    ].join(",");

    await dfCopyText("Copied CSV row.", row);
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white">
      <StickyNav />

      <div className="sticky top-[48px] z-40 border-b border-[#1a1e28] bg-[#0d1017]">
        <div className="mx-auto flex w-full max-w-[1680px] items-stretch divide-x divide-[#1a1e28] px-6 xl:px-8">
          <div className="flex flex-1 items-baseline justify-between px-4 py-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a4b0cc]">
              Pearson r
            </span>
            <span className="font-mono text-[14px] text-[#44cf8b]">
              {typeof summaryPearson === "number" ? fmt(summaryPearson) : "—"}
            </span>
          </div>
          <div className="flex flex-1 items-baseline justify-between px-4 py-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a4b0cc]">
              Spearman ρ
            </span>
            <span className="font-mono text-[14px] text-[#44cf8b]">
              {typeof summarySpearman === "number" ? fmt(summarySpearman) : "—"}
            </span>
          </div>
          <div className="flex flex-1 items-baseline justify-between px-4 py-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a4b0cc]">
              P_perm
            </span>
            <span className="font-mono text-[14px] text-[#f4ddb0]">
              {typeof summaryPPerm === "number" ? fmtP(summaryPPerm) : "—"}
            </span>
          </div>
          <div className="flex flex-1 items-baseline justify-between px-4 py-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a4b0cc]">
              Compliance
            </span>
            <span className="font-mono text-[14px] text-[#d7e6ff]">
              {report ? complianceText : "—"}
            </span>
          </div>
          <div className="flex flex-col justify-center px-4 py-2.5 gap-0.5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#bccdd8]">
              {stateLabel}
            </span>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${stateDotClass}`} />
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6a7e90]">
                {busy ? "working" : report ? "scored" : readyToScore ? "ready" : "idle"}
              </span>
            </div>
          </div>
        </div>
      </div>

        <main className="mx-auto flex w-full max-w-[1680px] flex-col gap-8 px-6 pt-6 pb-16 xl:px-8">
          <section className="rounded-[14px] border border-[#2f3742] bg-[#13171d] px-6 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)] xl:items-start">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className={`${MT.eyebrow} text-[#d7dde7]`}>
                    instrument · evals
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className={`${MT.heroTitle} !text-[24px] text-[#f5f7fb]`}>
                      ZË-RO Evals Workbench
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href="/evals/reference"
                        className="inline-flex shrink-0 items-center rounded-[8px] border border-[#5a2424] bg-[#1f1010] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#fca5a5] transition hover:border-[#7a3434] hover:bg-[#281414] hover:text-[#ffd0d0]"
                      >
                        Reference page →
                      </Link>
                      <a
                        href="https://github.com/sokolgora-sketch/linguistic-decoder/issues/new"
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center rounded-[6px] border border-[#6a5a2a] bg-[#242016] px-3 py-1.5 ${MT.actionSm} text-[#f3d38b] transition hover:border-[#8a7636] hover:bg-[#2a2418] hover:text-[#fff1c2]`}
                      >
                        Report feedback ↗
                      </a>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-[6px] border border-[#6a5a2a] bg-transparent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f3d38b] transition hover:border-[#8a7636] hover:bg-[#1f1a12] hover:text-[#fff1c2]"
                        onClick={() => void onCopyPageLink()}
                      >
                        Copy page link
                      </button>
                    </div>
                  </div>
                  <p className={`${MT.heroBody} text-[#bac3d2]`}>
                    Deterministic scorer. Bring model outputs; ZË-RO scores them. No model calls. The workbench stays live-first, while reference and evidence stay nearby but out of the way.
                  </p>
                </div>

                <details className="rounded-[12px] border border-[#4a3a1b] bg-[#17130d]">
                  <summary className="cursor-pointer px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f3d38b] transition hover:bg-[#1f1a10] [&::-webkit-details-marker]:hidden">
                    {EVALS_BETA_INTRO_TITLE}
                  </summary>
                  <div className="px-4 pb-4 text-[12px] leading-6 text-[#d7cfbb]">
                    {EVALS_BETA_INTRO_BODY}
                  </div>
                </details>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[12px] border border-[#303845] bg-[#171c23] px-4 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d7deea]">
                      What to paste
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-[#aeb7c5]">
                      {EVALS_BETA_INTRO_HELP_1}
                    </div>
                  </div>

                  <div className="rounded-[12px] border border-[#303845] bg-[#171c23] px-4 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d7deea]">
                      Privacy
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-[#aeb7c5]">
                      {EVALS_BETA_INTRO_HELP_2}
                    </div>
                  </div>

                  <div className="rounded-[12px] border border-[#303845] bg-[#171c23] px-4 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d7deea]">
                      How it works
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-[#aeb7c5]">
                      {EVALS_BETA_INTRO_HELP_3}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>




          <section className="rounded-[10px] border border-[#333] bg-[#141414] px-6 py-6">
            <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_280px] xl:items-start">
              <aside className="space-y-6 xl:sticky xl:top-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={`${MT.fieldLabel} text-[#ededed]`}>
                Input mode
              </label>
              <select
                className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
              >
                <option value="run_bundle">
                  Full run bundle (evalRun.v0.1)
                </option>
                <option value="task_buckets">
                  Buckets only (wrap into a run)
                </option>
              </select>
            </div>

            <div>
              <label className={`${MT.fieldLabel} text-[#ededed]`}>
                {mode === "task_buckets"
                  ? "Task (Buckets only mode)"
                  : "Task source"}
              </label>
              <select
                className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666] disabled:opacity-35`}
                value={
                  mode === "task_buckets"
                    ? (selectedTask?.taskId ?? "")
                    : taskId
                }
                onChange={(e) => setTaskId(e.target.value)}
                disabled={mode !== "task_buckets"}
              >
                {(mode === "task_buckets" ? bucketsOnlyTasks : byoTasks).map(
                  (t) => (
                    <option key={t.taskId} value={t.taskId}>
                      {t.taskId} — {t.title}
                    </option>
                  ),
                )}
              </select>
              <div className={`${MT.helper} mt-2 text-[#a9a9a9]`}>
                {mode === "task_buckets"
                  ? "Select the task used to wrap V1..V7 bucket JSON into evalRun.v0.1."
                  : "Task comes from bundle. This selector is only used when wrapping buckets-only JSON."}
              </div>
            </div>
          </div>

          <details className="group overflow-hidden rounded-[8px] border border-[#6a5a2a] bg-[#1d1a12] transition hover:border-[#8a7636] open:border-l-2 open:border-l-[#d93333]">
            <summary
              className={`flex cursor-pointer list-none items-center justify-between gap-4 bg-[#221d14] px-[18px] py-[15px] ${MT.promptSummary} text-[#d7cfbb] transition hover:bg-[#2a2418] hover:text-[#fff1c2] [&::-webkit-details-marker]:hidden`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#cc0000]">▶</span>
                <span>
                  {mode === "task_buckets"
                    ? "TASK PROMPT — CLICK TO EXPAND & COPY TO MODEL"
                    : "TASK PROMPT — USED ONLY FOR BUCKETS-ONLY MODE"}
                </span>
              </div>
              <span className="text-[12px] text-[#b8a97a] transition-transform duration-200 group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="border-t border-[#6a5a2a] bg-[#1d1a12] px-5 py-5">
              <div className="mb-4 flex items-center justify-end">
                <button
                  type="button"
                  disabled={mode !== "task_buckets"}
                  onClick={() =>
                    void dfCopyText(
                      "Copied task prompt.",
                      selectedTask?.prompt ?? "(no task selected)",
                    )
                  }
                  className={`rounded-[4px] border border-[#6a5a2a] bg-transparent px-3 py-1.5 ${MT.actionSm} text-[#f3d38b] transition hover:border-[#8a7636] hover:bg-[#2a2418] hover:text-[#fff1c2] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#6a5a2a] disabled:hover:bg-transparent disabled:hover:text-[#f3d38b]`}
                >
                  Copy
                </button>
              </div>
              <pre
                className={`${MT.promptBody} whitespace-pre-wrap text-[#d7cfbb]`}
              >
                {mode === "task_buckets"
                  ? (selectedTask?.prompt ?? "(no task selected)")
                  : "Full run bundle mode expects task provenance to come from the uploaded evalRun.v0.1 bundle. Switch to Buckets only mode to copy a ZË-RO task prompt."}
              </pre>
            </div>
          </details>

            <div className="space-y-2">
              <div className={`${MT.sectionLabel} text-[#ededed]`}>
                Run metadata
              </div>
              <div className={`${MT.helper} text-[#a9a9a9]`}>
                Optional report metadata for this scored run.
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                <label className={`${MT.fieldLabel} text-[#ededed]`}>runId</label>
                <input
                    className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] font-mono text-[13px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                  value={runId}
                  onChange={(e) => setRunId(e.target.value)}
                />
              </div>

              <div>
                <label className={`${MT.fieldLabel} text-[#ededed]`}>
                  provider
                </label>
                <input
                  className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. openai"
                />
              </div>

              <div>
                <label className={`${MT.fieldLabel} text-[#ededed]`}>model</label>
                <input
                  className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. gpt-4o"
                />
              </div>

              <div>
                <label className={`${MT.fieldLabel} text-[#ededed]`}>label</label>
                <input
                  className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. fresh-chat"
                />
              </div>
            </div>


            <details className="group mt-6 overflow-hidden rounded-[8px] border border-[#2f3b46] bg-[#12181d]">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-4">
                <div className="space-y-2">
                  <div className={`${MT.sectionLabel} text-[#ededed]`}>
                    Upstream engine provenance
                  </div>
                  <div className={`${MT.helper} text-[#a9a9a9]`}>
                    Only fill sourceEngine* when the JSON being scored already came from an upstream ZË-RO engine/export.
                  </div>
                </div>
                <span className="text-[12px] text-[#b8a97a] transition-transform duration-200 group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="border-t border-[#2f3b46] px-4 py-4">
                {showAnalyzeV1Autofill ? (
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className={`${MT.actionUtility} border-[#444] bg-transparent text-[#b8b8b8] transition hover:border-[#777] hover:bg-[#1f1f1f] hover:text-[#f2f2f2]`}
                        onClick={autofillAnalyzeV1SourceEngine}
                        disabled={busy}
                      >
                        Autofill analyze-v1
                      </button>
                      <button
                        type="button"
                        className={`${MT.actionUtility} border-[#3a3a3a] bg-transparent text-[#9f9f9f] transition hover:border-[#666] hover:bg-[#171717] hover:text-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#3a3a3a] disabled:hover:bg-transparent disabled:hover:text-[#9f9f9f]`}
                        onClick={clearSourceEngineProvenance}
                        disabled={busy || !hasSourceEngineMeta}
                      >
                        Clear sourceEngine*
                      </button>
                    </div>
                    <div className={`${MT.helper} max-w-[340px] text-[#8f8f8f]`}>
                      Only use this when the JSON being scored was produced by the current /api/analyze-v1 route.
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <div className="md:col-span-2 xl:col-span-4 rounded-[8px] border border-[#2f3b46] bg-[#12181d] px-4 py-3">
                    <div className={`${MT.helper} text-[#b8c7d9]`}>
                      Leave sourceEngine* blank for hand-pasted buckets, external model outputs, or synthetic examples. The scorer cannot infer upstream engine provenance by itself.
                    </div>
                  </div>

                  <div>
                    <label className={`${MT.fieldLabel} text-[#ededed]`}>
                      sourceEngineId
                    </label>
                    <input
                      className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                      value={sourceEngineId}
                      onChange={(e) => setSourceEngineId(e.target.value)}
                      placeholder="e.g. zero-api"
                    />
                  </div>

                  <div>
                    <label className={`${MT.fieldLabel} text-[#ededed]`}>
                      sourceEngineVersion
                    </label>
                    <input
                      className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                      value={sourceEngineVersion}
                      onChange={(e) => setSourceEngineVersion(e.target.value)}
                      placeholder="e.g. analyze-v1"
                    />
                  </div>

                  <div>
                    <label className={`${MT.fieldLabel} text-[#ededed]`}>
                      sourceEngineBuild
                    </label>
                    <input
                      className={`w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                      value={sourceEngineBuild}
                      onChange={(e) => setSourceEngineBuild(e.target.value)}
                      placeholder="e.g. 845bb5a"
                    />
                  </div>
                </div>
              </div>
            </details>
              </aside>

              <div className="min-w-0 space-y-8">
          <div className="space-y-2">
            <div className={`${MT.sectionLabel} text-[#ededed]`}>
              Input source
            </div>
            <div className={`${MT.helper} text-[#a9a9a9]`}>
              Load a saved bundle or paste fresh JSON before scoring.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px] xl:items-start">
            <div className="rounded-[12px] border border-[#3a3a3a] bg-[#171717] px-6 py-6 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`${MT.fieldLabelInline} text-[#ededed]`}>
                  Upload JSON
                </span>
                <span className={`${MT.helper} text-[#a9a9a9]`}>
                  Use a saved eval bundle or buckets-only JSON.
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <label
                  className={`inline-flex cursor-pointer items-center rounded-[6px] border border-[#3a3a3a] bg-[#1e1e1e] px-4 py-3 ${MT.actionMd} text-[#dfdfdf] transition hover:border-[#666] hover:bg-[#252525] hover:text-white`}
                >
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setPickedFileName(file?.name ?? "");
                      void onPickFile(file);
                    }}
                    className="sr-only"
                  />
                  Choose JSON file
                </label>
                <span
                  className={`text-[12px] leading-6 ${pickedFileName ? "text-[#bdbdbd]" : "text-[#7d7d7d]"}`}
                >
                  {pickedFileName || "No JSON file selected"}
                </span>
              </div>

              <div className={`${MT.helper} mt-auto pt-6 text-[#c8c8c8]`}>
                Accepts full{" "}
                <span className="font-mono text-[#f2f2f2]">evalRun.v0.1</span>{" "}
                bundles or buckets-only JSON.
              </div>
            </div>
            <div className="rounded-[12px] border border-[#3a3a3a] bg-[#131313] px-6 py-6 h-full">
              <div className="space-y-1">
                <label className="block text-[14px] font-semibold uppercase tracking-[0.12em] text-[#ededed]">
                  Paste JSON
                </label>
                <div className={`${MT.helper} text-[#a9a9a9]`}>
                  Paste a full{" "}
                  <span className="font-mono text-[#d8d8d8]">evalRun.v0.1</span>{" "}
                  bundle or buckets-only{" "}
                  <span className="font-mono text-[#d8d8d8]">V1..V7</span> JSON.
                </div>
              </div>

              <textarea
                className="mt-3 min-h-[312px] w-full rounded-[8px] border border-[#3a3a3a] bg-[#101010] p-4 font-mono text-[15px] leading-[1.9] text-[#ededed] outline-none transition focus:border-[#555]"
                style={{
                  borderColor:
                    inputText.trim().length === 0
                      ? "#3a3a3a"
                      : inputProbe.kind === "invalid_json"
                        ? "#d93333"
                        : inputProbe.kind
                          ? "#16a34a"
                          : "#3a3a3a",
                  boxShadow:
                    inputText.trim().length === 0
                      ? "none"
                      : inputProbe.kind === "invalid_json"
                        ? "0 0 0 1px #d9333344"
                        : inputProbe.kind
                          ? "0 0 0 1px #16a34a44"
                          : "none",
                }}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  mode === "run_bundle"
                    ? '{ "evalRunVersion": "evalRun.v0.1", ... }'
                    : '{ "V1": ["token1", ...], "V2": [...], ... }'
                }
              />

              {inputText.trim() && inputProbe.kind !== "invalid_json" ? (
                <div
                  className={`mt-3 inline-flex items-center gap-2 rounded-full border border-[#21452a] bg-[#112017] px-3 py-2 ${MT.chipText} text-[#4ade80]`}
                >
                  <span className="h-[6px] w-[6px] rounded-full bg-[#16a34a]" />
                  JSON detected — ready to score
                </div>
              ) : null}
            </div>
            <div className="rounded-[12px] border border-[#2d4a34] bg-[#0d1410] px-6 py-6">
              <div className="space-y-1">
                <div className={`${MT.sectionLabel} text-[#ededed]`}>Run series</div>
                <div className={`${MT.helper} text-[#a9a9a9]`}>Create a new series or select an active one.</div>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label className={`${MT.fieldLabel} text-[#ededed]`}>Series label</label>
                  <input
                    className={`mt-1 w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                    value={seriesLabelDraft}
                    onChange={(e) => setSeriesLabelDraft(e.target.value)}
                    placeholder="fresh-chat"
                    disabled={busy}
                  />
                </div>
                <div>
                  <label className={`${MT.fieldLabel} text-[#ededed]`}>Target count</label>
                  <input
                    type="number" min="1" step="1"
                    className={`mt-1 w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                    value={seriesTargetCountDraft}
                    onChange={(e) => setSeriesTargetCountDraft(e.target.value)}
                    disabled={busy}
                  />
                </div>
                <div>
                  <label className={`${MT.fieldLabel} text-[#ededed]`}>Active series</label>
                  <select
                    className={`mt-1 w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                    value={selectedSeriesId}
                    onChange={(e) => setSelectedSeriesId(e.target.value)}
                    disabled={busy || runSeries.length === 0}
                  >
                    {runSeries.length === 0 ? (
                      <option value="">No series yet</option>
                    ) : (
                      runSeries.map((series) => (
                        <option key={series.id} value={series.id}>
                          {series.label} · next {series.nextOrdinal} / {series.targetCount}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <button
                  type="button"
                  className={`${MT.actionSecondary} w-full border-[#2d4f8f] bg-[#15233d] text-[#c7d9ff] transition hover:border-[#4b73bd] hover:bg-[#1a2b48] hover:text-white disabled:opacity-50`}
                  onClick={createRunSeries}
                  disabled={busy}
                >
                  Create Series
                </button>
              </div>
            </div>
            <div className="rounded-[12px] border border-[#1a2d1e] bg-[#0a100c] px-6 py-6">
              <div className="space-y-1">
                <div className={`${MT.sectionLabel} text-[#ededed]`}>Series actions</div>
                <div className={`${MT.helperCompact} text-[#9fb3a4]`}>Save next, export, or delete the active series.</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className={`${MT.actionSecondary} border-[#2d7f5a] bg-[#103224] text-[#c9f5df] transition hover:border-[#3ea776] hover:bg-[#17442f] hover:text-white disabled:opacity-50`} onClick={saveAndAdvanceSeries} disabled={busy || !selectedSeriesId || (!inputText.trim() && !report && !md)}>Save + Next Run</button>
                <button type="button" className={`${MT.actionWarn} border-[#6b3737] bg-[#211717] text-[#e6a0a0] transition hover:border-[#cc0000] hover:bg-[#2a1616] hover:text-[#ffc1c1] disabled:opacity-50`} onClick={deleteSelectedRunSeries} disabled={busy || !selectedSeriesId}>Delete Active Series</button>
                <button type="button" className={`${MT.actionSecondary} border-[#3f5a2f] bg-[#172111] text-[#d7f0c8] transition hover:border-[#5b7f43] hover:bg-[#1d2a15] hover:text-white disabled:opacity-50`} onClick={exportActiveSeriesCsv} disabled={busy || !selectedSeriesId}>Export JSON</button>
                <button type="button" className={`${MT.actionSecondary} border-[#3f5a2f] bg-[#172111] text-[#d7f0c8] transition hover:border-[#5b7f43] hover:bg-[#1d2a15] hover:text-white disabled:opacity-50`} onClick={exportActiveSeriesCsv} disabled={busy || !selectedSeriesId}>Export CSV</button>
                <button type="button" className={`${MT.actionUtility} border-[#355a7a] bg-transparent text-[#9fd3ff] transition hover:border-[#4d7fa8] hover:bg-[#132031] hover:text-[#d7eeff] disabled:opacity-50`} onClick={() => void onCopyGuidedBaselinePrompt()} disabled={busy}>Copy Baseline Prompt</button>
                <button type="button" className={`${MT.actionUtility} border-[#5a4b22] bg-transparent text-[#f1d48a] transition hover:border-[#8b7131] hover:bg-[#241d0f] hover:text-[#ffe6a8] disabled:opacity-50`} onClick={() => void onCopyGuidedCorrectionPrompt()} disabled={busy || !report || !guidedPrompt?.correctionPrompt}>Copy Correction Prompt</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={`${MT.actionPrimary} border-[#16a34a] bg-[#16a34a] text-white transition hover:border-[#15803d] hover:bg-[#15803d] hover:shadow-[0_0_0_1px_rgba(22,163,74,0.4),0_4px_16px_rgba(22,163,74,0.33)] disabled:cursor-not-allowed disabled:border-[#333] disabled:bg-[#111] disabled:text-[#333] disabled:shadow-none`}
                onClick={() => void onScore()}
                disabled={busy || !inputText.trim()}
              >
                {busy ? "Scoring…" : report ? "Scored ✓" : "Score run"}
              </button>

              <button
                type="button"
                className={`${MT.actionSecondary} border-[#555] bg-[#1a1a1a] text-[#e2e2e2] transition hover:border-[#777] hover:bg-[#202020] hover:text-white disabled:opacity-50`}
                onClick={() => resetWorkbench()}
                disabled={busy}
              >
                Reset Workbench
              </button>

                <button
                  type="button"
                  className={`${MT.actionSecondary} border-[#2d4f8f] bg-[#15233d] text-[#c7d9ff] transition hover:border-[#4b73bd] hover:bg-[#1a2b48] hover:text-white disabled:opacity-50`}
                  onClick={() => saveCurrentRun()}
                  disabled={busy || (!inputText.trim() && !report && !md)}
                >
                  Save Run
                </button>

              <button
                type="button"
                className={`${MT.actionWarn} border-[#6b3737] bg-[#211717] text-[#e6a0a0] transition hover:border-[#cc0000] hover:bg-[#2a1616] hover:text-[#ffc1c1] disabled:opacity-50`}
                onClick={() => void onDownloadPdf()}
                disabled={busy || !inputText.trim()}
              >
                Download PDF
              </button>

              <button
                type="button"
                className={`${MT.actionUtility} border-[#444] bg-transparent text-[#b8b8b8] transition hover:border-[#777] hover:bg-[#1f1f1f] hover:text-[#f2f2f2] disabled:opacity-50`}
                onClick={() => void onDownloadBundle()}
                disabled={busy || !inputText.trim()}
              >
                Download Bundle
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className={`${MT.actionUtility} border-[#444] bg-transparent text-[#b8b8b8] transition hover:border-[#777] hover:bg-[#1f1f1f] hover:text-[#f2f2f2] disabled:opacity-50`}
                onClick={() => void onCopyRawJson()}
                disabled={busy || !inputText.trim()}
              >
                Copy Raw JSON
              </button>

              <button
                type="button"
                className={`${MT.actionUtility} border-[#444] bg-transparent text-[#b8b8b8] transition hover:border-[#777] hover:bg-[#1f1f1f] hover:text-[#f2f2f2] disabled:opacity-50`}
                onClick={() => void onCopyCsvRow()}
                disabled={busy || !report}
              >
                Copy CSV Row
              </button>


              <div className="min-w-0 flex-1" />

              <button
                type="button"
                className={`${MT.actionUtility} border-dashed border-[#4a4a4a] bg-transparent text-[#c8c8c8] transition hover:border-[#777] hover:bg-[#1f1f1f] hover:text-white`}
                onClick={loadExample}
                disabled={busy}
              >
                Load example
              </button>
            </div>
          </div>
          {activeRunSeries ? (
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="rounded-full border border-[#7b6b2b] bg-[#211b0d] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f5e7b0]">
                {activeRunSeries.label}
              </span>
              <span className="rounded-full border border-[#4a4a4a] bg-[#121212] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#e6e6e6]">
                Next {activeSeriesNextOrdinal} / {activeRunSeries.targetCount}
              </span>
              <span className="rounded-full border border-[#2f5a3d] bg-[#102016] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#bfe8cc]">
                Saved {activeSeriesSavedCount}
              </span>
              <span className="rounded-full border border-[#2e4a37] bg-[#0f1512] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#def5e6]">
                Scored {activeSeriesScoredCount}
              </span>
              <span
                className={
                  activeSeriesExportReady
                    ? "rounded-full border border-[#2f5a3d] bg-[#0f1512] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#def5e6]"
                    : activeSeriesHasHardWarnings
                      ? "rounded-full border border-[#6b3737] bg-[#1e1414] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ffd1d1]"
                      : "rounded-full border border-[#5e4b22] bg-[#19140d] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f0ddb0]"
                }
              >
                Export {activeSeriesExportReady ? "ready" : "blocked"}
              </span>
            </div>
          ) : null}
          {activeRunSeries ? (
            <div className="mt-3 rounded-[10px] border border-[#2a3a2a] bg-[#0f1510] px-4 py-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-[6px] border border-[#303030] bg-[#101010] px-3 py-2">
                    <div className={`${MT.fieldLabel} text-[#9f9f9f]`}>RunId to save</div>
                    <div className="mt-1 overflow-x-auto font-mono text-[12px] text-[#ededed]">
                      {activeSeriesRunIdPreview || "—"}
                    </div>
                  </div>
                  <div className="rounded-[6px] border border-[#303030] bg-[#101010] px-3 py-2">
                    <div className={`${MT.fieldLabel} text-[#9f9f9f]`}>Label to save</div>
                    <div className="mt-1 overflow-x-auto font-mono text-[12px] text-[#ededed]">
                      {activeSeriesLabelPreview || "—"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className={`${MT.actionSecondary} border-[#2d7f5a] bg-[#103224] text-[#c9f5df] transition hover:border-[#3ea776] hover:bg-[#17442f] hover:text-white disabled:opacity-50`}
                  onClick={saveAndAdvanceSeries}
                  disabled={busy || !selectedSeriesId || (!inputText.trim() && !report && !md)}
                >
                  Save + Next Run
                </button>
              </div>
            </div>
          ) : null}
          <div className="space-y-3 pt-4">
            {mode === "run_bundle" && inputProbe.kind === "bucket_only" ? (
              <div className="rounded-[10px] border border-[#5b4a20] bg-[#1d1a12] px-5 py-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f3d38b]">
                      Input mismatch
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-[#d7cfbb]">
                      You are in{" "}
                      <span className="font-mono text-[#fff1c2]">
                        run_bundle
                      </span>{" "}
                      mode, but the input looks like bucketed tokens. Scoring
                      and PDF export will auto-wrap into{" "}
                      <span className="font-mono text-[#fff1c2]">
                        evalRun.v0.1
                      </span>
                      .
                    </div>
                  </div>

                  <button
                    className="rounded-[6px] border border-[#6a5a2a] bg-[#242016] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#f3d38b] transition hover:border-[#8a7636] hover:bg-[#2a2418] hover:text-[#fff1c2]"
                    type="button"
                    onClick={() => setMode("task_buckets")}
                  >
                    Switch mode
                  </button>
                </div>
              </div>
            ) : null}

            {(inputProbe.kind === "corpus70_meta" || notice || apiErr) ? (
              <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-3">
                {inputProbe.kind === "corpus70_meta" ? (
                  <div className="pointer-events-auto rounded-[10px] border border-[#5b3b3b] bg-[#1d1515] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f1b4b4]">
                      Unsupported input
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-[#d8c0c0]">
                      This looks like a Corpus70 meta-tags JSON. Evals expects either a full
                      <span className="font-mono text-[#ffe0e0]"> evalRun.v0.1 </span>
                      bundle or buckets keys V1..V7.
                    </div>
                  </div>
                ) : null}

                {apiErr ? (
                  <div className="pointer-events-auto rounded-[10px] border border-[#6a3d3d] bg-[#211717] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f2b0b0]">
                      Error <span className="font-mono text-[#ffe4e4]">{apiErr.code}</span>
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-[#e0c7c7]">{apiErr.message}</div>
                  </div>
                ) : null}

                {notice ? (
                  <div
                    className={
                      noticeIsWarn
                        ? "pointer-events-auto rounded-[10px] border border-[#6a3d3d] bg-[#211717] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                        : "pointer-events-auto rounded-[10px] border border-[#3e4a5b] bg-[#171b22] px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                    }
                  >
                    <div
                      className={
                        noticeIsWarn
                          ? "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f2b0b0]"
                          : "text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b8c7e8]"
                      }
                    >
                      {noticeIsWarn ? "Warning" : "Note"}
                    </div>
                    <div
                      className={
                        noticeIsWarn
                          ? "mt-1 text-[12px] leading-6 text-[#e0c7c7]"
                          : "mt-1 text-[12px] leading-6 text-[#d2d9e6]"
                      }
                    >
                      {notice}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        {busy || apiErr || report || readyToScore ? (
          <section className="space-y-8">
            <div
              className={`rounded-[12px] border px-6 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${stateToneClass}`}
            >
              <div className="flex flex-wrap items-center gap-5">
                <div
                  className={`${MT.actionMd} inline-flex items-center gap-2 text-white`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${stateDotClass}`}
                  />
                  {stateLabel}
                </div>

                {report ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-[12px]">
                      <span className="rounded-full border border-[#4a4a4a] bg-[#0f0f0f] px-3 py-1.5 text-[#ededed]">
                        provider{" "}
                        <span
                          className={`font-mono ${report.meta?.provider?.trim() ? "text-white" : "text-[#8f8f8f]"}`}
                        >
                          {report.meta?.provider?.trim()
                            ? report.meta.provider
                            : "not set"}
                        </span>
                      </span>
                      <span className="rounded-full border border-[#4a4a4a] bg-[#0f0f0f] px-3 py-1.5 text-[#ededed]">
                        model{" "}
                        <span
                          className={`font-mono ${report.meta?.model?.trim() ? "text-white" : "text-[#8f8f8f]"}`}
                        >
                          {report.meta?.model?.trim()
                            ? report.meta.model
                            : "not set"}
                        </span>
                      </span>
                      <span className="rounded-full border border-[#4a4a4a] bg-[#0f0f0f] px-3 py-1.5 text-[#ededed]">
                        label{" "}
                        <span
                          className={`font-mono ${report.meta?.label?.trim() ? "text-white" : "text-[#8f8f8f]"}`}
                        >
                          {report.meta?.label?.trim()
                            ? report.meta.label
                            : "not set"}
                        </span>
                      </span>
                    </div>
                    <div className="rounded-full border border-[#4a4a4a] bg-[#0f0f0f] px-3 py-2 font-mono text-[12px] text-[#f2f2f2]">
                        runId <span className="text-white">{report.runId}</span>
                      </div>
                    </>
                  ) : null}
                </div>

                {report ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-[11px] uppercase tracking-[0.12em] text-[#9f9f9f]">
                      Run context
                    </span>
                    <span className="rounded-full border border-[#3f3f3f] bg-[#0f0f0f] px-3 py-1.5 text-[#d7d7d7]">
                      upstreamEngine{" "}
                        <span
                          className={`font-mono ${report.meta?.sourceEngineVersion?.trim() ? "text-white" : "text-[#8f8f8f]"}`}
                        >
                          {report.meta?.sourceEngineVersion?.trim()
                            ? report.meta.sourceEngineVersion
                            : "not provided"}
                        </span>
                    </span>
                    <span className="rounded-full border border-[#3f3f3f] bg-[#0f0f0f] px-3 py-1.5 text-[#d7d7d7]">
                      taskId{" "}
                      <span className="font-mono text-white">
                        {devicePlateTaskId ?? "—"}
                      </span>
                    </span>
                    <span className="rounded-full border border-[#3f3f3f] bg-[#0f0f0f] px-3 py-1.5 text-[#d7d7d7]">
                      scorerBuild{" "}
                      <span className="font-mono text-white">
                        {devicePlateScorerBuild}
                      </span>
                    </span>
                    <span className="rounded-full border border-[#3f3f3f] bg-[#0f0f0f] px-3 py-1.5 text-[#d7d7d7]">
                      exportedAtUtc{" "}
                      <span className="font-mono text-white">
                        {devicePlateExportedAtUtc || "—"}
                      </span>
                    </span>
                  </div>
                ) : null}
              </div>

            <div className="space-y-1">
              <div className={`${MT.sectionLabel} text-[#adadad]`}>
                Scored summary
              </div>
              <div className={`${MT.helper} text-[#a9a9a9]`}>
                Signal, compliance, and bucket trend for the active run.
              </div>
            </div>

            {report && summaryTask ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`${MT.sectionLabel} text-[#ededed]`}>
                      Consistency (Spearman{" "}
                      <span className="normal-case">ρ</span>)
                    </div>
                    <div className="font-mono text-[20px] text-white">
                      {typeof summarySpearman === "number"
                        ? fmt(summarySpearman)
                        : "—"}
                    </div>
                  </div>
                  <div className="h-[6px] overflow-hidden rounded-full bg-[#252525]">
                    <div
                      className={`h-full rounded-full ${consistencyBarClass}`}
                      style={{ width: `${consistencyBarWidth}%` }}
                    />
                  </div>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#5a2424] bg-[#1b1111] px-4 py-2 text-[12px] uppercase tracking-[0.08em] text-[#f3b3b3]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#d93333]" />
                  <span>Expected direction</span>
                  <span className="font-mono text-[#ffe1e1]">
                    negative (V1→V7)
                  </span>
                </div>

                <div className={`${MT.helper} text-[#a9a9a9]`}>
                  Interpretation: more negative = stronger grounding · near 0 =
                  flat · positive = inversion.
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      key: "Pearson r",
                      value:
                        typeof summaryPearson === "number"
                          ? fmt(summaryPearson)
                          : "—",
                      note: "aperture primary",
                      tone: "border-t-[#16a34a]",
                    },
                    {
                      key: "Spearman ρ",
                      value:
                        typeof summarySpearman === "number"
                          ? fmt(summarySpearman)
                          : "—",
                      note: "aperture primary",
                      tone: "border-t-[#22c55e]",
                    },
                    {
                      key: "p_perm",
                      value:
                        typeof summaryPPerm === "number"
                          ? fmtP(summaryPPerm)
                          : "—",
                      note:
                        summaryPermItersPresence || summaryPermSeedPresence
                          ? `presenceMean · ${summaryPermItersPresence ?? "—"} iters · seed ${summaryPermSeedPresence ?? "—"}`
                          : summaryPermItersPrimary || summaryPermSeedPrimary
                            ? `primary · ${summaryPermItersPrimary ?? "—"} iters · seed ${summaryPermSeedPrimary ?? "—"}`
                            : "permutation",
                      tone: "border-t-[#f59e0b]",
                    },
                    {
                      key: "Compliance",
                      value: complianceText,
                      note: `${summaryCounts.validN} valid · ${summaryCounts.invalidN} invalid`,
                      tone: "border-t-[#3b82f6]",
                    },
                  ].map((card) => (
                    <div
                      key={card.key}
                      className={`rounded-[12px] border border-[#3a3a3a] border-t-[3px] bg-[#161616] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.14)] ${card.tone}`}
                    >
                      <div className={`${MT.statKey} text-[#e6e6e6]`}>
                        {card.key === "Spearman ρ" ? (
                          <>
                            Spearman <span className="normal-case">ρ</span>
                          </>
                        ) : (
                          card.key
                        )}
                      </div>
                      <div className={`${MT.statValue} mt-3 text-white`}>
                        {card.value}
                      </div>
                      <div className={`${MT.statNote} mt-2 text-[#d9d9d9]`}>
                        {card.note}
                      </div>
                    </div>
                  ))}
                </div>

                {(() => {
                  if (typeof summarySpearman !== "number") return null;

                  const diagnosis = getSpearmanDiagnosisMeta(summarySpearman);
                  if (!diagnosis) return null;

                  return (
                    <div
                      className="mt-5 flex flex-wrap items-center gap-4 rounded-[12px] border border-[#3a3a3a] bg-[#161616] px-5 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
                      title={diagnosis.hint}
                    >
                      <span
                        className="inline-block h-[8px] w-[8px] rounded-full"
                        style={{ backgroundColor: diagnosis.color }}
                      />
                      <span
                        className={MT.statKey}
                        style={{ color: diagnosis.color }}
                      >
                        {diagnosis.label}
                      </span>
                      <span className={`${MT.helper} text-[#ebebeb]`}>
                        {diagnosis.hint}
                      </span>
                    </div>
                  );
                })()}

                {summaryTask?.buckets?.length
                  ? (() => {
                      const buckets = summaryTask.buckets as Array<{
                        bucket: string;
                        mean_aperturePrimary?: number;
                      }>;

                      const pts = buckets.map((b, i) => {
                        const mean =
                          typeof b.mean_aperturePrimary === "number"
                            ? b.mean_aperturePrimary
                            : 0;

                        return {
                          label: b.bucket || `V${i + 1}`,
                          x: 96 + i * 68,
                          y: 170 - mean * 140,
                          mean,
                        };
                      });

                      const n = pts.length;
                      const sumX = pts.reduce((a, p) => a + p.x, 0);
                      const sumY = pts.reduce((a, p) => a + p.y, 0);
                      const sumXY = pts.reduce((a, p) => a + p.x * p.y, 0);
                      const sumXX = pts.reduce((a, p) => a + p.x * p.x, 0);
                      const denom = n * sumXX - sumX * sumX;
                      const m =
                        denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
                      const b0 = (sumY - m * sumX) / n;
                      const x1 = 96;
                      const x2 = pts[pts.length - 1]?.x ?? 96;
                      const pathD = pts
                        .map(
                          (p, i) => (i === 0 ? "M " : "L ") + p.x + " " + p.y,
                        )
                        .join(" ");

                      return (
                        <div className="mt-7 rounded-[12px] border border-[#3a3a3a] bg-[#101010] px-6 py-6 shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
                          <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#dddddd]">
                            Aperture trend by bucket
                          </div>
                          <div className="mb-1 text-[12px] leading-6 text-[#a8a8a8]">
                            Mean aperture score from V1 to V7.
                          </div>
                          <div className="mb-4 text-[11px] leading-6 text-[#8e8e8e]">
                            Solid path = bucket means · dashed path = linear
                            trend.
                          </div>

                          <svg viewBox="0 0 560 220" className="w-full">
                            <line
                              x1="58"
                              y1="20"
                              x2="58"
                              y2="182"
                              stroke="#333"
                              strokeWidth="1"
                            />
                            <line
                              x1="58"
                              y1="182"
                              x2="530"
                              y2="182"
                              stroke="#333"
                              strokeWidth="1"
                            />

                            {[0, 0.5, 1.0].map((v) => (
                              <g key={v}>
                                <line
                                  x1="58"
                                  y1={170 - v * 140}
                                  x2="530"
                                  y2={170 - v * 140}
                                  stroke="#1f1f1f"
                                  strokeWidth="1"
                                  strokeDasharray="3 4"
                                />
                                <text
                                  x="50"
                                  y={174 - v * 140}
                                  textAnchor="end"
                                  fill="#8a8a8a"
                                  fontSize="10"
                                  fontFamily="Inter, sans-serif"
                                >
                                  {v.toFixed(1)}
                                </text>
                              </g>
                            ))}

                            <path
                              d={pathD}
                              fill="none"
                              stroke="#f59aa4"
                              strokeWidth="1.75"
                              strokeLinejoin="round"
                              strokeLinecap="round"
                              opacity="0.95"
                            />

                            <line
                              x1={x1}
                              y1={m * x1 + b0}
                              x2={x2}
                              y2={m * x2 + b0}
                              stroke="#f87171"
                              strokeWidth="1.5"
                              strokeDasharray="5 4"
                              opacity="0.8"
                            />

                            {pts.map((p, i) => {
                              const bucketVoice =
                                (["A", "O", "E", "Ë", "U", "Y", "I"] as const)[
                                  i
                                ] ?? "I";
                              const dotColor =
                                COLORS_HEX_BY_VOICE_V0_1[bucketVoice];

                              return (
                                <g key={p.label}>
                                  <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="6"
                                    fill={dotColor}
                                    opacity="0.95"
                                  />
                                  <text
                                    x={p.x}
                                    y={p.y - 11}
                                    textAnchor="middle"
                                    fill="#d0d0d0"
                                    fontSize="10"
                                    fontFamily="Inter, sans-serif"
                                  >
                                    {p.mean.toFixed(3)}
                                  </text>
                                  <text
                                    x={p.x}
                                    y="202"
                                    textAnchor="middle"
                                    fill="#8f8f8f"
                                    fontSize="10"
                                    fontFamily="Inter, sans-serif"
                                  >
                                    {p.label}
                                  </text>
                                </g>
                              );
                            })}

                            <text
                              x="294"
                              y="216"
                              textAnchor="middle"
                              fill="#8f8f8f"
                              fontSize="11"
                              fontFamily="Inter, sans-serif"
                            >
                              Bucket rank
                            </text>
                          </svg>
                        </div>
                      );
                    })()
                  : null}
              </>
            ) : null}
            <details className="rounded-[10px] border border-[#2a3540] bg-[#0e1318]">
              <summary className="cursor-pointer px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9fb1bf] transition hover:bg-[#111820] hover:text-[#d0dce8] [&::-webkit-details-marker]:hidden">
                Series dashboard · run management
              </summary>
            <div className="space-y-3 pt-4">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
                    <div className="rounded-[10px] border border-[#33424a] bg-[#10151a] px-5 py-4">
                      <div className="space-y-1">
                        <div className={`${MT.sectionLabel} text-[#ededed]`}>
                          Series dashboard
                        </div>
                        <div className={`${MT.helper} text-[#9fb1bf]`}>
                          Compare all saved series before running, exporting, or cleaning up duplicates.
                        </div>
                      </div>

                        {(() => {
                          const activeSeries = getSelectedRunSeries();
                          if (!activeSeries) return null;

                          const rows = savedRuns
                            .filter((row) => row.seriesId === activeSeries.id)
                            .sort((a, b) => {
                              const ao = a.ordinal ?? Number.MAX_SAFE_INTEGER;
                              const bo = b.ordinal ?? Number.MAX_SAFE_INTEGER;
                              if (ao !== bo) return ao - bo;
                              return a.createdAt - b.createdAt;
                            });

                          const summary = summarizeEvalsBatterySeriesV0_1(activeSeries, rows);
                          if (!summary.scoredCount) return null;

                          const fmt = (value: number | null) =>
                            value == null ? "—" : value.toFixed(3);

                          const controlTone =
                            summary.controlFailCount > 0
                              ? "border-[#7f1d1d] bg-[#2a1111] text-[#fca5a5]"
                              : summary.controlWarnCount > 0
                                ? "border-[#6a5a2a] bg-[#242016] text-[#f3d38b]"
                                : "border-[#244234] bg-[#102017] text-[#9be3b1]";

                          return (
                            <div className="mt-4 rounded-[8px] border border-[#30414c] bg-[#0f151a] px-4 py-4">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <div className={`${MT.sectionLabel} text-[#ededed]`}>
                                    Active battery summary
                                  </div>
                                  <div className={`${MT.helper} text-[#9fb1bf]`}>
                                    {activeSeries.label} · {summary.scoredCount}/{summary.savedCount} scored · task {summary.mainTaskId ?? "—"}
                                  </div>
                                </div>
                                <div className={`rounded-full border px-3 py-1 text-[11px] font-medium ${controlTone}`}>
                                  controls clean {summary.controlCleanCount} · warn {summary.controlWarnCount} · fail {summary.controlFailCount}
                                </div>
                              </div>

                              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-[8px] border border-[#26323a] bg-[#12181d] px-3 py-3">
                                  <div className={`${MT.helper} text-[#9fb1bf]`}>Spearman ρ</div>
                                  <div className="mt-1 font-mono text-[13px] text-[#f2f2f2]">
                                    mean {fmt(summary.meanSpearmanRho)} · median {fmt(summary.medianSpearmanRho)}
                                  </div>
                                  <div className="mt-1 font-mono text-[12px] text-[#a9b8c5]">
                                    min {fmt(summary.minSpearmanRho)} · max {fmt(summary.maxSpearmanRho)}
                                  </div>
                                </div>

                                <div className="rounded-[8px] border border-[#26323a] bg-[#12181d] px-3 py-3">
                                  <div className={`${MT.helper} text-[#9fb1bf]`}>Pearson r</div>
                                  <div className="mt-1 font-mono text-[13px] text-[#f2f2f2]">
                                    mean {fmt(summary.meanPearsonR)} · median {fmt(summary.medianPearsonR)}
                                  </div>
                                  <div className="mt-1 font-mono text-[12px] text-[#a9b8c5]">
                                    min {fmt(summary.minPearsonR)} · max {fmt(summary.maxPearsonR)}
                                  </div>
                                </div>

                                <div className="rounded-[8px] border border-[#26323a] bg-[#12181d] px-3 py-3">
                                  <div className={`${MT.helper} text-[#9fb1bf]`}>Permutation p</div>
                                  <div className="mt-1 font-mono text-[13px] text-[#f2f2f2]">
                                    min {fmt(summary.minPPerm)} · max {fmt(summary.maxPPerm)}
                                  </div>
                                  <div className="mt-1 text-[12px] text-[#a9b8c5]">
                                    lower is stronger ladder signal
                                  </div>
                                </div>

                                <div className="rounded-[8px] border border-[#26323a] bg-[#12181d] px-3 py-3">
                                  <div className={`${MT.helper} text-[#9fb1bf]`}>Run spread</div>

                                  <div className="mt-2 min-w-0">
                                    <div className="text-[11px] uppercase tracking-[0.08em] text-[#9fb1bf]">
                                      strongest
                                    </div>
                                    <div
                                      className="mt-1 min-w-0 break-words font-mono text-[13px] leading-5 text-[#f2f2f2]"
                                      title={summary.strongestRunId ?? undefined}
                                    >
                                      {formatBatterySummaryRunIdV0_1(summary.strongestRunId)}
                                    </div>
                                  </div>

                                  <div className="mt-3 min-w-0">
                                    <div className="text-[11px] uppercase tracking-[0.08em] text-[#9fb1bf]">
                                      weakest
                                    </div>
                                    <div
                                      className="mt-1 min-w-0 break-words font-mono text-[12px] leading-5 text-[#a9b8c5]"
                                      title={summary.weakestRunId ?? undefined}
                                    >
                                      {formatBatterySummaryRunIdV0_1(summary.weakestRunId)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                      {operatorSeriesRows.length > 0 ? (
                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full border-separate border-spacing-0 text-left text-[12px]">
                            <thead>
                              <tr className="text-[#9fb1bf]">
                                <th className="border-b border-[#26323a] px-3 py-2 font-medium">Series</th>
                                <th className="border-b border-[#26323a] px-3 py-2 font-medium">Target</th>
                                <th className="border-b border-[#26323a] px-3 py-2 font-medium">Saved</th>
                                <th className="border-b border-[#26323a] px-3 py-2 font-medium">Scored</th>
                                <th className="border-b border-[#26323a] px-3 py-2 font-medium">Next</th>
                                <th className="border-b border-[#26323a] px-3 py-2 font-medium">Health</th>
                                <th className="border-b border-[#26323a] px-3 py-2 font-medium">Export</th>
                                <th className="border-b border-[#26323a] px-3 py-2 font-medium">Updated</th>
                              </tr>
                            </thead>
                            <tbody>
                              {operatorSeriesRows.map((row) => (
                                <tr
                                  key={row.id}
                                  className={row.isActive ? "bg-[#131c23]" : ""}
                                >
                                  <td className="border-b border-[#1f2a31] px-3 py-2 align-top">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <button
                                        type="button"
                                        className={`${MT.actionUtility} border-[#405766] bg-transparent text-[#cfe6ff] transition hover:border-[#5f8194] hover:bg-[#16202a] hover:text-white disabled:opacity-50`}
                                        onClick={() => {
                                          const next = runSeries.find((series) => series.id === row.id);
                                          if (!next) return;
                                          setSelectedSeriesId(next.id);
                                          prefillNextSeriesRun(next);
                                        }}
                                        disabled={busy}
                                      >
                                        Use
                                      </button>
                                      <span className="font-semibold text-[#ededed]">{row.label}</span>
                                      {row.isActive ? (
                                        <span className="rounded-full border border-[#49667a] bg-[#16232d] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#cfe6ff]">
                                          active
                                        </span>
                                      ) : null}
                                    </div>
                                  </td>
                                  <td className="border-b border-[#1f2a31] px-3 py-2 text-[#ededed]">{row.targetCount}</td>
                                  <td className="border-b border-[#1f2a31] px-3 py-2 text-[#ededed]">{row.savedCount}</td>
                                  <td className="border-b border-[#1f2a31] px-3 py-2 text-[#ededed]">{row.scoredCount}</td>
                                  <td className="border-b border-[#1f2a31] px-3 py-2 font-mono text-[#ededed]">{row.nextOrdinal}</td>
                                  <td className="border-b border-[#1f2a31] px-3 py-2">
                                    <span
                                      className={
                                        row.healthLabel === "hard warning"
                                          ? "rounded-full border border-[#6b3737] bg-[#1e1414] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#ffd1d1]"
                                          : row.healthLabel === "attention"
                                            ? "rounded-full border border-[#5e4b22] bg-[#19140d] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f0ddb0]"
                                            : "rounded-full border border-[#2f5a3d] bg-[#0f1512] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#def5e6]"
                                      }
                                    >
                                      {row.healthLabel}
                                    </span>
                                  </td>
                                  <td className="border-b border-[#1f2a31] px-3 py-2 text-[#ededed]">
                                    {row.exportReady ? "yes" : "no"}
                                  </td>
                                  <td className="border-b border-[#1f2a31] px-3 py-2 text-[#b8c7d9]">
                                    {new Date(row.updatedAt).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className={`${MT.helper} mt-4 text-[#9fb1bf]`}>
                          No series yet. Create one below to start the operator view.
                        </div>
                      )}
                    </div>
                  </div>

                <div
                  className={
                    activeRunSeries
                      ? activeSeriesHasHardWarnings
                        ? "rounded-[10px] border border-[#6b3737] bg-[#211717] px-5 py-4"
                        : activeSeriesNeedsAttention
                          ? "rounded-[10px] border border-[#5e4b22] bg-[#1b160d] px-5 py-4"
                          : "rounded-[10px] border border-[#2f5a3d] bg-[#101712] px-5 py-4"
                      : "rounded-[10px] border border-[#3b4f28] bg-[#11170e] px-5 py-4"
                  }
                >
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <div className={`${MT.sectionLabel} text-[#ededed]`}>
                        Active series status
                      </div>
                      <div
                        className={
                          activeRunSeries
                            ? activeSeriesHasHardWarnings
                              ? `${MT.helper} text-[#e0b3b3]`
                              : activeSeriesNeedsAttention
                                ? `${MT.helper} text-[#d6c59b]`
                                : `${MT.helper} text-[#b7d8c1]`
                            : `${MT.helper} text-[#a9b59a]`
                        }
                      >
                        {activeRunSeries
                          ? activeSeriesHasHardWarnings
                            ? "Duplicates or export blockers are present in the active series."
                            : activeSeriesNeedsAttention
                              ? "Series is in progress but still needs attention before export."
                              : "Series is clean and ready for export."
                          : "Create or select a series to surface live battery status here."}
                      </div>
                    </div>

                    {activeRunSeries ? (
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-[#7b6b2b] bg-[#211b0d] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f5e7b0]">
                          {activeRunSeries.label}
                        </span>
                        <span className="rounded-full border border-[#4a4a4a] bg-[#121212] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#e6e6e6]">
                          Next {activeSeriesNextOrdinal} / {activeRunSeries.targetCount}
                        </span>
                        <span className="rounded-full border border-[#2f5a3d] bg-[#102016] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#bfe8cc]">
                          Saved {activeSeriesSavedCount}
                        </span>
                        <span className="rounded-full border border-[#2e4a37] bg-[#0f1512] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#def5e6]">
                          Scored {activeSeriesScoredCount}
                        </span>
                        <span className="rounded-full border border-[#4d4631] bg-[#15120d] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f2e5bb]">
                          Unscored {activeSeriesUnscoredCount}
                        </span>
                        <span className="rounded-full border border-[#5a3a2f] bg-[#1c120f] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f0c3b4]">
                          Remaining {activeSeriesRemainingCount}
                        </span>
                        <span
                          className={
                            activeSeriesExportReady
                              ? "rounded-full border border-[#2f5a3d] bg-[#0f1512] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#def5e6]"
                              : activeSeriesHasHardWarnings
                                ? "rounded-full border border-[#6b3737] bg-[#1e1414] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ffd1d1]"
                                : "rounded-full border border-[#5e4b22] bg-[#19140d] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f0ddb0]"
                          }
                        >
                          Export {activeSeriesExportReady ? "ready" : "blocked"}
                        </span>
                        {activeSeriesDuplicateOrdinals.length > 0 || activeSeriesDuplicateRunIds.length > 0 ? (
                          <span className="rounded-full border border-[#6b3737] bg-[#1e1414] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ffd1d1]">
                            Duplicates
                          </span>
                        ) : null}
                        {activeSeriesMissingOrdinals.length > 0 ? (
                          <span className="rounded-full border border-[#5e4b22] bg-[#19140d] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f0ddb0]">
                            Missing ordinals
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#5a4c20] bg-[#18150d] px-5 py-4">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-1">
                      <div className={`${MT.sectionLabel} text-[#ededed]`}>
                        Battery operator
                      </div>
                      <div className={`${MT.helper} text-[#b9af8a]`}>
                        Inspect the exact run payload that will be saved into the active series.
                      </div>
                    </div>

                    {activeRunSeries ? (
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="grid gap-2 lg:grid-cols-2">
                          <div className="rounded-[8px] border border-[#303030] bg-[#101010] px-3 py-2">
                            <div className={`${MT.fieldLabel} text-[#9f9f9f]`}>RunId to save</div>
                            <div className="mt-1 overflow-x-auto font-mono text-[12px] text-[#ededed]">
                              {activeSeriesRunIdPreview || "—"}
                            </div>
                          </div>
                          <div className="rounded-[8px] border border-[#303030] bg-[#101010] px-3 py-2">
                            <div className={`${MT.fieldLabel} text-[#9f9f9f]`}>Label to save</div>
                            <div className="mt-1 overflow-x-auto font-mono text-[12px] text-[#ededed]">
                              {activeSeriesLabelPreview || "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`${MT.helper} text-[#b9af8a]`}>
                        No active series yet. Create or select a series to see live battery progress.
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={
                    activeRunSeries
                      ? activeSeriesHasHardWarnings
                        ? "rounded-[10px] border border-[#6b3737] bg-[#211717] px-5 py-4"
                        : activeSeriesNeedsAttention
                          ? "rounded-[10px] border border-[#5e4b22] bg-[#1b160d] px-5 py-4"
                          : "rounded-[10px] border border-[#2f5a3d] bg-[#101712] px-5 py-4"
                      : "rounded-[10px] border border-[#3b4f28] bg-[#11170e] px-5 py-4"
                  }
                >
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-1">
                      <div className={`${MT.sectionLabel} text-[#ededed]`}>
                        Series health
                      </div>
                      <div
                        className={
                          activeRunSeries
                            ? activeSeriesHasHardWarnings
                              ? `${MT.helper} text-[#e0b3b3}`
                              : activeSeriesNeedsAttention
                                ? `${MT.helper} text-[#d6c59b}`
                                : `${MT.helper} text-[#b7d8c1}`
                            : `${MT.helper} text-[#a9b59a}`
                        }
                      >
                        {activeRunSeries
                          ? activeSeriesHasHardWarnings
                            ? "Hard warning: duplicates detected in the active series."
                            : activeSeriesNeedsAttention
                              ? "Attention needed before the series is fully clean."
                              : "Series is clean and export-ready."
                          : "Read-only QA for the selected active series before export or battery completion."}
                      </div>
                    </div>

                    {activeRunSeries ? (
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-[8px] border border-[#35442a] bg-[#10140d] px-3 py-2">
                            <div className={`${MT.fieldLabel} text-[#93a286]`}>Saved</div>
                            <div className="mt-1 text-[13px] font-semibold text-[#f1f5ec]">
                              {activeSeriesSavedCount} / {activeRunSeries.targetCount}
                            </div>
                          </div>
                          <div className="rounded-[8px] border border-[#2e4a37] bg-[#0f1512] px-3 py-2">
                            <div className={`${MT.fieldLabel} text-[#8fb79d]`}>Scored</div>
                            <div className="mt-1 text-[13px] font-semibold text-[#def5e6]">
                              {activeSeriesScoredCount}
                            </div>
                          </div>
                          <div className="rounded-[8px] border border-[#4d4631] bg-[#15120d] px-3 py-2">
                            <div className={`${MT.fieldLabel} text-[#c0b287]`}>Unscored</div>
                            <div className="mt-1 text-[13px] font-semibold text-[#f2e5bb]">
                              {activeSeriesUnscoredCount}
                            </div>
                          </div>
                          <div
                            className={
                              activeSeriesHasHardWarnings
                                ? "rounded-[8px] border border-[#6b3737] bg-[#1e1414] px-3 py-2"
                                : activeSeriesNeedsAttention
                                  ? "rounded-[8px] border border-[#5e4b22] bg-[#19140d] px-3 py-2"
                                  : "rounded-[8px] border border-[#2f5a3d] bg-[#0f1512] px-3 py-2"
                            }
                          >
                            <div
                              className={
                                activeSeriesHasHardWarnings
                                  ? `${MT.fieldLabel} text-[#e0b0b0}`
                                  : activeSeriesNeedsAttention
                                    ? `${MT.fieldLabel} text-[#d6c59b}`
                                    : `${MT.fieldLabel} text-[#9fd0b0}`
                              }
                            >
                              Export ready
                            </div>
                            <div
                              className={
                                activeSeriesHasHardWarnings
                                  ? "mt-1 text-[13px] font-semibold text-[#ffd1d1]"
                                  : activeSeriesNeedsAttention
                                    ? "mt-1 text-[13px] font-semibold text-[#f0ddb0]"
                                    : "mt-1 text-[13px] font-semibold text-[#def5e6]"
                              }
                            >
                              {activeSeriesExportReady ? "yes" : "no"}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2 lg:grid-cols-3">
                          <div className="rounded-[8px] border border-[#303030] bg-[#101010] px-3 py-2">
                            <div className={`${MT.fieldLabel} text-[#9f9f9f]`}>Missing ordinals</div>
                            <div className="mt-1 text-[12px] leading-6 text-[#ededed]">
                              {formatOrdinalList(activeSeriesMissingOrdinals)}
                            </div>
                          </div>
                          <div
                            className={
                              activeSeriesDuplicateOrdinals.length > 0
                                ? "rounded-[8px] border border-[#6b3737] bg-[#1e1414] px-3 py-2"
                                : "rounded-[8px] border border-[#303030] bg-[#101010] px-3 py-2"
                            }
                          >
                            <div
                              className={
                                activeSeriesDuplicateOrdinals.length > 0
                                  ? `${MT.fieldLabel} text-[#e0b0b0}`
                                  : `${MT.fieldLabel} text-[#9f9f9f}`
                              }
                            >
                              Duplicate ordinals
                            </div>
                            <div
                              className={
                                activeSeriesDuplicateOrdinals.length > 0
                                  ? "mt-1 text-[12px] leading-6 text-[#ffd1d1]"
                                  : "mt-1 text-[12px] leading-6 text-[#ededed]"
                              }
                            >
                              {formatOrdinalList(activeSeriesDuplicateOrdinals)}
                            </div>
                          </div>
                          <div
                            className={
                              activeSeriesDuplicateRunIds.length > 0
                                ? "rounded-[8px] border border-[#6b3737] bg-[#1e1414] px-3 py-2"
                                : "rounded-[8px] border border-[#303030] bg-[#101010] px-3 py-2"
                            }
                          >
                            <div
                              className={
                                activeSeriesDuplicateRunIds.length > 0
                                  ? `${MT.fieldLabel} text-[#e0b0b0}`
                                  : `${MT.fieldLabel} text-[#9f9f9f}`
                              }
                            >
                              Duplicate runIds
                            </div>
                            <div
                              className={
                                activeSeriesDuplicateRunIds.length > 0
                                  ? "mt-1 overflow-x-auto text-[12px] leading-6 text-[#ffd1d1]"
                                  : "mt-1 overflow-x-auto text-[12px] leading-6 text-[#ededed]"
                              }
                            >
                              {formatRunIdList(activeSeriesDuplicateRunIds)}
                            </div>
                          </div>
                        </div>

                        {activeSeriesHealthReasons.length > 0 ? (
                          <div
                            className={
                              activeSeriesHasHardWarnings
                                ? "rounded-[8px] border border-[#6b3737] bg-[#1e1414] px-3 py-2"
                                : "rounded-[8px] border border-[#5e4b22] bg-[#19140d] px-3 py-2"
                            }
                          >
                            <div
                              className={
                                activeSeriesHasHardWarnings
                                  ? `${MT.fieldLabel} text-[#e0b0b0}`
                                  : `${MT.fieldLabel} text-[#d6c59b}`
                              }
                            >
                              Why export is blocked / not clean
                            </div>
                            <ul
                              className={
                                activeSeriesHasHardWarnings
                                  ? "mt-1 list-disc space-y-1 pl-5 text-[12px] leading-6 text-[#ffd1d1]"
                                  : "mt-1 list-disc space-y-1 pl-5 text-[12px] leading-6 text-[#f0ddb0]"
                              }
                            >
                              {activeSeriesHealthReasons.map((reason) => (
                                <li key={reason}>{reason}</li>
                              ))}
                            </ul>

                            {activeSeriesHasHardWarnings ? (
                              <div className="mt-3 flex flex-wrap gap-3">
                                <button
                                  type="button"
                                  className={`${MT.actionWarn} border-[#8a4a4a] bg-[#2a1717] text-[#ffd1d1] transition hover:border-[#d85858] hover:bg-[#361818] hover:text-white disabled:opacity-50`}
                                  onClick={cleanupActiveSeriesDuplicates}
                                  disabled={busy || activeSeriesDuplicateCleanupPlan.removeCount === 0}
                                >
                                  Delete Later Duplicates ({activeSeriesDuplicateCleanupPlan.removeCount})
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className={`${MT.helper} text-[#a9b59a]`}>
                        No active series yet. Create or select a series to view QA health.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#2d4a34] bg-[#101712] px-5 py-4">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <div className={`${MT.sectionLabel} text-[#ededed]`}>
                        Run series
                      </div>
                      <div className={`${MT.helper} text-[#a9a9a9]`}>
                        Default target count is 15, but you can use any positive integer.
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4">
                      <div className="grid gap-3 xl:grid-cols-[minmax(180px,1fr)_120px_minmax(220px,1fr)_auto] xl:items-end">
                        <div>
                          <label className={`${MT.fieldLabel} text-[#ededed]`}>
                            Series label
                          </label>
                          <input
                            className={`mt-1 w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                            value={seriesLabelDraft}
                            onChange={(e) => setSeriesLabelDraft(e.target.value)}
                            placeholder="fresh-chat"
                            disabled={busy}
                          />
                        </div>

                        <div>
                          <label className={`${MT.fieldLabel} text-[#ededed]`}>
                            Target count
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            className={`mt-1 w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                            value={seriesTargetCountDraft}
                            onChange={(e) => setSeriesTargetCountDraft(e.target.value)}
                            disabled={busy}
                          />
                        </div>

                        <div>
                          <label className={`${MT.fieldLabel} text-[#ededed]`}>
                            Active series
                          </label>
                          <select
                            className={`mt-1 w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[11px] ${MT.fieldControl} text-[#e6e6e6] outline-none transition focus:border-[#666]`}
                            value={selectedSeriesId}
                            onChange={(e) => setSelectedSeriesId(e.target.value)}
                            disabled={busy || runSeries.length === 0}
                          >
                            {runSeries.length === 0 ? (
                              <option value="">No series yet</option>
                            ) : (
                              runSeries.map((series) => (
                                <option key={series.id} value={series.id}>
                                  {series.label} · next {series.nextOrdinal} / {series.targetCount}
                                </option>
                              ))
                            )}
                          </select>
                        </div>

                        <button
                          type="button"
                          className={`${MT.actionSecondary} border-[#2d4f8f] bg-[#15233d] text-[#c7d9ff] transition hover:border-[#4b73bd] hover:bg-[#1a2b48] hover:text-white disabled:opacity-50`}
                          onClick={createRunSeries}
                          disabled={busy}
                        >
                          Create Series
                        </button>
                      </div>

                      <div className="rounded-[8px] border border-[#2d4a34] bg-[#0f1512] px-4 py-4">
                        <div className="space-y-1">
                          <div className={`${MT.fieldLabel} text-[#ededed]`}>
                            Series actions
                          </div>
                          <div className={`${MT.helperCompact} text-[#9fb3a4]`}>
                            Save the next checkpoint, manage the active series, or export operator files.
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            className={`${MT.actionSecondary} border-[#2d7f5a] bg-[#103224] text-[#c9f5df] transition hover:border-[#3ea776] hover:bg-[#17442f] hover:text-white disabled:opacity-50`}
                            onClick={saveAndAdvanceSeries}
                            disabled={busy || !selectedSeriesId || (!inputText.trim() && !report && !md)}
                          >
                            Save + Next Run
                          </button>

                          <button
                            type="button"
                            className={`${MT.actionWarn} border-[#6b3737] bg-[#211717] text-[#e6a0a0] transition hover:border-[#cc0000] hover:bg-[#2a1616] hover:text-[#ffc1c1] disabled:opacity-50`}
                            onClick={deleteSelectedRunSeries}
                            disabled={busy || !selectedSeriesId}
                          >
                            Delete Active Series
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3">
                          <button
                            type="button"
                            className={`${MT.actionSecondary} border-[#3f5a2f] bg-[#172111] text-[#d7f0c8] transition hover:border-[#5b7f43] hover:bg-[#1d2a15] hover:text-white disabled:opacity-50`}
                            onClick={exportActiveSeriesCsv}
                            disabled={busy || !selectedSeriesId}
                          >
                            Export Active Series CSV
                          </button>

                          <button
                            type="button"
                            className={`${MT.actionSecondary} border-[#30465d] bg-[#101b28] text-[#cfe6ff] transition hover:border-[#46698f] hover:bg-[#162434] hover:text-white disabled:opacity-50`}
                            onClick={exportActiveSeriesJson}
                            disabled={busy || !selectedSeriesId}
                          >
                            Export Active Series JSON
                          </button>

                          <button
                            type="button"
                            className={`${MT.actionSecondary} border-[#5b4a2a] bg-[#1c150d] text-[#f3dfb7] transition hover:border-[#8a7345] hover:bg-[#261c11] hover:text-white disabled:opacity-50`}
                            onClick={exportAllSeriesCsv}
                            disabled={busy || savedRuns.length === 0}
                          >
                            Export All Series CSV
                          </button>

                          <button
                            type="button"
                            className={`${MT.actionUtility} border-[#355a7a] bg-transparent text-[#9fd3ff] transition hover:border-[#4d7fa8] hover:bg-[#132031] hover:text-[#d7eeff] disabled:opacity-50`}
                            onClick={() => void onCopyGuidedBaselinePrompt()}
                            disabled={busy}
                          >
                            Copy Baseline Prompt
                          </button>

                          <button
                            type="button"
                            className={`${MT.actionUtility} border-[#5a4b22] bg-transparent text-[#f1d48a] transition hover:border-[#8b7131] hover:bg-[#241d0f] hover:text-[#ffe6a8] disabled:opacity-50`}
                            onClick={() => void onCopyGuidedCorrectionPrompt()}
                            disabled={busy || !report || !guidedPrompt?.correctionPrompt}
                          >
                            Copy Correction Prompt
                          </button>

                          <span
                            className={`rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] ${guidedPromptTone}`}
                            title={
                              guidedPrompt
                                ? `guided prompt level: ${guidedPrompt.level}`
                                : "guided prompt unavailable until a scored report exists"
                            }
                          >
                            guided {guidedPrompt?.level ?? "n/a"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              <div className="rounded-[10px] border border-[#2f3b46] bg-[#12181d] px-5 py-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div className="space-y-1">
                    <div className={`${MT.sectionLabel} text-[#ededed]`}>
                      Saved runs
                    </div>
                    <div className={`${MT.helper} text-[#a9a9a9]`}>
                      Open a previously saved run checkpoint after reload or reset.
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4">
                      <div className="space-y-2">
                        <label className={`${MT.fieldLabel} text-[#ededed]`}>
                          Open Saved Run
                        </label>

                        {savedRunSeriesGroups.length === 0 ? (
                          <div className="rounded-[8px] border border-dashed border-[#3a3a3a] bg-[#151515] px-3 py-3 text-sm text-[#9fb1bf]">
                            No saved runs yet
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {savedRunSeriesGroups.map((group) => (
                              <details
                                key={group.id}
                                className="overflow-hidden rounded-[8px] border border-[#2f3b46] bg-[#151a1f]"
                                open={openSavedRunGroupIds.includes(group.id)}
                                onToggle={(e) => {
                                  const isOpen = (e.currentTarget as HTMLDetailsElement).open;
                                  setOpenSavedRunGroupIds((prev) => {
                                    const next = new Set(prev);
                                    if (isOpen) next.add(group.id);
                                    else next.delete(group.id);
                                    return Array.from(next);
                                  });
                                }}
                              >
                                <summary className="cursor-pointer list-none px-3 py-3 transition hover:bg-[#192028] [&::-webkit-details-marker]:hidden">
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="truncate text-sm font-semibold text-[#ededed]">
                                        {group.label}
                                      </div>
                                      <div className="mt-1 text-xs text-[#9fb1bf]">
                                        {group.runCount} run{group.runCount === 1 ? "" : "s"} · created{" "}
                                        {new Date(group.createdAt).toLocaleString()} · updated{" "}
                                        {new Date(group.updatedAt).toLocaleString()}
                                      </div>
                                    </div>
                                    <div className="rounded-full border border-[#355a7a] bg-[#111a24] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9fd3ff]">
                                      {group.seriesId ? "series" : "unassigned"}
                                    </div>
                                  </div>
                                </summary>

                                <div className="border-t border-[#26313a] px-3 py-3">
                                  <div className="space-y-2">
                                    {group.rows.map((row) => {
                                      const selected = row.id === selectedSavedRunId;
                                      return (
                                        <button
                                          key={row.id}
                                          type="button"
                                          onClick={() => setSelectedSavedRunId(row.id)}
                                          className={`w-full rounded-[8px] border px-3 py-3 text-left transition ${
                                            selected
                                              ? "border-[#5c8db8] bg-[#132031] text-white"
                                              : "border-[#313131] bg-[#171717] text-[#d6d6d6] hover:border-[#555] hover:bg-[#1d1d1d] hover:text-white"
                                          }`}
                                        >
                                          <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="min-w-0">
                                              <div className="truncate text-sm font-medium">
                                                {row.title}
                                              </div>
                                              <div className="mt-1 text-xs text-[#9fb1bf]">
                                                {typeof row.ordinal === "number" ? formatSeriesOrdinal(row.ordinal) : "no ordinal"} · {row.id.slice(0, 8)}
                                              </div>
                                            </div>
                                            <div className="text-right text-xs text-[#9fb1bf]">
                                              <div>saved {new Date(row.createdAt).toLocaleString()}</div>
                                              <div>updated {new Date(row.updatedAt).toLocaleString()}</div>
                                            </div>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </details>
                            ))}
                          </div>
                        )}

                        <div className={`${MT.helperCompact} text-[#9fb1bf]`}>
                          Saved runs are frozen workbench checkpoints grouped by series so you can reopen them after reset or reload.
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className={`${MT.actionSecondary} border-[#555] bg-[#1a1a1a] text-[#e2e2e2] transition hover:border-[#777] hover:bg-[#202020] hover:text-white disabled:opacity-50`}
                        onClick={openSelectedSavedRun}
                        disabled={busy || !selectedSavedRunId}
                      >
                        Open Saved Run
                      </button>

                      <button
                        type="button"
                        className={`${MT.actionWarn} border-[#6b3737] bg-[#211717] text-[#e6a0a0] transition hover:border-[#cc0000] hover:bg-[#2a1616] hover:text-[#ffc1c1] disabled:opacity-50`}
                        onClick={deleteSelectedSavedRun}
                        disabled={busy || !selectedSavedRunId}
                      >
                        Delete Saved Run
                      </button>
                    </div>
                  </div>
                </div>
              </div>



            </details>
          </section>
        ) : null}

        {report ? (
          <section className="space-y-8 pt-6">
            <details className="rounded-[12px] border border-[#2a2a2a] bg-[#151515]">
              <summary className="cursor-pointer px-6 py-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#adadad] transition hover:bg-[#1a1a1a] hover:text-[#d0d0d0] [&::-webkit-details-marker]:hidden">
                Report · bundle metadata · markdown export
              </summary>
              <div className="px-6 pb-6">

              <div className="mt-5 rounded-[10px] border border-[#262626] bg-[#101010] px-5 py-4">
                <div className="space-y-1">
                  <div className={`${MT.sectionLabel} text-[#dfdfdf]`}>
                    Run metadata snapshot
                  </div>
                  <div className={`${MT.helperCompact} text-[#9c9c9c]`}>
                    High-level identifiers for the active report before the detailed device plate.
                  </div>
                </div>

                <div
                  className={`mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 ${MT.markdownMeta} text-[#d8d8d8]`}
                >
                  <span>
                    specId:{" "}
                    <span className="font-mono text-[#e5e5e5]">
                      {report.specId}
                    </span>
                  </span>
                  <span>
                    evalSpecVersion:{" "}
                    <span className="font-mono text-[#e5e5e5]">
                      {report.evalSpecVersion}
                    </span>
                  </span>
                  <span>
                    runId:{" "}
                    <span className="font-mono text-[#e5e5e5]">
                      {report.runId}
                    </span>
                  </span>
                </div>

                <div
                  className={`mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 ${MT.markdownMeta} text-[#d0d0d0]`}
                >
                  <span>
                    provider:{" "}
                    <span
                      className={`font-mono ${report.meta?.provider?.trim() ? "text-[#f2f2f2]" : "text-[#8f8f8f]"}`}
                    >
                      {report.meta?.provider?.trim()
                        ? report.meta.provider
                        : "not set"}
                    </span>
                  </span>
                  <span>
                    model:{" "}
                    <span
                      className={`font-mono ${report.meta?.model?.trim() ? "text-[#f2f2f2]" : "text-[#8f8f8f]"}`}
                    >
                      {report.meta?.model?.trim() ? report.meta.model : "not set"}
                    </span>
                  </span>
                  <span>
                    label:{" "}
                    <span
                      className={`font-mono ${report.meta?.label?.trim() ? "text-[#f2f2f2]" : "text-[#8f8f8f]"}`}
                    >
                      {report.meta?.label?.trim() ? report.meta.label : "not set"}
                    </span>
                  </span>
                </div>

                <div
                  className={`mt-2 flex flex-wrap items-center gap-x-6 gap-y-3 ${MT.markdownMeta} text-[#d0d0d0]`}
                >
                  <span>
                    sourceEngineId:{" "}
                    <span
                      className={`font-mono ${report.meta?.sourceEngineId?.trim() ? "text-[#f2f2f2]" : "text-[#8f8f8f]"}`}
                    >
                      {report.meta?.sourceEngineId?.trim()
                        ? report.meta.sourceEngineId
                        : "not set"}
                    </span>
                  </span>
                  <span>
                    sourceEngineVersion:{" "}
                    <span
                      className={`font-mono ${report.meta?.sourceEngineVersion?.trim() ? "text-[#f2f2f2]" : "text-[#8f8f8f]"}`}
                    >
                      {report.meta?.sourceEngineVersion?.trim()
                        ? report.meta.sourceEngineVersion
                        : "not set"}
                    </span>
                  </span>
                  <span>
                    sourceEngineBuild:{" "}
                    <span
                      className={`font-mono ${report.meta?.sourceEngineBuild?.trim() ? "text-[#f2f2f2]" : "text-[#8f8f8f]"}`}
                    >
                      {report.meta?.sourceEngineBuild?.trim()
                        ? report.meta.sourceEngineBuild
                        : "not set"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-[10px] border border-[#2f2f2f] bg-[#101010] px-5 py-5">
                <div className={`${MT.sectionLabel} text-[#dfdfdf]`}>
                  Device plate
                </div>

                <div
                  className={`mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 ${MT.markdownMeta} text-[#d8d8d8]`}
                >
                  <span>
                    engineVersion:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      scoreEvalRun.v0.1
                    </span>
                  </span>
                  <span>
                    evalSpecVersion:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {report.evalSpecVersion}
                    </span>
                  </span>
                  <span>
                    taskId:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {devicePlateTaskId ?? "—"}
                    </span>
                  </span>

                  <span>
                    taskVersion:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {devicePlateTaskVersion}
                    </span>
                  </span>

                  <span>
                    promptHash:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {devicePlatePromptHash}
                    </span>
                  </span>
                  <span>
                    exportedAtUtc:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {devicePlateExportedAtUtc}
                    </span>
                  </span>
                  <span>
                    seedPrimary:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {summaryPermSeedPrimary ?? "—"}
                    </span>
                  </span>
                  <span>
                    seedPresenceMean:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {summaryPermSeedPresence ?? "—"}
                    </span>
                  </span>
                </div>

                <div
                  className={`mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 ${MT.markdownMeta} text-[#d0d0d0]`}
                >
                  <span>
                    permItersPrimary:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {summaryPermItersPrimary ?? "—"}
                    </span>
                  </span>
                  <span>
                    permItersPresenceMean:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {summaryPermItersPresence ?? "—"}
                    </span>
                  </span>
                  <span>
                    scorerBuild:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      {devicePlateScorerBuild}
                    </span>
                  </span>
                  <span>
                    baselineRef:{" "}
                    <span className="font-mono text-[#f2f2f2]">
                      paper.v0.1 · LingBuzz/009799 · LingBuzz/009808
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[10px] border border-[#262626] bg-[#101010]">
                <div className="flex items-center justify-between gap-4 border-b border-[#262626] px-5 py-4">
                  <div className="space-y-1">
                    <div className={`${MT.sectionLabel} text-[#dfdfdf]`}>
                      Markdown export preview
                    </div>
                    <div className={`${MT.helperCompact} text-[#9c9c9c]`}>
                      Rendered report text ready to copy.
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`rounded-[4px] border border-[#333] bg-transparent px-3 py-1.5 ${MT.actionSm} text-[#b8b8b8] transition hover:border-[#666] hover:text-white disabled:opacity-40`}
                    onClick={() =>
                      void dfCopyText("Copied markdown report.", md || "")
                    }
                    disabled={!md}
                  >
                    Copy
                  </button>
                </div>
                <pre
                  className={`overflow-x-auto whitespace-pre-wrap bg-[#0c0c0c] px-5 py-5 ${MT.markdownBody} text-[#d7d7d7]`}
                >
                  {md || "(empty)"}
                </pre>
              </div>
              </div>
            </details>

            <details className="rounded-[10px] border border-[#2a3540] bg-[#0e1318]">
              <summary className="cursor-pointer px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9fb1bf] transition hover:bg-[#111820] hover:text-[#d0dce8] [&::-webkit-details-marker]:hidden">
                Task reports · per-task breakdown
              </summary>
              <div className="space-y-7 px-5 pb-5">
                <section className="space-y-3">
                  <div className="space-y-1">
                    <div className={`${MT.sectionLabel} text-[#d6eadb]`}>
                      Primary scored tasks
                    </div>
                    <div className="text-[12px] leading-6 text-[#9bb5aa]">
                      Direct reports for the uploaded or wrapped task input.
                    </div>
                  </div>
                  {report.tasks
                    .filter((t) => t.kind === "byo")
                    .map((t) => (
                      <TaskCard key={t.taskId} t={t} />
                    ))}
                </section>

              {report.tasks.some((t) => t.kind !== "byo") ? (
                <section className="mt-3 rounded-[12px] border border-[#303030] bg-[#171717] px-5 py-5 space-y-4">
                  <div className="space-y-1">
                    <div className={`${MT.sectionLabel} text-[#b3b3b3]`}>
                      Validation controls
                    </div>
                    <div className="text-[12px] leading-6 text-[#b8b8b8]">
                      Derived checks and negative controls stay visible here as
                      supporting evidence.
                    </div>
                  </div>
                  <div className="space-y-3">
                    {report.tasks
                      .filter((t) => t.kind !== "byo")
                      .map((t) => (
                        <TaskCard key={t.taskId} t={t} />
                      ))}
                  </div>
                </section>
              ) : null}
              </div>
            </details>
          </section>
        ) : null}
              </div>
              <aside className="hidden xl:block xl:sticky xl:top-[96px] xl:self-start">
                <div className="rounded-[10px] border border-[#33424a] bg-[#10151a] px-5 py-4">
                  <div className="space-y-1">
                    <div className={`${MT.sectionLabel} text-[#ededed]`}>
                      Operator checklist
                    </div>
                    <div className={`${MT.helper} text-[#9fb1bf]`}>
                      Read top to bottom before starting or exporting a battery run.
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {operatorChecklistItems.map((item) => (
                      <div
                        key={item.key}
                        className="rounded-[8px] border border-[#26323a] bg-[#0d1216] px-3 py-2"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={
                              item.tone === "good"
                                ? "mt-[5px] h-2.5 w-2.5 rounded-full bg-[#6fc18a]"
                                : item.tone === "bad"
                                  ? "mt-[5px] h-2.5 w-2.5 rounded-full bg-[#d46a6a]"
                                  : "mt-[5px] h-2.5 w-2.5 rounded-full bg-[#e6c16a]"
                            }
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[12px] font-semibold text-[#ededed]">{item.label}</div>
                            <div className="mt-1 break-words text-[12px] leading-6 text-[#b8c7d9]">{item.note}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {activeRunSeries ? (
                  <div className="mt-3 rounded-[10px] border border-[#2a3a2a] bg-[#0f1510] px-4 py-3">
                    <div className="space-y-1">
                      <div className={`${MT.sectionLabel} text-[#ededed]`}>Series health</div>
                      <div className={`${MT.helper} text-[#9fb1bf]`}>{activeRunSeries.label}</div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-[#2f5a3d] bg-[#102016] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#bfe8cc]">
                        Scored {activeSeriesScoredCount}
                      </span>
                      <span className="rounded-full border border-[#4a4a4a] bg-[#121212] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#e6e6e6]">
                        {activeSeriesRemainingCount} left
                      </span>
                      <span
                        className={
                          activeSeriesExportReady
                            ? "rounded-full border border-[#2f5a3d] bg-[#0f1512] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#def5e6]"
                            : activeSeriesHasHardWarnings
                              ? "rounded-full border border-[#6b3737] bg-[#1e1414] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#ffd1d1]"
                              : "rounded-full border border-[#5e4b22] bg-[#19140d] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f0ddb0]"
                        }
                      >
                        Export {activeSeriesExportReady ? "ready" : "blocked"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
        </section>
      </main>
    </div>
  );
}
