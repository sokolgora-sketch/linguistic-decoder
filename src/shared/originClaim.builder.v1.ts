// src/shared/originClaim.builder.v1.ts
import { buildOriginClaimSupportStub } from "@/engine/originClaimSupport.stub";
import { normalizeCandidateRecord } from "./brain/candidateRecord.normalize.v0.1";
import { getSeedCandidateRecordsV0_1 } from "./brain/seedLexicon.v0.1";
import type { OriginClaimSupportSeedV1 } from "./originClaimSupport.v1";

import {
  OriginClaimV1,
  OriginClaimCandidateV1,
  OriginClaimConfidence,
  OriginClaimReasonCode,
  ORIGIN_CLAIM_REASON_TEXT,
  OriginClaimStatus,
} from "./originClaim.v1";

/**
 * Minimal adapter interface to keep builder decoupled.
 * Replace `any` with your real AnalyzeWordResultV1 type when wiring.
 */
export type AnalyzeWordResultV1Like = any;

type SupportSignal = {
  positives: number;
  negatives: number;
  hasC1Pass: boolean;
  hasDeepRootAlign: boolean;
  reasonCodes: OriginClaimReasonCode[];
  evidenceRefs: string[];
};

function isoNow(): string {
  return new Date().toISOString();
}

function ci(s: string | null | undefined): string {
  return (s ?? "").toLocaleLowerCase();
}

function safeStr(x: unknown): string {
  return typeof x === "string" ? x : "";
}

/**
 * Stable candidate id:
 * - Prefer explicit candidate.id if present (but prefix with "oc:" to avoid collisions)
 * - Else derive from language + form
 */
function makeOcId(language: string, form: string | null, rawId?: string): string {
  if (rawId && rawId.trim()) return `oc:${rawId.trim()}`;
  const lang = language.trim() || "unknown";
  const f = (form ?? "").trim() || "∅";
  return `oc:${lang}:${f}`;
}

function confidenceRank(c: OriginClaimConfidence): number {
  // higher is better
  switch (c) {
    case "strong":
      return 4;
    case "medium":
      return 3;
    case "weak":
      return 2;
    case "insufficient_evidence":
      return 1;
  }
}

function statusRank(s: OriginClaimStatus): number {
  switch (s) {
    case "pass":
      return 3;
    case "unknown":
      return 2;
    case "fail":
      return 1;
  }
}

/**
 * Extract a *stable* list of candidates from result.
 * You will likely tweak this to match your canonical result layer.
 */
function extractCandidates(result: AnalyzeWordResultV1Like): any[] {
  const arr = result?.candidates;
  if (Array.isArray(arr)) return arr;
  return [];
}

function extractPrimaryVoicePath(result: AnalyzeWordResultV1Like): string[] | null {
  const fromArray = (v: any): string[] | null =>
    Array.isArray(v) ? v.map(String).filter(Boolean) : null;

  const fromString = (s: any): string[] | null => {
    if (typeof s !== "string") return null;
    const m = s.match(/[AEIOUYË]/gi);
    if (!m || m.length === 0) return null;
    return m.map((x) => x.toLocaleUpperCase());
  };

  // 0) Most stable v1 slot (public contract)
  const p0 = result?.primaryPath?.voicePath;
  const a0 = fromArray(p0);
  if (a0) return a0;
  const s0 = fromString(p0);
  if (s0) return s0;

  // 1) Evidence math7 (common stable emitter)
  const pE = result?.evidence?.math7?.primary?.vowels;
  const aE = fromArray(pE);
  if (aE) return aE;

  // 2) Heart math7 primary (actual engine slot in current JSON)
  const pH = result?.heart?.math7?.primary?.vowels;
  const aH = fromArray(pH);
  if (aH) return aH;

  // 3) Legacy-ish fallbacks (arrays or strings)
  const p1 = result?.heart?.voices?.primaryPath;
  const a1 = fromArray(p1);
  if (a1) return a1;
  const s1 = fromString(p1);
  if (s1) return s1;

  const p2 = result?.voices?.primaryPath;
  const a2 = fromArray(p2);
  if (a2) return a2;
  const s2 = fromString(p2);
  if (s2) return s2;

  const p3 = result?.heart?.math7?.vowels;
  const a3 = fromArray(p3);
  if (a3) return a3;

  return null;
}

