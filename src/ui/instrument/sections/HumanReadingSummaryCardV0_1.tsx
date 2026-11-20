import type {
  HumanReadingSourceSenseV0_1,
  HumanReadingSummaryProjectionV0_1,
} from "@/ui/instrument/sections/humanReadingSummaryAdapter.v0_1";

function sourceStatusLabel(status: string): string {
  switch (status) {
    case "CITATION_ENTERED_UNVERIFIED":
      return "citation not independently verified";
    case "OBSERVED_EXTERNAL_SNAPSHOT":
      return "recorded in a source snapshot";
    case "reviewed_accepted":
      return "reviewed source entry";
    default:
      return "source status unknown";
  }
}

function sourceNameLabel(source: string): string {
  switch (source) {
    case "en-wiktionary": return "Wiktionary (English edition)";
    case "sq-wiktionary": return "Wiktionary (Albanian edition)";
    case "editor": return "editor";
    case "ai": return "AI-assisted description";
    case "FJALORISHQIP": return "FjaloriShqip";
    case "KAIKKI":
    case "Kaikki": return "Kaikki";
    default: return source ? "Other recorded source attribution" : "source attribution not supplied";
  }
}

function sourceProviderLabel(provider: string): string {
  switch (provider) {
    case "FJALORISHQIP": return "FjaloriShqip";
    case "KAIKKI": return "Kaikki";
    default: return "Source";
  }
}

function familyProfileLabel(classification: string): string {
  switch (classification) {
    case "DIRECT_FREE_OPERATOR_FORM": return "Listed as a direct form in the research profile";
    case "DERIVATIVE_FAMILY_SUPPORT": return "Listed as a related form in the research profile";
    default: return "Research-profile role not identified";
  }
}

function familyResponseLabel(status: string): string {
  switch (status) {
    case "available": return "source response available";
    case "not-requested": return "source response not requested";
    case "loading": return "source response still loading";
    case "network-failure": return "source could not be reached";
    case "timeout": return "source request timed out";
    case "unavailable": return "source response unavailable";
    case "http-not-found": return "no record returned for this form";
    case "http-error": return "source request returned an error";
    case "invalid": return "source response could not be read";
    default: return "source response status unknown";
  }
}

function familyEvidenceLabel(status: string): string {
  switch (status) {
    case "CITATION_ENTERED_UNVERIFIED": return "citation not independently verified";
    default: return "source evidence unavailable";
  }
}

function deduplicatedTransitions(reading: HumanReadingSummaryProjectionV0_1["functionalReadings"][number]) {
  const transitions = reading.candidates.flatMap(({ familyNetwork }) => familyNetwork.transitionNetworks);
  return [...new Map(transitions.map((transition) => [
    [
      transition.familySourceIdentity ?? transition.familyForm ?? "",
      transition.familySense?.entryIndex ?? "",
      transition.familySense?.senseIndex ?? "",
      transition.targetSourceIdentity ?? "",
    ].join("\u0000"),
    transition,
  ])).values()];
}

