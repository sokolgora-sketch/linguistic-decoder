// src/components/PrinciplesBlock.tsx
"use client";

import type { AnalysisResult } from "@/shared/engineShape";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type PrinciplesBlockProps = {
  analysis: AnalysisResult;
};

export function PrinciplesBlock({ analysis }: PrinciplesBlockProps) {
  const sv = analysis.sevenVoices;
  const primary = analysis.core.input; // Corresponds to engine.primaryPath in spirit

  if (!sv) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seven Principles</CardTitle>
          <CardDescription>Coming soon for this word.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Engine voice path: {analysis.core.voices.vowelVoices.join(' → ')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seven Principles</CardTitle>
        <CardDescription>
          Path: {sv.principlesPath.join(' → ')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="font-medium">Voice Path</div>
          <div>{sv.voicePath.join(' → ')}</div>
        </div>

        <div>
          <div className="font-medium">Dominant</div>
          <div>{sv.dominant.join(', ')}</div>
        </div>

        <div>
          <div className="font-medium">7 words (experimental)</div>
          {sv.sevenWords && sv.sevenWords.length === 7 ? (
            <ol className="list-decimal list-inside space-y-1">
              {sv.sevenWords.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ol>
          ) : (
            <p className="text-xs text-muted-foreground">
              Not enough signal yet for a full sentence.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
