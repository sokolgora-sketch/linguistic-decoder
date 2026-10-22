import type { AlbanianKaikkiExactLexicalSourceFactV0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import { projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1 } from "@/shared/openInstrument/albanianKaikkiSourceIpaSevenVoiceProductInterpretation.v0_1";
import { projectAlbanianSourceOrderContextSignatureV0_1 } from "@/shared/openInstrument/albanianSourceOrderContextSignature.v0_1";

const SOURCE_SNAPSHOT = {
  sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
  sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
  sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
  bytes: 67438537,
} as const;

function fact(
  form: string,
  ipa: string | null,
  tags: readonly string[] = [],
  overrides: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1> = {},
): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  return {
    sourceRecordId: `kaikki-albanian-jsonl:word=${encodeURIComponent(form)}:ordinal=0`,
    entryLocator: `jsonl://word/${encodeURIComponent(form)}/match/0`,
    physicalRecordOrdinal: 1,
    language: "Albanian",
    languageCode: "sq",
    form,
    partOfSpeech: "noun",
    senses: [{ senseId: `fixture-${form}`, glosses: ["fixture"] }],
    ipaObservations: [{ soundIndex: 0, ipa, tags }],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: SOURCE_SNAPSHOT,
    ...overrides,
  };
}

function project(form: string, ipa: string | null, tags: readonly string[] = []) {
  const sourceFact = fact(form, ipa, tags);
  const analysis = projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(sourceFact)[0];
  return {
    sourceFact,
    analysis,
    result: projectAlbanianSourceOrderContextSignatureV0_1({ fact: sourceFact, analysis }),
  };
}

