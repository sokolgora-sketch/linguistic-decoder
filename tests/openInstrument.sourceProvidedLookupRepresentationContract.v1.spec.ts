import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import {
  SOURCE_PROVIDED_LOOKUP_REPRESENTATION_SCHEMA_V1,
  SOURCE_PROVIDED_LOOKUP_REPRESENTATION_MATCH_CLASSES_V1,
  validateSourceProvidedLookupRepresentationV1,
} from "../src/shared/openInstrument/sourceProvidedLookupRepresentationContract.v1";

function validInput() {
  return {
    schemaVersion: SOURCE_PROVIDED_LOOKUP_REPRESENTATION_SCHEMA_V1,
    sourceForm: "ăbactor",
    authorizedLookupRepresentation: "ABACTOR",
    authority: "SOURCE_PROVIDED",
    sourceField: "source_key",
    sourceFieldValue: "abactor",
    sourceLocator: 'TEI.2 entryFree id="n7" key="abactor"',
    representationKind: "SOURCE_FIELD_EXPLICIT_REPRESENTATION",
    lossiness: "POTENTIALLY_LOSSY_EXPLICIT",
    sourceDisambiguation: "NOT_APPLICABLE",
    reasonCode: "SOURCE_FIELD_EXPLICITLY_AUTHORIZED",
  } as const;
}

function expectRejected(
  input: unknown,
  reasonCode: string,
): void {
  const result = validateSourceProvidedLookupRepresentationV1(input);
  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(result.reasonCodes).toContain(reasonCode);
}

