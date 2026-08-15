import type {
  VowelVoice,
} from "@/shared/vowels/vowelVoices.v0.1";

import {
  extractOrthographyVoicesFromWordV0_1,
} from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

import {
  extractCarrierVoicesFromIpaV0_1,
} from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

export const FUNCTIONAL_VOICE_NORMALIZATION_SCHEMA_V0_1 =
  "open-instrument.functional-voice-normalization.v0_1" as const;

export type FunctionalVoiceNormalizationTransformV0_1 = {
  surfaceIndex: number;
  from: VowelVoice | null;
  to: VowelVoice;
  rule:
    | "y_to_i"
    | "reduced_final_e_to_ë"
    | "carrier_ë_inserted";
};

export type FunctionalVoiceNormalizationDifferenceV0_1 = {
  surfaceIndex: number;
  from: VowelVoice;
  carrier: VowelVoice;
  reason: "not_authorized_v0_1";
};

export type FunctionalVoiceNormalizationV0_1 = {
  schemaVersion:
    typeof FUNCTIONAL_VOICE_NORMALIZATION_SCHEMA_V0_1;

  word: string;
  language: string;
  ipa: string;

  status:
    | "confirmed"
    | "normalized"
    | "partially_normalized"
    | "unsupported_difference"
    | "unsupported_language"
    | "alignment_unavailable";

  usable: boolean;

  surfacePath: VowelVoice[];
  carrierPath: VowelVoice[];
  functionalPath: VowelVoice[] | null;

  transforms:
    FunctionalVoiceNormalizationTransformV0_1[];

  unresolvedCarrierDifferences:
    FunctionalVoiceNormalizationDifferenceV0_1[];

  boundary:
    "bounded functional normalization only; carrier evidence does not automatically overwrite orthographic functional truth";
};

type VoicedOrthographyToken = {
  tokenIndex: number;
  voice: VowelVoice;
};

function normalizedLanguage(
  value: unknown,
): string {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase();
}

function isEnglish(
  value: unknown,
): boolean {
  const language =
    normalizedLanguage(value);

  return (
    language === "english" ||
    language === "en" ||
    language === "en-us" ||
    language === "en-gb"
  );
}

function voicedOrthographyTokens(
  tokens: Array<{
    voice: VowelVoice | null;
  }>,
): VoicedOrthographyToken[] {
  return tokens.flatMap(
    (token, tokenIndex) =>
      token.voice
        ? [
            {
              tokenIndex,
              voice: token.voice,
            },
          ]
        : [],
  );
}

function isReducedFinalEnglishE(
  word: string,
  tokenIndex: number,
): boolean {
  const chars =
    Array.from(
      word
        .normalize("NFC")
        .toLowerCase(),
    );

  if (
    chars[tokenIndex] !== "e"
  ) {
    return false;
  }

  const tail =
    chars
      .slice(tokenIndex + 1)
      .join("");

  return /^[^aeiouyë]*[mnlr]$/u.test(
    tail,
  );
}

function allowsFinalCarrierËInsertion(
  word: string,
  surfacePath: readonly VowelVoice[],
  carrierPath: readonly VowelVoice[],
): boolean {
  if (
    carrierPath.length !==
      surfacePath.length + 1
  ) {
    return false;
  }

  if (
    carrierPath[
      carrierPath.length - 1
    ] !== "Ë"
  ) {
    return false;
  }

  // Carrier Law already establishes rhythm-style
  // final sonorant carrier reconstruction.
  //
  // This is deliberately narrow:
  // one additional final Ë only.
  const normalized =
    word
      .normalize("NFC")
      .trim()
      .toLowerCase();

  return /[mnlr]$/u.test(
    normalized,
  );
}

