import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  serializeCanonicalSourceSliceV1,
  SOURCE_SLICE_SERIALIZATION_V1,
} from "../src/shared/openInstrument/sourceSliceSerialization.v1";

const fixturePath = join(
  __dirname,
  "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.xml",
);
const fixture = readFileSync(fixturePath, "utf8");
const fixtureFirstEntryOffset = fixture.indexOf("<entryFree");
const fixtureSuffix = "\n</sourceSlice>\n";
const fixtureEntries = fixture.slice(
  fixtureFirstEntryOffset,
  fixture.length - fixtureSuffix.length,
);
const sourceFormat = "TEI.2 XML";
const sourceTraditionId = "scaife.lewis-short.v0_1";

const configuredAquaArtifactPath = process.env.OPEN_INSTRUMENT_PINNED_LS_PATH;
const aquaArtifactPath =
  configuredAquaArtifactPath ??
  "/tmp/open-instrument-ls-pinned-revalidation/lat.ls.perseus-eng2.xml";
const aquaTest =
  configuredAquaArtifactPath !== undefined || existsSync(aquaArtifactPath)
    ? it
    : it.skip;

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function exactEntryFromPinnedSource(path: string): string {
  const source = readFileSync(path, "utf8");
  const openingTag = '<entryFree key="aqua" type="main" id="n3259">';
  const closingTag = "</entryFree>";
  const start = source.indexOf(openingTag);
  if (start < 0) throw new Error("AQUA entry opening tag not found");
  const end = source.indexOf(closingTag, start);
  if (end < 0) throw new Error("AQUA entry closing tag not found");
  return source.slice(start, end + closingTag.length);
}

describe("Open Instrument canonical sourceSlice serialization v1", () => {
  it("reproduces the committed entry-attestation fixture byte-for-byte", () => {
    const serialized = serializeCanonicalSourceSliceV1({
      sourceFormat,
      sourceTraditionId,
      exactEntryXml: fixtureEntries,
    });

    expect(SOURCE_SLICE_SERIALIZATION_V1).toBe(
      "open-instrument.source-slice-serialization.v1",
    );
    expect(Buffer.byteLength(serialized, "utf8")).toBe(118368);
    expect(sha256(serialized)).toBe(
      "92bd71660cdcc2c2b57d6869fdaed42aa2b04e19e9182aeffe0eae269937ab65",
    );
    expect(serialized).toBe(fixture);
  });

  it("uses deterministic LF boundaries, attribute order, and a final newline", () => {
    const serialized = serializeCanonicalSourceSliceV1({
      sourceFormat,
      sourceTraditionId,
      exactEntryXml: fixtureEntries,
    });

    expect(serialized).not.toContain("\r");
    expect(serialized).toContain(
      '<sourceSlice sourceFormat="TEI.2 XML" sourceTraditionId="scaife.lewis-short.v0_1">\n',
    );
    expect(serialized.endsWith("\n")).toBe(true);
    expect(serialized.endsWith("\n</sourceSlice>\n")).toBe(true);
  });

  it("is repeatable and preserves arbitrary exact Unicode entry content", () => {
    const exactEntryXml =
      '<entryFree key="probe" type="main" id="probe-1"><orth lang="la">ăqua</orth><sense id="probe-1.0"><hi rend="ital">exact raw content</hi></sense></entryFree>';
    const input = { sourceFormat, sourceTraditionId, exactEntryXml } as const;
    const first = serializeCanonicalSourceSliceV1(input);
    const second = serializeCanonicalSourceSliceV1(input);

    expect(first).toBe(second);
    expect(sha256(first)).toBe(sha256(second));
    expect(first).toContain(exactEntryXml);
    expect(first).toContain("ăqua");
  });

  aquaTest("reproduces the verified AQUA forensic identity", () => {
    const exactEntryXml = exactEntryFromPinnedSource(aquaArtifactPath);
    const serialized = serializeCanonicalSourceSliceV1({
      sourceFormat,
      sourceTraditionId,
      exactEntryXml,
    });

    expect(Buffer.byteLength(exactEntryXml, "utf8")).toBe(25255);
    expect(Buffer.byteLength(serialized, "utf8")).toBe(25488);
    expect(sha256(serialized)).toBe(
      "c70fdfd3e9f3087ce7c9af2d3cc766cac332af224cd8a39f02880a3185b466a3",
    );
  });
});
