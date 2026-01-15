import React from 'react';
import type { PresentOrMissing, Vowel } from '../telemetry/types';

type Props = {
  detected: PresentOrMissing<Vowel[]>;
  surface: PresentOrMissing<Vowel[]>;
  functional: PresentOrMissing<Vowel[]>;
  delta: 'MATCH' | 'DIVERGE' | 'NOT_EMITTED';
};

function isPresent<T>(m: PresentOrMissing<T>): m is { kind: 'present'; value: T } {
  return (m as any)?.kind === 'present';
}

function formatPath(path: Vowel[]): string {
  return path.join(' → ');
}

function PathRow({ label, maybe }: { label: string; maybe: PresentOrMissing<Vowel[]> }) {
  if (!isPresent(maybe) || !maybe.value?.length) {
    return (
      <div className="flex items-center justify-between text-sm">
        <div className="text-neutral-300">{label}</div>
        <div className="text-neutral-500">not emitted</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-neutral-300">{label}</div>
      <div className="font-mono text-neutral-100">{formatPath(maybe.value)}</div>
    </div>
  );
}

function DeltaBadge({ delta }: { delta: Props['delta'] }) {
  const text = delta === 'MATCH' ? 'MATCH' : delta === 'DIVERGE' ? 'DIVERGE' : 'NOT EMITTED';

  return (
    <span className="inline-flex items-center rounded-full border border-neutral-600 px-2 py-0.5 text-xs text-neutral-200">
      {text}
    </span>
  );
}

export function VowelPathTimeline(props: Props) {
  const detected = props.detected;
  const surface = props.surface;
  const functional = props.functional;

  const detectedPresent = isPresent(detected) && !!detected.value?.length;
  const surfacePresent = isPresent(surface) && !!surface.value?.length;
  const functionalPresent = isPresent(functional) && !!functional.value?.length;

  const deltaComputed: Props['delta'] =
    !detectedPresent || !surfacePresent || !functionalPresent
      ? 'NOT_EMITTED'
      : formatPath(surface.value) === formatPath(functional.value)
        ? 'MATCH'
        : 'DIVERGE';

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-neutral-100">Vowel Path Timeline (Detected vs Interpreted)</div>
        <DeltaBadge delta={deltaComputed} />
      </div>

      {!detectedPresent ? (
        <div className="text-sm text-neutral-400">No detected voice path.</div>
      ) : (
        <div className="mb-3 font-mono text-sm text-neutral-100">{formatPath(detected.value)}</div>
      )}

      <div className="space-y-2">
        <PathRow label="Detected" maybe={detected} />
        <PathRow label="Surface" maybe={surface} />
        <PathRow label="Functional" maybe={functional} />
      </div>

      <div className="mt-3 text-xs text-neutral-500">source: telemetry VM (read-only)</div>
    </div>
  );
}
