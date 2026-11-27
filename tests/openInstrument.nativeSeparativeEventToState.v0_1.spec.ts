import {
  ALBANET_SOURCE_FILE_BYTES_V0_1,
  ALBANET_SOURCE_FILE_RELATIVE_PATH_V0_1,
  ALBANET_SOURCE_FILE_SHA256_V0_1,
  ALBANET_SOURCE_FAMILY_ID_V0_1,
  ALBANET_SOURCE_REVISION_V0_1,
} from "@/shared/openInstrument/albanetSourceIdentity.v0_1";
import { canonicalOperatorProfilesV0_1 } from "@/shared/canonicalOperatorProfile.v0_1";
import { reviewedExternalLexiconSourceRowCandidateRegistryV0_1 } from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { buildNativeSeparativeEventToStateV0_1 } from "@/shared/openInstrument/nativeSeparativeEventToState.v0_1";

const sourceIdentity = {
  sourceFamilyId: ALBANET_SOURCE_FAMILY_ID_V0_1,
  revision: ALBANET_SOURCE_REVISION_V0_1,
  sha256: ALBANET_SOURCE_FILE_SHA256_V0_1,
  bytes: ALBANET_SOURCE_FILE_BYTES_V0_1,
};

function targetSense(synsetId: string, definition: string, lemma = "ndarje") {
  const encodedLemma = encodeURIComponent(lemma);
  return {
    sourceRecordId: `${ALBANET_SOURCE_FAMILY_ID_V0_1}:${synsetId}:lemma=${encodedLemma}`,
    synsetId,
    lemma,
    definitions: [definition],
    examples: [],
    entryLocator:
      `${ALBANET_SOURCE_FILE_RELATIVE_PATH_V0_1}#synset=${synsetId};lemma=${encodedLemma}`,
    sourceStatus: "SOURCE_REPORTED_UNREVIEWED_RESEARCH_CANDIDATE" as const,
  };
}

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
].map(([synsetId, definition]) => targetSense(synsetId, definition));

function withAlternativeSeparativeEmbryo<T>(run: () => T): T {
  const daSourceId = "reviewed.external.gheg-da.damage.candidate.v0_1";
  const daProfile = canonicalOperatorProfilesV0_1.find((profile) => profile.sourceId === daSourceId);
  const daRow = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find((row) =>
    row.sourceId === daSourceId,
  );
  if (!daProfile || !daRow) throw new Error("Expected reviewed DA profile and source row");

  const alternateSourceId = "test.only.separative.divide.candidate.v0_1";
  const alternateProfile = {
    ...daProfile,
    operatorId: "TEST-DIVIDE",
    embryo: "DIVIDE-TEST",
    sourceId: alternateSourceId,
  };
  const alternateRow = {
    ...daRow,
    sourceId: alternateSourceId,
    plainStandaloneGloss: "divide",
    externalCitations: daRow.externalCitations.map((citation) => ({
      ...citation,
      citationId: "test.only.separative.divide.citation.v0_1",
      sourceTitle: "Test-only separative candidate",
      sourceUrlOrArchiveRef: "https://example.invalid/test-only-separative-candidate",
      entryLocator: "test-only fixture",
      attestedForm: "DIVIDE-TEST",
      attestedGloss: "divide",
    })),
  };
  const mutableProfiles = canonicalOperatorProfilesV0_1 as unknown as unknown[];
  const mutableRows = reviewedExternalLexiconSourceRowCandidateRegistryV0_1 as unknown as unknown[];
  mutableProfiles.push(alternateProfile);
  mutableRows.push(alternateRow);
  try {
    return run();
  } finally {
    mutableRows.pop();
    mutableProfiles.pop();
  }
}

describe("native separative event-to-state reasoning", () => {
  it("preserves nine exact senses and builds only compatible source-grounded hypotheses", () => {
    const reading = withAlternativeSeparativeEmbryo(() =>
      buildNativeSeparativeEventToStateV0_1({ inputForm: "NDARJE", sourceIdentity, targetSenses }),
    );
    expect(reading).toMatchObject({
      origin: "NATIVE_GENERATED",
      operation: "SEPARATIVE_EVENT_TO_STATE",
      inputForm: "NDARJE",
      voiceBasis: "ORTHOGRAPHIC_ONLY",
      interpretationDecisionPolicy: { automaticInterpretationSelection: "DISABLED" },
      userDecisionPosture: "user_decides",
      historicalOriginClaim: "NOT_CLAIMED",
    });
    const distinctSourceSenses = new Set(reading?.alternatives.map((alternative) =>
      alternative.target.sourceRecordId,
    ));
    expect(distinctSourceSenses.size).toBe(9);
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
      action: { status: "UNKNOWN_OR_NULL", text: null },
      patient: { role: "UNKNOWN_OR_NULL", description: { status: "UNKNOWN_OR_NULL", text: null } },
      initialState: { status: "UNKNOWN_OR_NULL", text: null },
      changedState: { status: "UNKNOWN_OR_NULL", text: null },
      wholeWordMeaning: { status: "SOURCE_REPORTED", text: "një distribucion në përhapje" },
      explanation: null,
      claimStatus: "UNKNOWN_OR_NULL",
    });
    for (const target of targetSenses.filter((candidate) =>
      compatible.some((alternative) => alternative.target.synsetId === candidate.synsetId),
    )) {
      expect(compatible.filter((alternative) => alternative.target.synsetId === target.synsetId)
        .map((alternative) => alternative.functionalEmbryo?.sourceId))
        .toEqual([
          "reviewed.external.gheg-da.damage.candidate.v0_1",
          "test.only.separative.divide.candidate.v0_1",
        ]);
    }
    expect(reading?.writtenVoices).toEqual([
      { voice: "A", position: 2 },
      { voice: "E", position: 5 },
    ]);
  });

  it("does not transfer the operation to an unrelated target meaning", () => {
    const reading = buildNativeSeparativeEventToStateV0_1({
      inputForm: "SHTËPI",
      sourceIdentity,
      targetSenses: [targetSense("fixture-n", "shtëpi, ndërtesë për banim", "shtëpi")],
    });
    expect(reading).toBeNull();
  });

  it.each([
    ["normalized target lemma", (target: (typeof targetSenses)[number]) => ({ ...target, lemma: "ndarje tjetër" })],
    ["canonical source record ID", (target: (typeof targetSenses)[number]) => ({ ...target, sourceRecordId: "albanet:wrong:lemma=ndarje" })],
    ["canonical locator", (target: (typeof targetSenses)[number]) => ({ ...target, entryLocator: "wrong/path#synset=00383606-n;lemma=ndarje" })],
    ["synset identity", (target: (typeof targetSenses)[number]) => ({ ...target, synsetId: "00397953-n" })],
  ])("rejects mismatched %s", (_label, mutate) => {
    expect(buildNativeSeparativeEventToStateV0_1({
      inputForm: "NDARJE",
      sourceIdentity,
      targetSenses: [mutate(targetSenses[1])],
    })).toBeNull();
  });

  it("rejects duplicate AlbaNet records", () => {
    expect(buildNativeSeparativeEventToStateV0_1({
      inputForm: "NDARJE",
      sourceIdentity,
      targetSenses: [targetSenses[1], targetSenses[1]],
    })).toBeNull();
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
