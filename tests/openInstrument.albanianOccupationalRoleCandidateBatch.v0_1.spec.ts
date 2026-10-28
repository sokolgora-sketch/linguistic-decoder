import {
  albanianSuffixDiscoveryMatchesV0_1,
  buildAlbanianOccupationalRoleCandidateBatchV0_1,
  getAlbanianOccupationalRoleCandidatesForWordV0_1,
} from "@/shared/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1";

const occupations = {
  name: "Occupations",
  kind: "other",
  parents: [],
  source: "w",
  orig: "sq:Occupations",
  langcode: "sq",
};

function sourceRow(input: Readonly<{
  word: string;
  id: string;
  pos: string;
  senses: readonly Readonly<Record<string, unknown>>[];
  derived?: readonly string[];
  etymologyLinks?: readonly (readonly [string, string])[];
  etymologyText?: string;
  sounds?: readonly Readonly<Record<string, unknown>>[];
  langCode?: string;
}>): Readonly<Record<string, unknown>> {
  return {
    word: input.word,
    id: input.id,
    lang_code: input.langCode ?? "sq",
    pos: input.pos,
    senses: input.senses,
    ...(input.derived ? { derived: input.derived.map((word) => ({ word })) } : {}),
    ...(input.etymologyLinks ? { etymology_links: input.etymologyLinks } : {}),
    ...(input.etymologyText ? { etymology_text: input.etymologyText } : {}),
    ...(input.sounds ? { sounds: input.sounds } : {}),
  };
}

