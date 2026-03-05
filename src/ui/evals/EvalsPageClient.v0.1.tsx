"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

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
    <section className="rounded-lg border p-4 space-y-3">
      <div className="space-y-1">
        <div className="text-sm text-neutral-500">{t.taskId}</div>
        <h2 className="text-lg font-semibold">{t.title}</h2>
        <div className="text-sm text-neutral-600">
          kind: <span className="font-mono">{t.kind}</span> · langHint:{" "}
          <span className="font-mono">{t.languageHint}</span> · targetBuckets:{" "}
          <span className="font-mono">{t.targetBuckets.join(", ")}</span> · nPerBucket:{" "}
          <span className="font-mono">{t.nPerBucket}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left p-2 border">Bucket</th>
              <th className="text-right p-2 border">expected</th>
              <th className="text-right p-2 border">provided</th>
              <th className="text-right p-2 border">valid</th>
              <th className="text-right p-2 border">invalid</th>
              <th className="text-right p-2 border">dup</th>
              <th className="text-right p-2 border">mean(primary)</th>
              <th className="text-right p-2 border">mean(presenceMean)</th>
            </tr>
          </thead>
          <tbody>
            {t.buckets.map((b) => (
              <tr key={b.bucket}>
                <td className="p-2 border font-mono">{b.bucket}</td>
                <td className="p-2 border text-right">{b.expectedN}</td>
                <td className="p-2 border text-right">{b.providedN}</td>
                <td className="p-2 border text-right">{b.validN}</td>
                <td className="p-2 border text-right">{b.invalidN}</td>
                <td className="p-2 border text-right">{b.duplicateN}</td>
                <td className="p-2 border text-right">{fmt(b.mean_aperturePrimary)}</td>
                <td className="p-2 border text-right">{fmt(b.mean_aperturePresenceMean)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border p-3">
          <div className="font-semibold">Slope — aperturePrimary</div>
          {t.slope_aperturePrimary ? (
            <ul className="text-sm mt-2 space-y-1">
              <li>pearson r: <span className="font-mono">{fmt(t.slope_aperturePrimary.pearson_r)}</span> (p=<span className="font-mono">{fmt(t.slope_aperturePrimary.p_pearson)}</span>)</li>
              <li>spearman ρ: <span className="font-mono">{fmt(t.slope_aperturePrimary.spearman_rho)}</span> (p=<span className="font-mono">{fmt(t.slope_aperturePrimary.p_spearman)}</span>)</li>
              <li>perm: iters=<span className="font-mono">{t.slope_aperturePrimary.iters}</span>, seed=<span className="font-mono">{t.slope_aperturePrimary.seed}</span></li>
            </ul>
          ) : (
            <div className="text-sm mt-2 text-neutral-500">not computed</div>
          )}
        </div>

        <div className="rounded-md border p-3">
          <div className="font-semibold">Slope — aperturePresenceMean</div>
          {t.slope_aperturePresenceMean ? (
            <ul className="text-sm mt-2 space-y-1">
              <li>pearson r: <span className="font-mono">{fmt(t.slope_aperturePresenceMean.pearson_r)}</span> (p=<span className="font-mono">{fmt(t.slope_aperturePresenceMean.p_pearson)}</span>)</li>
              <li>spearman ρ: <span className="font-mono">{fmt(t.slope_aperturePresenceMean.spearman_rho)}</span> (p=<span className="font-mono">{fmt(t.slope_aperturePresenceMean.p_spearman)}</span>)</li>
              <li>perm: iters=<span className="font-mono">{t.slope_aperturePresenceMean.iters}</span>, seed=<span className="font-mono">{t.slope_aperturePresenceMean.seed}</span></li>
            </ul>
          ) : (
            <div className="text-sm mt-2 text-neutral-500">not computed</div>
          )}
        </div>
      </div>

      <details className="rounded-md border p-3">
        <summary className="cursor-pointer font-semibold">Diagnostics</summary>
        <div className="text-sm mt-2 space-y-1">
          <div>missingBuckets: <span className="font-mono">{joinList(t.diagnostics.missingBuckets)}</span></div>
          <div>extraBuckets: <span className="font-mono">{joinList(t.diagnostics.extraBuckets)}</span></div>
          <div>emptyTokenCount: <span className="font-mono">{t.diagnostics.emptyTokenCount}</span></div>
          <div>whitespaceTokenCount: <span className="font-mono">{t.diagnostics.whitespaceTokenCount}</span></div>
          <div>noVowelTokenCount: <span className="font-mono">{t.diagnostics.noVowelTokenCount}</span></div>
          <div>totalInvalidTokenCount: <span className="font-mono">{t.diagnostics.totalInvalidTokenCount}</span></div>
          <div>notes: <span className="font-mono">{t.diagnostics.notes.length ? t.diagnostics.notes.join(" | ") : "(none)"}</span></div>
        </div>
      </details>
    </section>
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
    const slope = dfGetSlopePresence(task);

    // Pull the *displayed* numbers (best-effort).
    const pearson_r = slope?.pearson?.r ?? slope?.pearson_r ?? null;
    const pearson_p = slope?.pearson?.p ?? slope?.pearson_p ?? null;
    const spearman_rho = slope?.spearman?.rho ?? slope?.spearman_rho ?? slope?.spearman?.r ?? null;
    const spearman_p = slope?.spearman?.p ?? slope?.spearman_p ?? null;

    const diag = (task as any)?.diagnostics ?? (task as any)?.diag ?? {};
    const noVowelTokenCount = diag?.noVowelTokenCount ?? diag?.no_vowel_token_count ?? "";

    const { validN, invalidN } = dfSumValidInvalid(task);

    // NOTE: p_value = pearson_p (aperturePresenceMean). spearman_p is included in notes column.
    const row = [
      dfNowIso(),
      dfSplitCsvSafe(runId),
      dfSplitCsvSafe(provider),
      dfSplitCsvSafe(model),
      (pearson_r ?? ""),
      (spearman_rho ?? ""),
      (pearson_p ?? ""),
      (validN ?? ""),
      (invalidN ?? ""),
      (noVowelTokenCount ?? ""),
      "spearman_p=" + (spearman_p ?? "")
    ].join(",");

    await dfCopyText("Copied CSV row.", row);
  };

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">

      <div className="mb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold">ZË-RO Evals v0.1 — BYO Outputs</h1>
        <div className="text-sm text-neutral-600">
          This page scores a pasted run against the deterministic aperture proxy (orthography SSOT). No API keys. No model calls.
        </div>
      </header>

      <section className="rounded-lg border p-4 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="text-sm font-semibold">Input mode</label>
            <select
              className="mt-1 w-full border rounded p-2"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="run_bundle">Full run bundle (evalRun.v0.1)</option>
              <option value="task_buckets">Buckets only (wrap into a run)</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-semibold">Task (only used for “Buckets only”)</label>
            <select
              className="mt-1 w-full border rounded p-2"
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

        <details className="rounded-md border p-3">
          <summary className="cursor-pointer font-semibold">Task prompt (copy/paste to model)</summary>
          <pre className="mt-3 whitespace-pre-wrap text-xs bg-neutral-50 p-3 rounded border">
            {selectedTask?.prompt ?? "(no task selected)"}
          </pre>
        </details>

        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="text-sm font-semibold">runId</label>
            <input className="mt-1 w-full border rounded p-2" value={runId} onChange={(e) => setRunId(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">provider</label>
            <input className="mt-1 w-full border rounded p-2" value={provider} onChange={(e) => setProvider(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">model</label>
            <input className="mt-1 w-full border rounded p-2" value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">label</label>
            <input className="mt-1 w-full border rounded p-2" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold">Upload JSON</label>
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => void onPickFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex gap-2 md:ml-auto">
            <button className="border rounded px-3 py-2 text-sm" onClick={loadExample} type="button">
              Load example
            </button>
            <button
              className="border rounded px-3 py-2 text-sm"
              onClick={() => {
                setInputText("");
                setApiErr(null);
                setReport(null);
                setMd("");
              }}
              type="button"
            >
              Clear
            </button>
            <button
              className="bg-black text-white rounded px-3 py-2 text-sm disabled:opacity-50"
              onClick={() => void onScore()}
              disabled={busy || !inputText.trim()}
              type="button"
            >
              {busy ? "Scoring…" : "Score"}
            </button>
              <button
                className="border rounded px-3 py-2 text-sm disabled:opacity-50"
                onClick={() => void onDownloadPdf()}
                disabled={busy || !inputText.trim()}
                type="button"
              >
                Download PDF
              </button>

              <button
                className="border rounded px-3 py-2 text-sm disabled:opacity-50"
                onClick={() => void onCopyRawJson()}
                disabled={busy || !inputText.trim()}
                type="button"
              >
                Copy Raw JSON
              </button>
              <button
                className="border rounded px-3 py-2 text-sm disabled:opacity-50"
                onClick={() => void onCopyCsvRow()}
                disabled={busy || !report}
                type="button"
              >
                Copy CSV Row
              </button>


          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Paste JSON</label>
          <textarea
            className="mt-1 w-full min-h-[220px] border rounded p-2 font-mono text-xs"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === "run_bundle" ? '{ "evalRunVersion": "evalRun.v0.1", ... }' : '{ "V1": ["token1", ...], "V2": [...], ... }'}
          />
        </div>

        {mode === "run_bundle" && inputProbe.kind === "bucket_only" ? (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
            <div className="font-semibold">Detected buckets-only JSON</div>
            <div className="mt-1 text-neutral-700">
              You are in <span className="font-mono">run_bundle</span> mode, but the input looks like bucketed tokens (keys V1..V7).
              Scoring/PDF will auto-wrap into <span className="font-mono">evalRun.v0.1</span>.
            </div>
            <div className="mt-2">
              <button
                className="border rounded px-3 py-2 text-sm"
                type="button"
                onClick={() => setMode("task_buckets")}
              >
                Switch to “Buckets only”
              </button>
            </div>
          </div>
        ) : null}

        {inputProbe.kind === "corpus70_meta" ? (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm">
            <div className="font-semibold">This looks like a Corpus70 meta-tags JSON</div>
            <div className="mt-1 text-neutral-700">
              Evals expects either a full <span className="font-mono">evalRun.v0.1</span> bundle or buckets keys V1..V7.
              Corpus70 meta JSON (version/allowedTags/tags) is not scorable here.
            </div>
          </div>
        ) : null}

        {notice ? (
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm">
            <div className="font-semibold">Note</div>
            <div className="mt-1 text-neutral-700">{notice}</div>
          </div>
        ) : null}

        {apiErr ? (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm">
            <div className="font-semibold">Error: <span className="font-mono">{apiErr.code}</span></div>
            <div className="mt-1">{apiErr.message}</div>
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
              <div className="text-sm text-neutral-700">
                provider: <span className="font-mono">{report.meta.provider ?? ""}</span> · model:{" "}
                <span className="font-mono">{report.meta.model ?? ""}</span> · label:{" "}
                <span className="font-mono">{report.meta.label ?? ""}</span>
              </div>
            ) : null}

            <details className="rounded-md border p-3 mt-2">
              <summary className="cursor-pointer font-semibold">Markdown report (from renderer)</summary>
              <pre className="mt-3 whitespace-pre-wrap text-xs bg-neutral-50 p-3 rounded border">{md}</pre>
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
  );
}
