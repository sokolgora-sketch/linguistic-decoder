import { normalizeToAllowedOpId } from "./ops/allowedOps.v0.1";

/**
 * Open Instrument multi-source functional discovery v0.1.
 *
 * Governing posture:
 *
 * structural discovery OR bounded source-attested exact-form fallback
 *   -> multi-source functional witness discovery
 *   -> functional evaluation / semantic bridge
 *   -> embryo-first candidate projection
 *
 * This layer must NOT:
 * - modify deterministic structural discovery;
 * - declare historical origin;
 * - declare a single winner;
 * - promote a research witness into reviewed production truth;
 * - collapse lexical attestation and functional interpretation
 *   into one confidence value;
 * - stop after the first source hit.
 *
 * A research embryo enters through explicit structural or source-attested authority.
 * A source hit is evidence about a form/meaning relation.
 * A functional bridge from that evidence to the target word is
 * a separate claim and must carry its own truth status.
 */

export type MultiSourceTruthStatusV0_1 =
  | "fact"
  | "inference"
  | "hypothesis"
  | "unknown";

export type MultiSourceEvidenceFamilyV0_1 =
  | "lexical_dictionary"
  | "dialect_lexicon"
  | "etymological_dictionary"
  | "historical_dictionary"
  | "corpus"
  | "scholarly_paper"
  | "reconstructed_lexicon"
  | "other";

export type EmbryoSourceRelationV0_1 =
  | "exact_form"
  | "authorized_transformation"
  | "reconstructed_form"
  | "phonetic_resemblance"
  | "semantic_resemblance"
  | "no_structural_relation"
  | "unresolved"
  | "unsupported";

export type MultiSourceFunctionalEvidenceRecordV0_1 = {
  sourceId: string;
  evidenceFamily: MultiSourceEvidenceFamilyV0_1;

  language: string;
  form: string;
  gloss: string;

  /** Optional target-sense binding for target-bound research runtime paths. */
  targetSenseId?: string;

  citationRefs: readonly string[];

  /**
   * Relationship between the requested research embryo and
   * the externally observed form.
   *
   * No relation may be inferred merely because two strings look similar.
   * `no_structural_relation` explicitly records that the source form is
   * independently attested while no source-form/embryo relation is claimed.
   */
  embryoRelation: EmbryoSourceRelationV0_1;

  /**
   * Optional deterministic/authorized operation identifiers that
   * justify the embryo-to-source-form relationship.
   *
   * Empty means no such operation has been established.
   */
  relationOperationIds: readonly string[];

  /**
   * Truth of the source's lexical/historical attestation itself.
   *
   * Example:
   * a reviewed dictionary directly attesting a form/gloss may be "fact".
   */
  attestationTruth: MultiSourceTruthStatusV0_1;

  /**
   * Candidate functional explanation connecting this source meaning
   * to the analyzed target word.
   *
   * This is intentionally separate from lexical attestation.
   */
  semanticBridge: string | null;

  /**
   * Truth status of the functional bridge itself.
   *
   * A factual dictionary attestation does NOT automatically make
   * the bridge a fact.
   */
  functionalBridgeTruth: MultiSourceTruthStatusV0_1;

  /**
   * Research rows are not production truth simply because they exist.
   */
  sourceStatus:
    | "research_candidate"
    | "reviewed_candidate"
    | "reviewed_accepted";
};

export type MultiSourceFunctionalDiscoveryInputV0_1 = {
  targetWord: string;
  embryo: string;

  /**
   * Deterministic structural context already discovered elsewhere.
   * This module does not generate or mutate this chain.
   */
  structuralExpansionChain: readonly string[];

  /**
   * Evidence may come from multiple languages and source families.
   * v0.1 consumes supplied records; source acquisition/provider
   * execution remains a separate concern.
   */
  sources: readonly MultiSourceFunctionalEvidenceRecordV0_1[];
};

export type SourceAttestedFunctionalDiscoveryInputV0_1 = {
  targetWord: string;
  embryo: string;

  /**
   * Evidence-first authority does not claim a structural expansion chain.
   * The source form itself must exactly attest the requested embryo.
   */
  sources: readonly MultiSourceFunctionalEvidenceRecordV0_1[];
};

