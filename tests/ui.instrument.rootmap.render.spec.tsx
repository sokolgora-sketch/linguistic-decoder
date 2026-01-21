import React from "react";
import { render, screen } from "@testing-library/react";
import { RootMapCard } from "@/ui/instrument/RootMapCard";

type Present<T> = { kind: "present"; value: T };
type MissingReason = "not_emitted" | "malformed" | "unknown";
type Missing = { kind: "missing"; missing: MissingReason; note?: string };
type Maybe<T> = Present<T> | Missing;

type RootMapVM = {
  tokens?: { token: string; role?: string; vowel_path?: string }[];
  keys?: {
    token: string;
    language?: string;
    gloss?: string;
    status?: string;
    ops?: unknown;
    evidence?: unknown;
  }[];
  carriers?: { token: string; language?: string; carrierForm?: string; note?: string }[];
  spans?: { token: string; start?: number; end?: number; note?: string }[];
  composedMeaning?: string;
};

function present<T>(value: T): Present<T> {
  return { kind: "present", value };
}

describe("RootMapCard: evidence/ops rendering (v0.1.4)", () => {
  test("renders per-key ops chips + evidence list from vm.rootMap", () => {
    const rootMap: Maybe<RootMapVM> = present({
      tokens: [{ token: "SHTU", role: "action", vowel_path: "U" }],
      keys: [
        {
          token: "SHTU",
          language: "sq",
          gloss: "add / increase / put-on",
          status: "supported",
          ops: ["s_to_sh"],
          evidence: ["sq: shtu", "ops: s_to_sh"],
        },
      ],
      carriers: [],
      spans: [{ token: "SHTU", start: 0, end: 4 }],
      composedMeaning: "add / increase / put-on",
    });

    render(<RootMapCard rootMap={rootMap} word="study" normalizedWord="study" />);

    // ops chip should render
    expect(screen.getByText("s_to_sh")).toBeInTheDocument();

    // evidence items should render
    expect(screen.getByText("sq: shtu")).toBeInTheDocument();
    expect(screen.getByText("ops: s_to_sh")).toBeInTheDocument();
  });

  test("never renders '[object Object]' for malformed items in ops/evidence arrays", () => {
    const rootMap: Maybe<RootMapVM> = present({
      tokens: [{ token: "SHTU" }],
      keys: [
        {
          token: "SHTU",
          language: "sq",
          gloss: "add",
          status: "supported",
          // include an object item that must be ignored
          ops: ["s_to_sh", { bad: true }],
          evidence: ["sq: shtu", { nope: 1 }, "gloss: add"],
        },
      ],
      carriers: [],
      spans: [{ token: "SHTU", start: 0, end: 4 }],
      composedMeaning: "add",
    });

    const { container } = render(<RootMapCard rootMap={rootMap} word="study" normalizedWord="study" />);

    // primitives still render
    expect(screen.getByText("s_to_sh")).toBeInTheDocument();
    expect(screen.getByText("sq: shtu")).toBeInTheDocument();
    expect(screen.getByText("gloss: add")).toBeInTheDocument();

    // object items must not leak as stringified objects
    expect(container.textContent).not.toContain("[object Object]");
  });

  test("treats non-array evidence/ops as missing (sections omitted, no crash)", () => {
    const rootMap: Maybe<RootMapVM> = present({
      tokens: [{ token: "SHTU" }],
      keys: [
        {
          token: "SHTU",
          language: "sq",
          gloss: "add",
          status: "supported",
          ops: { not: "an array" },
          evidence: { not: "an array" },
        },
      ],
      carriers: [],
      spans: [{ token: "SHTU", start: 0, end: 4 }],
      composedMeaning: "add",
    });

    render(<RootMapCard rootMap={rootMap} word="study" normalizedWord="study" />);

    // no "ops" / "evidence" section headers should appear
    // (they are rendered only when the filtered list has length)
    expect(screen.queryByText("ops")).toBeNull();
    expect(screen.queryByText("evidence")).toBeNull();
  });
});
