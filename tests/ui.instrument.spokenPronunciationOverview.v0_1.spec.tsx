require("./helpers/whatwgGlobals.cjs");

import React from "react";
import { render, screen, within } from "@testing-library/react";
import { GET } from "../app/api/analyze-v1/route";
import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";
import { SpokenPronunciationOverviewCardV0_1 } from "../src/ui/instrument/sections/SpokenPronunciationOverviewCard.v0_1";
import type { TelemetryReadout } from "../src/ui/telemetry/types";

async function analyze(word: string): Promise<any> {
  const response = await GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
  } as any);
  expect(response.status).toBe(200);
  return response.json();
}

describe("spoken pronunciation default Overview surface v0.1", () => {
  it("shows stone pronunciation authority and O to U without opening deterministic details", async () => {
    render(<InstrumentPanel payload={await analyze("stone")} />);

    const overview = screen.getByTestId("spoken-pronunciation-overview");
    expect(overview).toBeVisible();
    expect(within(overview).getByText(/stone: .*OW1/)).toBeVisible();
    expect(within(overview).getByText("open-instrument.cmudict-arpabet-en-us.v0_1")).toBeVisible();
    expect(within(overview).getByText("ARPABET")).toBeVisible();
    const revision = within(overview).getByTestId("spoken-pronunciation-revision");
    expect(revision).toBeVisible();
    expect(revision).toHaveClass("text-[10px]", "text-[#7f8b99]");
    expect(revision.closest("dl")).toBeNull();
    expect(within(revision).getByText("74790861f652b15e4ac49015a90074ad62a27690")).toBeVisible();
    expect(within(overview).getByText("canonical spoken Voice path: O → U")).toBeVisible();
    expect(within(overview).getByText(/Orthographic vowel sequence:.*non-authoritative/i)).toBeVisible();
    expect(screen.getByTestId("deterministic-details")).not.toHaveAttribute("open");
  });

  it("keeps unknown pronunciation Null and exposes its reason by default", async () => {
    render(<InstrumentPanel payload={await analyze("zzzzzz-v0-1-missing")} />);

    const overview = screen.getByTestId("spoken-pronunciation-overview");
    expect(within(overview).getByText("canonical spoken Voice path: Null")).toBeVisible();
    expect(within(overview).getByText("reason: PRONUNCIATION_NOT_FOUND")).toBeVisible();
    expect(within(overview).getByText(/non-authoritative compatibility evidence only/i)).toBeVisible();
  });

  it("does not choose a winner for ambiguous pronunciation variants", () => {
    const readout = {
      word: "different",
      normalizedWord: { kind: "present", value: "different" },
      mode: { kind: "present", value: "strict" },
      strictInput: { kind: "present", value: true },
      engineVersion: { kind: "present", value: "test" },
      alphabet: { kind: "present", value: "auto" },
      createdAt: { kind: "present", value: "2026-10-01T00:00:00.000Z" },
      principlesPath: { kind: "missing", missing: "not_emitted" },
      phoneticIpaV0_1: { kind: "missing", missing: "not_emitted" },
      spokenPronunciation: {
        kind: "present",
        value: {
          status: "null",
          reasonCode: "PRONUNCIATION_VARIANT_AMBIGUOUS",
          normalizedWord: "different",
          sourceProfileId: "open-instrument.cmudict-arpabet-en-us.v0_1",
          sourceNotation: "ARPABET",
          sourceRevision: "test",
          variants: [
            {
              sourceForm: "different",
              sourcePronunciation: "D IH1 F",
              variantId: "different:1",
              variantOrder: 0,
              canonicalVoicePath: ["I"],
              reasonCode: null,
            },
            {
              sourceForm: "different",
              sourcePronunciation: "D EH1 F",
              variantId: "different:2",
              variantOrder: 1,
              canonicalVoicePath: ["E"],
              reasonCode: null,
            },
          ],
        },
      },
      voicePath: { kind: "present", value: [] },
      voicePathSurface: { kind: "present", value: ["I", "E"] },
      voicePathFunctional: { kind: "missing", missing: "not_emitted" },
      voicePathDelta: "NOT_EMITTED",
      status: "none",
      counts: { candidates: 0, ops: { kind: "missing", missing: "not_emitted" }, notes: { kind: "missing", missing: "not_emitted" }, signals: { kind: "missing", missing: "not_emitted" }, rejections: { kind: "missing", missing: "not_emitted" } },
    } as unknown as TelemetryReadout;

    render(<SpokenPronunciationOverviewCardV0_1 readout={readout} />);

    const overview = screen.getByTestId("spoken-pronunciation-overview");
    expect(within(overview).getByText("2 variants unresolved; no winner selected")).toBeVisible();
    expect(within(overview).getByText("canonical spoken Voice path: Null")).toBeVisible();
    expect(within(overview).getByText("reason: PRONUNCIATION_VARIANT_AMBIGUOUS")).toBeVisible();
  });
});
