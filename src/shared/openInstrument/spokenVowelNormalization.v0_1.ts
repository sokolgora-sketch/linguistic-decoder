import {
  classifyIpaSegmentsV0_1,
  SYLLABIC_MARK_V0_1,
  type IpaSegmentV0_1,
} from "@/shared/ipa/ipaClassify.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";
import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

export const SPOKEN_VOWEL_NORMALIZATION_SCHEMA_V0_1 =
  "open-instrument.spoken-vowel-normalization.v0_1" as const;

export type SpokenVowelNormalizationReasonCodeV0_1 =
  | "IPA_MISSING"
  | "IPA_INVALID"
  | "UNSUPPORTED_IPA_SYMBOL"
  | "AMBIGUOUS_NUCLEUS_SEGMENTATION"
  | "UNSUPPORTED_DIPHTHONG"
  | "DIALECT_UNSPECIFIED_WHEN_REQUIRED"
  | "NORMALIZATION_UNSUPPORTED";

export type SpokenVowelNormalizationSegmentationV0_1 =
  | "monophthong"
  | "diphthong"
  | "sequence_of_two_vowel_nuclei"
  | "schwa"
  | "syllabic_carrier"
  | "unsupported_or_ambiguous";

export type SpokenVowelNormalizationInputV0_1 = Readonly<{
  mode: "spoken_ipa";
  ipa: string;
  language: string;
  dialectOrAccent: string | null;
  pronunciationSource: "explicit_ipa";
  provenance: Readonly<{
    sourceId: string | null;
    suppliedBy: "user" | "reviewed_record";
  }>;
}>;

export type SpokenVowelNormalizationNucleusV0_1 = Readonly<{
  kind:
    | "monophthong"
    | "diphthong"
    | "schwa"
    | "syllabic_carrier"
    | "unsupported_or_ambiguous";
  ipaSegments: readonly string[];
  voice: VowelVoice | null;
}>;

export type SpokenVowelNormalizationV0_1 = Readonly<{
  schemaVersion: typeof SPOKEN_VOWEL_NORMALIZATION_SCHEMA_V0_1;
  status: "defined" | "null" | "unsupported";
  reasonCode: SpokenVowelNormalizationReasonCodeV0_1 | null;
  segmentation: SpokenVowelNormalizationSegmentationV0_1;
  nuclei: readonly SpokenVowelNormalizationNucleusV0_1[];
  normalizedVoicePath: readonly VowelVoice[] | null;
  language: string;
  dialectOrAccent: string | null;
  provenance: SpokenVowelNormalizationInputV0_1["provenance"];
}>;

function baseVoice(
  segment: IpaSegmentV0_1,
  carrierTokens: readonly { raw: string; voice: VowelVoice | null }[],
): VowelVoice | null {
  return carrierTokens.find((token) => token.raw === segment.base)?.voice ?? null;
}

function baseIsSyllabicCarrier(segment: IpaSegmentV0_1): boolean {
  return (
    segment.cls === "sonorant" &&
    segment.marks.includes(SYLLABIC_MARK_V0_1)
  );
}

