"use client";

import type {
  FunctionalMotivationCandidateInterpretationV0_2VM,
  FunctionalMotivationInterpretationV0_2VM,
  MotivationDiscoveryCandidateV0_1VM,
  MotivationDiscoveryV0_1VM,
  PresentOrMissing,
} from "@/ui/telemetry/types";
import type {
  AlbanianSourceLinkedConsonantSegmentV0_1,
  AlbanianSourceLinkedComponentReadingV0_1,
  AlbanianSourceLinkedComparisonV0_1,
  AlbanianSourceLinkedRecordV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  aggregateMotivationDiscoveryCandidatesV0_1,
  measureMotivationDiscoveryAggregationV0_1,
  type MotivationDiscoveryPrimaryWitnessV0_1,
} from "@/ui/instrument/motivationDiscoveryPresentationAggregation.v0_1";

function pathText(values: readonly string[]): string {
  return values.length ? values.join(" → ") : "Null";
}

function sourceSoundTagsTextV0_1(tags: readonly string[]): string {
  return tags.length ? tags.join(", ") : "not provided";
}

function sourceLinkedContextTextV0_1(
  variant: AlbanianSourceLinkedRecordV0_1["pronunciationVariants"][number],
): string {
  const context = variant.consonantalContext;
  if (context.status !== "SUPPORTED") {
    return `Null (${context.reasonCodes.join(", ") || "no reason recorded"})`;
  }
  const segmentText = (segment: AlbanianSourceLinkedConsonantSegmentV0_1): string =>
    `${segment.baseSymbol}${segment.optional ? " (optional)" : ""}`;
  const regionText = (region: readonly AlbanianSourceLinkedConsonantSegmentV0_1[]): string =>
    region.map(segmentText).join(" ") || "∅";
  const inter = context.interNucleusConsonants
    ?.map((region) => regionText(region))
    .join(" · ") ?? "Null";
  return `prefix ${context.prefixConsonants?.map(segmentText).join(" ") || "∅"} · inter ${inter} · suffix ${context.suffixConsonants?.map(segmentText).join(" ") || "∅"}`;
}

function sourceLinkedRecordCardV0_1(
  label: string,
  record: AlbanianSourceLinkedRecordV0_1,
) {
  return (
    <article className="rounded border border-[#28443f] bg-[#0c1514] p-2">
      <div className="font-semibold text-[#f5f7fb]">{label}: <span className="font-mono">{record.form}</span></div>
      <div className="mt-1 text-[#d7dde7]">{record.meaningGlosses.join(" · ") || "No gloss recorded"}</div>
      <div className="mt-1 break-words text-[10px] text-[#7fa69d]">
        {record.sourceRecordId} · {record.entryLocator} · ordinal {record.physicalRecordOrdinal}
      </div>
      {record.etymologyText ? (
        <div className="mt-2 break-words text-[#b6d0c8]">
          <span className="font-semibold text-[#f5f7fb]">Source-authored etymology (attributed):</span>{" "}
          {record.etymologyText}
        </div>
      ) : null}
      <div className="mt-2 break-words text-[#9fbdb5]">
        Structured source references: {record.etymologyLinks.length
          ? record.etymologyLinks.map((link) => `${link.sourceForm} → ${link.reference}`).join(" · ")
          : "none recorded"}
      </div>
      <div className="mt-2 space-y-1 text-[#9fbdb5]">
        {record.pronunciationVariants.length ? record.pronunciationVariants.map((variant) => (
          <div key={`${record.sourceRecordId}:${variant.soundIndex}`} className="break-words">
            <span className="font-mono">sound {variant.soundIndex}: {variant.rawIpa ?? "Null"}</span>{" · "}
            Voice {pathText(variant.voicePath)} · {sourceLinkedContextTextV0_1(variant)}
          </div>
        )) : <div>IPA variants: Null</div>}
      </div>
    </article>
  );
}

function sourceLinkedComparisonSummaryV0_1(
  comparison: AlbanianSourceLinkedComparisonV0_1,
): string {
  return comparison.status === "SUPPORTED"
    ? comparison.summary.text
    : `Null — ${comparison.summary.text} Reason: ${comparison.reasonCodes.join(", ") || "SOURCE_LINK_NOT_VERIFIED"}.`;
}

function sourceLinkedComponentReadingSummaryV0_1(
  reading: AlbanianSourceLinkedComponentReadingV0_1,
): string {
  return reading.status === "SUPPORTED"
    ? reading.exploratoryRelationship.statement ?? "Source-linked component relationship recorded."
    : `Null — ${reading.reasonCodes.join(", ") || "SOURCE_COMPONENT_RELATION_NOT_VERIFIED"}.`;
}

function fiveWindowsClassificationLabelV0_1(value: string): string {
  switch (value) {
    case "ALBANIAN_INTERNAL_FORMATION":
      return "Albanian internal formation (source-attributed)";
    case "SOURCE_ATTRIBUTED_BORROWING":
      return "Source-attributed borrowing";
    default:
      return "Unknown / Null";
  }
}

function zcText(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Null";
  const record = value as Record<string, unknown>;
  const p = typeof record.p === "number" ? record.p : null;
  const s = typeof record.s === "number" ? record.s : null;
  const a = typeof record.a === "number" ? record.a : null;
  const i = Array.isArray(record.i) ? record.i.join(" · ") : null;
  const d = Array.isArray(record.d) ? record.d.join(" · ") : null;
  if (p === null || s === null || a === null || i === null || d === null) return "present";
  return `P ${p} · I ${i || "none"} · S ${s} · D ${d || "none"} · A ${a}`;
}

function functionalStatusLabel(
  status: MotivationDiscoveryCandidateV0_1VM["functionalInterpretation"]["status"],
): string {
  switch (status) {
    case "REVIEWED_HYPOTHESIS":
      return "Reviewed functional hypothesis";
    case "GENERATED_BOUNDED_HYPOTHESIS":
      return "Bounded functional hypothesis";
    case "NOT_APPLICABLE_SELF_MATCH":
      return "Not applicable to an exact lexical self-match";
    case "UNKNOWN_OR_NULL":
      return "Functional motivation unknown";
  }
}

const NULL_REASON_EXPLANATIONS: Record<string, string> = {
  MISSING_TARGET_SENSE:
    "A target sense was not supplied, so no functional bridge was authorized.",
  INSUFFICIENT_FUNCTIONAL_EVIDENCE:
    "No reviewed functional evidence currently supports this bridge.",
  NO_AUTHORIZED_STRUCTURAL_RELATION:
    "This candidate and input do not have an authorized structural relation for this comparison.",
  LEXICAL_SELF_MATCH_NOT_FUNCTIONAL_MOTIVATION:
    "This confirms a lexical entry, but an exact self-match is not a cross-form functional motivation claim.",
  TARGET_SENSE_NOT_BOUND_TO_REVIEWED_EVIDENCE:
    "The requested sense is not bound to reviewed evidence, so the functional bridge remains unclaimed.",
  NO_GENERIC_AUTHORIZED_SOURCE_WITNESS:
    "No authorized source witness supports a functional interpretation for this result.",
};

function nullReasonSummary(reason: string | null): string {
  if (!reason) return "No functional interpretation is currently available.";
  return NULL_REASON_EXPLANATIONS[reason] ?? `Unclassified interpretation state: ${reason}`;
}

function functionalSummary(candidate: MotivationDiscoveryCandidateV0_1VM): string {
  if (candidate.functionalInterpretation.statement) {
    return candidate.functionalInterpretation.statement;
  }
  return nullReasonSummary(candidate.functionalInterpretation.reason);
}

function interpretationHypothesisSummary(
  interpretation: FunctionalMotivationCandidateInterpretationV0_2VM,
): string {
  if (interpretation.hypothesis.statement) return interpretation.hypothesis.statement;
  return nullReasonSummary(interpretation.hypothesis.reason);
}

function discoveryEntryCause(candidate: MotivationDiscoveryCandidateV0_1VM): string {
  const reason = candidate.structuralComparison.matchReason.trim();
  if (reason) {
    return `This candidate appears because the existing Discovery record says: ${reason}`;
  }
  return "This candidate entered through the existing source/structural Discovery path.";
}

