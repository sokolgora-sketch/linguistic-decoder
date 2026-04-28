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

  it("renders imported Estonian four-run evidence stats", async () => {
    const ui = await BatteryCasePage({
      params: Promise.resolve({ caseId: "et-ae" }),
    });

    render(ui);

    expect(screen.getByText("Estonian ä")).toBeInTheDocument();
    expect(screen.getByText("Evidence stats")).toBeInTheDocument();
    expect(screen.getByText(/Four-run stats imported/i)).toBeInTheDocument();

    expect(screen.getByText(/intended main · V1-V3/i)).toBeInTheDocument();
    expect(screen.getByText(/intended alt · V1-V3/i)).toBeInTheDocument();
    expect(screen.getByText(/control main · V2-V3/i)).toBeInTheDocument();
    expect(screen.getByText(/control alt · V2-V3/i)).toBeInTheDocument();

    expect(screen.getByText(/0\.0025833333333333333/)).toBeInTheDocument();
    expect(screen.getByText(/0\.05316666666666667/)).toBeInTheDocument();
    expect(screen.getByText(/0\.9974166666666666/)).toBeInTheDocument();
    expect(screen.getByText(/0\.99975/)).toBeInTheDocument();

    expect(screen.getByText(/runs\/t5\.et\.ae\.v1-v3\.exp\.main\.r01\/report\.json/)).toBeInTheDocument();
    expect(screen.getByText(/runs\/t5\.et\.ae\.v1-v3\.exp\.alt\.r02\/report\.json/)).toBeInTheDocument();
    expect(screen.getByText(/runs\/t5\.et\.ae\.v2-v3\.exp\.ctrl\.r03\/report\.json/)).toBeInTheDocument();
    expect(screen.getByText(/runs\/t5\.et\.ae\.v2-v3\.exp\.ctrl-alt\.r04\/report\.json/)).toBeInTheDocument();

    expect(screen.getByText("docs/evals/inspected-battery-packs-v0.1.md")).toBeInTheDocument();
  });
});
