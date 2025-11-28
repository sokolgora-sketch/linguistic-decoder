// src/components/ZeroWordPanel.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import type {
  AnalyzeWordResult,
  LanguageFamilyCandidate,
} from "@/engine/analyzeWord";

const ZeroWordPanel: React.FC = () => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeWordResult | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as AnalyzeWordResult;
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const families: LanguageFamilyCandidate[] =
    result?.languageFamilies ?? [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ZË-RO Word Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAnalyze} className="flex gap-2">
          <Input
            placeholder="Type a word (study, damage, love...)"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {result && (
          <div className="space-y-4 mt-2">
            {/* Language families */}
            {families.map((fam) => (
              <div
                key={fam.language}
                className="border rounded-md p-3 text-sm space-y-1"
              >
                <div className="font-semibold capitalize">
                  {fam.language}
                </div>

                {fam.morphologyMatrix && (
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Morphology matrix
                    </div>
                    <div>
                      Pivot:{" "}
                      <span className="font-mono">
                        {fam.morphologyMatrix.pivot}
                      </span>{" "}
                      <span className="text-xs text-muted-foreground">
                        ({fam.morphologyMatrix.source})
                      </span>
                    </div>
                  </div>
                )}

                {fam.symbolic && fam.symbolic.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fam.symbolic.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]"
                      >
                        <span className="font-semibold mr-1">
                          {tag.axis}
                        </span>
                        {tag.note}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Top-level symbolic layer */}
            {result.symbolic && (
              <div className="border rounded-md p-3 text-sm space-y-1">
                <div className="font-semibold">
                  {result.symbolic.label}
                </div>
                <ul className="list-disc list-inside text-xs text-muted-foreground">
                  {result.symbolic.notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZeroWordPanel;
