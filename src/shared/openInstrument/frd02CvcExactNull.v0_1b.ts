const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);
const UINT64_BITS = 64;
const UINT64_MODULUS = BIGINT_ONE << BigInt(UINT64_BITS);
const UINT64_MASK = UINT64_MODULUS - BIGINT_ONE;

export const MAX_EXACT_STATES_V0_1B = 1_048_576;
export const MAX_EXACT_TRANSITIONS_V0_1B = 16_777_216;

export type PrimarySlotV0_1B = Readonly<{
  slotId: string;
  leftIdentity: string;
}>;

export type RecipientV0_1B = Readonly<{
  recipientId: string;
  signatureClassId: string;
  primarySlots: readonly PrimarySlotV0_1B[];
}>;

export type DonorProfileV0_1B = Readonly<{
  donorId: string;
  signatureClassId: string;
  rightIdentityBySlot: readonly Readonly<{
    slotId: string;
    rightIdentity: string;
  }>[];
}>;

export type ObservedAssignmentV0_1B = Readonly<{
  recipientId: string;
  donorId: string;
}>;

export type ExactNullSignatureClassV0_1B = Readonly<{
  signatureClassId: string;
  primarySlotIds: readonly string[];
  recipients: readonly RecipientV0_1B[];
  donors: readonly DonorProfileV0_1B[];
  observedAssignment?: readonly ObservedAssignmentV0_1B[];
}>;

export type ExactNullFailureReasonV0_1B =
  | "NO_ADMISSIBLE_NULL_REALIZATIONS"
  | "ONLY_OBSERVED_REALIZATION"
  | "INSUFFICIENT_DISTINCT_NULL_REALIZATIONS"
  | "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED"
  | "EXACT_COUNTING_FAILURE"
  | "INTEGER_OVERFLOW_OR_NONEXACT_COUNT";

export type ExactNullFailureDomainV0_1B =
  | "FINITE_SCIENTIFIC"
  | "RESOURCE"
  | "COMPUTATIONAL";

export type ExactNullBranchV0_1B =
  | "NO_ADMISSIBLE_NULL_REALIZATIONS"
  | "ONLY_OBSERVED_REALIZATION"
  | "INSUFFICIENT_DISTINCT_NULL_REALIZATIONS"
  | "EXHAUSTIVE"
  | "MONTE_CARLO";

export type LabeledAssignmentEntryV0_1B = Readonly<{
  signatureClassId: string;
  recipientId: string;
  donorId: string;
}>;

export type ExactNullFailureV0_1B = Readonly<{
  status: "FAILURE";
  domain: ExactNullFailureDomainV0_1B;
  reason: ExactNullFailureReasonV0_1B;
  message: string;
}>;

export type ExactNullFiniteFailureV0_1B = Readonly<{
  status: "FINITE_FAILURE";
  branch:
    | "NO_ADMISSIBLE_NULL_REALIZATIONS"
    | "ONLY_OBSERVED_REALIZATION"
    | "INSUFFICIENT_DISTINCT_NULL_REALIZATIONS";
  reason: ExactNullFailureReasonV0_1B;
  totalCount: bigint;
  classCounts?: readonly ExactNullClassCountSummaryV0_1B[];
}>;

export type ExactNullClassCountSummaryV0_1B = Readonly<{
  signatureClassId: string;
  count: bigint;
  componentCounts: readonly bigint[];
  componentDonorTypeCounts: readonly number[];
}>;

export type ExactNullCountSuccessV0_1B = Readonly<{
  status: "READY";
  branch: "ONLY_OBSERVED_REALIZATION" | "EXHAUSTIVE" | "MONTE_CARLO";
  totalCount: bigint;
  classCounts: readonly ExactNullClassCountSummaryV0_1B[];
}>;

export type ExactNullCountResultV0_1B =
  | ExactNullCountSuccessV0_1B
  | ExactNullFiniteFailureV0_1B
  | ExactNullFailureV0_1B;

export type ExactNullEnumerationSuccessV0_1B = Readonly<{
  status: "READY";
  branch: ExactNullBranchV0_1B;
  totalCount: bigint;
  assignments: readonly (readonly LabeledAssignmentEntryV0_1B[])[];
}>;

export type ExactNullEnumerationResultV0_1B =
  | ExactNullEnumerationSuccessV0_1B
  | ExactNullFiniteFailureV0_1B
  | ExactNullFailureV0_1B;

export type ExactNullSampleSuccessV0_1B = Readonly<{
  status: "READY";
  branch: ExactNullBranchV0_1B;
  totalCount: bigint;
  assignment: readonly LabeledAssignmentEntryV0_1B[];
}>;

export type ExactNullSampleResultV0_1B =
  | ExactNullSampleSuccessV0_1B
  | ExactNullFiniteFailureV0_1B
  | ExactNullFailureV0_1B;

export class ExactNullValidationErrorV0_1B extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = "ExactNullValidationErrorV0_1B";
    this.code = code;
    Object.setPrototypeOf(this, ExactNullValidationErrorV0_1B.prototype);
  }
}

export class ExactNullSamplingErrorV0_1B extends RangeError {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = "ExactNullSamplingErrorV0_1B";
    this.code = code;
    Object.setPrototypeOf(this, ExactNullSamplingErrorV0_1B.prototype);
  }
}

const CANONICAL_DECIMAL_V0_1B = /^(0|[1-9][0-9]*)$/;

/**
 * Canonical lossless representation for exact-null counts at persistence
 * boundaries. Runtime results remain bigint values; JSON boundaries use this
 * unsigned decimal form because JSON.stringify cannot serialize bigint.
 */
export function serializeExactNullCountV0_1B(value: bigint): string {
  if (value < BIGINT_ZERO) throw new TypeError("NEGATIVE_EXACT_NULL_COUNT");
  return value.toString(10);
}

