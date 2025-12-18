// src/components/ComparePanel.tsx
"use client";

import React, { useState, useCallback } from "react";
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
import { EngineMetaCard } from "./EngineMetaCard";
import type { AnalyzeWordResultUI, PrimaryPathSummary } from "@/shared/resultsUI";
import { buildEngineMetaSummary } from "@/lib/engineMetaSummary";

function buildHeartSummaryText(summary: PrimaryPathSummary | null): string | null {
  if (!summary || !summary.voicePath) {
    return null;
  }

  const lines: string[] = [
    `Seven-vowel heart snapshot:`,
    `- Primary path: ${summary.voicePath}`,
    `- Rings: ${summary.ringPath}`,
    `- Levels: ${summary.levelPath}`,
  ];

  return lines.join("\n");
}

interface HeartSummaryViewProps {
  label: string;
  summary?: PrimaryPathSummary | null;
}

const HeartSummaryView: React.FC<HeartSummaryViewProps> = ({ label, summary }) => {
  if (!summary) {
    return null;
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-xs text-slate-200">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label} heart
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span>
          Path: <span className="font-medium">{summary.voicePath}</span>
        </span>
        <span>
          Levels: <span className="font-medium">{summary.levelPath}</span>
        </span>
        <span>
          Rings: <span className="font-medium">{summary.ringPath}</span>
        </span>
      </div>
    </div>
  );
};

type Mode = "strict" | "explore";

interface ComparePanelProps {
  defaultMode?: Mode;
  defaultAlphabet?: "auto" | "latin" | "albanian";
}

interface CompareResult {
  left: AnalyzeWordResultUI | null;
  right: AnalyzeWordResultUI | null;
}

export default function ComparePanel({
  defaultMode = "strict",
  defaultAlphabet = "auto",
}: ComparePanelProps) {
  const [leftWord, setLeftWord] = useState("damage");
  const [rightWord, setRightWord] = useState("study");
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [alphabet] = useState(defaultAlphabet);
  const [isComparing, setIsComparing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);

  const [copiedLeft, setCopiedLeft] = React.useState(false);
  const [copiedRight, setCopiedRight] = React.useState(false);

  const handleCopyLeftHeart = React.useCallback(() => {
    const text = buildHeartSummaryText(result?.left?.primaryPath ?? null);
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLeft(true);
      setTimeout(() => setCopiedLeft(false), 2000);
    });
  }, [result]);

  const handleCopyRightHeart = React.useCallback(() => {
    const text = buildHeartSummaryText(result?.right?.primaryPath ?? null);
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRight(true);
      setTimeout(() => setCopiedRight(false), 2000);
    });
  }, [result]);

  const handleCompare = useCallback(async () => {
    if (isComparing) return;

    setValidationError(null);
    setCompareError(null);
    setResult(null);

    const trimmedLeft = leftWord.trim();
    const trimmedRight = rightWord.trim();

    if (!trimmedLeft || !trimmedRight) {
      setValidationError("Enter both words before comparing.");
      return;
    }

    setIsComparing(true);

    try {
      const analyzeRemote = async (word: string): Promise<AnalyzeWordResultUI> => {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word, mode, alphabet }),
        });

        if (!response.ok) {
          const details = await response.text();
          console.error(`[ComparePanel] API error for word: ${word}`, details);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      };

      const [left, right] = await Promise.all([
        analyzeRemote(trimmedLeft),
        analyzeRemote(trimmedRight),
      ]);
      setResult({ left, right });
    } catch (e: any) {
      console.error("[ComparePanel] analysis failed", e);
      let errorMessage = "Something went wrong comparing these words. Please try again.";
      if (process.env.NODE_ENV !== 'production') {
        errorMessage += ` Details: ${e.message}`;
      }
      setCompareError(errorMessage);
    } finally {
      setIsComparing(false);
    }
  }, [isComparing, leftWord, rightWord, mode, alphabet]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCompare();
    }
  };

  const leftEngineMeta = result?.left ? buildEngineMetaSummary(result.left.engineMeta) : null;
  const rightEngineMeta = result?.right ? buildEngineMetaSummary(result.right.engineMeta) : null;

  return (
    <Card id="compare-two-words">
      <CardHeader>
        <CardTitle>Compare Two Words</CardTitle>
        <CardDescription>
          Analyze two words side by side and compare their Seven-vowel paths.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); handleCompare(); }}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              value={leftWord}
              onChange={(e) => setLeftWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Left word"
              disabled={isComparing}
            />
            <Input
              value={rightWord}
              onChange={(e) => setRightWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Right word"
              disabled={isComparing}
            />
          </div>

          <div className="flex items-center justify-between gap-4 mt-4">
            <div />
            <Button type="submit" disabled={isComparing} aria-busy={isComparing} size="sm">
              {isComparing ? "Comparing…" : "Compare"}
            </Button>
          </div>
        </form>

        {validationError && (
          <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-600">
            {validationError}
          </div>
        )}

        {compareError && !validationError && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {compareError}
          </div>
        )}

        {result && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border bg-muted/40 p-3">
                <div className="mb-1 text-sm font-semibold">
                  {leftWord || "Left word"}
                </div>
                {leftEngineMeta && <EngineMetaCard meta={leftEngineMeta} />}
                {result.left?.primaryPath ? (
                  <>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        HEART SUMMARY
                      </h3>
                      <button
                        type="button"
                        onClick={handleCopyLeftHeart}
                        className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 transition-colors"
                      >
                        {copiedLeft ? "Copied" : "Copy heart"}
                      </button>
                    </div>
                    <HeartSummaryView
                      label={result.left.word ?? leftWord}
                      summary={result.left.primaryPath}
                    />
                  </>
                ) : <span className="text-xs text-muted-foreground">(no result)</span>
                }
              </div>
              <div className="rounded-md border bg-muted/40 p-3">
                <div className="mb-1 text-sm font-semibold">
                  {rightWord || "Right word"}
                </div>
                {rightEngineMeta && <EngineMetaCard meta={rightEngineMeta} />}
                {result.right?.primaryPath ? (
                  <>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        HEART SUMMARY
                      </h3>
                      <button
                        type="button"
                        onClick={handleCopyRightHeart}
                        className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 transition-colors"
                      >
                        {copiedRight ? "Copied" : "Copy heart"}
                      </button>
                    </div>
                    <HeartSummaryView
                      label={result.right.word ?? rightWord}
                      summary={result.right.primaryPath}
                    />
                  </>
                ) : <span className="text-xs text-muted-foreground">(no result)</span>
                }
              </div>
            </div>

            <ExportJsonButton
              data={{ left: result.left?.raw, right: result.right?.raw }}
              filename={`compare-${leftWord}-vs-${rightWord}.json`}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
