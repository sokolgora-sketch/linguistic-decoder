import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";
import {
  canonicalizeMovingNucleusV0_1,
  type MovingNucleusCanonicalizationV0_1,
} from "./movingNucleusCanonicalization.v0_1";
import {
  MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1,
  validateMovingNucleusObservationAuthorityV0_1,
  type MovingNucleusObservationAuthorityV0_1,
} from "./movingNucleusObservationAuthority.v0_1";
import {
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
  lookupCmuDictPronunciationsV0_1,
  type CmuDictPronunciationVariantV0_1,
} from "./cmudictArpabetPronunciation.v0_1";

export const PRONUNCIATION_TO_VOICE_PROFILE_V0_1 =
  "open-instrument.cmudict-arpabet-en-us.v0_1" as const;

export const CMUDICT_ARPABET_VOWEL_CATEGORIES_V0_1 = Object.freeze([
  "AA",
  "AE",
  "AH",
  "AO",
  "AW",
  "AY",
  "EH",
  "ER",
  "EY",
  "IH",
  "IY",
  "OW",
  "OY",
  "UH",
  "UW",
] as const);

export const CMUDICT_ARPABET_VOICE_PROFILE_V0_1 = Object.freeze({
  AA: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["A"] },
  AE: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["A"] },
  AH: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["Ë"] },
  AO: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["O"] },
  AW: { classification: "SUPPORTED_MOVING_NUCLEUS", anchors: ["A", "U"] },
  AY: { classification: "SUPPORTED_MOVING_NUCLEUS", anchors: ["A", "I"] },
  EH: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["E"] },
  ER: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["Ë"] },
  EY: { classification: "SUPPORTED_MOVING_NUCLEUS", anchors: ["E", "I"] },
  IH: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["I"] },
  IY: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["I"] },
  OW: { classification: "SUPPORTED_MOVING_NUCLEUS", anchors: ["O", "U"] },
  OY: { classification: "SUPPORTED_MOVING_NUCLEUS", anchors: ["O", "I"] },
  UH: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["U"] },
  UW: { classification: "SUPPORTED_MONOPHTHONG", anchors: ["U"] },
} as const satisfies Record<
  (typeof CMUDICT_ARPABET_VOWEL_CATEGORIES_V0_1)[number],
  Readonly<{
    classification: "SUPPORTED_MONOPHTHONG" | "SUPPORTED_MOVING_NUCLEUS";
    anchors: readonly VowelVoice[];
  }>
>);

export type PronunciationToVoiceReasonCodeV0_1 =
  | "PRONUNCIATION_NOT_FOUND"
  | "PRONUNCIATION_SOURCE_UNSUPPORTED"
  | "PRONUNCIATION_VARIANT_AMBIGUOUS"
  | "PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED"
  | "SPOKEN_NUCLEUS_STRUCTURE_UNRESOLVED"
  | "VOICE_FAMILY_AUTHORITY_MISSING"
  | "MOVING_NUCLEUS_AUTHORITY_MISSING";

export type NormalizedArpabetSegmentV0_1 = Readonly<{
  segmentIndex: number;
  kind: "consonant" | "monophthong_nucleus" | "moving_nucleus" | "stress" | "unsupported_vowel";
  sourceUnits: readonly string[];
  stress: "0" | "1" | "2" | null;
  nucleusIndex: number | null;
  sourceProfileId: typeof PRONUNCIATION_TO_VOICE_PROFILE_V0_1;
  baseCategory: string | null;
  voiceAnchors: readonly VowelVoice[] | null;
}>;

export type ArpabetNucleusV0_1 = Readonly<{
  nucleusIndex: number;
  sourceToken: string;
  baseCategory: string;
  stress: "0" | "1" | "2" | null;
  kind: "monophthong_nucleus" | "moving_nucleus";
  voiceAnchors: readonly VowelVoice[];
  observationAuthority: MovingNucleusObservationAuthorityV0_1 | null;
  canonicalization: MovingNucleusCanonicalizationV0_1 | null;
}>;

export type PronunciationVoiceVariantResultV0_1 = Readonly<{
  variant: CmuDictPronunciationVariantV0_1;
  normalizedSegments: readonly NormalizedArpabetSegmentV0_1[];
  nuclei: readonly ArpabetNucleusV0_1[];
  canonicalVoicePath: readonly VowelVoice[] | null;
  reasonCode: PronunciationToVoiceReasonCodeV0_1 | null;
}>;

export type PronunciationToVoiceResultV0_1 = Readonly<{
  schemaVersion: "open-instrument.pronunciation-to-voice.v0_1";
  status: "defined" | "null";
  reasonCode: PronunciationToVoiceReasonCodeV0_1 | null;
  normalizedWord: string;
  sourceProfileId: typeof PRONUNCIATION_TO_VOICE_PROFILE_V0_1;
  sourceNotation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
  sourceRevision: typeof CMUDICT_SOURCE_REVISION_V0_1;
  variants: readonly PronunciationVoiceVariantResultV0_1[];
  canonicalSpokenVoicePath: readonly VowelVoice[] | null;
}>;

