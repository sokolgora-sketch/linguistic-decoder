import React from "react";
import {
  render,
  screen,
  within,
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

      expect(
        composition.functionalStatement,
      ).toBe(
        "Adding or increasing knowledge; making knowledge yours through learning.",
      );

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
          "Adding or increasing knowledge; making knowledge yours through learning.",
        ),
      ).toBeInTheDocument();

      const sevenVoiceAlignment =
        screen.getByTestId(
          "functional-seven-voice-alignment",
        );

      expect(
        within(
          sevenVoiceAlignment,
        ).getByText(
          "Principles: U (5) — Unity → I (3) — Insight",
        ),
      ).toBeInTheDocument();

      expect(
        within(
          sevenVoiceAlignment,
        ).getByText(
          "Colors: Blue → Yellow",
        ),
      ).toBeInTheDocument();

      expect(
        within(
          sevenVoiceAlignment,
        ).getByText(
          "Musical notes: G → E",
        ),
      ).toBeInTheDocument();

      const sevenVoiceKey =
        screen.getByTestId(
          "seven-voice-key",
        );

      for (
        const expected of [
          "A (1)",
          "Truth",
          "Red",
          "Note C",
          "E (2)",
          "Expansion",
          "Orange",
          "Note D",
          "I (3)",
          "Insight",
          "Yellow",
          "Note E",
          "O (4)",
          "Balance",
          "Green",
          "Note F",
          "U (5)",
          "Unity",
          "Blue",
          "Note G",
          "Y (6)",
          "Reflection",
          "Indigo",
          "Note A",
          "Ë (7)",
          "Evolution",
          "Violet",
          "Note B",
        ]
      ) {
        expect(
          sevenVoiceKey,
        ).toHaveTextContent(
          expected,
        );
      }

      expect(
        screen.queryByText(
          "ROOTMAP FALLBACK SHOULD NOT LEAD",
        ),
      ).not.toBeInTheDocument();
    });

    it("does not borrow the run-level U-I alignment when the displayed DI fallback has no candidate vowel path", async () => {
      const body =
        await analyzeV1("study");

      const reviewedDi =
        body.candidates.find(
          (candidate: any) =>
            candidate?.embryo === "DI" &&
            candidate?.validationOutcome ===
              "validated",
        );

      expect(reviewedDi).toBeTruthy();
      expect(
        reviewedDi.vowelPath,
      ).toBeUndefined();

      body.candidates = [
        reviewedDi,
      ];

      const vm =
        adaptAnalysisToTelemetryVM(body);

      expect(
        vm.readout
          .voicePathFunctional,
      ).toEqual({
        kind: "present",
        value: ["U", "I"],
      });

      expect(
        vm.candidates[0]
          .vowelPath.kind,
      ).toBe("missing");

      render(
        <EmbryoExpansionContextCardV0_1
          vm={vm}
        />,
      );

      expect(
        screen.queryByTestId(
          "functional-seven-voice-alignment",
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          "Functional path: U → I",
        ),
      ).not.toBeInTheDocument();

      expect(
        screen.getByTestId(
          "seven-voice-key",
        ),
      ).toBeInTheDocument();
    });
  },
);
