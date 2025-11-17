
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "../hooks/use-toast";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Candidates } from "../components/Candidates";
import { ResultsDisplay, PrinciplesBlock } from "../components/ResultsDisplay";
import { ConsonantReference } from "../components/ConsonantReference";
import { TwoRailsWithConsonants } from "../components/TwoRailsWithConsonants";
import { analyzeClient } from "../lib/analyzeClient";
import type { Alphabet } from "../lib/runAnalysis";
import { PROFILES } from "../functions/languages";
import { ThemeToggle } from "../components/ThemeProvider";
import { useDebounced } from "../hooks/useDebounced";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import ComparePanel from "../components/ComparePanel";
import { normalizeEnginePayload, type EnginePayload, type Vowel } from "../shared/engineShape";
import HistoryPanel from "../components/HistoryPanel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import FooterBuild from "../components/FooterBuild";
import { allowAnalyze } from "../lib/throttle";
import WhyThisPath from "../components/WhyThisPath";
import { ExportJsonButton } from "../components/ExportJsonButton";
import { logError } from "../lib/logError";

let EvalPanelComp: React.ComponentType | null = null;
if (process.env.NEXT_PUBLIC_DEV_EVAL === "1") {
  EvalPanelComp = require("../components/EvalPanel").default;
}


// A map for displaying the Seven Voices colors, consistent with the visualization.
const VOICE_COLOR_MAP: Record<Vowel, string> = {
  A: "#EF4444", E: "#F59E0B", I: "#EAB308",
  O: "#10B981", U: "#3B82F6", Y: "#6366F1", "Ë": "#8B5CF6",
};

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
  const [useAi, setUseAi] = useState(false);

  // Debounce user input, then warm the cache in the background
  const debouncedWord = useDebounced(word, 450);
  useEffect(() => {
    // This is a pre-fetch, so we don't handle errors here.
    // analyzeClient is designed to be robust.
    if (debouncedWord.trim()) {
      analyzeClient(debouncedWord.trim(), mode, alphabet, { edgeWeight, useAi }).catch(() => {/* prefetch failed, do nothing */});
    }
  }, [debouncedWord, mode, alphabet, edgeWeight, useAi]);
  

  const canAnalyze = word.trim().length > 0 && !loading;

  async function analyze(nextWord?: string, nextMode?: "strict"|"open", nextAlphabet?: Alphabet){
    if (!allowAnalyze()) { 
      toast({ variant: "destructive", title: "Too many requests", description: "Please try again in a few moments." }); 
      return; 
    }
    const useWord = (nextWord ?? word).trim();
    const useMode: "strict"|"open" = nextMode ?? mode;
    const useAlphabet = nextAlphabet ?? alphabet;
    if (!useWord) return;

    setLoading(true);
    setErr(null);
    setData(null);
    try {
      // 1. Get raw result from API or cache
      const clientResponse = await analyzeClient(useWord, useMode, useAlphabet, { edgeWeight, useAi });
      console.log("API result:", clientResponse);

      // 2. GUARANTEE the shape
      const normalizedPayload = normalizeEnginePayload(clientResponse);
      console.debug("Primary Path object:", normalizedPayload.primaryPath);
      
      // 4. Set state with the clean, final payload
      setData(normalizedPayload);

    } catch (e: any) {
      const error = e?.message || "Request failed";
      logError({ where: "analyze", message: error, detail: { word: useWord, stack: e.stack } });
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

  async function onLoadAnalysis(cacheId: string) {
    if (!db) {
        toast({ variant: "destructive", title: "Database Error", description: "Firestore is not available." });
        return;
    }
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
        logError({where: "history-load", message: e.message, detail: {cacheId}});
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
            edgeWeight,
            useAi
          });
          setData(result);
          toast({ title: "Recomputed", description: `Fresh analysis for '${result.word}' complete.` });
      } catch (e: any) {
          logError({where: "history-recompute", message: e.message, detail: {word}});
          toast({ variant: "destructive", title: "Recompute Error", description: e.message || "Failed to recompute analysis." });
          setErr(e.message);
      } finally {
          setLoading(false);
      }
  }

  const signals = data?.signals?.join(" · ") || "";
  
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
       <main className="space-y-6">
        {/* Header */}
        <header className="p-6 border-b bg-card -mx-6 -mt-8 rounded-t-lg">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Linguistic Decoder</h1>
              <p className="text-sm text-muted-foreground mt-1">Seven‑Voices matrix solver · primary & frontier paths · optional Gemini mapping</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Controls */}
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Analyze a word</CardTitle>
                <CardDescription>Type a word, choose analysis options, and run the Seven-Voices solver.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        placeholder="Type a word…"
                        className="font-semibold text-lg flex-1"
                        onKeyUp={(e) => e.key === "Enter" && canAnalyze && analyze()}
                    />
                    <div className="flex gap-2">
                        <Button onClick={() => analyze()} disabled={!canAnalyze} size="lg" className="flex-1 sm:flex-none">
                            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
                            {loading ? "Analyzing…" : "Analyze"}
                        </Button>
                        <Button onClick={runSmokeTest} variant="outline" size="lg" title="Display a mock result to test the UI" className="hidden sm:inline-flex">Smoke</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4 border-t mt-4">
                    <div className="space-y-3">
                        <Select value={alphabet} onValueChange={(v) => setAlphabet(v as Alphabet)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Language Profile" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="auto">Auto-Detect Profile</SelectItem>
                                {PROFILES.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-4">
                            <label className="text-xs text-muted-foreground whitespace-nowrap">Edge: {edgeWeight.toFixed(2)}</label>
                            <input
                                type="range" min={0} max={0.6} step={0.05}
                                value={edgeWeight} onChange={e => setEdgeWeight(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex justify-start md:justify-end items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={mode === "strict"} onChange={e => setMode(e.target.checked ? "strict" : "open")} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                            Strict Mode
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={useAi} onChange={e => setUseAi(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                            <Sparkles className="inline-block w-4 h-4 text-accent-foreground" /> AI Mapper
                        </label>
                    </div>
                </div>

                {err && (
                    <div className="mt-4 border border-red-500/50 bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
                        <b>Error:</b> {err}
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Visualization & Metadata Section */}
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Seven-Voices Path</CardTitle>
                <CardDescription>An animated view of the word’s primary path through the vowel matrix.</CardDescription>
              </CardHeader>
              <CardContent>
                <TwoRailsWithConsonants
                  word={data?.word || word}
                  path={(data?.primaryPath?.voicePath as Vowel[]) || []}
                  running={loading}
                  playKey={`${data?.word}|${(data?.primaryPath?.voicePath || []).join("")}`}
                  height={320}
                  durationPerHopMs={900}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Seven Voices</CardTitle>
                    <CardDescription>The core principles of the matrix.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm font-medium">
                      {Object.entries(VOICE_COLOR_MAP).map(([voice, color]) => (
                        <li key={voice} className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                          <span className="font-bold">{voice}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {data && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs text-muted-foreground">
                        <p><strong>Word:</strong> {data.word}</p>
                        <p><strong>Mode:</strong> {data.mode}</p>
                        <p><strong>Alphabet:</strong> {data.alphabet}</p>
                        {"solveMs" in data && <p><strong>Solve Time:</strong> {data.solveMs} ms</p>}
                        {data.cacheHit && <p className="font-bold text-accent-foreground">Loaded from cache</p>}
                        {data.recomputed && <p className="font-bold text-blue-400">Recomputed</p>}
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>

          {data && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>Primary and frontier paths, principles, and language candidates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResultsDisplay analysis={data} />
                <div className="flex justify-end pt-2">
                  <ExportJsonButton analysis={data} />
                </div>
                <WhyThisPath primary={data.primaryPath} />
                <PrinciplesBlock engine={data} />
                <Candidates items={data.languageFamilies} />
              </CardContent>
            </Card>
          )}
        </section>

        {/* Informational Accordions */}
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
          <AccordionItem value="item-4">
            <AccordionTrigger>History</AccordionTrigger>
            <AccordionContent>
                <HistoryPanel onLoadAnalysis={onLoadAnalysis} onRecompute={onRecompute} />
            </AccordionContent>
          </AccordionItem>
          {EvalPanelComp && (
            <AccordionItem value="item-5">
              <AccordionTrigger>Batch Evaluation</AccordionTrigger>
              <AccordionContent>
                  <EvalPanelComp />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Debug view */}
        {showDebug && data && (
          <div className="my-4">
              <Card className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm tracking-wide">API Echo (debug)</h3>
                  </div>
                  <pre className="font-code text-xs whitespace-pre-wrap bg-slate-800 p-2.5 rounded-lg max-h-96 overflow-auto mt-2">
                      {JSON.stringify(data, null, 2)}
                  </pre>
              </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 opacity-80 mt-8">
        <div className="max-w-7xl mx-auto text-xs text-muted-foreground flex justify-between items-start">
          <div className="font-code flex-1">
            {data && (
              <div className="text-xs opacity-80 pt-2">
                <b>Diagnostics:</b>
                <span className="ml-2">engine={data.engineVersion}</span>
                <span className="ml-2">mode={data.mode}</span>
                <span className="ml-2">alphabet={data.alphabet}</span>
                {"solveMs" in data && <span className="ml-2">solveMs={data.solveMs}</span>}
                {data?.cacheHit && <span className="ml-2 px-1.5 py-0.5 rounded bg-accent/20 border border-accent text-accent-foreground">cacheHit</span>}
                {data?.recomputed && <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-900 border border-blue-700">recomputed</span>}
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
        <FooterBuild />
      </footer>
    </div>
  );
}
