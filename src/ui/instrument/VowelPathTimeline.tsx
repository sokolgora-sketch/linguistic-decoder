import React from 'react';
import type { PresentOrMissing, Vowel } from '../telemetry/types';

type Props = {
  detected: PresentOrMissing<Vowel[]>;
  surface: PresentOrMissing<Vowel[]>;
  functional: PresentOrMissing<Vowel[]>;
  delta: 'MATCH' | 'SHIFT' | 'DIVERGE' | 'NOT_EMITTED';
  normalizationSteps?: PresentOrMissing<string[]>;
};

function isPresent<T>(
  m: PresentOrMissing<T> | null | undefined
): m is { kind: 'present'; value: T } {
  if (!m || typeof m !== 'object') return false;
  const r = m as Record<string, unknown>;
  return r['kind'] === 'present';
}

function formatPath(path: Vowel[]): string {
  return path.join(' → ');
}

function PathRow({ label, maybe }: { label: string; maybe: PresentOrMissing<Vowel[]> }) {
  if (!isPresent(maybe) || !maybe.value?.length) {
    return (
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-2 gap-y-1 text-sm">
        <div className="min-w-0 flex-1 text-neutral-300 [overflow-wrap:anywhere]">{label}</div>
        <div className="min-w-0 max-w-full text-neutral-500 [overflow-wrap:anywhere]">Not available</div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-2 gap-y-1 text-sm">
      <div className="min-w-0 flex-1 text-neutral-300 [overflow-wrap:anywhere]">{label}</div>
      <div className="min-w-0 max-w-full font-mono text-neutral-100 [overflow-wrap:anywhere]">{formatPath(maybe.value)}</div>
    </div>
  );
}

function DeltaBadge({ delta }: { delta: Props['delta'] }) {
  const text =
    delta === 'MATCH'
      ? 'Paths match'
      : delta === 'SHIFT'
        ? 'Paths shifted'
        : delta === 'DIVERGE'
          ? 'Paths differ'
          : 'Comparison unavailable';

  return (
    <span className="inline-flex items-center rounded-full border border-neutral-600 px-2 py-0.5 text-xs text-neutral-200">
      {text}
    </span>
  );
}

function NormalizationRecord({
  steps,
}: {
  steps: Props['normalizationSteps'];
}) {
  if (!isPresent(steps) || steps.value.length === 0) return null;

  return (
    <details className="mt-3 border-t border-neutral-800 pt-3">
      <summary className="cursor-pointer text-sm text-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bb7a]">
        View exact normalization steps
      </summary>
      <div className="mt-2 space-y-1 break-words font-mono text-sm text-neutral-100">
        {steps.value.map((step, index) => (
          <div key={`${index}-${step}`}>{step}</div>
        ))}
      </div>
    </details>
  );
}

export function VowelPathTimeline(props: Props) {
  const detected = props.detected;
  const surface = props.surface;
  const functional = props.functional;

  return (
    <div className="min-w-0 [overflow-wrap:anywhere] rounded-xl border border-neutral-700 bg-neutral-900/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-neutral-100">Voice paths</div>
        <DeltaBadge delta={props.delta} />
      </div>

      <div className="space-y-2">
        <PathRow label="Detected Voice sequence" maybe={detected} />
        <PathRow label="Written vowel sequence" maybe={surface} />
        <PathRow label="Functional or normalized sequence" maybe={functional} />
      </div>

      <NormalizationRecord steps={props.normalizationSteps} />

      <div className="mt-3 text-xs leading-5 text-neutral-500">
        These are analysis paths. They do not by themselves establish a word&apos;s meaning or origin.
      </div>
    </div>
  );
}
