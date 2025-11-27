"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { WordAnalysisResult } from "@/engine/wordAnalyzer";

const ZeroWordPanel: React.FC = () => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WordAnalysisResult | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/zero-analyze-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || `Request failed with status ${res.status}`);
      } else {
        setResult(data as WordAnalysisResult);
      }
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>ZË-RO · 7-Vowel Etymology Engine</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAnalyze} className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Type a word (e.g. damage, study, mathematics)…"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <Button type="submit" disabled={loading || !word.trim()}>
            {loading ? "Analyzing…" : "Analyze"}
          </Button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-4 space-y-4 text-sm">
            <div className="text-xs text-muted-foreground">
              Word: <span className="font-mono">{result.word.raw}</span> ·
              normalized as{" "}
              <span className="font-mono">{result.word.normalized}</span>
            </div>

            {result.candidates.length === 0 && (
              <p>No passing candidates yet for this word.</p>
            )}

            {result.candidates.map((c, idx) => (
              <div
                key={`${c.language}-${c.form}-${idx}`}
                className="rounded-md border border-border/50 p-3"
              >
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {c.language} · <span className="font-mono">{c.form}</span>
                </div>

                <div className="mt-1 font-semibold">
                  {c.decomposition.join(" · ")}
                </div>

                <p className="mt-1">
                  {c.functionalStatement}
                </p>

                <div className="mt-2 text-xs text-muted-foreground">
                  Vowel path:{" "}
                  {c.vowelPath.map((v, i) => (
                    <span key={i} className="font-mono">
                      {v}
                      {i < c.vowelPath.length - 1 ? " → " : ""}
                    </span>
                  ))}
                </div>

                {c.traitsSummary && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.traitsSummary}
                  </p>
                )}

                {c.notes?.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
                    {c.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZeroWordPanel;
