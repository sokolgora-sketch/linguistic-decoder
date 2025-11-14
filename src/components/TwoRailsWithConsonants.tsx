"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
const ORDER: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];
const VOICE_COLOR: Record<Vowel, string> = {
  A:"#ef4444", E:"#f59e0b", I:"#eab308", O:"#10b981", U:"#3b82f6", Y:"#6366f1", "Ë":"#8b5cf6",
};
const PALETTE = { rail:"#1f2937", accent:"#FFB300", text:"#111827", muted:"#6b7280", bg:"#fff" };

// --- Consonant classes (simple EN mapping; Y is a vowel here) ---
type CClass = "Plosive"|"Fricative"|"Affricate"|"Nasal"|"Liquid"|"Glide";
const CLASS_ORDER: CClass[] = ["Plosive","Fricative","Affricate","Nasal","Liquid","Glide"];

const CHAR_CLASS: Record<string, CClass> = {
  p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive", k:"Plosive", g:"Plosive", q:"Plosive", c:"Plosive",
  f:"Fricative", v:"Fricative", s:"Fricative", z:"Fricative", h:"Fricative", x:"Fricative",
  j:"Affricate", /* ch */ // (we treat single letters; pro users can pass a custom map)
  m:"Nasal", n:"Nasal",
  l:"Liquid", r:"Liquid",
  w:"Glide",
};

const VOWEL_SET = new Set(["a","e","i","o","u","y","ë"]); // Y & Ë are vowels in your system

function extractConsonants(word: string): { ch: string; klass: CClass }[] {
  const raw = word.normalize("NFC").toLowerCase().replace(/[^a-zë]/g,"");
  const out: {ch:string;klass:CClass}[] = [];
  for (let i=0;i<raw.length;i++){
    const ch = raw[i];
    if (VOWEL_SET.has(ch)) continue;
    const klass = CHAR_CLASS[ch] ?? "Fricative"; // fallback bucket
    out.push({ ch, klass });
  }
  return out;
}

