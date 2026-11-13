/** @jest-environment jsdom */

import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import DeepRootCard from "@/components/DeepRootCard";
import { CandidatesAccordion } from "@/ui/candidates/CandidatesAccordion";
import { AnalysisStatusCardV0_1 } from "@/ui/instrument/sections/AnalysisStatusCard.v0.1";
import {
  LEGACY_INTERPRETATION_COPY_PATTERNS_V0_1,
  presentNeutralInterpretationBoundaryV0_1,
} from "@/ui/instrument/neutralInterpretationLanguage.v0_1";

const USER_FACING_COPY_FILES = [
  "src/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1.tsx",
  "src/ui/instrument/sections/MotivationDiscoveryCard.v0_1.tsx",
  "src/ui/instrument/sections/PrimaryAlbanianReadingCard.v0_1.tsx",
  "src/ui/instrument/sections/CrossLanguageFunctionalMotivationWorkbenchV0_1.tsx",
  "src/ui/instrument/sections/WordToWordStructuralAuthorityComparisonCard.v0_1.tsx",
  "src/ui/instrument/sections/DoctrineReadingCard.v0.1.tsx",
  "src/ui/instrument/sections/AnalysisStatusCard.v0.1.tsx",
  "src/ui/instrument/sections/EmbryoExpansionContextCard.v0_1.tsx",
  "src/ui/instrument/sections/FjaloriCrossSourceEvidence.v0_1.tsx",
  "src/ui/candidates/CandidatesAccordion.tsx",
  "src/components/DeepRootCard.tsx",
  "app/instrument-preview/page.tsx",
  "docs/ZERO_REALITY_GUIDE.md",
  "docs/ui-telemetry-contract.v0.1.md",
  "src/ui/instrument/spokenPronunciationPresentation.v0_1.ts",
  "src/ui/telemetry/buildEvidenceSummaryTextFromVM.ts",
  "src/shared/reviewedExternalLexiconFunctionalReadiness.v0_1.ts",
  "src/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1.ts",
  "src/shared/llm/prompts/functionalCandidateProposer.v0.1.ts",
  "src/shared/llm/prompts/semanticAlignmentProposer.v0.1.ts",
  "src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts",
] as const;

describe("neutral interpretation language presentation v0.1", () => {
  it("rewrites legacy claim-boundary copy only at presentation time", () => {
    const legacy = "No single winner is selected; winner claims remain unclaimed.";
    const presented = presentNeutralInterpretationBoundaryV0_1(legacy);

    expect(presented).toBe("No interpretation is selected automatically; interpretation remains with the user.");
    expect(legacy).toBe("No single winner is selected; winner claims remain unclaimed.");
    expect(LEGACY_INTERPRETATION_COPY_PATTERNS_V0_1.some((pattern) => pattern.test(presented))).toBe(false);
  });

  it.each([
    "No winner; functional carrier only.",
    "Other candidates remain inspectable without selecting a winner.",
    "not historical-origin or winner evidence",
    "a unique winner",
    "automatic functional winners",
    "Order is not a ranking.",
    "No automatic ranking is performed.",
    "No sense is ranked.",
  ])("neutralizes legacy boundary copy: %s", (legacy) => {
    const presented = presentNeutralInterpretationBoundaryV0_1(legacy);
    expect(LEGACY_INTERPRETATION_COPY_PATTERNS_V0_1.some((pattern) => pattern.test(presented))).toBe(false);
  });

  it("renders legacy DeepRoot notes with neutral interpretation wording", () => {
    render(
      <DeepRootCard
        deepRoot={{
          functionalRoots: [{
            id: "legacy-carrier",
            language: "sq",
            roots: ["DËM"],
            gloss: "Harm or loss.",
            vowelPath: "Ë",
            notes: ["No winner; functional carrier only."],
          }],
        }}
      />,
    );

    const result = screen.getByTestId("deeproot-functional-1");
    expect(result).toHaveTextContent("Interpretation remains with the user; functional carrier only.");
    expect(result).not.toHaveTextContent(/\b(?:winner|winning|ranking|ranked)\b/i);
  });

  it("renders legacy candidate boundaries with neutral interpretation wording", () => {
    render(
      <CandidatesAccordion
        rows={[
          {
            id: "legacy-candidate",
            language: "sq",
            form: "studim",
            embryo: "stu",
            claimBoundary: "No single winner is selected; winner claims remain unclaimed.",
            raw: {},
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /studim/i }));
    const boundary = screen.getByText(/Boundary:/);
    expect(boundary).toHaveTextContent(
      "Boundary: No interpretation is selected automatically; interpretation remains with the user.",
    );
    expect(boundary).not.toHaveTextContent(/\b(?:winner|winning|ranking|ranked)\b/i);
  });

  it("renders legacy generated status summaries with neutral interpretation wording", () => {
    render(
      <AnalysisStatusCardV0_1
        status={{
          kind: "present",
          value: {
            status: "reviewed_functional_evidence",
            summary: "This is functional evidence, not a historical-origin or winner claim.",
            reviewedOperators: ["DI"],
            candidateOnlyOperators: [],
            researchHypothesisEmbryos: [],
            structuralTokens: [],
          },
        } as any}
      />,
    );

    expect(screen.getByText(/This is functional evidence, not a historical-origin or claim to select an interpretation automatically/)).toBeInTheDocument();
    expect(screen.getByText(/This is functional evidence/)).not.toHaveTextContent(/\b(?:winner|winning|ranking|ranked)\b/i);
  });

  it("keeps reachable interface copy free of competition-style interpretation wording", () => {
    for (const file of USER_FACING_COPY_FILES) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const pattern of LEGACY_INTERPRETATION_COPY_PATTERNS_V0_1) {
        expect(source).not.toMatch(pattern);
      }
    }
  });
});
