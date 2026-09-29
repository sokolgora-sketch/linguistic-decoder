import {
  canonicalizeMovingNucleusV0_1,
  type MovingNucleusCanonicalizationV0_1,
} from "@/shared/openInstrument/movingNucleusCanonicalization.v0_1";
import {
  MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1,
  type MovingNucleusObservationAuthorityV0_1,
} from "@/shared/openInstrument/movingNucleusObservationAuthority.v0_1";
import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

const phonologicalProvenance = {
  authorityClass: "PHONOLOGICALLY_DOCUMENTED" as const,
  sourceId: "fixture.phonology.v0_1",
  evidenceRefs: ["fixture.phonology:entry"],
  language: "en",
  dialectOrDoculect: "fixture",
  claimScope: "fixture phonological analysis",
  limitations: ["fixture scope only"],
  boundedClaim: "The scoped source documents one moving nucleus.",
};

const voiceFamilyMappingAuthority = {
  authorityType: "REVIEWED_OPEN_INSTRUMENT_MAPPING" as const,
  mappingId: "fixture.mapping.v0_1",
  evidenceRefs: ["fixture.mapping:entry"],
  claimScope: "fixture mapping scope",
};

function authority(
  anchors: readonly VowelVoice[] | null,
): MovingNucleusObservationAuthorityV0_1 {
  return {
    schemaVersion: MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1,
    aggregateStatus: "SUPPORTED",
    nucleusStructure: {
      state: "ONE_NUCLEUS",
      rawIpaSegments: ["o", "ʊ"],
      explicitNotation: null,
    },
    movement: { state: "OBSERVED" },
    phoneticAnchors: { state: "UNKNOWN", anchors: null },
    voiceFamilyAnchors: { state: "SUPPORTED", anchors },
    canonicalizationStatus: "not_authorized",
    authorityByClaim: {
      nucleusStructure: {
        authorityClass: "PHONOLOGICALLY_DOCUMENTED",
        provenance: phonologicalProvenance,
      },
      movement: {
        authorityClass: "PHONOLOGICALLY_DOCUMENTED",
        provenance: phonologicalProvenance,
      },
      phoneticAnchors: null,
      voiceFamilyAnchors: voiceFamilyMappingAuthority,
      canonicalization: null,
    },
    competingAuthorities: [],
    reasonCodes: [],
  };
}

function expectDefined(
  result: MovingNucleusCanonicalizationV0_1,
  expected: readonly VowelVoice[],
): void {
  expect(result.status).toBe("defined");
  expect(result.reasonCode).toBeNull();
  expect(result.spokenNucleusCount).toBe(1);
  expect(result.canonicalEventCount).toBe(2);
  expect(result.orderedVoiceFamilyAnchors).toEqual(expected);
  expect(result.canonicalVoiceEvents).toEqual(expected);
  expect(result.observationAuthority).not.toBeNull();
}

test.each([
  ["O,U", ["O", "U"]],
  ["A,I", ["A", "I"]],
  ["E,I", ["E", "I"]],
  ["O,I", ["O", "I"]],
  ["A,U", ["A", "U"]],
] as const)("canonicalizes the frozen example %s without reinterpretation", (_label, anchors) => {
  const result = canonicalizeMovingNucleusV0_1(authority(anchors));

  expectDefined(result, anchors);
});

test("preserves an identical ordered pair without deduplication", () => {
  const result = canonicalizeMovingNucleusV0_1(authority(["Ë", "Ë"]));

  expectDefined(result, ["Ë", "Ë"]);
});

test("keeps one spoken nucleus structurally distinct from two canonical events", () => {
  const result = canonicalizeMovingNucleusV0_1(authority(["O", "U"]));

  expect(result.spokenNucleusCount).toBe(1);
  expect(result.canonicalEventCount).toBe(2);
  expect(result.observationAuthority?.nucleusStructure.state).toBe("ONE_NUCLEUS");
  expect(result.observationAuthority?.voiceFamilyAnchors.anchors).toEqual(["O", "U"]);
});

