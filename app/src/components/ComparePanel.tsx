// src/components/ComparePanel.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import {
  runAnalysis,
  type Alphabet,
  type AnalysisResult,
} from "../lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVoicesCore";
import type { AnalysisCore } from "@/shared/engineShape";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

// Lightweight formatter for the Seven-Voices heart
function renderHeartSummary(core?: AnalysisCore) {
  if (!core) return "No heart data";

  const primary = core.heartPaths?.primary;
  if (!primary) return "No heart path";

  const seq = primary.voiceSequence?.join(" → ") || "";
  const tension = primary.tensionLevel ?? "unknown";
  const frontier = core.heartPaths?.frontierCount ?? 0;

  return `${seq} · tension: ${tension} · frontier: ${frontier}`;
}

type Mode = "strict" | "open";

interface ComparePanelProps {
  defaultMode?: Mode;
  defaultAlphabet?: Alphabet;
}

interface CompareResult {
  left: AnalysisResult | null;
  right: AnalysisResult | null;
}

export default function ComparePanel({
  defaultMode = "strict",
  defaultAlphabet = "auto",
}: ComparePanelProps) {
  const [leftWord, setLeftWord] = useState("damage");
  const [rightWord, setRightWord] = useState("study");
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [alphabet] = useState<Alphabet>(defaultAlphabet);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);

  // Run the core engine directly in the browser (no /api call)
  function analyzeLocal(word: string): AnalysisResult | null {
    const trimmed = word.trim();
    if (!trimmed) return null;

    const manifest = getManifest(undefined);
    const isStrict = mode === "strict";

    const opts: SolveOptions = {
      beamWidth: 8,
      maxOps: isStrict ? 1 : 2,
      allowDelete: !isStrict,
      allowClosure: !isStrict,
      opCost: manifest.opCost,
      alphabet,
      manifest,
      edgeWeight: manifest.edgeWeight,
    };

    return runAnalysis(trimmed, opts, alphabet);
  }

  function handleCompare() {
    setLoading(true);
    setError(null);

    try {
      const left = analyzeLocal(leftWord);
      const right = analyzeLocal(rightWord);

      if (!left && !right) {
        setError("No results for either word.");
        setResult(null);
      } else {
        setResult({ left, right });
      }
    } catch (e) {
      console.error("[ComparePanel] local analysis failed", e);
      setError("Compare failed – see console for details.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function renderSummary(_word: string, payload: AnalysisResult | null) {
    if (!payload) {
      return (
        <span className="text-xs text-muted-foreground">(no result)</span>
      );
    }

    const richResult = enginePayloadToAnalysisResult(payload);
    const path = richResult.core.voices.vowelVoices ?? [];

    return (
      <div className="text-xs text-muted-foreground">
        <div className="font-mono">
          {path.length > 0
            ? path.join(" → ")
            : "(no path – check engine output)"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Heart: {renderHeartSummary(richResult.core)}
        </p>
      </div>
    );
  }

  return (
    <Card id="compare-two-words">
      <CardHeader>
        <CardTitle>Compare Two Words</CardTitle>
        <CardDescription>
          Analyze two words side by side and compare their Seven-Voices paths.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Inputs */}
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            value={leftWord}
            onChange={(e) => setLeftWord(e.target.value)}
            placeholder="Left word"
          />
          <Input
            value={rightWord}
            onChange={(e) => setRightWord(e.target.value)}
            placeholder="Right word"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              id="compare-strict"
              type="checkbox"
              className="h-4 w-4"
              checked={mode === "strict"}
              onChange={(e) =>
                setMode(e.target.checked ? "strict" : "open")
              }
            />
            <label htmlFor="compare-strict">
              Strict <span className="text-xs">(mode: {mode})</span>
            </label>
          </div>

          {/* Button: use a valid size ("default" | "sm" | "lg" | "icon") */}
          <Button onClick={handleCompare} disabled={loading} size="sm">
            {loading ? "Comparing…" : "Compare"}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}

        {/* Results */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-sm font-semibold">
              {leftWord || "Left word"}
            </div>
            {renderSummary(leftWord, result?.left ?? null)}
          </div>
          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-sm font-semibold">
              {rightWord || "Right word"}
            </div>
            {renderSummary(rightWord, result?.right ?? null)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
