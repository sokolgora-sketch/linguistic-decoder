import React from "react";
import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";

import {
  GET,
} from "../app/api/analyze-v1/route";

import ZroChatPage from "../src/components/ZroChatPage";
import {
  InstrumentPanel,
} from "../src/ui/instrument/InstrumentPanel";

async function analyze(
  word: string,
): Promise<any> {
  const response =
    await GET(
      new Request(
        `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
      ),
    );

  expect(response.status).toBe(200);

  return response.json();
}

describe(
  "Open Instrument Slice F simple product surface",
  () => {
    it(
      "makes study word-first and Functional Motivation first while collapsing deterministic details",
      async () => {
        const body =
          await analyze("study");

        render(
          <InstrumentPanel
            payload={body}
          />,
        );

        expect(
          screen.getByTestId(
            "instrument-word",
          ),
        ).toHaveTextContent(
          "study",
        );

        const overviewPanel =
          screen.getByRole(
            "tabpanel",
          );

        expect(
          within(
            overviewPanel,
          ).getByText(
            "SHTU + DI",
          ),
        ).toBeVisible();

        expect(
          within(
            overviewPanel,
          ).getByText(
            "Evidence: Partial",
          ),
        ).toBeVisible();

        expect(
          screen.queryByText(
            "active surface",
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByText(
            "section=overview",
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByText(
            "ZË-RO Open Instrument",
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.getByTestId(
            "deterministic-details",
          ),
        ).not.toHaveAttribute(
          "open",
        );
      },
    );

    it(
      "keeps candidate records collapsed and supported DA primary",
      async () => {
        const body =
          await analyze("damage");

        render(
          <InstrumentPanel
            payload={body}
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "tab",
            {
              name:
                "Candidates",
            },
          ),
        );

        const candidatesPanel =
          screen.getByRole(
            "tabpanel",
          );

        expect(
          within(
            candidatesPanel,
          ).getByText(
            "Evidence: Reviewed",
          ),
        ).toBeVisible();

        const summary =
          within(
            candidatesPanel,
          ).getByText(
            "Other candidate records",
          );

        expect(
          summary.closest(
            "details",
          ),
        ).not.toHaveAttribute(
          "open",
        );
      },
    );

    it(
      "keeps Meaning and detailed boundary available off the primary Overview",
      async () => {
        const body =
          await analyze("father");

        render(
          <InstrumentPanel
            payload={body}
          />,
        );

        const overviewPanel =
          screen.getByRole(
            "tabpanel",
          );

        expect(
          within(
            overviewPanel,
          ).getByText(
            "No supported functional candidate yet.",
          ),
        ).toBeVisible();

        const meaning =
          screen.getByTestId(
            "roots-meaning-reading",
          );

        const boundary =
          screen.getByTestId(
            "advanced-boundary",
          );

        expect(
          meaning,
        ).not.toBeVisible();

        expect(
          boundary,
        ).not.toBeVisible();

        fireEvent.click(
          screen.getByRole(
            "tab",
            {
              name:
                "Roots / Meaning",
            },
          ),
        );

        expect(
          meaning,
        ).toBeVisible();

        fireEvent.click(
          screen.getByRole(
            "tab",
            {
              name:
                "Advanced",
            },
          ),
        );

        expect(
          boundary,
        ).toBeVisible();
      },
    );

    it(
      "uses a simple normal empty state",
      () => {
        render(
          <ZroChatPage />,
        );

        expect(
          screen.getByText(
            "Analyze one word",
          ),
        ).toBeVisible();

        expect(
          screen.getByText(
            "Functional motivation for one word",
          ),
        ).toBeVisible();

        expect(
          screen.queryByText(
            "VM-backed readout",
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByText(
            "Evidence-first",
          ),
        ).not.toBeInTheDocument();

        expect(
          screen.queryByText(
            "Open Instrument ready",
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);
