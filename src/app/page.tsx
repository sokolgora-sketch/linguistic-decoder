
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import { analyzeClient, prefetchAnalyze } from "@/lib/analyzeClient";
import type { Alphabet } from "@/lib/solver/engineConfig";
import { PROFILES } from "@/lib/solver/valueTables";
import { ThemeToggle } from "@/components/ThemeProvider";
import { useDebounced } from "@/hooks/useDebounced";
import { Copy, Download, Loader } from "lucide-react";
import ComparePanel from "@/components/ComparePanel";


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
  const [isWarming, setIsWarming] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Debounce user input, then warm the cache in the background
  const debouncedWord = useDebounced(word, 450);
  useEffect(() => {
    prefetchAnalyze(debouncedWord.trim(), mode, alphabet, {
      onStart: () => setIsWarming(true),
      onFinish: () => setIsWarming(false),
    });
  }, [debouncedWord, mode, alphabet]);

  const canAnalyze = word.trim().length > 0 && !loading;

  async function analyze(nextWord?: string, nextMode?: "strict"|"open", nextAlphabet?: Alphabet){
    const useWord = (nextWord ?? word).trim();
    const useMode: "strict"|"open" = nextMode ?? mode;
    const useAlphabet = nextAlphabet ?? alphabet;
    if (!useWord) return;

    setLoading(true);
    setIsWarming(false);
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

  async function copyJSON() {
    if (!data) return;
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast({ title: "Copied!", description: "Result JSON copied to clipboard." });
  }

  function downloadJSON() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fn = `${data.analysis.word || "analysis"}_${data.analysis.mode || "mode"}_${data.analysis.alphabet || "auto"}.json`;
    a.download = fn;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const analysis = data?.analysis;
  const signals = analysis?.signals?.join(" · ") || "";
  
  return (
    <div className="grid grid-cols-1 gap-6 p-4 lg:p-8 max-w-5xl mx-auto">
      <main className="space-y-4">
        {/* Header */}
        <header className="p-6 border-b-4 border-primary bg-background -mx-6 -mt-8">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-wide text-primary">Linguistic Decoder</h1>
              <p className="text-sm text-muted-foreground mt-1">Seven‑Voices matrix solver · primary & frontier paths · optional Gemini mapping</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button asChild variant="outline">
                  <Link href="/history">View History</Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Controls */}
        <Card className="p-4">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2.5 items-center">
            <Input
              value={word}
              onChange={e=> setWord(e.target.value)}
              placeholder="Type a word…"
              className="font-semibold"
              onKeyUp={(e) => e.key === 'Enter' && canAnalyze && analyze()}
            />
            {isWarming && <Loader className="animate-spin text-muted-foreground" size={18} />}
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
           {data?.cacheHit && <div className="mt-2.5 text-sm font-semibold text-accent-foreground">Result loaded from cache.</div>}
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
        ) : null}

        <Accordion type="single" collapsible className="w-full" defaultValue={analysis ? "" : "item-1"}>
          {!analysis && (
            <AccordionItem value="item-1">
              <AccordionTrigger>How to Use</AccordionTrigger>
              <AccordionContent>
                <Card className="p-5">
                  <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
                    <li>Type a word and click <kbd className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-semibold">Analyze</kbd>.</li>
                    <li>Use the dropdown to force a specific phonetic profile, or leave on "Auto-Detect".</li>
                    <li>Primary block shows Voice / Level / Ring paths and checksums <span className="font-code">V/E/C</span>.</li>
                    <li>Frontier lists near‑optimal alternates (deterministic order).</li>
                    <li>If mapping is enabled server‑side, language candidates appear below.</li>
                  </ol>
                </Card>
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="item-2">
            <AccordionTrigger>Compare Two Words</AccordionTrigger>
            <AccordionContent>
              <ComparePanel defaultMode={mode} defaultAlphabet={alphabet} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Consonant Reference</AccordionTrigger>
            <AccordionContent>
              <ConsonantReference />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Debug view */}
        {showDebug && data && (
          <div className="my-4">
              <Card className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm tracking-wide">API Echo (debug)</h3>
                    <div className="flex gap-2">
                        <Button onClick={copyJSON} size="sm" variant="outline"><Copy className="mr-2"/> Copy</Button>
                        <Button onClick={downloadJSON} size="sm" variant="outline"><Download className="mr-2"/> Download</Button>
                    </div>
                  </div>
                  <pre className="font-code text-xs whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 p-2.5 rounded-lg max-h-96 overflow-auto mt-2">
                      {JSON.stringify(data, null, 2)}
                  </pre>
              </Card>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="p-6 opacity-80 col-span-1">
        <div className="max-w-5xl mx-auto text-xs text-slate-500 flex justify-between">
          <div className="font-code">{signals}</div>
          <div className="flex items-center gap-4">
            {analysis && (
              <Link
                className="underline text-xs"
                href={`/?word=${encodeURIComponent(word)}&mode=${mode}&alphabet=${alphabet}`}
              >
                Share this result
              </Link>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowDebug(s => !s)}>
              {showDebug ? "Hide" : "Show"} Debug
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
