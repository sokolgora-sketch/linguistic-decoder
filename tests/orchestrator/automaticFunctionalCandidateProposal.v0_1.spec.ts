import {
  buildAutomaticFunctionalProposalContextV0_1,
  runAutomaticFunctionalCandidateProposalV0_1,
} from "../../src/shared/orchestrator/automaticFunctionalCandidateProposal.v0.1";

describe(
  "automatic functional candidate proposal v0.1",
  () => {
    const originalEnv = {
      OPEN_INSTRUMENT_AUTO_PROPOSER:
        process.env.OPEN_INSTRUMENT_AUTO_PROPOSER,
      OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER:
        process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER,
      OPEN_INSTRUMENT_AUTO_PROPOSER_TIMEOUT_MS:
        process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TIMEOUT_MS,
      PROPOSER_PROVIDER:
        process.env.PROPOSER_PROVIDER,
      OPENAI_API_KEY:
        process.env.OPENAI_API_KEY,
      OPENAI_MODEL:
        process.env.OPENAI_MODEL,
      OPENAI_BASE_URL:
        process.env.OPENAI_BASE_URL,
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

    beforeEach(() => {
      delete process.env
        .OPEN_INSTRUMENT_AUTO_PROPOSER;
      delete process.env
        .OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER;
      delete process.env
        .OPEN_INSTRUMENT_AUTO_PROPOSER_TIMEOUT_MS;
      delete process.env
        .PROPOSER_PROVIDER;
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
      "extracts compact deterministic proposer context without raw audit payloads",
      () => {
        const context =
          buildAutomaticFunctionalProposalContextV0_1(
            {
              evidence: {
                surfaceVowelsRaw:
                  ["U", "Y"],
                vowelPath:
                  ["U", "I"],
              },
              rootMap: {
                tokens: [
                  { token: "SHTU" },
                  { token: "DI" },
                ],
                keys: [
                  {
                    token: "SHTU",
                    language: "sq",
                    gloss:
                      "add / increase",
                    ops: [
                      "s_to_sh",
                    ],
                  },
                  {
                    token: "DI",
                    language: "sq",
                    gloss:
                      "know / knowledge",
                    ops: [
                      "y_to_i",
                    ],
                  },
                ],
              },
              analysisStatusV0_1: {
                reviewedOperators:
                  ["DI"],
                structuralTokens:
                  ["SHTU", "DI"],
              },
              candidates: [
                {
                  candidateLanguage:
                    "sq",
                  displayForm:
                    "SHTU + DI",
                  claimType:
                    "functionalMotivation",
                  validationOutcome:
                    "partial",
                },
              ],
            },
          );

        expect(
          context.surfaceVowelPath,
        ).toEqual(["U", "Y"]);

        expect(
          context.functionalVowelPath,
        ).toEqual(["U", "I"]);

        expect(
          context.rootMapTokens,
        ).toEqual([
          "SHTU",
          "DI",
        ]);

        expect(
          context.reviewedOperators,
        ).toEqual(["DI"]);

        expect(
          context.permittedTransforms,
        ).toEqual([
          "s_to_sh",
          "y_to_i",
        ]);

        expect(
          context.reviewedLexicalEvidence,
        ).toEqual([
          {
            embryo: "DI",
            language: "sq",
            gloss:
              "know / knowledge",
          },
        ]);
      },
    );

    it(
      "keeps deterministic mock execution test-only and never returns a mock proposal as user-facing discovery",
      async () => {
        const out =
          await runAutomaticFunctionalCandidateProposalV0_1(
            {
              word: "father",
              mode: "strict",
              analysis: {},
            },
            {
              providerOverrideForTests:
                "mock",
            },
          );

        expect(out).toMatchObject({
          attempted: true,
          status:
            "mock_exercised_test_only",
          provider: "mock",
          realProvider: false,
          mockProvider: true,
          userFacingEligible: false,
          verificationState:
            "not_started",
          proposal: null,
        });

        expect(
          out.candidateCount,
        ).toBeGreaterThan(0);
      },
    );

    it(
      "parses a structured real-provider functional proposal but keeps it unverified for Slice E",
      async () => {
        process.env.OPENAI_API_KEY =
          "fake-key";
        process.env.OPENAI_MODEL =
          "fake-model";
        process.env.OPENAI_BASE_URL =
          "http://localhost:11434/v1";

        const rawProposal =
          JSON.stringify({
            word: "mosaic",
            candidates: [
              {
                language:
                  "Albanian",
                candidateExpression:
                  "MO + SA",
                embryos: [
                  {
                    form: "MO",
                    gloss:
                      "fixture meaning one",
                  },
                  {
                    form: "SA",
                    gloss:
                      "fixture meaning two",
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

        global.fetch =
          jest.fn(
            async (
              input: unknown,
              init?: RequestInit,
            ) => {
              expect(
                String(input),
              ).toBe(
                "http://localhost:11434/v1/chat/completions",
              );

              const body =
                JSON.parse(
                  String(
                    init?.body ??
                      "{}",
                  ),
                );

              expect(
                body.messages[0]
                  .content,
              ).toContain(
                "smallest useful meaningful embryo",
              );

              const userPayload =
                JSON.parse(
                  body.messages[1]
                    .content,
                );

              expect(
                userPayload.word,
              ).toBe("mosaic");

              expect(
                userPayload
                  .deterministicContext,
              ).toBeDefined();

              return new Response(
                JSON.stringify({
                  choices: [
                    {
                      message: {
                        content:
                          rawProposal,
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

        const out =
          await runAutomaticFunctionalCandidateProposalV0_1(
            {
              word: "mosaic",
              mode: "strict",
              analysis: {
                evidence: {
                  surfaceVowels:
                    ["O", "A", "I"],
                },
              },
            },
            {
              providerOverrideForTests:
                "openai_compat",
              timeoutMs: 1000,
            },
          );

        expect(out).toMatchObject({
          attempted: true,
          status:
            "proposed_unverified",
          provider:
            "openai_compat",
          realProvider: true,
          mockProvider: false,
          userFacingEligible: false,
          verificationState:
            "pending_slice_e",
          candidateCount: 1,
          error: null,
        });

        expect(
          out.proposal
            ?.candidates[0],
        ).toMatchObject({
          language: "Albanian",
          candidateExpression:
            "MO + SA",
          semanticBridge:
            "fixture semantic bridge",
          functionalExplanation:
            "fixture functional explanation",
        });
      },
    );

    it(
      "fails gracefully when the configured real provider errors",
      async () => {
        process.env.OPENAI_API_KEY =
          "fake-key";
        process.env.OPENAI_MODEL =
          "fake-model";

        global.fetch =
          jest.fn(
            async () =>
              new Response(
                "provider failure",
                { status: 500 },
              ),
          ) as typeof fetch;

        const out =
          await runAutomaticFunctionalCandidateProposalV0_1(
            {
              word: "mosaic",
              mode: "strict",
              analysis: {},
            },
            {
              providerOverrideForTests:
                "openai_compat",
              timeoutMs: 1000,
            },
          );

        expect(out).toMatchObject({
          attempted: true,
          status:
            "provider_error",
          provider:
            "openai_compat",
          realProvider: true,
          userFacingEligible: false,
          proposal: null,
          error:
            "provider_error",
        });
      },
    );
  },
);
