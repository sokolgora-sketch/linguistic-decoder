import { proposeOnceV0_2, type ProposeOnceReqV0_2 } from "@/shared/orchestrator/proposeOnce.v0.2";
import { verifyClaimPacketV0_1, type ClaimPacketVerificationV0_1 } from "@/shared/verifier/verifyClaimPacket.v0.1";
import type { ClaimPacketOracleV0_1, ClaimPacketV0_1 } from "@/shared/verifier/claimPacket.v0.1";

import type { SevenVowel } from "@/shared/math7.core";
import { extractSevenVowelsFromString } from "@/shared/math7.core";
import { applyStrictTerminalYHint } from "@/shared/math7.basis";

export type ProposeWithOracleReqV0_1 = ProposeOnceReqV0_2;

export type ProposeWithOracleOutV0_1 = {
  ok: boolean;
  word: string;
  mode: "strict" | "open";
  provider: string;

  proposerRawText: string;
  proposal: unknown | null;
  proposalVerification: unknown | null;

  oracle: ClaimPacketOracleV0_1 | null;
  claimPacket: ClaimPacketV0_1 | null;
  claimVerification: ClaimPacketVerificationV0_1 | null;

  error?: string;
};

function normalizeWordBasisV0_1(input: string): string {
  const raw = String(input ?? "");
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const collapsed = trimmed.replace(/\s+/g, " ");
  const tokens = collapsed.split(" ").filter(Boolean);

  // Keep diacritics (ë stays ë). Normalize Unicode form to reduce weird edge cases.
  return String(tokens[0] ?? "").normalize("NFKC").toLowerCase();
}

function buildOracleV0_1(word: string, mode: "strict" | "open"): ClaimPacketOracleV0_1 {
  const basis = normalizeWordBasisV0_1(word);

  // SSOT: extractor + strict terminal-Y hint (must match verifier behavior)
  const vowelsRaw = extractSevenVowelsFromString(String(basis ?? "")) as unknown as SevenVowel[];
  const vowels = applyStrictTerminalYHint({ mode, word: basis }, vowelsRaw) as unknown as string[];

  const evidenceRefs: string[] = [
    "oracle.basis:normalizeWordBasisV0_1",
    "oracle.primaryVoicePath:extractSevenVowelsFromString",
    "oracle.primaryVoicePath:applyStrictTerminalYHint",
  ];

  return {
    word: String(word ?? ""),
    mode,
    primaryVoicePath: Array.isArray(vowels) ? vowels : [],
    evidenceRefs,
  };
}

export async function proposeWithOracleV0_1(req: ProposeWithOracleReqV0_1): Promise<ProposeWithOracleOutV0_1> {
  const word = String(req.word ?? "").trim();
  const mode: "strict" | "open" = req.mode === "open" ? "open" : "strict";

  if (!word) {
    return {
      ok: false,
      word: "",
      mode,
      provider: String(req.provider ?? ""),
      proposerRawText: "",
      proposal: null,
      proposalVerification: null,
      oracle: null,
      claimPacket: null,
      claimVerification: null,
      error: "Missing word",
    };
  }

  const po = await proposeOnceV0_2({ word, mode, provider: req.provider });

  if (!po.ok || !po.proposal) {
    return {
      ok: false,
      word,
      mode,
      provider: String(po.provider ?? ""),
      proposerRawText: po.proposerRawText ?? "",
      proposal: po.proposal ?? null,
      proposalVerification: po.verification ?? null,
      oracle: null,
      claimPacket: null,
      claimVerification: null,
      error: po.error ?? "ProposeOnce failed",
    };
  }

  const oracle = buildOracleV0_1(word, po.mode);

  const claimPacket: ClaimPacketV0_1 = {
    claimPacketVersion: "v0.1",
    proposal: po.proposal as any,
    proposalVerification: (po.verification as any) ?? null,
    oracle,
  };

  const claimVerification = verifyClaimPacketV0_1(claimPacket);

  return {
    ok: true,
    word,
    mode: po.mode,
    provider: String(po.provider ?? ""),
    proposerRawText: po.proposerRawText ?? "",
    proposal: po.proposal ?? null,
    proposalVerification: po.verification ?? null,
    oracle,
    claimPacket,
    claimVerification,
  };
}