const SOURCE_VOWELS = new Set<string>(CMUDICT_ARPABET_VOWEL_CATEGORIES_V0_1);
// These are recognized ARPAbet-style vowel categories outside the frozen
// CMUdict inventory. They are intentionally unsupported, never mapped.
const UNSUPPORTED_ARPABET_VOWELS = new Set(["AX", "AXR", "IX", "UX"]);

function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      if (child && typeof child === "object" && !Object.isFrozen(child)) freeze(child);
    }
  }
  return value;
}

function parseArpabetTokenV0_1(token: string): {
  base: string;
  stress: "0" | "1" | "2" | null;
} {
  const match = /^([A-Z]+)([012])?$/u.exec(token);
  return {
    base: match?.[1] ?? token,
    stress: (match?.[2] as "0" | "1" | "2" | undefined) ?? null,
  };
}

function provenance(sourceId: string, evidenceRef: string, boundedClaim: string) {
  return {
    authorityClass: "PHONOLOGICALLY_DOCUMENTED" as const,
    sourceId,
    evidenceRefs: [evidenceRef],
    language: "English",
    dialectOrDoculect: "CMUdict documented English pronunciation inventory",
    claimScope: "CMUdict ARPAbet source-profile category",
    limitations: ["symbolic source profile; not acoustic observation"],
    boundedClaim,
  };
}

function mappingAuthority(category: string) {
  return {
    authorityType: "REVIEWED_OPEN_INSTRUMENT_MAPPING" as const,
    mappingId: `pronunciation-to-voice.${PRONUNCIATION_TO_VOICE_PROFILE_V0_1}.v0_1`,
    evidenceRefs: [`contract:pronunciation-to-voice:${category}`],
    claimScope: `CMUdict ARPAbet ${category} category Voice-family mapping`,
  };
}

function buildMovingObservationV0_1(
  variant: CmuDictPronunciationVariantV0_1,
  token: string,
  category: string,
  anchors: readonly VowelVoice[],
  nucleusIndex: number,
): MovingNucleusObservationAuthorityV0_1 | null {
  const evidenceRef = `cmudict:${variant.sourceForm}:${variant.variantId}:${nucleusIndex}`;
  const phonological = provenance(
    variant.sourceProfileId,
    evidenceRef,
    `CMUdict ARPAbet atomic ${category} category is one moving spoken nucleus`,
  );
  const authority = {
    schemaVersion: MOVING_NUCLEUS_OBSERVATION_AUTHORITY_SCHEMA_V0_1,
    aggregateStatus: "SUPPORTED" as const,
    nucleusStructure: {
      state: "ONE_NUCLEUS" as const,
      rawIpaSegments: [],
      explicitNotation: null,
    },
    movement: { state: "OBSERVED" as const },
    phoneticAnchors: {
      state: "SUPPORTED" as const,
      anchors: [
        {
          kind: "source_description" as const,
          value: `${CMUDICT_SOURCE_NOTATION_V0_1} ${token} (${category})`,
          order: 0,
          evidenceRef,
        },
      ],
    },
    voiceFamilyAnchors: { state: "SUPPORTED" as const, anchors: [...anchors] },
    canonicalizationStatus: "not_authorized" as const,
    authorityByClaim: {
      nucleusStructure: {
        authorityClass: "PHONOLOGICALLY_DOCUMENTED",
        provenance: phonological,
      },
      movement: {
        authorityClass: "PHONOLOGICALLY_DOCUMENTED",
        provenance: phonological,
      },
      phoneticAnchors: {
        authorityClass: "PHONOLOGICALLY_DOCUMENTED",
        provenance: phonological,
      },
      voiceFamilyAnchors: mappingAuthority(category),
      canonicalization: null,
    },
    competingAuthorities: [],
    reasonCodes: [],
  } satisfies MovingNucleusObservationAuthorityV0_1;

  return validateMovingNucleusObservationAuthorityV0_1(authority).ok
    ? authority
    : null;
}

