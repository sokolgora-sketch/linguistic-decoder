import {
  validateMovingNucleusObservationAuthorityV0_1,
  type MovingNucleusObservationAuthorityReasonCodeV0_1,
  type MovingNucleusObservationAuthorityV0_1,
} from "./movingNucleusObservationAuthority.v0_1";
import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

export const MOVING_NUCLEUS_CANONICALIZATION_SCHEMA_V0_1 =
  "open-instrument.moving-nucleus-canonicalization.v0_1" as const;

export type MovingNucleusCanonicalizationReasonCodeV0_1 =
  | "CANONICALIZATION_ANCHORS_MISSING"
  | "CANONICALIZATION_ANCHORS_UNRESOLVED"
  | "CANONICALIZATION_ANCHORS_CONFLICTED"
  | "CANONICALIZATION_ANCHORS_NOT_EVIDENCE_QUALIFIED"
  | "CANONICALIZATION_REQUIRES_EXACTLY_TWO_ORDERED_ANCHORS"
  | "CLAIM_SHAPE_INVALID";

export type MovingNucleusCanonicalizationV0_1 = Readonly<{
  schemaVersion: typeof MOVING_NUCLEUS_CANONICALIZATION_SCHEMA_V0_1;
  status: "defined" | "null";
  reasonCode: MovingNucleusCanonicalizationReasonCodeV0_1 | null;
  spokenNucleusCount: 1 | null;
  canonicalEventCount: 0 | 2;
  orderedVoiceFamilyAnchors: readonly VowelVoice[] | null;
  canonicalVoiceEvents: readonly VowelVoice[] | null;
  observationAuthority: MovingNucleusObservationAuthorityV0_1 | null;
  upstreamReasonCodes: readonly MovingNucleusObservationAuthorityReasonCodeV0_1[];
}>;

function freezeResultV0_1(
  result: Omit<MovingNucleusCanonicalizationV0_1, "schemaVersion">,
): MovingNucleusCanonicalizationV0_1 {
  const orderedVoiceFamilyAnchors = result.orderedVoiceFamilyAnchors
    ? Object.freeze([...result.orderedVoiceFamilyAnchors])
    : null;
  const canonicalVoiceEvents = result.canonicalVoiceEvents
    ? Object.freeze([...result.canonicalVoiceEvents])
    : null;
  const upstreamReasonCodes = Object.freeze([...result.upstreamReasonCodes]);

  return Object.freeze({
    schemaVersion: MOVING_NUCLEUS_CANONICALIZATION_SCHEMA_V0_1,
    ...result,
    orderedVoiceFamilyAnchors,
    canonicalVoiceEvents,
    upstreamReasonCodes,
  });
}

function nullResultV0_1(
  reasonCode: MovingNucleusCanonicalizationReasonCodeV0_1,
  options: Readonly<{
    spokenNucleusCount?: 1 | null;
    observationAuthority?: MovingNucleusObservationAuthorityV0_1 | null;
    upstreamReasonCodes?: readonly MovingNucleusObservationAuthorityReasonCodeV0_1[];
  }> = {},
): MovingNucleusCanonicalizationV0_1 {
  return freezeResultV0_1({
    status: "null",
    reasonCode,
    spokenNucleusCount: options.spokenNucleusCount ?? null,
    canonicalEventCount: 0,
    orderedVoiceFamilyAnchors: null,
    canonicalVoiceEvents: null,
    observationAuthority: options.observationAuthority ?? null,
    upstreamReasonCodes: options.upstreamReasonCodes ?? [],
  });
}

function reasonForValidationFailureV0_1(
  reasonCodes: readonly MovingNucleusObservationAuthorityReasonCodeV0_1[],
): MovingNucleusCanonicalizationReasonCodeV0_1 {
  if (
    reasonCodes.includes("CLAIM_SHAPE_INVALID") ||
    reasonCodes.includes("INPUT_NOT_OBJECT") ||
    reasonCodes.includes("SCHEMA_VERSION_INVALID")
  ) {
    return "CLAIM_SHAPE_INVALID";
  }

  if (reasonCodes.includes("SOURCE_SCOPE_CONFLICT")) {
    return "CANONICALIZATION_ANCHORS_CONFLICTED";
  }

  if (
    reasonCodes.includes("VOICE_FAMILY_AUTHORITY_MISSING") ||
    reasonCodes.includes("PHONETIC_ANCHOR_UNMAPPED") ||
    reasonCodes.includes("MEASUREMENT_QC_FAILED") ||
    reasonCodes.includes("CANONICALIZATION_NOT_AUTHORIZED")
  ) {
    return "CANONICALIZATION_ANCHORS_NOT_EVIDENCE_QUALIFIED";
  }

  if (
    reasonCodes.includes("NUCLEUS_STRUCTURE_UNRESOLVED") ||
    reasonCodes.includes("MOVEMENT_AUTHORITY_MISSING")
  ) {
    return "CANONICALIZATION_ANCHORS_UNRESOLVED";
  }

  return "CANONICALIZATION_ANCHORS_NOT_EVIDENCE_QUALIFIED";
}

