import { render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

describe("general orthographic structural evidence UI v0.1", () => {
  it("shows PLANET structure and labels the Kaikki row as a same-form reference", () => {
    render(
      <InstrumentPanel
        payload={{ word: "planet" }}
        wordForMask="PLANET"
      />,
    );

    const card = screen.getByTestId("albanian-structural-evidence");
    expect(card).toHaveTextContent("Orthographic structural analysis");
    expect(card).toHaveTextContent("A → E");
    expect(card).toHaveTextContent("SAME_FORM_SOURCE_REFERENCE");
    expect(card).toHaveTextContent("does not establish the input language");
    expect(card).toHaveTextContent("UNKNOWN");

    const gheg = screen.getByTestId("albanian-gheg-proposal");
    expect(gheg).toHaveTextContent("PLAN + JET → PLANET");
    expect(gheg).toHaveTextContent("JET");
    expect(gheg).toHaveTextContent("JETË");
    expect(gheg).toHaveTextContent("No historical derivation is claimed");
  });

  it.each([
    { word: "SHKRUAJ", voices: "U → A" },
    { word: "SHKRIM", voices: "I" },
    { word: "SHKRONJË", voices: "O → Ë" },
  ])("shows general analysis and optional source comparison for $word", ({ word, voices }) => {
    render(
      <InstrumentPanel
        payload={{ word: word.toLocaleLowerCase("en-US") }}
        wordForMask={word}
      />,
    );

    const card = screen.getByTestId("albanian-structural-evidence");
    expect(card).toHaveTextContent(voices);
    expect(card).toHaveTextContent("SAME_FORM_SOURCE_REFERENCE");
    expect(card).toHaveTextContent("Exact target-sense alignment: UNKNOWN");
  });

  it.each([
    { word: "SHKRIM", segmentation: "SHKR | IM" },
    { word: "SHKRONJË", segmentation: "SHKR | ONJË" },
  ])("does not equate source affix evidence with an engine reduction for $word", ({
    word,
    segmentation,
  }) => {
    render(
      <InstrumentPanel
        payload={{ word: word.toLocaleLowerCase("en-US") }}
        wordForMask={word}
      />,
    );

    const card = screen.getByTestId("albanian-structural-evidence");
    expect(screen.getByTestId("source-surface-segmentation")).toHaveTextContent(segmentation);
    expect(screen.getByTestId("source-surface-segmentation-status")).toHaveTextContent("SOURCE_REPORTED");
    expect(screen.getByTestId("engine-reduction-comparison")).toHaveTextContent("NO_MATCHING_REDUCTION");
    expect(card).toHaveTextContent("Source base/surface alignment: UNKNOWN");
  });

  it("shows the generic orthographic analysis for BLETAR without a source reference", () => {
    render(
      <InstrumentPanel
        payload={{ word: "bletar" }}
        wordForMask="BLETAR"
      />,
    );

    const card = screen.getByTestId("albanian-structural-evidence");
    expect(card).toHaveTextContent("E → A");
    expect(card).toHaveTextContent("B · L · E · T · A · R");
    expect(card).toHaveTextContent("Source provenance, lexical identity, morphology, and exact sense alignment: Unknown / Null.");
    expect(screen.queryByTestId("albanian-source-reference")).not.toBeInTheDocument();
  });

  it("keeps unsupported forms as Null", () => {
    render(
      <InstrumentPanel
        payload={{ word: "résumé" }}
        wordForMask="Résumé"
      />,
    );

    expect(screen.queryByTestId("albanian-structural-evidence")).not.toBeInTheDocument();
  });
});
