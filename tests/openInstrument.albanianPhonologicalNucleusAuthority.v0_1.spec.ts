import { readFileSync } from "node:fs";

import {
  ALBANIAN_NUCLEUS_STRUCTURE_VALUES_V0_1,
  ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1,
  ALBANIAN_PHONOLOGICAL_NASALIZATION_VALUES_V0_1,
  ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_ID_V0_1,
  ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1,
  ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_SCHEMA_V0_1,
  ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_STATUS_V0_1,
  ALBANIAN_PHONOLOGICAL_NUCLEUS_REASON_CODES_V0_1,
  ALBANIAN_PHONOLOGICAL_NOTATION_KINDS_V0_1,
  ALBANIAN_PHONOLOGICAL_LENGTH_VALUES_V0_1,
  validateAlbanianPhonologicalNucleusObservationV0_1,
} from "@/shared/openInstrument/albanianPhonologicalNucleusAuthority.v0_1";

const contractDoc = readFileSync(
  "docs/open-instrument/albanian-phonological-nucleus-authority-contract-v0.1.md",
  "utf8",
);

const validObservation = {
  schemaVersion: ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_SCHEMA_V0_1,
  sourceProfileId: "open-instrument.wiktionary-kaikki-albanian-ipa.v0_1",
  rawIpa: "/y/",
  notationKind: "PHONEMIC",
  sourceScope: "STANDARD_EXPLICIT",
  phonologicalCategory: "HIGH_FRONT_ROUNDED",
  nucleusStructure: "MONOPHTHONG_NUCLEUS",
  features: { length: "NONE_RECORDED", nasalization: "NOT_RECORDED" },
  authorityRefs: ["JIPA-NORTHERN-TOSK-ALBANIAN"],
  reasonCodes: [],
  status: "SUPPORTED",
} as const;

