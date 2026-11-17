import { fireEvent, render, screen } from "@testing-library/react";
import { SingleWordMotivationWorkbenchV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";
import { FunctionalMotivationMethodExampleDetailsV0_1 } from "@/ui/instrument/sections/FunctionalMotivationMethodExamplesCardV0_1";
import { getFunctionalMotivationMethodExampleV0_1 } from "@/ui/instrument/sections/functionalMotivationMethodExamplesAdapter.v0_1";

describe("functional-motivation method examples in the Single Word workbench", () => {
  it("starts without a selected example and keeps the current proposal untouched", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="ARBITRARY" />);

    const selector = screen.getByRole("combobox", { name: "Choose a read-only method example" });
    expect(selector).toHaveValue("");
    expect(screen.getByTestId("functional-method-example-empty")).toHaveTextContent(
      "The examples are not defaults for the current word or interpretation.",
    );
    expect(screen.getByLabelText("Exact target word")).toHaveValue("ARBITRARY");
    expect(screen.getByTestId("single-word-evidence-context-unavailable")).toHaveTextContent("Analysis context was not supplied.");
    fireEvent.change(screen.getByLabelText("Component 1 exact spelling"), { target: { value: "AR" } });
    fireEvent.change(screen.getByLabelText("Component 1 proposed meaning"), { target: { value: "draft meaning" } });

    fireEvent.change(selector, { target: { value: "STUDIM" } });

    expect(screen.getByLabelText("Exact target word")).toHaveValue("ARBITRARY");
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("AR");
    expect(screen.getByLabelText("Component 1 proposed meaning")).toHaveValue("draft meaning");
    expect(screen.getByTestId("functional-method-reconstruction")).toHaveTextContent(
      "STU + DI + M = STUDIM",
    );

    fireEvent.change(selector, { target: { value: "NDRIÇIM" } });
    expect(screen.getByLabelText("Exact target word")).toHaveValue("ARBITRARY");
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("AR");
    expect(screen.getByLabelText("Component 1 proposed meaning")).toHaveValue("draft meaning");
    expect(screen.getByTestId("single-word-evidence-context-unavailable")).toHaveTextContent("Analysis context was not supplied.");
  });

  it("keeps native selector labels readable at mobile widths while retaining full example titles", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="ARBITRARY" />);

    const selector = screen.getByRole("combobox", { name: "Choose a read-only method example" });
    expect(Array.from(selector.querySelectorAll("option")).map((option) => option.textContent?.trim())).toEqual([
      "Select an example",
      "STUDIM · proposed",
      "STUDY · comparison",
      "GJITHÇKA · omission",
      "NDRIÇIM · symbolic",
      "DALLIM · symbolic",
    ]);

    for (const [value, title] of [
      ["STUDIM", "STUDIM · proposed two-root reading"],
      ["STUDY", "STUDY · selected-sense comparison"],
      ["GJITHÇKA", "GJITHÇKA · boundary omission example"],
      ["NDRIÇIM", "NDRIÇIM · symbolic composition"],
      ["DALLIM", "DALLIM · symbolic composition"],
    ]) {
      fireEvent.change(selector, { target: { value } });
      expect(screen.getByTestId("functional-method-example-details").querySelector("h3")).toHaveTextContent(title);
      expect(screen.getByLabelText("Exact target word")).toHaveValue("ARBITRARY");
    }
  });

  it("renders NDRIÇIM's computed Voice outputs while keeping its graph-to-meaning result partial Null", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="ARBITRARY" />);
    const selector = screen.getByRole("combobox", { name: "Choose a read-only method example" });
    fireEvent.change(selector, { target: { value: "NDRIÇIM" } });

    expect(screen.getByLabelText("Exact target word")).toHaveValue("ARBITRARY");
    expect(screen.getByTestId("functional-method-code-points-NDRIÇIM")).toHaveTextContent(
      "N@0 · D@1 · R@2 · I@3 · Ç@4 · I@5 · M@6",
    );
    expect(screen.getByTestId("functional-method-written-voices-NDRIÇIM")).toHaveTextContent("I@3 → I@5");
    expect(screen.getByTestId("functional-method-symbolic-NDRIÇIM")).toHaveTextContent("Action according to the meanings of NDRIÇOJ / NDRIÇOHEM");
    expect(screen.getByTestId("functional-method-symbolic-selected-sense")).toHaveTextContent("SOURCE_FACT · CITATION_ENTERED_UNVERIFIED");
    expect(screen.getAllByTestId("functional-method-symbolic-voice-application")[0]).toHaveTextContent("focused(light)");
    expect(screen.getAllByTestId("functional-method-symbolic-voice-application")[1]).toHaveTextContent("focused(emit)");
    expect(screen.getAllByTestId("functional-method-symbolic-voice-application").map((node) => node.getAttribute("data-voice-event"))).toEqual([
      "voice:I@3",
      "voice:I@5",
    ]);
    expect(screen.getByTestId("functional-method-symbolic-bridge-status")).toHaveTextContent(
      "PARTIAL_NULL · selected sense UNKNOWN_OR_NULL · GRAPH_MEANING_MAPPING_NOT_PROVIDED",
    );
    expect(screen.getByTestId("functional-method-symbolic-explanation-null")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByTestId("functional-method-symbolic-paraphrase")).toHaveTextContent("USER_PROPOSED_PARAPHRASE");
    expect(screen.getByTestId("functional-method-symbolic-morphology")).toHaveTextContent(
      "NDRIÇ + IM = NDRIÇIM · EXACT_MATCH · USER_PROPOSAL",
    );
    expect(screen.getByTestId("functional-method-no-winner")).toHaveTextContent("no_single_winner");
    expect(screen.getByTestId("functional-method-symbolic-operation-trace")).toBeInTheDocument();
    expect(screen.getByTestId("functional-method-symbolic-selected-spectra")).toBeInTheDocument();
    expect(screen.getAllByText(/Source-authority promotion: NONE/).length).toBeGreaterThan(0);
  });

  it("renders DALLIM's distinct A/I applications, repeated L occurrences and typed proposed mappings", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="ARBITRARY" />);
    const selector = screen.getByRole("combobox", { name: "Choose a read-only method example" });
    fireEvent.change(selector, { target: { value: "DALLIM" } });

    expect(screen.getByLabelText("Exact target word")).toHaveValue("ARBITRARY");
    expect(screen.getByTestId("functional-method-code-points-DALLIM")).toHaveTextContent(
      "D@0 · A@1 · L@2 · L@3 · I@4 · M@5",
    );
    expect(screen.getByTestId("functional-method-written-voices-DALLIM")).toHaveTextContent("A@1 → I@4");
    expect(screen.getAllByTestId("functional-method-symbolic-voice-application")).toHaveLength(2);
    expect(screen.getAllByTestId("functional-method-symbolic-voice-application")[0]).toHaveTextContent("initiated(division)");
    expect(screen.getAllByTestId("functional-method-symbolic-voice-application")[1]).toHaveTextContent("focused(linear flow)");
    expect(screen.getAllByTestId("functional-method-symbolic-voice-application").map((node) => node.getAttribute("data-voice-event"))).toEqual([
      "voice:A@1",
      "voice:I@4",
    ]);
    const lSelections = screen.getAllByTestId("functional-method-symbolic-spectrum")
      .filter((node) => node.getAttribute("data-unit") === "L");
    expect(lSelections.map((node) => node.getAttribute("data-span-start"))).toEqual(["2", "3"]);
    expect(lSelections[0]).toHaveTextContent("spreading");
    expect(lSelections[1]).toHaveTextContent("linear flow");
    expect(screen.getByTestId("functional-method-symbolic-graph-mappings")).toBeInTheDocument();
    expect(screen.getAllByTestId("functional-method-symbolic-graph-mapping")).toHaveLength(2);
    expect(screen.getAllByTestId("functional-method-symbolic-graph-mapping")[0]).toHaveTextContent(
      "selected sense dallim.action-of-distinguishing",
    );
    expect(screen.getByTestId("functional-method-symbolic-bridge-status")).toHaveTextContent("MULTIPLE_PROPOSED");
    expect(screen.getAllByTestId("functional-method-symbolic-explanation")).toHaveLength(2);
    expect(screen.getByTestId("functional-method-symbolic-morphology")).toHaveTextContent(
      "DALL + IM = DALLIM · EXACT_MATCH · USER_PROPOSAL",
    );
    expect(screen.getByTestId("functional-method-symbolic-morphology")).toHaveTextContent("does not establish a function for IM");
    expect(screen.getByTestId("functional-method-symbolic-selected-sense")).toHaveTextContent("CITATION_ENTERED_UNVERIFIED");
    expect(screen.getByTestId("functional-method-no-winner")).toHaveTextContent("user_decides");
    expect(screen.getByTestId("functional-method-symbolic-operation-trace")).toBeInTheDocument();
  });

  it("changes rendered computed NDRIÇIM output when the selected spectrum input changes", () => {
    const light = getFunctionalMotivationMethodExampleV0_1("NDRIÇIM");
    const direction = getFunctionalMotivationMethodExampleV0_1("NDRIÇIM", { dAssociation: "direction" });
    expect(light?.symbolic?.evaluatorStatus).toBe("COMPLETE_PROPOSED");
    expect(direction?.symbolic?.evaluatorStatus).toBe("COMPLETE_PROPOSED");
    if (!light || !direction) return;

    const view = render(<FunctionalMotivationMethodExampleDetailsV0_1 example={light} />);
    expect(screen.getByTestId("functional-method-symbolic-computed-output")).toHaveTextContent("focused(light)");
    expect(screen.getByTestId("functional-method-symbolic-summary")).toHaveTextContent("PARTIAL_NULL");

    view.rerender(<FunctionalMotivationMethodExampleDetailsV0_1 example={direction} />);
    expect(screen.getByTestId("functional-method-symbolic-computed-output")).toHaveTextContent("focused(direction)");
    expect(screen.getByTestId("functional-method-symbolic-computed-output")).not.toHaveTextContent("focused(light)");
    expect(screen.getByTestId("functional-method-symbolic-selected-spectra")).toHaveTextContent("D@1 [1,2) → direction");
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
    expect(screen.getAllByTestId("functional-method-component").at(-1)).toHaveTextContent("UNKNOWN_OR_NULL");
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
    expect(equation).toHaveTextContent("LOGICAL_INFERENCE · USER_PROPOSED");
    expect(equation).toHaveTextContent("free_operator_attested");
    expect(equation).toHaveTextContent("No Zheji operator status is asserted");
    expect(equation).toHaveTextContent("M: UNKNOWN_OR_NULL");
    expect(equation).toHaveTextContent("CITATION_ENTERED_UNVERIFIED");
    expect(screen.getByTestId("functional-method-equation-attribution")).toHaveTextContent(
      "PETRO_ZHEJI_INSPIRED_RECONSTRUCTION",
    );
    expect(screen.getByTestId("functional-method-equation-attribution")).toHaveTextContent(
      "local ZË-RO explanatory framework; not a universal formula authored by Zheji or a historical attribution",
    );
    expect(screen.getByTestId("functional-method-pattern-action")).toHaveTextContent("ACTION: increase");
    expect(screen.getByTestId("functional-method-pattern-patient")).toHaveTextContent("PATIENT: knowledge");
    expect(screen.getByTestId("functional-method-pattern-result")).toHaveTextContent("RESULT: acquisition of knowledge");
    expect(screen.getByTestId("functional-method-pattern-whole-word-function")).toHaveTextContent("WHOLE-WORD FUNCTION: studying");
    expect(screen.getByTestId("functional-method-explanation-pattern")).toBeInTheDocument();
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
    const gjithckaEquation = screen.getByTestId("functional-motivation-equation");
    expect(gjithckaEquation).toHaveTextContent(
      "GJITHË (all / whole) + ÇKA (what / that which) → everything → GJITHÇKA (all things; everything)",
    );
    expect(gjithckaEquation).toHaveTextContent("LOGICAL_INFERENCE · USER_PROPOSED");
    expect(gjithckaEquation).toHaveTextContent("Source-authority promotion: NONE");
    expect(screen.getByTestId("functional-method-equation-attribution")).toHaveTextContent(
      "Source-reported compound notation: Myrta (2014) reports Topalli (2011)",
    );
    expect(screen.getByTestId("functional-method-equation-attribution")).toHaveTextContent("SOURCE_FACT · CITATION_ENTERED_UNVERIFIED");
    expect(screen.getByTestId("functional-method-equation-attribution")).not.toHaveTextContent(
      "PETRO_ZHEJI_INSPIRED_RECONSTRUCTION",
    );
    expect(screen.queryByTestId("functional-method-explanation-pattern")).not.toBeInTheDocument();
    expect(screen.getByTestId("functional-method-reasoning-trace")).toHaveTextContent("Myrta 2014 reports the notation");
    expect(screen.getByTestId("functional-method-reasoning-trace")).toHaveTextContent(/alternatives may coexist/i);
    const components = screen.getAllByTestId("functional-method-component");
    expect(components[0]).toHaveTextContent("component-concatenation code-point span [0,6)");
    expect(components[1]).toHaveTextContent("component-concatenation code-point span [6,9)");
    expect(screen.getByTestId("functional-method-code-points-GJITHÇKA")).toHaveTextContent(
      "G@0 · J@1 · I@2 · T@3 · H@4 · Ç@5 · K@6 · A@7",
    );
    expect(screen.getByTestId("functional-method-written-voices-GJITHÇKA")).toHaveTextContent("I@2 → A@7");
    expect(screen.getByTestId("functional-method-reconstruction")).toHaveTextContent("MISMATCH");
    expect(screen.getByTestId("functional-method-surface-reconciliation")).toHaveTextContent(
      "Exact surface reconciliation EXACT_MATCH via gjithcka-boundary-e-omission: GJITHËÇKA → GJITHÇKA",
    );
    expect(screen.getByTestId("functional-method-surface-reconciliation")).toHaveTextContent("cost 1 · inverse GJITHËÇKA (EXACT_MATCH)");
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