test("requires an observation authority", () => {
  const result = canonicalizeMovingNucleusV0_1(null);

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("CANONICALIZATION_ANCHORS_MISSING");
});

test("requires Voice-family anchors", () => {
  const result = canonicalizeMovingNucleusV0_1(authority(null));

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("CANONICALIZATION_ANCHORS_MISSING");
});

test("rejects unsupported authority", () => {
  const value = { ...authority(["O", "U"]), canonicalizationStatus: "unsupported" as const };
  const result = canonicalizeMovingNucleusV0_1(value);

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("CANONICALIZATION_ANCHORS_NOT_EVIDENCE_QUALIFIED");
});

test("rejects unresolved authority", () => {
  const value = { ...authority(["O", "U"]), aggregateStatus: "UNRESOLVED" as const };
  const result = canonicalizeMovingNucleusV0_1(value);

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("CANONICALIZATION_ANCHORS_UNRESOLVED");
});

test("rejects conflicted authority without selecting a winner", () => {
  const competingAuthorities = [
    { claim: "voiceFamilyAnchors" as const, authority: voiceFamilyMappingAuthority },
    {
      claim: "voiceFamilyAnchors" as const,
      authority: { ...voiceFamilyMappingAuthority, mappingId: "fixture.mapping.v0_2" },
    },
  ];
  const value = {
    ...authority(null),
    aggregateStatus: "CONFLICTED" as const,
    voiceFamilyAnchors: { state: "CONFLICTED" as const, anchors: null },
    competingAuthorities,
    reasonCodes: ["SOURCE_SCOPE_CONFLICT" as const],
  };
  const result = canonicalizeMovingNucleusV0_1(value);

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("CANONICALIZATION_ANCHORS_CONFLICTED");
  expect(result.canonicalVoiceEvents).toBeNull();
});

test("rejects malformed authority", () => {
  const result = canonicalizeMovingNucleusV0_1({ malformed: true });

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("CLAIM_SHAPE_INVALID");
});

test.each([
  ["zero", []],
  ["one", ["O"]],
  ["three", ["O", "U", "A"]],
] as const)("fails closed for %s anchors", (_label, anchors) => {
  const result = canonicalizeMovingNucleusV0_1(authority(anchors));

  expect(result.status).toBe("null");
  expect(result.canonicalVoiceEvents).toBeNull();
  expect(result.canonicalEventCount).toBe(0);
  expect(result.reasonCode).toBe(
    anchors.length === 0
      ? "CANONICALIZATION_ANCHORS_MISSING"
      : "CANONICALIZATION_REQUIRES_EXACTLY_TWO_ORDERED_ANCHORS",
  );
});

test("rejects a noncanonical Voice value", () => {
  const result = canonicalizeMovingNucleusV0_1(
    authority(["O", "Q"] as unknown as readonly VowelVoice[]),
  );

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("CLAIM_SHAPE_INVALID");
});

test("rejects an unordered anchor container", () => {
  const value = {
    ...authority(["O", "U"]),
    voiceFamilyAnchors: {
      state: "SUPPORTED" as const,
      anchors: new Set(["O", "U"]),
    },
  };
  const result = canonicalizeMovingNucleusV0_1(value);

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("CLAIM_SHAPE_INVALID");
});

test("does not mutate caller-owned authority and returns a frozen copy", () => {
  const value = authority(["O", "U"]);
  const before = JSON.stringify(value);
  const result = canonicalizeMovingNucleusV0_1(value);

  expect(JSON.stringify(value)).toBe(before);
  expect(Object.isFrozen(result)).toBe(true);
  expect(Object.isFrozen(result.canonicalVoiceEvents)).toBe(true);
  expect(result.observationAuthority).not.toBe(value);
});

test("repeated identical input produces identical output", () => {
  const value = authority(["O", "U"]);
  const first = canonicalizeMovingNucleusV0_1(value);
  const second = canonicalizeMovingNucleusV0_1(value);

  expect(second).toEqual(first);
});
