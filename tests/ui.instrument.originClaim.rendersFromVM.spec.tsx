import React from "react";
import { render, screen } from "@testing-library/react";
import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

describe("ui: InstrumentPanel renders Origin Claim from VM", () => {
  test("shows Origin Claim card when originClaim exists", () => {
    // Minimal payload: contractAdapter will adapt it; vm.raw should preserve originClaim
    const payload: any = {
      word: "study",
      engineVersion: "test",
      mode: "strict",
      originClaim: {
        version: "v1",
        policy: "no_single_winner",
        candidates: [
          {
            id: "oc:la:studium",
            language: "la",
            form: "studium",
            status: "pass",
            confidence: "weak",
            reasons: ["Candidate marked pass by engine candidate layer."],
            evidenceRefs: ["candidates[la:studium]"],
          },
        ],
        summary: { confidence: "weak", note: "test" },
        meta: { engineVersion: "test", generatedAt: "2026-01-01T00:00:00.000Z", inputs: { word: "study", mode: "strict", alphabet: null } },
      },
      // Provide minimal readout scaffolding so ReadoutCard doesn't crash if adapter expects it.
      heart: { math7: { primary: { mode: "strict", word: "study", vowels: ["U","Y"], counts: { A:0,E:0,I:0,O:0,U:1,Y:1,"Ë":0 } } } },
      candidates: [],
      deepRoot: null,
      languageFamilies: null,
      evidence: { math7: { primary: { mode: "strict", word: "study", vowels: ["U","Y"], counts: { A:0,E:0,I:0,O:0,U:1,Y:1,"Ë":0 } } } },
      raw: { evidence: {} },
    };

    render(<InstrumentPanel payload={payload} />);

    expect(screen.getByText("Origin Claim")).toBeInTheDocument();
    expect(screen.getByText(/no_single_winner/i)).toBeInTheDocument();
  });
});
