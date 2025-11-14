'use client';

import React, { useState, useEffect } from "react";
import { analyzeWordAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Candidates } from "@/components/Candidates";
import { HistoryPanel, type HistItem } from "@/components/HistoryPanel";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { SevenVoicesMatrixLive } from "@/components/SevenVoicesMatrixLive";


// ==== Types matching the /analyzeWord response ===============================
interface Checksums { V: number; E: number; C: number; }
export interface PathBlock { voice_path: string[]; ring_path: number[]; level_path: number[]; ops: string[]; checksums: Checksums; kept?: number; deleted?: number; }
export interface AnalyzeResponse {
  analysis: {
    engineVersion: string;
    word: string;
    mode: "strict"|"open";
    primary: PathBlock;
    frontier: PathBlock[];
    signals: string[];
    trace?: { v: string; level: 1 | 0 | -1; E?: number }[];
  },
  languageFamilies?: Record<string, { form:string; map:string[]; functional:string }[]> | null;
}


// ==== Small helpers ==========================================================
// Local history (stateless backend)
const HIST_KEY = "ld:history:v1";
function readHist(): HistItem[] { try { return JSON.parse(localStorage.getItem(HIST_KEY) || "[]"); } catch { return []; } }
function saveHistItem(item: HistItem, max = 50) {
  try {
    const cur = readHist();
    const key = (x: HistItem) => `${x.word}|${x.mode}|${x.primary.join("")}`;
    const next = [item, ...cur.filter(x => key(x) !== key(item))].slice(0, max);
    localStorage.setItem(HIST_KEY, JSON.stringify(next));
  } catch {}
}
function clearHist() { try { localStorage.removeItem(HIST_KEY); } catch {} }


// Custom stringify to enforce key order for readability
function orderedStringify(obj: any): string {
  if (!obj) return "";
  const keyOrder = ["analysis", "languageFamilies"];
  const allKeys = [...keyOrder, ...Object.keys(obj).filter(k => !keyOrder.includes(k))];
  const orderedObj: Record<string, any> = {};
  for (const key of allKeys) {
    if (obj.hasOwnProperty(key)) {
      orderedObj[key] = obj[key];
    }
  }
  return JSON.stringify(orderedObj, null, 2);
}

// ==== Main App ===============================================================
export default function LinguisticDecoderApp(){
  const { toast } = useToast();
  const [history, setHistory] = useState<HistItem[]>([]);
  useEffect(() => setHistory(readHist()), []);

  const [word, setWord] = useState("damage");
  const [mode, setMode] = useState<"strict"|"open">("strict");
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const canAnalyze = word.trim().length > 0 && !loading;

  async function analyze(nextWord?: string, nextMode?: "strict"|"open"){
    const useWord = (nextWord ?? word).trim();
    const useMode: "strict"|"open" = nextMode ?? mode;
    if (!useWord) return;
    try {
      setData(null); // Clear previous results immediately
      setLoading(true); setErr(null);
      const res = await analyzeWordAction({ word: useWord, mode: useMode });

      if (!res.ok) {
        toast({ title: "Error", description: res.error, variant: "destructive" });
        setData(null);
        return;
      }
      const j = res.data as AnalyzeResponse;
      setData(j);
      // Save local history
      if (j?.analysis.primary?.voice_path) {
        saveHistItem({ word: useWord, mode: useMode, primary: j.analysis.primary.voice_path, at: Date.now() });
        setHistory(readHist());
      }
    } catch (e:any) {
      setErr(e?.message || "Request failed");
      setData(null);
    } finally { setLoading(false); }
  }

  const analysis = data?.analysis;
  
  return (
    <div>
      {/* Header */}
      <header className="p-6 border-b-4 border-primary bg-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-headline text-3xl font-bold tracking-wide text-primary">Linguistic Decoder</h1>
          <p className="text-sm text-slate-600 mt-1">Seven‑Voices matrix solver · primary & frontier paths · optional Gemini mapping</p>
        </div>
      </header>

      {/* Controls */}
      <main className="max-w-5xl mx-auto my-4 p-4">
        <Card className="p-4">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2.5 items-center">
            <Input
              value={word}
              onChange={e=> setWord(e.target.value)}
              placeholder="Type a word…"
              className="font-semibold"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={mode==="strict"} onChange={e=> setMode(e.target.checked?"strict":"open")} className="w-4 h-4 rounded text-primary focus:ring-primary" />
              Strict
            </label>
            <Button onClick={()=> analyze()} disabled={!canAnalyze}>
              {loading ? "Analyzing…" : "Analyze"}
            </Button>
          </div>
          {err && <div className="mt-2.5 text-red-700 font-semibold">Error: {err}</div>}
        </Card>
      </main>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 gap-4">
        {analysis && (
          <SevenVoicesMatrixLive
            word={analysis.word}
            path={analysis.primary.voice_path as any}
            levelPath={analysis.primary.level_path as any}
            playKey={`${analysis.word}|${analysis.primary.voice_path.join("")}|${analysis.primary.level_path.join("")}`}
            running={loading}
            durationMs={1200}
            trace={analysis.trace as any}
          />
        )}
        {analysis ? (
          <>
            <ResultsDisplay analysis={analysis} />
            {data?.languageFamilies && <Candidates map={data.languageFamilies} />}
          </>
        ) : !loading && (
          <Card className="p-5">
            <h3 className="font-bold text-sm tracking-wide">How to use</h3>
            <ol className="list-decimal pl-5 mt-2 space-y-2 text-sm">
              <li>Type a word and click <kbd className="border border-b-2 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs">Analyze</kbd>.</li>
              <li>Primary block shows Voice / Level / Ring paths and checksums <span className="font-code">V/E/C</span>.</li>
              <li>Frontier lists near‑optimal alternates (deterministic order).</li>
              <li>If mapping is enabled server‑side, language candidates appear below.</li>
            </ol>
          </Card>
        )}
      </div>

      {/* History */}
      <div className="max-w-5xl mx-auto my-4 px-4">
        <HistoryPanel
          items={history}
          onRerun={(w, m) => {
            setWord(w);
            setMode(m);
            analyze(w, m);
          }}
          onClear={() => { clearHist(); setHistory([]); }}
        />
      </div>

      {/* Debug view */}
      {showDebug && data && (
        <div className="max-w-5xl mx-auto my-4 px-4">
            <Card className="p-4">
                <h3 className="font-bold text-sm tracking-wide">API Echo (debug)</h3>
                <pre className="font-code text-xs whitespace-pre-wrap bg-slate-50 p-2.5 rounded-lg max-h-96 overflow-auto mt-2">
                    {orderedStringify(data)}
                </pre>
            </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="p-6 opacity-80">
        <div className="max-w-5xl mx-auto text-xs text-slate-500 flex justify-between">
          <div><b>Style:</b> Deep Indigo primary · Light Grey background · Soft Amber accents · Fonts: Space Grotesk / Inter / Source Code Pro</div>
          <Button variant="secondary" size="sm" onClick={() => setShowDebug(s => !s)}>
            {showDebug ? "Hide" : "Show"} Debug
          </Button>
        </div>
      </footer>
    </div>
  );
}
