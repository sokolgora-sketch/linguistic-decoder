import type {
  EmbryoSourceRelationV0_1,
  MultiSourceEvidenceFamilyV0_1,
  MultiSourceFunctionalEvidenceRecordV0_1,
  MultiSourceTruthStatusV0_1,
} from "./multiSourceFunctionalDiscovery.v0_1";

/**
 * Open Instrument research-only multi-source evidence registry v0.1.
 *
 * Placement:
 *
 * source acquisition / Brain proposal
 *   -> RESEARCH EVIDENCE REGISTRY
 *   -> multi-source functional witness discovery
 *   -> evaluation / projection
 *   -> explicit reviewed promotion lane
 *
 * This registry is intentionally NOT:
 * - the reviewed production lexicon registry;
 * - runtime authorization;
 * - historical-origin evidence;
 * - candidate-truth evidence;
 * - a provider transcript store;
 * - a free-form place to turn resemblance into fact.
 *
 * Source attestation is stored independently from target-specific
 * functional interpretation so one attested source can support zero,
 * one, or multiple bounded functional hypotheses without changing
 * what the source itself actually attests.
 */

export const MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1 =
  "open-instrument.multi-source-functional-research-evidence-registry.v0_1" as const;

export type MultiSourceFunctionalResearchSourceStatusV0_1 =
  | "research_candidate"
  | "reviewed_candidate";

export type MultiSourceFunctionalResearchCitationV0_1 = {
  citationId: string;

  sourceTitle: string;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string;
  sourceDateOrVersion: string;

  sourceUrlOrArchiveRef: string;
  entryLocator: string;
  sourceHashOrArchiveHash: string | null;

  attestedForm: string;
  attestedGloss: string;
};

export type MultiSourceFunctionalResearchHypothesisV0_1 = {
  targetWord: string;

  semanticBridge: string | null;
  functionalBridgeTruth:
    MultiSourceTruthStatusV0_1;

  claimBoundary:
    "functional_hypothesis_only";
};

export type MultiSourceFunctionalResearchEvidenceRowV0_1 = {
  registryVersion:
    typeof MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1;

  researchEvidenceId: string;

  embryo: string;

  evidenceFamily:
    MultiSourceEvidenceFamilyV0_1;

  language: string;
  form: string;
  gloss: string;

  embryoRelation:
    EmbryoSourceRelationV0_1;

  relationOperationIds:
    readonly string[];

  attestationTruth:
    MultiSourceTruthStatusV0_1;

  sourceStatus:
    MultiSourceFunctionalResearchSourceStatusV0_1;

  citations:
    readonly MultiSourceFunctionalResearchCitationV0_1[];

  functionalHypotheses:
    readonly MultiSourceFunctionalResearchHypothesisV0_1[];

  historicalOriginClaim:
    "not_claimed";

  historicalTransmissionClaim:
    "not_claimed";

  winnerClaim:
    "not_claimed";

  languageSuperiorityClaim:
    "not_claimed";

  candidateTruthClaim:
    "not_claimed";

  userDecisionPosture:
    "user_decides";
};

export type BuildMultiSourceFunctionalResearchInputsOptionsV0_1 = {
  targetWord: string;
  embryo: string;

  rows:
    readonly MultiSourceFunctionalResearchEvidenceRowV0_1[];
};

export type BuildSourceAttestedFunctionalResearchInputGroupsOptionsV0_1 = {
  targetWord: string;

  rows:
    readonly MultiSourceFunctionalResearchEvidenceRowV0_1[];
};

export type SourceAttestedFunctionalResearchInputGroupV0_1 = {
  embryo: string;

  sources:
    readonly MultiSourceFunctionalEvidenceRecordV0_1[];
};

function normalizeResearchTextV0_1(
  value: string,
): string {
  return value
    .normalize("NFC")
    .trim();
}

function sameResearchKeyV0_1(
  left: string,
  right: string,
): boolean {
  return (
    normalizeResearchTextV0_1(left)
      .toLocaleUpperCase("en-US") ===
    normalizeResearchTextV0_1(right)
      .toLocaleUpperCase("en-US")
  );
}

