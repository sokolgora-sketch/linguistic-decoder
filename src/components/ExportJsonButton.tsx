"use client";

import React from "react";
import { Button } from "./ui/button";
import type { AnalyzeWordResultV1 } from "@/shared/resultShape.v1";

type ExportJsonButtonProps = {
  analysis: AnalyzeWordResultV1 | null;
};

export function ExportJsonButton({ analysis }: ExportJsonButtonProps) {
  const handleExport = React.useCallback(() => {
    if (!analysis) return;

    try {
      const blob = new Blob([JSON.stringify(analysis, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      const filenameBase = analysis.word || "analysis";
      a.href = url;
      a.download = `${filenameBase}.seven-voices.json`;

      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export JSON", err);
    }
  }, [analysis]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={!analysis}
    >
      Export JSON
    </Button>
  );
}

// Provide both named *and* default export so whatever import you use will work.
export default ExportJsonButton;
