"use client";

import React, { useState } from "react";
import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeepRootCard from "@/components/DeepRootCard";
import PatternAtlasCard from "@/components/PatternAtlasCard";

interface Props {
  result: AnalyzeWordResultUI;
}

export default function AnalysisResultView({ result }: Props) {
  const [showJson, setShowJson] = useState(false);
  const vowelSet = "O/I/U/E/Y/A/Ë"; // reordered & renamed

  const anyResult: any = result as any;

  const voicePath =
    result?.candidates?.[0]?.vowelPath ??
    anyResult?.candidates?.[0]?.vowel_path ??
    anyResult?.vowelPath ??
    anyResult?.vowel_path ??
    "";

  return (
    <div className="mt-6 space-y-6">
      <Card className="border-white/10 bg-zinc-950/30">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {result.word}{" "}
            <span className="text-xs text-muted-foreground">
              Engine: {result.engineVersion}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {result.candidates.map((c, i) => (
            <div key={i} className="space-y-2 text-sm">
              <div>
                Candidate {i + 1} —{" "}
                <span className="opacity-80">{c.language || "unknown"}</span>
              </div>
              <div>
                Form: <span className="font-semibold">{c.form}</span>
              </div>
              <div>
                Decomposition:{" "}
                <span className="font-mono">
                  {(c.decomposition ?? []).join(" – ") || "—"}
                </span>
              </div>
              <div>
                Vowel path:{" "}
                <span className="font-mono">{c.vowelPath ?? "—"}</span>
              </div>
              <div>
                Meaning:
                <div className="mt-1 text-muted-foreground">
                  {c.functionalStatement?.replace(
                    "Seven-vowel set (A/E/I/O/U/Y/Ë)",
                    `Seven-Vowels set (${vowelSet})`,
                  ) ?? "—"}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {voicePath ? (
        <PatternAtlasCard
          voicePath={voicePath}
          strictInput={true}
        />
      ) : null}

      {/* DeepRoot is NOT raw JSON — show it as a real card */}
      <DeepRootCard deepRoot={(result as any).deepRoot} />

      <Card className="border-white/10 bg-zinc-950/30">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowJson(!showJson)}
          >
            {showJson ? "Hide raw JSON" : "Show raw JSON"}
          </Button>

          {showJson && (
            <pre className="max-w-full overflow-x-auto break-words whitespace-pre-wrap rounded-lg border border-white/10 bg-black/40 p-3 text-xs leading-relaxed">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
