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
  const [result, setResult] = useState<AnalyzeWordResultV1 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err: any) {
      console.error("Analyze failed:", err);
      setError(err?.message ?? "Failed to analyze word.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const heart = result?.primaryPath;
  const frontier = result?.frontier ?? [];

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
                placeholder="Type a word…"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !word.trim()}>
                {loading ? "Analyzing…" : "Analyze"}
              </Button>
            </form>
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Heart + Frontier */}
        {result && (
          <div className="space-y-4">
            {/* HEART (primary path) */}
            <Card>
              <CardHeader>
                <CardTitle>Heart summary</CardTitle>
                <CardDescription>
                  Primary Seven-Voices path for{" "}
                  <span className="font-semibold">{result.word}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase text-muted-foreground tracking-wide">
                    Voice path
                  </p>
                  <p className="mt-1 font-medium">
                    {heart?.voicePath ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground tracking-wide">
                    Level path
                  </p>
                  <p className="mt-1 font-medium">
                    {heart?.levelPath ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground tracking-wide">
                    Ring path
                  </p>
                  <p className="mt-1 font-medium">
                    {heart?.ringPath ?? "—"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FRONTIER (alts) */}
            <Card>
              <CardHeader>
                <CardTitle>Frontier candidates</CardTitle>
                <CardDescription>
                  Alternate legal paths the Mind can explore inside the same
                  rules.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {frontier.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No frontier paths for this word.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
                        <tr>
                          <th className="py-2 pr-4 text-left">Alt</th>
                          <th className="py-2 pr-4 text-left">Voice path</th>
                          <th className="py-2 pr-4 text-left">Level path</th>
                          <th className="py-2 pr-4 text-left">Ring path</th>
                        </tr>
                      </thead>
                      <tbody>
                        {frontier.map((alt) => (
                          <tr
                            key={alt.id}
                            className="border-b border-border/40 last:border-0"
                          >
                            <td className="py-1.5 pr-4 font-mono text-xs">
                              {alt.id}
                            </td>
                            <td className="py-1.5 pr-4">{alt.voicePath}</td>
                            <td className="py-1.5 pr-4">{alt.levelPath}</td>
                            <td className="py-1.5 pr-4">{alt.ringPath}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* RAW JSON (debug) */}
            <Card>
              <CardHeader>
                <CardTitle>Raw result (debug view)</CardTitle>
                <CardDescription>
                  Full JSON from{" "}
                  <code className="font-mono text-xs">/api/analyze</code>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted/50 rounded-md p-3 overflow-auto max-h-[420px] whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}