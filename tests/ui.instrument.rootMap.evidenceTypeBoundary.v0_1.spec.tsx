import { render, screen } from "@testing-library/react";
import { RootMapCard } from "@/ui/instrument/RootMapCard";

describe("RootMapCard evidence type boundary v0.1", () => {
  it("renders string evidence and filters malformed evidence values without object leakage", () => {
    render(
      <RootMapCard
        rootMap={{
          kind: "present",
          value: {
            tokens: [{ token: "DA", role: "action", vowel_path: "A" }],
            keys: [
              {
                token: "DA",
                language: "sq",
                gloss: "split / divide",
                status: "dialect_attested_pending_review",
                ops: ["vowel_swap", { malformed: true }],
                evidence: [
                  "sq: da",
                  { malformed: true },
                  "reviewed functional free-operator evidence: Dedvukaj & Ndoci 2023 PLSA",
                ],
              },
            ],
            spans: [{ token: "DA", start: 0, end: 2, source: "surface", note: "segment=da" }],
            composedMeaning: "split / divide",
          },
        } as any}
        word="da"
        normalizedWord="da"
      />,
    );

    expect(screen.getByText("sq: da")).toBeTruthy();
    expect(screen.getByText(/Dedvukaj & Ndoci 2023 PLSA/i)).toBeTruthy();
    expect(screen.getByText("Keys")).toBeTruthy();
    expect(screen.queryByText("Supported keys")).toBeNull();
    expect(screen.getAllByText("DA")[1]?.closest("li")).toHaveTextContent(
      "dialect_attested_pending_review",
    );
    expect(screen.getByText("vowel_swap")).toBeTruthy();
    expect(screen.queryByText(/\[object Object\]/)).toBeNull();
    expect(screen.queryByText(/malformed/)).toBeNull();
  });
});
