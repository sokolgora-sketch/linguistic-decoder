import {
  analyzeStructuralInputV0_2,
  type StructuralInputAnalysisV0_2,
  type StructuralVoiceEventV0_2,
} from "@/shared/structuralHypothesisDiscovery.v0_2";
import {
  ALBANIAN_JETE_SOURCE_RECORD_V0_1,
  ALBANIAN_STRUCTURAL_SOURCE_IDENTITY_V0_1,
  ALBANIAN_STRUCTURAL_SOURCE_RECORDS_V0_1,
  type AlbanianStructuralSourceRecordV0_1,
} from "@/shared/openInstrument/albanianStructuralSourceEvidence.v0_1";

type AlbanianStructuralComponentVMV0_1 = {
  form: string;
  basisSpan: { start: number; end: number };
  sourceSpan: { start: number; end: number };
  graphemes: string[];
  voiceEvents: StructuralVoiceEventV0_2[];
  frameStatus: "contains_voice_event" | "consonantal_frame";
};

type GhegProposalVMV0_1 = {
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
};

type SourceSurfaceSegmentationV0_1 = {
  status: "SOURCE_REPORTED" | "MISMATCH";
  kind: "prefix" | "suffix";
  affix: string;
  sourceField: string;
  sourceScope: "source_record_level";
  adjudication: "source_reported_not_independently_adjudicated";
  boundaryCodePointOffset: number | null;
  left: AlbanianStructuralComponentVMV0_1 | null;
  right: AlbanianStructuralComponentVMV0_1 | null;
  sourceBaseSurfaceAlignment: "EXACT_FORM_RECONSTRUCTION" | "UNKNOWN";
  explanation: string;
};

export type AlbanianStructuralEvidenceVMV0_1 = {
  schemaVersion: "z-zero.orthographic-structural-evidence.v0_1";
  inputForm: string;
  analysis: StructuralInputAnalysisV0_2;
  sourceReference: {
    status: "SAME_FORM_SOURCE_REFERENCE";
    sourceIdentity: typeof ALBANIAN_STRUCTURAL_SOURCE_IDENTITY_V0_1;
    sourceRecord: AlbanianStructuralSourceRecordV0_1;
    sourceSurfaceSegmentation: SourceSurfaceSegmentationV0_1 | null;
    engineReductionComparison: {
      status: "MATCHED_ENGINE_REDUCTION" | "NO_MATCHING_REDUCTION" | "UNKNOWN";
      sourceBoundaryCodePointOffset: number | null;
      engineBoundaryCodePointOffsets: number[];
    };
    exactTargetSenseAlignment: "UNKNOWN";
    ghegProposal: GhegProposalVMV0_1 | null;
  } | null;
  representationAuthority: "orthographic";
  pronunciationAuthority: "not_established";
  lexicalIdentity: "not_inferred_from_form";
  historicalOriginClaim: "not_claimed";
};

