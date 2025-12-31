import { buildHeartInstrumentV1 } from "../src/v1/heartInstrument.v1";
import {
  extractSevenVowels,
  normalizeBasis,
  computeMath7,
  value1to7,
} from "../src/v1/math7.core.v1";
import { principlesPathFromVowels } from "../src/v1/principles.core.v1";

describe("Heart Instrument v1 — invariants", () => {
  const words = [
    "damage",
    "father",
    "gjak",
    "zemër",
    "internet",
    "shter",
    "algorithm",
    "philosophy",
    // explicit Ë stress
    "tëhollë",
  ] as const;

  for (const w of words) {
    it(`${w}: basis->vowels->path+math derived coherently`, () => {
      const pkt = buildHeartInstrumentV1(w);

      // R1 NFC normalization is the authority basis
      expect(pkt.basisNfc).toBe(normalizeBasis(w));

      // R2 strict vowel filter
      expect(pkt.surfaceVowels).toEqual(extractSevenVowels(pkt.basisNfc));

      // R4 PrinciplesPath is sequence-driven
      expect(pkt.principlesPath).toEqual(principlesPathFromVowels(pkt.surfaceVowels));

      // R5 Path↔Total coherence: math totals must recompute from same values
      const values1to7 = pkt.surfaceVowels.map(value1to7);
      const recomputed = computeMath7(values1to7);

      expect(pkt.math7.values1to7).toEqual(recomputed.values1to7);
      expect(pkt.math7.rawSum).toBe(recomputed.rawSum);
      expect(pkt.math7.totalMod7).toBe(recomputed.totalMod7);
      expect(pkt.math7.total1to7).toBe(recomputed.total1to7);
      expect(pkt.math7.wrapCount).toBe(recomputed.wrapCount);
      expect(pkt.math7.jumps).toEqual(recomputed.jumps);
      expect(pkt.math7.events).toEqual(recomputed.events);

      // Basic guardrail: if vowels exist, principlesPath must match length
      expect(pkt.principlesPath.length).toBe(pkt.surfaceVowels.length);
    });
  }
});
