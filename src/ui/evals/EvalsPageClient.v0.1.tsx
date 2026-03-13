"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import type { EvalReportBundleV0_1, EvalTaskReportV0_1 } from "@/shared/evals/report.v0.1";

type ApiOk = { ok: true; report: EvalReportBundleV0_1; md: string };
type ApiErr = { ok: false; code: string; message: string };


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
    return { kind: "invalid_json", error: (e instanceof Error ? e.message : String(e)) };
  }
  if (looksLikeBucketsOnly(parsed)) return { kind: "bucket_only", parsed };
  if (looksLikeCorpus70Meta(parsed)) return { kind: "corpus70_meta", parsed: parsed as any };
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

const EVALS_PAPER_SNAPSHOTS = [
  {
    id: "paper1",
      tabLabel: "FRESH-CHAT",
      tabDetail: "12 independent sessions per provider",
      title: "Fresh-chat · n=12 runs each",
    summary: "Source: LingBuzz/009799",
    badges: ["fresh-chat", "paper v0.1", "snapshot"],
    providers: [
      {
        provider: "OpenAI",
        model: "chatgpt-5-2-thinking",
        bestDisplay: "−0.871",
        bestMagnitude: 0.871,
        meanDisplay: "−0.775",
      },
      {
        provider: "DeepSeek",
        model: "deepseek-thinking",
        bestDisplay: "−0.808",
        bestMagnitude: 0.808,
        meanDisplay: "−0.362",
      },
      {
        provider: "xAI",
        model: "grok-expert",
        bestDisplay: "−0.759",
        bestMagnitude: 0.759,
        meanDisplay: "−0.225",
      },
      {
        provider: "Google",
        model: "gemini-3-thinking",
        bestDisplay: "−0.706",
        bestMagnitude: 0.706,
        meanDisplay: "−0.238",
      },
      {
        provider: "Anthropic",
        model: "claude-4.6-sonnet-extended",
        bestDisplay: "−0.393",
        bestMagnitude: 0.393,
        meanDisplay: "−0.096",
      },
    ],
  },
  {
    id: "paper2",
      tabLabel: "SAME-THREAD",
      tabDetail: "10 sequential turns per provider",
      title: "Same-thread · n=10 runs each",
    summary: "Source: LingBuzz/009808",
    badges: ["same-thread", "paper v0.1", "snapshot"],
    providers: [
      {
        provider: "xAI",
        model: "grok-expert",
        bestDisplay: "−0.917",
        bestMagnitude: 0.917,
        meanDisplay: "−0.559",
        regimeLabel: "stabilization/re-lock",
        regimeTone: "good",
      },
      {
        provider: "OpenAI",
        model: "chatgpt-5-2-thinking",
        bestDisplay: "−0.758",
        bestMagnitude: 0.758,
        meanDisplay: "−0.391",
        regimeLabel: "oscillatory recovery",
        regimeTone: "mid",
      },
      {
        provider: "DeepSeek",
        model: "deepseek-thinking",
        bestDisplay: "−0.527",
        bestMagnitude: 0.527,
        meanDisplay: "−0.059",
        regimeLabel: "recovery w/o retention",
        regimeTone: "mid",
      },
      {
        provider: "Anthropic",
        model: "claude-4.6-sonnet-extended",
        bestDisplay: "−0.310",
        bestMagnitude: 0.310,
        meanDisplay: "−0.019",
        regimeLabel: "weak mixed",
        regimeTone: "weak",
      },
      {
        provider: "Google",
        model: "gemini-3-thinking",
        bestDisplay: "−0.479",
        bestMagnitude: 0.479,
        meanDisplay: "+0.485",
        regimeLabel: "⚠ inversion/lock",
        regimeTone: "inverted",
      },
    ],
    emphasisNote:
      "Google is the only provider where mean r went positive (+0.485) under same-thread feedback — the only direction inversion in the battery.",
  },
];

