const LIMB_COUNT_V0_1B = 4;
const LIMB_BITS_V0_1B = 32;
const LIMB_BASE_NUMBER_V0_1B = 0x1_0000_0000;
const LIMB_BASE_BIGINT_V0_1B = BigInt(LIMB_BASE_NUMBER_V0_1B);
const LIMB_MASK_BIGINT_V0_1B = LIMB_BASE_BIGINT_V0_1B - BigInt(1);
const UINT128_MODULUS_V0_1B = BigInt(1) << BigInt(128);
const UINT128_MAX_V0_1B = UINT128_MODULUS_V0_1B - BigInt(1);

export const UINT128_BITS_V0_1B = 128;
export const UINT128_LIMB_COUNT_V0_1B = LIMB_COUNT_V0_1B;

function failV0_1B(code: string): never {
  throw new RangeError(code);
}

function assertLimbsV0_1B(limbs: readonly number[]): void {
  if (limbs.length !== LIMB_COUNT_V0_1B) failV0_1B("UINT128_INVALID_LIMB_COUNT");
  for (const limb of limbs) {
    if (!Number.isInteger(limb) || limb < 0 || limb >= LIMB_BASE_NUMBER_V0_1B) {
      failV0_1B("UINT128_INVALID_LIMB");
    }
  }
}

function assertArithmeticInputV0_1B(value: Uint128V0_1B): void {
  if (value.isUncomputed()) failV0_1B("UINT128_SENTINEL_INPUT");
}

/**
 * Exact unsigned 128-bit storage for FRD-02 v0.1b component counts.
 *
 * The private Uint32Array is little-endian: limb 0 contains the least
 * significant 32 bits. Every public operation returns a fresh value and
 * never mutates an input value.
 */
export class Uint128V0_1B {
  private readonly limbs: Uint32Array;

  private constructor(limbs: Uint32Array) {
    this.limbs = limbs;
  }

  static zero(): Uint128V0_1B {
    return new Uint128V0_1B(new Uint32Array(LIMB_COUNT_V0_1B));
  }

  static uncomputed(): Uint128V0_1B {
    return new Uint128V0_1B(
      new Uint32Array([
        0xffff_ffff,
        0xffff_ffff,
        0xffff_ffff,
        0xffff_ffff,
      ]),
    );
  }

  static fromLimbs(limbs: readonly number[]): Uint128V0_1B {
    assertLimbsV0_1B(limbs);
    return new Uint128V0_1B(new Uint32Array(limbs));
  }

  static fromBigInt(value: bigint): Uint128V0_1B {
    if (value < BigInt(0) || value > UINT128_MAX_V0_1B) {
      failV0_1B("UINT128_BIGINT_OUT_OF_RANGE");
    }

    const limbs = new Uint32Array(LIMB_COUNT_V0_1B);
    let remaining = value;
    for (let index = 0; index < LIMB_COUNT_V0_1B; index += 1) {
      limbs[index] = Number(remaining & LIMB_MASK_BIGINT_V0_1B);
      remaining >>= BigInt(LIMB_BITS_V0_1B);
    }
    return new Uint128V0_1B(limbs);
  }

  clone(): Uint128V0_1B {
    return new Uint128V0_1B(this.limbs.slice());
  }

  toUint32Array(): Uint32Array {
    return this.limbs.slice();
  }

  equals(other: Uint128V0_1B): boolean {
    for (let index = 0; index < LIMB_COUNT_V0_1B; index += 1) {
      if (this.limbs[index] !== other.limbs[index]) return false;
    }
    return true;
  }

  compare(other: Uint128V0_1B): -1 | 0 | 1 {
    for (let index = LIMB_COUNT_V0_1B - 1; index >= 0; index -= 1) {
      if (this.limbs[index] < other.limbs[index]) return -1;
      if (this.limbs[index] > other.limbs[index]) return 1;
    }
    return 0;
  }

  add(other: Uint128V0_1B): Uint128V0_1B {
    assertArithmeticInputV0_1B(this);
    assertArithmeticInputV0_1B(other);

    const result = new Uint32Array(LIMB_COUNT_V0_1B);
    let carry = 0;
    for (let index = 0; index < LIMB_COUNT_V0_1B; index += 1) {
      const sum = this.limbs[index] + other.limbs[index] + carry;
      result[index] = sum % LIMB_BASE_NUMBER_V0_1B;
      carry = sum >= LIMB_BASE_NUMBER_V0_1B ? 1 : 0;
    }
    if (carry !== 0) failV0_1B("UINT128_OVERFLOW");

    const value = new Uint128V0_1B(result);
    if (value.isUncomputed()) failV0_1B("UINT128_RESERVED_SENTINEL_RESULT");
    return value;
  }

  multiplySmall(multiplicity: number): Uint128V0_1B {
    assertArithmeticInputV0_1B(this);
    if (!Number.isSafeInteger(multiplicity) || multiplicity < 0) {
      failV0_1B("UINT128_INVALID_MULTIPLICITY");
    }

    const multiplier = BigInt(multiplicity);
    const result = new Uint32Array(LIMB_COUNT_V0_1B);
    let carry = BigInt(0);
    for (let index = 0; index < LIMB_COUNT_V0_1B; index += 1) {
      const product = BigInt(this.limbs[index]) * multiplier + carry;
      result[index] = Number(product & LIMB_MASK_BIGINT_V0_1B);
      carry = product >> BigInt(LIMB_BITS_V0_1B);
    }
    if (carry !== BigInt(0)) failV0_1B("UINT128_OVERFLOW");

    const value = new Uint128V0_1B(result);
    if (value.isUncomputed()) failV0_1B("UINT128_RESERVED_SENTINEL_RESULT");
    return value;
  }

  toBigInt(): bigint {
    let result = BigInt(0);
    for (let index = LIMB_COUNT_V0_1B - 1; index >= 0; index -= 1) {
      result = (result << BigInt(LIMB_BITS_V0_1B)) + BigInt(this.limbs[index]);
    }
    return result;
  }

  isUncomputed(): boolean {
    for (const limb of this.limbs) {
      if (limb !== 0xffff_ffff) return false;
    }
    return true;
  }
}

export const ZERO_V0_1B = Uint128V0_1B.zero();
export const UNCOMPUTED_V0_1B = Uint128V0_1B.uncomputed();
