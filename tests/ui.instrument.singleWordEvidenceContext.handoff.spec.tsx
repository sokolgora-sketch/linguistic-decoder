import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

const toastSpy = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastSpy }),
}));

describe("InstrumentPanel current-word evidence handoff", () => {
  it("passes explicit malformed/missing Discovery state into My Interpretation without inventing Albanian facts", () => {
    render(
      <InstrumentPanel
        payload={{
          word: "KANDIL",
          motivationDiscoveryV0_1: { inputWord: "KANDIL" },
        }}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "My Interpretation" }));

    const evidence = screen.getByTestId("single-word-current-evidence");
    expect(evidence).toHaveTextContent("KANDIL");
    expect(screen.getByTestId("single-word-discovery-missing")).toHaveTextContent("MISSING · malformed");
    expect(evidence).not.toHaveTextContent("oil lamp");
    expect(screen.getByLabelText("Component 1 proposed meaning")).toHaveValue("");
  });

  it("switches the evidence context and resets proposal state with the analyzed word", () => {
    const { rerender } = render(
      <InstrumentPanel
        payload={{
          word: "KANDIL",
          motivationDiscoveryV0_1: { inputWord: "KANDIL" },
        }}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "My Interpretation" }));
    fireEvent.change(screen.getByLabelText("Component 1 exact spelling"), {
      target: { value: "KAN" },
    });
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("KAN");

    rerender(
      <InstrumentPanel
        payload={{
          word: "DRITARE",
          motivationDiscoveryV0_1: null,
        }}
      />,
    );

    const evidence = screen.getByTestId("single-word-current-evidence");
    expect(evidence).toHaveTextContent("DRITARE");
    expect(evidence).not.toHaveTextContent("KANDIL");
    expect(screen.getByTestId("single-word-discovery-missing")).toHaveTextContent("not_emitted");
    expect(screen.getByLabelText("Exact target word")).toHaveValue("DRITARE");
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("");
    expect(screen.getByTestId("single-word-mechanical-result")).toHaveAttribute(
      "data-status",
      "NOT_SUBMITTED",
    );
  });
});
