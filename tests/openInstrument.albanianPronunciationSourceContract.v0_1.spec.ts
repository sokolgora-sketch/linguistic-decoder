import { readFileSync } from "node:fs";

import {
  ALBANIAN_PRONUNCIATION_NULL_REASON_CODES_V0_1,
  ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_ALLOWED_FIELDS_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_ID_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_EXCLUDED_FIELDS_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
  ALBANIAN_PRONUNCIATION_PROFILE_QUALIFIER_VALUES_V0_1,
  ALBANIAN_PRONUNCIATION_REVIEWED_SOUND_NOTE_QUALIFIERS_V0_1,
  ALBANIAN_PRONUNCIATION_VARIANT_POLICY_V0_1,
} from "@/shared/openInstrument/albanianPronunciationSourceContract.v0_1";

const contractDoc = readFileSync(
  "docs/open-instrument/albanian-pronunciation-source-contract-v0.1.md",
  "utf8",
);

describe("Albanian pronunciation source contract v0.1", () => {
  it("freezes the reviewed hash-bound source identity", () => {
    expect(ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_ID_V0_1).toBe(
      "OPEN_INSTRUMENT_ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1",
    );
    expect(ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1).toBe(
      "open-instrument.wiktionary-kaikki-albanian-ipa.v0_1",
    );
    expect(
      ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1,
    ).toBe(
      "7bd411e2b3cdfd83b7f09af9700791c01e81f36224ec5134e118ff26e83d0aa0",
    );
    expect(ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1).toBe(67438755);
    expect(ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.status).toBe(
      "FROZEN_SOURCE_CONTRACT_ONLY",
    );
  });

  it("freezes the source-only scope vocabulary and preserves unspecified scope", () => {
    expect(ALBANIAN_PRONUNCIATION_SCOPE_VALUES_V0_1).toEqual([
      "STANDARD_EXPLICIT",
      "GHEG_EXPLICIT",
      "TOSK_EXPLICIT",
      "REGIONAL_EXPLICIT",
      "ALBANIAN_UNSPECIFIED",
    ]);
    expect(
      ALBANIAN_PRONUNCIATION_CONTRACT_SCOPE_UNSPECIFIED_IS_NOT_STANDARD,
    ).toBe(true);
    expect(ALBANIAN_PRONUNCIATION_PROFILE_QUALIFIER_VALUES_V0_1).toEqual([
      "NORTHERN_TOSK_EXPLICIT",
      "SOUTHERN_GHEG_EXPLICIT",
    ]);
    expect(
      ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.scopeModel.profileQualifierDerivation,
    ).toBe(
      "DIRECT_SOUND_TAG_CONJUNCTION_OR_EXACT_REVIEWED_SOUND_NOTE_ONLY",
    );
    expect(ALBANIAN_PRONUNCIATION_REVIEWED_SOUND_NOTE_QUALIFIERS_V0_1).toEqual({
      "southern Gheg, Kavajë": "SOUTHERN_GHEG_EXPLICIT",
    });
  });

  it("limits the source surface and excludes semantic/audio fields", () => {
    expect(ALBANIAN_PRONUNCIATION_SOURCE_ALLOWED_FIELDS_V0_1).toEqual([
      "lexical_form",
      "language",
      "language_code",
      "explicit_ipa",
      "sound_level_tags",
      "sound_level_notes",
      "variant_identity",
      "variant_order",
      "source_locator",
      "source_build_metadata",
      "license_attribution_metadata",
    ]);
    expect(ALBANIAN_PRONUNCIATION_SOURCE_EXCLUDED_FIELDS_V0_1).toEqual([
      "definitions",
      "glosses",
      "translations",
      "etymologies",
      "examples",
      "semantic_fields",
      "audio_binaries",
      "unrelated_dictionary_metadata",
    ]);
    expect(
      ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.sourceSurface.audio,
    ).toBe("EXCLUDED_FROM_V0_1_PRONUNCIATION_TEXT_ARTIFACT");
  });

  it("preserves variants and forbids source-level winner selection", () => {
    expect(ALBANIAN_PRONUNCIATION_VARIANT_POLICY_V0_1).toEqual({
      oneIpaWithExplicitScope: "PRESERVE_SCOPED_PRONUNCIATION_CANDIDATE",
      multipleIpaWithSameExplicitScope: "PRESERVE_ALL_NO_WINNER",
      multipleIpaWithDifferentExplicitScopes:
        "PRESERVE_SEPARATE_SCOPED_CANDIDATES",
      labelledAndUnlabelled: "PRESERVE_BOTH_INDEPENDENTLY",
      unlabelledIpa: "ALBANIAN_UNSPECIFIED",
      genericAmbiguousMetadata: "PRESERVE_AMBIGUITY",
      noIpa: "PRONUNCIATION_NOT_FOUND",
      sourceLevelSingleWinnerSelection: "NO",
    });
    expect(ALBANIAN_PRONUNCIATION_NULL_REASON_CODES_V0_1).toEqual([
      "PRONUNCIATION_NOT_FOUND",
      "DIALECT_SCOPE_UNRESOLVED",
      "PRONUNCIATION_VARIANT_AMBIGUOUS",
    ]);
  });

  it("keeps later authority layers outside this contract", () => {
    expect(
      ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.authorityBoundary,
    ).toEqual({
      sourceContractIsNotPronunciationToVoiceAuthority: true,
      sourceContractIsNotProductionRuntimeAuthority: true,
      sourceContractIsNotMovingNucleusAuthority: true,
      sourceContractIsNotG2pAuthority: true,
      ipaToVoiceMappingDefinedHere: false,
      runtimePronunciationLookupDefinedHere: false,
      productionPromotionDefinedHere: false,
      semanticAuthorityDefinedHere: false,
    });
    expect(
      ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.firewalls,
    ).toEqual({
      orthographicPronunciationAuthority: "NO",
      g2pAuthority: "NO",
      movingNucleusAuthority: "NOT_DEFINED_HERE",
      ipaToVoiceAuthority: "NOT_DEFINED_HERE",
      semanticAuthority: "NO",
      audioBundling: "NO",
      sourceReplacement: "NO",
    });
  });

  it("deep-freezes the exported contract and nested policy values", () => {
    expect(Object.isFrozen(ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1)).toBe(
      true,
    );
    expect(
      Object.isFrozen(
        ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.sourceIdentity,
      ),
    ).toBe(true);
    expect(
      Object.isFrozen(ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.scopeModel),
    ).toBe(true);
    expect(
      Object.isFrozen(
        ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.licenseProvenance,
      ),
    ).toBe(true);
    expect(
      Object.isFrozen(
        ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.licenseProvenance
          .wiktionaryTextLicenses,
      ),
    ).toBe(true);
  });

  it("documents the contract-only boundary without runtime wiring", () => {
    expect(contractDoc).toContain("Status: `FROZEN_SOURCE_CONTRACT_ONLY`");
    expect(contractDoc).toContain("ORTHOGRAPHIC_PRONUNCIATION_AUTHORITY = NO");
    expect(contractDoc).toContain("ADJACENT_IPA_VOWELS != AUTOMATIC_MOVING_NUCLEUS");
    expect(contractDoc).toContain("No IPA-to-Voice mapping");
    expect(contractDoc).toContain("No source-level single-winner pronunciation selection");
    expect(contractDoc).toContain("ARTIFACT_IDENTITY_BY_SHA256 = YES");
    expect(contractDoc).toContain("COMPLETE_KAIKKI_REPLAY_PROVEN = NO");
  });
});

const ALBANIAN_PRONUNCIATION_CONTRACT_SCOPE_UNSPECIFIED_IS_NOT_STANDARD =
  ALBANIAN_PRONUNCIATION_SOURCE_CONTRACT_V0_1.scopeModel.unlabelledIsStandard ===
  false;