describe("Albanian source-order context signature v0.1", () => {
  it("projects mal as one A nucleus with prefix and suffix consonants", () => {
    const result = project("mal", "[mal]").result;
    expect(result).toMatchObject({ status: "SUPPORTED", rawIpa: "[mal]", voicePath: ["A"] });
    expect(result.prefixConsonants?.map((segment) => segment.baseSymbol)).toEqual(["m"]);
    expect(result.suffixConsonants?.map((segment) => segment.baseSymbol)).toEqual(["l"]);
    expect(result.interNucleusRegions).toEqual([]);
  });

  it("projects baba as two A nuclei with the middle consonant anchored between them", () => {
    const result = project("baba", "/baˈba/").result;
    expect(result).toMatchObject({ status: "SUPPORTED", voicePath: ["A", "A"] });
    expect(result.prefixConsonants?.map((segment) => segment.baseSymbol)).toEqual(["b"]);
    expect(result.interNucleusRegions?.[0]?.consonants.map((segment) => segment.baseSymbol)).toEqual(["b"]);
    expect(result.suffixConsonants).toEqual([]);
  });

  it("preserves dritë as I,Ë with dɾ prefix and t inter-nucleus context", () => {
    const result = project("dritë", "/ˈdɾitə/").result;
    expect(result).toMatchObject({ status: "SUPPORTED", voicePath: ["I", "Ë"] });
    expect(result.prefixConsonants?.map((segment) => segment.baseSymbol)).toEqual(["d", "ɾ"]);
    expect(result.interNucleusRegions?.[0]?.consonants.map((segment) => segment.baseSymbol)).toEqual(["t"]);
    expect(result.suffixConsonants).toEqual([]);
  });

  it("preserves ditë optionality without choosing an unconditional final schwa", () => {
    const result = project("ditë", "[ˈdit(ə)]").result;
    expect(result).toMatchObject({ status: "NULL", voicePath: [], structuralSignature: null });
    expect(result.optionalNucleusOrders).toEqual([1]);
    expect(result.sourceSegments.find((segment) => segment.baseSymbol === "ə")).toMatchObject({ optional: true });
    expect(result.reasonCodes).toEqual(["OPTIONAL_NUCLEUS_UNCONFIRMED"]);
  });

  it("does not treat an optional vowel inside a bracketed IPA wrapper as definite A", () => {
    const result = project("a", "[(a)]").result;
    expect(result).toMatchObject({
      status: "NULL",
      rawIpa: "[(a)]",
      voicePath: [],
      structuralSignature: null,
      optionalNucleusOrders: [0],
      reasonCodes: ["OPTIONAL_NUCLEUS_UNCONFIRMED"],
    });
    expect(result.sourceSegments).toEqual([
      expect.objectContaining({ baseSymbol: "a", optional: true, voiceAnchors: ["A"] }),
    ]);
  });

  it("preserves multiple optional groups instead of normalizing them into malformed support", () => {
    const result = project("mal", "[(ma)(l)]").result;
    expect(result).toMatchObject({
      status: "NULL",
      rawIpa: "[(ma)(l)]",
      voicePath: [],
      structuralSignature: null,
      optionalNucleusOrders: [0],
      reasonCodes: ["OPTIONAL_NUCLEUS_UNCONFIRMED"],
    });
    expect(result.sourceSegments.map((segment) => [segment.baseSymbol, segment.optional])).toEqual([
      ["m", true],
      ["a", true],
      ["l", true],
    ]);
  });

  it("fails closed when pronunciationBody disagrees with the source raw IPA", () => {
    const { sourceFact, analysis } = project("mal", "[mal]");
    const result = projectAlbanianSourceOrderContextSignatureV0_1({
      fact: sourceFact,
      analysis: { ...analysis, pronunciationBody: "bal" },
    });
    expect(result).toMatchObject({
      status: "NULL",
      structuralSignature: null,
      reasonCodes: ["SOURCE_RECORD_ANALYSIS_MISMATCH"],
    });
  });

  it("fails closed when a nucleus identity disagrees with the parsed source segment", () => {
    const { sourceFact, analysis } = project("mal", "[mal]");
    const result = projectAlbanianSourceOrderContextSignatureV0_1({
      fact: sourceFact,
      analysis: {
        ...analysis,
        nuclei: [{ ...analysis.nuclei[0], raw: "e", baseSymbol: "e", voice: "E" }],
        voicePath: ["E"],
      },
    });
    expect(result).toMatchObject({
      status: "NULL",
      structuralSignature: null,
      reasonCodes: ["NUCLEUS_STRUCTURE_UNRESOLVED"],
    });
  });

  it("keeps sy as an S consonant and Y nucleus without inserting Ë", () => {
    const result = project("sy", "/sy/").result;
    expect(result).toMatchObject({ status: "SUPPORTED", voicePath: ["Y"] });
    expect(result.sourceSegments.map((segment) => segment.baseSymbol)).toEqual(["s", "y"]);
    expect(result.sourceSegments.filter((segment) => segment.class === "vowel").map((segment) => segment.baseSymbol)).toEqual(["y"]);
    expect(result.sourceSegments.some((segment) => segment.baseSymbol === "ə")).toBe(false);
  });

  it("preserves the existing glide/nucleus Null for ujë", () => {
    const { result } = project("ujë", "/ˈujə/");
    expect(result).toMatchObject({ status: "NULL", structuralSignature: null, voicePath: [] });
    expect(result.reasonCodes).toEqual(expect.arrayContaining(["ANALYSIS_NULL", "NUCLEUS_STRUCTURE_UNRESOLVED"]));
    expect(result.sourceSegments.map((segment) => segment.baseSymbol)).toEqual(["u", "j", "ə"]);
  });

  it("preserves stress, length and nasalization as metadata rather than Voice events", () => {
    const result = project("a", "/ˈaː̃/").result;
    expect(result).toMatchObject({ status: "SUPPORTED", voicePath: ["A"], rawIpa: "/ˈaː̃/" });
    expect(result.nonVoiceFeatures).toMatchObject({
      stressMarkers: ["ˈ"],
      lengthMarkers: ["ː"],
      nasalizationMarks: ["̃"],
    });
    expect(result.sourceSegments).toHaveLength(1);
  });

  it("preserves source sound identity for variants without selecting a winner", () => {
    const sourceFact = fact("nënë", "/nənə/", ["variant-0"], {
      ipaObservations: [
        { soundIndex: 0, ipa: "/nənə/", tags: ["variant-0"] },
        { soundIndex: 1, ipa: "/nɛːnɛ/", tags: ["variant-1"] },
      ],
    });
    const analyses = projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(sourceFact);
    const first = projectAlbanianSourceOrderContextSignatureV0_1({ fact: sourceFact, analysis: analyses[0] });
    const second = projectAlbanianSourceOrderContextSignatureV0_1({ fact: sourceFact, analysis: analyses[1] });
    expect(first.source.soundIndex).toBe(0);
    expect(second.source.soundIndex).toBe(1);
    expect(first.structuralSignature).not.toBe(second.structuralSignature);
  });

  it("fails closed for unknown IPA symbols and malformed input", () => {
    expect(project("a?", "/a?/").result).toMatchObject({ status: "NULL", structuralSignature: null, reasonCodes: ["IPA_SYMBOL_UNSUPPORTED"] });
    expect(projectAlbanianSourceOrderContextSignatureV0_1(null)).toMatchObject({
      status: "NULL",
      reasonCodes: ["INPUT_MALFORMED"],
      sourcePronunciationAuthority: null,
      source: { sourceStatus: null, attestationTruth: null },
    });
  });

  it("fails closed when the source authority is not the explicitly unbound current record authority", () => {
    const sourceFact = fact("mal", "[mal]", [], {
      pronunciationAuthority: "UNAUTHORIZED_PROFILE" as AlbanianKaikkiExactLexicalSourceFactV0_1["pronunciationAuthority"],
    });
    const analysis = projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(sourceFact)[0];
    expect(projectAlbanianSourceOrderContextSignatureV0_1({ fact: sourceFact, analysis })).toMatchObject({
      status: "NULL",
      reasonCodes: ["SOURCE_AUTHORITY_UNBOUND_REQUIRED"],
      semanticOutput: "NOT_GENERATED",
    });
  });

  it("does not expose semantic output or a functional winner", () => {
    const result = project("baba", "/baˈba/").result as unknown as Record<string, unknown>;
    expect(Object.keys(result)).not.toEqual(expect.arrayContaining(["meaning", "etymology", "function", "winner"]));
    expect(result.semanticOutput).toBe("NOT_GENERATED");
  });
});
