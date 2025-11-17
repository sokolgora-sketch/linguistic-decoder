"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@/lib/runAnalysis";

type Props = {
  analysis: AnalysisResult;
};

export function ExportJsonButton({ analysis }: Props) {
    const { toast } = useToast();

    const handleExport = () => {
        try {
            const blob = new Blob(
              [JSON.stringify(analysis, null, 2)],
              { type: "application/json" }
            );
            const url = URL.createObjectURL(blob);
            const safeWord = analysis.word.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const fileName = `analysis-${safeWord}-${analysis.engineVersion}.json`;
        
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast({ title: "Download Started", description: "Your JSON file is downloading." });
        } catch (e: any) {
            toast({ variant: "destructive", title: "Download Failed", description: e.message || "Could not prepare file." });
        }
    };

    const copyLink = async () => {
        const params = new URLSearchParams({
            word: String(analysis.word || ""),
            mode: String(analysis.mode || "strict"),
            alphabet: String(analysis.alphabet || "auto")
        });
        const url = `${window.location.origin}/?${params.toString()}`;
        try {
          await navigator.clipboard.writeText(url);
          toast({ title: "Copied to Clipboard", description: "A shareable link has been copied." });
        } catch (e) {
          toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy the link." });
        }
    };

  return (
    <div className="flex gap-2 mt-3 text-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
        >
          Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={copyLink}>Copy Link</Button>
        <div className="ml-auto text-xs opacity-70 flex items-center">
            Engine <b>{analysis.engineVersion || "dev"}</b>
        </div>
    </div>
  );
}
