/** @jest-environment jsdom */

import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import DeepRootCard from "@/components/DeepRootCard";
import { CandidatesAccordion } from "@/ui/candidates/CandidatesAccordion";
import { AnalysisStatusCardV0_1 } from "@/ui/instrument/sections/AnalysisStatusCard.v0.1";
import { migrateLegacyInterpretationTextAtInputV0_1 } from "@/shared/openInstrument/neutralInterpretationInputMigration.v0_1";

const PROHIBITED_COPY_PATTERNS = [
  /\bno single sense winner\b/iu,
  /\bwinning sense\b/iu,
  /\bsense winner\b/iu,
  /\bno single winner\b/iu,
  /\bno winner(?: selected)?\b/iu,
  /\bwinner selection\b/iu,
  /\bwithout selecting a winner\b/iu,
  /\border is not a ranking\b/iu,
  /\bautomatic ranking\b/iu,
  /\bsense is ranked\b/iu,
  /\ba unique winner\b/iu,
] as const;

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
  "src/ui/instrument/sections/CountsRatiosCard.tsx",
  "src/ui/instrument/sections/EvidencePackageCard.tsx",
  "src/ui/instrument/sections/EvidenceTraceCard.tsx",
  "src/ui/instrument/sections/OracleProposeWithEngineOracleCard.v0.1.tsx",
  "src/ui/instrument/sections/OriginClaimGatesCard.tsx",
  "src/ui/instrument/sections/RawJsonCard.tsx",
  "src/ui/instrument/sections/ReadoutCard.tsx",
  "src/ui/candidates/CandidatesAccordion.tsx",
  "src/components/DeepRootCard.tsx",
  "src/components/OriginClaimCard.tsx",
  "src/ui/instrument/MeaningPanel.tsx",
  "src/ui/instrument/RootMapCard.tsx",
  "app/instrument-preview/page.tsx",
  "docs/ZERO_REALITY_GUIDE.md",
  "docs/ui-telemetry-contract.v0.2.md",
  "docs/open-instrument/evaluation/open-instrument-structured-user-evaluation-v0.2.md",
  "docs/open-instrument/evaluation/open-instrument-structured-user-evaluation-score-sheet-v0.2.md",
  "src/ui/instrument/spokenPronunciationPresentation.v0_1.ts",
  "src/shared/openInstrument/evidencePackageExport.v0_1.ts",
  "src/shared/deepRoot.rootMap.builder.v1.ts",
  "src/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1.ts",
  "src/shared/llm/prompts/functionalCandidateProposer.v0.1.ts",
  "src/shared/llm/prompts/semanticAlignmentProposer.v0.1.ts",
  "src/shared/openInstrument/zhejiTransparencyPrompt.v0.1.ts",
  "src/ui/telemetry/buildEvidenceSummaryTextFromVM.ts",
] as const;

describe("legacy interpretation input migration", () => {
  it("migrates old claim-boundary text once at the input boundary", () => {
    const legacy = "No single winner is selected; winner claims remain unclaimed.";
    const presented = migrateLegacyInterpretationTextAtInputV0_1(legacy) as string;

    expect(presented).toBe("No interpretation is selected automatically; interpretation remains with the user.");
    expect(legacy).toBe("No single winner is selected; winner claims remain unclaimed.");
    expect(PROHIBITED_COPY_PATTERNS.some((pattern) => pattern.test(presented))).toBe(false);
  });

  it("migrates only typed policy text in stored records and preserves lexical/source text", () => {
    const legacyRecord = {
      analysisStatusV0_1: {
        summary: "No single winner is selected; preserve alternatives.",
      },
      word: "winner",
      candidate: {
        form: "winner",
        sourceId: "source.winner",
        citation: "A citation whose title contains winner.",
        gloss: "winner: an attested lexical sense.",
        sourceNote: "User-entered claim: winner.",
      },
      rootMap: {
        evidenceText: "reviewed functional free-operator evidence: citation title mentions winner claim; historicalOriginClaim=not_claimed; winnerClaim=not_claimed; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides",
      },
      deepRoot: {
        functionalRoots: [{
          gloss: "winner: a preserved lexical gloss",
          notes: ["No winner; functional carrier only.", "Source citation title includes winner."],
        }],
      },
    };

    expect(migrateLegacyInterpretationTextAtInputV0_1(legacyRecord)).toEqual({
      analysisStatusV0_1: {
        summary: "No interpretation is selected automatically; preserve alternatives.",
      },
      word: "winner",
      candidate: {
        form: "winner",
        sourceId: "source.winner",
        citation: "A citation whose title contains winner.",
        gloss: "winner: an attested lexical sense.",
        sourceNote: "User-entered claim: winner.",
      },
      rootMap: {
        evidenceText: "reviewed functional free-operator evidence: citation title mentions winner claim; historicalOriginClaim=not_claimed; automaticInterpretationSelection=DISABLED; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides",
      },
      deepRoot: {
        functionalRoots: [{
          gloss: "winner: a preserved lexical gloss",
          notes: ["Interpretation remains with the user; functional carrier only.", "Source citation title includes winner."],
        }],
      },
    });
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
    const presented = migrateLegacyInterpretationTextAtInputV0_1(legacy) as string;
    expect(PROHIBITED_COPY_PATTERNS.some((pattern) => pattern.test(presented))).toBe(false);
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
          notes: [migrateLegacyInterpretationTextAtInputV0_1("No winner; functional carrier only.") as string],
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
            claimBoundary: migrateLegacyInterpretationTextAtInputV0_1("No single winner is selected; winner claims remain unclaimed.") as string,
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
            summary: migrateLegacyInterpretationTextAtInputV0_1("This is functional evidence, not a historical-origin or winner claim.") as string,
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
      for (const pattern of PROHIBITED_COPY_PATTERNS) {
        expect(source).not.toMatch(pattern);
      }
    }
  });
});
