import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import manifest from "../scripts/openInstrument/sourceBatches/lewis-short-bounded-slice.v1.manifest.json";
import {
  classifyLewisShortSenseStructureV1,
  importReviewedLewisShortBatchV1,
  REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1,
  REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1,
} from "../scripts/openInstrument/reviewedLewisShortBatchImport.v1";
import { parseGenericFunctionalWitnessSourceDatasetV1 } from "../src/shared/openInstrument/genericFunctionalWitnessSourceAcquisition.v1";

const sourceSlice = readFileSync(
  join(
    __dirname,
    "../scripts/openInstrument/sourceBatches/lewis-short-bounded-slice.v1.xml",
  ),
  "utf8",
);

const sourceSliceSha256 = createHash("sha256")
  .update(sourceSlice, "utf8")
  .digest("hex");

describe("Open Instrument reviewed Lewis & Short batch importer v1", () => {
  it("imports a pinned target-blind batch into the existing Lane-2 contract", () => {
    const result = importReviewedLewisShortBatchV1(sourceSlice, {
      ...manifest,
      sourceSliceSha256,
    });

    expect(result.status).toBe("IMPORTED");
    expect(result.acceptedRecords).toHaveLength(3);
    expect(result.rejections).toEqual([]);
    expect(result.acceptedRecords.map((record) => record.sourceForm)).toEqual([
      "Ăărōn",
      "ăbactor",
      "ăbactus",
    ]);
    expect(result.acceptedRecords.map((record) => record.lookupForm)).toEqual([
      "ĂĂRŌN",
      "ĂBACTOR",
      "ĂBACTUS",
    ]);
    expect(result.acceptedRecords.every((record) => record.languageVariety === null)).toBe(
      true,
    );
    expect(
      result.acceptedRecords.every(
        (record) =>
          record.sourceHashOrArchiveHash ===
          REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1,
      ),
    ).toBe(true);
    expect(result.outputJson).not.toContain("targetWord");
    expect(result.outputJson).not.toContain("targetSenseId");
    expect(result.outputJson).not.toContain("semanticBridge");
    expect(result.outputJson).not.toContain("winnerClaim");
    expect(result.outputJson).not.toContain("historicalOriginClaim");

    const parsed = parseGenericFunctionalWitnessSourceDatasetV1(result.dataset);
    expect(parsed.ok).toBe(true);
  });

  it("is byte-repeatable and preserves the pinned source identity", () => {
    const input = { ...manifest, sourceSliceSha256 };
    const first = importReviewedLewisShortBatchV1(sourceSlice, input);
    const second = importReviewedLewisShortBatchV1(sourceSlice, input);

    expect(first).toEqual(second);
    expect(first.inputSha256).toBe(sourceSliceSha256);
    expect(first.outputSha256).toMatch(/^[0-9a-f]{64}$/u);
    expect(first.acceptedRecords[0]).toMatchObject({
      sourceTraditionId: "scaife.lewis-short.v0_1",
      sourceHashOrArchiveHash: REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1,
    });
    expect(first.acceptedRecords[0]?.citation).toMatchObject({
      provenanceGroupId: "scaife.lewis-short.v0_1",
      sourceHashOrArchiveHash: REVIEWED_LEWIS_SHORT_SOURCE_FILE_GIT_BLOB_SHA_V1,
    });
    expect(manifest.sourceRepositoryCommit).toBe(
      REVIEWED_LEWIS_SHORT_SOURCE_REPOSITORY_COMMIT_V1,
    );
  });

  it.each([
    ["missing source revision", { sourceRepositoryCommit: "" }, "MANIFEST_INVALID"],
    ["missing attribution", { attribution: "" }, "MANIFEST_INVALID"],
    ["wrong source slice hash", { sourceSliceSha256: "0".repeat(64) }, "SOURCE_SLICE_HASH_MISMATCH"],
  ])("fails closed for %s", (_label, override, reasonCode) => {
    const result = importReviewedLewisShortBatchV1(sourceSlice, {
      ...manifest,
      sourceSliceSha256,
      ...override,
    } as typeof manifest);

    expect(result.status).toBe("REJECTED");
    expect(result.rejections.flatMap((rejection) => rejection.reasonCodes)).toContain(
      reasonCode,
    );
  });

  it("rejects malformed, ambiguous, and unsupported source entries", () => {
    const ambiguous = sourceSlice.replace(
      "</sense></entryFree>",
      '</sense><sense level="1" n="II">second source sense</sense></entryFree>',
    );
    const ambiguousResult = importReviewedLewisShortBatchV1(ambiguous, {
      ...manifest,
      sourceSliceSha256: createHash("sha256").update(ambiguous).digest("hex"),
    });
    expect(ambiguousResult.rejections).toEqual([
      { entryId: "n3", reasonCodes: ["AMBIGUOUS_SENSE_STRUCTURE"] },
    ]);

    const malformed = sourceSlice.replace("</entryFree>", "</entryFree");
    const malformedResult = importReviewedLewisShortBatchV1(malformed, {
      ...manifest,
      sourceSliceSha256: createHash("sha256").update(malformed).digest("hex"),
    });
    expect(malformedResult.rejections).toEqual([
      { entryId: null, reasonCodes: ["SOURCE_XML_MALFORMED"] },
    ]);

    const unsupportedForm = sourceSlice.replace("Ăărōn", "A&amp;ron");
    const unsupportedResult = importReviewedLewisShortBatchV1(unsupportedForm, {
      ...manifest,
      sourceSliceSha256: createHash("sha256").update(unsupportedForm).digest("hex"),
    });
    expect(unsupportedResult.rejections).toEqual([
      { entryId: "n3", reasonCodes: ["UNSUPPORTED_SOURCE_FORM_ENCODING"] },
    ]);
  });

  it("rejects editorial-only sense markers while preserving substantive controls", () => {
    expect(
      classifyLewisShortSenseStructureV1('<hi rend="ital">init.</hi>'),
    ).toBe("LEXICAL_DEFINITION_MISSING");
    expect(
      classifyLewisShortSenseStructureV1('<hi rend="ital">fin.</hi>'),
    ).toBe("LEXICAL_DEFINITION_MISSING");
    expect(
      classifyLewisShortSenseStructureV1(
        '<hi rend="ital">P. a. fin.</hi>',
      ),
    ).toBe("LEXICAL_DEFINITION_MISSING");

    expect(
      classifyLewisShortSenseStructureV1(
        '<hi rend="ital">well! well done! bravo!</hi> an exclamation of joy or approbation',
      ),
    ).toBe("LEXICAL_GLOSS_PRESENT");
    expect(
      classifyLewisShortSenseStructureV1('<hi rend="ital">oh! O! ah!</hi>'),
    ).toBe("LEXICAL_GLOSS_PRESENT");

    const editorialOnly = sourceSlice.replace(
      /<sense level="1" n="I" id="n3\.0">[\s\S]*?<\/sense>/u,
      '<sense level="1" n="I" id="n3.0"><hi rend="ital">init.</hi></sense>',
    );
    const result = importReviewedLewisShortBatchV1(editorialOnly, {
      ...manifest,
      sourceSliceSha256: createHash("sha256")
        .update(editorialOnly, "utf8")
        .digest("hex"),
    });
    expect(result.status).toBe("REJECTED");
    expect(result.rejections).toEqual([
      { entryId: "n3", reasonCodes: ["LEXICAL_DEFINITION_MISSING"] },
    ]);
  });

  it("rejects malformed markup and keeps encoded markup inert", () => {
    const incompleteTag = sourceSlice.replace(
      "<hi rend=\"ital\">Aaron</hi>",
      "<hi rend=\"ital\">Aaron</hi><script",
    );
    const incompleteTagResult = importReviewedLewisShortBatchV1(
      incompleteTag,
      {
        ...manifest,
        sourceSliceSha256: createHash("sha256").update(incompleteTag).digest("hex"),
      },
    );
    expect(incompleteTagResult.status).toBe("REJECTED");
    expect(incompleteTagResult.rejections).toEqual([
      { entryId: null, reasonCodes: ["SOURCE_XML_MALFORMED"] },
    ]);

    const encodedMarkup = sourceSlice.replace(
      "<hi rend=\"ital\">Aaron</hi>",
      "<hi rend=\"ital\">A&amp;lt;script&amp;gt;</hi>",
    );
    const encodedMarkupResult = importReviewedLewisShortBatchV1(
      encodedMarkup,
      {
        ...manifest,
        sourceSliceSha256: createHash("sha256").update(encodedMarkup).digest("hex"),
      },
    );
    expect(encodedMarkupResult.status).toBe("IMPORTED");
    expect(encodedMarkupResult.acceptedRecords[0]?.gloss).toContain(
      "A&lt;script&gt;",
    );
    expect(encodedMarkupResult.acceptedRecords[0]?.gloss).not.toContain(
      "<script>",
    );

    const nestedSense = sourceSlice.replace(
      '<hi rend="ital">Aaron</hi>',
      '<sense level="2"><hi rend="ital">nested</hi></sense>',
    );
    const nestedSenseResult = importReviewedLewisShortBatchV1(nestedSense, {
      ...manifest,
      sourceSliceSha256: createHash("sha256").update(nestedSense).digest("hex"),
    });
    expect(nestedSenseResult.status).toBe("REJECTED");
    expect(nestedSenseResult.rejections).toEqual([
      { entryId: "n3", reasonCodes: ["AMBIGUOUS_SENSE_STRUCTURE"] },
    ]);
  });

  it("rejects duplicate or unexpected source identities", () => {
    const duplicate = sourceSlice.replace(
      '</entryFree>\n  <entryFree n="2"',
      '</entryFree>\n  <entryFree key="duplicate" type="main" id="n3"><orth lang="la" extent="full">dup</orth><sense level="1" n="I">duplicate</sense></entryFree>\n  <entryFree n="2"',
    );
    const duplicateResult = importReviewedLewisShortBatchV1(duplicate, {
      ...manifest,
      sourceSliceSha256: createHash("sha256").update(duplicate).digest("hex"),
    });
    expect(duplicateResult.rejections).toEqual([
      { entryId: null, reasonCodes: ["SOURCE_ENTRY_ID_DUPLICATE"] },
    ]);

    const unexpected = sourceSlice.replace(
      "</sourceSlice>",
      '<entryFree key="unexpected" type="main" id="n10"><orth lang="la" extent="full">extra</orth><sense level="1" n="I">extra</sense></entryFree>\n</sourceSlice>',
    );
    const unexpectedResult = importReviewedLewisShortBatchV1(unexpected, {
      ...manifest,
      sourceSliceSha256: createHash("sha256").update(unexpected).digest("hex"),
    });
    expect(unexpectedResult.rejections).toEqual([
      { entryId: "n10", reasonCodes: ["SOURCE_ENTRY_ID_UNEXPECTED"] },
    ]);
  });
});
