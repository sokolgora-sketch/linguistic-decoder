import {
  analyzeStructuralInputV0_2,
  type StructuralInputAnalysisV0_2,
  type StructuralVoiceEventV0_2,
} from "@/shared/structuralHypothesisDiscovery.v0_2";
import {
  ALBANIAN_JETE_SOURCE_RECORD_V0_1,
  ALBANIAN_STRUCTURAL_SOURCE_IDENTITY_V0_1,
  ALBANIAN_STRUCTURAL_SOURCE_RECORDS_V0_1,
  type AlbanianStructuralBoundaryStatusV0_1,
  type AlbanianStructuralSourceRecordV0_1,
} from "@/shared/openInstrument/albanianStructuralSourceEvidence.v0_1";

export type AlbanianStructuralComponentVMV0_1 = {
  form: string;
  basisSpan: { start: number; end: number };
  sourceSpan: { start: number; end: number };
  graphemes: string[];
  voiceEvents: StructuralVoiceEventV0_2[];
  frameStatus: "contains_voice_event" | "consonantal_frame";
};

export type AlbanianStructuralEvidenceVMV0_1 = {
  schemaVersion: "z-zero.albanian-structural-evidence.v0_1";
  inputForm: string;
  sourceLemma: string;
  analysis: StructuralInputAnalysisV0_2;
  sourceIdentity: typeof ALBANIAN_STRUCTURAL_SOURCE_IDENTITY_V0_1;
  sourceRecord: AlbanianStructuralSourceRecordV0_1;
  surfacePartition: {
    provenance: "existing_structural_edge_partition" | "source_reported_suffix_boundary";
    left: AlbanianStructuralComponentVMV0_1;
    right: AlbanianStructuralComponentVMV0_1;
    reconstructedForm: string;
    eventIdsInOrder: string[];
  };
  boundaryComparison: {
    classification: AlbanianStructuralBoundaryStatusV0_1;
    structuralBoundaryCodePointOffset: number;
    sourceBoundaryCodePointOffset: number | null;
    sourceField: string | null;
    sourceBoundary: string | null;
    exactTargetSenseAlignment: "UNKNOWN";
    explanation: string;
  };
  structuralAlternatives: Array<{
    embryo: string;
    expansionChain: string[];
    claimBoundary: "structural_hypothesis_only";
    functionalSupportStatus: "unknown";
  }>;
  representationAuthority: "orthographic";
  pronunciationAuthority: "not_established";
  historicalOriginClaim: "not_claimed";
  ghegProposal: {
    userProposedStatement: "PLAN + JET → PLANET";
    proposedForm: "JET";
    proposalStatus: "USER_HYPOTHESIS";
    sourceAttestationStatus: "UNKNOWN";
    sourceBoundaryStatus: "UNKNOWN";
    proposedOrthographicVoicePath: ["E"];
    sourceHeadwordForm: "JETË";
    sourceHeadwordRecordId: string;
    sourceHeadwordEntryLocator: string;
    sourceHeadwordLine: number;
    sourceRegister: "not_marked_by_headword_record";
    dialectalSenseIds: readonly string[];
    bareJetFormInThisNounRecord: false;
    sourceOrthographicVoicePath: ["E", "Ë"];
    pronunciationAuthority: "not_established";
    historicalDerivation: "not_claimed";
  } | null;
};

const STRUCTURAL_PARTITION_OFFSET_V0_1: Record<string, number> = {
  planet: 4,
  shkruaj: 5,
};

function normalizeLookupForm(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").trim().toLocaleLowerCase("en-US");
  return Object.prototype.hasOwnProperty.call(
    ALBANIAN_STRUCTURAL_SOURCE_RECORDS_V0_1,
    normalized,
  )
    ? normalized
    : null;
}

function componentAt(
  analysis: StructuralInputAnalysisV0_2,
  start: number,
  end: number,
): AlbanianStructuralComponentVMV0_1 | null {
  if (start < 0 || end <= start || end > Array.from(analysis.normalizedBasis).length) {
    return null;
  }
  const graphemes = analysis.inputGraphemes.filter(
    (grapheme) => grapheme.basisSpan.start >= start && grapheme.basisSpan.end <= end,
  );
  if (
    graphemes.length === 0 ||
    graphemes[0]?.basisSpan.start !== start ||
    graphemes.at(-1)?.basisSpan.end !== end
  ) {
    return null;
  }
  const sourceStart = graphemes[0]?.sourceSpan.start;
  const sourceEnd = graphemes.at(-1)?.sourceSpan.end;
  if (sourceStart === undefined || sourceEnd === undefined) return null;
  const voiceEvents = analysis.inputVoiceEvents.filter(
    (event) => event.basisPosition >= start && event.basisPosition < end,
  );
  const characters = Array.from(analysis.normalizedBasis);

  return {
    form: characters.slice(start, end).join("").toLocaleUpperCase("en-US"),
    basisSpan: { start, end },
    sourceSpan: { start: sourceStart, end: sourceEnd },
    graphemes: graphemes.map((grapheme) => grapheme.grapheme.toLocaleUpperCase("en-US")),
    voiceEvents,
    frameStatus: voiceEvents.length > 0 ? "contains_voice_event" : "consonantal_frame",
  };
}

