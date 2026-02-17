import type { ClaimPacketV0_1 } from "@/shared/verifier/claimPacket.v0.1";

export type ClaimPacketReasonCodeV0_1 =
  | "CP_I1_INSUFFICIENT_ORACLE_PRIMARY_PATH"
  | "CP_G1_WORD_MISMATCH"
  | "CP_G2_MODE_MISMATCH"
  | "CP_G3_PRIMARY_PATH_NO_MATCHING_CANDIDATE"
  | "CP_C1_WORD_MATCH"
  | "CP_C2_MODE_MATCH"
  | "CP_C3_PRIMARY_PATH_HAS_MATCHING_CANDIDATE";

export const CLAIM_PACKET_REASON_TEXT_V0_1: Record<ClaimPacketReasonCodeV0_1, string> = {
  CP_I1_INSUFFICIENT_ORACLE_PRIMARY_PATH: "Oracle primaryVoicePath was missing/empty; cannot truth-check.",
  CP_G1_WORD_MISMATCH: "Proposal word does not match oracle word.",
  CP_G2_MODE_MISMATCH: "Proposal mode does not match oracle mode.",
  CP_G3_PRIMARY_PATH_NO_MATCHING_CANDIDATE:
    "No proposal candidate matched the oracle primaryVoicePath (using candidate vowelPath if present, otherwise verifier-extracted path).",
  CP_C1_WORD_MATCH: "Proposal word matches oracle word.",
  CP_C2_MODE_MATCH: "Proposal mode matches oracle mode.",
  CP_C3_PRIMARY_PATH_HAS_MATCHING_CANDIDATE: "At least one proposal candidate matched the oracle primaryVoicePath.",
};

export type ClaimPacketMismatchV0_1 = {
  fact: "word" | "mode" | "primaryVoicePath";
  reasonCode: ClaimPacketReasonCodeV0_1;

  oracleSource: string;
  oracleValue: unknown;

  proposalSource: string;
  proposalValue: unknown;
};

export type ClaimPacketVerificationV0_1 = {
  verifierVersion: "v0.1";
  passed: boolean;

  // evidence-first ledger (oracle + proposal sources used)
  evidenceRefs: string[];

  // structured mismatch ledger (auditable)
  mismatches: ClaimPacketMismatchV0_1[];

  // optional: reason codes for quick scanning (pass + fail)
  reasonCodes: ClaimPacketReasonCodeV0_1[];
};

function asString(x: unknown): string | null {
  return typeof x === "string" ? x : null;
}

function normalizeMode(x: unknown): "strict" | "open" {
  return x === "open" ? "open" : "strict";
}

function normVowelToken(t: string): string | null {
  const u = String(t ?? "").trim().toUpperCase();
  if (!u) return null;
  // keep Ë as-is (uppercasing keeps it)
  if (u === "A" || u === "E" || u === "I" || u === "O" || u === "U" || u === "Y" || u === "Ë") return u;
  return null;
}

// Accepts "U→I", "U->I", "U-I", "U I", etc.
export function parseVowelPathStringV0_1(raw: unknown): string[] {
  const s = asString(raw);
  if (!s) return [];
  const cleaned = s
    .replace(/→/g, "-")
    .replace(/->/g, "-")
    .replace(/[|/\\]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleaned.split(/[-\s]+/g).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    const v = normVowelToken(p);
    if (v) out.push(v);
  }
  return out;
}

