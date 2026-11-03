import { adaptAlbanianStructuralEvidenceToVMV0_1 } from "@/ui/instrument/albanianStructuralEvidenceAdapter.v0_1";

describe("bounded orthographic structural evidence view adapter v0.1", () => {
  it.each([
    { word: "PLANET", voices: ["A", "E"], boundary: null },
    { word: "SHKRUAJ", voices: ["U", "A"], boundary: 2 },
    { word: "SHKRIM", voices: ["I"], boundary: 4 },
    { word: "SHKRONJË", voices: ["O", "Ë"], boundary: 4 },
  ])("keeps complete events and optional reference evidence for $word", (expected) => {
    const evidence = adaptAlbanianStructuralEvidenceToVMV0_1(expected.word);
    expect(evidence).not.toBeNull();
    if (!evidence) return;

    expect(evidence.analysis.analysisStatus).toBe("analyzed");
    expect(evidence.analysis.inputVoiceEvents.map((event) => event.voice)).toEqual(expected.voices);
    expect(evidence.analysis.inputVoiceEvents.map((event) => event.order)).toEqual(
      expected.voices.map((_, index) => index + 1),
    );
    expect(evidence.analysis.inputVoiceSequenceStatus).toBe("complete");
    expect(evidence.lexicalIdentity).toBe("not_inferred_from_form");
    expect(evidence.pronunciationAuthority).toBe("not_established");

    expect(evidence.sourceReference?.status).toBe("SAME_FORM_SOURCE_REFERENCE");
    expect(evidence.sourceReference?.exactTargetSenseAlignment).toBe("UNKNOWN");
    expect(evidence.sourceReference?.sourceIdentity.sha256).toBe(
      "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
    );
    expect(evidence.sourceReference?.engineReductionComparison.sourceBoundaryCodePointOffset)
      .toBe(expected.boundary);
  });

  it.each([
    { word: "SHKRIM", segmentation: ["SHKR", "IM"], offset: 4 },
    { word: "SHKRONJË", segmentation: ["SHKR", "ONJË"], offset: 4 },
  ])("separates source surface segmentation from actual engine agreement for $word", ({
    word,
    segmentation,
    offset,
  }) => {
    const evidence = adaptAlbanianStructuralEvidenceToVMV0_1(word);
    const reference = evidence?.sourceReference;

    expect(reference?.sourceSurfaceSegmentation).toMatchObject({
      status: "SOURCE_REPORTED",
      kind: "suffix",
      boundaryCodePointOffset: offset,
      sourceBaseSurfaceAlignment: "UNKNOWN",
    });
    expect([
      reference?.sourceSurfaceSegmentation?.left?.form,
      reference?.sourceSurfaceSegmentation?.right?.form,
    ]).toEqual(segmentation);
    expect(reference?.engineReductionComparison).toEqual({
      status: "NO_MATCHING_REDUCTION",
      sourceBoundaryCodePointOffset: offset,
      engineBoundaryCodePointOffsets: [],
    });
    expect(reference?.exactTargetSenseAlignment).toBe("UNKNOWN");
  });

  it("exposes generic bounded analysis for BLETAR without inventing source evidence", () => {
    const evidence = adaptAlbanianStructuralEvidenceToVMV0_1("BLETAR");

    expect(evidence).not.toBeNull();
    expect(evidence?.analysis.analysisStatus).toBe("analyzed");
    expect(evidence?.analysis.inputVoiceEvents.map((event) => event.voice)).toEqual(["E", "A"]);
    expect(evidence?.analysis.inputGraphemes.map((grapheme) => grapheme.grapheme)).toEqual(
      ["b", "l", "e", "t", "a", "r"],
    );
    expect(evidence?.sourceReference).toBeNull();
    expect(evidence?.lexicalIdentity).toBe("not_inferred_from_form");
  });

  it("does not attach a pinned reference to punctuation-normalized spelling", () => {
    const evidence = adaptAlbanianStructuralEvidenceToVMV0_1("PLANET!");

    expect(evidence).not.toBeNull();
    expect(evidence?.analysis.analysisStatus).toBe("analyzed");
    expect(evidence?.sourceReference).toBeNull();
  });

  it("returns Null for unsupported forms", () => {
    expect(adaptAlbanianStructuralEvidenceToVMV0_1("Résumé")).toBeNull();
    expect(adaptAlbanianStructuralEvidenceToVMV0_1("漢字")).toBeNull();
  });
});
