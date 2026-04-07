import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import EvalsReferencePage from "@/app/evals/reference/page";

describe("Evals reference page v0.1", () => {
  it("renders stronger reference-only separation cues", () => {
    render(<EvalsReferencePage />);

    expect(
      screen.getByRole("heading", { name: "Paper snapshots reference" })
    ).toBeInTheDocument();

    expect(screen.getByText("Reference only")).toBeInTheDocument();
    expect(screen.getByText("Not live scoring")).toBeInTheDocument();
    expect(screen.getByText("Why this page exists")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "← Back to evals" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Help" })).toBeInTheDocument();
  });
});
