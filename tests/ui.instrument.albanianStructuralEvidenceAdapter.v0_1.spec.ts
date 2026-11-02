import { adaptAlbanianStructuralEvidenceToVMV0_1 } from "@/ui/instrument/albanianStructuralEvidenceAdapter.v0_1";

describe("Albanian structural evidence view adapter v0.1", () => {
  it.each([
    {
      word: "PLANET",
      left: "PLAN",
      right: "ET",
      leftVoices: ["A"],
      rightVoices: ["E"],
      leftSpan: { start: 0, end: 4 },
      rightSpan: { start: 4, end: 6 },
      boundary: "STRUCTURAL_ONLY",
    },
    {
      word: "SHKRUAJ",
      left: "SHKRU",
      right: "AJ",
      leftVoices: ["U"],
      rightVoices: ["A"],
      leftSpan: { start: 0, end: 5 },
      rightSpan: { start: 5, end: 7 },
      boundary: "MISMATCH",
    },
    {
      word: "SHKRIM",
      left: "SHKR",
      right: "IM",
      leftVoices: [],
      rightVoices: ["I"],
      leftSpan: { start: 0, end: 4 },
      rightSpan: { start: 4, end: 6 },
      boundary: "SOURCE_SUPPORTED",
    },
    {
      word: "SHKRONJË",
      left: "SHKR",
      right: "ONJË",
      leftVoices: [],
      rightVoices: ["O", "Ë"],
      leftSpan: { start: 0, end: 4 },
      rightSpan: { start: 4, end: 8 },
      boundary: "SOURCE_SUPPORTED",
    },
  ])("keeps the whole source Voice path and compares the $word boundary", (expected) => {
    const evidence = adaptAlbanianStructuralEvidenceToVMV0_1(expected.word);
    expect(evidence).not.toBeNull();
    if (!evidence) return;

    expect(evidence.surfacePartition.left.form).toBe(expected.left);
    expect(evidence.surfacePartition.right.form).toBe(expected.right);
    expect(evidence.surfacePartition.left.voiceEvents.map((event) => event.voice)).toEqual(expected.leftVoices);
    expect(evidence.surfacePartition.right.voiceEvents.map((event) => event.voice)).toEqual(expected.rightVoices);
    expect(evidence.surfacePartition.left.sourceSpan).toEqual(expected.leftSpan);
    expect(evidence.surfacePartition.right.sourceSpan).toEqual(expected.rightSpan);
    expect(evidence.analysis.inputVoiceEvents.map((event) => event.voice)).toEqual([
      ...expected.leftVoices,
      ...expected.rightVoices,
    ]);
    expect(evidence.surfacePartition.reconstructedForm).toBe(expected.word.toLocaleLowerCase("en-US"));
    expect(evidence.surfacePartition.eventIdsInOrder).toEqual(
      evidence.analysis.inputVoiceEvents.map((event) => event.eventId),
    );
    expect(evidence.boundaryComparison.classification).toBe(expected.boundary);
    expect(evidence.boundaryComparison.exactTargetSenseAlignment).toBe("UNKNOWN");
    expect(evidence.sourceRecord.sourceRecordId).toContain("kaikki-albanian-jsonl:");
    expect(evidence.sourceIdentity.sha256).toBe(
      "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
    );
  });

  it("keeps the user Gheg proposal separate from the source-written JETË record", () => {
    const evidence = adaptAlbanianStructuralEvidenceToVMV0_1("planet");

    expect(evidence?.ghegProposal).toMatchObject({
      userProposedStatement: "PLAN + JET → PLANET",
      proposedForm: "JET",
      proposalStatus: "USER_HYPOTHESIS",
      sourceAttestationStatus: "UNKNOWN",
      sourceBoundaryStatus: "UNKNOWN",
      proposedOrthographicVoicePath: ["E"],
      sourceHeadwordForm: "JETË",
      sourceRegister: "not_marked_by_headword_record",
      bareJetFormInThisNounRecord: false,
      sourceOrthographicVoicePath: ["E", "Ë"],
      pronunciationAuthority: "not_established",
      historicalDerivation: "not_claimed",
    });
    expect(evidence?.ghegProposal?.sourceHeadwordRecordId).toBe(
      "kaikki-albanian-jsonl:word=jet%C3%AB:ordinal=0",
    );
  });

  it("returns Null outside the bounded exact-record scope", () => {
    expect(adaptAlbanianStructuralEvidenceToVMV0_1("shkruon")).toBeNull();
  });
});