export type TargetBoundFunctionalResearchDiscoveryInputV0_1 = {
  targetWord: string;
  targetSenseId: string | null;
  embryo: string;
  sources: readonly MultiSourceFunctionalEvidenceRecordV0_1[];
};

export type FunctionalEmbryoAuthorityV0_1 =
  | "structural_discovery"
  | "source_attested_exact_form"
  | "target_bound_research";

export type MultiSourceFunctionalWitnessV0_1 = {
  witnessId: string;

  targetWord: string;
  embryo: string;

  embryoAuthority:
    FunctionalEmbryoAuthorityV0_1;

  sourceId: string;
  targetSenseId?: string;
  evidenceFamily: MultiSourceEvidenceFamilyV0_1;
  sourceStatus: MultiSourceFunctionalEvidenceRecordV0_1["sourceStatus"];

  language: string;
  sourceForm: string;
  gloss: string;
  citationRefs: readonly string[];

  embryoRelation: EmbryoSourceRelationV0_1;
  relationOperationIds: readonly string[];

  attestationTruth: MultiSourceTruthStatusV0_1;

  semanticBridge: string | null;
  functionalBridgeTruth: MultiSourceTruthStatusV0_1;

  historicalOriginClaim: "not_claimed";
  historicalTransmissionClaim: "not_claimed";
  winnerClaim: "not_claimed";
  languageSuperiorityClaim: "not_claimed";
  candidateTruthClaim: "not_claimed";

  userDecisionPosture: "user_decides";
};

const ADMISSIBLE_EMBRYO_SOURCE_RELATIONS_V0_1 =
  new Set<EmbryoSourceRelationV0_1>([
    "exact_form",
    "authorized_transformation",
    "reconstructed_form",
    "phonetic_resemblance",
    "semantic_resemblance",
  ]);

type EvidenceRecordAdmissionModeV0_1 =
  | "structural"
  | "target_bound_research";

function normalizeDiscoveryTextV0_1(
  value: string,
): string {
  return value
    .normalize("NFC")
    .trim();
}

function normalizeCitationRefsV0_1(
  refs: readonly string[],
): string[] {
  return refs
    .map((ref) =>
      normalizeDiscoveryTextV0_1(ref),
    )
    .filter(Boolean);
}

function normalizeOperationIdsV0_1(
  ids: readonly string[],
): string[] {
  const normalized: string[] = [];

  for (const rawId of ids) {
    const canonical =
      normalizeToAllowedOpId(
        normalizeDiscoveryTextV0_1(rawId),
      );

    if (canonical) {
      normalized.push(canonical);
    }
  }

  return [...new Set(normalized)];
}

function isAdmissibleEvidenceRecordV0_1(
  source:
    MultiSourceFunctionalEvidenceRecordV0_1,
  mode: EvidenceRecordAdmissionModeV0_1 = "structural",
): boolean {
  const relationIsAdmissible =
    mode === "target_bound_research"
      ? source.embryoRelation === "no_structural_relation"
      : ADMISSIBLE_EMBRYO_SOURCE_RELATIONS_V0_1.has(
          source.embryoRelation,
        );

  if (!relationIsAdmissible) {
    return false;
  }

  const declaredOperationIds =
    source.relationOperationIds
      .map((id) =>
        normalizeDiscoveryTextV0_1(id),
      )
      .filter(Boolean);

  const canonicalOperationIds =
    normalizeOperationIdsV0_1(
      declaredOperationIds,
    );

  /**
   * Every declared transform must resolve through the canonical
   * AllowedOpId vocabulary. Research evidence cannot manufacture
   * a transform merely because a source form looks useful.
   */
  if (
    canonicalOperationIds.length !==
      new Set(declaredOperationIds).size
  ) {
    return false;
  }

  if (
    mode === "target_bound_research" &&
    (
      source.relationOperationIds.length > 0 ||
      source.attestationTruth !== "fact" ||
      source.functionalBridgeTruth !== "hypothesis" ||
      !source.semanticBridge?.normalize("NFC").trim()
    )
  ) {
    return false;
  }

  /**
   * An authorized_transformation relation is meaningful only when
   * at least one actual canonical operation supports it.
   */
  if (
    mode === "structural" &&
    source.embryoRelation ===
      "authorized_transformation" &&
    canonicalOperationIds.length === 0
  ) {
    return false;
  }

  if (
    !normalizeDiscoveryTextV0_1(
      source.sourceId,
    )
  ) {
    return false;
  }

  if (
    !normalizeDiscoveryTextV0_1(
      source.language,
    )
  ) {
    return false;
  }

  if (
    !normalizeDiscoveryTextV0_1(
      source.form,
    )
  ) {
    return false;
  }

  if (
    !normalizeDiscoveryTextV0_1(
      source.gloss,
    )
  ) {
    return false;
  }

  if (
    normalizeCitationRefsV0_1(
      source.citationRefs,
    ).length === 0
  ) {
    return false;
  }

  return true;
}