export function parseExactNullCountV0_1B(value: string): bigint {
  if (!CANONICAL_DECIMAL_V0_1B.test(value)) {
    validationFailure("NON_CANONICAL_EXACT_NULL_COUNT");
  }
  return BigInt(value);
}

function validationFailure(code: string): never {
  throw new ExactNullValidationErrorV0_1B(code);
}

function assertString(value: unknown, code: string): asserts value is string {
  if (typeof value !== "string") validationFailure(code);
}

const UTF8_ENCODER = new TextEncoder();

function utf8(value: string): Uint8Array {
  return UTF8_ENCODER.encode(value);
}

export function canonicalCompareV0_1B(left: string, right: string): number {
  const leftBytes = utf8(left);
  const rightBytes = utf8(right);
  const length = Math.min(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    if (leftBytes[index] < rightBytes[index]) return -1;
    if (leftBytes[index] > rightBytes[index]) return 1;
  }
  if (leftBytes.length < rightBytes.length) return -1;
  if (leftBytes.length > rightBytes.length) return 1;
  return 0;
}

function canonicalSortStrings(values: readonly string[]): string[] {
  return [...values].sort(canonicalCompareV0_1B);
}

function assertUniqueStrings(values: readonly string[], code: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) validationFailure(code);
    seen.add(value);
  }
}

function encodeHex(bytes: Uint8Array): string {
  let result = "";
  for (const byte of bytes) result += byte.toString(16).padStart(2, "0");
  return result;
}

function lengthPrefixedUtf8Vector(values: readonly string[]): string {
  return values
    .map((value) => {
      const bytes = utf8(value);
      return `${bytes.length.toString(16)}:${encodeHex(bytes)}`;
    })
    .join("");
}

type NormalizedRecipientV0_1B = Readonly<{
  recipientId: string;
  signatureClassId: string;
  leftIdentities: readonly string[];
}>;

type NormalizedDonorV0_1B = Readonly<{
  donorId: string;
  signatureClassId: string;
  rightIdentities: readonly string[];
}>;

type NormalizedClassV0_1B = Readonly<{
  signatureClassId: string;
  slotIds: readonly string[];
  recipients: readonly NormalizedRecipientV0_1B[];
  donors: readonly NormalizedDonorV0_1B[];
  observedAssignment?: readonly ObservedAssignmentV0_1B[];
}>;

type GraphV0_1B = Readonly<{
  input: NormalizedClassV0_1B;
  adjacency: readonly (readonly number[])[];
  observedPairs: readonly (readonly [number, number])[];
}>;

type PairIndexV0_1B = Readonly<{ recipientIndex: number; donorIndex: number }>;

type ReducedGraphV0_1B = Readonly<{
  graph: GraphV0_1B;
  activeRecipients: readonly number[];
  activeDonors: readonly number[];
  adjacency: readonly (readonly number[])[];
  forced: readonly PairIndexV0_1B[];
}>;

type ComponentV0_1B = Readonly<{
  recipientIndices: readonly number[];
  donorIndices: readonly number[];
}>;

type DonorTypeV0_1B = Readonly<{
  key: string;
  donorIndices: readonly number[];
  neighborLocalIndices: readonly number[];
  profile: readonly string[];
}>;

type PreparedComponentV0_1B = {
  graph: GraphV0_1B;
  component: ComponentV0_1B;
  adjacency: readonly (readonly number[])[];
  types: readonly DonorTypeV0_1B[];
  stateCount: number;
  transitionEstimate: number;
  count?: bigint;
  memo?: (bigint | undefined)[];
  strides?: readonly number[];
};

type PreparedClassV0_1B = {
  graph: GraphV0_1B;
  reduced: ReducedGraphV0_1B;
  components: PreparedComponentV0_1B[];
  count?: bigint;
  componentCounts?: bigint[];
};

type PreparedPlanV0_1B = {
  classes: PreparedClassV0_1B[];
  totalStateEstimate: number;
  totalTransitionEstimate: number;
  totalCount?: bigint;
};

type PreparationResultV0_1B =
  | { kind: "READY"; plan: PreparedPlanV0_1B }
  | { kind: "FINITE_FAILURE"; result: ExactNullFiniteFailureV0_1B }
  | { kind: "FAILURE"; result: ExactNullFailureV0_1B };

function computationalFailure(
  domain: ExactNullFailureDomainV0_1B,
  reason: ExactNullFailureReasonV0_1B,
  message: string,
): ExactNullFailureV0_1B {
  return { status: "FAILURE", domain, reason, message };
}

function finiteFailure(
  branch: ExactNullFiniteFailureV0_1B["branch"],
  totalCount: bigint,
  classCounts?: readonly ExactNullClassCountSummaryV0_1B[],
): ExactNullFiniteFailureV0_1B {
  return {
    status: "FINITE_FAILURE",
    branch,
    reason: branch,
    totalCount,
    ...(classCounts === undefined ? {} : { classCounts }),
  };
}

function validateSlotVector(
  slotIds: readonly string[],
  values: readonly Readonly<{ slotId: string; value: string }>[],
  missingCode: string,
  duplicateCode: string,
  unexpectedCode: string,
): string[] {
  const seen = new Set<string>();
  const valueBySlot = new Map<string, string>();
  for (const entry of values) {
    if (entry === null || typeof entry !== "object") validationFailure(missingCode);
    assertString(entry.slotId, missingCode);
    assertString(entry.value, missingCode);
    if (seen.has(entry.slotId)) validationFailure(duplicateCode);
    seen.add(entry.slotId);
    if (!slotIds.includes(entry.slotId)) validationFailure(unexpectedCode);
    valueBySlot.set(entry.slotId, entry.value);
  }
  if (seen.size !== slotIds.length) validationFailure(missingCode);
  return slotIds.map((slotId) => {
    const value = valueBySlot.get(slotId);
    if (value === undefined) validationFailure(missingCode);
    return value;
  });
}

