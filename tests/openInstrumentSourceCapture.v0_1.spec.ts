import {
  captureReviewedSourceV0_1,
  captureReviewedSourcesV0_1,
  OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
} from "@/shared/openInstrumentSourceCapture.v0_1";
import {
  adaptVerifiedSourceRecordV0_1,
} from "@/shared/openInstrumentSourceAdapter.v0_1";

function capture(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
    sourceTraditionId: "fjale.fjalor-shqip.v0_1",
    sourceTitle: "FJALË — Rend",
    sourceDateOrVersion: "accessed 2026-09-07",
    sourceUrlOrArchiveRef: "https://fjale.al/rend",
    entryLocator: "REND I m., senses 1-3",
    attestedForm: "rend",
    attestedGloss: "row; arrangement according to a specified order; sequence",
    sourceHashOrArchiveHash: null,
    ...overrides,
  };
}

describe("Open Instrument reviewed source capture v0.1", () => {
  it.each([
    ["fjale.fjalor-shqip.v0_1", "Albanian", "lexical_dictionary", "fjale.fjalor-shqip.v0_1"],
    ["scaife.lewis-short.v0_1", "Latin", "historical_dictionary", "scaife.lewis-short.v0_1"],
    ["scaife.middle-liddell.v0_1", "Ancient Greek", "historical_dictionary", "scaife.middle-liddell.v0_1"],
  ])("fills canonical metadata for %s", (tradition, language, _family, provenance) => {
    const result = captureReviewedSourceV0_1(
      capture({
        sourceTraditionId: tradition,
        sourceTitle: `${tradition} entry`,
        attestedForm: tradition.includes("middle") ? "φέρω" : "ordo",
      }),
    );

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.sourceRecord).toMatchObject({
      language,
      sourceTraditionId: tradition,
    });
    expect(adaptVerifiedSourceRecordV0_1(result.sourceRecord)).toMatchObject({
      ok: true,
      admissible: true,
    });
    const adapted = adaptVerifiedSourceRecordV0_1(result.sourceRecord);
    if (!adapted.ok || !adapted.candidate.citation) return;
    expect(adapted.candidate.citation.provenanceGroupId).toBe(provenance);
  });

  it("generates a deterministic target-independent source record ID", () => {
    const first = captureReviewedSourceV0_1(capture());
    const second = captureReviewedSourceV0_1(capture());
    expect(first).toEqual(second);
    expect(first.ok && first.sourceRecord.sourceRecordId).toBe(
      "capture.fjale-fjalor-shqip-v0-1.rend-i-m-senses-1-3.rend.v0_1",
    );
  });

  it("fills a tradition-level source title when no entry title override is supplied", () => {
    const { sourceTitle: _sourceTitle, ...minimalCapture } = capture();
    const result = captureReviewedSourceV0_1(minimalCapture);
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.sourceRecord.sourceTitle).toBe("FJALË — Fjalor Shqip");
  });

  it("NFC-normalizes reviewed entry facts without semantic derivation", () => {
    const result = captureReviewedSourceV0_1(
      capture({
        sourceTitle: " FJALË — Rénd ",
        attestedForm: " rénd ",
        attestedGloss: " reviewed gloss ",
      }),
    );
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.sourceRecord.sourceTitle).toBe("FJALË — Rénd");
    expect(result.sourceRecord.attestedForm).toBe("rénd");
    expect(JSON.stringify(result)).not.toContain("targetWord");
    expect(JSON.stringify(result)).not.toContain("semanticBridge");
  });

  it.each([
    ["unknown tradition", { sourceTraditionId: "logeion.lsj.v0_1" }, "SOURCE_TRADITION_UNKNOWN"],
    ["missing locator", { entryLocator: "   " }, "ENTRY_LOCATOR_MISSING"],
    ["missing form", { attestedForm: "   " }, "ATTESTED_FORM_MISSING"],
    ["missing gloss", { attestedGloss: "   " }, "ATTESTED_GLOSS_MISSING"],
    ["missing URL", { sourceUrlOrArchiveRef: "   " }, "SOURCE_URL_OR_ARCHIVE_REF_MISSING"],
    ["wrong version", { captureVersion: "wrong.version" }, "CAPTURE_VERSION_INVALID"],
  ])("fails closed for %s", (_label, overrides, reason) => {
    const result = captureReviewedSourceV0_1(capture(overrides));
    expect(result).toMatchObject({ ok: false, sourceRecord: null });
    if (result.ok) return;
    expect(result.reasonCodes).toContain(reason);
  });

  it("rejects target and semantic judgment fields at the capture boundary", () => {
    const result = captureReviewedSourceV0_1(capture({ targetWord: "order" }));
    expect(result).toMatchObject({ ok: false, reasonCodes: ["CAPTURE_INVALID"] });
  });

  it("rejects duplicate generated identities in a batch", () => {
    const results = captureReviewedSourcesV0_1([capture(), capture()]);
    expect(results.every((result) => !result.ok)).toBe(true);
    expect(results[0]).toMatchObject({ reasonCodes: ["SOURCE_RECORD_ID_COLLISION"] });
  });

  it("preserves an explicit source record ID", () => {
    const result = captureReviewedSourceV0_1(
      capture({ sourceRecordId: "reviewed.rend.v0_1" }),
    );
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.sourceRecord.sourceRecordId).toBe("reviewed.rend.v0_1");
  });
});
