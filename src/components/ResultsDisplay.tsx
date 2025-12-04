'use client';
import React, { useMemo, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import type { CClass } from '../functions/languages';
import { classRange } from '../functions/languages';
import type { AnalyzeWordResultV1 } from '../shared/resultShape.v1';
import { getVoiceMeta } from '@/shared/sevenVoices';
import WhyThisPath from './WhyThisPath';
import { VOICE_COLOR_MAP } from '../shared/voiceColors';
import { Candidates } from './Candidates';
import { PrinciplesBlock } from './PrinciplesBlock';
import { SymbolicReadingCard } from './SymbolicReadingCard';
import { HeartSummaryCard } from './HeartSummaryCard';
import { ExportJsonButton } from './ui/ExportJsonButton';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { EngineMetaBadge } from "./EngineMetaBadge";


// Lightweight formatter for the Seven-Voices heart
function getHeartSummary(heart: any) {
  if (!heart) return null;

  const primary = heart.math7?.primary ?? {};
  const voices: string[] = primary.voicePath ?? [];
  const rings: (number | string)[] = primary.ringPath ?? [];
  const levels: string[] = primary.levelPath ?? [];
  const tension: string = heart.math7?.tensionLevel ?? "unknown";
  const frontierCount: number | undefined = heart.math7?.frontierCount;

  return {
    voices,
    rings,
    levels,
    tension,
    frontierCount,
  };
}

type HeartCore = {
    input?: {
      normalized?: string;
      raw?: string;
    };
    voices?: {
      levelPath?: string[];
    };
    math7?: {
      primary?: {
        voicePath?: string[];
        ringPath?: number[];
        tensionLevel?: string;
        frontierCount?: number;
      };
    };
  };
  
  function buildHeartSummaryText(core: HeartCore | null | undefined): string | null {
    if (!core?.math7?.primary?.voicePath || core.math7.primary.voicePath.length === 0) {
      return null;
    }
  
    const primary = core.math7.primary;
    const levels = core.voices?.levelPath ?? [];
    const levelStart = levels[0];
    const levelEnd = levels[levels.length - 1];
  
    const lines: string[] = [];
  
    const word = core.input?.normalized || core.input?.raw;
    if (word) {
      lines.push(`Seven-Voices heart snapshot for "${word}":`);
    } else {
      lines.push(`Seven-Voices heart snapshot:`);
    }
  
    lines.push(`- Primary path: ${primary.voicePath.join(" → ")}`);
  
    if (primary.ringPath && primary.ringPath.length > 0) {
      const ringStart = primary.ringPath[0];
      const ringEnd = primary.ringPath[primary.ringPath.length - 1];
      lines.push(`- Rings: ${ringStart} → ${ringEnd}`);
    }
  
    if (levelStart && levelEnd) {
      lines.push(`- Levels: ${levelStart} → ${levelEnd}`);
    }
  
    if (primary.tensionLevel) {
      lines.push(`- Tension: ${primary.tensionLevel}`);
    }
  
    if (typeof primary.frontierCount === "number") {
      lines.push(`- Frontier consonants: ${primary.frontierCount}`);
    }
  
    return lines.join("\n");
  }

const LEVEL_LABEL: Record<number, string> = { 1: 'High', 0: 'Mid', [-1]: 'Low' } as any;


export function ResultsDisplay({ analysis: result }: { analysis: AnalyzeWordResultV1 }) {
  const [coreOnly, setCoreOnly] = useState(false);
  const coreJsonRef = useRef<HTMLPreElement | null>(null);
  const { toast } = useToast();
  const { heart, mind, candidates, deepRoot, meta } = result;
  const heartSummary = getHeartSummary(heart);
  const [copiedHeart, setCopiedHeart] = React.useState(false);
  const primaryHeart = heart.math7?.primary;
  const heartVoiceSeq = primaryHeart?.voicePath ?? [];
  const heartRingPath = primaryHeart?.ringPath ?? [];
  const heartLevelPath = primaryHeart?.levelPath ?? [];

  const coreSummary =
    primaryHeart &&
    heartVoiceSeq.length > 0 &&
    heartRingPath.length > 0 &&
    heartLevelPath.length > 0
      ? {
          path: heartVoiceSeq.join(" → "),
          rings:
            heartRingPath.length === 1
              ? `${heartRingPath[0]}`
              : `${heartRingPath[0]} → ${
                  heartRingPath[heartRingPath.length - 1]
                }`,
          levels:
            heartLevelPath.length === 1
              ? `${heartLevelPath[0]}`
              : `${heartLevelPath[0]} → ${
                  heartLevelPath[heartLevelPath.length - 1]
                }`,
          tension: heart.math7.tensionLevel ?? "unknown",
          frontier: heart.math7.frontierCount ?? 0,
        }
      : null;


const heartCore = heart as HeartCore | undefined;

const handleCopyHeartSummary = React.useCallback(() => {
  const text = buildHeartSummaryText(heartCore);
  if (!text) {
    console.warn("No heart summary available to copy.");
    return;
  }

  try {
    navigator.clipboard.writeText(text);
    setCopiedHeart(true);
    setTimeout(() => setCopiedHeart(false), 2000);
  } catch (err) {
    console.error("Failed to copy heart summary:", err);
  }
}, [heartCore]);

const handleCopyCoreJson = async () => {
  const node = coreJsonRef.current;
  if (!node) return;

  const text = node.textContent ?? "";
  if (!text.trim()) return;

  try {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied heart JSON",
      description: "Seven-Voices heart snapshot is now in your clipboard.",
    });
  } catch (err) {
    console.error("Copy failed", err);
    toast({
      variant: "destructive",
      title: "Copy failed",
      description: "Browser blocked clipboard access.",
    });
  }
};

