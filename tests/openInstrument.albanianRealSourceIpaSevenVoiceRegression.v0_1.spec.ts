import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1,
} from "@/shared/openInstrument/albanianKaikkiSourceIpaSevenVoiceProductInterpretation.v0_1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";

const SOURCE_SNAPSHOT = {
  sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
  sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
  sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
  bytes: 67438537,
} as const;

const PRONUNCIATION_AUTHORITY =
  "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const;

function fixtureFact(input: Readonly<{
  sourceRecordId: string;
  entryLocator: string;
  physicalRecordOrdinal: number;
  form: string;
  partOfSpeech: string;
  glosses: readonly string[];
  ipaObservations: AlbanianKaikkiExactLexicalSourceFactV0_1["ipaObservations"];
}>): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  return {
    sourceRecordId: input.sourceRecordId,
    entryLocator: input.entryLocator,
    physicalRecordOrdinal: input.physicalRecordOrdinal,
    language: "Albanian",
    languageCode: "sq",
    form: input.form,
    partOfSpeech: input.partOfSpeech,
    senses: [{ senseId: `${input.form}-real-source-regression`, glosses: input.glosses }],
    ipaObservations: input.ipaObservations,
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: PRONUNCIATION_AUTHORITY,
    sourceSnapshot: SOURCE_SNAPSHOT,
  };
}

const REAL_SOURCE_FIXTURE_FACTS: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] = [
  fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=ba:ordinal=0",
    entryLocator: "jsonl://word/ba/match/0",
    physicalRecordOrdinal: 77,
    form: "ba",
    partOfSpeech: "verb",
    glosses: ["Gheg form of bërë"],
    ipaObservations: [
      { soundIndex: 0, ipa: "[ˈbɑ̃ː]", tags: ["Gheg"] },
      { soundIndex: 1, ipa: "[ˈbɒ̃ː]", tags: ["Gheg"] },
    ],
  }),
  fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=them:ordinal=0",
    entryLocator: "jsonl://word/them/match/0",
    physicalRecordOrdinal: 90,
    form: "them",
    partOfSpeech: "verb",
    glosses: ["to say"],
    ipaObservations: [
      { soundIndex: 0, ipa: "[θɛm]", tags: ["Tosk"] },
      { soundIndex: 1, ipa: "[θɑ̃m]", tags: ["Gheg"] },
      { soundIndex: 2, ipa: "[θɔ̃m]", tags: ["Gheg"] },
      { soundIndex: 3, ipa: "[θɛ̃m]", tags: ["Gheg"] },
      { soundIndex: 4, ipa: "[θẽːm]", tags: ["Gheg"] },
    ],
  }),
  fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=shqip:ordinal=0",
    entryLocator: "jsonl://word/shqip/match/0",
    physicalRecordOrdinal: 866,
    form: "shqip",
    partOfSpeech: "adj",
    glosses: ["Albanian"],
    ipaObservations: [
      { soundIndex: 0, ipa: "/ʃcip/", tags: ["Tosk"] },
      { soundIndex: 1, ipa: "/ʃcip/", tags: ["Northern", "Tosk"] },
      { soundIndex: 2, ipa: "/ʃkʲip/", tags: [] },
      { soundIndex: 3, ipa: "/ʃt͡ɕip/", tags: [] },
      { soundIndex: 4, ipa: "/ʃt͡ʃip/", tags: ["Gheg"] },
      { soundIndex: 5, ipa: null, tags: [] },
    ],
  }),
  fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=shqip:ordinal=1",
    entryLocator: "jsonl://word/shqip/match/1",
    physicalRecordOrdinal: 867,
    form: "shqip",
    partOfSpeech: "adv",
    glosses: ["in the Albanian language", "clear, understandable, comprehensive, unequivocally"],
    ipaObservations: [
      { soundIndex: 0, ipa: "/ʃcip/", tags: ["Tosk"] },
      { soundIndex: 1, ipa: "/ʃcip/", tags: ["Northern", "Tosk"] },
      { soundIndex: 2, ipa: "/ʃkʲip/", tags: [] },
      { soundIndex: 3, ipa: "/ʃt͡ɕip/", tags: [] },
      { soundIndex: 4, ipa: "/ʃt͡ʃip/", tags: ["Gheg"] },
      { soundIndex: 5, ipa: null, tags: [] },
    ],
  }),
  fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=mol:ordinal=0",
    entryLocator: "jsonl://word/mol/match/0",
    physicalRecordOrdinal: 1297,
    form: "mol",
    partOfSpeech: "noun",
    glosses: ["mountain"],
    ipaObservations: [
      { soundIndex: 0, ipa: "[mõ̞l]", tags: ["Gheg", "Southern"] },
    ],
  }),
];

