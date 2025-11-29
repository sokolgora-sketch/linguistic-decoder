// src/components/ExportJsonButton.tsx
"use client";

import { Button } from "./ui/button";
import type { EnginePayload } from "../shared/engineShape";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { downloadJson } from "@/lib/downloadJson";
import { toWordProtocol } from "@/shared/wordProtocol";

type ExportJsonButtonProps = {
  analysis: EnginePayload;
};

export function ExportJsonButton({ analysis }: ExportJsonButtonProps) {
  const handleExport = () => {
    const analysisResult = enginePayloadToAnalysisResult(analysis);
    if (!analysisResult) {
      console.error("Failed to generate analysis result for export.");
      return;
    }

    const protocolRecord = toWordProtocol(analysisResult);
    const fileName = `${protocolRecord.word || "word"}-protocol.json`;

    downloadJson(fileName, protocolRecord);
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