function normalizeClassV0_1B(input: ExactNullSignatureClassV0_1B): NormalizedClassV0_1B {
  if (input === null || typeof input !== "object") validationFailure("MALFORMED_CLASS");
  assertString(input.signatureClassId, "INVALID_SIGNATURE_CLASS_ID");
  if (!Array.isArray(input.primarySlotIds)) validationFailure("INVALID_PRIMARY_SLOT_IDS");
  const rawSlotIds = input.primarySlotIds;
  for (const slotId of rawSlotIds) assertString(slotId, "INVALID_PRIMARY_SLOT_ID");
  assertUniqueStrings(rawSlotIds, "DUPLICATE_PRIMARY_SLOT_ID");
  const slotIds = canonicalSortStrings(rawSlotIds);

  if (!Array.isArray(input.recipients)) validationFailure("INVALID_RECIPIENTS");
  if (!Array.isArray(input.donors)) validationFailure("INVALID_DONORS");
  const recipientIds: string[] = [];
  const recipients = input.recipients.map((recipient) => {
    if (recipient === null || typeof recipient !== "object") validationFailure("MALFORMED_RECIPIENT");
    assertString(recipient.recipientId, "INVALID_RECIPIENT_ID");
    assertString(recipient.signatureClassId, "SIGNATURE_CLASS_MISMATCH");
    if (recipient.signatureClassId !== input.signatureClassId) validationFailure("SIGNATURE_CLASS_MISMATCH");
    if (!Array.isArray(recipient.primarySlots)) validationFailure("INVALID_RECIPIENT_SLOTS");
    recipientIds.push(recipient.recipientId);
    const values = recipient.primarySlots.map((slot: PrimarySlotV0_1B) => {
      if (slot === null || typeof slot !== "object") validationFailure("MALFORMED_RECIPIENT_SLOT");
      assertString(slot.slotId, "INVALID_RECIPIENT_SLOT_ID");
      assertString(slot.leftIdentity, "INVALID_LEFT_IDENTITY");
      return { slotId: slot.slotId, value: slot.leftIdentity };
    });
    return {
      recipientId: recipient.recipientId,
      signatureClassId: recipient.signatureClassId,
      leftIdentities: validateSlotVector(
        slotIds,
        values,
        "INCOMPLETE_RECIPIENT_PROFILE",
        "DUPLICATE_RECIPIENT_SLOT_ID",
        "UNEXPECTED_RECIPIENT_SLOT_ID",
      ),
    };
  });
  assertUniqueStrings(recipientIds, "DUPLICATE_RECIPIENT_ID");
  recipients.sort((left, right) => canonicalCompareV0_1B(left.recipientId, right.recipientId));

  const donorIds: string[] = [];
  const donors = input.donors.map((donor) => {
    if (donor === null || typeof donor !== "object") validationFailure("MALFORMED_DONOR");
    assertString(donor.donorId, "INVALID_DONOR_ID");
    assertString(donor.signatureClassId, "SIGNATURE_CLASS_MISMATCH");
    if (donor.signatureClassId !== input.signatureClassId) validationFailure("SIGNATURE_CLASS_MISMATCH");
    if (!Array.isArray(donor.rightIdentityBySlot)) validationFailure("INVALID_DONOR_PROFILE");
    donorIds.push(donor.donorId);
    const values = donor.rightIdentityBySlot.map((slot: Readonly<{ slotId: string; rightIdentity: string }>) => {
      if (slot === null || typeof slot !== "object") validationFailure("MALFORMED_DONOR_SLOT");
      assertString(slot.slotId, "INVALID_DONOR_SLOT_ID");
      assertString(slot.rightIdentity, "INVALID_RIGHT_IDENTITY");
      return { slotId: slot.slotId, value: slot.rightIdentity };
    });
    return {
      donorId: donor.donorId,
      signatureClassId: donor.signatureClassId,
      rightIdentities: validateSlotVector(
        slotIds,
        values,
        "INCOMPLETE_DONOR_PROFILE",
        "DUPLICATE_DONOR_SLOT_ID",
        "UNEXPECTED_DONOR_SLOT_ID",
      ),
    };
  });
  assertUniqueStrings(donorIds, "DUPLICATE_DONOR_ID");
  if (input.recipients.length !== input.donors.length) {
    validationFailure("UNEQUAL_CLASS_SIZES");
  }
  donors.sort((left, right) => canonicalCompareV0_1B(left.donorId, right.donorId));

  let observedAssignment: readonly ObservedAssignmentV0_1B[] | undefined;
  if (input.observedAssignment !== undefined) {
    if (!Array.isArray(input.observedAssignment) || input.observedAssignment.length !== recipients.length) {
      validationFailure("MALFORMED_OBSERVED_ASSIGNMENT");
    }
    const seenRecipients = new Set<string>();
    const seenDonors = new Set<string>();
    observedAssignment = input.observedAssignment.map((entry) => {
      if (entry === null || typeof entry !== "object") validationFailure("MALFORMED_OBSERVED_ASSIGNMENT");
      assertString(entry.recipientId, "MALFORMED_OBSERVED_ASSIGNMENT");
      assertString(entry.donorId, "MALFORMED_OBSERVED_ASSIGNMENT");
      if (!recipients.some((recipient) => recipient.recipientId === entry.recipientId)) {
        validationFailure("OBSERVED_UNKNOWN_RECIPIENT");
      }
      if (!donors.some((donor) => donor.donorId === entry.donorId)) validationFailure("OBSERVED_UNKNOWN_DONOR");
      if (seenRecipients.has(entry.recipientId) || seenDonors.has(entry.donorId)) {
        validationFailure("OBSERVED_ASSIGNMENT_NOT_BIJECTIVE");
      }
      seenRecipients.add(entry.recipientId);
      seenDonors.add(entry.donorId);
      return { recipientId: entry.recipientId, donorId: entry.donorId };
    });
    if (seenRecipients.size !== recipients.length || seenDonors.size !== donors.length) {
      validationFailure("OBSERVED_ASSIGNMENT_NOT_BIJECTIVE");
    }
  }

  return { signatureClassId: input.signatureClassId, slotIds, recipients, donors, observedAssignment };
}

