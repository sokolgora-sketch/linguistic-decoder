import { extractSevenVowelsFromString, type SevenVowel } from "@/shared/math7.core";

export type PathMatchMismatchKind =
  | "MISSING_VOWEL_PATH"
  | "PATH_LENGTH_MISMATCH"
  | "PATH_SYMBOL_MISMATCH"
  | "PATH_ORDER_MISMATCH"
  | "EXTRA_DECOMPOSITION_MATERIAL"
  | "MISSING_DECOMPOSITION_MATERIAL"
  | "FORM_CHANGED_DURING_REPAIR"
  | "LANGUAGE_CHANGED_DURING_REPAIR"
  | "UNKNOWN_PATH_MISMATCH";

export type PathMatchExtractionMaterial = {
  form: string;
  decompositionText?: string;
  rootMaterial?: string;
};

export type PathMatchRepairScaffoldInput = {
  failedCheckId: "PATH_MATCH" | string;
  failedReason: string;
  acceptedForm: string;
  candidateLanguage: string;
  declaredVowelPath?: string[];
  extractedVowelPath?: string[];
  extractionMaterial?: Partial<PathMatchExtractionMaterial>;
  previousAcceptedForm?: string;
  previousCandidateLanguage?: string;
  previousDecompositionText?: string;
  decompositionText?: string;
};

export type PathMatchRepairScaffold = {
  failedCheckId: string;
  failedReason: string;
  acceptedForm: string;
  candidateLanguage: string;
  declaredVowelPath: string[];
  extractedVowelPath: string[];
  vowelPathPresent: boolean;
  mismatchKind: PathMatchMismatchKind;
  extractionMaterial: PathMatchExtractionMaterial;
  formChanged: boolean;
  languageChanged: boolean;
  decompositionChanged: boolean;
  allowedRepairActions: string[];
  blockedRepairActions: string[];
  repairInstruction: string;
};

export function extractSevenVoicePath(input: string): SevenVowel[] {
  return extractSevenVowelsFromString(input);
}

function samePath(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function sameMultiset(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return [...a].sort().join("|") === [...b].sort().join("|");
}

export function classifyPathMatchMismatch(params: {
  vowelPathPresent: boolean;
  declaredVowelPath: string[];
  extractedVowelPath: string[];
  formChanged: boolean;
  languageChanged: boolean;
}): PathMatchMismatchKind {
  if (params.formChanged) return "FORM_CHANGED_DURING_REPAIR";
  if (params.languageChanged) return "LANGUAGE_CHANGED_DURING_REPAIR";
  if (!params.vowelPathPresent) return "MISSING_VOWEL_PATH";

  if (samePath(params.declaredVowelPath, params.extractedVowelPath)) {
    return "UNKNOWN_PATH_MISMATCH";
  }

  if (params.declaredVowelPath.length !== params.extractedVowelPath.length) {
    return "PATH_LENGTH_MISMATCH";
  }

  if (sameMultiset(params.declaredVowelPath, params.extractedVowelPath)) {
    return "PATH_ORDER_MISMATCH";
  }

  return "PATH_SYMBOL_MISMATCH";
}

function buildAllowedRepairActions(): string[] {
  return [
    "recompute_vowel_path_from_extracted_material",
    "correct_decomposition_if_it_caused_the_mismatch",
    "preserve_accepted_form",
    "preserve_language_unless_unsupported",
    "fail_honestly_if_truthful_repair_is_impossible",
  ];
}

function buildBlockedRepairActions(): string[] {
  return [
    "do_not_change_form_only_to_satisfy_PATH_MATCH",
    "do_not_change_language_only_to_satisfy_PATH_MATCH",
    "do_not_invent_vowels",
    "do_not_remove_vowelPath_to_bypass_checking",
    "do_not_weaken_PATH_MATCH",
    "do_not_hide_repeated_failures",
  ];
}

function buildRepairInstruction(kind: PathMatchMismatchKind): string {
  switch (kind) {
    case "MISSING_VOWEL_PATH":
      return "Provide vowelPath computed from the accepted form/root material; do not omit vowelPath in strict repair mode.";
    case "FORM_CHANGED_DURING_REPAIR":
      return "Restore the previous accepted form unless a justified variant/proto-form operation is explicitly allowed.";
    case "LANGUAGE_CHANGED_DURING_REPAIR":
      return "Restore the previous candidate language unless the original language is unsupported or contradicted.";
    case "PATH_LENGTH_MISMATCH":
    case "PATH_SYMBOL_MISMATCH":
    case "PATH_ORDER_MISMATCH":
      return "Keep the accepted form fixed and recompute vowelPath from the extracted material.";
    case "EXTRA_DECOMPOSITION_MATERIAL":
      return "Remove unsupported decomposition material and recompute vowelPath from the accepted form/root material.";
    case "MISSING_DECOMPOSITION_MATERIAL":
      return "Add only truthful decomposition material supported by the accepted form/root material, then recompute vowelPath.";
    case "UNKNOWN_PATH_MISMATCH":
    default:
      return "Inspect the declared and extracted vowel paths, preserve candidate truth, and fail honestly if no truthful repair exists.";
  }
}

export function buildPathMatchRepairScaffold(
  input: PathMatchRepairScaffoldInput,
): PathMatchRepairScaffold {
  const declaredVowelPath = input.declaredVowelPath ?? [];
  const vowelPathPresent = Array.isArray(input.declaredVowelPath);
  const extractionMaterial: PathMatchExtractionMaterial = {
    form: input.extractionMaterial?.form ?? input.acceptedForm,
    decompositionText: input.extractionMaterial?.decompositionText ?? input.decompositionText ?? "",
    rootMaterial: input.extractionMaterial?.rootMaterial ?? "",
  };
  const extractedVowelPath =
    input.extractedVowelPath ?? extractSevenVoicePath(extractionMaterial.form);
  const formChanged =
    typeof input.previousAcceptedForm === "string" &&
    input.previousAcceptedForm !== input.acceptedForm;
  const languageChanged =
    typeof input.previousCandidateLanguage === "string" &&
    input.previousCandidateLanguage !== input.candidateLanguage;
  const decompositionChanged =
    typeof input.previousDecompositionText === "string" &&
    input.previousDecompositionText !== (input.decompositionText ?? "");
  const mismatchKind = classifyPathMatchMismatch({
    vowelPathPresent,
    declaredVowelPath,
    extractedVowelPath,
    formChanged,
    languageChanged,
  });

  return {
    failedCheckId: input.failedCheckId,
    failedReason: input.failedReason,
    acceptedForm: input.acceptedForm,
    candidateLanguage: input.candidateLanguage,
    declaredVowelPath,
    extractedVowelPath,
    vowelPathPresent,
    mismatchKind,
    extractionMaterial,
    formChanged,
    languageChanged,
    decompositionChanged,
    allowedRepairActions: buildAllowedRepairActions(),
    blockedRepairActions: buildBlockedRepairActions(),
    repairInstruction: buildRepairInstruction(mismatchKind),
  };
}
