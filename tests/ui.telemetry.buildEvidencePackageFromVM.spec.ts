import { buildEvidencePackageFromVM } from "../src/ui/telemetry/buildEvidencePackageFromVM";

describe("buildEvidencePackageFromVM", () => {
  test("keeps functional delta separate from mask/carrier delta when phoneticIpaV0_1 is present", () => {
    const vm: any = {
      wordShown: "rhythm",
      readout: {
        voicePathSurface: ["Y"],
        voicePathFunctional: ["Y"],
        voicePathDelta: "MATCH",
        heartInstrumentV1: {
          surfaceVowels: ["Y"],
        },
        phoneticIpaV0_1: {
          kind: "present",
          value: {
            ipa: "/ˈrɪð(ə)m/",
            voices: ["I", "Ë"],
          },
        },
      },
    };

    const pkg =
      buildEvidencePackageFromVM(vm);

    expect(
      pkg.summary?.voicePathSurface,
    ).toBe("Y");

    expect(
      pkg.summary?.voicePathFunctional,
    ).toBe("Y");

    expect(
      pkg.summary?.voicePathDelta,
    ).toBe("MATCH");

    expect(
      pkg.summary?.voicePathCarrier,
    ).toBe("I → Ë");

    expect(
      pkg.summary?.voicePathCarrierDelta,
    ).toBe("DIVERGE");
  });

  test.each([
    "U-Y",
    "U→Y",
    "U → Y",
  ])(
    "normalizes equivalent surface path formatting before carrier comparison: %s",
    (surfacePath) => {
      const vm: any = {
        wordShown: "study",
        readout: {
          voicePathSurface:
            surfacePath,
          voicePathFunctional: [
            "U",
            "I",
          ],
          voicePathDelta:
            "DIVERGE",
          phoneticIpaV0_1: {
            kind: "present",
            value: {
              ipa: "/ʊʏ/",
              voices: [
                "U",
                "Y",
              ],
            },
          },
        },
      };

      const pkg =
        buildEvidencePackageFromVM(vm);

      expect(
        pkg.summary
          ?.voicePathSurface,
      ).toBe(surfacePath);

      expect(
        pkg.summary
          ?.voicePathFunctional,
      ).toBe("U → I");

      expect(
        pkg.summary
          ?.voicePathDelta,
      ).toBe("DIVERGE");

      expect(
        pkg.summary
          ?.voicePathCarrier,
      ).toBe("U → Y");

      expect(
        pkg.summary
          ?.voicePathCarrierDelta,
      ).toBe("MATCH");
    },
  );

  test("does not invent carrier info when phoneticIpaV0_1 is missing", () => {
    const vm: any = {
      wordShown: "study",
      readout: {
        voicePathSurface: "U → Y",
        voicePathDelta: "DIVERGE",
      },
    };

    const pkg = buildEvidencePackageFromVM(vm);
    expect(
      pkg.summary?.voicePathCarrier,
    ).toBeUndefined();

    expect(
      pkg.summary?.voicePathCarrierDelta,
    ).toBeUndefined();

    expect(
      pkg.summary?.voicePathDelta,
    ).toBe("DIVERGE");
  });
});
