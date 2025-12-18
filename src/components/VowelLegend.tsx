'use client';

import React from "react";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

const VOWEL_SET: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

const CHIP: Record<Vowel, string> = {
  A: "border-red-400/40 bg-red-500/20 text-red-100",
  E: "border-orange-400/40 bg-orange-500/20 text-orange-100",
  I: "border-yellow-400/40 bg-yellow-500/20 text-yellow-100",
  O: "border-green-400/40 bg-green-500/20 text-green-100",
  U: "border-blue-400/40 bg-blue-500/20 text-blue-100",
  Y: "border-indigo-400/40 bg-indigo-500/20 text-indigo-100",
  "Ë": "border-violet-400/40 bg-violet-500/20 text-violet-100",
};

function Chip({ v }: { v: Vowel }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${CHIP[v]}`}>
      {v}
    </span>
  );
}

export default function VowelLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70 ${className}`}>
      <span className="text-white/50">Vowels:</span>

      {/* Canonical set order */}
      <span className="inline-flex flex-wrap items-center gap-1">
        {VOWEL_SET.map((v) => (
          <Chip key={v} v={v} />
        ))}
      </span>

      {/* Keep ring semantics (compact) */}
      <span className="text-white/30">·</span>
      <span className="text-white/40">Rings:</span>
      <span className="inline-flex items-center gap-1">
        <span className="text-white/40">Center</span> <Chip v="O" />
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="text-white/40">Inner</span> <Chip v="I" /> <Chip v="U" />
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="text-white/40">Middle</span> <Chip v="E" /> <Chip v="Y" />
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="text-white/40">Outer</span> <Chip v="A" /> <Chip v="Ë" />
      </span>
    </div>
  );
}
