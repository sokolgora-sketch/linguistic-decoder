"use client";

import React, { useState } from "react";
import Link from "next/link";

type Voice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

type VoiceVector = {
  A: number;
  E: number;
  I: number;
  O: number;
  U: number;
  Y: number;
  Ë: number;
};

type FunctionalStatement = {
  action: string;
  instrument: string;
  unit: string;
};

type CandidateAnalysis = {
  language: string;
  form: string;
  decomposition: string[];
  functional_statement: FunctionalStatement;
  vowel_path: Voice[];
  voice_vector: VoiceVector;
  ring_fit?: string;
  signals?: string[];
};

type Math7Summary = {
  path: Voice[];
  vector: VoiceVector;
  totalVoices: number;
  dominantVoices: Voice[];
  notes?: string[];
};

type AnalysisResult = {
  word: string;
  mode: string;
  language_guess?: string;
  candidates?: CandidateAnalysis[];
  math7_summary?: Math7Summary;
  engine_meta?: {
    engineVersion?: string;
    timestamp?: string;
  };
};

export default function WordPageV1() {
  const [word, setWord] = useState("");
  const [mode, setMode] = useState<"strict" | "open">("strict");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setShowJson(false);

    try {
      const res = await fetch("/api/analyze-v1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: trimmed, mode2: mode }),
      });

      if (!res.ok) {
        let message = `Request failed with status ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {
          // ignore JSON parse error
        }
        throw new Error(message);
      }

      const data = (await res.json()) as AnalysisResult;
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            ZË-RO · Word Page v1
          </h1>
          <p className="text-sm text-slate-400">
            Seven-Voices engine v1 · strict functional reading · no magic.
          </p>
        </header>

        {/* Form */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Type a word (e.g. study, damage, language)…"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          <div className="flex gap-2">
            <select
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as "strict" | "open")}
            >
              <option value="strict">strict</option>
              <option value="open">open</option>
            </select>
            <button
              type="submit"
              disabled={loading || !word.trim()}
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Analyzing…" : "Analyze v1"}
            </button>
          </div>
          </form>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {result && (
            <p className="text-xs text-slate-500">
              Engine v1 ·{" "}
              {result.engine_meta?.engineVersion ?? "unknown version"} · mode{" "}
              {result.mode}
              {result.language_guess ? ` · language guess: ${result.language_guess}` : ""}
            </p>
          )}
        </section>

        {result?.word && (
          <div className="flex justify-end mt-2">
            <Link
              href={`/word/${encodeURIComponent(result.word)}`}
              className="text-xs text-slate-400 hover:text-slate-100 underline underline-offset-4"
            >
              View full v1 summary (dev)
            </Link>
          </div>
        )}

        {/* Math7 summary */}
        {result?.math7_summary && (
          <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Math7 summary</h2>
              <span className="text-[11px] uppercase tracking-wide text-slate-500">
                Seven-Voices core
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <div className="text-[11px] uppercase text-slate-500 mb-1">
                  Voice path
                </div>
                <div className="inline-flex flex-wrap gap-1">
                  {result.math7_summary.path.map((v, idx) => (
                    <span
                      key={`${v}-${idx}`}
                      className="rounded-full border border-slate-700 bg-slate-950 px-2 py-0.5 text-xs"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase text-slate-500 mb-1">
                  Dominant voices
                </div>
                <div className="inline-flex flex-wrap gap-1">
                  {result.math7_summary.dominantVoices.map((v) => (
                    <span
                      key={v}
                      className="rounded-full bg-slate-800 px-2 py-0.5 text-xs"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase text-slate-500 mb-1">
                  Total voices
                </div>
                <div className="text-sm">
                  {result.math7_summary.totalVoices}
                </div>
              </div>
            </div>

            {result.math7_summary.notes && result.math7_summary.notes.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-400">
                {result.math7_summary.notes.map((n, idx) => (
                  <li key={idx}>{n}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Candidates */}
        {result?.candidates && result.candidates.length > 0 && (
          <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">
                Candidate readings
              </h2>
              <span className="text-[11px] uppercase tracking-wide text-slate-500">
                {result.candidates.length} candidate
                {result.candidates.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-4">
              {result.candidates.map((c, idx) => (
                <div
                  key={`${c.language}-${c.form}-${idx}`}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-sm space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase text-slate-500">
                        {c.language}
                      </span>
                      <span className="text-sm font-semibold">{c.form}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {c.ring_fit ? `Ring: ${c.ring_fit}` : null}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <div className="text-[11px] uppercase text-slate-500 mb-1">
                        Decomposition
                      </div>
                      <div className="inline-flex flex-wrap gap-1">
                        {c.decomposition.map((part, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-slate-800 px-2 py-0.5 text-xs"
                          >
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] uppercase text-slate-500 mb-1">
                        Functional statement
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="font-semibold">Action:</span>{" "}
                        {c.functional_statement.action}
                        <br />
                        <span className="font-semibold">Instrument:</span>{" "}
                        {c.functional_statement.instrument}
                        <br />
                        <span className="font-semibold">Unit:</span>{" "}
                        {c.functional_statement.unit}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] uppercase text-slate-500 mb-1">
                        Vowel path
                      </div>
                      <div className="inline-flex flex-wrap gap-1">
                        {c.vowel_path.map((v, i) => (
                          <span
                            key={i}
                            className="rounded-full border border-slate-700 px-2 py-0.5 text-xs"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {c.signals && c.signals.length > 0 && (
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-[11px] text-slate-400">
                      {c.signals.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* JSON toggle */}
        {result && (
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">
                Raw JSON (v1)
              </h2>
              <button
                type="button"
                onClick={() => setShowJson((v) => !v)}
                className="text-xs rounded-lg border border-slate-700 px-3 py-1 text-slate-200 hover:bg-slate-800"
              >
                {showJson ? "Hide JSON" : "Show JSON"}
              </button>
            </div>
            {showJson && (
              <pre className="max-h-80 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-200">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
