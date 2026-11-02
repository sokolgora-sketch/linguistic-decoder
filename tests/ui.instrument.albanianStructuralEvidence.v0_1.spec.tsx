import { render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

describe("Albanian structural evidence UI v0.1", () => {
  it("shows source provenance, a complete event partition, and the Gheg proposal as unknown", () => {
    render(
      <InstrumentPanel
        payload={{ word: "planet" }}
        wordForMask="PLANET"
      />,
    );

    const card = screen.getByTestId("albanian-structural-evidence");
    expect(card).toHaveTextContent("A → E");
    expect(card).toHaveTextContent("PLAN (A) + ET (E)");
    expect(card).toHaveTextContent("STRUCTURAL_ONLY");
    expect(card).toHaveTextContent("UNKNOWN");
    expect(card).toHaveTextContent("kaikki-albanian-jsonl:word=planet:ordinal=0");

    const gheg = screen.getByTestId("albanian-gheg-proposal");
    expect(gheg).toHaveTextContent("JET");
    expect(gheg).toHaveTextContent("JETË");
    expect(gheg).toHaveTextContent("source status UNKNOWN");
    expect(gheg).toHaveTextContent("historical derivation");
    expect(gheg).toHaveTextContent("kaikki-albanian-jsonl:word=jet%C3%AB:ordinal=0");
  });

  it("shows a source-supported suffix boundary with explicit sense uncertainty", () => {
    render(
      <InstrumentPanel
        payload={{ word: "shkronjë" }}
        wordForMask="SHKRONJË"
      />,
    );

    const card = screen.getByTestId("albanian-structural-evidence");
    expect(card).toHaveTextContent("O → Ë");
    expect(card).toHaveTextContent("SHKR (no vowel events) + ONJË (O → Ë)");
    expect(card).toHaveTextContent("SOURCE_SUPPORTED");
    expect(card).toHaveTextContent("UNKNOWN");
    expect(card).toHaveTextContent("en-shkronjë-sq-noun-827aZGDv");
  });

  it("keeps unsupported forms as Null in this bounded view", () => {
    render(
      <InstrumentPanel
        payload={{ word: "shkruon" }}
        wordForMask="shkruon"
      />,
    );

    expect(screen.queryByTestId("albanian-structural-evidence")).not.toBeInTheDocument();
  });
});