function uniqueSources(values: readonly Readonly<{ label: string; url: string }>[]) {
  const seen = new Set<string>();
  return values.filter(({ label, url }) => {
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

function groupSourceSenses(senses: readonly HumanReadingSourceSenseV0_1[]): HumanReadingSourceSenseV0_1[][] {
  const groups = new Map<string, HumanReadingSourceSenseV0_1[]>();
  for (const sense of senses) {
    const key = [
      sense.provider,
      sense.exactForm.normalize("NFC").trim().toLocaleLowerCase("sq-AL"),
      sense.partOfSpeech?.trim().toLocaleLowerCase("en-US") ?? "",
      sense.gloss.trim().toLocaleLowerCase("en-US"),
    ].join("\u0000");
    groups.set(key, [...(groups.get(key) ?? []), sense]);
  }
  return [...groups.values()];
}

export function HumanReadingSummaryCardV0_1({
  summary,
}: {
  summary: HumanReadingSummaryProjectionV0_1;
}) {
  const meanings = [...new Map(summary.meanings.map((sense) => [
    sense.gloss.trim().toLocaleLowerCase("en-US"), sense.gloss,
  ])).values()];
  const summarySources = uniqueSources(summary.meanings.map((sense) => ({
    label: sense.provider,
    url: sense.sourceUrl,
  })));
  const functionalSources = summary.functionalReadings.flatMap(({ candidates }) => candidates.flatMap((candidate) => [
    { label: `${candidate.operator} lexical function`, url: candidate.embryoEvidence.sourceUrl },
    { label: `${sourceProviderLabel(candidate.targetSource.provider)} target sense`, url: candidate.targetSource.sourceUrl },
    ...candidate.familyNetwork.familySourceRecords.flatMap((record) => record.sourceUrl
      ? [{ label: `${record.form} source record`, url: record.sourceUrl }]
      : []),
  ]));
  const sources = uniqueSources([...summarySources, ...functionalSources]);
  const familyRecords = [...new Map(summary.functionalReadings.flatMap(({ candidates }) =>
    candidates.flatMap(({ familyNetwork }) => familyNetwork.familySourceRecords),
  ).map((record) => [
    `${record.sourceIdentity ?? record.form}\u0000${record.exactSourceForm ?? ""}`,
    record,
  ])).values()];
  const sourceSenseGroups = groupSourceSenses(summary.meanings);

  return (
    <section
      aria-label="Word meaning and possible functional connection"
      data-testid="human-reading-summary"
      className="min-w-0 rounded-xl border border-[#355a7a] bg-[#111923] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.16)] [overflow-wrap:anywhere]"
    >
      <h2 data-testid="human-reading-word" className="text-xl font-semibold tracking-tight text-[#f5f7fb]">
        {summary.word}
      </h2>

      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9fb1bf]">Meaning</h3>
          {meanings.length ? (
            <p data-testid="human-reading-meaning" className="mt-1 text-base leading-6 text-[#f5f7fb]">
              {meanings.join("; ")}
            </p>
          ) : (
            <p data-testid="human-reading-meaning-unavailable" className="mt-1 text-sm text-[#c5ced8]">
              A source-reported meaning is not available yet.
            </p>
          )}
          {summarySources.length ? (
            <p className="mt-1 text-xs text-[#aeb7c5]" data-testid="human-reading-source-labels">
              Source{summarySources.length === 1 ? "" : "s"}: {summarySources.map(({ label }) => label).join(", ")}
              {summary.meanings.some(({ evidenceStatus }) => evidenceStatus === "CITATION_ENTERED_UNVERIFIED")
                ? " · citation not independently verified"
                : ""}
            </p>
          ) : null}
        </div>

        <div className="sm:min-w-36 sm:text-right">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9fb1bf]">Written Voices</h3>
          <p data-testid="human-reading-written-voices" className="mt-1 text-base font-semibold text-[#cfe6ff]">
            {summary.writtenVoiceEvents.length
              ? summary.writtenVoiceEvents.map(({ voice, position }) => `${voice}@${position}`).join(" → ")
              : "None in this spelling"}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-[#2c3a49] pt-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9fb1bf]">Possible connection</h3>
        {summary.functionalReadings.length ? (
          <div className="mt-2 space-y-3" data-testid="human-reading-functional-results">
            {summary.functionalReadings.map((reading) => (
              <article key={reading.groupId} data-testid="human-reading-functional-result" className="min-w-0">
                <p className="text-sm leading-6 text-[#e7eee5]">{reading.explanation}</p>
              </article>
            ))}
            <p data-testid="human-reading-functional-status" className="text-xs text-[#aeb7c5]">Proposal only; no historical origin is claimed.</p>
            {summary.functionalReadings.length > 1 ? (
              <p className="text-xs text-[#aeb7c5]">More than one possible reading is available; you decide.</p>
            ) : null}
          </div>
        ) : (
          <p data-testid="human-reading-functional-null" className="mt-1 text-sm leading-6 text-[#c5ced8]">
            Not enough information for a functional explanation from the current evidence.
          </p>
        )}
      </div>

      <details data-testid="human-reading-sources-and-alternatives" className="mt-4 rounded-lg border border-[#303a45] bg-[#0e141b]">
        <summary className="cursor-pointer list-none px-3 py-3 text-sm font-semibold text-[#cfe6ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bb7a] [&::-webkit-details-marker]:hidden">
          Sources and other meanings
        </summary>
        <div className="space-y-4 border-t border-[#303a45] p-3 text-sm text-[#d7dde7]">
          {summary.meanings.length ? (
            <section aria-label="Available source senses">
              <h4 className="font-semibold text-[#f5f7fb]">Available source senses</h4>
              <ul className="mt-2 space-y-2">
                {sourceSenseGroups.map((group, index) => {
                  const sense = group[0];
                  const attributions = [...new Set(group.map(({ sourceAttribution }) => sourceNameLabel(sourceAttribution)))].filter((label) =>
                    label.toLocaleLowerCase("en-US") !== sense.provider.toLocaleLowerCase("en-US"),
                  );
                  const statuses = [...new Set(group.map(({ evidenceStatus }) => sourceStatusLabel(evidenceStatus)))];
                  const recordLinks = uniqueSources(group.map(({ provider, sourceUrl }) => ({ label: provider, url: sourceUrl })));
                  return (
                    <li key={`${sense.provider}:${sense.exactForm}:${sense.partOfSpeech}:${sense.gloss}:${index}`} className="break-words">
                      <span className="font-semibold">{sense.exactForm}</span>
                      {sense.partOfSpeech ? ` · ${sense.partOfSpeech}` : ""}: {sense.gloss}
                      <span className="block text-xs text-[#aeb7c5]">
                        {sense.provider}{attributions.length ? ` · ${attributions.join(", ")}` : ""} · {statuses.join(", ")}
                      </span>
                      {recordLinks.map(({ label, url }) => (
                        <a key={`${label}:${url}`} className="mt-1 mr-3 inline-block text-xs text-[#cfe6ff] underline" href={url} target="_blank" rel="noreferrer">
                          Open {label} record
                        </a>
                      ))}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : (
            <p>No exact-form source sense is available. This does not establish that the word is absent.</p>
          )}

          {summary.functionalReadings.map((reading) => (
            <section key={`sources:${reading.groupId}`} aria-label={`Sources for ${reading.targetForm} reading`}>
              <h4 className="font-semibold text-[#f5f7fb]">Source entries behind this possible reading</h4>
              {[...new Map(reading.candidates.map((candidate) => [
                `${candidate.embryoEvidence.sourceId}\u0000${candidate.targetSource.sourceIdentity}`,
                candidate,
              ])).values()].map((candidate) => (
                <div key={candidate.candidateId} className="mt-2 rounded border border-[#303a45] p-2">
                  <p>
                    Recorded {candidate.operator} function: “{candidate.embryoEvidence.attestedGloss}” · {candidate.embryoEvidence.sourceTitle} · {candidate.embryoEvidence.locator} · {sourceStatusLabel(candidate.embryoEvidence.citationStatus)}
                    {candidate.embryoEvidence.sourceUrl ? <> · <a className="underline" href={candidate.embryoEvidence.sourceUrl} target="_blank" rel="noreferrer">source</a></> : null}
                  </p>
                  <p className="mt-1">
                    Target sense: “{candidate.targetSource.glosses.join("; ") || "Meaning not supplied"}” · {sourceProviderLabel(candidate.targetSource.provider)} · {sourceStatusLabel(candidate.targetSource.evidenceStatus)}
                    {candidate.targetSource.sourceUrl ? <> · <a className="underline" href={candidate.targetSource.sourceUrl} target="_blank" rel="noreferrer">source</a></> : null}
                  </p>
                  {deduplicatedTransitions(reading).length ? (
                    <div className="mt-2">
                      <h5 className="font-semibold">Other recorded action senses considered</h5>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {deduplicatedTransitions(reading).map((transition, index) => (
                          <li key={`${transition.familyForm}:${transition.familySense?.entryIndex}:${transition.familySense?.senseIndex}:${index}`}>
                            {transition.familyForm ?? "Related form"}: {transition.familySense?.gloss ?? "Sense not available"}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-1 text-xs text-[#aeb7c5]">Each entry reports its own meaning. The entries do not report a relationship between these forms.</p>
                    </div>
                  ) : null}
                </div>
              ))}
              {!reading.candidates.length ? (
                <p className="mt-1">This source-linked proposal does not supply an independently reported relation.</p>
              ) : null}
            </section>
          ))}
          {familyRecords.length ? (
            <section aria-label="Related source records and sense alternatives">
              <h4 className="font-semibold text-[#f5f7fb]">Related source records and sense alternatives</h4>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                {familyRecords.map((record) => (
                  <li key={`${record.sourceIdentity ?? record.form}:${record.exactSourceForm ?? ""}`}>
                    <span className="font-semibold">{record.form}</span>
                    {record.exactSourceForm ? ` · exact source form ${record.exactSourceForm}` : " · exact-form record unavailable"}
                    <span className="block text-xs text-[#aeb7c5]">
                      {familyProfileLabel(record.profileClassification)} · {familyResponseLabel(record.responseStatus)} · {familyEvidenceLabel(record.evidenceStatus)}
                    </span>
                    {record.description ? (
                      <p className="mt-1 text-xs text-[#aeb7c5]">
                        Record-level description (AI-assisted; not sense-specific or independent corroboration): “{record.description.text}” · {record.description.attribution}
                      </p>
                    ) : null}
                    {record.senses.length ? (
                      <details data-testid="human-reading-family-record-senses" className="mt-2 rounded border border-[#303a45] px-2">
                        <summary className="cursor-pointer py-2 text-xs text-[#cfe6ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bb7a]">
                          View all {record.senses.length} recorded senses
                        </summary>
                        <ul className="list-[circle] space-y-1 border-t border-[#303a45] py-2 pl-5">
                          {record.senses.map((sense) => (
                            <li key={`${record.sourceIdentity ?? record.form}:${sense.entryIndex}:${sense.senseIndex}`}>
                              {sense.partOfSpeech ?? "Part of speech not supplied"}: {sense.gloss}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : <span> · no sense record returned</span>}
                    {record.sourceUrl ? <> · <a className="underline" href={record.sourceUrl} target="_blank" rel="noreferrer">source response</a></> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {sources.length ? (
            <section aria-label="Source links">
              <h4 className="font-semibold text-[#f5f7fb]">Source links</h4>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {sources.map(({ label, url }) => (
                  <a key={`${label}:${url}`} className="text-[#cfe6ff] underline" href={url} target="_blank" rel="noreferrer">{label}</a>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </details>

      <details data-testid="human-reading-technical-evidence" className="mt-2 rounded-lg border border-[#303a45] bg-[#0e141b]">
        <summary className="cursor-pointer list-none px-3 py-3 text-sm font-semibold text-[#9fb1bf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bb7a] [&::-webkit-details-marker]:hidden">
          Technical evidence
        </summary>
        <div className="space-y-3 border-t border-[#303a45] p-3 text-xs text-[#aeb7c5]">
          <p>Source status: {summary.sourceFactStatus}</p>
          <p>Exact written Voice events: {summary.writtenVoiceEvents.map(({ voice, position }) => `${voice}@${position}`).join(" → ") || "none"}</p>
          {summary.meanings.length ? (
            <section aria-label="Exact source identities and attribution">
              <h4 className="font-semibold text-[#f5f7fb]">Exact source identities and attribution</h4>
              <ul className="mt-1 space-y-1">
                {summary.meanings.map((sense, index) => (
                  <li key={`meaning-identity:${sense.sourceIdentity}:${sense.locator}:${index}`}>
                    {sense.provider} · {sense.exactForm} · {sense.sourceIdentity} · {sense.locator} · {sense.sourceAttribution} · {sense.evidenceStatus}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {familyRecords.length ? (
            <section aria-label="Exact related source metadata">
              <h4 className="font-semibold text-[#f5f7fb]">Exact related source metadata</h4>
              <ul className="mt-1 space-y-1">
                {familyRecords.map((record) => (
                  <li key={`family-metadata:${record.sourceIdentity ?? record.form}:${record.exactSourceForm ?? ""}`}>
                    {record.form} · {record.profileClassification} · {record.responseStatus} · {record.evidenceStatus} · {record.sourceIdentity ?? "source identity unavailable"} · {record.recordSources.join(", ") || "no source attribution returned"}
                    {record.reasonCodes.length ? ` · ${record.reasonCodes.join(", ")}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {summary.technicalReasonCodes.length ? <p>Reason codes: {summary.technicalReasonCodes.join(" · ")}</p> : null}
          {summary.interpretationBoundaries.length ? (
            <ul className="list-disc space-y-1 pl-5">
              {[...new Set(summary.interpretationBoundaries)].map((boundary) => <li key={boundary}>{boundary}</li>)}
            </ul>
          ) : null}
          {summary.functionalReadings.flatMap(({ candidates }) => candidates.map((candidate) => (
            <section key={`technical:${candidate.candidateId}`} className="rounded border border-[#303a45] p-2">
              <p>Candidate {candidate.candidateId} · {candidate.claimLayer} · {candidate.selectionStatus}</p>
              <p>Operator source {candidate.embryoEvidence.sourceId} · target source {candidate.targetSource.sourceIdentity} · target locator {candidate.targetSource.locator} · citation {candidate.embryoEvidence.citationStatus}</p>
              <p>Target authorization {candidate.targetAuthorization}</p>
              <p>Whole-word status {candidate.wholeWordStatus} · sourceAuthorityPromotion {candidate.sourceAuthorityPromotion} · historicalOrigin {candidate.historicalOrigin}</p>
              <p>no_single_winner: {String(candidate.noSingleWinner)} · user_decides: {candidate.userDecisionPosture}</p>
              <p>Equation: {candidate.familyNetwork.functionalEquation ?? "UNKNOWN_OR_NULL"}</p>
              <p>Explanation: {candidate.familyNetwork.explanation ?? "UNKNOWN_OR_NULL"}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                {candidate.familyNetwork.reasoningSteps.map((step) => (
                  <li key={step.id}>
                    {step.order}. {step.relationshipType} · {step.input ?? "Null"} → {step.output ?? "Null"} · {step.claimLayer}/{step.evidenceStatus} · {step.functionalInference ?? "No functional inference"}
                    {step.sourceRefs.length ? ` · sources ${step.sourceRefs.join(", ")}` : " · no source reference for this relationship"}
                    {step.reasonCodes.length ? ` · ${step.reasonCodes.join(", ")}` : ""}
                    {step.unresolvedDependencies.length ? ` · unresolved ${step.unresolvedDependencies.join(", ")}` : ""}
                  </li>
                ))}
              </ol>
            </section>
          )))}
        </div>
      </details>
    </section>
  );
}
