import {
  boundedBigIntIndexV0_1B,
  canonicalCompareV0_1B,
  countExactNullV0_1B,
  enumerateExactNullAssignmentsV0_1B,
  ExactNullSignatureClassV0_1B,
  safeDonorTypeIdentityV0_1B,
  sampleExactNullAssignmentV0_1B,
  Xoshiro256ssV0_1B,
} from "../src/shared/openInstrument/frd02CvcExactNull.v0_1b";
import { Uint128V0_1B } from "../src/shared/openInstrument/frd02CvcUint128.v0_1b";

type Matrix = readonly (readonly boolean[])[];

const SEED: readonly [bigint, bigint, bigint, bigint] = [
  BigInt("1"),
  BigInt("2"),
  BigInt("3"),
  BigInt("4"),
];

function classFromMatrix(
  matrix: Matrix,
  options: {
    classId?: string;
    profiles?: readonly (readonly string[])[];
    observed?: boolean;
    slotCount?: number;
  } = {},
): ExactNullSignatureClassV0_1B {
  const classId = options.classId ?? "class";
  const slotCount = options.slotCount ?? matrix.length;
  const slotIds = Array.from({ length: slotCount }, (_, index) => `s${index}`);
  const profiles = options.profiles;
  const recipients = matrix.map((row, recipientIndex) => ({
    recipientId: `r${recipientIndex}`,
    signatureClassId: classId,
    primarySlots: slotIds.map((slotId, slotIndex) => ({
      slotId,
      leftIdentity: `left-${recipientIndex}-${slotIndex}`,
    })),
  }));
  const donors = matrix[0].map((_, donorIndex) => ({
    donorId: `d${donorIndex}`,
    signatureClassId: classId,
    rightIdentityBySlot: slotIds.map((slotId, slotIndex) => ({
      slotId,
      rightIdentity:
        profiles?.[donorIndex]?.[slotIndex] ??
        (matrix[slotIndex]?.[donorIndex]
          ? `right-${donorIndex}-${slotIndex}`
          : `left-${slotIndex}-${slotIndex}`),
    })),
  }));
  const observed = options.observed === false ? undefined : recipients.map((recipient, recipientIndex) => ({
    recipientId: recipient.recipientId,
    donorId: donors[recipientIndex].donorId,
  }));
  return { signatureClassId: classId, primarySlotIds: slotIds, recipients, donors, observedAssignment: observed };
}

function complete(size: number): Matrix {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => true));
}

function diagonalForbidden(size: number): Matrix {
  return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => row !== column));
}

function assignmentKey(assignment: readonly { recipientId: string; donorId: string }[]): string {
  return assignment.map((entry) => `${entry.recipientId}->${entry.donorId}`).join("|");
}

function bruteForceCount(input: ExactNullSignatureClassV0_1B): number {
  const size = input.recipients.length;
  const donors = input.donors.map((donor) => donor.donorId);
  const leftByRecipient = new Map(
    input.recipients.map((recipient) => [recipient.recipientId, new Map(recipient.primarySlots.map((slot) => [slot.slotId, slot.leftIdentity]))]),
  );
  const rightByDonor = new Map(
    input.donors.map((donor) => [donor.donorId, new Map(donor.rightIdentityBySlot.map((slot) => [slot.slotId, slot.rightIdentity]))]),
  );
  let count = 0;
  const used = new Set<string>();
  const visit = (recipientIndex: number): void => {
    if (recipientIndex === size) {
      count += 1;
      return;
    }
    const recipient = input.recipients[recipientIndex];
    for (const donorId of donors) {
      if (used.has(donorId)) continue;
      const left = leftByRecipient.get(recipient.recipientId);
      const right = rightByDonor.get(donorId);
      const admissible = input.primarySlotIds.every((slotId) => left?.get(slotId) !== right?.get(slotId));
      if (!admissible) continue;
      used.add(donorId);
      visit(recipientIndex + 1);
      used.delete(donorId);
    }
  };
  visit(0);
  return count;
}

