import { buildEvidencePackageFromVM } from "../src/ui/telemetry/buildEvidencePackageFromVM";

describe("buildEvidencePackageFromVM", () => {
  test("computes carrier path + mask/carrier delta when phoneticIpaV0_1 is present", () => {
    const vm: any = {
      wordShown: "rhythm",
      readout: {
        heartInstrumentV1: { surfaceVowels: ["Y"] },
        phoneticIpaV0_1: {
          kind: "present",
          value: { ipa: "/ˈrɪð(ə)m/", voices: ["I", "Ë"] },
        },
        // simulate a stale/incorrect upstream value; builder must override when carrier exists
        voicePathDelta: "MATCH",
      },
    };

    const pkg = buildEvidencePackageFromVM(vm);
    expect(pkg.summary?.voicePathSurface).toBe("Y");
    expect((pkg.summary as any)?.voicePathCarrier).toBe("I → Ë");
    expect(pkg.summary?.voicePathDelta).toBe("DIVERGE");
  });

  test("does not invent carrier info when phoneticIpaV0_1 is missing", () => {
    const vm: any = {
      wordShown: "study",
      readout: {
        voicePathSurface: "U → Y",
        voicePathDelta: "DIVERGE",
      },
    };

    const pkg = buildEvidencePackageFromVM(vm);
    expect((pkg.summary as any)?.voicePathCarrier).toBeUndefined();
    expect(pkg.summary?.voicePathDelta).toBe("DIVERGE");
  });
});
