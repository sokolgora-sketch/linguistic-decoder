"use client";

import React, { useState } from "react";
import type { AnalysisResult } from "@/src/v1/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  result: AnalysisResult;
}

export default function AnalysisResultView({ result }: Props) {
  const [showJson, setShowJson] = useState(false);
  const vowelSet = "O/I/U/E/Y/A/Ë"; // reordered & renamed

  return (
    <div className="mt-6 space-y-6">
      <Card className="border-white/10 bg-zinc-950/30">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {result.word} <span className="text-xs text-muted-foreground">Engine: {result.engineVersion}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.candidates.map((c, i) => (
            <div key={i} className="space-y-2 text-sm">
              <div>
                Candidate {i + 1} — <span className="opacity-80">{c.language || "unknown"}</span>
              </div>
              <div>Form: <span className="font-semibold">{c.form}</span></div>
              <div>Decomposition: <span className="font-mono">{c.decomposition.join(" – ")}</span></div>
              <div>Vowel path: <span className="font-mono">{c.vowelPath}</span></div>
              <div>
                Meaning:
                <div className="mt-1 text-muted-foreground">
                  {c.functionalStatement?.replace("Seven-Voices set (A/E/I/O/U/Y/Ë)", `Seven-Vowels set (${vowelSet})`) ??
                    "—"}
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => setShowJson(!showJson)}
          >
            {showJson ? "Hide raw JSON" : "Show raw JSON"}
          </Button>

          {showJson && (
            <pre className="mt-3 max-w-full overflow-x-auto break-words whitespace-pre-wrap rounded-lg border border-white/10 bg-black/40 p-3 text-xs leading-relaxed">
{JSON.stringify(result, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
