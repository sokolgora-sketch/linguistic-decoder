import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

describe("Evals evidence pack button v0.1", () => {
  it("renders evidence pack export action disabled until a scored report exists", () => {
    render(<EvalsPageClientV0_1 />);

    const button = screen.getByRole("button", { name: "Download Evidence Pack" });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    const seriesButton = screen.getByRole("button", { name: "Download Series Evidence Pack" });
    expect(seriesButton).toBeInTheDocument();
    expect(seriesButton).toBeDisabled();
  });
});
