"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Vowel = "A"|"E"|"I"|"O"|"U"|"Y"|"Ë";

const ORDER: Vowel[] = ["A","E","I","O","U","Y","Ë"];
const LEVEL_NAME = { 1: "High", 0: "Mid", "-1": "Low" } as const;
// Layout palette (your spec)
const PALETTE = {
  primary: "#3F51B5",        // Deep Indigo
  bg: "#EEEEEE",             // Light Grey
  accent: "#FFB300",         // Soft Amber
  grid: "rgba(63,81,181,0.15)",
  stroke: "rgba(255,179,0,0.85)",
};
const VOICE_COLOR: Record<Vowel,string> = {
  A:"#ef4444", E:"#f59e0b", I:"#eab308", O:"#10b981",
  U:"#3b82f6", Y:"#6366f1", "Ë":"#8b5cf6"
};

function levelToRow(l: number){ // +1=High, 0=Mid, -1=Low → 0..2 top-down
  return l === 1 ? 0 : l === 0 ? 1 : 2;
}

function useSize<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [rect, setRect] = React.useState({ w: 0, h: 0 });
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect; setRect({ w: cr.width, h: cr.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, rect] as const;
}

export type MatrixVizStep = {
  v: Vowel;         // vowel at step
  level: 1|0|-1;    // High/Mid/Low
};

export function SevenVoicesMatrix({
  word,
  path,
  levelPath,
  playKey,           // change this to re-play animation (e.g., `${word}|${path.join("")}`)
  durationMs = 1400, // duration per hop
}: {
  word: string;
  path: Vowel[];
  levelPath?: (1|0|-1)[];
  playKey: string;
  durationMs?: number;
}) {

  // Build steps from props
  const derivedLevel = (v: Vowel): 1|0|-1 =>
    v === "A" || v === "E" || v === "I" ? 1 : v === "O" ? 0 : -1;

  const steps: MatrixVizStep[] = React.useMemo(() => {
    const lvls = levelPath && levelPath.length === path.length
      ? levelPath
      : path.map(derivedLevel);
    return path.map((v, i) => ({ v, level: (lvls[i]) }));
  }, [path, levelPath]);

  // Layout calc
  const [wrapRef, rect] = useSize<HTMLDivElement>();
  const cols = ORDER.length;
  const rows = 3;
  const colW = Math.max(56, rect.w / Math.max(cols, 8));
  const rowH = 48;
  const pad = 12;
  const W = Math.max(rect.w, cols*colW + pad*2);
  const H = rows*rowH + pad*2 + 8;

  // Token animation index
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => { setIdx(0); }, [playKey]);
  React.useEffect(() => {
    if (!steps.length) return;
    const t = setInterval(() => {
      setIdx(i => Math.min(i + 1, steps.length - 1));
    }, durationMs);
    return () => clearInterval(t);
  }, [steps, durationMs]);

  // Helper to compute x/y for a (vowel,level)
  const coord = (v: Vowel, level: 1|0|-1) => {
    const c = ORDER.indexOf(v);
    const r = levelToRow(level);
    const x = pad + c*colW + colW/2;
    const y = pad + r*rowH + rowH/2;
    return { x, y };
  };

  // Build polyline points for the traversed prefix
  const points = React.useMemo(() => {
    const p: {x:number;y:number}[] = [];
    for (let i = 0; i <= idx; i++) {
      if (!steps[i]) continue; // Guard against out-of-bounds
      const { x, y } = coord(steps[i].v, steps[i].level);
      p.push({ x, y });
    }
    return p;
  }, [idx, steps]);

  // Consonant rail (simple visual cue)
  const consonants = (word || "").toLowerCase().replace(/[aeiouyë]/gi, "");
  const rail = consonants.toUpperCase();

  return (
    <div
      ref={wrapRef}
      className="relative w-full rounded-2xl border"
      style={{ background: PALETTE.bg, minHeight: H }}
    >
      {/* Grid */}
      <svg width={W} height={H} style={{ display:"block", position:"relative", zIndex: 1 }}>
        {/* Column headers */}
        {ORDER.map((v, ci) => (
          <g key={v} transform={`translate(${pad + ci*colW}, ${pad})`}>
            <rect x={0} y={0} width={colW} height={rows*rowH} fill="none" stroke={PALETTE.grid} />
            <text x={colW/2} y={-4} textAnchor="middle" fontSize="12" fill={VOICE_COLOR[v]}>{v}</text>
            {[0,1,2].map(r => (
              <g key={r}>
                <line
                  x1={0} y1={r*rowH} x2={colW} y2={r*rowH}
                  stroke={r===0||r===2 ? PALETTE.grid : "transparent"}
                />
                <text x={colW - 2} y={r*rowH + rowH/2 + 4} fontSize="10" fill="#6b7280" textAnchor="end">
                  {r===0?"High":r===1?"Mid":"Low"}
                </text>
              </g>
            ))}
          </g>
        ))}

        {/* Traversed stroke */}
        {points.length >= 2 && (
          <polyline
            points={points.map(p => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={PALETTE.stroke}
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,179,0,0.7))" }}
          />
        )}

        {/* Animated token */}
        <AnimatePresence>
          {steps[idx] && (
            <Token
              x={coord(steps[idx].v, steps[idx].level).x}
              y={coord(steps[idx].v, steps[idx].level).y}
              color={VOICE_COLOR[steps[idx].v]}
            />
          )}
        </AnimatePresence>
      </svg>

      {/* Consonant rail (bottom) */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 py-2 text-xs font-mono"
           style={{ color:"#374151", zIndex: 1 }}>
        <span style={{ opacity: 0.7 }}>Rail:</span>
        <Rail text={rail}/>
      </div>
    </div>
  );
}

function Token({ x, y, color }:{ x:number; y:number; color:string }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, x: x, y: y }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      style={{ transformOrigin: "0 0" }}
    >
      <circle cx={0} cy={0} r={10} fill={color} />
      <circle cx={0} cy={0} r={16} fill="none" stroke={color} strokeOpacity={0.35} />
      <motion.circle
        cx={0} cy={0} r={20} fill="none" stroke={color} strokeOpacity={0.25}
        animate={{ r: [18, 26, 18], opacity: [0.35, 0.0, 0.35] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.g>
  );
}

function Rail({ text }: { text: string }) {
  const [off, setOff] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setOff(o => (o+1)%40), 60);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative overflow-hidden" style={{ height: 16, flex: 1 }}>
      <div
        style={{
          position: "absolute", whiteSpace: "nowrap", transform: `translateX(${-off}px)`,
          letterSpacing: 2, opacity: 0.7
        }}
      >
        {[...Array(20)].map((_,i)=> <span key={i}>{text || "—"}&nbsp;&nbsp;</span>)}
      </div>
    </div>
  );
}