function buildGraphV0_1B(input: NormalizedClassV0_1B): GraphV0_1B {
  const donorIndexById = new Map(input.donors.map((donor, index) => [donor.donorId, index]));
  const adjacency = input.recipients.map((recipient) =>
    input.donors
      .map((donor, donorIndex) => ({ donor, donorIndex }))
      .filter(({ donor }) => recipient.leftIdentities.every((left, slotIndex) => left !== donor.rightIdentities[slotIndex]))
      .map(({ donorIndex }) => donorIndex),
  );
  const observedPairs: [number, number][] = [];
  for (const entry of input.observedAssignment ?? []) {
    const recipientIndex = input.recipients.findIndex((recipient) => recipient.recipientId === entry.recipientId);
    const donorIndex = donorIndexById.get(entry.donorId);
    if (recipientIndex < 0 || donorIndex === undefined || !adjacency[recipientIndex].includes(donorIndex)) {
      validationFailure("OBSERVED_ASSIGNMENT_INADMISSIBLE");
    }
    observedPairs.push([recipientIndex, donorIndex]);
  }
  return { input, adjacency, observedPairs };
}

function hasPerfectMatchingV0_1B(graph: GraphV0_1B): boolean {
  const donorMatch = new Array<number>(graph.input.donors.length).fill(-1);
  const visit = (recipientIndex: number, seenDonors: boolean[]): boolean => {
    for (const donorIndex of graph.adjacency[recipientIndex]) {
      if (seenDonors[donorIndex]) continue;
      seenDonors[donorIndex] = true;
      if (donorMatch[donorIndex] < 0 || visit(donorMatch[donorIndex], seenDonors)) {
        donorMatch[donorIndex] = recipientIndex;
        return true;
      }
    }
    return false;
  };
  for (let recipientIndex = 0; recipientIndex < graph.input.recipients.length; recipientIndex += 1) {
    if (!visit(recipientIndex, new Array<boolean>(graph.input.donors.length).fill(false))) return false;
  }
  return true;
}

function reduceForcedEdgesV0_1B(graph: GraphV0_1B): ReducedGraphV0_1B | null {
  const activeRecipients = new Set<number>(graph.input.recipients.map((_, index) => index));
  const activeDonors = new Set<number>(graph.input.donors.map((_, index) => index));
  const adjacency = graph.adjacency.map((neighbors) => new Set<number>(neighbors));
  const forced: PairIndexV0_1B[] = [];

  while (activeRecipients.size > 0 || activeDonors.size > 0) {
    const forcedKeys = new Set<string>();
    for (const recipientIndex of [...activeRecipients].sort((a, b) => a - b)) {
      const neighbors = [...adjacency[recipientIndex]].filter((donorIndex) => activeDonors.has(donorIndex));
      if (neighbors.length === 0) return null;
      if (neighbors.length === 1) forcedKeys.add(`${recipientIndex}:${neighbors[0]}`);
    }
    const donorNeighbors = new Map<number, number[]>();
    for (const donorIndex of activeDonors) donorNeighbors.set(donorIndex, []);
    for (const recipientIndex of activeRecipients) {
      for (const donorIndex of adjacency[recipientIndex]) {
        if (activeDonors.has(donorIndex)) donorNeighbors.get(donorIndex)?.push(recipientIndex);
      }
    }
    for (const donorIndex of [...activeDonors].sort((a, b) => a - b)) {
      const neighbors = (donorNeighbors.get(donorIndex) ?? []).sort((a, b) => a - b);
      if (neighbors.length === 0) return null;
      if (neighbors.length === 1) forcedKeys.add(`${neighbors[0]}:${donorIndex}`);
    }
    if (forcedKeys.size === 0) break;

    const [recipientText, donorText] = [...forcedKeys]
      .map((key) => key.split(":"))
      .sort(([leftR, leftD], [rightR, rightD]) => {
        const recipientOrder = Number(leftR) - Number(rightR);
        return recipientOrder !== 0 ? recipientOrder : Number(leftD) - Number(rightD);
      })[0];
    const recipientIndex = Number(recipientText);
    const donorIndex = Number(donorText);
    if (!activeRecipients.has(recipientIndex) || !activeDonors.has(donorIndex) || !adjacency[recipientIndex].has(donorIndex)) {
      return null;
    }
    forced.push({ recipientIndex, donorIndex });
    activeRecipients.delete(recipientIndex);
    activeDonors.delete(donorIndex);
    for (const remainingRecipient of activeRecipients) adjacency[remainingRecipient].delete(donorIndex);
    for (const remainingDonor of activeDonors) adjacency[recipientIndex].delete(remainingDonor);
  }

  const reducedAdjacency = graph.input.recipients.map((_, recipientIndex) =>
    [...adjacency[recipientIndex]].filter((donorIndex) => activeDonors.has(donorIndex)).sort((a, b) => a - b),
  );
  return {
    graph,
    activeRecipients: [...activeRecipients].sort((a, b) => a - b),
    activeDonors: [...activeDonors].sort((a, b) => a - b),
    adjacency: reducedAdjacency,
    forced,
  };
}

