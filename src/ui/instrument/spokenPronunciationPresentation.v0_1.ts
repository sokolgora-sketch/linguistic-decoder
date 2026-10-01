import type {
  SpokenPronunciationProvenanceV0_1VM,
  Vowel,
} from "@/ui/telemetry/types";

export function pronunciationVariantStatusV0_1(
  value: SpokenPronunciationProvenanceV0_1VM,
): string {
  if (value.status === "defined") {
    return value.variants.length === 1
      ? "single variant accepted"
      : `${value.variants.length} variants agree on the canonical path`;
  }

  if (value.reasonCode === "PRONUNCIATION_VARIANT_AMBIGUOUS") {
    return `${value.variants.length} variants unresolved; no winner selected`;
  }

  if (!value.variants.length) return "no pronunciation variant";
  return `${value.variants.length} variants; spoken path is Null`;
}

export function spokenPronunciationPathTextV0_1(path: Vowel[] | null): string {
  return path?.length ? path.join(" → ") : "Null";
}

export function spokenPronunciationSourceTextV0_1(
  value: SpokenPronunciationProvenanceV0_1VM,
): string {
  return value.variants.length
    ? value.variants
        .map((variant) => `${variant.sourceForm}: ${variant.sourcePronunciation}`)
        .join(" | ")
    : "Null";
}
