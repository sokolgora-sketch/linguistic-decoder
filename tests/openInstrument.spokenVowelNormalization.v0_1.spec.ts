import {
  normalizeSpokenVowelsV0_1,
  type SpokenVowelNormalizationInputV0_1,
} from "@/shared/openInstrument/spokenVowelNormalization.v0_1";

function input(ipa: string): SpokenVowelNormalizationInputV0_1 {
  return {
    mode: "spoken_ipa",
    ipa,
    language: "en",
    dialectOrAccent: null,
    pronunciationSource: "explicit_ipa",
    provenance: {
      sourceId: "test.explicit-ipa.v0_1",
      suppliedBy: "user",
    },
  };
}

test("supported monophthong maps to one canonical Voice", () => {
  const result = normalizeSpokenVowelsV0_1(input("/o/"));

  expect(result.status).toBe("defined");
  expect(result.normalizedVoicePath).toEqual(["O"]);
  expect(result.nuclei).toEqual([
    { kind: "monophthong", ipaSegments: ["o"], voice: "O" },
  ]);
});

test("explicit schwa maps to Ë", () => {
  const result = normalizeSpokenVowelsV0_1(input("/ə/"));

  expect(result.segmentation).toBe("schwa");
  expect(result.normalizedVoicePath).toEqual(["Ë"]);
  expect(result.nuclei[0]).toEqual({
    kind: "schwa",
    ipaSegments: ["ə"],
    voice: "Ë",
  });
});

test("separated vowels remain an ordered two-nucleus sequence", () => {
  const result = normalizeSpokenVowelsV0_1(input("/bɑtɪ/"));

  expect(result.segmentation).toBe("sequence_of_two_vowel_nuclei");
  expect(result.normalizedVoicePath).toEqual(["A", "I"]);
});

test("/oʊ/ remains unresolved without emitting O, U, or a semantic collapse", () => {
  const result = normalizeSpokenVowelsV0_1(input("/stoʊn/"));

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("AMBIGUOUS_NUCLEUS_SEGMENTATION");
  expect(result.segmentation).toBe("unsupported_or_ambiguous");
  expect(result.normalizedVoicePath).toBeNull();
  expect(result.nuclei[0]).toMatchObject({
    kind: "unsupported_or_ambiguous",
    ipaSegments: ["o", "ʊ"],
    voice: null,
  });
});

test("another adjacent vowel pair uses the same generic unresolved result", () => {
  const first = normalizeSpokenVowelsV0_1(input("/stoʊn/"));
  const second = normalizeSpokenVowelsV0_1(input("/aɪ/"));

  expect(second.status).toBe(first.status);
  expect(second.reasonCode).toBe(first.reasonCode);
  expect(second.segmentation).toBe(first.segmentation);
  expect(second.normalizedVoicePath).toBeNull();
});

test("mother IPA uses the existing ʌ and ə family mappings", () => {
  const result = normalizeSpokenVowelsV0_1(input("/ˈmʌðər/"));

  expect(result.normalizedVoicePath).toEqual(["Ë", "Ë"]);
  expect(result.nuclei.map((nucleus) => nucleus.voice)).toEqual(["Ë", "Ë"]);
});

test("rhythm explicit schwa uses the existing carrier behavior", () => {
  const result = normalizeSpokenVowelsV0_1(input("/ˈɹɪðəm/"));

  expect(result.normalizedVoicePath).toEqual(["I", "Ë"]);
  expect(result.nuclei.map((nucleus) => nucleus.voice)).toEqual(["I", "Ë"]);
});

test("rhythm implicit carrier uses the existing Carrier Law", () => {
  const result = normalizeSpokenVowelsV0_1(input("/ˈɹɪðm/"));

  expect(result.normalizedVoicePath).toEqual(["I", "Ë"]);
  expect(result.nuclei.at(-1)).toEqual({
    kind: "syllabic_carrier",
    ipaSegments: ["∅"],
    voice: "Ë",
  });
});

test("explicit syllabic carrier uses the existing Carrier Law", () => {
  const result = normalizeSpokenVowelsV0_1(input("/m̩/"));

  expect(result.segmentation).toBe("syllabic_carrier");
  expect(result.normalizedVoicePath).toEqual(["Ë"]);
});

test.each([
  ["/kat/", ["A"]],
  ["/kæt/", ["A"]],
  ["/hænd/", ["A"]],
])("ordinary final consonants do not inject a trailing carrier: %s", (ipa, expectedPath) => {
  const result = normalizeSpokenVowelsV0_1(input(ipa));

  expect(result.normalizedVoicePath).toEqual(expectedPath);
  expect(result.normalizedVoicePath).not.toContain("Ë");
});

test("unsupported IPA symbols fail closed", () => {
  const result = normalizeSpokenVowelsV0_1(input("/bᵻt/"));

  expect(result.status).toBe("unsupported");
  expect(result.reasonCode).toBe("UNSUPPORTED_IPA_SYMBOL");
  expect(result.normalizedVoicePath).toBeNull();
});

test("an orphan combining mark fails closed instead of disappearing", () => {
  const result = normalizeSpokenVowelsV0_1(input("/̯o/"));

  expect(result.status).toBe("unsupported");
  expect(result.reasonCode).toBe("IPA_INVALID");
  expect(result.normalizedVoicePath).toBeNull();
});

test("a supported attached combining mark remains attached to its base", () => {
  const result = normalizeSpokenVowelsV0_1(input("/e̞/"));

  expect(result.status).toBe("defined");
  expect(result.normalizedVoicePath).toEqual(["E"]);
});

test("missing IPA is explicit Null", () => {
  const result = normalizeSpokenVowelsV0_1(input(""));

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("IPA_MISSING");
  expect(result.normalizedVoicePath).toBeNull();
});

test("an unclassified adjacent vowel sequence is Null", () => {
  const result = normalizeSpokenVowelsV0_1(input("/aɪ/"));

  expect(result.status).toBe("null");
  expect(result.reasonCode).toBe("AMBIGUOUS_NUCLEUS_SEGMENTATION");
  expect(result.normalizedVoicePath).toBeNull();
});

test("normalization is deterministic and preserves provenance", () => {
  const request = input("/ˈmʌðər/");
  const first = normalizeSpokenVowelsV0_1(request);
  const second = normalizeSpokenVowelsV0_1(request);

  expect(second).toEqual(first);
  expect(first.provenance).toEqual(request.provenance);
  expect(first.language).toBe("en");
  expect(first.dialectOrAccent).toBeNull();
});

test("the result has no semantic or word-specific fields", () => {
  const result = normalizeSpokenVowelsV0_1(input("/o/"));

  expect(result).not.toHaveProperty("word");
  expect(result).not.toHaveProperty("meaning");
  expect(result).not.toHaveProperty("targetSense");
  expect(result).not.toHaveProperty("desiredVoicePath");
});

test("spoken normalization never falls back to orthography", () => {
  const result = normalizeSpokenVowelsV0_1(input("/oʊ/"));

  expect(result.normalizedVoicePath).toBeNull();
  expect(result.reasonCode).toBe("AMBIGUOUS_NUCLEUS_SEGMENTATION");
});
