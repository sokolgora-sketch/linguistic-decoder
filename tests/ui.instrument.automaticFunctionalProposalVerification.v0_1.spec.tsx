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

async function fatherPayload():
  Promise<any> {
  const response =
    await GET(
      new Request(
        "http://localhost/api/analyze-v1?word=father&mode=strict",
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

function proposed(
  args: {
    id: string;
    expression: string;
    components:
      Array<{
        embryo: string;
        gloss: string;
      }>;
    explanation: string;
  },
) {
  return {
    id: args.id,
    candidateId:
      args.id,
    language:
      "Albanian",
    candidateLanguage:
      "Albanian",
    form:
      args.expression,
    displayForm:
      args.expression,
    claimType:
      "functionalMotivation",
    validationOutcome:
      "not_evaluated",
    rankGroup:
      "unresolved",
    sourceKind:
      "automatic_llm_functional_proposal",
    functionalStatement:
      args.explanation,
    originClaim:
      "not_claimed",
    historicalRelation:
      "not_evaluated",
    segmentation: {
      kind:
        "functionalProposal",
      components:
        args.components.map(
          (component) => ({
            embryo:
              component.embryo,
            language:
              "Albanian",
            plainMeaning:
              component.gloss,
            evidenceState:
              "proposed",
          }),
        ),
    },
  };
}

describe(
  "Open Instrument Slice E proposed candidate presentation safety",
  () => {
    it(
      "does not allow a Proposed composition to displace a Reviewed deterministic candidate",
      async () => {
        const body =
          await fatherPayload();

        body.candidates = [
          {
            id:
              "fixture-reviewed-da",
            candidateId:
              "fixture-reviewed-da",
            language: "sq",
            candidateLanguage:
              "sq",
            form: "DA",
            displayForm:
              "DA",
            embryo: "DA",
            plainStandaloneGloss:
              "split / divide",
            claimType:
              "functionalMotivation",
            validationOutcome:
              "validated",
            rankGroup:
              "validatedFunctionalMotivation",
            sourceKind:
              "reviewed_dictionary_source",
            functionalStatement:
              "fixture reviewed explanation",
          },
          proposed({
            id:
              "fixture-proposed-ka-ra",
            expression:
              "KA + RA",
            components: [
              {
                embryo:
                  "KA",
                gloss:
                  "fixture meaning one",
              },
              {
                embryo:
                  "RA",
                gloss:
                  "fixture meaning two",
              },
            ],
            explanation:
              "fixture proposed explanation",
          }),
        ];

        renderPayload(body);

        expect(
          screen.getByText(
            "Evidence: Reviewed",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getAllByText(
            "DA",
          ).length,
        ).toBeGreaterThanOrEqual(
          1,
        );

        expect(
          screen.queryByText(
            "KA + RA",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "renders the smallest verifier-ordered Proposed candidate and lifts functionalProposal component glosses",
      async () => {
        const body =
          await fatherPayload();

        delete body.rootMap;

        body.candidates = [
          proposed({
            id:
              "fixture-proposed-mi",
            expression:
              "MI",
            components: [
              {
                embryo:
                  "MI",
                gloss:
                  "fixture small meaning",
              },
            ],
            explanation:
              "fixture small proposed explanation",
          }),
          proposed({
            id:
              "fixture-proposed-ka-ra",
            expression:
              "KA + RA",
            components: [
              {
                embryo:
                  "KA",
                gloss:
                  "fixture meaning one",
              },
              {
                embryo:
                  "RA",
                gloss:
                  "fixture meaning two",
              },
            ],
            explanation:
              "fixture large proposed explanation",
          }),
        ];

        const vm =
          renderPayload(body);

        expect(
          vm.candidates[0]
            .functionalComponents
            ?.kind,
        ).toBe(
          "present",
        );

        expect(
          screen.getByText(
            "Evidence: Proposed",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getAllByText(
            "MI",
          ).length,
        ).toBeGreaterThanOrEqual(
          1,
        );

        expect(
          screen.getByText(
            "MI · proposed",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "fixture small meaning",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "KA + RA",
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);
