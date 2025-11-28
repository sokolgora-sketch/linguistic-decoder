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

import { analyzeClient } from "@/lib/analyzeClient";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import type {
  AnalysisResultWithFamilies,
  SevenCalcResult,
} from "@/shared/engineShape";
import type { Alphabet } from "@/lib/runAnalysis";
import SevenPrinciplesCompare from "./SevenPrinciplesCompare";

type Mode = "strict" | "open";

type ComparePanelProps = {
  defaultMode?: Mode;
  defaultAlphabet?: Alphabet;
};

// Reuse the SAME engine path as the main analyzer.
// No direct fetch, no custom API route – we just call analyzeClient.
async function analyzeWordWithEngine(
  word: string,
  mode: Mode,
  alphabet: Alphabet
): Promise<AnalysisResultWithFamilies | null> {
  const trimmed = word.trim();
  if (!trimmed) return null;

  // You can tune these if you want later
  const edgeWeight = 0.25;
  const useAi = false;

  const payload = await analyzeClient(trimmed, mode, alphabet, {
    edgeWeight,
    useAi,
    // we can skip writes + bypass cache if you want it “pure”
    bypass: true,
    skipWrite: true,
  });

  const analysis = enginePayloadToAnalysisResult(payload);
  return analysis as AnalysisResultWithFamilies;
}

const ComparePanel: React.FC<ComparePanelProps> = ({
  defaultMode = "strict",
  defaultAlphabet = "auto",
}) => {
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
        analyzeWordWithEngine(a, defaultMode, defaultAlphabet),
        analyzeWordWithEngine(b, defaultMode, defaultAlphabet),
      ]);

      setResults({ a: resA, b: resB });
    } catch (e: any) {
      setError(e?.message ?? "Comparison failed");
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
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Compare
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-500 whitespace-pre-wrap">{error}</p>
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
