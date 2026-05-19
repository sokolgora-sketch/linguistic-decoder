// Verifier Rules v0.1 — NO LLM
// Minimal, falsifiable checks. Expand only via new rule IDs + tests.

import type { AllowedOpId } from "@/shared/ops/allowedOps.v0.1";
import { normalizeToAllowedOpId } from "@/shared/ops/allowedOps.v0.1";
import { extractSevenVowelsFromString } from "@/shared/math7.core";
import { applyStrictTerminalYHint } from "@/shared/math7.basis";
import { isKnownLanguageV0_1 } from "./languageRegistry.v0.1";

export type VerifierModeV0_1 = "strict" | "open";

export type ProposalCandidateV0_1 = {
  form: string;
  language?: unknown; // v0.1.2: required by LANG_KNOWN rule (hard check); missing/invalid -> reject
  opsUsed?: unknown;
  decomposition?: {
    action?: unknown;
    instrument?: unknown;
    unit?: unknown;
    statement?: unknown;
  };
  vowelPath?: unknown; // optional; if present we validate it
  notes?: unknown;
};

export type VerifierCheckV0_1 = {
  id: "OPS_ALLOWED" | "DECOMP_PRESENT" | "PATH_MATCH" | "LANG_KNOWN" | "ROOT_HAS_VOWEL" | "FUNCTION_FIT_NONEMPTY";
  pass: boolean;
  reason: string;
};

function asTrimmedString(x: unknown): string | null {
  if (typeof x !== "string") return null;
  const s = x.trim();
  return s.length ? s : null;
}

export function normalizeOpsUsedV0_1(x: unknown): string[] {
  if (Array.isArray(x)) {
    return x
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }
  if (typeof x === "string") {
    const t = x.trim();
    return t.length ? [t] : [];
  }
  return [];
}

function splitVowelPathTokensV0_1(input: string): string[] {
  const out: string[] = [];
  let cur = "";

  const push = () => {
    const s = cur.trim();
    if (s) out.push(s);
    cur = "";
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    const isWs =
      ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\f" || ch === "\v";

    const isSep =
      isWs ||
      ch === "→" ||
      ch === "-" ||
      ch === "—" ||
      ch === "–" ||
      ch === ">" ||     // supports "->"
      ch === "|" ||
      ch === "/" ||
      ch === "\\";

    if (isSep) {
      push();
      continue;
    }

    cur += ch;
  }

  push();
  return out;
}

export function normalizeVowelPathV0_1(x: unknown): string[] | null {
  if (Array.isArray(x)) {
    const out = x
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    return out.length ? out : null;
  }

  if (typeof x === "string") {
    const raw = x.trim();
    if (!raw) return null;

    const MAX = 4096;
    const s = raw.length > MAX ? raw.slice(0, MAX) : raw;

    // O(n) split; avoids regex backtracking on adversarial input.
    const out = splitVowelPathTokensV0_1(s);
    return out.length ? out : null;
  }

  return null;
}


export function canonicalizeOpsUsedV0_1(tokens: string[]): {
  canonical: AllowedOpId[];
  illegal: string[];
} {
  const canonical: AllowedOpId[] = [];
  const illegal: string[] = [];

  for (const t of tokens) {
    const id = normalizeToAllowedOpId(t);
    if (id) canonical.push(id);
    else illegal.push(t);
  }

  return { canonical, illegal };
}

function collectFunctionFitFieldsV0_1(d: ProposalCandidateV0_1["decomposition"]): string[] {
  if (!d || typeof d !== "object") return [];
  return [d.action, d.instrument, d.unit]
    .map(asTrimmedString)
    .filter((x): x is string => !!x);
}

function collectDecompositionMaterialV0_1(d: ProposalCandidateV0_1["decomposition"]): string[] {
  if (!d || typeof d !== "object") return [];
  return [d.action, d.instrument, d.unit, d.statement]
    .map(asTrimmedString)
    .filter((x): x is string => !!x);
}

function uniqueStableV0_1(xs: readonly string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of xs) {
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
  }
  return out;
}

function extractMaterialVowelsV0_1(parts: readonly string[], mode: VerifierModeV0_1): string[] {
  return uniqueStableV0_1(
    parts.flatMap((part) => {
      const raw = extractSevenVowelsFromString(part);
      return applyStrictTerminalYHint({ mode, word: part }, raw).map((v) => String(v));
    })
  );
}

