
"use client";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/runAnalysis";

export default function ExportBar({ analysis }: { analysis: AnalysisResult }) {
  const { toast } = useToast();
  if (!analysis?.primaryPath) return null;

  const downloadJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeWord = (analysis.word || 'analysis').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `analysis-${safeWord}-${analysis.engineVersion}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Download Started", description: "Your JSON file has started downloading." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Download Failed", description: e.message || "Could not prepare the JSON file for download." });
    }
  };

  const makeLink = () => {
    const params = new URLSearchParams({
      word: String(analysis.word || ""),
      mode: String(analysis.mode || "strict"),
      alphabet: String(analysis.alphabet || "auto")
    });
    return `${window.location.origin}/?${params.toString()}`;
  };

  const copyLink = async () => {
    const url = makeLink();
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Copied to Clipboard", description: "A shareable link has been copied." });
    } catch (e) {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy the link." });
    }
  };

  return (
    <div className="flex gap-2 mt-3 text-sm">
      <Button variant="outline" size="sm" onClick={downloadJSON}>Download JSON</Button>
      <Button variant="outline" size="sm" onClick={copyLink}>Copy Link</Button>
      <div className="ml-auto text-xs opacity-70 flex items-center">
        Engine <b>{analysis.engineVersion || "dev"}</b>
      </div>
    </div>
  );
}
