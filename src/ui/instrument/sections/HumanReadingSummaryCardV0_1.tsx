import type {
  HumanReadingSourceSenseV0_1,
  HumanReadingSummaryProjectionV0_1,
} from "@/ui/instrument/sections/humanReadingSummaryAdapter.v0_1";
import type { CandidateRowVM, PresentOrMissing } from "@/ui/telemetry/types";

function candidateField<T>(value: PresentOrMissing<T> | undefined): T | null {
  return value?.kind === "present" ? value.value : null;
}

function candidateChainLabel(candidate: CandidateRowVM): string {
  const chain = candidateField<string[]>(candidate.expansionChain) ?? [];
  const components = candidateField(candidate.functionalComponents) ?? [];
  if (chain.length < 2) return chain.join(" → ");
  const target = chain[chain.length - 1];
  const source = chain.slice(0, -1);
  return components.length > 1
    ? `${source.join(" + ")} → ${target}`
    : chain.join(" → ");
}

function candidateComponentEvidenceLabel(value: string | null): string {
  if (value === "reviewed") return "reviewed operator evidence";
  if (value === "structural") return "structural evidence";
  return value ? value.replaceAll("_", " ") : "evidence status unavailable";
}

function candidateValidationLabel(candidate: CandidateRowVM): string {
  return candidateField<string>(candidate.validationOutcome) === "partial"
    ? "Partial candidate"
    : "Validated candidate";
}

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

