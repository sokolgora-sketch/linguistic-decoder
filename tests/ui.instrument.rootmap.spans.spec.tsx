import React from "react";
import { render, screen } from "@testing-library/react";

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

    expect(screen.getByText(/STATE/i)).toBeTruthy();
    expect(screen.getByText(/NONE/i)).toBeTruthy();
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

    expect(screen.getByText(/STATE/i)).toBeTruthy();
    expect(screen.getByText(/MALFORMED/i)).toBeTruthy();
    expect(screen.getByText(/failed bounds validation/i)).toBeTruthy();

    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBe(0);
  });
});
