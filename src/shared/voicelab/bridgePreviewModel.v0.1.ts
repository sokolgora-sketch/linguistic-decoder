import type { ZeroVoiceLabImportEnvelopeV0_1 } from "./bridgeContract.v0.1";

export type ZeroVoiceLabBridgePreviewModelV0_1 = {
  importKind: "voicelab_evidence" | "sgi_seed";
  sourceVersion: string | null;
  capturedAt: string | null;
  vowelsRecorded: number | null;
  aAnchorHz: number | null;
  singerMode: "standard" | "singer" | null;
  selectedVowel: string | null;
  targetPitchHz: number | null;
  seedStage: string | null;
  seedLocked: boolean | null;
};

export function buildZeroVoiceLabBridgePreviewModelV0_1(
  envelope: ZeroVoiceLabImportEnvelopeV0_1
): ZeroVoiceLabBridgePreviewModelV0_1 {
  return {
    importKind: envelope.importKind,
    sourceVersion: envelope.sourceVersion,
    capturedAt: envelope.capturedAt,
    vowelsRecorded: envelope.summary.vowelsRecorded,
    aAnchorHz: envelope.summary.aAnchorHz,
    singerMode: envelope.summary.singerMode,
    selectedVowel: envelope.summary.selectedVowel,
    targetPitchHz: envelope.summary.targetPitchHz,
    seedStage: envelope.summary.seedStage,
    seedLocked: envelope.summary.seedLocked,
  };
}
