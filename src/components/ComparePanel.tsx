// src/components/ComparePanel.tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ExportJsonButton } from "./ui/ExportJsonButton";
import { EngineMetaBadge } from "./EngineMetaBadge";
import type { AnalyzeWordResultV1, HeartSummary, Alphabet } from "@/shared/resultShape.v1";


function buildHeartSummaryText(
  core: HeartSummary | null | undefined
): string | null {
  if (
    !core?.math7?.primary?.voicePath ||
    core.math7.primary.voicePath.length === 0
  ) {
    return null;
  }

  const primary = core.math7.primary;
  const lines: string[] = [];

  const word = core.word;
  if (word) {
    lines.push(`Seven-Voices heart snapshot for \"${word}\":`);
  } else {
    lines.push(`Seven-Voices heart snapshot:`);
  }

  lines.push(`- Primary path: ${primary.voicePath.join(" → ")}`);

  if (primary.ringPath && primary.ringPath.length > 0) {
    const ringStart = primary.ringPath[0];
    const ringEnd = primary.ringPath[primary.ringPath.length - 1];
    lines.push(`- Rings: ${ringStart} → ${ringEnd}`);
  }

  if (primary.levelPath && primary.levelPath.length > 0) {
    const levelStart = primary.levelPath[0];
    const levelEnd = primary.levelPath[primary.levelPath.length - 1];
    lines.push(`- Levels: ${levelStart} → ${levelEnd}`);
  }

  if (core.math7.tensionLevel) {
    lines.push(`- Tension: ${core.math7.tensionLevel}`);
  }

  if (typeof core.math7.frontierCount === "number") {
    lines.push(`- Frontier consonants: ${core.math7.frontierCount}`);
  }

  return lines.join("\n");
}


interface HeartSummaryProps {
  label: string;
  core?: HeartSummary | null;
}

