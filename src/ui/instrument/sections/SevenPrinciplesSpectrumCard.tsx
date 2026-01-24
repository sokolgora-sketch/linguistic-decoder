'use client';

import React from "react";

type Present<T> = { kind: "present"; value: T };
type Missing = { kind: "missing"; missing: string; note?: string };
type PresentOrMissing<T> = Present<T> | Missing;

type Spectrum = {
  vowels: string[];
  indices1: number[];
  rings: number[];
  colors: string[];
  notes: string[];
  crossesCenter: boolean;
  endsOnË: boolean;
  ringFlow: number[];
  drift: string;
};

type Props = {
  spectrum: {
    surface: PresentOrMissing<Spectrum>;
    functional: PresentOrMissing<Spectrum>;
  };
};

function Row(props: { label: string; pom: PresentOrMissing<Spectrum> }) {
  if (!props.pom || props.pom.kind !== "present") {
    const note = (props.pom as any)?.note ? ` (${String((props.pom as any).note)})` : "";
    return (
      <div className="rounded-lg border bg-black/5 p-2 text-sm">
        <div className="font-semibold">{props.label}</div>
        <div className="mt-1 text-xs opacity-70">missing{note}</div>
      </div>
    );
  }

  const s = props.pom.value;

  return (
    <div className="rounded-lg border bg-black/5 p-2 text-sm">
      <div className="font-semibold">{props.label}</div>

      <div className="mt-2 flex flex-wrap gap-2">
        {s.vowels.map((v, i) => (
          <span key={i} className="inline-flex items-center gap-2 rounded-md border bg-white/50 px-2 py-1 text-xs">
            <span className="font-mono text-sm">{v}</span>
            <span className="opacity-70">{s.colors[i] ?? "—"}</span>
          </span>
        ))}
      </div>

      <div className="mt-2 grid gap-1 text-xs opacity-80">
        <div>notes: <span className="font-mono">{s.notes.join(" ")}</span></div>
        <div>indices(1..7): <span className="font-mono">{s.indices1.join(" ")}</span></div>
        <div>rings(0..3): <span className="font-mono">{s.rings.join(" ")}</span></div>
        <div>crosses center(O=4): <span className="font-mono">{String(s.crossesCenter)}</span></div>
        <div>ends on Ë: <span className="font-mono">{String(s.endsOnË)}</span></div>
        <div>drift: <span className="font-mono">{s.drift}</span></div>
      </div>
    </div>
  );
}

export function SevenPrinciplesSpectrumCard(props: Props) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-sm font-semibold">Seven Principles Spectrum</div>
      <div className="mt-1 text-xs opacity-70">
        VM-only Prism readout derived from surface vs functional voice paths.
      </div>

      <div className="mt-3 space-y-2">
        <Row label="Surface" pom={props.spectrum.surface} />
        <Row label="Functional" pom={props.spectrum.functional} />
      </div>
    </div>
  );
}