function representationLabel(value: string): string {
  switch (value) {
    case "production_spoken":
      return "spoken pronunciation authority";
    case "orthographic_profile_derived":
      return "orthographic/profile-derived Discovery representation";
    case "albanian_profile":
      return "Albanian profile representation";
    default:
      return value;
  }
}

function exactLexicalSourceStatusLabel(
  status: NonNullable<MotivationDiscoveryV0_1VM["exactLexicalSourceStatus"]>["status"],
): string {
  switch (status) {
    case "MATCHES_FOUND":
      return "Exact source records found";
    case "SOURCE_NOT_FOUND":
      return "No exact source record found";
    case "UNAVAILABLE":
      return "Source unavailable";
    case "NOT_QUERIED":
      return "Not queried for this input language";
  }
}

function representationBoundary(candidate: MotivationDiscoveryCandidateV0_1VM): string | null {
  const comparison = candidate.structuralComparison;
  if (
    comparison.representationCompatibility !== "CROSS_REPRESENTATION" &&
    comparison.voiceRelationship !== "NOT_COMPARABLE_ACROSS_REPRESENTATIONS"
  ) {
    if (
      comparison.candidateRepresentationKind === "orthographic_profile_derived" &&
      comparison.candidateVoicePath.length === 0
    ) {
      return "Candidate pronunciation and spoken Voice path are Null: this source supplies lexical form/gloss only. The displayed candidate representation is not spoken authority.";
    }
    return null;
  }
  return `Voice comparison is limited: the input uses ${representationLabel(comparison.inputRepresentationKind)} while this candidate currently uses ${representationLabel(comparison.candidateRepresentationKind)}.`;
}