function connectedComponentsV0_1B(reduced: ReducedGraphV0_1B): ComponentV0_1B[] | null {
  const activeRecipients = new Set(reduced.activeRecipients);
  const activeDonors = new Set(reduced.activeDonors);
  const visitedRecipients = new Set<number>();
  const visitedDonors = new Set<number>();
  const reverse = new Map<number, number[]>();
  let unbalancedComponent = false;
  for (const donorIndex of reduced.activeDonors) reverse.set(donorIndex, []);
  for (const recipientIndex of reduced.activeRecipients) {
    for (const donorIndex of reduced.adjacency[recipientIndex]) reverse.get(donorIndex)?.push(recipientIndex);
  }
  const components: ComponentV0_1B[] = [];

  const visit = (startRecipient?: number, startDonor?: number): void => {
    const recipients: number[] = [];
    const donors: number[] = [];
    const recipientQueue = startRecipient === undefined ? [] : [startRecipient];
    const donorQueue = startDonor === undefined ? [] : [startDonor];
    while (recipientQueue.length > 0 || donorQueue.length > 0) {
      const recipientIndex = recipientQueue.shift();
      if (recipientIndex !== undefined && !visitedRecipients.has(recipientIndex)) {
        visitedRecipients.add(recipientIndex);
        recipients.push(recipientIndex);
        for (const donorIndex of reduced.adjacency[recipientIndex]) {
          if (!visitedDonors.has(donorIndex)) donorQueue.push(donorIndex);
        }
      }
      const donorIndex = donorQueue.shift();
      if (donorIndex !== undefined && !visitedDonors.has(donorIndex)) {
        visitedDonors.add(donorIndex);
        donors.push(donorIndex);
        for (const nextRecipient of reverse.get(donorIndex) ?? []) {
          if (!visitedRecipients.has(nextRecipient)) recipientQueue.push(nextRecipient);
        }
      }
    }
    if (recipients.length !== donors.length) {
      unbalancedComponent = true;
      return;
    }
    if (recipients.length > 0) {
      components.push({
        recipientIndices: recipients.sort((a, b) => a - b),
        donorIndices: donors.sort((a, b) => a - b),
      });
    }
  };

  for (const recipientIndex of reduced.activeRecipients) {
    if (!visitedRecipients.has(recipientIndex)) visit(recipientIndex, undefined);
  }
  for (const donorIndex of reduced.activeDonors) {
    if (!visitedDonors.has(donorIndex)) visit(undefined, donorIndex);
  }
  if (unbalancedComponent || visitedRecipients.size !== activeRecipients.size || visitedDonors.size !== activeDonors.size) return null;
  components.sort((left, right) => {
    const recipientOrder = (left.recipientIndices[0] ?? Number.MAX_SAFE_INTEGER) - (right.recipientIndices[0] ?? Number.MAX_SAFE_INTEGER);
    if (recipientOrder !== 0) return recipientOrder;
    return (left.donorIndices[0] ?? Number.MAX_SAFE_INTEGER) - (right.donorIndices[0] ?? Number.MAX_SAFE_INTEGER);
  });
  return components;
}

function donorTypeKeyV0_1B(neighborKey: string, profile: readonly string[]): string {
  const profileKey = lengthPrefixedUtf8Vector(profile);
  return `${neighborKey.length.toString(16)}:${neighborKey}${profileKey.length.toString(16)}:${profileKey}`;
}

export function safeDonorTypeIdentityV0_1B(
  neighborBitset: readonly number[],
  profile: readonly string[],
): string {
  if (!Array.isArray(neighborBitset) || neighborBitset.some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 255)) {
    validationFailure("INVALID_DONOR_NEIGHBOR_BITSET");
  }
  for (const value of profile) assertString(value, "INVALID_DONOR_PROFILE_VALUE");
  return donorTypeKeyV0_1B(encodeHex(new Uint8Array(neighborBitset)), profile);
}

function buildDonorTypesV0_1B(
  graph: GraphV0_1B,
  reduced: ReducedGraphV0_1B,
  component: ComponentV0_1B,
): DonorTypeV0_1B[] {
  const groups = new Map<string, { donorIndices: number[]; neighborLocalIndices: number[]; profile: readonly string[] }>();
  const componentRecipientPosition = new Map(component.recipientIndices.map((index, position) => [index, position]));
  const byteLength = Math.ceil(component.recipientIndices.length / 8);
  for (const donorIndex of component.donorIndices) {
    const neighborLocalIndices = component.recipientIndices
      .filter((recipientIndex) => reduced.adjacency[recipientIndex].includes(donorIndex))
      .map((recipientIndex) => componentRecipientPosition.get(recipientIndex) as number);
    const bitset = new Uint8Array(byteLength);
    for (const localIndex of neighborLocalIndices) bitset[Math.floor(localIndex / 8)] |= 1 << (localIndex % 8);
    const neighborKey = encodeHex(bitset);
    const profile = graph.input.donors[donorIndex].rightIdentities;
    const key = donorTypeKeyV0_1B(neighborKey, profile);
    const existing = groups.get(key);
    if (existing) existing.donorIndices.push(donorIndex);
    else groups.set(key, { donorIndices: [donorIndex], neighborLocalIndices, profile });
  }
  return [...groups.entries()]
    .sort(([left], [right]) => canonicalCompareV0_1B(left, right))
    .map(([key, group]) => ({
      key,
      donorIndices: group.donorIndices.sort((a, b) => a - b),
      neighborLocalIndices: group.neighborLocalIndices,
      profile: group.profile,
    }));
}

function estimateComponentV0_1B(component: PreparedComponentV0_1B): ExactNullFailureV0_1B | null {
  let stateCount = 1;
  for (const type of component.types) {
    const next = stateCount * (type.donorIndices.length + 1);
    if (next > MAX_EXACT_STATES_V0_1B) {
      return computationalFailure("RESOURCE", "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED", "exact state limit exceeded");
    }
    stateCount = next;
  }
  component.stateCount = stateCount;
  component.transitionEstimate = component.types.length * stateCount;
  return null;
}

