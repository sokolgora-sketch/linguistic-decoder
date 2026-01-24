'use client';

import React from "react";

type PomLike = {
  vowels?: unknown;
  colors?: unknown;
  notes?: unknown;
  roles?: unknown;
  genders?: unknown;
};

type SpectrumLike = {
  surface?: unknown;
  functional?: unknown;
};

function asStringArray(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  return x.map((v) => (v == null ? "" : String(v))).filter((s) => s.length > 0);
}

function asPom(x: unknown): PomLike | null {
  if (!x || typeof x !== "object") return null;
  return x as PomLike;
}

function asSpectrum(x: unknown): SpectrumLike {
  if (!x || typeof x !== "object") return {};
  return x as SpectrumLike;
}

function Row(props: { label: string; pom: unknown }) {
  const p = asPom(props.pom);

  const vowels = asStringArray(p?.vowels);
  const colors = asStringArray(p?.colors);
  const notes = asStringArray(p?.notes);
  const roles = asStringArray(p?.roles);
  const genders = asStringArray(p?.genders);

  const hasAny =
    vowels.length ||
    colors.length ||
    notes.length ||
    roles.length ||
    genders.length;

  return (
    <div className="rounded-xl border bg-white/50 p-3">
      <div className="text-sm font-semibold">{props.label}</div>

      {!hasAny ? (
        <div className="mt-2 text-xs opacity-70">—</div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {(vowels.length ? vowels : ["—"]).map((v, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 rounded-md border bg-white/50 px-2 py-1 text-xs"
            >
              <span className="font-mono text-sm">{v}</span>
              <span className="opacity-70">{colors[i] ?? "—"}</span>
              <span className="opacity-70">{notes[i] ?? "—"}</span>
              <span className="opacity-70">{roles[i] ?? "—"}</span>
              <span className="opacity-70">{genders[i] ?? "—"}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function SevenPrinciplesSpectrumCard(props: { spectrum: unknown }) {
  const spectrum = asSpectrum(props?.spectrum);

  const surface = spectrum.surface;
  const functional = spectrum.functional;

  const hasSurface = !!asPom(surface);
  const hasFunctional = !!asPom(functional);

  return (
    <div className="rounded-2xl border bg-white/70 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-base font-semibold">Seven Principles Spectrum</div>
        {!hasSurface && !hasFunctional ? (
          <div className="text-xs opacity-70">not emitted</div>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        <Row label="Surface" pom={surface} />
        <Row label="Functional" pom={functional} />
      </div>
    </div>
  );
}

export default SevenPrinciplesSpectrumCard;
