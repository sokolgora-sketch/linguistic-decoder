// src/components/ComparePanel.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import type {
  AnalysisResultWithFamilies,
  SevenCalcResult,
} from "@/shared/engineShape";
import SevenPrinciplesCompare from "./SevenPrinciplesCompare";

async function analyzeWord(
  word: string
): Promise<AnalysisResultWithFamilies | null> {
  const trimmed = word.trim();
  if (!trimmed) return null;

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word: trimmed,
      mode: "strict",
      alphabet: "auto",
    }),
  });

  if (!res.ok) {
    let message = `API failed (${res.status})`;
    try {
      const text = await res.text();
      // When it's an HTML 404 page, don't dump it fully
      if (!text.startsWith("<!DOCTYPE")) {
        message += `: ${text}`;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const json = await res.json();
  // Server returns the engine payload as the top-level object
  const analysis = enginePayloadToAnalysisResult(json);
  return analysis as AnalysisResultWithFamilies;
}

const ComparePanel: React.FC = () => {
  const [wordA, setWordA] = useState("study");
  const [wordB, setWordB] = useState("damage");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<{
    a: AnalysisResultWithFamilies | null;
    b: AnalysisResultWithFamilies | null;
  }>({ a: null, b: null });

  const handleCompare = async () => {
    const a = wordA.trim();
    const b = wordB.trim();

    if (!a || !b) {
      setError("Please enter both words.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults({ a: null, b: null });

    try {
      const [resA, resB] = await Promise.all([
        analyzeWord(a),
        analyzeWord(b),
      ]);

      setResults({ a: resA, b: resB });
    } catch (e: any) {
      setError(e.message ?? "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  const sevenCalcResults = {
    a: (results.a?.math7?.heart ?? null) as SevenCalcResult | null,
    b: (results.b?.math7?.heart ?? null) as SevenCalcResult | null,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compare two words</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Input
            placeholder="First word (e.g. study)"
            value={wordA}
            onChange={(e) => setWordA(e.target.value)}
          />
          <span className="text-muted-foreground">vs.</span>
          <Input
            placeholder="Second word (e.g. damage)"
            value={wordB}
            onChange={(e) => setWordB(e.target.value)}
          />
          <Button onClick={handleCompare} disabled={loading}>
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Compare
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500 whitespace-pre-wrap">
            {error}
          </p>
        )}

        {(results.a || results.b) && (
          <SevenPrinciplesCompare
            results={sevenCalcResults}
            wordA={wordA}
            wordB={wordB}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ComparePanel;
