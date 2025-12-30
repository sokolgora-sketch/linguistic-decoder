import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DeepRootCard from "@/components/DeepRootCard";

describe("DeepRootCard (functionalRoots)", () => {
  it("renders Functional Roots section when functionalRoots is present", () => {
    const deepRoot = {
      // Provide an empty hypotheses array so the card renders without relying on protoRoots rows.
      hypotheses: [],
      functionalRoots: [
        {
          id: "sq.shtu+di.v1",
          language: "sq",
          surfaceForms: ["study", "studim"],
          roots: ["shtu", "di"],
          gloss:
            "Functional reading: shtu (not yours / added-on) + di (know) → making knowledge yours through learning.",
          opsUsed: [
            "english carrier → sq functional reading",
            "note: studim treated as nominal closure of the same carrier family",
          ],
          vowelPath: "U→I",
          notes: [
            "Deterministic pilot hypothesis (v1).",
            "No historical-chain claim; functional decomposition only.",
          ],
        },
      ],
    };

    render(<DeepRootCard deepRoot={deepRoot as any} />);

    expect(screen.getByText("Functional Roots")).toBeInTheDocument();
    // Root header text (as rendered by the card)
    expect(screen.getByText(/shtu\s*\+\s*di/i)).toBeInTheDocument();
    // Vowel path line
    expect(screen.getByText(/vowelPath:U→I/)).toBeInTheDocument();
  });

  it("does not render Functional Roots section when functionalRoots is empty/missing", () => {
    const deepRootA = { hypotheses: [] };
    const deepRootB = { hypotheses: [], functionalRoots: [] };

    const { rerender } = render(<DeepRootCard deepRoot={deepRootA as any} />);
    expect(screen.queryByText("Functional Roots")).not.toBeInTheDocument();

    rerender(<DeepRootCard deepRoot={deepRootB as any} />);
    expect(screen.queryByText("Functional Roots")).not.toBeInTheDocument();
  });
});
