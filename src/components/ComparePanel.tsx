"use client";

import { useState } from "react";
import { Card } from "./ui/card";
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
type CompareResult = any | null;

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
  const [compareResult, setCompareResult] = useState<CompareResult>(null);
  const [loading, setLoading] = useState(false);

  async function fetchAnalysis(word: string, mode: Mode, alphabet: Alphabet) {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, mode, alphabet }),
      });
  
      if (!res.ok) {
        console.error("Compare /api/analyze failed", await res.text());
        return null;
      }
  
      return (await res.json()) as EnginePayload;
    } catch (err) {
      console.error("Compare /api/analyze error", err);
      return null;
    }
  }

  async function runCompare() {
    setLoading(true);
    const [leftData, rightData] = await Promise.all([
      fetchAnalysis(leftWord, mode, alphabet),
      fetchAnalysis(rightWord, mode, alphabet),
    ]);
    setCompareResult({ left: leftData, right: rightData });
    setLoading(false);
  }

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
            {Object.keys(PROFILES).map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={runCompare} disabled={loading}>
          {loading ? "Comparing..." : "Compare"}
        </Button>
      </div>

      {compareResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="p-3">
            <p className="font-medium mb-1">{leftWord}</p>
            <pre className="text-xs whitespace-pre-wrap break-all max-h-64 overflow-auto rounded bg-muted/40 p-2">
              {JSON.stringify(
                compareResult.left?.primaryPath ?? "(no result)",
                null,
                2
              )}
            </pre>
          </Card>

          <Card className="p-3">
            <p className="font-medium mb-1">{rightWord}</p>
            <pre className="text-xs whitespace-pre-wrap break-all max-h-64 overflow-auto rounded bg-muted/40 p-2">
              {JSON.stringify(
                compareResult.right?.primaryPath ?? "(no result)",
                null,
                2
              )}
            </pre>
          </Card>
        </div>
      )}
    </Card>
  );
}
