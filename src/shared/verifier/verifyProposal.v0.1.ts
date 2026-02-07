// Verifier v0.1 — NO LLM
// Surface parity v0.1.1: reuse canonical normalizer + vowel extraction + math7.
// No bespoke basis/vowel/math7 logic lives here.

import type { SevenVowel } from "@/shared/math7.core";
import { VOWEL_INDEX, isSevenVowel } from "@/shared/math7.core";
import { applyStrictTerminalYHint } from "@/shared/math7.basis";
import { PRINCIPLE_MAP } from "@/engine/math7";

import { normalizeWordV1 } from "../../v1/analyzeWordV1";
import { computeMath7 } from "@/v1/math7.core.v1";

import {
  ProposalCandidateV0_1,
  VerifierCheckV0_1,
  VerifierModeV0_1,
  canonicalizeOpsUsedV0_1,
  normalizeOpsUsedV0_1,
  runVerifierRulesV0_1,
} from "./verifierRules.v0.1";

export type ProposalV0_1 = {
  word: unknown;
  mode?: unknown;
  candidates: unknown;
};

export type VerificationCandidateV0_1 = {
  form: string;
  pass: boolean;
  normalizedOpsUsed: string[]; // canonical AllowedOpId[] as strings
  extractedVowelPath: string[];
  checks: VerifierCheckV0_1[];
};

export type VerificationV0_1 = {
  word: string;
  mode: VerifierModeV0_1;
  verifierVersion: "v0.1";
  rulesVersion: "v0.1";

  surface: {
    basis: string;
    vowels: string[];
    principlesPath: string[];
    math7: {
      values1to7: number[];
      rawSum: number;
      total1to7: number | null;
      wrapCount: number;
      jumps: number[];
      events: string[];
    };
  };

  results: VerificationCandidateV0_1[];
  overallPass: boolean;
};

function asString(x: unknown): string | null {
  return typeof x === "string" ? x : null;
}

function normalizeMode(x: unknown): VerifierModeV0_1 {
  return x === "open" ? "open" : "strict";
}

function canonicalBasisV0_1(word: string): string {
  // SSOT normalizer (v1). Fallback kept only for safety (should never hit).
  try {
    const out: any = normalizeWordV1(word as any);
    if (out && typeof out.normalizedWord === "string") return out.normalizedWord;
    if (typeof out === "string") return out;
  } catch {
    // ignore
  }
  return String(word ?? "").trim().toLowerCase();
}

function splitVowelPathTextV0_1(pathText: unknown): SevenVowel[] {
  const s = String(pathText ?? "").trim();
  if (!s) return [];
  // v1 emits "A-E-I" (dash). Keep parsing strict.
  const parts = s.split("-").map((p) => p.trim().toUpperCase());
  const out: SevenVowel[] = [];
  for (const p of parts) {
    if (isSevenVowel(p)) out.push(p);
  }
  return out;
}

function extractSevenVowelsFromBasisV0_1(basis: string): SevenVowel[] {
  const out: SevenVowel[] = [];
  const s = String(basis ?? "");
  for (const ch of s) {
    switch (ch) {
      case "a": out.push("A"); break;
      case "e": out.push("E"); break;
      case "i": out.push("I"); break;
      case "o": out.push("O"); break;
      case "u": out.push("U"); break;
      case "y": out.push("Y"); break;
      case "ë": out.push("Ë"); break;
      default: break;
    }
  }
  return out;
}

function extractVowelsForWordV0_1(word: string, mode: VerifierModeV0_1): SevenVowel[] {
  const basis = canonicalBasisV0_1(word);
  const vowelsRaw = extractSevenVowelsFromBasisV0_1(basis);
// Align with engine Math7 basis selection behavior (strict terminal Y hint)
return applyStrictTerminalYHint({ mode, word: basis }, vowelsRaw);
}

export function extractSevenVowelsPathV0_1(s: string): string[] {
  // Retained export (used by nobody today, but safe). Canonical extraction via v1.
  const v = extractVowelsForWordV0_1(String(s ?? ""), "strict");
  return v as unknown as string[];
}

function buildSurfaceMath7V0_1(vowels: SevenVowel[]) {
  const values1to7 = vowels.map((v) => VOWEL_INDEX[v] + 1);
  const pkt = computeMath7(values1to7);

  return {
    values1to7,
    rawSum: pkt.rawSum,
    total1to7: values1to7.length ? pkt.total1to7 : null,
    wrapCount: pkt.wrapCount,
    jumps: pkt.jumps,
    events: pkt.events,
  };
}

function normalizeCandidates(x: unknown): ProposalCandidateV0_1[] {
  if (!Array.isArray(x)) return [];
  return x
    .filter((c) => c && typeof c === "object")
    .map((c) => c as ProposalCandidateV0_1)
    .filter((c) => typeof c.form === "string" && c.form.trim().length > 0);
}

export function verifyProposalV0_1(input: ProposalV0_1): VerificationV0_1 {
  const word = asString(input.word) ?? "";
  const mode = normalizeMode(input.mode);

  // Surface packet (SSOT)
  const basis = canonicalBasisV0_1(word);
  const vowels = extractVowelsForWordV0_1(basis, mode);
  const principlesPath = vowels.map((v) => PRINCIPLE_MAP[v] ?? String(v));
  const math7 = buildSurfaceMath7V0_1(vowels);

  const candidates = normalizeCandidates(input.candidates);

  const results: VerificationCandidateV0_1[] = candidates.map((cand) => {
    const form = String(cand.form ?? "");
    const formBasis = canonicalBasisV0_1(form);

    const opsUsedRaw = normalizeOpsUsedV0_1(cand.opsUsed);
    const { canonical } = canonicalizeOpsUsedV0_1(opsUsedRaw);

    const extractedVowelPath = extractVowelsForWordV0_1(formBasis, mode);

    const checks = runVerifierRulesV0_1({
      mode,
      candidate: cand,
      opsUsedRaw,
      extractedVowelPath: extractedVowelPath as unknown as string[],
    });

    const pass = checks.every((c) => c.pass);

    return {
      form,
      pass,
      normalizedOpsUsed: canonical as unknown as string[],
      extractedVowelPath: extractedVowelPath as unknown as string[],
      checks,
    };
  });

  const overallPass = results.some((r) => r.pass);

  return {
    word,
    mode,
    verifierVersion: "v0.1",
    rulesVersion: "v0.1",
    surface: {
      basis,
      vowels: vowels as unknown as string[],
      principlesPath,
      math7,
    },
    results,
    overallPass,
  };
}
