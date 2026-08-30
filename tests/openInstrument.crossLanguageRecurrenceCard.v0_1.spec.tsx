/** @jest-environment jsdom */

import React from "react";
import {
  render,
  screen,
} from "@testing-library/react";

import {
  buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceResearchCatalog.v0_1";

import {
  CrossLanguageRecurrenceCardV0_1,
} from "@/ui/instrument/sections/CrossLanguageRecurrenceCard.v0.1";

describe(
  "Open Instrument Cross-Language Recurrence card v0.1",
  () => {
    it(
      "shows the WATER U recurrence with explicit research boundaries",
      () => {
        const result =
          buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
            "water",
          );

        if (
          !result ||
          result.status !==
            "available"
        ) {
          throw new Error(
            "expected available WATER research result",
          );
        }

        render(
          <CrossLanguageRecurrenceCardV0_1
            result={
              result
            }
          />,
        );

        expect(
          screen.getByText(
            "Cross-Language Recurrence",
          ),
        ).toBeTruthy();

        expect(
          screen.getByText(
            "Research hypothesis",
          ),
        ).toBeTruthy();

        expect(
          screen
            .getByTestId(
              "fvr-shared-nucleus",
            )
            .textContent,
        ).toBe(
          "U",
        );

        expect(
          screen.getByText(
            "UOTER",
          ),
        ).toBeTruthy();

        expect(
          screen
            .getByTestId(
              "fvr-mode-separation",
            )
            .textContent,
        ).toMatch(
          /separate from the single-word functional normalization/i,
        );

        expect(
          screen
            .getByTestId(
              "fvr-mode-separation",
            )
            .textContent,
        ).toMatch(
          /does not replace the Analyze V1 functional path/i,
        );

        expect(
          screen.getAllByText(
            "UJ",
          ),
        ).toHaveLength(
          2,
        );

        expect(
          screen.getByText(
            "SHUI",
          ),
        ).toBeTruthy();

        expect(
          screen.getByText(
            /Not historical origin, cognacy, borrowing, candidate truth/i,
          ),
        ).toBeTruthy();

        expect(
          screen.getByRole(
            "link",
            {
              name:
                /Oxford Advanced Learner's Dictionary/i,
            },
          ),
        ).toBeTruthy();

        expect(
          screen.getByRole(
            "link",
            {
              name:
                /Konjunktiv und Infinitiv/i,
            },
          ),
        ).toBeTruthy();

        expect(
          screen.getByRole(
            "link",
            {
              name:
                /Revised Mandarin Chinese Dictionary/i,
            },
          ),
        ).toBeTruthy();
      },
    );
  },
);
