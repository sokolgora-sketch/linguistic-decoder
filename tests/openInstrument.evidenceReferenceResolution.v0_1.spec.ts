import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import type {
  ReviewedExternalLexiconCitationV0_1,
} from "@/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  isSafeEvidenceUrlV0_1,
  resolveInternalDiagnosticReferenceV0_1,
  resolveReviewedEvidenceCitationV0_1,
  resolveReviewedEvidenceReferenceV0_1,
  resolveResearchEvidenceCitationV0_1,
  resolveResearchEvidenceReferenceV0_1,
} from "@/shared/openInstrument/evidenceReferenceResolution.v0_1";

const reviewedRow = getReviewedExternalLexiconProductionSourceRowsV0_1()[0];
const reviewedCitation = reviewedRow.externalCitations[0];
const researchRow = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1().find(
  (row) => row.citations.length > 1,
)!;
const researchCitation = researchRow.citations[0];

describe("Open Instrument evidence reference resolution contract v0.1", () => {
  it("resolves a reviewed evidence ID from the current production registry", () => {
    const resolved = resolveReviewedEvidenceReferenceV0_1({
      ref: reviewedRow.sourceId,
      sourceId: reviewedRow.sourceId,
    });

    expect(resolved).toMatchObject({
      originalRef: reviewedRow.sourceId,
      kind: "reviewed_evidence",
      sourceId: reviewedRow.sourceId,
      sourceStatus: reviewedRow.sourceStatus,
    });
  });

  it("reuses reviewed source metadata and preserves its citation identity", () => {
    const resolved = resolveReviewedEvidenceReferenceV0_1({
      ref: reviewedCitation.citationId,
      citationId: reviewedCitation.citationId,
    });

    expect(resolved).toMatchObject({
      originalRef: reviewedCitation.citationId,
      sourceId: reviewedRow.sourceId,
      citationId: reviewedCitation.citationId,
      title: reviewedCitation.sourceTitle,
      locator: reviewedCitation.entryLocator,
      sourceStatus: reviewedRow.sourceStatus,
    });
  });

  it("makes a reviewed https source navigable", () => {
    const resolved = resolveReviewedEvidenceReferenceV0_1({
      ref: reviewedCitation.citationId,
      citationId: reviewedCitation.citationId,
    });

    expect(resolved).toMatchObject({
      destinationType: "external_primary_source",
      safeUrl: reviewedCitation.sourceUrlOrArchiveRef,
      navigable: true,
    });
  });

  it("keeps a reviewed source without a URL non-navigable", () => {
    const citation: ReviewedExternalLexiconCitationV0_1 = {
      ...reviewedCitation,
      sourceUrlOrArchiveRef: null,
    };

    const resolved = resolveReviewedEvidenceCitationV0_1({
      originalRef: citation.citationId,
      sourceId: reviewedRow.sourceId,
      sourceStatus: reviewedRow.sourceStatus,
      citation,
    });

    expect(resolved).toMatchObject({
      kind: "reviewed_evidence",
      destinationType: "none",
      navigable: false,
    });
    expect(resolved.safeUrl).toBeUndefined();
  });

  it("fails closed instead of throwing for a malformed reviewed citation", () => {
    const resolved = resolveReviewedEvidenceCitationV0_1({
      originalRef: "reviewed.external.malformed.citation.v0_1",
      sourceId: reviewedRow.sourceId,
      sourceStatus: reviewedRow.sourceStatus,
      citation: null,
    });

    expect(resolved).toEqual({
      originalRef: "reviewed.external.malformed.citation.v0_1",
      kind: "unresolved",
      destinationType: "none",
      navigable: false,
    });
  });

  it("fails closed for an unknown reviewed reference", () => {
    expect(
      resolveReviewedEvidenceReferenceV0_1({
        ref: "reviewed.external.missing.v0_1",
        sourceId: "reviewed.external.missing.v0_1",
      }),
    ).toEqual({
      originalRef: "reviewed.external.missing.v0_1",
      kind: "unresolved",
      destinationType: "none",
      navigable: false,
    });
  });

  it("resolves a research citation and preserves research status", () => {
    const resolved = resolveResearchEvidenceReferenceV0_1({
      ref: researchCitation.citationId,
      citationId: researchCitation.citationId,
    });

    expect(resolved).toMatchObject({
      originalRef: researchCitation.citationId,
      kind: "research_evidence",
      researchEvidenceId: researchRow.researchEvidenceId,
      citationId: researchCitation.citationId,
      sourceStatus: researchRow.sourceStatus,
      title: researchCitation.sourceTitle,
      locator: researchCitation.entryLocator,
    });
    expect(resolved.kind).not.toBe("reviewed_evidence");
  });

  it("matches the raw research citation within a bound multi-citation row", () => {
    const secondCitation = researchRow.citations[1];
    const resolved = resolveResearchEvidenceReferenceV0_1({
      ref: secondCitation.citationId,
      researchEvidenceId: researchRow.researchEvidenceId,
    });

    expect(resolved).toMatchObject({
      researchEvidenceId: researchRow.researchEvidenceId,
      citationId: secondCitation.citationId,
      title: secondCitation.sourceTitle,
      locator: secondCitation.entryLocator,
      safeUrl: secondCitation.sourceUrlOrArchiveRef,
      navigable: true,
    });
  });

  it("makes a research https source navigable", () => {
    const resolved = resolveResearchEvidenceReferenceV0_1({
      ref: researchCitation.citationId,
      citationId: researchCitation.citationId,
    });

    expect(resolved).toMatchObject({
      destinationType: "external_primary_source",
      safeUrl: researchCitation.sourceUrlOrArchiveRef,
      navigable: true,
    });
  });

  it("keeps a research locator without a URL non-navigable", () => {
    const citation = {
      ...researchCitation,
      sourceUrlOrArchiveRef: "archive-ref-without-url",
    };

    const resolved = resolveResearchEvidenceCitationV0_1({
      originalRef: citation.citationId,
      researchEvidenceId: researchRow.researchEvidenceId,
      sourceStatus: researchRow.sourceStatus,
      citation,
    });

    expect(resolved).toMatchObject({
      kind: "research_evidence",
      sourceStatus: "research_candidate",
      locator: citation.entryLocator,
      destinationType: "none",
      navigable: false,
    });
    expect(resolved.safeUrl).toBeUndefined();
  });

  it("fails closed instead of throwing for a malformed research citation", () => {
    const resolved = resolveResearchEvidenceCitationV0_1({
      originalRef: "research.external.malformed.citation.v0_1",
      researchEvidenceId: researchRow.researchEvidenceId,
      sourceStatus: researchRow.sourceStatus,
      citation: undefined,
    });

    expect(resolved).toEqual({
      originalRef: "research.external.malformed.citation.v0_1",
      kind: "unresolved",
      destinationType: "none",
      navigable: false,
    });
  });

  it("fails closed for an unknown research citation", () => {
    expect(
      resolveResearchEvidenceReferenceV0_1({
        ref: "research.external.missing.citation.v0_1",
        citationId: "research.external.missing.citation.v0_1",
      }),
    ).toEqual({
      originalRef: "research.external.missing.citation.v0_1",
      kind: "unresolved",
      destinationType: "none",
      navigable: false,
    });
  });

  it("keeps internal diagnostic refs non-navigable even when they contain slashes", () => {
    const resolved = resolveInternalDiagnosticReferenceV0_1(
      "contractAdapter/deepRoot/HeartGate",
    );

    expect(resolved).toEqual({
      originalRef: "contractAdapter/deepRoot/HeartGate",
      kind: "internal_diagnostic",
      destinationType: "internal_record",
      navigable: false,
    });
    expect(resolved.safeUrl).toBeUndefined();
  });

  it.each([
    "javascript:alert(1)",
    "data:text/plain,unsafe",
    "file:///tmp/evidence",
    "blob:https://example.com/id",
    "mailto:test@example.com",
    "tel:+123456789",
    "//example.com/evidence",
    "/evidence/source",
    "evidence/source",
    "",
    "   ",
    "https://",
  ])("rejects unsafe or malformed URL %s", (value) => {
    expect(isSafeEvidenceUrlV0_1(value)).toBeNull();
  });

  it.each(["http://example.com/evidence", "https://example.com/evidence"]) (
    "accepts explicitly allowed URL %s",
    (value) => {
      expect(isSafeEvidenceUrlV0_1(value)).toBe(value);
    },
  );

  it("preserves the original opaque ref and does not invent a destination", () => {
    const originalRef = "unresolved/opaque/ref";
    const resolved = resolveReviewedEvidenceReferenceV0_1({ ref: originalRef });

    expect(resolved).toEqual({
      originalRef,
      kind: "unresolved",
      destinationType: "none",
      navigable: false,
    });
  });

  it.each([
    null,
    undefined,
    { ref: "" },
    { ref: "   ", sourceId: "   " },
  ])("does not invent a destination for missing lookup input %p", (input) => {
    const resolved = resolveReviewedEvidenceReferenceV0_1(input);

    expect(resolved.kind).toBe("unresolved");
    expect(resolved.destinationType).toBe("none");
    expect(resolved.navigable).toBe(false);
  });

  it("is deterministic and has no truth-promotion fields", () => {
    const input = {
      ref: reviewedCitation.citationId,
      citationId: reviewedCitation.citationId,
    };

    const first = resolveReviewedEvidenceReferenceV0_1(input);
    const second = resolveReviewedEvidenceReferenceV0_1(input);

    expect(first).toEqual(second);
    expect(first).not.toHaveProperty("candidateTruthClaim");
    expect(first).not.toHaveProperty("originClaim");
    expect(first).not.toHaveProperty("winnerClaim");
    expect(first).not.toHaveProperty("evidencePromotion");
  });

  it("requires no fetch, provider, or engine call", () => {
    const fetchSpy = jest.fn();
    const previousFetch = globalThis.fetch;
    globalThis.fetch = fetchSpy as typeof fetch;

    try {
      resolveResearchEvidenceReferenceV0_1({
        ref: researchCitation.citationId,
        citationId: researchCitation.citationId,
      });
    } finally {
      globalThis.fetch = previousFetch;
    }

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
