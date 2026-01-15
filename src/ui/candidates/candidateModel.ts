import type { TelemetryViewModel, CandidateRowVM } from "../telemetry/types";

export interface UICandidateRow {
  id: string;
  language: string;
  form: string;
  status?: string | null;
  vowelPath?: string | null;
  functionalStatement?: string | null;
  raw: any; // for Copy Candidate JSON
}

// --- v0.1.1+: VM-first adapter lock ---

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
