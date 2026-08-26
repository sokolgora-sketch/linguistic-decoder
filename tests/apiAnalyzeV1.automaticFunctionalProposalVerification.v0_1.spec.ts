import {
  GET,
} from "../app/api/analyze-v1/route";

describe(
  "Open Instrument Slice E automatic proposal verification/promotion",
  () => {
    const originalEnv = {
      OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER:
        process.env
          .OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER,
      OPENAI_API_KEY:
        process.env
          .OPENAI_API_KEY,
      OPENAI_MODEL:
        process.env
          .OPENAI_MODEL,
      OPENAI_BASE_URL:
        process.env
          .OPENAI_BASE_URL,
    };

    const originalFetch =
      global.fetch;

    function restoreEnv() {
      for (
        const [key, value]
        of Object.entries(
          originalEnv,
        )
      ) {
        if (
          typeof value ===
          "undefined"
        ) {
          delete process.env[key];
        } else {
          process.env[key] =
            value;
        }
      }
    }

    function configureFakeRealProvider(
      responsePayload:
        unknown,
    ) {
      process.env
        .OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER =
        "openai_compat";

      process.env
        .OPENAI_API_KEY =
        "fake-key";

      process.env
        .OPENAI_MODEL =
        "fake-model";

      process.env
        .OPENAI_BASE_URL =
        "http://localhost:11434/v1";

      global.fetch =
        jest.fn(
          async (
            input: unknown,
          ) => {
            expect(
              String(input),
            ).toBe(
              "http://localhost:11434/v1/chat/completions",
            );

            return new Response(
              JSON.stringify({
                choices: [
                  {
                    message: {
                      content:
                        JSON.stringify(
                          responsePayload,
                        ),
                    },
                  },
                ],
              }),
              {
                status: 200,
                headers: {
                  "content-type":
                    "application/json",
                },
              },
            );
          },
        ) as typeof fetch;
    }

    beforeEach(() => {
      delete process.env
        .OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER;

      delete process.env
        .OPENAI_API_KEY;

      delete process.env
        .OPENAI_MODEL;

      delete process.env
        .OPENAI_BASE_URL;
    });

    afterEach(() => {
      restoreEnv();
      global.fetch =
        originalFetch;
    });

    afterAll(() => {
      restoreEnv();
      global.fetch =
        originalFetch;
    });

    it(
      "promotes a deterministically accepted real-provider result as Proposed only",
      async () => {
        configureFakeRealProvider({
          word: "novalume",
          candidates: [
            {
              language:
                "Albanian",
              candidateExpression:
                "MI",
              embryos: [
                {
                  form: "MI",
                  gloss:
                    "fixture meaning",
                },
              ],
              semanticBridge:
                "fixture semantic bridge",
              requiredTransforms:
                [],
              functionalExplanation:
                "fixture functional explanation",
            },
          ],
        });

        const response =
          await GET(
            new Request(
              "http://localhost/api/analyze-v1?word=novalume&mode=strict",
            ),
          );

        expect(
          response.status,
        ).toBe(200);

        const body =
          await response.json();

        expect(
          body
            .automaticFunctionalProposalV0_1,
        ).toMatchObject({
          attempted: true,
          status:
            "proposed_unverified",
          provider:
            "openai_compat",
          realProvider: true,
          mockProvider: false,
          userFacingEligible:
            false,
          verificationState:
            "pending_slice_e",
        });

        expect(
          body
            .automaticFunctionalProposalVerificationV0_1,
        ).toMatchObject({
          status:
            "verified_proposed",
          promotionPolicy:
            "proposed_only",
          acceptedCount: 1,
          rejectedCount: 0,
        });

        expect(
          body.analysisStatusV0_1,
        ).toMatchObject({
          status:
            "candidate_only",
          reviewedOperators: [],
          candidateOnlyOperators: [],
          structuralTokens: [],
        });

        expect(
          body
            .analysisStatusV0_1
            .summary,
        ).toBe(
          "Deterministically verified Proposed functional candidate available: MI. It remains an unreviewed functional hypothesis, not candidate truth or historical-origin evidence. User decides.",
        );

        const promoted =
          body.candidates.find(
            (candidate: any) =>
              candidate
                ?.sourceKind ===
              "automatic_llm_functional_proposal",
          );

        expect(promoted).toMatchObject({
          candidateLanguage:
            "Albanian",
          form: "MI",
          claimType:
            "functionalMotivation",
          validationOutcome:
            "not_evaluated",
          rankGroup:
            "unresolved",
          originClaim:
            "not_claimed",
          historicalRelation:
            "not_evaluated",
          segmentation: {
            kind:
              "functionalProposal",
            components: [
              {
                embryo: "MI",
                language:
                  "Albanian",
                plainMeaning:
                  "fixture meaning",
                evidenceState:
                  "proposed",
              },
            ],
          },
        });

        expect(
          promoted
            .validationOutcome,
        ).not.toBe(
          "validated",
        );

        expect(
          body.originClaim
            ?.candidates
            ?.some(
              (candidate: any) =>
                candidate?.id ===
                promoted
                  .candidateId,
            ),
        ).toBe(false);
      },
    );

    it(
      "deduplicates a real-provider DA proposal against the existing reviewed functional embryo",
      async () => {
        configureFakeRealProvider({
          word:
            "damage",
          candidates: [
            {
              language:
                "Albanian",
              candidateExpression:
                "DA",
              embryos: [
                {
                  form:
                    "DA",
                  gloss:
                    "split / divide",
                },
              ],
              semanticBridge:
                "A bounded split/divide function can motivate the reviewed damage candidate.",
              requiredTransforms:
                [],
              functionalExplanation:
                "Fixture functional explanation.",
            },
          ],
        });

        const response =
          await GET(
            new Request(
              "http://localhost/api/analyze-v1?word=damage&mode=strict",
            ),
          );

        expect(
          response.status,
        ).toBe(200);

        const body =
          await response.json();

        expect(
          body.analysisStatusV0_1,
        ).toMatchObject({
          status:
            "reviewed_functional_evidence",
          reviewedOperators: [
            "DA",
          ],
        });

        expect(
          body
            .automaticFunctionalProposalVerificationV0_1,
        ).toMatchObject({
          status:
            "deduplicated_only",
          acceptedCount: 0,
          rejectedCount: 0,
          deduplicatedCount: 1,
        });

        const reviewedDa =
          body.candidates.filter(
            (candidate: any) =>
              candidate
                ?.claimType ===
                "functionalMotivation" &&
              candidate
                ?.validationOutcome ===
                "validated" &&
              String(
                candidate?.embryo ??
                  candidate?.form ??
                  "",
              )
                .trim()
                .toUpperCase() ===
                "DA",
          );

        expect(
          reviewedDa.length,
        ).toBeGreaterThanOrEqual(
          1,
        );

        const automaticDa =
          body.candidates.filter(
            (candidate: any) =>
              candidate
                ?.sourceKind ===
                "automatic_llm_functional_proposal" &&
              String(
                candidate?.embryo ??
                  candidate?.form ??
                  "",
              )
                .trim()
                .toUpperCase() ===
                "DA",
          );

        expect(
          automaticDa,
        ).toEqual([]);
      },
    );

    it(
      "rejects a memory-style circular embryo gloss before user-facing promotion",
      async () => {
        configureFakeRealProvider({
          word:
            "memory",
          candidates: [
            {
              language:
                "English",
              candidateExpression:
                "MEM + OI",
              embryos: [
                {
                  form:
                    "MEM",
                  gloss:
                    "retain in memory",
                },
                {
                  form:
                    "OI",
                  gloss:
                    "perceive or know",
                },
              ],
              semanticBridge:
                "Retaining information and perceiving it can motivate the target concept.",
              requiredTransforms:
                [],
              functionalExplanation:
                "A bounded functional hypothesis.",
            },
          ],
        });

        const response =
          await GET(
            new Request(
              "http://localhost/api/analyze-v1?word=memory&mode=strict",
            ),
          );

        expect(
          response.status,
        ).toBe(200);

        const body =
          await response.json();

        expect(
          body
            .automaticFunctionalProposalVerificationV0_1,
        ).toMatchObject({
          status:
            "rejected_all",
          acceptedCount: 0,
          rejectedCount: 1,
          deduplicatedCount: 0,
        });

        const result =
          body
            .automaticFunctionalProposalVerificationV0_1
            .results[0];

        expect(
          result.checks.find(
            (check: any) =>
              check.id ===
              "PROPOSED_EMBRYO_GLOSS_NON_CIRCULAR",
          ),
        ).toMatchObject({
          pass: false,
        });

        expect(
          body.candidates.some(
            (candidate: any) =>
              candidate
                ?.sourceKind ===
              "automatic_llm_functional_proposal",
          ),
        ).toBe(false);

        // The rejected automatic functional proposal must not erase
        // an independently derived deterministic structural hypothesis.
        // MEMORY already yields MEMORY -> MEM -> EM with the automatic
        // proposer disabled; EM remains meaning-unknown and unreviewed.
        expect(
          body.analysisStatusV0_1,
        ).toMatchObject({
          status:
            "structural_unreviewed",
          reviewedOperators: [],
          candidateOnlyOperators: [],
          structuralTokens: [
            "EM",
          ],
        });

        const structuralEm =
          body.candidates.filter(
            (candidate: any) =>
              candidate
                ?.sourceKind ===
                "logic_derived_structural_hypothesis" &&
              candidate
                ?.embryo ===
                "EM",
          );

        expect(
          structuralEm,
        ).toHaveLength(1);

        expect(
          structuralEm[0],
        ).toMatchObject({
          claimType:
            "structuralHypothesis",
          embryo:
            "EM",
          embryoSize: 2,
          independentStandaloneMeaning:
            null,
          candidateTruthClaim:
            "not_claimed",
          historicalOriginClaim:
            "not_claimed",
        });
      },
    );

    it(
      "rejects an unauthorized-transform proposal without altering normal candidates",
      async () => {
        configureFakeRealProvider({
          word: "caldora",
          candidates: [
            {
              language:
                "Albanian",
              candidateExpression:
                "MI",
              embryos: [
                {
                  form: "MI",
                  gloss:
                    "fixture meaning",
                },
              ],
              semanticBridge:
                "fixture semantic bridge",
              requiredTransforms:
                [
                  "invented_transform",
                ],
              functionalExplanation:
                "fixture functional explanation",
            },
          ],
        });

        const response =
          await GET(
            new Request(
              "http://localhost/api/analyze-v1?word=caldora&mode=strict",
            ),
          );

        expect(
          response.status,
        ).toBe(200);

        const body =
          await response.json();

        expect(
          body
            .automaticFunctionalProposalVerificationV0_1,
        ).toMatchObject({
          status:
            "rejected_all",
          acceptedCount: 0,
          rejectedCount: 1,
        });

        expect(
          body.candidates.some(
            (candidate: any) =>
              candidate
                ?.sourceKind ===
              "automatic_llm_functional_proposal",
          ),
        ).toBe(false);
      },
    );
  },
);
