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

    expect(screen.getByText("Albanian form: da")).toBeVisible();
    const visibleEvidence = screen.getAllByTestId("root-map-visible-evidence").map((node) => node.textContent ?? "").join(" ");
    expect(visibleEvidence).toMatch(/Reviewed function evidence: Dedvukaj & Ndoci 2023 PLSA/i);
    const exactEvidence = screen.getAllByTestId("root-map-technical-key-evidence");
    expect(exactEvidence).toHaveLength(2);
    const reviewedTechnical = exactEvidence.find((node) =>
      node.textContent?.includes("reviewed functional free-operator evidence: Dedvukaj & Ndoci 2023 PLSA"),
    );
    expect(reviewedTechnical).toBeDefined();
    expect(reviewedTechnical).not.toHaveAttribute("open");
    expect(reviewedTechnical).toHaveTextContent("reviewed functional free-operator evidence: Dedvukaj & Ndoci 2023 PLSA");
    expect(screen.getByText("Keys")).toBeTruthy();
    expect(screen.queryByText("Supported keys")).toBeNull();
    const keyRow = screen.getAllByText("DA")[1]?.closest("li");
    expect(keyRow).toHaveTextContent("Dialect attested pending review");
    expect(keyRow?.querySelector("details")).not.toHaveAttribute("open");
    expect(keyRow?.querySelector("details")).toHaveTextContent("dialect_attested_pending_review");
    expect(screen.getByText("Vowel swap")).toBeVisible();
    expect(screen.getByText("Technical operation labels").closest("details")).not.toHaveAttribute("open");
    expect(screen.getByText("Technical operation labels").closest("details")).toHaveTextContent("vowel_swap");
    expect(screen.queryByText(/\[object Object\]/)).toBeNull();
    expect(screen.queryByText(/malformed/)).toBeNull();
  });
});