export function adaptAlbanianStructuralEvidenceToVMV0_1(
  value: unknown,
): AlbanianStructuralEvidenceVMV0_1 | null {
  const lookup = normalizeLookupForm(value);
  if (!lookup) return null;

  const sourceRecord = ALBANIAN_STRUCTURAL_SOURCE_RECORDS_V0_1[lookup];
  if (!sourceRecord) return null;
  const analysis = analyzeStructuralInputV0_2(lookup);
  if (
    analysis.analysisStatus !== "analyzed" ||
    analysis.inputVoiceSequenceStatus !== "complete"
  ) {
    return null;
  }

  const sourceMorphology = sourceRecord.morphology;
  const rightSurface = sourceMorphology?.kind === "suffix"
    ? sourceMorphology.affix
    : null;
  const splitOffset = rightSurface
    ? Array.from(analysis.normalizedBasis).length - Array.from(rightSurface).length
    : STRUCTURAL_PARTITION_OFFSET_V0_1[lookup];
  if (splitOffset === undefined) return null;

  const left = componentAt(analysis, 0, splitOffset);
  const right = componentAt(
    analysis,
    splitOffset,
    Array.from(analysis.normalizedBasis).length,
  );
  if (!left || !right) return null;

  const reconstructedForm = `${left.form}${right.form}`.toLocaleLowerCase("en-US");
  const eventIdsInOrder = [...left.voiceEvents, ...right.voiceEvents].map(
    (event) => event.eventId,
  );
  const inputEventIds = analysis.inputVoiceEvents.map((event) => event.eventId);
  if (
    reconstructedForm !== analysis.normalizedBasis ||
    JSON.stringify(eventIdsInOrder) !== JSON.stringify(inputEventIds)
  ) {
    return null;
  }

  let classification: AlbanianStructuralBoundaryStatusV0_1;
  let sourceBoundaryCodePointOffset: number | null = null;
  let explanation: string;
  if (!sourceMorphology) {
    classification = "STRUCTURAL_ONLY";
    explanation = sourceRecord.sourceCaveat;
  } else if (sourceMorphology.kind === "suffix") {
    sourceBoundaryCodePointOffset = splitOffset;
    classification = right.form.toLocaleLowerCase("en-US") === sourceMorphology.affix
      ? "SOURCE_SUPPORTED"
      : "MISMATCH";
    explanation = classification === "SOURCE_SUPPORTED"
      ? `The source-reported suffix -${sourceMorphology.affix} matches the right surface component. The source base form is not established as an exact match for the left component; sense alignment remains unknown.`
      : `The structural right component does not match the source-reported suffix -${sourceMorphology.affix}.`;
  } else {
    sourceBoundaryCodePointOffset = Array.from(sourceMorphology.affix).length;
    classification = sourceBoundaryCodePointOffset === splitOffset
      ? "SOURCE_SUPPORTED"
      : "MISMATCH";
    explanation = classification === "SOURCE_SUPPORTED"
      ? `The source-reported prefix ${sourceMorphology.affix}- matches the structural boundary.`
      : `The structural split SHKRU | AJ differs from the record-level template ${sourceMorphology.affix}- + ${sourceMorphology.sourceBaseForm}. The source record also lists competing etymology accounts.`;
  }

  const ghegProposal = lookup === "planet"
    ? {
        userProposedStatement: "PLAN + JET → PLANET" as const,
        proposedForm: "JET" as const,
        proposalStatus: "USER_HYPOTHESIS" as const,
        sourceAttestationStatus: "UNKNOWN" as const,
        sourceBoundaryStatus: "UNKNOWN" as const,
        proposedOrthographicVoicePath: ["E"] as ["E"],
        sourceHeadwordForm: "JETË" as const,
        sourceHeadwordRecordId: ALBANIAN_JETE_SOURCE_RECORD_V0_1.sourceRecordId,
        sourceHeadwordEntryLocator: ALBANIAN_JETE_SOURCE_RECORD_V0_1.entryLocator,
        sourceHeadwordLine: ALBANIAN_JETE_SOURCE_RECORD_V0_1.sourceFileLine,
        sourceRegister: ALBANIAN_JETE_SOURCE_RECORD_V0_1.sourceRegister,
        dialectalSenseIds: ALBANIAN_JETE_SOURCE_RECORD_V0_1.dialectalSenseIds,
        bareJetFormInThisNounRecord: ALBANIAN_JETE_SOURCE_RECORD_V0_1.bareJetFormInThisNounRecord,
        sourceOrthographicVoicePath: ["E", "Ë"] as ["E", "Ë"],
        pronunciationAuthority: "not_established" as const,
        historicalDerivation: "not_claimed" as const,
      }
    : null;

  return {
    schemaVersion: "z-zero.albanian-structural-evidence.v0_1",
    inputForm: analysis.inputForm,
    sourceLemma: sourceRecord.sourceLemma,
    analysis,
    sourceIdentity: ALBANIAN_STRUCTURAL_SOURCE_IDENTITY_V0_1,
    sourceRecord,
    surfacePartition: {
      provenance: sourceMorphology?.kind === "suffix"
        ? "source_reported_suffix_boundary"
        : "existing_structural_edge_partition",
      left,
      right,
      reconstructedForm,
      eventIdsInOrder,
    },
    boundaryComparison: {
      classification,
      structuralBoundaryCodePointOffset: splitOffset,
      sourceBoundaryCodePointOffset,
      sourceField: sourceMorphology?.sourceField ?? null,
      sourceBoundary: sourceMorphology
        ? sourceMorphology.kind === "suffix"
          ? `-${sourceMorphology.affix}`
          : `${sourceMorphology.affix}- + ${sourceMorphology.sourceBaseForm}`
        : null,
      exactTargetSenseAlignment: "UNKNOWN",
      explanation,
    },
    structuralAlternatives: analysis.hypotheses.map((hypothesis) => ({
      embryo: hypothesis.embryo,
      expansionChain: hypothesis.expansionChain,
      claimBoundary: "structural_hypothesis_only",
      functionalSupportStatus: "unknown",
    })),
    representationAuthority: "orthographic",
    pronunciationAuthority: "not_established",
    historicalOriginClaim: "not_claimed",
    ghegProposal,
  };
}
