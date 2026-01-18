import type { TelemetryViewModel, CandidateRowVM } from "../telemetry/types";

export interface UICandidateRow {
  id: string;
  language: string;
  form: string;
  status?: string | null;
  vowelPath?: string | null;
  functionalStatement?: string | null;
  deepRootHeartGateStatus?: string | null;
  deepRootHeartGateReasons?: string[] | null;
  raw: any; // for Copy Candidate JSON
}

// --- v0.1.1+: VM-first adapter lock ---

function pomStr(
  x: { kind: "present"; value: string } | { kind: "missing"; missing: string; note?: string }
): string | null {
  return x.kind === "present" ? x.value : null;
}

function pomVowelPath(x: any): string | null {
  return x?.kind === "present" && Array.isArray(x.value) ? x.value.join("-") : null;
}

function pomGateStatus(x: any): string | null {
  // x is PresentOrMissing<DeepRootHeartGateV01>
  if (x?.kind !== "present") return null;
  const s = x?.value?.status;
  return typeof s === "string" ? s : null;
}

function pomGateReasons(x: any): string[] | null {
  if (x?.kind !== "present") return null;
  const r = x?.value?.reasonCodes;
  if (!Array.isArray(r)) return null;
  return r.map((v: any) => String(v));
}

export function buildCandidateRowsFromVM(vm: TelemetryViewModel): UICandidateRow[] {
  return (vm.candidates ?? []).map((c: CandidateRowVM) => ({
    id: c.id,
    language: pomStr(c.language) ?? "Unknown",
    form: pomStr(c.form) ?? "—",
    status: null, // do not invent; only show when engine emits later
    vowelPath: pomVowelPath(c.vowelPath),
    functionalStatement: pomStr(c.functionalStatement),
      deepRootHeartGateStatus: pomGateStatus((c as any).deepRootHeartGate),
      deepRootHeartGateReasons: pomGateReasons((c as any).deepRootHeartGate),
    raw: c.raw,
  }));
}
