'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { AnalyzeWordResultUI } from '@/shared/resultsUI';
import { buildPublicSummarySnippet } from '@/lib/shareSnippetPublic';
import ShareSnippetPublicButton from '@/components/ShareSnippetPublicButton';

interface PublicSummaryPreviewProps {
  result?: AnalyzeWordResultUI | null;
}

export function PublicSummaryPreview({ result }: PublicSummaryPreviewProps) {
  if (!result) return null;

  const text = buildPublicSummarySnippet(result);
  if (!text.trim()) return null;

  return (
    <Card className="mt-4">
      <CardHeader className="py-2">
        <CardTitle className="text-sm">Public summary preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
          {text}
        </pre>
        <div className="flex justify-end">
          <ShareSnippetPublicButton result={result} />
        </div>
      </CardContent>
    </Card>
  );
}
