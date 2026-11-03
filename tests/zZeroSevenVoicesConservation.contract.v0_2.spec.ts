import {
  analyzeStructuralInputV0_2,
  discoverStructuralHypothesesV0_2,
} from "@/shared/structuralHypothesisDiscovery.v0_2";

function componentById(
  decomposition: NonNullable<
    ReturnType<typeof discoverStructuralHypothesesV0_2>[number]["losslessDecomposition"]
  >,
  componentId: string,
) {
  return decomposition.components.find(
    (component) => component.componentId === componentId,
  );
}

describe("lossless Seven-Voices structural decomposition v0.2", () => {
  it.each([
    { word: "PLANET", voices: ["A", "E"], positions: [2, 4], hypotheses: ["AN", "ANET"] },
    { word: "PLAN", voices: ["A"], positions: [2], hypotheses: ["AN"] },
    { word: "ET", voices: ["E"], positions: [0], hypotheses: [] },
    { word: "AN", voices: ["A"], positions: [0], hypotheses: [] },
    { word: "ANET", voices: ["A", "E"], positions: [0, 2], hypotheses: [] },
  ])("preserves the complete input event sequence and candidates for $word", ({
    word,
    voices,
    positions,
    hypotheses,
  }) => {
    const analysis = analyzeStructuralInputV0_2(word);

    expect(analysis.analysisStatus).toBe("analyzed");
    expect(analysis.inputVoiceSequenceStatus).toBe("complete");
    expect(analysis.inputVoiceEvents.map((event) => event.voice)).toEqual(voices);
    expect(analysis.inputVoiceEvents.map((event) => event.sourcePosition)).toEqual(positions);
    expect(analysis.hypotheses.map((hypothesis) => hypothesis.embryo)).toEqual(hypotheses);
    expect(discoverStructuralHypothesesV0_2(word).map((hypothesis) => hypothesis.embryo)).toEqual(hypotheses);

    for (const hypothesis of analysis.hypotheses) {
      const decomposition = hypothesis.losslessDecomposition;
      expect(decomposition).toBeDefined();
      expect(decomposition?.inputVoiceEvents.map((event) => event.eventId)).toEqual(
        analysis.inputVoiceEvents.map((event) => event.eventId),
      );
      expect(decomposition?.conservation).toMatchObject({
        status: "complete",
        eventOrderPreserved: true,
        noEventsAdded: true,
        noEventsDropped: true,
        normalizedBasisReconstructed: true,
      });
      expect(decomposition?.reconstructedBasis).toBe(analysis.normalizedBasis);
      expect(decomposition?.pronunciationAuthority).toBe("not_established");
    }
  });

  it("represents PLAN and vowel-bearing ET as ordered components without losing the full path", () => {
    const analysis = analyzeStructuralInputV0_2("PLANET");
    const an = analysis.hypotheses.find((hypothesis) => hypothesis.embryo === "AN");
    const decomposition = an?.losslessDecomposition;

    expect(analysis.inputVoiceEvents.map((event) => event.voice)).toEqual(["A", "E"]);
    expect(an?.expansionChain).toEqual(["AN", "LAN", "PLAN", "PLANET"]);
    expect(analysis.inputVoiceEvents.map((event) => event.mappingSource)).toEqual([
      "math7.core.extractSevenVowelsFromString",
      "math7.core.extractSevenVowelsFromString",
    ]);
    expect(analysis.inputVoiceEvents.map((event) => event.sourceSpan)).toEqual([
      { start: 2, end: 3 },
      { start: 4, end: 5 },
    ]);
    expect(decomposition).toBeDefined();

    const root = decomposition?.components.find(
      (component) => component.componentKind === "whole_input",
    );
    const directComponents = root?.childComponentIds.map((id) =>
      componentById(decomposition!, id),
    );

    expect(directComponents?.map((component) => component?.form)).toEqual(["PLAN", "ET"]);
    expect(directComponents?.map((component) => component?.voiceEvents.map((event) => event.voice))).toEqual([
      ["A"],
      ["E"],
    ]);
    expect(directComponents?.map((component) => component?.sourceSpan)).toEqual([
      { start: 0, end: 4 },
      { start: 4, end: 6 },
    ]);
    expect(decomposition?.terminalComponentIds.map((id) =>
      componentById(decomposition!, id)?.form,
    )).toEqual(["P", "L", "AN", "ET"]);
    expect(decomposition?.reconstructedBasis).toBe("planet");
    expect(decomposition?.conservation.inputEventIds).toEqual([
      "voice-event-1",
      "voice-event-2",
    ]);
    expect(decomposition?.conservation.terminalEventIds).toEqual([
      "voice-event-1",
      "voice-event-2",
    ]);

    for (const component of decomposition?.components ?? []) {
      expect(component.claimBoundary).toBe("structural_component_only");
      expect(component.lexicalAttestation).toBe("not_evaluated");
      expect(component.meaning).toBeNull();
    }
  });

  it("keeps source positions in the original NFC input when normalization removes separators", () => {
    const analysis = analyzeStructuralInputV0_2(" PLAN-ET ");
    const an = analysis.hypotheses.find((hypothesis) => hypothesis.embryo === "AN");

    expect(analysis.inputVoiceEvents.map((event) => event.sourcePosition)).toEqual([3, 6]);
    expect(an?.losslessDecomposition?.components.find(
      (component) => component.componentKind === "whole_input",
    )?.childComponentIds.map((id) => componentById(an.losslessDecomposition!, id)?.sourceSpan)).toEqual([
      { start: 1, end: 5 },
      { start: 6, end: 8 },
    ]);
  });

  it("keeps ANET as a separate alternative and preserves input events when a short form returns Null", () => {
    const planet = analyzeStructuralInputV0_2("PLANET");
    const anet = planet.hypotheses.find((hypothesis) => hypothesis.embryo === "ANET");

    expect(planet.hypotheses.map((hypothesis) => hypothesis.embryo)).toEqual(["AN", "ANET"]);
    expect(anet?.expansionChain).toEqual(["ANET", "LANET", "PLANET"]);
    expect(anet?.losslessDecomposition?.inputVoiceEvents.map((event) => event.voice)).toEqual(["A", "E"]);

    for (const word of ["ET", "AN", "ANET"]) {
      const analysis = analyzeStructuralInputV0_2(word);
      expect(analysis.hypotheses).toEqual([]);
      expect(analysis.inputVoiceSequenceStatus).toBe("complete");
      expect(analysis.inputVoiceEvents.map((event) => event.voice)).toEqual(
        word === "ET" ? ["E"] : word === "AN" ? ["A"] : ["A", "E"],
      );
    }
  });

  it("does not add standard written Ë to the JET proposal or authorize a spoken path", () => {
    const proposedGhegSpelling = analyzeStructuralInputV0_2("JET");
    const standardWrittenForm = analyzeStructuralInputV0_2("JETË");

    expect(proposedGhegSpelling.inputVoiceEvents.map((event) => event.voice)).toEqual(["E"]);
    expect(proposedGhegSpelling.pronunciationAuthority).toBe("not_established");
    expect(proposedGhegSpelling.hypotheses).toEqual([]);

    expect(standardWrittenForm.inputVoiceEvents.map((event) => event.voice)).toEqual(["E", "Ë"]);
    expect(standardWrittenForm.pronunciationAuthority).toBe("not_established");
    expect(standardWrittenForm.hypotheses).toEqual([]);

    expect(analyzeStructuralInputV0_2("xzq")).toMatchObject({
      analysisStatus: "analyzed",
      inputVoiceEvents: [],
      hypotheses: [],
    });

    expect(analyzeStructuralInputV0_2("A".repeat(81))).toMatchObject({
      analysisStatus: "structural_form_too_long",
      inputVoiceSequenceStatus: "not_emitted_form_limit",
      inputVoiceEventCount: null,
      hypotheses: [],
    });
  });

  it("preserves the canonical Seven Voices in their written event order", () => {
    const analysis = analyzeStructuralInputV0_2("AEIOUYË");

    expect(analysis.inputVoiceEvents.map((event) => event.voice)).toEqual([
      "A",
      "E",
      "I",
      "O",
      "U",
      "Y",
      "Ë",
    ]);
    expect(analysis.inputVoiceEvents.map((event) => event.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(analysis.hypotheses).toEqual([]);
  });

  it.each(["dh", "gj", "ll", "nj", "rr", "sh", "th", "xh", "zh"])(
    "segments the Albanian digraph %s as one grapheme with source offsets",
    (digraph) => {
      const analysis = analyzeStructuralInputV0_2(digraph.toLocaleUpperCase("en-US"));

      expect(analysis.inputGraphemes).toMatchObject([
        {
          grapheme: digraph,
          graphemeKind: "digraph",
          basisSpan: { start: 0, end: 2 },
          sourceSpan: { start: 0, end: 2 },
          sourcePositions: [0, 1],
        },
      ]);
    },
  );

  it("keeps Albanian ç as one source-positioned letter", () => {
    const analysis = analyzeStructuralInputV0_2("Ç");

    expect(analysis.analysisStatus).toBe("analyzed");
    expect(analysis.inputGraphemes).toMatchObject([
      {
        grapheme: "ç",
        graphemeKind: "single_letter",
        basisSpan: { start: 0, end: 1 },
        sourceSpan: { start: 0, end: 1 },
      },
    ]);
  });

  it.each([
    { word: "SHKRUAJ", voices: ["U", "A"] },
    { word: "SHKRIM", voices: ["I"] },
    { word: "SHKRONJË", voices: ["O", "Ë"] },
  ])("retains the complete vowel path for $word and rejects reductions through SH/NJ", ({
    word,
    voices,
  }) => {
    const analysis = analyzeStructuralInputV0_2(word);

    expect(analysis.analysisStatus).toBe("analyzed");
    expect(analysis.inputVoiceSequenceStatus).toBe("complete");
    expect(analysis.inputVoiceEvents.map((event) => event.voice)).toEqual(voices);
    expect(analysis.inputVoiceEvents.map((event) => event.order)).toEqual(
      voices.map((_, index) => index + 1),
    );
    expect(analysis.inputGraphemes.map((grapheme) => grapheme.grapheme)).toContain("sh");
    if (word === "SHKRONJË") {
      expect(analysis.inputGraphemes.map((grapheme) => grapheme.grapheme)).toContain("nj");
    }
    expect(analysis.excludedHypotheses.length).toBeGreaterThan(0);
    expect(analysis.excludedHypotheses.every(
      (excluded) => excluded.reasonCode === "albanian_digraph_boundary_split",
    )).toBe(true);

    for (const hypothesis of analysis.hypotheses) {
      const decomposition = hypothesis.losslessDecomposition;
      expect(decomposition.conservation.noDigraphSplit).toBe(true);
      expect(decomposition.conservation.inputEventIds).toEqual(
        decomposition.conservation.terminalEventIds,
      );
      expect(decomposition.conservation.inputGraphemeIds).toEqual(
        decomposition.conservation.terminalGraphemeIds,
      );
    }
  });
});
