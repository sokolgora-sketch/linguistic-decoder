/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "@/app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import { SpokenPronunciationOverviewCardV0_1 } from "@/ui/instrument/sections/SpokenPronunciationOverviewCard.v0_1";

async function analyze(word: string, alphabet: string): Promise<any> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=${alphabet}&providerExecution=disabled`,
    ),
  );
  expect(response.status).toBe(200);
  return response.json();
}

describe("Albanian pronunciation authority boundary v0.1", () => {
  const originalSourcePath = process.env.OPEN_INSTRUMENT_ALBANIAN_LEXICAL_SOURCE_PATH;

  beforeEach(() => {
    process.env.OPEN_INSTRUMENT_ALBANIAN_LEXICAL_SOURCE_PATH = "";
  });

  afterAll(() => {
    if (originalSourcePath === undefined) {
      delete process.env.OPEN_INSTRUMENT_ALBANIAN_LEXICAL_SOURCE_PATH;
    } else {
      process.env.OPEN_INSTRUMENT_ALBANIAN_LEXICAL_SOURCE_PATH = originalSourcePath;
    }
  });

  it("keeps Albanian source Null while preserving the orthographic surface path", async () => {
    const body = await analyze("mal", "albanian");

    expect(body.motivationDiscoveryV0_2.exactLexicalSourceStatus).toMatchObject({
      status: "UNAVAILABLE",
      reasonCode: "ALBANIAN_SOURCE_PATH_NOT_CONFIGURED",
    });
    expect(body.heartInstrumentV1.surfaceVowels).toEqual(["A"]);
    expect(body.heartInstrumentV1.spokenPronunciation).toMatchObject({
      status: "null",
      reasonCode: "PRONUNCIATION_SOURCE_UNSUPPORTED",
      variants: [],
      canonicalSpokenVoicePath: null,
    });
    expect(body.heartInstrumentV1.spokenPronunciation).not.toHaveProperty(
      "variants.0.variant.sourcePronunciation",
    );
    expect(body.motivationDiscoveryV0_2.derivedStructure).toMatchObject({
      voicePath: ["A"],
      voicePathSource: "albanian_profile",
    });
    expect(body.primaryPath).toBeUndefined();
  });

  it("keeps an explicit pronunciation Null when no English source record exists", async () => {
    const body = await analyze("shqiptarx", "albanian");

    expect(body.heartInstrumentV1.spokenPronunciation).toMatchObject({
      status: "null",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
      canonicalSpokenVoicePath: null,
    });
    expect(body.motivationDiscoveryV0_2.albanianLexicalReading.status).toBe("NULL");
    expect(body.originClaim.interpretationDecisionPolicy.automaticInterpretationSelection).toBe("DISABLED");
    expect(body.originClaim).not.toHaveProperty("policy");
  });

  it("preserves the Albanian Y and E/Ë profile paths through Discovery", async () => {
    const yll = await analyze("yll", "albanian");
    expect(yll.heartInstrumentV1.surfaceVowels).toEqual(["Y"]);
    expect(yll.heartInstrumentV1.spokenPronunciation.status).toBe("null");
    expect(yll.motivationDiscoveryV0_2.derivedStructure.voicePath).toEqual(["Y"]);
    expect(yll.motivationDiscoveryV0_2.derivedStructure.voicePathSource).toBe("albanian_profile");

    const zemer = await analyze("zemër", "albanian");
    expect(zemer.heartInstrumentV1.surfaceVowels).toEqual(["E", "Ë"]);
    expect(zemer.heartInstrumentV1.spokenPronunciation.status).toBe("null");
    expect(zemer.motivationDiscoveryV0_2.derivedStructure.voicePath).toEqual(["E", "Ë"]);
    expect(zemer.motivationDiscoveryV0_2.derivedStructure.voicePathSource).toBe("albanian_profile");
  });

  it.each([
    { word: "ecje", voices: ["E", "E"], positions: [0, 3] },
    { word: "pyet", voices: ["Y", "E"], positions: [1, 2] },
    { word: "mësoj", voices: ["Ë", "O"], positions: [1, 3] },
    { word: "minutë", voices: ["I", "U", "Ë"], positions: [1, 3, 5] },
    { word: "KANDIL", voices: ["A", "I"], positions: [1, 4] },
    { word: "AEIOUYË", voices: ["A", "E", "I", "O", "U", "Y", "Ë"], positions: [0, 1, 2, 3, 4, 5, 6] },
  ])("exposes all original written Voice events separately from the selected path for $word", async ({
    word,
    voices,
    positions,
  }) => {
    const body = await analyze(word, "albanian");
    const derived = body.motivationDiscoveryV0_2.derivedStructure;
    const provenance = derived.voicePathProvenance;

    expect(derived.voicePathSource).toBe("albanian_profile");
    expect(provenance.writtenInput).toMatchObject({
      inputForm: word.normalize("NFC"),
      analysisStatus: "analyzed",
      inputVoiceSequenceStatus: "complete",
      inputVoiceEventCount: voices.length,
      voicePath: voices,
      representationAuthority: "orthographic",
      pronunciationAuthority: "not_established",
    });
    expect(provenance.writtenInput.events.map((event: { voice: string }) => event.voice)).toEqual(voices);
    expect(provenance.writtenInput.events.map((event: { sourcePosition: number }) => event.sourcePosition)).toEqual(positions);
    expect(provenance.writtenInput.events.every((event: { pronunciationAuthority: string }) =>
      event.pronunciationAuthority === "not_established",
    )).toBe(true);
    expect(provenance.selectedPath).toMatchObject({
      voicePath: derived.voicePath,
      selectionKind: "profile_solver_selected",
      legacySource: "albanian_profile",
    });
    expect(provenance.selectedPath.relationshipToWritten).toBe(
      JSON.stringify(derived.voicePath) === JSON.stringify(voices)
        ? "same_sequence"
        : "differs_from_written_sequence",
    );
    expect(body.heartInstrumentV1.spokenPronunciation).toMatchObject({
      status: "null",
      reasonCode: expect.any(String),
      canonicalSpokenVoicePath: null,
    });
  });

  it("retains written events when the API structural hypothesis list is empty", async () => {
    const body = await analyze("AEIOUYË", "albanian");

    expect(body.motivationDiscoveryV0_2.derivedStructure.structuralHypotheses).toEqual([]);
    expect(body.motivationDiscoveryV0_2.derivedStructure.voicePathProvenance.writtenInput.voicePath)
      .toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
  });

  it("preserves CMUdict spoken behavior for the existing non-Albanian mode", async () => {
    const body = await analyze("mal", "auto");

    expect(body.heartInstrumentV1.spokenPronunciation).toMatchObject({
      status: "defined",
      sourceProfileId: "open-instrument.cmudict-arpabet-en-us.v0_1",
      canonicalSpokenVoicePath: ["A"],
    });
    expect(body.heartInstrumentV1.spokenPronunciation.variants[0].variant.sourcePronunciation)
      .toBe("M AE1 L");
    expect(body.primaryPath.voicePath).toEqual(["A"]);
    expect(body.motivationDiscoveryV0_2.derivedStructure.voicePathProvenance).toBeUndefined();
  });

  it("keeps the API Null visible through the telemetry adapter and UI", async () => {
    const vm = adaptAnalysisToTelemetryVM(await analyze("mal", "albanian"));

    expect(vm.readout.spokenPronunciation).toMatchObject({
      kind: "present",
      value: {
        status: "null",
        reasonCode: "PRONUNCIATION_SOURCE_UNSUPPORTED",
        variants: [],
      },
    });

    render(<SpokenPronunciationOverviewCardV0_1 readout={vm.readout} />);
    const overview = screen.getByTestId("spoken-pronunciation-overview");
    expect(within(overview).getByText("Spoken pronunciation unavailable.")).toBeVisible();
    expect(overview).not.toHaveTextContent("M AE1 L");
    expect(overview).toHaveTextContent("Orthographic vowel sequence: A");

    expect(vm.motivationDiscoveryV0_1).toMatchObject({
      kind: "present",
      value: {
        derivedStructure: {
          voicePath: ["A"],
          voicePathSource: "albanian_profile",
        },
      },
    });
    render(<MotivationDiscoveryCardV0_1 discovery={vm.motivationDiscoveryV0_1} />);
    const discoveryCard = screen.getByTestId("motivation-discovery-card");
    expect(within(discoveryCard).getByTestId("motivation-written-voice-path")).toHaveTextContent("A");
    expect(within(discoveryCard).getByTestId("motivation-written-voice-path")).toHaveTextContent(
      "pronunciation not established",
    );
    expect(within(discoveryCard).getByTestId("motivation-selected-voice-path")).toHaveTextContent(
      "SOLVER-SELECTED PATH (PROFILE DERIVED)",
    );
    expect(within(discoveryCard).getByTestId("motivation-selected-voice-path")).toHaveTextContent(
      "source: albanian_profile",
    );
  });
});