const EXPECTED_VARIANTS = {
  ba: [
    { soundIndex: 0, rawIpa: "[ˈbɑ̃ː]", tags: ["Gheg"], status: "SUPPORTED", voicePath: ["A"], reasonCodes: [], stress: ["ˈ"], length: ["ː"], nasalization: ["̃"] },
    { soundIndex: 1, rawIpa: "[ˈbɒ̃ː]", tags: ["Gheg"], status: "SUPPORTED", voicePath: ["A"], reasonCodes: [], stress: ["ˈ"], length: ["ː"], nasalization: ["̃"] },
  ],
  them: [
    { soundIndex: 0, rawIpa: "[θɛm]", tags: ["Tosk"], status: "SUPPORTED", voicePath: ["E"], reasonCodes: [], stress: [], length: [], nasalization: [] },
    { soundIndex: 1, rawIpa: "[θɑ̃m]", tags: ["Gheg"], status: "SUPPORTED", voicePath: ["A"], reasonCodes: [], stress: [], length: [], nasalization: ["̃"] },
    { soundIndex: 2, rawIpa: "[θɔ̃m]", tags: ["Gheg"], status: "SUPPORTED", voicePath: ["O"], reasonCodes: [], stress: [], length: [], nasalization: ["̃"] },
    { soundIndex: 3, rawIpa: "[θɛ̃m]", tags: ["Gheg"], status: "SUPPORTED", voicePath: ["E"], reasonCodes: [], stress: [], length: [], nasalization: ["̃"] },
    { soundIndex: 4, rawIpa: "[θẽːm]", tags: ["Gheg"], status: "SUPPORTED", voicePath: ["E"], reasonCodes: [], stress: [], length: ["ː"], nasalization: ["̃"] },
  ],
  shqip: [
    { soundIndex: 0, rawIpa: "/ʃcip/", tags: ["Tosk"], status: "SUPPORTED", voicePath: ["I"], reasonCodes: [], stress: [], length: [], nasalization: [] },
    { soundIndex: 1, rawIpa: "/ʃcip/", tags: ["Northern", "Tosk"], status: "SUPPORTED", voicePath: ["I"], reasonCodes: [], stress: [], length: [], nasalization: [] },
    { soundIndex: 2, rawIpa: "/ʃkʲip/", tags: [], status: "SUPPORTED", voicePath: ["I"], reasonCodes: [], stress: [], length: [], nasalization: [] },
    { soundIndex: 3, rawIpa: "/ʃt͡ɕip/", tags: [], status: "SUPPORTED", voicePath: ["I"], reasonCodes: [], stress: [], length: [], nasalization: [] },
    { soundIndex: 4, rawIpa: "/ʃt͡ʃip/", tags: ["Gheg"], status: "SUPPORTED", voicePath: ["I"], reasonCodes: [], stress: [], length: [], nasalization: [] },
    { soundIndex: 5, rawIpa: null, tags: [], status: "NULL", voicePath: [], reasonCodes: ["IPA_OBSERVATION_MISSING"], stress: [], length: [], nasalization: [] },
  ],
  mol: [
    { soundIndex: 0, rawIpa: "[mõ̞l]", tags: ["Gheg", "Southern"], status: "SUPPORTED", voicePath: ["O"], reasonCodes: [], stress: [], length: [], nasalization: ["̃"] },
  ],
} as const;

function projectSummary(facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]) {
  return projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1(facts).map((analysis) => ({
    sourceRecordId: analysis.sourceRecordId,
    soundIndex: analysis.soundIndex,
    rawIpa: analysis.rawIpa,
    tags: analysis.tags,
    status: analysis.status,
    voicePath: analysis.voicePath,
    reasonCodes: analysis.reasonCodes,
    stress: analysis.nonVoiceFeatures.stressMarkers,
    length: analysis.nonVoiceFeatures.lengthMarkers,
    nasalization: analysis.nonVoiceFeatures.nasalizationMarks,
  }));
}

async function analysisFor(word: string) {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet: "albanian",
  });
  return enginePayloadToAnalysisResult(payload);
}

describe("real Albanian source IPA and Seven-Voices regression v0.1", () => {
  it("preserves extracted source identity, variants, tags, descriptive Voice paths and Null", async () => {
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: REAL_SOURCE_FIXTURE_FACTS,
    });

    for (const [word, expectedVariants] of Object.entries(EXPECTED_VARIANTS)) {
      const result = await provider.query(word);
      expect(result.status).toBe("MATCHES_FOUND");
      if (result.status !== "MATCHES_FOUND") continue;
      expect(result.facts.every((fact) => fact.sourceSnapshot.sha256 === SOURCE_SNAPSHOT.sha256)).toBe(true);
      expect(result.facts.every((fact) => fact.sourceSnapshot.bytes === SOURCE_SNAPSHOT.bytes)).toBe(true);
      expect(projectSummary(result.facts)).toEqual(
        result.facts.flatMap((fact) => expectedVariants.map((expected) => ({
          sourceRecordId: fact.sourceRecordId,
          ...expected,
        }))),
      );
    }
  });

  it("carries the real-source fixture through Discovery and the adapter without dialect or semantic promotion", async () => {
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: REAL_SOURCE_FIXTURE_FACTS,
    });

    for (const word of ["ba", "them", "shqip", "mol"] as const) {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word,
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor(word),
        heart: buildHeartInstrumentV1(word),
        albanianLexicalSourceProvider: provider,
      });
      const discovery = result.discovery;
      expect(discovery.exactLexicalSourceStatus).toMatchObject({ status: "MATCHES_FOUND", queryForm: word });
      expect(discovery.sourceIpaSevenVoiceAnalyses.every((analysis) =>
        analysis.sourcePronunciationAuthority === PRONUNCIATION_AUTHORITY &&
        analysis.authorityBoundary === "CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY",
      )).toBe(true);
      expect(discovery.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
      const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
      expect(vm.motivationDiscoveryV0_1.kind).toBe("present");
      if (vm.motivationDiscoveryV0_1.kind !== "present") continue;
      expect(vm.motivationDiscoveryV0_1.value.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
      expect(vm.motivationDiscoveryV0_1.value.sourceIpaSevenVoiceAnalyses).toEqual(discovery.sourceIpaSevenVoiceAnalyses);
    }
  });
});
