'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import type { CClass } from "../functions/languages";
import { classRange } from "../functions/languages";
import type { EnginePayload, AnalysisResult_DEPRECATED, Vowel, SevenCalcResult } from "../shared/engineShape";
import { getVoiceMeta } from '@/shared/sevenVoices';
import WhyThisPath from "./WhyThisPath";
import { VOICE_COLOR_MAP } from "@/shared/voiceColors";
import { Candidates } from "./Candidates";
import { PrinciplesBlock } from "./PrinciplesBlock";
import { SymbolicReadingCard } from "./SymbolicReadingCard";
import { Button } from "@/components/ui/button";
import { downloadJson } from "@/lib/downloadJson";


const LEVEL_LABEL: Record<number, string> = { 1: "High", 0: "Mid", [-1]: "Low" } as any;

function ConsonantInfo({ analysis }: { analysis: AnalysisResult_DEPRECATED }) {
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


export function PathRow({ title, block, analysis }: { title: string; block: any, analysis: AnalysisResult_DEPRECATED }) {
  if (!block || !block.voicePath.length) {
    return (
      <Card className="p-4">
        <h3 className="font-bold text-sm tracking-wide mb-2">{title}</h3>
        <div className="text-xs opacity-60">— no path —</div>
      </Card>
    );
  }

  const { math7 } = analysis || {};

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

        {math7 && math7.primary && (
          <div className="mt-4 rounded-xl border px-4 py-3 text-sm">
            <div className="font-semibold mb-1">
              Core (Seven-Voices Math)
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase opacity-70">State</div>
                <div>{math7.primary.cycleState}</div>
              </div>

              <div>
                <div className="text-xs uppercase opacity-70">Total (mod 7)</div>
                <div>{math7.primary.totalMod7}</div>
              </div>

              <div className="min-w-[220px]">
                <div className="text-xs uppercase opacity-70">Principles Path</div>
                <div>{math7.primary.principlesPath.join(" → ")}</div>
              </div>
            </div>
          </div>
        )}
        
        {analysis.math7?.heart && (
          <div className="mt-4 border border-pink-600/40 rounded-xl p-4 bg-pink-900/10">
            <h3 className="text-pink-400 font-medium mb-2">
              Core Auto-Calculation (Seven Principles)
            </h3>
            <p><strong>Expression:</strong> {analysis.math7.heart.expression}</p>
            <p><strong>Decimal:</strong> {analysis.math7.heart.decimal}</p>
            <p><strong>Base-7:</strong> {analysis.math7.heart.base7.join(" ")}</p>
            <p><strong>Voices:</strong> {analysis.math7.heart.voices.join(" → ")}</p>
            <p><strong>Principle:</strong> <span className="text-pink-300">{analysis.math7.heart.principle}</span></p>
          </div>
        )}
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


export function ResultsDisplay({ analysis }: { analysis: AnalysisResult_DEPRECATED | null }) {
  if (!analysis) return null;
  const { core, candidates, symbolic, debug, wordMatrix, deepRoot, math7 } = analysis;
  const raw = debug?.rawEnginePayload;

  // The primaryPath in the new AnalyzeWordResult is a string, not an array.
  // We need to parse it back into an array for the PathRow component.
  const primaryVoicePath = core.primaryPath.voicePath.split(" → ").filter(Boolean) as Vowel[];
  const primaryRingPath = core.primaryPath.ringPath.split(" → ").map(Number);
  // Map 'high'/'mid'/'low' back to numbers for LEVEL_LABEL
  const primaryLevelPath = core.primaryPath.levelPath.split(" → ").map(l => (l === 'high' ? 1 : l === 'mid' ? 0 : -1));

  return (
    <div className="space-y-4">
        {core && core.primaryPath && (
            <PathRow
              title="Primary Path"
              block={{
                voicePath: primaryVoicePath,
                ringPath: primaryRingPath,
                levelPath: primaryLevelPath,
              }}
              analysis={analysis}
            />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {raw && <WhyThisPath primary={raw.primaryPath} />}
            <PrinciplesBlock analysis={analysis} />
        </div>
        
        <Candidates candidates={candidates} math7={math7} />
        
        {symbolic && <SymbolicReadingCard symbolic={symbolic} />}

        {wordMatrix && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Word Matrix (compact summary)</CardTitle>
              <CardDescription>
                {wordMatrix.languageFamily} · {wordMatrix.morphology.root}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Meaning:</span>{" "}
                {wordMatrix.meaning}
              </div>

              <div>
                <span className="font-semibold">Morphology:</span>{" "}
                {wordMatrix.morphology.root}
                {wordMatrix.morphology.suffixes &&
                  ` + ${wordMatrix.morphology.suffixes.join(" + ")}`}
                {" — "}
                {wordMatrix.morphology.gloss}
              </div>

              {wordMatrix.wordSums && (
                <div>
                  <span className="font-semibold">Word sums:</span>
                  <ul className="list-disc list-inside">
                    {wordMatrix.wordSums.map((ws, i) => (
                      <li key={i}>{ws}</li>
                    ))}
                  </ul>
                </div>
              )}

              {wordMatrix.principles.length > 0 && (
                <div>
                  <span className="font-semibold">Principles path:</span>{" "}
                  {wordMatrix.principles.join(" → ")}
                </div>
              )}

              {wordMatrix.symbolicNotes && (
                <div>
                  <span className="font-semibold">Symbolic:</span>{" "}
                  {wordMatrix.symbolicNotes}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {deepRoot && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Proto-Root Analysis</CardTitle>
              <CardDescription>Minimal functional origin</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                <strong>Core function:</strong> {deepRoot.coreFunction}
              </p>

              <p>
                <strong>Vowel motif:</strong>{" "}
                {deepRoot.motif && deepRoot.motif.length
                  ? deepRoot.motif.join(" → ")
                  : "—"}
              </p>

              <p>
                <strong>Light / Dark:</strong> {deepRoot.lightDark}
              </p>

              <p>
                <strong>Tone:</strong> {deepRoot.vibrationalTone}
              </p>

              <p>
                <strong>Blocks:</strong>{" "}
                {deepRoot.pieces && deepRoot.pieces.length
                  ? deepRoot.pieces
                      .map(
                        (p) =>
                          `${p.role}: ${p.block} (${p.language} – ${p.meaning})`,
                      )
                      .join(" · ")
                  : "—"}
              </p>

              <p>
                <strong>Summary:</strong> {deepRoot.short}
              </p>

              <p>
                <strong>Examples:</strong>{" "}
                {deepRoot.examples && deepRoot.examples.length
                  ? deepRoot.examples
                      .map(
                        (ex) => `${ex.language}: ${ex.form} (${ex.gloss})`,
                      )
                      .join(" · ")
                  : "—"}
              </p>
            </CardContent>
          </Card>
        )}

        {raw && raw.frontierPaths && raw.frontierPaths.length > 0 && (
          <Card className="p-4 mt-4">
            <h3 className="font-bold text-sm tracking-wide">Frontier (near‑optimal alternates)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              {raw.frontierPaths.map((f, idx)=> {
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
                    {f.voicePath.map((v,i)=> (
                      <React.Fragment key={i}>
                        <Chip v={v} />
                        {i < f.voicePath.length-1 && <Arrow/>}
                      </React.Fragment>
                    ))}
                  </div>
                  <hr className="my-2 border-border" />
                  <div className="text-xs mt-1.5 text-slate-500">Levels: {f.levelPath.map(l=>LEVEL_LABEL[l]).join(" → ")}</div>
                  <div className="text-xs text-slate-500">Rings: {f.ringPath.join(" → ")}</div>
                </Card>
              )})}
            </div>
          </Card>
        )}
    </div>
  );
}
