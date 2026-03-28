import {
  makeZeroVoiceLabImportEnvelopeV0_1,
  SGI_SEED_VERSION_V0_2,
  VOICELAB_EVIDENCE_VERSION_V0_2,
  type ZeroVoiceLabBridgeSummaryV0_1,
  type ZeroVoiceLabImportEnvelopeV0_1,
} from "./bridgeContract.v0.1";

function asRecord(input: unknown): Record<string, unknown> | null {
  return input !== null && typeof input === "object" && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : null;
}

function asString(input: unknown): string | null {
  return typeof input === "string" ? input : null;
}

function asNumber(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) ? input : null;
}

function asBoolean(input: unknown): boolean | null {
  return typeof input === "boolean" ? input : null;
}

function buildEvidenceSummary(payload: Record<string, unknown>): ZeroVoiceLabBridgeSummaryV0_1 {
  const singerMode = asRecord(payload.singer_mode);
  return {
    vowelsRecorded: asNumber(payload.vowels_recorded),
    aAnchorHz: asNumber(payload.a_anchor_hz),
    singerMode: singerMode?.mode === "standard" || singerMode?.mode === "singer"
      ? singerMode.mode
      : null,
    selectedVowel: asString(singerMode?.selected_vowel),
    targetPitchHz: asNumber(singerMode?.target_pitch_hz),
    seedStage: null,
    seedLocked: null,
  };
}

function buildSeedSummary(payload: Record<string, unknown>): ZeroVoiceLabBridgeSummaryV0_1 {
  return {
    vowelsRecorded: asNumber(payload.vowels_recorded ?? asRecord(payload.quality_gate)?.vowels_recorded),
    aAnchorHz: asNumber(asRecord(payload.acoustics)?.a_anchor_hz),
    singerMode: null,
    selectedVowel: null,
    targetPitchHz: null,
    seedStage: asString(payload.seed_stage),
    seedLocked: asBoolean(payload.seed_locked),
  };
}

export function importVoiceLabEnvelopeV0_1(input: unknown): ZeroVoiceLabImportEnvelopeV0_1 | null {
  const payload = asRecord(input);
  if (!payload) return null;

  const version = asString(payload.version) ?? asString(payload.seed_version);

  if (version === VOICELAB_EVIDENCE_VERSION_V0_2) {
    return makeZeroVoiceLabImportEnvelopeV0_1({
      importKind: "voicelab_evidence",
      importedAt: null,
      sourceApp: "voicelab",
      sourceVersion: version,
      sessionRef: asString(payload.session_ref),
      projectRef: asString(payload.project_ref),
      capturedAt: asString(payload.captured_at),
      seedId: null,
      summary: buildEvidenceSummary(payload),
      payload,
    });
  }

  if (version === SGI_SEED_VERSION_V0_2) {
    return makeZeroVoiceLabImportEnvelopeV0_1({
      importKind: "sgi_seed",
      importedAt: null,
      sourceApp: "voicelab",
      sourceVersion: version,
      sessionRef: null,
      projectRef: null,
      capturedAt: asString(payload.created_at),
      seedId: asString(payload.seed_id),
      summary: buildSeedSummary(payload),
      payload,
    });
  }

  return null;
}
