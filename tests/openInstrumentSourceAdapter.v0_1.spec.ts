import {
  adaptVerifiedSourceRecordV0_1,
  adaptVerifiedSourceRecordsV0_1,
  OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1,
  type OpenInstrumentVerifiedSourceRecordV0_1,
} from "@/shared/openInstrumentSourceAdapter.v0_1";
import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
  OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1,
} from "@/shared/openInstrumentResearchEvidencePacket.v0_1";

function source(
  overrides: Partial<OpenInstrumentVerifiedSourceRecordV0_1> = {},
): OpenInstrumentVerifiedSourceRecordV0_1 {
  return {
    sourceRecordVersion: OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1,
    sourceRecordId: "record.fjale.rend.v0_1",
    sourceTraditionId: "fjale.fjalor-shqip.v0_1",
    language: " Albanian ",
    sourceTitle: " FJALË — Rend ",
    sourceAuthorOrEditor: null,
    sourcePublisherOrHost: " FJALË — Fjalor Shqip ",
    sourceDateOrVersion: " accessed 2026-09-07 ",
    sourceUrlOrArchiveRef: " https://fjale.al/rend ",
    entryLocator: " REND I m., senses 1-3 ",
    sourceHashOrArchiveHash: null,
    attestedForm: " rend ",
    attestedGloss: " row; arrangement according to a specified order; sequence ",
    ...overrides,
  };
}

