// VM-only export bundle for sharing / audit.
// Must NOT read raw payload. Only consume Telemetry VM + already-VM-shaped models.

export type EvidencePackageV01 = {
  version: "evidence_package.v0.1";
  word: string;
  normalizedWord?: string;
  mode?: string;
  engineVersion?: string;

  // Minimal, human+machine useful summary
  summary?: {
    voicePath?: string;
    voicePathSurface?: string;
    voicePathFunctional?: string;
    voicePathDelta?: string;
    signalsCount?: number;
  };

  // Telemetry excerpts (already VM-only)
  counts?: any;
  ledger?: any;

  // Optional sections
  originClaim?: any;
  rootMap?: any;
  resonanceProfileV1?: any;

  // Diagnostics
  notes?: string[];
};

function safeStr(x: any): string {
  if (x == null) return "";
  if (typeof x === "string") return x;
  if (typeof x === "number" || typeof x === "boolean") return String(x);
  if (typeof x === "object" && (x.kind === "present" || x.kind === "missing")) {
    return x.kind === "present" ? safeStr(x.value) : "";
  }
  return "";
}

export function buildEvidencePackageFromVM(vm: any, opts?: { ledgerModel?: any }): EvidencePackageV01 {
  const r: any = vm?.readout ?? {};

  const word = safeStr(vm?.wordShown) || safeStr(r?.word) || safeStr(r?.inputWord) || "";
  const normalizedWord =
    safeStr(r?.normalizedWord) || safeStr(r?.normalized) || safeStr(r?.basisNormalized) || "";

  const engineVersion = safeStr(vm?.engineVersion) || safeStr(r?.engineVersion) || "";
  const mode = safeStr(vm?.mode) || safeStr(r?.mode) || "";

  const pkg: EvidencePackageV01 = {
    version: "evidence_package.v0.1",
    word,
    normalizedWord: normalizedWord || undefined,
    mode: mode || undefined,
    engineVersion: engineVersion || undefined,
    summary: {
      voicePath: Array.isArray(r?.voicePath) ? r.voicePath.join(" → ") : safeStr(r?.voicePath),
      voicePathSurface: Array.isArray(r?.voicePathSurface)
        ? r.voicePathSurface.join(" → ")
        : safeStr(r?.voicePathSurface),
      voicePathFunctional: Array.isArray(r?.voicePathFunctional)
        ? r.voicePathFunctional.join(" → ")
        : safeStr(r?.voicePathFunctional),
      voicePathDelta: safeStr(r?.voicePathDelta),
      signalsCount: typeof vm?.signals?.length === "number" ? vm.signals.length : undefined,
    },
    counts: vm?.readout ? { ...(vm?.readout as any) }?.counts : undefined, // defensive; may be undefined
    ledger: opts?.ledgerModel ?? undefined,
    originClaim: vm?.originClaim?.kind === "present" ? (vm.originClaim as any).value : undefined,
    rootMap:
      vm?.rootMap?.kind === "present"
        ? (vm.rootMap as any).value
        : vm?.rootMap?.kind === "missing"
          ? { missing: (vm.rootMap as any).missing, note: (vm.rootMap as any).note }
          : undefined,
    resonanceProfileV1:
      vm?.resonanceProfileV1?.kind === "present"
        ? (vm.resonanceProfileV1 as any).value
        : vm?.resonanceProfileV1 ?? undefined,
    notes: [],
  };

  // Light cleanup: remove empty summary keys
  if (pkg.summary) {
    for (const k of Object.keys(pkg.summary)) {
      if ((pkg.summary as any)[k] == null || (pkg.summary as any)[k] === "") delete (pkg.summary as any)[k];
    }
    if (Object.keys(pkg.summary).length === 0) delete pkg.summary;
  }

  if (!pkg.normalizedWord) delete pkg.normalizedWord;

  return pkg;
}
