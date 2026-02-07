// Verifier v0.1 — NO LLM
// Accept a Proposal JSON (LLM-style candidates) and return deterministic checks + minimal surface packet.

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
  normalizedOpsUsed: string[];      // canonical AllowedOpId[] as strings
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
    principlesPath: string[]; // v0.1: same as vowels (no extra mapping yet)
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

// v0.1 canonical-ish basis (keep minimal; do NOT introduce a second engine)
// If you have a canonical normalizer already, swap this function to call it.
function basisV0_1(word: string): string {
  return word.trim().toLowerCase();
}

// Seven-vowels extraction (A,E,I,O,U,Y,Ë) from a string.
// Emits uppercase vowel symbols.
export function extractSevenVowelsPathV0_1(s: string): string[] {
  const out: string[] = [];
  for (const ch of s) {
    const c = ch.toLowerCase();
    if (c === "a") out.push("A");
    else if (c === "e") out.push("E");
    else if (c === "i") out.push("I");
    else if (c === "o") out.push("O");
    else if (c === "u") out.push("U");
    else if (c === "y") out.push("Y");
    else if (c === "ë") out.push("Ë");
  }
  return out;
}

function vowelTo1to7(v: string): number | null {
  switch (v) {
    case "A": return 1;
    case "E": return 2;
    case "I": return 3;
    case "O": return 4;
    case "U": return 5;
    case "Y": return 6;
    case "Ë": return 7;
    default: return null;
  }
}

function math7SurfaceV0_1(vowels: string[]) {
  const values1to7 = vowels.map((v) => vowelTo1to7(v)).filter((n): n is number => typeof n === "number");
  const rawSum = values1to7.reduce((a, b) => a + b, 0);
  if (!values1to7.length) {
    return { values1to7, rawSum, total1to7: null as number | null, wrapCount: 0, jumps: [] as number[], events: [] as string[] };
  }
  const total1to7 = ((rawSum - 1) % 7) + 1;
  const wrapCount = Math.floor((rawSum - 1) / 7);
  return { values1to7, rawSum, total1to7, wrapCount, jumps: [] as number[], events: [] as string[] };
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
  const basis = basisV0_1(word);
  const vowels = extractSevenVowelsPathV0_1(basis);
  const principlesPath = [...vowels];
  const math7 = math7SurfaceV0_1(vowels);

  const candidates = normalizeCandidates(input.candidates);

  const results: VerificationCandidateV0_1[] = candidates.map((cand) => {
    const opsUsedRaw = normalizeOpsUsedV0_1(cand.opsUsed);
    const { canonical } = canonicalizeOpsUsedV0_1(opsUsedRaw);

    const extractedVowelPath = extractSevenVowelsPathV0_1(String(cand.form ?? ""));

    const checks = runVerifierRulesV0_1({
      mode,
      candidate: cand,
      opsUsedRaw,
      extractedVowelPath,
    });

    const pass = checks.every((c) => c.pass);

    return {
      form: String(cand.form),
      pass,
      normalizedOpsUsed: canonical as unknown as string[],
      extractedVowelPath,
      checks,
    };
  });

  const overallPass = results.some((r) => r.pass);

  return {
    word,
    mode,
    verifierVersion: "v0.1",
    rulesVersion: "v0.1",
    surface: { basis, vowels, principlesPath, math7 },
    results,
    overallPass,
  };
}
