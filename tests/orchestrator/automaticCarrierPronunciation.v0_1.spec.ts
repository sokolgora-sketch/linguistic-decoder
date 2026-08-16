import {
  isLoopbackCarrierBaseUrlV0_1,
  parseAutomaticCarrierPronunciationV0_1,
  runAutomaticCarrierPronunciationV0_1,
} from "@/shared/orchestrator/automaticCarrierPronunciation.v0.1";

describe(
  "automatic carrier pronunciation v0.1",
  () => {
    test(
      "parses fenced pronunciation JSON",
      () => {
        expect(
          parseAutomaticCarrierPronunciationV0_1(
            [
              "```json",
              "{",
              '  "language": "English",',
              '  "ipa": "/ˈrɪðəm/"',
              "}",
              "```",
            ].join(
              "\n",
            ),
          ),
        ).toEqual({
          language:
            "English",
          ipa:
            "/ˈrɪðəm/",
        });
      },
    );

    test(
      "accepts only loopback HTTP provider endpoints",
      () => {
        expect(
          isLoopbackCarrierBaseUrlV0_1(
            "http://127.0.0.1:11434/v1",
          ),
        ).toBe(true);

        expect(
          isLoopbackCarrierBaseUrlV0_1(
            "http://localhost:11434/v1",
          ),
        ).toBe(true);

        expect(
          isLoopbackCarrierBaseUrlV0_1(
            "https://api.openai.com/v1",
          ),
        ).toBe(false);
      },
    );

    test(
      "manual IPA does not invent an English language hint",
      async () => {
        const result =
          await runAutomaticCarrierPronunciationV0_1({
            word:
              "muy",
            mode:
              "strict",
            manualIpa:
              "/mui/",
          });

        expect(
          result.status,
        ).toBe(
          "manual_ipa",
        );

        expect(
          result.language,
        ).toBeNull();

        expect(
          result.ipa,
        ).toBe(
          "/mui/",
        );
      },
    );

    test(
      "manual IPA preserves an explicit language hint",
      async () => {
        const result =
          await runAutomaticCarrierPronunciationV0_1({
            word:
              "memory",
            mode:
              "strict",
            manualIpa:
              "/ˈmɛməri/",
            manualLanguageHint:
              "English",
          });

        expect(
          result.language,
        ).toBe(
          "English",
        );
      },
    );

    test(
      "carrier timeout aborts the underlying local provider fetch",
      async () => {
        const envKeys = [
          "OPEN_INSTRUMENT_AUTO_CARRIER",
          "OPEN_INSTRUMENT_AUTO_CARRIER_TIMEOUT_MS",
          "OPENAI_BASE_URL",
          "OPENAI_MODEL",
          "OPENAI_API_KEY",
        ] as const;

        const originalEnv =
          Object.fromEntries(
            envKeys.map(
              (key) => [
                key,
                process.env[key],
              ],
            ),
          );

        const originalFetch =
          global.fetch;

        let observedSignal:
          AbortSignal | null =
          null;

        process.env
          .OPEN_INSTRUMENT_AUTO_CARRIER =
          "1";

        process.env
          .OPEN_INSTRUMENT_AUTO_CARRIER_TIMEOUT_MS =
          "500";

        process.env
          .OPENAI_BASE_URL =
          "http://127.0.0.1:11434/v1";

        process.env
          .OPENAI_MODEL =
          "fixture-model";

        process.env
          .OPENAI_API_KEY =
          "fixture-key";

        global.fetch =
          jest.fn(
            (
              _input: unknown,
              init?: RequestInit,
            ) => {
              const signal =
                init?.signal ??
                null;

              observedSignal =
                signal;

              return new Promise<Response>(
                (_resolve, reject) => {
                  if (!signal) {
                    return;
                  }

                  const rejectAbort =
                    () => {
                      const error =
                        new Error(
                          "aborted",
                        );

                      error.name =
                        "AbortError";

                      reject(
                        error,
                      );
                    };

                  if (
                    signal.aborted
                  ) {
                    rejectAbort();
                    return;
                  }

                  signal.addEventListener(
                    "abort",
                    rejectAbort,
                    {
                      once: true,
                    },
                  );
                },
              );
            },
          ) as any;

        try {
          const result =
            await runAutomaticCarrierPronunciationV0_1({
              word:
                "memory",
              mode:
                "strict",
            });

          expect(
            result.status,
          ).toBe(
            "provider_error",
          );

          expect(
            result.error,
          ).toBe(
            "timeout",
          );

          expect(
            observedSignal,
          ).not.toBeNull();

          expect(
            observedSignal
              ?.aborted,
          ).toBe(true);
        } finally {
          global.fetch =
            originalFetch;

          for (
            const key
            of envKeys
          ) {
            const value =
              originalEnv[
                key
              ];

            if (
              typeof value ===
              "undefined"
            ) {
              delete process
                .env[key];
            } else {
              process
                .env[key] =
                value;
            }
          }
        }
      },
      3000,
    );
  },
);
