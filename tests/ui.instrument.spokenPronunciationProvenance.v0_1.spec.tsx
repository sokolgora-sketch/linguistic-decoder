require("./helpers/whatwgGlobals.cjs");

import React from "react";
import { render, screen } from "@testing-library/react";
import { ReadoutCard } from "../src/ui/instrument/sections/ReadoutCard";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";

async function analyze(word: string): Promise<any> {
  const { GET } = require("../app/api/analyze-v1/route");
  const response = await GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
  } as any);
  expect(response.status).toBe(200);
  return response.json();
}

describe("spoken pronunciation provenance surface v0.1", () => {
  it("exposes the existing CMUdict authority beside the canonical spoken path", async () => {
    const vm = adaptAnalysisToTelemetryVM(await analyze("stone"));

    expect(vm.readout.spokenPronunciation).toMatchObject({
      kind: "present",
      value: {
        status: "defined",
        sourceProfileId: "open-instrument.cmudict-arpabet-en-us.v0_1",
        sourceNotation: "ARPABET",
        variants: [
          expect.objectContaining({
            sourceForm: "stone",
            canonicalVoicePath: ["O", "U"],
          }),
        ],
      },
    });

    render(
      <ReadoutCard
        readout={vm.readout}
        onCopySummary={() => void 0}
      />
    );

    expect(screen.getByTestId("spoken-pronunciation-provenance")).toBeInTheDocument();
    expect(screen.getByText("Spoken pronunciation authority")).toBeInTheDocument();
    expect(screen.getByText("source profile: open-instrument.cmudict-arpabet-en-us.v0_1")).toBeInTheDocument();
    expect(screen.getByText("notation: ARPABET")).toBeInTheDocument();
    expect(screen.getByText("variant status: single variant accepted")).toBeInTheDocument();
    expect(screen.getByText(/stone: .*OW1/)).toBeInTheDocument();
    expect(screen.getByText("spoken path: O → U")).toBeInTheDocument();
    expect(screen.getByText(/Orthographic vowels remain separate compatibility evidence/i)).toBeInTheDocument();
  });

  it("keeps unknown pronunciation Null while retaining orthography as non-authoritative evidence", async () => {
    const vm = adaptAnalysisToTelemetryVM(await analyze("zzzzzz-v0-1-missing"));

    expect(vm.readout.spokenPronunciation).toMatchObject({
      kind: "present",
      value: {
        status: "null",
        reasonCode: "PRONUNCIATION_NOT_FOUND",
        variants: [],
      },
    });

    render(
      <ReadoutCard
        readout={vm.readout}
        onCopySummary={() => void 0}
      />
    );

    expect(screen.getByText("variant status: no pronunciation variant")).toBeInTheDocument();
    expect(screen.getByText("spoken path: Null (PRONUNCIATION_NOT_FOUND)")).toBeInTheDocument();
    expect(screen.getByText(/Orthographic vowel sequence \(non-authoritative\)/i)).toBeInTheDocument();
  });
});
