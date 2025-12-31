import {
  computeMath7,
  extractSevenVowels,
  normalizeBasis,
  value1to7,
  type Math7Packet,
  type SevenVowel,
} from "./math7.core.v1";
import {
  principlesPathFromVowels,
  type PrincipleId,
} from "./principles.core.v1";

export type HeartInstrumentPacketV1 = {
  basisNfc: string;              // NFC normalized (source-of-truth string for extraction)
  surfaceVowels: SevenVowel[];   // strict seven-vowel extraction
  principlesPath: PrincipleId[]; // 1:1 with surfaceVowels
  math7: Math7Packet;            // derived from same vowel values
};

/**
 * Heart Instrument v1
 * Single authority chain:
 * basisNfc -> vowels -> principlesPath + math7 (same values)
 */
export function buildHeartInstrumentV1(basis: string): HeartInstrumentPacketV1 {
  const basisNfc = normalizeBasis(basis);
  const surfaceVowels = extractSevenVowels(basisNfc);
  const principlesPath = principlesPathFromVowels(surfaceVowels);
  const values1to7 = surfaceVowels.map(value1to7);
  const math7 = computeMath7(values1to7);

  return {
    basisNfc,
    surfaceVowels,
    principlesPath,
    math7,
  };
}
