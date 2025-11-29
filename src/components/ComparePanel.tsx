"use client";
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PROFILES } from "../functions/languages";
import type { Alphabet } from "../lib/runAnalysis";

type Mode = "strict" | "open";
type CompareResult = any | null;

export default function ComparePanel({
  defaultMode = "strict",
  defaultAlphabet = "auto",
}: {
  defaultMode?: Mode;
  defaultAlphabet?: Alphabet;
}) {
  const [leftWord, setLeftWord] = useState("damage");
  const [rightWord, setRightWord] = useState("study");
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [alphabet, setAlphabet] = useState<Alphabet>(defaultAlphabet);
  const [left, setLeft] = useState<CompareResult>(null);
  const [right, setRight] = useState<CompareResult>(null);
  const [loading, setLoading] = useState(false);

  async function fetchAnalysis(word: string) {
    const url = `${window.location.origin}/api/analyze?word=${encodeURIComponent(word)}&mode=${mode}&alphabet=${alphabet}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Compare /api/analyze failed", await res.text());
      return null;
    }
    return res.json();
  }

  async function runCompare() {
    if (!leftWord.trim() || !rightWord.trim()) return;
    setLoading(true);
    try {
      const [L, R] = await Promise.all([fetchAnalysis(leftWord), fetchAnalysis(rightWord)]);
      setLeft(L);
      setRight(R);
    } finally {
      setLoading(false);
    }
  }

  const share = `/?word=${encodeURIComponent(leftWord)}&mode=${mode}&alphabet=${alphabet}#compare=${encodeURIComponent(rightWord)}`;
  const leftSeq = left?.core?.heartPaths?.primary?.voiceSequence || [];
  const rightSeq = right?.core?.heartPaths?.primary?.voiceSequence || [];
  const eqPrimary = leftSeq.join(",") === rightSeq.join(",");

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-bold text-sm tracking-wide">Compare Two Words</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <Input value={leftWord} onChange={(e) => setLeftWord(e.target.value)} placeholder="Left word (e.g., damage)" />
        <Input value={rightWord} onChange={(e) => setRightWord(e.target.value)} placeholder="Right word (e.g., study)" />
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={mode === "strict"}
            onChange={(e) => setMode(e.target.checked ? "strict" : "open")}
            className="w-4 h-4 rounded text-primary focus:ring-primary"
          />
          Strict
        </label>

        <Select value={alphabet} onValueChange={(v) => setAlphabet(v as Alphabet)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto-Detect</SelectItem>
            {PROFILES.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={runCompare} disabled={loading}>
          {loading ? "Comparing…" : "Compare"}
        </Button>

        {(left || right) && (
          <a className="underline text-xs" href={share}>
            Share left + mode/alphabet
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ResultCard title={leftWord} seq={leftSeq} />
        <ResultCard title={rightWord} seq={rightSeq} />
      </div>

      {left && right && (
        <div className="text-sm mt-2 font-semibold">Primary paths equal? {eqPrimary ? "Yes" : "No"}</div>
      )}
    </Card>
  );
}

function ResultCard({ title, seq }: { title: string; seq: string[] }) {
  return (
    <Card className="p-3 text-sm">
      <div className="font-semibold">{title}</div>
      {seq.length ? (
        <div className="opacity-80 text-xs pt-2">{seq.join(" → ")}</div>
      ) : (
        <div className="opacity-50 text-xs pt-2">—</div>
      )}
    </Card>
  );
}
