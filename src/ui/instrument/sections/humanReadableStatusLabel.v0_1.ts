const STATUS_LABELS: Readonly<Record<string, string>> = {
  UNKNOWN_OR_NULL: "Not established",
  PARTIAL_NULL: "Explanation incomplete",
  COMPLETE_PROPOSED: "Proposal complete — not verified",
  MULTIPLE_PROPOSED: "More than one proposal; none selected",
  SOURCE_FACT: "Source-reported evidence",
  SOURCE_REPORTED: "Source-reported",
  LOGICAL_INFERENCE: "Logical inference",
  USER_PROPOSAL: "Your proposal",
  USER_PROPOSED: "Proposed by you",
  EXPLORATORY_HYPOTHESIS: "Exploratory proposal",
  EXPLORATORY_FUNCTIONAL_HYPOTHESIS: "Exploratory proposal",
  CITATION_ENTERED_UNVERIFIED: "Citation not independently verified",
  DERIVED_STRUCTURE: "Observed spelling structure",
  NOT_ESTABLISHED: "Not established",
  NOT_ASSESSED: "Not assessed",
  NOT_CLAIMED: "Not claimed",
  NONE: "None",
  UNSELECTED: "Not selected",
  MATCHES_FOUND: "Matching records found",
  MATCH: "Matches",
  MISMATCH: "Does not match",
  NOT_COMPUTED: "Not checked",
  SOURCE_NOT_FOUND: "No exact source record found",
  UNAVAILABLE: "Unavailable",
  NOT_QUERIED: "Not checked",
  NOT_EMITTED: "Not available in this analysis",
  NOT_APPLICABLE_FOR_LANGUAGE: "Not applicable for this language",
  WITHHELD_INPUT_MISMATCH: "Withheld because the analyzed form differs",
  USER_DECLARED_UNVERIFIED: "Entered by you; not verified",
  EXAMINED: "Replay completed",
  COMPLETE: "Complete",
  NOT_SUBMITTED: "Not submitted",
  CONDITIONAL_SUGGESTION: "Conditional suggestion",
  INVALID: "Needs correction",
  SUPPORTED: "Available for this analysis",
  UNRESOLVED_ROLE: "Role not selected",
  candidate_only: "Candidate only; not verified",
  no_single_winner: "No option is selected automatically",
  user_decides: "You decide",
  sourceAuthorityPromotion: "Source authority",
  historicalOrigin: "Historical origin",
  explicit_profile_binding_without_spoken_authority:
    "Profile information is available; spoken pronunciation authority is not",
};

/** Converts contract status tokens to readable labels without changing their stored values. */
export function humanReadableStatusLabelV0_1(
  status: string | null | undefined,
  fallback = "Not established",
): string {
  if (status == null || status.trim() === "") return fallback;
  const label = STATUS_LABELS[status];
  if (label) return label;
  if (/^[A-Z0-9_]+$/.test(status) || /^[a-z0-9]+(?:_[a-z0-9]+)+$/.test(status)) {
    const words = status.replace(/_/g, " ").toLocaleLowerCase("en");
    return words.charAt(0).toLocaleUpperCase("en") + words.slice(1);
  }
  return status;
}

export function humanReadableStatusTextV0_1(text: string): string {
  return text.replace(/\b(?:[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+|no_single_winner|user_decides|sourceAuthorityPromotion|historicalOrigin)\b/g,
    (status) => humanReadableStatusLabelV0_1(status));
}
