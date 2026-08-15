import {
  isLoopbackCarrierBaseUrlV0_1,
  parseAutomaticCarrierPronunciationV0_1,
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
  },
);
