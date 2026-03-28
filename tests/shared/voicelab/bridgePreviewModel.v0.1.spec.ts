import { buildZeroVoiceLabBridgePreviewModelV0_1 } from "@/shared/voicelab/bridgePreviewModel.v0.1";
import {
  makeZeroVoiceLabImportEnvelopeV0_1,
  SGI_SEED_VERSION_V0_2,
  VOICELAB_EVIDENCE_VERSION_V0_2,
} from "@/shared/voicelab/bridgeContract.v0.1";

describe("VoiceLab bridge preview model v0.1", () => {
  it("builds a preview model for voicelab evidence envelopes", () => {
    const envelope = makeZeroVoiceLabImportEnvelopeV0_1({
      importKind: "voicelab_evidence",
      importedAt: null,
      sourceApp: "voicelab",
      sourceVersion: VOICELAB_EVIDENCE_VERSION_V0_2,
      sessionRef: "session-123",
      projectRef: "project-456",
      capturedAt: "2026-03-28T10:16:34.531Z",
      seedId: null,
      summary: {
        vowelsRecorded: 7,
        aAnchorHz: 728,
        singerMode: "singer",
        selectedVowel: "I",
        targetPitchHz: 220,
        seedStage: null,
        seedLocked: null,
      },
      payload: {},
    });

    expect(buildZeroVoiceLabBridgePreviewModelV0_1(envelope)).toEqual({
      importKind: "voicelab_evidence",
      sourceVersion: VOICELAB_EVIDENCE_VERSION_V0_2,
      capturedAt: "2026-03-28T10:16:34.531Z",
      vowelsRecorded: 7,
      aAnchorHz: 728,
      singerMode: "singer",
      selectedVowel: "I",
      targetPitchHz: 220,
      seedStage: null,
      seedLocked: null,
    });
  });

  it("builds a preview model for locked seed envelopes", () => {
    const envelope = makeZeroVoiceLabImportEnvelopeV0_1({
      importKind: "sgi_seed",
      importedAt: null,
      sourceApp: "voicelab",
      sourceVersion: SGI_SEED_VERSION_V0_2,
      sessionRef: null,
      projectRef: null,
      capturedAt: "2026-03-28T10:16:41.961Z",
      seedId: "seed-789",
      summary: {
        vowelsRecorded: 7,
        aAnchorHz: 728,
        singerMode: null,
        selectedVowel: null,
        targetPitchHz: null,
        seedStage: "locked",
        seedLocked: true,
      },
      payload: {},
    });

    expect(buildZeroVoiceLabBridgePreviewModelV0_1(envelope)).toEqual({
      importKind: "sgi_seed",
      sourceVersion: SGI_SEED_VERSION_V0_2,
      capturedAt: "2026-03-28T10:16:41.961Z",
      vowelsRecorded: 7,
      aAnchorHz: 728,
      singerMode: null,
      selectedVowel: null,
      targetPitchHz: null,
      seedStage: "locked",
      seedLocked: true,
    });
  });
});
