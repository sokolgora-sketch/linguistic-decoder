"use client";

import React from "react";
import type { PresentOrMissing, PhoneticIpaV0_1VM, Vowel } from "../../telemetry/types";

function ringLabelFor(v: Vowel): "center" | "inner" | "middle" | "outer" | "unknown" {
  // UI-only mapping (stable): O center; I/U inner; E/Y middle; A/Ë outer
  switch (v) {
    case "O":
      return "center";
    case "I":
    case "U":
      return "inner";
    case "E":
    case "Y":
      return "middle";
    case "A":
    case "Ë":
      return "outer";
    default:
      return "unknown";
  }
}

function VoiceChip({ v }: { v: Vowel }) {
  const ring = ringLabelFor(v);
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/40 bg-blue-500/10 px-2 py-0.5 text-xs font-mono text-blue-100">
      <span>{v}</span>
      <span className="text-blue-200/65">·{ring}</span>
    </span>
  );
}

function TokenChip({ t }: { t: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-black/25 px-2 py-0.5 text-xs font-mono text-slate-400">
      {t}
    </span>
  );
}

export function PhoneticIpaPanelV0_1({ pom }: { pom: PresentOrMissing<PhoneticIpaV0_1VM> }) {
  if (pom.kind === "missing") {
    return (
      <div className="text-sm font-mono">
        <span className="text-slate-500">Not provided.</span>
        <span className="ml-2 text-slate-600">
          [{pom.missing}
          {pom.note ? ` · ${pom.note}` : ""}]
        </span>
      </div>
    );
  }

  const p = pom.value;

  return (
    <div className="text-sm font-mono">
      <div className="flex flex-wrap items-center gap-2">
        <span>{p.ipa}</span>
        <span className="inline-flex flex-wrap gap-1 align-middle">
          {p.voices.map((v, idx) => (
            <VoiceChip key={`${v}-${idx}`} v={v} />
          ))}
        </span>
      </div>

      {p.unmapped.length ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-slate-500">unmapped:</span>
          <span className="inline-flex flex-wrap gap-1">
            {p.unmapped.map((x, i) => (
              <TokenChip key={`${x}-${i}`} t={x} />
            ))}
          </span>
        </div>
      ) : null}
    </div>
  );
}
