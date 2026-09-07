import {
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
  parseMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "./multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import type {
  MultiSourceFunctionalResearchCitationV0_1,
  MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "./multiSourceFunctionalResearchEvidenceRegistry.v0_1";

export type OpenInstrumentResearchCatalogAdmissionCollisionV0_1 = {
  kind:
    | "researchEvidenceId"
    | "citationId"
    | "sourceIdentity"
    | "malformedRow";
  value: string;
};

export type OpenInstrumentResearchCatalogAdmissionDryRunV0_1 = {
  currentRowCount: number;
  incomingRowCount: number;
  resultRowCount: number;
  incomingResearchEvidenceIds: readonly string[];
  incomingCitationIds: readonly string[];
  collisions: readonly OpenInstrumentResearchCatalogAdmissionCollisionV0_1[];
  wouldChange: boolean;
};

export type OpenInstrumentResearchCatalogAdmissionResultV0_1 =
  | {
      ok: true;
      catalog: {
        catalogVersion: typeof MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1;
        rows: readonly MultiSourceFunctionalResearchEvidenceRowV0_1[];
      };
      dryRun: OpenInstrumentResearchCatalogAdmissionDryRunV0_1;
    }
  | {
      ok: false;
      reasonCodes: readonly string[];
      dryRun: OpenInstrumentResearchCatalogAdmissionDryRunV0_1;
    };

function catalogInputV0_1(
  rows: readonly MultiSourceFunctionalResearchEvidenceRowV0_1[],
) {
  return {
    catalogVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
    rows,
  };
}

function citationIdentityV0_1(
  citation: MultiSourceFunctionalResearchCitationV0_1,
): string {
  return [
    citation.sourceUrlOrArchiveRef,
    citation.entryLocator,
    citation.attestedForm,
  ]
    .map((value) => value.normalize("NFC").trim())
    .join("\u001f");
}

function incomingRowsV0_1(
  value: unknown,
): readonly MultiSourceFunctionalResearchEvidenceRowV0_1[] | null {
  const rows = Array.isArray(value)
    ? value
    : typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as { rows?: unknown }).rows
      : null;

  if (!Array.isArray(rows)) return null;

  const parsedRows = rows.map((row) =>
    parseMultiSourceFunctionalResearchEvidenceCatalogV0_1(
      catalogInputV0_1([row as MultiSourceFunctionalResearchEvidenceRowV0_1]),
    ),
  );
  return parsedRows.every((parsed) => parsed.length === 1)
    ? parsedRows.map((parsed) => parsed[0])
    : null;
}

function validateIncomingRowV0_1(
  row: MultiSourceFunctionalResearchEvidenceRowV0_1,
): string[] {
  const reasons: string[] = [];

  if (row.attestationTruth !== "fact") {
    reasons.push(`${row.researchEvidenceId}:ATTESTATION_TRUTH_NOT_FACT`);
  }
  if (row.sourceStatus !== "research_candidate") {
    reasons.push(`${row.researchEvidenceId}:SOURCE_STATUS_NOT_RESEARCH_CANDIDATE`);
  }
  if (
    row.historicalOriginClaim !== "not_claimed" ||
    row.historicalTransmissionClaim !== "not_claimed" ||
    row.winnerClaim !== "not_claimed" ||
    row.languageSuperiorityClaim !== "not_claimed" ||
    row.candidateTruthClaim !== "not_claimed" ||
    row.userDecisionPosture !== "user_decides"
  ) {
    reasons.push(`${row.researchEvidenceId}:TRUTH_BOUNDARY_VIOLATION`);
  }
  if (row.functionalHypotheses.length === 0) {
    reasons.push(`${row.researchEvidenceId}:TARGET_BINDING_MISSING`);
  }
  for (const hypothesis of row.functionalHypotheses) {
    if (!hypothesis.targetWord.trim() || !hypothesis.targetSenseId?.trim()) {
      reasons.push(`${row.researchEvidenceId}:TARGET_BINDING_MALFORMED`);
    }
    if (
      hypothesis.functionalBridgeTruth !== "hypothesis" ||
      hypothesis.claimBoundary !== "functional_hypothesis_only" ||
      !hypothesis.semanticBridge?.trim()
    ) {
      reasons.push(`${row.researchEvidenceId}:FUNCTIONAL_BOUNDARY_VIOLATION`);
    }
  }
  for (const citation of row.citations) {
    if (!citation.provenanceGroupId?.trim()) {
      reasons.push(`${row.researchEvidenceId}:PROVENANCE_MISSING`);
    }
  }

  return reasons;
}

