'use client';
import React, { useMemo, useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import type { CClass } from '../functions/languages';
import { classRange } from '../functions/languages';
import type { EnginePayload, Vowel } from '../shared/engineShape';
import { enginePayloadToAnalysisResult, type AnalysisResult } from '@/shared/analysisAdapter';
import { getVoiceMeta } from '@/shared/sevenVoices';
import WhyThisPath from './WhyThisPath';
import { VOICE_COLOR_MAP } from '../shared/voiceColors';
import { Candidates } from './Candidates';
import { PrinciplesBlock } from './PrinciplesBlock';
import { SymbolicReadingCard } from './SymbolicReadingCard';
import { ExportJsonButton } from './ui/ExportJsonButton';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';

function copyTextToClipboard(text: string) {
  // Modern API first
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback for weird hosts (like the Firebase Studio sandbox)
  return new Promise<void>((resolve, reject) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Make it invisible but still selectable
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const ok = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (!ok) reject(new Error("execCommand returned false"));
      else resolve();
    } catch (err) {
      reject(err as Error);
    }
  });
}

export function buildHeartSummary(result: AnalysisResult): string {
  const heart = result.math7?.heartPaths?.primary;
  if (!heart) return "";

  const [vFrom, vTo] = heart.voiceSequence ?? [];
  const [rFrom, rTo] = heart.ringPath ?? [];
  const [lFrom, lTo] = heart.levelPath ?? [];
  const tension = heart.tensionLevel ?? "unknown";
  const frontier = result.math7?.frontierConsonants;

  const lines = [
    `Seven-Voices heart snapshot for "${result.word ?? ""}":`,
    `- Primary path: ${vFrom ?? "?"} → ${vTo ?? "?"}`,
    `- Rings: ${rFrom ?? "?"} → ${rTo ?? "?"}`,
    `- Levels: ${lFrom ?? "?"} → ${lTo ?? "?"}`,
    `- Tension: ${tension}`,
    frontier != null ? `- Frontier consonants: ${frontier}` : null,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}


// Lightweight formatter for the Seven-Voices heart
function getHeartSummary(core: any) {
  if (!core) return null;

  const primary = core.heartPaths?.primary ?? {};
  const voices: string[] = primary.voiceSequence ?? core.voices?.vowelVoices ?? [];
  const rings: (number | string)[] = primary.ringPath ?? core.voices?.ringPath ?? [];
  const levels: string[] = core.voices?.levelPath ?? [];
  const tension: string = primary.tensionLevel ?? "unknown";
  const frontierCount: number | undefined = core.heartPaths?.frontierCount;

  return {
    voices,
    rings,
    levels,
    tension,
    frontierCount,
  };
}

const LEVEL_LABEL: Record<number, string> = { 1: 'High', 0: 'Mid', [-1]: 'Low' } as any;

function ConsonantInfo({ analysis }: { analysis: AnalysisResult }) {
  const windows = analysis.core.consonants.clusters?.map(c => c.cluster) || [];
  const windowClasses = analysis.core.consonants.clusters?.map(c => c.classes[0]) || [];
  const ringPath = analysis.core.voices.ringPath;
  const edgeWindows = analysis.debug?.rawEnginePayload?.edgeWindows || [];

  const hasInteriorWindows = windows.length > 0;
  const hasEdgeWindows = edgeWindows.length > 0;

  if (!hasInteriorWindows && !hasEdgeWindows) {
    return null;
  }

  return (
    <div className="mt-2.5">
      <h4 className="text-xs text-slate-500 mb-1">Consonant Influence</h4>
      
      {hasInteriorWindows && (
        <div className="flex flex-col gap-1.5">
          {windows.map((w, i) => {
            const cClass = windowClasses[i] as CClass;
            const [lo, hi] = classRange(cClass);
            let hopInfo = "";
            if (ringPath && i < ringPath.length - 1) {
              const delta = Math.abs(ringPath[i+1] - ringPath[i]);
              const isOptimal = delta >= lo && delta <= hi;
              hopInfo = `|Δring| = ${delta} ${isOptimal ? "✓" : "✗"}`;
            }

            return (
              <Card key={i} className="p-2.5 text-sm font-code flex justify-between items-center">
                <span>'{w}' is <span className="font-semibold">{cClass}</span> (prefers {lo}–{hi})</span>
                <span className="font-semibold">{hopInfo}</span>
              </Card>
            );
          })}
        </div>
      )}

      {hasEdgeWindows && (
        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
          <b>Edge:</b> {edgeWindows.join(" · ")}
        </div>
      )}
    </div>
  );
}


export function PathRow({ title, block, analysis }: { title: string; block: any, analysis: AnalysisResult }) {
  if (!block || !block.voicePath.length) {
    return (
      <Card className="p-4">
        <h3 className="font-bold text-sm tracking-wide mb-2">{title}</h3>
        <div className="text-xs opacity-60">— no path —</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-bold text-sm tracking-wide mb-2">{title}</h3>

      <>
        <div className="flex flex-wrap gap-2 items-center">
          {block.voicePath.map((v:Vowel,i:number)=>(
            <React.Fragment key={`v-${i}`}>
              <Chip v={v} />{i<block.voicePath.length-1 && <Arrow/>}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <InfoLine label="Voice Path" value={block.voicePath.join(" → ")} />
            <InfoLine label="Level Path" value={block.levelPath.map(l=>LEVEL_LABEL[l]).join(" → ")} />
            <InfoLine label="Ring Path" value={block.ringPath.join(" → ")} />
        </div>
        
        {title === "Primary Path" && <ConsonantInfo analysis={analysis} />}
      </>
    </Card>
  );
}

function InfoLine({label, value, mono}:{label:string; value:string; mono?:boolean}){
  return (
    <Card className="p-2.5 flex flex-col gap-1">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`font-semibold ${mono ? "font-code":""}`}>{value}</span>
    </Card>
  );
}

const Arrow = () => <span className="font-bold text-muted-foreground">→</span>;
const Chip = ({ v }: { v: string | number }) => {
    const chipStyle = v in VOICE_COLOR_MAP ? { backgroundColor: VOICE_COLOR_MAP[v as Vowel], color: "#020617" } : {};
    return (
        <span
          className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full border border-black/10 text-sm font-bold"
          style={chipStyle}
        >
          {String(v)}
        </span>
    );
};

type SymbolicSummary = {
  summary?: string;
  notes?: string[];
};

function formatSymbolicReading(symbolic?: SymbolicSummary): string {
  if (!symbolic) return "";

  const parts: string[] = [];

  if (symbolic.summary) {
    parts.push(symbolic.summary);
  }

  if (symbolic.notes && symbolic.notes.length > 0) {
    parts.push(symbolic.notes.join(" "));
  }

  return parts.join(" ");
}

interface ResultsDisplayProps {
  analysis: AnalysisResult | null;
  coreOnly?: boolean;
}

export function ResultsDisplay({ analysis: raw, coreOnly: initialCoreOnly }: ResultsDisplayProps) {
  const analysis: AnalysisResult | null = useMemo(() => raw, [raw]);
  const [coreOnly, setCoreOnly] = useState(initialCoreOnly ?? false);
  const coreJsonRef = useRef<HTMLPreElement | null>(null);
  const { toast } = useToast();
  const core = analysis?.core;
  const heartSummary = getHeartSummary(core);
  const { candidates, symbolic } = analysis || {};
  const primaryHeart = core?.heartPaths?.primary;
  const heartVoiceSeq = primaryHeart?.voiceSequence ?? [];
  const heartRingPath = primaryHeart?.ringPath ?? [];
  const heartLevelPath = core?.voices?.levelPath ?? [];

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
          tension: primaryHeart.tensionLevel ?? "unknown",
          frontier: primaryHeart.frontierCount ?? 0,
        }
      : null;

    const handleCopyHeartSummary = async () => {
        if (!analysis) return;

        const summary = buildHeartSummary(analysis);

        try {
            await copyTextToClipboard(summary);
            toast({
            title: "Copied",
            description: "Seven-Voices heart snapshot is in your clipboard.",
            });
        } catch (err) {
            console.error(err);
            toast({
            variant: "destructive",
            title: "Could not copy",
            description: "Clipboard is blocked in this environment.",
            });
        }
    };

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
    if (!analysis) return null;
    if (coreOnly && analysis.core) {
      return analysis.core;
    }
    return analysis;
  }, [analysis, coreOnly]);

  const exportPayload = coreOnly ? core : analysis;

  const baseName = analysis?.word ?? "analysis";
  const exportFilename = coreOnly
    ? `${baseName}-heart-core.json`
    : `${baseName}-full-analysis.json`;


  if (!analysis) return null;

  return (
    <div className="space-y-4">
      {coreOnly ? (
        core && (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle>Seven-Voices Heart (Core)</CardTitle>
                <CardDescription>
                  Minimal heart snapshot from the engine for this word.
                </CardDescription>
              </div>

              {analysis.core && (
                <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                  <span className="rounded-full border px-2 py-0.5 leading-none">
                    Engine core v2
                  </span>
                  <span className="font-mono opacity-70">
                    {analysis.core.engineVersion}
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
                {JSON.stringify(core, null, 2)}
              </pre>
              {heartSummary && (
                <div className="mt-4 border-t border-slate-800 pt-4 text-sm text-slate-200">
                  <div className="mb-2 flex items-center justify-between gap-3">
<h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
HEART SUMMARY
</h3>
<Button size="sm" variant="outline" onClick={handleCopyHeartSummary}>
  Copy heart summary
</Button>
</div>

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
          {core && core.heartPaths && analysis && (
            <PathRow
              block={{
                voicePath: core.voices.vowelVoices,
                ringPath: core.voices.ringPath,
                levelPath: core.voices.levelPath.map((l: any) =>
                  l === 'high' ? 1 : l === 'low' ? -1 : 0
                ),
              }}
              title="Primary Path"
              analysis={analysis}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WhyThisPath primary={raw.primaryPath} />
            {analysis && <PrinciplesBlock analysis={analysis} />}
          </div>

          <Candidates candidates={candidates} />

          {/* Zheji-inspired symbolic reading (experimental) */}
          {analysis?.symbolic && (
            (() => {
              const symbolic = analysis.symbolic as SymbolicSummary | undefined;

              if (!symbolic || (!symbolic.summary && !symbolic.notes?.length)) {
                return null;
              }

              return (
                <Card>
                  <CardHeader className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle>✨ Zheji-inspired symbolic reading (experimental)</CardTitle>
                      <CardDescription>
                        This is a symbolic / interpretive layer built on top of the Seven-Voices path and
                        morphology.
                      </CardDescription>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-1 shrink-0"
                      onClick={() => {
                        const text = formatSymbolicReading(symbolic);
                        if (!text) return;
                        if (navigator?.clipboard?.writeText) {
                          navigator.clipboard.writeText(text).catch(() => {
                            // ignore clipboard errors in older browsers
                          });
                        }
                      }}
                    >
                      Copy reading
                    </Button>
                  </CardHeader>

                  <CardContent>
                    {symbolic.notes && symbolic.notes.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {symbolic.notes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })()
          )}

          {core && core.heartPaths && core.heartPaths.frontierCount > 0 && raw && (
            <Card className="p-4 mt-4">
              <h3 className="font-bold text-sm tracking-wide">Frontier (near‑optimal alternates)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                {raw.frontierPaths.map((f, idx) => {
                  const altVoice = f.voicePath[0];
                  const altBadgeStyle = altVoice
                    ? { backgroundColor: VOICE_COLOR_MAP[altVoice], color: "#020617" }
                    : {};
                  return (
                    <Card key={idx} className="p-3 border-accent">
                      <div className="font-bold mb-2 flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shrink-0"
                          style={altBadgeStyle}
                        >
                          {altVoice ?? "?"}
                        </div>
                        {`alt-${idx}`}
                      </div>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {f.voicePath.map((v, i) => (
                          <React.Fragment key={i}>
                            <Chip v={v} />
                            {i < f.voicePath.length - 1 && <Arrow />}
                          </React.Fragment>
                        ))}
                      </div>
                      <hr className="my-2 border-border" />
                      <div className="text-xs mt-1.5 text-slate-500">Levels: {f.levelPath.map(l => LEVEL_LABEL[l]).join(" → ")}</div>
                      <div className="text-xs text-slate-500">Rings: {f.ringPath.join(" → ")}</div>
                    </Card>
                  )
                })}
              </div>
            </Card>
          )}
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
