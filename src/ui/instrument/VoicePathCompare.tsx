"use client";

import React from "react";
import type { PresentOrMissing, Vowel } from "../telemetry/types";

function fmt(arr: readonly Vowel[]) {
  return arr.join("-");
}

function renderPOM<T>(
  pom: PresentOrMissing<T> | undefined,
  renderValue: (v: T) => React.ReactNode,
  fallbackLabel = "not_emitted"
) {
  if (!pom) return <span className="text-slate-500">{fallbackLabel}</span>;
  if (pom.kind === "present") return renderValue(pom.value);
  return (
    <span className="text-slate-500">
      {fallbackLabel}
      {pom.note ? <span className="ml-2 text-slate-600">({pom.note})</span> : null}
    </span>
  );
}

function DeltaBadge({ label }: { label: "MATCH" | "DIVERGE" | "—" }) {
  const tone =
    label === "MATCH"
      ? "border-emerald-400/40 text-emerald-200"
      : label === "DIVERGE"
        ? "border-amber-400/40 text-amber-200"
        : "border-slate-700 text-slate-500";

  return (
    <span
      className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${tone}`}
    >
      {label}
    </span>
  );
}

export function VoicePathCompare({
  surface,
  functional,
}: {
  surface?: PresentOrMissing<readonly Vowel[]>;
  functional?: PresentOrMissing<readonly Vowel[]>;
}) {
  const delta: "MATCH" | "DIVERGE" | "—" =
    surface?.kind === "present" && functional?.kind === "present"
      ? fmt(surface.value) === fmt(functional.value)
        ? "MATCH"
        : "DIVERGE"
      : "—";

  return (
    <div className="mt-2 space-y-1 text-xs text-slate-400">
      <div>
        Voice path (surface):{" "}
        {renderPOM(surface, (arr) => <span className="font-mono">{fmt(arr)}</span>)}
      </div>
      <div>
        Voice path (functional):{" "}
        {renderPOM(functional, (arr) => <span className="font-mono">{fmt(arr)}</span>)}
      </div>
      <div>
        Delta: <DeltaBadge label={delta} />
      </div>
    </div>
  );
}
