import {
  GET,
} from "@/app/api/analyze-v1/route";

function requestFor(
  word: string,
  ipa?: string,
): Request {
  const url =
    new URL(
      "http://localhost/api/analyze-v1",
    );

  url.searchParams.set(
    "word",
    word,
  );

  url.searchParams.set(
    "mode",
    "strict",
  );

  if (ipa) {
    url.searchParams.set(
      "ipa",
      ipa,
    );
  }

  return new Request(
    url.toString(),
  );
}

describe(
  "Slice G raw evidence-package functional-path coherence v0.1",
  () => {
    test(
      "memory keeps canonical E-O-Y while raw evidence package reports bounded functional E-O-I",
      async () => {
        const response =
          await GET(
            requestFor(
              "memory",
              "/ˈmɛməri/",
            ),
          );

        expect(
          response.status,
        ).toBe(200);

        const body =
          await response.json();

        expect(
          body.evidence.vowelPath,
        ).toEqual([
          "E",
          "O",
          "Y",
        ]);

        expect(
          body
            .functionalVoiceNormalizationV0_1
            .functionalPath,
        ).toEqual([
          "E",
          "O",
          "I",
        ]);

        expect(
          body
            .evidencePackage
            .summary,
        ).toMatchObject({
          voicePath:
            "E → O → Y",
          voicePathSurface:
            "E → O → Y",
          voicePathFunctional:
            "E → O → I",
          voicePathDelta:
            "DIVERGE",
        });

        expect(
          body
            .evidencePackage
            .sevenPrinciplesSpectrum
            .functional
            .indices1,
        ).toEqual([
          2,
          4,
          3,
        ]);
      },
    );

    test(
      "study raw evidence package keeps higher-authority DeepRoot U-I",
      async () => {
        const response =
          await GET(
            requestFor(
              "study",
            ),
          );

        expect(
          response.status,
        ).toBe(200);

        const body =
          await response.json();

        expect(
          body.evidence.vowelPath,
        ).toEqual([
          "U",
          "Y",
        ]);

        expect(
          body
            .evidencePackage
            .summary,
        ).toMatchObject({
          voicePath:
            "U → Y",
          voicePathSurface:
            "U → Y",
          voicePathFunctional:
            "U → I",
          voicePathDelta:
            "DIVERGE",
        });
      },
    );

    test(
      "unsupported modern normalization does not copy surface into functional audit truth",
      async () => {
        const response =
          await GET(
            requestFor(
              "riverglass",
              "/ˈrɪvərɡlæs/",
            ),
          );

        expect(
          response.status,
        ).toBe(200);

        const body =
          await response.json();

        expect(
          body
            .functionalVoiceNormalizationV0_1
            .status,
        ).toBe(
          "unsupported_difference",
        );

        expect(
          body
            .evidencePackage
            .summary
            .voicePathSurface,
        ).toBe(
          "I → E → A",
        );

        expect(
          body
            .evidencePackage
            .summary
            .voicePathFunctional ??
            "",
        ).toBe("");

        expect(
          body
            .evidencePackage
            .summary
            .voicePathDelta ??
            "",
        ).toBe("");
      },
    );
  },
);
