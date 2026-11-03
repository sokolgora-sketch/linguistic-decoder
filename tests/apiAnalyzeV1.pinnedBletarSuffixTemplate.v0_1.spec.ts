import { POST } from "@/app/api/analyze-v1/route";
import { ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";

const pinnedSourceTestV0_1 = process.env[ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1]
  ? it
  : it.skip;

describe("pinned BLETAR suffix-template API reading v0.1", () => {
  pinnedSourceTestV0_1("returns the exact source-backed exploratory AGENT reading for BLETAR", async () => {
    const response = await POST(new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        word: "bletar",
        language: "sq",
        alphabet: "albanian",
        providerExecution: "disabled",
      }),
    }));

    expect(response.status).toBe(200);
    const body = await response.json();
    const reading = body.motivationDiscoveryV0_1?.albanianLexicalReading;
    expect(reading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId: "kaikki-albanian-jsonl:word=bletar:ordinal=0",
        form: "bletar",
        partOfSpeech: "noun",
        meaningGlosses: ["beekeeper"],
      },
      functionalMeaningBridge: {
        sourceFacts: {
          primary: expect.objectContaining({
            sourceRecordId: "kaikki-albanian-jsonl:word=bletar:ordinal=0",
            entryLocator: "jsonl://word/bletar/match/0",
            form: "bletar",
            sourceSenses: [expect.objectContaining({
              senseId: "en-bletar-sq-noun-KI12VIJ3",
              glosses: ["beekeeper"],
              categories: expect.arrayContaining([expect.objectContaining({
                name: "Occupations",
                orig: "sq:Occupations",
                langcode: "sq",
                source: "w",
              })]),
            })],
          }),
        },
        status: "SUPPORTED",
        derivedStructure: null,
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: "AGENT",
          basis: expect.arrayContaining([
            "TARGET_SOURCE_AUTHORED_SUFFIX_TEMPLATE",
            "SOURCE_ATTESTED_FINAL_SENSE_CATEGORY",
          ]),
        },
      },
      interpretation: {
        status: "EXPLORATORY_ZHEJI_READING",
        basis: expect.arrayContaining(["STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL"]),
      },
    });
    expect(reading.functionalMeaningBridge.functionalHypothesis.statement)
      .toContain("en-bletar-sq-noun-KI12VIJ3");
    expect(reading.functionalMeaningBridge.functionalHypothesis.claimBoundary)
      .toContain("No target-to-base sense alignment");
    expect(reading.functionalMeaningBridge.functionalHypothesis.claimBoundary)
      .toContain("historical etymology, suffix semantics, embryo function, or pronunciation semantics is asserted");
    expect(reading.functionalMeaningBridge.claimBoundary)
      .toContain("IPA and Voice are not used to classify the role");
  });
});
