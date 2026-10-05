import {
  ENGLISH_LEXICAL_SENSE_AUTHORITY_FIREWALLS_V0_1,
  ENGLISH_LEXICAL_SENSE_CONSTRUCTIVE_BLINDNESS_FORBIDDEN_INPUTS_V0_1,
  ENGLISH_LEXICAL_SENSE_JOIN_KEY_POLICY_V0_1,
  ENGLISH_LEXICAL_SENSE_LICENSE_PROVENANCE_V0_1,
  ENGLISH_LEXICAL_SENSE_MISSINGNESS_V0_1,
  ENGLISH_LEXICAL_SENSE_POLYSEMY_POLICY_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_ALLOWED_FIELDS_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_EXCLUDED_FIELDS_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_PROFILE_ID_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1,
  ENGLISH_LEXICAL_SENSE_STORAGE_POLICY_V0_1,
  normalizeEnglishLexicalJoinKeyV0_1,
  validateEnglishLexicalSenseSourceArtifactIdentityV0_1,
} from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";
import { readFileSync } from "node:fs";

const contractDoc = readFileSync(
  "docs/open-instrument/english-lexical-sense-source-authority-contract-v0.1.md",
  "utf8",
);

describe("English lexical-sense source authority contract v0.1", () => {
  it("freezes the source identity and source-only status", () => {
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_ID_V0_1).toBe(
      "OPEN_INSTRUMENT_ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_V0_1",
    );
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_PROFILE_ID_V0_1).toBe(
      "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    );
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1).toBe("English");
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1).toBe("en");
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1).toBe(
      "https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl",
    );
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1).toBe(
      3335546346,
    );
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1).toBe(
      "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195",
    );
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_V0_1.status).toBe(
      "FROZEN_SOURCE_AUTHORITY_CONTRACT_ONLY",
    );
  });

  it("freezes the minimum admitted field boundary", () => {
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_ALLOWED_FIELDS_V0_1).toEqual([
      "word",
      "lang",
      "lang_code",
      "pos",
      "senses[].id",
      "senses[].glosses",
      "senses[].tags",
      "senses[].raw_tags",
      "senses[].examples",
    ]);
    expect(ENGLISH_LEXICAL_SENSE_SOURCE_EXCLUDED_FIELDS_V0_1).toEqual(
      expect.arrayContaining([
        "forms",
        "translations",
        "etymology_text",
        "functional_correspondence",
        "target_sense",
        "voice_path",
      ]),
    );
  });

  it("preserves polysemy and forbids source-level winners", () => {
    expect(ENGLISH_LEXICAL_SENSE_POLYSEMY_POLICY_V0_1).toEqual({
      multipleEntriesPreserved: true,
      multiplePosPreserved: true,
      multipleSensesPreserved: true,
      sourceSenseOrderPreserved: true,
      primarySenseSelection: false,
      senseMerging: false,
      winnerSelection: false,
    });
  });

  it("freezes exact lexical normalization without collision resolution", () => {
    expect(ENGLISH_LEXICAL_SENSE_JOIN_KEY_POLICY_V0_1).toMatchObject({
      sourceField: "word",
      exactJoinOnly: true,
      trim: false,
      caseNormalizationCollisionsAreNotResolvedByThisContract: true,
    });
    expect(normalizeEnglishLexicalJoinKeyV0_1("  CAFE\u0301 ")).toBe(
      "  café ",
    );
  });

  it("keeps missingness distinct from semantic absence", () => {
    expect(ENGLISH_LEXICAL_SENSE_MISSINGNESS_V0_1).toEqual({
      reasonCode: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      meaning:
        "No exact admitted source record was found under the frozen join key; it does not mean that the word has no meaning or function.",
      spellingFallback: false,
      semanticInference: false,
    });
  });

  it("freezes storage, license, and attribution boundaries", () => {
    expect(ENGLISH_LEXICAL_SENSE_STORAGE_POLICY_V0_1).toEqual({
      rawArtifactStorageStrategy: "EXTERNAL_HASH_BOUND_NOT_REPOSITORY_BUNDLED",
      artifactIdentity: "SHA256_BOUND",
      liveUrlImmutable: false,
      repositoryBundlingAuthorized: false,
      gitLfsAuthorized: false,
      derivedSemanticSliceAuthorized: false,
    });
    expect(ENGLISH_LEXICAL_SENSE_LICENSE_PROVENANCE_V0_1).toMatchObject({
      wiktionaryDataLicenses: ["CC-BY-SA", "GFDL"],
      attributionRequired: true,
      wiktextractSoftwareLicense: "MIT",
      legalConclusion: false,
    });
  });

  it("keeps constructive blindness and functional firewalls explicit", () => {
    expect(ENGLISH_LEXICAL_SENSE_CONSTRUCTIVE_BLINDNESS_FORBIDDEN_INPUTS_V0_1).toEqual(
      expect.arrayContaining([
        "canonical_voice_path",
        "gamma",
        "consonantal_configuration",
        "level_3",
        "math7",
        "candidate_ranking",
        "manifestation_results",
      ]),
    );
    expect(ENGLISH_LEXICAL_SENSE_AUTHORITY_FIREWALLS_V0_1).toMatchObject({
      semanticSourceTextAvailable: true,
      functionalCorrespondenceAuthority: "NO",
      functionalOutcomeAuthority: "NO",
      wordSpecificFunctionAuthority: "NO",
      historicalOriginAuthority: "NO",
      consonantMeaningAuthority: "NO",
      manifestationAuthority: "NO",
      productionRuntimeAuthority: "NO",
      ipaToVoiceAuthority: "NO",
    });
  });

  it("fails closed on source identity mismatch and accepts the frozen identity", () => {
    expect(
      validateEnglishLexicalSenseSourceArtifactIdentityV0_1({
        byteLength: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
        sha256: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
      }),
    ).toEqual({ ok: true, reasonCodes: [] });

    const mismatch =
      validateEnglishLexicalSenseSourceArtifactIdentityV0_1({
        byteLength: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1 - 1,
        sha256: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
      });
    expect(mismatch).toMatchObject({
      ok: false,
      reasonCodes: ["SOURCE_IDENTITY_MISMATCH"],
    });
  });

  it("documents the contract-only and non-promotion boundary", () => {
    expect(contractDoc).toContain("FROZEN_SOURCE_AUTHORITY_CONTRACT_ONLY");
    expect(contractDoc).toContain("No 3.3 GB artifact is committed");
    expect(contractDoc).toContain("primary-sense");
    expect(contractDoc).toContain("LEXICAL_SENSE_SOURCE_NOT_FOUND");
    expect(contractDoc).toContain("No runtime adapter, API/UI wiring");
    expect(contractDoc).toContain(
      "INSPECT_AND_RECONCILE_LINEAR_AND_DF_BRAIN_BEFORE_FUNCTIONAL_OUTCOME_NORMALIZATION",
    );
  });

  it("deep-freezes the exported authority policy", () => {
    expect(Object.isFrozen(ENGLISH_LEXICAL_SENSE_SOURCE_AUTHORITY_CONTRACT_V0_1)).toBe(
      true,
    );
    expect(Object.isFrozen(ENGLISH_LEXICAL_SENSE_POLYSEMY_POLICY_V0_1)).toBe(true);
    expect(Object.isFrozen(ENGLISH_LEXICAL_SENSE_JOIN_KEY_POLICY_V0_1)).toBe(true);
  });
});
