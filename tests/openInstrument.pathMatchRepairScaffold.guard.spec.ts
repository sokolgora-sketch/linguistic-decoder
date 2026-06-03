import {
  buildPathMatchRepairScaffold,
  extractSevenVoicePath,
} from "../src/shared/llm/repair/pathMatchRepairScaffold.v0.1";

describe("Open Instrument PATH_MATCH repair scaffold", () => {
  it("classifies missing vowelPath", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "No vowelPath provided.",
      acceptedForm: "study",
      candidateLanguage: "English",
      extractedVowelPath: ["U", "Y"],
    });

    expect(scaffold.vowelPathPresent).toBe(false);
    expect(scaffold.declaredVowelPath).toEqual([]);
    expect(scaffold.extractedVowelPath).toEqual(["U", "Y"]);
    expect(scaffold.mismatchKind).toBe("MISSING_VOWEL_PATH");
  });

  it("classifies path length mismatch", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "vowelPath length mismatch.",
      acceptedForm: "damage",
      candidateLanguage: "English",
      declaredVowelPath: ["A"],
      extractedVowelPath: ["A", "E"],
    });

    expect(scaffold.mismatchKind).toBe("PATH_LENGTH_MISMATCH");
  });

  it("classifies path symbol mismatch", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "vowelPath symbol mismatch.",
      acceptedForm: "damage",
      candidateLanguage: "English",
      declaredVowelPath: ["A", "I"],
      extractedVowelPath: ["A", "E"],
    });

    expect(scaffold.mismatchKind).toBe("PATH_SYMBOL_MISMATCH");
  });

  it("classifies path order mismatch", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "vowelPath order mismatch.",
      acceptedForm: "ai",
      candidateLanguage: "English",
      declaredVowelPath: ["I", "A"],
      extractedVowelPath: ["A", "I"],
    });

    expect(scaffold.mismatchKind).toBe("PATH_ORDER_MISMATCH");
  });

  it("classifies form changes during repair before path mismatch classification", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "form changed.",
      acceptedForm: "studie",
      previousAcceptedForm: "study",
      candidateLanguage: "English",
      declaredVowelPath: ["U", "I", "E"],
      extractedVowelPath: ["U", "I", "E"],
    });

    expect(scaffold.formChanged).toBe(true);
    expect(scaffold.mismatchKind).toBe("FORM_CHANGED_DURING_REPAIR");
  });

  it("classifies language changes during repair before path mismatch classification", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "language changed.",
      acceptedForm: "study",
      candidateLanguage: "Latin",
      previousCandidateLanguage: "English",
      declaredVowelPath: ["U", "Y"],
      extractedVowelPath: ["U", "Y"],
    });

    expect(scaffold.languageChanged).toBe(true);
    expect(scaffold.mismatchKind).toBe("LANGUAGE_CHANGED_DURING_REPAIR");
  });

  it("tracks decomposition changes", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "decomposition changed.",
      acceptedForm: "study",
      candidateLanguage: "English",
      declaredVowelPath: ["U", "Y"],
      extractedVowelPath: ["U", "Y"],
      previousDecompositionText: "action: study",
      decompositionText: "action: learn",
    });

    expect(scaffold.decompositionChanged).toBe(true);
  });

  it("includes allowed and blocked repair actions", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "vowelPath mismatch.",
      acceptedForm: "study",
      candidateLanguage: "English",
      declaredVowelPath: ["U"],
      extractedVowelPath: ["U", "Y"],
    });

    expect(scaffold.allowedRepairActions).toEqual(
      expect.arrayContaining([
        "recompute_vowel_path_from_extracted_material",
        "preserve_accepted_form",
        "preserve_language_unless_unsupported",
        "fail_honestly_if_truthful_repair_is_impossible",
      ]),
    );
    expect(scaffold.blockedRepairActions).toEqual(
      expect.arrayContaining([
        "do_not_change_form_only_to_satisfy_PATH_MATCH",
        "do_not_change_language_only_to_satisfy_PATH_MATCH",
        "do_not_invent_vowels",
        "do_not_remove_vowelPath_to_bypass_checking",
        "do_not_weaken_PATH_MATCH",
      ]),
    );
  });

  it("extracts Seven-Voice path from study under current Open Instrument behavior", () => {
    expect(extractSevenVoicePath("study")).toEqual(["U", "Y"]);
  });

  it("extracts Seven-Voice path from mathematics under current Open Instrument behavior", () => {
    expect(extractSevenVoicePath("mathematics")).toEqual(["A", "E", "A", "I"]);
  });

  it("generates a direct repair instruction", () => {
    const scaffold = buildPathMatchRepairScaffold({
      failedCheckId: "PATH_MATCH",
      failedReason: "vowelPath mismatch.",
      acceptedForm: "damage",
      candidateLanguage: "English",
      declaredVowelPath: ["A", "I"],
      extractedVowelPath: ["A", "E"],
    });

    expect(scaffold.repairInstruction).toContain("recompute vowelPath");
    expect(scaffold.repairInstruction).toContain("accepted form");
  });
});
