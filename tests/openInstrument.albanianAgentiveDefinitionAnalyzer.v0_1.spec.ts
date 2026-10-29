import {
  ALBANIAN_AGENTIVE_DEFINITION_ANALYSIS_AUTHORITY_V0_1,
  analyzeAlbanianAgentiveDefinitionV0_1,
  type AlbanianAgentiveDefinitionAnalyzerInputV0_1,
} from "@/shared/openInstrument/albanianAgentiveDefinitionAnalyzer.v0_1";

function analyze(
  definitionText: string,
  overrides: Partial<AlbanianAgentiveDefinitionAnalyzerInputV0_1> = {},
) {
  return analyzeAlbanianAgentiveDefinitionV0_1({
    headword: "fixture-headword",
    definitionText,
    posTag: "emër",
    sourceRowOrdinal: 7,
    ...overrides,
  });
}

describe("Albanian agentive definition analyzer v0.1", () => {
  it("recognizes the reusable role-head plus genitive-complement rule", () => {
    const result = analyze("Bari pelash");

    expect(result).toMatchObject({
      classification: "HUMAN_AGENT_ROLE",
      matchedPattern: "ROLE_HEAD_WITH_GENITIVE_PLURAL_COMPLEMENT",
      headword: "fixture-headword",
      sourceRowOrdinal: 7,
      analysisAuthority: ALBANIAN_AGENTIVE_DEFINITION_ANALYSIS_AUTHORITY_V0_1,
      reasonCodes: ["ROLE_HEAD_COMPLEMENT_CONSTRUCTION_MATCHED"],
      evidenceSpan: { start: 0, end: "Bari pelash".length, text: "Bari pelash" },
    });
    expect(result).not.toHaveProperty("functionalOperation");
    expect(result).not.toHaveProperty("sourceRelation");
    expect(result).not.toHaveProperty("sourceAuthoredRoleLabel");
  });

  it("generalizes the same bounded phrase rule to the hold-out Bari delesh", () => {
    expect(analyze("Bari delesh")).toMatchObject({
      classification: "HUMAN_AGENT_ROLE",
      matchedPattern: "ROLE_HEAD_WITH_GENITIVE_PLURAL_COMPLEMENT",
      evidenceSpan: { text: "Bari delesh" },
    });
  });

  it.each([
    ["Ai që merret me mbarështimin e bletëve", "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE"],
    ["Personi që shet lule", "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE"],
    ["Mjeshtri që rregullon orët", "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE"],
    ["Ajo që bën bukë", "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE"],
    ["Njeriu që punon me bletë", "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE"],
  ] as const)("recognizes explicit human role construction: %s", (definitionText, matchedPattern) => {
    expect(analyze(definitionText)).toMatchObject({
      classification: "HUMAN_AGENT_ROLE",
      matchedPattern,
      evidenceSpan: { text: definitionText },
    });
  });

  it("classifies a biological head noun without promoting its relative clause to a human role", () => {
    expect(analyze("Kafshë që jeton në ujë")).toMatchObject({
      classification: "ANIMAL_OR_BIOLOGICAL",
      matchedPattern: "ANIMAL_OR_BIOLOGICAL_SEMANTIC_HEAD",
      evidenceSpan: { text: "Kafshë që jeton në ujë" },
    });
  });

  it.each(["Ai që nuk shet lule", "Ajo që s’punon me bletë"])(
    "does not classify a negated action as a human agent role: %s",
    (definitionText) => {
      expect(analyze(definitionText)).toMatchObject({
        classification: "UNKNOWN_OR_NULL",
        matchedPattern: "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE",
        reasonCodes: ["AGENT_PREDICATE_NEGATED"],
      });
    },
  );

  it("classifies an animal semantic head even when its clause contains an action", () => {
    expect(analyze("Kafshë që shet lule")).toMatchObject({
      classification: "ANIMAL_OR_BIOLOGICAL",
      matchedPattern: "ANIMAL_OR_BIOLOGICAL_SEMANTIC_HEAD",
    });
  });

  it("distinguishes activity and instrument definitions from human roles", () => {
    expect(analyze("Veprimtaria e gjuetisë")).toMatchObject({
      classification: "ACTIVITY_OR_PROCESS",
      matchedPattern: "ACTIVITY_OR_PROCESS_NOMINAL_HEAD",
    });
    expect(analyze("Mjet që përdoret për të prerë")).toMatchObject({
      classification: "INSTRUMENT_OR_TOOL",
      matchedPattern: "INSTRUMENT_PURPOSE_CONSTRUCTION",
    });
  });

  it("requires adjective POS evidence for a relative property definition", () => {
    expect(analyze("Që lidhet me kombin", { posTag: "mbiemër" })).toMatchObject({
      classification: "ADJECTIVE_OR_PROPERTY",
      matchedPattern: "ADJECTIVE_RELATIVE_PROPERTY_WITH_ADJECTIVE_POS",
    });
    expect(analyze("Që lidhet me kombin", { posTag: "unknown" })).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      reasonCodes: ["ADJECTIVE_POS_REQUIRED_FOR_PROPERTY_FRAME"],
    });
  });

  it("recognizes explicit citizenship without treating residence as nationality", () => {
    expect(analyze("Shtetas i Shqipërisë")).toMatchObject({
      classification: "DEMONYM_OR_NATIONALITY",
      matchedPattern: "EXPLICIT_CITIZENSHIP_OR_NATIONALITY_DESCRIPTION",
    });
    expect(analyze("Banor i Shqipërisë")).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      matchedPattern: "GEOGRAPHIC_RESIDENCE_IS_NOT_NATIONALITY",
      reasonCodes: ["GEOGRAPHIC_RESIDENCE_DOES_NOT_ESTABLISH_NATIONALITY"],
    });
  });

  it("does not read Bari i gjelbër or bare role-head ambiguity as human-agent evidence", () => {
    for (const definitionText of ["Bari i gjelbër", "Bari"]) {
      expect(analyze(definitionText)).toMatchObject({ classification: "UNKNOWN_OR_NULL" });
    }
    expect(analyze("Bari i gjelbër").reasonCodes).toContain(
      "ROLE_COMPLEMENT_STRUCTURE_UNRESOLVED",
    );
    expect(analyze("Bari").reasonCodes).toContain("ROLE_HEAD_REQUIRES_QUALIFIED_COMPLEMENT");
  });

  it("keeps bare Qymyrbërës, Shqiptar, Kombëtar and suffix-shaped headwords unresolved", () => {
    for (const headword of ["Qymyrbërës", "Shqiptar", "Kombëtar", "shkencëtar"]) {
      expect(analyze(headword, { headword })).toMatchObject({
        classification: "UNKNOWN_OR_NULL",
        matchedPattern: "BARE_LEXICAL_REFERENCE",
        reasonCodes: ["INSUFFICIENT_ANALYZED_CONTEXT"],
      });
    }
  });

  it("does not promote role words occurring in illustrative examples", () => {
    expect(analyze("P.sh. Bari pelash")).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      matchedPattern: null,
      reasonCodes: ["ILLUSTRATIVE_EXAMPLE_IS_NOT_HEADWORD_EVIDENCE"],
    });
    expect(analyze("Një term. Bari pelash")).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      matchedPattern: "MULTI_CLAUSE_DEFINITION",
      reasonCodes: ["MULTI_CLAUSE_CONTEXT_UNRESOLVED"],
    });
  });

  it("fails closed when separate clauses contain conflicting descriptive signals", () => {
    expect(analyze("Personi që shet lule; Veprimtaria e gjuetisë")).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      matchedPattern: "MULTI_CLAUSE_DEFINITION",
      reasonCodes: ["CONFLICTING_DEFINITION_SIGNALS"],
    });
  });

  it("does not classify figurative cues as occupational-role evidence", () => {
    expect(analyze("Personi që shet ëndrra në kuptim figurativ")).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      reasonCodes: ["FIGURATIVE_CUE_REQUIRES_REVIEW"],
    });
  });

  it("preserves case, Albanian diacritics and an original-text evidence span", () => {
    const uppercase = analyze("PERSONI QË SHET ÇAJ");
    expect(uppercase).toMatchObject({ classification: "HUMAN_AGENT_ROLE" });
    expect(uppercase.evidenceSpan?.text).toBe("PERSONI QË SHET ÇAJ");

    const decomposed = "Mjeshtri qe\u0308 rregullon ore\u0308t";
    const normalized = analyze(decomposed);
    expect(normalized).toMatchObject({ classification: "HUMAN_AGENT_ROLE" });
    expect(normalized.evidenceSpan?.text).toBe(decomposed);
    expect(decomposed.slice(normalized.evidenceSpan?.start, normalized.evidenceSpan?.end)).toBe(
      normalized.evidenceSpan?.text,
    );
  });

  it("classifies from definition text, not from the headword, and preserves both identities", () => {
    const result = analyze("Bari pelash", {
      headword: "another-headword",
      sourceRowOrdinal: 42,
    });
    expect(result).toMatchObject({
      classification: "HUMAN_AGENT_ROLE",
      headword: "another-headword",
      sourceRowOrdinal: 42,
      definitionText: "Bari pelash",
    });
  });

  it("keeps absent row ordinals Null and preserves the exact input definition", () => {
    const definitionText = "  Bari pelash  ";
    expect(analyze(definitionText, { sourceRowOrdinal: null })).toMatchObject({
      classification: "HUMAN_AGENT_ROLE",
      definitionText,
      sourceRowOrdinal: null,
      evidenceSpan: { text: "Bari pelash" },
    });
  });

  it("returns explicit Null for empty or malformed runtime inputs", () => {
    expect(analyze("")).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      reasonCodes: ["ANALYZER_DEFINITION_EMPTY"],
    });

    const malformed = {
      headword: "bari",
      definitionText: 42,
      posTag: null,
      sourceRowOrdinal: 0,
    } as unknown as AlbanianAgentiveDefinitionAnalyzerInputV0_1;
    expect(analyzeAlbanianAgentiveDefinitionV0_1(malformed)).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      definitionText: null,
      reasonCodes: ["ANALYZER_INPUT_INVALID"],
    });
  });

  it("rejects invalid ordinals and incompatible adjective POS for human-role text", () => {
    const invalidOrdinal = {
      headword: "fixture",
      definitionText: "Personi që shet lule",
      posTag: "emër",
      sourceRowOrdinal: -1,
    } as unknown as AlbanianAgentiveDefinitionAnalyzerInputV0_1;
    expect(analyzeAlbanianAgentiveDefinitionV0_1(invalidOrdinal)).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      reasonCodes: ["ANALYZER_INPUT_INVALID"],
    });

    expect(analyze("Personi që shet lule", { posTag: "mbiemër" })).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      reasonCodes: ["HEADWORD_POS_CONFLICTS_WITH_HUMAN_ROLE_TEXT"],
    });
  });

  it("does not treat an arbitrary relative clause as a human role", () => {
    expect(analyze("Një gjë që lëviz")).toMatchObject({
      classification: "UNKNOWN_OR_NULL",
      matchedPattern: null,
      reasonCodes: ["ANALYZER_TEXT_ONLY_NOT_SOURCE_AUTHORITY", "NO_SUPPORTED_DEFINITION_PATTERN"],
    });
  });

  it("returns deterministic, frozen results on repeated calls", () => {
    const first = analyze("Ai që merret me mbarështimin e bletëve");
    const second = analyze("Ai që merret me mbarështimin e bletëve");
    expect(second).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.reasonCodes)).toBe(true);
  });
});
