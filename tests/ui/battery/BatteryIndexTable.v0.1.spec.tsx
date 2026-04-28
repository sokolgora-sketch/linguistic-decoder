import { render, screen } from "@testing-library/react";
import { BatteryIndexTableV0_1 } from "@/ui/battery/BatteryIndexTable.v0.1";

describe("BatteryIndexTable.v0.1", () => {
  it("renders canonical battery cases", () => {
    render(<BatteryIndexTableV0_1 />);

    expect(screen.getByText("Battery index")).toBeInTheDocument();
    expect(screen.getByText("German ö")).toBeInTheDocument();
    expect(screen.getByText("French /ø~œ/")).toBeInTheDocument();
    expect(screen.getByText("Turkish ı")).toBeInTheDocument();
    expect(screen.getByText("Estonian ä")).toBeInTheDocument();
  });

  it("renders scientific status labels from registry", () => {
    render(<BatteryIndexTableV0_1 />);

    expect(screen.getAllByText("support").length).toBeGreaterThan(0);
    expect(screen.getAllByText("mixed").length).toBeGreaterThan(0);
    expect(screen.getAllByText("pressure").length).toBeGreaterThan(0);
  });

  it("renders artifact-backed stats import status", () => {
    render(<BatteryIndexTableV0_1 />);

    expect(screen.getByRole("columnheader", { name: "Stats" })).toBeInTheDocument();

    expect(screen.getAllByText("imported")).toHaveLength(2);
    expect(screen.getAllByText("pending")).toHaveLength(7);
  });
});
