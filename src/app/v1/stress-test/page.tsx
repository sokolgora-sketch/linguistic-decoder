"use client";

import React, { useMemo, useState } from "react";

type StressRow = {
  word: string;
  ok: boolean;
  stress: unknown | null;
  error?: string | null;
};

type StressApiResponse =
  | {
      ok: true;
      count: number;
      rows: StressRow[];
    }
  | {
      ok: false;
      error: string;
    };

function parseWords(raw: string): string[] {
  // Split on newlines, commas, semicolons, tabs; trim; drop empties; de-dup
  const parts = raw
    .split(/[\n,;\t]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of parts) {
    const key = w.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(w);
    }
  }
  return out;
}

export default function StressTestPage() {
  const [mode, setMode] = useState<"canon" | "custom">("canon");
  const [raw, setRaw] = useState<string>(
    "study\ndamage\nlove\nlaw\ngjak\nzemër\nfrymё\nshqipëri\nkulturë"
  );

  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<StressApiResponse | null>(null);
  const [httpMeta, setHttpMeta] = useState<{ status: number; ms: number } | null>(null);
  const [showJson, setShowJson] = useState(false);

  const words = useMemo(() => parseWords(raw), [raw]);

  const stats = useMemo(() => {
    if (!res || !("rows" in res)) return null;
    const total = res.rows.length;
    const okCount = res.rows.filter((r) => r.ok).length;
    const failCount = total - okCount;
    const hasStressCount = res.rows.filter((r) => !!r.stress).length;
    return { total, okCount, failCount, hasStressCount };
  }, [res]);

  async function run(kind: "canon" | "custom") {
    setLoading(true);
    setRes(null);
    setHttpMeta(null);

    const body =
      kind === "custom"
        ? { words: words.slice(0, 200) } // hard cap to keep it sane
        : {}; // server will fall back to CANON_WORDS_V1

    const t0 = performance.now();
    try {
      const r = await fetch("/api/seven-voices/stress-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const t1 = performance.now();
      setHttpMeta({ status: r.status, ms: Math.round(t1 - t0) });

      const data = (await r.json()) as StressApiResponse;
      setRes(data);
    } catch (e: any) {
      const t1 = performance.now();
      setHttpMeta({ status: 0, ms: Math.round(t1 - t0) });
      setRes({ ok: false, error: String(e?.message ?? e) });
    } finally {
      setLoading(false);
    }
  }

  async function copyJson() {
    if (!res) return;
    await navigator.clipboard.writeText(JSON.stringify(res, null, 2));
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Stress Test</h1>
        <p className="text-sm opacity-80">
          Runs the stress harness against canonical or custom words via{" "}
          <code className="rounded bg-white/10 px-1 py-0.5">/api/seven-voices/stress-test</code>
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          className={`rounded-md px-3 py-2 text-sm ${
            mode === "canon" ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setMode("canon")}
          disabled={loading}
        >
          Canon
        </button>
        <button
          className={`rounded-md px-3 py-2 text-sm ${
            mode === "custom" ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
          }`}
          onClick={() => setMode("custom")}
          disabled={loading}
        >
          Custom
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
            onClick={() => run(mode)}
            disabled={loading || (mode === "custom" && words.length === 0)}
            title={mode === "custom" && words.length === 0 ? "Enter words first" : ""}
          >
            {loading ? "Running..." : "Run"}
          </button>

          <button
            className="rounded-md bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
            onClick={copyJson}
            disabled={!res}
          >
            Copy JSON
          </button>

          <button
            className="rounded-md bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
            onClick={() => setShowJson((v) => !v)}
            disabled={!res}
          >
            {showJson ? "Hide JSON" : "Show JSON"}
          </button>
        </div>
      </div>

      {mode === "custom" && (
        <section className="mb-6 rounded-xl bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium">Custom words</div>
            <div className="text-xs opacity-70">
              Parsed: <span className="font-semibold">{words.length}</span> (max 200 sent)
            </div>
          </div>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            className="h-40 w-full resize-y rounded-lg bg-black/20 p-3 text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
            placeholder={"Enter one word per line (or comma-separated)\nexample:\nstudy\ndamage\nlove"}
            disabled={loading}
          />
        </section>
      )}

      <section className="rounded-xl bg-white/5 p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
          <div className="font-medium">Result</div>
          {httpMeta && (
            <div className="opacity-80">
              HTTP: <span className="font-semibold">{httpMeta.status}</span> ·{" "}
              <span className="font-semibold">{httpMeta.ms}ms</span>
            </div>
          )}
          {stats && (
            <div className="opacity-80">
              total <span className="font-semibold">{stats.total}</span> · ok{" "}
              <span className="font-semibold">{stats.okCount}</span> · fail{" "}
              <span className="font-semibold">{stats.failCount}</span> · hasStress{" "}
              <span className="font-semibold">{stats.hasStressCount}</span>
            </div>
          )}
        </div>

        {!res && (
          <div className="text-sm opacity-70">
            Click <span className="font-semibold">Run</span> to execute the harness.
          </div>
        )}

        {res && !("rows" in res) && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm">
            <div className="font-semibold">API error</div>
            <div className="opacity-90">{res.error}</div>
          </div>
        )}

        {res && "rows" in res && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-separate border-spacing-y-2 text-sm">
              <thead className="opacity-80">
                <tr>
                  <th className="px-2 text-left font-medium">Word</th>
                  <th className="px-2 text-left font-medium">Ok</th>
                  <th className="px-2 text-left font-medium">Has stress</th>
                  <th className="px-2 text-left font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {res.rows.map((r, idx) => (
                  <tr key={`${r.word}-${idx}`} className="rounded-lg bg-white/5">
                    <td className="px-2 py-2 font-medium">{r.word}</td>
                    <td className="px-2 py-2">{r.ok ? "true" : "false"}</td>
                    <td className="px-2 py-2">{r.stress ? "true" : "false"}</td>
                    <td className="px-2 py-2 opacity-80">{r.error ? String(r.error) : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {res && showJson && (
          <pre className="mt-4 max-h-[420px] overflow-auto rounded-lg bg-black/25 p-3 text-xs ring-1 ring-white/10">
            {JSON.stringify(res, null, 2)}
          </pre>
        )}
      </section>
    </main>
  );
}