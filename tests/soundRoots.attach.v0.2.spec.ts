import { attachSoundRootsV0_2 } from "@/shared/soundRoots/soundRoots.attach.v0.2";

describe("soundRoots.attach v0.2", () => {
  test("emits domains from matches and empty claim vectors when no deepRoot functionalRoots", () => {
    const result: any = { word: "study", deepRoot: { basis: "study" } };
    attachSoundRootsV0_2(result);

    expect(result.deepRoot.soundRoots.version).toBe("soundRoots-v0.2");
    expect(Array.isArray(result.deepRoot.soundRoots.matches)).toBe(true);
    expect(Array.isArray(result.deepRoot.soundRoots.domains)).toBe(true);
    expect(result.deepRoot.soundRoots.claimedDomains).toEqual([]);
    expect(result.deepRoot.soundRoots.missingDomains).toEqual([]);
    expect(result.deepRoot.soundRoots.warnings).toEqual([]);
  });

  test("emits unsupported-domain warning when deepRoot gloss claims rain/water but no matches", () => {
    const result: any = {
      word: "xxxxx", // should not match any v0.1 carriers
      deepRoot: {
        basis: "xxxxx",
        functionalRoots: [
          { gloss: "Functional reading: rain / water hiss (example claim text)." },
        ],
      },
    };

    attachSoundRootsV0_2(result);

    expect(result.deepRoot.soundRoots.version).toBe("soundRoots-v0.2");
    expect(result.deepRoot.soundRoots.domains).toEqual([]);
    expect(result.deepRoot.soundRoots.claimedDomains).toEqual(["rain_water"]);
    expect(result.deepRoot.soundRoots.missingDomains).toEqual(["rain_water"]);
    expect(result.deepRoot.soundRoots.warnings).toEqual([
      { code: "SOUNDROOTS_DOMAIN_CLAIM_UNSUPPORTED", domain: "rain_water" },
    ]);
  });
});
