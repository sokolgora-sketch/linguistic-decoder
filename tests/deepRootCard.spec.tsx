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
    expect(screen.getByText(/SHTU \+ DI/)).toBeInTheDocument();
    expect(screen.getByText(/SHTU @ stu/i)).toBeInTheDocument();
    expect(screen.getByText(/DI @ dy/i)).toBeInTheDocument();
  });

  it("falls back to candidates if hypotheses is missing", () => {
    const deepRoot = {
      candidates: [
        { id: "x", protoRoots: ["DA"], carriers: [{ protoRootId: "DA", segment: "dy", carrierForm: "da" }] },
      ],
    };

    render(<DeepRootCard deepRoot={deepRoot as any} />);

    expect(screen.getByText(/DA/)).toBeInTheDocument();
  });
});
