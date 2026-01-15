'use client';

import React from 'react';

type Props = {
  vm: any; // keep minimal; caller guarantees "telemetry VM" shape
};

function asText(x: any): string | null {
  if (typeof x === 'string' && x.trim()) return x.trim();
  return null;
}

function joinParts(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export default function MeaningPanel({ vm }: Props) {
  // VM-only: do NOT touch raw analysis payload.
  const principles =
    asText(vm?.detection?.principles) ??
    asText(vm?.readout?.principles) ??
    null;

  const delta = asText(vm?.detection?.delta) ?? null;

  // Prefer functional if present; else voicePath; else nothing.
  const functional = asText(vm?.detection?.voicePathFunctional) ?? null;
  const surface = asText(vm?.detection?.voicePathSurface) ?? null;
  const voicePath = asText(vm?.detection?.voicePath) ?? null;

  const candidates =
    typeof vm?.counts?.candidates === 'number'
      ? vm.counts.candidates
      : typeof vm?.counts?.candidateCount === 'number'
        ? vm.counts.candidateCount
        : null;

  // Minimal deterministic “meaning sentence”:
  // If we have principles, we can render a stable line; otherwise we render a neutral fallback.
  const sentence = principles
    ? joinParts([
        'Principles:',
        principles + '.',
        candidates != null ? `Candidates: ${candidates}.` : null,
        delta ? `Delta: ${delta}.` : null,
      ])
    : 'Meaning v1 (minimal): insufficient telemetry emitted.';

  const sub =
    functional || surface || voicePath
      ? joinParts([
          functional ? `Functional path: ${functional}.` : null,
          surface ? `Surface path: ${surface}.` : null,
          !functional && !surface && voicePath ? `Voice path: ${voicePath}.` : null,
        ])
      : null;

  return (
    <div className="rounded-lg border border-white/15 bg-black/20 p-4">
      <div className="text-lg font-semibold">Meaning</div>

      <div className="mt-2 text-sm leading-6 opacity-90">{sentence}</div>

      {sub ? (
        <div className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{sub}</div>
      ) : null}

      <div className="mt-2 text-[11px] opacity-50">
        source: telemetry VM (read-only)
      </div>
    </div>
  );
}
