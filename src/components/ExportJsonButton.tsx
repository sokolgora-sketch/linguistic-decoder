// src/components/ExportJsonButton.tsx
"use client";

import { Button } from "./ui/button";
import type { EnginePayload, AnalysisResult_DEPRECATED } from "../shared/engineShape";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

type ExportJsonButtonProps = {
  result: EnginePayload;
};

export function ExportJsonButton({ result }: ExportJsonButtonProps) {
  const handleExport = () => {
    // Export the rich AnalysisResult if it exists, otherwise fall back to the base payload.
    const exportData = enginePayloadToAnalysisResult(result);
    const json = JSON.stringify(exportData, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // make a simple, safe filename: analysis-<word>-<version>.json
    const safeWord = (result.word || "").replace(/\s+/g, "_");
    const version = result.engineVersion || "dev";
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