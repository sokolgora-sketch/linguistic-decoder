"use client";

import { useState } from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
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
import { runAnalysis, type Alphabet, type AnalysisResult } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVoicesCore";

type Mode = "strict" | "open";

type ComparePanelProps = {
  defaultMode?: Mode;
  defaultAlphabet?: Alphabet;
};

// Re-use the same manifest everywhere
const manifest = getManifest();

// Build solver options exactly like the API route does
function buildSolveOptions(mode: Mode, alphabet: Alphabet): SolveOptions {
  const isStrict = mode === "strict";

  return {
    beamWidth: 8,
    maxOps: isStrict ? 1 : 2,
    allowDelete: !isStrict,
    allowClosure: !isStrict,
    opCost: manifest.opCost,
    alphabet,
    manifest,
    edgeWeight: manifest.edgeWeight,
  };
}

export default function ComparePanel({
  defaultMode = "strict",
  defaultAlphabet = "auto",
}: ComparePanelProps) {
  const [leftWord, setLeftWord] = useState("damage");
  const [rightWord, setRightWord] = useState("study");

  const [mode, setMode] = useState<Mode>(defaultMode);
  const [alphabet, setAlphabet] = useState<Alphabet>(defaultAlphabet);

  const [leftResult, setLeftResult] = useState<AnalysisResult | null>(null);
  const [rightResult, setRightResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleCompare() {
    const a = leftWord.trim();
    const b = rightWord.trim();
    if (!a || !b) return;

    setLoading(true);
    try {
      const opts = buildSolveOptions(mode, alphabet);

      // runAnalysis is synchronous – no fetch, no API, no 404
      const left = runAnalysis(a, opts, alphabet);
      const right = runAnalysis(b, opts, alphabet);

      setLeftResult(left);
      setRightResult(right);
    } catch (err) {
      console.error("Compare runAnalysis failed", err);
      setLeftResult(null);
      setRightResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Two Words</CardTitle>
        <CardDescription>
          Analyze two words side by side and compare their Seven-Voices paths.
        </CardDescription>
      </CardHeader>
      <CardContent className=\"space-y-4\">
        {/* Inputs */}
        <div className=\"grid gap-3 md:grid-cols-2\">
          <Input
            value={leftWord}
            onChange={(e) => setLeftWord(e.target.value)}
            placeholder=\"First word\"
          />
          <Input
            value={rightWord}
            onChange={(e) => setRightWord(e.target.value)}
            placeholder=\"Second word\"
          />
        </div>

        {/* Controls */}
        <div className=\"flex flex-wrap items-center gap-3\">
          {/* Strict toggle */}
          <label className=\"flex items-center gap-2 text-sm\">
            <input
              type=\"checkbox\"
              className=\"h-4 w-4\"
              checked={mode === "strict"}
              onChange={(e) => setMode(e.target.checked ? "strict" : "open")}
            />
            Strict
          </label>

          {/* Alphabet select */}
          <Select
            value={alphabet}
            onValueChange={(value) => setAlphabet(value as Alphabet)}
          >
            <SelectTrigger className=\"w-[180px]\">
              <SelectValue placeholder=\"Alphabet\" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=\"auto\">Auto-detect</SelectItem>
              {PROFILES.map((profile) => (
                <SelectItem key={profile.id} value={profile.id as Alphabet}>
                  {profile.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Compare button */}
          <Button onClick={handleCompare} disabled={loading}>
            {loading ? "Comparing..." : "Compare"}
          </Button>
        </div>

        {/* Results */}
        <div className=\"grid gap-3 md:grid-cols-2\">
          <ResultBox label={leftWord} payload={leftResult} />
          <ResultBox label={rightWord} payload={rightResult} />
        </div>
      </CardContent>
    </Card>
  );
}


type ResultBoxProps = {
  label: string;
  payload: AnalysisResult | null;
};

function ResultBox({ label, payload }: ResultBoxProps) {
  return (
    <div className=\"rounded-md border bg-muted/20 px-3 py-2\">
      <div className=\"text-xs font-medium text-muted-foreground\">
        {label || "(empty)"}
      </div>
      <div className=\"mt-1 text-xs text-muted-foreground\">
        {payload
          ? payload.primaryPath?.voicePath?.join(" → ") || "(no primary path)"
          : "(no result)"}
      </div>
    </div>
  );
}