"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ApiVowelId = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

interface ApiCandidateAnalysis {
  language: string;
  form: string;
  decomposition: string[];
  functionalStatement: string;
  vowelPath: ApiVowelId[];
  notes: string[];
  dominantVowel?: ApiVowelId;
  traitsSummary?: string;
}

interface ApiWordInfo {
  raw: string;
  normalized: string;
  languageHint?: string;
}

interface ApiWordAnalysisResult {
  word: ApiWordInfo;
  candidates: ApiCandidateAnalysis[];
}

const VOWEL_COLORS: Record<ApiVowelId, string> = {
  A: "#f97373", // red-ish
  E: "#fb923c", // orange
  I: "#facc15", // yellow
  O: "#4ade80", // green
  U: "#60a5fa", // blue
  Y: "#a855f7", // indigo
  Ë: "#e879f9", // violet
};

export const ZeroWordPanel: React.FC = () => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiWordAnalysisResult | null>(null);

  async function handleAnalyze() {
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

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error || `Request failed with ${res.status}`);
      }

      const data = (await res.json()) as ApiWordAnalysisResult;
      setResult(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unknown error calling ZË-RO.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>ZË-RO · 7-Vowel Etymology Engine</CardTitle>
        <CardDescription>
          Enter a single word. ZË-RO returns structural candidates across
          languages using the 7-Vowel path.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder='Try "damage"'
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAnalyze();
            }}
          />
          <Button
            onClick={handleAnalyze}
            disabled={!word.trim() || loading}
            className="whitespace-nowrap"
          >
            {loading ? "Analyzing…" : "Analyze with ZË-RO"}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-400">
            ZË-RO error: <span className="font-mono">{error}</span>
          </p>
        )}

        {result && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Analyzed word:{" "}
              <span className="font-mono font-semibold">
                {result.word.raw}
              </span>{" "}
              <span className="opacity-70">
                (normalized: {result.word.normalized})
              </span>
              <br />
              Candidates found:{" "}
              <span className="font-mono">{result.candidates.length}</span>
            </div>

            {result.candidates.length === 0 && (
              <p className="text-sm">
                No passing candidates yet for this word. Engine logic still
                needs to be extended.
              </p>
            )}

            <div className="space-y-3">
              {result.candidates.map((c, idx) => (
                <div
                  key={`${c.language}-${c.form}-${idx}`}
                  className="rounded-lg border border-border bg-background/40 p-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold">
                        {c.form}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({c.language})
                        </span>
                      </div>
                      {c.decomposition.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1 text-xs">
                          {c.decomposition.map((part, i) => (
                            <Badge key={i} variant="outline">
                              {part}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {c.dominantVowel && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] uppercase text-muted-foreground">
                          Dominant vowel
                        </span>
                        <span
                          className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full px-2 text-xs font-mono"
                          style={{
                            backgroundColor:
                              VOWEL_COLORS[c.dominantVowel] ?? "#e5e7eb",
                            color: "#111827",
                          }}
                        >
                          {c.dominantVowel}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed">
                    {c.functionalStatement}
                  </p>

                  {c.vowelPath && c.vowelPath.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[11px] uppercase text-muted-foreground">
                        Vowel path:
                      </span>
                      {c.vowelPath.map((v, i) => (
                        <span
                          key={`${v}-${i}`}
                          className="inline-flex h-6 items-center justify-center rounded-full px-2 text-[11px] font-mono"
                          style={{
                            backgroundColor: VOWEL_COLORS[v] ?? "#e5e7eb",
                            color: "#111827",
                          }}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  )}

                  {c.traitsSummary && (
                    <p className="text-[11px] text-muted-foreground">
                      {c.traitsSummary}
                    </p>
                  )}

                  {c.notes && c.notes.length > 0 && (
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[11px] text-muted-foreground">
                      {c.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};