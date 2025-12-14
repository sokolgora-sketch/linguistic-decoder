import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

type AnalyzeResponse = any;

export default function WordPage() {
  const router = useRouter();
  const { word } = router.query;

  const [rawWord, setRawWord] = useState<string>("");
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const param =
      typeof word === "string"
        ? word
        : Array.isArray(word)
        ? word[0] ?? ""
        : "";

    setRawWord(param);

    if (!param) return;

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: param, mode: "strict" }),
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json = (await res.json()) as AnalyzeResponse;

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unknown error while loading word.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, word]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            ZË-RO · Word Page v1
          </h1>
          <p className="text-sm text-slate-400">
            Strict Seven-Voices reading for{" "}
            <span className="font-semibold">
              {rawWord ||
                (typeof word === "string" ? word : "") ||
                "…"}
            </span>
            .
          </p>
        </header>

        {/* Status */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-lg font-medium">Status</h2>

          {loading && (
            <p className="text-slate-400 text-sm">Running analysis…</p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-400">Error: {error}</p>
          )}

          {!loading && !error && data && (
            <div className="space-y-1 text-sm">
              <p className="text-slate-300">
                Engine:{" "}
                <span className="font-mono">
                  {(data as any).engine ?? "SevenVoices Core"}
                </span>
              </p>
              <p className="text-slate-300">
                Mode:{" "}
                <span className="font-mono">
                  {(data as any).mode ?? "strict"}
                </span>
              </p>
            </div>
          )}
        </section>

        {/* Raw JSON (dev) */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-medium">Raw result (dev)</h2>
            <button
              type="button"
              onClick={() => setShowJson((v) => !v)}
              className="rounded-md border border-slate-700 px-3 py-1 text-xs font-medium hover:bg-slate-800"
            >
              {showJson ? "Hide JSON" : "Show JSON"}
            </button>
          </div>

          {showJson && (
            <pre className="max-h-[480px] overflow-auto rounded-xl bg-black/50 p-4 text-xs leading-relaxed">
              {data ? JSON.stringify(data, null, 2) : "No data yet."}
            </pre>
          )}
        </section>
      </div>
    </main>
  );
}