function citationIdIfUsableV0_1(
  citation:
    MultiSourceFunctionalResearchCitationV0_1,
): string | null {
  const citationId =
    normalizeResearchTextV0_1(
      citation.citationId,
    );

  const sourceTitle =
    normalizeResearchTextV0_1(
      citation.sourceTitle,
    );

  const sourcePublisherOrHost =
    normalizeResearchTextV0_1(
      citation.sourcePublisherOrHost,
    );

  const sourceDateOrVersion =
    normalizeResearchTextV0_1(
      citation.sourceDateOrVersion,
    );

  const sourceUrlOrArchiveRef =
    normalizeResearchTextV0_1(
      citation.sourceUrlOrArchiveRef,
    );

  const entryLocator =
    normalizeResearchTextV0_1(
      citation.entryLocator,
    );

  const attestedForm =
    normalizeResearchTextV0_1(
      citation.attestedForm,
    );

  const attestedGloss =
    normalizeResearchTextV0_1(
      citation.attestedGloss,
    );

  if (
    !citationId ||
    !sourceTitle ||
    !sourcePublisherOrHost ||
    !sourceDateOrVersion ||
    !sourceUrlOrArchiveRef ||
    !entryLocator ||
    !attestedForm ||
    !attestedGloss
  ) {
    return null;
  }

  return citationId;
}

function researchBoundaryIsPreservedV0_1(
  row:
    MultiSourceFunctionalResearchEvidenceRowV0_1,
): boolean {
  return (
    row.registryVersion ===
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1 &&
    (
      row.sourceStatus ===
        "research_candidate" ||
      row.sourceStatus ===
        "reviewed_candidate"
    ) &&
    row.historicalOriginClaim ===
      "not_claimed" &&
    row.historicalTransmissionClaim ===
      "not_claimed" &&
    row.winnerClaim ===
      "not_claimed" &&
    row.languageSuperiorityClaim ===
      "not_claimed" &&
    row.candidateTruthClaim ===
      "not_claimed" &&
    row.userDecisionPosture ===
      "user_decides"
  );
}

/**
 * Convert research-registry observations into bounded input records
 * for discoverMultiSourceFunctionalWitnessesV0_1.
 *
 * Responsibilities of this adapter:
 *
 * - match the requested research embryo;
 * - preserve every distinct source row rather than stopping at one;
 * - require structured citation provenance;
 * - select only the hypothesis scoped to the requested target word;
 * - preserve attestation truth independently from bridge truth;
 * - keep research/review-candidate status below production;
 * - preserve relation and operation provenance;
 * - fail closed when mandatory research boundaries are violated.
 *
 * This adapter does NOT:
 *
 * - decide whether a source relation is ultimately admissible;
 *   that remains the generic multi-source discovery layer's job;
 * - execute source acquisition or a model/provider;
 * - review or promote evidence;
 * - claim historical origin, winner, language superiority,
 *   or candidate truth.
 */
