import { proposeOnceV0_2, type ProposeOnceReqV0_2 } from "@/shared/orchestrator/proposeOnce.v0.2";
import { verifyClaimPacketV0_1, type ClaimPacketVerificationV0_1 } from "@/shared/verifier/verifyClaimPacket.v0.1";
import type {
  ClaimPacketOracleV0_1,
  ClaimPacketV0_1,
  ClaimPacketEngineV1SnapshotV0_1,
} from "@/shared/verifier/claimPacket.v0.1";

import type { SevenVowel } from "@/shared/math7.core";
import { applyStrictTerminalYHint } from "@/shared/math7.basis";

import { analyzeWordV1 as analyzeWordV1_sync } from "@/v1/analyzeWordV1";
import type { AnalysisResult as AnalysisResultV1 } from "@/v1/types";

export type ProposeWithEngineOracleReqV0_2 = ProposeOnceReqV0_2;

export type ProposeWithEngineOracleOutV0_2 = {
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

function asStringArray(x: unknown): string[] {
  return Array.isArray(x) ? x.map((v) => String(v)) : [];
}

function buildEngineV1SnapshotV0_2(res: AnalysisResultV1): ClaimPacketEngineV1SnapshotV0_1 {
  return {
    source: "v1/analyzeWordV1",
    engineVersion: String(res?.meta?.engineVersion ?? res?.engineVersion ?? ""),
    contractVersion: String(res?.meta?.contractVersion ?? ""),
    rulesetVersion: String(res?.meta?.rulesetVersion ?? ""),
    canonVersion: String(res?.meta?.canonVersion ?? ""),
    word: String(res?.word ?? ""),
    normalizedWord: String(res?.normalizedWord ?? ""),
    evidence: {
      basis: String(res?.evidence?.basis ?? ""),
      surfaceVowels: asStringArray(res?.evidence?.surfaceVowels),
      surfacePath: String(res?.evidence?.surfacePath ?? ""),
    },
    warnings: Array.isArray(res?.warnings) ? res.warnings.map(String) : undefined,
  };
}

function buildOracleFromEngineV1V0_2(word: string, mode: "strict" | "open"): ClaimPacketOracleV0_1 {
  const v1 = analyzeWordV1_sync(word);
  const snap = buildEngineV1SnapshotV0_2(v1);

  // SSOT oracle path for truth-checking:
  // derive from engine v1 evidence.surfaceVowels, then apply strict terminal-Y hint
  const basis = snap.evidence.basis;
  const vowelsRaw = (snap.evidence.surfaceVowels ?? []) as unknown as SevenVowel[];
  const vowels = applyStrictTerminalYHint({ mode, word: basis }, vowelsRaw) as unknown as string[];

  const evidenceRefs: string[] = [
    "oracle.word",
    "oracle.mode",
    "engineV1:src/v1/analyzeWordV1",
    "engineV1.evidence.basis",
    "engineV1.evidence.surfaceVowels",
    "oracle.primaryVoicePath:applyStrictTerminalYHint",
  ];

  return {
    word: String(word ?? ""),
    mode,
    primaryVoicePath: Array.isArray(vowels) ? vowels : [],
    evidenceRefs,
    engineV1: snap,
  };
}

export async function proposeWithEngineOracleV0_2(
  req: ProposeWithEngineOracleReqV0_2
): Promise<ProposeWithEngineOracleOutV0_2> {
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

  const oracle = buildOracleFromEngineV1V0_2(word, po.mode);

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
