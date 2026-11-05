import {
  buildStrictBlindPerseusFoundPacketV1,
  buildStrictBlindPerseusNotFoundPacketV1,
  buildStrictBlindPerseusSourceUnavailablePacketV1,
  extractStrictBlindPerseusTeiEntryFromBytesV1,
  STRICT_BLIND_FROZEN_SEARCH_STAGES_V1,
  STRICT_BLIND_FROZEN_SOURCE_TRADITIONS_V1,
  STRICT_BLIND_PERSEUS_SOURCE_DEFINITIONS_V1,
  STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1,
  STRICT_BLIND_PERSEUS_DEFAULT_TEI_LIMITS_V1,
  validateStrictBlindPerseusFrozenCoverageV1,
  validateStrictBlindPerseusSourcePacketV1,
  verifyStrictBlindPerseusSourceBytesV1,
  type StrictBlindPerseusExtractedEntryV1,
  type StrictBlindPerseusSourceSnapshotV1,
} from "@/shared/openInstrument/strictBlindPerseusSourcePacket.v1";
import {
  STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_INTEGRITY_V1,
} from "@/shared/openInstrument/strictBlindRunnerIntegrity.v1";
import {
  STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_V1,
} from "@/shared/openInstrument/strictBlindReplicationRunner.v1";
import {
  captureRawSourceEntryV0_1,
  OPEN_INSTRUMENT_RAW_SOURCE_ENTRY_CAPTURE_VERSION_V0_1,
} from "@/shared/openInstrumentRawSourceEntryCapture.v0_1";
import {
  buildOfflineSourceEntrySnapshotV0_1,
  OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1,
} from "@/shared/openInstrumentSourceSnapshotBuilder.v0_1";
import {
  extractOfflineSourceEntryFactsV0_1,
} from "@/shared/openInstrumentOfflineSourceEntryExtractor.v0_1";

function makeSnapshot(
  sourceTraditionId: "scaife.lewis-short.v0_1" | "scaife.middle-liddell.v0_1",
): StrictBlindPerseusSourceSnapshotV1 {
  const definition = STRICT_BLIND_PERSEUS_SOURCE_DEFINITIONS_V1[sourceTraditionId];
  return {
    sourceTraditionId,
    repository: definition.repository,
    upstreamCommitSha: definition.upstreamCommitSha,
    sourcePath: definition.sourcePath,
    sourceVersion: definition.sourceVersion,
    accessDate: definition.accessDate,
    rawByteLength: definition.rawByteLength,
    rawSha256: definition.rawSha256,
    licenseIdentifier: definition.attribution.licenseIdentifier,
    licenseDecisionReference: definition.attribution.licenseDecisionReference,
    attribution: definition.attribution,
    sourceHeader: definition.header,
    sourceAcquisitionState: "VERIFIED_PINNED_SNAPSHOT",
  };
}

function makeEntry(): StrictBlindPerseusExtractedEntryV1 {
  return {
    entryLocator: "data/viaf66541464/001/viaf66541464.001.perseus-eng1.xml#entry[ordinal=0;id=n0;key=a]",
    entryId: "n0",
    entryKey: "a",
    attestedSpelling: "ἀάατος",
    extractedText: "unbroken, not to be broken",
    senses: [{ senseId: "n0.0", text: "unbroken, not to be broken" }],
    sourceProcessingStatus: "EXTRACTED_REVIEW_REQUIRED",
    sourceValidationStatus: "TEI_WELL_FORMED_BOUNDED",
  };
}

function tei(body: string): Uint8Array {
  return new TextEncoder().encode(
    `<?xml version="1.0"?><TEI xmlns="http://www.tei-c.org/ns/1.0"><teiHeader/><text><body>${body}</body></text></TEI>`,
  );
}

