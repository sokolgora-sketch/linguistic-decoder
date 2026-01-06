// src/ui/ledger/ledgerModel.ts
import type { PresentOrMissing, TelemetryViewModel } from "../instrument/types";

export type LedgerState = "present" | "none" | "missing";

export type LedgerSectionKey = "normalization" | "ops" | "signals";

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
  if (x.kind === "present") {
    if (x.value.length === 0) return { state: "none", items: [] };
    return { state: "present", items: x.value };
  }
  // missing
  return x.missing === "none"
    ? { state: "none", items: [] }
    : { state: "missing", items: [] };
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
  const items = [...(s.state === "present" ? s.items : []), ...(n.state === "present" ? n.items : [])];
  if (items.length > 0) return { state: "present", items };

  // If neither present: if either is "none", treat as none; else missing.
  if (s.state === "none" || n.state === "none") return { state: "none", items: [] };
  return { state: "missing", items: [] };
}

/**
 * v0.1.1: Build the Evidence/Ops ledger model from the Telemetry VM only.
 * This enforces: evidence is authority, and missing is explicit.
 */
export function buildEvidenceLedgerModelFromVM(vm: TelemetryViewModel): EvidenceLedgerModel {
  const norm = stateFromPOMArray(vm.evidence.normalizationSteps);
  const ops = stateFromPOMArray(vm.evidence.ops);
  const sig = mergeSignalsAndNotes(vm.evidence.signals, vm.evidence.notes);

  return {
    sections: [
      {
        key: "normalization",
        title: "Normalization",
        state: norm.state,
        items: norm.items,
        source: "vm.evidence.normalizationSteps",
      },
      {
        key: "ops",
        title: "Ops / Transforms",
        state: ops.state,
        items: ops.items,
        source: "vm.evidence.ops",
      },
      {
        key: "signals",
        title: "Signals / Notes",
        state: sig.state,
        items: sig.items,
        source: "vm.evidence.signals+notes",
      },
    ],
  };
}

// ---- legacy (raw parsing) kept temporarily to avoid touching other call sites ----

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const out: string[] = [];
  for (const v of value) {
    if (typeof v === "string") out.push(v);
  }
  return out;
}

function getPath(obj: any, path: string[]): unknown {
  let cur: any = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== "object") return null;
    cur = cur[key];
  }
  return cur ?? null;
}

type CandidateSource = { source: string; path: string[] };

function extractFirstStringArray(
  root: any,
  candidates: CandidateSource[]
): { state: LedgerState; items: string[]; source?: string } {
  for (const c of candidates) {
    const raw = getPath(root, c.path);
    if (raw === null) continue;
    const arr = asStringArray(raw);
    if (arr === null) continue;
    if (arr.length === 0) return { state: "none", items: [], source: c.source };
    return { state: "present", items: arr, source: c.source };
  }
  return { state: "missing", items: [] };
}

export function buildEvidenceLedgerModel(result: any): EvidenceLedgerModel {
  const normalizationCandidates: CandidateSource[] = [
    { source: "evidence.normalizationSteps", path: ["evidence", "normalizationSteps"] },
    { source: "raw.normalizationSteps", path: ["raw", "normalizationSteps"] },
    { source: "normalizationSteps", path: ["normalizationSteps"] },
    { source: "evidence.normalization", path: ["evidence", "normalization"] },
    { source: "raw.normalization", path: ["raw", "normalization"] },
    { source: "heart.normalization", path: ["heart", "normalization"] },
    { source: "meta.normalization", path: ["engine_meta", "normalization"] },
  ];

  const opsCandidates: CandidateSource[] = [
    { source: "evidence.ops", path: ["evidence", "ops"] },
    { source: "evidence.transforms", path: ["evidence", "transforms"] },
    { source: "raw.ops", path: ["raw", "ops"] },
    { source: "heart.ops", path: ["heart", "ops"] },
  ];

  const signalsCandidates: CandidateSource[] = [
    { source: "evidence.signals", path: ["evidence", "signals"] },
    { source: "evidence.notes", path: ["evidence", "notes"] },
    { source: "raw.signals", path: ["raw", "signals"] },
    { source: "raw.notes", path: ["raw", "notes"] },
    { source: "meta.signals", path: ["engine_meta", "signals"] },
  ];

  const norm = extractFirstStringArray(result, normalizationCandidates);
  const ops = extractFirstStringArray(result, opsCandidates);
  const sig = extractFirstStringArray(result, signalsCandidates);

  return {
    sections: [
      { key: "normalization", title: "Normalization", state: norm.state, items: norm.items, source: norm.source ?? null },
      { key: "ops", title: "Ops / Transforms", state: ops.state, items: ops.items, source: ops.source ?? null },
      { key: "signals", title: "Signals / Notes", state: sig.state, items: sig.items, source: sig.source ?? null },
    ],
  };
}