const coreSnapshot = useMemo(() => {
    if (!result) return null;
    if (coreOnly && result.heart) {
      return result.heart;
    }
    return result;
  }, [result, coreOnly]);

  const exportPayload = coreOnly ? heart : result;

  const baseName = result.word ?? "analysis";
  const exportFilename = coreOnly
    ? `${baseName}-heart-core.json`
    : `${baseName}-full-analysis.json`;


  if (!result) return null;

  return (
    <div className="space-y-4">
      {coreOnly ? (
        heart && (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle>Seven-Voices Heart (Core)</CardTitle>
                <CardDescription>
                  Minimal heart snapshot from the engine for this word.
                </CardDescription>
              </div>

              {heart && (
                <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                  <span className="rounded-full border px-2 py-0.5 leading-none">
                    Engine core v2
                  </span>
                  <span className="font-mono opacity-70">
                    {heart.engineVersion}
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {coreSummary && (
                <p className="text-xs text-muted-foreground mb-2">
                  Seven-Voices heart snapshot: primary path{" "}
                  <span className="font-mono">{coreSummary.path}</span> ·
                  Rings: {coreSummary.rings} · Levels: {coreSummary.levels} ·
                  Tension: {coreSummary.tension} · Frontier consonants:{" "}
                  {coreSummary.frontier}
                </p>
              )}
              <pre className="text-xs whitespace-pre-wrap break-all">
                {JSON.stringify(heart, null, 2)}
              </pre>
              {heartSummary && (
                <div className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-200">
                  <div className="mb-2 flex items-center justify-between gap-3">
<h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
HEART SUMMARY
</h3>
{heartCore && (
<button
type="button"
onClick={handleCopyHeartSummary}
className="rounded-lg border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-900 transition-colors"
>
{copiedHeart ? "Copied" : "Copy heart summary"}
</button>
)}
</div>
                  {result && (
                    <HeartSummaryCard
                      word={result.word ?? ""}
                      primaryPath={result.heart.math7.primary}
                      className="mt-2"
                    />
                  )}

                  <div className="flex flex-wrap gap-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">
                        Primary path
                      </div>
                      <div className="mt-1">
                        {heartSummary.voices.length
                          ? heartSummary.voices.join(" → ")
                          : "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">
                        Rings
                      </div>
                      <div className="mt-1">
                        {heartSummary.rings.length
                          ? heartSummary.rings.join(" → ")
                          : "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">
                        Levels
                      </div>
                      <div className="mt-1">
                        {heartSummary.levels.length
                          ? heartSummary.levels.join(" → ")
                          : "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">
                        Tension
                      </div>
                      <div className="mt-1">
                        <span
                          className={
                            heartSummary.tension === "low"
                              ? "text-emerald-400"
                              : heartSummary.tension === "medium"
                              ? "text-amber-400"
                              : heartSummary.tension === "high"
                              ? "text-rose-400"
                              : "text-slate-200"
                          }
                        >
                          {heartSummary.tension}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">
                        Frontier consonants
                      </div>
                      <div className="mt-1">
                        {heartSummary.frontierCount ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      ) : (
        <>
          {heart && heart.math7 && (
             <PrinciplesBlock analysis={result} />
          )}

          <Candidates candidates={candidates} />

        </>
      )}

      <section className="mt-4">
  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
    Core snapshot (Seven-Voices heart)
  </h3>

  <pre
    ref={coreJsonRef}
    className="mt-2 max-h-[420px] overflow-auto rounded-md bg-slate-950/60 p-3 text-xs font-mono text-slate-100 border border-slate-800"
  >
    {coreSnapshot && JSON.stringify(coreSnapshot, null, 2)}
  </pre>

  <div className="flex items-center justify-end gap-2 mt-2">
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <input
        type="checkbox"
        checked={coreOnly}
        onChange={(e) => setCoreOnly(e.target.checked)}
      />
      Core only (Heart)
    </label>

    <Button variant="outline" size="sm" onClick={handleCopyCoreJson}>
      Copy JSON
    </Button>

    <ExportJsonButton data={exportPayload} filename={exportFilename} />
  </div>
</section>
    </div>
  );
}