function dryRunV0_1(
  currentRows: readonly MultiSourceFunctionalResearchEvidenceRowV0_1[],
  incomingRows: readonly MultiSourceFunctionalResearchEvidenceRowV0_1[],
  collisions: readonly OpenInstrumentResearchCatalogAdmissionCollisionV0_1[],
): OpenInstrumentResearchCatalogAdmissionDryRunV0_1 {
  return {
    currentRowCount: currentRows.length,
    incomingRowCount: incomingRows.length,
    resultRowCount: currentRows.length + incomingRows.length,
    incomingResearchEvidenceIds: incomingRows.map((row) => row.researchEvidenceId),
    incomingCitationIds: incomingRows.flatMap((row) =>
      row.citations.map((citation) => citation.citationId),
    ),
    collisions,
    wouldChange: collisions.length === 0 && incomingRows.length > 0,
  };
}

export function admitOpenInstrumentResearchCatalogV0_1(
  existingCatalog: unknown,
  generatedRows: unknown,
): OpenInstrumentResearchCatalogAdmissionResultV0_1 {
  const currentRows = parseMultiSourceFunctionalResearchEvidenceCatalogV0_1(
    existingCatalog,
  );
  const existingRawRows =
    typeof existingCatalog === "object" &&
    existingCatalog !== null &&
    Array.isArray((existingCatalog as { rows?: unknown }).rows)
      ? (existingCatalog as { rows: readonly unknown[] }).rows
      : [];
  const incomingRows = incomingRowsV0_1(generatedRows);
  const collisions: OpenInstrumentResearchCatalogAdmissionCollisionV0_1[] = [];

  if (
    currentRows.length === 0 ||
    typeof existingCatalog !== "object" ||
    existingCatalog === null ||
    (existingCatalog as { rows?: unknown }).rows instanceof Array &&
      (existingCatalog as { rows: unknown[] }).rows.length !== currentRows.length
  ) {
    collisions.push({ kind: "malformedRow", value: "existingCatalog" });
  }
  if (incomingRows === null) {
    collisions.push({ kind: "malformedRow", value: "incomingRows" });
  }

  const safeIncomingRows = incomingRows ?? [];
  const existingResearchIds = new Set(currentRows.map((row) => row.researchEvidenceId));
  const existingCitationIds = new Set(
    currentRows.flatMap((row) => row.citations.map((citation) => citation.citationId)),
  );
  const existingSourceIdentities = new Set(
    currentRows.flatMap((row) => row.citations.map(citationIdentityV0_1)),
  );
  const incomingResearchIds = new Set<string>();
  const incomingCitationIds = new Set<string>();
  const incomingSourceIdentities = new Set<string>();

  for (const row of safeIncomingRows) {
    for (const reason of validateIncomingRowV0_1(row)) {
      collisions.push({ kind: "malformedRow", value: reason });
    }
    if (existingResearchIds.has(row.researchEvidenceId) || incomingResearchIds.has(row.researchEvidenceId)) {
      collisions.push({ kind: "researchEvidenceId", value: row.researchEvidenceId });
    }
    incomingResearchIds.add(row.researchEvidenceId);
    for (const citation of row.citations) {
      if (existingCitationIds.has(citation.citationId) || incomingCitationIds.has(citation.citationId)) {
        collisions.push({ kind: "citationId", value: citation.citationId });
      }
      incomingCitationIds.add(citation.citationId);
      const identity = citationIdentityV0_1(citation);
      if (existingSourceIdentities.has(identity) || incomingSourceIdentities.has(identity)) {
        collisions.push({ kind: "sourceIdentity", value: identity });
      }
      incomingSourceIdentities.add(identity);
    }
  }

  const sortedCollisions = [...collisions].sort((left, right) =>
    `${left.kind}:${left.value}`.localeCompare(`${right.kind}:${right.value}`, "en-US"),
  );
  const summary = dryRunV0_1(currentRows, safeIncomingRows, sortedCollisions);
  if (sortedCollisions.length > 0) {
    return {
      ok: false,
      reasonCodes: sortedCollisions.map((collision) => `${collision.kind}:${collision.value}`),
      dryRun: summary,
    };
  }

  const rows = [
    ...existingRawRows,
    ...[...safeIncomingRows].sort((left, right) =>
      left.researchEvidenceId.localeCompare(right.researchEvidenceId, "en-US"),
    ),
  ] as readonly MultiSourceFunctionalResearchEvidenceRowV0_1[];
  return {
    ok: true,
    catalog: {
      catalogVersion: MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
      rows,
    },
    dryRun: summary,
  };
}

export function dryRunOpenInstrumentResearchCatalogAdmissionV0_1(
  existingCatalog: unknown,
  generatedRows: unknown,
): OpenInstrumentResearchCatalogAdmissionDryRunV0_1 {
  return admitOpenInstrumentResearchCatalogV0_1(existingCatalog, generatedRows).dryRun;
}
