import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const catalogPath = path.join(
  root,
  "src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json",
);

const loaderPath = path.join(
  root,
  "src/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1.ts",
);

const compatibilityRowsPath = path.join(
  root,
  "src/shared/multiSourceFunctionalResearchEvidenceRows.er.v0_1.ts",
);

const analysisAdapterPath = path.join(
  root,
  "src/shared/analysisAdapter.ts",
);

const expectedCatalogVersion =
  "open-instrument.multi-source-functional-research-evidence-catalog.v0_1";

function readSource(filePath: string): string {
  return fs.readFileSync(
    filePath,
    "utf8",
  );
}

function readJson(filePath: string): unknown {
  return JSON.parse(
    fs.readFileSync(
      filePath,
      "utf8",
    ),
  ) as unknown;
}

describe(
  "Open Instrument multi-source functional research evidence catalog v0.1",
  () => {
    it(
      "introduces one static catalog plus one typed loader seam",
      () => {
        expect(
          fs.existsSync(
            catalogPath,
          ),
        ).toBe(true);

        expect(
          fs.existsSync(
            loaderPath,
          ),
        ).toBe(true);
      },
    );

    it(
      "removes the ER-specific production data dependency from analysisAdapter while preserving structural discovery as the research key",
      () => {
        const source =
          readSource(
            analysisAdapterPath,
          );

        expect(source).not.toContain(
          "multiSourceFunctionalResearchEvidenceRowsErV0_1",
        );

        expect(source).not.toContain(
          "./multiSourceFunctionalResearchEvidenceRows.er.v0_1",
        );

        expect(source).toContain(
          "loadMultiSourceFunctionalResearchEvidenceCatalogV0_1",
        );

        expect(source).toMatch(
          /structuralHypothesesV0_1\.flatMap/,
        );

        expect(source).toMatch(
          /embryo:\s*hypothesis\.embryo/,
        );
      },
    );

    it(
      "stores the current five ER observations as catalog data without changing their research truth",
      () => {
        if (
          !fs.existsSync(
            catalogPath,
          )
        ) {
          expect(
            fs.existsSync(
              catalogPath,
            ),
          ).toBe(true);

          return;
        }

        const raw =
          readJson(
            catalogPath,
          ) as {
            catalogVersion?: unknown;
            rows?: unknown;
          };

        expect(
          raw.catalogVersion,
        ).toBe(
          expectedCatalogVersion,
        );

        expect(
          Array.isArray(
            raw.rows,
          ),
        ).toBe(true);

        const rows =
          Array.isArray(
            raw.rows,
          )
            ? raw.rows as Array<Record<string, unknown>>
            : [];

        const erRows =
          rows.filter(
            (row) =>
              row.embryo ===
              "ER",
          );

        expect(erRows).toHaveLength(5);

        expect(
          erRows.map(
            (row) =>
              row.researchEvidenceId,
          ),
        ).toEqual([
          "research.external.pokorny-er5-loose-crumbly.v0_1",
          "research.external.greek-eremos-empty-devoid.v0_1",
          "research.external.albanian-ere-wind.v0_1",
          "research.external.albanian-ere-smell.v0_1",
          "research.external.albanian-ere-era.v0_1",
        ]);

        const albanian =
          erRows.filter(
            (row) =>
              row.language ===
              "Albanian",
          );

        expect(albanian).toHaveLength(3);

        expect(
          albanian.map(
            (row) =>
              row.embryoRelation,
          ),
        ).toEqual([
          "unresolved",
          "unresolved",
          "unresolved",
        ]);

        expect(
          erRows.map(
            (row) =>
              row.sourceStatus,
          ),
        ).not.toContain(
          "reviewed_accepted",
        );
      },
    );

    it(
      "turns the old ER row module into compatibility projection rather than a second copy of evidence data",
      () => {
        expect(
          fs.existsSync(
            compatibilityRowsPath,
          ),
        ).toBe(true);

        const source =
          readSource(
            compatibilityRowsPath,
          );

        expect(source).toContain(
          "loadMultiSourceFunctionalResearchEvidenceCatalogV0_1",
        );

        expect(source).not.toContain(
          "\"research.external.pokorny-er5-loose-crumbly.v0_1\"",
        );

        expect(source).not.toContain(
          "\"research.external.greek-eremos-empty-devoid.v0_1\"",
        );

        expect(source).not.toContain(
          "\"research.external.albanian-ere-wind.v0_1\"",
        );
      },
    );

    it(
      "loads the catalog through a fail-closed parser and remains embryo/target generic",
      () => {
        if (
          !fs.existsSync(
            loaderPath,
          )
        ) {
          expect(
            fs.existsSync(
              loaderPath,
            ),
          ).toBe(true);

          return;
        }

        if (
          !fs.existsSync(
            catalogPath,
          )
        ) {
          expect(
            fs.existsSync(
              catalogPath,
            ),
          ).toBe(true);

          return;
        }

        const loaderModule =
          require(
            loaderPath,
          ) as Record<
            string,
            unknown
          >;

        const load =
          loaderModule
            .loadMultiSourceFunctionalResearchEvidenceCatalogV0_1;

        const parse =
          loaderModule
            .parseMultiSourceFunctionalResearchEvidenceCatalogV0_1;

        expect(
          typeof load,
        ).toBe(
          "function",
        );

        expect(
          typeof parse,
        ).toBe(
          "function",
        );

        if (
          typeof load !==
            "function" ||
          typeof parse !==
            "function"
        ) {
          return;
        }

        const loaded =
          (
            load as
              () => Array<
                Record<
                  string,
                  unknown
                >
              >
          )();

        const raw =
          readJson(
            catalogPath,
          ) as {
            catalogVersion: string;
            rows: Array<
              Record<
                string,
                unknown
              >
            >;
          };

        expect(
          loaded,
        ).toHaveLength(
          raw.rows.length,
        );

        const unsafeStatus =
          JSON.parse(
            JSON.stringify(
              raw,
            ),
          ) as typeof raw;

        unsafeStatus
          .rows[0]
          .sourceStatus =
            "reviewed_accepted";

        expect(
          (
            parse as
              (
                value:
                  unknown,
              ) => unknown
          )(
            unsafeStatus,
          ),
        ).toEqual([]);

        const unsafeOrigin =
          JSON.parse(
            JSON.stringify(
              raw,
            ),
          ) as typeof raw;

        unsafeOrigin
          .rows[0]
          .historicalOriginClaim =
            "claimed";

        expect(
          (
            parse as
              (
                value:
                  unknown,
              ) => unknown
          )(
            unsafeOrigin,
          ),
        ).toEqual([]);

        const genericAk =
          JSON.parse(
            JSON.stringify(
              raw.rows[0],
            ),
          ) as Record<
            string,
            unknown
          >;

        genericAk.researchEvidenceId =
          "fixture.catalog.ak.gjak.v0_1";

        genericAk.embryo =
          "AK";

        genericAk.evidenceFamily =
          "dialect_lexicon";

        genericAk.language =
          "Fixture Language";

        genericAk.form =
          "ak";

        genericAk.gloss =
          "fixture functional gloss";

        genericAk.embryoRelation =
          "exact_form";

        genericAk.relationOperationIds =
          [];

        genericAk.attestationTruth =
          "fact";

        genericAk.sourceStatus =
          "research_candidate";

        genericAk.citations = [
          {
            citationId:
              "fixture.catalog.ak.citation.v0_1",

            sourceTitle:
              "fixture AK source",

            sourceAuthorOrEditor:
              null,

            sourcePublisherOrHost:
              "fixture host",

            sourceDateOrVersion:
              "fixture version",

            sourceUrlOrArchiveRef:
              "https://example.invalid/fixture-ak",

            entryLocator:
              "fixture AK entry",

            sourceHashOrArchiveHash:
              "fixture-hash",

            attestedForm:
              "ak",

            attestedGloss:
              "fixture functional gloss",
          },
        ];

        genericAk.functionalHypotheses = [
          {
            targetWord:
              "gjak",

            semanticBridge:
              "fixture AK evidence may be tested as a bounded functional hypothesis for gjak",

            functionalBridgeTruth:
              "hypothesis",

            claimBoundary:
              "functional_hypothesis_only",
          },
        ];

        genericAk.historicalOriginClaim =
          "not_claimed";

        genericAk.historicalTransmissionClaim =
          "not_claimed";

        genericAk.winnerClaim =
          "not_claimed";

        genericAk.languageSuperiorityClaim =
          "not_claimed";

        genericAk.candidateTruthClaim =
          "not_claimed";

        genericAk.userDecisionPosture =
          "user_decides";

        const parsedGeneric =
          (
            parse as
              (
                value:
                  unknown,
              ) => Array<
                Record<
                  string,
                  unknown
                >
              >
          )({
            catalogVersion:
              expectedCatalogVersion,

            rows: [
              genericAk,
            ],
          });

        expect(
          parsedGeneric,
        ).toHaveLength(1);

        expect(
          parsedGeneric[0],
        ).toMatchObject({
          embryo: "AK",
          language:
            "Fixture Language",
          form: "ak",
          sourceStatus:
            "research_candidate",
        });
      },
    );

    it(
      "keeps the catalog loader passive with no provider, network, cache, or promotion execution",
      () => {
        if (
          !fs.existsSync(
            loaderPath,
          )
        ) {
          expect(
            fs.existsSync(
              loaderPath,
            ),
          ).toBe(true);

          return;
        }

        const source =
          readSource(
            loaderPath,
          );

        expect(source).not.toMatch(
          /\bfetch\s*\(/,
        );

        expect(source).not.toMatch(
          /\baxios\b/,
        );

        expect(source).not.toMatch(
          /child_process/,
        );

        expect(source).not.toMatch(
          /\bspawn\s*\(/,
        );

        expect(source).not.toMatch(
          /\bexec\s*\(/,
        );

        expect(source).not.toMatch(
          /reviewed_accepted/,
        );

        expect(source).not.toMatch(
          /cache/i,
        );
      },
    );
  },
);