function deduplicatedFunctionalPaths(reading: HumanReadingSummaryProjectionV0_1["functionalReadings"][number]) {
  const paths = reading.candidates.flatMap(({ familyNetwork }) => familyNetwork.functionalPaths);
  return [...new Map(paths.map((path) => [path.pathId, path])).values()];
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
  const reviewedFunctionSources = summary.reviewedLexicalFunctions.map((item) => ({
    label: `${item.operator} reviewed lexical function`,
    url: item.sourceUrl,
  }));
  const sources = uniqueSources([...summarySources, ...functionalSources, ...reviewedFunctionSources]);
  const familyRecords = [...new Map(summary.functionalReadings.flatMap(({ candidates }) =>
    candidates.flatMap(({ familyNetwork }) => familyNetwork.familySourceRecords),
  ).map((record) => [
    `${record.sourceIdentity ?? record.form}\u0000${record.exactSourceForm ?? ""}`,
    record,
  ])).values()];
  const sourceSenseGroups = groupSourceSenses(summary.meanings);
  const functionalPaths = [...new Map(summary.functionalReadings.flatMap(deduplicatedFunctionalPaths)
    .map((path) => [path.pathId, path])).values()];

  return (
    <section
      aria-label="Word meaning and possible functional connection"
      data-testid="human-reading-summary"
      className="min-w-0 rounded-xl border border-[#355a7a] bg-[#111923] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.16)] [overflow-wrap:anywhere]"
    >
      <h2 data-testid="human-reading-word" className="sr-only">
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

      {summary.reviewedLexicalFunctions.length ? (
        <div className="mt-4 border-t border-[#2c3a49] pt-3" data-testid="human-reading-reviewed-functions">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9fb1bf]">Reviewed lexical function</h3>
          <div className="mt-2 space-y-2">
            {summary.reviewedLexicalFunctions.map((item) => (
              <article key={item.sourceId} className="min-w-0">
                <p className="text-sm leading-6 text-[#e7eee5]">
                  {item.operator}: “{item.functionText}”
                </p>
                <p className="text-xs text-[#aeb7c5]">
                  {item.sourceTitle} · {item.locator} · <a className="underline" href={item.sourceUrl} target="_blank" rel="noreferrer">reviewed source</a>
                </p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 border-t border-[#2c3a49] pt-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9fb1bf]">Possible connection</h3>
        {summary.functionalReadings.length || summary.functionalCandidates.length ? (
          <div className="mt-2 space-y-3" data-testid="human-reading-functional-results">
            {summary.functionalReadings.map((reading) => (
              <article key={reading.groupId} data-testid="human-reading-functional-result" className="min-w-0">
                <p className="text-sm leading-6 text-[#e7eee5]">{reading.explanation}</p>
              </article>
            ))}
            {summary.functionalCandidates.map((candidate) => {
              const components = candidateField(candidate.functionalComponents) ?? [];
              const voicePath = candidateField<string[]>(candidate.vowelPath) ?? [];
              return (
                <article key={candidate.id} data-testid="human-reading-functional-candidate" className="min-w-0 rounded-md border border-[#303a45] p-3">
                  <p data-testid="human-reading-candidate-explanation" className="text-sm leading-6 text-[#e7eee5]">
                    {candidateField<string>(candidate.functionalStatement)}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#cfe6ff]">
                    {candidateValidationLabel(candidate)} · {candidateChainLabel(candidate)}
                  </p>
                  {components.length ? (
                    <p className="mt-1 text-xs leading-5 text-[#c5ced8]" data-testid="human-reading-candidate-components">
                      Components: {components.map((component) =>
                        `${component.embryo} — ${candidateField<string>(component.plainMeaning) ?? "meaning unavailable"} (${candidateComponentEvidenceLabel(candidateField<string>(component.evidenceState))})`,
                      ).join("; ")}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs leading-5 text-[#aeb7c5]">
                    Functional proposal only; historical origin is not claimed. You decide.
                  </p>
                  <p className="mt-1 text-xs text-[#aeb7c5]" data-testid="human-reading-candidate-voice-path">
                    Candidate Voice path: {voicePath.length ? voicePath.join(" → ") : "not emitted"}
                  </p>
                </article>
              );
            })}
            {summary.functionalReadings.length + summary.functionalCandidates.length > 1 ? (
              <p className="text-xs text-[#aeb7c5]">More than one possible reading is available; you decide.</p>
            ) : null}
          </div>
        ) : summary.reviewedLexicalFunctions.length ? (
          <p data-testid="human-reading-no-whole-word-candidate" className="mt-1 text-sm leading-6 text-[#c5ced8]">
            No whole-word functional candidate is available for this exact spelling.
          </p>
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
              {reading.relationship === "SOURCE_LINKED_PROPOSAL" ? (
                <p className="mt-2">Recorded proposal wording: {reading.functionText}</p>
              ) : null}
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
          {summary.reviewedLexicalFunctions.map((item) => (
            <section key={`reviewed-function:${item.sourceId}`} aria-label={`Reviewed lexical evidence for ${item.operator}`}>
              <h4 className="font-semibold text-[#f5f7fb]">Reviewed {item.operator} lexical function</h4>
              <p className="mt-1">{item.functionText} · {item.sourceTitle} · {item.locator}</p>
              <p className="mt-1 text-xs text-[#aeb7c5]">{item.evidenceText}</p>
            </section>
          ))}
          {summary.functionalCandidates.map((candidate) => (
            <section key={`candidate-source:${candidate.id}`} aria-label={`Source details for ${candidate.id}`}>
              <h4 className="font-semibold text-[#f5f7fb]">Existing functional candidate source</h4>
              <p className="mt-1">{candidate.id} · {candidateField<string>(candidate.sourceId) ?? "source identity unavailable"} · {candidateField<string>(candidate.sourceStatus) ?? "source status unavailable"}</p>
              <p className="mt-1">{candidateChainLabel(candidate)} · {candidateField<string>(candidate.claimBoundary) ?? "claim boundary unavailable"} · {candidateField<string>(candidate.userDecisionPosture) ?? "decision posture unavailable"}</p>
              {candidateField<string[]>(candidate.evidenceRefs)?.length ? (
                <p className="mt-1">Evidence references: {candidateField<string[]>(candidate.evidenceRefs)?.join(" · ")}</p>
              ) : null}
              {candidateField(candidate.functionalComponents)?.length ? (
                <ul className="mt-1 list-disc pl-5">
                  {candidateField(candidate.functionalComponents)?.map((component, index) => (
                    <li key={`${candidate.id}:${component.embryo}:${index}`}>
                      {component.embryo} · {candidateField<string>(component.plainMeaning) ?? "meaning unavailable"} · {candidateComponentEvidenceLabel(candidateField<string>(component.evidenceState))}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-1">Candidate-owned Voice path: {candidateField<string[]>(candidate.vowelPath)?.join(" → ") ?? "not emitted"}</p>
            </section>
          ))}
          {functionalPaths.length ? (
            <section aria-label="Inspectable proposed functional paths" data-testid="human-reading-functional-paths">
              <h4 className="font-semibold text-[#f5f7fb]">Proposed functional paths</h4>
              <p className="mt-1 text-xs text-[#aeb7c5]">
                These links are proposals, not source-reported relationships; morphology and historical origin remain unestablished.
              </p>
              <ul className="mt-2 space-y-2">
                {functionalPaths.map((path) => (
                  <li key={path.pathId} data-testid="human-reading-functional-path" className="rounded border border-[#303a45] p-2">
                    <p className="font-medium">
                      {path.nodes[0].exactForm.toLocaleUpperCase("sq-AL")} → {path.nodes[1].exactForm.toLocaleUpperCase("sq-AL")} → {path.nodes[2].exactForm.toLocaleUpperCase("sq-AL")}
                      <span className="font-normal"> · “{path.nodes[1].functionText}”</span>
                    </p>
                    <p className="mt-1 text-xs text-[#aeb7c5]">
                      {path.nodes[1].sourceLabel} · {path.nodes[1].sourceLocator} · {sourceStatusLabel(path.nodes[1].evidenceStatus)}
                      {path.nodes[1].sourceUrl ? <> · <a className="underline" href={path.nodes[1].sourceUrl} target="_blank" rel="noreferrer">Open source</a></> : null}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
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
          {functionalPaths.map((path) => (
            <section key={`path-evidence:${path.pathId}`} className="rounded border border-[#303a45] p-2">
              <p>Typed functional path {path.pathId} · {path.evidenceStatus} · {path.claimLayer}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                {path.nodes.map((node) => (
                  <li key={node.nodeId}>
                    {node.role} · node {node.nodeId} · {node.exactForm} · {node.functionText} · {node.partOfSpeech} · {node.sourceIdentity} · {node.sourceSenseIdentity} · {node.sourceLocator} · {node.evidenceStatus}/{node.claimLayer} · refs {node.sourceRefs.join(", ")}
                  </li>
                ))}
              </ol>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                {path.edges.map((edge) => (
                  <li key={edge.edgeId}>
                    {edge.relationshipType} · {edge.edgeId} · {edge.fromNodeId} → {edge.toNodeId} · depends on {edge.dependsOn.join(", ")} · {edge.evidenceStatus}/{edge.claimLayer} · relationSourceRefs {edge.relationSourceRefs.join(", ") || "empty"} · {edge.reasonCodes.join(", ")} · {edge.description}
                  </li>
                ))}
              </ol>
              <p>Path result {path.wholeWordStatus} · historical origin {path.historicalOrigin} · no_single_winner {String(path.noSingleWinner)} · user_decides {path.userDecisionPosture}</p>
              <p>Unresolved: {path.unresolvedMaterial.join(" · ")}</p>
            </section>
          ))}
        </div>
      </details>
    </section>
  );
}
