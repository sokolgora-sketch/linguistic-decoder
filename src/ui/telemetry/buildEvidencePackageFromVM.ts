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
    voicePathCarrier?: string;
    voicePathDelta?: string;
    voicePathCarrierDelta?: string;
    signalsCount?: number;
  };

  // Telemetry excerpts (already VM-only)
  counts?: any;
  ledger?: any;

  // Optional sections
  originClaim?: any;
  rootMap?: any;
  resonanceProfileV1?: any;
  sevenPrinciplesSpectrum?: any;

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

function unwrapPOM(x: any): any {
  if (x && typeof x === "object" && (x.kind === "present" || x.kind === "missing")) {
    return x.kind === "present" ? x.value : undefined;
  }
  return x;
}

function joinVoicesArrow(xs: any): string | undefined {
  const v = unwrapPOM(xs);
  if (!v) return undefined;
  if (Array.isArray(v)) {
    const parts = v.map((x) => safeStr(x)).filter(Boolean);
    return parts.length ? parts.join(" → ") : undefined;
  }
  const s = safeStr(v);
  return s ? s : undefined;
}

function deriveMaskVoicePath(readout: any): string | undefined {
  const r = readout ?? {};
  return (
    joinVoicesArrow(r?.voicePathSurface) ??
    joinVoicesArrow(r?.heartInstrumentV1?.surfaceVowels) ??
    joinVoicesArrow(r?.evidence?.surfaceVowelsRaw) ??
    joinVoicesArrow(r?.evidence?.surfaceVowels)
  );
}

function deriveCarrierVoicePath(readout: any): string | undefined {
  const r = readout ?? {};
  const phon = unwrapPOM(r?.phoneticIpaV0_1);
  return joinVoicesArrow(phon?.voices);
}

function normalizeVoicePathForComparison(
  path: string | undefined,
): string | undefined {
  if (!path) return undefined;

  const compact =
    path
      .trim()
      .toUpperCase()
      .replace(/[→–—]/g, "-")
      .replace(/\s+/g, "");

  if (!compact) return undefined;

  const parts =
    compact.includes("-")
      ? compact
          .split("-")
          .filter(Boolean)
      : Array.from(compact);

  const allowed =
    new Set([
      "A",
      "E",
      "I",
      "O",
      "U",
      "Y",
      "Ë",
    ]);

  if (
    parts.length === 0 ||
    !parts.every((part) =>
      allowed.has(part),
    )
  ) {
    return undefined;
  }

  return parts.join("-");
}

function pickSignalsCountFromVM(vm: any): number | undefined {
  const unwrap = (x: any) =>
    x && typeof x === "object" && (x.kind === "present" || x.kind === "missing")
      ? x.kind === "present"
        ? x.value
        : undefined
      : x;

  // 1) SSOT: readout.counts.signals (often wrapped: {kind,value})
  const cRaw = unwrap(vm?.readout?.counts?.signals);
  if (typeof cRaw === "number" && Number.isFinite(cRaw)) return cRaw;
  if (typeof cRaw === "string") {
    const n = Number(cRaw);
    if (Number.isFinite(n)) return n;
  }

  // 2) Back-compat: vm.signals (older VM/tests)
  const topSignals = unwrap(vm?.signals);
  if (Array.isArray(topSignals)) return topSignals.length;

  // 3) Evidence fallbacks (vm.evidence or vm.readout.evidence)
  const ev0 = unwrap(vm?.evidence);
  const ev1 = unwrap(vm?.readout?.evidence);
  const ev = ev0 ?? ev1;

  const evSignals = ev ? unwrap(ev.signals) : undefined;
  if (Array.isArray(evSignals)) return evSignals.length;

  const evSignalsNotes = ev ? unwrap(ev["signals+notes"]) : undefined;
  if (Array.isArray(evSignalsNotes)) return evSignalsNotes.length;

  return undefined;
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
      signalsCount: pickSignalsCountFromVM(vm),
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
    sevenPrinciplesSpectrum: (() => {
      // Spectrum currently lives on readout in the Instrument VM,
      // but allow future top-level placement too.
      const sps =
        (vm as any)?.sevenPrinciplesSpectrum ??
        (vm as any)?.readout?.sevenPrinciplesSpectrum;

      if (!sps || typeof sps !== "object") return undefined;

      const surface =
        (sps as any).surface && (sps as any).surface.kind === "present"
          ? (sps as any).surface.value
          : undefined;

      const functional =
        (sps as any).functional && (sps as any).functional.kind === "present"
          ? (sps as any).functional.value
          : undefined;

      const delta = (sps as any).delta;

      // Omit if totally empty
      if (!surface && !functional && !delta) return undefined;

      return { surface, functional, delta };
    })(),
    notes: [],
  };

  // If IPA carrier voices exist, preserve the surface/functional delta
  // and expose the independent surface/carrier comparison separately.
  const maskPath = deriveMaskVoicePath(r);
  const carrierPath = deriveCarrierVoicePath(r);
  if (pkg.summary && carrierPath) {
    pkg.summary.voicePathCarrier =
      carrierPath;

    if (
      !pkg.summary.voicePathSurface &&
      maskPath
    ) {
      pkg.summary.voicePathSurface =
        maskPath;
    }

    const normalizedMaskPath =
      normalizeVoicePathForComparison(
        maskPath,
      );

    const normalizedCarrierPath =
      normalizeVoicePathForComparison(
        carrierPath,
      );

    if (
      normalizedMaskPath &&
      normalizedCarrierPath
    ) {
      pkg.summary.voicePathCarrierDelta =
        normalizedMaskPath ===
        normalizedCarrierPath
          ? "MATCH"
          : "DIVERGE";
    }
  }

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