function expectReadyCount(input: readonly ExactNullSignatureClassV0_1B[], expected: bigint) {
  const result = countExactNullV0_1B(input);
  expect(result.status === "READY" || result.status === "FINITE_FAILURE").toBe(true);
  expect(result.totalCount).toBe(expected);
  return result;
}

describe("FRD-02 CVC v0.1b exact structural-zero NULL", () => {
  test("T1: counts a 1x1 admissible graph", () => {
    expectReadyCount([classFromMatrix([[true]])], BigInt(1));
  });

  test("T2: counts a 2x2 complete graph", () => {
    expectReadyCount([classFromMatrix(complete(2))], BigInt(2));
  });

  test("T3: counts a 3x3 complete graph", () => {
    expectReadyCount([classFromMatrix(complete(3))], BigInt(6));
  });

  test("T4: counts a 2x2 diagonal-forbidden graph", () => {
    expectReadyCount([classFromMatrix(diagonalForbidden(2), { observed: false })], BigInt(1));
  });

  test("T5: counts the 3x3 derangement graph", () => {
    expectReadyCount([classFromMatrix(diagonalForbidden(3), { observed: false })], BigInt(2));
  });

  test("T6: reports no admissible null realizations", () => {
    const result = countExactNullV0_1B([classFromMatrix([[false, false], [false, false]], { observed: false })]);
    expect(result).toMatchObject({ status: "FINITE_FAILURE", branch: "NO_ADMISSIBLE_NULL_REALIZATIONS", totalCount: BigInt(0) });
  });

  test("T7: reduces recipient- and donor-degree-one cascades and restores forced pairs", () => {
    const result = enumerateExactNullAssignmentsV0_1B([
      classFromMatrix(
        [
          [true, false, false],
          [true, true, false],
          [false, true, true],
        ],
        { observed: false },
      ),
    ]);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.assignments).toHaveLength(1);
    expect(result.assignments[0]).toHaveLength(3);
    expect(new Set(result.assignments[0].map((entry) => entry.donorId))).toEqual(new Set(["d0", "d1", "d2"]));
    expect(result.assignments[0].map((entry) => `${entry.recipientId}->${entry.donorId}`)).toEqual([
      "r0->d0",
      "r1->d1",
      "r2->d2",
    ]);
  });

  test("T8: factors two independent balanced components", () => {
    const result = countExactNullV0_1B([
      classFromMatrix([
        [true, true, false, false],
        [true, true, false, false],
        [false, false, true, true],
        [false, false, true, true],
      ]),
    ]);
    expectReadyCount([classFromMatrix(complete(2), { classId: "a" }), classFromMatrix(complete(2), { classId: "b" })], BigInt(4));
    expect(result.totalCount).toBe(BigInt(4));
  });

  test("T9: safe duplicate donor profiles preserve labeled count", () => {
    const input = classFromMatrix(complete(2), { profiles: [["same", "same"], ["same", "same"]] });
    expectReadyCount([input], BigInt(bruteForceCount(input)));
    const result = countExactNullV0_1B([input]);
    expect(result.status === "READY" || result.status === "FINITE_FAILURE").toBe(true);
    expect(result.classCounts?.[0].componentDonorTypeCounts).toEqual([1]);
    const enumerated = enumerateExactNullAssignmentsV0_1B([input]);
    expect(enumerated.status).toBe("READY");
    if (enumerated.status === "READY") {
      expect(new Set(enumerated.assignments.map(assignmentKey)).size).toBe(2);
      expect(new Set(enumerated.assignments.flatMap((assignment) => assignment.map((entry) => entry.donorId)))).toEqual(
        new Set(["d0", "d1"]),
      );
    }
  });

  test("T10: same neighbors but different profiles do not merge", () => {
    const result = countExactNullV0_1B([
      classFromMatrix(complete(2), { profiles: [["a", "a"], ["b", "b"]] }),
    ]);
    expect(result.status === "READY" || result.status === "FINITE_FAILURE").toBe(true);
    expect(result.classCounts?.[0].componentDonorTypeCounts).toEqual([2]);
  });

  test("T11: same profile but different neighbors do not merge", () => {
    expect(safeDonorTypeIdentityV0_1B([0b00000011], ["same"]).length).toBeGreaterThan(0);
    expect(safeDonorTypeIdentityV0_1B([0b00000011], ["same"])).not.toBe(
      safeDonorTypeIdentityV0_1B([0b00000001], ["same"]),
    );
  });

  test("T12: class count 20 is finite-space insufficient", () => {
    const countFive = classFromMatrix(
      [
        [true, true, true, true],
        [true, false, true, true],
        [true, false, true, false],
        [true, true, false, false],
      ],
      { classId: "five", observed: false },
    );
    const result = countExactNullV0_1B([
      countFive,
      classFromMatrix(complete(2), { classId: "two-a" }),
      classFromMatrix(complete(2), { classId: "two-b" }),
    ]);
    expect(result).toMatchObject({ status: "FINITE_FAILURE", branch: "INSUFFICIENT_DISTINCT_NULL_REALIZATIONS", totalCount: BigInt(20) });
  });

  test("T13: class count 21 selects exhaustive branch", () => {
    const countThree = classFromMatrix(
      [
        [true, true, true],
        [true, false, true],
        [true, true, false],
      ],
      { classId: "three", observed: false },
    );
    const countSeven = classFromMatrix(
      [
        [true, true, true, true],
        [true, false, true, true],
        [true, true, true, false],
        [true, true, false, false],
      ],
      { classId: "seven", observed: false },
    );
    const result = countExactNullV0_1B([countThree, countSeven]);
    expect(result).toMatchObject({ status: "READY", branch: "EXHAUSTIVE", totalCount: BigInt(21) });
  });

  test("T14: complete 8x8 selects Monte Carlo branch", () => {
    const result = countExactNullV0_1B([classFromMatrix(complete(8))]);
    expect(result).toMatchObject({ status: "READY", branch: "MONTE_CARLO", totalCount: BigInt(40320) });
  });

  test("T15: rejects a component over the exact state limit", () => {
    const result = countExactNullV0_1B([
      classFromMatrix(complete(21), { profiles: Array.from({ length: 21 }, (_, i) => [`profile-${i}`]) }),
    ]);
    expect(result).toMatchObject({ status: "FAILURE", reason: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED" });
  });

  test("T16: rejects the conservative transition estimate over the limit", () => {
    const result = countExactNullV0_1B([
      classFromMatrix(complete(20), { profiles: Array.from({ length: 20 }, (_, i) => [`profile-${i}`]) }),
    ]);
    expect(result).toMatchObject({ status: "FAILURE", reason: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED" });
  });

  test("T17: rejects a raw signature class larger than 30 without truncation", () => {
    const result = countExactNullV0_1B([classFromMatrix(complete(31))]);
    expect(result).toMatchObject({ status: "FAILURE", reason: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED" });
  });

  test("T18: fixed-seed sampling is deterministic", () => {
    const first = sampleExactNullAssignmentV0_1B([classFromMatrix(complete(8))], new Xoshiro256ssV0_1B(SEED));
    const second = sampleExactNullAssignmentV0_1B([classFromMatrix(complete(8))], new Xoshiro256ssV0_1B(SEED));
    expect(first).toEqual(second);
    expect(first.status).toBe("READY");
  });

  test("T19: bounded BigInt sampling supports a bound above 2^64", () => {
    const bound = (BigInt(1) << BigInt(64)) + BigInt(1);
    const first = boundedBigIntIndexV0_1B(new Xoshiro256ssV0_1B(SEED), bound);
    const second = boundedBigIntIndexV0_1B(new Xoshiro256ssV0_1B(SEED), bound);
    expect(first).toBe(second);
    expect(first >= BigInt(0)).toBe(true);
    expect(first < bound).toBe(true);
  });

  test("T20: P1 arithmetic failures propagate as integer failures", () => {
    const spy = jest.spyOn(Uint128V0_1B.prototype, "add").mockImplementation(() => {
      throw new RangeError("UINT128_OVERFLOW");
    });
    try {
      const result = countExactNullV0_1B([classFromMatrix(complete(2))]);
      expect(result).toMatchObject({ status: "FAILURE", reason: "INTEGER_OVERFLOW_OR_NONEXACT_COUNT" });
    } finally {
      spy.mockRestore();
    }
  });

  test("validates malformed input without converting it to a scientific result", () => {
    const input = classFromMatrix(complete(1));
    expect(() => countExactNullV0_1B([{ ...input, recipients: [input.recipients[0], input.recipients[0]] }])).toThrow(
      "DUPLICATE_RECIPIENT_ID",
    );
    expect(() => countExactNullV0_1B([{ ...input, primarySlotIds: ["s0", "s0"] }])).toThrow(
      "DUPLICATE_PRIMARY_SLOT_ID",
    );
    const duplicateDonorInput = classFromMatrix(complete(2));
    expect(() =>
      countExactNullV0_1B([{ ...duplicateDonorInput, donors: [duplicateDonorInput.donors[0], duplicateDonorInput.donors[0]] }]),
    ).toThrow("DUPLICATE_DONOR_ID");
    expect(() =>
      countExactNullV0_1B([{ ...input, donors: [{ ...input.donors[0], rightIdentityBySlot: [] }] }]),
    ).toThrow("INCOMPLETE_DONOR_PROFILE");
    expect(() =>
      countExactNullV0_1B([{ ...input, donors: [{ ...input.donors[0], donorId: "d-other", signatureClassId: "other" }] }]),
    ).toThrow("SIGNATURE_CLASS_MISMATCH");
    expect(() =>
      countExactNullV0_1B([{ ...input, observedAssignment: [{ recipientId: "r0", donorId: "d0" }, { recipientId: "r0", donorId: "d0" }] }]),
    ).toThrow("MALFORMED_OBSERVED_ASSIGNMENT");
    expect(() => countExactNullV0_1B([{ ...input, recipients: [{ ...input.recipients[0], primarySlots: [] }] }])).toThrow(
      "INCOMPLETE_RECIPIENT_PROFILE",
    );
    expect(() =>
      countExactNullV0_1B([{ ...input, observedAssignment: [{ recipientId: "r0", donorId: "missing" }] }]),
    ).toThrow("OBSERVED_UNKNOWN_DONOR");
    expect(() => countExactNullV0_1B([classFromMatrix(diagonalForbidden(2))])).toThrow("OBSERVED_ASSIGNMENT_INADMISSIBLE");
  });

  test("uses canonical UTF-8 ordering without locale dependence", () => {
    expect(canonicalCompareV0_1B("a", "b")).toBeLessThan(0);
    expect(canonicalCompareV0_1B("é", "z")).toBeGreaterThan(0);
    expect(canonicalCompareV0_1B("same", "same")).toBe(0);
  });

  test("independent brute-force oracle agrees with exhaustive labeled output", () => {
    const input = classFromMatrix(complete(3));
    const oracleCount = bruteForceCount(input);
    const result = enumerateExactNullAssignmentsV0_1B([input]);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.assignments).toHaveLength(oracleCount);
    expect(new Set(result.assignments.map(assignmentKey)).size).toBe(oracleCount);
    expect(result.assignments.every((assignment) => assignment.length === 3)).toBe(true);
    const observedKey = assignmentKey(
      input.observedAssignment?.map((entry) => ({ recipientId: entry.recipientId, donorId: entry.donorId })) ?? [],
    );
    expect(result.assignments.filter((assignment) => assignmentKey(assignment) === observedKey)).toHaveLength(1);
  });

  test("keeps component and labeled assignment ordering deterministic", () => {
    const input = classFromMatrix([
      [true, true, false, false],
      [true, true, false, false],
      [false, false, true, true],
      [false, false, true, true],
    ]);
    const first = enumerateExactNullAssignmentsV0_1B([input]);
    const second = enumerateExactNullAssignmentsV0_1B([input]);
    expect(first).toEqual(second);
  });

  test("bounded sampler consumes no state for bound one", () => {
    const rng = new Xoshiro256ssV0_1B(SEED);
    const before = rng.getStateV0_1B();
    expect(boundedBigIntIndexV0_1B(rng, BigInt(1))).toBe(BigInt(0));
    expect(rng.getStateV0_1B()).toEqual(before);
  });
});
