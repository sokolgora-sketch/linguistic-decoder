import React from "react";
import {
  render,
  screen,
} from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";

import {
  adaptAnalysisToTelemetryVM,
} from "../src/ui/instrument/contractAdapter";

import {
  EmbryoExpansionContextCardV0_1,
} from "../src/ui/instrument/sections/EmbryoExpansionContextCard.v0_1";

async function analyzeV1(
  word: string,
): Promise<any> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

describe(
  "Open Instrument functional candidate composition UI v0.1",
  () => {
    it("drives the primary SHTU + DI result from the first-class composed candidate while RootMap remains component evidence", async () => {
      const body = await analyzeV1("study");

      const composition =
        body.candidates.find(
          (candidate: any) =>
            candidate?.candidateId ===
            "rootmap-composition:sq:shtu+di",
        );

      expect(composition).toBeTruthy();

      composition.functionalStatement =
        "candidate-level composition explanation";

      body.rootMap.composedMeaning =
        "ROOTMAP FALLBACK SHOULD NOT LEAD";

      const vm =
        adaptAnalysisToTelemetryVM(body);

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
        />,
      );

      expect(
        screen.getByText("SHTU + DI"),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Evidence: Partial",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "SHTU · structural",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "DI · reviewed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "candidate-level composition explanation",
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          "ROOTMAP FALLBACK SHOULD NOT LEAD",
        ),
      ).not.toBeInTheDocument();
    });
  },
);
