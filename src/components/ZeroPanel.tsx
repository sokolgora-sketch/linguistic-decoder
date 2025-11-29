"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { WordAnalysisResult, CandidateAnalysis } from "@/engine/wordAnalyzer";

const ZeroPanel: React.FC = () => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState<WordAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const trimmed = word.trim();
    if (!trimmed) {
      setError("Type a word first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }

      setResult(data as WordAnalysisResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>ZË-RO · 7-Vowel Etymology Engine</CardTitle>
        <CardDescription>
          Experimental word-first etymology. For now, try <span className="font-semibold">damage</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAnalyze} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Input
              placeholder="Type a word (e.g. damage)"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Analyzing…" : "Run ZË-RO"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-4 space-y-4 text-sm">
              <p className="text-muted-foreground">
                Input: <span className="font-semibold">{result.word.raw}</span>{" "}
                → normalized as <span className="font-mono">{result.word.normalized}</span>
              </p>

              {result.candidates.length === 0 && (
                <p className="text-muted-foreground">
                  No structural candidates passed for this word yet.
                  For v1, only the test word <span className="font-semibold">damage</span> is wired.
                </p>
              )}

              {result.candidates.map((c, idx) => (
                <CandidateCard key={idx} candidate={c} />
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

interface CandidateCardProps {
  candidate: CandidateAnalysis;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const { language, form, decomposition, functionalStatement, vowelPath, traitsSummary, notes } =
    candidate;

  return (
    <div className="rounded-lg border border-border p-3 space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {language.toUpperCase()}
          </div>
          <div className="text-lg font-semibold">{form}</div>
        </div>
        {vowelPath && vowelPath.length > 0 && (
          <div className="flex flex-wrap gap-1 text-xs">
            {vowelPath.map((v, i) => (
              <span
                key={`${v}-${i}`}
                className="rounded-full px-2 py-0.5 border border-border font-mono"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Decomposition:{" "}
        {decomposition.length > 0
          ? decomposition.join(" + ")
          : "—"}
      </div>

      <div className="text-sm">
        {functionalStatement}
      </div>

      {traitsSummary && (
        <div className="text-xs text-muted-foreground">
          {traitsSummary}
        </div>
      )}

      {notes && notes.length > 0 && (
        <ul className="mt-1 list-disc pl-5 text-xs text-muted-foreground space-y-0.5">
          {notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ZeroPanel;