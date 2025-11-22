'use client';
import React, { useMemo } from "react";
import { Card, CardContent } from "./ui/card";
import type { CClass } from "../functions/languages";
import { classRange } from "../functions/languages";
import type { EnginePayload, AnalysisResult_DEPRECATED, Vowel } from "../shared/engineShape";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { getVoiceMeta } from '@/shared/sevenVoices';
import WhyThisPath from "./WhyThisPath";
import { VOICE_COLOR_MAP } from "../shared/voiceColors";
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

        {(analysis as any).math7 && (
          <div className="mt-4 rounded-xl border px-4 py-3 text-sm bg-background/50">
            <div className="font-semibold mb-1">
              Heart (Seven-Voices Path)
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase opacity-70">State</div>
                <div>{(analysis as any).math7.primary.cycleState}</div>
              </div>
              <div>
                <div className="text-xs uppercase opacity-70">Total (mod 7)</div>
                <div>{(analysis as any).math7.primary.totalMod7}</div>
              </div>
              <div>
                <div className="text-xs uppercase opacity-70">Principles Path</div>
                <div>
                  {(analysis as any).math7.primary.principlesPath.join(" → ")}
                </div>
              </div>
            </div>
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


export function ResultsDisplay({ analysis: raw }: { analysis: EnginePayload }) {
  const analysis = useMemo(() => enginePayloadToAnalysisResult(raw), [raw]);

  const handleExportJson = () => {
    if (!analysis) return;

    const rawWord = analysis.core.word || "analysis";

    const safeWord = String(rawWord).toLowerCase().replace(/[^a-z0-9_-]+/g, "-") || "analysis";

    downloadJson(`analysis-${safeWord}.json`, analysis);
  };

  if (!analysis) return null;
  const { core, candidates, symbolic } = analysis;

  return (
    <div className="space-y-4">
        {core && core.heartPaths && (
            <PathRow block={{voicePath: core.voices.vowelVoices, ringPath: core.voices.ringPath, levelPath: core.voices.levelPath.map(l=>l==='high'?1:l==='low'?-1:0)}} title="Primary Path" analysis={analysis} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WhyThisPath primary={raw.primaryPath} />
            <PrinciplesBlock analysis={analysis} />
        </div>
        
        <Candidates candidates={candidates} />
        
        {symbolic && <SymbolicReadingCard symbolic={symbolic} />}

        {core && core.heartPaths && core.heartPaths.frontierCount > 0 && (
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
         <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={handleExportJson}>
                Export JSON
            </Button>
        </div>
    </div>
  );
}
