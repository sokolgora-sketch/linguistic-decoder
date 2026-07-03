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

type ParseRootMapResult = { ok: true; value: RootMapV1 } | { ok: false; reason: string };

function parseRootMapV1(v: unknown): ParseRootMapResult {
  if (!isRecord(v)) return { ok: false, reason: "rootMap expected object" };

  const tokens = (v as any).tokens;
  const keys = (v as any).keys;
  const composedMeaning = (v as any).composedMeaning;

  if (!Array.isArray(tokens)) return { ok: false, reason: "rootMap.tokens expected array" };
  if (!Array.isArray(keys)) return { ok: false, reason: "rootMap.keys expected array" };
  if (typeof composedMeaning !== "string") return { ok: false, reason: "rootMap.composedMeaning expected string" };

  // tokens: [{ token: string, role?: string, vowel_path?: string }]
  for (const t of tokens) {
    if (!isRecord(t)) return { ok: false, reason: "rootMap.tokens item expected object" };
    if (typeof (t as any).token !== "string") return { ok: false, reason: "rootMap.tokens[].token expected string" };
    if ("role" in t && (t as any).role != null && typeof (t as any).role !== "string")
      return { ok: false, reason: "rootMap.tokens[].role expected string" };
    if ("vowel_path" in t && (t as any).vowel_path != null && typeof (t as any).vowel_path !== "string")
      return { ok: false, reason: "rootMap.tokens[].vowel_path expected string" };
  }

  // keys: [{ token, language, gloss, evidence[], status, ops?[] }]
  for (const k of keys) {
    if (!isRecord(k)) return { ok: false, reason: "rootMap.keys item expected object" };
    if (typeof (k as any).token !== "string") return { ok: false, reason: "rootMap.keys[].token expected string" };
    if (typeof (k as any).language !== "string") return { ok: false, reason: "rootMap.keys[].language expected string" };
    if (typeof (k as any).gloss !== "string") return { ok: false, reason: "rootMap.keys[].gloss expected string" };
    if (!Array.isArray((k as any).evidence) || !(k as any).evidence.every((x: any) => typeof x === "string"))
      return { ok: false, reason: "rootMap.keys[].evidence expected string[]" };
    if (typeof (k as any).status !== "string") return { ok: false, reason: "rootMap.keys[].status expected string" };
    if ("ops" in k && (k as any).ops != null) {
      if (!Array.isArray((k as any).ops) || !(k as any).ops.every((x: any) => typeof x === "string"))
        return { ok: false, reason: "rootMap.keys[].ops expected string[]" };
    }
  }

  // carriers?: [{ token, language, carrierForm, note? }]
  const carriers = (v as any).carriers;
  if (carriers != null) {
    if (!Array.isArray(carriers)) return { ok: false, reason: "rootMap.carriers expected array" };
    for (const c of carriers) {
      if (!isRecord(c)) return { ok: false, reason: "rootMap.carriers item expected object" };
      if (typeof (c as any).token !== "string") return { ok: false, reason: "rootMap.carriers[].token expected string" };
      if (typeof (c as any).language !== "string") return { ok: false, reason: "rootMap.carriers[].language expected string" };
      if (typeof (c as any).carrierForm !== "string")
        return { ok: false, reason: "rootMap.carriers[].carrierForm expected string" };
      if ("note" in c && (c as any).note != null && typeof (c as any).note !== "string")
        return { ok: false, reason: "rootMap.carriers[].note expected string" };
    }
  }

  // notes?: string[]
  const notes = (v as any).notes;
  if (notes != null) {
    if (!Array.isArray(notes) || !notes.every((x: any) => typeof x === "string"))
      return { ok: false, reason: "rootMap.notes expected string[]" };
  }

  return { ok: true, value: v as RootMapV1 };
}

// ----------------------- small helpers -----------------------

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

// Pick helpers (Instrument contract adapter)
function pickFromRootMetaContract(root: any, key: string): string | null {
  const meta = root && typeof root === "object" ? (root as any).meta : null;
  const contract = root && typeof root === "object" ? (root as any).contract : null;
  return (
    asString(root?.[key]) ??
    asString(contract?.[key]) ??
    asString(meta?.[key]) ??
    null
  );
}