function fixtureBatch() {
  const sourceRows = [
    sourceRow({ word: "pelë", id: "raw-pele-row", pos: "noun", senses: [{ id: "en-pelë-sq-noun-B0ryv46E", glosses: ["mare"] }], derived: ["pelar"] }),
    null,
    sourceRow({ word: "pelar", id: "en-pelar-sq-noun-RnBYACSN", pos: "noun", senses: [{ id: "en-pelar-sq-noun-RnBYACSN", glosses: ["stableman, ostler, groom (especially mares)"] }], etymologyLinks: [["pelë", "pelë#Albanian"], ["-ar", "-ar#Albanian"]], etymologyText: "From pelë + -ar.", sounds: [{ ipa: "/peˈlar/" }] }),
    sourceRow({ word: "thëngjill", id: "raw-thengjill-row", pos: "noun", senses: [{ id: "en-thëngjill-sq-noun-K~rhJi0l", glosses: ["coal, charcoal"] }], derived: ["thëngjilltar"] }),
    sourceRow({ word: "thëngjilltar", id: "en-thëngjilltar-sq-noun-AMp0~85e", pos: "noun", senses: [{ id: "en-thëngjilltar-sq-noun-AMp0~85e", glosses: ["coal maker"] }], etymologyLinks: [["thëngjill", "thëngjill#Albanian"], ["-tar", "-tar#Albanian"]] }),
    sourceRow({ word: "bletë", id: "raw-blete-row", pos: "noun", senses: [{ id: "en-bletë-sq-noun-fixture", glosses: ["bee"] }], derived: ["bletar"] }),
    sourceRow({ word: "bletar", id: "en-bletar-sq-noun-KI12VIJ3", pos: "noun", senses: [{ id: "en-bletar-sq-noun-KI12VIJ3", glosses: ["beekeeper"], categories: [occupations] }], etymologyLinks: [["bletë", "bletë#Albanian"]] }),
    sourceRow({ word: "shqiptar", id: "en-shqiptar-sq-noun-qIrsERun", pos: "noun", senses: [{ id: "en-shqiptar-sq-noun-qIrsERun", glosses: ["An Albanian in general"] }] }),
    sourceRow({ word: "gjitar", id: "en-gjitar-sq-noun-5kWvjg5O", pos: "noun", senses: [{ id: "en-gjitar-sq-noun-5kWvjg5O", glosses: ["mammal"] }] }),
    sourceRow({ word: "gjueti", id: "en-gjueti-sq-noun-2OZsfFaS", pos: "noun", senses: [{ id: "en-gjueti-sq-noun-2OZsfFaS", glosses: ["hunting"] }] }),
    sourceRow({ word: "kombëtar", id: "en-kombëtar-sq-adj-QARk6emb", pos: "adj", senses: [{ id: "en-kombëtar-sq-adj-QARk6emb", glosses: ["national"], categories: [occupations] }] }),
    sourceRow({ word: "shitës", id: "en-shitës-sq-adj-fixture", pos: "adj", senses: [{ id: "en-shitës-sq-adj-fixture", glosses: ["selling"], categories: [occupations] }] }),
    sourceRow({ word: "jaguar", id: "en-jaguar-sq-noun-fixture", pos: "noun", senses: [{ id: "en-jaguar-sq-noun-fixture", glosses: ["jaguar"], categories: [occupations] }], etymologyLinks: [["jaguar", "jaguar#Portuguese"]] }),
    sourceRow({ word: "bar", id: "en-bar-sq-noun-fixture", pos: "noun", senses: [{ id: "en-bar-sq-noun-fixture", glosses: ["bar"], categories: [occupations] }], etymologyLinks: [["far", "far#Latin"]] }),
    sourceRow({ word: "far", id: "en-far-sq-noun-fixture", pos: "noun", senses: [{ id: "en-far-sq-noun-fixture", glosses: ["seed"] }] }),
    sourceRow({ word: "notar", id: "en-notar-sq-noun-fixture", pos: "noun", senses: [{ id: "en-notar-sq-noun-fixture", glosses: ["notary"], categories: [occupations] }], etymologyLinks: [["far", "far"]] }),
    sourceRow({ word: "foreign-tar", id: "foreign-tar-fixture", pos: "noun", langCode: "en", senses: [{ id: "foreign-tar-fixture", glosses: ["foreign occupational noun"], categories: [occupations] }] }),
  ];
  const oewnEntries = {
    stableman: { n: { sense: [{ id: "stableman%1:18:00::", synset: "84190390-n" }] } },
    ostler: { n: { sense: [{ id: "ostler%1:18:00::", synset: "10663740-n" }] } },
    groom: { n: { sense: [
      { id: "groom%1:18:01::", synset: "10663740-n" },
      { id: "groom%1:18:00::", synset: "10167455-n" },
      { id: "groom%1:18:02::", synset: "10167555-n" },
    ] } },
    maker: { n: { sense: [{ id: "maker%1:18:00::", synset: "10303761-n" }] } },
    beekeeper: { n: { sense: [{ id: "beekeeper%1:18:00::", synset: "09866163-n" }] } },
  };
  const oewnSynsets = {
    "84190390-n": { members: ["stableman", "stableboy"], definition: ["a man employed in a stable to take care of the horses"], hypernym: ["10663740-n"] },
    "10663740-n": { members: ["ostler", "groom"], definition: ["someone employed in a stable"], hypernym: ["09655706-n"] },
    "09655706-n": { members: ["worker"], definition: ["a person who works at a specific occupation"] },
    "10167455-n": { members: ["groom"], definition: ["a bridegroom"] },
    "10167555-n": { members: ["groom"], definition: ["a person recently married"] },
    "10303761-n": { members: ["maker"], definition: ["a person who makes things"] },
    "09866163-n": { members: ["beekeeper"], definition: ["a person who keeps bees"] },
  };
  return { sourceRows, oewnEntries, oewnSynsets };
}

