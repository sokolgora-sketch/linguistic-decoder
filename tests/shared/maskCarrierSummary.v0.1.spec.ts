import { buildMaskCarrierSummaryV0_1 } from "@/shared/maskCarrierSummary.v0.1";

test("mask only (no IPA) returns mask + no carrier", () => {
  const s = buildMaskCarrierSummaryV0_1({ word: "father" });
  expect(s.word).toBe("father");
  expect(s.mask.voices.length).toBeGreaterThan(0);
  expect(s.carrier).toBeUndefined();
});

test("father: mask AE vs carrier AË => mismatch", () => {
  const s = buildMaskCarrierSummaryV0_1({ word: "father", ipa: "/ˈfɑːðər/" });
  expect(s.mask.voices.join("")).toBe("AE");
  expect(s.carrier?.voices.join("")).toBe("AË");
  expect(s.mismatch).toBe(true);
  expect(typeof s.distance).toBe("number");
});

test("bread: mask EA vs carrier E => mismatch", () => {
  const s = buildMaskCarrierSummaryV0_1({ word: "bread", ipa: "/brɛd/" });
  expect(s.mask.voices.join("")).toBe("EA");
  expect(s.carrier?.voices.join("")).toBe("E");
  expect(s.mismatch).toBe(true);
});

test("hydor: carrier /hyːdɔːr/ => Y O", () => {
  const s = buildMaskCarrierSummaryV0_1({ word: "ὕδωρ", ipa: "/hyːdɔːr/" });
  expect(s.carrier?.voices).toEqual(["Y", "O"]);
});
