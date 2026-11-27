import {
  ALBANET_SOURCE_FILE_BYTES_V0_1,
  ALBANET_SOURCE_FILE_SHA256_V0_1,
  ALBANET_SOURCE_FAMILY_ID_V0_1,
  ALBANET_SOURCE_REVISION_V0_1,
} from "@/shared/openInstrument/albanetSourceIdentity.v0_1";
import { buildNativeSeparativeEventToStateV0_1 } from "@/shared/openInstrument/nativeSeparativeEventToState.v0_1";

const sourceIdentity = {
  sourceFamilyId: ALBANET_SOURCE_FAMILY_ID_V0_1,
  revision: ALBANET_SOURCE_REVISION_V0_1,
  sha256: ALBANET_SOURCE_FILE_SHA256_V0_1,
  bytes: ALBANET_SOURCE_FILE_BYTES_V0_1,
};

const targetSenses = [
  ["00053097-n", "mënyrë e shmangies me politesë"],
  ["00383606-n", "veprimi i veçimit apo i shqitjes"],
  ["00397953-n", "veprimi i ndarjes në particione; ndarje si rezultat i krijimit të kufijve ndarës"],
  ["01085793-n", "një distribucion në përhapje"],
  ["02030158-v", "shkoj larg asaj ; lëviz një pjesë"],
  ["05083328-n", "pjesë toke e cila posedohet nga rreshta me gjëra të ndryshme"],
  ["05867413-n", "ajo që i bie dikujt kur ndahet një trashëgim"],
  ["09258715-n", "një vend i gjatë i hapur"],
  ["09410928-n", "një hapje e diçkaje me forcë si një zbërthim"],
].map(([synsetId, definition]) => ({
  sourceRecordId: `albanet:${synsetId}:lemma=ndarje`,
  synsetId,
  lemma: "ndarje",
  definitions: [definition],
  examples: [],
  entryLocator: `wns/als/wn-data-als.tab#synset=${synsetId};lemma=ndarje`,
  sourceStatus: "SOURCE_REPORTED_UNREVIEWED_RESEARCH_CANDIDATE" as const,
}));

describe("native separative event-to-state reasoning", () => {
  it("preserves nine exact senses and builds only compatible source-grounded hypotheses", () => {
    const reading = buildNativeSeparativeEventToStateV0_1({ inputForm: "NDARJE", sourceIdentity, targetSenses });
    expect(reading).toMatchObject({
      origin: "NATIVE_GENERATED",
      operation: "SEPARATIVE_EVENT_TO_STATE",
      inputForm: "NDARJE",
      voiceBasis: "ORTHOGRAPHIC_ONLY",
      interpretationDecisionPolicy: { automaticInterpretationSelection: "DISABLED" },
      userDecisionPosture: "user_decides",
      historicalOriginClaim: "NOT_CLAIMED",
    });
    expect(reading?.alternatives).toHaveLength(9);
    const compatible = reading?.alternatives.filter((alternative) =>
      alternative.compatibility === "COMPATIBLE_FUNCTION_FAMILY",
    ) ?? [];
    expect(compatible.length).toBeGreaterThan(0);
    expect(compatible).toEqual(expect.arrayContaining([
      expect.objectContaining({ target: expect.objectContaining({ synsetId: "00383606-n" }) }),
      expect.objectContaining({ target: expect.objectContaining({ synsetId: "00397953-n" }) }),
    ]));
    expect(compatible[0]).toMatchObject({
      functionalEmbryo: {
        form: "DA",
        sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
      },
      action: { status: "SOURCE_REPORTED", text: "to split, cut, divide" },
      patient: {
        role: "AFFECTED_ENTITY",
        description: { status: "INFERRED", text: "an initially undivided whole" },
        identity: { status: "UNKNOWN_OR_NULL", text: null },
      },
      initialState: { status: "INFERRED", text: "one undivided whole" },
      changedState: { status: "INFERRED", text: "distinct parts or separated entities" },
      wholeWordMeaning: { status: "SOURCE_REPORTED" },
      claimStatus: "EXPLORATORY_HYPOTHESIS",
    });
    expect(reading?.alternatives.find((alternative) =>
      alternative.target.synsetId === "01085793-n",
    )).toMatchObject({
      compatibility: "NO_COMPATIBLE_FUNCTION_CUE",
      functionalEmbryo: null,
      explanation: null,
    });
    expect(reading?.writtenVoices).toEqual([
      { voice: "A", position: 2 },
      { voice: "E", position: 5 },
    ]);
  });

  it("does not transfer the operation to an unrelated target meaning", () => {
    const reading = buildNativeSeparativeEventToStateV0_1({
      inputForm: "SHTËPI",
      sourceIdentity,
      targetSenses: [{
        sourceRecordId: "albanet:fixture:lemma=shtëpi",
        synsetId: "fixture-n",
        lemma: "shtëpi",
        definitions: ["shtëpi, ndërtesë për banim"],
        examples: [],
        entryLocator: "fixture#synset=fixture-n;lemma=shtëpi",
        sourceStatus: "SOURCE_REPORTED_UNREVIEWED_RESEARCH_CANDIDATE",
      }],
    });
    expect(reading?.alternatives[0]).toMatchObject({
      compatibility: "NO_COMPATIBLE_FUNCTION_CUE",
      functionalEmbryo: null,
      initialState: { status: "UNKNOWN_OR_NULL", text: null },
      changedState: { status: "UNKNOWN_OR_NULL", text: null },
    });
  });

  it("is deterministic and fails closed on source identity mismatch", () => {
    const input = { inputForm: "NDARJE", sourceIdentity, targetSenses };
    expect(buildNativeSeparativeEventToStateV0_1(input)).toEqual(
      buildNativeSeparativeEventToStateV0_1(input),
    );
    expect(buildNativeSeparativeEventToStateV0_1({
      ...input,
      sourceIdentity: { ...sourceIdentity, sha256: "0".repeat(64) },
    })).toBeNull();
  });
});