function knownNucleusCountV0_1(
  value: MovingNucleusObservationAuthorityV0_1,
): 1 | null {
  return value.nucleusStructure.state === "ONE_NUCLEUS" ? 1 : null;
}

function reasonForClaimStateV0_1(
  state: MovingNucleusObservationAuthorityV0_1["voiceFamilyAnchors"]["state"],
): MovingNucleusCanonicalizationReasonCodeV0_1 {
  switch (state) {
    case "CONFLICTED":
      return "CANONICALIZATION_ANCHORS_CONFLICTED";
    case "UNRESOLVED":
    case "UNKNOWN":
      return "CANONICALIZATION_ANCHORS_UNRESOLVED";
    case "UNSUPPORTED":
      return "CANONICALIZATION_ANCHORS_NOT_EVIDENCE_QUALIFIED";
    case "SUPPORTED":
      return "CANONICALIZATION_ANCHORS_MISSING";
  }
}

export function canonicalizeMovingNucleusV0_1(
  observationAuthority: unknown,
): MovingNucleusCanonicalizationV0_1 {
  if (observationAuthority === null || observationAuthority === undefined) {
    return nullResultV0_1("CANONICALIZATION_ANCHORS_MISSING");
  }

  const validation = validateMovingNucleusObservationAuthorityV0_1(
    observationAuthority,
  );
  if (!validation.ok) {
    return nullResultV0_1(reasonForValidationFailureV0_1(validation.reasonCodes), {
      upstreamReasonCodes: validation.reasonCodes,
    });
  }

  const value = validation.value;
  const spokenNucleusCount = knownNucleusCountV0_1(value);

  if (value.aggregateStatus === "CONFLICTED") {
    return nullResultV0_1("CANONICALIZATION_ANCHORS_CONFLICTED", {
      spokenNucleusCount,
      observationAuthority: value,
      upstreamReasonCodes: value.reasonCodes,
    });
  }

  if (value.aggregateStatus !== "SUPPORTED") {
    return nullResultV0_1(
      value.aggregateStatus === "UNSUPPORTED"
        ? "CANONICALIZATION_ANCHORS_NOT_EVIDENCE_QUALIFIED"
        : "CANONICALIZATION_ANCHORS_UNRESOLVED",
      {
        spokenNucleusCount,
        observationAuthority: value,
        upstreamReasonCodes: value.reasonCodes,
      },
    );
  }

  if (value.canonicalizationStatus === "unresolved") {
    return nullResultV0_1("CANONICALIZATION_ANCHORS_UNRESOLVED", {
      spokenNucleusCount,
      observationAuthority: value,
      upstreamReasonCodes: value.reasonCodes,
    });
  }

  if (value.canonicalizationStatus === "unsupported") {
    return nullResultV0_1("CANONICALIZATION_ANCHORS_NOT_EVIDENCE_QUALIFIED", {
      spokenNucleusCount,
      observationAuthority: value,
      upstreamReasonCodes: value.reasonCodes,
    });
  }

  if (value.nucleusStructure.state !== "ONE_NUCLEUS") {
    return nullResultV0_1("CANONICALIZATION_ANCHORS_UNRESOLVED", {
      spokenNucleusCount,
      observationAuthority: value,
      upstreamReasonCodes: value.reasonCodes,
    });
  }

  if (value.movement.state !== "OBSERVED") {
    return nullResultV0_1("CANONICALIZATION_ANCHORS_UNRESOLVED", {
      spokenNucleusCount,
      observationAuthority: value,
      upstreamReasonCodes: value.reasonCodes,
    });
  }

  const anchorClaim = value.voiceFamilyAnchors;
  if (anchorClaim.state !== "SUPPORTED") {
    return nullResultV0_1(reasonForClaimStateV0_1(anchorClaim.state), {
      spokenNucleusCount,
      observationAuthority: value,
      upstreamReasonCodes: value.reasonCodes,
    });
  }

  const anchors = anchorClaim.anchors;
  if (!anchors || anchors.length === 0) {
    return nullResultV0_1("CANONICALIZATION_ANCHORS_MISSING", {
      spokenNucleusCount,
      observationAuthority: value,
      upstreamReasonCodes: value.reasonCodes,
    });
  }

  if (anchors.length !== 2) {
    return nullResultV0_1(
      "CANONICALIZATION_REQUIRES_EXACTLY_TWO_ORDERED_ANCHORS",
      {
        spokenNucleusCount,
        observationAuthority: value,
        upstreamReasonCodes: value.reasonCodes,
      },
    );
  }

  const canonicalEvents: readonly [VowelVoice, VowelVoice] = [
    anchors[0],
    anchors[1],
  ];

  return freezeResultV0_1({
    status: "defined",
    reasonCode: null,
    spokenNucleusCount: 1,
    canonicalEventCount: 2,
    orderedVoiceFamilyAnchors: canonicalEvents,
    canonicalVoiceEvents: canonicalEvents,
    observationAuthority: value,
    upstreamReasonCodes: value.reasonCodes,
  });
}
