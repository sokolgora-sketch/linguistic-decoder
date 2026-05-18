import React from "react";
import { render, screen } from "@testing-library/react";
import { OriginClaimGatesCard } from "@/ui/instrument/sections/OriginClaimGatesCard";

describe("OriginClaimGatesCard clarity", () => {
  it("renders gate status, candidate count, reason counts, and conservative boundary copy", () => {
    render(
      <OriginClaimGatesCard
        gates={{
          active: true,
          flag: "ocg",
          candidateCount: 3,
          reasonCounts: { KEEP: 2, DROP: 1 },
        }}
      />
    );

    expect(screen.getByText("OriginClaim Gates")).toBeInTheDocument();
    expect(screen.getByText(/claim-gate diagnostics/i)).toBeInTheDocument();
    expect(screen.getByText("Status: ON")).toBeInTheDocument();
    expect(screen.getByText(/Candidates:/)).toHaveTextContent("Candidates: 3");
    expect(screen.getByText(/Boundary: diagnostics only/i)).toBeInTheDocument();
    expect(screen.getByText(/no origin proof/i)).toBeInTheDocument();
    expect(screen.getByText(/no forced answer/i)).toBeInTheDocument();
    expect(screen.getByText(/"KEEP":\s*2/)).toBeInTheDocument();
    expect(screen.getByText(/"DROP":\s*1/)).toBeInTheDocument();
  });

  it("renders null when gates are absent", () => {
    const { container } = render(<OriginClaimGatesCard gates={null} />);
    expect(container.textContent).toBe("");
  });
});
