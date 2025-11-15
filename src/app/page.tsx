
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
import { ResultsDisplay, PrinciplesBlock } from "@/components/ResultsDisplay";
import { ConsonantReference } from "@/components/ConsonantReference";
import { TwoRailsWithConsonants } from "@/components/TwoRailsWithConsonants";
import { analyzeClient } from "@/lib/analyzeClient";
import type { Alphabet } from "@/lib/solver/engineConfig";
import { PROFILES } from "@/functions/languages";
import { ThemeToggle } from "@/components/ThemeProvider";
import { useDebounced } from "@/hooks/useDebounced";
import { Copy, Download, Loader } from "lucide-react";
import ComparePanel from "@/components/ComparePanel";
import { normalizeEnginePayload, type EnginePayload, type Vowel } from "@/shared/engineShape";
import HistoryPanel from "@/components/HistoryPanel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


// ==== Main App ===============================================================
export default function LinguisticDecoderApp(){
  const { toast } = useToast();
  const [word, setWord] = useState("study");
  const [mode, setMode] = useState<"strict"|"open">("strict");
  const [alphabet, setAlphabet] = useState<Alphabet>("auto");
  const [edgeWeight, setEdgeWeight] = useState(0.25);
  const [data, setData] = useState<EnginePayload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWarming, setIsWarming] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Debounce user input, then warm the cache in the background
  const debouncedWord = useDebounced(word, 450);
  useEffect(() => {
    // This is a pre-fetch, so we don't handle errors here.
    // analyzeClient is designed to be robust.
    if (debouncedWord.trim()) {
      analyzeClient(debouncedWord.trim(), mode, alphabet, { edgeWeight }).catch(() => {/* prefetch failed, do nothing */});
    }
  }, [debouncedWord, mode, alphabet, edgeWeight]);
  

  const canAnalyze = word.trim().length > 0 && !loading;

  async function analyze(nextWord?: string, nextMode?: "strict"|"open", nextAlphabet?: Alphabet){
    const useWord = (nextWord ?? word).trim();
    const useMode: "strict"|"open" = nextMode ?? mode;
    const useAlphabet = nextAlphabet ?? alphabet;
    if (!useWord) return;

    setLoading(true);
    setErr(null);
    setData(null);
    try {
      // 1. Get raw result from API or cache
      const clientResponse = await analyzeClient(useWord, useMode, useAlphabet, { edgeWeight });
      console.log("API result:", clientResponse);

      // 2. GUARANTEE the shape
      const normalizedPayload = normalizeEnginePayload(clientResponse);
      console.debug("Primary Path object:", normalizedPayload.primaryPath);
      
      // 4. Set state with the clean, final payload
      setData(normalizedPayload);

    } catch (e: any) {
      const error = e?.message || "Request failed";
      console.error("Analysis chain failed:", e);
      setErr(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function runSmokeTest() {
    const mock: any = {
        engineVersion: "mock-v1",
        word: "smoke-test",
        mode: "strict",
        alphabet: "auto",
        primaryPath: { voicePath: ["U","I"], ringPath: [1,1], levelPath: [-1,1], ops: ["test-op"], kept: 2, checksums: {V:55, E:0, C:2} },
        frontierPaths: [
            { voicePath: ["A","E"], ringPath: [3,2], levelPath: [1,1], ops: [], checksums: {V:6, E:1, C:1}, kept: 0 },
        ],
        windows: ["d"],
        windowClasses: ["Plosive"],
        signals: ["smoke-test-signal"],
        solveMs: 1,
        languageFamilies: [],
    };
    try {
        const normalized = normalizeEnginePayload(mock);
        setData(normalized);
        setErr(null);
        toast({ title: "Smoke Test", description: "Displaying mock data for 'study'." });
    } catch(e:any){
        setErr(`Smoke test failed: ${e.message}`);
        setData(null);
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
    const fn = `${data.word || "analysis"}_${data.mode || "mode"}_${data.alphabet || "auto"}.json`;
    a.download = fn;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function onLoadAnalysis(cacheId: string) {
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const cacheRef = doc(db, "analyses", cacheId);
      const snap = await getDoc(cacheRef);
      if (snap.exists()) {
          const normalized = normalizeEnginePayload(snap.data());
          setData({ ...normalized, cacheHit: true, recomputed: false });
          toast({ title: "Loaded from Cache", description: `Analysis for '${normalized.word}' loaded.` });
      } else {
          toast({ variant: "destructive", title: "Not Found", description: "Could not find that analysis in the cache." });
      }
    } catch (e: any) {
        toast({ variant: "destructive", title: "Load Error", description: e.message || "Failed to load analysis." });
        setErr(e.message);
    } finally {
        setLoading(false);
    }
  }

  async function onRecompute(word: string, m?: string, a?: string) {
      setLoading(true);
      setData(null);
      setErr(null);
      try {
          const result = await analyzeClient(word, (m as any) || mode, (a as any) || alphabet, {
            bypass: true,
            skipWrite: false,
            edgeWeight
          });
          setData(result);
          toast({ title: "Recomputed", description: `Fresh analysis for '${result.word}' complete.` });
      } catch (e: any) {
          toast({ variant: "destructive", title: "Recompute Error", description: e.message || "Failed to recompute analysis." });
          setErr(e.message);
      } finally {
          setLoading(false);
      }
  }

  const signals = data?.signals?.join(" · ") || "";
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
       <main className="lg:col-span-2 space-y-4">
        {/* Header */}
        <header className="p-6 border-b-4 border-primary bg-background -mx-6 -mt-8">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-wide text-primary">Linguistic Decoder</h1>
              <p className="text-sm text-muted-foreground mt-1">Seven‑Voices matrix solver · primary & frontier paths · optional Gemini mapping</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Controls */}
        <Card className="p-4">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2.5 items-center">
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
            <Button onClick={runSmokeTest} variant="outline" title="Display a mock result to test the UI">Smoke Test</Button>
          </div>
          <div className="flex items-center gap-4 mt-3">
              <label className="text-xs text-muted-foreground">Edge weight: {edgeWeight.toFixed(2)}</label>
              <input
                type="range" min={0} max={0.6} step={0.05}
                value={edgeWeight} onChange={e=>setEdgeWeight(Number(e.target.value))}
                className="w-32"
              />
          </div>
          {err && (
            <div className="mt-2.5 border border-red-300 bg-red-50 text-red-800 text-sm p-2 rounded">
              <b>Error:</b> {err}
            </div>
          )}
           {data?.cacheHit && <div className="mt-2.5 text-sm font-semibold text-accent-foreground">Result loaded from cache.</div>}
        </Card>

        {/* Visualization & Results */}
        <TwoRailsWithConsonants
          word={data?.word || word}
          path={(data?.primaryPath?.voicePath as Vowel[]) || []}
          running={loading}
          playKey={`${data?.word}|${(data?.primaryPath?.voicePath || []).join("")}`}
          height={320}
          durationPerHopMs={900}
        />
        
        {data ? (
          <>
            <ResultsDisplay analysis={data} />
            <PrinciplesBlock engine={data} />
            <Candidates items={data.languageFamilies} />
          </>
        ) : null}

        <Accordion type="single" collapsible className="w-full" defaultValue={data ? "" : "item-1"}>
          {!data && (
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

      <aside className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">History</h2>
            <HistoryPanel onLoadAnalysis={onLoadAnalysis} onRecompute={onRecompute} />
          </Card>
      </aside>

      {/* Footer */}
      <footer className="p-6 opacity-80 lg:col-span-3">
        <div className="max-w-7xl mx-auto text-xs text-slate-500 flex justify-between items-start">
          <div className="font-code flex-1">
            {data && (
              <div className="text-xs opacity-80 pt-2">
                <b>Diagnostics:</b>
                <span className="ml-2">engine={data.engineVersion}</span>
                <span className="ml-2">mode={data.mode}</span>
                <span className="ml-2">alphabet={data.alphabet}</span>
                {"solveMs" in data && <span className="ml-2">solveMs={data.solveMs}</span>}
                {data?.cacheHit && <span className="ml-2 px-1.5 py-0.5 rounded bg-accent/20 border border-accent text-accent-foreground">cacheHit</span>}
                {data?.recomputed && <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700">recomputed</span>}
                <div className="mt-1">{signals}</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {data && (
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