/**
 * Convert admissible multi-source evidence records into bounded
 * functional research witnesses.
 *
 * Important boundaries:
 *
 * - input order is preserved;
 * - discovery does not stop at the first admissible source;
 * - unsupported/unresolved relations are rejected;
 * - lexical/source attestation truth remains separate from
 *   functional-bridge truth;
 * - phonetic or semantic resemblance can survive only as an
 *   explicitly labelled research relation and is not promoted;
 * - no witness emitted here claims historical origin, winner,
 *   language superiority, or candidate truth;
 * - this function does not review, authorize, rank, or promote
 *   witnesses into production evidence.
 */
function buildFunctionalWitnessesV0_1(
  input: {
    targetWord: string;
    embryo: string;

    embryoAuthority:
      FunctionalEmbryoAuthorityV0_1;

    sources:
      readonly MultiSourceFunctionalEvidenceRecordV0_1[];
    admissionMode?: EvidenceRecordAdmissionModeV0_1;
  },
): MultiSourceFunctionalWitnessV0_1[] {
  const witnesses:
    MultiSourceFunctionalWitnessV0_1[] =
    [];

  const seenSourceIds =
    new Set<string>();

  for (const source of input.sources) {
    if (
      !isAdmissibleEvidenceRecordV0_1(
        source,
        input.admissionMode,
      )
    ) {
      continue;
    }

    const sourceId =
      normalizeDiscoveryTextV0_1(
        source.sourceId,
      );

    if (
      seenSourceIds.has(
        sourceId,
      )
    ) {
      continue;
    }

    seenSourceIds.add(
      sourceId,
    );

    const semanticBridge =
      source.semanticBridge == null
        ? null
        : normalizeDiscoveryTextV0_1(
            source.semanticBridge,
          ) || null;

    witnesses.push({
      witnessId:
        `multi-source-functional:${input.targetWord}:${input.embryo}:${sourceId}`,

      targetWord:
        input.targetWord,

      embryo:
        input.embryo,

      embryoAuthority:
        input.embryoAuthority,

      sourceId,

      ...(source.targetSenseId
        ? {
            targetSenseId:
              normalizeDiscoveryTextV0_1(
                source.targetSenseId,
              ),
          }
        : {}),

      evidenceFamily:
        source.evidenceFamily,

      sourceStatus:
        source.sourceStatus,

      language:
        normalizeDiscoveryTextV0_1(
          source.language,
        ),

      sourceForm:
        normalizeDiscoveryTextV0_1(
          source.form,
        ),

      gloss:
        normalizeDiscoveryTextV0_1(
          source.gloss,
        ),

      citationRefs:
        normalizeCitationRefsV0_1(
          source.citationRefs,
        ),

      embryoRelation:
        source.embryoRelation,

      relationOperationIds:
        normalizeOperationIdsV0_1(
          source.relationOperationIds,
        ),

      attestationTruth:
        source.attestationTruth,

      semanticBridge,

      functionalBridgeTruth:
        semanticBridge == null
          ? "unknown"
          : source.functionalBridgeTruth,

      historicalOriginClaim:
        "not_claimed",

      historicalTransmissionClaim:
        "not_claimed",

      winnerClaim:
        "not_claimed",

      languageSuperiorityClaim:
        "not_claimed",

      candidateTruthClaim:
        "not_claimed",

      userDecisionPosture:
        "user_decides",
    });
  }

  return witnesses;
}

