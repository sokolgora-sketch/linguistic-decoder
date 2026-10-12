import fs from "node:fs";

import {
  adaptCmuDictCandidateSourceEvidenceV0_1,
  parseCmuDictCandidateSourceRecordsV0_1,
  type CmuDictCandidateAdapterInputV0_1,
} from "@/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";

const SOURCE_PATH = "src/data/openInstrument/pronunciation/cmudict.dict";
const ADAPTER_PATH =
  "src/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1.ts";
const SOURCE_TEXT = fs.readFileSync(SOURCE_PATH, "utf8");
const PARSED_SOURCE = parseCmuDictCandidateSourceRecordsV0_1(SOURCE_TEXT);

function candidate(
  sourceForm = "stone",
  overrides: Partial<CmuDictCandidateAdapterInputV0_1> = {},
): CmuDictCandidateAdapterInputV0_1 {
  return {
    candidateId: "candidate.stone.v0_1",
    sourceId: "english-kaikki-record.stone.v0_1",
    sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    sourceRecordId: "snapshot-record.stone.v0_1",
    sourceForm,
    normalizedForm: normalizeEnglishLexicalJoinKeyV0_1(sourceForm),
    language: "English",
    senseId: "sense.stone.v0_1",
    gloss: "a fixture gloss; not used for joining",
    sourceProvenance: {
      entryLocator: "fixture://english/stone",
      sourceRecordId: "snapshot-record.stone.v0_1",
      sourceFamilyId:
        "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    },
    ...overrides,
  };
}

function recordsFor(sourceForm: string) {
  const key = normalizeEnglishLexicalJoinKeyV0_1(sourceForm);
  return PARSED_SOURCE.filter(
    (record) =>
      record.baseSourceForm !== null &&
      normalizeEnglishLexicalJoinKeyV0_1(record.baseSourceForm) === key,
  );
}

describe("CMUdict candidate source adapter v0.1", () => {
  it("uses the exact bundled artifact identity", () => {
    const result = adaptCmuDictCandidateSourceEvidenceV0_1(candidate());
    expect(result.variants[0]).toMatchObject({
      sourceArtifactBytes: 3618488,
      sourceArtifactSha256:
        "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22",
      sourceRevision: "74790861f652b15e4ac49015a90074ad62a27690",
      sourceNotation: "ARPABET",
      sourceProfileId: "open-instrument.cmudict-arpabet-en-us.v0_1",
    });
  });

  it("performs exact no-trim NFC/en-US-lowercase/NFC joining", () => {
    expect(adaptCmuDictCandidateSourceEvidenceV0_1(candidate("STONE"))).toMatchObject({
      status: "defined",
      candidateJoinKey: "stone",
    });
    expect(normalizeEnglishLexicalJoinKeyV0_1("Cafe\u0301")).toBe("café");
    const parsed = parseCmuDictCandidateSourceRecordsV0_1(
      "Cafe\u0301 K AE1 F EY0 # composed source\n",
    );
    expect(parsed[0]).toMatchObject({
      kind: "valid",
      baseSourceForm: "Cafe\u0301",
    });
  });

  it("does not trim a leading-space candidate source form", () => {
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate(" stone")),
    ).toMatchObject({
      status: "null",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
    });
  });

  it("does not trim a trailing-space candidate source form", () => {
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate("stone ")),
    ).toMatchObject({
      status: "null",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
    });
  });

  it("rejects text between the source form and the required separator", () => {
    const parsed = parseCmuDictCandidateSourceRecordsV0_1(
      "word\tjunk W ER1 D\n",
    );
    expect(parsed[0]).toMatchObject({
      kind: "invalid",
      sourceForm: "word",
      reasonCode: "CMUDICT_SOURCE_LINE_MALFORMED",
    });
  });

  it("removes only a terminal numeric CMUdict source-form suffix", () => {
    const parsed = parseCmuDictCandidateSourceRecordsV0_1(
      "read R EH1 D\nread(2) R IY1 D\n",
    );
    expect(parsed.filter((record) => record.kind === "valid")).toMatchObject([
      { sourceForm: "read", baseSourceForm: "read", variantId: "1" },
      { sourceForm: "read(2)", baseSourceForm: "read", variantId: "2" },
    ]);
  });

  it("preserves physical source order and variant identity", () => {
    const result = adaptCmuDictCandidateSourceEvidenceV0_1(candidate("read"));
    expect(result.status).toBe("defined");
    expect(result.variants.map((variant) => variant.variantId)).toEqual(["1", "2"]);
    expect(result.variants.map((variant) => variant.variantOrder)).toEqual([0, 1]);
    expect(result.variants[0].sourceLineNumber).toBeLessThan(
      result.variants[1].sourceLineNumber,
    );
  });

  it("preserves annotations opaquely and excludes them from pronunciation tokens", () => {
    const result = adaptCmuDictCandidateSourceEvidenceV0_1(candidate("aalborg"));
    expect(result.status).toBe("defined");
    expect(result.variants[0]).toMatchObject({
      rawPronunciation: "AO1 L B AO0 R G",
      orderedRawArpabetTokens: ["AO1", "L", "B", "AO0", "R", "G"],
      opaqueAnnotationText: "place, danish",
    });
    expect(result.variants[0].orderedRawArpabetTokens).not.toContain("#");
    expect(result.variants[0].orderedRawArpabetTokens).not.toContain("place,");
  });

  it("preserves the exact raw source line and one-based locator", () => {
    const result = adaptCmuDictCandidateSourceEvidenceV0_1(candidate("aalborg"));
    const expected = recordsFor("aalborg")[0];
    expect(result.variants[0]).toMatchObject({
      rawSourceLine: expected.rawSourceLine,
      sourceLineNumber: expected.sourceLineNumber,
    });
  });

  it("preserves raw stress tokens and exposes a lossless base/stress view", () => {
    const result = adaptCmuDictCandidateSourceEvidenceV0_1(candidate("stone"));
    expect(result.variants[0].orderedRawArpabetTokens).toContain("OW1");
    expect(result.variants[0].losslessBaseStressViews).toContainEqual({
      rawToken: "OW1",
      baseToken: "OW",
      stress: "1",
    });
  });

  it("accepts the complete ratified ARPABET inventory", () => {
    const bases = [
      "AA",
      "AE",
      "AH",
      "AO",
      "AW",
      "AY",
      "B",
      "CH",
      "D",
      "DH",
      "EH",
      "ER",
      "EY",
      "F",
      "G",
      "HH",
      "IH",
      "IY",
      "JH",
      "K",
      "L",
      "M",
      "N",
      "NG",
      "OW",
      "OY",
      "P",
      "R",
      "S",
      "SH",
      "T",
      "TH",
      "UH",
      "UW",
      "V",
      "W",
      "Y",
      "Z",
      "ZH",
    ];
    const tokens = bases.map((base) =>
      [
        "AA",
        "AE",
        "AH",
        "AO",
        "AW",
        "AY",
        "EH",
        "ER",
        "EY",
        "IH",
        "IY",
        "OW",
        "OY",
        "UH",
        "UW",
      ].includes(base)
        ? `${base}1`
        : base,
    );
    const parsed = parseCmuDictCandidateSourceRecordsV0_1(
      `inventory ${tokens.join(" ")}\n`,
    );
    expect(parsed[0]).toMatchObject({ kind: "valid" });
  });

  it("fails closed for unsupported ARPABET tokens", () => {
    expect(
      parseCmuDictCandidateSourceRecordsV0_1("word AX1\n")[0],
    ).toMatchObject({
      kind: "invalid",
      reasonCode: "CMUDICT_ARPABET_TOKEN_UNSUPPORTED",
    });
  });

  it("fails closed for malformed stress digits", () => {
    expect(
      parseCmuDictCandidateSourceRecordsV0_1("word AA3\n")[0],
    ).toMatchObject({
      kind: "invalid",
      reasonCode: "CMUDICT_STRESS_DIGIT_MALFORMED",
    });
    expect(
      parseCmuDictCandidateSourceRecordsV0_1("word B1\n")[0],
    ).toMatchObject({
      kind: "invalid",
      reasonCode: "CMUDICT_STRESS_DIGIT_MALFORMED",
    });
  });

  it("fails closed for malformed source lines", () => {
    expect(parseCmuDictCandidateSourceRecordsV0_1("word\n")[0]).toMatchObject({
      kind: "invalid",
      reasonCode: "CMUDICT_SOURCE_LINE_MALFORMED",
    });
    expect(
      parseCmuDictCandidateSourceRecordsV0_1("word AA1 #\n")[0],
    ).toMatchObject({
      kind: "invalid",
      reasonCode: "CMUDICT_SOURCE_LINE_MALFORMED",
    });
  });

  it("returns Null for a missing exact match", () => {
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate("definitely-not-cmudict")),
    ).toMatchObject({
      status: "null",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
      variants: [],
    });
  });

  it("detects distinct normalized source-form collisions without choosing a spelling", () => {
    const parsed = parseCmuDictCandidateSourceRecordsV0_1(
      "Word W ER1 D\nword W ER0 D\n",
    );
    const matching = parsed.filter(
      (record) =>
        record.kind === "valid" &&
        normalizeEnglishLexicalJoinKeyV0_1(record.baseSourceForm) === "word",
    );
    expect(new Set(matching.map((record) => record.baseSourceForm)).size).toBe(2);
    expect(matching.map((record) => record.rawSourceLine)).toEqual([
      "Word W ER1 D",
      "word W ER0 D",
    ]);
  });

  it("returns Null on an artifact hash mismatch before lookup", () => {
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate(), {
        sourceArtifactSha256: "0".repeat(64),
      }),
    ).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_SOURCE_ARTIFACT_MISMATCH",
    });
  });

  it("returns Null on an artifact byte-count mismatch before lookup", () => {
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate(), {
        sourceArtifactBytes: 1,
      }),
    ).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_SOURCE_ARTIFACT_MISMATCH",
    });
  });

  it("returns Null on a source revision mismatch before lookup", () => {
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate(), {
        sourceRevision: "unratified-revision",
      }),
    ).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_SOURCE_REVISION_MISMATCH",
    });
  });

  it("returns Null on notation or profile authority mismatch", () => {
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate(), {
        sourceNotation: "IPA",
      }),
    ).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED",
    });
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate(), {
        sourceProfileId: "unratified-profile",
      }),
    ).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_CANDIDATE_NOTATION_UNAUTHORIZED",
    });
  });

  it("preserves complete candidate provenance independently of the pronunciation evidence", () => {
    const input = candidate();
    const result = adaptCmuDictCandidateSourceEvidenceV0_1(input);
    expect(result).toMatchObject({
      candidateId: input.candidateId,
      candidateSourceId: input.sourceId,
      candidateSourceFamilyId: input.sourceFamilyId,
      candidateSourceRecordId: input.sourceRecordId,
      candidateSourceForm: input.sourceForm,
      candidateSourceProvenance: input.sourceProvenance,
    });
  });

  it("preserves duplicate physical records as distinct parser evidence", () => {
    const parsed = parseCmuDictCandidateSourceRecordsV0_1(
      "word W ER1 D\n;;; comment\nword W ER1 D\n",
    ).filter((record) => record.kind === "valid");
    expect(parsed).toHaveLength(2);
    expect(parsed.map((record) => record.sourceLineNumber)).toEqual([1, 3]);
    expect(parsed[0].rawSourceLine).toBe(parsed[1].rawSourceLine);
  });

  it("attaches form-level evidence independently to multiple lexical senses", () => {
    const first = adaptCmuDictCandidateSourceEvidenceV0_1(
      candidate("read", {
        candidateId: "sense-one",
        sourceRecordId: "record-one",
        senseId: "sense-one-id",
      }),
    );
    const second = adaptCmuDictCandidateSourceEvidenceV0_1(
      candidate("read", {
        candidateId: "sense-two",
        sourceRecordId: "record-two",
        senseId: "sense-two-id",
      }),
    );
    expect(first.variants).toEqual(second.variants);
    expect(first.candidateId).not.toBe(second.candidateId);
    expect(first.candidateSourceRecordId).not.toBe(second.candidateSourceRecordId);
    expect(first).toMatchObject({
      senseId: "sense-one-id",
      gloss: "a fixture gloss; not used for joining",
    });
    expect(second).toMatchObject({
      senseId: "sense-two-id",
      gloss: "a fixture gloss; not used for joining",
    });

    const nullResult = adaptCmuDictCandidateSourceEvidenceV0_1(
      candidate("zzzzzzzz", {
        senseId: "missing-sense-id",
        gloss: "missing gloss",
      }),
    );
    expect(nullResult).toMatchObject({
      status: "null",
      senseId: "missing-sense-id",
      gloss: "missing gloss",
    });
  });

  it("is deterministic and deeply immutable", () => {
    const first = adaptCmuDictCandidateSourceEvidenceV0_1(candidate("read"));
    const second = adaptCmuDictCandidateSourceEvidenceV0_1(candidate("read"));
    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.variants)).toBe(true);
    expect(Object.isFrozen(first.variants[0])).toBe(true);
    expect(Object.isFrozen(first.variants[0].losslessBaseStressViews)).toBe(true);
    expect(Object.isFrozen(first.candidateSourceProvenance)).toBe(true);
  });

  it("returns one envelope for one existing candidate without generation, filtering, ranking, or selection", () => {
    const input = candidate("stone", { candidateId: "existing-only" });
    const result = adaptCmuDictCandidateSourceEvidenceV0_1(input);
    expect(result.candidateId).toBe("existing-only");
    expect(result.variants).toHaveLength(1);
    expect(result.reasonCode).toBeNull();
  });

  it("does not emit Voice, Gamma, ZC, representation, semantic, or winner fields", () => {
    const result = adaptCmuDictCandidateSourceEvidenceV0_1(candidate());
    const forbidden = [
      "voicePath",
      "gamma",
      "zc",
      "zeroConsonantalStructure",
      "representationBridge",
      "sameRepresentation",
      "functionalInterpretation",
      "semanticRank",
      "winner",
      "senseSpecificPronunciation",
    ];
    for (const key of forbidden) {
      expect(key in result).toBe(false);
      expect(key in result.variants[0]).toBe(false);
    }
  });

  it("does not reuse input-role or projection-coupled helpers", () => {
    const source = fs.readFileSync(ADAPTER_PATH, "utf8");
    for (const forbidden of [
      "normalizeCmuDictLexicalWordV0_1",
      "lookupCmuDictPronunciationsV0_1",
      "resolveCmuDictPronunciationToVoiceV0_1",
      "resolveArpabetPronunciationVariantsToVoiceV0_1",
      "parseArpabetTokenV0_1",
    ]) {
      expect(source).not.toContain(forbidden);
    }
  });

  it("preserves the exact annotated-row pronunciation slice", () => {
    const parsed = parseCmuDictCandidateSourceRecordsV0_1(
      "word AA1 B # opaque annotation # remains\n",
    );
    expect(parsed[0]).toMatchObject({
      kind: "valid",
      rawPronunciation: "AA1 B",
      opaqueAnnotationText: "opaque annotation # remains",
      orderedRawArpabetTokens: ["AA1", "B"],
    });
  });

  it("preserves an empty physical line in locator counting", () => {
    const parsed = parseCmuDictCandidateSourceRecordsV0_1(
      "\nword W ER1 D\n;;; comment\nword W ER0 D\n",
    ).filter((record) => record.kind === "valid");
    expect(parsed.map((record) => record.sourceLineNumber)).toEqual([2, 4]);
  });

  it("fails closed when the supplied candidate normalized form is not authoritative", () => {
    expect(
      adaptCmuDictCandidateSourceEvidenceV0_1(
        candidate("stone", { normalizedForm: "not-stone" }),
      ),
    ).toMatchObject({
      status: "null",
      reasonCode: "CMUDICT_CANDIDATE_AUTHORITY_INVARIANT_VIOLATION",
    });
  });

  it("keeps Null variants empty for every failure class", () => {
    const failures = [
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate("zzzzzzzz")),
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate(), {
        sourceArtifactSha256: "0".repeat(64),
      }),
      adaptCmuDictCandidateSourceEvidenceV0_1(candidate(), {
        sourceNotation: "IPA",
      }),
    ];
    expect(failures.every((failure) => failure.status === "null")).toBe(true);
    expect(failures.every((failure) => failure.variants.length === 0)).toBe(true);
  });
});
