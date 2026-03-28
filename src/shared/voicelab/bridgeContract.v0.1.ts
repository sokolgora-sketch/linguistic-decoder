export const ZERO_VOICELAB_BRIDGE_CONTRACT_VERSION_V0_1 =
  "zero.voicelab.bridge.v0.1" as const;

export const VOICELAB_EVIDENCE_VERSION_V0_2 =
  "voicelab.evidence.v0.2" as const;

export const SGI_SEED_VERSION_V0_2 =
  "sgi.seed.v0.2" as const;

export type ZeroVoiceLabImportKindV0_1 = "voicelab_evidence" | "sgi_seed";

export type ZeroVoiceLabSourceVersionV0_1 =
  | typeof VOICELAB_EVIDENCE_VERSION_V0_2
  | typeof SGI_SEED_VERSION_V0_2;

export type ZeroVoiceLabBridgeSummaryV0_1 = {
  vowelsRecorded: number | null;
  aAnchorHz: number | null;
  singerMode: "standard" | "singer" | null;
  selectedVowel: string | null;
  targetPitchHz: number | null;
  seedStage: string | null;
  seedLocked: boolean | null;
};

export type ZeroVoiceLabImportEnvelopeV0_1 = {
  contractVersion: typeof ZERO_VOICELAB_BRIDGE_CONTRACT_VERSION_V0_1;
  importKind: ZeroVoiceLabImportKindV0_1;
  importedAt: string | null;
  sourceApp: "voicelab";
  sourceVersion: ZeroVoiceLabSourceVersionV0_1 | null;
  sessionRef: string | null;
  projectRef: string | null;
  capturedAt: string | null;
  seedId: string | null;
  summary: ZeroVoiceLabBridgeSummaryV0_1;
  payload: unknown;
};

export function makeZeroVoiceLabImportEnvelopeV0_1(
  input: Omit<ZeroVoiceLabImportEnvelopeV0_1, "contractVersion">
): ZeroVoiceLabImportEnvelopeV0_1 {
  return {
    contractVersion: ZERO_VOICELAB_BRIDGE_CONTRACT_VERSION_V0_1,
    ...input,
  };
}
