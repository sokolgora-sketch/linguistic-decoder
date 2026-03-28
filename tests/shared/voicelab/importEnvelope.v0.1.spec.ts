import {
  importVoiceLabEnvelopeV0_1,
} from "@/shared/voicelab/importEnvelope.v0.1";
import {
  SGI_SEED_VERSION_V0_2,
  VOICELAB_EVIDENCE_VERSION_V0_2,
  ZERO_VOICELAB_BRIDGE_CONTRACT_VERSION_V0_1,
} from "@/shared/voicelab/bridgeContract.v0.1";

describe("VoiceLab bridge import envelope v0.1", () => {
  it("imports VoiceLab evidence v0.2 into a stable ZË-RO envelope", () => {
    const input = {
      schema: "VoiceLabEvidenceV0_2",
      version: VOICELAB_EVIDENCE_VERSION_V0_2,
      source: "voicelab",
      captured_at: "2026-03-28T10:16:34.531Z",
      a_anchor_hz: 728,
      vowels_recorded: 7,
      session_ref: "session-123",
      project_ref: "project-456",
      singer_mode: {
        mode: "singer",
        selected_vowel: "I",
        target_pitch_hz: 220,
      },
      vowels: {},
      notes: [],
    };

    const out = importVoiceLabEnvelopeV0_1(input);

    expect(out).toEqual({
      contractVersion: ZERO_VOICELAB_BRIDGE_CONTRACT_VERSION_V0_1,
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
      payload: input,
    });
  });

  it("imports locked SGI seed v0.2 into a stable ZË-RO envelope", () => {
    const input = {
      seed_version: SGI_SEED_VERSION_V0_2,
      source: "voicelab.baseline.v0.1",
      created_at: "2026-03-28T10:16:41.961Z",
      seed_id: "seed-789",
      seed_stage: "locked",
      seed_locked: true,
      quality_gate: {
        vowels_recorded: 7,
      },
      acoustics: {
        a_anchor_hz: 728,
      },
    };

    const out = importVoiceLabEnvelopeV0_1(input);

    expect(out).toEqual({
      contractVersion: ZERO_VOICELAB_BRIDGE_CONTRACT_VERSION_V0_1,
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
      payload: input,
    });
  });

  it("returns null for unknown payloads", () => {
    expect(importVoiceLabEnvelopeV0_1({ version: "unknown" })).toBeNull();
    expect(importVoiceLabEnvelopeV0_1(null)).toBeNull();
    expect(importVoiceLabEnvelopeV0_1("bad")).toBeNull();
  });
});