describe("strict-blind Perseus source packets v1", () => {
  it("pins both source traditions and preserves legal/header provenance", () => {
    expect(STRICT_BLIND_PERSEUS_SOURCE_DEFINITIONS_V1["scaife.lewis-short.v0_1"]).toMatchObject({
      upstreamCommitSha: "1c34cdf756c63cf37db61bd366d733431dbd7aa0",
      sourcePath: "CTS_XML_TEI/perseus/pdllex/lat/ls/lat.ls.perseus-eng2.xml",
      rawByteLength: 77415379,
      rawSha256: "933ba8fde0ef06823f69a130c95ba6f345ece3cb1603514b17972d1edd421d32",
    });
    expect(STRICT_BLIND_PERSEUS_SOURCE_DEFINITIONS_V1["scaife.middle-liddell.v0_1"]).toMatchObject({
      upstreamCommitSha: "02768b0c37d6102be4899fc0eb57f9d348195243",
      sourcePath: "data/viaf66541464/001/viaf66541464.001.perseus-eng1.xml",
      rawByteLength: 20190148,
      rawSha256: "e273dbed7938de7ab9ed4cf4af0e93216141f89226318a697c94b5d43f924cb7",
    });
  });

  it.each([
    ["missing bytes", undefined, "SOURCE_BYTES_MISSING"],
    ["wrong byte length", new Uint8Array([1]), "SOURCE_BYTE_LENGTH_MISMATCH"],
    ["wrong expected hash", new Uint8Array([1]), "SOURCE_BYTE_LENGTH_MISMATCH"],
  ])("fails closed for %s before lexical classification", (_label, bytes, reasonCode) => {
    const result = verifyStrictBlindPerseusSourceBytesV1({
      sourceTraditionId: "scaife.lewis-short.v0_1",
      bytes,
      expectedByteLength: 77415379,
      expectedSha256: "933ba8fde0ef06823f69a130c95ba6f345ece3cb1603514b17972d1edd421d32",
    });
    expect(result).toEqual({ ok: false, reasonCode });
  });

  it("extracts namespace-aware nested TEI content without Unicode folding", () => {
    const result = extractStrictBlindPerseusTeiEntryFromBytesV1({
      sourceTraditionId: "scaife.middle-liddell.v0_1",
      bytes: tei(
        `<entry id="n0" type="main" key="a"><form><orth>ἀάατος</orth></form><sense id="n0.0"><trans><tr>unbroken, <hi>not to be broken</hi></tr></trans></sense><sense id="n0.1">hurtful</sense></entry>`,
      ),
      selector: { entryId: "n0" },
    });

    expect(result).toEqual({
      ok: true,
      entry: expect.objectContaining({
        entryId: "n0",
        entryKey: "a",
        attestedSpelling: "ἀάατος",
        extractedText: "unbroken, not to be broken | hurtful",
        senses: [
          { senseId: "n0.0", text: "unbroken, not to be broken" },
          { senseId: "n0.1", text: "hurtful" },
        ],
        sourceProcessingStatus: "EXTRACTED_REVIEW_REQUIRED",
      }),
    });
  });

  it("supports the Latin entryFree shape and preserves diacritics", () => {
    const result = extractStrictBlindPerseusTeiEntryFromBytesV1({
      sourceTraditionId: "scaife.lewis-short.v0_1",
      bytes: tei(
        `<entryFree id="n7" key="abactor"><orth>ăbactor</orth>, <sense id="n7.0"><hi>one who drives off</hi></sense></entryFree>`,
      ),
      selector: { entryKey: "abactor" },
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCode);
    expect(result.entry.attestedSpelling).toBe("ăbactor");
    expect(result.entry.entryLocator).toContain("entryFree[ordinal=0;id=n7;key=abactor]");
  });

  it("rejects duplicate ID or key selector matches instead of replacing the earlier entry", () => {
    const duplicateEntries = tei(
      `<entry id="n0" key="a"><orth>first</orth><sense>first meaning</sense></entry><entry id="n0" key="b"><orth>second</orth><sense>second meaning</sense></entry>`,
    );
    expect(
      extractStrictBlindPerseusTeiEntryFromBytesV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        bytes: duplicateEntries,
        selector: { entryId: "n0" },
      }),
    ).toEqual({ ok: false, reasonCode: "ENTRY_SELECTOR_AMBIGUOUS" });
    expect(
      extractStrictBlindPerseusTeiEntryFromBytesV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        bytes: tei(
          `<entry id="n0" key="shared"><orth>first</orth><sense>first meaning</sense></entry><entry id="n1" key="shared"><orth>second</orth><sense>second meaning</sense></entry>`,
        ),
        selector: { entryKey: "shared" },
      }),
    ).toEqual({ ok: false, reasonCode: "ENTRY_SELECTOR_AMBIGUOUS" });
  });

  it.each([
    ["malformed XML", "<entry", "MALFORMED_XML"],
    ["unsupported schema", "<Dictionary><entry id=\"n0\"><orth>x</orth></entry></Dictionary>", "UNSUPPORTED_TEI_SCHEMA"],
    ["DTD", '<!DOCTYPE TEI [<!ELEMENT TEI ANY>]><TEI><entry id="n0"><orth>x</orth></entry></TEI>', "DTD_FORBIDDEN"],
    ["external entity", '<!DOCTYPE TEI [<!ENTITY x SYSTEM "file:///tmp/private">]><TEI><entry id="n0"><orth>&x;</orth></entry></TEI>', "EXTERNAL_ENTITY_FORBIDDEN"],
  ])("rejects %s", (_label, body, reasonCode) => {
    const result = extractStrictBlindPerseusTeiEntryFromBytesV1({
      sourceTraditionId: "scaife.middle-liddell.v0_1",
      bytes: new TextEncoder().encode(body),
      selector: { entryId: "n0" },
    });
    expect(result).toEqual({ ok: false, reasonCode });
  });

  it("enforces selector and bounded-resource limits", () => {
    const bytes = tei(`<entry id="n0" key="a"><orth>alpha</orth><sense>meaning</sense></entry>`);
    expect(
      extractStrictBlindPerseusTeiEntryFromBytesV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        bytes,
        selector: {},
      }),
    ).toEqual({ ok: false, reasonCode: "ENTRY_SELECTOR_INVALID" });
    expect(
      extractStrictBlindPerseusTeiEntryFromBytesV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        bytes,
        selector: { entryId: "n0" },
        limits: { maxTextCharacters: 3 },
      }),
    ).toEqual({ ok: false, reasonCode: "TEXT_LIMIT_EXCEEDED" });
    expect(
      extractStrictBlindPerseusTeiEntryFromBytesV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        bytes,
        selector: { entryId: "missing" },
      }),
    ).toEqual({ ok: false, reasonCode: "ENTRY_NOT_FOUND" });
  });

  it.each([
    ["Infinity", { maxDepth: Infinity }],
    ["NaN", { maxDepth: Number.NaN }],
    ["negative", { maxDepth: -1 }],
    ["zero", { maxDepth: 0 }],
    ["fractional", { maxDepth: 1.5 }],
    ["above the configured ceiling", {
      maxDepth: STRICT_BLIND_PERSEUS_DEFAULT_TEI_LIMITS_V1.maxDepth + 1,
    }],
  ])("rejects %s caller-supplied TEI limit before parsing", (_label, limits) => {
    expect(
      extractStrictBlindPerseusTeiEntryFromBytesV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        bytes: tei(`<entry id="n0"><orth>alpha</orth><sense>meaning</sense></entry>`),
        selector: { entryId: "n0" },
        limits,
      }),
    ).toEqual({ ok: false, reasonCode: "RESOURCE_LIMITS_INVALID" });
  });

  it("fails closed for NOT_FOUND without verifiable completed-lookup evidence", () => {
    const source = makeSnapshot("scaife.middle-liddell.v0_1");
    expect(
      buildStrictBlindPerseusNotFoundPacketV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        source,
        authorizedLookupCompleted: false,
        completeVerifiedSnapshot: true,
      }),
    ).toEqual({ ok: false, packet: null, reasonCodes: ["NOT_FOUND_LOOKUP_INCOMPLETE"] });
    expect(
      buildStrictBlindPerseusNotFoundPacketV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        source,
        authorizedLookupCompleted: true,
        completeVerifiedSnapshot: false,
      }),
    ).toEqual({ ok: false, packet: null, reasonCodes: ["NOT_FOUND_SNAPSHOT_UNVERIFIED"] });
    expect(
      buildStrictBlindPerseusNotFoundPacketV1({
        sourceTraditionId: "scaife.middle-liddell.v0_1",
        source,
        authorizedLookupCompleted: true,
        completeVerifiedSnapshot: true,
      }),
    ).toEqual({ ok: false, packet: null, reasonCodes: ["NOT_FOUND_EVIDENCE_UNVERIFIED"] });
    const manuallyConstructed = {
      schemaVersion: STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1,
      sourceTraditionId: "scaife.middle-liddell.v0_1",
      outcome: "NOT_FOUND",
      source,
      entry: null,
      lookup: {
        status: "COMPLETED_OVER_VERIFIED_SNAPSHOT",
        coverage: "COMPLETE_VERIFIED_SNAPSHOT",
      },
      unavailable: null,
    };
    expect(validateStrictBlindPerseusSourcePacketV1(manuallyConstructed)).toEqual({
      ok: false,
      packet: null,
      reasonCodes: ["NOT_FOUND_EVIDENCE_UNVERIFIED"],
    });
  });

  it("keeps FOUND extraction review-required and rejects target leakage", () => {
    const result = buildStrictBlindPerseusFoundPacketV1({
      sourceTraditionId: "scaife.middle-liddell.v0_1",
      source: makeSnapshot("scaife.middle-liddell.v0_1"),
      entry: makeEntry(),
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCodes.join(","));
    expect(result.packet.entry?.sourceProcessingStatus).toBe("EXTRACTED_REVIEW_REQUIRED");

    const leaked = {
      ...result.packet,
      entry: { ...result.packet.entry, targetWord: "forbidden" },
    };
    expect(validateStrictBlindPerseusSourcePacketV1(leaked)).toEqual({
      ok: false,
      packet: null,
      reasonCodes: ["PACKET_INVALID"],
    });
  });

  it("keeps FJALË unavailable without accessing or substituting its content", () => {
    const packet = buildStrictBlindPerseusSourceUnavailablePacketV1();
    expect(packet).toEqual({
      schemaVersion: STRICT_BLIND_PERSEUS_SOURCE_PACKET_SCHEMA_V1,
      sourceTraditionId: "fjale.fjalor-shqip.v0_1",
      outcome: "SOURCE_UNAVAILABLE",
      source: null,
      entry: null,
      lookup: null,
      unavailable: {
        reasonCode: "REUSE_AUTHORITY_UNVERIFIED",
        detail: "SOURCE_UNAVAILABLE",
        accessPerformed: false,
      },
    });
    expect(validateStrictBlindPerseusSourcePacketV1(packet).ok).toBe(true);
    expect(packet).not.toHaveProperty("sourceContent");
    expect(packet).not.toHaveProperty("substitution");
    for (const key of ["sourceContent", "targetData", "arbitraryPayload"]) {
      expect(
        validateStrictBlindPerseusSourcePacketV1({
          ...packet,
          unavailable: { ...packet.unavailable, [key]: { leaked: true } },
        }),
      ).toEqual({
        ok: false,
        packet: null,
        reasonCodes: ["FJALE_SOURCE_ACCESS_FORBIDDEN"],
      });
    }
  });

  it("rejects unexpected lookup metadata instead of accepting arbitrary payloads", () => {
    const packet = buildStrictBlindPerseusFoundPacketV1({
      sourceTraditionId: "scaife.middle-liddell.v0_1",
      source: makeSnapshot("scaife.middle-liddell.v0_1"),
      entry: makeEntry(),
    });
    expect(packet.ok).toBe(true);
    if (!packet.ok) throw new Error(packet.reasonCodes.join(","));
    expect(
      validateStrictBlindPerseusSourcePacketV1({
        ...packet.packet,
        lookup: { ...packet.packet.lookup, arbitraryPayload: "forbidden" },
      }),
    ).toEqual({ ok: false, packet: null, reasonCodes: ["PACKET_INVALID"] });
  });

  it("preserves the frozen three-tradition, five-stage ordered coverage matrix", () => {
    const identities = STRICT_BLIND_FROZEN_SOURCE_TRADITIONS_V1.flatMap((sourceTraditionId) =>
      STRICT_BLIND_FROZEN_SEARCH_STAGES_V1.map((stage) => ({ sourceTraditionId, stage })),
    );
    expect(validateStrictBlindPerseusFrozenCoverageV1(identities)).toEqual({
      ok: true,
      expectedCount: 15,
    });
    expect(validateStrictBlindPerseusFrozenCoverageV1(identities.slice(1))).toEqual({
      ok: false,
      reasonCode: "COVERAGE_COUNT_MISMATCH",
    });
    expect(
      validateStrictBlindPerseusFrozenCoverageV1([
        ...identities.slice(0, -1),
        identities[0],
      ]),
    ).toEqual({ ok: false, reasonCode: "COVERAGE_DUPLICATE" });
  });

  it("accepts Middle Liddell in legacy source capture/snapshot seams", () => {
    const captured = captureRawSourceEntryV0_1({
      captureVersion: OPEN_INSTRUMENT_RAW_SOURCE_ENTRY_CAPTURE_VERSION_V0_1,
      sourceTraditionId: "scaife.middle-liddell.v0_1",
      sourceUrlOrArchiveRef: "pinned://middle-liddell",
      rawEntryText: "ἀάατος\nentry locator; headword\n1. unbroken",
    });
    expect(captured.ok).toBe(true);
    if (!captured.ok) throw new Error(captured.diagnostics.join(","));
    const built = buildOfflineSourceEntrySnapshotV0_1({
      builderVersion: OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1,
      sourceTraditionId: captured.candidate.sourceTraditionId,
      sourceUrlOrArchiveRef: captured.candidate.sourceUrlOrArchiveRef,
      entryHeadword: captured.candidate.headwordCandidates[0],
      entryLocator: captured.candidate.entryLocatorCandidates[0],
      attestedForm: captured.candidate.attestedFormCandidates[0],
      attestedGloss: captured.candidate.attestedGlossCandidates[0],
    });
    expect(built.ok).toBe(true);
    if (!built.ok) throw new Error(built.reasonCodes.join(","));
    expect(built.snapshot.sourceSnapshotId).toBe("liddell-undetermined-reviewed-undated");
    expect(extractOfflineSourceEntryFactsV0_1(built.snapshot).ok).toBe(true);
  });

  it("keeps both real execution locks closed", () => {
    expect(STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_V1).toBe(false);
    expect(STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_INTEGRITY_V1).toBe(false);
  });
});
