/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "../src/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";

type AnyRecord = Record<string, any>;

async function analyze(word: string): Promise<AnyRecord> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function primaryCandidate(body: AnyRecord): AnyRecord {
  return (
    body.candidates.find(
      (candidate: AnyRecord) =>
        candidate?.candidateId === "albanian-di-know-functional",
    ) ?? body.candidates[0]
  );
}

function withPrimaryCandidate(
  body: AnyRecord,
  overrides: AnyRecord,
): AnyRecord {
  return {
    ...body,
    rootMap: undefined,
    candidates: [
      {
        ...primaryCandidate(body),
        ...overrides,
      },
    ],
  };
}

describe("Open Instrument primary candidate evidence traceability v0.1", () => {
  it("shows the reviewed primary evidence trail directly in Overview", async () => {
    const body = await analyze("study");
    const reviewedRow = getReviewedExternalLexiconProductionSourceRowsV0_1().find(
      (row) =>
        row.candidateId === "albanian-di-know-functional" &&
        row.sourceStatus === "reviewed_accepted",
    );
    const reviewedCitation = reviewedRow?.externalCitations.find((citation) =>
      /^https?:\/\//i.test(citation.sourceUrlOrArchiveRef ?? ""),
    );

    expect(reviewedCitation).toBeDefined();

    render(<InstrumentPanel payload={body} />);

    const overview = screen.getByRole("tabpanel");
    expect(within(overview).getByText("Evidence: Reviewed")).toBeVisible();
    expect(within(overview).getByText("Evidence sources")).toBeVisible();
    expect(
      within(overview).getByText("Reviewed source · reviewed_accepted"),
    ).toBeVisible();

    const link = within(overview).getByRole("link", {
      name: reviewedCitation?.sourceTitle,
    });
    expect(link).toHaveAttribute(
      "href",
      reviewedCitation?.sourceUrlOrArchiveRef,
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
    expect(
      within(overview).getByText(`Ref: ${reviewedCitation?.citationId}`),
    ).toBeVisible();
    expect(
      within(overview).getByText(`Locator: ${reviewedCitation?.entryLocator}`),
    ).toBeVisible();
    expect(within(overview).getByText(/Functional motivation, not historical etymology\./)).toBeVisible();
  });

  it("keeps research evidence visibly research-only in Overview", async () => {
    const body = await analyze("study");
    const researchRow = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1().find(
      (row) => row.citations.length > 1,
    );
    const citation = researchRow?.citations[0];

    expect(researchRow).toBeDefined();
    expect(citation).toBeDefined();

    render(
      <InstrumentPanel
        payload={withPrimaryCandidate(body, {
          id: "research-functional-candidate",
          candidateId: "research-functional-candidate",
          form: "AK",
          displayForm: "AK",
          embryo: "AK",
          claimType: "functionalMotivation",
          validationOutcome: "not_evaluated",
          sourceKind: "multi_source_research_witness",
          sourceStatus: researchRow?.sourceStatus,
          sourceId: researchRow?.researchEvidenceId,
          claimBoundary: "research_functional_hypothesis_only",
          candidateTruthClaim: "not_claimed",
          historicalOriginClaim: "not_claimed",
          userDecisionPosture: "user_decides",
          functionalStatement: "A bounded research hypothesis.",
          evidenceRefs: citation ? [citation.citationId] : [],
        })}
      />,
    );

    const overview = screen.getByRole("tabpanel");
    expect(within(overview).getByText("Research hypothesis")).toBeVisible();
    expect(
      within(overview).getByText(/Research source · research_candidate/i),
    ).toBeVisible();
    expect(within(overview).queryByText(/Reviewed source/i)).not.toBeInTheDocument();
  });

  it("renders unresolved primary references without fabricating a link", async () => {
    const body = await analyze("study");

    render(
      <InstrumentPanel
        payload={withPrimaryCandidate(body, {
          sourceId: null,
          sourceStatus: null,
          evidenceRefs: ["missing.primary.evidence.ref"],
        })}
      />,
    );

    const overview = screen.getByRole("tabpanel");
    expect(within(overview).getByText("Evidence sources")).toBeVisible();
    expect(within(overview).getByText("Unresolved reference")).toBeVisible();
    expect(
      within(overview).getByText("Ref: missing.primary.evidence.ref"),
    ).toBeVisible();
    expect(within(overview).queryAllByRole("link")).toHaveLength(0);
  });

  it("does not fabricate evidence for a primary candidate without refs", async () => {
    const body = await analyze("study");

    render(
      <InstrumentPanel
        payload={withPrimaryCandidate(body, {
          sourceId: null,
          sourceStatus: null,
          evidenceRefs: [],
        })}
      />,
    );

    const overview = screen.getByRole("tabpanel");
    expect(within(overview).queryByText("Evidence sources")).not.toBeInTheDocument();
    expect(within(overview).getByText("Evidence: Reviewed")).toBeVisible();
  });

  it("does not render primary candidate evidence for a Null result", async () => {
    const body = await analyze("stone");

    render(<InstrumentPanel payload={body} />);

    const overview = screen.getByRole("tabpanel");
    expect(
      within(overview).getByRole("heading", {
        name: "Null — no supported candidate",
      }),
    ).toBeVisible();
    expect(within(overview).queryByText("Evidence sources")).not.toBeInTheDocument();
  });
});
