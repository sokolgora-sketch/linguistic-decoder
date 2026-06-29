import { evaluateReviewedExternalLexiconEvidenceGateV0_1 } from "../../../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";

const KNOWN_REASON_CODES_V0_1 = [
  "sourceKind_seed_not_validation",
  "di_composition_bridge_missing",
  "da_quarantine_missing_reviewed_exact_external_citation",
] as const;

export type ReviewedExternalLexiconFixtureGateAdapterProjectionV0_1 = {
  sourceId: string;
  candidateId: string;
  fixtureOnly: true;
  accepted: boolean;
  blocked: boolean;
  reasons: string[];
  resultText: string;
  rawResult: unknown;
};

function flattenStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

function rowStringField(row: unknown, key: string): string {
  if (!row || typeof row !== "object") return "unknown";
  const value = (row as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "unknown";
}

export function evaluateReviewedExternalLexiconFixtureGateRowV0_1(
  row: unknown,
): ReviewedExternalLexiconFixtureGateAdapterProjectionV0_1 {
  const rawResult = evaluateReviewedExternalLexiconEvidenceGateV0_1(row as never);
  const resultText = flattenStrings(rawResult).join("\n");
  const reasons = KNOWN_REASON_CODES_V0_1.filter((reason) => resultText.includes(reason));

  const blocked =
    reasons.length > 0 || /block|fail|reject|missing|quarantine|not_validation/i.test(resultText);

  const accepted = !blocked && /pass|valid|accepted/i.test(resultText);

  return {
    sourceId: rowStringField(row, "sourceId"),
    candidateId: rowStringField(row, "candidateId"),
    fixtureOnly: true,
    accepted,
    blocked,
    reasons: [...reasons],
    resultText,
    rawResult,
  };
}
