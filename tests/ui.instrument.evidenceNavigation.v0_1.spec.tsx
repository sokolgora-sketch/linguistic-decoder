/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";

import { CandidatesAccordion } from "@/ui/candidates/CandidatesAccordion";
import {
  EvidenceReferenceItem,
} from "@/ui/candidates/EvidenceReferenceLink";
import type { UICandidateRow } from "@/ui/candidates/candidateModel";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import {
  resolveReviewedEvidenceCitationV0_1,
} from "@/shared/openInstrument/evidenceReferenceResolution.v0_1";

const reviewedRow = getReviewedExternalLexiconProductionSourceRowsV0_1().find(
  (row) =>
    row.sourceStatus === "reviewed_accepted" &&
    row.externalCitations.some((citation) =>
      /^https?:\/\//i.test(citation.sourceUrlOrArchiveRef ?? ""),
    ),
);
const reviewedCitation = reviewedRow?.externalCitations.find((citation) =>
  /^https?:\/\//i.test(citation.sourceUrlOrArchiveRef ?? ""),
);
const researchRow = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1().find(
  (row) => row.citations.length > 1,
)!;

function candidateRow(
  overrides: Partial<UICandidateRow> = {},
): UICandidateRow {
  return {
    id: "candidate-1",
    language: "sq",
    form: "di",
    status: "pass",
    sourceKind: "multi_source_research_witness",
    claimType: "functionalMotivation",
    claimBoundary: "research_functional_hypothesis_only",
    functionalBridgeTruth: "hypothesis",
    candidateTruthClaim: "not_claimed",
    historicalOriginClaim: "not_claimed",
    userDecisionPosture: "user_decides",
    embryo: "DI",
    vowelPath: "I",
    evidenceRefs: null,
    raw: { id: "candidate-1" },
    ...overrides,
  };
}

describe("Open Instrument evidence navigation v0.1", () => {
  it("renders a reviewed resolvable citation through the typed resolver", () => {
    if (!reviewedRow || !reviewedCitation) {
      throw new Error("reviewed navigable fixture is missing");
    }

    render(
      <CandidatesAccordion
        rows={[
          candidateRow({
            sourceKind: "reviewed_dictionary_source",
            sourceId: reviewedRow.sourceId,
            sourceStatus: "reviewed_accepted",
            evidenceRefs: [reviewedCitation.citationId],
          }),
        ]}
      />,
    );

    const link = screen.getByRole("link", {
      name: reviewedCitation.sourceTitle,
    });

    expect(link).toHaveAttribute(
      "href",
      reviewedCitation.sourceUrlOrArchiveRef,
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
    expect(screen.getByText(/Reviewed source · reviewed_accepted/i)).toBeInTheDocument();
    expect(
      screen.getByText(`Ref: ${reviewedCitation.citationId}`),
    ).toBeInTheDocument();
    expect(link.getAttribute("href")).not.toBe(reviewedCitation.citationId);
  });

  it("resolves two citations from one research row to two distinct source links", () => {
    const firstCitation = researchRow.citations[0];
    const secondCitation = researchRow.citations[1];

    render(
      <CandidatesAccordion
        rows={[
          candidateRow({
            sourceId: researchRow.researchEvidenceId,
            sourceStatus: researchRow.sourceStatus,
            evidenceRefs: [firstCitation.citationId, secondCitation.citationId],
          }),
        ]}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      firstCitation.sourceUrlOrArchiveRef,
      secondCitation.sourceUrlOrArchiveRef,
    ]);
    expect(
      screen.getAllByText(/Research source · research_candidate/i),
    ).toHaveLength(2);
    expect(screen.getByText(`Ref: ${firstCitation.citationId}`)).toBeInTheDocument();
    expect(screen.getByText(`Ref: ${secondCitation.citationId}`)).toBeInTheDocument();
  });

  it("keeps unresolved and internal diagnostic refs visible but non-clickable", () => {
    render(
      <CandidatesAccordion
        rows={[
          candidateRow({
            id: "unresolved",
            form: "unknown",
            sourceId: null,
            sourceStatus: null,
            evidenceRefs: ["missing.evidence.ref", "contractAdapter.deepRoot"],
          }),
        ]}
      />,
    );

    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.getByText("Ref: missing.evidence.ref")).toBeInTheDocument();
    expect(screen.getByText("Ref: contractAdapter.deepRoot")).toBeInTheDocument();
  });

  it("keeps unsafe and non-navigable resolver results non-clickable", () => {
    const unsafe = resolveReviewedEvidenceCitationV0_1({
      originalRef: "unsafe-citation",
      sourceId: "reviewed.source",
      sourceStatus: "reviewed_accepted",
      citation: {
        citationId: "unsafe-citation",
        citationStatus: "reviewed_accepted",
        citationType: "dictionary_entry",
        sourceTitle: "Unsafe source",
        sourceAuthorOrEditor: null,
        sourcePublisherOrHost: "example.invalid",
        sourceDateOrVersion: "v0.1",
        sourceUrlOrArchiveRef: "javascript:alert(1)",
        entryLocator: "entry-1",
        attestedForm: "di",
        attestedGloss: "know",
        attestedGrammarNote: null,
        reviewedBy: "fixture",
        reviewedAt: "2026-09-10",
        reviewNote: "fixture only",
        sourceHashOrArchiveHash: null,
      },
    });

    render(<EvidenceReferenceItem resolution={unsafe} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Unsafe source")).toBeInTheDocument();
    expect(screen.getByText("Ref: unsafe-citation")).toBeInTheDocument();
  });

  it("preserves candidate status, hypothesis boundaries, and ordering", () => {
    render(
      <CandidatesAccordion
        rows={[
          candidateRow({
            id: "first",
            form: "first",
            status: "pass",
            claimType: "structuralHypothesis",
            sourceKind: "logic_derived_structural_hypothesis",
            discoveryStatus: "structural_hypothesis",
            evidenceRefs: ["deepRoot.functionalRoots[0].evidence"],
          }),
          candidateRow({
            id: "second",
            form: "second",
            status: "unknown",
            evidenceRefs: [],
          }),
        ]}
      />,
    );

    const content = document.body.textContent ?? "";
    expect(content.indexOf("first")).toBeLessThan(content.indexOf("second"));
    expect(screen.getByText("pass")).toBeInTheDocument();
    expect(screen.getByText("unknown")).toBeInTheDocument();
    expect(screen.getByText("Structural hypothesis")).toBeInTheDocument();
    expect(screen.getAllByText("Candidate truth: not claimed")).toHaveLength(2);
    expect(screen.getAllByText("Decision: user decides")).toHaveLength(2);
    expect(screen.getByText("Ref: deepRoot.functionalRoots[0].evidence")).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