function TaskCard({ t }: { t: EvalTaskReportV0_1 }) {
  return (
    <section className="rounded-[10px] border border-[#3a3a3a] bg-[#151515] px-5 py-5 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#b8b8b8]">{t.taskId}</div>
          <h2 className="text-[20px] font-semibold leading-tight text-white">{t.title}</h2>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-[#3a3a3a] bg-[#101010] px-3 py-1.5 text-[#d8d8d8]">
            kind <span className="font-mono text-white">{t.kind}</span>
          </span>
          <span className="rounded-full border border-[#3a3a3a] bg-[#101010] px-3 py-1.5 text-[#d8d8d8]">
            lang <span className="font-mono text-white">{t.languageHint}</span>
          </span>
          <span className="rounded-full border border-[#3a3a3a] bg-[#101010] px-3 py-1.5 text-[#d8d8d8]">
            buckets <span className="font-mono text-white">{t.targetBuckets.join(", ")}</span>
          </span>
          <span className="rounded-full border border-[#3a3a3a] bg-[#101010] px-3 py-1.5 text-[#d8d8d8]">
            nPerBucket <span className="font-mono text-white">{t.nPerBucket}</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[8px] border border-[#303030] bg-[#101010]">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-[#303030] bg-[#121212]">
              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">Bucket</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">Expected</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">Provided</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">Valid</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">Invalid</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">Dup</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">Mean primary</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b0b0b0]">Mean presence</th>
            </tr>
          </thead>
            <tbody>
              {t.buckets.map((b) => {
                const validToneClass =
                  Number(b.validN ?? 0) === Number(b.expectedN ?? 0) ? "text-[#4ade80]" : "text-[#fbbf24]";
                const invalidToneClass =
                  Number(b.invalidN ?? 0) === 0 ? "text-[#555]" : "text-[#f87171]";
                const dupToneClass =
                  Number(b.duplicateN ?? 0) === 0 ? "text-[#555]" : "text-[#f59e0b]";
                const meanPrimaryToneClass =
                  Number(b.mean_aperturePrimary ?? 0) >= 0.7
                    ? "text-[#4ade80]"
                    : Number(b.mean_aperturePrimary ?? 0) >= 0.4
                      ? "text-[#fbbf24]"
                      : "text-[#f87171]";

                return (
                  <tr key={b.bucket} className="border-t border-[#262626] hover:bg-[#141414]">
                    <td className="px-3 py-2.5 font-mono text-white">{b.bucket}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-[#f2f2f2]">{b.expectedN}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-[#f2f2f2]">{b.providedN}</td>
                    <td className={`px-3 py-2.5 text-right font-mono ${validToneClass}`}>{b.validN}</td>
                    <td className={`px-3 py-2.5 text-right font-mono ${invalidToneClass}`}>{b.invalidN}</td>
                    <td className={`px-3 py-2.5 text-right font-mono ${dupToneClass}`}>{b.duplicateN}</td>
                    <td className={`px-3 py-2.5 text-right font-mono ${meanPrimaryToneClass}`}>{fmt(b.mean_aperturePrimary)}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-[#f2f2f2]">{fmt(b.mean_aperturePresenceMean)}</td>
                  </tr>
                );
              })}
            </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-[8px] border border-[#303030] bg-[#101010] px-4 py-4">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">Slope — aperturePrimary</div>
          {t.slope_aperturePrimary ? (
            <div className="mt-3 space-y-2 text-[12px] leading-6 text-[#cfcfcf]">
              <div>pearson r <span className="font-mono text-white">{fmt(t.slope_aperturePrimary.pearson_r)}</span> <span className="text-[#8a8a8a]">(parametric {fmtPLabel(t.slope_aperturePrimary.p_pearson)})</span></div>
              <div>spearman ρ <span className="font-mono text-white">{fmt(t.slope_aperturePrimary.spearman_rho)}</span> <span className="text-[#8a8a8a]">(parametric {fmtPLabel(t.slope_aperturePrimary.p_spearman)})</span></div>
              <div className="text-[#a8a8a8]">permutation test <span className="font-mono text-white">iters={t.slope_aperturePrimary.iters}</span> <span className="text-[#666]">·</span> <span className="font-mono text-white">seed={t.slope_aperturePrimary.seed}</span></div>
            </div>
          ) : (
            <div className="mt-3 text-[12px] text-[#8a8a8a]">not computed</div>
          )}
        </div>

        <div className="rounded-[8px] border border-[#303030] bg-[#101010] px-4 py-4">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">Slope — aperturePresenceMean</div>
          {t.slope_aperturePresenceMean ? (
            <div className="mt-3 space-y-2 text-[12px] leading-6 text-[#cfcfcf]">
              <div>pearson r <span className="font-mono text-white">{fmt(t.slope_aperturePresenceMean.pearson_r)}</span> <span className="text-[#8a8a8a]">(parametric {fmtPLabel(t.slope_aperturePresenceMean.p_pearson)})</span></div>
              <div>spearman ρ <span className="font-mono text-white">{fmt(t.slope_aperturePresenceMean.spearman_rho)}</span> <span className="text-[#8a8a8a]">(parametric {fmtPLabel(t.slope_aperturePresenceMean.p_spearman)})</span></div>
              <div className="text-[#a8a8a8]">permutation test <span className="font-mono text-white">iters={t.slope_aperturePresenceMean.iters}</span> <span className="text-[#666]">·</span> <span className="font-mono text-white">seed={t.slope_aperturePresenceMean.seed}</span></div>
            </div>
          ) : (
            <div className="mt-3 text-[12px] text-[#8a8a8a]">not computed</div>
          )}
        </div>
      </div>

      <details className="overflow-hidden rounded-[8px] border border-[#2f2f2f] bg-[#101010]">
        <summary className="cursor-pointer px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">
          Diagnostics
        </summary>
        <div className="border-t border-[#262626] bg-[#0c0c0c] px-4 py-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[6px] border border-[#242424] bg-[#111111] px-3 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">Missing buckets</div>
              <div className="mt-2 font-mono text-[12px] leading-6 text-[#f2f2f2]">{joinList(t.diagnostics.missingBuckets)}</div>
            </div>
            <div className="rounded-[6px] border border-[#242424] bg-[#111111] px-3 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">Extra buckets</div>
              <div className="mt-2 font-mono text-[12px] leading-6 text-[#f2f2f2]">{joinList(t.diagnostics.extraBuckets)}</div>
            </div>
            <div className="rounded-[6px] border border-[#242424] bg-[#111111] px-3 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">Empty tokens</div>
              <div className="mt-2 font-mono text-[12px] text-[#f2f2f2]">{t.diagnostics.emptyTokenCount}</div>
            </div>
            <div className="rounded-[6px] border border-[#242424] bg-[#111111] px-3 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">Whitespace tokens</div>
              <div className="mt-2 font-mono text-[12px] text-[#f2f2f2]">{t.diagnostics.whitespaceTokenCount}</div>
            </div>
            <div className="rounded-[6px] border border-[#242424] bg-[#111111] px-3 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">No-vowel tokens</div>
              <div className="mt-2 font-mono text-[12px] text-[#f2f2f2]">{t.diagnostics.noVowelTokenCount}</div>
            </div>
            <div className="rounded-[6px] border border-[#242424] bg-[#111111] px-3 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">Total invalid</div>
              <div className="mt-2 font-mono text-[12px] text-[#f2f2f2]">{t.diagnostics.totalInvalidTokenCount}</div>
            </div>
          </div>

          <div className="mt-3 rounded-[6px] border border-[#242424] bg-[#111111] px-3 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">Notes</div>
            <div className="mt-2 font-mono text-[12px] leading-6 text-[#f2f2f2]">
              {t.diagnostics.notes.length ? t.diagnostics.notes.join(" | ") : "(none)"}
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
        <Link href="/" aria-label="ZË-RO home" className="inline-flex items-center">
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

function PaperSnapshotReferenceSection({
  paperSnapshotTab,
  setPaperSnapshotTab,
}: {
  paperSnapshotTab: "paper1" | "paper2";
  setPaperSnapshotTab: (value: "paper1" | "paper2") => void;
}) {
  const activePaper =
    EVALS_PAPER_SNAPSHOTS.find((p) => p.id === paperSnapshotTab) ?? EVALS_PAPER_SNAPSHOTS[0];

  const activeProviders = activePaper.providers as Array<{
    provider: string;
    model: string;
    bestDisplay: string;
    bestMagnitude: number;
    meanDisplay: string;
    regimeLabel?: string;
    regimeTone?: "good" | "mid" | "weak" | "inverted";
  }>;

  const sourceHref =
    activePaper.id === "paper1"
      ? "https://ling.auf.net/lingbuzz/009799"
      : "https://ling.auf.net/lingbuzz/009808";

  const sourceLabel =
    activePaper.id === "paper1"
      ? "Source: LingBuzz/009799"
      : "Source: LingBuzz/009808";

  const activeBatteryTone =
    activePaper.id === "paper1"
      ? "border-[#21452a] bg-[#112017] text-[#4ade80]"
      : "border-[#5b4a20] bg-[#1d1a12] text-[#f3d38b]";

  return (
    <details className="group mt-8 overflow-hidden rounded-[10px] border border-[#333] bg-[#141414]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-[#161616] px-5 py-4 text-left transition hover:bg-[#1a1a1a] [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">
            Paper snapshots
          </div>
          <div className="mt-1 text-[16px] font-semibold text-white">
            Paper v0.1 snapshot · reference only
          </div>
          <div className="mt-1 text-[12px] leading-6 text-[#9a9a9a]">
            Fresh-chat and same-thread battery results from LingBuzz/009799 and 009808.
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a]">
            <span className="text-[#d6d6d6]">2 reference batteries</span>
            <span className="h-1 w-1 rounded-full bg-[#4a4a4a]" />
            <span>paper v0.1</span>
            <span className="h-1 w-1 rounded-full bg-[#4a4a4a]" />
            <span>not live data</span>
          </div>
        </div>

        <div className="shrink-0 rounded-full border border-[#5b4a20] bg-[#1d1a12] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#f3d38b] transition group-hover:border-[#8a6d2f] group-hover:text-[#ffe3a3]">
          Expand reference ↓
        </div>
      </summary>

      <div className="space-y-4 border-t border-[#2b2b2b] px-5 py-5">
        <div className="grid gap-2 md:grid-cols-2">
          {EVALS_PAPER_SNAPSHOTS.map((paper) => {
            const active = paper.id === paperSnapshotTab;
            const activeClass =
              paper.id === "paper1"
                ? "border-[#21452a] bg-[#112017] text-[#4ade80]"
                : "border-[#5b4a20] bg-[#1d1a12] text-[#f3d38b]";

            return (
              <button
                key={paper.id}
                type="button"
                className={
                  active
                    ? `rounded-[8px] border px-3 py-3 text-left transition ${activeClass}`
                    : "rounded-[8px] border border-[#3a3a3a] bg-[#101010] px-3 py-3 text-left text-[#b8b8b8] transition hover:border-[#666] hover:text-white"
                }
                onClick={(e) => {
                  e.preventDefault();
                  setPaperSnapshotTab(paper.id as "paper1" | "paper2");
                }}
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em]">{paper.tabLabel}</div>
                <div className={`mt-1 text-[11px] leading-5 ${active ? "opacity-80" : "text-[#8f8f8f]"}`}>
                  {paper.tabDetail}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-[10px] border border-[#2f2f2f] bg-[#101010] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[13px] font-semibold text-white">{activePaper.title}</div>
              <div className="text-[11px] leading-6 text-[#9a9a9a]">{activePaper.tabDetail}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${activeBatteryTone}`}
              >
                {activePaper.tabLabel}
              </span>
              <a
                href={sourceHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#3a3a3a] bg-[#141414] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d8d8d8] transition hover:border-[#666] hover:text-white"
              >
                {sourceLabel}
              </a>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-[8px] border border-[#262626]">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[#262626] bg-[#121212]">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">
                    Provider
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">
                    Model / regime
                  </th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">
                    Best ρ
                  </th>
                  <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">
                    Mean ρ
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeProviders.map((row) => {
                  const regimeToneClass =
                    row.regimeTone === "good"
                      ? "border-[#21452a] bg-[#112017] text-[#4ade80]"
                      : row.regimeTone === "mid"
                        ? "border-[#5b4a20] bg-[#1d1a12] text-[#f3d38b]"
                        : row.regimeTone === "inverted"
                          ? "border-[#5a2424] bg-[#1f1010] text-[#fca5a5]"
                          : "border-[#3f3f3f] bg-[#161616] text-[#c4c4c4]";

                  const barFillClass =
                    row.regimeTone === "good"
                      ? "bg-[#22c55e]"
                      : row.regimeTone === "mid"
                        ? "bg-[#d97706]"
                        : row.regimeTone === "inverted"
                          ? "bg-[#ef4444]"
                          : activePaper.id === "paper1"
                            ? "bg-[#22c55e]"
                            : "bg-[#a3a3a3]";

                  const meanToneClass = row.meanDisplay.startsWith("+")
                    ? "text-[#fca5a5]"
                    : "text-[#d7d7d7]";

                  return (
                    <tr key={`${row.provider}-${row.model}`} className="border-t border-[#262626] hover:bg-[#131313]">
                      <td className="px-3 py-3 align-top">
                        <div className="font-semibold text-white">{row.provider}</div>
                      </td>

                      <td className="px-3 py-3 align-top">
                        <div className="text-[#d8d8d8]">{row.model}</div>
                        {typeof row.regimeLabel === "string" && row.regimeLabel.length > 0 ? (
                          <div className="mt-2">
                            <span
                              className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${regimeToneClass}`}
                            >
                              {row.regimeLabel}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6f6f6f]">
                            independent fresh-chat runs
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3 text-right align-top">
                        <div className="font-mono text-[#f2f2f2]">{row.bestDisplay}</div>
                        <div className="mt-2 ml-auto h-1.5 w-20 overflow-hidden rounded-full bg-[#1a1a1a]">
                          <div
                            className={`h-full rounded-full ${barFillClass}`}
                            style={{ width: `${Math.max(10, Math.round(row.bestMagnitude * 100))}%` }}
                          />
                        </div>
                      </td>

                      <td className={`px-3 py-3 text-right font-mono align-top ${meanToneClass}`}>
                        {row.meanDisplay}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {"emphasisNote" in activePaper &&
          typeof activePaper.emphasisNote === "string" &&
          activePaper.emphasisNote.length > 0 ? (
            <div className="mt-4 rounded-[8px] border border-[#5a2424] bg-[#1a0f0f] px-3 py-2 text-[11px] leading-6 text-[#e5b4b4]">
              {activePaper.emphasisNote}
            </div>
          ) : null}
        </div>
      </div>
    </details>
  );
}

export function EvalsPageClientV0_1() {
  const byoTasks = useMemo(
    () => EVAL_SPEC_V0_1.tasks.filter((t) => t.kind === "byo"),
    []
  );

  const [mode, setMode] = useState<"run_bundle" | "task_buckets">("run_bundle");
  const [taskId, setTaskId] = useState<string>(byoTasks[0]?.taskId ?? "T2_LADDER_V0_1");

  const [runId, setRunId] = useState<string>("ui.run.v0.1");
  const [provider, setProvider] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [label, setLabel] = useState<string>("");

  const [inputText, setInputText] = useState<string>("");
  const [pickedFileName, setPickedFileName] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const [apiErr, setApiErr] = useState<ApiErr | null>(null);
  const [report, setReport] = useState<EvalReportBundleV0_1 | null>(null);
  const [md, setMd] = useState<string>("");

  const [notice, setNotice] = useState<string | null>(null);
  const [paperSnapshotTab, setPaperSnapshotTab] = useState<"paper1" | "paper2">("paper1");

  const selectedTask = useMemo(
    () => byoTasks.find((t) => t.taskId === taskId) ?? byoTasks[0],
    [byoTasks, taskId]
  );

  const inputProbe = useMemo(() => probeInput(inputText), [inputText]);

  const readyToScore =
    Boolean(inputText.trim()) &&
    inputProbe.kind !== "invalid_json" &&
    inputProbe.kind !== "corpus70_meta";

  const summaryTask: any =
    report?.tasks?.find(
      (x: any) => x?.kind === "byo" || String(x?.taskId ?? "").includes("LADDER")
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

  const summaryPermIters =
    summarySlopePresence?.iters ??
    summarySlopePrimary?.iters ??
    null;

  const summaryPermSeed =
    summarySlopePresence?.seed ??
    summarySlopePrimary?.seed ??
    null;

  const summaryBuckets: any[] = Array.isArray(summaryTask?.buckets)
    ? summaryTask.buckets
    : [];

  const compliantBuckets = summaryBuckets.filter(
    (b: any) => Number(b?.invalidN ?? 0) === 0 && Number(b?.duplicateN ?? 0) === 0
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
    { validN: 0, invalidN: 0 }
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
    typeof summarySpearman === "number" && summarySpearman < 0
      ? "bg-[#ff6b6b]"
      : "bg-[#22c55e]";

  async function onPickFile(f: File | null) {
    if (!f) return;
    const txt = await f.text();
    setInputText(txt);
  }

  function buildRunJsonFromUi(opts?: { forceMode?: "run_bundle" | "task_buckets"; parsed?: unknown }): unknown {
    const rid = runId.trim() || "ui.run.v0.1";

    const prob: InputProbe =
      opts?.parsed !== undefined
        ? { kind: "other_json", parsed: opts.parsed }
        : probeInput(inputText);

    if (prob.kind === "invalid_json") throw new Error(prob.error);
    if (prob.kind === "empty") throw new Error("Empty input");
    if (mode === "run_bundle" && prob.kind === "corpus70_meta") {
      throw new Error("This looks like a Corpus70 meta-tags JSON (version/allowedTags/tags). Evals expects evalRun.v0.1 or buckets V1..V7.");
    }

    const parsed = (prob as any).parsed as unknown;
    const effectiveMode = opts?.forceMode ?? mode;

    // Auto-wrap only when the input is strictly buckets-only.
    if (effectiveMode === "run_bundle" && looksLikeBucketsOnly(parsed)) {
      if (!selectedTask) throw new Error("No task selected");
      return {
        evalRunVersion: "evalRun.v0.1",
        evalSpecVersion: "evalSpec.v0.1",
        specId: "public-grounding-probe.v0.1",
        runId: rid,
        meta: {
          ...(provider ? { provider } : {}),
          ...(model ? { model } : {}),
          ...(label ? { label } : {}),
        },
        tasks: [
          {
            taskId: selectedTask.taskId,
            inputShape: "bucketed_single_tokens",
            buckets: parsed,
          },
        ],
      };
    }

    if (effectiveMode === "run_bundle") {
      // Patch meta if provided (best-effort)
      if (provider || model || label) {
        const obj = parsed as any;
        if (typeof obj !== "object" || obj === null) return parsed;
        obj.meta = {
          ...(obj.meta ?? {}),
          ...(provider ? { provider } : {}),
          ...(model ? { model } : {}),
          ...(label ? { label } : {}),
        };
        if (!obj.runId) obj.runId = rid;
        return obj;
      }
      return parsed;
    }

    // effectiveMode === task_buckets (wrap raw buckets -> full run bundle)
    if (!looksLikeBucketsOnly(parsed)) {
      throw new Error("Buckets-only mode expects exactly keys V1..V7 with string arrays.");
    }
    if (!selectedTask) throw new Error("No task selected");
    return {
      evalRunVersion: "evalRun.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: rid,
      meta: {
        ...(provider ? { provider } : {}),
        ...(model ? { model } : {}),
        ...(label ? { label } : {}),
      },
      tasks: [
        {
          taskId: selectedTask.taskId,
          inputShape: "bucketed_single_tokens",
          buckets: parsed,
        },
      ],
    };
  }

  async function onScore() {
    setApiErr(null);
    setNotice(null);
    setReport(null);
    setMd("");
    setBusy(true);
    try {
      const shouldAutoWrap = mode === "run_bundle" && probeInput(inputText).kind === "bucket_only";
      if (shouldAutoWrap) {
        setNotice("Detected buckets-only JSON while in Full run bundle mode. Auto-wrapping into evalRun.v0.1.");
        setMode("task_buckets");
      }
      const runJson = buildRunJsonFromUi({ forceMode: shouldAutoWrap ? "task_buckets" : undefined });
      const body = JSON.stringify(runJson);

      const res = await fetch("/api/evals/score", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });

      const data: unknown = await res.json();

      if (!data || typeof data !== "object") {
        setApiErr({ ok: false, code: "BAD_JSON", message: "Server returned non-object JSON." });
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
      setApiErr({ ok: false, code: "CLIENT_ERROR", message: (e as Error)?.message ?? "Client error" });
    } finally {
      setBusy(false);
    }
  }


  async function onDownloadPdf() {
    setApiErr(null);
    setNotice(null);
    setBusy(true);
    try {
      const shouldAutoWrap = mode === "run_bundle" && probeInput(inputText).kind === "bucket_only";
      if (shouldAutoWrap) {
        setNotice("Detected buckets-only JSON while in Full run bundle mode. Auto-wrapping into evalRun.v0.1.");
        setMode("task_buckets");
      }
      const runJson = buildRunJsonFromUi({ forceMode: shouldAutoWrap ? "task_buckets" : undefined });
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

  function loadExample() {
      // Synthetic calibration ladder (non-semantic): each bucket is dominated by one vowel carrier.
      setMode("task_buckets");
      setTaskId("T2_LADDER_V0_1");
      setRunId("example.synthetic.ladder.v0.1");
      setInputText(
        JSON.stringify(
          {
            V1: ["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa"],
            V2: ["o","oo","ooo","oooo","ooooo","oooooo","ooooooo","oooooooo","ooooooooo","oooooooooo"],
            V3: ["e","ee","eee","eeee","eeeee","eeeeee","eeeeeee","eeeeeeee","eeeeeeeee","eeeeeeeeee"],
            V4: ["ë","ëë","ëëë","ëëëë","ëëëëë","ëëëëëë","ëëëëëëë","ëëëëëëëë","ëëëëëëëëë","ëëëëëëëëëë"],
            V5: ["u","uu","uuu","uuuu","uuuuu","uuuuuu","uuuuuuu","uuuuuuuu","uuuuuuuuu","uuuuuuuuuu"],
            V6: ["y","yy","yyy","yyyy","yyyyy","yyyyyy","yyyyyyy","yyyyyyyy","yyyyyyyyy","yyyyyyyyyy"],
            V7: ["i","ii","iii","iiii","iiiii","iiiiii","iiiiiii","iiiiiiii","iiiiiiiii","iiiiiiiiii"]
          },
          null,
          2
        )
      );
    }


  // ---- Clipboard helpers (battery logging) ----
  const dfNowIso = () => new Date().toISOString();

  const dfSplitCsvSafe = (s: any) =>
    String(s ?? "").replaceAll("\n", " ").replaceAll("\r", " ").replaceAll(",", " ");

  const dfTryParseBucketsOnly = (raw: any) => {
    try {
      const j = JSON.parse(String(raw ?? ""));
      const keys = ["V1","V2","V3","V4","V5","V6","V7"];
      for (const k of keys) {
        if (!Array.isArray(j?.[k])) return null;
      }
      // Preserve key order
      return {
        V1: j.V1, V2: j.V2, V3: j.V3, V4: j.V4, V5: j.V5, V6: j.V6, V7: j.V7,
      };
    } catch {
      return null;
    }
  };

  const dfCopyText = async (labelMsg: string, text: string) => {
    try {
      if (!globalThis?.navigator?.clipboard?.writeText) {
        setNotice("Clipboard unavailable in this browser.");
        return;
      }
      await navigator.clipboard.writeText(String(text ?? ""));
      setNotice(labelMsg);
      setTimeout(() => setNotice(null), 1800);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setNotice("Copy failed: " + msg);
    }
  };

  const dfGetPrimaryTask = () => {
    const ts = (report && (report).tasks) ? (report).tasks : [];
    // Prefer a by-run task if present; else first task.
    const byo = Array.isArray(ts) ? ts.find((x) => x?.kind === "byo" || String(x?.taskId ?? "").includes("LADDER")) : null;
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
      setNotice("Copy Raw JSON: input is not buckets-only JSON (V1..V7).");
      setTimeout(() => setNotice(null), 2200);
      return;
    }
    await dfCopyText("Copied buckets JSON (V1..V7).", JSON.stringify(b, null, 2));
  };

  const onCopyCsvRow = async () => {
    if (!report) {
      setNotice("Copy CSV Row: score first.");
      setTimeout(() => setNotice(null), 1800);
      return;
    }
    const task = dfGetPrimaryTask();
    const slope = dfGetSlopePresence(task);    // aperturePresenceMean block shown in UI.
    const pearson_r = (slope as any)?.pearson_r ?? (slope as any)?.pearson?.r ?? null;
    const spearman_rho = (slope as any)?.spearman_rho ?? (slope as any)?.spearman?.rho ?? (slope as any)?.spearman?.r ?? null;

    // IMPORTANT: battery CSV p_perm comes from aperturePresenceMean.p_spearman.
    const p_perm = (slope as any)?.p_spearman ?? (slope as any)?.p_perm_spearman ?? null;

    const iters = (slope as any)?.iters ?? null;
    const seed = (slope as any)?.seed ?? null;

    const diag = (task as any)?.diagnostics ?? (task as any)?.diag ?? {};
    const noVowelTokenCount = diag?.noVowelTokenCount ?? diag?.no_vowel_token_count ?? "";

    const { validN, invalidN } = dfSumValidInvalid(task);

    const row = [
      dfNowIso(),
      dfSplitCsvSafe(runId),
      dfSplitCsvSafe(provider),
      dfSplitCsvSafe(model),
      (pearson_r ?? ""),
      (spearman_rho ?? ""),
      (p_perm ?? ""),
      (validN ?? ""),
      (invalidN ?? ""),
      (noVowelTokenCount ?? ""),
      `iters=${iters ?? ""}; seed=${seed ?? ""}; p_perm_src=p_spearman`
    ].join(",");

    await dfCopyText("Copied CSV row.", row);
  };

  return (
    <div
      className="min-h-screen bg-[#242424] text-white"
      
    >
      <StickyNav />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-0 px-10 pt-11 pb-20">
        <header className="space-y-2">
          <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-300">
            instrument · evals
          </div>
          <h1 className="text-[34px] font-bold tracking-[-0.02em] text-[#f0f0f0]">
            ZË-RO Evals v0.1
          </h1>
          <p className="max-w-[620px] text-[15px] leading-[1.8] text-[#b6b6b6]">
            Score your model output against the deterministic aperture proxy. No API keys. No model calls. Paste output, get a Pearson r.
          </p>
        </header>

        <PaperSnapshotReferenceSection paperSnapshotTab={paperSnapshotTab} setPaperSnapshotTab={setPaperSnapshotTab} />

      <section className="mt-10 rounded-[8px] border border-[#333] bg-[#141414] px-7 pt-7 pb-6 space-y-[18px]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-[#e6e6e6]">
              Input mode
            </label>
            <select
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[10px] font-mono text-[13px] text-[#e0e0e0] outline-none transition focus:border-[#666]"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="run_bundle">Full run bundle (evalRun.v0.1)</option>
              <option value="task_buckets">Buckets only (wrap into a run)</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-[#e6e6e6]">
              Task (Buckets only mode)
            </label>
            <select
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[10px] font-mono text-[13px] text-[#e0e0e0] outline-none transition focus:border-[#666] disabled:opacity-35"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              disabled={mode !== "task_buckets"}
            >
              {byoTasks.map((t) => (
                <option key={t.taskId} value={t.taskId}>
                  {t.taskId} — {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

          <details className="group overflow-hidden rounded-[5px] border border-[#6a5a2a] bg-[#1d1a12] transition hover:border-[#8a7636] open:border-l-2 open:border-l-[#d93333]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-[#221d14] px-[14px] py-[10px] text-[11px] uppercase tracking-[0.1em] text-[#d7cfbb] transition hover:bg-[#2a2418] hover:text-[#fff1c2] [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-[#cc0000]">▶</span>
                <span>TASK PROMPT — CLICK TO EXPAND & COPY TO MODEL</span>
              </div>
              <span className="text-[11px] text-[#b8a97a] transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <div className="border-t border-[#6a5a2a] bg-[#1d1a12] p-[14px]">
              <div className="mb-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => void dfCopyText("Copied task prompt.", selectedTask?.prompt ?? "(no task selected)")}
                  className="rounded-[4px] border border-[#6a5a2a] bg-transparent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#f3d38b] transition hover:border-[#8a7636] hover:bg-[#2a2418] hover:text-[#fff1c2]"
                >
                  Copy
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-[11px] leading-[1.7] text-[#d7cfbb]">
                {selectedTask?.prompt ?? "(no task selected)"}
              </pre>
            </div>
          </details>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-[#e6e6e6]">
              runId
            </label>
            <input
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[10px] font-mono text-[13px] text-[#e0e0e0] outline-none transition focus:border-[#666]"
              value={runId}
              onChange={(e) => setRunId(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-[#e6e6e6]">
              provider
            </label>
            <input
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[10px] font-mono text-[13px] text-[#e0e0e0] outline-none transition focus:border-[#666]"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. openai"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-[#e6e6e6]">
              model
            </label>
            <input
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[10px] font-mono text-[13px] text-[#e0e0e0] outline-none transition focus:border-[#666]"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. gpt-4o"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold uppercase tracking-[0.1em] text-[#e6e6e6]">
              label
            </label>
            <input
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[10px] font-mono text-[13px] text-[#e0e0e0] outline-none transition focus:border-[#666]"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. fresh-chat"
            />
          </div>
        </div>
          <div className="rounded-[10px] border border-[#3a3a3a] bg-[#171717] px-5 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#e6e6e6]">
                Upload JSON
              </span>
              <span className="text-[12px] leading-6 text-[#9a9a9a]">
                Use a saved eval bundle or buckets-only file.
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center rounded-[6px] border border-[#3a3a3a] bg-[#1e1e1e] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#d8d8d8] transition hover:border-[#666] hover:bg-[#252525] hover:text-white">
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
                📎 Choose file
              </label>
              <span className={`text-[12px] leading-6 ${pickedFileName ? "text-[#666]" : "italic text-[#444]"}`}>
                {pickedFileName || "no file chosen"}
              </span>
            </div>

            <div className="mt-2 text-[11px] leading-6 text-[#b8b8b8]">
              Upload a full <span className="font-mono text-[#f2f2f2]">evalRun.v0.1</span> bundle or a buckets-only JSON file.
            </div>
          </div>
          <div className="rounded-[10px] border border-[#3a3a3a] bg-[#131313] px-5 py-5">
            <div className="space-y-1">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e2e2e2]">
                Paste JSON
              </label>
              <div className="text-[12px] leading-6 text-[#9a9a9a]">
                Paste a full <span className="font-mono text-[#d8d8d8]">evalRun.v0.1</span> bundle or buckets-only <span className="font-mono text-[#d8d8d8]">V1..V7</span> JSON.
              </div>
            </div>

            <textarea
              className="mt-3 min-h-[240px] w-full rounded-[8px] border border-[#3a3a3a] bg-[#101010] p-4 font-mono text-[13px] leading-[1.8] text-[#e6e6e6] outline-none transition focus:border-[#555]"
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
              placeholder={mode === "run_bundle" ? '{ "evalRunVersion": "evalRun.v0.1", ... }' : '{ "V1": ["token1", ...], "V2": [...], ... }'}
            />

            {inputText.trim() && inputProbe.kind !== "invalid_json" ? (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#21452a] bg-[#112017] px-3 py-1.5 text-[11px] text-[#4ade80]">
                <span className="h-[6px] w-[6px] rounded-full bg-[#16a34a]" />
                JSON detected — ready to score
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              className="rounded-[6px] border border-[#16a34a] bg-[#16a34a] px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#15803d] hover:shadow-[0_0_0_1px_rgba(22,163,74,0.4),0_4px_16px_rgba(22,163,74,0.33)] disabled:cursor-not-allowed disabled:border-[#333] disabled:bg-[#111] disabled:text-[#333] disabled:shadow-none"
              onClick={() => void onScore()}
              disabled={busy || !inputText.trim()}
            >
              {busy ? "Scoring…" : report ? "Scored ✓" : "Score run"}
            </button>

            <button
              type="button"
              className="rounded-[6px] border border-[#555] bg-[#1a1a1a] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#e2e2e2] transition hover:border-[#777] hover:bg-[#202020] hover:text-white"
              onClick={() => {
                setInputText("");
                setApiErr(null);
                setReport(null);
                setMd("");
                setNotice(null);
              }}
              disabled={busy}
            >
              Clear / new run
            </button>

            <button
              type="button"
              className="rounded-[6px] border border-[#5a2a2a] bg-transparent px-4 py-2.5 text-[11px] uppercase tracking-[0.06em] text-[#cc6666] transition hover:border-[#cc0000] hover:bg-[#cc000010] hover:text-[#e05555] disabled:opacity-50"
              onClick={() => void onDownloadPdf()}
              disabled={busy || !inputText.trim()}
            >
              Download PDF
            </button>

            <button
              type="button"
              className="rounded-[6px] border border-[#444] bg-transparent px-4 py-2.5 text-[11px] uppercase tracking-[0.06em] text-[#b8b8b8] transition hover:border-[#777] hover:text-[#f2f2f2] disabled:opacity-50"
              onClick={() => void onCopyRawJson()}
              disabled={busy || !inputText.trim()}
            >
              Copy Raw JSON
            </button>

            <button
              type="button"
              className="rounded-[6px] border border-[#444] bg-transparent px-4 py-2.5 text-[11px] uppercase tracking-[0.06em] text-[#b8b8b8] transition hover:border-[#777] hover:text-[#f2f2f2] disabled:opacity-50"
              onClick={() => void onCopyCsvRow()}
              disabled={busy || !report}
            >
              Copy CSV Row
            </button>

            <div className="min-w-0 flex-1" />

            <button
              type="button"
              className="rounded-[6px] border border-dashed border-[#4a4a4a] bg-transparent px-4 py-2.5 text-[11px] uppercase tracking-[0.06em] text-[#c8c8c8] transition hover:border-[#777] hover:bg-[#1f1f1f] hover:text-white"
              onClick={loadExample}
              disabled={busy}
            >
              Load example
            </button>
          </div>

          <div className="space-y-2 pt-3">
            {mode === "run_bundle" && inputProbe.kind === "bucket_only" ? (
              <div className="rounded-[8px] border border-[#5b4a20] bg-[#1d1a12] px-4 py-3">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f3d38b]">
                      Input mismatch
                    </div>
                    <div className="mt-1 text-[12px] leading-6 text-[#d7cfbb]">
                      You are in <span className="font-mono text-[#fff1c2]">run_bundle</span> mode, but the input looks like bucketed tokens.
                      Scoring and PDF export will auto-wrap into <span className="font-mono text-[#fff1c2]">evalRun.v0.1</span>.
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

            {inputProbe.kind === "corpus70_meta" ? (
              <div className="rounded-[8px] border border-[#5b3b3b] bg-[#1d1515] px-4 py-3">
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

            {notice ? (
              <div className="rounded-[8px] border border-[#3e4a5b] bg-[#171b22] px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b8c7e8]">
                  Note
                </div>
                <div className="mt-1 text-[12px] leading-6 text-[#d2d9e6]">{notice}</div>
              </div>
            ) : null}

            {apiErr ? (
              <div className="rounded-[8px] border border-[#6a3d3d] bg-[#211717] px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f2b0b0]">
                  Error <span className="font-mono text-[#ffe4e4]">{apiErr.code}</span>
                </div>
                <div className="mt-1 text-[12px] leading-6 text-[#e0c7c7]">{apiErr.message}</div>
              </div>
            ) : null}
          </div>
        </section>
        {(busy || apiErr || report || readyToScore) ? (
            <section className="mb-6 space-y-6">
            <div className={`rounded-[12px] border px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${stateToneClass}`}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-white">
                  <span className={`h-2.5 w-2.5 rounded-full ${stateDotClass}`} />
                  {stateLabel}
                </div>

                  {report ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="rounded-full border border-[#4a4a4a] bg-[#0f0f0f] px-3 py-1.5 text-[#ededed]">
                          provider <span className="font-mono text-white">{report.meta?.provider ?? "-"}</span>
                        </span>
                        <span className="rounded-full border border-[#4a4a4a] bg-[#0f0f0f] px-3 py-1.5 text-[#ededed]">
                          model <span className="font-mono text-white">{report.meta?.model ?? "-"}</span>
                        </span>
                        <span className="rounded-full border border-[#4a4a4a] bg-[#0f0f0f] px-3 py-1.5 text-[#ededed]">
                          label <span className="font-mono text-white">{report.meta?.label ?? "-"}</span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1" />
                      <div className="rounded-full border border-[#4a4a4a] bg-[#0f0f0f] px-3 py-1.5 font-mono text-[11px] text-[#f2f2f2]">
                        runId <span className="text-white">{report.runId}</span>
                      </div>
                    </>
                  ) : null}
              </div>
            </div>

            {report && summaryTask ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#e2e2e2]">
                      Consistency (Spearman ρ)
                    </div>
                    <div className="font-mono text-[14px] text-white">
                      {typeof summarySpearman === "number" ? fmt(summarySpearman) : "—"}
                    </div>
                  </div>
                  <div className="h-[6px] overflow-hidden rounded-full bg-[#252525]">
                    <div
                      className={`h-full rounded-full ${consistencyBarClass}`}
                      style={{ width: `${consistencyBarWidth}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      key: "Pearson r",
                      value: typeof summaryPearson === "number" ? fmt(summaryPearson) : "—",
                      note: "aperture primary",
                      tone: "border-t-[#16a34a]",
                    },
                    {
                      key: "Spearman ρ",
                      value: typeof summarySpearman === "number" ? fmt(summarySpearman) : "—",
                      note: "aperture primary",
                      tone: "border-t-[#22c55e]",
                    },
                    {
                      key: "p_perm",
                      value: typeof summaryPPerm === "number" ? fmtP(summaryPPerm) : "—",
                      note:
                        summaryPermIters || summaryPermSeed
                          ? `${summaryPermIters ?? "—"} iters · seed ${summaryPermSeed ?? "—"}`
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
                      className={`rounded-[10px] border border-[#3a3a3a] border-t-[3px] bg-[#161616] p-4 shadow-[0_6px_20px_rgba(0,0,0,0.12)] ${card.tone}`}
                    >
                      <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e6e6e6]">
                        {card.key}
                      </div>
                      <div className="mt-3 font-mono text-[24px] font-bold text-white">
                        {card.value}
                      </div>
                      <div className="mt-2 text-[11px] leading-6 text-[#d0d0d0]">
                        {card.note}
                      </div>
                    </div>
                  ))}
                </div>

                  {(() => {
                    if (typeof summarySpearman !== "number") return null;

                    const diagnosisKind =
                      summarySpearman < 0 ? "inversion" :
                      summarySpearman < 0.7 ? "weak" :
                      "stable";

                    const diagnosisLabel =
                      diagnosisKind === "inversion" ? "Order inverted" :
                      diagnosisKind === "weak" ? "Weak alignment" :
                      "Aligned";

                    const diagnosisColor =
                      diagnosisKind === "inversion" ? "#f87171" :
                      diagnosisKind === "weak" ? "#f59e0b" :
                      "#22c55e";

                    const diagnosisHint =
                      diagnosisKind === "inversion"
                        ? "Spearman ρ is below zero, so the output reverses the expected aperture order."
                        : diagnosisKind === "weak"
                          ? "Spearman ρ is positive but not yet strong enough for stable monotonic alignment."
                          : "Spearman ρ is strong, so the bucket order is aligned with the expected aperture slope.";

                    return (
                      <div
                        className="mt-4 flex flex-wrap items-center gap-3 rounded-[10px] border border-[#3a3a3a] bg-[#161616] px-4 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
                        title={diagnosisHint}
                      >
                        <span
                          className="inline-block h-[8px] w-[8px] rounded-full"
                          style={{ backgroundColor: diagnosisColor }}
                        />
                        <span
                          className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                          style={{ color: diagnosisColor }}
                        >
                          {diagnosisLabel}
                        </span>
                        <span className="text-[11px] leading-6 text-[#e0e0e0]">
                          {diagnosisHint}
                        </span>
                      </div>
                    );
                  })()}

                  {summaryTask?.buckets?.length ? (() => {
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
                    const m = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
                    const b0 = (sumY - m * sumX) / n;
                    const x1 = 96;
                    const x2 = pts[pts.length - 1]?.x ?? 96;

                    return (
                      <div className="mt-6 rounded-[12px] border border-[#3a3a3a] bg-[#101010] px-5 py-5 shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                          <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#dddddd]">
                            Aperture trend by bucket
                          </div>
                          <div className="mb-4 text-[12px] leading-6 text-[#a8a8a8]">
                            Mean aperture score from V1 to V7.
                          </div>

                        <svg viewBox="0 0 560 220" className="w-full">
                          <line x1="58" y1="20" x2="58" y2="182" stroke="#333" strokeWidth="1" />
                          <line x1="58" y1="182" x2="530" y2="182" stroke="#333" strokeWidth="1" />

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

                          {pts.map((p, i) => {
                            const dotColor =
                              i < 3 ? "#4ade80" :
                              i === 3 ? "#facc15" :
                              "#f87171";

                            return (
                              <g key={p.label}>
                                <circle cx={p.x} cy={p.y} r="6" fill={dotColor} opacity="0.95" />
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
                  })() : null}
              </>
            ) : null}
          </section>
        ) : null}


      {report ? (
            <section className="space-y-7 pt-3">
            <div className="rounded-[10px] border border-[#2a2a2a] bg-[#151515] px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">
                    Report
                  </div>
                  <div className="text-[12px] leading-6 text-[#9a9a9a]">
                    Bundle metadata and markdown export.
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#d8d8d8]">
                <span>
                  specId: <span className="font-mono text-[#e5e5e5]">{report.specId}</span>
                </span>
                <span>
                  evalSpecVersion: <span className="font-mono text-[#e5e5e5]">{report.evalSpecVersion}</span>
                </span>
                <span>
                  runId: <span className="font-mono text-[#e5e5e5]">{report.runId}</span>
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#c8c8c8]">
                <span>
                  provider: <span className="font-mono text-[#f2f2f2]">{report.meta?.provider ?? "-"}</span>
                </span>
                <span>
                  model: <span className="font-mono text-[#f2f2f2]">{report.meta?.model ?? "-"}</span>
                </span>
                <span>
                  label: <span className="font-mono text-[#f2f2f2]">{report.meta?.label ?? "-"}</span>
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-[8px] border border-[#262626] bg-[#101010]">
                <div className="flex items-center justify-between gap-3 border-b border-[#262626] px-4 py-3">
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#d6d6d6]">
                      Markdown export preview
                    </div>
                    <div className="text-[11px] text-[#8a8a8a]">
                      Rendered report text ready to copy.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-[4px] border border-[#333] bg-transparent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#b8b8b8] transition hover:border-[#666] hover:text-white disabled:opacity-40"
                    onClick={() => void dfCopyText("Copied markdown report.", md || "")}
                    disabled={!md}
                  >
                    Copy
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap bg-[#0c0c0c] px-4 py-4 text-[12px] leading-6 text-[#cfcfcf]">{md || "(empty)"}</pre>
              </div>
            </div>

              <div className="space-y-6">
                {report.tasks
                  .filter((t) => t.kind === "byo")
                  .map((t) => (
                    <TaskCard key={t.taskId} t={t} />
                  ))}


              {report.tasks.some((t) => t.kind !== "byo") ? (
                <section className="mt-2 rounded-[10px] border border-[#303030] bg-[#171717] px-4 py-4 space-y-3">
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">
                        Validation controls
                      </div>
                      <div className="text-[12px] leading-6 text-[#b8b8b8]">
                        Derived checks and negative controls stay visible here as supporting evidence.
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
        </section>
      ) : null}
      </main>
    </div>
  );
}
