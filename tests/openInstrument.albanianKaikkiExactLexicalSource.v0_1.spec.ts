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
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import { createElement } from "react";
import { render, screen } from "@testing-library/react";

function fixtureFact(
  overrides: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1> = {},
): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  return {
    sourceRecordId: "kaikki-albanian-jsonl:word=nënë:ordinal=0",
    entryLocator: "jsonl://word/nënë/match/0",
    physicalRecordOrdinal: 12,
    language: "Albanian",
    languageCode: "sq",
    form: "nënë",
    partOfSpeech: "noun",
    senses: [{ senseId: "en-nënë-sq-noun-fixture", glosses: ["mother", "grandmother"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/nənə/", tags: [] }],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    },
    ...overrides,
  };
}

async function analysisFor(word: string) {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet: "albanian",
  });
  return enginePayloadToAnalysisResult(payload);
}

describe("real Albanian exact lexical source integration v0.1", () => {
  it("preserves exact Unicode form, senses, IPA observations, and snapshot provenance", async () => {
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [fixtureFact()],
    });

    await expect(provider.query("NËNË")).resolves.toMatchObject({
      status: "MATCHES_FOUND",
      queryForm: "NËNË",
      facts: [{
        form: "nënë",
        senses: [{ glosses: ["mother", "grandmother"] }],
        ipaObservations: [{ ipa: "/nənə/", tags: [] }],
        pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
        sourceSnapshot: {
          sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
          bytes: 67438537,
        },
      }],
    });
  });

  it("returns an explicit source miss without inventing a lexical fact", async () => {
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [fixtureFact()],
    });

    await expect(provider.query("yll")).resolves.toMatchObject({
      status: "SOURCE_NOT_FOUND",
      reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND",
      facts: [],
    });
  });

  it("keeps exact Albanian facts separate from candidates and Voice authority", async () => {
    const word = "nënë";
    const heart = buildHeartInstrumentV1(word);
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [fixtureFact()],
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor(word),
      heart,
      albanianLexicalSourceProvider: provider,
    });

    expect(result.discovery.exactLexicalSourceStatus).toMatchObject({
      status: "MATCHES_FOUND",
      queryForm: "nënë",
      reasonCode: null,
    });
    expect(result.discovery.exactLexicalSourceFacts).toHaveLength(1);
    expect(result.discovery.exactLexicalSourceFacts?.[0]?.form).toBe("nënë");
    expect(result.discovery.exactLexicalSourceFacts?.[0]?.ipaObservations[0]?.ipa).toBe("/nənə/");
    expect(result.discovery.derivedStructure.voicePathSource).toBe("albanian_profile");
    expect(result.discovery.derivedStructure.gamma.status).toBe("profile_derived");
    expect(result.discovery.candidates.every((candidate) => candidate.candidateForm !== "nënë")).toBe(true);
  });

  it("renders exact Albanian source facts as a separate UI section", () => {
    const discovery = {
      schemaVersion: "open-instrument.motivation-engine-discovery.v0_1" as const,
      status: "NO_MATCHES" as const,
      inputWord: "nënë",
      inputLanguage: "sq",
      inputProfile: "albanian",
      sourceFact: {
        layer: "SOURCE_FACT" as const,
        language: "sq",
        profile: "albanian",
        representation: "albanian_profile" as const,
        sourceStatus: "explicit_profile_binding_without_spoken_authority",
        authorityBoundary: "Albanian Discovery profile only; no production pronunciation promotion",
      },
      exactLexicalSourceStatus: {
        status: "MATCHES_FOUND" as const,
        queryForm: "nënë",
        reasonCode: null,
      },
      exactLexicalSourceFacts: [fixtureFact()],
      derivedStructure: {
        layer: "DERIVED_STRUCTURE" as const,
        voicePath: ["A", "I"],
        voicePathSource: "albanian_profile" as const,
        math7: { basis: "AI", totalMod7: 3, principlesPath: [] },
        gamma: { status: "profile_derived" as const, orderedUnits: ["n"], reason: "profile" },
        zeroConsonantalStructuralComposition: { status: "NULL" as const, variants: [], reason: "not authorized" },
        structuralHypotheses: [],
      },
      candidates: [],
      interpretation: {
        layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS" as const,
        status: "UNKNOWN_OR_NULL" as const,
        note: "Null",
      },
      unknownOrNull: { layer: "UNKNOWN_OR_NULL" as const, reason: "NO_GENERIC_AUTHORIZED_SOURCE_WITNESS" },
      userDecisionPosture: "user_decides" as const,
      noSingleWinner: true as const,
    };
    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));

    expect(screen.getByTestId("albanian-exact-lexical-source-facts")).toBeInTheDocument();
    expect(screen.getAllByText("nënë").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("mother · grandmother")).toBeInTheDocument();
    expect(screen.getByText("/nənə/", { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE/)).toBeInTheDocument();
    expect(screen.getByTestId("motivation-discovery-card")).toHaveTextContent("albanian_profile");
  });
});