function extractCandidateVoiceSeq(cand: any): string[] | null {
  const fromArray = (v: any): string[] | null =>
    Array.isArray(v) ? v.map(String).filter(Boolean) : null;

  const fromString = (s: any): string[] | null => {
    if (typeof s !== "string") return null;
    // Extract only the seven vowels, in order, from strings like:
    // "U-I", "U → I", "U → I (note)", "U I"
    const m = s.match(/[AEIOUYË]/gi);
    if (!m || m.length === 0) return null;
    return m.map((x) => x.toLocaleUpperCase());
  };

  // 1) canonical array
  const v1 = cand?.voices?.voiceSequence;
  const a1 = fromArray(v1);
  if (a1) return a1;

  // 2) other plausible string slots
  const v1s = cand?.voices?.voicePath;
  const s1 = fromString(v1s);
  if (s1) return s1;

  // 3) candidate-level fields (array or string)
  const v2 = cand?.vowel_path;
  const a2 = fromArray(v2);
  if (a2) return a2;
  const s2 = fromString(v2);
  if (s2) return s2;

  const v3 = cand?.vowelPath;
  const a3 = fromArray(v3);
  if (a3) return a3;
  const s3 = fromString(v3);
  if (s3) return s3;

  return null;
}

function extractDeepRoot(result: AnalyzeWordResultV1Like): any | null {
  return result?.deepRoot ?? null;
}

function detectDeepRootAlign(
  deepRoot: any,
  cand: any,
): { aligned: boolean; evidenceRefs: string[] } {
  if (!deepRoot) return { aligned: false, evidenceRefs: [] };

  const refs: string[] = [];
  // Conservative alignment check:
  // - If deepRoot mentions language/family explicitly in a stable way.
  const candLang = safeStr(cand?.language || cand?.lang || cand?.languageCode);
  const candFamily = safeStr(cand?.languageFamily || cand?.family);

  // Try a few likely containers.
  const carriers = deepRoot?.carriers ?? deepRoot?.candidates ?? deepRoot?.hypotheses ?? null;

  const deepStr = JSON.stringify(deepRoot);

  const hasLang = candLang && deepStr.toLocaleLowerCase().includes(candLang.toLocaleLowerCase());
  const hasFam =
    candFamily && deepStr.toLocaleLowerCase().includes(candFamily.toLocaleLowerCase());

  if (hasLang || hasFam) {
    refs.push("deepRoot"); // coarse anchor
    if (deepRoot?.protoRoots) refs.push("deepRoot.protoRoots");
    if (deepRoot?.hypotheses) refs.push("deepRoot.hypotheses");
    if (deepRoot?.carriers) refs.push("deepRoot.carriers");
    return { aligned: true, evidenceRefs: refs };
  }

  // deepRoot exists but no deterministic mapping
  refs.push("deepRoot");
  if (carriers) refs.push("deepRoot.(present)");
  return { aligned: false, evidenceRefs: refs };
}

function detectMorphologyPresent(cand: any): boolean {
  const parts =
    cand?.morphology?.parts ??
    cand?.morph?.parts ??
    cand?.decomposition ??
    cand?.roots ??
    null;

  if (Array.isArray(parts)) return parts.filter((x) => String(x).trim()).length > 0;

  // If you store suffix/root strings, count them.
  const root = safeStr(cand?.root);
  const suffix = safeStr(cand?.suffix);
  return !!(root || suffix);
}

function detectCandidateStatus(cand: any): OriginClaimStatus {
  // prefer explicit status if it matches our enum
  const s = safeStr(cand?.status);
  if (s === "pass" || s === "fail" || s === "unknown") return s;

  // map conventions if present
  const pass = cand?.pass === true || cand?.isPassing === true;
  const fail = cand?.pass === false || cand?.isPassing === false;

  if (pass) return "pass";
  if (fail) return "fail";
  return "unknown";
}

