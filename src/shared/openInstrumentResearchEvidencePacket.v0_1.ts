import {
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
  type MultiSourceFunctionalResearchCitationV0_1,
  type MultiSourceFunctionalResearchEvidenceRowV0_1,
  type MultiSourceFunctionalResearchHypothesisV0_1,
} from "./multiSourceFunctionalResearchEvidenceRegistry.v0_1";

import { normalizeToAllowedOpId } from "./ops/allowedOps.v0.1";

export const OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1 =
  "open-instrument.research-evidence-packet.v0_1" as const;

const EVIDENCE_FAMILIES_V0_1 = [
  "lexical_dictionary",
  "dialect_lexicon",
  "etymological_dictionary",
  "historical_dictionary",
  "corpus",
  "scholarly_paper",
  "reconstructed_lexicon",
  "other",
] as const;

const EMBRYO_RELATIONS_V0_1 = [
  "exact_form",
  "authorized_transformation",
  "reconstructed_form",
  "phonetic_resemblance",
  "semantic_resemblance",
] as const;

type NormalizedCitationV0_1 = MultiSourceFunctionalResearchCitationV0_1;

export type OpenInstrumentResearchEvidencePacketSourceV0_1 = {
  sourceKey: string;
  embryo: string;
  evidenceFamily: (typeof EVIDENCE_FAMILIES_V0_1)[number];
  language: string;
  form: string;
  gloss: string;
  embryoRelation: (typeof EMBRYO_RELATIONS_V0_1)[number];
  relationOperationIds: readonly string[];
  citation: NormalizedCitationV0_1;
};

export type OpenInstrumentResearchEvidencePacketV0_1 = {
  packetVersion: typeof OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1;
  packetId: string;
  targetWord: string;
  targetSenseId: string;
  semanticBridge: string;
  sources: readonly OpenInstrumentResearchEvidencePacketSourceV0_1[];
};

export type ParseOpenInstrumentResearchEvidencePacketResultV0_1 =
  | {
      ok: true;
      packet: OpenInstrumentResearchEvidencePacketV0_1;
    }
  | {
      ok: false;
      errors: readonly string[];
    };

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeTextV0_1(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").trim();
  return normalized || null;
}

function normalizeNullableTextV0_1(value: unknown): string | null | undefined {
  if (value === null) return null;
  return normalizeTextV0_1(value) ?? undefined;
}

function sameResearchKeyV0_1(left: string, right: string): boolean {
  return (
    left.toLocaleUpperCase("en-US") === right.toLocaleUpperCase("en-US")
  );
}

