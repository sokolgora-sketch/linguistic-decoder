import React from "react";
import { render, screen } from "@testing-library/react";
import DeepRootCard from "@/components/DeepRootCard";

describe("DeepRootCard", () => {
  it("renders hypotheses-first and shows protoRoots + carriers", () => {
    const deepRoot = {
      hypotheses: [
        {
          id: "study:SHTU+DI:1",
          protoRoots: ["SHTU", "DI"],
          segments: ["stu", "dy"],
          carriers: [
            { protoRootId: "SHTU", segment: "stu", carrierForm: "shtu", lang: "sq", ops: ["s_to_sh"] },
            { protoRootId: "DI", segment: "dy", carrierForm: "di", lang: "sq", ops: ["vowel_swap"] },
          ],
          decomposition: { action: "SHTU", function: "DI" },
          checks: { opsWithinLimits: true, skeletonExplained: true },
          opsCount: 2,
        },
      ],
      candidates: [],
    };

    render(<DeepRootCard deepRoot={deepRoot as any} />);

    expect(screen.getByText(/DeepRoot \(proto-root hypotheses\)/i)).toBeInTheDocument();

    // Header for row 1
    expect(screen.getByTestId("deeproot-header-1")).toHaveTextContent("SHTU + DI");

    // Exact carrier lines (stable selectors)
    expect(screen.getByTestId("deeproot-carrier-1-SHTU-stu")).toHaveTextContent("SHTU @ stu → shtu");
    expect(screen.getByTestId("deeproot-carrier-1-DI-dy")).toHaveTextContent("DI @ dy → di");
  });

  it("falls back to candidates if hypotheses is missing", () => {
    const deepRoot = {
      candidates: [
        {
          id: "x",
          protoRoots: ["DA"],
          carriers: [{ protoRootId: "DA", segment: "dy", carrierForm: "da" }],
          checks: { opsWithinLimits: false, skeletonExplained: false },
        },
      ],
    };

    render(<DeepRootCard deepRoot={deepRoot as any} />);

    // Row 1 header should be DA
    expect(screen.getByTestId("deeproot-header-1")).toHaveTextContent("DA");

    // Carrier line should exist
    expect(screen.getByTestId("deeproot-carrier-1-DA-dy")).toHaveTextContent("DA @ dy → da");
  });
});