export function buildFunctionalVoiceNormalizationV0_1(
  input: {
    word: string;
    language: string;
    ipa: string;
  },
): FunctionalVoiceNormalizationV0_1 {
  const word =
    String(input.word ?? "")
      .normalize("NFC")
      .trim();

  const language =
    String(input.language ?? "")
      .trim();

  const ipa =
    String(input.ipa ?? "")
      .trim();

  const orthography =
    extractOrthographyVoicesFromWordV0_1({
      word,
      langHint:
        isEnglish(language)
          ? "en"
          : undefined,
    });

  const carrier =
    extractCarrierVoicesFromIpaV0_1(
      ipa,
    );

  const surfacePath =
    [...orthography.voices];

  const carrierPath =
    [...carrier.voices];

  const boundary =
    "bounded functional normalization only; carrier evidence does not automatically overwrite orthographic functional truth" as const;

  if (!isEnglish(language)) {
    return {
      schemaVersion:
        FUNCTIONAL_VOICE_NORMALIZATION_SCHEMA_V0_1,
      word,
      language,
      ipa,
      status:
        "unsupported_language",
      usable: false,
      surfacePath,
      carrierPath,
      functionalPath: null,
      transforms: [],
      unresolvedCarrierDifferences: [],
      boundary,
    };
  }

  if (
    surfacePath.length === 0 ||
    carrierPath.length === 0
  ) {
    return {
      schemaVersion:
        FUNCTIONAL_VOICE_NORMALIZATION_SCHEMA_V0_1,
      word,
      language,
      ipa,
      status:
        "alignment_unavailable",
      usable: false,
      surfacePath,
      carrierPath,
      functionalPath: null,
      transforms: [],
      unresolvedCarrierDifferences: [],
      boundary,
    };
  }

  const voicedTokens =
    voicedOrthographyTokens(
      orthography.tokens,
    );

  if (
    voicedTokens.length !==
      surfacePath.length
  ) {
    return {
      schemaVersion:
        FUNCTIONAL_VOICE_NORMALIZATION_SCHEMA_V0_1,
      word,
      language,
      ipa,
      status:
        "alignment_unavailable",
      usable: false,
      surfacePath,
      carrierPath,
      functionalPath: null,
      transforms: [],
      unresolvedCarrierDifferences: [],
      boundary,
    };
  }

  const finalCarrierËInsertion =
    allowsFinalCarrierËInsertion(
      word,
      surfacePath,
      carrierPath,
    );

  if (
    surfacePath.length !==
      carrierPath.length &&
    !finalCarrierËInsertion
  ) {
    return {
      schemaVersion:
        FUNCTIONAL_VOICE_NORMALIZATION_SCHEMA_V0_1,
      word,
      language,
      ipa,
      status:
        "alignment_unavailable",
      usable: false,
      surfacePath,
      carrierPath,
      functionalPath: null,
      transforms: [],
      unresolvedCarrierDifferences: [],
      boundary,
    };
  }

  const pairedCarrierPath =
    finalCarrierËInsertion
      ? carrierPath.slice(
          0,
          carrierPath.length - 1,
        )
      : carrierPath;

  const functionalPath =
    [...surfacePath];

  const transforms:
    FunctionalVoiceNormalizationTransformV0_1[] =
      [];

  const unresolvedCarrierDifferences:
    FunctionalVoiceNormalizationDifferenceV0_1[] =
      [];

  for (
    let index = 0;
    index < surfacePath.length;
    index += 1
  ) {
    const surface =
      surfacePath[index];

    const carrierVoice =
      pairedCarrierPath[index];

    if (
      !carrierVoice ||
      surface === carrierVoice
    ) {
      continue;
    }

    if (
      surface === "Y" &&
      carrierVoice === "I"
    ) {
      functionalPath[index] =
        "I";

      transforms.push({
        surfaceIndex: index,
        from: "Y",
        to: "I",
        rule: "y_to_i",
      });

      continue;
    }

    const token =
      voicedTokens[index];

    if (
      surface === "E" &&
      carrierVoice === "Ë" &&
      token &&
      isReducedFinalEnglishE(
        word,
        token.tokenIndex,
      )
    ) {
      functionalPath[index] =
        "Ë";

      transforms.push({
        surfaceIndex: index,
        from: "E",
        to: "Ë",
        rule:
          "reduced_final_e_to_ë",
      });

      continue;
    }

    unresolvedCarrierDifferences.push({
      surfaceIndex: index,
      from: surface,
      carrier:
        carrierVoice,
      reason:
        "not_authorized_v0_1",
    });
  }

  if (
    finalCarrierËInsertion
  ) {
    functionalPath.push(
      "Ë",
    );

    transforms.push({
      surfaceIndex:
        surfacePath.length,
      from: null,
      to: "Ë",
      rule:
        "carrier_ë_inserted",
    });
  }

  const status =
    transforms.length === 0 &&
    unresolvedCarrierDifferences.length === 0
      ? "confirmed"
      : transforms.length > 0 &&
          unresolvedCarrierDifferences.length === 0
        ? "normalized"
        : transforms.length > 0
          ? "partially_normalized"
          : "unsupported_difference";

  const usable =
    status === "confirmed" ||
    status === "normalized" ||
    status ===
      "partially_normalized";

  return {
    schemaVersion:
      FUNCTIONAL_VOICE_NORMALIZATION_SCHEMA_V0_1,
    word,
    language,
    ipa,
    status,
    usable,
    surfacePath,
    carrierPath,
    functionalPath:
      usable
        ? functionalPath
        : null,
    transforms,
    unresolvedCarrierDifferences,
    boundary,
  };
}
