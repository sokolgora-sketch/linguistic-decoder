import type { DeepRootHeartGateReasonCode, DeepRootHeartGateV01 } from "./deepRootHeartGate.v0.1";
import { gateInsufficient, gateResult } from "./deepRootHeartGate.v0.1";

// Input is deliberately tiny: we do not read raw payload here.
// Wiring later will provide these fields from emitted/adapter-safe sources.
export type DeepRootHeartGateInputV01 = {
  heartPrimaryPath?: string | null;     // e.g. "U→I"
  candidateResolvedPath?: string | null; // e.g. "U→I" or "U→A"
  evidenceRefs?: string[] | null;
};

function terminalVowel(path: string): string | null {
  // Accept both "U→I" and "U->I" to be defensive.
  const s = String(path).trim();
  if (!s) return null;

  const parts =
    s.includes("→") ? s.split("→") :
    s.includes("->") ? s.split("->") :
    s.includes("-") ? s.split("-") :
    [s];
  const last = parts[parts.length - 1]?.trim();
  return last ? last : null;
}

function stableUniq(arr: string[]): string[] {
  // preserve first-seen order while removing duplicates
  const out: string[] = [];
  const seen = new Set<string>();
  for (const x of arr) {
    const v = String(x).trim();
    if (!v) continue;
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

export function computeDeepRootHeartGateV01(input: DeepRootHeartGateInputV01): DeepRootHeartGateV01 {
  const heart = input.heartPrimaryPath ?? null;
  const cand = input.candidateResolvedPath ?? null;
  const evidenceRefs = stableUniq([...(input.evidenceRefs ?? [])]);

  const reasons: DeepRootHeartGateReasonCode[] = [];

  if (!heart || !terminalVowel(heart)) {
    reasons.push("HEART_PRIMARY_PATH_MISSING");
  }
  if (!cand || !terminalVowel(cand)) {
    reasons.push("CANDIDATE_PATH_MISSING");
  }

  if (reasons.length > 0) {
    return gateInsufficient(reasons, evidenceRefs);
  }

  const heartTerm = terminalVowel(heart as string);
  const candTerm = terminalVowel(cand as string);

  // Defensive: terminalVowel() already checked, but keep safe.
  if (!heartTerm) return gateInsufficient(["HEART_PRIMARY_PATH_MISSING"], evidenceRefs);
  if (!candTerm) return gateInsufficient(["CANDIDATE_PATH_MISSING"], evidenceRefs);

  if (heartTerm !== candTerm) {
    return gateResult("misaligned", ["TERMINAL_VOWEL_CONFLICT"], evidenceRefs);
  }

  return gateResult("aligned", [], evidenceRefs);
}
