"use client";

import { normalizePrinciplesToLabels } from "@/v1/principles.vocab.v0.1";
/**
 * UI contract adapter: raw analyze-v1 payload → TelemetryViewModel (VM).
 *
 * Rules:
 * - UI must consume ONLY the VM (no raw payload parsing in components).
 * - Keep adapters deterministic + defensive.
 * - PresentOrMissing prevents silent emptiness.
 */

import { adaptSoundRootsToVM } from "@/ui/telemetry/soundRootsVM.v0.1";

import type {
  CandidateRowVM,
  DecompositionItemVM,
  MathTelemetryVM,
  OriginClaimGatesVM,
  PresentOrMissing,
  RejectionItemVM,
  TelemetryViewModel,
  RootMapVM,
  Vowel,
  PhoneticIpaV0_1VM,
  ResonanceProfileV1VM,
} from "../telemetry/types";
import type { RootMapV1 } from "@/shared/deepRoot.rootMap.v1";
import { computeDeepRootHeartGateV01 } from "@/shared/deepRootHeartGate.v0.1.compute";
import { SEVEN_PRINCIPLES, vowelToIndex1, vowelToRingIndex, vowelToColor, vowelToNote } from "@/shared/sevenPrinciples.v1";
import type { AnalysisStatusV0_1VM } from "../telemetry/types";

type ParseRootMapResult = { ok: true; value: RootMapV1 } | { ok: false; reason: string };

function parseRootMapV1(v: unknown): ParseRootMapResult {
  if (!isRecord(v)) return { ok: false, reason: "rootMap expected object" };

  const tokens = v["tokens"];
  const keys = v["keys"];
  const composedMeaning = v["composedMeaning"];

  if (!Array.isArray(tokens)) return { ok: false, reason: "rootMap.tokens expected array" };
  if (!Array.isArray(keys)) return { ok: false, reason: "rootMap.keys expected array" };
  if (typeof composedMeaning !== "string") return { ok: false, reason: "rootMap.composedMeaning expected string" };

  type RootMapTokenRole = Exclude<NonNullable<RootMapV1["tokens"]>[number]["role"], undefined>;
  type RootMapKeyStatus = NonNullable<RootMapV1["keys"]>[number]["status"];
  type RootMapSpanSource = NonNullable<RootMapV1["spans"]>[number]["source"];

  const normalizeRootTokenRole = (value: unknown): RootMapTokenRole | null => {
    switch (String(value ?? "")) {
      case "action":
      case "Action":
        return "action";
      case "instrument":
      case "Instrument":
      case "Function":
        return "instrument";
      default:
        return null;
    }
  };

  const normalizeRootKeyStatus = (value: unknown): RootMapKeyStatus | null => {
    if (typeof value !== "string") return null;

    switch (value) {
      case "supported":
        return "supported";
      case "dialect_attested_pending_review":
        return "dialect_attested_pending_review";
      case "carrier_only":
        return "carrier_only";
      case "candidate_only":
        return "candidate_only";
      default:
        return null;
    }
  };

  const normalizeRootSpanSource = (value: unknown): RootMapSpanSource | null => {
    if (typeof value !== "string") return null;

    switch (value) {
      case "surface":
        return "surface";
      case "normalized":
        return "normalized";
      default:
        return null;
    }
  };

  // tokens: [{ token: string, role?: string, vowel_path?: string }]
  for (const t of tokens) {
    if (!isRecord(t)) return { ok: false, reason: "rootMap.tokens item expected object" };

    const token = t["token"];
    const role = t["role"];
    const vowelPath = t["vowel_path"];

    const normalizedRole = role == null ? null : normalizeRootTokenRole(role);

    if (typeof token !== "string") return { ok: false, reason: "rootMap.tokens[].token expected string" };
    if (role != null && normalizedRole == null)
      return { ok: false, reason: "rootMap.tokens[].role expected RootTokenRoleV1" };
    if (vowelPath != null && typeof vowelPath !== "string")
      return { ok: false, reason: "rootMap.tokens[].vowel_path expected string" };
  }

  // keys: [{ token, language, gloss, evidence[], status, ops?[] }]
  for (const k of keys) {
    if (!isRecord(k)) return { ok: false, reason: "rootMap.keys item expected object" };

    const token = k["token"];
    const language = k["language"];
    const gloss = k["gloss"];
    const evidence = k["evidence"];
    const status = k["status"];
    const ops = k["ops"];
    const normalizedStatus = normalizeRootKeyStatus(status);

    if (typeof token !== "string") return { ok: false, reason: "rootMap.keys[].token expected string" };
    if (typeof language !== "string") return { ok: false, reason: "rootMap.keys[].language expected string" };
    if (typeof gloss !== "string") return { ok: false, reason: "rootMap.keys[].gloss expected string" };
    if (!Array.isArray(evidence) || !evidence.every((x) => typeof x === "string"))
      return { ok: false, reason: "rootMap.keys[].evidence expected string[]" };
    if (normalizedStatus == null)
      return { ok: false, reason: "rootMap.keys[].status expected RootKeyStatusV1" };
    if (ops != null) {
      if (!Array.isArray(ops) || !ops.every((x) => typeof x === "string"))
        return { ok: false, reason: "rootMap.keys[].ops expected string[]" };
    }
  }

  // carriers?: [{ token, language, carrierForm, note? }]
  const carriers = v["carriers"];
  if (carriers != null) {
    if (!Array.isArray(carriers)) return { ok: false, reason: "rootMap.carriers expected array" };
    for (const c of carriers) {
      if (!isRecord(c)) return { ok: false, reason: "rootMap.carriers item expected object" };

      const token = c["token"];
      const language = c["language"];
      const carrierForm = c["carrierForm"];
      const note = c["note"];

      if (typeof token !== "string") return { ok: false, reason: "rootMap.carriers[].token expected string" };
      if (typeof language !== "string") return { ok: false, reason: "rootMap.carriers[].language expected string" };
      if (typeof carrierForm !== "string")
        return { ok: false, reason: "rootMap.carriers[].carrierForm expected string" };
      if (note != null && typeof note !== "string")
        return { ok: false, reason: "rootMap.carriers[].note expected string" };
    }
  }

  // spans?: [{ token, start, end, source, note? }]
  const spans = v["spans"];
  if (spans != null) {
    if (!Array.isArray(spans)) return { ok: false, reason: "rootMap.spans expected array" };
    for (const s of spans) {
      if (!isRecord(s)) return { ok: false, reason: "rootMap.spans item expected object" };

      const token = s["token"];
      const start = s["start"];
      const end = s["end"];
      const source = s["source"];
      const note = s["note"];
      const normalizedSource = normalizeRootSpanSource(source);

      if (typeof token !== "string") return { ok: false, reason: "rootMap.spans[].token expected string" };
      if (typeof start !== "number")
        return { ok: false, reason: "rootMap.spans[].start expected number" };
      if (typeof end !== "number")
        return { ok: false, reason: "rootMap.spans[].end expected number" };
      if (normalizedSource == null)
        return { ok: false, reason: "rootMap.spans[].source expected RootSpanSourceV1" };
      if (note != null && typeof note !== "string")
        return { ok: false, reason: "rootMap.spans[].note expected string" };
    }
  }

  // notes?: string[]
  const notes = v["notes"];
  if (notes != null) {
    if (!Array.isArray(notes) || !notes.every((x) => typeof x === "string"))
      return { ok: false, reason: "rootMap.notes expected string[]" };
  }

  type RootMapToken = NonNullable<RootMapV1["tokens"]>[number];
  type RootMapKey = NonNullable<RootMapV1["keys"]>[number];
  type RootMapCarrier = NonNullable<RootMapV1["carriers"]>[number];
  type RootMapSpan = NonNullable<RootMapV1["spans"]>[number];

  const typedTokens: RootMapToken[] = tokens.map((t): RootMapToken => {
    if (!isRecord(t)) throw new Error("rootMap.tokens item expected object");

    const token = t["token"];
    const role = t["role"];
    const vowelPath = t["vowel_path"];
    const normalizedRole = role == null ? null : normalizeRootTokenRole(role);

    if (typeof token !== "string") throw new Error("rootMap.tokens[].token expected string");
    if (role != null && normalizedRole == null) throw new Error("rootMap.tokens[].role expected RootTokenRoleV1");
    if (vowelPath != null && typeof vowelPath !== "string") throw new Error("rootMap.tokens[].vowel_path expected string");

    return {
      token,
      ...(normalizedRole != null ? { role: normalizedRole } : {}),
      ...(vowelPath != null ? { vowel_path: vowelPath } : {}),
    };
  });

  const typedKeys: RootMapKey[] = keys.map((k): RootMapKey => {
    if (!isRecord(k)) throw new Error("rootMap.keys item expected object");

    const token = k["token"];
    const language = k["language"];
    const gloss = k["gloss"];
    const evidence = k["evidence"];
    const status = k["status"];
    const ops = k["ops"];
    const normalizedStatus = normalizeRootKeyStatus(status);

    if (typeof token !== "string") throw new Error("rootMap.keys[].token expected string");
    if (typeof language !== "string") throw new Error("rootMap.keys[].language expected string");
    if (typeof gloss !== "string") throw new Error("rootMap.keys[].gloss expected string");
    if (!Array.isArray(evidence) || !evidence.every((x) => typeof x === "string"))
      throw new Error("rootMap.keys[].evidence expected string[]");
    if (normalizedStatus == null) throw new Error("rootMap.keys[].status expected RootKeyStatusV1");
    if (ops != null && (!Array.isArray(ops) || !ops.every((x) => typeof x === "string")))
      throw new Error("rootMap.keys[].ops expected string[]");

    return {
      token,
      language,
      gloss,
      evidence,
      status: normalizedStatus,
      ...(ops != null ? { ops } : {}),
    };
  });

  const typedCarriers: RootMapV1["carriers"] =
    carriers == null
      ? undefined
      : carriers.map((c): RootMapCarrier => {
          if (!isRecord(c)) throw new Error("rootMap.carriers item expected object");

          const token = c["token"];
          const language = c["language"];
          const carrierForm = c["carrierForm"];
          const note = c["note"];

          if (typeof token !== "string") throw new Error("rootMap.carriers[].token expected string");
          if (typeof language !== "string") throw new Error("rootMap.carriers[].language expected string");
          if (typeof carrierForm !== "string") throw new Error("rootMap.carriers[].carrierForm expected string");
          if (note != null && typeof note !== "string") throw new Error("rootMap.carriers[].note expected string");

          return {
            token,
            language,
            carrierForm,
            ...(note != null ? { note } : {}),
          };
        });

  const typedSpans: RootMapV1["spans"] =
    spans == null
      ? undefined
      : spans.map((s): RootMapSpan => {
          if (!isRecord(s)) throw new Error("rootMap.spans item expected object");

          const token = s["token"];
          const start = s["start"];
          const end = s["end"];
          const source = s["source"];
          const note = s["note"];
          const normalizedSource = normalizeRootSpanSource(source);

          if (typeof token !== "string") throw new Error("rootMap.spans[].token expected string");
          if (typeof start !== "number")
            throw new Error("rootMap.spans[].start expected number");
          if (typeof end !== "number")
            throw new Error("rootMap.spans[].end expected number");
          if (normalizedSource == null)
            throw new Error("rootMap.spans[].source expected RootSpanSourceV1");
          if (note != null && typeof note !== "string")
            throw new Error("rootMap.spans[].note expected string");

          return {
            token,
            start,
            end,
            source: normalizedSource,
            ...(note != null ? { note } : {}),
          };
        });

  const typedNotes: RootMapV1["notes"] =
    notes == null ? undefined : notes.map((x) => String(x));

  return {
    ok: true,
    value: {
      tokens: typedTokens,
      keys: typedKeys,
      composedMeaning,
      ...(typedCarriers ? { carriers: typedCarriers } : {}),
      ...(typedSpans ? { spans: typedSpans } : {}),
      ...(typedNotes ? { notes: typedNotes } : {}),
    },
  };
}

