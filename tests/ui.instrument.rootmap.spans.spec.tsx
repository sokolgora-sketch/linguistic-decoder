import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

// RootMapCard is the unit under test for spans rendering
import { RootMapCard } from "../src/ui/instrument/RootMapCard";

type Present<T> = { kind: "present"; value: T };
type Missing = { kind: "missing"; missing: "not_emitted" | "malformed" | "unknown"; note?: string };
type Maybe<T> = Present<T> | Missing;

function present<T>(value: T): Present<T> {
  return { kind: "present", value };
}

describe("RootMap spans highlight gate v0.1.5", () => {
  const word = "study";
  const normalizedWord = "study";

  function baseRootMap(spans: any[]): any {
    return {
      tokens: [],
      keys: [],
      carriers: [],
      spans,
    };
  }

  it("PRESENT: renders at least one <mark> highlight and includes expected substring", () => {
    const rm: Maybe<any> = present(
      baseRootMap([
        { token: "stu", start: 0, end: 3, note: "carrier" }, // "stu"
      ])
    );

    const { container } = render(
      <RootMapCard rootMap={rm as any} word={word} normalizedWord={normalizedWord} />
    );

    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThan(0);
    expect(screen.getByText("stu")).toBeTruthy();
  });

  it("NONE: when spans empty, shows NONE note and renders no <mark>", () => {
    const rm: Maybe<any> = present(baseRootMap([]));

    const { container } = render(
      <RootMapCard rootMap={rm as any} word={word} normalizedWord={normalizedWord} />
    );

    expect(screen.getByText("Map status: needs review")).toBeVisible();
    const technicalStatus = screen.getByText("Technical status");
    expect(technicalStatus.closest("details")).not.toHaveAttribute("open");
    expect(technicalStatus.closest("details")).toHaveTextContent("NONE");
    fireEvent.click(technicalStatus);
    expect(technicalStatus.closest("details")).toHaveAttribute("open");
    expect(screen.getByText(/no spans were provided/i)).toBeTruthy();

    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBe(0);
  });

  it("MALFORMED: invalid bounds shows MALFORMED note and renders no <mark>", () => {
    const rm: Maybe<any> = present(
      baseRootMap([
        { token: "bad", start: -1, end: 2 }, // invalid
      ])
    );

    const { container } = render(
      <RootMapCard rootMap={rm as any} word={word} normalizedWord={normalizedWord} />
    );

    expect(screen.getByText("Map status: needs review")).toBeVisible();
    const technicalStatus = screen.getByText("Technical status");
    expect(technicalStatus.closest("details")).not.toHaveAttribute("open");
    expect(technicalStatus.closest("details")).toHaveTextContent("MALFORMED");
    fireEvent.click(technicalStatus);
    expect(technicalStatus.closest("details")).toHaveAttribute("open");
    expect(screen.getByText(/failed bounds validation/i)).toBeTruthy();

    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBe(0);
  });

  it("shows Root Map authority boundaries in plain language and retains the exact technical wording", () => {
    const rawMeaning = "reviewed functional free-operator evidence: M carrier evidence; historicalOriginClaim=not_claimed; automaticInterpretationSelection=DISABLED; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides";
    const rm: Maybe<any> = present({
      ...baseRootMap([]),
      composedMeaning: rawMeaning,
    });

    render(<RootMapCard rootMap={rm as any} word={word} normalizedWord={normalizedWord} />);

    const visibleMeaning = screen.getByTestId("root-map-constructed-reading");
    expect(visibleMeaning).toHaveTextContent("Reviewed function evidence: M carrier evidence");
    expect(visibleMeaning).not.toHaveTextContent(/user_decides|historicalOriginClaim|automaticInterpretationSelection|languageSuperiorityClaim/);
    expect(screen.getByText(/interpretations are not selected automatically; the user decides; not a historical-chain claim/i)).toBeVisible();

    const technical = screen.getByTestId("root-map-technical-composed-meaning");
    expect(technical).not.toHaveAttribute("open");
    expect(technical).toHaveTextContent(rawMeaning);
    fireEvent.click(technical.querySelector("summary")!);
    expect(technical).toHaveAttribute("open");
    expect(technical).toHaveTextContent(rawMeaning);
  });

  it("keeps Root Map evidence readable while retaining exact operation and authority strings on demand", () => {
    const rawEvidence = "reviewed functional free-operator evidence: Wiktionary contributors; di = know / knowledge. https://en.wiktionary.org/wiki/di#Albanian; historicalOriginClaim=not_claimed; automaticInterpretationSelection=DISABLED; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides";
    const rm: Maybe<any> = present({
      ...baseRootMap([]),
      keys: [{
        token: "DI",
        language: "sq",
        status: "supported",
        gloss: "know / knowledge",
        ops: ["exact"],
        evidence: ["sq: di", "ops: exact", "gloss: I know", rawEvidence],
      }],
    });

    render(<RootMapCard rootMap={rm as any} word={word} normalizedWord={normalizedWord} />);

    const visibleEvidence = screen.getAllByTestId("root-map-visible-evidence");
    expect(visibleEvidence[0]).toHaveTextContent("Albanian form: di");
    expect(screen.getByText("Spelling: exact")).toBeVisible();
    expect(screen.getByText("Meaning: I know")).toBeVisible();
    const visibleSourceEvidence = visibleEvidence[3]!.cloneNode(true) as HTMLElement;
    visibleSourceEvidence.querySelectorAll("details:not([open])").forEach((details) => details.remove());
    expect(visibleSourceEvidence).toHaveTextContent("Reviewed function evidence: Wiktionary contributors; di = know / knowledge.");
    expect(visibleSourceEvidence).not.toHaveTextContent(/historicalOriginClaim|automaticInterpretationSelection|languageSuperiorityClaim|user_decides/);
    expect(screen.getByText("Exact spelling")).toBeVisible();

    const technicalEvidence = screen.getAllByTestId("root-map-technical-key-evidence").at(-1)!;
    expect(technicalEvidence).not.toHaveAttribute("open");
    expect(technicalEvidence).toHaveTextContent(rawEvidence);
    fireEvent.click(technicalEvidence.querySelector("summary")!);
    expect(technicalEvidence).toHaveAttribute("open");
    expect(technicalEvidence).toHaveTextContent(rawEvidence);
  });
});
