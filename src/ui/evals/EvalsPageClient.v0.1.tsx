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

function joinList(xs: string[]) {
  return xs.length ? xs.join(", ") : "(none)";
}

function TaskCard({ t }: { t: EvalTaskReportV0_1 }) {
  return (
    <section className="rounded-md border border-[#383838] bg-[#111111] p-5 space-y-4">
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-300">{t.taskId}</div>
        <h2 className="text-lg font-semibold text-white">{t.title}</h2>
        <div className="text-sm text-neutral-300">
          kind: <span className="font-mono text-neutral-100">{t.kind}</span> · langHint:{" "}
          <span className="font-mono text-neutral-100">{t.languageHint}</span> · targetBuckets:{" "}
          <span className="font-mono text-neutral-100">{t.targetBuckets.join(", ")}</span> · nPerBucket:{" "}
          <span className="font-mono text-neutral-100">{t.nPerBucket}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-[#383838]">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#111111]">
            <tr>
              <th className="border-b border-[#383838] px-3 py-2 text-left text-[11px] uppercase tracking-[0.14em] text-neutral-300">Bucket</th>
              <th className="border-b border-[#383838] px-3 py-2 text-right text-[11px] uppercase tracking-[0.14em] text-neutral-300">Expected</th>
              <th className="border-b border-[#383838] px-3 py-2 text-right text-[11px] uppercase tracking-[0.14em] text-neutral-300">Provided</th>
              <th className="border-b border-[#383838] px-3 py-2 text-right text-[11px] uppercase tracking-[0.14em] text-neutral-300">Valid</th>
              <th className="border-b border-[#383838] px-3 py-2 text-right text-[11px] uppercase tracking-[0.14em] text-neutral-300">Invalid</th>
              <th className="border-b border-[#383838] px-3 py-2 text-right text-[11px] uppercase tracking-[0.14em] text-neutral-300">Dup</th>
              <th className="border-b border-[#383838] px-3 py-2 text-right text-[11px] uppercase tracking-[0.14em] text-neutral-300">Mean Primary</th>
              <th className="border-b border-[#383838] px-3 py-2 text-right text-[11px] uppercase tracking-[0.14em] text-neutral-300">Mean Presence</th>
            </tr>
          </thead>
          <tbody>
            {t.buckets.map((b) => (
              <tr key={b.bucket} className="border-t border-[#383838]">
                <td className="px-3 py-2 font-mono text-white">{b.bucket}</td>
                <td className="px-3 py-2 text-right font-mono text-white">{b.expectedN}</td>
                <td className="px-3 py-2 text-right font-mono text-white">{b.providedN}</td>
                <td className="px-3 py-2 text-right font-mono text-white">{b.validN}</td>
                <td className="px-3 py-2 text-right font-mono text-white">{b.invalidN}</td>
                <td className="px-3 py-2 text-right font-mono text-white">{b.duplicateN}</td>
                <td className="px-3 py-2 text-right font-mono text-white">{fmt(b.mean_aperturePrimary)}</td>
                <td className="px-3 py-2 text-right font-mono text-white">{fmt(b.mean_aperturePresenceMean)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-[#383838] bg-[#111111] p-4">
          <div className="font-semibold text-white">Slope — aperturePrimary</div>
          {t.slope_aperturePrimary ? (
            <ul className="mt-2 space-y-1 text-sm text-neutral-300">
              <li>pearson r: <span className="font-mono text-neutral-100">{fmt(t.slope_aperturePrimary.pearson_r)}</span> (p=<span className="font-mono text-neutral-100">{fmt(t.slope_aperturePrimary.p_pearson)}</span>)</li>
              <li>spearman ρ: <span className="font-mono text-neutral-100">{fmt(t.slope_aperturePrimary.spearman_rho)}</span> (p=<span className="font-mono text-neutral-100">{fmt(t.slope_aperturePrimary.p_spearman)}</span>)</li>
              <li>perm: iters=<span className="font-mono text-neutral-100">{t.slope_aperturePrimary.iters}</span>, seed=<span className="font-mono text-neutral-100">{t.slope_aperturePrimary.seed}</span></li>
            </ul>
          ) : (
            <div className="mt-2 text-sm text-neutral-400">not computed</div>
          )}
        </div>

        <div className="rounded-md border border-[#383838] bg-[#111111] p-4">
          <div className="font-semibold text-white">Slope — aperturePresenceMean</div>
          {t.slope_aperturePresenceMean ? (
            <ul className="mt-2 space-y-1 text-sm text-neutral-300">
              <li>pearson r: <span className="font-mono text-neutral-100">{fmt(t.slope_aperturePresenceMean.pearson_r)}</span> (p=<span className="font-mono text-neutral-100">{fmt(t.slope_aperturePresenceMean.p_pearson)}</span>)</li>
              <li>spearman ρ: <span className="font-mono text-neutral-100">{fmt(t.slope_aperturePresenceMean.spearman_rho)}</span> (p=<span className="font-mono text-neutral-100">{fmt(t.slope_aperturePresenceMean.p_spearman)}</span>)</li>
              <li>perm: iters=<span className="font-mono text-neutral-100">{t.slope_aperturePresenceMean.iters}</span>, seed=<span className="font-mono text-neutral-100">{t.slope_aperturePresenceMean.seed}</span></li>
            </ul>
          ) : (
            <div className="mt-2 text-sm text-neutral-400">not computed</div>
          )}
        </div>
      </div>

      <details className="rounded-md border border-[#383838] bg-[#1a1a1a] p-3">
        <summary className="cursor-pointer font-semibold text-white">Diagnostics</summary>
        <div className="mt-2 space-y-1 text-sm text-neutral-300">
          <div>missingBuckets: <span className="font-mono text-neutral-100">{joinList(t.diagnostics.missingBuckets)}</span></div>
          <div>extraBuckets: <span className="font-mono text-neutral-100">{joinList(t.diagnostics.extraBuckets)}</span></div>
          <div>emptyTokenCount: <span className="font-mono text-neutral-100">{t.diagnostics.emptyTokenCount}</span></div>
          <div>whitespaceTokenCount: <span className="font-mono text-neutral-100">{t.diagnostics.whitespaceTokenCount}</span></div>
          <div>noVowelTokenCount: <span className="font-mono text-neutral-100">{t.diagnostics.noVowelTokenCount}</span></div>
          <div>totalInvalidTokenCount: <span className="font-mono text-neutral-100">{t.diagnostics.totalInvalidTokenCount}</span></div>
          <div>notes: <span className="font-mono text-neutral-100">{t.diagnostics.notes.length ? t.diagnostics.notes.join(" | ") : "(none)"}</span></div>
        </div>
      </details>
    </section>
  );
}

function StickyNav() {
  return (
    <div className="sticky top-0 z-50 border-b border-[#333333] bg-[#111111]">
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
          style={{ fontFamily: "Courier New, monospace" }}
        >
          ← home
        </Link>
      </div>
    </div>
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
  const [busy, setBusy] = useState(false);

  const [apiErr, setApiErr] = useState<ApiErr | null>(null);
  const [report, setReport] = useState<EvalReportBundleV0_1 | null>(null);
  const [md, setMd] = useState<string>("");

  const [notice, setNotice] = useState<string | null>(null);

  const selectedTask = useMemo(
    () => byoTasks.find((t) => t.taskId === taskId) ?? byoTasks[0],
    [byoTasks, taskId]
  );

  const inputProbe = useMemo(() => probeInput(inputText), [inputText]);

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
      className="min-h-screen bg-[#181818] text-white"
      style={{ fontFamily: "Courier New, monospace" }}
    >
      <StickyNav />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-0 px-10 pt-11 pb-20">
        <header className="space-y-2">
          <div className="text-[11px] uppercase tracking-[0.16em] text-neutral-300">
            instrument · evals
          </div>
          <h1 className="text-[30px] font-bold tracking-[-0.02em] text-[#f0f0f0]">
            ZË-RO Evals v0.1
          </h1>
          <p className="max-w-[560px] text-[14px] leading-[1.7] text-[#aaa]">
            Score your model output against the deterministic aperture proxy. No API keys. No model calls. Paste output, get a Pearson r.
          </p>
        </header>

      <section className="mt-10 rounded-[8px] border border-[#333] bg-[#141414] px-7 pt-7 pb-6 space-y-[18px]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d0d0d0]">
              Input mode
            </label>
            <select
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[9px] font-mono text-[12px] text-[#d8d8d8] outline-none transition focus:border-[#666]"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="run_bundle">Full run bundle (evalRun.v0.1)</option>
              <option value="task_buckets">Buckets only (wrap into a run)</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d0d0d0]">
              Task (Buckets only mode)
            </label>
            <select
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[9px] font-mono text-[12px] text-[#d8d8d8] outline-none transition focus:border-[#666] disabled:opacity-35"
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

        <details className="overflow-hidden rounded-[5px] border border-[#3a3a3a]">
          <summary className="flex cursor-pointer list-none items-center gap-2 bg-[#1e1e1e] px-[14px] py-[10px] text-[11px] uppercase tracking-[0.1em] text-[#aaa] transition hover:text-[#888] [&::-webkit-details-marker]:hidden">
            <span className="text-[9px] text-[#cc0000]">▶</span>
            Task prompt — copy/paste to model
          </summary>
          <pre className="whitespace-pre-wrap border-t border-[#3a3a3a] bg-[#181818] p-[14px] text-[11px] leading-[1.7] text-[#bbb]">
            {selectedTask?.prompt ?? "(no task selected)"}
          </pre>
        </details>

        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d0d0d0]">
              runId
            </label>
            <input
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[9px] font-mono text-[12px] text-[#d8d8d8] outline-none transition focus:border-[#666]"
              value={runId}
              onChange={(e) => setRunId(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d0d0d0]">
              provider
            </label>
            <input
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[9px] font-mono text-[12px] text-[#d8d8d8] outline-none transition focus:border-[#666]"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. openai"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d0d0d0]">
              model
            </label>
            <input
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[9px] font-mono text-[12px] text-[#d8d8d8] outline-none transition focus:border-[#666]"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. gpt-4o"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d0d0d0]">
              label
            </label>
            <input
              className="w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] px-3 py-[9px] font-mono text-[12px] text-[#d8d8d8] outline-none transition focus:border-[#666]"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. fresh-chat"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-[14px] rounded-[5px] border border-[#3a3a3a] bg-[#1a1a1a] px-4 py-[14px]">
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d0d0d0]">
            Upload JSON
          </span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={(e) => void onPickFile(e.target.files?.[0] ?? null)}
            className="block text-sm text-neutral-300 file:mr-3 file:rounded-[4px] file:border file:border-[#3a3a3a] file:bg-[#141414] file:px-3 file:py-1.5 file:font-mono file:text-[11px] file:text-[#555] hover:file:border-[#666] hover:file:text-[#eee]"
          />
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#d0d0d0]">
            Paste JSON
          </label>
          <textarea
            className="min-h-[180px] w-full rounded-[5px] border border-[#3a3a3a] bg-[#161616] p-[14px] font-mono text-[12px] leading-[1.6] text-[#d8d8d8] outline-none transition focus:border-[#333]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === "run_bundle" ? '{ "evalRunVersion": "evalRun.v0.1", ... }' : '{ "V1": ["token1", ...], "V2": [...], ... }'}
          />

          {inputText.trim() && inputProbe.kind !== "invalid_json" ? (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[#16a34a]">
              <span className="h-[6px] w-[6px] rounded-full bg-[#16a34a]" />
              JSON detected — ready to score
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            className="rounded-[5px] border border-[#16a34a] bg-[#16a34a] px-6 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#15803d] hover:shadow-[0_0_0_1px_rgba(22,163,74,0.4),0_4px_16px_rgba(22,163,74,0.33)] disabled:cursor-not-allowed disabled:border-[#333] disabled:bg-[#111] disabled:text-[#333] disabled:shadow-none"
            onClick={() => void onScore()}
            disabled={busy || !inputText.trim()}
          >
            {busy ? "Scoring…" : report ? "Scored" : "Score"}
          </button>

          <button
            type="button"
            className="rounded-[5px] border border-[#5a2a2a] bg-transparent px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#cc6666] transition hover:border-[#cc0000] hover:bg-[#cc000010] hover:text-[#e05555] disabled:opacity-50"
            onClick={() => void onDownloadPdf()}
            disabled={busy || !inputText.trim()}
          >
            Download PDF
          </button>

          <button
            type="button"
            className="rounded-[5px] border border-[#333] bg-transparent px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#777] transition hover:border-[#777] hover:text-[#eee] disabled:opacity-50"
            onClick={() => void onCopyRawJson()}
            disabled={busy || !inputText.trim()}
          >
            Copy Raw JSON
          </button>

          <button
            type="button"
            className="rounded-[5px] border border-[#333] bg-transparent px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#777] transition hover:border-[#777] hover:text-[#eee] disabled:opacity-50"
            onClick={() => void onCopyCsvRow()}
            disabled={busy || !report}
          >
            Copy CSV Row
          </button>

          <div className="min-w-0 flex-1" />

          <button
            type="button"
            className="rounded-[5px] border border-dashed border-[#333] bg-transparent px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#888] transition hover:border-[#555] hover:text-[#bbb]"
            onClick={loadExample}
            disabled={busy}
          >
            Load example
          </button>

          <button
            type="button"
            className="border-0 bg-transparent px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-[#555] transition hover:text-[#cc0000]"
            onClick={() => {
              setInputText("");
              setApiErr(null);
              setReport(null);
              setMd("");
              setNotice(null);
            }}
            disabled={busy}
          >
            Clear
          </button>
        </div>
        {mode === "run_bundle" && inputProbe.kind === "bucket_only" ? (
          <div className="rounded-md border border-[#686868] bg-[#1a1a1a] p-3 text-sm text-neutral-300">
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-300">Detected buckets-only JSON</div>
            <div className="mt-1 text-neutral-300">
              You are in <span className="font-mono text-neutral-100">run_bundle</span> mode, but the input looks like bucketed tokens (keys V1..V7).
              Scoring/PDF will auto-wrap into <span className="font-mono text-neutral-100">evalRun.v0.1</span>.
            </div>
            <div className="mt-2">
              <button
                className="rounded-md border border-[#383838] bg-[#111111] px-3 py-2 text-sm text-neutral-300 transition hover:border-[#686868] hover:bg-[#0d0d0d] hover:text-white"
                type="button"
                onClick={() => setMode("task_buckets")}
              >
                Switch to “Buckets only”
              </button>
            </div>
          </div>
        ) : null}

        {inputProbe.kind === "corpus70_meta" ? (
          <div className="rounded-md border border-[#686868] bg-[#1a1a1a] p-3 text-sm text-neutral-300">
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-300">This looks like a Corpus70 meta-tags JSON</div>
            <div className="mt-1 text-neutral-300">
              Evals expects either a full <span className="font-mono text-neutral-100">evalRun.v0.1</span> bundle or buckets keys V1..V7.
              Corpus70 meta JSON (version/allowedTags/tags) is not scorable here.
            </div>
          </div>
        ) : null}

        {notice ? (
          <div className="rounded-md border border-[#383838] bg-[#1a1a1a] p-3 text-sm text-neutral-300">
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-300">Note</div>
            <div className="mt-1 text-neutral-300">{notice}</div>
          </div>
        ) : null}

        {apiErr ? (
          <div className="rounded-md border border-[#686868] bg-[#1a1a1a] p-3 text-sm text-neutral-300">
            <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-300">Error: <span className="font-mono text-neutral-100">{apiErr.code}</span></div>
            <div className="mt-1 text-neutral-300">{apiErr.message}</div>
          </div>
        ) : null}
      </section>

      {report ? (
        <section className="space-y-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="text-sm text-neutral-600">Report</div>
            <div className="text-sm">
              specId: <span className="font-mono">{report.specId}</span> · evalSpecVersion:{" "}
              <span className="font-mono">{report.evalSpecVersion}</span> · runId:{" "}
              <span className="font-mono">{report.runId}</span>
            </div>
            {report.meta ? (
              <div className="text-sm text-neutral-300">
                provider: <span className="font-mono">{report.meta.provider ?? ""}</span> · model:{" "}
                <span className="font-mono">{report.meta.model ?? ""}</span> · label:{" "}
                <span className="font-mono">{report.meta.label ?? ""}</span>
              </div>
            ) : null}

            <details className="rounded-md border border-[#383838] bg-[#1a1a1a] p-3 mt-2">
              <summary className="cursor-pointer font-semibold text-white">Markdown report (from renderer)</summary>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md border border-[#383838] bg-[#0d0d0d] p-3 text-xs text-neutral-300">{md}</pre>
            </details>
          </div>

          <div className="space-y-4">
            {report.tasks.map((t) => (
              <TaskCard key={t.taskId} t={t} />
            ))}
          </div>
        </section>
      ) : null}
      </main>
    </div>
  );
}
