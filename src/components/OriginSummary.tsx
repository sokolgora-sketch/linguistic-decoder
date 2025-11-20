
// src/components/OriginSummary.tsx
'use client';

import type { AnalysisResult, Candidate } from '@/shared/engineShape';
import { getVoiceMeta } from '@/shared/sevenVoices';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

type OriginSummaryProps = {
  analysis: AnalysisResult;
};

export function OriginSummary({ analysis }: OriginSummaryProps) {
  if (!analysis?.core) {
    return null;
  }

  const primary = analysis.core;
  const voicePath = primary.voices.vowelVoices;
  const principlePath = voicePath.map(v => getVoiceMeta(v).principle).join(' → ');

  const solidCandidates: Candidate[] = [];
  const partialCandidates: Candidate[] = [];
  const experimentalCandidates: Candidate[] = [];

  for (const c of analysis.candidates ?? []) {
    if (c.axes) {
      const isSolid =
        c.axes.principles === 'pass' &&
        c.axes.morphology === 'pass' &&
        c.axes.consonants === 'pass';

      if (isSolid) {
        solidCandidates.push(c);
      } else if (
        c.axes.principles === 'pass' ||
        c.axes.morphology === 'pass' ||
        c.axes.consonants === 'pass'
      ) {
        partialCandidates.push(c);
      } else {
        experimentalCandidates.push(c);
      }
    } else {
      experimentalCandidates.push(c);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Origin Summary</CardTitle>
        <CardDescription>
          A high-level view of the word's potential functional origins based on the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div>
          <div className="font-semibold">Seven-Voices Path</div>
          <p className="text-muted-foreground">
            {voicePath.join(' → ')} ({principlePath})
          </p>
        </div>

        {solidCandidates.length > 0 && (
          <div>
            <div className="font-semibold">Solid Functional Origins</div>
            <p className="text-muted-foreground">
              {solidCandidates
                .map(c => `${c.language} (${c.form})`)
                .join(' · ')}
            </p>
          </div>
        )}

        {partialCandidates.length > 0 && (
          <div>
            <div className="font-semibold">Partial Matches</div>
            <p className="text-muted-foreground">
              {partialCandidates.map(c => c.language).join(', ')}
            </p>
          </div>
        )}

        {experimentalCandidates.length > 0 && (
          <div>
            <div className="font-semibold">Experimental / Speculative</div>
            <p className="text-muted-foreground">
              {experimentalCandidates.map(c => c.language).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
