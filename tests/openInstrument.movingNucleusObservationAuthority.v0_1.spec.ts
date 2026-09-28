import {
  MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1,
  validateMovingNucleusObservationAuthorityV0_1,
  type MovingNucleusObservationAuthorityV0_1,
} from "@/shared/openInstrument/movingNucleusObservationAuthority.v0_1";
import { normalizeSpokenVowelsV0_1 } from "@/shared/openInstrument/spokenVowelNormalization.v0_1";
import type { SpokenVowelNormalizationInputV0_1 } from "@/shared/openInstrument/spokenVowelNormalization.v0_1";

const transcriptionProvenance = {
  authorityClass: "TRANSCRIPTION_ASSERTED" as const,
  sourceId: "fixture.transcription.v0_1",
  evidenceRefs: ["fixture.transcription:entry"],
  language: "en",
  dialectOrDoculect: "fixture",
  claimScope: "fixture notation",
  limitations: [],
  explicitNotation: "single nucleus notation",
  scopeOrConvention: "fixture transcription convention",
};

const phonologicalProvenance = {
  authorityClass: "PHONOLOGICALLY_DOCUMENTED" as const,
  sourceId: "fixture.phonology.v0_1",
  evidenceRefs: ["fixture.phonology:entry"],
  language: "en",
  dialectOrDoculect: "fixture",
  claimScope: "fixture phonological analysis",
  limitations: ["fixture scope only"],
  boundedClaim: "The scoped source describes one nucleus.",
};

const acousticProvenance = {
  authorityClass: "ACOUSTICALLY_OBSERVED" as const,
  sourceId: "fixture.acoustic.v0_1",
  evidenceRefs: ["fixture.acoustic:token"],
  language: "en",
  dialectOrDoculect: "fixture",
  claimScope: "fixture token only",
  limitations: ["synthetic structural fixture"],
  tokenOrRecordingRef: "fixture.recording:1",
  speakerOrSessionGroup: "fixture.session:1",
  context: "carrier fixture",
  boundaryOrSpan: "0ms-100ms",
  temporalAlignment: ["0ms", "100ms"],
  temporalObservations: [
    { coordinate: "0ms", measuredFields: ["F1", "F2"] },
    { coordinate: "100ms", measuredFields: ["F1", "F2"] },
  ],
  measuredFields: ["F1", "F2"],
  extractionMethod: "fixture measurement method",
  softwareVersion: "fixture-software-v0.1",
  settingsProvenance: "fixture settings",
  qcState: "PASS" as const,
  correctionExclusionState: "NONE" as const,
  uncertaintyLimitations: ["synthetic fixture only"],
};

const voiceFamilyMappingAuthority = {
  authorityType: "REVIEWED_OPEN_INSTRUMENT_MAPPING" as const,
  mappingId: "fixture.mapping.v0_1",
  evidenceRefs: ["fixture.mapping:entry"],
  claimScope: "fixture mapping scope",
};

