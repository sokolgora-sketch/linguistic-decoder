"use client";
import { useState } from "react";
import { analyzeClient } from "@/lib/analyzeClient";
import type { Alphabet } from "@/lib/solver/engineConfig";
import { PROFILES } from "@/lib/solver/valueTables";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Mode = "strict" | "open";

export default function ComparePanel({
  defaultMode = "strict",
  defaultAlphabet = "auto",
}: { defaultMode?: Mode; defaultAlphabet?: Alphabet }) {
  const [leftWord, setLeftWord] = useState("damage");
  const [rightWord, setRightWord] = useState("study");
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [alphabet, setAlphabet] = useState<Alphabet>(defaultAlphabet);
  const [left, setLeft] = useState<any>(null);
  const [right, setRight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runCompare() {
    if (!leftWord.trim() || !rightWord.trim()) return;
    setLoading(true);
    try {
      const [L, R] = await Promise.all([
        analyzeClient(leftWord.trim(), mode, alphabet),
        analyzeClient(rightWord.trim(), mode, alphabet),
      ]);
      setLeft(L);
      setRight(R);
    } finally {
      setLoading(false);
    }
  }

  const share = `/?word=${encodeURIComponent(leftWord)}&mode=${mode}&alphabet=${alphabet}`
    + `#compare=${encodeURIComponent(rightWord)}`;

  const eqPrimary = left?.analysis?.primary?.voice_path?.join(",") === right?.analysis?.primary?.voice_path?.join(",");

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-bold text-sm tracking-wide">Compare Two Words</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Input value={leftWord} onChange={e=>setLeftWord(e.target.value)} placeholder="Left word (e.g., damage)" />
        <Input value={rightWord} onChange={e=>setRightWord(e.target.value)} placeholder="Right word (e.g., study)" />
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={mode==="strict"} onChange={e=> setMode(e.target.checked?"strict":"open")} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            Strict
        </label>
        <Select value={alphabet} onValueChange={(v) => setAlphabet(v as Alphabet)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="auto">Auto-Detect</SelectItem>
                {PROFILES.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                ))}
            </SelectContent>
        </Select>

        <Button onClick={runCompare} disabled={loading}>
          {loading ? "Comparing…" : "Compare"}
        </Button>

        {(left || right) && (
          <a className="underline text-xs" href={share}>Share left + mode/alphabet</a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ResultCard title={leftWord} data={left} />
        <ResultCard title={rightWord} data={right} />
      </div>

      {(left && right) && (
        <div className="text-sm mt-2 font-semibold">
          Primary paths equal? {eqPrimary ? "Yes" : "No"}
        </div>
      )}
    </Card>
  );
}

function ResultCard({ title, data }: { title: string; data: any }) {
  const analysis = data?.analysis;
  return (
    <Card className="p-3 text-sm">
      <div className="font-semibold">{title}</div>
      {!analysis ? (
        <div className="opacity-70 text-xs py-2">—</div>
      ) : (
        <div className="space-y-1 mt-2">
          <div className="text-xs opacity-80">
            {analysis.mode} · {analysis.alphabet}
            {data.cacheHit && <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-amber-100 border border-amber-300">Cached</span>}
          </div>
          <div><b>Primary:</b> {analysis.primary?.voice_path?.join(" → ")}</div>
          <div><b>Checksums:</b> {analysis.primary?.checksums?.map((c:any)=>`${c.type}=${c.value}`).join(" · ")}</div>
          {!!analysis.windowClasses?.length && (
            <div><b>Windows:</b> {analysis.windowClasses.join(" | ")}</div>
          )}
        </div>
      )}
    </Card>
  );
}
