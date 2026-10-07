"use client";

import type {
  MotivationDiscoveryCandidateV0_1VM,
  MotivationDiscoveryV0_1VM,
  PresentOrMissing,
} from "@/ui/telemetry/types";

function pathText(values: readonly string[]): string {
  return values.length ? values.join(" → ") : "Null";
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

function functionalSummary(candidate: MotivationDiscoveryCandidateV0_1VM): string {
  if (candidate.functionalInterpretation.statement) {
    return candidate.functionalInterpretation.statement;
  }
  if (candidate.functionalInterpretation.reason === "LEXICAL_SELF_MATCH_NOT_FUNCTIONAL_MOTIVATION") {
    return "This lexical record confirms the entry; it does not establish a cross-form functional motivation claim.";
  }
  if (candidate.functionalInterpretation.reason === "INSUFFICIENT_FUNCTIONAL_EVIDENCE") {
    return "No reviewed functional evidence currently supports this bridge.";
  }
  return "No supported functional interpretation is currently available.";
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

function Candidate({ candidate }: { candidate: MotivationDiscoveryCandidateV0_1VM }) {
  const comparison = candidate.structuralComparison;
  const inputStructure = comparison.inputConsonantalStructure;
  const candidateStructure = comparison.candidateConsonantalStructure;
  const isSelfMatch = comparison.presentationClassification === "LEXICAL_ENTRY_CONFIRMATION";
  const boundary = representationBoundary(candidate);

  return (
    <article
      data-testid="motivation-discovery-candidate"
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
              {isSelfMatch ? "lexical entry confirmation" : "structural motivation candidate"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#d7dde7]">{candidate.candidateGloss}</p>
        </div>
      </div>

      <div
        data-testid="motivation-structural-comparison"
        className="mt-3 rounded-md border border-[#3e4b59] bg-[#10161c] p-2.5 text-xs leading-5 text-[#d7dde7]"
      >
        <div className="font-semibold uppercase tracking-[0.12em] text-[#f0ddb0]">
          {isSelfMatch ? "LEXICAL ENTRY CONFIRMATION" : "WHY THIS CANDIDATE"}
        </div>
        <p className="mt-1 text-sm text-[#d7dde7]">{comparison.matchReason}</p>
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
            <div className="mt-1 break-words font-mono">{candidate.sourceFact.sourceId}</div>
            <div className="break-words text-[#9fb1bf]">
              {candidate.sourceFact.attestationTruth} · {candidate.sourceFact.sourceStatus}
            </div>
            <div className="break-words text-[#9fb1bf]">
              {candidate.sourceFact.sourceUrlOrArchiveRef ?? "Source locator unavailable"}
              {candidate.sourceFact.entryLocator ? ` · ${candidate.sourceFact.entryLocator}` : ""}
            </div>
            <div className="break-words text-[#9fb1bf]">
              lexical source: {candidate.sourceFact.sourceUrlOrArchiveRef ?? "unavailable"}
              {candidate.sourceFact.entryLocator ? ` · ${candidate.sourceFact.entryLocator}` : ""}
            </div>
            <div className="mt-1 break-words text-[#9fb1bf]">
              Evidence refs: {candidate.sourceFact.evidenceRefs.join(", ") || "none"}
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
}: {
  discovery: PresentOrMissing<MotivationDiscoveryV0_1VM> | undefined;
}) {
  if (!discovery || discovery.kind !== "present") return null;
  const value = discovery.value;
  const math = value.derivedStructure.math7;
  const zc = value.derivedStructure.zeroConsonantalStructuralComposition;
  const lexicalSelfMatchCount = value.candidates.filter(
    (candidate) => candidate.structuralComparison.presentationClassification === "LEXICAL_ENTRY_CONFIRMATION",
  ).length;

  return (
    <section
      aria-label="Motivation Engine Discovery Lab"
      data-testid="motivation-discovery-card"
      className="rounded-[12px] border border-[#6b5b2f] bg-[#17140e] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8bb7a]">
            Motivation Engine / Discovery Lab
          </div>
          <h2 className="mt-1 text-base font-semibold text-[#f5f7fb]">
            What structure and source evidence were found?
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-[#aeb7c5]">
            This count is the Motivation Discovery candidate population. The Evidence tab reports a broader emitted-row population and may show a different count.
          </p>
        </div>
        <span className="rounded-full border border-[#6b5b2f] px-2.5 py-1 text-[11px] font-semibold text-[#f0ddb0]">
          {value.candidates.length} Discovery candidate{value.candidates.length === 1 ? "" : "s"}
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

      {value.candidates.length ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d8bb7a]">MOTIVATION DISCOVERY CANDIDATES</div>
              <p className="mt-1 text-xs text-[#c5ced8]">Each candidate is evidence-bound; order is not a ranking.</p>
            </div>
            <div className="text-xs font-semibold text-[#f0ddb0]">No single winner · You decide</div>
          </div>
          {value.candidates.map((candidate) => (
            <Candidate key={candidate.candidateId} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-[#4b3f2c] bg-[#18140e] p-3 text-xs leading-5 text-[#f0ddb0]">
          <div className="font-semibold uppercase tracking-[0.12em]">NO SUPPORTED MOTIVATION CANDIDATE YET</div>
          <div className="mt-1">{value.unknownOrNull.reason ?? "No qualifying source witness is currently available."}</div>
          <div className="mt-1 text-[#d5c28f]">This Null result does not disprove the doctrine; it records the current evidence boundary.</div>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-4 text-[#aeb7c5]">
        Source facts, derived structure, and functional hypotheses remain separate. Historical origin is not claimed.
      </p>
    </section>
  );
}
