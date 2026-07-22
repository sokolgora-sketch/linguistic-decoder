/** @jest-environment jsdom */

import React from "react";
import {
  readFileSync,
} from "node:fs";

import {
  render,
  screen,
} from "@testing-library/react";

import {
  AnalysisStatusCardV0_1,
} from "@/ui/instrument/sections/AnalysisStatusCard.v0.1";

const claimBoundary = {
  historicalOriginClaim:
    "not_claimed" as const,
  historicalTransmissionClaim:
    "not_claimed" as const,
  winnerClaim:
    "not_claimed" as const,
  languageSuperiorityClaim:
    "not_claimed" as const,
  linguisticOwnershipClaim:
    "not_claimed" as const,
  candidateTruthClaim:
    "not_claimed" as const,
  structuralOutputIsCandidateTruth:
    false as const,
  nullIsValid:
    true as const,
};

describe(
  "Open Instrument analysis status surface v0.1",
  () => {
    it(
      "renders candidate-only output without promotion",
      () => {
        render(
          <AnalysisStatusCardV0_1
            status={{
              kind: "present",
              value: {
                schemaVersion:
                  "open-instrument.analysis-status.v0_1",
                status:
                  "candidate_only",
                summary:
                  "Structural canonical candidates were detected for DI, but reviewed functional evidence is not authorized.",
                reviewedOperators: [],
                candidateOnlyOperators: [
                  "DI",
                ],
                structuralTokens: [
                  "DI",
                ],
                claimBoundary,
                userDecisionPosture:
                  "user_decides",
              },
            }}
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Candidate only",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /reviewed functional evidence is not authorized/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Structural output is not candidate truth/i,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /User decides/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders an explicit valid Null result",
      () => {
        render(
          <AnalysisStatusCardV0_1
            status={{
              kind: "present",
              value: {
                schemaVersion:
                  "open-instrument.analysis-status.v0_1",
                status:
                  "null_no_supported_candidate",
                summary:
                  "No supported canonical candidate or reviewed functional evidence is available. Null is a valid result.",
                reviewedOperators: [],
                candidateOnlyOperators: [],
                structuralTokens: [],
                claimBoundary,
                userDecisionPosture:
                  "user_decides",
              },
            }}
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Null — no supported candidate",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Null is a valid result/i,
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "mounts the VM-only card in Overview",
      () => {
        const panel =
          readFileSync(
            "src/ui/instrument/InstrumentPanel.tsx",
            "utf8",
          );

        const adapter =
          readFileSync(
            "src/ui/instrument/contractAdapter.ts",
            "utf8",
          );

        const card =
          readFileSync(
            "src/ui/instrument/sections/AnalysisStatusCard.v0.1.tsx",
            "utf8",
          );

        expect(panel).toContain(
          'import { AnalysisStatusCardV0_1 } from "./sections/AnalysisStatusCard.v0.1";',
        );

        expect(panel).toContain(
          "vm.analysisStatusV0_1 ?? {",
        );

        expect(adapter).toContain(
          "analysisStatusV0_1: parseAnalysisStatusV0_1(payload)",
        );

        expect(card).not.toContain(
          "fetch(",
        );

        expect(card).not.toContain(
          "payload:",
        );

        expect(card).not.toContain(
          "raw:",
        );
      },
    );
  },
);
