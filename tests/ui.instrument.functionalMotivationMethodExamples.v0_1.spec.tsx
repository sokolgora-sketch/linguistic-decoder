import { fireEvent, render, screen } from "@testing-library/react";
import { SingleWordMotivationWorkbenchV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";

describe("functional-motivation method examples in the Single Word workbench", () => {
  it("starts without a selected example and keeps the current proposal untouched", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="ARBITRARY" />);

    const selector = screen.getByRole("combobox", { name: "Choose a read-only method example" });
    expect(selector).toHaveValue("");
    expect(screen.getByTestId("functional-method-example-empty")).toHaveTextContent(
      "The examples are not defaults for the current word or interpretation.",
    );
    expect(screen.getByLabelText("Exact target word")).toHaveValue("ARBITRARY");

    fireEvent.change(selector, { target: { value: "STUDIM" } });

    expect(screen.getByLabelText("Exact target word")).toHaveValue("ARBITRARY");
    expect(screen.getByTestId("functional-method-reconstruction")).toHaveTextContent(
      "STU + DI + M = STUDIM",
    );
  });

  it("exposes the STUDIM method layers, exact spelling, reversible H omission, alternatives and Null", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="STUDIM" />);
    fireEvent.change(screen.getByRole("combobox", { name: "Choose a read-only method example" }), {
      target: { value: "STUDIM" },
    });

    expect(screen.getByTestId("functional-method-code-points-STUDIM")).toHaveTextContent(
      "S@0 · T@1 · U@2 · D@3 · I@4 · M@5",
    );
    expect(screen.getByTestId("functional-method-written-voices-STUDIM")).toHaveTextContent("U@2 → I@4");
    expect(screen.getByTestId("functional-method-reading")).toHaveTextContent("SHTU (add / increase) + DI (know / knowledge)");
    expect(screen.getByTestId("functional-method-reading")).toHaveTextContent("USER_PROPOSED");
    expect(screen.getByTestId("functional-method-reconstruction")).toHaveTextContent("STU + DI + M = STUDIM");
    expect(screen.getByTestId("functional-method-reconstruction")).toHaveTextContent("EXACT_MATCH");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("SHTU → STU");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("OMIT (OMIT.v0_2)");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("Position 1");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("exact removed text “H”");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("Inverse replay: SHTU · EXACT_MATCH");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("linguistic applicability NOT_ASSESSED");
    expect(screen.getByText(/Final M remains UNKNOWN_OR_NULL/)).toBeInTheDocument();
    expect(screen.getByText(/ordinary STUDIOJ \/ -IM lexical-morphological account/)).toBeInTheDocument();
    expect(screen.getByText(/SHTIM: Retain as the existing contrast/)).toBeInTheDocument();
    expect(screen.getAllByText(/CITATION_ENTERED_UNVERIFIED/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/licensing NOT_ASSESSED/).length).toBeGreaterThan(0);
  });

  it("connects STUDIM evidence to a conditional embryo-to-whole reading without source promotion", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="STUDIM" />);
    fireEvent.change(screen.getByRole("combobox", { name: "Choose a read-only method example" }), {
      target: { value: "STUDIM" },
    });

    const trace = screen.getByTestId("functional-method-reasoning-trace");
    const equation = screen.getByTestId("functional-motivation-equation");
    expect(equation).toHaveTextContent("SHTU (proposed increase function) + DI (know / knowledge) → Increasing or acquiring knowledge → STUDIM (the activity of studying)");
    expect(equation).toHaveTextContent("USER_PROPOSED · PETRO_ZHEJI_INSPIRED_RECONSTRUCTION");
    expect(equation).toHaveTextContent("free_operator_attested");
    expect(equation).toHaveTextContent("No Zheji operator status is asserted");
    expect(equation).toHaveTextContent("M: UNKNOWN_OR_NULL");
    expect(equation).toHaveTextContent("citation entered unverified");
    expect(equation.compareDocumentPosition(trace) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const steps = screen.getAllByTestId("functional-method-reasoning-step");
    expect(steps).toHaveLength(9);
    expect(steps.map((step) => step.getAttribute("data-trace-step-id"))).toEqual([
      "whole-word-sense",
      "di-target-span",
      "di-lexical-function",
      "shtoj-context",
      "shtu-stu-correspondence",
      "component-interaction",
      "surface-reconstruction",
      "ordinary-morphology-alternative",
      "unresolved-material",
    ]);
    expect(steps[0]).toHaveTextContent("STUDIM");
    expect(steps[0]).toHaveTextContent("studying; acquiring knowledge");
    expect(steps[0]).toHaveTextContent("CITATION_ENTERED_UNVERIFIED");

    expect(steps[1]).toHaveTextContent("STUDIM code-point span [3,5): DI");
    expect(steps[1]).toHaveTextContent("DERIVED_STRUCTURE");
    expect(steps[1]).toHaveTextContent("does not by itself establish a morpheme boundary");

    const diStep = steps.find((step) => step.textContent?.includes("DI lexical embryo candidate"));
    expect(diStep).toHaveTextContent("DI");
    expect(diStep).toHaveTextContent("know / knowledge");
    expect(diStep).toHaveTextContent("FJALË · DI");
    expect(diStep).toHaveTextContent("no more specific locator is supplied here");
    expect(diStep).toHaveTextContent("does not prove that DI is a historical or grammatical component");

    const increaseContext = steps.find((step) => step.textContent?.includes("Expansion context for the proposed increase function"));
    expect(increaseContext).toHaveTextContent("SHTOJ");
    expect(increaseContext).toHaveTextContent("does not attest SHTU as a component");

    const spellingOperation = screen.getByTestId("functional-method-trace-operation-shtu-stu-correspondence");
    expect(spellingOperation).toHaveTextContent("SHTU → STU");
    expect(spellingOperation).toHaveTextContent("OMIT H at zero-based code-point position 1");
    expect(spellingOperation).toHaveTextContent("cost 1");
    expect(spellingOperation).toHaveTextContent("inverse SHTU (EXACT_MATCH)");
    expect(steps[4]).toHaveTextContent("USER_DECLARED_UNVERIFIED");
    expect(steps[4]).toHaveTextContent("linguistic applicability NOT_ASSESSED");

    const synthesis = steps.find((step) => step.textContent?.includes("Conditional component interaction"));
    expect(synthesis).toHaveTextContent("Increasing or acquiring knowledge through study");
    expect(synthesis).toHaveTextContent("LOGICAL_INFERENCE · USER_PROPOSED");
    expect(synthesis).toHaveTextContent("Neither entry source-establishes the SHTU + DI segmentation");

    const reconstruction = steps.find((step) => step.textContent?.includes("Target-side spelling reconstruction"));
    expect(reconstruction).toHaveTextContent("STU + DI + M = STUDIM");
    expect(reconstruction).toHaveTextContent("EXACT_MATCH");
    expect(reconstruction).toHaveTextContent("final M remains UNKNOWN_OR_NULL");

    const alternative = steps.find((step) => step.textContent?.includes("Separate lexical-morphological alternative"));
    expect(alternative).toHaveTextContent("STUDIOJ");
    expect(alternative).toHaveTextContent("specific -IM derivation is not independently verified");
    expect(screen.getByTestId("functional-method-source-fidelity")).toHaveTextContent("PETRO_ZHEJI_SOURCE_REPORTED");
    expect(screen.getByTestId("functional-method-source-fidelity")).toHaveTextContent("PETRO_ZHEJI_INSPIRED_RECONSTRUCTION");
    expect(screen.getByTestId("functional-method-source-fidelity")).toHaveTextContent("ZERO_ORIGINAL_DOCTRINE");
    expect(screen.getByTestId("functional-method-source-fidelity")).toHaveTextContent("OPEN_INSTRUMENT_ENGINEERING");
    expect(screen.getByTestId("functional-method-source-fidelity")).toHaveTextContent("grant no source or production authority");
    expect(screen.getByTestId("functional-method-source-fidelity")).toHaveTextContent("UNKNOWN");
    expect(trace).toHaveTextContent("Source reference: none entered for this relationship.");
    expect(screen.getByText(/alternatives may coexist, and interpretation remains with the user/)).toBeInTheDocument();
  });

  it("keeps STUDY orthographic-only and renders the GJITHÇKA omission and family contrast", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="STUDY" />);
    const selector = screen.getByRole("combobox", { name: "Choose a read-only method example" });

    fireEvent.change(selector, { target: { value: "STUDY" } });
    expect(screen.getByTestId("functional-method-written-voices-STUDY")).toHaveTextContent("U@2 → Y@4");
    expect(screen.getByTestId("functional-method-written-voices-STUDIM")).toHaveTextContent("U@2 → I@4");
    expect(screen.getByTestId("functional-method-no-components")).toHaveTextContent("No component decomposition is proposed for English STUDY");
    expect(screen.getByTestId("functional-method-no-operations")).toHaveTextContent("No mechanical correspondence is asserted");
    expect(screen.getByTestId("functional-method-reconstruction")).toHaveTextContent("Shared written sequence STUD");
    expect(screen.getByTestId("functional-method-reconstruction")).toHaveTextContent("NOT_ASSERTED");
    expect(screen.getByText(/no shared semantic root or historical relationship is claimed/)).toBeInTheDocument();

    fireEvent.change(selector, { target: { value: "GJITHÇKA" } });
    expect(screen.getByTestId("functional-method-code-points-GJITHÇKA")).toHaveTextContent(
      "G@0 · J@1 · I@2 · T@3 · H@4 · Ç@5 · K@6 · A@7",
    );
    expect(screen.getByTestId("functional-method-written-voices-GJITHÇKA")).toHaveTextContent("I@2 → A@7");
    expect(screen.getByTestId("functional-method-reconstruction")).toHaveTextContent("MISMATCH");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("GJITHËÇKA → GJITHÇKA");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("Position 5");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("removed span [5,6)");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("exact removed text “Ë”");
    expect(screen.getByTestId("functional-method-omitted-voices")).toHaveTextContent("Ë@5");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("Voices before: I@2 → Ë@5 → A@8");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("Voices after: I@2 → A@7");
    expect(screen.getByTestId("functional-method-operation")).toHaveTextContent("Inverse replay: GJITHËÇKA · EXACT_MATCH");
    expect(screen.getAllByTestId("functional-method-contrast").some((element) =>
      element.textContent?.includes("GJITHËKOMBËTAR: gjithë + kombëtar → gjithëkombëtar; boundary Ë retained in the listed form"),
    )).toBe(true);
    expect(screen.getByText(/no universal deletion rule is inferred/)).toBeInTheDocument();
  });
});
