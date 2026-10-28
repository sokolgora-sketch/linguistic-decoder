import { createHash } from "node:crypto";
import { mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
  createLexinSourceFamilyAdapterV0_1,
  LEXIN_SOURCE_FAMILY_ID_V0_1,
  loadLexinServerOnlySourceV0_1,
  parseLexinXmlV0_1,
} from "@/shared/openInstrument/lexinSourceFamilyAdapter.v0_1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  queryGenericFunctionalWitnessesV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

const VALID_XML = `<?xml version="1.0" encoding="UTF-8"?>
<Dictionary BaseLang="Swedish" TargetLang="Albanian" Version="2010-07-07">
  <Word ID="1" MatchingID="2" Type="subst." Value="fisk" Variant="" VariantID="3">
    <BaseLang><Meaning>ett slags djur som lever i vattnet</Meaning></BaseLang>
    <TargetLang>
      <Translation>peshk</Translation>
      <Synonym>kafshë ujore</Synonym>
      <Example ID="1">peshk i zier</Example>
      <Compound ID="1">peshk akuariumi</Compound>
    </TargetLang>
  </Word>
  <Word ID="4" MatchingID="5" Type="subst." Value="fiskare" Variant="" VariantID="6">
    <BaseLang><Meaning>person som fiskar yrkesmässigt</Meaning></BaseLang>
    <TargetLang><Translation>peshkatar</Translation><Synonym>njeri që merret me peshkim</Synonym></TargetLang>
  </Word>
</Dictionary>`;

function query(embryo: string) {
  return {
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    embryo,
    voicePath: ["E"] as const,
    queryNormalization: "EXACT_NFC" as const,
  };
}

function fixtureIdentity(text: string) {
  const bytes = Buffer.from(text, "utf8");
  return {
    bytes: bytes.byteLength,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    xmlVersion: "2010-07-07",
  };
}

