"use client";

import { useMemo, useState } from "react";
import {
  buildSymbolicFunctionalCompositionV0_3,
  type SymbolicCompositionOperationV0_3,
  type SymbolicFunctionalCompositionResultV0_3,
  type SymbolicFunctionalCompositionSuccessV0_3,
} from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import { CurrentWordSymbolicGraphMeaningV0_1 } from "@/ui/instrument/sections/CurrentWordSymbolicGraphMeaningV0_1";
import type { SymbolicFunctionalOperationPlanInputV0_1 } from "@/shared/openInstrument/symbolicFunctionalOperationPlanBuilder.v0_1";
import { sameAlbanianSourceForm } from "@/ui/instrument/albanianSourceFormIdentity.v0_1";
import type { SingleWordCurrentWordEvidenceContextV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";

export type CurrentWordSymbolicVoiceDraftV0_1 = Readonly<{
  operatorCandidateId: string;
  operandOccurrenceId: string;
  /** A previous computed Voice event may feed a later Voice event. */
  operandVoiceEventId?: string;
}>;

export type CurrentWordSymbolicSelectionsV0_1 = Readonly<{
  spectrumCandidateByOccurrenceId: Readonly<Record<string, string>>;
  voiceDraftByEventId: Readonly<Record<string, CurrentWordSymbolicVoiceDraftV0_1>>;
}>;

export type CurrentWordSymbolicDraftProjectionV0_1 = Readonly<{
  structure: SymbolicFunctionalCompositionResultV0_3;
  evaluation: SymbolicFunctionalCompositionResultV0_3;
  operations: readonly SymbolicCompositionOperationV0_3[];
}>;

const inputClass = "mt-1 w-full rounded border border-[#46505c] bg-[#0d1117] px-2 py-1.5 text-sm text-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]";
const labelClass = "block min-w-0 text-xs font-medium text-[#c5ced8]";

function getDiscovery(context: SingleWordCurrentWordEvidenceContextV0_1 | undefined, analyzedWord: string) {
  if (context?.analyzedWord !== analyzedWord || context.discovery?.kind !== "present") return null;
  const discovery = context.discovery.value;
  return discovery.inputWord === analyzedWord ? discovery : null;
}

function discoveryIdentifiesAlbanian(discovery: NonNullable<ReturnType<typeof getDiscovery>>): boolean {
  const languageValues = [discovery.inputLanguage, discovery.sourceFact.language]
    .map((value) => value.normalize("NFC").trim().toLocaleLowerCase("en-US"))
    .filter((value) => value.length > 0 && value !== "unknown");
  const profile = discovery.inputProfile.normalize("NFC").trim().toLocaleLowerCase("en-US");
  const isAlbanian = (value: string) => value === "sq" || value.startsWith("sq-") || value.includes("albanian");
  return [...languageValues, profile].some(isAlbanian) &&
    !languageValues.some((value) => !isAlbanian(value)) &&
    !/\b(english|latin|greek|turkish|arabic)\b/u.test(profile);
}

function sourceIdentityMatchesDraft(
  discovery: NonNullable<ReturnType<typeof getDiscovery>>,
  targetLanguage: string,
  targetDialect: string,
): boolean {
  const normalize = (value: string) => value.normalize("NFC").trim().toLocaleLowerCase("en-US");
  const selectedLanguage = normalize(targetLanguage);
  const sourceLanguage = normalize(discovery.inputLanguage);
  if (selectedLanguage && selectedLanguage !== sourceLanguage) {
    const selectedIsAlbanian = selectedLanguage === "sq" || selectedLanguage.startsWith("sq-") || selectedLanguage.includes("albanian");
    const sourceIsAlbanian = sourceLanguage === "sq" || sourceLanguage.startsWith("sq-") || sourceLanguage.includes("albanian");
    if (!selectedIsAlbanian || !sourceIsAlbanian) return false;
  }
  const selectedDialect = normalize(targetDialect);
  return !selectedDialect || selectedDialect === normalize(discovery.inputProfile);
}

function buildDraftOperations(
  structure: SymbolicFunctionalCompositionSuccessV0_3,
  selections: CurrentWordSymbolicSelectionsV0_1,
): SymbolicCompositionOperationV0_3[] {
  const operations: SymbolicCompositionOperationV0_3[] = [];
  const symbolIdsByOccurrence = new Map<string, string>();
  const producerIdsByOccurrence = new Map<string, string>();
  const symbolIdsByVoiceEvent = new Map<string, string>();
  const producerIdsByVoiceEvent = new Map<string, string>();

  structure.spectrumOccurrences.forEach((occurrence, index) => {
    const candidateId = selections.spectrumCandidateByOccurrenceId[occurrence.occurrenceId];
    if (!candidateId || !occurrence.associationCandidates.some(({ candidateId: id }) => id === candidateId)) return;
    const operationId = `draft-select-${index}`;
    const outputSymbolId = `draft-spectrum-${index}`;
    symbolIdsByOccurrence.set(occurrence.occurrenceId, outputSymbolId);
    producerIdsByOccurrence.set(occurrence.occurrenceId, operationId);
    operations.push({
      operationId,
      kind: "SELECT_SPECTRUM_CANDIDATE",
      occurrenceId: occurrence.occurrenceId,
      associationCandidateId: candidateId,
      outputSymbolId,
      dependsOn: [],
    });
  });

  structure.voiceEvents.forEach((event, index) => {
    const selection = selections.voiceDraftByEventId[event.eventId];
    if (!selection?.operatorCandidateId) return;
    const usesVoiceOperand = Boolean(selection.operandVoiceEventId);
    const inputSymbolId = usesVoiceOperand
      ? symbolIdsByVoiceEvent.get(selection.operandVoiceEventId!) ?? `unselected-voice-operand-${index}`
      : symbolIdsByOccurrence.get(selection.operandOccurrenceId) ?? `unselected-operand-${index}`;
    const producerId = usesVoiceOperand
      ? producerIdsByVoiceEvent.get(selection.operandVoiceEventId!)
      : producerIdsByOccurrence.get(selection.operandOccurrenceId);
    const operationId = `draft-voice-${index}`;
    const outputSymbolId = `draft-voice-output-${index}`;
    operations.push({
      operationId,
      kind: "APPLY_VOICE_OPERATOR",
      voice: event.canonicalIdentity,
      position: event.position,
      voiceEventId: event.eventId,
      operatorCandidateId: selection.operatorCandidateId,
      inputSymbolId,
      outputSymbolId,
      dependsOn: producerId ? [producerId] : [],
    });
    symbolIdsByVoiceEvent.set(event.eventId, outputSymbolId);
    producerIdsByVoiceEvent.set(event.eventId, operationId);
  });

  return operations;
}

/** Projects explicit UI selections into the existing v0.3 evaluator without adding a meaning bridge. */
export function buildCurrentWordSymbolicDraftProjectionV0_1(input: Readonly<{
  exactSpelling: string;
  language: string;
  variety: string;
  selections: CurrentWordSymbolicSelectionsV0_1;
}>): CurrentWordSymbolicDraftProjectionV0_1 {
  const target = {
    exactSpelling: input.exactSpelling,
    language: input.language,
    variety: input.variety,
    // v0.3 requires a concept field; this private draft sentinel is never rendered as a meaning.
    wholeWordConcept: "UNKNOWN_OR_NULL",
  };
  const structure = buildSymbolicFunctionalCompositionV0_3({ target, operations: [] });
  if (!structure.ok) return { structure, evaluation: structure, operations: [] };
  const operations = buildDraftOperations(structure, input.selections);
  return {
    structure,
    evaluation: buildSymbolicFunctionalCompositionV0_3({ target, operations }),
    operations,
  };
}

function sourceFactsForWord(
  context: SingleWordCurrentWordEvidenceContextV0_1 | undefined,
  analyzedWord: string,
  targetLanguage: string,
  targetDialect: string,
) {
  const discovery = getDiscovery(context, analyzedWord);
  if (!discovery || !sourceIdentityMatchesDraft(discovery, targetLanguage, targetDialect) ||
      !discoveryIdentifiesAlbanian(discovery) || discovery.exactLexicalSourceStatus?.status !== "MATCHES_FOUND") return [];
  return (discovery.exactLexicalSourceFacts ?? []).filter((fact) =>
    fact.languageCode === "sq" && sameAlbanianSourceForm(fact.form, analyzedWord) && fact.attestationTruth === "fact",
  );
}

export function CurrentWordSymbolicDraftV0_1({
  analyzedWord,
  draftTargetWord,
  targetLanguage,
  targetDialect,
  currentWordEvidence,
}: {
  analyzedWord: string;
  draftTargetWord: string;
  targetLanguage: string;
  targetDialect: string;
  currentWordEvidence?: SingleWordCurrentWordEvidenceContextV0_1;
}) {
  const [selectedAssociations, setSelectedAssociations] = useState<Record<string, string>>({});
  const [voiceDrafts, setVoiceDrafts] = useState<Record<string, CurrentWordSymbolicVoiceDraftV0_1>>({});
  const discovery = getDiscovery(currentWordEvidence, analyzedWord);
  const sourceStatus = discovery?.exactLexicalSourceStatus;
  const language = targetLanguage.trim() || discovery?.inputLanguage || "UNKNOWN_OR_NULL";
  const variety = targetDialect.trim() || discovery?.inputProfile || "UNKNOWN_OR_NULL";
  const identityMatches = analyzedWord.length > 0 && draftTargetWord === analyzedWord;

  const projection = useMemo(() => buildCurrentWordSymbolicDraftProjectionV0_1({
    exactSpelling: analyzedWord,
    language,
    variety,
    selections: {
      spectrumCandidateByOccurrenceId: selectedAssociations,
      voiceDraftByEventId: voiceDrafts,
    },
  }), [analyzedWord, language, variety, selectedAssociations, voiceDrafts]);
  const { structure, evaluation } = projection;

  const facts = sourceFactsForWord(currentWordEvidence, analyzedWord, targetLanguage, targetDialect);
  const sourceIdentityMismatch = Boolean(discovery && !sourceIdentityMatchesDraft(discovery, targetLanguage, targetDialect));
  const evaluationFailureReasonCodes = evaluation.ok ? null : evaluation.reasonCodes;
  const selectedOccurrenceOptions = structure.ok
    ? structure.spectrumOccurrences.filter((occurrence) => Boolean(selectedAssociations[occurrence.occurrenceId]))
    : [];
  const graphSpectrumSelections: SymbolicFunctionalOperationPlanInputV0_1["spectrumSelections"] = structure.ok
    ? structure.spectrumOccurrences.flatMap((occurrence) => {
        const associationCandidateId = selectedAssociations[occurrence.occurrenceId];
        return associationCandidateId ? [{
          selectionId: occurrence.occurrenceId,
          unit: occurrence.unit,
          start: occurrence.span.start,
          end: occurrence.span.end,
          associationCandidateId,
        }] : [];
      })
    : [];
  const graphVoiceBindings: SymbolicFunctionalOperationPlanInputV0_1["voiceBindings"] = structure.ok
    ? structure.voiceEvents.flatMap((voiceEvent) => {
        const selection = voiceDrafts[voiceEvent.eventId];
        const input = selection?.operandVoiceEventId
          ? { kind: "VOICE_BINDING" as const, bindingId: selection.operandVoiceEventId }
          : selection?.operandOccurrenceId
            ? { kind: "SPECTRUM_SELECTION" as const, selectionId: selection.operandOccurrenceId }
            : null;
        return selection?.operatorCandidateId && input
          ? [{
              bindingId: voiceEvent.eventId,
              voice: voiceEvent.canonicalIdentity,
              position: voiceEvent.position,
              operatorCandidateId: selection.operatorCandidateId,
              input,
            }]
          : [];
      })
    : [];

  return (
    <section
      aria-label="Current-word symbolic draft"
      data-testid="current-word-symbolic-draft"
      className="mt-4 min-w-0 rounded-lg border border-[#46505c] bg-[#0e1411] p-3"
    >
      <h3 className="text-sm font-semibold text-[#f5f7fb]">Current-word symbolic draft</h3>
      <p className="mt-1 text-xs leading-5 text-[#aeb7c5]">
        Select every spectrum association, Voice operator and operand yourself. These computed transformations stay exploratory and do not map themselves to a word meaning.
      </p>
      <p className="mt-2 text-xs text-[#c5ced8]" data-testid="current-word-symbolic-identity">
        Analyzed form: <strong>{analyzedWord || "UNKNOWN_OR_NULL"}</strong> · language {language} · variety {variety}
      </p>

      <div className="mt-3 rounded border border-[#38433a] p-2 text-xs leading-5" data-testid="current-word-symbolic-source-meaning">
        <div className="font-semibold text-[#d8e4ca]">Source-reported meaning</div>
        {facts.length > 0 ? facts.map((fact) => (
          <div key={fact.sourceRecordId} className="mt-1 min-w-0 break-words">
            <span>SOURCE_FACT · exact source form {fact.form} · {fact.sourceStatus} · attestation {fact.attestationTruth} · {fact.sourceRecordId} · {fact.entryLocator} · snapshot {fact.sourceSnapshot.sourceFamilyId} · SHA-256 {fact.sourceSnapshot.sha256}</span>
            {fact.senses.map((sense, index) => (
              <div key={`${fact.sourceRecordId}-sense-${index}`} className="ml-2 text-[#c5ced8]">
                Sense {index + 1}{sense.senseId ? ` · ${sense.senseId}` : " · UNKNOWN_OR_NULL"}: {sense.glosses.length ? sense.glosses.join("; ") : "UNKNOWN_OR_NULL"}
              </div>
            ))}
          </div>
        )) : <p className="mt-1 text-[#aeb7c5]">UNKNOWN_OR_NULL · {sourceIdentityMismatch
          ? "source evidence withheld because the selected language or dialect differs from the analyzed source identity"
          : `no matching exact-form source meaning is available in this analysis context${sourceStatus ? ` · source status ${sourceStatus.status}${sourceStatus.reasonCode ? ` · ${sourceStatus.reasonCode}` : ""}` : " · source status not supplied"}`
        }.</p>}
        <p className="mt-1 text-[#aeb7c5]">This lexical evidence is displayed separately and does not authorize a symbolic association or meaning bridge.</p>
      </div>

      {!identityMatches ? (
        <p role="status" data-testid="current-word-symbolic-identity-mismatch" className="mt-3 rounded border border-[#746541] bg-[#18140e] p-2 text-xs leading-5 text-[#f0ddb0]">
          Draft target differs from the analyzed word. Symbolic controls are withheld until the current analyzed form is restored. Changing word, language or dialect clears these selections.
        </p>
      ) : null}

      {structure.ok ? (
        <>
          <div className="mt-3 rounded border border-[#38433a] p-2 text-xs leading-5">
            <div><strong>Exact written form:</strong> <span data-testid="current-word-symbolic-code-points">{structure.target.codePoints.map(({ character, position }) => `${character}@${position}`).join(" · ") || "UNKNOWN_OR_NULL"}</span></div>
            <div><strong>Orthographic Seven Voices:</strong> <span data-testid="current-word-symbolic-written-voices">{structure.target.writtenVoices.map(({ voice, position }) => `${voice}@${position}`).join(" → ") || "∅"}</span></div>
            <div className="text-[#aeb7c5]">Pronunciation authority: NOT_ESTABLISHED</div>
          </div>

          {identityMatches ? (
            <div className="mt-3 space-y-2" data-testid="current-word-symbolic-selection-controls">
              {structure.spectrumOccurrences.map((occurrence) => (
                <label key={occurrence.occurrenceId} className={labelClass}>
                  Spectrum association · {occurrence.unit}@{occurrence.span.start} · exact span [{occurrence.span.start},{occurrence.span.end})
                  <select
                    aria-label={`Spectrum association for ${occurrence.unit} at position ${occurrence.span.start}`}
                    className={inputClass}
                    value={selectedAssociations[occurrence.occurrenceId] ?? ""}
                    onChange={(event) => setSelectedAssociations((previous) => ({ ...previous, [occurrence.occurrenceId]: event.target.value }))}
                  >
                    <option value="">Select a proposed association</option>
                    {occurrence.associationCandidates.map((candidate) => (
                      <option key={candidate.candidateId} value={candidate.candidateId}>
                        {candidate.association} · {candidate.evidenceStatus} · {candidate.claimLayer}
                      </option>
                    ))}
                  </select>
                </label>
              ))}

              {structure.voiceEvents.map((voiceEvent, eventIndex) => {
                const selection = voiceDrafts[voiceEvent.eventId] ?? { operatorCandidateId: "", operandOccurrenceId: "" };
                const operandValue = selection.operandVoiceEventId
                  ? `voice:${selection.operandVoiceEventId}`
                  : selection.operandOccurrenceId
                    ? `spectrum:${selection.operandOccurrenceId}`
                    : "";
                const earlierComputedVoiceOptions = structure.voiceEvents
                  .slice(0, eventIndex)
                  .flatMap((earlierEvent, earlierIndex) => {
                    const outputSymbolId = `draft-voice-output-${earlierIndex}`;
                    const output = evaluation.ok
                      ? evaluation.symbols.find(({ symbolId }) => symbolId === outputSymbolId)
                      : undefined;
                    return output ? [{ event: earlierEvent, output }] : [];
                  });
                return (
                  <fieldset key={voiceEvent.eventId} className="grid min-w-0 gap-2 rounded border border-[#38433a] p-2 sm:grid-cols-2">
                    <legend className="px-1 text-xs font-semibold text-[#d8e4ca]">Voice event {voiceEvent.canonicalIdentity}@{voiceEvent.position}</legend>
                    <label className={labelClass}>
                      Voice operator for {voiceEvent.canonicalIdentity}@{voiceEvent.position}
                      <select
                        aria-label={`Voice operator for ${voiceEvent.canonicalIdentity}@${voiceEvent.position}`}
                        className={inputClass}
                        value={selection.operatorCandidateId}
                        onChange={(event) => setVoiceDrafts((previous) => ({
                          ...previous,
                          [voiceEvent.eventId]: { ...selection, operatorCandidateId: event.target.value },
                        }))}
                      >
                        <option value="">Select a proposed operator</option>
                        {voiceEvent.operatorCandidates.map((candidate) => (
                          <option key={candidate.candidateId} value={candidate.candidateId}>
                            {candidate.operatorText} · {candidate.evidenceStatus}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={labelClass}>
                      Explicit operand for {voiceEvent.canonicalIdentity}@{voiceEvent.position}
                      <select
                        aria-label={`Explicit operand for ${voiceEvent.canonicalIdentity}@${voiceEvent.position}`}
                        className={inputClass}
                        value={operandValue}
                        onChange={(event) => setVoiceDrafts((previous) => {
                          const value = event.target.value;
                          const isVoiceOperand = value.startsWith("voice:");
                          return {
                            ...previous,
                            [voiceEvent.eventId]: {
                              ...selection,
                              operandOccurrenceId: value.startsWith("spectrum:") ? value.slice("spectrum:".length) : "",
                              operandVoiceEventId: isVoiceOperand ? value.slice("voice:".length) : undefined,
                            },
                          };
                        })}
                      >
                        <option value="">Select an explicitly computed operand</option>
                        {selectedOccurrenceOptions.map((occurrence) => {
                          const candidateId = selectedAssociations[occurrence.occurrenceId];
                          const candidate = occurrence.associationCandidates.find(({ candidateId: id }) => id === candidateId);
                          return (
                            <option key={occurrence.occurrenceId} value={`spectrum:${occurrence.occurrenceId}`}>
                              {occurrence.unit}@{occurrence.span.start} · {candidate?.association ?? "UNKNOWN_OR_NULL"}
                            </option>
                          );
                        })}
                        {earlierComputedVoiceOptions.map(({ event: earlierEvent, output }) => (
                          <option key={earlierEvent.eventId} value={`voice:${earlierEvent.eventId}`}>
                            Voice {earlierEvent.canonicalIdentity}@{earlierEvent.position} · {output.text} · computed proposal
                          </option>
                        ))}
                      </select>
                    </label>
                  </fieldset>
                );
              })}
            </div>
          ) : null}
        </>
      ) : (
        <p role="status" data-testid="current-word-symbolic-structure-null" className="mt-3 text-xs text-[#e4bb9a]">
          Symbolic structure: UNKNOWN_OR_NULL · {structure.reasonCodes.join(" · ")}
        </p>
      )}

      <div className="mt-3 rounded border border-[#38433a] p-2 text-xs leading-5" data-testid="current-word-symbolic-result">
        <h4 className="font-semibold text-[#d8e4ca]">Evaluated symbolic contributions</h4>
        {!identityMatches ? <p>UNKNOWN_OR_NULL · draft does not identify the analyzed word.</p> : null}
        {identityMatches && evaluation.ok ? (
          <>
            {evaluation.symbols.filter((symbol) => symbol.symbolKind === "VOICE_TRANSFORM").length > 0 ? (
              evaluation.symbols.filter((symbol) => symbol.symbolKind === "VOICE_TRANSFORM").map((symbol) => (
                <div key={symbol.symbolId} className="mt-1 break-words" data-testid="current-word-symbolic-computed-output">
                  COMPUTED · {symbol.voice}@{symbol.position} · {symbol.text} · USER_PROPOSED / EXPLORATORY_HYPOTHESIS
                </div>
              ))
            ) : <p className="mt-1 text-[#aeb7c5]">UNKNOWN_OR_NULL · no complete Voice operator application has been selected.</p>}
            <div className="mt-2" data-testid="current-word-symbolic-operation-trace">
              {evaluation.operationTrace.length ? evaluation.operationTrace.map((entry) => (
                <div key={entry.operationId} className="break-words">
                  {entry.operationId} · {entry.kind} · {entry.status} · {entry.contribution ?? "UNKNOWN_OR_NULL"}
                  {entry.reasonCodes.length ? ` · ${entry.reasonCodes.join(", ")}` : ""}
                </div>
              )) : <p>UNKNOWN_OR_NULL · no operations selected.</p>}
            </div>
            <p className="mt-2">Whole-word functional motivation and graph-to-meaning status are shown in the explicit current-word bridge section below.</p>
            <p>Source-authority promotion: {evaluation.sourceAuthorityPromotion} · historical origin: {evaluation.historicalOrigin}</p>
            <p data-testid="current-word-symbolic-decision">No interpretation is selected automatically · {evaluation.interpretationSelection.userDecisionPosture}</p>
          </>
        ) : identityMatches ? (
          <p>UNKNOWN_OR_NULL · {evaluationFailureReasonCodes?.join(" · ") ?? "UNKNOWN_OR_NULL"}</p>
        ) : null}
      </div>

      <CurrentWordSymbolicGraphMeaningV0_1
        key={JSON.stringify([
          analyzedWord,
          draftTargetWord,
          language,
          variety,
          facts.map(({ sourceRecordId, sourceSnapshot }) => [sourceRecordId, sourceSnapshot.sha256]),
        ])}
        analyzedWord={analyzedWord}
        draftTargetWord={draftTargetWord}
        language={language}
        variety={variety}
        identityMatches={identityMatches}
        exactSourceFacts={facts}
        spectrumSelections={graphSpectrumSelections}
        voiceBindings={graphVoiceBindings}
        operations={projection.operations}
        evaluation={evaluation}
      />
    </section>
  );
}
