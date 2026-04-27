import { render, screen } from "@testing-library/react";
import BatteryPage from "@/app/battery/page";

describe("BatteryPage.v0.1", () => {
  it("links back to the Evals workbench", async () => {
    const ui = await BatteryPage();

    render(ui);

    const link = screen.getByRole("link", {
      name: /back to evals workbench/i,
    });

    expect(link).toHaveAttribute("href", "/evals");
  });
});
