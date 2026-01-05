// src/ui/ledger/ledgerModel.ts
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

function asStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const out: string[] = [];
  for (const v of value) {
    if (typeof v === "string") out.push(v);
  }
  return out;
}

/**
 * Extracts a string[] from a nested path. Returns:
 * - null if path missing
 * - [] if present but empty
 * - ["..."] if present with values
 */
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
    if (raw === null) continue; // missing, try next
    const arr = asStringArray(raw);
    if (arr === null) continue; // wrong type, treat as missing
    if (arr.length === 0) return { state: "none", items: [], source: c.source };
    return { state: "present", items: arr, source: c.source };
  }
  return { state: "missing", items: [] };
}

/**
 * Build the Evidence/Ops ledger model from the full Analyze result.
 * This is intentionally conservative: it only reads arrays of strings.
 */
export function buildEvidenceLedgerModel(result: any): EvidenceLedgerModel {
  // NOTE: adjust these paths to match your real contract once you confirm the exact field names.
  // These are common, safe guesses. If none exist, UI will correctly show "Not emitted".
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
      {
        key: "normalization",
        title: "Normalization",
        state: norm.state,
        items: norm.items,
        source: norm.source ?? null,
      },
      {
        key: "ops",
        title: "Ops / Transforms",
        state: ops.state,
        items: ops.items,
        source: ops.source ?? null,
      },
      {
        key: "signals",
        title: "Signals / Notes",
        state: sig.state,
        items: sig.items,
        source: sig.source ?? null,
      },
    ],
  };
}
