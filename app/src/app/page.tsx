
'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ConsonantReference } from "@/components/ConsonantReference";
import { TwoRailsWithConsonants } from "@/components/TwoRailsWithConsonants";
import { analyzeClient } from "@/lib/analyzeClient";
import type { Alphabet } from "@/lib/runAnalysis";
import { PROFILES } from "@/functions/languages";
import { ThemeToggle } from "@/components/ThemeProvider";
import { useDebounced } from "@/hooks/useDebounced";
import { Loader2, Sparkles, Wand2, HelpCircle, GitBranch, BookOpen, History as HistoryIcon, ListChecks } from "lucide-react";
import { ComparePanel } from "@/components/ComparePanel";
import { normalizeEnginePayload, type Vowel, type EnginePayload, type AnalysisResult_DEPRECATED } from "@/shared/engineShape";
import { enginePayloadToAnalysisResult, analysisResultToEnginePayload } from "@/shared/analysisAdapter";
import { HistoryPanel } from "@/components/HistoryPanel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FooterBuild from "@/components/FooterBuild";
import { allowAnalyze } from "@/lib/throttle";
import { ExportJsonButton } from "@/components/ExportJsonButton";
import { logError } from "@/lib/logError";
import { VOICE_COLOR_MAP, VOICE_LABEL_MAP } from "@/shared/voiceColors";
import { HeartCalculator } from "@/components/HeartCalculator";
import type { HistoryEntry } from "@/shared/history";
import ZeroPanel from "@/components/ZeroPanel";

const VOICE_META: { id: Vowel; label: string; role: string }[] = [
  { id: "A", label: "Action / Truth", role: "Launches, cuts through, sets the first line." },
  { id: "E", label: "Expansion / Bridge", role: "Opens, connects, stretches what A starts." },
  { id: "I", label: "Insight / Measure", role: "Focuses, measures, makes a clear line of thought." },
  { id: "O", label: "Balance / Heart", role: "Holds the center, mediates between high and low." },
  { id: "U", label: "Unity / Breath", role: "Carries the flow, breath and movement through the word." },
  { id: "Y", label: "Network / Weave", role: "Loops, branches, weaves paths across the matrix." },
  { id: "Ë", label: "Evolution / Unit", role: "Closes the cycle, the ‘done’ state." },
];

type HeartSnapshot = {
  word: string;
  state: string | null;
  principlesPath: string[] | null;
};

let EvalPanelComp: React.ComponentType | null = null;
if (process.env.NEXT_PUBLIC_DEV_EVAL === "1") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  EvalPanelComp = require("@/components/EvalPanel").default;
}