export function buildMultiSourceFunctionalResearchInputsV0_1(
  options:
    BuildMultiSourceFunctionalResearchInputsOptionsV0_1,
): MultiSourceFunctionalEvidenceRecordV0_1[] {
  const targetWord =
    normalizeResearchTextV0_1(
      options.targetWord,
    );

  const embryo =
    normalizeResearchTextV0_1(
      options.embryo,
    );

  if (!targetWord || !embryo) {
    return [];
  }

  const out:
    MultiSourceFunctionalEvidenceRecordV0_1[] =
    [];

  const seenResearchEvidenceIds =
    new Set<string>();

  for (const row of options.rows) {
    if (
      !researchBoundaryIsPreservedV0_1(
        row,
      )
    ) {
      continue;
    }

    if (
      !sameResearchKeyV0_1(
        row.embryo,
        embryo,
      )
    ) {
      continue;
    }

    const sourceId =
      normalizeResearchTextV0_1(
        row.researchEvidenceId,
      );

    const language =
      normalizeResearchTextV0_1(
        row.language,
      );

    const form =
      normalizeResearchTextV0_1(
        row.form,
      );

    const gloss =
      normalizeResearchTextV0_1(
        row.gloss,
      );

    if (
      !sourceId ||
      !language ||
      !form ||
      !gloss
    ) {
      continue;
    }

    if (
      seenResearchEvidenceIds.has(
        sourceId,
      )
    ) {
      continue;
    }

    const hypothesis =
      row.functionalHypotheses.find(
        (candidate) =>
          candidate.claimBoundary ===
            "functional_hypothesis_only" &&
          sameResearchKeyV0_1(
            candidate.targetWord,
            targetWord,
          ),
      );

    if (!hypothesis) {
      continue;
    }

    const citationRefs =
      row.citations
        .map(
          citationIdIfUsableV0_1,
        )
        .filter(
          (citationId):
            citationId is string =>
              citationId !== null,
        );

    if (
      citationRefs.length === 0
    ) {
      continue;
    }

    const semanticBridge =
      hypothesis.semanticBridge == null
        ? null
        : normalizeResearchTextV0_1(
            hypothesis.semanticBridge,
          ) || null;

    const relationOperationIds =
      row.relationOperationIds
        .map((operationId) =>
          normalizeResearchTextV0_1(
            operationId,
          ),
        )
        .filter(Boolean);

    out.push({
      sourceId,

      evidenceFamily:
        row.evidenceFamily,

      language,
      form,
      gloss,

      citationRefs,

      embryoRelation:
        row.embryoRelation,

      relationOperationIds,

      attestationTruth:
        row.attestationTruth,

      semanticBridge,

      functionalBridgeTruth:
        semanticBridge === null
          ? "unknown"
          : hypothesis.functionalBridgeTruth,

      sourceStatus:
        row.sourceStatus,
    });

    seenResearchEvidenceIds.add(
      sourceId,
    );
  }

  return out;
}

/**
 * Build evidence-first research groups only from target-bound rows whose
 * declared embryo is directly attested by the source form itself.
 *
 * This seam is deliberately narrower than structural research:
 *
 * - it runs on passive registry evidence only;
 * - exact-form source attestation is required;
 * - no structural expansion chain is manufactured;
 * - target-word hypothesis binding remains mandatory;
 * - ordinary multi-source citation and research-boundary validation is reused;
 * - this function does not authorize runtime projection by itself.
 */
export function buildSourceAttestedFunctionalResearchInputGroupsV0_1(
  options:
    BuildSourceAttestedFunctionalResearchInputGroupsOptionsV0_1,
): SourceAttestedFunctionalResearchInputGroupV0_1[] {
  const targetWord =
    normalizeResearchTextV0_1(
      options.targetWord,
    );

  if (!targetWord) {
    return [];
  }

  const embryos: string[] = [];
  const seenEmbryos =
    new Set<string>();

  for (const row of options.rows) {
    if (
      !researchBoundaryIsPreservedV0_1(
        row,
      ) ||
      row.embryoRelation !==
        "exact_form" ||
      !sameResearchKeyV0_1(
        row.embryo,
        row.form,
      )
    ) {
      continue;
    }

    const hasTargetHypothesis =
      row.functionalHypotheses.some(
        (candidate) =>
          candidate.claimBoundary ===
            "functional_hypothesis_only" &&
          sameResearchKeyV0_1(
            candidate.targetWord,
            targetWord,
          ),
      );

    if (!hasTargetHypothesis) {
      continue;
    }

    const embryo =
      normalizeResearchTextV0_1(
        row.embryo,
      );

    const key =
      embryo.toLocaleUpperCase(
        "en-US",
      );

    if (
      !embryo ||
      seenEmbryos.has(key)
    ) {
      continue;
    }

    seenEmbryos.add(key);
    embryos.push(embryo);
  }

  return embryos
    .map((embryo) => ({
      embryo,

      sources:
        buildMultiSourceFunctionalResearchInputsV0_1({
          targetWord,
          embryo,
          rows:
            options.rows,
        }).filter(
          (source) =>
            source.embryoRelation ===
              "exact_form" &&
            sameResearchKeyV0_1(
              source.form,
              embryo,
            ),
        ),
    }))
    .filter(
      (group) =>
        group.sources.length > 0,
    );
}
