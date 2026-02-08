import { adaptSoundRootsToVM } from "@/ui/telemetry/soundRootsVM.v0.1";

describe("Telemetry VM: SoundRoots VM adapter v0.1", () => {
  it("returns not_emitted on null/undefined", () => {
    const v = adaptSoundRootsToVM(null);
    expect(v.kind).toBe("missing");
    if (v.kind === "missing") expect(v.missing).toBe("not_emitted");
  });

  it("adapts deepRoot.soundRoots into stable VM", () => {
    const payload = {
      deepRoot: {
        soundRoots: {
          domains: ["rain_water", "rain_water"],
          claimedDomains: ["rain_water", "wind_air"],
          missingDomains: ["wind_air"],
          warnings: [
            { code: "SOUNDROOTS_DOMAIN_CLAIM_UNSUPPORTED", domain: "wind_air" },
            { code: 123, domain: "x" }, // ignored
          ],
          matches: [
            { domain: "rain_water", gloss: "rain", carrier: "drip", root: "drip" },
            "wind_air",
            { domain: 42 }, // ignored
          ],
        },
      },
    };

    const v = adaptSoundRootsToVM(payload);
    expect(v.kind).toBe("present");
    if (v.kind === "present") {
      expect(v.value.domains).toEqual(["rain_water"]);
      expect(v.value.claimedDomains).toEqual(["rain_water", "wind_air"]);
      expect(v.value.missingDomains).toEqual(["wind_air"]);
      expect(v.value.warnings.length).toBe(1);
      expect(v.value.matches.length).toBe(2);
    }
  });

  it("returns malformed when soundRoots is non-object", () => {
    const payload = { deepRoot: { soundRoots: [] } };
    const v = adaptSoundRootsToVM(payload);
    expect(v.kind).toBe("missing");
    if (v.kind === "missing") expect(v.missing).toBe("malformed");
  });
});
