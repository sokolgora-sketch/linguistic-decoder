'use client';

import * as React from "react";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

const VOWEL_STYLE: Record<Vowel, { bg: string; text: string }> = {
  A: { bg: "bg-red-500/90", text: "text-white" },
  E: { bg: "bg-orange-500/90", text: "text-white" },
  I: { bg: "bg-yellow-400/90", text: "text-black" },
  O: { bg: "bg-green-500/90", text: "text-white" },
  U: { bg: "bg-blue-500/90", text: "text-white" },
  Y: { bg: "bg-indigo-500/90", text: "text-white" },
  "Ë": { bg: "bg-violet-500/90", text: "text-white" },
};

const GROUPS: Array<{ label: string; vowels: Vowel[] }> = [
  { label: "Center", vowels: ["O"] },
  { label: "Inner", vowels: ["I", "U"] },
  { label: "Middle", vowels: ["E", "Y"] },
  { label: "Outer", vowels: ["A", "Ë"] },
];

export function VowelChip({
  vowel,
  className = "",
}: {
  vowel: Vowel;
  className?: string;
}) {
  const s = VOWEL_STYLE[vowel];
  return (
    <span
      className={[
        "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2",
        "text-xs font-semibold tracking-wide",
        s.bg,
        s.text,
        "ring-1 ring-inset ring-white/15",
        className,
      ].join(" ")}
      title={`Vowel ${vowel}`}
    >
      {vowel}
    </span>
  );
}

export default function VowelLegend({ className = "" }: { className?: string }) {
  return (
    <div className={["flex flex-wrap items-center gap-2", className].join(" ")}>
      <span className="text-xs text-white/60">Vowels:</span>

      {GROUPS.map((g) => (
        <div key={g.label} className="flex items-center gap-2">
          <span className="text-xs text-white/45">{g.label}</span>
          <div className="flex items-center gap-1.5">
            {g.vowels.map((v) => (
              <VowelChip key={v} vowel={v} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
