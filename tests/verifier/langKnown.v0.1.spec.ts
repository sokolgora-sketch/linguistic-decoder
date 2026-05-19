import { isKnownLanguageV0_1 } from "@/shared/verifier/languageRegistry.v0.1";
import { runVerifierRulesV0_1 } from "@/shared/verifier/verifierRules.v0.1";
import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";

describe("languageRegistry v0.1 — isKnownLanguageV0_1", () => {
  describe("accepts canonical English names", () => {
    it.each([
      "Albanian",
      "Latin",
      "English",
      "Mandarin",
      "Arabic",
      "Hebrew",
      "Finnish",
      "Sanskrit",
      "Ancient Greek",
    ])("accepts '%s'", (name) => {
      expect(isKnownLanguageV0_1(name)).toBe(true);
    });
  });

  describe("accepts ISO 639-3 codes", () => {
    it.each([
      ["sqi", "Albanian"],
      ["lat", "Latin"],
      ["eng", "English"],
      ["cmn", "Mandarin"],
      ["arb", "Arabic"],
      ["grc", "Ancient Greek"],
      ["san", "Sanskrit"],
    ])("accepts code '%s' for %s", (code) => {
      expect(isKnownLanguageV0_1(code)).toBe(true);
    });
  });

  describe("accepts ISO 639-1 aliases via explicit map", () => {
    it.each([
      ["sq", "Albanian"],
      ["la", "Latin"],
      ["en", "English"],
      ["zh", "Mandarin"],
      ["ar", "Arabic"],
      ["he", "Hebrew"],
    ])("accepts alias '%s' for %s", (alias) => {
      expect(isKnownLanguageV0_1(alias)).toBe(true);
    });
  });

  describe("rejects unknown/fictional/constructed languages", () => {
    it.each([
      "Klingon",
      "Quenya",
      "Sindarin",
      "Esperanto",
      "Volapük",
      "Interlingua",
      "asdfghjkl",
      "NotALanguage",
    ])("rejects '%s'", (name) => {
      expect(isKnownLanguageV0_1(name)).toBe(false);
    });
  });

  describe("rejects malformed input", () => {
    it("rejects empty string", () => {
      expect(isKnownLanguageV0_1("")).toBe(false);
    });
    it("rejects whitespace only", () => {
      expect(isKnownLanguageV0_1("   ")).toBe(false);
    });
    it("rejects null", () => {
      expect(isKnownLanguageV0_1(null)).toBe(false);
    });
    it("rejects undefined", () => {
      expect(isKnownLanguageV0_1(undefined)).toBe(false);
    });
    it("rejects number", () => {
      expect(isKnownLanguageV0_1(42)).toBe(false);
    });
    it("rejects object", () => {
      expect(isKnownLanguageV0_1({ language: "Albanian" })).toBe(false);
    });
  });

  describe("normalization (case + whitespace)", () => {
    it("accepts lowercase canonical name", () => {
      expect(isKnownLanguageV0_1("albanian")).toBe(true);
    });
    it("accepts uppercase canonical name", () => {
      expect(isKnownLanguageV0_1("ALBANIAN")).toBe(true);
    });
    it("accepts mixed case", () => {
      expect(isKnownLanguageV0_1("aLbAnIaN")).toBe(true);
    });
    it("accepts leading/trailing whitespace", () => {
      expect(isKnownLanguageV0_1("  Albanian  ")).toBe(true);
    });
    it("accepts uppercase ISO 639-3 code", () => {
      expect(isKnownLanguageV0_1("SQI")).toBe(true);
    });
  });
});

describe("LANG_KNOWN rule — integration via runVerifierRulesV0_1", () => {
  const baseArgs = {
    mode: "strict" as const,
    opsUsedRaw: [],
    extractedVowelPath: ["E"],
  };

  it("passes when language is known (canonical name)", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: { form: "test", language: "Albanian", decomposition: { statement: "test" } },
    });
    const langCheck = checks.find((c) => c.id === "LANG_KNOWN");
    expect(langCheck?.pass).toBe(true);
  });

  it("passes when language is known (ISO 639-3 code)", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: { form: "test", language: "sqi", decomposition: { statement: "test" } },
    });
    const langCheck = checks.find((c) => c.id === "LANG_KNOWN");
    expect(langCheck?.pass).toBe(true);
  });

  it("passes when language is known (ISO 639-1 alias)", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: { form: "test", language: "sq", decomposition: { statement: "test" } },
    });
    const langCheck = checks.find((c) => c.id === "LANG_KNOWN");
    expect(langCheck?.pass).toBe(true);
  });

  it("fails when language is missing", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: { form: "test", decomposition: { statement: "test" } },
    });
    const langCheck = checks.find((c) => c.id === "LANG_KNOWN");
    expect(langCheck?.pass).toBe(false);
    expect(langCheck?.reason).toMatch(/empty or missing/i);
  });

  it("fails when language is empty string", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: { form: "test", language: "", decomposition: { statement: "test" } },
    });
    const langCheck = checks.find((c) => c.id === "LANG_KNOWN");
    expect(langCheck?.pass).toBe(false);
  });

  it("fails when language is fictional (Klingon)", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: { form: "test", language: "Klingon", decomposition: { statement: "test" } },
    });
    const langCheck = checks.find((c) => c.id === "LANG_KNOWN");
    expect(langCheck?.pass).toBe(false);
    expect(langCheck?.reason).toMatch(/not a documented human language/i);
  });

  it("returns 5 checks total (not 4)", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: { form: "test", language: "Albanian", decomposition: { statement: "test" } },
    });
    expect(checks).toHaveLength(5);
    expect(checks.map((c) => c.id).sort()).toEqual(
      ["DECOMP_PRESENT", "LANG_KNOWN", "OPS_ALLOWED", "PATH_MATCH", "ROOT_HAS_VOWEL"].sort()
    );
  });
});

describe("LANG_KNOWN rule — hard-fail semantics via verifyProposalV0_1", () => {
  it("candidate with valid language passes overall", () => {
    const out = verifyProposalV0_1({
      word: "test",
      mode: "strict",
      candidates: [
        {
          form: "test",
          language: "English",
          opsUsed: [],
          decomposition: { statement: "test" },
        },
      ],
    } as any);
    expect(out.results[0].pass).toBe(true);
    expect(out.overallPass).toBe(true);
  });

  it("candidate with missing language hard-fails overall pass", () => {
    const out = verifyProposalV0_1({
      word: "test",
      mode: "strict",
      candidates: [
        {
          form: "test",
          opsUsed: [],
          decomposition: { statement: "test" },
        },
      ],
    } as any);
    expect(out.results[0].pass).toBe(false);
    expect(out.results[0].checks.find((c) => c.id === "LANG_KNOWN")?.pass).toBe(false);
    expect(out.overallPass).toBe(false);
  });

  it("candidate with Klingon hard-fails overall pass", () => {
    const out = verifyProposalV0_1({
      word: "test",
      mode: "strict",
      candidates: [
        {
          form: "test",
          language: "Klingon",
          opsUsed: [],
          decomposition: { statement: "test" },
        },
      ],
    } as any);
    expect(out.results[0].pass).toBe(false);
    expect(out.overallPass).toBe(false);
  });
});