function prepareInternalV0_1B(classes: readonly ExactNullSignatureClassV0_1B[]): PreparationResultV0_1B {
  if (!Array.isArray(classes)) validationFailure("INVALID_SIGNATURE_CLASSES");
  const classIds = classes.map((input) => {
    if (input === null || typeof input !== "object") validationFailure("MALFORMED_CLASS");
    assertString(input.signatureClassId, "INVALID_SIGNATURE_CLASS_ID");
    return input.signatureClassId;
  });
  assertUniqueStrings(classIds, "DUPLICATE_SIGNATURE_CLASS_ID");

  const normalizedClasses = classes.map(normalizeClassV0_1B).sort((left, right) => canonicalCompareV0_1B(left.signatureClassId, right.signatureClassId));
  const preparedClasses: PreparedClassV0_1B[] = [];
  let totalStateEstimate = 0;
  let totalTransitionEstimate = 0;

  for (const normalized of normalizedClasses) {
    const graph = buildGraphV0_1B(normalized);
    if (!hasPerfectMatchingV0_1B(graph)) {
      return {
        kind: "FINITE_FAILURE",
        result: finiteFailure("NO_ADMISSIBLE_NULL_REALIZATIONS", BIGINT_ZERO),
      };
    }
    const reduced = reduceForcedEdgesV0_1B(graph);
    if (reduced === null) {
      return {
        kind: "FINITE_FAILURE",
        result: finiteFailure("NO_ADMISSIBLE_NULL_REALIZATIONS", BIGINT_ZERO),
      };
    }
    const components = connectedComponentsV0_1B(reduced);
    if (components === null) {
      return {
        kind: "FINITE_FAILURE",
        result: finiteFailure("NO_ADMISSIBLE_NULL_REALIZATIONS", BIGINT_ZERO),
      };
    }
    const preparedComponents: PreparedComponentV0_1B[] = [];
    for (const component of components) {
      const prepared: PreparedComponentV0_1B = {
        graph,
        component,
        adjacency: reduced.adjacency,
        types: buildDonorTypesV0_1B(graph, reduced, component),
        stateCount: 0,
        transitionEstimate: 0,
      };
      const failure = estimateComponentV0_1B(prepared);
      if (failure) {
        return {
          kind: "FAILURE",
          result: failure,
        };
      }
      preparedComponents.push(prepared);
    }
    const preparedClass: PreparedClassV0_1B = { graph, reduced, components: preparedComponents };
    preparedClasses.push(preparedClass);
    for (const component of preparedComponents) {
      totalStateEstimate += component.stateCount;
      totalTransitionEstimate += component.transitionEstimate;
      if (totalTransitionEstimate > MAX_EXACT_TRANSITIONS_V0_1B) {
        return {
          kind: "FAILURE",
          result: computationalFailure("RESOURCE", "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED", "exact transition limit exceeded"),
        };
      }
    }
  }
  return { kind: "READY", plan: { classes: preparedClasses, totalStateEstimate, totalTransitionEstimate } };
}

function readMemoV0_1B(memo: readonly (bigint | undefined)[], state: number): bigint | undefined {
  return memo[state];
}

function writeMemoV0_1B(memo: (bigint | undefined)[], state: number, value: bigint): void {
  memo[state] = value;
}

function componentCountAtStateV0_1B(component: PreparedComponentV0_1B, state: number): bigint {
  if (component.memo === undefined || component.strides === undefined) {
    throw new Error("EXACT_COUNTING_MEMO_NOT_INITIALIZED");
  }
  const cached = readMemoV0_1B(component.memo, state);
  if (cached !== undefined) return cached;

  const digits: number[] = [];
  let remainingState = state;
  let assigned = 0;
  for (const type of component.types) {
    const radix = type.donorIndices.length + 1;
    const digit = remainingState % radix;
    remainingState = Math.floor(remainingState / radix);
    digits.push(digit);
    assigned += digit;
  }
  if (assigned === component.component.recipientIndices.length) {
    writeMemoV0_1B(component.memo, state, BIGINT_ONE);
    return BIGINT_ONE;
  }

  const recipientPosition = assigned;
  let result = BIGINT_ZERO;
  for (let typeIndex = 0; typeIndex < component.types.length; typeIndex += 1) {
    const type = component.types[typeIndex];
    const used = digits[typeIndex];
    const remaining = type.donorIndices.length - used;
    if (remaining <= 0 || !type.neighborLocalIndices.includes(recipientPosition)) continue;
    const nextState = state + (component.strides[typeIndex] ?? 0);
    const child = componentCountAtStateV0_1B(component, nextState);
    result += child * BigInt(remaining);
  }
  writeMemoV0_1B(component.memo, state, result);
  return result;
}

function countPreparedPlanV0_1B(plan: PreparedPlanV0_1B): ExactNullCountResultV0_1B {
  try {
    const classCounts: ExactNullClassCountSummaryV0_1B[] = [];
    let totalCount = BIGINT_ONE;
    for (const preparedClass of plan.classes) {
      let classCount = BIGINT_ONE;
      const componentCounts: bigint[] = [];
      const componentDonorTypeCounts: number[] = [];
      for (const component of preparedClass.components) {
        if (component.memo === undefined) component.memo = new Array<bigint | undefined>(component.stateCount);
        if (component.strides === undefined) {
          const strides: number[] = [];
          let stride = 1;
          for (const type of component.types) {
            strides.push(stride);
            stride *= type.donorIndices.length + 1;
          }
          component.strides = strides;
        }
        const count = componentCountAtStateV0_1B(component, 0);
        component.count = count;
        componentCounts.push(count);
        componentDonorTypeCounts.push(component.types.length);
        classCount *= count;
      }
      preparedClass.count = classCount;
      preparedClass.componentCounts = componentCounts;
      totalCount *= classCount;
      classCounts.push({
        signatureClassId: preparedClass.graph.input.signatureClassId,
        count: classCount,
        componentCounts,
        componentDonorTypeCounts,
      });
    }
    plan.totalCount = totalCount;
    if (totalCount === BIGINT_ZERO) return finiteFailure("NO_ADMISSIBLE_NULL_REALIZATIONS", totalCount, classCounts);
    if (totalCount === BIGINT_ONE) {
      return { status: "FINITE_FAILURE", branch: "ONLY_OBSERVED_REALIZATION", reason: "ONLY_OBSERVED_REALIZATION", totalCount, classCounts };
    }
    if (totalCount < BigInt(21)) return finiteFailure("INSUFFICIENT_DISTINCT_NULL_REALIZATIONS", totalCount, classCounts);
    if (totalCount <= BigInt(10_000)) return { status: "READY", branch: "EXHAUSTIVE", totalCount, classCounts };
    return { status: "READY", branch: "MONTE_CARLO", totalCount, classCounts };
  } catch (error) {
    if (error instanceof ExactNullValidationErrorV0_1B) throw error;
    const message = error instanceof Error ? error.message : String(error);
    if (message.startsWith("UINT128_")) {
      return computationalFailure("COMPUTATIONAL", "INTEGER_OVERFLOW_OR_NONEXACT_COUNT", message);
    }
    return computationalFailure("COMPUTATIONAL", "EXACT_COUNTING_FAILURE", message);
  }
}

