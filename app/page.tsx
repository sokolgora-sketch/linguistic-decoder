'use client';

import React, { useMemo, useState } from "react";
import type { AnalysisResult } from "../src/v1/types";

type ApiError = { error?: string };

function isAnalysisResult(x: any): x is AnalysisResult {
  return (
    x &&
    typeof x === "object" &&
    typeof x.word === "string" &&
    typeof x.normalizedWord === "string" &&
    typeof x.engineVersion === "string" &&
    Array.isArray(x.candidates)
  );
}

export default function Page() {
  const [word, setWord] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  const prettyJson = useMemo(() => {
    if (!result) return "";
    return JSON.stringify(result, null, 2);
  }, [result]);

  async function onAnalyze() {
    if (loading) return;

    const w = word.trim();
    setError(null);
    setResult(null);
    setShowJson(false);

    if (!w) {
      setError("Type a word before analyzing.");
      return;
    }

    setLoading(true);
    try {
      const res: any = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: w }),
      });

      let data: any = null;
      if (res && typeof res.json === "function") {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!res || !res.ok) {
        const msg =
          (data && typeof (data as ApiError).error === "string" && (data as ApiError).error) ||
          "Engine error";
        setError(msg.toLowerCase().includes("error") ? msg : "Engine error");
        return;
      }

      if (!isAnalysisResult(data)) {
        setError("Engine error");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">ZË-RO</h1>
        <p className="mt-2 text-sm opacity-80">Seven-Voices word decoder.</p>
      </header>

      <section className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4">
        <label className="block text-sm mb-2 opacity-80">Enter a word</label>
        <div className="flex gap-2">
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAnalyze();
            }}
            placeholder="study"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-base outline-none focus:border-white/20"
            disabled={loading}
          />
          <button
            onClick={onAnalyze}
            disabled={loading}
            aria-busy={loading ? "true" : "false"}
            className="shrink-0 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </section>

      {result && Array.isArray(result.candidates) && (
        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-6">
            <div className="text-sm opacity-80">Word</div>
            <div className="text-lg font-medium">{result.word}</div>

            {result.normalizedWord && result.normalizedWord !== result.word && (
              <div className="mt-2 text-sm opacity-70">
                Normalized: <span className="font-mono">{result.normalizedWord}</span>
              </div>
            )}

            <div className="mt-2 text-xs opacity-60">
              Engine: <span className="font-mono">{result.engineVersion}</span>
            </div>
          </div>

          <div className="space-y-6">
            {result.candidates.map((c, idx) => (
              <div
                key={`${c.language}-${idx}`}
                className="rounded-lg border border-white/10 bg-black/20 p-4"
              >
                <div className="mb-3">
                  <div className="text-sm opacity-70">
                    Candidate {idx + 1} — <span className="font-mono">{c.language}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="opacity-70">Form:</span>{" "}
                    <span className="font-mono">{c.form || "—"}</span>
                  </div>

                  <div>
                    <span className="opacity-70">Decomposition:</span>{" "}
                    <span className="font-mono">
                      {c.decomposition?.length ? c.decomposition.join(" – ") : "—"}
                    </span>
                  </div>

                  <div>
                    <span className="opacity-70">Vowel path:</span>{" "}
                    <span className="font-mono">{c.vowelPath || "—"}</span>
                  </div>

                  <div className="pt-2">
                    <div className="opacity-70 mb-1">Meaning:</div>
                    <div className="leading-relaxed">{c.functionalStatement || "—"}</div>
                  </div>

                  {c.notes?.length ? (
                    <div className="pt-2">
                      <div className="opacity-70 mb-1">Notes:</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {c.notes.map((n, i) => (
                          <li key={i} className="opacity-90">
                            {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowJson((v) => !v)}
              className="text-sm underline opacity-80 hover:opacity-100"
            >
              {showJson ? "Hide raw JSON" : "Show raw JSON"}
            </button>

            {showJson && (
              <pre className="mt-3 max-h-[420px] overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs leading-relaxed">
{prettyJson}
              </pre>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
