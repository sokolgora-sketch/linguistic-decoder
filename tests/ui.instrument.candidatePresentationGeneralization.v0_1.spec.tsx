import React from "react";
import {
  render,
  screen,
} from "@testing-library/react";

import {
  GET,
} from "../app/api/analyze-v1/route";

import {
  adaptAnalysisToTelemetryVM,
} from "../src/ui/instrument/contractAdapter";

import {
  EmbryoExpansionContextCardV0_1,
} from "../src/ui/instrument/sections/EmbryoExpansionContextCard.v0_1";

async function analyzeV1(
  word: string,
): Promise<any> {
  const response =
    await GET(
      new Request(
        `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
      ),
    );

  expect(
    response.status,
  ).toBe(200);

  return response.json();
}

function renderPayload(
  payload: any,
) {
  const vm =
    adaptAnalysisToTelemetryVM(
      payload,
    );

  render(
    <EmbryoExpansionContextCardV0_1
      vm={vm}
    />,
  );

  return vm;
}

describe(
  "Open Instrument candidate presentation generalization v0.1",
  () => {
    it("uses the first-class multi-embryo candidate for study without word-specific UI logic", async () => {
      const body =
        await analyzeV1(
          "study",
        );

      renderPayload(body);

      expect(
        screen.getByText(
          "SHTU + DI",
        ),
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
    });

    it("shows a one-embryo functional candidate even when RootMap also exists", async () => {
      const body =
        await analyzeV1(
          "study",
        );

      const di =
        body.candidates.find(
          (candidate: any) =>
            candidate?.candidateId ===
            "albanian-di-know-functional",
        );

      expect(di).toBeTruthy();

      body.candidates = [
        di,
      ];

      renderPayload(body);

      expect(
        screen.getByText(
          "Evidence: Reviewed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getAllByText(
          "DI",
        ).length,
      ).toBeGreaterThanOrEqual(
        1,
      );

      expect(
        screen.getByText(
          "DI · reviewed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          "SHTU + DI",
        ),
      ).not.toBeInTheDocument();
    });

    it("shows a partial one-embryo candidate through the same card model", async () => {
      const body =
        await analyzeV1(
          "father",
        );

      delete body.rootMap;

      body.candidates = [
        {
          id:
            "fixture-partial-at",
          candidateId:
            "fixture-partial-at",
          language: "sq",
          candidateLanguage: "sq",
          form: "AT",
          displayForm: "AT",
          embryo: "AT",
          plainStandaloneGloss:
            "father / paternal relation",
          claimType:
            "functionalMotivation",
          validationOutcome:
            "partial",
          functionalStatement:
            "AT can provisionally motivate the paternal function.",
          sourceKind:
            "fixture",
        },
      ];

      renderPayload(body);

      expect(
        screen.getAllByText(
          "AT",
        ).length,
      ).toBeGreaterThanOrEqual(2);

      expect(
        screen.getByText(
          "Evidence: Partial",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "father / paternal relation",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "AT · partial",
        ),
      ).toBeInTheDocument();
    });

    it("shows a proposed multi-embryo candidate with structured component meanings", async () => {
      const body =
        await analyzeV1(
          "father",
        );

      delete body.rootMap;

      body.candidates = [
        {
          id:
            "fixture-proposed-ka-ra",
          candidateId:
            "fixture-proposed-ka-ra",
          language: "sq",
          candidateLanguage: "sq",
          form: "KA + RA",
          displayForm: "KA + RA",
          claimType:
            "functionalMotivation",
          validationOutcome:
            "proposed",
          functionalStatement:
            "fixture proposed functional explanation",
          sourceKind:
            "LLM_PROPOSED",
          segmentation: {
            kind:
              "functionalComposition",
            components: [
              {
                embryo: "KA",
                language: "sq",
                plainMeaning:
                  "fixture meaning one",
                evidenceState:
                  "proposed",
              },
              {
                embryo: "RA",
                language: "sq",
                plainMeaning:
                  "fixture meaning two",
                evidenceState:
                  "proposed",
              },
            ],
          },
        },
      ];

      const vm =
        renderPayload(body);

      const row =
        vm.candidates[0];

      expect(
        row.functionalComponents
          ?.kind,
      ).toBe("present");

      expect(
        screen.getByText(
          "KA + RA",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "Evidence: Proposed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "fixture meaning one",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "fixture meaning two",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "KA · proposed",
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          "RA · proposed",
        ),
      ).toBeInTheDocument();
    });

    it("shows Null when RootMap is structural but no functional candidate exists", async () => {
      const body =
        await analyzeV1(
          "study",
        );

      body.candidates =
        body.candidates.filter(
          (candidate: any) =>
            candidate
              ?.claimType !==
            "functionalMotivation",
        );

      renderPayload(body);

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
          "SHTU + DI",
        ),
      ).not.toBeInTheDocument();
    });
  },
);