describe("Albanian phonological nucleus authority contract v0.1", () => {
  it("freezes identity, source dependency, and status", () => {
    expect(ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_ID_V0_1).toBe(
      "OPEN_INSTRUMENT_ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1",
    );
    expect(ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_STATUS_V0_1).toBe(
      "FROZEN_PRE_VOICE_AUTHORITY_CONTRACT_ONLY",
    );
    expect(ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1.sourceDependency).toEqual(
      expect.objectContaining({
        profileId: "open-instrument.wiktionary-kaikki-albanian-ipa.v0_1",
        unspecifiedIsNotStandard: true,
        orthographicDialectInference: false,
      }),
    );
  });

  it("keeps a conceptual phonological inventory separate from Voice IDs", () => {
    expect(ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1).toHaveLength(7);
    expect(ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1).not.toEqual(
      expect.arrayContaining(["A", "E", "I", "O", "U", "Y", "Ë"]),
    );
    expect(ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1.authorityBoundary).toEqual(
      expect.objectContaining({
        voiceFamilyAnchorsDefined: false,
        ipaToVoiceMappingDefined: false,
        canonicalVoiceEventsDefined: false,
      }),
    );
  });

  it("preserves notation, scope, features, and unresolved states", () => {
    expect(ALBANIAN_PHONOLOGICAL_NOTATION_KINDS_V0_1).toEqual([
      "PHONEMIC",
      "PHONETIC",
      "UNSPECIFIED",
    ]);
    expect(ALBANIAN_PHONOLOGICAL_LENGTH_VALUES_V0_1).toEqual([
      "NONE_RECORDED",
      "SHORT",
      "HALF_LONG",
      "LONG",
      "UNKNOWN",
    ]);
    expect(ALBANIAN_PHONOLOGICAL_NASALIZATION_VALUES_V0_1).toEqual([
      "NOT_RECORDED",
      "PRESENT",
      "ABSENT",
      "UNKNOWN",
    ]);
    expect(ALBANIAN_NUCLEUS_STRUCTURE_VALUES_V0_1).toContain(
      "UNRESOLVED_NUCLEUS_STRUCTURE",
    );
    expect(ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1.featurePolicies).toEqual(
      expect.objectContaining({
        length: "PROFILE_DEPENDENT_PRESERVE_WITHOUT_STRIPPING",
        nasalization: "PROFILE_DEPENDENT_PRESERVE_WITHOUT_STRIPPING",
      }),
    );
  });

  it("does not authorize raw adjacency or glide adjacency", () => {
    expect(ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1.nucleusPolicy).toEqual(
      expect.objectContaining({
        rawAdjacencyAuthority: false,
        plainIpaAdjacencyReason: "PLAIN_IPA_ADJACENCY_INSUFFICIENT",
      }),
    );
    expect(ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1.glidePolicy).toEqual(
      expect.objectContaining({
        jAdjacencyAuthority: false,
        wAdjacencyAuthority: false,
        complexNucleusFromAdjacency: false,
      }),
    );
  });

  it("requires reviewed authority references for positive claims", () => {
    expect(validateAlbanianPhonologicalNucleusObservationV0_1(validObservation)).toEqual(
      expect.objectContaining({ ok: true }),
    );
    const withoutAuthority = validateAlbanianPhonologicalNucleusObservationV0_1({
      ...validObservation,
      authorityRefs: [],
    });
    expect(withoutAuthority).toEqual({
      ok: false,
      reasonCodes: ["AUTHORITY_REFERENCE_MISSING"],
    });
  });

  it("allows unresolved category and nucleus structure without forcing a result", () => {
    const unresolved = validateAlbanianPhonologicalNucleusObservationV0_1({
      ...validObservation,
      rawIpa: "ie",
      notationKind: "UNSPECIFIED",
      phonologicalCategory: null,
      nucleusStructure: "UNRESOLVED_NUCLEUS_STRUCTURE",
      authorityRefs: [],
      reasonCodes: [
        "PHONOLOGICAL_CATEGORY_UNRESOLVED",
        "NUCLEUS_STRUCTURE_UNRESOLVED",
      ],
      status: "UNRESOLVED",
    });
    expect(unresolved).toEqual(expect.objectContaining({ ok: true }));
  });

  it("documents the pre-Voice firewalls and source-profile boundary", () => {
    expect(contractDoc).toContain(
      "SOURCE_IPA != AUTOMATIC_PHONOLOGICAL_CATEGORY",
    );
    expect(contractDoc).toContain("ADJACENT_VOWELS != AUTOMATIC_MOVING_NUCLEUS");
    expect(contractDoc).toContain("ORTHOGRAPHIC_AUTHORITY = NO");
    expect(contractDoc).toContain("G2P_AUTHORITY = NO");
    expect(contractDoc).toContain("GENERIC_IPA_MAP = NOT_AUTHORITY");
    expect(contractDoc).toContain("VOICE_MAPPING = NOT_DEFINED_HERE");
    expect(contractDoc).toContain("CANONICALIZATION = NOT_AUTHORIZED_HERE");
    expect(contractDoc).toContain("ALBANIAN_UNSPECIFIED != STANDARD_EXPLICIT");
    expect(ALBANIAN_PHONOLOGICAL_NUCLEUS_REASON_CODES_V0_1).toEqual(
      expect.arrayContaining([
        "PHONOLOGICAL_CATEGORY_UNRESOLVED",
        "NUCLEUS_STRUCTURE_UNRESOLVED",
        "PROFILE_AUTHORITY_MISSING",
        "NOTATION_AUTHORITY_MISSING",
        "SYMBOL_AUTHORITY_MISSING",
        "CONFLICTING_PHONOLOGICAL_EVIDENCE",
      ]),
    );
  });

  it("deep-freezes contract policy structures", () => {
    expect(Object.isFrozen(ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1)).toBe(
      true,
    );
    expect(
      Object.isFrozen(
        ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1.sourceDependency,
      ),
    ).toBe(true);
    expect(
      Object.isFrozen(
        ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1.symbolPolicy,
      ),
    ).toBe(true);
  });
});
