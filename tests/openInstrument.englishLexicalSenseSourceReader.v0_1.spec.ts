import {
  parseEnglishLexicalSenseSourceRecordV0_1,
  readEnglishLexicalSenseSourceV0_1,
} from "@/shared/openInstrument/englishLexicalSenseSourceReader.v0_1";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const directory = mkdtempSync(join(tmpdir(), "open-instrument-english-reader-"));

function writeFixture(name: string, value: string): string {
  const path = join(directory, name);
  writeFileSync(path, value, "utf8");
  return path;
}

function record(
  word: string,
  senses: readonly Record<string, unknown>[] = [{ id: `${word}-1`, glosses: [`${word} gloss`] }],
): string {
  return JSON.stringify({
    word,
    lang: "English",
    lang_code: "en",
    pos: "noun",
    senses,
    forms: [{ form: "excluded" }],
  });
}

describe("English Kaikki hash-bound source reader v0.1", () => {
  afterAll(() => rmSync(directory, { recursive: true, force: true }));

  it("fails closed before record use when the artifact identity is not frozen", async () => {
    const path = writeFixture("identity-mismatch.jsonl", record("identity"));
    const seen: unknown[] = [];
    const result = await readEnglishLexicalSenseSourceV0_1({
      path,
      onRecord: (sourceRecord) => seen.push(sourceRecord),
      chunkSize: 2,
    });

    expect(result).toMatchObject({ ok: false, reasonCode: "SOURCE_IDENTITY_MISMATCH" });
    expect(seen).toEqual([]);
  });

  it("parses source records without treating raw LF framing as semantic text", () => {
    const first = parseEnglishLexicalSenseSourceRecordV0_1(
      Buffer.from(record("first"), "utf8"),
    );
    const second = parseEnglishLexicalSenseSourceRecordV0_1(
      Buffer.from(record("second", [
        { id: "second-1", glosses: ["one"] },
        { id: "second-2", glosses: ["two"], tags: ["tag"] },
      ])),
    );
    expect(first).toMatchObject({ ok: true, record: { word: "first" } });
    expect(second).toMatchObject({ ok: true, record: { word: "second" } });
    if (second.ok) {
      expect(second.record.senses.map((sense) => sense.id)).toEqual([
        "second-1",
        "second-2",
      ]);
    }
  });

  it("projects only admitted source fields and preserves sense/example order", () => {
    const path = writeFixture("projection.jsonl", record("project", [
      {
        id: "project-1",
        glosses: ["A gloss"],
        tags: ["tag"],
        raw_tags: ["raw"],
        examples: [
          { text: "first", type: "example", ref: "citation" },
          { text: "second", bold_text_offsets: [[0, 2]], extra: true },
          { type: "quotation", ref: "citation-only" },
        ],
      },
      { id: "project-2", raw_glosses: ["raw gloss"] },
    ]));
    const result = parseEnglishLexicalSenseSourceRecordV0_1(
      Buffer.from(readFileSync(path)),
    );
    expect(result).toMatchObject({ ok: true, record: { word: "project" } });
    if (result.ok) {
      expect(result.record).toEqual({
        word: "project",
        lang: "English",
        lang_code: "en",
        pos: "noun",
        senses: [
          {
            id: "project-1",
            glosses: ["A gloss"],
            tags: ["tag"],
            raw_tags: ["raw"],
            examples: [
              { text: "first", type: "example", ref: "citation" },
              { text: "second", bold_text_offsets: [[0, 2]] },
              { type: "quotation", ref: "citation-only" },
            ],
          },
          { id: "project-2", glosses: ["raw gloss"] },
        ],
      });
    }
  });

  it("does not treat U+2028/U+2029 in a JSON string as record delimiters", () => {
    const path = writeFixture("unicode-separators.jsonl", record("unicode", [
      { id: "unicode-1", glosses: ["one\u2028\u2029two"] },
    ]));
    const result = parseEnglishLexicalSenseSourceRecordV0_1(
      Buffer.from(readFileSync(path)),
    );
    expect(result).toMatchObject({ ok: true, record: { word: "unicode" } });
    if (result.ok) {
      expect(result.record.senses[0]?.glosses).toEqual(["one\u2028\u2029two"]);
    }
  });

  it("fails closed on malformed JSON and schema records", () => {
    const malformed = writeFixture("malformed.jsonl", "{\"word\":\"bad\"\n");
    expect(parseEnglishLexicalSenseSourceRecordV0_1(Buffer.from(readFileSync(malformed)))).toEqual(
      expect.objectContaining({ ok: false, reasonCode: "SOURCE_RECORD_JSON_INVALID" }),
    );

    const schema = writeFixture("schema.jsonl", JSON.stringify({ word: "bad" }));
    expect(parseEnglishLexicalSenseSourceRecordV0_1(Buffer.from(readFileSync(schema)))).toEqual(
      expect.objectContaining({ ok: false, reasonCode: "SOURCE_RECORD_SCHEMA_INVALID" }),
    );
  });

  it("rejects invalid UTF-8 at the source-record boundary", () => {
    expect(parseEnglishLexicalSenseSourceRecordV0_1(Uint8Array.from([0xff]))).toEqual(
      expect.objectContaining({ ok: false, reasonCode: "SOURCE_RECORD_UTF8_INVALID" }),
    );
  });
});
