import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import manifest from "../scripts/openInstrument/sourceBatches/lewis-short-bounded-slice.v1.manifest.json";
import {
  lookupReviewedLewisShortExactV1,
  REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1,
} from "../scripts/openInstrument/reviewedLewisShortExactLookup.v1";

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

const validInput = (queryForm: string) => ({
  sourceTraditionId: "scaife.lewis-short.v0_1",
  queryForm,
  sourceSlice,
  manifest: { ...manifest, sourceSliceSha256 },
});

describe("Open Instrument bounded Lewis & Short exact lookup v1", () => {
  it("returns one exact source-attested entry with complete artifact provenance", () => {
    const result = lookupReviewedLewisShortExactV1(validInput("Ăărōn"));

    expect(result.status).toBe("FOUND");
    expect(result.sourceScope).toBe(REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1);
    expect(result.attestations).toHaveLength(1);
    expect(result.attestations[0]).toMatchObject({
      sourceTraditionId: "scaife.lewis-short.v0_1",
      sourceForm: "Ăărōn",
      sourceFormNormalization: "EXACT_PRESERVED",
      sourceHashOrArchiveHash: "c3474349ef9073bb436229cdf886eb77ed88d2fd",
      entrySelectionStatus: "NOT_APPLICABLE",
    });
    expect(result.attestations[0]?.entries[0]).toMatchObject({
      entryId: "n3",
      entryLocator: 'TEI.2 entryFree id="n3" key="Aaron"',
      senseSelectionStatus: "NOT_APPLICABLE",
    });
    expect(result.sourceArtifact).toMatchObject({
      sourceFileGitBlobSha: "c3474349ef9073bb436229cdf886eb77ed88d2fd",
      sourceSliceSha256,
      sourceLicense: "CC BY-SA 4.0",
      sourceScope: "EXISTING_BOUNDED_SLICE_ONLY",
    });
    expect(JSON.stringify(result)).not.toContain("targetWord");
    expect(JSON.stringify(result)).not.toContain("winnerClaim");
  });

  it("uses NFC only and preserves exact source spelling without case folding or trimming", () => {
    const decomposed = lookupReviewedLewisShortExactV1(
      validInput("Ăărōn".normalize("NFD")),
    );
    expect(decomposed.status).toBe("FOUND");
    expect(decomposed.normalizedQueryForm).toBe("Ăărōn");
    expect(decomposed.attestations[0]?.sourceForm).toBe("Ăărōn");

    const caseChanged = lookupReviewedLewisShortExactV1(validInput("ăBACTOR"));
    expect(caseChanged.status).toBe("SOURCE_UNAVAILABLE");
    expect(caseChanged.reasonCodes).toEqual([
      "BOUNDED_SLICE_COVERAGE_INCOMPLETE",
    ]);

    const trimmed = lookupReviewedLewisShortExactV1(validInput("ăbactor "));
    expect(trimmed.status).toBe("SOURCE_UNAVAILABLE");
    expect(trimmed.reasonCodes).toEqual(["QUERY_FORM_INVALID"]);
  });

  it("does not convert partial-slice absence into dictionary-level NOT_FOUND", () => {
    const result = lookupReviewedLewisShortExactV1(validInput("outside-slice"));

    expect(result.status).toBe("SOURCE_UNAVAILABLE");
    expect(result.status).not.toBe("NOT_FOUND");
    expect(result.reasonCodes).toEqual([
      "BOUNDED_SLICE_COVERAGE_INCOMPLETE",
    ]);
    expect(result.sourceArtifact?.sourceScope).toBe(
      REVIEWED_LEWIS_SHORT_EXACT_LOOKUP_SOURCE_SCOPE_V1,
    );
  });

  it("rejects a caller-controlled collision slice instead of returning fabricated provenance", () => {
    const ambiguousSyntheticSlice = sourceSlice.replace(
      "<orth lang=\"la\" extent=\"full\">ăbactor</orth>",
      "<orth lang=\"la\" extent=\"full\">Ăărōn</orth>",
    );
    const result = lookupReviewedLewisShortExactV1({
      ...validInput("Ăărōn"),
      sourceSlice: ambiguousSyntheticSlice,
      manifest: {
        ...manifest,
        sourceSliceSha256: createHash("sha256")
          .update(ambiguousSyntheticSlice, "utf8")
          .digest("hex"),
      },
    });

    expect(result.status).toBe("SOURCE_UNAVAILABLE");
    expect(result.attestations).toEqual([]);
    expect(result.sourceArtifact).toBeNull();
    expect(result.reasonCodes).toEqual(["SOURCE_SLICE_HASH_MISMATCH"]);
  });

  it.each([
    ["invalid tradition", { sourceTraditionId: "unknown.source.v1" }, "UNSUPPORTED_SOURCE_TRADITION"],
    ["missing artifact", { sourceSlice: null }, "ARTIFACT_MISSING"],
    ["tampered artifact hash", { manifest: { ...manifest, sourceSliceSha256: "0".repeat(64) } }, "SOURCE_SLICE_HASH_MISMATCH"],
    ["tampered manifest", { manifest: { ...manifest, sourceLicense: "UNKNOWN" } }, "MANIFEST_INVALID"],
  ])("fails closed for %s", (_label, override, reasonCode) => {
    const result = lookupReviewedLewisShortExactV1({
      ...validInput("ăbactor"),
      ...override,
    });

    expect(result.status).toBe("SOURCE_UNAVAILABLE");
    expect(result.reasonCodes).toContain(reasonCode);
    expect(result.attestations).toEqual([]);
  });

  it("rejects target-bearing input and does not invoke network access", () => {
    const fetchMock = jest.fn(() => {
      throw new Error("network access is forbidden in this lookup");
    });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = fetchMock as typeof globalThis.fetch;
    try {
      const result = lookupReviewedLewisShortExactV1({
        ...validInput("ăbactor"),
        targetWord: "forbidden-target-context",
      } as never);

      expect(result.status).toBe("SOURCE_UNAVAILABLE");
      expect(result.reasonCodes).toEqual(["LOOKUP_INPUT_INVALID"]);
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("is deterministic and does not mutate its source inputs", () => {
    const input = validInput("ăbactus");
    const before = JSON.stringify(input);
    const first = lookupReviewedLewisShortExactV1(input);
    const second = lookupReviewedLewisShortExactV1(input);

    expect(first).toEqual(second);
    expect(JSON.stringify(input)).toBe(before);
    expect(first.attestations[0]?.entries[0]).toMatchObject({
      entryId: "n9",
      entryLocator: 'TEI.2 entryFree id="n9" key="abactus2"',
      senses: [{ senseId: "n9.0" }],
    });
  });
});