function hasOrphanCombiningMarkV0_1(ipa: string): boolean {
  let normalized = ipa.trim();
  if (
    (normalized.startsWith("/") && normalized.endsWith("/")) ||
    (normalized.startsWith("[") && normalized.endsWith("]")) ||
    (normalized.startsWith("(") && normalized.endsWith(")"))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  const removable = new Set([
    "ˈ",
    "ˌ",
    "ː",
    "ˑ",
    ".",
    "·",
    "‿",
    "|",
    "‖",
    " ",
    "\t",
    "\n",
    "\r",
  ]);
  let previousBase: string | null = null;

  for (const character of normalized.normalize("NFD")) {
    if (removable.has(character)) {
      previousBase = null;
      continue;
    }

    if (/\p{M}/u.test(character)) {
      if (
        !previousBase ||
        ["/", "[", "]", "(", ")"].includes(previousBase)
      ) {
        return true;
      }
      continue;
    }

    previousBase = character;
  }

  return false;
}

function result(
  input: SpokenVowelNormalizationInputV0_1,
  value: Omit<SpokenVowelNormalizationV0_1, "schemaVersion" | "language" | "dialectOrAccent" | "provenance">,
): SpokenVowelNormalizationV0_1 {
  return {
    schemaVersion: SPOKEN_VOWEL_NORMALIZATION_SCHEMA_V0_1,
    ...value,
    language: input.language,
    dialectOrAccent: input.dialectOrAccent,
    provenance: {
      sourceId: input.provenance.sourceId,
      suppliedBy: input.provenance.suppliedBy,
    },
  };
}

function unsupported(
  input: SpokenVowelNormalizationInputV0_1,
  reasonCode: SpokenVowelNormalizationReasonCodeV0_1,
  segmentation: SpokenVowelNormalizationSegmentationV0_1,
  nuclei: readonly SpokenVowelNormalizationNucleusV0_1[] = [],
): SpokenVowelNormalizationV0_1 {
  return result(input, {
    status: "unsupported",
    reasonCode,
    segmentation,
    nuclei,
    normalizedVoicePath: null,
  });
}

function nullResult(
  input: SpokenVowelNormalizationInputV0_1,
  reasonCode: SpokenVowelNormalizationReasonCodeV0_1,
  segmentation: SpokenVowelNormalizationSegmentationV0_1,
  nuclei: readonly SpokenVowelNormalizationNucleusV0_1[] = [],
): SpokenVowelNormalizationV0_1 {
  return result(input, {
    status: "null",
    reasonCode,
    segmentation,
    nuclei,
    normalizedVoicePath: null,
  });
}

export function normalizeSpokenVowelsV0_1(
  input: SpokenVowelNormalizationInputV0_1,
): SpokenVowelNormalizationV0_1 {
  if (input.mode !== "spoken_ipa") {
    return unsupported(
      input,
      "NORMALIZATION_UNSUPPORTED",
      "unsupported_or_ambiguous",
    );
  }

  const ipa = typeof input.ipa === "string" ? input.ipa.trim() : "";
  if (!ipa) {
    return nullResult(input, "IPA_MISSING", "unsupported_or_ambiguous");
  }

  if (hasOrphanCombiningMarkV0_1(ipa)) {
    return unsupported(input, "IPA_INVALID", "unsupported_or_ambiguous");
  }

  const segments = classifyIpaSegmentsV0_1(ipa);
  if (segments.length === 0) {
    return unsupported(input, "IPA_INVALID", "unsupported_or_ambiguous");
  }

  const carrier = extractCarrierVoicesFromIpaV0_1(ipa);
  if (carrier.diagnostics.unmapped.length > 0) {
    return unsupported(input, "UNSUPPORTED_IPA_SYMBOL", "unsupported_or_ambiguous");
  }

  const unknownSegment = segments.find(
    (segment) =>
      segment.cls === "other" &&
      !["/", "[", "]", "(", ")"].includes(segment.base),
  );
  if (unknownSegment) {
    return unsupported(
      input,
      "UNSUPPORTED_IPA_SYMBOL",
      "unsupported_or_ambiguous",
      [
        {
          kind: "unsupported_or_ambiguous",
          ipaSegments: [unknownSegment.raw],
          voice: null,
        },
      ],
    );
  }

  const vowelSegments = segments.filter((segment) => segment.cls === "vowel");
  const adjacentVowels = vowelSegments.find((segment, index) => {
    const next = vowelSegments[index + 1];
    if (!next) return false;

    const currentIndex = segments.indexOf(segment);
    return segments[currentIndex + 1] === next;
  });

  if (adjacentVowels) {
    const currentIndex = segments.indexOf(adjacentVowels);
    const next = segments[currentIndex + 1];

    const resultNucleus: SpokenVowelNormalizationNucleusV0_1 = {
      kind: "unsupported_or_ambiguous",
      ipaSegments: [adjacentVowels.raw, next?.raw ?? ""].filter(Boolean),
      voice: null,
    };

    return nullResult(input, "AMBIGUOUS_NUCLEUS_SEGMENTATION", "unsupported_or_ambiguous", [
      resultNucleus,
    ]);
  }

  const nuclei: SpokenVowelNormalizationNucleusV0_1[] = [];
  for (const segment of segments) {
    if (segment.cls === "vowel") {
      const voice = baseVoice(segment, carrier.tokens);
      if (!voice) {
        return unsupported(input, "UNSUPPORTED_IPA_SYMBOL", "unsupported_or_ambiguous");
      }

      nuclei.push({
        kind: segment.base === "ə" ? "schwa" : "monophthong",
        ipaSegments: [segment.raw],
        voice,
      });
      continue;
    }

    if (baseIsSyllabicCarrier(segment)) {
      nuclei.push({
        kind: "syllabic_carrier",
        ipaSegments: [segment.raw],
        voice: "Ë",
      });
    }
  }

  if (carrier.diagnostics.usedImplicit) {
    nuclei.push({
      kind: "syllabic_carrier",
      ipaSegments: ["∅"],
      voice: "Ë",
    });
  }

  if (nuclei.length === 0 || carrier.voices.length !== nuclei.length) {
    return unsupported(input, "NORMALIZATION_UNSUPPORTED", "unsupported_or_ambiguous", nuclei);
  }

  const segmentation: SpokenVowelNormalizationSegmentationV0_1 =
    nuclei.length === 1
      ? nuclei[0].kind === "schwa"
        ? "schwa"
        : nuclei[0].kind === "syllabic_carrier"
          ? "syllabic_carrier"
          : "monophthong"
      : nuclei.length === 2
        ? "sequence_of_two_vowel_nuclei"
        : "unsupported_or_ambiguous";

  if (segmentation === "unsupported_or_ambiguous") {
    return unsupported(input, "NORMALIZATION_UNSUPPORTED", segmentation, nuclei);
  }

  return result(input, {
    status: "defined",
    reasonCode: null,
    segmentation,
    nuclei,
    normalizedVoicePath: carrier.voices,
  });
}
