
"use client";
import React from "react";

export default function ExportBar({ analysis }: { analysis: any }) {
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
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    alert("Copied JSON");
  };

  const makeLink = () => {
    const params = new URLSearchParams({
      w: String(analysis.word || ""),
      m: String(analysis.mode || "strict"),
      a: String(analysis.alphabet || "auto")
    });
    return `${location.origin}/?${params.toString()}`;
  };

  const copyLink = async () => {
    const url = makeLink();
    await navigator.clipboard.writeText(url);
    alert("Copied link");
  };

  return (
    <div className="flex gap-2 mt-3 text-sm">
      <button className="border rounded px-3 py-1" onClick={copyJSON}>Copy JSON</button>
      <button className="border rounded px-3 py-1" onClick={copyLink}>Copy Link</button>
      <div className="ml-auto text-xs opacity-70">
        Engine <b>{process.env.NEXT_PUBLIC_ENGINE_VERSION || "dev"}</b>
      </div>
    </div>
  );
}
