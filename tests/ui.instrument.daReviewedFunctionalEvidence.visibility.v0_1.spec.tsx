import { render, screen } from "@testing-library/react";
import { RootMapCard } from "@/ui/instrument/RootMapCard";
import { buildEvidencePackageFromVM } from "@/ui/telemetry/buildEvidencePackageFromVM";

const reviewedDaEvidence =
  "reviewed functional free-operator evidence: Dedvukaj & Ndoci 2023 PLSA, Example (4), page 3; footnote 1: da = to split, cut, divide. https://doi.org/10.3765/plsa.v8i1.5501; historicalOriginClaim=not_claimed; winnerClaim=not_claimed; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides";

const rootMapValue = {
  tokens: [{ token: "DA", role: "action", vowel_path: "A" }],
  keys: [
    {
      token: "DA",
      language: "sq",
      gloss: "split / divide / cut / separate",
      evidence: [
        "sq: da",
        "gloss: split / divide / cut",
        reviewedDaEvidence,
      ],
      status: "dialect_attested_pending_review",
      ops: [],
    },
  ],
  carriers: [],
  spans: [{ token: "DA", start: 0, end: 2, source: "surface", note: "segment=da" }],
  composedMeaning: "split / divide / cut / separate",
};

describe("DA reviewed functional evidence visibility v0.1", () => {
  it("renders reviewed DA functional evidence from the RootMap VM surface", () => {
    render(
      <RootMapCard
        rootMap={{ kind: "present", value: rootMapValue } as any}
        word="da"
        normalizedWord="da"
      />,
    );

    const visibleEvidence = screen.getAllByTestId("root-map-visible-evidence");
    const readableClaim = visibleEvidence.find((node) => node.textContent?.includes("Reviewed function evidence: Dedvukaj & Ndoci 2023 PLSA"));
    expect(readableClaim).toBeDefined();
    const readableText = readableClaim!.cloneNode(true) as HTMLElement;
    readableText.querySelectorAll("details").forEach((details) => details.remove());
    expect(readableText).toHaveTextContent(/Reviewed function evidence: Dedvukaj & Ndoci 2023 PLSA, Example \(4\), page 3; footnote 1/i);
    expect(readableText).not.toHaveTextContent(/historicalOriginClaim|winnerClaim|languageSuperiorityClaim|userDecisionPosture|user_decides/);
    const exactEvidence = screen.getAllByTestId("root-map-technical-key-evidence");
    expect(exactEvidence).toHaveLength(3);
    const exactReviewedClaim = exactEvidence.find((node) =>
      node.textContent?.includes("reviewed functional free-operator evidence: Dedvukaj & Ndoci 2023 PLSA, Example (4), page 3; footnote 1"),
    );
    expect(exactReviewedClaim).toBeDefined();
    expect(exactReviewedClaim).not.toHaveAttribute("open");
    expect(exactReviewedClaim).toHaveTextContent(/historicalOriginClaim=not_claimed/);
    expect(exactReviewedClaim).toHaveTextContent(/winnerClaim=not_claimed/);
    expect(exactReviewedClaim).toHaveTextContent(/languageSuperiorityClaim=not_claimed/);
    expect(exactReviewedClaim).toHaveTextContent(/userDecisionPosture=user_decides/);
  });

  it("carries reviewed DA functional evidence through EvidencePackage rootMap export", () => {
    const pkg = buildEvidencePackageFromVM(
      {
        rootMap: { kind: "present", value: rootMapValue },
        readout: { counts: { signals: { kind: "present", value: 1 } } },
      } as any,
      { ledgerModel: { entries: [] } },
    );

    const exported = JSON.stringify(pkg);

    expect(exported).toContain("Dedvukaj & Ndoci 2023 PLSA");
    expect(exported).toContain("Example (4), page 3; footnote 1");
    expect(exported).toContain("historicalOriginClaim=not_claimed");
    expect(exported).toContain("winnerClaim=not_claimed");
    expect(exported).toContain("languageSuperiorityClaim=not_claimed");
    expect(exported).toContain("userDecisionPosture=user_decides");
    expect(exported).not.toContain("reviewed.external.di.knowledge.candidate.v0_1");
    expect(exported).not.toContain("Direct DPEWA/FGJSH locator");
  });
});
