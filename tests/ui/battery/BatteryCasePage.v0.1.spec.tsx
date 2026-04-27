import { render, screen } from "@testing-library/react";
import BatteryCasePage from "@/app/battery/[caseId]/page";

describe("BatteryCasePage.v0.1", () => {
  it("renders canonical French case details", async () => {
    const ui = await BatteryCasePage({
      params: Promise.resolve({ caseId: "fr-euoe" }),
    });

    render(ui);

    const batteryIndexLink = screen.getByRole("link", {
      name: /back to battery index/i,
    });
    const evalsLink = screen.getByRole("link", {
      name: /back to evals workbench/i,
    });

    expect(batteryIndexLink).toHaveAttribute("href", "/battery");
    expect(evalsLink).toHaveAttribute("href", "/evals");

    expect(screen.getByText("French /ø~œ/")).toBeInTheDocument();
    expect(screen.getByText(/Strong high-boundary discrimination/i)).toBeInTheDocument();
    expect(screen.getByText("Optional stats")).toBeInTheDocument();
    expect(screen.getAllByText(/Journal-facing stats pending structured import from evidence pack\./i).length).toBeGreaterThan(0);
    expect(screen.getByText(/evals\.series-evidence-pack\.t5-fr-euoe-v2-v5-exp-v0\.2\.v0\.1\.zip/i)).toBeInTheDocument();
  });
});
