"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SevenVoicesMatrix } from "./SevenVoicesMatrix";

/**
 * SevenVoicesMatrixLive
 * Wrapper that adds a real‑time "analysis" visualization on top of the
 * SevenVoicesMatrix. While `running` is true, it shows sweeping vertical and
 * horizontal scanners, intersection pulses, and optional trace heat.
 * When `running` flips to false, it fades the scanners and leaves the final
 * primary path rendered by SevenVoicesMatrix.
 */

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
const ORDER: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

export type TraceStep = { v: Vowel; level: 1 | 0 | -1; E?: number };

const COLORS = {
  accent: "#FFB300",
  neon: "rgba(0,255,120,0.95)",
  neonSoft: "rgba(0,255,120,0.35)",
  stroke: "rgba(255,179,0,0.85)",
};

function levelToRow(l: 1 | 0 | -1) { return l === 1 ? 0 : l === 0 ? 1 : 2; }
function col(v: Vowel) { return ORDER.indexOf(v); }

function useContainerSize<T extends HTMLElement>(){
  const ref = React.useRef<T|null>(null);
  const [rect, setRect] = React.useState({ w: 0, h: 0 });
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect; setRect({ w: r.width, h: r.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, rect] as const;
}

export function SevenVoicesMatrixLive({
  word,
  path,
  levelPath,
  playKey,
  running,
  durationMs = 1300,
  trace,
}: {
  word: string;
  path: Vowel[];
  levelPath?: (1 | 0 | -1)[];
  playKey: string;
  running: boolean;          // true while the server is computing
  durationMs?: number;       // token hop speed once result arrives
  trace?: TraceStep[];       // optional engine trace for heat
}) {
  const [wrapRef, rect] = useContainerSize<HTMLDivElement>();

  // Grid geometry (match SevenVoicesMatrix defaults)
  const cols = ORDER.length;
  const rows = 3;
  const colW = Math.max(56, rect.w / Math.max(cols, 8));
  const rowH = 48;
  const pad = 12;
  const W = Math.max(rect.w, cols * colW + pad * 2);
  const H = rows * rowH + pad * 2 + 8;

  // Animated sweep positions
  const [vx, setVx] = React.useState(0); // vertical sweep x
  const [hy, setHy] = React.useState(0); // horizontal sweep y
  const [seed, setSeed] = React.useState(0);

  React.useEffect(() => {
    if (!running) return; // scanners only while running
    setSeed(s => s + 1);
    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      const dt = t - start;
      // vertical sweeps L→R every 1.6s
      const vxPhase = (dt % 1600) / 1600;
      setVx(pad + vxPhase * (cols * colW));
      // horizontal sweeps T→B every 1.2s
      const hyPhase = (dt % 1200) / 1200;
      setHy(pad + hyPhase * (rows * rowH));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, cols, rows, colW, rowH, pad]);

  // Heat from optional trace (fills as events stream in)
  const [heat, setHeat] = React.useState<number[][]>(() => Array.from({ length: rows }, () => Array(cols).fill(0)));
  React.useEffect(() => {
    if (!trace?.length) { setHeat(Array.from({ length: rows }, () => Array(cols).fill(0))); return; }
    let i = 0; let tm: any;
    const step = () => {
      const s = trace[i];
      if (s) {
        const r = levelToRow(s.level); const c = col(s.v);
        setHeat(h => h.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? Math.min(1, v + 0.25) : v * 0.98))));
      }
      i = Math.min(i + 1, trace.length - 1);
      tm = setTimeout(step, 45);
    };
    if (running) tm = setTimeout(step, 60);
    return () => clearTimeout(tm);
  }, [trace, running]);

  // Fade heat after finish
  React.useEffect(() => {
    if (running) return;
    let raf = 0;
    const cool = () => { setHeat(h => h.map(row => row.map(v => v * 0.92))); raf = requestAnimationFrame(cool); };
    raf = requestAnimationFrame(cool);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Base matrix + primary path */}
      <SevenVoicesMatrix
        word={word}
        path={path}
        levelPath={levelPath}
        playKey={playKey}
        durationMs={durationMs}
      />

      {/* Live scanners & heat overlay */}
      <AnimatePresence>
        {running && (
          <motion.svg
            key={`scan-${seed}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            width={W}
            height={H}
            className="pointer-events-none absolute inset-0"
            style={{ zIndex: 2 }}
          >
            {/* Heat cells */}
            {heat.map((row, ri) => (
              row.map((v, ci) => (
                v > 0.02 ? (
                  <rect
                    key={`h-${ri}-${ci}`}
                    x={12 + ci * colW + 3}
                    y={12 + ri * rowH + 3}
                    width={colW - 6}
                    height={rowH - 6}
                    fill={COLORS.neonSoft}
                    opacity={Math.min(0.35, v)}
                    rx={6}
                    ry={6}
                  />
                ) : null
              ))
            ))}

            {/* Vertical scanner */}
            <motion.rect
              x={vx - 2}
              y={12}
              width={4}
              height={rows * rowH}
              fill={COLORS.neon}
              opacity={0.9}
              initial={false}
              animate={{ x: vx - 2 }}
              transition={{ type: "tween", ease: "linear", duration: 0.12 }}
            />
            {/* Horizontal scanner */}
            <motion.rect
              x={12}
              y={hy - 2}
              width={cols * colW}
              height={4}
              fill={COLORS.neon}
              opacity={0.9}
              initial={false}
              animate={{ y: hy - 2 }}
              transition={{ type: "tween", ease: "linear", duration: 0.12 }}
            />
            {/* Intersection pulse */}
            <motion.circle
              cx={vx}
              cy={hy}
              r={8}
              fill="none"
              stroke={COLORS.accent}
              strokeWidth={2}
              animate={{ r: [6, 14, 6], opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
}