function detectVoicePathSignal(
  primary: string[] | null,
  candSeq: string[] | null,
): "pos" | "neg" | "neutral" {
  if (!primary || primary.length === 0) return "neutral";
  if (!candSeq || candSeq.length === 0) return "neutral";

  const p = primary.map((x) => x.toLocaleUpperCase());
  const c = candSeq.map((x) => x.toLocaleUpperCase());

  // Soft match: if candidate shares the primary path prefix or equals.
  const min = Math.min(p.length, c.length);
  let prefixMatch = true;
  for (let i = 0; i < min; i++) {
    if (p[i] !== c[i]) {
      prefixMatch = false;
      break;
    }
  }
  if (prefixMatch) return "pos";

  // Hard negative only if there is an egregious mismatch:
  // start vowel mismatch is our deterministic "red flag"
  if (p[0] && c[0] && p[0] !== c[0]) return "neg";

  return "neutral";
}

function computeSupportVector(result: AnalyzeWordResultV1Like, cand: any): SupportSignal {
  const primary = extractPrimaryVoicePath(result);
  const deepRoot = extractDeepRoot(result);

  const out: SupportSignal = {
    positives: 0,
    negatives: 0,
    hasC1Pass: false,
    hasDeepRootAlign: false,
    reasonCodes: [],
    evidenceRefs: [],
  };

  // Evidence anchors (stable strings)
  if (primary) out.evidenceRefs.push("primaryPath.voicePath");
  if (result?.heart?.math7?.primary) out.evidenceRefs.push("heart.math7.primary");

  // C1 status
  const status = detectCandidateStatus(cand);
  if (status === "pass") {
    out.hasC1Pass = true;
    out.positives += 1;
    out.reasonCodes.push("OC_C1_PASS");
  } else if (status === "fail") {
    out.negatives += 1;
    out.reasonCodes.push("OC_C1_FAIL");
  } else {
    out.reasonCodes.push("OC_C1_UNKNOWN");
  }

  // Candidate pointer
  const candId = safeStr(cand?.id);
  const candLang = safeStr(cand?.language || cand?.lang || cand?.languageCode);
  const candForm = safeStr(cand?.form || cand?.surface || cand?.value);
  out.evidenceRefs.push(candId ? `candidates[${candId}]` : `candidates[${candLang}:${candForm || "∅"}]`);

  // C2 deepRoot alignment
  const align = detectDeepRootAlign(deepRoot, cand);
  out.evidenceRefs.push(...align.evidenceRefs);
  if (deepRoot) {
    if (align.aligned) {
      out.hasDeepRootAlign = true;
      out.positives += 1;
      out.reasonCodes.push("OC_C2_DEEPROOT_ALIGN");
    } else {
      out.reasonCodes.push("OC_C2_DEEPROOT_PRESENT_NO_MAP");
    }
  }

  // C3 voice path fit
  const candSeq = extractCandidateVoiceSeq(cand);
  const vSig = detectVoicePathSignal(primary, candSeq);
  if (vSig === "pos") {
    out.positives += 1;
    out.reasonCodes.push("OC_C3_VOICEPATH_MATCH");
  } else if (vSig === "neg") {
    out.negatives += 1;
    out.reasonCodes.push("OC_C3_VOICEPATH_MISMATCH");
  } else {
    out.reasonCodes.push("OC_C3_VOICEPATH_UNKNOWN");
  }

  // C4 morphology plausibility
  const morphOk = detectMorphologyPresent(cand);
  if (morphOk) {
    out.positives += 1;
    out.reasonCodes.push("OC_C4_MORPH_PRESENT");
  } else {
    out.reasonCodes.push("OC_C4_MORPH_MISSING");
  }

  return out;
}

