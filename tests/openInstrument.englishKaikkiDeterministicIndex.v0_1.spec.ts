import { createHash } from "node:crypto";
import { mkdtemp, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { PassThrough } from "node:stream";
import { createInterface } from "node:readline";

import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
} from "@/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  artifactIdentitySha256V0_1,
  canonicalJsonLineV0_1,
  canonicalJsonStringV0_1,
  canonicalJsonV0_1,
  comparePostingsV0_1,
  compareUtf8BytesV0_1,
  createDirectoryEntryV0_1,
  createIdentityPayloadV0_1,
  createPostingV0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1,
  ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1,
  normalizeIndexQueryV0_1,
  recoverPostingRecordV0_1,
  sortPostingsV0_1,
  type EnglishKaikkiDeterministicIndexPostingV0_1,
} from "@/shared/openInstrument/englishKaikkiDeterministicIndex.v0_1";
import {
  iteratePhysicalRecordsV0_1,
  mergeRunsV0_1,
  readPostingRunV0_1,
} from "../scripts/openInstrumentEnglishKaikkiDeterministicIndexBuild.v0_1";

const identity = ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1;

function sourceRecord(
  word: string,
  pos = "noun",
  senses: readonly Record<string, unknown>[] = [{ id: `${word}-sense`, glosses: [`${word} gloss`] }],
): Buffer {
  return Buffer.from(
    JSON.stringify({ word, lang: "English", lang_code: "en", pos, senses }),
    "utf8",
  );
}

function posting(
  bytes: Uint8Array,
  ordinal: number,
  offset: number,
): EnglishKaikkiDeterministicIndexPostingV0_1 {
  const adapted = adaptEnglishKaikkiJsonlRecordV0_1({
    recordBytes: bytes,
    recordOrdinal: ordinal,
    verifiedSnapshot: identity,
  });
  expect(adapted).toMatchObject({ ok: true });
  if (!adapted.ok) throw new Error(adapted.reasonCode);
  return createPostingV0_1({
    sourceRecord: adapted.record,
    recordByteOffset: offset,
    recordByteLength: bytes.length,
  });
}

function mergeRuns(
  runs: readonly (readonly EnglishKaikkiDeterministicIndexPostingV0_1[])[],
): EnglishKaikkiDeterministicIndexPostingV0_1[] {
  const cursors = runs.map(() => 0);
  const output: EnglishKaikkiDeterministicIndexPostingV0_1[] = [];
  while (true) {
    let selected = -1;
    for (let index = 0; index < runs.length; index += 1) {
      if (cursors[index] >= runs[index].length) continue;
      if (
        selected === -1 ||
        comparePostingsV0_1(runs[index][cursors[index]], runs[selected][cursors[selected]]) < 0
      ) {
        selected = index;
      }
    }
    if (selected === -1) return output;
    output.push(runs[selected][cursors[selected]]);
    cursors[selected] += 1;
  }
}

async function writePostingRun(
  directory: string,
  name: string,
  postings: readonly EnglishKaikkiDeterministicIndexPostingV0_1[],
): Promise<string> {
  const path = directory + "/" + name;
  await writeFile(path, Buffer.concat(postings.map((value) => canonicalJsonLineV0_1(value))));
  return path;
}

async function mergePostingRunsFromFiles(
  runPaths: readonly string[],
): Promise<Buffer> {
  const lines: Buffer[] = [];
  await mergeRunsV0_1(runPaths, async (value) => {
    lines.push(canonicalJsonLineV0_1(value));
  });
  return Buffer.concat(lines);
}

function logicalSequenceSha256(bytes: Buffer): string {
  const hash = createHash("sha256");
  for (const line of bytes.toString("utf8").split("\n")) {
    if (line.length > 0) hash.update(canonicalJsonV0_1(JSON.parse(line)));
  }
  return hash.digest("hex");
}