export function runVerifierRulesV0_1(args: {
  mode: VerifierModeV0_1;
  candidate: ProposalCandidateV0_1;
  opsUsedRaw: string[];
  extractedVowelPath: string[];
}): VerifierCheckV0_1[] {
  const { candidate, opsUsedRaw, extractedVowelPath } = args;

  // 1) OPS_ALLOWED (strict: any token that can't map to AllowedOpId is illegal)
  const { illegal } = canonicalizeOpsUsedV0_1(opsUsedRaw);

  const opsAllowed: VerifierCheckV0_1 = illegal.length
    ? {
        id: "OPS_ALLOWED",
        pass: false,
        reason: `Illegal opsUsed token(s): ${illegal.join(", ")}`,
      }
    : {
        id: "OPS_ALLOWED",
        pass: true,
        reason: opsUsedRaw.length ? "All opsUsed tokens are allowed." : "No opsUsed tokens provided.",
      };

  // 2) DECOMP_PRESENT (v0.1 minimal)
  const d = candidate.decomposition ?? {};
  const hasDecomp =
    !!asTrimmedString(d.action) ||
    !!asTrimmedString(d.instrument) ||
    !!asTrimmedString(d.unit) ||
    !!asTrimmedString(d.statement);

  const decompPresent: VerifierCheckV0_1 = hasDecomp
    ? { id: "DECOMP_PRESENT", pass: true, reason: "Decomposition present." }
    : { id: "DECOMP_PRESENT", pass: false, reason: "Missing decomposition (action/instrument/unit/statement)." };

  // 3) PATH_MATCH (only if proposal includes a path)
  const provided = normalizeVowelPathV0_1(candidate.vowelPath);
  const pathMatch: VerifierCheckV0_1 = !provided
    ? { id: "PATH_MATCH", pass: true, reason: "No vowelPath provided (not checked in v0.1)." }
    : provided.join("|") === extractedVowelPath.join("|")
      ? { id: "PATH_MATCH", pass: true, reason: "Provided vowelPath matches extracted path." }
      : {
          id: "PATH_MATCH",
          pass: false,
          reason: `vowelPath mismatch. provided=${provided.join("→")} extracted=${extractedVowelPath.join("→")}`,
        };

  // 4) LANG_KNOWN (hard check; missing/empty/invalid language -> reject)
  // v1.2a contract: candidates without a verifiable language cannot be evaluated.
  const langRaw = candidate.language;
  const langStr = typeof langRaw === "string" ? langRaw.trim() : "";
  const langKnown: VerifierCheckV0_1 = !langStr
    ? {
        id: "LANG_KNOWN",
        pass: false,
        reason: "Language field empty or missing — candidate cannot be verified without a declared language.",
      }
    : isKnownLanguageV0_1(langStr)
      ? { id: "LANG_KNOWN", pass: true, reason: `Language '${langStr}' is in the v0.1 registry.` }
      : {
          id: "LANG_KNOWN",
          pass: false,
          reason: `Language '${langStr}' is not a documented human language in the v0.1 registry (constructed/fictional/unsupported).`,
        };

  // 5) ROOT_HAS_VOWEL (hard check; decomposition/root material must carry the extracted vowel path)
    const decompMaterial = collectDecompositionMaterialV0_1(candidate.decomposition);
    const materialVowels = extractMaterialVowelsV0_1(decompMaterial, args.mode);
    const extractedSet = new Set(extractedVowelPath.map((v) => String(v)));
    const overlap = uniqueStableV0_1(materialVowels.filter((v) => extractedSet.has(v)));

    const rootHasVowel: VerifierCheckV0_1 =
      extractedVowelPath.length === 0
        ? {
            id: "ROOT_HAS_VOWEL",
            pass: false,
            reason: "Candidate form has no extracted Seven-Voice vowels; root-vowel alignment cannot be verified.",
          }
        : decompMaterial.length === 0
          ? {
              id: "ROOT_HAS_VOWEL",
              pass: false,
              reason: "No decomposition/root material available for root-vowel check.",
            }
          : overlap.length > 0
            ? {
                id: "ROOT_HAS_VOWEL",
                pass: true,
                reason: `Decomposition/root material contains extracted vowel(s): ${overlap.join("→")}.`,
              }
            : {
                id: "ROOT_HAS_VOWEL",
                pass: false,
                reason: `Decomposition/root material has no vowel from extracted path. extracted=${extractedVowelPath.join("→")} material=${materialVowels.length ? materialVowels.join("→") : "none"}.`,
              };

    // 6) FUNCTION_FIT_NONEMPTY (hard check; statement alone is not enough)
    const functionFitFields = collectFunctionFitFieldsV0_1(candidate.decomposition);
    const functionFitNonempty: VerifierCheckV0_1 =
      functionFitFields.length > 0
        ? {
            id: "FUNCTION_FIT_NONEMPTY",
            pass: true,
            reason: `Structured function field(s) present: ${functionFitFields.join(" | ")}.`,
          }
        : {
            id: "FUNCTION_FIT_NONEMPTY",
            pass: false,
            reason:
              "Missing structured function fit: provide non-empty action, instrument, or unit. statement alone is insufficient.",
          };

    return [opsAllowed, decompPresent, pathMatch, langKnown, rootHasVowel, functionFitNonempty];
}
