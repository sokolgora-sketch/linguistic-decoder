
"use client";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export default function ExportBar({ analysis }: { analysis: any }) {
  const { toast } = useToast();
  if (!analysis?.primaryPath) return null;

  const payload = {
    engine: process.env.NEXT_PUBLIC_ENGINE_VERSION || "dev",
    word: analysis.word,
    primary: analysis.primaryPath,
    frontier: analysis.frontierPaths || [],
    mapper: analysis.languageFamilies || [],
    timestamp: new Date().toISOString()
  };

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      toast({ title: "Copied to Clipboard", description: "The raw JSON payload has been copied." });
    } catch (e) {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy JSON to clipboard." });
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
      <button className="border rounded px-3 py-1 hover:bg-accent hover:text-accent-foreground transition-colors" onClick={copyJSON}>Copy JSON</button>
      <button className="border rounded px-3 py-1 hover:bg-accent hover:text-accent-foreground transition-colors" onClick={copyLink}>Copy Link</button>
      <div className="ml-auto text-xs opacity-70 flex items-center">
        Engine <b>{process.env.NEXT_PUBLIC_ENGINE_VERSION || "dev"}</b>
      </div>
    </div>
  );
}
