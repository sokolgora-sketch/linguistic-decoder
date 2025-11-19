
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
import { Loader2, Sparkles, Wand2, HelpCircle, GitBranch, BookOpen, History as HistoryIcon, ListChecks } from "lucide-react";
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
import { VOICE_COLOR_MAP, VOICE_LABEL_MAP } from "../shared/voiceColors";

const VOICE_META: { id: Vowel; label: string; role: string }[] = [
  { id: "A", label: "Action / Truth", role: "Launches, cuts through, sets the first line." },
  { id: "E", label: "Expansion / Bridge", role: "Opens, connects, stretches what A starts." },
  { id: "I", label: "Insight / Measure", role: "Focuses, measures, makes a clear line of thought." },
  { id: "O", label: "Balance / Heart", role: "Holds the center, mediates between high and low." },
  { id: "U", label: "Unity / Breath", role: "Carries the flow, breath and movement through the word." },
  { id: "Y", label: "Network / Weave", role: "Loops, branches, weaves paths across the matrix." },
  { id: "Ë", label: "Evolution / Unit", role: "Closes the cycle, a formed unit, the ‘done’ state." },
];

let EvalPanelComp: React.ComponentType | null = null;
if (process.env.NEXT_PUBLIC_DEV_EVAL === "1") {
  EvalPanelComp = require("../components/EvalPanel").default;
}

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
    let cancelled = false;

    async function warm() {
      const w = debouncedWord.trim();
      if (!w) {
        if (!cancelled) setIsWarming(false);
        return;
      }
  
      if (!cancelled) setIsWarming(true);
      try {
        // Pre-fetch only; same options, no behavior change.
        await analyzeClient(w, mode, alphabet, { edgeWeight, useAi });
      } catch {
        // ignore prefetch errors
      } finally {
        if (!cancelled) setIsWarming(false);
      }
    }
  
    warm();
  
    return () => {
      cancelled = true;
    };
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
    // ❌ do NOT clear data here — keep the previous analysis on screen
    // setData(null);
    try {
      const clientResponse = await analyzeClient(useWord, useMode, useAlphabet, { edgeWeight, useAi });
      const normalizedPayload = normalizeEnginePayload(clientResponse);
      setData(normalizedPayload);
    } catch (e: any) {
      const error = e?.message || "Request failed";
      logError({ where: "analyze", message: error, detail: { word: useWord, stack: e.stack } });
      setErr(error);
      // optional: you *can* decide whether to clear data on hard error or not.
      // I’d leave the old result:
      // setData(null);
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
    // setData(null);
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
      // setData(null);
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

  const signals = data?.signals ?? [];
  
  const alphabetLabel =
    alphabet === "auto"
      ? "Auto-Detect"
      : alphabet.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-background text-foreground p-4 lg:p-8 flex flex-col items-stretch">
       <main className="max-w-5xl mx-auto w-full space-y-8 flex-1 animate-fade-in">
        {/* Header */}
        <header className="pb-4 border-b border-border/60">
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-1 max-w-xl">
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Linguistic Decoder
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                A tool for analyzing words with the Seven-Voices phonetic model.
              </p>

              {/* Live status chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-0.5 text-[11px] uppercase tracking-wide">
                  <span className="opacity-70 mr-1">Mode:</span>
                  <span className="font-semibold">
                    {mode === "strict" ? "Strict" : "Open"}
                  </span>
                </span>

                <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-0.5 text-[11px] uppercase tracking-wide">
                  <span className="opacity-70 mr-1">Profile:</span>
                  <span className="font-semibold">{alphabetLabel}</span>
                </span>

                {useAi && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/60 bg-accent/10 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-accent-foreground">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-semibold">AI Mapper On</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Status strip */}
        <section className="mt-2 text-[11px] text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
          {data ? (
            <>
              <span className="uppercase tracking-wide font-semibold text-xs text-primary/80">
                Current analysis
              </span>
              <span>
                <span className="font-semibold">Word:</span> {data.word}
              </span>
              <span>
                <span className="font-semibold">Mode:</span> {data.mode}
              </span>
              <span>
                <span className="font-semibold">Alphabet:</span> {data.alphabet}
              </span>
              {"solveMs" in data && (
                <span>
                  <span className="font-semibold">Solve:</span> {data.solveMs} ms
                </span>
              )}
              {data.cacheHit && (
                <span className="px-1.5 py-0.5 rounded-full border border-accent/60 text-accent-foreground bg-accent/10">
                  cache hit
                </span>
              )}
              {data.recomputed && (
                <span className="px-1.5 py-0.5 rounded-full border border-blue-500/60 text-blue-300 bg-blue-500/10">
                  recomputed
                </span>
              )}
            </>
          ) : (
            <span className="text-xs">
              No analysis yet. Type a word below and run the solver to see the Seven-Voices path.
            </span>
          )}
        </section>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Analyze a word</CardTitle>
            <CardDescription>
              Type a word, choose analysis options, and run the Seven-Voices solver.
            </CardDescription>
          </CardHeader>
          <CardContent
            className={`space-y-4 transition-opacity duration-150 ${
              loading ? "opacity-60" : "opacity-100"
            }`}
          >
            {isWarming && !loading && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Precomputing in the background…
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Type a word…"
                className="font-semibold text-lg flex-1"
                onKeyUp={(e) => e.key === "Enter" && canAnalyze && analyze()}
              />
              <div className="flex gap-2 sm:flex-none">
                <Button
                  onClick={() => analyze()}
                  disabled={!canAnalyze}
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  {loading ? "Analyzing…" : "Analyze"}
                </Button>

                <Button
                  onClick={runSmokeTest}
                  variant="outline"
                  size="lg"
                  title="Display a mock result to test the UI"
                  className="hidden sm:inline-flex"
                >
                  Smoke
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() => {
                    setWord("");
                    setData(null);
                    setErr(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="opacity-80">Try:</span>
              {["study", "language", "damage", "mathematics"].map(example => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    setWord(example);
                    analyze(example);
                  }}
                  className="px-2 py-1 rounded-full border border-border/60 hover:bg-accent/40 hover:border-accent/80 transition text-xs font-medium"
                >
                  {example}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div className="space-y-3">
                    <Select value={alphabet} onValueChange={(v) => setAlphabet(v as Alphabet)}>
                        <SelectTrigger>
                        <SelectValue placeholder="Language Profile" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="auto">Auto-Detect Profile</SelectItem>
                        {PROFILES.map(p=>(
                            <SelectItem key={p.id} value={p.id}>{p.id.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-4">
                        <label className="text-xs text-muted-foreground">Edge: {edgeWeight.toFixed(2)}</label>
                        <input
                            type="range" min={0} max={0.6} step={0.05}
                            value={edgeWeight} onChange={e => setEdgeWeight(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

              <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-start md:justify-end sm:items-center sm:gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={mode === "strict"}
                    onChange={e => setMode(e.target.checked ? "strict" : "open")}
                    className="w-4 h-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary"
                    title="Strict = Seven-Voices rules only · Open = allow softer interpretations"
                  />
                  Strict Mode
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useAi}
                    onChange={(e) => setUseAi(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus-visible:ring-2 focus-visible:ring-primary"
                    title="Toggle AI-assisted language family mapping"
                  />
                  <Sparkles className="inline-block w-4 h-4 text-accent-foreground" />
                  AI Mapper
                </label>
              </div>
            </div>

            {err && (
              <div className="mt-2 border border-red-500/50 bg-red-500/10 text-red-400 text-sm p-3 rounded-md">
                <b>Error:</b> {err}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visualization & Metadata Section */}
        <section className="space-y-8">
          <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Seven-Voices Path</CardTitle>
                <CardDescription>An animated view of the word’s primary path through the vowel matrix.</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 space-y-3">
                <TwoRailsWithConsonants
                  word={data?.word || word}
                  path={(data?.primaryPath?.voicePath as Vowel[]) || []}
                  running={loading}
                  playKey={`${data?.word}|${(data?.primaryPath?.voicePath || []).join("")}`}
                  height={320}
                  durationPerHopMs={900}
                />

                {!data && !loading && (
                  <p className="text-xs text-muted-foreground">
                    Run an analysis above to see how this word travels through the Seven-Voices matrix.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>The Seven Voices</CardTitle>
                    <CardDescription>Color, role, and function in the matrix.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {Object.entries(VOICE_COLOR_MAP).map(([voice, color]) => (
                        <li key={voice} className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <div className="flex flex-col leading-tight">
                            <span className="font-bold text-sm">{voice}</span>
                            <span className="text-xs text-muted-foreground">
                              {VOICE_LABEL_MAP[voice as Vowel]}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {data && (
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs text-muted-foreground">
                        <p><strong>Word:</strong> {data.word}</p>
                        <p><strong>Mode:</strong> {data.mode}</p>
                        <p><strong>Alphabet:</strong> {data.alphabet}</p>
                        {"solveMs" in data && <p><strong>Solve Time:</strong> {data.solveMs} ms</p>}
                        {data.cacheHit && <p className="font-bold text-accent-foreground pt-1">Loaded from cache</p>}
                        {data.recomputed && <p className="font-bold text-blue-400 pt-1">Recomputed</p>}
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>

          {data && (
            <Card
              key={`${data.word}-${data.mode}-${data.alphabet}`}
              className="animate-fade-in"
            >
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Primary and frontier paths, principles, and language candidates.
                </CardDescription>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full border border-border/60 bg-muted/40">
                    Mode: {data.mode === "strict" ? "Strict" : "Open"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full border border-border/60">
                    Alphabet: {data.alphabet}
                  </span>
                  {useAi && (
                  <span className="px-2 py-0.5 rounded-full border border-border/60 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Mapper
                  </span>
                  )}
                </div>
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
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={data ? "" : "item-1"}
        >
          {/* How to Use – only when empty state */}
          {!data && (
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  <span>How to Use</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-5">
                  <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm leading-relaxed">
                    <li>
                      Type a word and click{" "}
                      <kbd className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-semibold">
                        Analyze
                      </kbd>
                      .
                    </li>
                    <li>
                      Use the <strong>Language Profile</strong> dropdown to force a
                      specific phonetic profile, or leave it on{" "}
                      <strong>Auto-Detect</strong>.
                    </li>
                    <li>
                      The <strong>Seven-Voices Path</strong> shows the primary vowel path
                      and consonant windows.
                    </li>
                    <li>
                      The <strong>Analysis Results</strong> card breaks down primary and
                      frontier paths, principles, and language candidates.
                    </li>
                    <li>
                      Toggle <strong>AI Mapper</strong> to include language-family
                      mappings when available.
                    </li>
                  </ol>
                </Card>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Compare Two Words */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span>Compare Two Words</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Analyze two words side by side and compare their Seven-Voices paths.
                </p>
                <ComparePanel defaultMode={mode} defaultAlphabet={alphabet} />
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Consonant Reference */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span>Consonant Reference</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  See how consonants behave around the Seven Voices in the matrix.
                </p>
                <ConsonantReference />
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* History */}
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-muted-foreground" />
                <span>History</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Reload or recompute previous analyses from Firestore history.
                </p>
                <HistoryPanel onLoadAnalysis={onLoadAnalysis} onRecompute={onRecompute} />
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Batch Evaluation – dev only */}
          {EvalPanelComp && (
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-muted-foreground" />
                  <span>Batch Evaluation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    Run the engine across a list of words and inspect aggregate behavior.
                  </p>
                  <EvalPanelComp />
                </Card>
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
      <footer className="pt-8 mt-8 border-t border-border/60">
        <div className="max-w-5xl mx-auto w-full text-xs text-muted-foreground flex justify-between items-start gap-4">
          <div className="font-code flex-1 opacity-70 space-y-1">
            {data && (
              <>
                <div>
                  <span className="mr-2">engine={data.engineVersion}</span>
                  <span className="mr-2">mode={data.mode}</span>
                  <span className="mr-2">alphabet={data.alphabet}</span>
                  {"solveMs" in data && <span className="mr-2">solveMs={data.solveMs}</span>}
                  {data?.cacheHit && <span className="mr-2 px-1.5 py-0.5 rounded bg-accent/20 border border-accent text-accent-foreground">cacheHit</span>}
                  {data?.recomputed && <span className="mr-2 px-1.5 py-0.5 rounded bg-blue-900 border border-blue-700">recomputed</span>}
                </div>
                {signals.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {signals.map((sig) => (
                      <span
                        key={sig}
                        className="px-1.5 py-0.5 rounded border border-border/60 bg-muted/40 text-[10px] uppercase tracking-wide"
                      >
                        {sig}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
            <FooterBuild />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {data && (
              <Link
                className="underline text-xs"
                href={`/?word=${encodeURIComponent(word)}&mode=${mode}&alphabet=${alphabet}`}
              >
                Share Result
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

    

    

    

