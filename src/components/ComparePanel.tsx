"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { analyzeClient } from "@/lib/analyzeClient";
import type { Alphabet } from "@/lib/runAnalysis";

import {
  normalizeEnginePayload,
  type EnginePayload,
  type AnalysisResultWithFamilies,
} from "@/shared/engineShape";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

import SevenPrinciplesCompare from "./SevenPrinciplesCompare";

type ComparePanelProps = {
  defaultMode: "strict" | "open";
  defaultAlphabet: Alphabet;
};

async function runSingleWord(
  word: string,
  mode: "strict" | "open",
  alphabet: Alphabet
): Promise<AnalysisResultWithFamilies | null> {
  const trimmed = word.trim();
  if (!trimmed) return null;

  const raw = (await analyzeClient(trimmed, mode, alphabet, {
    edgeWeight: 0.25,
    useAi: false,
    bypass: false, // ensure full solver
  })) as EnginePayload;

  const normalized = normalizeEnginePayload(raw);
  const analysis = enginePayloadToAnalysisResult(normalized);
  return analysis;
}

const ComparePanel: React.FC<ComparePanelProps> = ({
  defaultMode,
  defaultAlphabet,
}) => {
  const [wordA, setWordA] = useState("study");
  const [wordB, setWordB] = useState("damage");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

    setError(null);
    setLoading(true);
    setResults({ a: null, b: null });

    try {
      const [resA, resB] = await Promise.all([
        runSingleWord(a, defaultMode, defaultAlphabet),
        runSingleWord(b, defaultMode, defaultAlphabet),
      ]);
      setResults({ a: resA, b: resB });
      setRefreshKey((k) => k + 1); // ✅ force re-render on each compare
    } catch (e: any) {
      console.error("Compare error:", e);
      setError(e?.message || "Compare failed");
    } finally {
      setLoading(false);
    }
  };

  const heartResults = {
    a: results.a?.math7?.heart ?? null,
    b: results.b?.math7?.heart ?? null,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compare two words</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Input
            placeholder="First word"
            value={wordA}
            onChange={(e) => setWordA(e.target.value)}
          />
          <span className="text-muted-foreground">vs.</span>
          <Input
            placeholder="Second word"
            value={wordB}
            onChange={(e) => setWordB(e.target.value)}
          />
          <Button onClick={handleCompare} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Compare
          </Button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {(heartResults.a || heartResults.b) && (
          <SevenPrinciplesCompare
            key={refreshKey} // ✅ re-mounts every new compare
            wordA={wordA}
            wordB={wordB}
            results={heartResults}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ComparePanel;
