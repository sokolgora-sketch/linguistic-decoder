import { fireEvent, render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

jest.mock("@/ui/instrument/sections/MotivationDiscoveryCard.v0_1", () => {
  const React = require("react") as typeof import("react");
  return {
    MotivationDiscoveryCardV0_1: ({ onRuntimeSourceResponse }: { onRuntimeSourceResponse?: (response: unknown) => void }) =>
      React.createElement("button", {
        type: "button",
        onClick: () => onRuntimeSourceResponse?.({
          requestKey: "NDARJE\u0000ndarje",
          queryForm: "NDARJE",
          status: "available",
          exactSourceForm: "ndarje",
          apiUrl: "https://fjalorishqip.org/api/v1/fjala/ndarje.json",
          licence: "CC BY-SA 4.0",
          analysisLanguage: "sq",
          analysisVariety: "albanian",
          recordSources: ["sq-wiktionary"],
          senses: [],
        }),
      }, "Emit Fjalori response"),
  };
});

jest.mock("@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1", () => {
  const React = require("react") as typeof import("react");
  return {
    SingleWordMotivationWorkbenchV0_1: ({
      initialTargetWord,
      runtimeFjaloriSourceResponse,
    }: {
      initialTargetWord: string;
      runtimeFjaloriSourceResponse?: { status: string; exactSourceForm: string | null } | null;
    }) => React.createElement(
      "output",
      { "data-testid": "instrument-panel-fjalori-workbench-prop" },
      `${initialTargetWord} · ${runtimeFjaloriSourceResponse?.status ?? "UNKNOWN_OR_NULL"} · ${runtimeFjaloriSourceResponse?.exactSourceForm ?? "UNKNOWN_OR_NULL"}`,
    ),
  };
});

function payload(word: string) {
  return {
    word,
    sanitized: word.toLocaleLowerCase("sq-AL"),
    engineVersion: "0.2.0-symbolic",
    mode: "strict",
    candidates: [],
    evidence: { ops: [], notes: [], signals: [], normalizationSteps: [] },
    heart: { mode: "strict", alphabet: "Latin" },
    primaryPath: { voicePath: [] },
  };
}

describe("InstrumentPanel Fjalori source-response identity handoff", () => {
  it("passes the current response to the workbench and withholds it after the analyzed word changes", () => {
    const view = render(<InstrumentPanel payload={payload("NDARJE")} />);

    fireEvent.click(screen.getByRole("button", { name: "Emit Fjalori response" }));
    expect(screen.getByTestId("instrument-panel-fjalori-workbench-prop")).toHaveTextContent(
      "NDARJE · available · ndarje",
    );

    view.rerender(<InstrumentPanel payload={payload("DALLIM")} />);
    expect(screen.getByTestId("instrument-panel-fjalori-workbench-prop")).toHaveTextContent(
      "DALLIM · UNKNOWN_OR_NULL · UNKNOWN_OR_NULL",
    );
  });
});