// ----------------------- small helpers -----------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

// Pick helpers (Instrument contract adapter)
function pickFromRootMetaContract(root: Record<string, unknown> | null, key: string): string | null {
  const meta = root && isRecord(root["meta"]) ? root["meta"] : null;
  const contract = root && isRecord(root["contract"]) ? root["contract"] : null;
  return (
    asString(root ? root[key] : null) ??
    asString(contract ? contract[key] : null) ??
    asString(meta ? meta[key] : null) ??
    null
  );
}

function pickMetaCreated(root: Record<string, unknown> | null): string | null {
  const meta = root && isRecord(root["meta"]) ? root["meta"] : null;
  const contract = root && isRecord(root["contract"]) ? root["contract"] : null;
  const contractMeta = contract && isRecord(contract["meta"]) ? contract["meta"] : null;
  return (
    asString(contractMeta ? contractMeta["created"] : null) ??
    asString(contractMeta ? contractMeta["createdAt"] : null) ??
    asString(meta ? meta["created"] : null) ??
    asString(meta ? meta["createdAt"] : null) ??
    null
  );
}


function asBool(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

function asArray(v: unknown): unknown[] | null {
  return Array.isArray(v) ? v : null;
}

function asStringArray(v: unknown): string[] | null {
  const arr = asArray(v);
  if (!arr) return null;
  const out: string[] = [];
  for (const x of arr) out.push(String(x));
  return out;
}

function formatNormalizationStep(x: unknown): string {
  // Contract: never throw; always return a string.
  if (typeof x === "string") return x;
  if (!x || typeof x !== "object") return String(x);
  if (!isRecord(x)) {
    try {
      return JSON.stringify(x);
    } catch {
      return String(x);
    }
  }

  const from = typeof x["from"] === "string" ? x["from"] : "";
  const to = typeof x["to"] === "string" ? x["to"] : "";
  const reason = typeof x["reason"] === "string" ? x["reason"] : "";

  // { from:"UY", to:"UI", reason:"functional_equivalence" }
  // -> "UY → UI (functional_equivalence)"
  if (from && to) {
    const tail = reason ? ` (${reason})` : "";
    return `${from} → ${to}${tail}`;
  }

  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}

function formatEvidenceItem(x: unknown): string {
  // Never leak "[object Object]" into UI.
  if (typeof x === "string") return x;
  if (x == null) return "";
  if (typeof x === "object") {
    try { return JSON.stringify(x); } catch { return String(x); }
  }
  return String(x);
}



export function present<T>(value: T): PresentOrMissing<T> {
  return { kind: "present", value };
}

export function missing<T>(
  missingState: "none" | "not_emitted" | "malformed" | "unknown",
  note?: string
): PresentOrMissing<T> {
  return { kind: "missing", missing: missingState, note };
}

function presentBool(v: boolean): PresentOrMissing<boolean> {
  return present(v);
}

function countOrMissing(arr: unknown[] | null): PresentOrMissing<number> {
  if (!arr) return missing("not_emitted");
  return present(arr.length);
}

function presentStringArray(arr: unknown[] | null): PresentOrMissing<string[]> {
  if (!arr) return missing("not_emitted");
  return present(arr.map((v) => String(v)));
}

// ----------------------- vowel path helpers -----------------------

function normalizeMode(v: unknown): "strict" | "open" | null {
  const s = asString(v);
  if (s === "strict" || s === "open") return s;
  return null;
}

function normalizeVowelChar(s: string): Vowel | null {
  const t = s.trim().toUpperCase();

  switch (t) {
    case "A":
      return "A";
    case "E":
      return "E";
    case "I":
      return "I";
    case "O":
      return "O";
    case "U":
      return "U";
    case "Y":
      return "Y";
    case "Ë":
      return "Ë";
    default:
      return null;
  }
}

function normalizeVowelPathArray(v: unknown): Vowel[] | null {
  const arr = asArray(v);
  if (!arr) return null;
  const out: Vowel[] = [];
  for (const x of arr) {
    const s = asString(x);
    if (!s) return null;
    const vv = normalizeVowelChar(s);
    if (!vv) return null;
    out.push(vv);
  }
  return out.length ? out : null;
}

function normalizeVowelPathString(v: unknown): Vowel[] | null {
  const s = asString(v);
  if (!s) return null;
  // Accept "U-I" or "U→I" or "UI"
  const parts = s.includes("-") ? s.split("-") : s.includes("→") ? s.split("→") : s.split("");
  const out: Vowel[] = [];
  for (const p of parts.map((t) => t.trim()).filter(Boolean)) {
    const vv = normalizeVowelChar(p);
    if (!vv) return null;
    out.push(vv);
  }
  return out.length ? out : null;
}

// ----------------------- voice path selection -----------------------

function getField(obj: unknown, key: string): unknown {
  return isRecord(obj) ? obj[key] : undefined;
}

function pickVoicePaths(payload: unknown): { detected: string | null; surface: string | null; functional: string | null } {
  // detected (primary)
  const primaryPathValue = getField(payload, "primaryPath");
  const primaryPath = isRecord(primaryPathValue) ? primaryPathValue : null;
  const detectedArr = primaryPath ? normalizeVowelPathArray(primaryPath["voicePath"]) : null;

  // surface/functional (optional)
  const detected = detectedArr ? detectedArr.join("-") : null;

  const evidenceValue = getField(payload, "evidence");
  const evidence = isRecord(evidenceValue) ? evidenceValue : null;

  const deepRootValue = getField(payload, "deepRoot");
  const deepRoot = isRecord(deepRootValue) ? deepRootValue : null;

  const functionalRoots =
    deepRoot && Array.isArray(deepRoot["functionalRoots"])
      ? deepRoot["functionalRoots"]
      : null;

  const functionalRoot0 =
    functionalRoots && functionalRoots.length > 0 && isRecord(functionalRoots[0])
      ? functionalRoots[0]
      : null;

  const candidatesValue = getField(payload, "candidates");
  const candidates = Array.isArray(candidatesValue) ? candidatesValue : null;

  const candidate0 =
    candidates && candidates.length > 0 && isRecord(candidates[0])
      ? candidates[0]
      : null;

  const surface =
    (() => {
      const sv = evidence?.["surfaceVowels"];
      if (Array.isArray(sv)) {
        const joined = normalizeVowelPathString(sv.map((x) => String(x)).join("-"))?.join("-");
        return joined ?? normalizeVowelPathArray(sv)?.join("-") ?? null;
      }
      return null;
    })();

  const functional =
    (normalizeVowelPathString(functionalRoot0?.["vowelPath"])?.join("-") ?? null) ??
    (normalizeVowelPathArray(functionalRoot0?.["vowelPath"])?.join("-") ?? null) ??
    (normalizeVowelPathString(functionalRoot0?.["vowel_path"])?.join("-") ?? null) ??
    (normalizeVowelPathArray(functionalRoot0?.["vowel_path"])?.join("-") ?? null) ??
    (normalizeVowelPathString(candidate0?.["vowelPath"])?.join("-") ?? null) ??
    (normalizeVowelPathArray(candidate0?.["vowelPath"])?.join("-") ?? null) ??
    (normalizeVowelPathString(candidate0?.["vowel_path"])?.join("-") ?? null) ??
    (normalizeVowelPathArray(candidate0?.["vowel_path"])?.join("-") ?? null) ??
    null;

  return { detected, surface, functional };
}

function stableCandidateId(index: number, lang: string | null, form: string | null): string {
  return `cand_${index}_${(lang ?? "xx").toLowerCase()}_${(form ?? "form").toLowerCase()}`.replace(/[^a-z0-9_]/g, "_");
}

function parseAnalysisStatusV0_1(
  payload: unknown,
): PresentOrMissing<AnalysisStatusV0_1VM> {
  if (!isRecord(payload)) {
    return missing("malformed", "analysisStatusV0_1 payload");
  }

  const value = payload["analysisStatusV0_1"];

  if (value == null) {
    return missing("not_emitted", "analysisStatusV0_1");
  }

  if (!isRecord(value)) {
    return missing("malformed", "analysisStatusV0_1 expected object");
  }

  const schemaVersion = value["schemaVersion"];
  const statusValue = value["status"];
  const summary = value["summary"];
  const reviewedOperators = value["reviewedOperators"];
  const candidateOnlyOperators = value["candidateOnlyOperators"];
  const structuralTokens = value["structuralTokens"];
  const claimBoundary = value["claimBoundary"];
  const userDecisionPosture = value["userDecisionPosture"];

  const allowedStatuses = new Set<AnalysisStatusV0_1VM["status"]>([
    "reviewed_functional_evidence",
    "candidate_only",
    "structural_unreviewed",
    "null_no_supported_candidate",
  ]);

  if (
    schemaVersion !== "open-instrument.analysis-status.v0_1" ||
    typeof statusValue !== "string" ||
    !allowedStatuses.has(statusValue as AnalysisStatusV0_1VM["status"]) ||
    typeof summary !== "string" ||
    !Array.isArray(reviewedOperators) ||
    !reviewedOperators.every((item) => typeof item === "string") ||
    !Array.isArray(candidateOnlyOperators) ||
    !candidateOnlyOperators.every((item) => typeof item === "string") ||
    !Array.isArray(structuralTokens) ||
    !structuralTokens.every((item) => typeof item === "string") ||
    !isRecord(claimBoundary) ||
    userDecisionPosture !== "user_decides"
  ) {
    return missing("malformed", "analysisStatusV0_1 contract");
  }

  if (
    claimBoundary["historicalOriginClaim"] !== "not_claimed" ||
    claimBoundary["historicalTransmissionClaim"] !== "not_claimed" ||
    claimBoundary["winnerClaim"] !== "not_claimed" ||
    claimBoundary["languageSuperiorityClaim"] !== "not_claimed" ||
    claimBoundary["linguisticOwnershipClaim"] !== "not_claimed" ||
    claimBoundary["candidateTruthClaim"] !== "not_claimed" ||
    claimBoundary["structuralOutputIsCandidateTruth"] !== false ||
    claimBoundary["nullIsValid"] !== true
  ) {
    return missing("malformed", "analysisStatusV0_1 claimBoundary");
  }

  return present({
    schemaVersion: "open-instrument.analysis-status.v0_1",
    status: statusValue as AnalysisStatusV0_1VM["status"],
    summary,
    reviewedOperators: reviewedOperators.map((item) => String(item)),
    candidateOnlyOperators: candidateOnlyOperators.map((item) => String(item)),
    structuralTokens: structuralTokens.map((item) => String(item)),
    claimBoundary: {
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      linguisticOwnershipClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      structuralOutputIsCandidateTruth: false,
      nullIsValid: true,
    },
    userDecisionPosture: "user_decides",
  });
}
// ----------------------- adapter -----------------------

export function adaptAnalysisToTelemetryVM(raw: unknown): TelemetryViewModel {
  const payload = raw;

  const vp = pickVoicePaths(payload);

  // DeepRoot–Heart Alignment Gate v0.1 (adapter-first)
  // Prefer emitted Heart primary path when available (more canonical than UI-detected fallback).
  // Accept both string and array-ish shapes; normalize to dash-delimited.
  const heartPrimaryPathForGate: string | null =
    (() => {
      const heartPrimaryPath = getField(payload, "heartPrimaryPath");
      const s =
        normalizeVowelPathString(heartPrimaryPath)?.join("-") ??
        normalizeVowelPathArray(heartPrimaryPath)?.join("-") ??
        null;

      const cleaned = typeof s === "string" && s.trim() ? s.trim() : null;
      return cleaned ?? (vp.detected ?? null);
    })();


  // Accept unknown input, normalize to a dash-delimited string, then parse.
  // This avoids runtime crashes when upstream emits arrays or non-strings.
  const toVoiceParts = (v: unknown): Vowel[] | null => {
    if (!v) return null;

    // If we got ["U","I"] etc.
    if (Array.isArray(v)) {
      const parts = v.map((x) => (typeof x === "string" ? x : String(x))).map((t) => t.trim()).filter(Boolean);
      const out: Vowel[] = [];
      for (const p of parts) {
        const vv = normalizeVowelChar(p);
        if (!vv) return null;
        out.push(vv);
      }
      return out.length ? out : null;
    }

    // If we got "U-I" or "U→I" or "UI"
    if (typeof v !== "string") return null;
    const str = v;

    const parts = str.includes("-") ? str.split("-") : str.includes("→") ? str.split("→") : str.split("");
    const out: Vowel[] = [];
    for (const p of parts.map((t) => t.trim()).filter(Boolean)) {
      const vv = normalizeVowelChar(p);
      if (!vv) return null;
      out.push(vv);
    }
    return out.length ? out : null;
  };

  const detectedParts = toVoiceParts(vp.detected);

// Embryo-first path semantics:
// - detected path = primary/Heart surface detection.
// - surface path = evidence.surfaceVowelsRaw when emitted.
// - functional path = DeepRoot functionalRoots vowelPath when emitted.
// - evidence.surfaceVowels/evidence.vowelPath are run-level fallbacks.
// - candidate vowelPath is a final compatibility fallback only.
//
// This prevents a surface U-Y reading from masking a DeepRoot functional U-I
// reading and falsely reporting MATCH.

const hiRootValue = getField(payload, "heartInstrumentV1");
const hiRoot = isRecord(hiRootValue) ? hiRootValue : null;
const hiSurfaceArr = hiRoot ? asStringArray(hiRoot["surfaceVowels"]) : null;

// Evidence may exist at root or mirrored in raw.evidence (adapter must not touch later bindings).
const evRootEvidenceValue = getField(payload, "evidence");
const evRootEvidence = isRecord(evRootEvidenceValue) ? evRootEvidenceValue : null;

const rawPayload = getField(payload, "raw");
const rawEvidenceValue = isRecord(rawPayload) ? rawPayload["evidence"] : null;
const evRawEvidence = isRecord(rawEvidenceValue) ? rawEvidenceValue : null;

const evPick = evRootEvidence ?? evRawEvidence ?? null;

const evSurfaceRawArr = evPick ? asStringArray(evPick["surfaceVowelsRaw"]) : null;
const evFunctionalArr = evPick ? asStringArray(evPick["surfaceVowels"]) : null;
const evVowelPathArr = evPick ? asStringArray(evPick["vowelPath"]) : null;

// Prefer arrays; otherwise fall back to legacy string sources.
const surfaceForParts =
  evSurfaceRawArr
    ? evSurfaceRawArr.join("-")
    : hiSurfaceArr
      ? hiSurfaceArr.join("-")
      : vp.surface;

const deepRootForReadoutValue =
  getField(payload, "deepRoot");

const deepRootForReadout =
  isRecord(deepRootForReadoutValue)
    ? deepRootForReadoutValue
    : null;

const deepRootFunctionalRootsForReadout =
  deepRootForReadout &&
  Array.isArray(
    deepRootForReadout["functionalRoots"],
  )
    ? deepRootForReadout["functionalRoots"]
    : null;

const deepRootFunctionalRoot0ForReadout =
  deepRootFunctionalRootsForReadout &&
  deepRootFunctionalRootsForReadout.length > 0 &&
  isRecord(
    deepRootFunctionalRootsForReadout[0],
  )
    ? deepRootFunctionalRootsForReadout[0]
    : null;

const deepRootFunctionalForParts =
  (normalizeVowelPathString(
    deepRootFunctionalRoot0ForReadout?.["vowelPath"],
  )?.join("-") ?? null) ??
  (normalizeVowelPathArray(
    deepRootFunctionalRoot0ForReadout?.["vowelPath"],
  )?.join("-") ?? null) ??
  (normalizeVowelPathString(
    deepRootFunctionalRoot0ForReadout?.["vowel_path"],
  )?.join("-") ?? null) ??
  (normalizeVowelPathArray(
    deepRootFunctionalRoot0ForReadout?.["vowel_path"],
  )?.join("-") ?? null) ??
  null;

const functionalForParts =
  deepRootFunctionalForParts ??
  (evFunctionalArr
    ? evFunctionalArr.join("-")
    : evVowelPathArr
      ? evVowelPathArr.join("-")
      : vp.functional);

const surfaceParts = toVoiceParts(surfaceForParts);
const functionalParts = toVoiceParts(functionalForParts);

const voicePathDetectedMaybe: PresentOrMissing<Vowel[]> =
    detectedParts ? present(detectedParts) : missing<Vowel[]>("not_emitted");

  const voicePathSurfaceMaybe: PresentOrMissing<Vowel[]> =
    surfaceParts ? present(surfaceParts) : missing<Vowel[]>("not_emitted");

  const voicePathFunctionalMaybe: PresentOrMissing<Vowel[]> =
    functionalParts ? present(functionalParts) : missing<Vowel[]>("not_emitted");
  // Delta must be computed from the SAME sources the UI renders:
// - surfaceParts uses evidence.surfaceVowelsRaw (fallback: heartInstrumentV1.surfaceVowels, then vp.surface)
// - functionalParts uses DeepRoot functional path first,
//   then emitted evidence, then candidate compatibility fallback.
  const surfaceNorm = surfaceParts ? surfaceParts.join("-") : null;
  const functionalNorm = functionalParts ? functionalParts.join("-") : null;

  
      type SpectrumSectionVM = {
      vowels: Vowel[];
      indices1: number[];
      ringIndex: number[];
      colors: string[];
      notes: string[];
      roles: string[];
      polarities: string[];
      rings: string[];
      crossesCenter: boolean;
      endsOnE: boolean;
      endsOnË: boolean;
      drift: "static" | "mostly_increasing" | "mostly_decreasing" | "mixed";
    };

function buildSpectrumSection(m: PresentOrMissing<Vowel[]>): PresentOrMissing<SpectrumSectionVM> {
      if (m && m.kind === "present" && Array.isArray(m.value)) {
        const vowels = m.value;

        const indices1 = vowels.map((v) => vowelToIndex1(v));
        const ringIndex = vowels.map((v) => vowelToRingIndex(v));
        const colors = vowels.map((v) => vowelToColor(v));
        const notes = vowels.map((v) => vowelToNote(v));

        // doctrine (SSOT): role / polarity / ring label
        const roles = vowels.map((v) => SEVEN_PRINCIPLES[v].role);
        const polarities = vowels.map((v) => SEVEN_PRINCIPLES[v].polarity);
        const rings = vowels.map((v) => SEVEN_PRINCIPLES[v].ring);

        const crossesCenter = indices1.includes(4);
        const last = indices1.length ? indices1[indices1.length - 1] : null;
        const endsOnE = last === 2;
        const endsOnË = last === 7;

        let inc = 0, dec = 0;
        for (let i = 1; i < indices1.length; i++) {
          if (indices1[i] > indices1[i - 1]) inc++;
          else if (indices1[i] < indices1[i - 1]) dec++;
        }
        const drift =
          indices1.length <= 1 ? "static" :
          inc > dec ? "mostly_increasing" :
          dec > inc ? "mostly_decreasing" :
          "mixed";

        return present({
          vowels,
          indices1,
          ringIndex,
          colors,
          notes,
          roles,
          polarities,
          rings,
          crossesCenter,
          endsOnE,
          endsOnË,
          drift,
        });
      }
        // Preserve original missing reason if present
        if (m.kind === "missing") {
          const missingStateValue = m.missing;
          const missingState =
            missingStateValue === "none" ||
            missingStateValue === "not_emitted" ||
            missingStateValue === "malformed" ||
            missingStateValue === "unknown"
              ? missingStateValue
              : "unknown";
          const note = typeof m.note === "string" ? m.note : undefined;
          return missing(missingState, note);
        }

        return missing("unknown");
    }

  const sevenPrinciplesSpectrum = (() => {
    const surface = buildSpectrumSection(voicePathSurfaceMaybe);
    const functional = buildSpectrumSection(voicePathFunctionalMaybe);

    const surfaceStr =
        surface.kind === "present" && surface.value?.vowels
          ? surface.value.vowels.join("-")
          : "";

      const functionalStr =
        functional.kind === "present" && functional.value?.vowels
          ? functional.value.vowels.join("-")
          : "";

    return {
      surface,
      functional,
      delta: {
        same: surfaceStr === functionalStr,
        surface: surfaceStr || undefined,
        functional: functionalStr || undefined,
      },
    };
  })();


  const voicePathDelta =
    surfaceNorm && functionalNorm
      ? (surfaceNorm === functionalNorm ? "MATCH" : "DIVERGE")
      : "NOT_EMITTED";

  const root = isRecord(raw) ? raw : {};
  const heart = isRecord(root["heart"]) ? root["heart"] : null;

  const word = asString(root["word"]) ?? "(missing word)";
  const sanitized = asString(root["sanitized"]);
  const engineVersion = pickFromRootMetaContract(root, "engineVersion");
  const mode =
      normalizeMode(pickFromRootMetaContract(root, "mode") ?? root["mode"]) ??
      (heart ? normalizeMode(heart["mode"]) : null);
  const alphabet =
    pickFromRootMetaContract(root, "alphabet") ??
    (heart ? asString(heart["alphabet"]) : null);

  const meta = isRecord(root["meta"]) ? root["meta"] : null;
  const createdAt = meta ? asString(meta["created"]) : null;

  const heartPrinciplePath = heart ? (asStringArray(heart["principlePath"]) ?? null) : null;

  const heartMath7 = heart && isRecord(heart["math7"]) ? heart["math7"] : null;
  const heartMath7Primary = heartMath7 && isRecord(heartMath7["primary"]) ? heartMath7["primary"] : null;

  const math7PrinciplesPath = heartMath7Primary ? asStringArray(heartMath7Primary["principlesPath"]) : null;
  const principlesPathRaw = heartPrinciplePath ?? math7PrinciplesPath;
  const principlesPath = principlesPathRaw ? normalizePrinciplesToLabels(principlesPathRaw) : null;

  const primaryPath = isRecord(root["primaryPath"]) ? root["primaryPath"] : null;
  const detectedVoicePath =
    (primaryPath ? normalizeVowelPathArray(primaryPath["voicePath"]) : null) ??
    (heartMath7Primary ? normalizeVowelPathArray(heartMath7Primary["vowels"]) : null);

  const strictInputEmittedRaw =
      (heart ? heart["strictInput"] : null) ??
      root["strictInput"] ??
      pickFromRootMetaContract(root, "strictInput") ??
      null;

    const strictInputEmittedBool: boolean | null =
      (() => {
        if (typeof strictInputEmittedRaw === "boolean") return strictInputEmittedRaw;
        const s = asString(strictInputEmittedRaw);
        if (!s) return null;
        const nm = normalizeMode(s);
        if (nm === "strict") return true;
        if (nm === "open") return false;
        return null;
      })();

    const strictInput: PresentOrMissing<boolean> =
      strictInputEmittedBool !== null
        ? presentBool(strictInputEmittedBool)
        : mode
          ? presentBool(mode === "strict")
          : missing("not_emitted", "Expected strictInput; derive requires mode");

// Evidence ledger sources (root -> raw.evidence -> heart.evidence)
    const rootEvidence = isRecord(root["evidence"]) ? root["evidence"] : null;

    const rawRecord = isRecord(root["raw"]) ? root["raw"] : null;
    const rawEvidence = rawRecord && isRecord(rawRecord["evidence"]) ? rawRecord["evidence"] : null;

    const heartEvidence = heart && isRecord(heart["evidence"]) ? heart["evidence"] : null;

    const evidence = rootEvidence ?? rawEvidence ?? heartEvidence ?? null;

const normalizationSteps =
    asArray(evidence?.["normalizationSteps"]) ??
    asArray(heartEvidence?.["normalizationSteps"]) ??
    null;

  const rootOps = asArray(root["ops"]);
  const ops =
    asArray(evidence?.["ops"]) ??
    rootOps ??
    asArray(heartEvidence?.["ops"]) ??
    null;

  const rootNotes = asArray(root["notes"]);
  const notes =
    asArray(evidence?.["notes"]) ??
    rootNotes ??
    asArray(heartEvidence?.["notes"]) ??
    null;

  const rootSignals = asArray(root["signals"]);
  const signals =
    asArray(evidence?.["signals"]) ??
    rootSignals ??
    asArray(heartEvidence?.["signals"]) ??
    null;

    // Canonical DeepRoot functional vowel path (if emitted)
    // Prefer this for DeepRoot–Heart gate comparisons; fall back per-candidate otherwise.
    const deepRootFunctionalPathStr: string | null =
  (() => {
    const deepRoot = isRecord(root["deepRoot"]) ? root["deepRoot"] : null;
    const functionalRoots = deepRoot && Array.isArray(deepRoot["functionalRoots"]) ? deepRoot["functionalRoots"] : null;
    const fr0 = functionalRoots && functionalRoots.length > 0 && isRecord(functionalRoots[0]) ? functionalRoots[0] : null;

    const arr =
      normalizeVowelPathArray(fr0 ? fr0["vowelPath"] : null) ??
      normalizeVowelPathString(fr0 ? fr0["vowelPath"] : null) ??
      normalizeVowelPathArray(fr0 ? fr0["vowel_path"] : null) ??
      normalizeVowelPathString(fr0 ? fr0["vowel_path"] : null) ??
      normalizeVowelPathArray(fr0 ? fr0["voicePath"] : null) ??
      normalizeVowelPathString(fr0 ? fr0["voicePath"] : null) ??
      normalizeVowelPathArray(fr0 ? fr0["voice_path"] : null) ??
      normalizeVowelPathString(fr0 ? fr0["voice_path"] : null) ??
      null;

    const s = arr ? arr.join("-") : null;
    return typeof s === "string" && s.trim() ? s.trim() : null;
  })();

  // Candidates
  const candRaw = Array.isArray(root["candidates"]) ? root["candidates"] : null;
  const candidates: CandidateRowVM[] = [];

  if (candRaw) {
    candRaw.forEach((c, i) => {
      const rec = isRecord(c) ? c : {};
      const lang = asString(rec["language"]);
      const form = asString(rec["form"]);
      const id = asString(rec["id"]) ?? stableCandidateId(i, lang, form);

      // v0.3 honest-provenance: lift candidateRecord.source.kind into the VM.
      // Adapter is the designated raw->VM boundary, so the lift happens here.
      const candRecord = isRecord(rec["candidateRecord"]) ? rec["candidateRecord"] : null;
      const candSource = candRecord && isRecord(candRecord["source"]) ? candRecord["source"] : null;
      const candSourceKind = asString(rec["sourceKind"]) ?? (candSource ? asString(candSource["kind"]) : null);

      const embryo = asString(rec["embryo"]);
      const plainStandaloneGloss =
        asString(rec["plainStandaloneGloss"]);
      const claimType = asString(rec["claimType"]);
      const validationOutcome =
        asString(rec["validationOutcome"]);
      const rankGroup = asString(rec["rankGroup"]);
      const claimBoundary =
        asString(rec["claimBoundary"]);
      const userDecisionPosture =
        asString(rec["userDecisionPosture"]);

      const segmentation =
        isRecord(rec["segmentation"])
          ? rec["segmentation"]
          : null;

      const rawFunctionalComponents =
        segmentation &&
        asString(segmentation["kind"]) ===
          "functionalComposition"
          ? asArray(
              segmentation["components"],
            )
          : null;

      const functionalComponents =
        (
          rawFunctionalComponents ?? []
        ).flatMap((item) => {
          if (!isRecord(item)) {
            return [];
          }

          const embryo =
            asString(item["embryo"]);

          if (!embryo) {
            return [];
          }

          const componentLanguageRaw =
            item["language"];

          const plainMeaningRaw =
            item["plainMeaning"];

          const evidenceStateRaw =
            item["evidenceState"];

          const componentLanguage:
            string | null =
            typeof componentLanguageRaw ===
              "string"
              ? componentLanguageRaw.trim() ||
                null
              : null;

          const plainMeaning:
            string | null =
            typeof plainMeaningRaw ===
              "string"
              ? plainMeaningRaw.trim() ||
                null
              : null;

          const evidenceState:
            string | null =
            typeof evidenceStateRaw ===
              "string"
              ? evidenceStateRaw.trim() ||
                null
              : null;

          return [
            {
              embryo,
              language:
                componentLanguage
                  ? present<string>(
                      componentLanguage,
                    )
                  : missing<string>(
                      "not_emitted",
                    ),
              plainMeaning:
                plainMeaning
                  ? present<string>(
                      plainMeaning,
                    )
                  : missing<string>(
                      "not_emitted",
                    ),
              evidenceState:
                evidenceState
                  ? present<string>(
                      evidenceState,
                    )
                  : missing<string>(
                      "not_emitted",
                    ),
            },
          ];
        });

// EvidenceRefs should be stable and filesystem-safe (no ":" etc.)
const evidenceId = String(id).toLowerCase().replace(/[^a-z0-9_]/g, "_");

      const functionalStatement =
        asString(rec["functionalStatement"]) ??
        asString(rec["function"]) ??
        null;

      const candVowelPath =
  normalizeVowelPathArray(rec["vowelPath"]) ??
  normalizeVowelPathString(rec["vowelPath"]) ??
  normalizeVowelPathArray(rec["vowel_path"]) ??
  normalizeVowelPathString(rec["vowel_path"]) ??
  normalizeVowelPathArray(rec["voicePath"]) ??
  normalizeVowelPathString(rec["voicePath"]) ??
  normalizeVowelPathArray(rec["voice_path"]) ??
  normalizeVowelPathString(rec["voice_path"]) ??
  null;

      // v0.1.1: populate per-candidate lists when present (no heuristics).
      const candOps = asArray(rec["ops"]);
      const candNotes = asArray(rec["notes"]) ?? asArray(rec["note"]) ?? null; // note may be string; handled by presentStringArray via String()
      const candSignals = asArray(rec["signals"]);

      candidates.push({
        index: i,
        id,
        language: lang ? present(lang) : missing("not_emitted"),
        form: form ? present(form) : missing("not_emitted"),
        sourceKind: candSourceKind ? present(candSourceKind) : missing("not_emitted"),

        ...(embryo
          ? { embryo: present(embryo) }
          : {}),

        ...(plainStandaloneGloss
          ? {
              plainStandaloneGloss:
                present(plainStandaloneGloss),
            }
          : {}),

        ...(claimType
          ? { claimType: present(claimType) }
          : {}),

        ...(validationOutcome
          ? {
              validationOutcome:
                present(validationOutcome),
            }
          : {}),

        ...(rankGroup
          ? { rankGroup: present(rankGroup) }
          : {}),

        ...(claimBoundary
          ? {
              claimBoundary:
                present(claimBoundary),
            }
          : {}),

        ...(userDecisionPosture
          ? {
              userDecisionPosture:
                present(userDecisionPosture),
            }
          : {}),

        ...(functionalComponents.length > 0
          ? {
              functionalComponents:
                present(
                  functionalComponents,
                ),
            }
          : {}),

        functionalStatement: functionalStatement ? present(functionalStatement) : missing("not_emitted"),
        vowelPath: candVowelPath ? present(candVowelPath) : missing("not_emitted"),

                        deepRootHeartGate: present(
          computeDeepRootHeartGateV01({
            heartPrimaryPath: heartPrimaryPathForGate,
            deepRootFunctionalPath:
              (candVowelPath && candVowelPath.length
                ? candVowelPath.join("-")
                : claimType !== "functionalMotivation"
                  ? deepRootFunctionalPathStr
                  : null),
            evidenceRefs: [
              "heartPrimaryPath",
              "primaryPath.voicePath",
              ...(candVowelPath && candVowelPath.length
                ? ["candidates[" + evidenceId + "].vowelPath"]
                : claimType !== "functionalMotivation" &&
                    deepRootFunctionalPathStr
                  ? ["deepRoot.functionalRoots[0].vowelPath"]
                  : []),
            ],
          })
        ),
// leave decomposition for later (shape varies too much right now)
        decomposition: missing<DecompositionItemVM[]>("not_emitted"),

        ops: candOps ? presentStringArray(candOps) : missing("not_emitted"),
        notes: candNotes ? presentStringArray(candNotes) : missing("not_emitted"),
        signals: candSignals ? presentStringArray(candSignals) : missing("not_emitted"),

        raw: c,
      });
    });
  }

  let math: PresentOrMissing<MathTelemetryVM> = missing("not_emitted");
  if (heartMath7Primary) {
    math = present({
      L: missing("not_emitted"),
      verdict: missing("not_emitted"),
      OI: missing("not_emitted"),
      light: missing("not_emitted"),
      shadow: missing("not_emitted"),
      bridge: missing("not_emitted"),
      ringSummary: missing("not_emitted"),
      levelSummary: missing("not_emitted"),
      raw: heartMath7Primary,
    });
  }

  const rejectionItems: PresentOrMissing<RejectionItemVM[]> = missing("not_emitted");

  const status: "detected" | "none" | "error" =
    detectedVoicePath && detectedVoicePath.length ? "detected" : "none";

  const p = isRecord(payload) ? payload : null;
  const oc = p && isRecord(p.originClaim) ? p.originClaim : null;
    const originClaim: PresentOrMissing<unknown> = oc ? present<unknown>(oc) : missing<unknown>("not_emitted", "originClaim");

    // ----------------------- rootMap v0.1 -----------------------
    const rootMap: PresentOrMissing<RootMapVM> = (() => {
      if (!isRecord(payload)) return missing("not_emitted", "rootMap");
      if (!("rootMap" in payload)) return missing("not_emitted", "rootMap");

      const v = payload["rootMap"];
      if (v == null) return missing("not_emitted", "rootMap");

      const parsed = parseRootMapV1(v);
      if (!parsed.ok) return missing("malformed", parsed.reason);

      return present(parsed.value);
    })();

  const reasonCounts: Record<string, number> = {};
    const ocCandidates = oc && Array.isArray(oc["candidates"]) ? oc["candidates"] : null;
    if (ocCandidates) {
      for (const c of ocCandidates) {
        if (!isRecord(c)) continue;
        const reasonCodes = c["reasonCodes"];
        if (!Array.isArray(reasonCodes)) continue;
        for (const code of reasonCodes) {
          const codeStr = String(code);
          reasonCounts[codeStr] = (reasonCounts[codeStr] ?? 0) + 1;
        }
      }
    }

  const gatesActive = (oc && isRecord(oc.policy) && oc.policy.gatesActive === true) || (oc && oc.policy === "gates-v1.1");

  
  // ----------------------- resonance profile v0.1 -----------------------

    const resonanceProfileV1: PresentOrMissing<ResonanceProfileV1VM> = (() => {
    if (!isRecord(payload)) return missing("not_emitted", "resonanceProfileV1");
    if (!("resonanceProfileV1" in payload)) return missing("not_emitted", "resonanceProfileV1");

    const v = payload["resonanceProfileV1"];
    if (v == null) return missing("not_emitted", "resonanceProfileV1");

    if (!isRecord(v)) return missing("malformed", "resonanceProfileV1 expected object");

    const version = asString(v["version"]);
    if (!version) return missing("malformed", "resonanceProfileV1.version expected string");

    if (!("surface" in v)) return missing("malformed", "resonanceProfileV1.surface missing");
    if (!("normalized" in v)) return missing("malformed", "resonanceProfileV1.normalized missing");

    const parseResonanceReadout = (
      input: unknown,
      label: "surface" | "normalized"
    ):
      | { ok: true; value: ResonanceProfileV1VM["surface"] }
      | { ok: false; reason: string } => {
      if (!isRecord(input)) return { ok: false, reason: `resonanceProfileV1.${label} expected object` };

      const vowels = asStringArray(input["vowels"]);
      if (!vowels) return { ok: false, reason: `resonanceProfileV1.${label}.vowels expected string[]` };

      const bucketCountsValue = input["bucketCounts"];
      if (!isRecord(bucketCountsValue)) {
        return { ok: false, reason: `resonanceProfileV1.${label}.bucketCounts expected object` };
      }

      const source = typeof bucketCountsValue["source"] === "number" ? bucketCountsValue["source"] : null;
      const boundary = typeof bucketCountsValue["boundary"] === "number" ? bucketCountsValue["boundary"] : null;
      const manifest = typeof bucketCountsValue["manifest"] === "number" ? bucketCountsValue["manifest"] : null;
      if (source == null || boundary == null || manifest == null) {
        return {
          ok: false,
          reason: `resonanceProfileV1.${label}.bucketCounts expected numeric source/boundary/manifest`,
        };
      }

      const dominantBucket = asString(input["dominantBucket"]);
      if (
        dominantBucket !== "source" &&
        dominantBucket !== "boundary" &&
        dominantBucket !== "manifest" &&
        dominantBucket !== "mixed" &&
        dominantBucket !== "none"
      ) {
        return { ok: false, reason: `resonanceProfileV1.${label}.dominantBucket expected ResonanceBucket` };
      }

      const signature = asString(input["signature"]);
      if (!signature) return { ok: false, reason: `resonanceProfileV1.${label}.signature expected string` };

      const polaritySymbol = asString(input["polaritySymbol"]);
      if (!polaritySymbol) {
        return { ok: false, reason: `resonanceProfileV1.${label}.polaritySymbol expected string` };
      }

      const colorBand = asStringArray(input["colorBand"]);
      if (!colorBand) return { ok: false, reason: `resonanceProfileV1.${label}.colorBand expected string[]` };

      const dominantColor = asString(input["dominantColor"]);
      if (!dominantColor) {
        return { ok: false, reason: `resonanceProfileV1.${label}.dominantColor expected string` };
      }

      const transitions = asStringArray(input["transitions"]);
      if (!transitions) {
        return { ok: false, reason: `resonanceProfileV1.${label}.transitions expected string[]` };
      }

      const notes = asStringArray(input["notes"]);
      if (!notes) return { ok: false, reason: `resonanceProfileV1.${label}.notes expected string[]` };

      return {
        ok: true,
        value: {
          vowels,
          bucketCounts: { source, boundary, manifest },
          dominantBucket,
          signature,
          polaritySymbol,
          colorBand,
          dominantColor,
          transitions,
          notes,
        },
      };
    };

    const surfaceParsed = parseResonanceReadout(v["surface"], "surface");
    if (!surfaceParsed.ok) return missing("malformed", surfaceParsed.reason);

    const normalizedParsed = parseResonanceReadout(v["normalized"], "normalized");
    if (!normalizedParsed.ok) return missing("malformed", normalizedParsed.reason);

    return present({
      version,
      surface: surfaceParsed.value,
      normalized: normalizedParsed.value,
    });
  })();

  // ----------------------- phonetic IPA v0.1 -----------------------
    const phoneticIpaV0_1: PresentOrMissing<PhoneticIpaV0_1VM> = (() => {
    if (!isRecord(payload)) return missing("not_emitted", "phoneticIpaV0_1");
    if (!("phoneticIpaV0_1" in payload)) return missing("not_emitted", "phoneticIpaV0_1");

    const v = payload["phoneticIpaV0_1"];
    if (v == null) return missing("not_emitted", "phoneticIpaV0_1");
    if (!isRecord(v)) return missing("malformed", "phoneticIpaV0_1 expected object");

    const ipa = asString(v["ipa"]);
    const voices = asVowelArray2(v["voices"]);
    const diagnostics = isRecord(v["diagnostics"]) ? v["diagnostics"] : null;
    const unmappedRaw = diagnostics ? diagnostics["unmapped"] : null;
    const unmapped = Array.isArray(unmappedRaw) ? unmappedRaw.map((x) => String(x)) : [];

    if (!ipa) return missing("malformed", "phoneticIpaV0_1.ipa expected string");
    if (!voices) return missing("malformed", "phoneticIpaV0_1.voices expected Vowel[]");

    return present({ ipa, voices, unmapped });
  })();
const originClaimGatesActiveRecord =
    isRecord(raw) && isRecord(raw["originClaimGates"]) ? raw["originClaimGates"] : null;

const originClaimGates: OriginClaimGatesVM = {
    active: (() => {
      // VM-only: NEVER override with dev flags / URL params.
      const a = originClaimGatesActiveRecord ? originClaimGatesActiveRecord["active"] : null;
      if (typeof a === "boolean") return a;

      // Fallback: derive from OriginClaim policy gates indicator.
      return !!gatesActive;
    })(),
    flag: "ocg" as const,
    candidateCount: (oc && Array.isArray(oc.candidates)) ? oc.candidates.length : 0,
    reasonCounts,
  };

  return {
    readout: {
      voicePath: voicePathDetectedMaybe,
      voicePathSurface: voicePathSurfaceMaybe,
      voicePathFunctional: voicePathFunctionalMaybe,
      voicePathDelta,

        sevenPrinciplesSpectrum,
      word,
      normalizedWord: sanitized ? present(sanitized) : missing("not_emitted", "sanitized"),
      mode: mode ? present(mode) : missing("not_emitted", "mode"),
      strictInput,
      engineVersion: engineVersion ? present(engineVersion) : missing("not_emitted", "engineVersion"),
      alphabet: alphabet ? present(alphabet) : missing("not_emitted", "alphabet"),
      createdAt: createdAt ? present(createdAt) : missing("not_emitted", "meta.created"),
      principlesPath: principlesPath
        ? present(principlesPath)
        : missing("not_emitted", "heart.principlePath | heart.math7.primary.principlesPath"),
      phoneticIpaV0_1,
      status,
      counts: {
        candidates: candidates.length,
        ops: countOrMissing(ops),
        notes: countOrMissing(notes),
        signals: countOrMissing(signals),
        rejections: missing("not_emitted"),
      },
    },

    evidence: {
      normalizationSteps: pomStringListFromEvidenceField(evidence, "normalizationSteps"),
      ops: pomStringListFromEvidenceField(evidence, "ops"),
      notes: pomStringListFromEvidenceField(evidence, "notes"),
      signals: pomStringListFromEvidenceField(evidence, "signals"),
    },

    candidates,
    math,
    rejections: { items: rejectionItems },
    originClaimGates,
      originClaim,
      rootMap,
      soundRoots: adaptSoundRootsToVM(payload),

      resonanceProfileV1,
    analysisStatusV0_1: parseAnalysisStatusV0_1(payload),
    raw,
  };
}


  // ----------------------- helpers: vowel arrays -----------------------
  function isVowelSymbol(s: string): s is import("../telemetry/types").Vowel {
    return s === "A" || s === "E" || s === "I" || s === "O" || s === "U" || s === "Y" || s === "Ë";
  }

  function asVowelArray2(v: unknown): import("../telemetry/types").Vowel[] | null {
    if (!Array.isArray(v)) return null;
    const out: import("../telemetry/types").Vowel[] = [];
    for (const x of v) {
      const s = asString(x);
      if (!s) return null;
      const up = s.toUpperCase();
      if (!isVowelSymbol(up)) return null;
      out.push(up);
    }
    return out;
  }
// ----------------------- malformed-aware array extraction -----------------------

function pomStringListFromEvidenceField(
  parent: Record<string, unknown> | null,
  field: "normalizationSteps" | "ops" | "notes" | "signals"
): PresentOrMissing<string[]> {
  if (!parent) return missing("not_emitted", `evidence.${field}`);
  if (!(field in parent)) return missing("not_emitted", `evidence.${field}`);

  const v = parent[field];
  if (v == null) return missing("not_emitted", `evidence.${field}`);
  if (!Array.isArray(v)) return missing("malformed", `evidence.${field} expected array`);

  const mapped =
    field === "normalizationSteps"
      ? v.map((x: unknown) => formatNormalizationStep(x))
      : v.map((x: unknown) => formatEvidenceItem(x));

  return present(mapped);
}
