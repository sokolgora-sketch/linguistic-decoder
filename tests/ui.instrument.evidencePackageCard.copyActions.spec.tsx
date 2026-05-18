import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { EvidencePackageCard } from "@/ui/instrument/sections/EvidencePackageCard";

describe("EvidencePackageCard copy actions", () => {
  it("labels evidence export as VM-derived summary and JSON package copy actions", () => {
    const onCopyEvidenceSummary = jest.fn();
    const onCopyEvidencePackage = jest.fn();

    render(
      <EvidencePackageCard
        engineVersion="0.2.0-symbolic"
        onCopyEvidenceSummary={onCopyEvidenceSummary}
        onCopyEvidencePackage={onCopyEvidencePackage}
      />
    );

    expect(screen.getByText("evidence export")).toBeInTheDocument();
    expect(screen.getByText("Evidence Package")).toBeInTheDocument();
    expect(screen.getByText(/Readable handoff text and JSON audit bundle/i)).toBeInTheDocument();
    expect(screen.getByText("engine=0.2.0-symbolic")).toBeInTheDocument();
    expect(screen.getByText("source=VM")).toBeInTheDocument();
    expect(screen.getByText("Readable summary")).toBeInTheDocument();
    expect(screen.getByText("JSON audit bundle")).toBeInTheDocument();
    expect(screen.getByText(/Boundary: VM-derived export actions only/i)).toBeInTheDocument();
    expect(screen.getByText(/raw engine JSON stays in Advanced/i)).toBeInTheDocument();
    expect(screen.getByText(/no origin proof/i)).toBeInTheDocument();
    expect(screen.getByText(/no forced answer/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Copy Evidence Summary" }));
    fireEvent.click(screen.getByRole("button", { name: "Copy Evidence Package" }));

    expect(onCopyEvidenceSummary).toHaveBeenCalledTimes(1);
    expect(onCopyEvidencePackage).toHaveBeenCalledTimes(1);
  });
});
