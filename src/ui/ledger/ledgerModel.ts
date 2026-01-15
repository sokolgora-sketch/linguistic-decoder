// src/ui/ledger/ledgerModel.ts
import type { PresentOrMissing, TelemetryViewModel } from '../telemetry/types';

export type LedgerState = 'present' | 'none' | 'missing';

export type LedgerSectionKey = 'normalization' | 'ops' | 'signals';

export interface LedgerSection {
  key: LedgerSectionKey;
  title: string;
  state: LedgerState;
  items: string[];
  // Optional: where it was sourced from (dev-only; do not show to users unless you add a Debug toggle)
  source?: string | null;
}

export interface EvidenceLedgerModel {
  sections: LedgerSection[];
}

// ---- helpers (VM-first) ----

function stateFromPOMArray(x: PresentOrMissing<string[]>): { state: LedgerState; items: string[] } {
  if (x.kind === 'present') {
    if (x.value.length === 0) return { state: 'none', items: [] };
    return { state: 'present', items: x.value };
  }
  // missing
  return x.missing === 'none' ? { state: 'none', items: [] } : { state: 'missing', items: [] };
}

/**
 * signals section in UI historically merged signals + notes.
 * VM keeps them separate; we preserve the UI behavior by concatenating them.
 */
function mergeSignalsAndNotes(
  signals: PresentOrMissing<string[]>,
  notes: PresentOrMissing<string[]>
): { state: LedgerState; items: string[] } {
  const s = stateFromPOMArray(signals);
  const n = stateFromPOMArray(notes);

  // If either is present with items, present wins.
  const items = [...(s.state === 'present' ? s.items : []), ...(n.state === 'present' ? n.items : [])];
  if (items.length > 0) return { state: 'present', items };

  // If neither present: if either is "none", treat as none; else missing.
  if (s.state === 'none' || n.state === 'none') return { state: 'none', items: [] };
  return { state: 'missing', items: [] };
}

const MISSING_UNAVAILABLE: PresentOrMissing<string[]> = { kind: 'missing', missing: 'none' };

/**
 * v0.1.1: Build the Evidence/Ops ledger model from the Telemetry VM only.
 * This enforces: evidence is authority, and missing is explicit.
 */
export function buildEvidenceLedgerModelFromVM(vm: TelemetryViewModel): EvidenceLedgerModel {
  const e = vm.evidence;

  const norm = stateFromPOMArray(e?.normalizationSteps ?? MISSING_UNAVAILABLE);
  const ops = stateFromPOMArray(e?.ops ?? MISSING_UNAVAILABLE);
  const sig = mergeSignalsAndNotes(e?.signals ?? MISSING_UNAVAILABLE, e?.notes ?? MISSING_UNAVAILABLE);

  return {
    sections: [
      {
        key: 'normalization',
        title: 'Normalization',
        state: norm.state,
        items: norm.items,
        source: 'vm.evidence.normalizationSteps',
      },
      {
        key: 'ops',
        title: 'Ops / Transforms',
        state: ops.state,
        items: ops.items,
        source: 'vm.evidence.ops',
      },
      {
        key: 'signals',
        title: 'Signals / Notes',
        state: sig.state,
        items: sig.items,
        source: 'vm.evidence.signals+notes',
      },
    ],
  };
}

/**
 * NOTE (instrument contract):
 * Signals + Notes are rendered as a combined ledger section.
 * If the combined list is empty, the section state is "none" (None emitted),
 * even if one of the sources (e.g. signals) is missing.
 */
