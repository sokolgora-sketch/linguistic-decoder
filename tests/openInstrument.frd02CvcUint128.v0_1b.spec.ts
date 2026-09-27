import {
  UNCOMPUTED_V0_1B,
  UINT128_BITS_V0_1B,
  Uint128V0_1B,
  ZERO_V0_1B,
} from "../src/shared/openInstrument/frd02CvcUint128.v0_1b";

const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);
const UINT128_MODULUS = BIGINT_ONE << BigInt(UINT128_BITS_V0_1B);
const UINT128_MAX = UINT128_MODULUS - BIGINT_ONE;
const THIRTY_FACTORIAL = BigInt("265252859812191058636308480000000");

describe("FRD-02 CVC v0.1b uint128 counts", () => {
  test("creates ZERO with four zero limbs", () => {
    expect(ZERO_V0_1B.toUint32Array()).toEqual(new Uint32Array([0, 0, 0, 0]));
    expect(ZERO_V0_1B.isUncomputed()).toBe(false);
  });

  test("creates UNCOMPUTED with four all-ones limbs", () => {
    expect(UNCOMPUTED_V0_1B.toUint32Array()).toEqual(
      new Uint32Array([0xffff_ffff, 0xffff_ffff, 0xffff_ffff, 0xffff_ffff]),
    );
    expect(UNCOMPUTED_V0_1B.isUncomputed()).toBe(true);
  });

  test("uses little-endian limb order", () => {
    const value = Uint128V0_1B.fromBigInt(BigInt("4294967298"));
    expect(value.toUint32Array()).toEqual(new Uint32Array([2, 1, 0, 0]));
  });

  test("supports equality and ordering", () => {
    const value = Uint128V0_1B.fromLimbs([7, 8, 9, 10]);
    expect(value.equals(value.clone())).toBe(true);
    expect(value.equals(Uint128V0_1B.fromLimbs([7, 8, 9, 11]))).toBe(false);
    expect(Uint128V0_1B.fromLimbs([5, 0, 0, 0]).compare(Uint128V0_1B.fromLimbs([4, 0, 0, 0]))).toBe(1);
    expect(Uint128V0_1B.fromLimbs([0, 1, 0, 0]).compare(Uint128V0_1B.fromLimbs([0, 0, 0, 0]))).toBe(1);
    expect(Uint128V0_1B.fromLimbs([0, 0, 1, 0]).compare(Uint128V0_1B.fromLimbs([0, 1, 0, 0]))).toBe(1);
    expect(Uint128V0_1B.fromLimbs([0, 0, 0, 1]).compare(Uint128V0_1B.fromLimbs([0, 0, 1, 0]))).toBe(1);
  });

  test("adds without carry and with carry across every limb boundary", () => {
    expect(Uint128V0_1B.fromLimbs([2, 3, 4, 5]).add(Uint128V0_1B.fromLimbs([6, 7, 8, 9])).toUint32Array()).toEqual(
      new Uint32Array([8, 10, 12, 14]),
    );
    expect(Uint128V0_1B.fromLimbs([0xffff_ffff, 0xffff_ffff, 0xffff_ffff, 0]).add(ZERO_V0_1B.add(Uint128V0_1B.fromLimbs([1, 0, 0, 0]))).toUint32Array()).toEqual(
      new Uint32Array([0, 0, 0, 1]),
    );
  });

  test("accepts the maximum non-sentinel representable sum", () => {
    const value = Uint128V0_1B.fromBigInt(UINT128_MAX - BigInt(2));
    const result = value.add(Uint128V0_1B.fromBigInt(BIGINT_ONE));
    expect(result.toBigInt()).toBe(UINT128_MAX - BIGINT_ONE);
    expect(result.isUncomputed()).toBe(false);
  });

  test("rejects uint128 overflow and a reserved sentinel result", () => {
    expect(() => Uint128V0_1B.fromBigInt(UINT128_MAX - BIGINT_ONE).add(Uint128V0_1B.fromBigInt(BigInt(2)))).toThrow("UINT128_OVERFLOW");
    expect(() => Uint128V0_1B.fromBigInt(UINT128_MAX - BIGINT_ONE).add(Uint128V0_1B.fromBigInt(BIGINT_ONE))).toThrow("UINT128_RESERVED_SENTINEL_RESULT");
    expect(() => UNCOMPUTED_V0_1B.add(ZERO_V0_1B)).toThrow("UINT128_SENTINEL_INPUT");
  });

  test("multiplies by zero, one, and a small multiplicity exactly", () => {
    const value = Uint128V0_1B.fromLimbs([11, 12, 13, 14]);
    expect(value.multiplySmall(0).toBigInt()).toBe(BIGINT_ZERO);
    expect(value.multiplySmall(1).equals(value)).toBe(true);
    expect(value.multiplySmall(3).toBigInt()).toBe(value.toBigInt() * BigInt(3));
  });

  test("handles cross-limb multiplication carries and rejects overflow", () => {
    expect(Uint128V0_1B.fromLimbs([0xffff_ffff, 0xffff_ffff, 0, 0]).multiplySmall(2).toUint32Array()).toEqual(
      new Uint32Array([0xffff_fffe, 0xffff_ffff, 1, 0]),
    );
    expect(() => Uint128V0_1B.fromBigInt(UINT128_MAX - BIGINT_ONE).multiplySmall(2)).toThrow("UINT128_OVERFLOW");
    const sentinelInput = UINT128_MAX / BigInt(3);
    expect(sentinelInput * BigInt(3)).toBe(UINT128_MAX);
    expect(() => Uint128V0_1B.fromBigInt(sentinelInput).multiplySmall(3)).toThrow("UINT128_RESERVED_SENTINEL_RESULT");
    expect(() => valueWithSentinel().multiplySmall(0)).toThrow("UINT128_SENTINEL_INPUT");
  });

  test("round-trips 30! and proves the frozen scientific bound", () => {
    const value = Uint128V0_1B.fromBigInt(THIRTY_FACTORIAL);
    expect(value.toBigInt()).toBe(THIRTY_FACTORIAL);
    expect(THIRTY_FACTORIAL < (BIGINT_ONE << BigInt(108))).toBe(true);
    expect(UNCOMPUTED_V0_1B.toBigInt() > THIRTY_FACTORIAL).toBe(true);
  });

  test("does not mutate inputs or expose mutable internal storage", () => {
    const value = Uint128V0_1B.fromLimbs([1, 2, 3, 4]);
    const before = value.toUint32Array();
    const exposed = value.toUint32Array();
    exposed[0] = 99;
    value.add(Uint128V0_1B.fromLimbs([5, 6, 7, 8]));
    expect(value.toUint32Array()).toEqual(before);

    const zeroCopy = ZERO_V0_1B.toUint32Array();
    zeroCopy[0] = 99;
    expect(ZERO_V0_1B.toBigInt()).toBe(BIGINT_ZERO);
  });

  test("validates exact construction inputs", () => {
    expect(() => Uint128V0_1B.fromLimbs([0, 0, 0])).toThrow("UINT128_INVALID_LIMB_COUNT");
    expect(() => Uint128V0_1B.fromLimbs([0, -1, 0, 0])).toThrow("UINT128_INVALID_LIMB");
    expect(() => Uint128V0_1B.fromBigInt(BigInt(-1))).toThrow("UINT128_BIGINT_OUT_OF_RANGE");
    expect(() => Uint128V0_1B.fromBigInt(UINT128_MODULUS)).toThrow("UINT128_BIGINT_OUT_OF_RANGE");
    expect(() => ZERO_V0_1B.multiplySmall(-1)).toThrow("UINT128_INVALID_MULTIPLICITY");
    expect(() => ZERO_V0_1B.multiplySmall(1.5)).toThrow("UINT128_INVALID_MULTIPLICITY");
  });
});

function valueWithSentinel(): Uint128V0_1B {
  return UNCOMPUTED_V0_1B;
}