describe("Albanian occupational-role candidate batch v0.1", () => {
  it("uses suffixes only to discover and deterministically preserves exact source rows and senses", () => {
    expect(albanianSuffixDiscoveryMatchesV0_1("pelar")).toEqual(["-ar"]);
    expect(albanianSuffixDiscoveryMatchesV0_1("thëngjilltar")).toEqual(["-tar", "-ar"]);
    expect(albanianSuffixDiscoveryMatchesV0_1("përkthyes")).toEqual([]);
    expect(albanianSuffixDiscoveryMatchesV0_1("këngëtar")).toEqual(["-tar", "-ar"]);
    const fixtures = fixtureBatch();
    const first = buildAlbanianOccupationalRoleCandidateBatchV0_1(fixtures);
    const second = buildAlbanianOccupationalRoleCandidateBatchV0_1(fixtures);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(first.batch.candidates.map((candidate) => candidate.sourceRecord.lemma)).toEqual(["pelar", "thëngjilltar", "bletar", "jaguar", "bar", "notar"]);
    expect(first.batch.suffixScan.candidateSenseCount).toBe(6);
    expect(first.batch.candidates.every((candidate) => candidate.functionalOperation === null && candidate.productionAuthorization === "NOT_AUTHORIZED")).toBe(true);
    expect(first.suffixDiscoveryInventory.records.map((record) => record.lemma)).toEqual(expect.arrayContaining([
      "pelar", "thëngjilltar", "bletar", "shqiptar", "gjitar", "kombëtar",
    ]));
    expect(first.suffixDiscoveryInventory.records.find((record) => record.lemma === "pelar")?.senses[0]).toMatchObject({
      senseId: "en-pelar-sq-noun-RnBYACSN",
      glosses: ["stableman, ostler, groom (especially mares)"],
      exactOewnGlossTerms: ["stableman", "ostler", "groom"],
    });
    expect(first.suffixDiscoveryInventory.records.some((record) => record.lemma === "foreign-tar")).toBe(false);
  });

  it("keeps pelar's source row, sense, locator, typed OEWN alternatives, and unreviewed projector separate", () => {
    const batch = buildAlbanianOccupationalRoleCandidateBatchV0_1(fixtureBatch());
    const pelar = batch.batch.candidates[0]!;
    expect(pelar.sourceRecordId).toBe("kaikki-albanian-jsonl:word=pelar:ordinal=0");
    expect(pelar.sourceRecordId).not.toBe(pelar.senseId);
    expect(pelar.senseId).toBe("en-pelar-sq-noun-RnBYACSN");
    expect(pelar.sourceRecord.physicalRecordOrdinal).toBe(2);
    expect(pelar.sourceRecord.entryLocator).toBe("jsonl://word/pelar/match/0");
    expect(pelar.sourceDerivedRelations).toMatchObject([{ baseLemma: "pelë", direction: "BASE_RECORD_LISTS_TARGET_AS_DERIVED_FORM" }]);
    expect(pelar.sourceRecord.etymologyLinks).toEqual(expect.arrayContaining([
      expect.objectContaining({ form: "pelë", direction: "TARGET_RECORD_REFERENCES_SOURCE_FORM", resolution: "SOURCE_ROWS_FOUND" }),
      expect.objectContaining({ form: "-ar", direction: "TARGET_RECORD_REFERENCES_SOURCE_FORM", resolution: "SOURCE_ROW_NOT_FOUND" }),
    ]));
    expect(pelar.reasonCodes).toContain("EXISTING_RESEARCH_HYPOTHESIS_RETAINED");
    expect(pelar.reasonCodes).not.toContain("SOURCE_OCCUPATIONS_CATEGORY_ATTESTED");
    expect(pelar.ontology.senses.map((sense) => sense.senseId)).toEqual([
      "groom%1:18:00::", "groom%1:18:01::", "groom%1:18:02::", "ostler%1:18:00::", "stableman%1:18:00::",
    ]);
    expect(pelar.ontology.senses.find((sense) => sense.senseId === "groom%1:18:01::")?.typedHypernymPaths[0]?.map((node) => node.synsetId)).toEqual(["10663740-n", "09655706-n"]);
    expect(pelar.researchHypothesis).toMatchObject({
      hypothesisStatus: "PROPOSED_NOT_REVIEWED",
      reviewTrack: "NONE",
      reviewCandidate: null,
      ownerApproval: null,
      sourceRecordId: pelar.sourceRecordId,
      senseId: pelar.senseId,
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED",
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    });
    expect(pelar.researchHypothesis?.evidenceRefs).toEqual([
      "ze15.albanian.pelar.source.v0_1",
      "ze15.oewn.pelar.occupational-path.v0_1",
    ]);
  });

  it("preserves exact-gloss Null, no IPA, and false-positive POS/category controls", () => {
    const batch = buildAlbanianOccupationalRoleCandidateBatchV0_1(fixtureBatch());
    const coal = batch.batch.candidates.find((candidate) => candidate.sourceRecord.lemma === "thëngjilltar")!;
    const beekeeper = batch.batch.candidates.find((candidate) => candidate.sourceRecord.lemma === "bletar")!;
    expect(coal.ontology).toMatchObject({ exactGlossTerms: ["coal maker"], status: "EXACT_GLOSS_SENSES_NOT_FOUND", senses: [] });
    expect(coal.researchHypothesis).toMatchObject({
      hypothesisStatus: "PROPOSED_NOT_REVIEWED",
      reviewCandidate: null,
      ownerApproval: null,
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED",
    });
    expect(coal.researchHypothesis?.evidenceRefs).toEqual(["ze15.albanian.thengjilltar.source.v0_1"]);
    expect(coal.reasonCodes).not.toContain("SOURCE_OCCUPATIONS_CATEGORY_ATTESTED");
    expect(beekeeper.sourceRecord.pronunciationIpa).toEqual([]);
    expect(beekeeper.reasonCodes).toContain("SOURCE_IPA_NOT_PRESENT");
    expect(beekeeper.reasonCodes).toContain("SOURCE_OCCUPATIONS_CATEGORY_ATTESTED");
    expect(batch.batch.candidates.some((candidate) => ["shqiptar", "gjitar", "gjueti", "kombëtar", "shitës"].includes(candidate.sourceRecord.lemma))).toBe(false);
    expect(batch.suffixDiscoveryInventory.records.some((record) => record.lemma === "gjueti")).toBe(false);
  });

  it("does not resolve foreign or unanchored etymology references to same-spelled Albanian rows", () => {
    const batch = buildAlbanianOccupationalRoleCandidateBatchV0_1(fixtureBatch());
    const jaguar = batch.batch.candidates.find((candidate) => candidate.sourceRecord.lemma === "jaguar")!;
    const bar = batch.batch.candidates.find((candidate) => candidate.sourceRecord.lemma === "bar")!;
    const notar = batch.batch.candidates.find((candidate) => candidate.sourceRecord.lemma === "notar")!;
    expect(jaguar.sourceRecord.etymologyLinks).toEqual([expect.objectContaining({
      form: "jaguar",
      reference: "jaguar#Portuguese",
      resolution: "REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN",
      resolvedSourceRows: [],
    })]);
    expect(bar.sourceRecord.etymologyLinks).toEqual([expect.objectContaining({
      form: "far",
      reference: "far#Latin",
      resolution: "REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN",
      resolvedSourceRows: [],
    })]);
    expect(notar.sourceRecord.etymologyLinks).toEqual([expect.objectContaining({
      form: "far",
      reference: "far",
      resolution: "REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN",
      resolvedSourceRows: [],
    })]);
  });

  it("projects only query-linked candidates and never turns a research candidate into the engine operation", () => {
    const pelë = getAlbanianOccupationalRoleCandidatesForWordV0_1("pelë");
    expect(pelë.status).toBe("CANDIDATES_FOUND");
    expect(pelë.candidates.map((candidate) => candidate.sourceRecord.lemma)).toContain("pelar");
    expect(pelë.candidates.find((candidate) => candidate.sourceRecord.lemma === "pelar")?.functionalOperation).toBeNull();
    expect(getAlbanianOccupationalRoleCandidatesForWordV0_1("peshk")).toMatchObject({ status: "NO_CANDIDATES", candidates: [] });
    expect(getAlbanianOccupationalRoleCandidatesForWordV0_1(null).reasonCodes).toEqual(["QUERY_FORM_UNAVAILABLE"]);
  });
});
