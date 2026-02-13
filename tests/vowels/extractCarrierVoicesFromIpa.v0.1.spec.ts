import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

describe("extractCarrierVoicesFromIpaV0_1 (Carrier Law Gate v0.1)", () => {
  test("pure stop consonant => NO_CARRIER", () => {
    const r = extractCarrierVoicesFromIpaV0_1("/b/");
    expect(r.voices).toEqual([]);
    expect(r.diagnostics.noCarrier).toBe(true);
  });

  test("pure cluster => NO_CARRIER", () => {
    const r = extractCarrierVoicesFromIpaV0_1("/str/");
    expect(r.voices).toEqual([]);
    expect(r.diagnostics.noCarrier).toBe(true);
    expect(r.diagnostics.usedImplicit).toBe(false);
  });

  test("explicit vowel => carrier detected", () => {
    const r = extractCarrierVoicesFromIpaV0_1("/biː/");
    expect(r.voices).toEqual(["I"]);
    expect(r.diagnostics.noCarrier).toBe(false);
  });

  test("syllabic consonant => Ë", () => {
    const r = extractCarrierVoicesFromIpaV0_1("/m̩/");
    expect(r.voices).toEqual(["Ë"]);
    expect(r.diagnostics.usedSyllabic).toBe(true);
    expect(r.diagnostics.noCarrier).toBe(false);
  });

  test("rhythm explicit schwa form: /rɪðəm/ => I, Ë (no injection)", () => {
    const r = extractCarrierVoicesFromIpaV0_1("/rɪðəm/");
    expect(r.voices).toEqual(["I", "Ë"]);
    expect(r.diagnostics.usedImplicit).toBe(false);
  });

  test("rhythm implicit form: /rɪðm/ => I, Ë (injection)", () => {
    const r = extractCarrierVoicesFromIpaV0_1("/rɪðm/");
    expect(r.voices).toEqual(["I", "Ë"]);
    expect(r.diagnostics.usedImplicit).toBe(true);
  });

  test("do NOT inject for sonorant clusters like /stɑːrm/ (already has nucleus)", () => {
    const r = extractCarrierVoicesFromIpaV0_1("/stɑːrm/");
    expect(r.diagnostics.usedImplicit).toBe(false);
    expect(r.voices.length).toBeGreaterThan(0);
  });
});