function hasOwnV0_1(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function safeIdSegmentV0_1(value: string): string | null {
  const segment = value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return segment || null;
}

function parseCitationV0_1(
  value: unknown,
  path: string,
  errors: string[],
): NormalizedCitationV0_1 | null {
  if (!isRecordV0_1(value)) {
    errors.push(`${path} must be an object`);
    return null;
  }

  const citationId = normalizeTextV0_1(value.citationId);
  const sourceTitle = normalizeTextV0_1(value.sourceTitle);
  const sourceAuthorOrEditor = normalizeNullableTextV0_1(
    value.sourceAuthorOrEditor,
  );
  const sourcePublisherOrHost = normalizeTextV0_1(value.sourcePublisherOrHost);
  const sourceDateOrVersion = normalizeTextV0_1(value.sourceDateOrVersion);
  const sourceUrlOrArchiveRef = normalizeTextV0_1(value.sourceUrlOrArchiveRef);
  const entryLocator = normalizeTextV0_1(value.entryLocator);
  const sourceHashOrArchiveHash = normalizeNullableTextV0_1(
    value.sourceHashOrArchiveHash,
  );
  const attestedForm = normalizeTextV0_1(value.attestedForm);
  const attestedGloss = normalizeTextV0_1(value.attestedGloss);
  const provenanceGroupId = normalizeTextV0_1(value.provenanceGroupId);

  const required: Array<[string, string | null | undefined]> = [
    ["citationId", citationId],
    ["sourceTitle", sourceTitle],
    ["sourcePublisherOrHost", sourcePublisherOrHost],
    ["sourceDateOrVersion", sourceDateOrVersion],
    ["sourceUrlOrArchiveRef", sourceUrlOrArchiveRef],
    ["entryLocator", entryLocator],
    ["attestedForm", attestedForm],
    ["attestedGloss", attestedGloss],
    ["provenanceGroupId", provenanceGroupId],
  ];

  for (const [field, fieldValue] of required) {
    if (!fieldValue) errors.push(`${path}.${field} must be a non-empty string`);
  }

  if (!hasOwnV0_1(value, "sourceAuthorOrEditor")) {
    errors.push(`${path}.sourceAuthorOrEditor must be present`);
  } else if (sourceAuthorOrEditor === undefined) {
    errors.push(`${path}.sourceAuthorOrEditor must be null or a non-empty string`);
  }

  if (!hasOwnV0_1(value, "sourceHashOrArchiveHash")) {
    errors.push(`${path}.sourceHashOrArchiveHash must be present`);
  } else if (sourceHashOrArchiveHash === undefined) {
    errors.push(`${path}.sourceHashOrArchiveHash must be null or a non-empty string`);
  }

  if (
    !citationId ||
    !sourceTitle ||
    sourceAuthorOrEditor === undefined ||
    !sourcePublisherOrHost ||
    !sourceDateOrVersion ||
    !sourceUrlOrArchiveRef ||
    !entryLocator ||
    sourceHashOrArchiveHash === undefined ||
    !attestedForm ||
    !attestedGloss ||
    !provenanceGroupId
  ) {
    return null;
  }

  return {
    citationId,
    sourceTitle,
    sourceAuthorOrEditor,
    sourcePublisherOrHost,
    sourceDateOrVersion,
    sourceUrlOrArchiveRef,
    entryLocator,
    sourceHashOrArchiveHash,
    attestedForm,
    attestedGloss,
    provenanceGroupId,
  };
}

function parseSourceV0_1(
  value: unknown,
  index: number,
  errors: string[],
): OpenInstrumentResearchEvidencePacketSourceV0_1 | null {
  const path = `sources[${index}]`;
  if (!isRecordV0_1(value)) {
    errors.push(`${path} must be an object`);
    return null;
  }

  for (const field of [
    "attestationTruth",
    "sourceStatus",
    "functionalBridgeTruth",
    "claimBoundary",
    "historicalOriginClaim",
    "historicalTransmissionClaim",
    "winnerClaim",
    "languageSuperiorityClaim",
    "candidateTruthClaim",
    "userDecisionPosture",
  ]) {
    if (hasOwnV0_1(value, field)) {
      errors.push(`${path}.${field} is compiler-controlled`);
    }
  }

  const sourceKey = normalizeTextV0_1(value.sourceKey);
  const embryo = normalizeTextV0_1(value.embryo);
  const evidenceFamily = normalizeTextV0_1(value.evidenceFamily);
  const language = normalizeTextV0_1(value.language);
  const form = normalizeTextV0_1(value.form);
  const gloss = normalizeTextV0_1(value.gloss);
  const embryoRelation = normalizeTextV0_1(value.embryoRelation);

  for (const [field, fieldValue] of [
    ["sourceKey", sourceKey],
    ["embryo", embryo],
    ["evidenceFamily", evidenceFamily],
    ["language", language],
    ["form", form],
    ["gloss", gloss],
    ["embryoRelation", embryoRelation],
  ] as const) {
    if (!fieldValue) errors.push(`${path}.${field} must be a non-empty string`);
  }

  const relationOperationIds = Array.isArray(value.relationOperationIds)
    ? value.relationOperationIds.map((operationId, operationIndex) => {
        const normalized = normalizeTextV0_1(operationId);
        if (!normalized) {
          errors.push(
            `${path}.relationOperationIds[${operationIndex}] must be a non-empty string`,
          );
        } else if (!normalizeToAllowedOpId(normalized)) {
          errors.push(
            `${path}.relationOperationIds[${operationIndex}] is not an allowed operation`,
          );
        }
        return normalized;
      })
    : null;

  if (!relationOperationIds) {
    errors.push(`${path}.relationOperationIds must be an array`);
  }

  const citation = parseCitationV0_1(value.citation, `${path}.citation`, errors);

  if (
    !sourceKey ||
    !embryo ||
    !evidenceFamily ||
    !language ||
    !form ||
    !gloss ||
    !embryoRelation ||
    !relationOperationIds ||
    relationOperationIds.some((operationId): operationId is null => operationId === null) ||
    !citation
  ) {
    return null;
  }

  if (!(EVIDENCE_FAMILIES_V0_1 as readonly string[]).includes(evidenceFamily)) {
    errors.push(`${path}.evidenceFamily is not supported`);
  }

  if (!(EMBRYO_RELATIONS_V0_1 as readonly string[]).includes(embryoRelation)) {
    errors.push(`${path}.embryoRelation is not supported`);
  }

  if (embryoRelation === "exact_form" && !sameResearchKeyV0_1(embryo, form)) {
    errors.push(`${path}.embryo must match form for exact_form`);
  }

  if (!sameResearchKeyV0_1(citation.attestedForm, form)) {
    errors.push(`${path}.citation.attestedForm must match form`);
  }

  if (
    embryoRelation === "authorized_transformation" &&
    relationOperationIds.length === 0
  ) {
    errors.push(`${path}.authorized_transformation requires relationOperationIds`);
  }

  return {
    sourceKey,
    embryo,
    evidenceFamily: evidenceFamily as OpenInstrumentResearchEvidencePacketSourceV0_1["evidenceFamily"],
    language,
    form,
    gloss,
    embryoRelation: embryoRelation as OpenInstrumentResearchEvidencePacketSourceV0_1["embryoRelation"],
    relationOperationIds: relationOperationIds as string[],
    citation,
  };
}

export function parseOpenInstrumentResearchEvidencePacketV0_1(
  value: unknown,
): ParseOpenInstrumentResearchEvidencePacketResultV0_1 {
  const errors: string[] = [];

  if (!isRecordV0_1(value)) {
    return { ok: false, errors: ["packet must be an object"] };
  }

  if (
    value.packetVersion !==
    OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1
  ) {
    errors.push("packetVersion is invalid");
  }

  const packetId = normalizeTextV0_1(value.packetId);
  const targetWord = normalizeTextV0_1(value.targetWord);
  const targetSenseId = normalizeTextV0_1(value.targetSenseId);
  const semanticBridge = normalizeTextV0_1(value.semanticBridge);

  if (!packetId) errors.push("packetId must be a non-empty string");
  if (!targetWord) errors.push("targetWord must be a non-empty string");
  if (!targetSenseId) errors.push("targetSenseId must be a non-empty string");
  if (!semanticBridge) errors.push("semanticBridge must be a non-empty string");

  const sourcesValue = value.sources;
  if (!Array.isArray(sourcesValue) || sourcesValue.length === 0) {
    errors.push("sources must contain at least one source");
  }

  const sources = Array.isArray(sourcesValue)
    ? sourcesValue.map((source, index) => parseSourceV0_1(source, index, errors))
    : [];

  const sourceKeys = new Set<string>();
  const citationIds = new Set<string>();

  for (const source of sources) {
    if (!source) continue;
    if (sourceKeys.has(source.sourceKey)) {
      errors.push(`duplicate sourceKey: ${source.sourceKey}`);
    }
    sourceKeys.add(source.sourceKey);

    if (citationIds.has(source.citation.citationId)) {
      errors.push(`duplicate citationId: ${source.citation.citationId}`);
    }
    citationIds.add(source.citation.citationId);
  }

  if (errors.length > 0 || !packetId || !targetWord || !targetSenseId || !semanticBridge) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    packet: {
      packetVersion:
        OPEN_INSTRUMENT_RESEARCH_EVIDENCE_PACKET_VERSION_V0_1,
      packetId,
      targetWord,
      targetSenseId,
      semanticBridge,
      sources: sources as OpenInstrumentResearchEvidencePacketSourceV0_1[],
    },
  };
}

