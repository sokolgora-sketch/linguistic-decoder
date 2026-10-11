import {
  adaptSanskritMwRecordV0_1,
  createSanskritMwSourceFamilyAdapterV0_1,
  lookupSanskritMwSourceRecordsV0_1,
  parseSanskritMwRecordV0_1,
  SANSKRIT_MW_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  validateSanskritMwSourceArtifactIdentityV0_1,
} from "@/shared/openInstrument/sanskritMwSourceFamilyAdapter.v0_1";
import {
  getRegisteredSanskritMwSourceFamilyV0_1,
  SANSKRIT_SOURCE_ACTIVATION_DEFAULT_V0_1,
} from "@/shared/openInstrument/sanskritMwSourceFamilyRegistration.v0_1";

function bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function sourceRecord(l = "2", k1 = "akAra") {
  const result = adaptSanskritMwRecordV0_1({
    recordBytes: bytes(
      `<L>${l}<pc>1,1<k1>${k1}<k2>a—kAra<h>1<e>3\n<s>${k1}</s> ¦ a source-attested entry body\n<LEND>\n`,
    ),
    recordOrdinal: Number(l.replace(/[^0-9]/gu, "")) || 1,
    verifiedSnapshot: SANSKRIT_MW_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  });
  if (!result.ok) throw new Error(result.reasonCode);
  return result.record;
}

describe("Sanskrit MW source-family adapter v0.1", () => {
  it("preserves exact source-native k1/k2/pc/e facts and keeps pronunciation Null", () => {
    const record = sourceRecord("2", "akAra");

    expect(record).toMatchObject({
      sourceFamilyId: "sanskrit-mw",
      sourceTraditionId: "cdsl-monier-williams-1899",
      l: "2",
      pc: "1,1",
      k1: "akAra",
      lookupForm: "akAra",
      displayForm: "akAra",
      k2: "a—kAra",
      h: "1",
      e: "3",
      rawRecordBody: "<s>akAra</s> ¦ a source-attested entry body",
      rawEntryMetadata: "3",
      representation: "SLP1",
      sourceFormNormalization: "EXACT_PRESERVED",
      pronunciation: null,
      voicePath: null,
      gamma: null,
      zc: null,
    });
    expect(record.sourceRecordId).toBe(
      "open-instrument.sanskrit-mw.snapshot.1899-cdsl-csl-orig-55e8addb.v0_1#L-2",
    );
    expect(record.entryLocator).toContain("#L=2;pc=1%2C1");
    expect(Object.isFrozen(record)).toBe(true);
  });

  it("fails closed for identity, UTF-8, boundaries, and required fields", () => {
    const valid = `<L>1<pc>1,1<k1>a<k2>a<e>1\n<LEND>\n`;
    expect(
      adaptSanskritMwRecordV0_1({
        recordBytes: bytes(valid),
        recordOrdinal: 1,
        verifiedSnapshot: { byteLength: 1, sha256: "wrong" },
      }),
    ).toEqual({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
    expect(
      adaptSanskritMwRecordV0_1({
        recordBytes: bytes("\xff\xfe"),
        recordOrdinal: 1,
        verifiedSnapshot: SANSKRIT_MW_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
      }),
    ).toEqual({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
    expect(
      parseSanskritMwRecordV0_1(
        "<L>1<pc>1,1<k1>a<e>1\n<LEND>\n",
        1,
      ),
    ).toEqual({ ok: false, reasonCode: "SOURCE_RECORD_INVALID" });
    expect(
      parseSanskritMwRecordV0_1("<L>1<pc>1,1<k1>a<k2>a<e>1\n", 1),
    ).toEqual({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
    expect(
      parseSanskritMwRecordV0_1("<L>1<pc>1,1<k1>a<k2>a<e>1\n<LEND><\n", 1),
    ).toMatchObject({ ok: true });
    expect(
      parseSanskritMwRecordV0_1(
        "<L>1<pc>1,1<k1>a<k2>a<e>1\n<LEND><anything-else>\n",
        1,
      ),
    ).toEqual({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  });

  it("preserves the complete raw body and rejects interior record boundaries", () => {
    const body = "<s>akAra</s>  ¦  source text\n<ls>reference</ls> literal <L> markup";
    const record = parseSanskritMwRecordV0_1(
      `<L>1<pc>1,1<k1>a<k2>a<e>1\n${body}\n<LEND>\n`,
      1,
    );
    expect(record).toMatchObject({ ok: true });
    if (record.ok) expect(record.record.rawRecordBody).toBe(body);

    expect(
      parseSanskritMwRecordV0_1(
        `<L>1<pc>1,1<k1>a<k2>a<e>1\n<s>first</s>\n<L>2<pc>1,1<k1>b<k2>b<e>2\n<LEND>\n`,
        1,
      ),
    ).toEqual({ ok: false, reasonCode: "SOURCE_RECORD_INVALID" });
    expect(
      parseSanskritMwRecordV0_1(
        `<L>1<pc>1,1<k1>a<k2>a<e>1\n<s>first</s>\n<LEND>\n<LEND>\n`,
        1,
      ),
    ).toEqual({ ok: false, reasonCode: "SOURCE_RECORD_INVALID" });
    expect(
      parseSanskritMwRecordV0_1(
        `<L>1<pc>1,1<k1>a<k2>a<e>1\n<s>first</s>\n<LEND><\n<LEND>\n`,
        1,
      ),
    ).toEqual({ ok: false, reasonCode: "SOURCE_RECORD_INVALID" });
  });

  it("uses exact case-sensitive lookup and preserves same-k1 multiplicity", () => {
    const first = sourceRecord("1", "a");
    const second = sourceRecord("3", "a");
    const adapter = createSanskritMwSourceFamilyAdapterV0_1([first, second]);

    expect(adapter.queryExact("a")).toMatchObject({
      status: "MATCHES_FOUND",
      records: [first, second],
    });
    expect(adapter.queryExact("A")).toEqual({
      status: "SANSKRIT_SOURCE_NOT_FOUND",
      lookupForm: "A",
      records: [],
    });
    expect(lookupSanskritMwSourceRecordsV0_1("a", [first, second]).records).toHaveLength(2);
  });

  it("does not reinterpret raw e as generic semantic gloss evidence", () => {
    const record = sourceRecord();
    expect(record.rawEntryMetadata).toBe(record.e);
    expect(JSON.stringify(record)).not.toContain("gloss");
    expect(record.sourceStatus).toBe("research_candidate");
  });

  it("registers the source while keeping it disabled and inactive by default", () => {
    const registration = getRegisteredSanskritMwSourceFamilyV0_1();
    expect(registration.status).toBe("REGISTERED");
    expect(registration.activationDefault).toBe(
      SANSKRIT_SOURCE_ACTIVATION_DEFAULT_V0_1,
    );
    expect(registration.enabledByDefault).toBe(false);
    expect(registration.runtimeActiveAfterMerge).toBe(false);
    expect(registration.futureActivationLaneRequired).toBe(true);
  });

  it("validates the frozen artifact identity without accepting substitutions", () => {
    expect(
      validateSanskritMwSourceArtifactIdentityV0_1(
        SANSKRIT_MW_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
      ),
    ).toMatchObject({ ok: true });
    expect(
      validateSanskritMwSourceArtifactIdentityV0_1({
        byteLength: 50163992,
        sha256: SANSKRIT_MW_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1.sha256,
      }),
    ).toMatchObject({ ok: false, reasonCode: "SOURCE_IDENTITY_MISMATCH" });
  });
});
