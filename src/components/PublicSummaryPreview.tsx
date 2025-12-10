"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import { buildPublicSummarySnippet } from "@/lib/shareSnippetPublic";

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
      <CardContent>
        <pre className="whitespace-pre-wrap text-xs font-mono bg-muted/40 rounded-md p-3">
          {text}
        </pre>
      </CardContent>
    </Card>
  );
}