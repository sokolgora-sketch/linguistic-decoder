'use client';

import React, { useMemo, useState, useEffect } from "react";
import { analyzeWordAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Seven‑Voices palette (kept from engine conventions)
const VOICE_COLOR: Record<string, string> = {
  A: "hsl(var(--chart-1))", // red-ish
  E: "hsl(var(--chart-2))", // orange-ish
  I: "hsl(var(--chart-3))", // yellow-ish
  O: "hsl(var(--chart-4))", // green-ish
  U: "hsl(var(--chart-5))", // blue-ish
  Y: "hsl(231 48% 48%)", // indigo-ish (primary)
  "Ë": "hsl(262 80% 50%)"   // violet-ish
};

// Level labels
const LEVEL_LABEL: Record<number, string> = { 1: "High", 0: "Mid", [-1]: "Low" } as any;

// ==== Types matching the /analyzeWord response ===============================
interface Checksums { V: number; E: number; C: number; }
interface PathBlock { voice_path: string[]; ring_path: number[]; level_path: number[]; ops: string[]; checksums: Checksums; kept?: number; deleted?: number; }
interface AnalyzeResponse {
  analysis: {
    engineVersion: string;
    word: string;
    mode: "strict"|"open";
    primary: PathBlock;
    frontier: PathBlock[];
    signals: string[];
  },
  languageFamilies?: Record<string, { form:string; map:string[]; functional:string }[]> | null;
}


// ==== Small helpers ==========================================================
// Local history (stateless backend)
type HistItem = { word: string; mode: "strict" | "open"; primary: string[]; at: number };
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
const joinPath = (p: string[]) => p.join(" → ");
const labelLevels = (levels: number[]) => levels.map(l=> LEVEL_LABEL[l] ?? l).join(" → ");
const labelRings = (rings: number[]) => rings.join(" → ");

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

function Chip({v}:{v:string}){
  return (
    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full border border-accent bg-white">
      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: VOICE_COLOR[v] || 'hsl(var(--primary))' }} />
      <span className="font-bold">{v}</span>
    </span>
  );
}

function PathRow({block, title}:{block:PathBlock; title:string}){
  return (
    <Card className="p-4">
      <h3 className="font-bold text-sm tracking-wide mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2 items-center">
        {block.voice_path.map((v,i)=> (
          <React.Fragment key={i}>
            <Chip v={v} />
            {i < block.voice_path.length-1 && <span className="font-bold text-accent">→</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <InfoLine label="Voice Path" value={joinPath(block.voice_path)} />
        <InfoLine label="Level Path" value={labelLevels(block.level_path)} />
        <InfoLine label="Ring Path" value={labelRings(block.ring_path)} />
        <InfoLine label="Checksums" value={`V=${block.checksums.V} · E=${block.checksums.E} · C=${block.checksums.C}`} mono />
        {typeof block.kept === "number" ? <InfoLine label="Keeps" value={String(block.kept)} /> : null}
      </div>
      {block.ops?.length ? (
        <div className="mt-2.5">
          <h4 className="font-bold text-sm tracking-wide">Ops</h4>
          <div className="font-code text-xs whitespace-pre-wrap">{block.ops.join("; ")}</div>
        </div>
      ) : null}
    </Card>
  );
}

function InfoLine({label, value, mono}:{label:string; value:string; mono?:boolean}){
  return (
    <Card className="p-2.5 flex flex-col gap-1">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`font-semibold ${mono ? "font-code":""}`}>{value}</span>
    </Card>
  );
}

function Candidates({map}:{map: AnalyzeResponse["languageFamilies"]}){
    const [isOpen, setIsOpen] = useState(true);
    if (!map || Object.keys(map).length===0) return null;
    
    return (
        <Card className="p-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm tracking-wide">Language Candidate Mapping (Gemini 2.5)</h3>
                <Button variant="outline" size="sm" onClick={() => setIsOpen(o => !o)}>
                    {isOpen ? "Minimize" : "Maximize"}
                </Button>
            </div>

            {isOpen && (
                <div className="mt-2">
                    {Object.entries(map).map(([family, arr])=> (
                        <div key={family} className="mb-3">
                        <div className="font-bold text-primary mb-1.5">{family}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {(arr || []).filter(Boolean).map((c, i)=> (
                            <Card key={i} className="p-2.5 border-primary">
                                <div className="font-bold">{c.form}</div>
                                <div className="font-code text-xs mt-1.5">map: {c.map ? c.map.join(" · ") : ''}</div>
                                <div className="text-xs mt-1.5 text-slate-700">{c.functional}</div>
                            </Card>
                            ))}
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}

// ==== History Panel ===========================================================
function HistoryPanel({ items, onRerun, onClear }:{ items: HistItem[]; onRerun:(w:string, m:"strict"|"open")=>void; onClear:()=>void }){
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
      setLoading(true); setErr(null);
      const res = await analyzeWordAction({ word: useWord, mode: useMode });

      if (!res.ok) {
        toast({ title: "Error", description: res.error, variant: "destructive" });
        setData(null);
        return;
      }
      const j = res.data;
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
  const primary = analysis?.primary;
  const frontierList = useMemo(() => (analysis?.frontier || []).filter(f => f.voice_path.join("") !== (primary?.voice_path || []).join("")), [analysis, primary]);
  
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
        {primary && analysis ? (
          <>
            <PathRow block={primary} title="Primary Path" />
            {frontierList.length ? (
              <Card className="p-4">
                <h3 className="font-bold text-sm tracking-wide">Frontier (near‑optimal alternates)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {frontierList.map((f, idx)=> (
                    <Card key={idx} className="p-3 border-accent">
                      <div className="font-bold mb-2">Alt #{idx+1}</div>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {f.voice_path.map((v,i)=> (
                          <React.Fragment key={i}>
                            <Chip v={v} />
                            {i < f.voice_path.length-1 && <span className="font-bold text-accent">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <hr className="my-2 border-border" />
                      <div className="font-code text-xs">V={f.checksums.V} · E={f.checksums.E} · C={f.checksums.C}</div>
                      <div className="font-code text-xs mt-1">Keeps: {typeof f.kept === "number" ? f.kept : "—"}</div>
                      <div className="text-xs mt-1.5 text-slate-500">Levels: {labelLevels(f.level_path)}</div>
                      <div className="text-xs text-slate-500">Rings: {labelRings(f.ring_path)}</div>
                    </Card>
                  ))}
                </div>
              </Card>
            ) : null}

            {/* Candidate mapping (if backend enabled) */}
            {data?.languageFamilies && <Candidates map={data.languageFamilies} />}

          </>
        ) : (
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
          onRerun={(w, m) => analyze(w, m)}
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
