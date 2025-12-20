'use client';
import React, { useRef, useState } from "react";

/**
 * AnalyzeConsole (final v1.1)
 * Combines stable logic (passing tests) + restored layout (two-column, styled).
 */
export default function AnalyzeConsole() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inFlightRef = useRef(false);

  async function handleAnalyze() {
    if (inFlightRef.current) return;
    const q = word.trim();
    if (!q) {
      setError("Type a word before analyzing.");
      return;
    }

    inFlightRef.current = true;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: q }),
      });
      if (!res || !res.ok) throw new Error("Engine error");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Network error or engine error.");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <div className="text-xl font-semibold tracking-tight">ZË-RO</div>
          <div className="text-sm text-white/60">
            Seven-vowel word decoder.
          </div>
        </div>

        {/* Input and Controls */}
        <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="mb-1 text-xs text-white/60">Enter a word</div>
              <input
                id="word-input"
                type="text"
                placeholder="study"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-black md:text-sm"
              />
            </div>
            <div className="flex gap-2 md:pt-5">
              <button
                aria-busy={loading ? "true" : "false"}
                disabled={loading}
                onClick={handleAnalyze}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm bg-white/10 text-white hover:bg-white/20"
              >
                Analyze
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  setWord("");
                  setError(null);
                  setResult(null);
                }}
                title="Clear results"
                className="border border-white/20 hover:bg-white/10 h-10 px-4 py-2 rounded-md text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Vowels */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
            <span className="text-white/50">Vowels:</span>
            <span className="inline-flex items-center gap-1">
              <span className="text-white/40">Center</span>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs border-green-400/40 bg-green-500/20 text-green-100">O</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-white/40">Inner</span>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs border-yellow-400/40 bg-yellow-500/20 text-yellow-100">I</span>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs border-blue-400/40 bg-blue-500/20 text-blue-100">U</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-white/40">Middle</span>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs border-orange-400/40 bg-orange-500/20 text-orange-100">E</span>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs border-indigo-400/40 bg-indigo-500/20 text-indigo-100">Y</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-white/40">Outer</span>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs border-red-400/40 bg-red-500/20 text-red-100">A</span>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs border-violet-400/40 bg-violet-500/20 text-violet-100">Ë</span>
            </span>
          </div>
        </div>

        {/* Output or status */}
        {error && (
          <div className="mt-3 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        {result && (
          <div className="rounded-lg border text-card-foreground shadow-sm border-white/10 bg-zinc-950 mt-4">
            <div className="p-6 space-y-3">
              <div className="font-semibold tracking-tight text-base">
                {result.word}
              </div>
              <pre className="text-xs text-white/80 overflow-x-auto border border-white/10 rounded-md bg-black/30 p-3">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="rounded-lg border text-card-foreground shadow-sm border-white/10 bg-zinc-950 mt-4">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold tracking-tight text-base">
                Ready when you are.
              </div>
              <div className="text-sm text-white/60">
                Run an analysis to generate a deterministic report.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
