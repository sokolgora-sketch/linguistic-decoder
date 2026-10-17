import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticSourceFileV0_1,
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
  type AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1,
  projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1,
} from "@/shared/openInstrument/albanianKaikkiSourceIpaSevenVoiceProductInterpretation.v0_1";
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

type SyntheticSourceRecordV0_1 = Readonly<{
  word: string;
  lang_code: "sq";
  pos: string;
  senses: readonly Readonly<{ id: string; glosses: readonly string[] }>[];
  sounds: readonly Readonly<{ ipa: string; tags: readonly string[] }>[];
}>;

async function withSyntheticSourceFileV0_1(
  records: readonly SyntheticSourceRecordV0_1[],
  callback: (input: Readonly<{
    provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
    sourcePath: string;
    sourceBytes: Buffer;
    sourceText: Buffer;
  }>) => Promise<void>,
): Promise<void> {
  const sourceText = Buffer.from(
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
    "utf8",
  );
  const directory = await mkdtemp(join(tmpdir(), "open-instrument-albanian-index-"));
  const sourcePath = join(directory, "fixture.jsonl");
  await writeFile(sourcePath, sourceText);
  const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticSourceFileV0_1({
    sourcePath,
    sourceSha256: createHash("sha256").update(sourceText).digest("hex"),
    sourceBytes: sourceText.byteLength,
  });

  try {
    await callback({ provider, sourcePath, sourceBytes: sourceText, sourceText });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

const indexedFixtureRecordsV0_1: readonly SyntheticSourceRecordV0_1[] = [
  {
    word: "nënë",
    lang_code: "sq",
    pos: "noun",
    senses: [{ id: "nene-1", glosses: ["mother", "grandmother"] }],
    sounds: [{ ipa: "/nənə/", tags: [] }, { ipa: "/nɛːnɛ/", tags: ["variant"] }],
  },
  {
    word: "nënë",
    lang_code: "sq",
    pos: "noun",
    senses: [{ id: "nene-2", glosses: ["maternal grandmother"] }],
    sounds: [{ ipa: "/nənə/", tags: ["regional"] }],
  },
  {
    word: "dritë",
    lang_code: "sq",
    pos: "noun",
    senses: [{ id: "drite-1", glosses: ["light"] }],
    sounds: [{ ipa: "/dɾitə/", tags: [] }],
  },
  {
    word: "yll",
    lang_code: "sq",
    pos: "noun",
    senses: [{ id: "yll-1", glosses: ["star"] }],
    sounds: [{ ipa: "/yl/", tags: [] }],
  },
];

describe("real Albanian exact lexical source integration v0.1", () => {
  it("verifies once, indexes exact records, and reuses the index for different words", async () => {
    await withSyntheticSourceFileV0_1(indexedFixtureRecordsV0_1, async ({ provider, sourceBytes }) => {
      const nene = await provider.queryWithMetrics("NËNË");
      const drite = await provider.queryWithMetrics("dritë");

      expect(nene.result).toMatchObject({ status: "MATCHES_FOUND", queryForm: "NËNË" });
      expect(nene.result.status === "MATCHES_FOUND" ? nene.result.facts : []).toHaveLength(2);
      expect(nene.result.status === "MATCHES_FOUND" ? nene.result.facts.map((fact) => fact.physicalRecordOrdinal) : []).toEqual([0, 1]);
      expect(nene.result.status === "MATCHES_FOUND" ? nene.result.facts[0]?.senses : []).toEqual([
        { senseId: "nene-1", glosses: ["mother", "grandmother"] },
      ]);
      expect(nene.result.status === "MATCHES_FOUND" ? nene.result.facts[0]?.ipaObservations : []).toEqual([
        { soundIndex: 0, ipa: "/nənə/", tags: [] },
        { soundIndex: 1, ipa: "/nɛːnɛ/", tags: ["variant"] },
      ]);
      expect(drite.result).toMatchObject({ status: "MATCHES_FOUND", queryForm: "dritë" });
      expect(drite.result.status === "MATCHES_FOUND" ? drite.result.facts[0]?.form : null).toBe("dritë");
      expect(nene.metrics.indexInitializationCount).toBe(1);
      expect(drite.metrics.indexInitializationCount).toBe(1);
      expect(nene.metrics.fullSourceScanCount).toBe(1);
      expect(drite.metrics.fullSourceScanCount).toBe(1);
      expect(nene.metrics.fullSourceBytesScanned).toBe(sourceBytes.byteLength);
      expect(drite.metrics.indexedLookupBytesRead).toBeLessThan(sourceBytes.byteLength);
    });
  });

  it("preserves Ë, ë, and Y lookup identity and returns explicit Null for a miss", async () => {
    await withSyntheticSourceFileV0_1(indexedFixtureRecordsV0_1, async ({ provider }) => {
      const decomposedDrite = await provider.query("DRIT" + "E\u0308");
      const yll = await provider.query("YLL");
      const missing = await provider.query("not-a-word");

      expect(decomposedDrite).toMatchObject({ status: "MATCHES_FOUND", facts: [{ form: "dritë" }] });
      expect(yll).toMatchObject({ status: "MATCHES_FOUND", facts: [{ form: "yll" }] });
      expect(missing).toMatchObject({
        status: "SOURCE_NOT_FOUND",
        reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND",
        facts: [],
      });
    });
  });

  it("fails closed when an indexed source record is corrupted after initialization", async () => {
    await withSyntheticSourceFileV0_1(indexedFixtureRecordsV0_1, async ({ provider, sourcePath, sourceBytes }) => {
      await expect(provider.query("nënë")).resolves.toMatchObject({ status: "MATCHES_FOUND" });
      const corrupted = Buffer.from(sourceBytes);
      const markerOffset = corrupted.indexOf(Buffer.from("mother", "utf8"));
      expect(markerOffset).toBeGreaterThanOrEqual(0);
      corrupted[markerOffset] = "f".charCodeAt(0);
      await writeFile(sourcePath, corrupted);

      await expect(provider.query("nënë")).resolves.toMatchObject({
        status: "UNAVAILABLE",
        reasonCode: "ALBANIAN_SOURCE_IDENTITY_MISMATCH",
        facts: [],
      });
    });
  });

  it("shares one deterministic index initialization across concurrent exact queries", async () => {
    await withSyntheticSourceFileV0_1(indexedFixtureRecordsV0_1, async ({ provider }) => {
      const results = await Promise.all(
        Array.from({ length: 8 }, (_, index) => provider.queryWithMetrics(index % 2 === 0 ? "nënë" : "dritë")),
      );

      expect(results.every(({ result }) => result.status === "MATCHES_FOUND")).toBe(true);
      expect(results.map(({ metrics }) => metrics.indexInitializationCount)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
      expect(results.map(({ metrics }) => metrics.fullSourceScanCount)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
    });
  });

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
    expect(result.discovery.sourceIpaSevenVoiceAnalyses).toMatchObject([{
      rawIpa: "/nənə/",
      status: "SUPPORTED",
      voicePath: ["Ë", "Ë"],
      authorityBoundary: "CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY",
      sourceRecordId: "kaikki-albanian-jsonl:word=nënë:ordinal=0",
    }]);
  });

  it("maps supported source IPA and preserves explicit Null for glide and missing observations", () => {
    const analyses = projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(fixtureFact({
      ipaObservations: [
        { soundIndex: 0, ipa: "/nənə/", tags: [] },
        { soundIndex: 1, ipa: "/ujə/", tags: ["variant"] },
        { soundIndex: 2, ipa: null, tags: ["missing"] },
      ],
    }));

    expect(analyses[0]).toMatchObject({ status: "SUPPORTED", voicePath: ["Ë", "Ë"], nucleusStructure: "SEQUENTIAL_NUCLEI" });
    expect(analyses[1]).toMatchObject({
      status: "NULL",
      voicePath: [],
      nucleusStructure: "UNRESOLVED_NUCLEUS_STRUCTURE",
      reasonCodes: ["NUCLEUS_STRUCTURE_UNRESOLVED"],
      tags: ["variant"],
    });
    expect(analyses[2]).toMatchObject({
      status: "NULL",
      rawIpa: null,
      reasonCodes: ["IPA_OBSERVATION_MISSING"],
      tags: ["missing"],
    });
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
      sourceIpaSevenVoiceAnalyses: projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1([fixtureFact()]),
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
    expect(screen.getAllByText("/nənə/", { exact: false }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE/)).toBeInTheDocument();
    expect(screen.getByTestId("albanian-source-ipa-seven-voices")).toBeInTheDocument();
    expect(screen.getByText("Ë → Ë", { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY/)).toBeInTheDocument();
    expect(screen.getByTestId("motivation-discovery-card")).toHaveTextContent("albanian_profile");
  });
});
