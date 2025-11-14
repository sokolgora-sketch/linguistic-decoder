
'use client';
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { PathBlock, AnalyzeResponse } from "@/app/page";
import { CClass } from "@/lib/solver/valueTables";

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

function getChecksum(b: PathBlock, t: "V"|"E"|"C") {
  const checksums = b.checksums;
  return checksums?.[t] ?? 0;
}

const LEVEL_LABEL: Record<number, string> = { 1: "High", 0: "Mid", [-1]: "Low" } as any;
const labelLevels = (levels: number[]) => levels.map(l=> LEVEL_LABEL[l] ?? l).join(" → ");
const labelRings = (rings: number[]) => rings.join(" → ");

// This is the new, more robust PathRow implementation
type Checksum = { V: number; E: number; C: number; };
type AnyPath = {
  // snake_case (mapper)
  voice_path?: string[];
  ring_path?: number[];
  level_path?: number[];
  // camelCase (engine)
  voicePath?: string[];
  ringPath?: number[];
  levelPath?: number[];
  // from both
  checksums?: Checksum;
  ops?: string[];
  kept?: number;
};

function normalizePath(p?: AnyPath) {
  return {
    voice: p?.voice_path ?? p?.voicePath ?? [],
    ring:  p?.ring_path  ?? p?.ringPath  ?? [],
    level: p?.level_path ?? p?.levelPath ?? [],
    checksums: p?.checksums,
    ops: p?.ops ?? [],
    kept: p?.kept,
  };
}

const Arrow = () => <span className="font-bold text-accent">→</span>;
const Chip = ({ v }: { v: string | number }) => (
    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full border bg-card text-card-foreground">
      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: VOICE_COLOR[String(v)] || 'hsl(var(--primary))' }} />
      <span className="font-bold">{String(v)}</span>
    </span>
);

export function PathRow({ title, block, windows, windowClasses }: { title: string; block?: AnyPath, windows?:string[], windowClasses?:CClass[] }) {
  const { voice, ring, level, checksums, ops, kept } = normalizePath(block);
  const empty = !voice || voice.length === 0;

  return (
    <Card className="p-4">
      <h3 className="font-bold text-sm tracking-wide mb-2">{title}</h3>

      {empty ? (
        <div className="text-xs opacity-60">— no path —</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 items-center">
            {voice.map((v,i)=>(
              <React.Fragment key={`v-${i}`}>
                <Chip v={v} />{i<voice.length-1 && <Arrow/>}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              <InfoLine label="Voice Path" value={voice.join(" → ")} />
              <InfoLine label="Level Path" value={labelLevels(level)} />
              <InfoLine label="Ring Path" value={labelRings(ring)} />
              {checksums && (
                  <InfoLine label="Checksums" value={`V=${checksums.V} · E=${checksums.E} · C=${checksums.C}`} mono />
              )}
              {typeof kept === "number" ? <InfoLine label="Keeps" value={String(kept)} /> : null}
          </div>

          {windows && windowClasses && windows.length > 0 && (
            <div className="mt-2.5">
              <InfoLine label="Consonant Windows" value={windows.map((w,i)=>`'${w}' → ${windowClasses[i]}`).join(" | ")} mono />
            </div>
          )}
          {ops?.length > 0 && (
            <div className="mt-2.5">
              <h4 className="font-bold text-sm tracking-wide">Ops</h4>
              <div className="font-code text-xs whitespace-pre-wrap">{ops.join("; ")}</div>
            </div>
          )}
        </>
      )}
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


export function ResultsDisplay({ analysis }: { analysis: AnalyzeResponse['analysis'] }) {
    const primary = analysis?.primary;
    const frontierList = useMemo(() => (analysis?.frontier || []).filter(f => f?.voice_path && f.voice_path.join("") !== (primary?.voice_path || []).join("")), [analysis, primary]);

    if (!primary) return null;
    
    return (
        <>
            <PathRow block={primary} title="Primary Path" windows={analysis.windows} windowClasses={analysis.windowClasses}/>
            {frontierList.length > 0 && (
              <Card className="p-4">
                <h3 className="font-bold text-sm tracking-wide">Frontier (near‑optimal alternates)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {frontierList.map((f, idx)=> (
                    <Card key={idx} className="p-3 border-accent">
                      <div className="font-bold mb-2">Alt #{idx+1}</div>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {f.voice_path.map((v,i)=> (
                          <React.Fragment key={i}>
                            <Chip v={v} />
                            {i < f.voice_path.length-1 && <Arrow/>}
                          </React.Fragment>
                        ))}
                      </div>
                      <hr className="my-2 border-border" />
                      <div className="font-code text-xs">V={getChecksum(f, "V")} · E={getChecksum(f, "E")} · C={getChecksum(f, "C")}</div>
                      <div className="font-code text-xs mt-1">Keeps: {typeof f.kept === "number" ? f.kept : "—"}</div>
                      <div className="text-xs mt-1.5 text-slate-500">Levels: {labelLevels(f.level_path)}</div>
                      <div className="text-xs text-slate-500">Rings: {labelRings(f.ring_path)}</div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
        </>
    );
}

    