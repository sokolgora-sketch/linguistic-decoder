
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { AnalyzeWordResultV1 } from "@/shared/resultShape.v1";

export default function Page() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeWordResultV1 | null>(null);
  const [history, setHistory] = useState<AnalyzeWordResultV1[]>([]);

  // --- Engine meta helpers (loose typing for debug fields) ---
  const meta = result?.meta as any | undefined;
  const cache =
    meta?.cache as
      | { hit?: string; elapsedMs?: number; source?: string }
      | undefined;

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        word: trimmed,
        mode: "strict",
        alphabet: "auto",
      });

      const res = await fetch(`/api/analyze?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = (await res.json()) as AnalyzeWordResultV1;
      setResult(json);

      // 🔹 Update in-memory history (keep latest 10, no duplicates by word)
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.word !== json.word);
        return [json, ...filtered].slice(0, 10);
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to analyze word.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 lg:p-8 flex flex-col items-stretch">
      <main className="max-w-5xl mx-auto w-full space-y-8 flex-1">
        {/* Header */}
        <header className="pb-4 border-b border-border/60">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Linguistic Decoder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seven-Voices prototype — analyze a word and see how the Heart and
            Frontier respond.
          </p>
        </header>

        {/* Analyze form */}
        <Card>
          <CardHeader>
            <CardTitle>Analyze a word</CardTitle>
            <CardDescription>
              Type a word and run the Seven-Voices engine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAnalyze}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="study"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </form>
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Heart summary */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Heart summary</CardTitle>
              <CardDescription>
                Primary Seven-Voices path for{" "}
                <span className="font-mono">{result.word}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-wide mb-1">
                    Voice path
                  </div>
                  <div className="font-medium">
                    {result.primaryPath.voicePath}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-wide mb-1">
                    Level path
                  </div>
                  <div className="font-medium">
                    {result.primaryPath.levelPath}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-wide mb-1">
                    Ring path
                  </div>
                  <div className="font-medium">
                    {result.primaryPath.ringPath}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Frontier candidates */}
        {result && result.frontier?.length > 0 && (
<Card>
  <CardHeader>
    <CardTitle>Frontier candidates</CardTitle>
    <CardDescription>
      Alternate legal paths the Mind can explore inside the same rules.
    </CardDescription>
  </CardHeader>
  <CardContent>
    {!result ? (
      <p className="text-sm text-muted-foreground">
        Run a word to see alternate paths.
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 text-left w-16">Alt</th>
              <th className="py-2 px-4 text-left">Voice path</th>
              <th className="py-2 px-4 text-left">Level path</th>
              <th className="py-2 pl-4 text-left">Ring path</th>
            </tr>
          </thead>
          <tbody>
            {result.frontier.map((alt, idx) => (
              <tr
                key={alt.id ?? `alt-${idx}`}
                className="border-b border-muted/20 last:border-b-0"
              >
                <td className="py-1 pr-4 text-xs text-muted-foreground">
                  {`alt-${idx + 1}`}
                </td>
                <td className="py-1 px-4 font-mono">{alt.voicePath}</td>
                <td className="py-1 px-4 font-mono">{alt.levelPath}</td>
                <td className="py-1 pl-4 font-mono">{alt.ringPath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </CardContent>
</Card>
        )}

<Card>
  <CardHeader>
    <CardTitle>Language families (canon layer)</CardTitle>
    <CardDescription>
      How different languages carry this Seven-Voices path.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 text-left">Language</th>
            <th className="px-4 py-2 text-left">Form</th>
            <th className="px-4 py-2 text-left">Gloss</th>
            <th className="px-4 py-2 text-center">Passes</th>
            <th className="px-4 py-2 text-center">Voice path</th>
            <th className="px-4 py-2 text-center">Level path</th>
            <th className="px-4 py-2 text-center">Ring path</th>
            <th className="px-4 py-2 text-left">Pivot</th>
          </tr>
        </thead>
        <tbody>
          {result?.languageFamilies?.map((fam) => (
            <tr key={fam.language} className="border-b border-muted/20 last:border-0">
              <td className="px-4 py-2 text-left">{fam.language}</td>
              <td className="px-4 py-2 text-left font-mono text-xs">{fam.form}</td>
              <td className="px-4 py-2 text-left text-xs text-muted-foreground">
                {fam.gloss || "—"}
              </td>
              <td className="px-4 py-2 text-center">
                {fam.passes ? (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                    yes
                  </span>
                ) : (
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                    no
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-center font-mono text-xs">
                {fam.voicePath}
              </td>
              <td className="px-4 py-2 text-center font-mono text-xs">
                {fam.levelPath}
              </td>
              <td className="px-4 py-2 text-center font-mono text-xs">
                {fam.ringPath}
              </td>
              <td className="px-4 py-2 text-left font-mono text-xs">
                {fam.morphologyMatrix?.pivot ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Symbolic reading (experimental)</CardTitle>
    <CardDescription>
      High-level reading of this word&apos;s path. Sketch, not doctrine.
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-2">
    {!result && (
      <p className="text-sm text-muted-foreground">
        Run an analysis to see the symbolic reading from the Seven-Voices engine.
      </p>
    )}

    {result && (
      <>
        <p className="text-sm font-medium">
          {result.symbolic?.label ?? "Engine symbolic reading"}
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          {(result.symbolic?.notes ?? []).map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </>
    )}
  </CardContent>
</Card>

        {/* Recent history (session only) */}
        {history.length > 0 && (
<Card>
  <CardHeader>
    <CardTitle>Recent words (this session)</CardTitle>
    <CardDescription>
      Quick view of the last heart paths you ran.
    </CardDescription>
  </CardHeader>
  <CardContent>
    {history.length === 0 ? (
      <p className="text-sm text-muted-foreground">
        No history yet. Run a word to see it here.
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 text-left w-10">#</th>
              <th className="py-2 px-4 text-left">Word</th>
              <th className="py-2 px-4 text-left">Voice path</th>
              <th className="py-2 px-4 text-left">Level path</th>
              <th className="py-2 pl-4 text-left">Ring path</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr
                key={`${item.word}-${idx}`}
                className="border-b border-muted/20 last:border-b-0"
              >
                <td className="py-1 pr-4 text-xs text-muted-foreground">
                  {idx + 1}
                </td>
                <td className="py-1 px-4">{item.word}</td>
                <td className="py-1 px-4 font-mono">
                  {item.primaryPath.voicePath}
                </td>
                <td className="py-1 px-4 font-mono">
                  {item.primaryPath.levelPath}
                </td>
                <td className="py-1 pl-4 font-mono">
                  {item.primaryPath.ringPath}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </CardContent>
</Card>
        )}

      {/* Engine meta */}
      {meta && (
        <Card>
          <CardHeader>
            <CardTitle>Engine meta</CardTitle>
            <CardDescription>
              Debug info for this analysis run.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
            {/* Engine version / timestamp */}
            <div>
              <div className="font-medium text-primary-foreground/80">
                Engine
              </div>
              <div className="mt-1 space-y-1">
                <div>
                  version{" "}
                  <span className="font-mono">
                    {meta.engineVersion}
                  </span>
                </div>
                <div>
                  created{" "}
                  <span className="font-mono">
                    {new Date(meta.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Mode + alphabet */}
            <div>
              <div className="font-medium text-primary-foreground/80">
                Mode
              </div>
              <div className="mt-1 space-y-1">
                <div>
                  mode{" "}
                  <span className="font-mono">
                    {typeof meta.mode === "string"
                      ? meta.mode
                      : meta.mode?.mode ?? "strict"}
                  </span>
                </div>
                <div>
                  alphabet{" "}
                  <span className="font-mono">
                    {meta.alphabet ??
                      (typeof meta.mode === "string"
                        ? "auto"
                        : meta.mode?.alphabet ?? "auto")}
                  </span>
                </div>
              </div>
            </div>

            {/* Cache info */}
            <div>
              <div className="font-medium text-primary-foreground/80">
                Cache
              </div>
              <div className="mt-1 space-y-1">
                <div>
                  hit{" "}
                  <span className="font-mono">
                    {cache?.hit ?? "—"}
                  </span>
                </div>
                <div>
                  elapsed{" "}
                  <span className="font-mono">
                    {cache?.elapsedMs != null
                      ? `${cache.elapsedMs.toFixed(0)} ms`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

        {/* Raw JSON (debug) */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Raw result (debug view)</CardTitle>
              <CardDescription>
                Full JSON from{" "}
                <code className="font-mono text-xs">/api/analyze</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/60 bg-muted/5 max-h-80 overflow-auto">
                <pre className="text-xs font-.mono p-4 whitespace-pre">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
