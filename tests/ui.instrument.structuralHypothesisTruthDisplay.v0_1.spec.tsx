/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import { buildCandidateRowsFromVM } from "../src/ui/candidates/candidateModel";
import { CandidatesAccordion } from "../src/ui/candidates/CandidatesAccordion";
import { AnalysisStatusCardV0_1 } from "../src/ui/instrument/sections/AnalysisStatusCard.v0.1";
import { EmbryoExpansionContextCardV0_1 } from "../src/ui/instrument/sections/EmbryoExpansionContextCard.v0_1";

async function analyze(word: string): Promise<any> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function presentValue(value: any): any {
  return value?.kind === "present"
    ? value.value
    : undefined;
}

describe(
  "Open Instrument structural hypothesis UI truth display v0.1",
  () => {
    it(
      "lifts explicit structural truth through the VM boundary",
      async () => {
        const vm =
          adaptAnalysisToTelemetryVM(
            await analyze("sterile"),
          );

        const structural =
          vm.candidates.find(
            (candidate: any) =>
              presentValue(candidate.claimType) ===
                "structuralHypothesis" &&
              presentValue(candidate.embryo) ===
                "ER",
          ) as any;

        expect(structural).toBeTruthy();

        expect(
          structural.discoveryStatus,
        ).toEqual({
          kind: "present",
          value: "structural_hypothesis",
        });

        expect(
          structural.independentStandaloneMeaning,
        ).toEqual({
          kind: "present",
          value: null,
        });

        expect(
          structural.functionalSupportStatus,
        ).toEqual({
          kind: "present",
          value: "unknown",
        });

        expect(
          structural.historicalOriginClaim,
        ).toEqual({
          kind: "present",
          value: "not_claimed",
        });

        expect(
          structural.candidateTruthClaim,
        ).toEqual({
          kind: "present",
          value: "not_claimed",
        });
      },
    );

    it(
      "renders ER explicitly as Hypothesis with Unknown independent meaning",
      async () => {
        const body =
          await analyze("sterile");

        body.candidates =
          body.candidates.filter(
            (candidate: any) =>
              candidate?.claimType ===
                "structuralHypothesis" &&
              candidate?.embryo === "ER",
          );

        const vm =
          adaptAnalysisToTelemetryVM(body);

        render(
          <CandidatesAccordion
            rows={
              buildCandidateRowsFromVM(vm)
            }
          />,
        );

        expect(
          screen.getByText("Embryo: ER"),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Structural hypothesis",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Independent meaning: Unknown",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Functional support: Unknown",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Historical origin: not claimed",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Candidate truth: not claimed",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            /^Functional evidence:/i,
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByText(
            /^Embryo gloss:/i,
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "labels structural_unreviewed as Hypothesis rather than evidence",
      async () => {
        const vm =
          adaptAnalysisToTelemetryVM(
            await analyze("sterile"),
          );

        expect(
          vm.analysisStatusV0_1?.kind,
        ).toBe("present");

        if (
          vm.analysisStatusV0_1
            ?.kind !== "present"
        ) {
          throw new Error(
            "analysisStatusV0_1 missing",
          );
        }

        render(
          <AnalysisStatusCardV0_1
            status={
              vm.analysisStatusV0_1
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Hypothesis — structural, unreviewed",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByRole(
            "heading",
            {
              name:
                "Reviewed functional evidence",
            },
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "does not promote structural hypotheses into Functional motivation",
      async () => {
        const vm =
          adaptAnalysisToTelemetryVM(
            await analyze("sterile"),
          );

        render(
          <EmbryoExpansionContextCardV0_1
            vm={vm}
          />,
        );

        expect(
          screen.getByText(
            "No supported functional candidate yet.",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Evidence: Reviewed",
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByText(
            "Evidence: Partial",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "preserves existing Reviewed and Null status presentation",
      async () => {
        const damage =
          adaptAnalysisToTelemetryVM(
            await analyze("damage"),
          );

        if (
          damage.analysisStatusV0_1
            ?.kind !== "present"
        ) {
          throw new Error(
            "damage status missing",
          );
        }

        const rendered =
          render(
            <AnalysisStatusCardV0_1
              status={
                damage.analysisStatusV0_1
              }
            />,
          );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Reviewed functional evidence",
            },
          ),
        ).toBeInTheDocument();

        rendered.unmount();

        const nullResult =
          adaptAnalysisToTelemetryVM(
            await analyze("xyz"),
          );

        if (
          nullResult.analysisStatusV0_1
            ?.kind !== "present"
        ) {
          throw new Error(
            "Null status missing",
          );
        }

        render(
          <AnalysisStatusCardV0_1
            status={
              nullResult
                .analysisStatusV0_1
            }
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
      },
    );
  },
);
