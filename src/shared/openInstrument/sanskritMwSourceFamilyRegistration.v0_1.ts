import {
  createSanskritMwSourceFamilyAdapterV0_1,
  SANSKRIT_MW_SOURCE_FAMILY_ADAPTER_ID_V0_1,
  SANSKRIT_MW_SOURCE_FAMILY_ID_V0_1,
  SANSKRIT_MW_SOURCE_TRADITION_ID_V0_1,
  type SanskritMwSourceFamilyAdapterV0_1,
  type SanskritMwSourceRecordV0_1,
} from "./sanskritMwSourceFamilyAdapter.v0_1";

export const SANSKRIT_SOURCE_ACTIVATION_DEFAULT_V0_1 =
  "REGISTERED_AND_DISABLED_PENDING_FUTURE_ACTIVATION_LANE" as const;

export type SanskritMwSourceFamilyRegistrationV0_1 = Readonly<{
  registrationId: "open-instrument.sanskrit-mw-source-registration.v0_1";
  adapterId: typeof SANSKRIT_MW_SOURCE_FAMILY_ADAPTER_ID_V0_1;
  sourceFamilyId: typeof SANSKRIT_MW_SOURCE_FAMILY_ID_V0_1;
  sourceTraditionId: typeof SANSKRIT_MW_SOURCE_TRADITION_ID_V0_1;
  status: "REGISTERED";
  activationDefault: typeof SANSKRIT_SOURCE_ACTIVATION_DEFAULT_V0_1;
  enabledByDefault: false;
  runtimeActiveAfterMerge: false;
  futureActivationLaneRequired: true;
  createAdapter: (
    records: readonly SanskritMwSourceRecordV0_1[],
  ) => SanskritMwSourceFamilyAdapterV0_1;
}>;

export const SANSKRIT_MW_SOURCE_FAMILY_REGISTRATION_V0_1 = Object.freeze({
  registrationId: "open-instrument.sanskrit-mw-source-registration.v0_1" as const,
  adapterId: SANSKRIT_MW_SOURCE_FAMILY_ADAPTER_ID_V0_1,
  sourceFamilyId: SANSKRIT_MW_SOURCE_FAMILY_ID_V0_1,
  sourceTraditionId: SANSKRIT_MW_SOURCE_TRADITION_ID_V0_1,
  status: "REGISTERED" as const,
  activationDefault: SANSKRIT_SOURCE_ACTIVATION_DEFAULT_V0_1,
  enabledByDefault: false as const,
  runtimeActiveAfterMerge: false as const,
  futureActivationLaneRequired: true as const,
  createAdapter: createSanskritMwSourceFamilyAdapterV0_1,
}) satisfies SanskritMwSourceFamilyRegistrationV0_1;

export const OPEN_INSTRUMENT_S5_SOURCE_FAMILY_REGISTRATIONS_V0_1 = Object.freeze([
  SANSKRIT_MW_SOURCE_FAMILY_REGISTRATION_V0_1,
] as const);

export function getRegisteredSanskritMwSourceFamilyV0_1():
  SanskritMwSourceFamilyRegistrationV0_1 {
  return SANSKRIT_MW_SOURCE_FAMILY_REGISTRATION_V0_1;
}
