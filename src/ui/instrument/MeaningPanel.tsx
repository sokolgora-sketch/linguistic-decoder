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
    const PREVIEW_N = 3;
      const items = v.map(String);
      const preview = items.slice(0, PREVIEW_N);
      const remaining = items.length - preview.length;
      const suffix = remaining > 0 ? ` (+${remaining} more)` : '';
      return `${label} (${items.length}): ${preview.join(', ')}${suffix}.`;
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
    <div className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ea4ba]">reading surface</div>
          <div className="mt-1 text-lg font-semibold text-[#f5f7fb]">Meaning</div>
          <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#aeb7c5]">
            Human-readable VM summary for the current word. It frames the readout as deterministic inspection, not origin proof.
          </p>
        </div>
        <div className="shrink-0 rounded-full border border-[#303a45] bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#cfe6ff]">
          source=vm
        </div>
      </div>

      <div className="mt-4 rounded-[10px] border border-[#355a7a] bg-[#111a24] p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Summary</div>
        <div className="mt-2 text-sm leading-6 text-[#f5f7fb]">{sentence}</div>
        {sub ? <div className="mt-3 whitespace-pre-wrap font-mono text-xs leading-5 text-[#9fb1bf]">{sub}</div> : null}
      </div>

      <div className="mt-3 rounded-[10px] border border-[#27313d] bg-[#0d1117] p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">Evidence posture</div>
        <div className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#d7dde7]">{evidenceLines}</div>
      </div>

      <div className="mt-3 text-[11px] leading-5 text-[#7d8ea3]">
        Boundary: deterministic reading; no forced answer; not a historical-chain claim.
      </div>
    </div>
  );
}
