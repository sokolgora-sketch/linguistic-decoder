
'use client';

import React, { useMemo, useState } from "react";
import { analyzeWordAction, type AnalysisState } from '@/app/actions';

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


import type { Path, Analysis } from '@/lib/solver';

interface AnalyzeResponse extends Analysis {
    candidates_map?: Record<string, { form:string; map:string[]; functional:string }[]>;
}

// ==== Small helpers ==========================================================
const joinPath = (p: string[]) => p.join(" → ");
const labelLevels = (levels: number[]) => levels.map(l=> LEVEL_LABEL[l] ?? l).join(" → ");
const labelRings = (rings: number[]) => rings.join(" → ");

function Chip({v}:{v:string}){
  return (
    <span className="chip" style={{ borderColor: COLORS.accent }}>
      <span className="chip-dot" style={{ background: VOICE_COLOR[v] || COLORS.primary }} />
      <span style={{ fontWeight: 700 }}>{v}</span>
    </span>
  );
}

function PathRow({block, title}:{block:Path; title:string}){
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="section-title">{title}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" }}>
        {block.voicePath.map((v,i)=> (
          <React.Fragment key={i}>
            <Chip v={v} />
            {i < block.voicePath.length-1 && <span style={{ color: COLORS.accent, fontWeight:700 }}>→</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 10, display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        <InfoLine label="Voice Path" value={joinPath(block.voicePath)} />
        <InfoLine label="Level Path" value={labelLevels(block.levelPath)} />
        <InfoLine label="Ring Path" value={labelRings(block.ringPath)} />
        <InfoLine label="Checksums" value={`V=${block.checksums[0].value} · E=${block.checksums[1].value} · C=${block.checksums[2].value}`} mono />
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

function Candidates({map}:{map: AnalyzeResponse["candidates_map"]}){
  if (!map || Object.keys(map).length===0) return null;
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="section-title">Language Candidate Mapping (Gemini 2.5)</div>
      {Object.entries(map).map(([family, arr])=> (
        <div key={family} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: COLORS.primary, marginBottom: 6 }}>{family}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap: 10 }}>
            {arr.map((c, i)=> (
              <div key={i} className="card" style={{ padding: 10, borderColor: COLORS.primary }}>
                <div style={{ fontWeight: 700 }}>{c.form}</div>
                <div className="code" style={{ fontSize: 12, marginTop: 6 }}>map: {c.map.join(" · ")}</div>
                <div style={{ fontSize: 12, marginTop: 6, color: "#374151" }}>{c.functional}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==== Main App ===============================================================
export default function LinguisticDecoderApp(){
  const [word, setWord] = useState("damage");
  const [mode, setMode] = useState<"strict"|"open">("strict");
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canAnalyze = word.trim().length > 0 && !loading;

  async function analyze(){
    try {
      setLoading(true); setErr(null);
      const res = await fetch("/api/analyzeWord", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ word: word.trim(), mode })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || "Engine error");

      // The AI flow is optional, but we'll run it as it's a core feature.
      const mappingRes = await fetch('/api/mapWordToLanguageFamilies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: j.word,
          voice_path: j.primaryPath.voicePath,
          ring_path: j.primaryPath.ringPath,
          level_path: j.primaryPath.levelPath,
          ops: j.primaryPath.ops,
          signals: j.signals,
        }),
      });

      let candidates_map;
      if (mappingRes.ok) {
        const mappingData = await mappingRes.json();
        candidates_map = mappingData.candidates_map;
      }

      setData({ ...j, candidates_map });
    } catch (e:any) {
      setErr(e?.message || "Request failed");
      setData(null);
    } finally { setLoading(false); }
  }

  const primary = data?.primaryPath;
  const frontierList = useMemo(() => (data?.frontierPaths || []), [data]);

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
              onKeyDown={(e) => e.key === 'Enter' && canAnalyze && analyze()}
            />
            <label style={{ display:"flex", alignItems:"center", gap: 8, fontSize: 13 }}>
              <input type="checkbox" checked={mode==="strict"} onChange={e=> setMode(e.target.checked?"strict":"open")} />
              Strict
            </label>
            <button className="btn" onClick={analyze} disabled={!canAnalyze}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
          {err && <div style={{ marginTop: 10, color: "#b91c1c", fontWeight: 600 }}>Error: {err}</div>}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 16px", display:"grid", gridTemplateColumns:"1fr", gap: 16 }}>
        {primary ? (
          <>
            <PathRow block={primary} title="Primary Path" />
            {frontierList.length > 0 ? (
              <div className="card" style={{ padding: 16 }}>
                <div className="section-title">Frontier (near‑optimal alternates)</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                  {frontierList.map((f, idx)=> (
                    <div key={idx} className="card" style={{ padding: 12, borderColor: COLORS.accent }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>Alt #{idx+1}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                        {f.voicePath.map((v,i)=> (
                          <React.Fragment key={i}>
                            <Chip v={v} />
                            {i < f.voicePath.length-1 && <span style={{ color: COLORS.accent, fontWeight:700 }}>→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="hr" />
                      <div className="code" style={{ fontSize: 12 }}>V={f.checksums[0].value} · E={f.checksums[1].value} · C={f.checksums[2].value}</div>
                      <div className="code" style={{ fontSize: 12, marginTop: 4 }}>Keeps: {typeof f.kept === "number" ? f.kept : "—"}</div>
                      <div style={{ fontSize: 12, marginTop: 6, color: "#6b7280" }}>Levels: {labelLevels(f.levelPath)}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>Rings: {labelRings(f.ringPath)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Candidate mapping (if backend enabled) */}
            {data?.candidates_map && <Candidates map={data.candidates_map} />}

          </>
        ) : (
          !loading && <div className="card" style={{ padding: 20 }}>
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

      {/* Footer */}
      <div style={{ padding: 24, opacity: 0.8 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", fontSize: 12, color: "#6b7280" }}>
          <b>Style:</b> Deep Indigo primary · Light Grey background · Soft Amber accents · Fonts: Space Grotesk / Inter / Source Code Pro
        </div>
      </div>
    </div>
  );
}

    