// src/components/ExportJsonButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/runAnalysis";

type ExportJsonButtonProps = {
  analysis: AnalysisResult;
};

export function ExportJsonButton({ analysis }: ExportJsonButtonProps) {
  const handleExport = () => {
    // stringify the full engine payload
    const json = JSON.stringify(analysis, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // make a simple, safe filename: analysis-<word>-<version>.json
    const safeWord = (analysis.word || "").replace(/\s+/g, "_");
    const version = analysis.engineVersion || "dev";
    const fileName = `analysis-${safeWord}-${version}.json`;

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
    >
      Export JSON
    </Button>
  );
}