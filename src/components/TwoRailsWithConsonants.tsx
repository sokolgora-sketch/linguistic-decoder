
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Play } from "lucide-react";


type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
const ORDER: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];
const VOICE_COLOR: Record<Vowel, string> = {
  A: "#EF4444",
  E: "#F59E0B",
  I: "#EAB308",
  O: "#10B981",
  U: "#3B82F6",
  Y: "#6366F1",
  "Ë": "#8B5CF6",
};

const PALETTE = { 
  rail:"#4b5563", 
  accent:"#e5e7eb", 
  text:"#f9fafb", 
  muted:"#9ca3af", 
  bg:"#111827" 
};


// --- Consonant classes (from solver) ---
type CClass = "Plosive" | "Affricate" | "SibilantFricative" | "NonSibilantFricative" | "Nasal" | "Liquid" | "Glide";

const CLASS_ORDER: CClass[] = ["Plosive", "Affricate", "SibilantFricative", "NonSibilantFricative", "Nasal", "Liquid", "Glide"];

const DIGRAPH_CLASS: Record<string, CClass> = {
  "ch": "Affricate", "dz": "Affricate", "ts": "Affricate", "dʒ": "Affricate", "tʃ": "Affricate",
  "sh": "SibilantFricative", "zh": "SibilantFricative",
  "th": "NonSibilantFricative", "ph": "NonSibilantFricative",
  "gj": "Affricate", "nj":"Nasal", "ll":"Liquid", "rr":"Liquid",
};

const LETTER_CLASS: Record<string, CClass> = {
  p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive", k:"Plosive", g:"Plosive", q:"Plosive", c:"Plosive",
  f:"NonSibilantFricative", v:"NonSibilantFricative", h:"NonSibilantFricative",
  s:"SibilantFricative", z:"SibilantFricative", x:"SibilantFricative",
  j:"Affricate",
  m:"Nasal", n:"Nasal",
  l:"Liquid", r:"Liquid",
  w:"Glide", y:"Glide",
};

const VOWEL_SET = new Set(["a","e","i","o","u","y","ë"]);

function extractConsonants(word: string): { ch: string; klass: CClass }[] {
  const s = word.normalize("NFC").toLowerCase();
  const out: { ch: string; klass: CClass }[] = [];

  let i = 0;
  while (i < s.length) {
    if (VOWEL_SET.has(s[i])) { i++; continue; }

    // Check for digraphs first
    let foundDigraph = false;
    if (i < s.length - 1) {
      const dg = s.slice(i, i + 2);
      if (DIGRAPH_CLASS[dg]) {
        out.push({ ch: dg, klass: DIGRAPH_CLASS[dg] });
        i += 2;
        foundDigraph = true;
      }
    }

    if (!foundDigraph) {
      const ch = s[i];
      const klass = LETTER_CLASS[ch] ?? "NonSibilantFricative";
      out.push({ ch, klass });
      i++;
    }
  }
  return out;
}


export function TwoRailsWithConsonants({
  word,
  path,
  playKey,
  height = 320,
  durationPerHopMs = 900,
  showLabels = true,
  consonants,
}: {
  word: string;
  path: Vowel[];
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
  const bandH = 36;

  // Hop state
  const [idx, setIdx] = React.useState(0);
  const [pos, setPos] = React.useState<{x:number;y:number}|null>(null);
  const [trail, setTrail] = React.useState<{x:number;y:number}[]>([]);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    setIdx(0);
    setPos(null);
    setTrail([]);
    setIsPlaying(false);
  }, [playKey]);

  // Consonant pulses
  const consSeq = React.useMemo(() => consonants ?? extractConsonants(word), [word, consonants]);
  const hops = Math.max(1, path.length - 1);
  const bucketed: {ch:string;klass:CClass}[][] = Array.from({length:hops}, ()=>[]);
  for (let i=0;i<consSeq.length;i++){
    bucketed[i % hops].push(consSeq[i]);
  }

  const [activePulse, setActivePulse] = React.useState<{ klass: CClass; t: number } | null>(null);

  const startAnimation = React.useCallback(async () => {
    if (isPlaying || path.length < 2) return;
    
    setIsPlaying(true);
    setTrail([]);
    setPos(null);

    let stop = false;

    const runHop = async (i: number) => {
      if (stop) return;
      if (i >= path.length - 1) {
        setIsPlaying(false);
        return;
      }

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
    return () => { stop = true; setIsPlaying(false); };
  }, [isPlaying, path, durationPerHopMs, leftX, rightX, bucketed]);


  // Render helpers
  const Rail = ({ x }: { x: number }) => (
    <g>
      <line x1={x} y1={top-6} x2={x} y2={bottom+6} stroke={PALETTE.rail} strokeOpacity={0.35} strokeWidth={2}/>
      {ORDER.map(v=>(
        <g key={`${x}-${v}`}>
          <circle cx={x} cy={yFor(v)} r={10} fill="#1F2937" stroke={PALETTE.rail} strokeOpacity={0.5}/>
          {showLabels && (
            <text x={x + (x===leftX ? -24 : 24)} y={yFor(v)+4} fontSize={12}
              textAnchor={x===leftX ? "end":"start"} fill={VOICE_COLOR[v]}>{v}</text>
          )}
        </g>
      ))}
    </g>
  );

  const MidRail = () => {
    const segW = 54, gap = 3;
    const totalW = CLASS_ORDER.length*segW + (CLASS_ORDER.length-1)*gap;
    const startX = (W - totalW)/2;

    return (
      <g>
        {CLASS_ORDER.map((klass, i) => {
          const x = startX + i*(segW+gap);
          const active = activePulse?.klass === klass;
          const shortName = klass.replace("SibilantFricative", "Sibilant").replace("NonSibilantFricative", "Fricative");
          return (
            <g key={klass}>
              <rect x={x} y={midY - bandH/2} width={segW} height={bandH}
                rx={8} ry={8}
                fill={active ? PALETTE.accent : "#374151"}
                fillOpacity={active ? 0.9 : 0.6}
                stroke="#4b5563" strokeOpacity={0.6} />
              <text x={x+segW/2} y={midY} textAnchor="middle" fontSize={10}
                fill={active ? "#111827" : PALETTE.muted} dominantBaseline="central">
                {shortName}
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
    <div className="w-full rounded-2xl border relative" style={{ background: PALETTE.bg }}>
      <svg width={W} height={H} style={{ display: "block" }}>
        <text x={W/2} y={16} textAnchor="middle" fontSize={14} fill={PALETTE.text}>{word}</text>

        {/* rails */}
        <Rail x={leftX} />
        <Rail x={rightX} />

        {/* mid consonant strip */}
        <MidRail />
        
        {/* trail */}
        {trail.length>1 && (
          <polyline
            points={trail.map(p=>`${p.x},${p.y}`).join(" ")}
            fill="none" stroke={PALETTE.accent} strokeWidth={5}
            strokeLinejoin="round" strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px #d1d5db)" }}
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

        {/* footer */}
        {!isPlaying && path.length>0 && (
          <text x={W/2} y={H-10} textAnchor="middle" fontSize={12} fill={PALETTE.muted}>
            {path.join(" → ")}
          </text>
        )}
      </svg>
      {path && path.length > 1 && (
        <Button 
            onClick={startAnimation} 
            disabled={isPlaying}
            variant="destructive"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 z-10"
        >
            <Play className="w-5 h-5"/>
        </Button>
      )}
    </div>
  );
}
