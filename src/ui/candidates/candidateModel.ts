import type { TelemetryViewModel, CandidateRowVM } from "../telemetry/types";

export interface UICandidateRow {
  id: string;
  language: string;
  form: string;
  status?: string | null;
  sourceKind?: string | null;

  embryo?: string | null;
  plainStandaloneGloss?: string | null;
  claimType?: string | null;
  validationOutcome?: string | null;
  rankGroup?: string | null;
  claimBoundary?: string | null;
  userDecisionPosture?: string | null;

  discoveryStatus?: string | null;
  independentStandaloneMeaning?: string | null;
  functionalSupportStatus?: string | null;
  historicalOriginClaim?: string | null;
  candidateTruthClaim?: string | null;

  vowelPath?: string | null;
  functionalStatement?: string | null;
  deepRootHeartGateStatus?: string | null;
  deepRootHeartGateReasons?: string[] | null;
  deepRootHeartGateEvidenceRefs?: string[] | null;
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

function pomGateEvidenceRefs(g: any): string[] | null {
  // VM shape: PresentOrMissing<DeepRootHeartGateV01>
  // We only accept a string[]; otherwise null.
  const refs = g?.kind === "present" ? g?.value?.evidenceRefs : null;
  if (!Array.isArray(refs)) return null;
  const out = refs.map((x) => String(x)).map((s) => s.trim()).filter(Boolean);
  return out.length ? out : null;
}

export function buildCandidateRowsFromVM(vm: TelemetryViewModel): UICandidateRow[] {
  return (vm.candidates ?? []).map((c: CandidateRowVM) => ({
    id: c.id,
    language: pomStr(c.language) ?? "Unknown",
    form: pomStr(c.form) ?? "—",
    status: null, // do not invent; only show when engine emits later
    sourceKind: c.sourceKind ? pomStr(c.sourceKind) : null, // v0.3: provenance surfaced; guard undefined for partial/mock VMs

    embryo:
      c.embryo
        ? pomStr(c.embryo)
        : null,

    plainStandaloneGloss:
      c.plainStandaloneGloss
        ? pomStr(c.plainStandaloneGloss)
        : null,

    claimType:
      c.claimType
        ? pomStr(c.claimType)
        : null,

    validationOutcome:
      c.validationOutcome
        ? pomStr(c.validationOutcome)
        : null,

    rankGroup:
      c.rankGroup
        ? pomStr(c.rankGroup)
        : null,

    claimBoundary:
      c.claimBoundary
        ? pomStr(c.claimBoundary)
        : null,

    userDecisionPosture:
      c.userDecisionPosture
        ? pomStr(c.userDecisionPosture)
        : null,

    discoveryStatus:
      c.discoveryStatus
        ? pomStr(c.discoveryStatus)
        : undefined,

    independentStandaloneMeaning:
      c.independentStandaloneMeaning?.kind === "present"
        ? c.independentStandaloneMeaning.value
        : undefined,

    functionalSupportStatus:
      c.functionalSupportStatus
        ? pomStr(c.functionalSupportStatus)
        : undefined,

    historicalOriginClaim:
      c.historicalOriginClaim
        ? pomStr(c.historicalOriginClaim)
        : undefined,

    candidateTruthClaim:
      c.candidateTruthClaim
        ? pomStr(c.candidateTruthClaim)
        : undefined,

    vowelPath: pomVowelPath(c.vowelPath),
    functionalStatement: pomStr(c.functionalStatement),
      deepRootHeartGateStatus: pomGateStatus((c as any).deepRootHeartGate),
      deepRootHeartGateReasons: pomGateReasons((c as any).deepRootHeartGate),
      deepRootHeartGateEvidenceRefs: pomGateEvidenceRefs((c as any).deepRootHeartGate),
    raw: c.raw,
  }));
}
