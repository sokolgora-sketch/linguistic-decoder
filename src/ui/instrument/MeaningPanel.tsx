'use client';

import React from 'react';

type Props = {
  vm: any; // caller guarantees "telemetry VM" shape (or a minimal test stub)
};

type Present<T> = { kind: 'present'; value: T };
type Missing = { kind: 'missing'; missing?: string; note?: string };

function isPresent<T>(m: any): m is Present<T> {
  return m?.kind === 'present';
}

function isMissing(m: any): m is Missing {
  return m?.kind === 'missing';
}

function joinParts(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function formatArrowPath(parts: any[]): string {
  return (parts ?? []).map(String).join(' → ');
}

function asText(x: any): string | null {
  return typeof x === 'string' && x.trim() ? x.trim() : null;
}

function renderMaybeList(label: string, m: any): string {
  // m is expected to be PresentOrMissing<string[]>
  if (isPresent<string[]>(m)) {
    const v = Array.isArray(m.value) ? m.value : [];
    if (v.length === 0) return `${label}: none.`;
    return `${label}: ${v.map(String).join(', ')}.`;
  }
  if (isMissing(m)) {
    const reason = asText(m.missing) ?? 'unknown';
    const note = asText(m.note);
    return `${label}: missing (${reason}${note ? `; ${note}` : ''}).`;
  }
  return `${label}: missing (unknown).`;
}

export default function MeaningPanel({ vm }: Props) {
  // VM-only: do NOT touch raw analysis payload.
  const readout = vm?.readout ?? {};
  const detection = vm?.detection ?? {};
  const evidence = vm?.evidence ?? {};

  // --- Principles ---
  // Preferred (real VM): readout.principlesPath = PresentOrMissing<string[]>
  const principlesPath = readout.principlesPath;
  const principlesFromReadout =
    isPresent<string[]>(principlesPath) && Array.isArray(principlesPath.value) && principlesPath.value.length
      ? formatArrowPath(principlesPath.value)
      : null;

  // Fallback (minimal test stub): detection.principles = string
  const principlesFromDetection = asText(detection.principles);

  const principles = principlesFromReadout ?? principlesFromDetection;

  // --- Counts / delta ---
  const candidatesCount =
    typeof readout?.counts?.candidates === 'number'
      ? readout.counts.candidates
      : typeof vm?.counts?.candidates === 'number'
        ? vm.counts.candidates
        : null;

  const delta = asText(readout.voicePathDelta) ?? asText(detection.delta) ?? null;

  // --- Paths (sub-lines) ---
  // Preferred (real VM): readout.voicePath* are PresentOrMissing<Vowel[]>
  const detected = readout.voicePath;
  const surface = readout.voicePathSurface;
  const functional = readout.voicePathFunctional;

  const functionalLine =
    isPresent<any[]>(functional) && Array.isArray(functional.value) && functional.value.length
      ? `Functional path: ${formatArrowPath(functional.value)}.`
      : asText(detection.voicePathFunctional)
        ? `Functional path: ${asText(detection.voicePathFunctional)}.`
        : null;

  const surfaceLine =
    isPresent<any[]>(surface) && Array.isArray(surface.value) && surface.value.length
      ? `Surface path: ${formatArrowPath(surface.value)}.`
      : asText(detection.voicePathSurface)
        ? `Surface path: ${asText(detection.voicePathSurface)}.`
        : null;

  const detectedLine =
    isPresent<any[]>(detected) && Array.isArray(detected.value) && detected.value.length
      ? `Voice path: ${formatArrowPath(detected.value)}.`
      : asText(detection.voicePath)
        ? `Voice path: ${asText(detection.voicePath)}.`
        : null;

  const sentence = principles
    ? joinParts([
        'Principles:',
        principles + '.',
        candidatesCount != null ? `Candidates: ${candidatesCount}.` : null,
        delta ? `Delta: ${delta}.` : null,
      ])
    : 'Meaning v1 (minimal): insufficient telemetry emitted.';

  const sub = joinParts([
    functionalLine,
    surfaceLine,
    // only show detected if functional+surface absent
    !functionalLine && !surfaceLine ? detectedLine : null,
  ]);

  // --- Evidence summary (truth posture) ---
  const evidenceLines = joinParts([
    renderMaybeList('Normalization', evidence.normalizationSteps),
    renderMaybeList('Ops', evidence.ops),
    renderMaybeList('Signals', evidence.signals),
    renderMaybeList('Notes', evidence.notes),
  ]);

  return (
    <div className="rounded-lg border border-white/15 bg-black/20 p-4">
      <div className="text-lg font-semibold">Meaning</div>

      <div className="mt-2 text-sm leading-6 opacity-90">{sentence}</div>

      {sub ? <div className="mt-2 whitespace-pre-wrap text-xs opacity-70">{sub}</div> : null}

      <div className="mt-3 whitespace-pre-wrap text-xs opacity-70">{evidenceLines}</div>

      <div className="mt-2 text-[11px] opacity-50">source: telemetry VM</div>
    </div>
  );
}