function mapConfidence(
  s: SupportSignal,
  mode: string | null | undefined,
): OriginClaimConfidence {
  // If nothing passes C1, always insufficient.
  if (!s.hasC1Pass) return "insufficient_evidence";

  // Strict-mode gate: medium+ requires DeepRoot alignment.
  const strict = (mode ?? "").toLocaleLowerCase() === "strict";
  const strictGateBlocksMedium = strict && !s.hasDeepRootAlign;

  const noNeg = s.negatives === 0;
  const extraPos = Math.max(0, s.positives - 1); // beyond C1

  if (noNeg && extraPos >= 2) return strictGateBlocksMedium ? "weak" : "strong";
  if (noNeg && extraPos >= 1) return strictGateBlocksMedium ? "weak" : "medium";

  // Mixed / only C1
  return "weak";
}

function buildReasons(reasonCodes: OriginClaimReasonCode[]): string[] {
  // Deterministic: codes in the order generated; de-dupe while keeping order.
  const seen = new Set<string>();
  const out: string[] = [];
  for (const code of reasonCodes) {
    if (seen.has(code)) continue;
    seen.add(code);
    out.push(ORIGIN_CLAIM_REASON_TEXT[code]);
  }
  return out;
}

function sortCandidates(a: OriginClaimCandidateV1, b: OriginClaimCandidateV1): number {
  // 1) confidence rank
  const cr = confidenceRank(b.confidence) - confidenceRank(a.confidence);
  if (cr !== 0) return cr;

  // 2) status rank
  const sr = statusRank(b.status) - statusRank(a.status);
  if (sr !== 0) return sr;

  // 3) language (case-insensitive)
  const la = ci(a.language);
  const lb = ci(b.language);
  if (la < lb) return -1;
  if (la > lb) return 1;

  // 4) form (case-insensitive)
  const fa = ci(a.form);
  const fb = ci(b.form);
  if (fa < fb) return -1;
  if (fa > fb) return 1;

  // 5) id
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;
  return 0;
}

function summaryConfidence(cands: OriginClaimCandidateV1[]): OriginClaimConfidence {
  let best: OriginClaimConfidence = "insufficient_evidence";
  for (const c of cands) {
    if (confidenceRank(c.confidence) > confidenceRank(best)) best = c.confidence;
  }
  return best;
}

function summaryNote(conf: OriginClaimConfidence, cands: OriginClaimCandidateV1[]): string {
  const passCount = cands.filter((c) => c.status === "pass").length;
  const strongCount = cands.filter((c) => c.confidence === "strong").length;
  const mediumCount = cands.filter((c) => c.confidence === "medium").length;

  if (conf === "insufficient_evidence") {
    return "No passing candidates with sufficient computed support in the current result layers.";
  }

  // 1–2 lines, stable.
  return `Computed from candidate/deepRoot/voice-path/morphology signals. Passing: ${passCount}; strong: ${strongCount}; medium: ${mediumCount}.`;
}

/**
 * Main entry.
 * Pure function of the adapted result object (except meta.generatedAt).
 */
