/**
 * Heart Instrument v1 — public builder
 * Authority chain:
 * basis -> surfaceVowels -> values1to7 -> principlesPath + math7
 */

import {
  normalizeBasis,
  extractSevenVowels,
  computeMath7,
  value1to7,
} from "./math7.core.v1";

import { principlesPathFromVowels } from "./principles.core.v1";

export type HeartInstrumentV1Packet = {
  basisNfc: string;

  // what tests expect
  surfaceVowels: string[];

  principlesPath: string[];

  // what tests currently read
  math7: ReturnType<typeof computeMath7>;

  // optional convenience (safe)
  values1to7: number[];
  surfaceMath7: ReturnType<typeof computeMath7>;
};

export function buildHeartInstrumentV1(basis: string): HeartInstrumentV1Packet {
  const basisNfc = normalizeBasis(basis);

  // strict vowel filter + NFC authority
  const surfaceVowels = extractSevenVowels(basisNfc);

  // map vowels -> 1..7 ring values (public doctrine)
  const values1to7Arr = surfaceVowels.map((v) => value1to7(v as any));

  // ordered journey from sequence (melody)
  const principlesPath = principlesPathFromVowels(surfaceVowels as any);

  // checksum/jumps/events from the same numeric values (chord)
  const math7 = computeMath7(values1to7Arr);

  return {
    basisNfc,
    surfaceVowels,
    principlesPath,
    math7,

    // convenience aliases
    values1to7: values1to7Arr,
    surfaceMath7: math7,
  };
}

export type HeartInstrumentV1 = ReturnType<typeof buildHeartInstrumentV1>;

// Re-export low-level primitives (useful in tests/callers)
export {
  normalizeBasis,
  extractSevenVowels,
  computeMath7,
  value1to7,
} from "./math7.core.v1";

export { principlesPathFromVowels } from "./principles.core.v1";
