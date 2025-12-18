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
  type AnalysisResult as RawAnalysisResult,
} from "../lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { SolveOptions } from "@/functions/sevenVowelsCore";
import type { AnalysisResult_DEPRECATED, AnalysisCore } from "@/shared/engineShape";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

// Lightweight formatter for the Seven-vowel heart
function renderHeartSummary(core?: AnalysisCore) {
  if (!core) return "No heart data";

  const primary = core.heartPaths?.primary;
  if (!primary) return "No heart path";

  const seq = primary.voiceSequence?.join(" → ") || "";
  const tension = primary.tensionLevel ?? "unknown";
  const frontier = core.heartPaths?.frontierCount ?? 0;

  return `${seq} · tension: ${tension} · frontier: ${frontier}`;
}

// Small helper view: show Seven-vowel heart path for one word
type HeartCore = {
  voices?: {
    levelPath?: string[];
  };
  heartPaths?: {
    primary?: {
      voiceSequence?: string[];
      ringPath?: number[];
      tensionLevel?: string;
      frontierCount?: number;
    };
  };
};

interface HeartSummaryProps {
  label: string;
  core?: HeartCore | null;
}

const HeartSummary: React.FC<HeartSummaryProps> = ({ label, core }) => {
  const primary = core?.heartPaths?.primary;
  const levelPath = core?.voices?.levelPath;

  if (!primary || !primary.voiceSequence || primary.voiceSequence.length === 0) {
    return null;
  }

  const voicePath = primary.voiceSequence.join(" → ");
  const levelStart = levelPath?.[0];
  const levelEnd = levelPath?.[levelPath.length - 1];

  return (
    <div className="mt-3 rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-xs text-slate-200">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label} heart
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span>
          Path: <span className="font-medium">{voicePath}</span>
        </span>
        {levelStart && levelEnd && (
          <span>
            Levels:{" "}
            <span className="font-medium">
              {levelStart} → {levelEnd}
            </span>
          </span>
        )}
        {primary.tensionLevel && (
          <span>
            Tension:{" "}
            <span className="font-medium">{primary.tensionLevel}</span>
          </span>
        )}
        {typeof primary.frontierCount === "number" && (
          <span>
            Frontier:{" "}
            <span className="font-medium">{primary.frontierCount}</span>
          </span>
        )}
      </div>
    </div>
  );
};


type Mode = "strict" | "open";

interface ComparePanelProps {
  defaultMode?: Mode;
  defaultAlphabet?: Alphabet;
}

interface CompareResult {
  left: AnalysisResult_DEPRECATED | null;
  right: AnalysisResult_DEPRECATED | null;
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
  function analyzeLocal(word: string): RawAnalysisResult | null {
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
      const leftRaw = analyzeLocal(leftWord);
      const rightRaw = analyzeLocal(rightWord);
      
      const left = leftRaw ? enginePayloadToAnalysisResult(leftRaw) : null;
      const right = rightRaw ? enginePayloadToAnalysisResult(rightRaw) : null;


      if (!left && !right) {
        setError("No results for either word.");
        setResult(null);
      } else {
        setResult({ left, right });
      }
    } catch (e: any) {
      console.error("[ComparePanel] local analysis failed", e);
      setError("Compare failed – see console for details.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function renderSummary(_word: string, payload: AnalysisResult_DEPRECATED | null) {
    if (!payload) {
      return (
        <span className="text-xs text-muted-foreground">(no result)</span>
      );
    }

    const path = payload.core?.voices.vowelVoices ?? [];

    return (
      <div className="text-xs text-muted-foreground">
        <div className="font-mono">
          {path.length > 0
            ? path.join(" → ")
            : "(no path – check engine output)"}
        </div>
      </div>
    );
  }

  return (
    <Card id="compare-two-words">
      <CardHeader>
        <CardTitle>Compare Two Words</CardTitle>
        <CardDescription>
          Analyze two words side by side and compare their Seven-vowel paths.
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
            <HeartSummary
              label={result?.left?.core.input?.normalized ?? leftWord}
              core={result?.left?.core as any}
            />
          </div>
          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-sm font-semibold">
              {rightWord || "Right word"}
            </div>
            {renderSummary(rightWord, result?.right ?? null)}
             <HeartSummary
              label={result?.right?.core.input?.normalized ?? rightWord}
              core={result?.right?.core as any}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
