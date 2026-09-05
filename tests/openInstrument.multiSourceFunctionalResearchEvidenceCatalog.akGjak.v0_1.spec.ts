import { NextRequest } from "next/server";

import { GET } from "../app/api/analyze-v1/route";

import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";

import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "../src/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";

const AK_SOURCE_ID =
  "research.external.karoly-ak-flow.gjak.v0_1";

const AK_CITATION_ID =
  "research.external.karoly-ak-flow.gjak.citation.v0_1";

const CATALOG_VERSION =
  "open-instrument.multi-source-functional-research-evidence-catalog.v0_1";

async function analyze(
  word: string,
): Promise<any> {
  const response =
    await GET(
      new NextRequest(
        `http://localhost/api/analyze-v1?word=${encodeURIComponent(
          word,
        )}&mode=strict`,
      ),
    );

  expect(response.status).toBe(200);

  return response.json();
}

describe(
  "Open Instrument bounded AK/GJAK research evidence admission v0.1",
  () => {
    it(
      "adds exactly one bounded AK research row without changing catalog version",
      () => {
        expect(
          catalog.catalogVersion,
        ).toBe(
          CATALOG_VERSION,
        );

        const rows =
          catalog.rows.filter(
            (row) =>
              row.researchEvidenceId ===
              AK_SOURCE_ID,
          );

                expect(rows).toHaveLength(1);
      },
    );

    it(
      "records Károly 2007 ak- 'to flow' as source attestation while keeping the GJAK bridge hypothesis-only",
      () => {
        const row =
          catalog.rows.find(
            (candidate) =>
              candidate.researchEvidenceId ===
              AK_SOURCE_ID,
          );

        expect(row).toBeDefined();

        expect(row).toMatchObject({
          registryVersion:
            "open-instrument.multi-source-functional-research-evidence-registry.v0_1",

          researchEvidenceId:
            AK_SOURCE_ID,

          embryo:
            "AK",

          evidenceFamily:
            "dialect_lexicon",

          form:
            "ak-",

          gloss:
            "to flow",

          embryoRelation:
            "exact_form",

          relationOperationIds:
            [],

          attestationTruth:
            "fact",

          sourceStatus:
            "research_candidate",

          historicalOriginClaim:
            "not_claimed",

          historicalTransmissionClaim:
            "not_claimed",

          winnerClaim:
            "not_claimed",

          languageSuperiorityClaim:
            "not_claimed",

          candidateTruthClaim:
            "not_claimed",

          userDecisionPosture:
            "user_decides",
        });

        expect(
          row?.language,
        ).toMatch(
          /Turkic/i,
        );

        expect(
          row?.citations,
        ).toHaveLength(1);

        expect(
          row?.citations[0],
        ).toMatchObject({
          citationId:
            AK_CITATION_ID,

          sourceTitle:
            "Yakut derivational morphology — An historical approach — Deverbal nominals",

          sourceAuthorOrEditor:
            "László Károly",

          sourcePublisherOrHost:
            "University of Szeged, Department of Altaic Studies",

          sourceDateOrVersion:
            "2007",

          attestedForm:
            "ak-",

          attestedGloss:
            "to flow",
        });

        expect(
          row?.citations[0]
            .sourceUrlOrArchiveRef,
        ).toBe(
          "https://doktori.bibl.u-szeged.hu/id/eprint/817/5/2007_laszlo_karoly.pdf",
        );

        expect(
          row?.citations[0]
            .entryLocator,
        ).toContain(
          "printed page 29",
        );

        expect(
          row?.citations[0]
            .entryLocator,
        ).toContain(
          "Tatar",
        );

        expect(
          row?.citations[0]
            .entryLocator,
        ).toContain(
          "agim",
        );

        expect(
          row?.citations[0]
            .entryLocator,
        ).toContain(
          "Yakut",
        );

        expect(
          row?.citations[0]
            .entryLocator,
        ).toContain(
          "akin",
        );

        expect(
          row?.functionalHypotheses,
        ).toEqual([
          {
            targetWord:
              "gjak",

            semanticBridge:
              expect.stringMatching(
                /flow/i,
              ),

            functionalBridgeTruth:
              "hypothesis",

            claimBoundary:
              "functional_hypothesis_only",
          },
        ]);
      },
    );

    it(
      "loads the new AK row through the existing fail-closed generic catalog loader",
      () => {
        const loaded =
          loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();

                expect(
          loaded,
        ).toHaveLength(
          catalog.rows.length,
        );

        const ak =
          loaded.find(
            (row) =>
              row.researchEvidenceId ===
              AK_SOURCE_ID,
          );

        expect(ak).toMatchObject({
          embryo:
            "AK",

          form:
            "ak-",

          gloss:
            "to flow",

          embryoRelation:
            "exact_form",

          attestationTruth:
            "fact",

          sourceStatus:
            "research_candidate",
        });

        expect(
          ak?.functionalHypotheses,
        ).toEqual([
          expect.objectContaining({
            targetWord:
              "gjak",

            functionalBridgeTruth:
              "hypothesis",

            claimBoundary:
              "functional_hypothesis_only",
          }),
        ]);
      },
    );

    it(
      "upgrades GJAK from structural-only to one bounded AK research witness while preserving structural AK",
      async () => {
        const body =
          await analyze(
            "gjak",
          );

        expect(
          body?.analysisStatusV0_1
            ?.status,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          body?.analysisStatusV0_1
            ?.researchHypothesisEmbryos,
        ).toEqual([
          "AK",
        ]);

        const candidates =
          Array.isArray(
            body.candidates,
          )
            ? body.candidates
            : [];

        const structural =
          candidates.filter(
            (candidate: any) =>
              candidate?.sourceKind ===
              "logic_derived_structural_hypothesis",
          );

        const research =
          candidates.filter(
            (candidate: any) =>
              candidate?.sourceKind ===
              "multi_source_research_witness",
          );

        expect(
          structural.some(
            (candidate: any) =>
              candidate.embryo ===
              "AK",
          ),
        ).toBe(true);

        expect(
          research,
        ).toHaveLength(1);

        expect(
          research[0],
        ).toMatchObject({
          targetWord:
            "gjak",

          embryo:
            "AK",

          sourceId:
            AK_SOURCE_ID,

          sourceStatus:
            "research_candidate",

          displayForm:
            "ak-",

          form:
            "ak-",

          plainStandaloneGloss:
            "to flow",

          evidenceRefs: [
            AK_CITATION_ID,
          ],

          embryoRelation:
            "exact_form",

          attestationTruth:
            "fact",

          functionalBridgeTruth:
            "hypothesis",

          historicalOriginClaim:
            "not_claimed",

          historicalTransmissionClaim:
            "not_claimed",

          winnerClaim:
            "not_claimed",

          languageSuperiorityClaim:
            "not_claimed",

          candidateTruthClaim:
            "not_claimed",

          userDecisionPosture:
            "user_decides",
        });

        expect(
          research[0]
            .semanticBridge,
        ).toMatch(
          /flow/i,
        );
      },
    );

    it(
      "does not disturb the existing bounded STERILE/ER research family",
      async () => {
        const body =
          await analyze(
            "sterile",
          );

        expect(
          body?.analysisStatusV0_1
            ?.status,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          body?.analysisStatusV0_1
            ?.researchHypothesisEmbryos,
        ).toEqual([
          "ER",
        ]);

        const research =
          (
            Array.isArray(
              body.candidates,
            )
              ? body.candidates
              : []
          ).filter(
            (candidate: any) =>
              candidate?.sourceKind ===
              "multi_source_research_witness",
          );

        expect(
          research.map(
            (candidate: any) =>
              candidate.sourceId,
          ),
        ).toEqual([
          "research.external.pokorny-er5-loose-crumbly.v0_1",
          "research.external.greek-eremos-empty-devoid.v0_1",
        ]);

        expect(
          research.some(
            (candidate: any) =>
              candidate.sourceId ===
              AK_SOURCE_ID,
          ),
        ).toBe(false);
      },
    );

    it(
      "does not leak AK/GJAK research into unrelated structural or Null cases",
      async () => {
        const memory =
          await analyze(
            "memory",
          );

        const terror =
          await analyze(
            "terror",
          );

        for (
          const body of
            [
              memory,
              terror,
            ]
        ) {
          const research =
            (
              Array.isArray(
                body.candidates,
              )
                ? body.candidates
                : []
            ).filter(
              (candidate: any) =>
                candidate?.sourceKind ===
                "multi_source_research_witness",
            );

          expect(
            research.some(
              (candidate: any) =>
                candidate.sourceId ===
                AK_SOURCE_ID,
            ),
          ).toBe(false);
        }

        expect(
          terror?.analysisStatusV0_1
            ?.status,
        ).toBe(
          "null_no_supported_candidate",
        );
      },
    );

    it(
      "keeps the AK source below Reviewed evidence and makes no historical-origin or candidate-truth claim",
      () => {
        const row =
          catalog.rows.find(
            (candidate) =>
              candidate.researchEvidenceId ===
              AK_SOURCE_ID,
          );

        expect(
          row?.sourceStatus,
        ).not.toBe(
          "reviewed_accepted",
        );

        expect(
          row?.historicalOriginClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          row?.historicalTransmissionClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          row?.winnerClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          row?.languageSuperiorityClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          row?.candidateTruthClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          row?.userDecisionPosture,
        ).toBe(
          "user_decides",
        );
      },
    );
  },
);