const HeartSummaryView: React.FC<HeartSummaryProps> = ({ label, core }) => {
  const primary = core?.math7?.primary;

  if (!primary || !primary.voicePath || primary.voicePath.length === 0) {
    return null;
  }

  const voicePath = primary.voicePath.join(" → ");

  return (
    <div className="mt-3 rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-xs text-slate-200">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label} heart
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span>
          Path: <span className="font-medium">{voicePath}</span>
        </span>
        {primary.levelPath && (
          <span>
            Levels:{" "}
            <span className="font-medium">
              {primary.levelPath.join(" → ")}
            </span>
          </span>
        )}
        {core?.math7.tensionLevel && (
          <span>
            Tension:{" "}
            <span className="font-medium">{core.math7.tensionLevel}</span>
          </span>
        )}
        {typeof core?.math7.frontierCount === "number" && (
          <span>
            Frontier:{" "}
            <span className="font-medium">{core.math7.frontierCount}</span>
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
  left: AnalyzeWordResultV1 | null;
  right: AnalyzeWordResultV1 | null;
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
  const [coreOnlyCompare, setCoreOnlyCompare] = React.useState(false);

  const [copiedLeft, setCopiedLeft] = React.useState(false);
  const [copiedRight, setCopiedRight] = React.useState(false);

  const leftHeart = result?.left?.heart;
  const rightHeart = result?.right?.heart;

  const handleCopyLeftHeart = React.useCallback(() => {
    const text = buildHeartSummaryText(leftHeart);
    if (!text) {
      console.warn("No left heart summary available to copy.");
      return;
    }
    try {
      navigator.clipboard.writeText(text);
      setCopiedLeft(true);
      setTimeout(() => setCopiedLeft(false), 2000);
    } catch (err) {
      console.error("Failed to copy left heart summary:", err);
    }
  }, [leftHeart]);

  const handleCopyRightHeart = React.useCallback(() => {
    const text = buildHeartSummaryText(rightHeart);
    if (!text) {
      console.warn("No right heart summary available to copy.");
      return;
    }
    try {
      navigator.clipboard.writeText(text);
      setCopiedRight(true);
      setTimeout(() => setCopiedRight(false), 2000);
    } catch (err) {
      console.error("Failed to copy right heart summary:", err);
    }
  }, [rightHeart]);

  const compareExportPayload = React.useMemo(() => {
    if (!result) return null;

    if (coreOnlyCompare) {
      return {
        left: (result.left as any)?.heart ?? null,
        right: (result.right as any)?.heart ?? null,
      };
    }

    return {
      left: result.left ?? null,
      right: result.right ?? null,
    };
  }, [result, coreOnlyCompare]);

  const exportFilename = useMemo(() => {
    const safeLeft =
      leftWord.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") || "left";
    const safeRight =
      rightWord.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") || "right";
    const suffix = coreOnlyCompare ? "-hearts" : "-analysis";
    return `compare-${safeLeft}-vs-${safeRight}${suffix}.json`;
  }, [leftWord, rightWord, coreOnlyCompare]);

  async function analyzeRemote(word: string): Promise<AnalyzeWordResultV1 | null> {
    const trimmed = word.trim();
    if (!trimmed) return null;

    const params = new URLSearchParams({
      word: trimmed,
      mode,
      alphabet,
    });

    try {
      const response = await fetch(`/api/analyze?${params.toString()}`);
      if (!response.ok) {
        console.error(`[ComparePanel] API error for word: ${trimmed}`, await response.text());
        return null;
      }
      return await response.json();
    } catch (e) {
      console.error(`[ComparePanel] fetch failed for word: ${trimmed}`, e);
      return null;
    }
  }

  async function handleCompare() {
    setLoading(true);
    setError(null);

    try {
      const [left, right] = await Promise.all([
        analyzeRemote(leftWord),
        analyzeRemote(rightWord),
      ]);

      if (!left && !right) {
        setError("No results for either word.");
        setResult(null);
      } else {
        setResult({ left, right });
      }
    } catch (e) {
      console.error("[ComparePanel] analysis failed", e);
      setError("Compare failed – see console for details.");
      setResult(null);
    } finally {
      setLoading(false);
    }
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
              onChange={(e) => setMode(e.target.checked ? "strict" : "open")}
            />
            <label htmlFor="compare-strict">
              Strict <span className="text-xs">(mode: {mode})</span>
            </label>
          </div>

          <Button onClick={handleCompare} disabled={loading} size="sm">
            {loading ? "Comparing…" : "Compare"}
          </Button>
        </div>

        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

        {/* Results */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-sm font-semibold">
              {leftWord || "Left word"}
            </div>
            <EngineMetaBadge result={result?.left as any} className="mb-2" />
            {result?.left?.heart ? (
              <>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    HEART SUMMARY
                  </h3>
                  {leftHeart && (
                    <button
                      type="button"
                      onClick={handleCopyLeftHeart}
                      className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 transition-colors"
                    >
                      {copiedLeft ? "Copied" : "Copy heart"}
                    </button>
                  )}
                </div>
                <HeartSummaryView
                  label={result?.left?.word ?? leftWord}
                  core={result.left.heart}
                />
              </>
            ) : <span className="text-xs text-muted-foreground">(no result)</span>
            }
          </div>
          <div className="rounded-md border bg-muted/40 p-3">
            <div className="mb-1 text-sm font-semibold">
              {rightWord || "Right word"}
            </div>
            <EngineMetaBadge result={result?.right as any} className="mb-2" />
            {result?.right?.heart ? (
              <>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    HEART SUMMARY
                  </h3>
                  {rightHeart && (
                    <button
                      type="button"
                      onClick={handleCopyRightHeart}
                      className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 transition-colors"
                    >
                      {copiedRight ? "Copied" : "Copy heart"}
                    </button>
                  )}
                </div>
                <HeartSummaryView
                  label={result?.right?.word ?? rightWord}
                  core={result.right.heart}
                />
              </>
            ) : <span className="text-xs text-muted-foreground">(no result)</span>
            }
          </div>
        </div>

        {/* Export controls */}
        {compareExportPayload && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input
                type="checkbox"
                checked={coreOnlyCompare}
                onChange={(e) => setCoreOnlyCompare(e.target.checked)}
                className="h-3 w-3 rounded border-slate-600 bg-slate-900"
              />
              <span>Core only (Heart)</span>
            </label>

            <ExportJsonButton
              data={compareExportPayload}
              filename={exportFilename}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
