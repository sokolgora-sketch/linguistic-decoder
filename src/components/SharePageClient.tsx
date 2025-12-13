'use client';

import React from 'react';
import type { AnalyzeWordResultUI } from '@/shared/resultsUI';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Props = {
  record: any;
};

export default function SharePageClient({ record }: Props) {
  const {
    word,
    engineLabel,
    createdAt,
    heartSummary,
    zhejiSummary,
    symbolicSummary,
  } = record;

  const createdLabel = createdAt
    ? new Date(createdAt).toLocaleString()
    : 'unknown';

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Shared analysis for “{word}”</h1>
        <p className="text-sm text-muted-foreground">
          Engine: {engineLabel ?? 'SevenVoices Core'} • Created: {createdLabel}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Heart summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{heartSummary}</p>
        </CardContent>
      </Card>

      {zhejiSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Zheji structural summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{zhejiSummary}</p>
          </CardContent>
        </Card>
      )}

      {symbolicSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Symbolic reading</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{symbolicSummary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
