import {
  GET,
  POST,
} from "../app/api/analyze-v1/route";

describe(
  "Open Instrument Slice D automatic functional proposer on normal Analyze",
  () => {
    const originalEnv = {
      OPEN_INSTRUMENT_AUTO_PROPOSER:
        process.env.OPEN_INSTRUMENT_AUTO_PROPOSER,
      OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER:
        process.env.OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER,
      PROPOSER_PROVIDER:
        process.env.PROPOSER_PROVIDER,
      OPENAI_API_KEY:
        process.env.OPENAI_API_KEY,
      OPENAI_MODEL:
        process.env.OPENAI_MODEL,
      OPENAI_BASE_URL:
        process.env.OPENAI_BASE_URL,
    };

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
    });

    afterAll(() => {
      restoreEnv();
    });

    it(
      "keeps the existing deterministic response unchanged when automatic discovery is disabled",
      async () => {
        const response =
          await GET(
            new Request(
              "http://localhost/api/analyze-v1?word=father&mode=strict",
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
        ).toBeUndefined();

        expect(
          body.candidates,
        ).toHaveLength(3);

        expect(
          body.candidates.every(
            (
              candidate: Record<
                string,
                unknown
              >,
            ) =>
              candidate[
                "sourceKind"
              ] !== "mock",
          ),
        ).toBe(true);
      },
    );

    it(
      "automatically invokes the proposer from normal GET Analyze in deterministic test mode without promoting mock output",
      async () => {
        process.env
          .OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER =
          "mock";

        const response =
          await GET(
            new Request(
              "http://localhost/api/analyze-v1?word=father&mode=strict",
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
          body.candidates,
        ).toHaveLength(3);

        expect(
          body.candidates.some(
            (
              candidate: Record<
                string,
                unknown
              >,
            ) =>
              String(
                candidate[
                  "sourceKind"
                ] ?? "",
              ).includes("mock"),
          ),
        ).toBe(false);
      },
    );

    it(
      "automatically invokes the same bounded path from normal POST Analyze without promoting mock output",
      async () => {
        process.env
          .OPEN_INSTRUMENT_AUTO_PROPOSER_TEST_PROVIDER =
          "mock";

        const response =
          await POST(
            new Request(
              "http://localhost/api/analyze-v1",
              {
                method: "POST",
                headers: {
                  "content-type":
                    "application/json",
                },
                body:
                  JSON.stringify({
                    word: "father",
                    mode: "strict",
                  }),
              },
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
            "mock_exercised_test_only",
          provider: "mock",
          userFacingEligible: false,
          proposal: null,
        });

        expect(
          body.candidates.some(
            (
              candidate: Record<
                string,
                unknown
              >,
            ) =>
              String(
                candidate[
                  "sourceKind"
                ] ?? "",
              ).includes("mock"),
          ),
        ).toBe(false);
      },
    );
  },
);
