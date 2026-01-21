import React from "react";
import { render, screen } from "@testing-library/react";
import { RootMapCard } from "@/ui/instrument/RootMapCard";

type Present<T> = { kind: "present"; value: T };
type Missing = { kind: "missing"; missing: "not_emitted" | "malformed" | "unknown"; note?: string };
type Maybe<T> = Present<T> | Missing;

function present<T>(value: T): Present<T> {
  return { kind: "present", value };
}

describe("RootMapCard: spans highlight gate v0.1.5", () => {
  test("PRESENT spans => renders <mark> highlights for normalized word map", () => {
    const normalizedWord = "study";
    const rootMap: Maybe<any> = present({
      tokens: [{ token: "SHTU", role: "action", vowel_path: "U" }],
      keys: [{ token: "SHTU", language: "sq", gloss: "add / increase / put-on", status: "supported" }],
      spans: [{ token: "SHTU", start: 0, end: 3, note: "demo" }], // highlights "stu"
      composedMeaning: "demo meaning",
    });

    const { container } = render(
      <RootMapCard rootMap={rootMap as any} word="study" normalizedWord={normalizedWord} />
    );

    // State present
    expect(screen.getByText(/STATE:\s*PRESENT/i)).toBeInTheDocument();

    // Highlight exists
    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThan(0);

    // Contains expected substring from [0,3)
    expect(container.textContent ?? "").toContain("stu");
  });

  test("NONE spans => shows note and renders no <mark>", () => {
    const normalizedWord = "study";
    const rootMap: Maybe<any> = present({
      tokens: [{ token: "SHTU" }],
      keys: [{ token: "SHTU" }],
      // spans omitted => NONE
      composedMeaning: "demo meaning",
    });

    const { container } = render(
      <RootMapCard rootMap={rootMap as any} word="study" normalizedWord={normalizedWord} />
    );

    expect(screen.getByText(/STATE:\s*NONE/i)).toBeInTheDocument();
    expect(screen.getByText(/no spans were provided/i)).toBeInTheDocument();

    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBe(0);
  });

  test("MALFORMED spans => shows note and renders no <mark>", () => {
    const normalizedWord = "study"; // length 5
    const rootMap: Maybe<any> = present({
      tokens: [{ token: "SHTU" }],
      keys: [{ token: "SHTU" }],
      spans: [{ token: "SHTU", start: 0, end: 999 }], // end > L => MALFORMED
      composedMeaning: "demo meaning",
    });

    const { container } = render(
      <RootMapCard rootMap={rootMap as any} word="study" normalizedWord={normalizedWord} />
    );

    expect(screen.getByText(/STATE:\s*MALFORMED/i)).toBeInTheDocument();
    expect(screen.getByText(/failed bounds validation/i)).toBeInTheDocument();

    const marks = container.querySelectorAll("mark");
    expect(marks.length).toBe(0);
  });
});
