'use client';

import React, { useMemo, useState, useEffect } from "react";
import { analyzeWordAction } from './actions';
import { useToast } from "@/hooks/use-toast";

// ==== Design tokens (from spec) =============================================
const COLORS = {
  primary: "#3F51B5",   // Deep Indigo
  bg: "#EEEEEE",        // Light Grey
  accent: "#FFB300",    // Soft Amber
  text: "#111827"
};

// Seven‑Voices palette (kept from engine conventions)
const VOICE_COLOR: Record<string, string> = {
  A: "#ef4444",   // red
  E: "#f59e0b",   // orange
  I: "#facc15",   // yellow
  O: "#22c55e",   // green
  U: "#3b82f6",   // blue
  Y: "#6366f1",   // indigo
  "Ë": "#a855f7"   // violet
};

// Level labels
const LEVEL_LABEL: Record<number, string> = { 1: "High", 0: "Mid", [-1]: "Low" } as any;

// ==== Fonts (Space Grotesk, Inter, Source Code Pro) ==========================
const FontImports = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@600;700&family=Source+Code+Pro:wght@400;600&display=swap');
    :root { --c-primary: ${COLORS.primary}; --c-bg: ${COLORS.bg}; --c-accent: ${COLORS.accent}; --c-text: ${COLORS.text}; }
    html, body, #root { height: 100%; background: var(--c-bg); }
    body { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; color: var(--c-text); }
    .headline { font-family: 'Space Grotesk', Inter, system-ui; }
    .code { font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
    .btn { background: var(--c-primary); color: #fff; border: none; border-radius: 10px; padding: 10px 14px; font-weight: 600; cursor: pointer; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .chip { display:inline-flex; align-items:center; gap:6px; padding:4px 8px; border-radius:999px; border:1px solid #e5e7eb; background:#fff; }
    .chip-dot { width:10px; height:10px; border-radius:999px; display:inline-block; }
    .section-title { font-weight:700; margin: 0 0 8px 0; font-size: 14px; letter-spacing: .02em; }
    .hr { height:1px; background:#e5e7eb; margin: 14px 0; }
    .kbd { border:1px solid #cbd5e1; border-bottom-width:2px; padding:2px 6px; border-radius:6px; background:#f8fafc; font-size:12px; }
  `}</style>
);

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
    <span className="chip" style={{ borderColor: COLORS.accent }}>
      <span className="chip-dot" style={{ background: VOICE_COLOR[v] || COLORS.primary }} />
      <span style={{ fontWeight: 700 }}>{v}</span>
    </span>
  );
}

function PathRow({block, title}:{block:PathBlock; title:string}){
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="section-title">{title}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
        {block.voice_path.map((v,i)=> (
          <React.Fragment key={i}>
            <Chip v={v} />
            {i < block.voice_path.length-1 && <span style={{ color: COLORS.accent, fontWeight:700 }}>→</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 10, display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        <InfoLine label="Voice Path" value={joinPath(block.voice_path)} />
        <InfoLine label="Level Path" value={labelLevels(block.level_path)} />
        <InfoLine label="Ring Path" value={labelRings(block.ring_path)} />
        <InfoLine label="Checksums" value={`V=${block.checksums.V} · E=${block.checksums.E} · C=${block.checksums.C}`} mono />
        {typeof block.kept === "number" ? <InfoLine label="Keeps" value={String(block.kept)} /> : null}
      </div>
      {block.ops?.length ? (
        <div style={{ marginTop: 10 }}>
          <div className="section-title">Ops</div>
          <div className="code" style={{ fontSize: 12, whiteSpace:"pre-wrap" }}>{block.ops.join("; ")}</div>
        </div>
      ) : null}
    </div>
  );
}

function InfoLine({label, value, mono}:{label:string; value:string; mono?:boolean}){
  return (
    <div className="card" style={{ padding: 10, display:"flex", flexDirection:"column", gap:4 }}>
      <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
      <span className={mono?"code":""} style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function Candidates({map}:{map: AnalyzeResponse["languageFamilies"]}){
    const [isOpen, setIsOpen] = useState(true);
    if (!map || Object.keys(map).length===0) return null;
    
    return (
        <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="section-title">Language Candidate Mapping (Gemini 2.5)</div>
                <button className="btn" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => setIsOpen(o => !o)}>
                    {isOpen ? "Minimize" : "Maximize"}
                </button>
            </div>

            {isOpen && (
                <div style={{ marginTop: '8px' }}>
                    {Object.entries(map).map(([family, arr])=> (
                        <div key={family} style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 6 }}>{family}</div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap: 10 }}>
                            {(arr || []).map((c, i)=> (
                            <div key={i} className="card" style={{ padding: 10, borderColor: COLORS.primary }}>
                                <div style={{ fontWeight: 700 }}>{c.form}</div>
                                <div className="code" style={{ fontSize: 12, marginTop: 6 }}>map: {c.map ? c.map.join(" · ") : ''}</div>
                                <div style={{ fontSize: 12, marginTop: 6, color: "#374151" }}>{c.functional}</div>
                            </div>
                            ))}
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==== History Panel ===========================================================
function HistoryPanel({ items, onRerun, onClear }:{ items: HistItem[]; onRerun:(w:string, m:"strict"|"open")=>void; onClear:()=>void }){
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  if (!isClient) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div className="section-title">History (local)</div>
          <button className="btn" style={{ background: "#6b7280" }} onClick={onClear} disabled>Clear</button>
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>Loading history...</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div className="section-title">History (local)</div>
        <button className="btn" style={{ background: "#6b7280" }} onClick={onClear} disabled={!items.length}>Clear</button>
      </div>
      {items.length === 0 ? (
        <div style={{ fontSize: 12, color: "#6b7280" }}>No history yet. Run an analysis to add entries.</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap: 10, marginTop: 10 }}>
          {items.map((it, i)=> (
            <div key={i} className="card" style={{ padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{it.word} <span style={{ fontWeight:400, color:'#6b7280' }}>· {it.mode}</span></div>
              <div style={{ marginTop: 6, display:'flex', flexWrap:'wrap', gap:6, alignItems:'center' }}>
                {it.primary.map((v, j)=> (
                  <React.Fragment key={j}>
                    <span className="chip"><span className="chip-dot" style={{ background: VOICE_COLOR[v] || COLORS.primary }} />{v}</span>
                    {j < it.primary.length-1 && <span style={{ color: COLORS.accent, fontWeight:700 }}>→</span>}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ fontSize: 11, color:'#6b7280', marginTop:6 }}>{new Date(it.at).toLocaleString()}</div>
              <div style={{ marginTop: 8 }}>
                <button className="btn" onClick={()=> onRerun(it.word, it.mode)}>Re‑analyze</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
      <FontImports />
      {/* Header */}
      <div style={{ padding: 24, borderBottom: `3px solid ${COLORS.primary}`, background: "#fff" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="headline" style={{ fontSize: 28, fontWeight: 700, letterSpacing: ".01em", color: COLORS.primary }}>Linguistic Decoder</div>
          <div style={{ fontSize: 13, color: "#4b5563", marginTop: 4 }}>Seven‑Voices matrix solver · primary & frontier paths · optional Gemini mapping</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ maxWidth: 1080, margin: "18px auto", padding: "0 16px" }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap: 10, alignItems:"center" }}>
            <input
              value={word}
              onChange={e=> setWord(e.target.value)}
              placeholder="Type a word…"
              style={{ width:"100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #d1d5db", outlineColor: COLORS.accent, fontWeight:600 }}
            />
            <label style={{ display:"flex", alignItems:"center", gap: 8, fontSize: 13 }}>
              <input type="checkbox" checked={mode==="strict"} onChange={e=> setMode(e.target.checked?"strict":"open")} />
              Strict
            </label>
            <button className="btn" onClick={()=> analyze()} disabled={!canAnalyze}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
          {err && <div style={{ marginTop: 10, color: "#b91c1c", fontWeight: 600 }}>Error: {err}</div>}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px", display:"grid", gridTemplateColumns:"1fr", gap: 16 }}>
        {primary && analysis ? (
          <>
            <PathRow block={primary} title="Primary Path" />
            {frontierList.length ? (
              <div className="card" style={{ padding: 16 }}>
                <div className="section-title">Frontier (near‑optimal alternates)</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                  {frontierList.map((f, idx)=> (
                    <div key={idx} className="card" style={{ padding: 12, borderColor: COLORS.accent }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>Alt #{idx+1}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                        {f.voice_path.map((v,i)=> (
                          <React.Fragment key={i}>
                            <Chip v={v} />
                            {i < f.voice_path.length-1 && <span style={{ color: COLORS.accent, fontWeight:700 }}>→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="hr" />
                      <div className="code" style={{ fontSize: 12 }}>V={f.checksums.V} · E={f.checksums.E} · C={f.checksums.C}</div>
                      <div className="code" style={{ fontSize: 12, marginTop: 4 }}>Keeps: {typeof f.kept === "number" ? f.kept : "—"}</div>
                      <div style={{ fontSize: 12, marginTop: 6, color: "#6b7280" }}>Levels: {labelLevels(f.level_path)}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>Rings: {labelRings(f.ring_path)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Candidate mapping (if backend enabled) */}
            {data?.languageFamilies && <Candidates map={data.languageFamilies} />}

          </>
        ) : (
          <div className="card" style={{ padding: 20 }}>
            <div className="section-title">How to use</div>
            <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>Type a word and click <span className="kbd">Analyze</span>.</li>
              <li>Primary block shows Voice / Level / Ring paths and checksums <span className="code">V/E/C</span>.</li>
              <li>Frontier lists near‑optimal alternates (deterministic order).</li>
              <li>If mapping is enabled server‑side, language candidates appear below.</li>
            </ol>
          </div>
        )}
      </div>

      {/* History */}
      <div style={{ maxWidth: 1080, margin: "16px auto", padding: "0 16px" }}>
        <HistoryPanel
          items={history}
          onRerun={(w, m) => analyze(w, m)}
          onClear={() => { clearHist(); setHistory([]); }}
        />
      </div>

      {/* Debug view */}
      {showDebug && data && (
        <div style={{ maxWidth: 1080, margin: "16px auto", padding: "0 16px" }}>
            <div className="card" style={{ padding: 16 }}>
                <div className="section-title">API Echo (debug)</div>
                <pre className="code" style={{ fontSize: 11, whiteSpace:"pre-wrap", background:"#f9fafb", padding:10, borderRadius:8, maxHeight:400, overflow:"auto" }}>
                    {orderedStringify(data)}
                </pre>
            </div>
        </div>
      )}


      {/* Footer */}
      <div style={{ padding: 24, opacity: 0.8 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", fontSize: 12, color: "#6b7280", display: 'flex', justifyContent: 'space-between' }}>
          <div><b>Style:</b> Deep Indigo primary · Light Grey background · Soft Amber accents · Fonts: Space Grotesk / Inter / Source Code Pro</div>
          <button className="btn" style={{ background: "#6b7280", padding: "4px 10px", fontSize: 12 }} onClick={() => setShowDebug(s => !s)}>
            {showDebug ? "Hide" : "Show"} Debug
          </button>
        </div>
      </div>
    </div>
  );
}