function eqPath(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function extractProposalCandidatePaths(packet: ClaimPacketV0_1): Array<{ source: string; path: string[] }> {
  const out: Array<{ source: string; path: string[] }> = [];

  // 1) Prefer explicit claim: proposal.candidates[i].vowelPath (if present)
  const candidates = (packet.proposal as any)?.candidates;
  if (Array.isArray(candidates)) {
    for (let i = 0; i < candidates.length; i++) {
      const vp = (candidates[i] as any)?.vowelPath;
      const path = parseVowelPathStringV0_1(vp);
      if (path.length) out.push({ source: `proposal.candidates[${i}].vowelPath`, path });
    }
  }

  // 2) Fallback: deterministic verifier-extracted path (already computed elsewhere)
  const pv = packet.proposalVerification as any;
  const results = pv?.results;
  if (Array.isArray(results)) {
    for (let i = 0; i < results.length; i++) {
      const p = results[i]?.extractedVowelPath;
      if (Array.isArray(p) && p.length && p.every((x: any) => typeof x === "string")) {
        out.push({ source: `proposalVerification.results[${i}].extractedVowelPath`, path: p as string[] });
      }
    }
  }

  return out;
}

export function verifyClaimPacketV0_1(packet: ClaimPacketV0_1): ClaimPacketVerificationV0_1 {
  const mismatches: ClaimPacketMismatchV0_1[] = [];
  const evidenceRefs: string[] = [];
  const reasonCodes: ClaimPacketReasonCodeV0_1[] = [];

  const oracleWord = String(packet?.oracle?.word ?? "").trim();
  const oracleMode = packet?.oracle?.mode === "open" ? "open" : "strict";
  const oraclePrimary = Array.isArray(packet?.oracle?.primaryVoicePath)
    ? packet.oracle.primaryVoicePath.map((x) => normVowelToken(String(x)) ?? "").filter(Boolean)
    : [];

  evidenceRefs.push("oracle.word", "oracle.mode", "oracle.primaryVoicePath");
  for (const r of Array.isArray(packet?.oracle?.evidenceRefs) ? packet.oracle.evidenceRefs : []) {
    evidenceRefs.push(String(r));
  }

  const proposalWord = asString((packet.proposal as any)?.word) ?? "";
  const proposalMode = normalizeMode((packet.proposal as any)?.mode);

  // Gate: word match
  if (proposalWord.trim() !== oracleWord) {
    mismatches.push({
      fact: "word",
      reasonCode: "CP_G1_WORD_MISMATCH",
      oracleSource: "oracle.word",
      oracleValue: oracleWord,
      proposalSource: "proposal.word",
      proposalValue: proposalWord,
    });
    reasonCodes.push("CP_G1_WORD_MISMATCH");
  } else {
    reasonCodes.push("CP_C1_WORD_MATCH");
  }

  // Gate: mode match
  if (proposalMode !== oracleMode) {
    mismatches.push({
      fact: "mode",
      reasonCode: "CP_G2_MODE_MISMATCH",
      oracleSource: "oracle.mode",
      oracleValue: oracleMode,
      proposalSource: "proposal.mode",
      proposalValue: proposalMode,
    });
    reasonCodes.push("CP_G2_MODE_MISMATCH");
  } else {
    reasonCodes.push("CP_C2_MODE_MATCH");
  }

  // Gate: primaryVoicePath match against at least 1 candidate
  if (!oraclePrimary.length) {
    mismatches.push({
      fact: "primaryVoicePath",
      reasonCode: "CP_I1_INSUFFICIENT_ORACLE_PRIMARY_PATH",
      oracleSource: "oracle.primaryVoicePath",
      oracleValue: oraclePrimary,
      proposalSource: "proposal.candidates[*].vowelPath | proposalVerification.results[*].extractedVowelPath",
      proposalValue: null,
    });
    reasonCodes.push("CP_I1_INSUFFICIENT_ORACLE_PRIMARY_PATH");

    return {
      verifierVersion: "v0.1",
      passed: false,
      evidenceRefs,
      mismatches,
      reasonCodes,
    };
  }

  const candPaths = extractProposalCandidatePaths(packet);
  for (const c of candPaths) evidenceRefs.push(c.source);

  const hasMatch = candPaths.some((c) => eqPath(c.path, oraclePrimary));

  if (!hasMatch) {
    mismatches.push({
      fact: "primaryVoicePath",
      reasonCode: "CP_G3_PRIMARY_PATH_NO_MATCHING_CANDIDATE",
      oracleSource: "oracle.primaryVoicePath",
      oracleValue: oraclePrimary,
      proposalSource: "proposal.candidates[*].vowelPath | proposalVerification.results[*].extractedVowelPath",
      proposalValue: candPaths.map((c) => ({ source: c.source, path: c.path })),
    });
    reasonCodes.push("CP_G3_PRIMARY_PATH_NO_MATCHING_CANDIDATE");
  } else {
    reasonCodes.push("CP_C3_PRIMARY_PATH_HAS_MATCHING_CANDIDATE");
  }

  const passed = mismatches.length === 0;

  return {
    verifierVersion: "v0.1",
    passed,
    evidenceRefs,
    mismatches,
    reasonCodes,
  };
}