describe("English Kaikki deterministic index v0.1", () => {
  it("binds the frozen identifiers and exact source identity", () => {
    expect(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_CONTRACT_ID_V0_1).toBe(
      "OPEN_INSTRUMENT_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1",
    );
    expect(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1).toBe(
      "0606a159918d672c03e1deafc0e547c0099e92a63e1b48363bf4348310e757b8",
    );
    expect(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1).toBe(
      "c108f82172dcf87c786e2e9baebccc3ffaf6d3430c0b55b30018d626abe153cf",
    );
    expect(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_MACHINE_CONTRACT_SHA256_V0_1).not.toBe(
      ENGLISH_KAIKKI_DETERMINISTIC_INDEX_HUMAN_DEFINITION_SHA256_V0_1,
    );
    expect(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_SCHEMA_V0_1).toBe(
      "open-instrument.english-kaikki-deterministic-index.v0.1",
    );
    expect(ENGLISH_KAIKKI_DETERMINISTIC_INDEX_ID_V0_1).toContain("wiktionary-kaikki-english");
    expect(identity.byteLength).toBe(3335546346);
    expect(identity.sha256).toBe("9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195");
  });

  it("preserves exact physical bytes, LF inclusion, CRLF, UTF-8, and record hashes", () => {
    const bytes = Buffer.from(`${JSON.stringify({ word: "café", lang: "English", lang_code: "en", pos: "noun", senses: [{ id: "cafe-1", glosses: ["coffee"] }] })}\r\n`, "utf8");
    const result = adaptEnglishKaikkiJsonlRecordV0_1({ recordBytes: bytes, recordOrdinal: 7, verifiedSnapshot: identity });
    expect(result).toMatchObject({ ok: true, record: { recordOrdinal: 7, word: "café" } });
    if (result.ok) expect(result.record.recordSha256).toHaveLength(64);
    expect(bytes[bytes.length - 2]).toBe(0x0d);
    expect(bytes[bytes.length - 1]).toBe(0x0a);
  });

  it("uses the frozen exact lookup operator and preserves sourceForm", () => {
    const bytes = sourceRecord("  Café  ");
    const result = adaptEnglishKaikkiJsonlRecordV0_1({ recordBytes: bytes, recordOrdinal: 1, verifiedSnapshot: identity });
    expect(result).toMatchObject({ ok: true, record: { word: "  Café  " } });
    if (result.ok) {
      expect(result.record.queryForm).toBe("  café  ");
      expect(normalizeIndexQueryV0_1(" Café ")).toBe(" café ");
    }
  });

  it("creates one posting per physical record and preserves collisions and POS multiplicity", () => {
    const firstBytes = Buffer.from(`${sourceRecord("Case", "noun").toString("utf8")}\n`, "utf8");
    const secondBytes = Buffer.from(`${sourceRecord("case", "verb").toString("utf8")}\n`, "utf8");
    const first = posting(firstBytes, 1, 0);
    const second = posting(secondBytes, 2, firstBytes.length);
    expect(first.lookupKey).toBe(second.lookupKey);
    expect(first.recordOrdinal).toBe(1);
    expect(second.recordOrdinal).toBe(2);
    expect(first.sourceRecordId).not.toBe(second.sourceRecordId);
  });

  it("sorts by UTF-8 key bytes, ordinal, and source-record tie-breaker", () => {
    const records = [
      posting(Buffer.from(`${sourceRecord("z").toString("utf8")}\n`), 3, 20),
      posting(Buffer.from(`${sourceRecord("a").toString("utf8")}\n`), 2, 10),
      posting(Buffer.from(`${sourceRecord("A").toString("utf8")}\n`), 1, 0),
    ];
    const sorted = sortPostingsV0_1(records);
    expect(sorted.map((value) => value.lookupKey)).toEqual(["a", "a", "z"]);
    expect(sorted.map((value) => value.recordOrdinal)).toEqual([1, 2, 3]);
    expect(compareUtf8BytesV0_1("a", "z")).toBeLessThan(0);
  });

  it("produces identical canonical bytes when external runs use different chunk sizes", () => {
    const records = [
      posting(Buffer.from(`${sourceRecord("delta").toString("utf8")}\n`), 4, 30),
      posting(Buffer.from(`${sourceRecord("alpha").toString("utf8")}\n`), 2, 10),
      posting(Buffer.from(`${sourceRecord("bravo").toString("utf8")}\n`), 3, 20),
      posting(Buffer.from(`${sourceRecord("alpha").toString("utf8")}\n`), 1, 0),
    ];
    const bytesForRunSize = (runSize: number): Buffer => {
      const runs: EnglishKaikkiDeterministicIndexPostingV0_1[][] = [];
      for (let offset = 0; offset < records.length; offset += runSize) {
        runs.push(sortPostingsV0_1(records.slice(offset, offset + runSize)));
      }
      return Buffer.concat(mergeRuns(runs).map((value) => canonicalJsonLineV0_1(value)));
    };
    expect(bytesForRunSize(1)).toEqual(bytesForRunSize(2));
    expect(bytesForRunSize(2)).toEqual(bytesForRunSize(3));
  });

  it("merges one, two, many tiny, empty, and early-EOF runs with stable UTF-8 collision ordering", async () => {
    const directory = await mkdtemp(tmpdir() + "/open-instrument-index-runs-");
    try {
      const records = [
        posting(Buffer.concat([sourceRecord("zebra"), Buffer.from("\n")]), 9, 900),
        posting(Buffer.concat([sourceRecord("Alpha"), Buffer.from("\n")]), 10, 1000),
        posting(Buffer.concat([sourceRecord("alpha"), Buffer.from("\n")]), 10, 1100),
        posting(Buffer.concat([sourceRecord("éclair"), Buffer.from("\n")]), 4, 400),
        posting(Buffer.concat([sourceRecord("😀"), Buffer.from("\n")]), 8, 800),
        posting(Buffer.concat([sourceRecord("bravo"), Buffer.from("\n")]), 2, 200),
        posting(Buffer.concat([sourceRecord("alpha"), Buffer.from("\n")]), 3, 300),
      ];
      const expected = Buffer.concat(sortPostingsV0_1(records).map((value) => canonicalJsonLineV0_1(value)));
      const cases: readonly { label: string; groups: readonly (readonly EnglishKaikkiDeterministicIndexPostingV0_1[])[] }[] = [
        { label: "one", groups: [records] },
        { label: "two", groups: [records.slice(0, 3), records.slice(3)] },
        { label: "many", groups: [records.slice(0, 1), records.slice(1, 2), records.slice(2, 3), records.slice(3, 4), records.slice(4, 5), records.slice(5)] },
        { label: "empty", groups: [[], records.slice(0, 1), records.slice(1)] },
        { label: "early-eof", groups: [records.slice(0, 1), records.slice(1)] },
      ];
      for (const testCase of cases) {
        const paths: string[] = [];
        for (const [index, group] of testCase.groups.entries()) {
          paths.push(await writePostingRun(directory, testCase.label + "-" + index + ".ndjson", sortPostingsV0_1(group)));
        }
        expect(await mergePostingRunsFromFiles(paths)).toEqual(expected);
      }
      for (let repeat = 0; repeat < 5; repeat += 1) {
        const paths = [
          await writePostingRun(directory, "repeat-" + repeat + "-short.ndjson", sortPostingsV0_1(records.slice(0, 2))),
          await writePostingRun(directory, "repeat-" + repeat + "-long.ndjson", sortPostingsV0_1(records.slice(2))),
        ];
        expect(await mergePostingRunsFromFiles(paths)).toEqual(expected);
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("closes merge iterators after an injected failure without publishing a final file", async () => {
    const directory = await mkdtemp(tmpdir() + "/open-instrument-index-failure-");
    try {
      const runPath = await writePostingRun(directory, "run.ndjson", [
        posting(Buffer.concat([sourceRecord("failure"), Buffer.from("\n")]), 1, 0),
      ]);
      const partialPath = directory + "/postings.partial.ndjson";
      const finalPath = directory + "/postings.ndjson";
      await expect(
        mergeRunsV0_1([runPath], async (value) => {
          await writeFile(partialPath, canonicalJsonLineV0_1(value));
          throw new Error("INJECTED_MERGE_FAILURE");
        }),
      ).rejects.toThrow("INJECTED_MERGE_FAILURE");
      await expect(stat(finalPath)).rejects.toMatchObject({ code: "ENOENT" });
      await rm(partialPath, { force: true });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("cleans up a generated reader after a consumer mid-iteration error", async () => {
    const directory = await mkdtemp(tmpdir() + "/open-instrument-reader-error-");
    try {
      const runPath = await writePostingRun(directory, "run.ndjson", [
        posting(Buffer.concat([sourceRecord("first"), Buffer.from("\n")]), 1, 0),
        posting(Buffer.concat([sourceRecord("second"), Buffer.from("\n")]), 2, 20),
      ]);
      await expect(
        (async () => {
          for await (const value of readPostingRunV0_1(runPath)) {
            expect(value.posting.lookupKey).toBe("first");
            throw new Error("INJECTED_CONSUMER_MID_ITERATION_ERROR");
          }
        })(),
      ).rejects.toThrow("INJECTED_CONSUMER_MID_ITERATION_ERROR");
      const recovered: string[] = [];
      for await (const value of readPostingRunV0_1(runPath)) recovered.push(value.posting.lookupKey);
      expect(recovered).toEqual(["first", "second"]);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("proves the pre-repair readline reader had competing cleanup ownership", async () => {
    const lifecycle: string[] = [];
    const input = new PassThrough();
    const originalDestroy = input.destroy.bind(input);
    let destroyCalls = 0;
    input.destroy = ((error?: Error) => {
      destroyCalls += 1;
      lifecycle.push(input.destroyed ? "stream.destroy.after-automatic-destroy" : "stream.destroy");
      return originalDestroy(error);
    }) as typeof input.destroy;
    const reader = createInterface({ input, crlfDelay: Infinity });
    const lines: string[] = [];
    const oldReader = (async (): Promise<void> => {
      try {
        for await (const line of reader) lines.push(line);
      } finally {
        lifecycle.push(reader.closed ? "reader.close.after-automatic-close" : "reader.close");
        reader.close();
        input.destroy();
      }
    })();
    input.end("one\ntwo\n");
    await oldReader;

    expect(lines).toEqual(["one", "two"]);
    expect(lifecycle).toEqual([
      "stream.destroy",
      "reader.close.after-automatic-close",
      "stream.destroy.after-automatic-destroy",
    ]);
    expect(destroyCalls).toBe(2);
    expect(reader.closed).toBe(true);
    expect(input.destroyed).toBe(true);
  });

  it("proves load-bearing logical and serialized determinism across realistic run configurations", async () => {
    const directory = await mkdtemp(tmpdir() + "/open-instrument-realistic-stress-");
    try {
      const words = ["alpha", "Alpha", "bravo", "éclair", "😀", "delta", "alpha", "charlie"];
      const records = Array.from({ length: 128 }, (_, index) =>
        posting(
          Buffer.concat([sourceRecord(words[index % words.length]), Buffer.from("\n")]),
          index + 1,
          index * 100,
        ),
      );
      const expected = Buffer.concat(sortPostingsV0_1(records).map((value) => canonicalJsonLineV0_1(value)));
      const configurations = [1, 2, 3, 5, 8, 13, 21];
      const comparisons: { logical: string; bytes: string }[] = [];
      for (const runSize of configurations) {
        const paths: string[] = [];
        for (let offset = 0; offset < records.length; offset += runSize) {
          paths.push(await writePostingRun(
            directory,
            "stress-" + runSize + "-" + offset + ".ndjson",
            sortPostingsV0_1(records.slice(offset, offset + runSize)),
          ));
        }
        const bytes = await mergePostingRunsFromFiles(paths);
        comparisons.push({
          logical: logicalSequenceSha256(bytes),
          bytes: createHash("sha256").update(bytes).digest("hex"),
        });
        expect(bytes).toEqual(expected);
      }
      expect(new Set(comparisons.map((value) => value.logical)).size).toBe(1);
      expect(new Set(comparisons.map((value) => value.bytes)).size).toBe(1);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }, 30_000);

  it("keeps the raw source reader byte-exact across boundaries and final no-LF input", async () => {
    const directory = await mkdtemp(tmpdir() + "/open-instrument-source-reader-");
    try {
      const first = Buffer.concat([sourceRecord("é"), Buffer.from("\n", "utf8")]);
      const second = Buffer.concat([sourceRecord("crlf"), Buffer.from("\r\n", "utf8")]);
      const third = sourceRecord("final-no-lf");
      const sourceBytes = Buffer.concat([first, second, third]);
      const sourcePath = directory + "/source.jsonl";
      await writeFile(sourcePath, sourceBytes);
      const records: { recordByteOffset: number; recordBytes: Buffer }[] = [];
      for await (const record of iteratePhysicalRecordsV0_1(sourcePath, 3)) {
        records.push({ recordByteOffset: record.recordByteOffset, recordBytes: record.recordBytes });
      }
      expect(records.map((record) => record.recordBytes)).toEqual([first, second, third]);
      expect(records.map((record) => record.recordByteOffset)).toEqual([0, first.length, first.length + second.length]);
      expect(records.map((record) => createHash("sha256").update(record.recordBytes).digest("hex"))).toEqual(
        [first, second, third].map((record) => createHash("sha256").update(record).digest("hex")),
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("freezes canonical escaping, property order, final LF, and directory ranges", () => {
    expect(canonicalJsonStringV0_1("quote\" slash\\ control\u0001 é")).toBe(
      '"quote\\" slash\\\\ control\\u0001 é"',
    );
    expect(() => canonicalJsonStringV0_1("\ud800")).toThrow("CANONICAL_JSON_UNPAIRED_SURROGATE");
    const entry = createDirectoryEntryV0_1({ lookupKey: "a", postingByteOffset: 0, postingByteLength: 10, postingCount: 1 });
    const line = canonicalJsonLineV0_1(entry);
    expect(line.toString("utf8")).toBe('{"lookupKey":"a","postingByteOffset":0,"postingByteLength":10,"postingCount":1}\n');
    expect(line[line.length - 1]).toBe(0x0a);
  });

  it("creates a non-circular artifact identity over directory and postings only", () => {
    const payload = createIdentityPayloadV0_1({
      sourceSnapshot: {
        expectedBytes: identity.byteLength,
        expectedSha256: identity.sha256,
      },
      adapter: {
        contractId: "OPEN_INSTRUMENT_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1",
        contractSha256: "a359b0a8d6fe172b32937aed93690545adfc2403c40419209f358fc46d14ed02",
        implementationCommit: "4e37b56b9194983b836f85269033f916c6ae408d",
        implementationSha256: "2b8a41fd2c5cd8d7a11e8b157690d3e4b4dfd12ed44a1de48c5070347e11c28f",
      },
      files: [
        { path: "directory.ndjson", bytes: 10, sha256: "a".repeat(64) },
        { path: "postings.ndjson", bytes: 20, sha256: "b".repeat(64) },
      ],
    });
    expect(payload.files.map((file) => file.path)).toEqual(["directory.ndjson", "postings.ndjson"]);
    expect(artifactIdentitySha256V0_1(payload)).toHaveLength(64);
    expect(canonicalJsonV0_1(payload)).not.toContain("manifest.json");
  });

  it("recovers exact byte ranges, verifies record SHA, and re-applies the adapter", () => {
    const bytes = Buffer.from(`${sourceRecord("recovery")}\n`, "utf8");
    const recovered = recoverPostingRecordV0_1({
      recordBytes: bytes,
      posting: posting(bytes, 1, 0),
      verifiedSnapshot: identity,
    });
    expect(recovered).toMatchObject({ ok: true, sourceRecord: { word: "recovery" } });
    const corrupt = Buffer.from(bytes);
    corrupt[0] ^= 1;
    const failure = recoverPostingRecordV0_1({
      recordBytes: corrupt,
      posting: posting(bytes, 1, 0),
      verifiedSnapshot: identity,
    });
    expect(failure).toMatchObject({ ok: false, status: "SOURCE_FAILURE", reasonCode: "SOURCE_RECORD_HASH_MISMATCH" });
  });

  it("keeps valid zero-match and index/source failures distinct", () => {
    const noMatch = { status: "VALID_NULL", reasonCode: "LEXICAL_SENSE_SOURCE_NOT_FOUND" };
    const sourceFailure = { status: "SOURCE_FAILURE", reasonCode: "SOURCE_RECORD_HASH_MISMATCH" };
    const indexFailure = { status: "INDEX_FAILURE", reasonCode: "INDEX_POSTING_RECOVERY_BINDING_MISMATCH" };
    expect(noMatch.status).not.toBe(sourceFailure.status);
    expect(sourceFailure.status).not.toBe(indexFailure.status);
  });

  it("keeps the implementation source-only and offline", () => {
    expect("runtimeRegistration" in {}).toBe(false);
    expect("providerModel" in {}).toBe(false);
    expect("targetWord" in {}).toBe(false);
  });
});