function prepareAndCountV0_1B(classes: readonly ExactNullSignatureClassV0_1B[]): {
  preparation: PreparationResultV0_1B;
  count?: ExactNullCountResultV0_1B;
} {
  const preparation = prepareInternalV0_1B(classes);
  if (preparation.kind !== "READY") return { preparation };
  return { preparation, count: countPreparedPlanV0_1B(preparation.plan) };
}

export function countExactNullV0_1B(classes: readonly ExactNullSignatureClassV0_1B[]): ExactNullCountResultV0_1B {
  const { preparation, count } = prepareAndCountV0_1B(classes);
  if (preparation.kind === "FINITE_FAILURE") return preparation.result;
  if (preparation.kind === "FAILURE") return preparation.result;
  if (count === undefined) return computationalFailure("COMPUTATIONAL", "EXACT_COUNTING_FAILURE", "missing exact count");
  return count;
}

function componentAssignmentsV0_1B(component: PreparedComponentV0_1B): PairIndexV0_1B[][] {
  const assignments: PairIndexV0_1B[][] = [];
  const remaining = new Set(component.component.donorIndices);
  const current: PairIndexV0_1B[] = [];
  const visit = (recipientPosition: number): void => {
    if (recipientPosition === component.component.recipientIndices.length) {
      assignments.push(current.slice());
      return;
    }
    const recipientIndex = component.component.recipientIndices[recipientPosition];
    for (const type of component.types) {
      if (!type.neighborLocalIndices.includes(recipientPosition)) continue;
      for (const donorIndex of type.donorIndices) {
        if (!remaining.has(donorIndex)) continue;
        remaining.delete(donorIndex);
        current.push({ recipientIndex, donorIndex });
        visit(recipientPosition + 1);
        current.pop();
        remaining.add(donorIndex);
      }
    }
  };
  visit(0);
  return assignments;
}

function classAssignmentsV0_1B(prepared: PreparedClassV0_1B): PairIndexV0_1B[][] {
  const componentAssignments = prepared.components.map(componentAssignmentsV0_1B);
  let combinations: PairIndexV0_1B[][] = [[]];
  for (const assignments of componentAssignments) {
    const next: PairIndexV0_1B[][] = [];
    for (const prefix of combinations) {
      for (const assignment of assignments) next.push([...prefix, ...assignment]);
    }
    combinations = next;
  }
  if (combinations.length === 0) combinations = [[]];
  return combinations.map((combination) => {
    const all = [...prepared.reduced.forced, ...combination];
    return all.sort((left, right) => {
      const recipientOrder = left.recipientIndex - right.recipientIndex;
      return recipientOrder !== 0 ? recipientOrder : left.donorIndex - right.donorIndex;
    });
  });
}

function globalAssignmentsV0_1B(plan: PreparedPlanV0_1B): readonly (readonly LabeledAssignmentEntryV0_1B[])[] {
  let combinations: readonly LabeledAssignmentEntryV0_1B[][] = [[]];
  for (const preparedClass of plan.classes) {
    const classAssignments = classAssignmentsV0_1B(preparedClass).map((assignment) =>
      assignment.map((pair) => ({
        signatureClassId: preparedClass.graph.input.signatureClassId,
        recipientId: preparedClass.graph.input.recipients[pair.recipientIndex].recipientId,
        donorId: preparedClass.graph.input.donors[pair.donorIndex].donorId,
      })),
    );
    const next: LabeledAssignmentEntryV0_1B[][] = [];
    for (const prefix of combinations) {
      for (const assignment of classAssignments) next.push([...prefix, ...assignment]);
    }
    combinations = next;
  }
  return combinations;
}

export function enumerateExactNullAssignmentsV0_1B(
  classes: readonly ExactNullSignatureClassV0_1B[],
): ExactNullEnumerationResultV0_1B {
  const { preparation, count } = prepareAndCountV0_1B(classes);
  if (preparation.kind === "FINITE_FAILURE") return preparation.result;
  if (preparation.kind === "FAILURE") return preparation.result;
  if (count === undefined) return computationalFailure("COMPUTATIONAL", "EXACT_COUNTING_FAILURE", "missing exact count");
  if (count.status === "FAILURE") return count;
  if (count.totalCount > BigInt(10_000)) {
    return computationalFailure("COMPUTATIONAL", "EXACT_COUNTING_FAILURE", "exhaustive enumeration is not selected for Monte Carlo spaces");
  }
  return {
    status: "READY",
    branch: count.status === "FINITE_FAILURE" ? count.branch : count.branch,
    totalCount: count.totalCount,
    assignments: globalAssignmentsV0_1B(preparation.plan),
  };
}

export class Xoshiro256ssV0_1B {
  private state: [bigint, bigint, bigint, bigint];

  constructor(words: readonly [bigint, bigint, bigint, bigint]) {
    for (const word of words) {
      if (word < BIGINT_ZERO || word >= UINT64_MODULUS) throw new ExactNullSamplingErrorV0_1B("INVALID_UINT64_SEED_WORD");
    }
    this.state = words.every((word) => word === BIGINT_ZERO) ? [BIGINT_ONE, BIGINT_ZERO, BIGINT_ZERO, BIGINT_ZERO] : [...words];
  }

