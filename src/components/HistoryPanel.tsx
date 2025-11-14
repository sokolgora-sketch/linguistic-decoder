'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

export type HistItem = { word: string; mode: "strict" | "open"; primary: string[]; at: number };

export function HistoryPanel({ items, onRerun, onClear }:{ items: HistItem[]; onRerun:(w:string, m:"strict"|"open")=>void; onClear:()=>void }){
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) {
    return (
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm tracking-wide">History (local)</h3>
          <Button variant="secondary" onClick={onClear} disabled>Clear</Button>
        </div>
        <div className="text-xs text-slate-500">Loading history...</div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-sm tracking-wide">History (local)</h3>
        <Button variant="secondary" onClick={onClear} disabled={!items.length}>Clear</Button>
      </div>
      {items.length === 0 ? (
        <div className="text-xs text-slate-500 mt-2">No history yet. Run an analysis to add entries.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2.5">
          {items.map((it, i)=> (
            <Card key={i} className="p-3">
              <div className="font-bold">{it.word} <span className="font-normal text-slate-500">· {it.mode}</span></div>
              <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                {it.primary.map((v, j)=> (
                  <React.Fragment key={j}>
                    <span className="inline-flex items-center gap-1 py-0.5 px-1.5 rounded-full border bg-white text-xs"><span className="w-2 h-2 rounded-full inline-block" style={{ background: VOICE_COLOR[v] || 'hsl(var(--primary))' }} />{v}</span>
                    {j < it.primary.length-1 && <span className="font-bold text-accent">→</span>}
                  </React.Fragment>
                ))}
              </div>
              <div className="text-xs text-slate-500 mt-1.5">{new Date(it.at).toLocaleString()}</div>
              <div className="mt-2">
                <Button onClick={()=> onRerun(it.word, it.mode)}>Re‑analyze</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