export function buildOriginClaimV1(result: AnalyzeWordResultV1Like): OriginClaimV1 {
  const engineVersion = safeStr(result?.engine_meta?.version || result?.engineVersion || "unknown");
  const mode = safeStr(result?.engine_meta?.mode || result?.mode || null) || null;
  const word = safeStr(result?.word || result?.basis || result?.input?.word || "");

    // BRAIN-0.2 — Seed fallback flag (shared)
    // Accept from either top-level inputs (legacy) or meta.inputs (contract-safe).
    function readBrainSeedFallbackFlag(result: any): boolean {
      const a = (result && typeof result === "object") ? (result as any) : {};
      const top = a?.inputs && typeof a.inputs === "object" ? a.inputs : null;
      const metaInputs =
        a?.meta && typeof a.meta === "object" &&
        (a.meta as any).inputs && typeof (a.meta as any).inputs === "object"
          ? (a.meta as any).inputs
          : null;

      const v =
        (top?.brainCandidatesSeedFallback ?? top?.seedBrainCandidates) ??
        (metaInputs?.brainCandidatesSeedFallback ?? metaInputs?.seedBrainCandidates) ??
        false;

      return !!v;
    }

    const seedFallbackEnabled = readBrainSeedFallbackFlag(result);
    const rawCandidates = extractCandidates(result);

  // BRAIN-0.1 — CandidateRecord side-channel (shared)
  // Additive only. No filtering/deletion/ranking of OriginClaim candidates.
  // We normalize CandidateRecord-like payloads ONLY if upstream provided them.
  const brainCandidates: any[] = [];
    for (const c of rawCandidates as any[]) {
      const maybeRecord =
        (c && typeof c === "object" && ((c as any).brainCandidateRecord || (c as any).candidateRecord)) ||
        (c && typeof c === "object" && {
          v: (c as any).v,
          languageId: (c as any).languageId,
          languageName: (c as any).languageName ?? (c as any).language,
          form: (c as any).form,
          gloss: (c as any).gloss,
          roots: (c as any).roots,
          explains: (c as any).explains,
          opsUsed: (c as any).opsUsed,
          functionTag: (c as any).functionTag,
          source: (c as any).source,
        });

      const norm = normalizeCandidateRecord(maybeRecord);
      if (norm.ok) brainCandidates.push(norm.record);
    }

// BRAIN-0.2 — Seed fallback (shared)
    // If nothing upstream provided a valid CandidateRecord, inject deterministic seed records
    // so OriginClaim can always expose brainCandidates for non-canon words.
    if (seedFallbackEnabled && !brainCandidates.length) {
      const seeds = getSeedCandidateRecordsV0_1(word);
      for (const s of seeds as any[]) {
        const norm = normalizeCandidateRecord(s);
        if (norm.ok) brainCandidates.push(norm.record);
      }
    }

    const built: OriginClaimCandidateV1[] = rawCandidates.map((cand: any) => {
    const language = safeStr(cand?.language || cand?.lang || cand?.languageCode || "unknown");
    const form = (cand?.form ?? cand?.surface ?? cand?.value ?? null) as string | null;

    const status = detectCandidateStatus(cand);
    const support = computeSupportVector(result, cand);
    const confidence = mapConfidence(support, mode);

    const id = makeOcId(language, form, safeStr(cand?.id));

    const reasons = buildReasons(support.reasonCodes);

    // Evidence refs: de-dupe stable order
    const seen = new Set<string>();
    const evidenceRefs = support.evidenceRefs
      .map((r) => r.trim())
      .filter((r) => r && !seen.has(r) && seen.add(r));

    return {
      id,
      language,
      form,
      status,
      confidence,
      reasons,
      evidenceRefs,
    };
  });

  built.sort(sortCandidates);

  const conf = summaryConfidence(built);

  const supportSeed: OriginClaimSupportSeedV1 = {
    hasHeartMath7Primary: !!result?.heart?.math7?.primary,
    hasEvidenceSignals: Array.isArray((result as any)?.evidence?.signals) && (result as any).evidence.signals.length > 0,
    candidateIds: rawCandidates.map((c: any) => safeStr(c.id)).filter(Boolean),
    deepRootFunctionalRootIds: Array.isArray((result as any)?.deepRoot?.functionalRoots)
      ? (result as any).deepRoot.functionalRoots.map((fr: any) => String(fr.id)).filter(Boolean)
      : [],
  };

  const originClaim: OriginClaimV1 = {
    version: "v1",
    policy: "no_single_winner",
    support: buildOriginClaimSupportStub(`oc:${word}`, supportSeed),
    candidates: built,
    summary: {
      confidence: conf,
      note: summaryNote(conf, built),
    },
    meta: {
      engineVersion,
      generatedAt: isoNow(),
      inputs: {
        word,
        mode,
        alphabet: safeStr(result?.alphabet || result?.engine_meta?.alphabet || null) || null,
      },
    },
  };

    // BRAIN-0.1 — Attach brainCandidates (shared)
  // Only attach when present, to keep existing gold snapshots stable.
  if (Array.isArray(brainCandidates) && brainCandidates.length) {
    try {
      const meta = (originClaim as any).meta;
      const inputs = meta && typeof meta === "object" ? (meta as any).inputs : null;
      if (inputs && typeof inputs === "object" && !(inputs as any).brainCandidates) {
        (inputs as any).brainCandidates = brainCandidates;
      }
    } catch {
      // never throw from side-channel
    }
  }

  return originClaim;
}