// ==== Main App ===============================================================
export default function LinguisticDecoderApp() {
  const { toast } = useToast();
  const [word, setWord] = useState("");
  const [mode, setMode] = useState<"strict" | "open">("strict");
  const [alphabet, setAlphabet] = useState<Alphabet>("auto");
  const [edgeWeight, setEdgeWeight] = useState(0.25);
  const [data, setData] = useState<EnginePayload | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWarming, setIsWarming] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [useAi, setUseAi] = useState(false);

  // 🔹 New: keep a short “recent hearts” history
  const [heartHistory, setHeartHistory] = useState<HeartSnapshot[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Debounce user input, then warm the cache in the background
  const debouncedWord = useDebounced(word, 450); // currently unused, fine

  const canAnalyze = word.trim().length > 0 && !loading;

  const analysisResult = useMemo(() => {
    if (!data) return null;
    return enginePayloadToAnalysisResult(data);
  }, [data]);
  
  useEffect(() => {
    if (analysisResult) {
      const newEntry: HistoryEntry = {
        id: `${analysisResult.core.word}-${new Date().getTime()}`,
        word: analysisResult.core.word,
        result: analysisResult,
        createdAt: new Date().toISOString(),
      };
      setHistory(prev => {
        const filtered = prev.filter(h => h.word.toLowerCase() !== newEntry.word.toLowerCase());
        return [newEntry, ...filtered].slice(0, 20);
      });
    }
  }, [analysisResult]);

  // Optional fields from EnginePayload (solveMs, cacheHit, recomputed, etc.)
  const solveMs = (data as any)?.solveMs as number | undefined;

  const math7: any = (analysisResult as any)?.math7 || null;
  
  // 🔹 Whenever we get a fresh analysis with math7, update the heart history
  useEffect(() => {
    if (!analysisResult || !data) return;

    const math7: any = (analysisResult as any).math7;
    const primary = math7?.primary;
    if (!primary) return;

    setHeartHistory((prev) => {
      // avoid duplicates for the same word
      const filtered = prev.filter((h) => h.word !== data.word);

      const snapshot: HeartSnapshot = {
        word: data.word,
        state: primary.cycleState ?? null,
        principlesPath: primary.principlesPath ?? null,
      };

      // newest first, keep last 5
      return [snapshot, ...filtered].slice(0, 5);
    });
  }, [analysisResult, data?.word]);

  async function analyze(nextWord?: string, nextMode?: "strict" | "open", nextAlphabet?: Alphabet) {
    if (!allowAnalyze()) {
      toast({ variant: "destructive", title: "Too many requests", description: "Please try again in a few moments." });
      return;
    }
    const useWord = (nextWord ?? word).trim();
    const useMode: "strict" | "open" = nextMode ?? mode;
    const useAlphabet = nextAlphabet ?? alphabet;
    if (!useWord) return;

    setLoading(true);
    setErr(null);
    // 🔥 do NOT clear data here – keep previous result while new one is computing

    try {
      const clientResponse = await analyzeClient(useWord, useMode, useAlphabet, { edgeWeight, useAi });
      console.log("API result:", clientResponse);

      setData(clientResponse);
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
      primaryPath: { voicePath: ["O", "E"], ringPath: [0, 2], levelPath: [0, 1], ops: [], checksums: { V: 0, E: 0, C: 0 }, kept: 0 },
      frontierPaths: [],
      windows: [],
      windowClasses: [],
      signals: [],
    };
    try {
      const normalized = normalizeEnginePayload(mock);
      setData(normalized);
      setErr(null);
      toast({ title: "Smoke Test", description: "Displaying mock data." });
    } catch (e: any) {
      setErr(`Smoke test failed: ${e.message}`);
      setData(null);
    }
  }

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const w = p.get("word");
    const m = p.get("mode") as "strict" | "open" | null;
    const a = p.get("alphabet") as Alphabet | null;
    if (w) {
      const currentWord = w;
      const currentMode = m || "strict";
      const currentAlphabet = a || "auto";
      setWord(currentWord);
      setMode(currentMode);
      setAlphabet(currentAlphabet);
      analyze(currentWord, currentMode, currentAlphabet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectHistory(entry: HistoryEntry) {
    const payload = analysisResultToEnginePayload(entry.result);
    if (payload) {
      setData({ ...payload, cacheHit: true });
      toast({
        title: "Loaded from History",
        description: `Analysis for '${payload.word}' loaded.`,
      });
    }
  }

  const alphabetLabel =
    alphabet === "auto"
      ? "Auto-Detect"
      : alphabet.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Safe key for the Analysis Results card (avoids 'data is possibly null')
  const analysisCardKey =
    data != null ? `${data.word}-${data.mode}-${data.alphabet}` : `analysis-${mode}-${alphabet}`;
    
  const calculatorExprA = (analysisResult?.core.primaryPath.voicePath ?? "").replace(/[^AEIOUYË1-7]/gi, "");
  
  const coreHeart = analysisResult?.math7?.heart;
  const coreId =
    coreHeart
      ? `${coreHeart.principle} (${coreHeart.decimal} / ${coreHeart.base7.join(
          " "
        )} / ${coreHeart.voices.join(" → ")})`
      : "—";

  return (
    <div className="min-h-screen bg-background text-foreground p-4 lg:p-8 flex flex-col items-stretch transition-colors duration-300">
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
              {data && (
                <p className="text-xs text-muted-foreground/80">
                  <span className="font-code">engine={data?.engineVersion}</span>
                  <span className="mx-2">·</span>
                  <span className="font-code">mode={data?.mode}</span>
                  <span className="mx-2">·</span>
                  <span className="font-code">alphabet={data?.alphabet}</span>
                </p>
              )}
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

              <span className="inline-flex items-center gap-1">
                <span className="font-semibold">Profile:</span> {alphabetLabel}
              </span>

              <span className="inline-flex items-center gap-1">
                <span className="font-semibold">Mode:</span>
                <span className="px-1.5 py-0.5 rounded-full border border-border/60 bg-muted/60 uppercase tracking-wide">
                  {data.mode}
                </span>
              </span>

              {useAi && (
                <span className="px-1.5 py-0.5 rounded-full border border-accent/60 bg-accent/10 text-accent-foreground inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Mapper
                </span>
              )}

              {solveMs !== undefined && (
                <span>
                  <span className="font-semibold">Solve:</span> {solveMs} ms
                </span>
              )}

              {(data as any).cacheHit && (
                <span className="px-1.5 py-0.5 rounded-full border border-accent/60 text-accent-foreground bg-accent/10">
                  cache hit
                </span>
              )}

              {(data as any).recomputed && (
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

        {/* Recent hearts strip */}
        {heartHistory.length > 0 && (
          <section className="mt-1 text-[11px] text-muted-foreground flex flex-wrap items-center gap-1">
            <span className="uppercase tracking-wide font-semibold text-[10px] text-primary/80">
              Recent hearts:
            </span>
            {heartHistory.map((h) => (
              <button
                key={h.word}
                type="button"
                onClick={() => {
                  setWord(h.word);
                  analyze(h.word);
                }}
                className="px-1.5 py-0.5 rounded-full border border-border/60 bg-muted/50 hover:bg-accent/20 hover:border-accent/70 transition text-[10px] font-medium"
              >
                <span className="font-semibold mr-1">{h.word}</span>
                {h.state && <span className="opacity-80">· {h.state}</span>}
                {h.principlesPath && h.principlesPath.length > 0 && (
                  <span className="opacity-80">
                    {" "}
                    · {h.principlesPath.join(" → ")}
                  </span>
                )}
              </button>
            ))}
          </section>
        )}

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
            <div className="min-h-[20px]">
              {isWarming && !loading && (
                <p className="text-xs text-muted-foreground flex items-center gap-2 animate-fade-in">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Precomputing in the background…
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); if (canAnalyze) analyze(); }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Type a word…"
                className="font-semibold text-lg flex-1"
                autoFocus={!word}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
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
                  type="button"
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
            </form>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="opacity-80">Try:</span>
              {["study", "language", "damage", "mathematics"].map((example) => {
                const isActive =
                  word.trim().toLowerCase() === example.toLowerCase() ||
                  data?.word?.toLowerCase() === example.toLowerCase();

                return (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setWord(example);
                      analyze(example);
                    }}
                    className={`px-2 py-1 rounded-full border border-border/60 hover:bg-accent/40 hover:border-accent/80 transition text-xs font-medium
                      ${isActive ? "bg-accent/30 border-accent/80" : ""}`}
                  >
                    {example}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 items-center pt-2">
              <div className="space-y-3">
                <Select value={alphabet} onValueChange={(v) => setAlphabet(v as Alphabet)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Language Profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-Detect Profile</SelectItem>
                    {PROFILES.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-4">
                  <label className="text-xs text-muted-foreground">Edge: {edgeWeight.toFixed(2)}</label>
                  <input
                    type="range"
                    min={0}
                    max={0.6}
                    step={0.05}
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-start md:justify-end sm:items-center sm:gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={mode === "strict"}
                    onChange={(e) => setMode(e.target.checked ? "strict" : "open")}
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
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-accent-foreground" />
                    AI Mapper
                  </span>
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
                  path={loading ? [] : data?.primaryPath?.voicePath || []}
                  running={loading}
                  playKey={`${data?.word || ""}|${data?.primaryPath?.voicePath?.join(",") || ""}`}
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
              {analysisResult && data && (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-xs text-muted-foreground">
                    <p>
                      <strong>Word:</strong> {data.word}
                    </p>
                    <p>
                      <strong>Mode:</strong> {data.mode}
                    </p>
                    <p>
                      <strong>Alphabet:</strong> {data.alphabet}
                    </p>
                    <p><strong>Core ID:</strong> {coreId}</p>
                    {solveMs !== undefined && (
                      <p>
                        <strong>Solve Time:</strong> {solveMs} ms
                      </p>
                    )}
                    {(data as any).cacheHit && (
                      <p className="font-bold text-accent-foreground pt-1">Loaded from cache</p>
                    )}
                    {(data as any).recomputed && (
                      <p className="font-bold text-blue-400 pt-1">Recomputed</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {data && analysisResult && (
            <Card
              key={analysisCardKey}
              className="animate-fade-in"
            >
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Primary and frontier paths, principles, and language candidates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResultsDisplay analysis={analysisResult} />
                <div className="flex justify-end pt-2">
                  <ExportJsonButton analysis={data} />
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <section className="mt-12">
          <ZeroPanel />
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
          <AccordionItem value="compare">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span>Compare Two Words</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ComparePanel history={history} />
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
          
          <AccordionItem value="item-heart-calculator">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-lg">💗</span>
                <span>Seven-Principles Calculator</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <HeartCalculator />
            </AccordionContent>
          </AccordionItem>


          {/* History */}
          <AccordionItem value="history">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-muted-foreground" />
                <span>History</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <HistoryPanel history={history} onSelect={handleSelectHistory} />
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
                {analysisResult ? JSON.stringify(analysisResultToEnginePayload(analysisResult), null, 2) : ""}
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
                  {solveMs !== undefined && <span className="mr-2">solveMs={solveMs}</span>}
                  {(data as any).cacheHit && (
                    <span className="mr-2 px-1.5 py-0.5 rounded bg-accent/20 border border-accent text-accent-foreground">
                      cacheHit
                    </span>
                  )}
                  {(data as any).recomputed && (
                    <span className="mr-2 px-1.5 py-0.5 rounded bg-blue-900 border border-blue-700">
                      recomputed
                    </span>
                  )}
                </div>
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
            <Button variant="outline" size="sm" onClick={() => setShowDebug((s) => !s)}>
              {showDebug ? "Hide JSON" : "Show JSON"}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
