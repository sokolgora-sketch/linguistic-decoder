'use client';

import React from 'react';

type Props = {
  vm: MeaningVM;
};

type Present<T> = { kind: 'present'; value: T };
type Missing = { kind: 'missing'; missing?: unknown; note?: unknown };
type MeaningVM = {
  readout?: {
    principlesPath?: unknown;
    counts?: { candidates?: unknown };
    voicePathDelta?: unknown;
    voicePath?: unknown;
    voicePathSurface?: unknown;
    voicePathFunctional?: unknown;
  };
  detection?: Record<string, unknown>;
  evidence?: {
    normalizationSteps?: unknown;
    ops?: unknown;
    signals?: unknown;
    notes?: unknown;
  };
  counts?: { candidates?: unknown };
};

function isPresent<T>(m: unknown): m is Present<T> {
  return typeof m === 'object' && m !== null && 'kind' in m && m.kind === 'present';
}

function isMissing(m: unknown): m is Missing {
  return typeof m === 'object' && m !== null && 'kind' in m && m.kind === 'missing';
}

function joinParts(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

function formatArrowPath(parts: unknown[]): string {
  return (parts ?? []).map(String).join(' → ');
}

function asText(x: unknown): string | null {
  return typeof x === 'string' && x.trim() ? x.trim() : null;
}

function renderMaybeList(label: string, m: unknown): string {
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
    isPresent<unknown[]>(functional) && Array.isArray(functional.value) && functional.value.length
      ? `Functional / normalization path: ${formatArrowPath(functional.value)}.`
      : asText(detection.voicePathFunctional)
        ? `Functional / normalization path: ${asText(detection.voicePathFunctional)}.`
        : null;

  const surfaceLine =
    isPresent<unknown[]>(surface) && Array.isArray(surface.value) && surface.value.length
      ? `Orthographic vowel sequence (non-authoritative): ${formatArrowPath(surface.value)}.`
      : asText(detection.voicePathSurface)
        ? `Orthographic vowel sequence (non-authoritative): ${asText(detection.voicePathSurface)}.`
        : null;

  const detectedLine =
    isPresent<unknown[]>(detected) && Array.isArray(detected.value) && detected.value.length
      ? `Spoken / canonical Voice path: ${formatArrowPath(detected.value)}.`
      : asText(detection.voicePath)
        ? `Spoken / canonical Voice path: ${asText(detection.voicePath)}.`
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

  const plainStructuralPaths = joinParts([
    isPresent<unknown[]>(surface) && Array.isArray(surface.value) && surface.value.length
      ? `Written vowel sequence: ${formatArrowPath(surface.value)}.`
      : asText(detection.voicePathSurface)
        ? `Written vowel sequence: ${asText(detection.voicePathSurface)}.`
        : null,
    isPresent<unknown[]>(detected) && Array.isArray(detected.value) && detected.value.length
      ? `Spoken / canonical Voice path: ${formatArrowPath(detected.value)}.`
      : asText(detection.voicePath)
        ? `Spoken / canonical Voice path: ${asText(detection.voicePath)}.`
        : null,
    isPresent<unknown[]>(functional) && Array.isArray(functional.value) && functional.value.length
      ? `Analysis path: ${formatArrowPath(functional.value)}.`
      : asText(detection.voicePathFunctional)
        ? `Analysis path: ${asText(detection.voicePathFunctional)}.`
        : null,
  ]);

  // --- Evidence summary (truth posture) ---
  const evidenceLines = joinParts([
    renderMaybeList('Normalization / transformation', evidence.normalizationSteps),
    renderMaybeList('Ops', evidence.ops),
    renderMaybeList('Signals', evidence.signals),
    renderMaybeList('Notes', evidence.notes),
  ]);

  return (
    <div data-testid="meaning-panel" className="rounded-[12px] border border-[#303a45] bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
      <p className="text-sm leading-6 text-[#d7dde7]">
        This view reports spelling and Voice structure from the analysis; it does not by itself establish a word meaning or origin.
      </p>
      {plainStructuralPaths ? (
        <p data-testid="meaning-structural-paths" className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#f5f7fb]">
          {plainStructuralPaths}
        </p>
      ) : (
        <p data-testid="meaning-structural-paths-unavailable" className="mt-3 text-sm text-[#aeb7c5]">
          No written or spoken path was produced for this analysis.
        </p>
      )}
      <details data-testid="meaning-technical-details" className="mt-3 rounded-lg border border-[#303a45] bg-[#0d1117]">
        <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-[#cfe6ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bb7a]">
          Technical structure and evidence
        </summary>
        <div className="space-y-2 border-t border-[#303a45] p-3 text-xs leading-5 text-[#d7dde7]">
          <p data-testid="meaning-technical-summary">{sentence}</p>
          {sub ? <p className="whitespace-pre-wrap font-mono text-[#9fb1bf]">{sub}</p> : null}
          <p data-testid="meaning-technical-evidence" className="whitespace-pre-wrap">{evidenceLines || "No additional evidence details were emitted."}</p>
        </div>
      </details>
    </div>
  );
}