describe("source-provided lookup representation contract v1", () => {
  test("accepts an explicit source-provided representation without replacing the source form", () => {
    const result = validateSourceProvidedLookupRepresentationV1(validInput());

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.representation).toMatchObject({
      sourceForm: "ăbactor",
      authorizedLookupRepresentation: "ABACTOR",
      authority: "SOURCE_PROVIDED",
      sourceField: "source_key",
    });
    expect(result.representation.sourceForm).not.toBe(
      result.representation.authorizedLookupRepresentation,
    );
    expect(Object.isFrozen(result.representation)).toBe(true);
    expect(Object.keys(result.representation)).not.toContain("targetWord");
    expect(Object.keys(result.representation)).not.toContain("targetSense");
    expect(Object.keys(result.representation)).not.toContain("functionalCorrespondence");
  });

  test("supports the reviewed source-adapter authority with deterministic validation", () => {
    const input = {
      ...validInput(),
      authority: "REVIEWED_SOURCE_ADAPTER",
      sourceField: "source_metadata",
      sourceFieldValue: "ABACTOR",
      representationKind: "REVIEWED_SOURCE_ADAPTER_REPRESENTATION",
      reasonCode: "REVIEWED_ADAPTER_EXPLICITLY_AUTHORIZED",
    } as const;

    const first = validateSourceProvidedLookupRepresentationV1(input);
    const second = validateSourceProvidedLookupRepresentationV1(input);
    expect(first).toEqual(second);
  });

  test("requires source-field provenance, locator, and explicit reason", () => {
    const missing = { ...validInput() } as Record<string, unknown>;
    delete missing.sourceFieldValue;
    expectRejected(missing, "UNEXPECTED_FIELD_PRESENT");

    const missingLocator = { ...validInput() } as Record<string, unknown>;
    delete missingLocator.sourceLocator;
    expectRejected(missingLocator, "UNEXPECTED_FIELD_PRESENT");

    expectRejected(
      { ...validInput(), reasonCode: "" },
      "REASON_CODE_INVALID",
    );
  });

  test("rejects unknown authorities and all implicit alias modes", () => {
    expectRejected(
      { ...validInput(), authority: "GLOBAL_DIACRITIC_FOLD" },
      "AUTHORITY_INVALID",
    );
    expectRejected(
      { ...validInput(), representationKind: "FUZZY_MATCH" },
      "REPRESENTATION_KIND_INVALID",
    );
    expectRejected(
      { ...validInput(), representationKind: "SEMANTIC_ALIAS" },
      "REPRESENTATION_KIND_INVALID",
    );
  });

  test("rejects empty, malformed, non-NFC, and source-identical representations", () => {
    expectRejected(
      { ...validInput(), authorizedLookupRepresentation: "" },
      "REPRESENTATION_REQUIRED",
    );
    expectRejected(
      { ...validInput(), authorizedLookupRepresentation: "e\u0308" },
      "REPRESENTATION_NOT_NFC",
    );
    expectRejected(
      { ...validInput(), authorizedLookupRepresentation: "ABACTOR\ud800" },
      "REPRESENTATION_INVALID",
    );
    expectRejected(
      { ...validInput(), authorizedLookupRepresentation: "ăbactor" },
      "REPRESENTATION_EQUALS_SOURCE_FORM",
    );
  });

  test("does not provide generic diacritic folding and keeps Ë distinct from E", () => {
    const result = validateSourceProvidedLookupRepresentationV1({
      ...validInput(),
      sourceForm: "Ë",
      authorizedLookupRepresentation: "E",
      sourceFieldValue: "E",
      sourceLocator: "source-key-E",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.representation.sourceForm).toBe("Ë");
    expect(result.representation.authorizedLookupRepresentation).toBe("E");
    expect(result.representation.sourceForm).not.toBe("E");

    const decomposed = validateSourceProvidedLookupRepresentationV1({
      ...validInput(),
      sourceForm: "e\u0308r",
      authorizedLookupRepresentation: "ËR",
      sourceFieldValue: "ër",
      sourceLocator: "source-key-er",
    });
    expect(decomposed.ok).toBe(true);
    if (!decomposed.ok) return;
    expect(decomposed.representation.sourceForm).toBe("e\u0308r");
    expect(decomposed.representation.authorizedLookupRepresentation).toBe("ËR");
  });

  test("preserves canonical Y without adding Voice or semantic fields", () => {
    const result = validateSourceProvidedLookupRepresentationV1({
      ...validInput(),
      sourceForm: "Y",
      authorizedLookupRepresentation: "WHY",
      sourceFieldValue: "WHY",
      sourceLocator: "source-key-y",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.representation.sourceForm).toBe("Y");
    expect(result.representation.authorizedLookupRepresentation).toBe("WHY");
    expect(Object.keys(result.representation)).not.toContain("canonicalVoicePath");
  });

  test("fails closed for unresolved homograph suffixes such as abactus2", () => {
    expectRejected(
      {
        ...validInput(),
        sourceForm: "ăbactus",
        authorizedLookupRepresentation: "ABACTUS",
        sourceFieldValue: "abactus2",
        sourceLocator: 'TEI.2 entryFree id="n9" key="abactus2"',
        sourceDisambiguation: "UNRESOLVED",
      },
      "HOMOGRAPH_DISAMBIGUATION_UNRESOLVED",
    );
  });

  test("does not authorize target, meaning, correspondence, historical, or production claims", () => {
    for (const field of [
      "targetWord",
      "targetSense",
      "functionalCorrespondence",
      "historicalOrigin",
      "productionEvidence",
    ]) {
      expectRejected({ ...validInput(), [field]: "forbidden" }, "FORBIDDEN_SEMANTIC_FIELD_PRESENT");
    }
  });

  test("defines only exact source and exact authorized-representation match classes", () => {
    expect(SOURCE_PROVIDED_LOOKUP_REPRESENTATION_MATCH_CLASSES_V1).toEqual([
      "EXACT_SOURCE_FORM_MATCH",
      "EXACT_AUTHORIZED_REPRESENTATION_MATCH",
      "NO_MATCH",
    ]);
    expect(SOURCE_PROVIDED_LOOKUP_REPRESENTATION_MATCH_CLASSES_V1).not.toContain(
      "FUZZY_MATCH" as never,
    );
  });

  test("does not change the active nine-record witness dataset", () => {
    const datasetPath =
      "src/data/openInstrument/genericFunctionalWitnessSourceRecords.v1.json";
    const datasetText = readFileSync(datasetPath, "utf8");
    const dataset = JSON.parse(datasetText) as { records?: unknown };

    expect(Array.isArray(dataset.records)).toBe(true);
    expect(dataset.records).toHaveLength(9);
    expect(createHash("sha256").update(datasetText).digest("hex")).toBe(
      "5a6aaf7742033d62d183e960841dbb4a06c4950070b4f5b655da7a5a4671ddde",
    );
  });
});