function record(
  overrides: Partial<MovingNucleusObservationAuthorityV0_1> = {},
): MovingNucleusObservationAuthorityV0_1 {
  return {
    schemaVersion: MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1,
    aggregateStatus: "UNKNOWN",
    nucleusStructure: {
      state: "UNRESOLVED",
      rawIpaSegments: ["o", "ʊ"],
      explicitNotation: null,
    },
    movement: { state: "UNKNOWN" },
    phoneticAnchors: { state: "UNKNOWN", anchors: null },
    voiceFamilyAnchors: { state: "UNKNOWN", anchors: null },
    canonicalizationStatus: "not_authorized",
    authorityByClaim: {
      nucleusStructure: null,
      movement: null,
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
    reasonCodes: [],
    ...overrides,
  };
}

function input(ipa: string): SpokenVowelNormalizationInputV0_1 {
  return {
    mode: "spoken_ipa",
    ipa,
    language: "en",
    dialectOrAccent: null,
    pronunciationSource: "explicit_ipa",
    provenance: { sourceId: "fixture.explicit-ipa.v0_1", suppliedBy: "user" },
  };
}

test("T1 accepts a transcriptional structure claim with explicit provenance", () => {
  const value = record({
    aggregateStatus: "SUPPORTED",
    nucleusStructure: {
      state: "ONE_NUCLEUS",
      rawIpaSegments: ["o"],
      explicitNotation: "single nucleus notation",
    },
    authorityByClaim: {
      nucleusStructure: { authorityClass: "TRANSCRIPTION_ASSERTED", provenance: transcriptionProvenance },
      movement: null,
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  expect(validateMovingNucleusObservationAuthorityV0_1(value).ok).toBe(true);
});

test("T2 plain IPA adjacency cannot authorize movement", () => {
  const value = record({
    movement: { state: "OBSERVED" },
    authorityByClaim: {
      nucleusStructure: null,
      movement: { authorityClass: "TRANSCRIPTION_ASSERTED", provenance: { ...transcriptionProvenance, explicitNotation: "" } },
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  const result = validateMovingNucleusObservationAuthorityV0_1(value);
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("MOVEMENT_AUTHORITY_MISSING");
});

test("T3 accepts a scoped phonological one-nucleus claim", () => {
  const value = record({
    aggregateStatus: "SUPPORTED",
    nucleusStructure: {
      state: "ONE_NUCLEUS",
      rawIpaSegments: ["o", "ʊ"],
      explicitNotation: null,
    },
    authorityByClaim: {
      nucleusStructure: { authorityClass: "PHONOLOGICALLY_DOCUMENTED", provenance: phonologicalProvenance },
      movement: null,
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  expect(validateMovingNucleusObservationAuthorityV0_1(value).ok).toBe(true);
});

test("T4 accepts acoustic movement with complete measurement provenance", () => {
  const value = record({
    aggregateStatus: "SUPPORTED",
    nucleusStructure: {
      state: "UNRESOLVED",
      rawIpaSegments: ["o", "ʊ"],
      explicitNotation: null,
    },
    movement: { state: "OBSERVED" },
    phoneticAnchors: {
      state: "SUPPORTED",
      anchors: [
        { kind: "acoustic_region", value: "O-family region", order: 0, evidenceRef: "fixture.acoustic:0" },
        { kind: "acoustic_region", value: "U-family region", order: 1, evidenceRef: "fixture.acoustic:1" },
      ],
    },
    authorityByClaim: {
      nucleusStructure: null,
      movement: { authorityClass: "ACOUSTICALLY_OBSERVED", provenance: acousticProvenance },
      phoneticAnchors: { authorityClass: "ACOUSTICALLY_OBSERVED", provenance: acousticProvenance },
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  expect(validateMovingNucleusObservationAuthorityV0_1(value).ok).toBe(true);
});

test("T5 rejects acoustic movement without measurement provenance", () => {
  const value = record({
    movement: { state: "OBSERVED" },
    authorityByClaim: {
      nucleusStructure: null,
      movement: { authorityClass: "ACOUSTICALLY_OBSERVED", provenance: { ...acousticProvenance, temporalObservations: [] } },
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  const result = validateMovingNucleusObservationAuthorityV0_1(value);
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("MEASUREMENT_PROVENANCE_MISSING");
});

test("T6 rejects failed acoustic QC", () => {
  const value = record({
    movement: { state: "OBSERVED" },
    authorityByClaim: {
      nucleusStructure: null,
      movement: { authorityClass: "ACOUSTICALLY_OBSERVED", provenance: { ...acousticProvenance, qcState: "FAIL" } },
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  const result = validateMovingNucleusObservationAuthorityV0_1(value);
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("MEASUREMENT_QC_FAILED");
});

test("T7 preserves phonetic anchors without Voice-family mapping", () => {
  const value = record({
    aggregateStatus: "SUPPORTED",
    phoneticAnchors: {
      state: "SUPPORTED",
      anchors: [{ kind: "ipa_description", value: "o-like quality", order: 0, evidenceRef: "fixture.ipa:0" }],
    },
    authorityByClaim: {
      nucleusStructure: null,
      movement: null,
      phoneticAnchors: { authorityClass: "TRANSCRIPTION_ASSERTED", provenance: transcriptionProvenance },
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  expect(validateMovingNucleusObservationAuthorityV0_1(value).ok).toBe(true);
});

test("T8 rejects Voice-family anchors without mapping authority", () => {
  const value = record({
    voiceFamilyAnchors: { state: "SUPPORTED", anchors: ["O", "U"] },
    authorityByClaim: {
      nucleusStructure: null,
      movement: null,
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  const result = validateMovingNucleusObservationAuthorityV0_1(value);
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("VOICE_FAMILY_AUTHORITY_MISSING");
});

test("T9 preserves scoped conflict without selecting a winner", () => {
  const value = record({
    aggregateStatus: "CONFLICTED",
    reasonCodes: ["SOURCE_SCOPE_CONFLICT"],
  });

  expect(validateMovingNucleusObservationAuthorityV0_1(value).ok).toBe(true);
  expect(value.authorityByClaim.voiceFamilyAnchors).toBeNull();
});

test("T10 observation cannot populate normalizedVoicePath", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record(), {
    normalizedVoicePath: ["O", "U"],
  });

  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("CANONICALIZATION_NOT_AUTHORIZED");
});

test("T11 current stone adjacent-vowel behavior remains Null", () => {
  const result = normalizeSpokenVowelsV0_1(input("/stoʊn/"));
  expect(result.status).toBe("null");
  expect(result.normalizedVoicePath).toBeNull();
  expect(result.nuclei[0]?.movingObservation).toBeUndefined();
});

test("T12 current ai adjacent-vowel behavior remains Null", () => {
  const result = normalizeSpokenVowelsV0_1(input("/aɪ/"));
  expect(result.status).toBe("null");
  expect(result.normalizedVoicePath).toBeNull();
  expect(result.nuclei[0]?.movingObservation).toBeUndefined();
});

test("T13 existing P1 output remains deterministic and unchanged", () => {
  const first = normalizeSpokenVowelsV0_1(input("/ˈmʌðər/"));
  const second = normalizeSpokenVowelsV0_1(input("/ˈmʌðər/"));
  expect(second).toEqual(first);
  expect(first.normalizedVoicePath).toEqual(["Ë", "Ë"]);
});

test("T14 current runtime emits no authority record", () => {
  const result = normalizeSpokenVowelsV0_1(input("/o/"));
  expect(result.nuclei[0]).not.toHaveProperty("movingObservation");
});

test("T15 missing movement evidence remains UNKNOWN, not NOT_OBSERVED", () => {
  const value = record();
  expect(value.movement.state).toBe("UNKNOWN");
  expect(value.movement.state).not.toBe("NOT_OBSERVED");
  expect(validateMovingNucleusObservationAuthorityV0_1(value).ok).toBe(true);
});

test("T16 NOT_OBSERVED requires affirmative authority", () => {
  const missingAuthority = record({ movement: { state: "NOT_OBSERVED" } });
  const blocked = validateMovingNucleusObservationAuthorityV0_1(missingAuthority);
  expect(blocked.ok).toBe(false);
  if (!blocked.ok) expect(blocked.reasonCodes).toContain("MOVEMENT_AUTHORITY_MISSING");

  const supported = record({
    movement: { state: "NOT_OBSERVED" },
    authorityByClaim: {
      nucleusStructure: null,
      movement: { authorityClass: "PHONOLOGICALLY_DOCUMENTED", provenance: { ...phonologicalProvenance, boundedClaim: "The scoped source documents no movement." } },
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });
  expect(validateMovingNucleusObservationAuthorityV0_1(supported).ok).toBe(true);
});

test("R1 validation does not freeze caller-owned input or nested values", () => {
  const value = record({
    aggregateStatus: "SUPPORTED",
    phoneticAnchors: {
      state: "SUPPORTED",
      anchors: [{ kind: "ipa_description", value: "first", order: 0, evidenceRef: "fixture:0" }],
    },
    authorityByClaim: {
      nucleusStructure: null,
      movement: null,
      phoneticAnchors: { authorityClass: "TRANSCRIPTION_ASSERTED", provenance: transcriptionProvenance },
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });

  const result = validateMovingNucleusObservationAuthorityV0_1(value);
  expect(result.ok).toBe(true);
  expect(Object.isFrozen(value)).toBe(false);
  expect(Object.isFrozen(value.phoneticAnchors)).toBe(false);
  expect(Object.isFrozen(value.phoneticAnchors.anchors)).toBe(false);
});

test("R2 successful validation freezes an independent returned value", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record());
  expect(result.ok).toBe(true);
  if (!result.ok) return;

  expect(Object.isFrozen(result.value)).toBe(true);
  expect(Object.isFrozen(result.value.nucleusStructure)).toBe(true);
  expect(Object.isFrozen(result.value.reasonCodes)).toBe(true);
});

test("R3 and R4 caller mutation cannot alter the frozen result or anchor order", () => {
  const value = record({
    aggregateStatus: "SUPPORTED",
    phoneticAnchors: {
      state: "SUPPORTED",
      anchors: [
        { kind: "ipa_description", value: "first", order: 0, evidenceRef: "fixture:0" },
        { kind: "ipa_description", value: "second", order: 1, evidenceRef: "fixture:1" },
      ],
    },
    authorityByClaim: {
      nucleusStructure: null,
      movement: null,
      phoneticAnchors: { authorityClass: "TRANSCRIPTION_ASSERTED", provenance: transcriptionProvenance },
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  });
  const result = validateMovingNucleusObservationAuthorityV0_1(value);
  expect(result.ok).toBe(true);
  if (!result.ok) return;

  const mutable = value as unknown as {
    reasonCodes: string[];
    phoneticAnchors: { anchors: { value: string }[] };
  };
  mutable.reasonCodes.push("CLAIM_SHAPE_INVALID");
  mutable.phoneticAnchors.anchors[0].value = "changed";

  expect(result.value.reasonCodes).toEqual([]);
  expect(result.value.phoneticAnchors.anchors?.map((anchor) => anchor.value)).toEqual([
    "first",
    "second",
  ]);
});

test("R5 malformed supplied authority fails for UNKNOWN movement", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record({
    authorityByClaim: {
      nucleusStructure: null,
      movement: { authorityClass: "ACOUSTICALLY_OBSERVED", provenance: { ...acousticProvenance, temporalObservations: [] } },
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  }));
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("MEASUREMENT_PROVENANCE_MISSING");
});

test("R6 UNKNOWN movement without authority remains valid", () => {
  expect(validateMovingNucleusObservationAuthorityV0_1(record()).ok).toBe(true);
});

test("R6 UNKNOWN movement with valid supplied authority remains valid", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record({
    authorityByClaim: {
      nucleusStructure: null,
      movement: { authorityClass: "PHONOLOGICALLY_DOCUMENTED", provenance: phonologicalProvenance },
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  }));
  expect(result.ok).toBe(true);
});

test("R7 malformed supplied authority fails for null phonetic anchors", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record({
    authorityByClaim: {
      nucleusStructure: null,
      movement: null,
      phoneticAnchors: { authorityClass: "ACOUSTICALLY_OBSERVED", provenance: { ...acousticProvenance, temporalObservations: [] } },
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  }));
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("MEASUREMENT_PROVENANCE_MISSING");
});

test("R8 null phonetic anchors without authority remain valid", () => {
  expect(validateMovingNucleusObservationAuthorityV0_1(record()).ok).toBe(true);
});

test("R9 supported null Voice-family anchors require mapping authority", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record({
    voiceFamilyAnchors: { state: "SUPPORTED", anchors: null },
  }));
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("VOICE_FAMILY_AUTHORITY_MISSING");
});

test("R9 valid Voice-family mapping authority permits supported null anchors", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record({
    voiceFamilyAnchors: { state: "SUPPORTED", anchors: null },
    authorityByClaim: {
      nucleusStructure: null,
      movement: null,
      phoneticAnchors: null,
      voiceFamilyAnchors: voiceFamilyMappingAuthority,
      canonicalization: null,
    },
  }));
  expect(result.ok).toBe(true);
});

test("R10 invalid correction/exclusion state fails as schema error", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record({
    movement: { state: "OBSERVED" },
    authorityByClaim: {
      nucleusStructure: null,
      movement: {
        authorityClass: "ACOUSTICALLY_OBSERVED",
        provenance: { ...acousticProvenance, correctionExclusionState: "INVALID" as never },
      },
      phoneticAnchors: null,
      voiceFamilyAnchors: null,
      canonicalization: null,
    },
  }));
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("CLAIM_SHAPE_INVALID");
});

test("R11 supported aggregate status rejects a conflicted claim", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record({
    aggregateStatus: "SUPPORTED",
    phoneticAnchors: { state: "CONFLICTED", anchors: null },
  }));
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("SOURCE_SCOPE_CONFLICT");
});

test("R11 also rejects supported aggregate status over conflicted Voice-family claims", () => {
  const result = validateMovingNucleusObservationAuthorityV0_1(record({
    aggregateStatus: "SUPPORTED",
    voiceFamilyAnchors: { state: "CONFLICTED", anchors: null },
  }));
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasonCodes).toContain("SOURCE_SCOPE_CONFLICT");
});