export function TwoRailsWithConsonants({
  word,
  path,
  running,
  playKey,
  height = 320,
  durationPerHopMs = 900,
  showLabels = true,
  consonants,              // optional override sequence (e.g., [{ch:"s",klass:"Fricative"}...])
}: {
  word: string;
  path: Vowel[];           // e.g., ["U","I"]
  running: boolean;
  playKey?: string;
  height?: number;
  durationPerHopMs?: number;
  showLabels?: boolean;
  consonants?: { ch: string; klass: CClass }[];
}) {
  // Layout
  const W = 680;
  const H = height;
  const padX = 110;
  const leftX = padX, rightX = W - padX;
  const top = 18, bottom = H - 40;
  const railH = bottom - top;
  const stepGap = railH / (ORDER.length - 1);
  const yFor = (v: Vowel) => top + ORDER.indexOf(v) * stepGap;

  // Mid-rail band
  const midY = (top + bottom) / 2;
  const bandH = 48;

  // Scanners while running
  const [scanT, setScanT] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    let raf = 0; const t0 = performance.now();
    const loop = (t: number) => { setScanT((t - t0)/1000); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // Hop state
  const [idx, setIdx] = React.useState(0);
  const [pos, setPos] = React.useState<{x:number;y:number}|null>(null);
  const [trail, setTrail] = React.useState<{x:number;y:number}[]>([]);
  React.useEffect(() => { setIdx(0); setPos(null); setTrail([]); }, [playKey]);

  // Consonant pulses
  const consSeq = React.useMemo(() => consonants ?? extractConsonants(word), [word, consonants]);

  // Distribute consonants across hops (even fallback)
  const hops = Math.max(1, path.length - 1);
  const bucketed: {ch:string;klass:CClass}[][] = Array.from({length:hops}, ()=>[]);
  for (let i=0;i<consSeq.length;i++){
    bucketed[i % hops].push(consSeq[i]);
  }

  const [activePulse, setActivePulse] = React.useState<{ klass: CClass; t: number } | null>(null);

  React.useEffect(() => {
    if (running || path.length < 2) return;
    let stop = false;

    const runHop = async (i: number) => {
      if (stop) return;
      if (i >= path.length - 1) return;

      const leftToRight = i % 2 === 0;
      const startX = leftToRight ? leftX : rightX;
      const endX   = leftToRight ? rightX : leftX;
      const startY = yFor(path[i]);
      const endY   = yFor(path[i+1]);
      const ctrlX  = (leftX + rightX) / 2;
      const bow    = 48 * (endY < startY ? -1 : 1);
      const ctrlY  = (startY + endY) / 2 + bow;

      const steps = 50;
      const dt = durationPerHopMs / steps;

      // schedule consonant pulses evenly along this hop
      const cons = bucketed[i];
      const thresholds = cons.map((_,k)=> (k+1)/(cons.length+1));

      for (let s=0; s<=steps; s++){
        await new Promise(r=>setTimeout(r, dt));
        if (stop) return;

        const t = s/steps;
        const x12 = startX + (ctrlX - startX) * t;
        const y12 = startY + (ctrlY - startY) * t;
        const x23 = ctrlX + (endX - ctrlX) * t;
        const y23 = ctrlY + (endY - ctrlY) * t;
        const x = x12 + (x23 - x12) * t;
        const y = y12 + (y23 - y12) * t;

        setPos({x,y});
        setTrail(tr => [...tr.slice(-80), {x,y}]);

        // trigger pulses
        for (let p=0; p<thresholds.length; p++){
          if (Math.abs(t - thresholds[p]) < 0.02){
            const ev = cons[p];
            if (ev) { setActivePulse({ klass: ev.klass, t: performance.now() }); }
          }
        }
      }
      setIdx(k => k+1);
      await runHop(i+1);
    };

    runHop(0);
    return () => { stop = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, path, durationPerHopMs, leftX, rightX, word]);

  // Scanner bars
  const scanY1 = top + (Math.sin(scanT * 2.2) * 0.5 + 0.5) * railH;
  const scanY2 = top + (Math.cos(scanT * 2.8) * 0.5 + 0.5) * railH;

  // Render helpers
  const Rail = ({ x }: { x: number }) => (
    <g>
      <line x1={x} y1={top-6} x2={x} y2={bottom+6} stroke={PALETTE.rail} strokeOpacity={0.35} strokeWidth={2}/>
      {ORDER.map(v=>(
        <g key={`${x}-${v}`}>
          <circle cx={x} cy={yFor(v)} r={10} fill="#fff" stroke={PALETTE.rail} strokeOpacity={0.25}/>
          {showLabels && (
            <text x={x + (x===leftX ? -24 : 24)} y={yFor(v)+4} fontSize={12}
              textAnchor={x===leftX ? "end":"start"} fill={VOICE_COLOR[v]}>{v}</text>
          )}
        </g>
      ))}
    </g>
  );

  const MidRail = () => {
    const segW = 88, gap = 8;
    const totalW = CLASS_ORDER.length*segW + (CLASS_ORDER.length-1)*gap;
    const startX = (W - totalW)/2;

    return (
      <g>
        {CLASS_ORDER.map((klass, i) => {
          const x = startX + i*(segW+gap);
          const active = activePulse?.klass === klass;
          return (
            <g key={klass}>
              <rect x={x} y={midY - bandH/2} width={segW} height={bandH}
                rx={10} ry={10}
                fill={active ? PALETTE.accent : "#f3f4f6"}
                fillOpacity={active ? 0.9 : 0.6}
                stroke="#d1d5db" strokeOpacity={0.6} />
              <text x={x+segW/2} y={midY} textAnchor="middle" fontSize={12}
                fill={active ? "#111827" : PALETTE.muted} dominantBaseline="central">
                {klass}
              </text>
              {/* pulse ring */}
              {active && (
                <motion.circle cx={x+segW/2} cy={midY} r={bandH/2+6} fill="none"
                  stroke={PALETTE.accent} strokeOpacity={0.6} strokeWidth={2}/>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div className="w-full rounded-2xl border" style={{ background: PALETTE.bg }}>
      <svg width={W} height={H} style={{ display: "block" }}>
        <text x={W/2} y={16} textAnchor="middle" fontSize={14} fill={PALETTE.text}>{word}</text>

        {/* rails */}
        <Rail x={leftX} />
        <Rail x={rightX} />

        {/* mid consonant strip */}
        <MidRail />

        {/* running scanners */}
        <AnimatePresence>
          {running && (
            <g>
              <motion.line x1={leftX-18} x2={leftX+18} y1={scanY1} y2={scanY1}
                stroke={PALETTE.accent} strokeWidth={3}
                initial={{opacity:0}} animate={{opacity:0.9}} exit={{opacity:0}}/>
              <motion.line x1={rightX-18} x2={rightX+18} y1={scanY2} y2={scanY2}
                stroke={PALETTE.accent} strokeWidth={3}
                initial={{opacity:0}} animate={{opacity:0.9}} exit={{opacity:0}}/>
              {Math.abs(scanY1 - scanY2) < 8 && (
                <motion.circle
                  cx={(leftX + rightX) / 2} cy={(scanY1 + scanY2) / 2} r={8}
                  fill="none" stroke={PALETTE.accent} strokeWidth={2}
                  initial={{ opacity: 0.6, r: 4 }} animate={{ r: 14, opacity: 0 }} transition={{ duration: 0.6 }}
                />
              )}
            </g>
          )}
        </AnimatePresence>

        {/* trail */}
        {trail.length>1 && (
          <polyline
            points={trail.map(p=>`${p.x},${p.y}`).join(" ")}
            fill="none" stroke={PALETTE.accent} strokeWidth={5}
            strokeLinejoin="round" strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,179,0,0.55))" }}
          />
        )}

        {/* token */}
        <AnimatePresence>
          {pos && (
            <motion.circle key={`${pos.x}-${pos.y}`} cx={pos.x} cy={pos.y} r={11}
              fill={VOICE_COLOR[path[Math.min(idx, path.length-1)] ] || "#3F51B5"}
              stroke="#fff" strokeOpacity={0.7}
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type:"spring", stiffness:140, damping:18 }}
            />
          )}
        </AnimatePresence>

        {/* step hints */}
        {!running && path.length>=2 && (
          <g>
            <circle cx={idx%2===0?leftX:rightX} cy={yFor(path[Math.min(idx, path.length-1)])} r={6}
              fill={VOICE_COLOR[path[Math.min(idx, path.length-1)]]}/>
            {idx < path.length-1 && (
              <circle cx={idx%2===0?rightX:leftX} cy={yFor(path[idx+1])} r={6}
                fill={VOICE_COLOR[path[idx+1]]} fillOpacity={0.6}/>
            )}
          </g>
        )}

        {/* footer */}
        {!running && path.length>0 && (
          <text x={W/2} y={H-10} textAnchor="middle" fontSize={12} fill={PALETTE.muted}>
            {path.join(" → ")}
          </text>
        )}
      </svg>
    </div>
  );
}
