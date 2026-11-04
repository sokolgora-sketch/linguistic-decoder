import { fireEvent, render, screen } from "@testing-library/react";
import { SingleWordMotivationWorkbenchV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";

describe("Single-word motivation workbench v0.1", () => {
  it("lets a user inspect the KANDIL proposal and keeps mismatch, unverified evidence, and embryo Null visible", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    fireEvent.click(screen.getByTestId("single-word-add-component"));

    const values = [
      ["Component 1 exact spelling", "KA"],
      ["Component 1 proposed meaning", "has"],
      ["Component 1 grammatical role", "third-person singular verb"],
      ["Component 1 language", "Albanian"],
      ["Component 1 evidence status", "CITATION_ENTERED_UNVERIFIED"],
      ["Component 1 evidence reference", "FJALË: kam, 3sg ka"],
      ["Component 2 exact spelling", "N"],
      ["Component 2 language", "Albanian"],
      ["Component 3 exact spelling", "DILL"],
      ["Component 3 proposed meaning", "sun"],
      ["Component 3 grammatical role", "noun"],
      ["Component 3 language", "Albanian"],
      ["Component 3 dialect", "Gheg"],
      ["Component 3 evidence status", "CITATION_ENTERED_UNVERIFIED"],
      ["Component 3 evidence reference", "IE-CoR Cognate Set 491"],
      ["Unexplained connecting material", "N role and LL/L correspondence remain unexplained."],
      ["Proposed functional explanation", "Has sun / carries light"],
      ["Transparency description", "METAPHORICAL"],
    ] as const;
    for (const [label, value] of values) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    fireEvent.click(screen.getByLabelText("Component 2 not yet explained"));
    fireEvent.click(screen.getByTestId("single-word-add-transformation"));
    fireEvent.change(screen.getByLabelText("Transformation 1 from"), { target: { value: "LL" } });
    fireEvent.change(screen.getByLabelText("Transformation 1 to"), { target: { value: "L" } });

    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("KANDILL");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("MISMATCH");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("Has sun / carries light");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("metaphorical");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("Strict embryo meaning: Unknown / Null");
    expect(screen.getByText("A → I")).toBeInTheDocument();
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("not independently verified");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("user-declared and unverified; not applied");
  });

  it("supports a fresh arbitrary word and keeps an incomplete proposal from producing a result", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="RRUGË" />);
    expect(screen.getByTestId("single-word-proposal-incomplete")).toBeInTheDocument();
    expect(screen.queryByTestId("single-word-proposal-result")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Exact target word"), { target: { value: "RRUGË" } });
    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    fireEvent.change(screen.getByLabelText("Component 1 exact spelling"), { target: { value: "RR" } });
    fireEvent.change(screen.getByLabelText("Component 1 proposed meaning"), { target: { value: "user proposal" } });
    fireEvent.change(screen.getByLabelText("Component 1 grammatical role"), { target: { value: "unknown root" } });
    fireEvent.change(screen.getByLabelText("Component 1 language"), { target: { value: "Albanian" } });
    fireEvent.change(screen.getByLabelText("Component 2 exact spelling"), { target: { value: "UGË" } });
    fireEvent.change(screen.getByLabelText("Component 2 proposed meaning"), { target: { value: "user proposal" } });
    fireEvent.change(screen.getByLabelText("Component 2 grammatical role"), { target: { value: "unknown root" } });
    fireEvent.change(screen.getByLabelText("Component 2 language"), { target: { value: "Albanian" } });
    fireEvent.change(screen.getByLabelText("Proposed functional explanation"), { target: { value: "A separately labeled proposal." } });
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("RRUGË");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("U → Ë");
  });

  it("shows field-specific citation and explanation errors with their supported limits", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    expect(screen.getByTestId("single-word-motivation-field-limits")).toHaveTextContent("evidence references and connecting material 500");
    expect(screen.getByTestId("single-word-functional-explanation-count")).toHaveTextContent("0/1,000 characters");

    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    fireEvent.change(screen.getByLabelText("Component 1 evidence status"), { target: { value: "CITATION_ENTERED_UNVERIFIED" } });
    const evidenceReference = screen.getByLabelText("Component 1 evidence reference");
    expect(evidenceReference).toHaveAttribute("maxLength", "500");
    expect(screen.getByTestId("single-word-validation-messages")).toHaveTextContent(
      "Component 1 evidence reference: add a citation locator (up to 500 characters) or change the evidence status.",
    );

    fireEvent.change(evidenceReference, { target: { value: "x".repeat(501) } });
    expect(screen.getByTestId("single-word-validation-messages")).toHaveTextContent(
      "Component 1 evidence reference: use 500 characters or fewer.",
    );

    const explanation = screen.getByLabelText("Proposed functional explanation");
    expect(explanation).toHaveAttribute("maxLength", "1000");
    fireEvent.change(explanation, { target: { value: "x".repeat(1001) } });
    expect(screen.getByTestId("single-word-functional-explanation-count")).toHaveTextContent("1001/1,000 characters");
    expect(screen.getByTestId("single-word-validation-messages")).toHaveTextContent(
      "Proposed functional explanation: enter 1–1,000 characters.",
    );
    expect(screen.queryByTestId("single-word-proposal-result")).not.toBeInTheDocument();
  });

  it("lets users remove incomplete transformations and enforces the eight-item limit", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    const addButton = screen.getByTestId("single-word-add-transformation");

    fireEvent.click(addButton);
    expect(screen.getByLabelText("Transformation 1 from")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Remove transformation 1"));
    expect(screen.queryByLabelText("Transformation 1 from")).not.toBeInTheDocument();

    for (let index = 0; index < 8; index += 1) {
      fireEvent.click(addButton);
    }
    expect(addButton).toBeDisabled();
    expect(screen.getByLabelText("Transformation 8 from")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Remove transformation 1"));
    expect(addButton).toBeEnabled();
  });
});