function Candidate({
  witness,
  interpretation,
}: {
  witness: MotivationDiscoveryPrimaryWitnessV0_1;
  interpretation?: FunctionalMotivationCandidateInterpretationV0_2VM;
}) {
  const candidate = witness.representative;
  const records = witness.records;
  const comparison = candidate.structuralComparison;
  const inputStructure = comparison.inputConsonantalStructure;
  const candidateStructure = comparison.candidateConsonantalStructure;
  const isSelfMatch = comparison.presentationClassification === "LEXICAL_ENTRY_CONFIRMATION";
  const boundary = representationBoundary(candidate);

  return (
    <article
      data-testid="motivation-discovery-candidate"
      data-primary-witness="true"
      className="rounded-lg border border-[#3e4b59] bg-[#0d1117] p-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-mono text-sm font-semibold text-[#f5f7fb]">
              {candidate.candidateForm}
            </h4>
            <span className="text-xs text-[#9fb1bf]">{candidate.candidateLanguage}</span>
            <span className="rounded-full border border-[#3f5368] bg-[#10161c] px-2 py-0.5 text-[10px] uppercase text-[#b8cce0]">
              {isSelfMatch ? "lexical entry confirmation" : "primary source witness"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#d7dde7]">{candidate.candidateGloss}</p>
          {records.length > 1 ? (
            <p className="mt-1 text-xs text-[#9fb1bf]">
              {records.length} underlying source records retained in the evidence ledger.
            </p>
          ) : null}
        </div>
      </div>

      {interpretation ? (
        <div
          data-testid="functional-motivation-interpretation-layers"
          className="mt-3 grid gap-2 sm:grid-cols-3"
        >
          <div className="rounded border border-[#303843] bg-[#10161c] p-2 text-xs leading-5 text-[#c5ced8]">
            <div className="font-semibold uppercase tracking-[0.1em] text-[#8ea4ba]">CANDIDATE CORRESPONDENCE</div>
            <div className="mt-1 break-words font-mono">{interpretation.correspondence.matchClassification}</div>
            <div className="break-words text-[#9fb1bf]">{interpretation.correspondence.representationCompatibility}</div>
            <div className="break-words text-[#9fb1bf]">operations: {interpretation.correspondence.operationIds.join(", ") || "none"}</div>
          </div>
          <div className="rounded border border-[#303843] bg-[#10161c] p-2 text-xs leading-5 text-[#c5ced8]">
            <div className="font-semibold uppercase tracking-[0.1em] text-[#8ea4ba]">REVIEWED FUNCTIONAL EVIDENCE</div>
            <div className="mt-1 font-semibold">
              {interpretation.reviewedFunctionalEvidence.authorityStatus === "REVIEWED_ACCEPTED" ? "Present" : "Unknown / Null"}
            </div>
            <div className="break-words text-[#9fb1bf]">
              {interpretation.reviewedFunctionalEvidence.evidenceRefs.join(", ") ||
                (interpretation.reviewedFunctionalEvidence.reason
                  ? nullReasonSummary(interpretation.reviewedFunctionalEvidence.reason)
                  : "No reviewed evidence")}
            </div>
          </div>
          <div className="rounded border border-[#4b3f2c] bg-[#18140e] p-2 text-xs leading-5 text-[#f0ddb0]">
            <div className="font-semibold uppercase tracking-[0.1em]">ZË-RO FUNCTIONAL HYPOTHESIS</div>
            <div className="mt-1 font-semibold">
              {interpretation.hypothesis.status === "HYPOTHESIS" ? "Hypothesis" : "Unknown / Null"}
            </div>
            <div className="break-words">
              {interpretationHypothesisSummary(interpretation)}
            </div>
          </div>
        </div>
      ) : null}

      <div
        data-testid="motivation-structural-comparison"
        className="mt-3 rounded-md border border-[#3e4b59] bg-[#10161c] p-2.5 text-xs leading-5 text-[#d7dde7]"
      >
        <div className="font-semibold uppercase tracking-[0.12em] text-[#f0ddb0]">
          {isSelfMatch ? "LEXICAL ENTRY CONFIRMATION" : "WHY THIS CANDIDATE"}
        </div>
        <p className="mt-1 text-sm text-[#d7dde7]">{comparison.matchReason}</p>
        {!isSelfMatch ? (
          <p data-testid="discovery-entry-cause" className="mt-2 text-sm text-[#c5ced8]">
            {discoveryEntryCause(candidate)}
          </p>
        ) : null}
        {!isSelfMatch && boundary ? (
          <p className="mt-2 rounded border border-[#4a402d] bg-[#18140e] p-2 text-[#e3cf9b]">
            {boundary}
          </p>
        ) : null}
      </div>

      <div
        data-testid="motivation-functional-interpretation"
        className="mt-3 rounded-md border border-[#4b3f2c] bg-[#18140e] p-2.5 text-xs leading-5 text-[#f0ddb0]"
      >
        <div className="font-semibold uppercase tracking-[0.12em]">FUNCTIONAL MOTIVATION</div>
        <div className="mt-1 text-sm font-semibold">{functionalStatusLabel(candidate.functionalInterpretation.status)}</div>
        <p className="mt-1 text-sm">{functionalSummary(candidate)}</p>
        {candidate.functionalInterpretation.status === "REVIEWED_HYPOTHESIS" ? (
          <p className="mt-2 text-xs text-[#d5c28f]">This is a functional hypothesis, not a historical-origin claim.</p>
        ) : null}
      </div>

      <details
        data-testid="motivation-candidate-details"
        className="mt-3 rounded-md border border-[#303843] bg-[#10161c] text-xs text-[#c5ced8]"
      >
        <summary className="cursor-pointer list-none px-3 py-2 font-semibold text-[#d7dde7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bb7a]">
          <span aria-hidden="true" className="mr-2">▸</span>
          Evidence &amp; structure
        </summary>
        <div className="space-y-3 border-t border-[#303843] px-3 py-3 leading-5">
          <div>
            <div className="font-semibold text-[#f0ddb0]">Source fact</div>
            <div className="mt-1 text-[#9fb1bf]">
              Evidence ledger: {records.length} record{records.length === 1 ? "" : "s"}
            </div>
            <div className="mt-1 text-[#9fb1bf]">
              Source family: {candidate.sourceFact.sourceFamilyId ?? "unavailable"}
            </div>
            <div className="mt-2 space-y-3">
              {records.map((record, index) => (
                <div
                  key={`${record.sourceFact.sourceId}:${index}`}
                  data-testid="motivation-evidence-ledger-record"
                  className="rounded border border-[#303843] bg-[#0d1117] p-2"
                >
                  <div className="font-semibold text-[#d7dde7]">Source record {index + 1}</div>
                  <div className="mt-1 break-words font-mono">{record.sourceFact.sourceId}</div>
                  <div className="break-words text-[#9fb1bf]">
                    {record.candidateForm} · {record.candidateGloss}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    {record.sourceFact.attestationTruth} · {record.sourceFact.sourceStatus}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    {record.sourceFact.sourceUrlOrArchiveRef ?? "Source locator unavailable"}
                    {record.sourceFact.entryLocator ? ` · ${record.sourceFact.entryLocator}` : ""}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    lexical source: {record.sourceFact.sourceUrlOrArchiveRef ?? "unavailable"}
                    {record.sourceFact.entryLocator ? ` · ${record.sourceFact.entryLocator}` : ""}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Evidence refs: {record.sourceFact.evidenceRefs.join(", ") || "none"}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Matched query: {record.structuralComparison.matchedQuery} · relation: {record.structuralComparison.matchClassification}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Entry reason: {record.structuralComparison.matchReason}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Reason codes: {record.structuralComparison.reasonCodes.join(", ") || "none"}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Representation: {record.structuralComparison.representationCompatibility} · carrier: {record.structuralComparison.consonantalCarrierRelationship}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Functional authority: {record.functionalInterpretation.status} · {record.functionalInterpretation.reason ?? "none"}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-1 text-[#9fb1bf]">deterministic embryo/source-row lookup; no target-word mapping</div>
          </div>

          <div>
            <div className="font-semibold text-[#f0ddb0]">Structural details</div>
            <dl className="mt-1 grid gap-x-3 gap-y-1 sm:grid-cols-2">
              <div><dt className="text-[#8ea4ba]">Matched embryo / query</dt><dd className="break-words font-mono">{comparison.matchedQuery}</dd></div>
              <div><dt className="text-[#8ea4ba]">Candidate status</dt><dd className="font-mono">{candidate.candidateStatus}</dd></div>
              <div><dt className="text-[#8ea4ba]">Input representation</dt><dd className="break-words font-mono">{comparison.inputRepresentationKind}</dd></div>
              <div><dt className="text-[#8ea4ba]">Candidate representation</dt><dd className="break-words font-mono">{comparison.candidateRepresentationKind}</dd></div>
              <div><dt className="text-[#8ea4ba]">Representation compatibility</dt><dd className="break-words font-mono">{comparison.representationCompatibility}</dd></div>
              <div><dt className="text-[#8ea4ba]">Voice relationship</dt><dd className="break-words font-mono">{comparison.voiceRelationship}</dd></div>
              <div><dt className="text-[#8ea4ba]">Input Voice / nucleus</dt><dd className="font-mono">{pathText(comparison.inputVoicePath)}</dd></div>
              <div><dt className="text-[#8ea4ba]">Candidate Voice / nucleus</dt><dd className="font-mono">{pathText(comparison.candidateVoicePath)}</dd></div>
              <div><dt className="text-[#8ea4ba]">Carrier relationship</dt><dd className="break-words font-mono">{comparison.consonantalCarrierRelationship}</dd></div>
              <div><dt className="text-[#8ea4ba]">Expansion / composition</dt><dd className="break-words font-mono">{comparison.expansionOrCompositionChain.join(" → ") || "not emitted"}</dd></div>
            </dl>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-[#8ea4ba]">Input carrier / consonantal context</div>
              <div className="break-words font-mono">roots {inputStructure.protoRoots.join(" + ") || "Null"}</div>
              <div className="break-words font-mono">carriers {inputStructure.carrierForms.join(" + ") || "Null"}</div>
              <div className="break-words font-mono">Γ {inputStructure.gamma?.join(" → ") || "Null"}</div>
            </div>
            <div>
              <div className="text-[#8ea4ba]">Candidate consonantal structure</div>
              <div className="font-mono">{candidateStructure ? "present" : "Null · not authorized"}</div>
            </div>
          </div>

          <div className="break-words text-[#9fb1bf]">
            Authorized operations: {comparison.authorizedOperationIds.join(", ") || "none"}
            <br />
            Unresolved fields: {comparison.unresolvedFields.join(", ") || "none"}
          </div>

          <div className="break-words text-[#9fb1bf]">
            Truth class: {candidate.functionalInterpretation.truthClassification} · evidence: {candidate.functionalInterpretation.evidenceKind}
            <br />
            Functional evidence refs: {candidate.functionalInterpretation.evidenceRefs.join(", ") || "none"}
            <br />
            Functional reason: {candidate.functionalInterpretation.reason ?? "none"}
            {interpretation?.hypothesis.reason ? (
              <>
                <br />
                Interpretation reason code: {interpretation.hypothesis.reason}
              </>
            ) : null}
            {interpretation?.reviewedFunctionalEvidence.reason ? (
              <>
                <br />
                Reviewed evidence reason code: {interpretation.reviewedFunctionalEvidence.reason}
              </>
            ) : null}
            <br />
            Historical relation: {candidate.historicalRelation}
          </div>
        </div>
      </details>
    </article>
  );
}

export function MotivationDiscoveryCardV0_1({
  discovery,
  interpretation,
}: {
  discovery: PresentOrMissing<MotivationDiscoveryV0_1VM> | undefined;
  interpretation?: PresentOrMissing<FunctionalMotivationInterpretationV0_2VM>;
}) {
  if (!discovery || discovery.kind !== "present") return null;
  const value = discovery.value;
  const math = value.derivedStructure.math7;
  const zc = value.derivedStructure.zeroConsonantalStructuralComposition;
  const primaryWitnesses = aggregateMotivationDiscoveryCandidatesV0_1(value.candidates);
  const aggregationMetrics = measureMotivationDiscoveryAggregationV0_1(
    value.candidates,
    primaryWitnesses,
  );
  const lexicalSelfMatchCount = primaryWitnesses.filter(
    (witness) => witness.representative.structuralComparison.presentationClassification === "LEXICAL_ENTRY_CONFIRMATION",
  ).length;
  const exactLexicalSourceFacts = value.exactLexicalSourceFacts ?? [];
  const sourceIpaSevenVoiceAnalyses = value.sourceIpaSevenVoiceAnalyses ?? [];
  const albanianLexicalReading = value.albanianLexicalReading;
  const selectedPrimarySourceRecordId = albanianLexicalReading?.primarySourceFact?.sourceRecordId ?? null;
  const relatedCandidateEvaluations = albanianLexicalReading?.relatedCandidateEvaluations ?? [];
  const supportedRelatedCandidateEvaluations = relatedCandidateEvaluations.filter((candidate) =>
    candidate.functionalMeaningBridge.status === "SUPPORTED",
  );
  const nullRelatedCandidateEvaluations = relatedCandidateEvaluations.filter((candidate) =>
    candidate.functionalMeaningBridge.status === "NULL",
  );
  const nullRelatedCandidateCount = nullRelatedCandidateEvaluations.length;

  return (
    <section
      aria-label="Multilingual source Discovery"
      data-testid="motivation-discovery-card"
      className="rounded-[12px] border border-[#6b5b2f] bg-[#17140e] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8bb7a]">
            MULTILINGUAL SOURCE DISCOVERY
          </div>
          <h2 className="mt-1 text-base font-semibold text-[#f5f7fb]">
            Primary source witnesses to inspect
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[#aeb7c5]">
            This surface shows primary witnesses from the existing source/structural Discovery path. Each witness retains its underlying source records, while source evidence remains separate from interpretation.
          </p>
          <p data-testid="multilingual-discovery-role" className="mt-2 max-w-2xl text-xs leading-5 text-[#c5ced8]">
            Discovery explains which source-bound witnesses are available for inspection. It does not select a candidate or override the separate word-specific reading.
          </p>
        </div>
        <span className="rounded-full border border-[#6b5b2f] px-2.5 py-1 text-[11px] font-semibold text-[#f0ddb0]">
          {aggregationMetrics.primaryWitnessCount} primary Discovery witness{aggregationMetrics.primaryWitnessCount === 1 ? "" : "es"}
        </span>
      </div>

      {lexicalSelfMatchCount > 0 ? (
        <div
          data-testid="motivation-lexical-self-match-summary"
          className="mt-3 rounded-lg border border-[#6b5b2f] bg-[#18140e] p-3 text-xs leading-5 text-[#f0ddb0]"
        >
          <div className="font-semibold uppercase tracking-[0.12em]">LEXICAL SELF-MATCH / ENTRY CONFIRMATION</div>
          <p className="mt-1 text-sm">
            This input matches a source-attested lexical entry. It is not a cross-form functional motivation claim.
          </p>
        </div>
      ) : null}

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <div className="rounded-lg border border-[#3f3a2b] bg-[#101217] p-3 text-xs leading-5 text-[#c5ced8]">
          <div className="font-semibold uppercase tracking-[0.12em] text-[#f0ddb0]">INPUT</div>
          <div className="mt-1 text-sm text-[#f5f7fb]">
            <span className="font-mono">{value.inputWord}</span> · {value.inputLanguage}
          </div>
          <div className="mt-1 text-[#9fb1bf]">{value.sourceFact.sourceStatus}</div>
        </div>
        <div className="rounded-lg border border-[#303843] bg-[#10161c] p-3 text-xs leading-5 text-[#c5ced8] sm:min-w-[12rem]">
          <div className="font-semibold uppercase tracking-[0.12em] text-[#8ea4ba]">VOICE PATH</div>
          <div className="mt-1 font-mono text-base text-[#f5f7fb]">{pathText(value.derivedStructure.voicePath)}</div>
          <div className="mt-1 break-words text-[10px] text-[#7f8b99]">
            source: {value.derivedStructure.voicePathSource} · profile: {value.inputProfile}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-[#303843] bg-[#10161c] p-3 text-xs leading-5 text-[#c5ced8]">
        <div className="font-semibold uppercase tracking-[0.12em] text-[#8ea4ba]">SOURCE FACT</div>
        <div className="mt-1">{value.sourceFact.authorityBoundary}</div>
        <details className="mt-2" data-testid="motivation-derived-structure-details">
          <summary className="cursor-pointer list-none font-semibold text-[#d7dde7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bb7a]">
            <span aria-hidden="true" className="mr-2">▸</span>
            Derived structure details
          </summary>
          <div className="mt-2 grid gap-2 border-t border-[#303843] pt-2 sm:grid-cols-3">
            <div>
              <div className="text-[#8ea4ba]">Math7</div>
              <div className="break-words font-mono">{math.basis ?? "basis unavailable"} · total mod 7 {math.totalMod7 ?? "Null"}</div>
              <div className="break-words text-[10px] text-[#7f8b99]">{math.principlesPath.join(" → ") || "principles unavailable"}</div>
            </div>
            <div>
              <div className="text-[#8ea4ba]">Γ / consonantal structure</div>
              <div className="break-words font-mono">
                {value.derivedStructure.gamma.status === "NULL"
                  ? "Null"
                  : value.derivedStructure.gamma.orderedUnits.join(" → ") || "none"}
              </div>
              <div className="break-words text-[10px] text-[#7f8b99]">{value.derivedStructure.gamma.reason ?? value.derivedStructure.gamma.status}</div>
            </div>
            <div>
              <div className="text-[#8ea4ba]">ZË-RO structural composition</div>
              <div className="break-words font-mono">
                {zc.status === "NULL" ? "Null" : zc.variants.map(zcText).join(" | ") || "present"}
              </div>
              <div className="break-words text-[10px] text-[#7f8b99]">{zc.reason ?? zc.status}</div>
            </div>
          </div>
        </details>
      </div>

      {value.exactLexicalSourceStatus ? (
        <div
          data-testid="albanian-exact-lexical-source-facts"
          className="mt-3 rounded-lg border border-[#3f5368] bg-[#10161c] p-3 text-xs leading-5 text-[#c5ced8]"
        >
          <div className="font-semibold uppercase tracking-[0.12em] text-[#b8cce0]">
            EXACT ALBANIAN LEXICAL SOURCE FACTS
          </div>
          <div className="mt-1 text-sm text-[#f5f7fb]">
            {exactLexicalSourceStatusLabel(value.exactLexicalSourceStatus.status)}
          </div>
          <div className="mt-1 break-words font-mono text-[10px] text-[#9fb1bf]">
            query: {value.exactLexicalSourceStatus.queryForm ?? "Null"} · reason: {value.exactLexicalSourceStatus.reasonCode ?? "none"}
          </div>
          {exactLexicalSourceFacts.length ? (
            <div className="mt-3 space-y-3">
              {exactLexicalSourceFacts.map((fact) => (
                <article
                  key={fact.sourceRecordId}
                  className="rounded border border-[#303843] bg-[#0d1117] p-2"
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <div className="font-mono text-sm font-semibold text-[#f5f7fb]">{fact.form}</div>
                    <div className="text-[#9fb1bf]">{fact.language} · {fact.partOfSpeech ?? "part of speech Null"}</div>
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#d8bb7a]">
                    {selectedPrimarySourceRecordId === null
                      ? "SOURCE RECORD SELECTION UNKNOWN"
                      : fact.sourceRecordId === selectedPrimarySourceRecordId
                        ? "SELECTED PRIMARY SOURCE RECORD"
                        : "ALTERNATIVE SOURCE RECORD — NOT EVALUATED AS THE SELECTED PRIMARY READING"}
                  </div>
                  <div className="mt-1 text-[#d7dde7]">
                    {fact.senses.flatMap((sense) => sense.glosses).join(" · ") || "No gloss recorded"}
                  </div>
                  <div className="mt-2 break-words text-[#9fb1bf]">
                    IPA source data: {fact.ipaObservations.map((observation) => observation.ipa ?? "Null").join(" · ") || "Null"}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Pronunciation authority: {fact.pronunciationAuthority}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Source record: {fact.sourceRecordId} · {fact.entryLocator}
                  </div>
                  <div className="break-words text-[#9fb1bf]">
                    Snapshot: {fact.sourceSnapshot.sha256} · {fact.sourceSnapshot.bytes} bytes
                  </div>
                  {fact.relatedForms?.length ? (
                    <details data-testid="albanian-source-record-links" className="mt-2 rounded border border-[#303843] bg-[#111820] p-2">
                      <summary className="cursor-pointer text-[#d7dde7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bb7a]">
                        Source-provided form links ({fact.relatedForms.length})
                      </summary>
                      <div className="mt-2 space-y-1 text-[#9fb1bf]">
                        <div className="text-[10px] text-[#7f8b99]">
                          These are source-provided form links belonging to this lexical record. Alternative-record links are not evaluated in the selected primary functional reading.
                        </div>
                        {fact.relatedForms.map((relation, relationIndex) => (
                          <div
                            key={`${fact.sourceRecordId}:${relationIndex}:${relation.form}:${relation.entryLocator}`}
                            data-testid="albanian-source-record-link"
                            className="break-words"
                          >
                            <span className="font-mono text-[#d7dde7]">{relation.form}</span>{" · "}
                            {relation.relation}{" · "}
                            {relation.entryLocator}
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : null}
                  <div className="mt-1 text-[10px] text-[#7f8b99]">
                    Exact lexical source fact only; IPA is not promoted to the canonical Voice path.
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-2 text-[#d5c28f]">No exact lexical facts are available; Null is valid.</div>
          )}
        </div>
      ) : null}

      {sourceIpaSevenVoiceAnalyses.length > 0 ? (
        <div
          data-testid="albanian-source-ipa-seven-voices"
          className="mt-3 rounded-lg border border-[#4d4768] bg-[#11101a] p-3 text-xs leading-5 text-[#c5ced8]"
        >
          <div className="font-semibold uppercase tracking-[0.12em] text-[#c7b9ef]">
            SOURCE IPA → SEVEN VOICES
          </div>
          <div className="mt-1 text-sm text-[#f5f7fb]">
            Current Kaikki IPA interpreted through the existing Seven-Voice reference quantizer
          </div>
          <div className="mt-1 text-[10px] text-[#9fb1bf]">
            Product interpretation only; this does not promote current-source IPA to frozen pronunciation authority or replace the separate profile-derived path.
          </div>
          <div className="mt-1 text-[10px] text-[#9fb1bf]">
            Sound tags are copied from the current Kaikki lexical observation; they are not independently validated dialect-profile authority.
          </div>
          <div className="mt-3 space-y-3">
            {sourceIpaSevenVoiceAnalyses.map((analysis) => (
              <article
                key={`${analysis.sourceRecordId}:${analysis.soundIndex}`}
                className="rounded border border-[#39334f] bg-[#0d0d14] p-2"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <div className="font-mono text-sm font-semibold text-[#f5f7fb]">{analysis.form}</div>
                  <div className="text-[#9fb1bf]">sound {analysis.soundIndex} · {analysis.status}</div>
                </div>
                <div className="mt-1 break-words font-mono text-[#d7cffa]">
                  IPA: {analysis.rawIpa ?? "Null"} · Voice path: {pathText(analysis.voicePath)}
                </div>
                <div className="break-words text-[#9fb1bf]">
                  Source sound tags: {sourceSoundTagsTextV0_1(analysis.tags)}
                </div>
                <div className="break-words text-[#9fb1bf]">
                  Nuclei: {analysis.nuclei.map((nucleus) => `${nucleus.raw} → ${nucleus.voice ?? "Null"}`).join(" · ") || "Null"}
                </div>
                <div className="break-words text-[#9fb1bf]">
                  Reasons: {analysis.reasonCodes.join(", ") || "none"}
                </div>
                <div className="break-words text-[#9fb1bf]">
                  Source record: {analysis.sourceRecordId} · ordinal {analysis.physicalRecordOrdinal}
                </div>
                <div className="break-words text-[10px] text-[#7f8b99]">
                  Snapshot: {analysis.sourceSnapshot.sha256} · boundary: {analysis.authorityBoundary}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {albanianLexicalReading?.fiveWindowsComparison ? (
        <section
          data-testid="albanian-five-windows-comparison"
          className="mt-3 rounded border border-[#53607a] bg-[#111521] p-3 text-xs leading-5 text-[#dce5f5]"
        >
          <div className="font-semibold uppercase tracking-[0.1em] text-[#c9d7f0]">
            FIVE WINDOWS — ALBANIAN WORD COMPARISON
          </div>
          <div className="mt-1 text-[#aebbd5]">{albanianLexicalReading.fiveWindowsComparison.summary}</div>
          <div className="mt-2 space-y-2">
            {albanianLexicalReading.fiveWindowsComparison.members.map((member) => (
              <article
                key={member.form}
                data-testid="albanian-five-windows-member"
                className="rounded border border-[#34415c] bg-[#0b101c] p-2"
              >
                <div className="font-mono text-sm text-[#f5f7fb]">{member.form}</div>
                <div className="mt-1 text-[#aebbd5]">Source status: {member.status}</div>
                {member.records.length ? member.records.map((record) => (
                  <div
                    key={record.sourceRecordId}
                    data-testid="albanian-five-windows-record"
                    className="mt-2 rounded border border-[#26334a] bg-[#101725] p-2"
                  >
                    <div>Meaning: {record.meaningGlosses.join("; ") || "Unknown / Null"}</div>
                    <div>Formation / borrowing: {fiveWindowsClassificationLabelV0_1(record.classification)}</div>
                    <div>Original language: {record.borrowedFromLanguage ?? "Unknown / Null"}</div>
                    <div>Ultimate source language: {record.ultimateSourceLanguage ?? "Unknown / Null"}</div>
                    <div>Usage / register: {record.usageNotes.join("; ") || "Unknown / Null"}</div>
                    <div className="mt-1 break-words text-[#8fa4c6]">
                      Source: {record.sourceRecordId} · {record.entryLocator} · ordinal {record.physicalRecordOrdinal}
                    </div>
                    <div className="mt-1 break-words text-[#aebbd5]">
                      Etymology (attributed): {record.etymologyText ?? "Unknown / Null"}
                    </div>
                    <div className="mt-2 font-semibold text-[#c9d7f0]">Source IPA → Seven Voices</div>
                    {record.sourceIpaSevenVoiceAnalyses.length ? record.sourceIpaSevenVoiceAnalyses.map((analysis) => (
                      <div
                        key={`${analysis.sourceRecordId}:${analysis.soundIndex}`}
                        data-testid="albanian-five-windows-ipa-analysis"
                        className="mt-1 grid gap-2 rounded border border-[#26334a] bg-[#0b101c] p-2 sm:grid-cols-2"
                      >
                        <div className="break-words text-[#d7cffa]">
                          <div>Sound {analysis.soundIndex} · {analysis.status}</div>
                          <div>Source IPA: {analysis.rawIpa ?? "Null"}</div>
                          <div>Source sound tags: {sourceSoundTagsTextV0_1(analysis.tags)}</div>
                        </div>
                        <div className="break-words text-[#d7cffa]">
                          <div>Derived Voice path: {pathText(analysis.voicePath)}</div>
                          <div>Reasons: {analysis.reasonCodes.join(", ") || "none"}</div>
                        </div>
                        <div className="break-words text-[#8fa4c6] sm:col-span-2">
                          Authority: {analysis.sourcePronunciationAuthority} · boundary: {analysis.authorityBoundary}
                        </div>
                        <div className="break-words text-[10px] text-[#7f8b99] sm:col-span-2">
                          Source record: {analysis.sourceRecordId} · sound {analysis.soundIndex} · snapshot {analysis.sourceSnapshot.sha256}
                        </div>
                      </div>
                    )) : (
                      <div className="mt-1 break-words text-[#d5c28f]">
                        Source IPA: Null · Derived Voice path: Null · Reason: IPA_OBSERVATION_MISSING
                      </div>
                    )}
                    <div className="mt-1 break-words text-[10px] text-[#7f8b99]">
                      Source IPA and derived Voice paths are descriptive current-source observations, not semantic, borrowing-direction or historical proof.
                    </div>
                    <div className="mt-1 break-words text-[10px] text-[#7f8b99]">
                      Source sound tags are copied from the current Kaikki lexical observation, not inferred from spelling or geography.
                    </div>
                  </div>
                )) : (
                  <div className="mt-2 rounded border border-[#594a2b] bg-[#211c12] p-2 text-[#f0ddb0]">
                    Unknown / Null — {member.reasonCodes.join(", ") || "no source record returned"}.
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className="mt-2 text-[#aebbd5]">
            Alternatives: {albanianLexicalReading.fiveWindowsComparison.alternatives.join(" ")}
          </div>
          <div className="mt-2 text-[10px] text-[#aebbd5]">
            {albanianLexicalReading.fiveWindowsComparison.claimBoundary}
          </div>
        </section>
      ) : null}

      {albanianLexicalReading?.status === "SUPPORTED" ? (
        <div
          data-testid="albanian-lexical-reading"
          className="mt-3 rounded-lg border border-[#385b55] bg-[#0f1a19] p-3 text-xs leading-5 text-[#d5ece5]"
        >
          <div className="font-semibold uppercase tracking-[0.12em] text-[#9dd7c4]">
            ALBANIAN WORD READING · SOURCE-BOUND PRODUCT VIEW
          </div>
          {albanianLexicalReading.primarySourceFact ? (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rounded border border-[#28443f] bg-[#0c1514] p-2">
                <div className="font-semibold text-[#f5f7fb]">Attested meaning</div>
                <div data-testid="albanian-reading-meaning" className="mt-1 text-sm text-[#e1f2ed]">
                  {albanianLexicalReading.primarySourceFact.meaningGlosses.join("; ") || "Null"}
                </div>
                <div className="mt-1 break-words text-[#9fbdb5]">
                  {albanianLexicalReading.primarySourceFact.form} · {albanianLexicalReading.primarySourceFact.partOfSpeech ?? "POS unavailable"}
                </div>
                <div className="mt-1 break-words font-mono text-[10px] text-[#7fa69d]">
                  {albanianLexicalReading.primarySourceFact.sourceRecordId} · {albanianLexicalReading.primarySourceFact.entryLocator}
                </div>
                {albanianLexicalReading.primarySourceFact.etymologyText ? (
                  <div data-testid="albanian-reading-source-etymology" className="mt-2 break-words text-[#b6d0c8]">
                    <span className="font-semibold text-[#f5f7fb]">Source-authored etymology (attributed):</span>{" "}
                    {albanianLexicalReading.primarySourceFact.etymologyText}
                  </div>
                ) : null}
              </div>
              <div className="rounded border border-[#28443f] bg-[#0c1514] p-2">
                <div className="font-semibold text-[#f5f7fb]">Computed source structure</div>
                <div data-testid="albanian-reading-voice-path" className="mt-1 font-mono text-sm text-[#e1f2ed]">
                  {albanianLexicalReading.sourcePronunciation?.voicePath.length
                    ? albanianLexicalReading.sourcePronunciation.voicePath.join(" → ")
                    : "Null"}
                </div>
                <div className="mt-1 break-words text-[#9fbdb5]">
                  IPA: {albanianLexicalReading.sourcePronunciation?.rawIpa ?? "Null"} · pronunciation authority remains current-source product evidence
                </div>
              </div>
            </div>
          ) : null}
          {albanianLexicalReading.sourceLinkedComparison ? (
            <div
              data-testid="albanian-source-linked-comparison"
              className="mt-3 rounded border border-[#3f5368] bg-[#111a21] p-3 text-xs leading-5 text-[#d5e8f3]"
            >
              <div className="font-semibold uppercase tracking-[0.1em] text-[#b7d7e8]">SOURCE-LINKED WORD COMPARISON</div>
              <div className="mt-1 text-[#a9c3d0]">
                Source relation: {albanianLexicalReading.sourceLinkedComparison.relation.relatedForm}{" "}
                · {albanianLexicalReading.sourceLinkedComparison.relation.direction}
              </div>
              <div className="mt-1 break-words text-[#a9c3d0]">
                Structured source reference: {albanianLexicalReading.sourceLinkedComparison.relation.referencedForm ?? "Null"}{" "}
                → {albanianLexicalReading.sourceLinkedComparison.relation.reference ?? "Null"}
              </div>
              {albanianLexicalReading.sourceLinkedComparison.status === "SUPPORTED" && albanianLexicalReading.sourceLinkedComparison.related ? (
                <>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {sourceLinkedRecordCardV0_1("Primary source record", albanianLexicalReading.sourceLinkedComparison.primary)}
                    {sourceLinkedRecordCardV0_1("Linked source record", albanianLexicalReading.sourceLinkedComparison.related)}
                  </div>
                  <div className="mt-3 rounded border border-[#355a72] bg-[#0d151c] p-2">
                    <div className="font-semibold text-[#f5f7fb]">Engine comparison</div>
                    <div className="mt-1 text-sm text-[#e1f2ed]">{albanianLexicalReading.sourceLinkedComparison.summary.text}</div>
                    <div className="mt-1 break-words text-[#a9c3d0]">
                      Voice relation: {albanianLexicalReading.sourceLinkedComparison.summary.voicePathRelationship}{" "}
                      · consonantal relation: {albanianLexicalReading.sourceLinkedComparison.summary.consonantalContextRelationship}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-2 text-[#d5c28f]">{sourceLinkedComparisonSummaryV0_1(albanianLexicalReading.sourceLinkedComparison)}</div>
              )}
              <div className="mt-2 text-[10px] text-[#91aebb]">{albanianLexicalReading.sourceLinkedComparison.claimBoundary}</div>
            </div>
          ) : null}
          {albanianLexicalReading.sourceLinkedComponentReading ? (
            <div
              data-testid="albanian-source-linked-component-reading"
              className="mt-3 rounded border border-[#3f5368] bg-[#111a21] p-3 text-xs leading-5 text-[#d5e8f3]"
            >
              <div className="font-semibold uppercase tracking-[0.1em] text-[#b7d7e8]">SOURCE-LINKED COMPONENT READING</div>
              <div className="mt-1 text-[#a9c3d0]">
                Source-authored component relation: {albanianLexicalReading.sourceLinkedComponentReading.relation.references
                  .map((reference) => `${reference.sourceForm} → ${reference.reference ?? "Null"}`)
                  .join(" · ") || "Null"}
              </div>
              <div className="mt-1 break-words text-[#d5c28f]">
                Source-authored explanation (attributed): {albanianLexicalReading.sourceLinkedComponentReading.relation.sourceAuthoredExplanation ?? "Null"}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {sourceLinkedRecordCardV0_1(
                  "Primary source record",
                  albanianLexicalReading.sourceLinkedComponentReading.primary,
                )}
                {albanianLexicalReading.sourceLinkedComponentReading.components.map((component) => (
                  <div key={component.sourceRecordId}>
                    {sourceLinkedRecordCardV0_1("Component source record", component)}
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded border border-[#355a72] bg-[#0d151c] p-2">
                <div className="font-semibold text-[#f5f7fb]">Exploratory relationship</div>
                <div className="mt-1 text-sm">
                  {sourceLinkedComponentReadingSummaryV0_1(albanianLexicalReading.sourceLinkedComponentReading)}
                </div>
                {albanianLexicalReading.sourceLinkedComponentReading.status === "SUPPORTED" ? (
                  <div className="mt-1 text-[#d5c28f]">
                    Alternatives: {albanianLexicalReading.sourceLinkedComponentReading.exploratoryRelationship.alternatives.join(" ")}
                  </div>
                ) : null}
              </div>
              <div className="mt-2 text-[10px] text-[#91aebb]">
                {albanianLexicalReading.sourceLinkedComponentReading.claimBoundary}
                {albanianLexicalReading.sourceLinkedComponentReading.reasonCodes.length
                  ? ` Reasons: ${albanianLexicalReading.sourceLinkedComponentReading.reasonCodes.join(", ")}.`
                  : ""}
              </div>
            </div>
          ) : null}
          <div
            data-testid="albanian-functional-meaning-bridge"
            className="mt-3 rounded border border-[#66532e] bg-[#1b180f] p-3 text-[#f0ddb0]"
          >
            <div className="font-semibold uppercase tracking-[0.1em]">FUNCTIONAL MEANING BRIDGE · EXPLORATORY ONLY</div>
            {albanianLexicalReading.functionalMeaningBridge.status === "SUPPORTED" &&
            albanianLexicalReading.functionalMeaningBridge.sourceFacts &&
            albanianLexicalReading.functionalMeaningBridge.functionalHypothesis.status === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" ? (
              <>
                <div className="mt-2 rounded border border-[#594a2b] bg-[#211c12] p-2 text-xs">
                  <div className="font-semibold text-[#f5f7fb]">SOURCE_FACT</div>
                  <div className="mt-1">
                    {albanianLexicalReading.functionalMeaningBridge.sourceFacts.primary.form}: {albanianLexicalReading.functionalMeaningBridge.sourceFacts.primary.meaningGlosses.join("; ") || "Null"}
                  </div>
                  <div className="mt-1">
                    {albanianLexicalReading.functionalMeaningBridge.sourceFacts.related?.form ?? "Null"}: {albanianLexicalReading.functionalMeaningBridge.sourceFacts.related?.meaningGlosses.join("; ") || "Null"}
                  </div>
                  <div className="mt-1 break-words text-[#d5c28f]">
                    Source-authored explanation (attributed): {albanianLexicalReading.functionalMeaningBridge.sourceFacts.related?.sourceAuthoredExplanation ?? "Null"}
                  </div>
                </div>
                {albanianLexicalReading.functionalMeaningBridge.derivedStructure ? (
                  <div className="mt-2 rounded border border-[#594a2b] bg-[#211c12] p-2 text-xs">
                    <div className="font-semibold text-[#f5f7fb]">DERIVED_STRUCTURE</div>
                    <div className="mt-1 break-words">
                      {albanianLexicalReading.functionalMeaningBridge.sourceFacts.primary.form}: {albanianLexicalReading.functionalMeaningBridge.derivedStructure.primary.voicePaths.join(" | ") || "Null"} · {albanianLexicalReading.functionalMeaningBridge.derivedStructure.primary.consonantalContexts.join(" | ") || "Null"}
                    </div>
                    <div className="mt-1 break-words">
                      {albanianLexicalReading.functionalMeaningBridge.sourceFacts.related?.form ?? "Null"}: {albanianLexicalReading.functionalMeaningBridge.derivedStructure.related.voicePaths.join(" | ") || "Null"} · {albanianLexicalReading.functionalMeaningBridge.derivedStructure.related.consonantalContexts.join(" | ") || "Null"}
                    </div>
                    <div className="mt-1 text-[#d5c28f]">
                      Voice relation: {albanianLexicalReading.functionalMeaningBridge.derivedStructure.voicePathRelationship} · consonantal relation: {albanianLexicalReading.functionalMeaningBridge.derivedStructure.consonantalContextRelationship}
                    </div>
                  </div>
                ) : (
                  <div data-testid="albanian-reading-functional-bridge-derived-structure-null" className="mt-2 rounded border border-[#594a2b] bg-[#211c12] p-2 text-xs">
                    <div className="font-semibold text-[#f5f7fb]">DERIVED_STRUCTURE</div>
                    <div className="mt-1">Null — source IPA is unavailable for one or both records; no Voice or phonological semantic relation is claimed.</div>
                  </div>
                )}
                <div className="mt-2 rounded border border-[#594a2b] bg-[#211c12] p-2 text-xs">
                  <div className="font-semibold text-[#f5f7fb]">EXPLORATORY_FUNCTIONAL_HYPOTHESIS</div>
                  <div data-testid="albanian-reading-functional-bridge" className="mt-1 text-sm">
                    {albanianLexicalReading.functionalMeaningBridge.functionalHypothesis.statement}
                  </div>
                  <div data-testid="albanian-reading-functional-bridge-basis" className="mt-1 break-words text-[#d5c28f]">
                    Generated because: {albanianLexicalReading.functionalMeaningBridge.functionalHypothesis.basis.join(" · ") || "no supported basis"}
                  </div>
                  <div data-testid="albanian-reading-functional-bridge-operation" className="mt-1 text-[#d5c28f]">
                    Functional operation: {albanianLexicalReading.functionalMeaningBridge.functionalHypothesis.functionalOperation ?? "none classified"}
                  </div>
                  <div className="mt-1 text-[#d5c28f]">
                    Alternatives: {albanianLexicalReading.functionalMeaningBridge.functionalHypothesis.alternatives.join(" ")}
                  </div>
                </div>
              </>
            ) : (
              <div data-testid="albanian-functional-meaning-bridge-null" className="mt-2 text-sm">
                UNKNOWN_OR_NULL — no source-supported functional prompt is available. Reasons: {albanianLexicalReading.functionalMeaningBridge.reasonCodes.join(", ") || "not recorded"}.
              </div>
            )}
            <div className="mt-2 text-[10px] text-[#d5c28f]">
              {albanianLexicalReading.functionalMeaningBridge.claimBoundary}
            </div>
          </div>
          {relatedCandidateEvaluations.length > 0 ? (
            <div
              data-testid="albanian-reading-related-candidate-evaluations"
              className="mt-3 rounded-lg border border-[#355a52] bg-[#12211e] p-3 text-xs leading-5 text-[#c8e6dc]"
            >
              <div className="font-semibold uppercase tracking-[0.12em]">SOURCE-LINKED FUNCTIONAL RELATIONSHIPS</div>
              <div className="mt-1 text-[#9fbdb5]">
                {supportedRelatedCandidateEvaluations.length} bounded functional relationship{supportedRelatedCandidateEvaluations.length === 1 ? "" : "s"} shown; {nullRelatedCandidateCount} other evaluated link{nullRelatedCandidateCount === 1 ? "" : "s"} remain Null.
              </div>
              <div className="mt-2 space-y-2">
                {supportedRelatedCandidateEvaluations.map((candidate) => {
                  const bridge = candidate.functionalMeaningBridge;
                  const relatedFact = bridge.sourceFacts?.related;
                  const derivedStructure = bridge.derivedStructure;
                  return (
                    <article
                      key={`${candidate.sourceRelation}:${candidate.relatedForm}`}
                      data-testid="albanian-reading-related-candidate"
                      className="rounded border border-[#355a52] bg-[#0e1b19] p-2"
                    >
                      <div className="font-mono text-sm text-[#f5f7fb]">{candidate.relatedForm}</div>
                      <div className="mt-1 text-[#9fbdb5]">
                        {candidate.sourceRelation} · {candidate.resolution} · comparison {candidate.sourceLinkedComparison.status}
                      </div>
                      <div className="mt-1">
                        Source meanings: {bridge.sourceFacts?.primary.meaningGlosses.join("; ") || "Null"} → {relatedFact?.meaningGlosses.join("; ") || "Null"}
                      </div>
                      <div className="mt-1 text-[#d5c28f]">
                        Functional operation: {bridge.functionalHypothesis.functionalOperation ?? "Null"}
                      </div>
                      <div className="mt-1">{bridge.functionalHypothesis.statement ?? "Null — no bounded functional explanation is available."}</div>
                      <div className="mt-1 text-[#9fbdb5]">
                        IPA/Voice structure: {derivedStructure ? `${derivedStructure.primary.voicePaths.join(" | ")} → ${derivedStructure.related.voicePaths.join(" | ")}` : "Null"}
                      </div>
                      <div className="mt-1 text-[#9fbdb5]">
                        Alternatives: {bridge.functionalHypothesis.alternatives.join(" ") || "Null"}
                      </div>
                    </article>
                  );
                })}
              </div>
              {nullRelatedCandidateEvaluations.length > 0 ? (
                <details className="mt-3 rounded border border-[#594a2b] bg-[#211c12] p-2">
                  <summary
                    data-testid="albanian-reading-null-candidate-summary"
                    className="cursor-pointer font-semibold text-[#f0ddb0]"
                  >
                    Inspect {nullRelatedCandidateEvaluations.length} Null candidate{nullRelatedCandidateEvaluations.length === 1 ? "" : "s"}
                  </summary>
                  <div
                    data-testid="albanian-reading-null-candidate-evaluations"
                    className="mt-2 space-y-2 text-[#d5c28f]"
                  >
                    {nullRelatedCandidateEvaluations.map((candidate) => {
                      const comparison = candidate.sourceLinkedComparison;
                      const bridge = candidate.functionalMeaningBridge;
                      return (
                        <article
                          key={`${candidate.sourceRelation}:${candidate.relatedForm}`}
                          data-testid="albanian-reading-null-candidate"
                          className="rounded border border-[#66532e] bg-[#17140e] p-2"
                        >
                          <div className="font-mono text-sm text-[#f5f7fb]">{candidate.relatedForm}</div>
                          <div className="mt-1 text-[#c8e6dc]">
                            {candidate.sourceRelation} · resolution {candidate.resolution} · comparison {comparison.status}
                          </div>
                          <div className="mt-1 break-words">
                            Comparison reasons: {comparison.reasonCodes.join(", ") || "none recorded"}
                          </div>
                          <div className="mt-1 break-words">{sourceLinkedComparisonSummaryV0_1(comparison)}</div>
                          <div className="mt-1 break-words">
                            Voice relation: {comparison.summary.voicePathRelationship} · consonantal relation: {comparison.summary.consonantalContextRelationship}
                          </div>
                          <div className="mt-1 text-[#c8e6dc]">Functional bridge: {bridge.status}</div>
                          <div className="mt-1 break-words">
                            Functional operation: {bridge.functionalHypothesis.functionalOperation ?? "Null — no bounded functional operation is authorized."}
                          </div>
                          <div className="mt-1 break-words">
                            Functional reasons: {bridge.reasonCodes.join(", ") || "none recorded"}
                          </div>
                          <div className="mt-1 text-[10px] text-[#d5c28f]">{bridge.claimBoundary}</div>
                        </article>
                      );
                    })}
                  </div>
                </details>
              ) : null}
            </div>
          ) : null}
          <div className="mt-3">
            <div className="font-semibold text-[#f5f7fb]">Source-linked form candidates</div>
            <div className="mt-1 text-[#9fbdb5]">
              These are source-provided form links, not verified family, etymology, or meaning-extension claims.
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {albanianLexicalReading.relatedForms.map((related) => (
                <span
                  key={`${related.form}:${related.entryLocator}`}
                  data-testid="albanian-reading-related-form"
                  className="rounded border border-[#355a52] bg-[#12211e] px-2 py-1 text-[#c8e6dc]"
                >
                  <span className="font-mono">{related.form}</span>
                  {related.meaningGlosses.length ? ` · ${related.meaningGlosses.join("; ")}` : " · source link unresolved"}
                  {related.etymologyText ? ` · source-authored etymology (attributed): ${related.etymologyText}` : ""}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 rounded border border-[#66532e] bg-[#1b180f] p-2 text-[#f0ddb0]">
            <div className="font-semibold uppercase tracking-[0.1em]">INTEGRATED FUNCTIONAL READING · EXPLORATORY</div>
            <div data-testid="albanian-reading-interpretation" className="mt-1 text-sm">
              {albanianLexicalReading.interpretation.statement ?? "No bounded product interpretation is currently authorized; Null is valid."}
            </div>
            <div className="mt-1 text-xs text-[#d5c28f]">
              {albanianLexicalReading.interpretation.claimBoundary}
            </div>
            {albanianLexicalReading.interpretation.alternatives.length ? (
              <div className="mt-2 text-xs text-[#d5c28f]">
                Alternatives: {albanianLexicalReading.interpretation.alternatives.join(" ")}
              </div>
            ) : null}
          </div>
          {albanianLexicalReading.composition.status === "SUPPORTED" ? (
            <div
              data-testid="albanian-lexical-composition"
              className="mt-3 rounded border border-[#4d6070] bg-[#111a21] p-2 text-[#d5e8f3]"
            >
              <div className="font-semibold uppercase tracking-[0.1em] text-[#b7d7e8]">SOURCE-GROUNDED FUNCTIONAL COMPOSITION PROMPT</div>
              <div className="mt-2 text-xs text-[#a9c3d0]">
                <span className="font-semibold text-[#f5f7fb]">Source records:</span>{" "}
                {albanianLexicalReading.composition.sourceRelation.evidenceText ?? "Null"}
              </div>
              <div className="mt-2 text-xs text-[#a9c3d0]">
                <span className="font-semibold text-[#f5f7fb]">Engine computes:</span>{" "}
                {albanianLexicalReading.composition.primaryStructure?.rawIpa ?? "Null"} · {albanianLexicalReading.composition.primaryStructure?.voicePath.join(" → ") ?? "Null"} · consonants {albanianLexicalReading.composition.primaryStructure?.prefixConsonants.join(" ") || "∅"} / {albanianLexicalReading.composition.primaryStructure?.interNucleusConsonants.map((region) => region.join(" ") || "∅").join(" · ") || "∅"}; compared with {albanianLexicalReading.composition.relatedStructure?.rawIpa ?? "Null"} · {albanianLexicalReading.composition.relatedStructure?.voicePath.join(" → ") ?? "Null"}.
              </div>
              <div data-testid="albanian-reading-composition" className="mt-2 text-sm text-[#e1f2ed]">
                {albanianLexicalReading.composition.interpretation.statement}
              </div>
              <div className="mt-1 text-xs text-[#b9ced8]">
                Alternatives: {albanianLexicalReading.composition.interpretation.alternatives.join(" ")}
              </div>
              <div className="mt-1 text-xs text-[#91aebb]">
                {albanianLexicalReading.composition.interpretation.claimBoundary}
              </div>
            </div>
          ) : (
            <div
              data-testid="albanian-reading-composition-null"
              className="mt-3 rounded border border-[#4d6070] bg-[#111a21] p-2 text-xs text-[#b9ced8]"
            >
              <span className="font-semibold text-[#f5f7fb]">Computed composition:</span>{" "}
              Null — no directionally meaningful structured source relation is verified. Source-authored text remains attributed evidence only; pronunciation and Voice structure remain separate observations.
            </div>
          )}
        </div>
      ) : null}

      {interpretation?.kind === "present" ? (
        <div
          data-testid="functional-motivation-interpretation"
          className="mt-3 rounded-lg border border-[#4b3f2c] bg-[#18140e] p-3 text-xs leading-5 text-[#f0ddb0]"
        >
          <div className="font-semibold uppercase tracking-[0.12em]">FUNCTIONAL MOTIVATION INTERPRETATION v0.2</div>
          <div className="mt-1 text-sm">
            {interpretation.value.status === "INTERPRETATIONS_FOUND"
              ? "A bounded hypothesis is available; it remains separate from source fact and derived structure."
              : "No supported functional interpretation is currently available; Null is valid."}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded border border-[#303843] bg-[#10161c] p-2 text-[#c5ced8]">
              <div className="font-semibold uppercase tracking-[0.1em] text-[#8ea4ba]">STRUCTURAL FACTS</div>
              <div className="mt-1 break-words font-mono">
                Voice events: {interpretation.value.input.derivedStructure.nucleusEvents.map((event) => `${event.pathIndex}:${event.voice}`).join(" · ") || "Null"}
              </div>
              <div className="break-words text-[#9fb1bf]">
                Γ: {interpretation.value.input.derivedStructure.gamma.orderedUnits.join(" → ") || "Null"} · ZC: {interpretation.value.input.derivedStructure.zeroConsonantalStructuralComposition.status}
              </div>
              <div className="break-words text-[#9fb1bf]">
                Target sense: {interpretation.value.input.targetSense?.label ?? "Null; functional bridge fails closed"}
              </div>
            </div>
            <div className="rounded border border-[#303843] bg-[#10161c] p-2 text-[#c5ced8]">
              <div className="font-semibold uppercase tracking-[0.1em] text-[#8ea4ba]">PROVENANCE / UNRESOLVED FIELDS</div>
              <div className="mt-1 break-words">Source facts: {interpretation.value.input.sourceFacts.length}</div>
              <div className="break-words">
                Unresolved: {interpretation.value.unresolved.map((item) => nullReasonSummary(item.reason)).join(" ") || "none"}
              </div>
              {interpretation.value.unresolved.length > 0 ? (
                <details className="mt-2 rounded border border-[#303843] bg-[#101217] p-2">
                  <summary className="cursor-pointer font-semibold">Exact unresolved reason codes</summary>
                  <div className="mt-1 break-words font-mono">
                    {interpretation.value.unresolved.map((item) => item.reason).join(", ")}
                  </div>
                </details>
              ) : null}
              <div className="break-words text-[#9fb1bf]">No winner · user decides · historical relation not claimed</div>
            </div>
          </div>
        </div>
      ) : interpretation?.kind === "missing" && interpretation.missing === "malformed" ? (
        <div
          data-testid="functional-motivation-interpretation-malformed"
          className="mt-3 rounded-lg border border-[#5b3434] bg-[#1a1111] p-3 text-xs text-[#f0c0c0]"
        >
          Functional Motivation Interpretation v0.2 was emitted but malformed; the UI failed closed.
        </div>
      ) : null}

      {primaryWitnesses.length ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d8bb7a]">MOTIVATION DISCOVERY PRIMARY WITNESSES</div>
              <p className="mt-1 text-xs text-[#c5ced8]">Each primary witness retains its underlying source records; order is not a ranking.</p>
            </div>
            <div className="text-xs font-semibold text-[#f0ddb0]">No single winner · You decide</div>
          </div>
          {primaryWitnesses.map((witness) => (
            <Candidate
              key={witness.primaryWitnessId}
              witness={witness}
              interpretation={interpretation?.kind === "present"
                ? interpretation.value.candidates.find((item) => item.candidateId === witness.representative.candidateId)
                : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-[#4b3f2c] bg-[#18140e] p-3 text-xs leading-5 text-[#f0ddb0]">
          <div className="font-semibold uppercase tracking-[0.12em]">NO SUPPORTED MOTIVATION CANDIDATE YET</div>
          <div className="mt-1">{nullReasonSummary(value.unknownOrNull.reason)}</div>
          {value.unknownOrNull.reason ? (
            <details className="mt-2 rounded border border-[#6b5b2f] bg-[#101217] p-2 text-[#c5ced8]">
              <summary className="cursor-pointer font-semibold">Exact Null reason code</summary>
              <div className="mt-1 font-mono">{value.unknownOrNull.reason}</div>
            </details>
          ) : null}
          <div className="mt-1 text-[#d5c28f]">This Null result does not disprove the doctrine; it records the current evidence boundary.</div>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-4 text-[#aeb7c5]">
        Source facts, derived structure, and functional hypotheses remain separate. Historical origin is not claimed.
      </p>
    </section>
  );
}
