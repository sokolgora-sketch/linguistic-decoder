import { fireEvent, render, screen } from "@testing-library/react";
import { GET } from "../app/api/analyze-v1/route";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import type { MotivationDiscoveryV0_2VM, TelemetryViewModel } from "@/ui/telemetry/types";

jest.mock("@/ui/instrument/sections/MotivationDiscoveryCard.v0_1", () => {
  const React = require("react") as typeof import("react");
  return {
    MotivationDiscoveryCardV0_1: ({
      onRuntimeSourceResponse,
      functionalReasoning,
    }: {
      onRuntimeSourceResponse?: (response: unknown) => void;
      functionalReasoning?: { candidates: readonly { familyNetwork: { functionalEquation: string | null } }[] } | null;
    }) => React.createElement("div", null,
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
          recordSources: ["sq-wiktionary", "editor"],
          senses: [{
            entryIndex: 1,
            senseIndex: 1,
            partOfSpeech: "noun",
            gloss: "division; separation",
            glossLanguage: "en",
            senseSource: "sq-wiktionary",
            tags: ["noun"],
            entrySources: ["sq-wiktionary", "editor"],
          }],
        }),
      }, "Emit Fjalori response"),
      React.createElement("output", { "data-testid": "instrument-panel-automatic-reasoning" },
        functionalReasoning?.candidates[0]?.familyNetwork.functionalEquation ?? "PARTIAL_NULL"),
    ),
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

function panelVm(word: string): TelemetryViewModel {
  const base = adaptAnalysisToTelemetryVM(payload(word));
  const discovery = {
    inputWord: word,
    inputLanguage: "sq",
    inputProfile: "albanian",
    exactLexicalSourceFacts: [],
  } as unknown as MotivationDiscoveryV0_2VM;
  return {
    ...base,
    motivationDiscoveryV0_2: { kind: "present", value: discovery },
  };
}

describe("InstrumentPanel Fjalori source-response identity handoff", () => {
  it("passes existing Analyze candidate rows into the primary reading", async () => {
    const response = await GET(new Request(
      "http://localhost/api/analyze-v1?word=study&mode=strict&alphabet=albanian&providerExecution=disabled",
    ));
    expect(response.status).toBe(200);
    const vm = adaptAnalysisToTelemetryVM(await response.json());

    render(<InstrumentPanel vm={vm} />);

    expect(screen.getByTestId("human-reading-meaning-unavailable")).toBeInTheDocument();
    const candidates = screen.getAllByTestId("human-reading-functional-candidate");
    expect(candidates).toHaveLength(2);
    expect(candidates.some((candidate) => candidate.textContent?.includes("SHTU + DI → STUDY"))).toBe(true);
    expect(candidates.some((candidate) => candidate.textContent?.includes("DI → STUDY"))).toBe(true);
    expect(screen.getByText("More than one possible reading is available; you decide.")).toBeInTheDocument();
    expect(screen.queryByTestId("human-reading-functional-null")).not.toBeInTheDocument();
  });

  it("passes the current response to the workbench and withholds it after the analyzed word changes", () => {
    const view = render(<InstrumentPanel vm={panelVm("NDARJE")} />);

    expect(screen.getByTestId("human-reading-word")).toHaveTextContent("NDARJE");
    expect(screen.getByTestId("instrument-tab-details-overview")).not.toHaveAttribute("open");
    for (const section of ["overview", "my-interpretation", "evidence", "candidates", "roots", "advanced"]) {
      expect(screen.getByTestId(`instrument-tab-details-${section}`)).not.toHaveAttribute("open");
    }
    expect(screen.getByTestId("instrument-panel-automatic-reasoning")).toHaveTextContent("PARTIAL_NULL");
    fireEvent.click(screen.getByRole("button", { name: "Emit Fjalori response" }));
    expect(screen.getByTestId("instrument-panel-fjalori-workbench-prop")).toHaveTextContent(
      "NDARJE · available · ndarje",
    );
    expect(screen.getByTestId("instrument-panel-automatic-reasoning")).toHaveTextContent(
      "DA (“to split, cut, divide”; source-reported verb function)",
    );
    expect(screen.getByTestId("human-reading-meaning")).toHaveTextContent("division; separation");

    view.rerender(<InstrumentPanel vm={panelVm("DALLIM")} />);
    expect(screen.getByTestId("human-reading-word")).toHaveTextContent("DALLIM");
    expect(screen.getByTestId("instrument-panel-fjalori-workbench-prop")).toHaveTextContent(
      "DALLIM · UNKNOWN_OR_NULL · UNKNOWN_OR_NULL",
    );
    expect(screen.getByTestId("instrument-panel-automatic-reasoning")).toHaveTextContent("PARTIAL_NULL");
  });
});
