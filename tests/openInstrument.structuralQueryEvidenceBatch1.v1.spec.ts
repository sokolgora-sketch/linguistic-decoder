import rawBatch from "../src/data/openInstrument/genericFunctionalWitnessSourceRecords.batch1.review.v1.json";
import {
  parseGenericFunctionalWitnessSourceDatasetV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessSourceAcquisition.v1";

describe("Open Instrument structural query evidence Batch 1 review artifact", () => {
  it("uses the existing target-blind source dataset contract for exact matches", () => {
    const parsed = parseGenericFunctionalWitnessSourceDatasetV1(rawBatch);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.dataset.records.map((record) => record.queryForm)).toEqual([
      "AS",
      "IN",
      "IS",
    ]);
    expect(parsed.dataset.records.map((record) => record.sourceForm)).toEqual([
      "as",
      "in",
      "is",
    ]);
    expect(parsed.dataset.records.every((record) =>
      record.sourceStatus === "research_candidate" &&
      record.sourceFormNormalization === "EXACT_PRESERVED" &&
      record.queryRelation === "authorized_transformation",
    )).toBe(true);
  });

  it("pins AS, IN, and IS to exact upstream Lewis & Short entries without admission", () => {
    const parsed = parseGenericFunctionalWitnessSourceDatasetV1(rawBatch);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.dataset.records.map((record) => ({
      queryForm: record.queryForm,
      sourceForm: record.sourceForm,
      entryLocator: record.entryLocator,
      sourceHashOrArchiveHash: record.sourceHashOrArchiveHash,
      sourceStatus: record.sourceStatus,
    }))).toEqual([
      {
        queryForm: "AS",
        sourceForm: "as",
        entryLocator: 'TEI.2 entryFree id="n3855" key="as"',
        sourceHashOrArchiveHash: "c3474349ef9073bb436229cdf886eb77ed88d2fd",
        sourceStatus: "research_candidate",
      },
      {
        queryForm: "IN",
        sourceForm: "in",
        entryLocator: 'TEI.2 entryFree id="n22111" key="in1"',
        sourceHashOrArchiveHash: "c3474349ef9073bb436229cdf886eb77ed88d2fd",
        sourceStatus: "research_candidate",
      },
      {
        queryForm: "IS",
        sourceForm: "is",
        entryLocator: 'TEI.2 entryFree id="n25029" key="is"',
        sourceHashOrArchiveHash: "c3474349ef9073bb436229cdf886eb77ed88d2fd",
        sourceStatus: "research_candidate",
      },
    ]);
  });

  it("preserves the witness-only and provenance firewall", () => {
    const serialized = JSON.stringify(rawBatch);

    expect(serialized).not.toContain("targetWord");
    expect(serialized).not.toContain("targetSense");
    expect(serialized).not.toContain("functionalHypothesis");
    expect(serialized).not.toContain("semanticBridge");
    expect(serialized).not.toContain("historicalOriginClaim");
    expect(serialized).not.toContain("winnerClaim");

    const first = parseGenericFunctionalWitnessSourceDatasetV1(rawBatch);
    const second = parseGenericFunctionalWitnessSourceDatasetV1(rawBatch);

    expect(first).toEqual(second);
    expect(first.ok && Object.isFrozen(first.dataset)).toBe(true);
  });
});