function normalizeVariantV0_1(
  variant: CmuDictPronunciationVariantV0_1,
): PronunciationVoiceVariantResultV0_1 {
  const segments: NormalizedArpabetSegmentV0_1[] = [];
  const nuclei: ArpabetNucleusV0_1[] = [];
  let nucleusIndex = 0;
  let failure: PronunciationToVoiceReasonCodeV0_1 | null = null;

  for (const [segmentIndex, token] of variant.sourceUnits.entries()) {
    const parsed = parseArpabetTokenV0_1(token);
    const profile = CMUDICT_ARPABET_VOICE_PROFILE_V0_1[
      parsed.base as keyof typeof CMUDICT_ARPABET_VOICE_PROFILE_V0_1
    ];

    if (!profile) {
      if (SOURCE_VOWELS.has(parsed.base) || UNSUPPORTED_ARPABET_VOWELS.has(parsed.base)) {
        failure ??= "PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED";
      }
      segments.push({
        segmentIndex,
        kind:
          SOURCE_VOWELS.has(parsed.base) || UNSUPPORTED_ARPABET_VOWELS.has(parsed.base)
            ? "unsupported_vowel"
            : "consonant",
        sourceUnits: [token],
        stress: parsed.stress,
        nucleusIndex: null,
        sourceProfileId: PRONUNCIATION_TO_VOICE_PROFILE_V0_1,
        baseCategory:
          SOURCE_VOWELS.has(parsed.base) || UNSUPPORTED_ARPABET_VOWELS.has(parsed.base)
            ? parsed.base
            : null,
        voiceAnchors: null,
      });
      continue;
    }

    const kind = profile.classification === "SUPPORTED_MOVING_NUCLEUS"
      ? "moving_nucleus"
      : "monophthong_nucleus";
    const observationAuthority = kind === "moving_nucleus"
      ? buildMovingObservationV0_1(
          variant,
          token,
          parsed.base,
          profile.anchors,
          nucleusIndex,
        )
      : null;
    const canonicalization = kind === "moving_nucleus" && observationAuthority
      ? canonicalizeMovingNucleusV0_1(observationAuthority)
      : null;
    const anchors = canonicalization?.canonicalVoiceEvents ?? profile.anchors;

    if (kind === "moving_nucleus" && (!observationAuthority || !canonicalization || canonicalization.status !== "defined")) {
      failure ??= "MOVING_NUCLEUS_AUTHORITY_MISSING";
    }

    segments.push({
      segmentIndex,
      kind,
      sourceUnits: [token],
      stress: parsed.stress,
      nucleusIndex,
      sourceProfileId: PRONUNCIATION_TO_VOICE_PROFILE_V0_1,
      baseCategory: parsed.base,
      voiceAnchors: anchors,
    });
    nuclei.push({
      nucleusIndex,
      sourceToken: token,
      baseCategory: parsed.base,
      stress: parsed.stress,
      kind,
      voiceAnchors: anchors,
      observationAuthority,
      canonicalization,
    });
    nucleusIndex += 1;
  }

  if (failure) {
    return freeze({
      variant,
      normalizedSegments: segments,
      nuclei,
      canonicalVoicePath: null,
      reasonCode: failure,
    });
  }

  const canonicalVoicePath = nuclei.flatMap((nucleus) => nucleus.voiceAnchors);
  if (canonicalVoicePath.length === 0) failure = "VOICE_FAMILY_AUTHORITY_MISSING";

  return freeze({
    variant,
    normalizedSegments: segments,
    nuclei,
    canonicalVoicePath: failure ? null : canonicalVoicePath,
    reasonCode: failure,
  });
}

export function resolveArpabetPronunciationVariantsToVoiceV0_1(
  normalizedWord: string,
  variants: readonly CmuDictPronunciationVariantV0_1[],
): PronunciationToVoiceResultV0_1 {
  if (variants.length === 0) {
    return freeze({
      schemaVersion: "open-instrument.pronunciation-to-voice.v0_1",
      status: "null",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
      normalizedWord,
      sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
      sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
      sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
      variants: [],
      canonicalSpokenVoicePath: null,
    });
  }

  const normalizedVariants = variants.map(normalizeVariantV0_1);
  const failed = normalizedVariants.find((variant) => variant.reasonCode !== null);
  if (failed) {
    const reasonCode = normalizedVariants.every(
      (variant) => variant.reasonCode === "PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED",
    )
      ? "PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED"
      : normalizedVariants.length > 1
        ? "PRONUNCIATION_VARIANT_AMBIGUOUS"
        : failed.reasonCode!;
    return freeze({
      schemaVersion: "open-instrument.pronunciation-to-voice.v0_1",
      status: "null",
      reasonCode,
      normalizedWord,
      sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
      sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
      sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
      variants: normalizedVariants,
      canonicalSpokenVoicePath: null,
    });
  }

  const firstPath = normalizedVariants[0].canonicalVoicePath!;
  const samePath = normalizedVariants.every(
    (variant) => JSON.stringify(variant.canonicalVoicePath) === JSON.stringify(firstPath),
  );
  return freeze({
    schemaVersion: "open-instrument.pronunciation-to-voice.v0_1",
    status: samePath ? "defined" : "null",
    reasonCode: samePath ? null : "PRONUNCIATION_VARIANT_AMBIGUOUS",
    normalizedWord,
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    variants: normalizedVariants,
    canonicalSpokenVoicePath: samePath ? [...firstPath] : null,
  });
}

export function resolveCmuDictPronunciationToVoiceV0_1(
  word: string,
): PronunciationToVoiceResultV0_1 {
  const normalizedWord = String(word ?? "").normalize("NFC").trim().toLowerCase();
  return resolveArpabetPronunciationVariantsToVoiceV0_1(
    normalizedWord,
    lookupCmuDictPronunciationsV0_1(normalizedWord),
  );
}
