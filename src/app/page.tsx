
'use client';

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Candidates } from "@/components/Candidates";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ConsonantReference } from "@/components/ConsonantReference";
import { TwoRailsWithConsonants } from "@/components/TwoRailsWithConsonants";
import { analyzeClient } from "@/lib/analyzeClient";
import { useHistory, type HistoryItem } from "@/hooks/useHistory";
import type { Alphabet } from "@/lib/solver/engineConfig";
import { PROFILES } from "@/lib/solver/valueTables";


// ==== Types matching the /analyzeWord response ===============================
interface Checksums { V: number; E: number; C: number; }
export interface PathBlock { voice_path: string[]; ring_path: number[]; level_path: number[]; ops: string[]; checksums: Checksums; kept?: number; deleted?: number; }
export interface AnalyzeResponse {
  analysis: {
    engineVersion: string;
    word: string;
    mode: "strict"|"open";
    alphabet: Alphabet;
    primary: PathBlock;
    frontier: PathBlock[];
    signals: string[];
    windows?: string[];
    windowClasses?: any[];
    trace?: { v: string; level: 1 | 0 | -1; E?: number }[];
  },
  languageFamilies?: Record<string, { form:string; map:string[]; functional:string }[]> | null;
  cacheHit?: boolean;
}
type Vowel = "A"|"E"|"I"|"O"|"U"|"Y"|"Ë";


// ==== Main App ===============================================================
export default function LinguisticDecoderApp(){
  const { toast } = useToast();
  const [word, setWord] = useState("study");
  const [mode, setMode] = useState<"strict"|"open">("strict");
  const [alphabet, setAlphabet] = useState<Alphabet>("auto");
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  const history = useHistory(12);

  const canAnalyze = word.trim().length > 0 && !loading;

  async function analyze(nextWord?: string, nextMode?: "strict"|"open", nextAlphabet?: Alphabet){
    const useWord = (nextWord ?? word).trim();
    const useMode: "strict"|"open" = nextMode ?? mode;
    const useAlphabet = nextAlphabet ?? alphabet;
    if (!useWord) return;

    setLoading(true);
    setErr(null);
    try {
      const res = await analyzeClient(useWord, useMode, useAlphabet);
      if (res) {
        setData(res as AnalyzeResponse);
      }
    } catch (e: any) {
      const error = e?.message || "Request failed";
      setErr(error);
      toast({ title: "Error", description: error, variant: "destructive" });
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const w = p.get("word"); 
    const m = p.get("mode") as "strict"|"open" | null; 
    const a = p.get("alphabet") as Alphabet | null;
    if (w) { 
      const currentWord = w;
      const currentMode = m || 'strict';
      const currentAlphabet = a || 'auto';
      setWord(currentWord); 
      setMode(currentMode); 
      setAlphabet(currentAlphabet); 
      analyze(currentWord, currentMode, currentAlphabet); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analysis = data?.analysis;
  const signals = analysis?.signals?.join(" · ") || "";
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-4 lg:p-8">
      <main className="space-y-4">
        {/* Header */}
        <header className="p-6 border-b-4 border-primary bg-white -mx-6 -mt-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-headline text-3xl font-bold tracking-wide text-primary">Linguistic Decoder</h1>
            <p className="text-sm text-slate-600 mt-1">Seven‑Voices matrix solver · primary & frontier paths · optional Gemini mapping</p>
          </div>
        </header>

        {/* Controls */}
        <Card className="p-4">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2.5 items-center">
            <Input
              value={word}
              onChange={e=> setWord(e.target.value)}
              placeholder="Type a word…"
              className="font-semibold"
              onKeyUp={(e) => e.key === 'Enter' && canAnalyze && analyze()}
            />
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
            <Button onClick={()=> analyze()} disabled={!canAnalyze}>
              {loading ? "Analyzing…" : "Analyze"}
            </Button>
          </div>
          {err && <div className="mt-2.5 text-red-700 font-semibold">Error: {err}</div>}
           {data?.cacheHit && <div className="mt-2.5 text-sm font-semibold text-amber-600">Result loaded from cache.</div>}
        </Card>

        {/* Visualization & Results */}
        <TwoRailsWithConsonants
          word={analysis?.word || word}
          path={(analysis?.primary?.voice_path as Vowel[]) || []}
          running={loading}
          playKey={`${analysis?.word}|${(analysis?.primary?.voice_path || []).join("")}`}
          height={320}
          durationPerHopMs={900}
        />
        
        {analysis ? (
          <>
            <ResultsDisplay analysis={analysis} />
            {data?.languageFamilies && <Candidates map={data.languageFamilies} />}
          </>
        ) : (
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>How to Use</AccordionTrigger>
              <AccordionContent>
                <Card className="p-5">
                  <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                    <li>Type a word and click <kbd className="border border-b-2 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs">Analyze</kbd>.</li>
                    <li>Use the dropdown to force a specific phonetic profile, or leave on "Auto-Detect".</li>
                    <li>Primary block shows Voice / Level / Ring paths and checksums <span className="font-code">V/E/C</span>.</li>
                    <li>Frontier lists near‑optimal alternates (deterministic order).</li>
                    <li>If mapping is enabled server‑side, language candidates appear below.</li>
                  </ol>
                </Card>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Consonant Reference</AccordionTrigger>
              <AccordionContent>
                <ConsonantReference />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Debug view */}
        {showDebug && data && (
          <div className="my-4">
              <Card className="p-4">
                  <h3 className="font-bold text-sm tracking-wide">API Echo (debug)</h3>
                  <pre className="font-code text-xs whitespace-pre-wrap bg-slate-50 p-2.5 rounded-lg max-h-96 overflow-auto mt-2">
                      {JSON.stringify(data, null, 2)}
                  </pre>
              </Card>
          </div>
        )}

      </main>

      {/* History */}
      <aside className="space-y-3 pt-20">
          <div className="font-semibold">History</div>
          <Card className="p-2">
            {history.length === 0 && <div className="text-xs text-slate-500 p-2">History will appear here.</div>}
            <ul className="space-y-1 text-sm">
              {history.map((h: HistoryItem) => (
                <li key={h.id}>
                  <button
                    className="w-full text-left border rounded px-2 py-1 hover:bg-slate-50 flex items-center justify-between"
                    onClick={() => {
                      setWord(h.word);
                      setMode(h.mode as "strict"|"open");
                      setAlphabet(h.alphabet as Alphabet);
                      analyze(h.word, h.mode as "strict"|"open", h.alphabet as Alphabet);
                    }}
                  >
                    <span>{h.word} <span className="text-slate-500">· {h.mode}</span></span>
                     <a
                      className="underline text-xs hover:text-primary"
                      href={`/?word=${encodeURIComponent(h.word)}&mode=${h.mode}&alphabet=${h.alphabet}`}
                      onClick={(e) => e.stopPropagation()} // prevent re-analyzing when clicking share
                    >
                      Share
                    </a>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
      </aside>

      {/* Footer */}
      <footer className="p-6 opacity-80 col-span-1 lg:col-span-2">
        <div className="max-w-5xl mx-auto text-xs text-slate-500 flex justify-between">
          <div className="font-code">{signals}</div>
          <Button variant="secondary" size="sm" onClick={() => setShowDebug(s => !s)}>
            {showDebug ? "Hide" : "Show"} Debug
          </Button>
        </div>
      </footer>
    </div>
  );
}