function exactSourceReferenceKey(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const key = value.normalize("NFC").trim().toLocaleLowerCase("en-US");
  return Object.prototype.hasOwnProperty.call(
    ALBANIAN_STRUCTURAL_SOURCE_RECORDS_V0_1,
    key,
  )
    ? key
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

function actualEngineBoundaryOffsets(
  analysis: StructuralInputAnalysisV0_2,
): number[] {
  const formLength = Array.from(analysis.normalizedBasis).length;
  const offsets = new Set<number>();

  for (const hypothesis of analysis.hypotheses) {
    let parentStart = 0;
    let parentEnd = formLength;
    for (const step of hypothesis.reductionSteps) {
      const extractedStart = parentStart + step.fromSpan.start;
      const extractedEnd = parentStart + step.fromSpan.end;
      const isRightPeel =
        step.operationId === "peel_right_vowel_led_expansion" ||
        step.operationId === "peel_right_consonant_led_expansion";
      offsets.add(isRightPeel ? extractedStart : extractedEnd);
      parentStart = isRightPeel ? parentStart : extractedEnd;
      parentEnd = isRightPeel ? extractedStart : parentEnd;
    }
  }

  return [...offsets].sort((left, right) => left - right);
}

function sourceSurfaceSegmentation(
  analysis: StructuralInputAnalysisV0_2,
  record: AlbanianStructuralSourceRecordV0_1,
): SourceSurfaceSegmentationV0_1 | null {
  const morphology = record.morphology;
  if (!morphology) return null;

  const basis = analysis.normalizedBasis;
  const affix = morphology.affix.normalize("NFC").toLocaleLowerCase("en-US");
  const basisLength = Array.from(basis).length;
  const affixLength = Array.from(affix).length;
  const matchesSurface = morphology.kind === "prefix"
    ? basis.startsWith(affix)
    : basis.endsWith(affix);
  const boundary = morphology.kind === "prefix" ? affixLength : basisLength - affixLength;
  const left = matchesSurface ? componentAt(analysis, 0, boundary) : null;
  const right = matchesSurface ? componentAt(analysis, boundary, basisLength) : null;
  const sourceBaseSurfaceAlignment = morphology.kind === "prefix"
    ? `${affix}${morphology.sourceBaseForm}` === basis
    : `${morphology.sourceBaseForm}${affix}` === basis;

  if (!matchesSurface || !left || !right) {
    return {
      status: "MISMATCH",
      kind: morphology.kind,
      affix: morphology.affix,
      sourceField: morphology.sourceField,
      sourceScope: morphology.sourceScope,
      adjudication: morphology.adjudication,
      boundaryCodePointOffset: null,
      left: null,
      right: null,
      sourceBaseSurfaceAlignment: "UNKNOWN",
      explanation: `The record reports ${morphology.kind} ${morphology.affix}, but it does not yield a grapheme-aligned surface boundary for this form.`,
    };
  }

  return {
    status: "SOURCE_REPORTED",
    kind: morphology.kind,
    affix: morphology.affix,
    sourceField: morphology.sourceField,
    sourceScope: morphology.sourceScope,
    adjudication: morphology.adjudication,
    boundaryCodePointOffset: boundary,
    left,
    right,
    sourceBaseSurfaceAlignment: sourceBaseSurfaceAlignment
      ? "EXACT_FORM_RECONSTRUCTION"
      : "UNKNOWN",
    explanation: sourceBaseSurfaceAlignment
      ? `The source-reported ${morphology.kind} and base reconstruct this form at record level; this does not establish exact target-sense identity.`
      : `The source-reported affix matches this surface boundary. The source base is not established as the left surface component, and exact target-sense identity is unknown.`,
  };
}

function ghegProposalForPlanet(): GhegProposalVMV0_1 {
  return {
    userProposedStatement: "PLAN + JET → PLANET",
    proposedForm: "JET",
    proposalStatus: "USER_HYPOTHESIS",
    sourceAttestationStatus: "UNKNOWN",
    sourceBoundaryStatus: "UNKNOWN",
    proposedOrthographicVoicePath: ["E"],
    sourceHeadwordForm: "JETË",
    sourceHeadwordRecordId: ALBANIAN_JETE_SOURCE_RECORD_V0_1.sourceRecordId,
    sourceHeadwordEntryLocator: ALBANIAN_JETE_SOURCE_RECORD_V0_1.entryLocator,
    sourceHeadwordLine: ALBANIAN_JETE_SOURCE_RECORD_V0_1.sourceFileLine,
    sourceRegister: ALBANIAN_JETE_SOURCE_RECORD_V0_1.sourceRegister,
    dialectalSenseIds: ALBANIAN_JETE_SOURCE_RECORD_V0_1.dialectalSenseIds,
    bareJetFormInThisNounRecord: ALBANIAN_JETE_SOURCE_RECORD_V0_1.bareJetFormInThisNounRecord,
    sourceOrthographicVoicePath: ["E", "Ë"],
    pronunciationAuthority: "not_established",
    historicalDerivation: "not_claimed",
  };
}

export function adaptAlbanianStructuralEvidenceToVMV0_1(
  value: unknown,
): AlbanianStructuralEvidenceVMV0_1 | null {
  if (typeof value !== "string") return null;
  const analysis = analyzeStructuralInputV0_2(value);
  if (
    analysis.analysisStatus !== "analyzed" ||
    analysis.inputVoiceSequenceStatus !== "complete"
  ) {
    return null;
  }

  const referenceKey = exactSourceReferenceKey(value);
  const sourceRecord = referenceKey
    ? ALBANIAN_STRUCTURAL_SOURCE_RECORDS_V0_1[referenceKey]
    : null;
  const sourceSegmentation = sourceRecord
    ? sourceSurfaceSegmentation(analysis, sourceRecord)
    : null;
  const engineOffsets = actualEngineBoundaryOffsets(analysis);
  const sourceBoundary = sourceSegmentation?.status === "SOURCE_REPORTED"
    ? sourceSegmentation.boundaryCodePointOffset
    : null;
  const sourceReference = sourceRecord && referenceKey
    ? {
        status: "SAME_FORM_SOURCE_REFERENCE" as const,
        sourceIdentity: ALBANIAN_STRUCTURAL_SOURCE_IDENTITY_V0_1,
        sourceRecord,
        sourceSurfaceSegmentation: sourceSegmentation,
        engineReductionComparison: {
          status: sourceBoundary === null
            ? "UNKNOWN" as const
            : engineOffsets.includes(sourceBoundary)
              ? "MATCHED_ENGINE_REDUCTION" as const
              : "NO_MATCHING_REDUCTION" as const,
          sourceBoundaryCodePointOffset: sourceBoundary,
          engineBoundaryCodePointOffsets: engineOffsets,
        },
        exactTargetSenseAlignment: "UNKNOWN" as const,
        ghegProposal: referenceKey === "planet" ? ghegProposalForPlanet() : null,
      }
    : null;

  return {
    schemaVersion: "z-zero.orthographic-structural-evidence.v0_1",
    inputForm: analysis.inputForm,
    analysis,
    sourceReference,
    representationAuthority: "orthographic",
    pronunciationAuthority: "not_established",
    lexicalIdentity: "not_inferred_from_form",
    historicalOriginClaim: "not_claimed",
  };
}
