import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import EvalsHelpPage from "@/app/evals/help/page";

describe("Evals help page v0.1", () => {
  it("renders the core help sections and navigation links", () => {
    render(<EvalsHelpPage />);

    expect(
      screen.getByRole("heading", { name: "ZË-RO Evals Help" })
    ).toBeInTheDocument();

    expect(screen.getByText("What Evals is")).toBeInTheDocument();
    expect(screen.getByText("Accepted input")).toBeInTheDocument();
    expect(screen.getByText("Workflow")).toBeInTheDocument();
    expect(screen.getByText("Metric glossary")).toBeInTheDocument();
    expect(screen.getByText("Exports")).toBeInTheDocument();
    expect(screen.getByText("Common mistakes")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "← Back to Evals" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Reference page →" })
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/evalRun.v0.1/).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("Buckets-only JSON")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Spearman ρ")
    ).toBeInTheDocument();
    expect(
      screen.getByText("p_perm")
    ).toBeInTheDocument();
  });
});
