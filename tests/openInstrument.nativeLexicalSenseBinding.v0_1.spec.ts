import { join, resolve } from "node:path";

import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
} from "@/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1,
} from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";
import {
  bindNativeLexicalTargetSenseV0_1,
  buildNativeLexicalTargetSenseAlternativesV0_1,
  buildNativeLexicalTargetSenseResultV0_1,
} from "@/shared/openInstrument/nativeLexicalSenseBinding.v0_1";

const FIXTURE_ROOT = resolve("tests/fixtures/openInstrument/englishKaikkiDeterministicIndexProvider.v0_1");

async function fixtureProvider() {
  return createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1({
    fixtureRoot: FIXTURE_ROOT,
    sourcePath: join(FIXTURE_ROOT, "source.jsonl"),
    indexPath: FIXTURE_ROOT,
    adaptRecord: (input) => adaptEnglishKaikkiJsonlRecordV0_1({
      ...input,
      verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
    }),
  });
}

describe("native lexical target-sense acquisition and binding v0.1", () => {
  it("preserves exact source records, senses, glosses, categories, identity and research status", async () => {
    const provider = await fixtureProvider();
    const lookup = await provider.queryWithMetrics("APPLE");
    const alternatives = buildNativeLexicalTargetSenseAlternativesV0_1({
      inputForm: "APPLE",
      lookupStatus: lookup.result.status === "MATCHES_FOUND" ? "MATCHES_FOUND" : "UNAVAILABLE",
      sourceRecords: lookup.sourceRecords,
    });

    expect(alternatives.lookupStatus).toBe("MATCHES_FOUND");
    expect(alternatives.alternatives).toHaveLength(3);
    expect(alternatives.alternatives.map((sense) => [sense.sourceForm, sense.partOfSpeech, sense.senseOrdinal])).toEqual([
      ["Apple", "noun", 1],
      ["Apple", "noun", 2],
      ["apple", "verb", 1],
    ]);
    expect(alternatives.alternatives[0]).toMatchObject({
      sourceSenseId: "apple-noun-1",
      glosses: ["A fruit", "A tree bearing the fruit"],
      tags: ["countable"],
      sourceStatus: "research_candidate",
      evidenceClassification: "SOURCE_REPORTED_UNREVIEWED_CANDIDATE",
      sourceRecord: {
        sourceRecordId: expect.stringContaining("jsonl-record-1"),
        entryLocator: expect.stringMatching(/^jsonl:\/\/record\/1;/u),
      },
    });
    expect(alternatives.alternatives[1]?.selectedGlossCandidates).toEqual(["A named fruit"]);
    expect(alternatives.alternatives.every((sense) => sense.sourceStatus === "research_candidate")).toBe(true);
    expect(alternatives.claimBoundary).toContain("not reviewed authority");
  });

  it("does not choose among multiple glosses and binds only a source-exact explicit gloss", async () => {
    const provider = await fixtureProvider();
    const lookup = await provider.queryWithMetrics("apple");
    const alternatives = buildNativeLexicalTargetSenseAlternativesV0_1({
      inputForm: "apple",
      lookupStatus: "MATCHES_FOUND",
      sourceRecords: lookup.sourceRecords,
    });
    const sense = alternatives.alternatives[0];
    if (!sense) throw new Error("fixture sense unavailable");

    const unresolved = bindNativeLexicalTargetSenseV0_1({
      alternatives,
      requestedSenseId: sense.senseId,
    });
    expect(unresolved).toMatchObject({
      status: "SENSE_SELECTED_GLOSS_UNRESOLVED",
      selectedSenseId: sense.senseId,
      selectedGloss: null,
      sourceStatus: "research_candidate",
      userDecisionPosture: "user_decides",
    });

    const bound = bindNativeLexicalTargetSenseV0_1({
      alternatives,
      requestedSenseId: sense.senseId,
      requestedGloss: "A fruit",
    });
    expect(bound).toMatchObject({
      status: "BOUND",
      selectedSenseId: sense.senseId,
      selectedGloss: "A fruit",
      sourceRecordId: sense.sourceRecord.sourceRecordId,
      sourceStatus: "research_candidate",
    });
    expect(buildNativeLexicalTargetSenseResultV0_1(alternatives, bound)).toMatchObject({
      noAutomaticWinner: true,
      userDecisionPosture: "user_decides",
    });
  });

  it("rejects wrong-word sense IDs and source records that do not bind to the exact query", async () => {
    const provider = await fixtureProvider();
    const [appleLookup, bananaLookup] = await Promise.all([
      provider.queryWithMetrics("apple"),
      provider.queryWithMetrics("banana"),
    ]);
    const apple = buildNativeLexicalTargetSenseAlternativesV0_1({
      inputForm: "apple",
      lookupStatus: "MATCHES_FOUND",
      sourceRecords: appleLookup.sourceRecords,
    });
    const bananaSenseId = bananaLookup.sourceRecords?.[0]?.senses[0]?.senseId;
    expect(bananaSenseId).toBeTruthy();
    expect(bindNativeLexicalTargetSenseV0_1({
      alternatives: apple,
      requestedSenseId: bananaSenseId,
    }).status).toBe("SENSE_ID_NOT_FOUND");

    const mismatched = buildNativeLexicalTargetSenseAlternativesV0_1({
      inputForm: "banana",
      lookupStatus: "MATCHES_FOUND",
      sourceRecords: appleLookup.sourceRecords,
    });
    expect(mismatched).toMatchObject({
      lookupStatus: "UNAVAILABLE",
      reasonCode: "SOURCE_RECORD_TARGET_IDENTITY_MISMATCH",
      alternatives: [],
    });
  });

  it("keeps unknown forms and unavailable local sources as Null without inventing alternatives", async () => {
    const provider = await fixtureProvider();
    const miss = await provider.queryWithMetrics("xyz");
    const unknown = buildNativeLexicalTargetSenseAlternativesV0_1({
      inputForm: "xyz",
      lookupStatus: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      sourceRecords: miss.sourceRecords ?? [],
    });
    expect(unknown).toMatchObject({
      lookupStatus: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      alternatives: [],
      sourceStatus: null,
    });
    expect(bindNativeLexicalTargetSenseV0_1({ alternatives: unknown }).status).toBe("NOT_REQUESTED");

    const unavailable = buildNativeLexicalTargetSenseAlternativesV0_1({
      inputForm: "apple",
      lookupStatus: "UNAVAILABLE",
      reasonCode: "INDEX_ARTIFACT_FAILURE",
    });
    expect(bindNativeLexicalTargetSenseV0_1({
      alternatives: unavailable,
      requestedSenseId: "unknown-sense",
    })).toMatchObject({
      status: "SOURCE_LOOKUP_UNAVAILABLE",
      reasonCode: "INDEX_ARTIFACT_FAILURE",
      selectedSenseId: null,
    });
  });
});
