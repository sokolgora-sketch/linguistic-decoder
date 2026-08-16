import {
  adaptAnalysisToTelemetryVM,
} from "@/ui/instrument/contractAdapter";

describe(
  "contract adapter functional normalization authority v0.1",
  () => {
    test(
      "uses Slice G functional normalization without rewriting canonical surface",
      () => {
        const vm =
          adaptAnalysisToTelemetryVM({
            word:
              "memory",
            sanitized:
              "memory",
            engineVersion:
              "test",
            mode:
              "strict",
            alphabet:
              "auto",
            primaryPath: {
              voicePath: [
                "E",
                "O",
                "Y",
              ],
            },
            evidence: {
              surfaceVowelsRaw: [
                "E",
                "O",
                "Y",
              ],
              surfaceVowels: [
                "E",
                "O",
                "Y",
              ],
              vowelPath: [
                "E",
                "O",
                "Y",
              ],
              normalizationSteps:
                [],
            },
            functionalVoiceNormalizationV0_1: {
              functionalPath: [
                "E",
                "O",
                "I",
              ],
            },
            candidates: [],
          });

        expect(
          (
            vm as any
          ).readout
            .voicePathSurface,
        ).toEqual({
          kind:
            "present",
          value: [
            "E",
            "O",
            "Y",
          ],
        });

        expect(
          (
            vm as any
          ).readout
            .voicePathFunctional,
        ).toEqual({
          kind:
            "present",
          value: [
            "E",
            "O",
            "I",
          ],
        });

        expect(
          (
            vm as any
          ).readout
            .voicePathDelta,
        ).toBe(
          "DIVERGE",
        );
      },
    );

    test(
      "modern failed pronunciation attempt does not copy surface into functional",
      () => {
        const vm =
          adaptAnalysisToTelemetryVM({
            word:
              "memory",
            sanitized:
              "memory",
            engineVersion:
              "test",
            mode:
              "strict",
            alphabet:
              "auto",
            primaryPath: {
              voicePath: [
                "E",
                "O",
                "Y",
              ],
            },
            evidence: {
              surfaceVowelsRaw: [
                "E",
                "O",
                "Y",
              ],
              surfaceVowels: [
                "E",
                "O",
                "Y",
              ],
              vowelPath: [
                "E",
                "O",
                "Y",
              ],
              normalizationSteps:
                [],
            },
            automaticCarrierPronunciationV0_1: {
              attempted: true,
              status:
                "provider_error",
            },
            candidates: [],
          });

        expect(
          (
            vm as any
          ).readout
            .voicePathSurface,
        ).toEqual({
          kind:
            "present",
          value: [
            "E",
            "O",
            "Y",
          ],
        });

        expect(
          (
            vm as any
          ).readout
            .voicePathFunctional
            .kind,
        ).toBe(
          "missing",
        );
      },
    );

    test(
      "preserves legacy distinct functional evidence when Slice G envelope is absent",
      () => {
        const vm =
          adaptAnalysisToTelemetryVM({
            word:
              "study",
            primaryPath: {
              voicePath: [
                "U",
                "I",
              ],
            },
            heartInstrumentV1: {
              surfaceVowels: [
                "U",
                "Y",
              ],
            },
            evidence: {
              surfaceVowelsRaw: [
                "U",
                "Y",
              ],
              surfaceVowels: [
                "U",
                "I",
              ],
              vowelPath: [
                "U",
                "I",
              ],
            },
          });

        expect(
          (
            vm as any
          ).readout
            .voicePathFunctional,
        ).toEqual({
          kind:
            "present",
          value: [
            "U",
            "I",
          ],
        });
      },
    );
  },
);