  getStateV0_1B(): readonly [bigint, bigint, bigint, bigint] {
    return [...this.state] as [bigint, bigint, bigint, bigint];
  }

  next(): bigint {
    const rotl = (value: bigint, shift: number): bigint =>
      ((value << BigInt(shift)) | (value >> BigInt(UINT64_BITS - shift))) & UINT64_MASK;
    const result = (rotl((this.state[1] * BigInt(5)) & UINT64_MASK, 7) * BigInt(9)) & UINT64_MASK;
    const t = (this.state[1] << BigInt(17)) & UINT64_MASK;
    this.state[2] = (this.state[2] ^ this.state[0]) & UINT64_MASK;
    this.state[3] = (this.state[3] ^ this.state[1]) & UINT64_MASK;
    this.state[1] = (this.state[1] ^ this.state[2]) & UINT64_MASK;
    this.state[0] = (this.state[0] ^ this.state[3]) & UINT64_MASK;
    this.state[2] = (this.state[2] ^ t) & UINT64_MASK;
    this.state[3] = rotl(this.state[3], 45);
    return result;
  }
}

export function boundedBigIntIndexV0_1B(rng: Xoshiro256ssV0_1B, bound: bigint): bigint {
  if (bound <= BIGINT_ZERO) throw new ExactNullSamplingErrorV0_1B("INVALID_BIGINT_BOUND");
  if (bound === BIGINT_ONE) return BIGINT_ZERO;
  const bitLength = bound.toString(2).length;
  const wordCount = Math.ceil(bitLength / UINT64_BITS);
  const domain = BIGINT_ONE << BigInt(wordCount * UINT64_BITS);
  const limit = (domain / bound) * bound;
  while (true) {
    let candidate = BIGINT_ZERO;
    for (let word = 0; word < wordCount; word += 1) candidate = (candidate << BigInt(UINT64_BITS)) | rng.next();
    if (candidate < limit) return candidate % bound;
  }
}

function sampleComponentV0_1B(component: PreparedComponentV0_1B, rng: Xoshiro256ssV0_1B): PairIndexV0_1B[] {
  if (component.memo === undefined || component.strides === undefined) throw new Error("EXACT_COUNTING_MEMO_NOT_INITIALIZED");
  const selected: PairIndexV0_1B[] = [];
  const used = new Array<number>(component.types.length).fill(0);
  const labels = component.types.map((type) => [...type.donorIndices]);
  let state = 0;
  for (let recipientPosition = 0; recipientPosition < component.component.recipientIndices.length; recipientPosition += 1) {
    const total = componentCountAtStateV0_1B(component, state);
    let draw = boundedBigIntIndexV0_1B(rng, total);
    let selectedType = -1;
    for (let typeIndex = 0; typeIndex < component.types.length; typeIndex += 1) {
      const type = component.types[typeIndex];
      const remaining = type.donorIndices.length - used[typeIndex];
      if (remaining <= 0 || !type.neighborLocalIndices.includes(recipientPosition)) continue;
      const child = componentCountAtStateV0_1B(component, state + (component.strides[typeIndex] ?? 0));
      const weight = child * BigInt(remaining);
      if (draw < weight) {
        selectedType = typeIndex;
        break;
      }
      draw -= weight;
    }
    if (selectedType < 0) throw new Error("EXACT_COUNTING_WEIGHT_MISMATCH");
    const available = labels[selectedType];
    const labelOffset = Number(boundedBigIntIndexV0_1B(rng, BigInt(available.length)));
    const donorIndex = available.splice(labelOffset, 1)[0];
    used[selectedType] += 1;
    selected.push({ recipientIndex: component.component.recipientIndices[recipientPosition], donorIndex });
    state += component.strides[selectedType] ?? 0;
  }
  return selected;
}

export function sampleExactNullAssignmentV0_1B(
  classes: readonly ExactNullSignatureClassV0_1B[],
  rng: Xoshiro256ssV0_1B,
): ExactNullSampleResultV0_1B {
  const { preparation, count } = prepareAndCountV0_1B(classes);
  if (preparation.kind === "FINITE_FAILURE") return preparation.result;
  if (preparation.kind === "FAILURE") return preparation.result;
  if (count === undefined) return computationalFailure("COMPUTATIONAL", "EXACT_COUNTING_FAILURE", "missing exact count");
  if (count.status === "FAILURE") return count;
  const totalCount = count.totalCount;
  if (totalCount === BIGINT_ZERO) return finiteFailure("NO_ADMISSIBLE_NULL_REALIZATIONS", totalCount);
  try {
    let assignment: LabeledAssignmentEntryV0_1B[] = [];
    for (const preparedClass of preparation.plan.classes) {
      const pairs: PairIndexV0_1B[] = [...preparedClass.reduced.forced];
      for (const component of preparedClass.components) pairs.push(...sampleComponentV0_1B(component, rng));
      pairs.sort((left, right) => {
        const recipientOrder = left.recipientIndex - right.recipientIndex;
        return recipientOrder !== 0 ? recipientOrder : left.donorIndex - right.donorIndex;
      });
      assignment = assignment.concat(
        pairs.map((pair) => ({
          signatureClassId: preparedClass.graph.input.signatureClassId,
          recipientId: preparedClass.graph.input.recipients[pair.recipientIndex].recipientId,
          donorId: preparedClass.graph.input.donors[pair.donorIndex].donorId,
        })),
      );
    }
    return {
      status: "READY",
      branch: count.status === "FINITE_FAILURE" ? count.branch : count.branch,
      totalCount,
      assignment,
    };
  } catch (error) {
    if (error instanceof ExactNullSamplingErrorV0_1B) throw error;
    const message = error instanceof Error ? error.message : String(error);
    if (message.startsWith("UINT128_")) {
      return computationalFailure("COMPUTATIONAL", "INTEGER_OVERFLOW_OR_NONEXACT_COUNT", message);
    }
    return computationalFailure("COMPUTATIONAL", "EXACT_COUNTING_FAILURE", message);
  }
}
