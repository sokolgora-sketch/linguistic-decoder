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