function researchEvidenceIdV0_1(
  packet: OpenInstrumentResearchEvidencePacketV0_1,
  sourceKey: string,
): string {
  const packetVersion = safeIdSegmentV0_1(packet.packetVersion);
  const packetId = safeIdSegmentV0_1(packet.packetId);
  const normalizedSourceKey = safeIdSegmentV0_1(sourceKey);

  if (!packetVersion || !packetId || !normalizedSourceKey) {
    throw new Error("packet identifiers must be repository-safe");
  }

  return `research.external.${packetVersion}.${packetId}.${normalizedSourceKey}`;
}

export function compileOpenInstrumentResearchEvidencePacketV0_1(
  packet: OpenInstrumentResearchEvidencePacketV0_1,
): MultiSourceFunctionalResearchEvidenceRowV0_1[] {
  const rows: MultiSourceFunctionalResearchEvidenceRowV0_1[] = [...packet.sources]
    .sort((left, right) =>
      left.sourceKey.localeCompare(right.sourceKey, "en-US"),
    )
    .map((source) => {
      const hypothesis: MultiSourceFunctionalResearchHypothesisV0_1 = {
        targetWord: packet.targetWord,
        targetSenseId: packet.targetSenseId,
        semanticBridge: packet.semanticBridge,
        functionalBridgeTruth: "hypothesis",
        claimBoundary: "functional_hypothesis_only",
      };

      return {
        registryVersion:
          MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
        researchEvidenceId: researchEvidenceIdV0_1(packet, source.sourceKey),
        embryo: source.embryo,
        evidenceFamily: source.evidenceFamily,
        language: source.language,
        form: source.form,
        gloss: source.gloss,
        embryoRelation: source.embryoRelation,
        relationOperationIds: [...source.relationOperationIds],
        attestationTruth: "fact",
        sourceStatus: "research_candidate",
        citations: [source.citation],
        functionalHypotheses: [hypothesis],
        historicalOriginClaim: "not_claimed",
        historicalTransmissionClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        userDecisionPosture: "user_decides",
      };
    });

  const seenIds = new Set<string>();
  for (const row of rows) {
    if (seenIds.has(row.researchEvidenceId)) {
      throw new Error(`researchEvidenceId collision: ${row.researchEvidenceId}`);
    }
    seenIds.add(row.researchEvidenceId);
  }

  return rows;
}

export function compileOpenInstrumentResearchEvidencePacketInputV0_1(
  value: unknown,
): MultiSourceFunctionalResearchEvidenceRowV0_1[] {
  const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(value);
  if (!parsed.ok) {
    throw new Error(`invalid research evidence packet: ${parsed.errors.join("; ")}`);
  }
  return compileOpenInstrumentResearchEvidencePacketV0_1(parsed.packet);
}