describe("Lexin Swedish-Albanian source-family adapter v0.1", () => {
  it("parses only explicit TargetLang translations and preserves source identity", () => {
    const parsed = parseLexinXmlV0_1(VALID_XML);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.records.map((record) => record.albanianTranslation)).toEqual([
      "peshk",
      "peshkatar",
    ]);
    expect(parsed.records[0]).toMatchObject({
      wordId: "1",
      matchingId: "2",
      variantId: "3",
      swedishHeadword: "fisk",
      swedishMeanings: ["ett slags djur som lever i vattnet"],
      albanianSynonyms: ["kafshë ujore"],
      albanianExamples: ["peshk i zier"],
      albanianCompounds: ["peshk akuariumi"],
    });
    expect(parsed.records[0]?.sourceRecordId).toContain(`${LEXIN_SOURCE_FAMILY_ID_V0_1}:word=1`);
  });

  it("projects bilingual descriptive facts with Null pronunciation and function boundaries", () => {
    const parsed = parseLexinXmlV0_1(VALID_XML);
    if (!parsed.ok) throw new Error("fixture did not parse");
    const result = queryGenericFunctionalWitnessesV1(
      query("peshk"),
      [createLexinSourceFamilyAdapterV0_1(parsed.records)],
    );

    expect(result).toMatchObject({ status: "MATCHES_FOUND", noSingleWinner: true, userDecisionPosture: "user_decides" });
    expect(result.matches[0]).toMatchObject({
      sourceForm: "peshk",
      candidateVoicePathPolicy: "NULL_UNAUTHORIZED",
      functionalCorrespondence: "NOT_EVALUATED",
      targetMeaning: "NOT_CLAIMED",
      sourceProvenance: {
        sourceTraditionId: LEXIN_SOURCE_FAMILY_ID_V0_1,
        languageVariety: "Swedish → Albanian",
      },
      sourceDetails: {
        sourceIdentity: expect.stringContaining("word=1"),
        definitions: [
          "Swedish headword: fisk",
          "Swedish meaning: ett slags djur som lever i vattnet",
        ],
        examples: [
          "Albanian translation field: peshk",
          "Albanian example: peshk i zier",
          "Albanian compound: peshk akuariumi",
        ],
      },
    });
    expect(result.matches.every((match) => match.sourceAttestation === "SOURCE_RECORD_ONLY")).toBe(true);
    expect(result.matches.every((match) => match.noSingleWinner)).toBe(true);
  });

  it("does not query Swedish headwords, synonyms, or missing translations", () => {
    const noTranslation = VALID_XML.replace(
      "<Translation>peshk</Translation>",
      "<Synonym>peshk</Synonym>",
    );
    const parsed = parseLexinXmlV0_1(noTranslation);
    if (!parsed.ok) throw new Error("fixture did not parse");
    const adapter = createLexinSourceFamilyAdapterV0_1(parsed.records);
    expect(queryGenericFunctionalWitnessesV1(query("fisk"), [adapter]).status).toBe("NO_MATCHES");
    expect(queryGenericFunctionalWitnessesV1(query("kafshë ujore"), [adapter]).status).toBe("NO_MATCHES");
    expect(queryGenericFunctionalWitnessesV1(query("peshk"), [adapter]).status).toBe("NO_MATCHES");
    expect(queryGenericFunctionalWitnessesV1(query("peshkatar"), [adapter]).status).toBe("MATCHES_FOUND");
  });

  it("preserves multiple explicit Translation fields as separate deterministic records", () => {
    const multiple = VALID_XML.replace(
      "<Translation>peshk</Translation>",
      "<Translation>peshk</Translation><Translation>peshk i zakonshëm</Translation>",
    );
    const parsed = parseLexinXmlV0_1(multiple);
    if (!parsed.ok) throw new Error("fixture did not parse");
    expect(parsed.records.map((record) => record.sourceRecordId)).toHaveLength(3);
    expect(parsed.records[0]?.sourceRecordId).not.toBe(parsed.records[1]?.sourceRecordId);
  });

  it.each([
    ["malformed XML", VALID_XML.replace("</Dictionary>", "")],
    ["wrong language direction", VALID_XML.replace('BaseLang="Swedish"', 'BaseLang="English"')],
    ["missing Word ID", VALID_XML.replace('Word ID="1"', 'Word MatchingID="2"')],
  ])("fails closed for %s", (_label, value) => {
    const parsed = parseLexinXmlV0_1(value);
    expect(parsed.ok).toBe(false);
  });

  it("fails closed for duplicate record identities", () => {
    const duplicate = VALID_XML.replace(
      '<Word ID="4" MatchingID="5" Type="subst." Value="fiskare" Variant="" VariantID="6">',
      '<Word ID="1" MatchingID="2" Type="subst." Value="fiskare" Variant="" VariantID="3">',
    );
    expect(parseLexinXmlV0_1(duplicate)).toEqual({
      ok: false,
      reasonCode: "LEXIN_SOURCE_DUPLICATE_RECORD_ID",
    });
  });

  it("validates fixture byte length, SHA256, path boundary, and missing source", async () => {
    const directory = await mkdtemp(join(tmpdir(), "open-instrument-lexin-loader-"));
    const fixturePath = join(directory, "swe_alb.xml");
    await writeFile(fixturePath, VALID_XML, "utf8");
    const identity = fixtureIdentity(VALID_XML);
    try {
      await expect(loadLexinServerOnlySourceV0_1(fixturePath, identity)).resolves.toMatchObject({
        status: "READY",
        sourcePath: await realpath(fixturePath),
        adapter: expect.any(Object),
      });
      await expect(loadLexinServerOnlySourceV0_1(fixturePath, { ...identity, bytes: identity.bytes + 1 })).resolves.toMatchObject({
        status: "UNAVAILABLE",
        reasonCode: "LEXIN_SOURCE_BYTE_LENGTH_MISMATCH",
      });
      await expect(loadLexinServerOnlySourceV0_1(fixturePath, { ...identity, sha256: "0".repeat(64) })).resolves.toMatchObject({
        status: "UNAVAILABLE",
        reasonCode: "LEXIN_SOURCE_SHA256_MISMATCH",
      });
      await expect(loadLexinServerOnlySourceV0_1(resolve("package.json"), identity)).resolves.toMatchObject({
        status: "UNAVAILABLE",
        reasonCode: "LEXIN_SOURCE_OUTSIDE_EXTERNAL_BOUNDARY",
      });
      await expect(loadLexinServerOnlySourceV0_1(null, identity)).resolves.toMatchObject({
        status: "UNAVAILABLE",
        reasonCode: "LEXIN_SOURCE_PATH_NOT_CONFIGURED",
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