export function discoverMultiSourceFunctionalWitnessesV0_1(
  input: MultiSourceFunctionalDiscoveryInputV0_1,
): MultiSourceFunctionalWitnessV0_1[] {
  const targetWord =
    normalizeDiscoveryTextV0_1(
      input.targetWord,
    );

  const embryo =
    normalizeDiscoveryTextV0_1(
      input.embryo,
    );

  if (!targetWord || !embryo) {
    return [];
  }

  const structuralExpansionChain =
    input.structuralExpansionChain
      .map((item) =>
        normalizeDiscoveryTextV0_1(item),
      )
      .filter(Boolean);

  if (
    structuralExpansionChain.length === 0 ||
    structuralExpansionChain[0]
      .toLocaleUpperCase() !==
      embryo.toLocaleUpperCase()
  ) {
    return [];
  }

  return buildFunctionalWitnessesV0_1({
    targetWord,
    embryo,

    embryoAuthority:
      "structural_discovery",

    sources:
      input.sources,
  });
}

/**
 * Evidence-first research fallback.
 *
 * This does not infer an embryo from spelling and does not fabricate
 * a structural expansion chain. The requested embryo must be directly
 * attested by an admissible exact-form source record.
 */
export function discoverSourceAttestedFunctionalWitnessesV0_1(
  input:
    SourceAttestedFunctionalDiscoveryInputV0_1,
): MultiSourceFunctionalWitnessV0_1[] {
  const targetWord =
    normalizeDiscoveryTextV0_1(
      input.targetWord,
    );

  const embryo =
    normalizeDiscoveryTextV0_1(
      input.embryo,
    );

  if (!targetWord || !embryo) {
    return [];
  }

  const exactSources =
    input.sources.filter(
      (source) =>
        source.embryoRelation ===
          "exact_form" &&
        normalizeDiscoveryTextV0_1(
          source.form,
        ).toLocaleUpperCase(
          "en-US",
        ) ===
          embryo.toLocaleUpperCase(
            "en-US",
          ),
    );

  return buildFunctionalWitnessesV0_1({
    targetWord,
    embryo,

    embryoAuthority:
      "source_attested_exact_form",

    sources:
      exactSources,
  });
}

/**
 * Target-bound research path for independently attested source forms that
 * make no structural claim about the requested embryo.
 *
 * This is separate from structural discovery and from the exact-form
 * source-attested fallback. It cannot create a structural expansion chain
 * or a source-attested embryo authority.
 */
export function discoverTargetBoundFunctionalResearchWitnessesV0_1(
  input: TargetBoundFunctionalResearchDiscoveryInputV0_1,
): MultiSourceFunctionalWitnessV0_1[] {
  const targetWord = normalizeDiscoveryTextV0_1(input.targetWord);
  const targetSenseId = input.targetSenseId
    ? normalizeDiscoveryTextV0_1(input.targetSenseId)
    : "";
  const embryo = normalizeDiscoveryTextV0_1(input.embryo);

  if (!targetWord || !embryo) {
    return [];
  }

  const targetSources = input.sources.filter((source) => {
    const sourceSenseId = source.targetSenseId
      ? normalizeDiscoveryTextV0_1(source.targetSenseId)
      : "";

    if (Boolean(targetSenseId) !== Boolean(sourceSenseId)) {
      return false;
    }

    if (targetSenseId && targetSenseId !== sourceSenseId) {
      return false;
    }

    if (
      normalizeDiscoveryTextV0_1(source.form).toLocaleUpperCase("en-US") ===
      embryo.toLocaleUpperCase("en-US")
    ) {
      return false;
    }

    return isAdmissibleEvidenceRecordV0_1(
      source,
      "target_bound_research",
    );
  });

  return buildFunctionalWitnessesV0_1({
    targetWord,
    embryo,
    embryoAuthority: "target_bound_research",
    sources: targetSources,
    admissionMode: "target_bound_research",
  });
}
