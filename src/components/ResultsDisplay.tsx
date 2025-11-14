'use client';
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { PathBlock, AnalyzeResponse } from "@/app/page";

// Seven‑Voices palette (kept from engine conventions)
const VOICE_COLOR: Record<string, string> = {
  A: "hsl(var(--chart-1))", // red-ish
  E: "hsl(var(--chart-2))", // orange-ish
  I: "hsl(var(--chart-3))", // yellow-ish
  O: "hsl(var(--chart-4))", // green-ish
  U: "hsl(var(--chart-5))", // blue-ish
  Y: "hsl(231 48% 48%)", // indigo-ish (primary)
  "Ë": "hsl(262 80% 50%)"   // violet-ish
};

// Level labels
const LEVEL_LABEL: Record<number, string> = { 1: "High", 0: "Mid", [-1]: "Low" } as any;

const joinPath = (p: string[]) => p.join(" → ");
const labelLevels = (levels: number[]) => levels.map(l=> LEVEL_LABEL[l] ?? l).join(" → ");
const labelRings = (rings: number[]) => rings.join(" → ");

function Chip({v}:{v:string}){
  return (
    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full border border-accent bg-white">
      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: VOICE_COLOR[v] || 'hsl(var(--primary))' }} />
      <span className="font-bold">{v}</span>
    </span>
  );
}

function PathRow({block, title}:{block:PathBlock; title:string}){
  return (
    <Card className="p-4">
      <h3 className="font-bold text-sm tracking-wide mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2 items-center">
        {block.voice_path.map((v,i)=> (
          <React.Fragment key={i}>
            <Chip v={v} />
            {i < block.voice_path.length-1 && <span className="font-bold text-accent">→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <InfoLine label="Voice Path" value={joinPath(block.voice_path)} />
        <InfoLine label="Level Path" value={labelLevels(block.level_path)} />
        <InfoLine label="Ring Path" value={labelRings(block.ring_path)} />
        <InfoLine label="Checksums" value={`V=${block.checksums.V} · E=${block.checksums.E} · C=${block.checksums.C}`} mono />
        {typeof block.kept === "number" ? <InfoLine label="Keeps" value={String(block.kept)} /> : null}
      </div>
      {block.ops?.length ? (
        <div className="mt-2.5">
          <h4 className="font-bold text-sm tracking-wide">Ops</h4>
          <div className="font-code text-xs whitespace-pre-wrap">{block.ops.join("; ")}</div>
        </div>
      ) : null}
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
    const frontierList = useMemo(() => (analysis?.frontier || []).filter(f => f.voice_path.join("") !== (primary?.voice_path || []).join("")), [analysis, primary]);

    if (!primary) return null;

    return (
        <>
            <PathRow block={primary} title="Primary Path" />
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
                            {i < f.voice_path.length-1 && <span className="font-bold text-accent">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <hr className="my-2 border-border" />
                      <div className="font-code text-xs">V={f.checksums.V} · E={f.checksums.E} · C={f.checksums.C}</div>
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
