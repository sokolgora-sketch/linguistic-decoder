
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PROFILES } from "../functions/languages";
import type { Alphabet, EnginePayload } from "../lib/runAnalysis";

type Mode = "strict" | "open";
type CompareResult = (EnginePayload & { solveMs?: number }) | null;

const ResultCard = ({ word, data }: { word: string; data: CompareResult }) => {
  if (!data) return null;
  const { primaryPath, mode, alphabet, solveMs } = data;
  return (
    <Card className="p-3">
      <div className="font-semibold mb-1">{word}</div>
      <div className="text-xs text-muted-foreground mb-2">
        {mode} · {alphabet} · {solveMs}ms
      </div>
      {primaryPath ? (
        <pre className="text-xs whitespace-pre-wrap break-all max-h-64 overflow-auto rounded bg-muted/40 p-2">
          {primaryPath.voicePath.join(" → ")}
        </pre>
      ) : (
        <div className="text-xs text-red-500">No path found</div>
      )}
    </Card>
  );
};


export default function ComparePanel({
  defaultMode = "strict",
  defaultAlphabet = "auto",
}: {
  defaultMode?: Mode;
  defaultAlphabet?: Alphabet;
}) {
  const [leftWord, setLeftWord] = useState("damage");
  const [rightWord, setRightWord] = useState("study");
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [alphabet, setAlphabet] = useState<Alphabet>(defaultAlphabet);
  const [leftResult, setLeftResult] = useState<CompareResult>(null);
  const [rightResult, setRightResult] = useState<CompareResult>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash || "";
    const m = hash.match(/#compare=([^&]+)/);
    if (m?.[1]) setRightWord(decodeURIComponent(m[1]));
  }, []);

  async function fetchAnalysis(word: string): Promise<CompareResult | null> {
    const w = word.trim();
    if (!w) return null;

    const params = new URLSearchParams({
      word: w,
      mode,
      alphabet,
    });

    try {
      const res = await fetch(`/api/analyze?${params.toString()}`);
      if (!res.ok) {
        console.error(`Compare /api/analyze failed for "${w}"`, await res.text());
        return null;
      }
      return (await res.json()) as CompareResult;
    } catch(err) {
      console.error(`Compare /api/analyze error for "${w}"`, err);
      return null;
    }
  }

  async function runCompare() {
    if (!leftWord.trim() || !rightWord.trim()) return;
    setLoading(true);
    setLeftResult(null);
    setRightResult(null);
    try {
      const [leftData, rightData] = await Promise.all([
        fetchAnalysis(leftWord),
        fetchAnalysis(rightWord),
      ]);
      setLeftResult(leftData);
      setRightResult(rightData);
    } finally {
      setLoading(false);
    }
  }
  
  const eqPrimary =
    leftResult?.primaryPath &&
    rightResult?.primaryPath &&
    leftResult.primaryPath.voicePath.join(",") ===
      rightResult.primaryPath.voicePath.join(",");


  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Compare Two Words</h3>

      <p className="text-sm text-muted-foreground mb-3">
        Analyze two words side by side and compare their Seven-Voices paths.
      </p>

      <div className="flex flex-col gap-2 md:flex-row mb-3">
        <Input
          value={leftWord}
          onChange={(e) => setLeftWord(e.target.value)}
          placeholder="First word"
        />
        <Input
          value={rightWord}
          onChange={(e) => setRightWord(e.target.value)}
          placeholder="Second word"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={mode === "strict"}
            onChange={(e) => setMode(e.target.checked ? "strict" : "open")}
          />
          <span>Strict</span>
        </label>

        <Select
          value={alphabet}
          onValueChange={(v) => setAlphabet(v as Alphabet)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Auto-Detect" />
          </SelectTrigger>
          <SelectContent>
            {PROFILES.map((p) => (
               <SelectItem key={p.id} value={p.id}>{p.id.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={runCompare} disabled={loading}>
          {loading ? "Comparing..." : "Compare"}
        </Button>
      </div>
      
      {eqPrimary && (
         <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
           Paths are identical.
         </div>
       )}

      {(leftResult || rightResult) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <ResultCard word={leftWord} data={leftResult} />
          <ResultCard word={rightWord} data={rightResult} />
        </div>
      )}
    </Card>
  );
}
