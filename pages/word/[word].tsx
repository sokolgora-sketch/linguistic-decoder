"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

type AnalyzeResponse = any;

export default function WordPage() {
  const router = useRouter();
  const { word } = router.query;

  const rawWord =
    typeof word === "string"
      ? word
      : Array.isArray(word)
      ? word[0] ?? ""
      : "";

  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    if (!rawWord) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        // Use the new v1 API
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word: rawWord, mode: "strict" }),
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
            err instanceof Error ? err.message : "Unknown error while loading word.",
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
  }, [rawWord]);

  const primary = (data as any)?.primaryPath ?? null;
  const frontier = ((data as any)?.frontier ?? []) as any[];
  const families = ((data as any)?.languageFamilies ?? []) as any[];
  const symbolic = (data as any)?.symbolic ?? null;
  const meta = (data as any)?.meta ?? null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            ZË-RO · Word page v1
          </h1>
          <p className="text-sm text-slate-400">
            Strict Seven-Voices reading for{" "}
            <span className="font-semibold">{rawWord || "—"}</span>.
          </p>
        </header>

        {/* Status */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-lg font-medium">Status</h2>

          {loading && <p className="text-slate-400 text-sm">Running analysis…</p>}

          {!loading && error && (
            <p className="text-sm text-red-400">Error: {error}</p>
          )}

          {!loading && !error && data && (
            <div className="space-y-1 text-sm">
              <p className="text-slate-300">
                Engine:{" "}
                <span className="font-mono">
                  {meta?.engineVersion ?? "SevenVoices Core v1"}
                </span>
              </p>
              <p className="text-slate-300">
                Mode:{" "}
                <span className="font-mono">
                  {(meta?.mode as string) ?? (data as any).mode ?? "strict"}
                </span>
              </p>
              {meta?.createdAt && (
                <p className="text-xs text-slate-500">
                  Created at:{" "}
                  <span className="font-mono">{meta.createdAt}</span>
                </p>
              )}
            </div>
          )}
        </section>

        {/* Primary path */}
        {!loading && !error && primary && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
            <h2 className="text-lg font-medium">Primary path</h2>
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <div className="text-xs uppercase text-slate-500">Voice path</div>
                <div className="font-mono text-slate-100">
                  {primary.voicePath ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Level path</div>
                <div className="font-mono text-slate-100">
                  {primary.levelPath ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Ring path</div>
                <div className="font-mono text-slate-100">
                  {primary.ringPath ?? "—"}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Frontier candidates */}
        {!loading && !error && frontier.length > 0 && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-medium">Frontier candidates</h2>
              <p className="text-xs text-slate-500">
                Alternate legal paths the Mind can explore.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-black/20">
              <table className="min-w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-black/40 text-slate-400">
                  <tr>
                    <th className="px-3 py-2 font-normal">Alt</th>
                    <th className="px-3 py-2 font-normal">Voice path</th>
                    <th className="px-3 py-2 font-normal">Level path</th>
                    <th className="px-3 py-2 font-normal">Ring path</th>
                  </tr>
                </thead>
                <tbody>
                  {frontier.map((alt: any) => (
                    <tr
                      key={alt.id ?? alt.voicePath}
                      className="border-t border-slate-900 text-slate-100"
                    >
                      <td className="px-3 py-2 font-mono">
                        {alt.id ?? "—"}
                      </td>
                      <td className="px-3 py-2 font-mono">
                        {alt.voicePath ?? "—"}
                      </td>
                      <td className="px-3 py-2 font-mono">
                        {alt.levelPath ?? "—"}
                      </td>
                      <td className="px-3 py-2 font-mono">
                        {alt.ringPath ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Language families */}
        {!loading && !error && families.length > 0 && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-medium">Language families (v1)</h2>

            <div className="space-y-3">
              {families.map((fam: any, idx: number) => (
                <div
                  key={`${fam.language}-${idx}`}
                  className="rounded-xl border border-slate-800 bg-black/30 p-4 text-sm space-y-2"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="space-x-2">
                      <span className="font-semibold">{fam.language}</span>
                      {fam.form && (
                        <span className="font-mono text-xs text-slate-300">
                          {fam.form}
                        </span>
                      )}
                    </div>
                    {fam.passes === true && (
                      <span className="rounded-full border border-emerald-500/60 px-2 py-[2px] text-[10px] uppercase tracking-wide text-emerald-400">
                        passes v1
                      </span>
                    )}
                  </div>

                  {fam.gloss && (
                    <p className="text-xs text-slate-400">{fam.gloss}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    {fam.voicePath && (
                      <span>Voice: {fam.voicePath}</span>
                    )}
                    {fam.levelPath && fam.levelPath !== "N/A" && (
                      <span>Level: {fam.levelPath}</span>
                    )}
                    {fam.ringPath && fam.ringPath !== "N/A" && (
                      <span>Ring: {fam.ringPath}</span>
                    )}
                  </div>

                  {Array.isArray(fam.symbolic) && fam.symbolic.length > 0 && (
                    <ul className="mt-1 space-y-1 text-xs text-slate-400">
                      {fam.symbolic.map((s: any, i: number) => (
                        <li key={i}>
                          <span className="font-semibold text-slate-200">
                            {s.tag ?? "symbolic"}
                          </span>
                          {s.note && <> — {s.note}</>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Global symbolic note */}
        {!loading && !error && symbolic && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-2 text-sm">
            <h2 className="text-lg font-medium">
              {symbolic.label ?? "Symbolic reading (v1)"}
            </h2>
            {Array.isArray(symbolic.notes) && symbolic.notes.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-slate-300">
                {symbolic.notes.map((note: string, idx: number) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            )}
          </section>
        )}

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
