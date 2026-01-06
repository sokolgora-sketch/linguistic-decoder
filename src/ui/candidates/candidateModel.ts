import type { TelemetryViewModel, CandidateRowVM } from "../instrument/types";

export interface UICandidateRow {
  id: string;
  language: string;
  form: string;
  status?: string | null;
  vowelPath?: string | null;
  functionalStatement?: string | null;
  raw: any; // for Copy Candidate JSON
}

function str(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

// --- v0.1 (legacy): raw payload parsing (kept for now, but InstrumentPanel should use VM variant) ---
export function buildCandidateRows(result: any): UICandidateRow[] {
  const arr = Array.isArray(result?.candidates) ? result.candidates : [];
  return arr.map((c: any, idx: number) => ({
    id: str(c?.id) ?? `cand_${idx}`,
    language: str(c?.language) ?? "Unknown",
    form: str(c?.form) ?? "—",
    status: str(c?.status),
    vowelPath: str(c?.vowelPath),
    functionalStatement: str(c?.functionalStatement) ?? str(c?.function),
    raw: c,
  }));
}

// --- v0.1.1: VM-first adapter lock ---
function pomStr(x: { kind: "present"; value: string } | { kind: "missing"; missing: string; note?: string }): string | null {
  return x.kind === "present" ? x.value : null;
}

function pomVowelPath(x: any): string | null {
  return x?.kind === "present" && Array.isArray(x.value) ? x.value.join("-") : null;
}

export function buildCandidateRowsFromVM(vm: TelemetryViewModel): UICandidateRow[] {
  return (vm.candidates ?? []).map((c: CandidateRowVM) => ({
    id: c.id,
    language: pomStr(c.language) ?? "Unknown",
    form: pomStr(c.form) ?? "—",
    status: null, // do not invent; only show when engine emits later
    vowelPath: pomVowelPath(c.vowelPath),
    functionalStatement: pomStr(c.functionalStatement),
    raw: c.raw,
  }));
}
