import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
  type AlbanianPronunciationScopeV0_1,
} from "@/shared/openInstrument/albanianPronunciationSourceContract.v0_1";
import {
  readAlbanianPronunciationObservationsV0_1,
  verifyAlbanianPronunciationSourceArtifactV0_1,
} from "@/shared/openInstrument/albanianPronunciationSourceObservation.v0_1";

const FIXTURE_PATH = join(
  process.cwd(),
  "tests/fixtures/openInstrument/albanian-pronunciation-source/kaikki-selected-rows.v0_1.jsonl",
);
const MANIFEST_PATH = join(
  process.cwd(),
  "tests/fixtures/openInstrument/albanian-pronunciation-source/kaikki-selected-rows.v0_1.manifest.json",
);

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as {
  fixtureId: string;
  sourceProfileId: string;
  sourceArtifact: { bytes: number; sha256: string };
  fixtureArtifact: { bytes: number; sha256: string };
  extractionRule: string;
  sourceLineNumbers: number[];
};

const fixtureInput = {
  artifactPath: FIXTURE_PATH,
  expectedArtifactBytes: manifest.fixtureArtifact.bytes,
  expectedArtifactSha256: manifest.fixtureArtifact.sha256,
  fixtureId: manifest.fixtureId,
  extractionRule: manifest.extractionRule,
} as const;

function lookup(word: string) {
  return readAlbanianPronunciationObservationsV0_1(word, fixtureInput);
}

describe("Albanian pronunciation source observation adapter v0.1", () => {
  it("binds the durable fixture to the exact frozen source artifact", () => {
    const fixtureBytes = readFileSync(FIXTURE_PATH);
    expect(fixtureBytes.byteLength).toBe(manifest.fixtureArtifact.bytes);
    expect(createHash("sha256").update(fixtureBytes).digest("hex")).toBe(
      manifest.fixtureArtifact.sha256,
    );
    expect(manifest.sourceProfileId).toBe(
      ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
    );
    expect(manifest.sourceLineNumbers).toEqual([1, 2, 3, 76]);
    expect(verifyAlbanianPronunciationSourceArtifactV0_1(fixtureInput)).toEqual({
      ok: true,
      artifactSha256: manifest.fixtureArtifact.sha256,
      artifactBytes: manifest.fixtureArtifact.bytes,
    });
  });

  it("projects a source row without semantic or downstream interpretation", () => {
    const result = lookup("de");

    expect(result.status).toBe("defined");
    if (result.status !== "defined") return;

    expect(result.observations).toHaveLength(1);
    expect(result.observations[0]).toMatchObject({
      lexicalForm: "de",
      rawIpa: "/ˈde/",
      sourceProfileId: ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
      sourceScope: "ALBANIAN_UNSPECIFIED" satisfies AlbanianPronunciationScopeV0_1,
      sourceNotation: "IPA",
      notationKind: "UNSPECIFIED",
      directTags: [],
      notes: [],
      variantOrder: 0,
      sourceLocator: { lineNumber: 3 },
    });
    expect(result.observations[0].provenance).toMatchObject({
      frozenArtifactSha256: manifest.sourceArtifact.sha256,
      frozenArtifactBytes: manifest.sourceArtifact.bytes,
      readArtifactSha256: manifest.fixtureArtifact.sha256,
      readArtifactBytes: manifest.fixtureArtifact.bytes,
      fixtureId: manifest.fixtureId,
    });
    expect(Object.keys(result.observations[0])).not.toEqual(
      expect.arrayContaining([
        "phonologicalCategory",
        "nucleusStructure",
        "canonicalVoicePath",
        "senses",
        "etymology",
      ]),
    );
  });

  it("preserves multiple source pronunciation observations in source order", () => {
    const result = lookup("a");

    expect(result.status).toBe("defined");
    if (result.status !== "defined") return;

    expect(result.observations.map((observation) => observation.rawIpa)).toEqual([
      "/a/",
      "/ɑ/",
    ]);
    expect(result.observations.map((observation) => observation.variantOrder)).toEqual([0, 1]);
    expect(result.observations.map((observation) => observation.variantIdentity)).toHaveLength(2);
    expect(result.observations[0].variantIdentity).not.toBe(
      result.observations[1].variantIdentity,
    );
  });

  it("preserves direct tags and keeps note text separate from scope", () => {
    const result = lookup("ai");

    expect(result.status).toBe("defined");
    if (result.status !== "defined") return;

    expect(result.observations).toHaveLength(3);
    expect(result.observations[0]).toMatchObject({
      rawIpa: "[aˈi]",
      directTags: ["standard"],
      notes: [],
      sourceScope: "STANDARD_EXPLICIT",
    });
    expect(result.observations[1]).toMatchObject({
      rawIpa: "[aj]",
      directTags: ["often", "unstressed", "standard"],
      notes: ["in the dialects"],
      sourceScope: "STANDARD_EXPLICIT",
    });
    expect(result.observations[2]).toMatchObject({
      rawIpa: "[aˈĩnɛ̃]",
      directTags: [],
      notes: ["southern Gheg, Kavajë"],
      sourceScope: "ALBANIAN_UNSPECIFIED",
    });
  });

  it("distinguishes absent forms from forms without explicit IPA", () => {
    expect(lookup("nu")).toMatchObject({
      status: "null",
      outcome: "FORM_WITHOUT_EXPLICIT_IPA",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
      observations: [],
    });
    expect(lookup("not-in-the-frozen-source")).toMatchObject({
      status: "null",
      outcome: "LEXICAL_FORM_NOT_FOUND",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
      observations: [],
    });
  });

  it("fails closed when the read artifact identity does not match", () => {
    expect(
      readAlbanianPronunciationObservationsV0_1("de", {
        ...fixtureInput,
        expectedArtifactSha256: "0".repeat(64),
      }),
    ).toMatchObject({
      status: "null",
      reasonCode: "SOURCE_ARTIFACT_IDENTITY_MISMATCH",
      observations: [],
    });
  });

  it("does not contain phonological, Voice, spelling, G2P, or semantic projection seams", () => {
    const source = readFileSync(
      "src/shared/openInstrument/albanianPronunciationSourceObservation.v0_1.ts",
      "utf8",
    );

    expect(source).not.toMatch(/PhonologicalCategory|quantizeSevenVoice|canonicalVoicePath/u);
    expect(source).not.toMatch(/G2P|spelling|etymology|senses|semantic/u);
  });
});