describe("Open Instrument verified source adapter v0.1", () => {
  it("normalizes FJALË facts with the existing canonical provenance", () => {
    const result = adaptVerifiedSourceRecordV0_1(source());

    expect(result).toMatchObject({ ok: true, admissible: true });
    if (!result.ok) return;

    expect(result.candidate).toMatchObject({
      sourceRecordId: "record.fjale.rend.v0_1",
      sourceKey: "verified-source:record.fjale.rend.v0_1",
      evidenceFamily: "lexical_dictionary",
      language: "Albanian",
      form: "rend",
      gloss: "row; arrangement according to a specified order; sequence",
      citation: {
        citationId:
          "open-instrument.source-record.record.fjale.rend.v0_1.citation.v0_1",
        sourceTitle: "FJALË — Rend",
        provenanceGroupId: "fjale.fjalor-shqip.v0_1",
      },
    });
    expect(result.candidate.classifications).toEqual({
      sourceIdentity: "FACT_FROM_SOURCE",
      attestedForm: "FACT_FROM_SOURCE",
      attestedGloss: "FACT_FROM_SOURCE",
      evidenceFamily: "DETERMINISTIC_DERIVATION",
      provenance: "DETERMINISTIC_DERIVATION",
    });
  });

  it.each([
    ["scaife.lewis-short.v0_1", "scaife.lewis-short.v0_1", "ordo"],
    ["scaife.middle-liddell.v0_1", "scaife.middle-liddell.v0_1", "φέρω"],
  ])("maps %s to its existing editorial provenance", (traditionId, provenance, form) => {
    const result = adaptVerifiedSourceRecordV0_1(
      source({
        sourceRecordId: `record.${form}.v0_1`,
        sourceTraditionId: traditionId,
        language: "Latin",
        sourceTitle: "Scaife dictionary entry",
        sourcePublisherOrHost: "Scaife ATLAS / Perseus Digital Library",
        attestedForm: form,
        attestedGloss: "test gloss",
      }),
    );

    expect(result).toMatchObject({ ok: true, admissible: true });
    if (!result.ok) return;
    expect(result.candidate.evidenceFamily).toBe("historical_dictionary");
    expect(result.candidate.citation?.provenanceGroupId).toBe(provenance);
    expect(result.candidate.citation?.sourcePublisherOrHost).toContain("Scaife");
  });

  it("does not guess Logeion/LSJ provenance", () => {
    const result = adaptVerifiedSourceRecordV0_1(
      source({
        sourceRecordId: "record.logeion.oikodomeo.v0_1",
        sourceTraditionId: "logeion.lsj.v0_1",
        sourceTitle: "Logeion — οἰκοδομέω",
        sourcePublisherOrHost: "University of Chicago Logeion",
        attestedForm: "οἰκοδομέω",
        attestedGloss: "to build",
      }),
    );

    expect(result).toMatchObject({ ok: true, admissible: false });
    if (!result.ok) return;
    expect(result.candidate.citation).toBeNull();
    expect(result.candidate.evidenceFamily).toBeNull();
    expect(result.candidate.reasonCodes).toEqual([
      "EVIDENCE_FAMILY_UNRESOLVED",
      "PROVENANCE_UNRESOLVED",
      "REVIEW_REQUIRED",
      "SOURCE_IDENTITY_UNKNOWN",
    ]);
  });

  it.each([
    ["entryLocator", "ENTRY_LOCATOR_MISSING"],
    ["attestedForm", "ATTESTED_FORM_MISSING"],
    ["attestedGloss", "ATTESTED_GLOSS_MISSING"],
    ["language", "LANGUAGE_MISSING"],
  ])("fails closed when %s is absent", (field, reason) => {
    const result = adaptVerifiedSourceRecordV0_1(source({ [field]: null }));
    expect(result).toMatchObject({ ok: false, admissible: false, candidate: null });
    if (result.ok) return;
    expect(result.reasonCodes).toContain(reason);
  });

  it("rejects bad versions, empty identities, and forbidden target judgments", () => {
    expect(
      adaptVerifiedSourceRecordV0_1(
        source({ sourceRecordVersion: "wrong.version" as never }),
      ),
    ).toMatchObject({ ok: false, reasonCodes: ["SOURCE_RECORD_INVALID"] });
    expect(
      adaptVerifiedSourceRecordV0_1(source({ sourceRecordId: "   " })),
    ).toMatchObject({ ok: false, reasonCodes: ["SOURCE_RECORD_INVALID"] });
    expect(
      adaptVerifiedSourceRecordV0_1({ ...source(), targetWord: "order" }),
    ).toMatchObject({ ok: false, reasonCodes: ["SOURCE_RECORD_INVALID"] });
  });

  it("is deterministic, NFC-normalized, and target-independent", () => {
    const decomposed = source({
      sourceRecordId: "record.fjale.e\u0301.v0_1",
      language: " Albanian ",
      attestedForm: " e\u0301 ",
    });
    const first = adaptVerifiedSourceRecordV0_1(decomposed);
    const second = adaptVerifiedSourceRecordV0_1(decomposed);

    expect(first).toEqual(second);
    expect(JSON.stringify(first)).not.toContain("targetWord");
    expect(JSON.stringify(first)).not.toContain("targetSenseId");
    expect(JSON.stringify(first)).not.toContain("semanticBridge");
    expect(JSON.stringify(first)).not.toContain("historicalOriginClaim");
    expect(JSON.stringify(first)).not.toContain("candidateTruthClaim");
  });

  it("detects duplicate source-record identities in batch adaptation", () => {
    const results = adaptVerifiedSourceRecordsV0_1([source(), source()]);

    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({ ok: true, admissible: false });
    expect(results[1]).toMatchObject({ ok: true, admissible: false });
    expect(results[0].ok && results[0].candidate.reasonCodes).toContain(
      "SOURCE_RECORD_INVALID",
    );
  });

  it("interoperates with the existing compiler only after human packet fields are supplied", () => {
    const result = adaptVerifiedSourceRecordV0_1(source());
    expect(result).toMatchObject({ ok: true, admissible: true });
    if (!result.ok || !result.candidate.citation) return;

    const packet = {
      packetVersion: OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1,
      packetId: "adapter-interoperability.v0_1",
      targetWord: "order",
      targetSenseId: "arrangement_structured_sequence",
      semanticBridge:
        "The source fact is supplied to a human reviewer for a bounded functional hypothesis.",
      sources: [
        {
          sourceKey: result.candidate.sourceKey,
          embryo: result.candidate.form,
          evidenceFamily: result.candidate.evidenceFamily,
          language: result.candidate.language,
          form: result.candidate.form,
          gloss: result.candidate.gloss,
          embryoRelation: "exact_form",
          relationOperationIds: [],
          citation: result.candidate.citation,
        },
      ],
    };

    expect(() => compileOpenInstrumentResearchEvidencePacketInputV0_1(packet)).not.toThrow();
  });
});
