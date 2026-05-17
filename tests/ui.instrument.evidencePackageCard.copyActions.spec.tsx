import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { EvidencePackageCard } from "@/ui/instrument/sections/EvidencePackageCard";

describe("EvidencePackageCard copy actions", () => {
  it("offers separate readable summary and JSON package copy actions", () => {
    const onCopyEvidenceSummary = jest.fn();
    const onCopyEvidencePackage = jest.fn();

    render(
      <EvidencePackageCard
        onCopyEvidenceSummary={onCopyEvidenceSummary}
        onCopyEvidencePackage={onCopyEvidencePackage}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy Evidence Summary" }));
    fireEvent.click(screen.getByRole("button", { name: "Copy Evidence Package" }));

    expect(onCopyEvidenceSummary).toHaveBeenCalledTimes(1);
    expect(onCopyEvidencePackage).toHaveBeenCalledTimes(1);
  });
});
