
'use client';
import React, { useMemo } from "react";
import { Card } from "./ui/card";
import type { CClass } from "../functions/languages";
import { classRange } from "../functions/languages";
import type { EnginePayload, EnginePath } from "../shared/engineShape";
import { summarizePrinciples } from "../lib/principles";
import WhyThisPath from "./WhyThisPath";

// Seven‑Voices palette (uses CSS variables from globals.css)
const VOICE_COLOR: Record<string, string> = {
  A: "var(--voice-A)",
  E: "var(--voice-E)",
  I: "var(--voice-I)",
  O: "var(--voice-O)",
  U: "var(--voice-U)",
  Y: "var(--voice-Y)",
  "Ë": "var(--voice-EH)"
};

const LEVEL_LABEL: Record<number, string> = { 1: "High", 0: "Mid", [-1]: "Low" } as any;
const labelLevels = (levels: number[]) => levels.map(l=> LEVEL_LABEL[l] ?? l).join(" → ");
const labelRings = (rings: number[]) => rings.join(" → ");

const Arrow = () => <span className="font-bold text-accent">→</span>;
const Chip = ({ v }: { v: string | number }) => (
    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full border bg-card text-card-foreground">
      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: VOICE_COLOR[String(v)] || 'hsl(var(--primary))' }} />
      <span className="font-bold">{String(v)}</span>
    </span>
);

function ConsonantInfo({ analysis }: { analysis: EnginePayload }) {
  const { windows, windowClasses, primaryPath, edgeWindows } = analysis;
  const ringPath = primaryPath?.ringPath;

  const hasInteriorWindows = windows && windowClasses && windows.length > 0;
  const hasEdgeWindows = edgeWindows && edgeWindows.length > 0;

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


export function PathRow({ title, block, analysis }: { title: string; block?: EnginePath, analysis: EnginePayload }) {
  if (!block || !block.voicePath || block.voicePath.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="font-bold text-sm tracking-wide mb-2">{title}</h3>
        <div className="text-xs opacity-60">— no path —</div>
      </Card>
    );
  }

  const { voicePath, ringPath, levelPath, checksums, ops, kept } = block;

  return (
    <Card className="p-4">
      <h3 className="font-bold text-sm tracking-wide mb-2">{title}</h3>

      <>
        <div className="flex flex-wrap gap-2 items-center">
          {voicePath.map((v,i)=>(
            <React.Fragment key={`v-${i}`}>
              <Chip v={v} />{i<voicePath.length-1 && <Arrow/>}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <InfoLine label="Voice Path" value={voicePath.join(" → ")} />
            <InfoLine label="Level Path" value={labelLevels(levelPath)} />
            <InfoLine label="Ring Path" value={labelRings(ringPath)} />
            {checksums && (
                <InfoLine label="Checksums" value={`V=${checksums.V} · E=${checksums.E.toFixed(2)} · C=${checksums.C}`} mono />
            )}
            {typeof kept === "number" ? <InfoLine label="Keeps" value={String(kept)} /> : null}
        </div>
        
        {title === "Primary Path" && <ConsonantInfo analysis={analysis} />}

        {ops?.length > 0 && (
          <div className="mt-2.5">
            <h4 className="font-bold text-sm tracking-wide">Ops</h4>
            <div className="font-code text-xs whitespace-pre-wrap">{ops.join("; ")}</div>
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

export function PrinciplesBlock({ engine }: { engine:any }) {
  if (!engine?.primaryPath?.voicePath?.length) return null;
  const s = summarizePrinciples(engine);
  return (
    <div className="mt-3 border rounded p-2 text-sm">
      <div className="font-semibold mb-1">Seven Principles</div>
      <div className="opacity-80">Path: {s.pathLabel}</div>
      {s.dominant.length > 0 && (
        <div className="opacity-80">
          Dominant: {s.dominant.map(x=>`${x.label} (${x.hits})`).join(", ")}
        </div>
      )}
      <div className="opacity-60 text-xs mt-1">7 words: {s.sevenWords}</div>
    </div>
  );
}

export function ResultsDisplay({ analysis }: { analysis: EnginePayload }) {
    const { primaryPath, frontierPaths } = analysis;

    const frontierList = useMemo(() => (frontierPaths || []).filter(f => f?.voicePath && f.voicePath.join("") !== (primaryPath?.voicePath || []).join("")), [frontierPaths, primaryPath]);

    if (!primaryPath) return null;
    
    return (
        <>
            <PathRow block={primaryPath} title="Primary Path" analysis={analysis} />
            <PrinciplesBlock engine={analysis} />
            {frontierList.length > 0 && (
              <Card className="p-4">
                <h3 className="font-bold text-sm tracking-wide">Frontier (near‑optimal alternates)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {frontierList.map((f, idx)=> (
                    <Card key={idx} className="p-3 border-accent">
                      <div className="font-bold mb-2">Alt #{idx+1}</div>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {f.voicePath.map((v,i)=> (
                          <React.Fragment key={i}>
                            <Chip v={v} />
                            {i < f.voicePath.length-1 && <Arrow/>}
                          </React.Fragment>
                        ))}
                      </div>
                      <hr className="my-2 border-border" />
                      {f.checksums && <div className="font-code text-xs">V={f.checksums.V} · E={f.checksums.E.toFixed(2)} · C={f.checksums.C}</div>}
                      <div className="font-code text-xs mt-1">Keeps: {typeof f.kept === "number" ? f.kept : "—"}</div>
                      <div className="text-xs mt-1.5 text-slate-500">Levels: {labelLevels(f.levelPath)}</div>
                      <div className="text-xs text-slate-500">Rings: {labelRings(f.ringPath)}</div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
        </>
    );
}
