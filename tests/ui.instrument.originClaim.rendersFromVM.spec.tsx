import React from "react";
import { render, screen, within } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

function findNearestAncestorWithText(
  start: HTMLElement,
  re: RegExp
): HTMLElement | null {
  let el: HTMLElement | null = start;
  while (el) {
    if (re.test(el.textContent ?? "")) return el;
    el = el.parentElement;
  }
  return null;
}

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
        meta: {
          engineVersion: "test",
          generatedAt: "2026-01-01T00:00:00.000Z",
          inputs: { word: "study", mode: "strict", alphabet: null },
        },
      },
      // Provide minimal readout scaffolding so ReadoutCard doesn't crash if adapter expects it.
      heart: {
        math7: {
          primary: {
            mode: "strict",
            word: "study",
            vowels: ["U", "Y"],
            counts: { A: 0, E: 0, I: 0, O: 0, U: 1, Y: 1, "Ë": 0 },
          },
        },
      },
      candidates: [],
      deepRoot: null,
      languageFamilies: null,
      evidence: {
        math7: {
          primary: {
            mode: "strict",
            word: "study",
            vowels: ["U", "Y"],
            counts: { A: 0, E: 0, I: 0, O: 0, U: 1, Y: 1, "Ë": 0 },
          },
        },
      },
      raw: { evidence: {} },
    };

    render(<InstrumentPanel payload={payload} />);

    const title = screen.getByText("Origin Claim");
    expect(title).toBeInTheDocument();

    // Raw JSON may preserve the contract token; the visible Origin Claim card should use reader-facing copy.
    const cardRoot = findNearestAncestorWithText(title as HTMLElement, /no forced answer/i);
    expect(cardRoot).toBeTruthy();

    expect(within(cardRoot as HTMLElement).getByText(/no forced answer/i)).toBeInTheDocument();
    expect((cardRoot as HTMLElement).textContent).not.toContain("no_single_winner");
  });
});
