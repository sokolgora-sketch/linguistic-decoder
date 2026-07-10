import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
  ReviewedExternalLexiconCitationV0_1,
} from "./reviewedExternalLexiconEvidenceGate.validator.v0_1";

export type ReviewedExternalLexiconFunctionalReadinessItemV0_1 = {
  id:
    | "source_reviewed_accepted"
    | "external_lexical_citation_reviewed_accepted"
    | "isolated_form_present"
    | "plain_gloss_present"
    | "exact_attested_form_present"
    | "compatible_attested_gloss_present"
    | "functional_bridge_present"
    | "user_decision_posture_present"
    | "historical_origin_not_claimed"
    | "historical_transmission_not_claimed"
    | "winner_not_claimed"
    | "candidate_truth_not_claimed";
  label: string;
  passed: boolean;
};

export type ReviewedExternalLexiconFunctionalReadinessV0_1 = {
  readinessVersion: "reviewed-external-lexicon-functional-readiness.v0_1";
  sourceId: string;
  candidateId: string;
  functionalReady: boolean;
  historicalOriginClaim: "not_claimed";
  userDecisionPosture: "user_decides" | null;
  items: ReviewedExternalLexiconFunctionalReadinessItemV0_1[];
};

const INTERNAL_CITATION_TYPES = new Set([
  "project_doc",
  "project_fixture",
  "project_snapshot",
  "seed_row",
  "model_output",
]);

function normalize(value: unknown): string {
  return typeof value === "string"
    ? value.trim().toLocaleLowerCase("en-US")
    : "";
}

function hasText(value: unknown): boolean {
  return normalize(value).length > 0;
}

function externalReviewedCitations(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): ReviewedExternalLexiconCitationV0_1[] {
  return row.externalCitations.filter(
    (citation) =>
      citation.citationStatus === "reviewed_accepted" &&
      !INTERNAL_CITATION_TYPES.has(citation.citationType),
  );
}

function hasExactAttestedForm(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
  citations: readonly ReviewedExternalLexiconCitationV0_1[],
): boolean {
  const expectedForms = new Set(
    [row.embryo, row.isolatedStandaloneForm]
      .map(normalize)
      .filter(Boolean),
  );

  return citations.some((citation) =>
    expectedForms.has(normalize(citation.attestedForm)),
  );
}

function hasCompatibleAttestedGloss(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
  citations: readonly ReviewedExternalLexiconCitationV0_1[],
): boolean {
  const expectedGloss = normalize(row.plainStandaloneGloss);

  if (!expectedGloss) return false;

  const expectedTerms = expectedGloss
    .split(/[^a-zëç]+/u)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3);

  return citations.some((citation) => {
    const attestedGloss = normalize(citation.attestedGloss);

    return (
      attestedGloss.length > 0 &&
      expectedTerms.some((term) => attestedGloss.includes(term))
    );
  });
}

export function buildReviewedExternalLexiconFunctionalReadinessV0_1(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): ReviewedExternalLexiconFunctionalReadinessV0_1 {
  const citations = externalReviewedCitations(row);

  const items: ReviewedExternalLexiconFunctionalReadinessItemV0_1[] = [
    {
      id: "source_reviewed_accepted",
      label: "The source row has reviewed-accepted status.",
      passed: row.sourceStatus === "reviewed_accepted",
    },
    {
      id: "external_lexical_citation_reviewed_accepted",
      label: "At least one external lexical citation is reviewed and accepted.",
      passed: citations.length > 0,
    },
    {
      id: "isolated_form_present",
      label: "An isolated standalone form is recorded.",
      passed: hasText(row.isolatedStandaloneForm),
    },
    {
      id: "plain_gloss_present",
      label: "A bounded standalone lexical gloss is recorded.",
      passed: hasText(row.plainStandaloneGloss),
    },
    {
      id: "exact_attested_form_present",
      label: "A reviewed citation attests the exact isolated form or embryo.",
      passed: hasExactAttestedForm(row, citations),
    },
    {
      id: "compatible_attested_gloss_present",
      label: "A reviewed citation supplies a compatible lexical gloss.",
      passed: hasCompatibleAttestedGloss(row, citations),
    },
    {
      id: "functional_bridge_present",
      label: "The functional bridge is explicit.",
      passed: hasText(row.semanticBridge),
    },
    {
      id: "user_decision_posture_present",
      label: "The result remains user-decidable.",
      passed: row.userDecisionPosture === "user_decides",
    },
    {
      id: "historical_origin_not_claimed",
      label: "No historical-origin claim is made.",
      passed: row.originClaim === false,
    },
    {
      id: "historical_transmission_not_claimed",
      label: "No historical-transmission claim is made.",
      passed: row.historicalTransmissionClaim === false,
    },
    {
      id: "winner_not_claimed",
      label: "No historical or linguistic winner is declared.",
      passed: row.winnerClaim === false,
    },
    {
      id: "candidate_truth_not_claimed",
      label: "Functional readiness does not promote the candidate to truth.",
      passed: row.candidateTruthClaim === false,
    },
  ];

  return {
    readinessVersion:
      "reviewed-external-lexicon-functional-readiness.v0_1",
    sourceId: row.sourceId,
    candidateId: row.candidateId,
    functionalReady: items.every((item) => item.passed),
    historicalOriginClaim: "not_claimed",
    userDecisionPosture: row.userDecisionPosture,
    items,
  };
}
