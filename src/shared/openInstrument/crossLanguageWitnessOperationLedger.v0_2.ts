import {
  buildCrossLanguageOperationLedgerV0_2,
  type BuildCrossLanguageOperationLedgerResultV0_2,
  type CrossLanguageOperationApplicationInputV0_2,
} from "@/shared/openInstrument/crossLanguageOperationLedger.v0_2";

export const CROSS_LANGUAGE_WITNESS_OPERATION_LEDGER_SCHEMA_V0_2 =
  "open-instrument.cross-language-witness-operation-ledger.v0_2" as const;

export type CrossLanguageWitnessOperationBindingIdentityV0_2 = Readonly<{
  targetComponentIndex: number;
  targetComponentForm: string;
  targetComponentLanguage: string;
  targetComponentDialect: string;
  witnessId: string;
  witnessForm: string;
  witnessLanguage: string;
  witnessVariety: string;
}>;

export type CrossLanguageWitnessOperationLedgerInputV0_2 = Readonly<{
  attachedIdentity: CrossLanguageWitnessOperationBindingIdentityV0_2;
  currentIdentity: CrossLanguageWitnessOperationBindingIdentityV0_2;
  operations: readonly CrossLanguageOperationApplicationInputV0_2[];
  proposedRelationship: string;
  evidenceReference: string;
}>;

export type BuildCrossLanguageWitnessOperationLedgerResultV0_2 =
  | Readonly<{
      schemaVersion: typeof CROSS_LANGUAGE_WITNESS_OPERATION_LEDGER_SCHEMA_V0_2;
      status: "INVALID_BINDING";
      reasonCodes: readonly string[];
    }>
  | Readonly<{
      schemaVersion: typeof CROSS_LANGUAGE_WITNESS_OPERATION_LEDGER_SCHEMA_V0_2;
      status: "STALE_BINDING";
      reasonCodes: readonly ["ATTACHED_COMPONENT_OR_WITNESS_IDENTITY_CHANGED"];
    }>
  | Readonly<{
      schemaVersion: typeof CROSS_LANGUAGE_WITNESS_OPERATION_LEDGER_SCHEMA_V0_2;
      status: "BUILT";
      binding: CrossLanguageWitnessOperationBindingIdentityV0_2;
      operationLedgerResult: BuildCrossLanguageOperationLedgerResultV0_2;
    }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactToken(value: unknown): value is string {
  return typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    !/\s/u.test(value) &&
    Array.from(value).length <= 80;
}

function validIdentity(value: unknown): value is CrossLanguageWitnessOperationBindingIdentityV0_2 {
  if (!isRecord(value)) return false;
  return Number.isInteger(value.targetComponentIndex) &&
    (value.targetComponentIndex as number) >= 0 &&
    exactToken(value.targetComponentForm) &&
    typeof value.targetComponentLanguage === "string" &&
    typeof value.targetComponentDialect === "string" &&
    typeof value.witnessId === "string" &&
    value.witnessId.trim().length > 0 &&
    value.witnessId.length <= 100 &&
    exactToken(value.witnessForm) &&
    typeof value.witnessLanguage === "string" &&
    typeof value.witnessVariety === "string";
}

function sameIdentity(
  left: CrossLanguageWitnessOperationBindingIdentityV0_2,
  right: CrossLanguageWitnessOperationBindingIdentityV0_2,
): boolean {
  return left.targetComponentIndex === right.targetComponentIndex &&
    left.targetComponentForm === right.targetComponentForm &&
    left.targetComponentLanguage === right.targetComponentLanguage &&
    left.targetComponentDialect === right.targetComponentDialect &&
    left.witnessId === right.witnessId &&
    left.witnessForm === right.witnessForm &&
    left.witnessLanguage === right.witnessLanguage &&
    left.witnessVariety === right.witnessVariety;
}

export function buildCrossLanguageWitnessOperationLedgerV0_2(
  input: CrossLanguageWitnessOperationLedgerInputV0_2,
): BuildCrossLanguageWitnessOperationLedgerResultV0_2 {
  const reasons: string[] = [];
  if (!isRecord(input)) {
    return {
      schemaVersion: CROSS_LANGUAGE_WITNESS_OPERATION_LEDGER_SCHEMA_V0_2,
      status: "INVALID_BINDING",
      reasonCodes: ["INPUT_MUST_BE_OBJECT"],
    };
  }
  if (!validIdentity(input.attachedIdentity)) reasons.push("ATTACHED_IDENTITY_MALFORMED");
  if (!validIdentity(input.currentIdentity)) reasons.push("CURRENT_IDENTITY_MALFORMED");
  if (!Array.isArray(input.operations) || input.operations.length > 8) reasons.push("ZERO_TO_EIGHT_OPERATIONS_REQUIRED");
  if (typeof input.proposedRelationship !== "string" || input.proposedRelationship.length > 1000) {
    reasons.push("PROPOSED_RELATIONSHIP_MALFORMED");
  }
  if (typeof input.evidenceReference !== "string" || input.evidenceReference.length > 1000) {
    reasons.push("EVIDENCE_REFERENCE_MALFORMED");
  }
  if (reasons.length) {
    return {
      schemaVersion: CROSS_LANGUAGE_WITNESS_OPERATION_LEDGER_SCHEMA_V0_2,
      status: "INVALID_BINDING",
      reasonCodes: reasons,
    };
  }

  const attachedIdentity = input.attachedIdentity as CrossLanguageWitnessOperationBindingIdentityV0_2;
  const currentIdentity = input.currentIdentity as CrossLanguageWitnessOperationBindingIdentityV0_2;
  if (!sameIdentity(attachedIdentity, currentIdentity)) {
    return {
      schemaVersion: CROSS_LANGUAGE_WITNESS_OPERATION_LEDGER_SCHEMA_V0_2,
      status: "STALE_BINDING",
      reasonCodes: ["ATTACHED_COMPONENT_OR_WITNESS_IDENTITY_CHANGED"],
    };
  }

  return {
    schemaVersion: CROSS_LANGUAGE_WITNESS_OPERATION_LEDGER_SCHEMA_V0_2,
    status: "BUILT",
    binding: currentIdentity,
    operationLedgerResult: buildCrossLanguageOperationLedgerV0_2({
      initialForm: currentIdentity.targetComponentForm,
      declaredFinalForm: currentIdentity.witnessForm,
      operations: input.operations,
      proposedRelationship: input.proposedRelationship,
      evidenceReference: input.evidenceReference,
    }),
  };
}
