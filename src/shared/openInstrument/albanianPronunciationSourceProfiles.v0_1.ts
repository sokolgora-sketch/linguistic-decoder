import {
  ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
  type AlbanianPronunciationProfileQualifierV0_1,
  type AlbanianPronunciationScopeV0_1,
} from "./albanianPronunciationSourceContract.v0_1";

export const ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1 =
  "open-instrument.alb-ipa-northern-tosk.v2_2.v0_1" as const;

export type AlbanianProjectableSourceProfileBindingV0_1 = Readonly<{
  authorizedScopeQualifierPairs: readonly Readonly<{
    sourceScope: AlbanianPronunciationScopeV0_1;
    sourceProfileQualifier: AlbanianPronunciationProfileQualifierV0_1 | null;
  }>[];
}>;

function bindingPairV0_1(
  sourceScope: AlbanianPronunciationScopeV0_1,
  sourceProfileQualifier: AlbanianPronunciationProfileQualifierV0_1 | null,
): Readonly<{
  sourceScope: AlbanianPronunciationScopeV0_1;
  sourceProfileQualifier: AlbanianPronunciationProfileQualifierV0_1 | null;
}> {
  return Object.freeze({ sourceScope, sourceProfileQualifier });
}

export const ALBANIAN_PROJECTABLE_SOURCE_PROFILE_BINDINGS_V0_1: Readonly<
  Record<string, AlbanianProjectableSourceProfileBindingV0_1>
> = Object.freeze({
  [ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1]: Object.freeze({
    authorizedScopeQualifierPairs: Object.freeze([
      ...ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1.map((sourceScope) =>
        bindingPairV0_1(sourceScope, null),
      ),
      bindingPairV0_1("TOSK_EXPLICIT", "NORTHERN_TOSK_EXPLICIT"),
      bindingPairV0_1("ALBANIAN_UNSPECIFIED", "NORTHERN_TOSK_EXPLICIT"),
      bindingPairV0_1("GHEG_EXPLICIT", "SOUTHERN_GHEG_EXPLICIT"),
      bindingPairV0_1("ALBANIAN_UNSPECIFIED", "SOUTHERN_GHEG_EXPLICIT"),
    ]),
  }),
  [ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1]: Object.freeze({
    authorizedScopeQualifierPairs: Object.freeze([
      bindingPairV0_1("TOSK_EXPLICIT", "NORTHERN_TOSK_EXPLICIT"),
    ]),
  }),
});

export const ALBANIAN_PROJECTABLE_SOURCE_PROFILE_IDS_V0_1: readonly string[] = Object.freeze([
  ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
  ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1,
]);

export function isAlbanianProjectableSourceProfileBindingAuthorizedV0_1(
  sourceProfileId: string,
  sourceScope: AlbanianPronunciationScopeV0_1,
  sourceProfileQualifier: AlbanianPronunciationProfileQualifierV0_1 | null,
): boolean {
  const binding = ALBANIAN_PROJECTABLE_SOURCE_PROFILE_BINDINGS_V0_1[sourceProfileId];
  return (
    binding !== undefined &&
    binding.authorizedScopeQualifierPairs.some(
      (pair) =>
        pair.sourceScope === sourceScope &&
        pair.sourceProfileQualifier === sourceProfileQualifier,
    )
  );
}
