"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

const ORDER: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];
const VOICE_COLOR: Record<Vowel, string> = {
  A: "#ef4444", E: "#f59e0b", I: "#eab308",
  O: "#10b981", U: "#3b82f6", Y: "#6366f1", "Ë": "#8b5cf6",
};
const PALETTE = {
  rail: "#1f2937",
  accent: "#FFB300", // Soft Amber
  textMuted: "#6b7280",
  bg: "#ffffff",
};

export function TwoRailsViz({
  word,
  path,
  running,                 // true while analysis is in flight
  playKey,                 // change to restart animation (e.g., `${word}|${path.join("")}`)
  height = 280,
  durationPerHopMs = 900,
  showLabels = true,
  onDone,
}: {
  word: string;
  path: Vowel[];
  running: boolean;
  playKey?: string;
  height?: number;
  durationPerHopMs?: number;
  showLabels?: boolean;
  onDone?: () => void;
}) {
  // layout
  const W = 560;
  const H = height;
  const padX = 80;
  const leftX = padX;
  const rightX = W - padX;
  const top = 18;
  const bottom = H - 36;
  const railH = bottom - top;
  const stepGap = railH / (ORDER.length - 1);
  const yFor = (v: Vowel) => top + ORDER.indexOf(v) * stepGap;

  // scanning bars while `running`
  const [scanT, setScanT] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      setScanT((t - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // hop state (after result lands)
  const [idx, setIdx] = React.useState(0); // which hop we’re on
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const [trail, setTrail] = React.useState<Array<{ x: number; y: number }>>([]);

  React.useEffect(() => { setIdx(0); setPos(null); setTrail([]); }, [playKey]);

  // play sequence: curved hops alternating L→R then R→L so the exchange is obvious
  React.useEffect(() => {
    if (running || path.length < 2) return;
    let stop = false;

    const runHop = async (i: number) => {
      if (stop) return;
      if (i >= path.length - 1) { onDone?.(); return; }

      const leftToRight = i % 2 === 0;
      const startX = leftToRight ? leftX : rightX;
      const endX = leftToRight ? rightX : leftX;
      const startY = yFor(path[i]);
      const endY = yFor(path[i + 1]);

      const ctrlX = (leftX + rightX) / 2;
      const bow = 48 * (endY < startY ? -1 : 1);
      const ctrlY = (startY + endY) / 2 + bow;

      const steps = 50;
      const dt = durationPerHopMs / steps;

      for (let s = 0; s <= steps; s++) {
        await new Promise((r) => setTimeout(r, dt));
        if (stop) return;

        const t = s / steps;
        // quadratic Bézier
        const x12 = startX + (ctrlX - startX) * t;
        const y12 = startY + (ctrlY - startY) * t;
        const x23 = ctrlX + (endX - ctrlX) * t;
        const y23 = ctrlY + (endY - ctrlY) * t;
        const x = x12 + (x23 - x12) * t;
        const y = y12 + (y23 - y12) * t;

        setPos({ x, y });
        setTrail((tr) => [...tr.slice(-80), { x, y }]);
      }
      setIdx((k) => k + 1);
      await runHop(i + 1);
    };

    runHop(0);
    return () => { stop = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, path, durationPerHopMs, leftX, rightX]);

  const Rail = ({ x }: { x: number }) => (
    <g>
      <line x1={x} y1={top - 6} x2={x} y2={bottom + 6} stroke={PALETTE.rail} strokeOpacity={0.35} strokeWidth={2} />
      {ORDER.map((v) => (
        <g key={`${x}-${v}`}>
          <circle cx={x} cy={yFor(v)} r={10} fill="#fff" stroke={PALETTE.rail} strokeOpacity={0.25} />
          {showLabels && (
            <text
              x={x + (x === leftX ? -24 : 24)}
              y={yFor(v) + 4}
              fontSize={12}
              textAnchor={x === leftX ? "end" : "start"}
              fill={VOICE_COLOR[v]}
            >
              {v}
            </text>
          )}
        </g>
      ))}
    </g>
  );

  const scanY1 = top + (Math.sin(scanT * 2.2) * 0.5 + 0.5) * railH;
  const scanY2 = top + (Math.cos(scanT * 2.8) * 0.5 + 0.5) * railH;

  return (
    <div className="w-full rounded-2xl border" style={{ background: PALETTE.bg }}>
      <svg width={W} height={H} style={{ display: "block" }}>
        {/* label */}
        <text x={W / 2} y={16} textAnchor="middle" fontSize={14} fill="#111827">{word}</text>

        {/* rails */}
        <Rail x={leftX} />
        <Rail x={rightX} />

        {/* scanning phase */}
        <AnimatePresence>
          {running && (
            <g>
              <motion.line
                x1={leftX - 18} x2={leftX + 18} y1={scanY1} y2={scanY1}
                stroke={PALETTE.accent} strokeWidth={3}
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} exit={{ opacity: 0 }}
              />
              <motion.line
                x1={rightX - 18} x2={rightX + 18} y1={scanY2} y2={scanY2}
                stroke={PALETTE.accent} strokeWidth={3}
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} exit={{ opacity: 0 }}
              />
              {Math.abs(scanY1 - scanY2) < 8 && (
                <motion.circle
                  cx={(leftX + rightX) / 2}
                  cy={(scanY1 + scanY2) / 2}
                  r={8}
                  fill="none" stroke={PALETTE.accent} strokeWidth={2}
                  initial={{ opacity: 0.6, r: 4 }} animate={{ r: 14, opacity: 0 }} transition={{ duration: 0.6 }}
                />
              )}
            </g>
          )}
        </AnimatePresence>

        {/* trail */}
        {trail.length > 1 && (
          <polyline
            points={trail.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={PALETTE.accent}
            strokeWidth={5}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,179,0,0.55))" }}
          />
        )}

        {/* token */}
        <AnimatePresence>
          {pos && (
            <motion.circle
              key={`${pos.x}-${pos.y}`}
              cx={pos.x} cy={pos.y} r={11}
              fill={VOICE_COLOR[path[Math.min(idx, path.length - 1)] ] || "#3F51B5"}
              stroke="#fff" strokeOpacity={0.7}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
            />
          )}
        </AnimatePresence>

        {/* step hints */}
        {!running && path.length >= 2 && (
          <g>
            <circle
              cx={idx % 2 === 0 ? leftX : rightX}
              cy={yFor(path[Math.min(idx, path.length - 1)])}
              r={6}
              fill={VOICE_COLOR[path[Math.min(idx, path.length - 1)]]}
            />
            {idx < path.length - 1 && (
              <circle
                cx={idx % 2 === 0 ? rightX : leftX}
                cy={yFor(path[idx + 1])}
                r={6}
                fill={VOICE_COLOR[path[idx + 1]]}
                fillOpacity={0.6}
              />
            )}
          </g>
        )}

        {/* footer */}
        {!running && path.length > 0 && (
          <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={12} fill={PALETTE.textMuted}>
            {path.join(" → ")}
          </text>
        )}
      </svg>
    </div>
  );
}