function pickMetaCreated(root: any): string | null {
  const meta = root && typeof root === "object" ? (root as any).meta : null;
  const contract = root && typeof root === "object" ? (root as any).contract : null;
  return (
    asString(contract?.meta?.created) ??
    asString(contract?.meta?.createdAt) ??
    asString(meta?.created) ??
    asString(meta?.createdAt) ??
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

  const o = x as any;
  const from = typeof o.from === "string" ? o.from : "";
  const to = typeof o.to === "string" ? o.to : "";
  const reason = typeof o.reason === "string" ? o.reason : "";

  // { from:"UY", to:"UI", reason:"functional_equivalence" }
  // -> "UY → UI (functional_equivalence)"
  if (from && to) {
    const tail = reason ? ` (${reason})` : "";
    return `${from} → ${to}${tail}`;
  }

  try {
    return JSON.stringify(o);
  } catch {
    return String(o);
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
  if (t === "A" || t === "E" || t === "I" || t === "O" || t === "U" || t === "Y" || t === "Ë") return t as Vowel;
  return null;
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
  const primaryPath = isRecord(getField(payload, "primaryPath"))
    ? (getField(payload, "primaryPath") as Record<string, unknown>)
    : null;
  const detectedArr = primaryPath ? normalizeVowelPathArray(primaryPath["voicePath"]) : null;

  // surface/functional (optional)
  const detected = detectedArr ? detectedArr.join("-") : null;

  const evidence = isRecord(getField(payload, "evidence"))
    ? (getField(payload, "evidence") as Record<string, unknown>)
    : null;

  const deepRoot = isRecord(getField(payload, "deepRoot"))
    ? (getField(payload, "deepRoot") as Record<string, unknown>)
    : null;

  const functionalRoots = Array.isArray(deepRoot?.["functionalRoots"])
    ? (deepRoot?.["functionalRoots"] as unknown[])
    : null;

  const functionalRoot0 = functionalRoots && functionalRoots.length > 0 && isRecord(functionalRoots[0])
    ? (functionalRoots[0] as Record<string, unknown>)
    : null;

  const candidates = Array.isArray(getField(payload, "candidates"))
    ? (getField(payload, "candidates") as unknown[])
    : null;

  const candidate0 = candidates && candidates.length > 0 && isRecord(candidates[0])
    ? (candidates[0] as Record<string, unknown>)
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

// v0.1.x semantics (Milestone B):
// - evidence.surfaceVowels       = authoritative functional/detected path (instrument truth)
// - evidence.surfaceVowelsRaw    = true raw surface path
// - evidence.vowelPath           = legacy duplicate of functional path
//
// Adapter rules:
// - Surface path uses evidence.surfaceVowelsRaw (fallback: heartInstrumentV1.surfaceVowels, then vp.surface)
// - Functional path uses evidence.surfaceVowels (fallback: evidence.vowelPath, then vp.functional)

const hiRoot = isRecord(getField(payload, "heartInstrumentV1"))
  ? (getField(payload, "heartInstrumentV1") as Record<string, unknown>)
  : null;
const hiSurfaceArr = hiRoot ? asStringArray(hiRoot["surfaceVowels"]) : null;

// Evidence may exist at root or mirrored in raw.evidence (adapter must not touch later bindings).
const evRootEvidence = isRecord(getField(payload, "evidence"))
  ? (getField(payload, "evidence") as Record<string, unknown>)
  : null;

const rawPayload = getField(payload, "raw");
const evRawEvidence =
  isRecord(rawPayload) && isRecord(rawPayload["evidence"])
    ? (rawPayload["evidence"] as Record<string, unknown>)
    : null;

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

const functionalForParts =
  evFunctionalArr
    ? evFunctionalArr.join("-")
    : evVowelPathArr
      ? evVowelPathArr.join("-")
      : vp.functional;

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
// - functionalParts uses evidence.surfaceVowels (fallback: evidence.vowelPath, then vp.functional)
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
      return missing((m as any)?.missing ?? "unknown", (m as any)?.note);
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
  const engineVersion = pickFromRootMetaContract(root as any, "engineVersion");
  const mode =
      normalizeMode(pickFromRootMetaContract(root as any, "mode") ?? root["mode"]) ??
      (heart ? normalizeMode(heart["mode"]) : null);
  const alphabet =
    pickFromRootMetaContract(root as any, "alphabet") ??
    (heart ? asString((heart as any)["alphabet"]) : null);

  const meta = isRecord(root["meta"]) ? root["meta"] : null;
  const createdAt = meta ? asString(meta["created"]) : null;

  const heartPrinciplePath = heart ? (asStringArray(heart["principlePath"]) ?? null) : null;

  const heartMath7Primary =
    heart && isRecord((heart as any)["math7"]) && isRecord(((heart as any)["math7"] as any)["primary"])
      ? (((heart as any)["math7"] as any)["primary"] as Record<string, unknown>)
      : null;

  const math7PrinciplesPath = heartMath7Primary ? asStringArray(heartMath7Primary["principlesPath"]) : null;
  const principlesPathRaw = heartPrinciplePath ?? math7PrinciplesPath;
  const principlesPath = principlesPathRaw ? normalizePrinciplesToLabels(principlesPathRaw) : null;

  const primaryPath = isRecord(root["primaryPath"]) ? root["primaryPath"] : null;
  const detectedVoicePath =
    (primaryPath ? normalizeVowelPathArray(primaryPath["voicePath"]) : null) ??
    (heartMath7Primary ? normalizeVowelPathArray(heartMath7Primary["vowels"]) : null);

  const strictInputEmittedRaw =
      (heart ? (heart as any)["strictInput"] : null) ??
      (root as any)["strictInput"] ??
      pickFromRootMetaContract(root as any, "strictInput") ??
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
  const rootEvidence = isRecord(root["evidence"]) ? (root["evidence"] as Record<string, unknown>) : null;

  const rawEvidence =
    isRecord((root as any)["raw"]) && isRecord(((root as any)["raw"] as any)["evidence"])
      ? ((((root as any)["raw"] as any)["evidence"] as any) as Record<string, unknown>)
      : null;

  const heartEvidence =
    heart && isRecord((heart as any)["evidence"])
      ? (((heart as any)["evidence"] as any) as Record<string, unknown>)
      : null;

  const evidence = rootEvidence ?? rawEvidence ?? heartEvidence ?? null;

  const normalizationSteps =
    asArray(evidence?.["normalizationSteps"]) ??
    asArray(heartEvidence?.["normalizationSteps"]) ??
    null;

  const ops =
    asArray(evidence?.["ops"]) ??
    asArray((root as any)["ops"]) ??
    asArray(heartEvidence?.["ops"]) ??
    null;

  const notes =
    asArray(evidence?.["notes"]) ??
    asArray((root as any)["notes"]) ??
    asArray(heartEvidence?.["notes"]) ??
    null;

  const signals =
    asArray(evidence?.["signals"]) ??
    asArray((root as any)["signals"]) ??
    asArray(heartEvidence?.["signals"]) ??
    null;

    // Canonical DeepRoot functional vowel path (if emitted)
    // Prefer this for DeepRoot–Heart gate comparisons; fall back per-candidate otherwise.
    const deepRootFunctionalPathStr: string | null =
  (() => {
    const fr0 = (payload as any)?.deepRoot?.functionalRoots?.[0] ?? null;

    const arr =
      normalizeVowelPathArray(fr0?.vowelPath) ??
      normalizeVowelPathString(fr0?.vowelPath) ??
      normalizeVowelPathArray(fr0?.vowel_path) ??
      normalizeVowelPathString(fr0?.vowel_path) ??
      normalizeVowelPathArray(fr0?.voicePath) ??
      normalizeVowelPathString(fr0?.voicePath) ??
      normalizeVowelPathArray(fr0?.voice_path) ??
      normalizeVowelPathString(fr0?.voice_path) ??
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
        functionalStatement: functionalStatement ? present(functionalStatement) : missing("not_emitted"),
        vowelPath: candVowelPath ? present(candVowelPath) : missing("not_emitted"),

                        deepRootHeartGate: present(
          computeDeepRootHeartGateV01({
            heartPrimaryPath: heartPrimaryPathForGate,
            deepRootFunctionalPath:
              (candVowelPath && candVowelPath.length ? candVowelPath.join("-") : null) ??
              deepRootFunctionalPathStr,
            evidenceRefs: [
              "heartPrimaryPath",
              "primaryPath.voicePath",
              ...(candVowelPath && candVowelPath.length
                ? ["candidates[" + evidenceId + "].vowelPath"]
                : deepRootFunctionalPathStr
                ? ["deepRoot.functionalRoots[0].vowelPath"]
                : []),
            ],
          })
        ),
// leave decomposition for later (shape varies too much right now)
        decomposition: missing("not_emitted") as PresentOrMissing<DecompositionItemVM[]>,

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
    const originClaim: PresentOrMissing<unknown> = oc ? present(oc as unknown) : missing('not_emitted', 'originClaim');

    // ----------------------- rootMap v0.1 -----------------------
    const rootMap: PresentOrMissing<RootMapVM> = (() => {
      if (!isRecord(payload)) return missing("not_emitted", "rootMap");
      if (!("rootMap" in payload)) return missing("not_emitted", "rootMap");

      const v = (payload as any).rootMap;
      if (v == null) return missing("not_emitted", "rootMap");

      const parsed = parseRootMapV1(v);
      if (!parsed.ok) return missing("malformed", parsed.reason);

      return present(parsed.value as any);
    })();

  const reasonCounts: Record<string, number> = {};
  if (oc && Array.isArray(oc.candidates)) {
    for (const c of (oc.candidates as any[])) {
        if (isRecord(c) && Array.isArray(c.reasonCodes)) {
            for (const code of (c.reasonCodes as any[])) {
                const codeStr = String(code);
                reasonCounts[codeStr] = (reasonCounts[codeStr] ?? 0) + 1;
            }
        }
    }
  }

  const gatesActive = (oc && isRecord(oc.policy) && oc.policy.gatesActive === true) || (oc && oc.policy === "gates-v1.1");

  
  // ----------------------- resonance profile v0.1 -----------------------

    const resonanceProfileV1: PresentOrMissing<ResonanceProfileV1VM> = (() => {
    if (!isRecord(payload)) return missing("not_emitted", "resonanceProfileV1");
    if (!("resonanceProfileV1" in payload)) return missing("not_emitted", "resonanceProfileV1");

    const v = (payload as any).resonanceProfileV1;
    if (v == null) return missing("not_emitted", "resonanceProfileV1");

    if (!isRecord(v)) return missing("malformed", "resonanceProfileV1 expected object");

    const version = asString((v as any).version);
    if (!version) return missing("malformed", "resonanceProfileV1.version expected string");

    if (!("surface" in v)) return missing("malformed", "resonanceProfileV1.surface missing");
    if (!("normalized" in v)) return missing("malformed", "resonanceProfileV1.normalized missing");

    return present(v as ResonanceProfileV1VM);
  })();


  // ----------------------- phonetic IPA v0.1 -----------------------
    const phoneticIpaV0_1: PresentOrMissing<PhoneticIpaV0_1VM> = (() => {
    if (!isRecord(payload)) return missing("not_emitted", "phoneticIpaV0_1");
    if (!("phoneticIpaV0_1" in payload)) return missing("not_emitted", "phoneticIpaV0_1");

    const v = (payload as any).phoneticIpaV0_1;
    if (v == null) return missing("not_emitted", "phoneticIpaV0_1");
    if (!isRecord(v)) return missing("malformed", "phoneticIpaV0_1 expected object");

    const ipa = asString((v as any).ipa);
    const voices = asVowelArray2((v as any).voices);
    const unmappedRaw = (v as any)?.diagnostics?.unmapped;
    const unmapped = Array.isArray(unmappedRaw) ? unmappedRaw.map((x: any) => String(x)) : [];

    if (!ipa) return missing("malformed", "phoneticIpaV0_1.ipa expected string");
    if (!voices) return missing("malformed", "phoneticIpaV0_1.voices expected Vowel[]");

    return present({ ipa, voices, unmapped });
  })();
const originClaimGates: OriginClaimGatesVM = {
    active: (() => {
      // VM-only: NEVER override with dev flags / URL params.
      const a = (raw as any)?.originClaimGates?.active;
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

  const v = (parent as any)[field];
  if (v == null) return missing("not_emitted", `evidence.${field}`);
  if (!Array.isArray(v)) return missing("malformed", `evidence.${field} expected array`);

  const mapped =
    field === "normalizationSteps"
      ? v.map((x: unknown) => formatNormalizationStep(x))
      : v.map((x: unknown) => formatEvidenceItem(x));

  return present(mapped);
}
