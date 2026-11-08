"use client";

import { useMemo, useState } from "react";
import {
  buildSingleWordFunctionalMotivationProposalV0_1,
  type SingleWordFunctionalMotivationInputV0_1,
  type SingleWordFunctionalMotivationSegmentInputV0_1,
  type SingleWordFunctionalMotivationTransformationInputV0_1,
  type SingleWordSegmentEvidenceStatusV0_1,
  type SingleWordTransparencyV0_1,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";
import {
  examineSingleWordMechanicalInterpretationV0_1,
  notSubmittedMechanicalInterpretationV0_1,
  type MechanicalEditInputV0_1,
  type MechanicalEditKindV0_1,
  type SingleWordMechanicalExaminerResultV0_1,
} from "@/shared/openInstrument/singleWordMechanicalExaminer.v0_1";
import type { MotivationDiscoveryV0_1VM, PresentOrMissing } from "@/ui/telemetry/types";
import { FjaloriCrossSourceEvidenceV0_1 } from "@/ui/instrument/sections/FjaloriCrossSourceEvidence.v0_1";

type DraftSegment = SingleWordFunctionalMotivationSegmentInputV0_1;
type DraftTransformation = SingleWordFunctionalMotivationTransformationInputV0_1;
type DraftMechanicalOperation = Omit<MechanicalEditInputV0_1, "position"> & { position: number | "" };
type SelectedComponentSourceLookupV0_1 = Readonly<{ componentIndex: number; exactSpelling: string }>;
type ExaminedMechanicalDraft = Readonly<{
  snapshot: string;
  result: SingleWordMechanicalExaminerResultV0_1;
}>;

export type SingleWordCurrentWordEvidenceContextV0_1 = Readonly<{
  analyzedWord: string;
  discovery?: PresentOrMissing<MotivationDiscoveryV0_1VM>;
}>;

function blankSegment(): DraftSegment {
  return {
    exactSpelling: "",
    proposedMeaning: "",
    proposedGrammaticalRole: "",
    language: "",
    dialect: "",
    evidenceStatus: "USER_PROPOSED",
    evidenceReference: "",
    unresolved: false,
  };
}

function blankTransformation(): DraftTransformation {
  return { from: "", to: "", explanation: "", evidenceReference: "" };
}

function blankMechanicalOperation(): DraftMechanicalOperation {
  return { kind: "SUBSTITUTE", position: 0, expectedText: "", replacementText: "" };
}

const inputClass = "mt-1 w-full rounded border border-[#46505c] bg-[#0d1117] px-2 py-1.5 text-sm text-[#f5f7fb] placeholder:text-[#7f8b99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]";
const labelClass = "block text-xs font-medium text-[#c5ced8]";

function evidenceStatusLabel(status: SingleWordSegmentEvidenceStatusV0_1): string {
  switch (status) {
    case "USER_PROPOSED":
      return "user proposed";
    case "CITATION_ENTERED_UNVERIFIED":
      return "citation entered; unverified";
    case "UNKNOWN_OR_NULL":
      return "Unknown / Null";
  }
}

function transparencyLabel(value: SingleWordTransparencyV0_1): string {
  switch (value) {
    case "ATOMIC":
      return "atomic";
    case "METAPHORICAL":
      return "metaphorical";
    case "OPAQUE":
      return "opaque";
    case "UNKNOWN_OR_NULL":
      return "Unknown / Null";
  }
}

function displayVoicePath(path: readonly string[]): string {
  return path.length ? path.join(" → ") : "∅";
}

function sameAlbanianSourceForm(left: string, right: string): boolean {
  return left.normalize("NFC").trim().toLocaleLowerCase("sq-AL") ===
    right.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
}

function isAlbanianSourceContextV0_1(discovery: MotivationDiscoveryV0_1VM): boolean {
  const languageValues = [discovery.inputLanguage, discovery.sourceFact.language]
    .map((value) => value.normalize("NFC").trim().toLocaleLowerCase("en-US"))
    .filter((value) => value.length > 0 && value !== "unknown");
  const profile = discovery.inputProfile.normalize("NFC").trim().toLocaleLowerCase("en-US");
  const identifiesAlbanian = (value: string) =>
    value === "sq" || value.startsWith("sq-") || value.includes("albanian");
  const hasAlbanianIdentity = [...languageValues, profile].some(identifiesAlbanian);
  const hasConflictingLanguage = languageValues.some((value) => !identifiesAlbanian(value));
  const hasConflictingProfile = /\b(english|latin|greek|turkish|arabic)\b/u.test(profile);
  return hasAlbanianIdentity && !hasConflictingLanguage && !hasConflictingProfile;
}

function CurrentWordEvidenceSectionV0_1({
  analyzedWord,
  draftTargetWord,
  context,
}: {
  analyzedWord: string;
  draftTargetWord: string;
  context?: SingleWordCurrentWordEvidenceContextV0_1;
}) {
  const contextMatchesTarget = context?.analyzedWord === analyzedWord;
  const discoveryState = context?.discovery;
  const discovery = discoveryState?.kind === "present" ? discoveryState.value : null;
  const discoveryMatchesContext = discovery?.inputWord === context?.analyzedWord;
  const visibleDiscovery = contextMatchesTarget && discoveryMatchesContext ? discovery : null;
  const sourceContextIsAlbanian = visibleDiscovery
    ? isAlbanianSourceContextV0_1(visibleDiscovery)
    : false;
  const sourceStatus = sourceContextIsAlbanian
    ? visibleDiscovery?.exactLexicalSourceStatus
    : undefined;
  const sourceInputWord = visibleDiscovery?.inputWord;
  const sourceFacts = sourceStatus?.status === "MATCHES_FOUND" && sourceContextIsAlbanian
    ? (visibleDiscovery?.exactLexicalSourceFacts ?? []).filter((fact) =>
        fact.languageCode === "sq" && sourceInputWord !== undefined && sameAlbanianSourceForm(fact.form, sourceInputWord),
      )
    : [];
  const voiceProvenance = visibleDiscovery?.derivedStructure.voicePathProvenance;
  const writtenInputMatches = voiceProvenance?.writtenInput.inputForm === visibleDiscovery?.inputWord;
  const writtenInput = writtenInputMatches ? voiceProvenance?.writtenInput : undefined;
  const selectedPath = voiceProvenance?.selectedPath;
  const structuralHypotheses = visibleDiscovery?.derivedStructure.structuralHypotheses ?? [];

  return (
    <section
      aria-label="Current Word Evidence"
      data-testid="single-word-current-evidence"
      className="mt-4 rounded-lg border border-[#34495a] bg-[#0d141b] p-3 text-xs leading-5 text-[#d7dde7]"
    >
      <h3 className="text-sm font-semibold text-[#f5f7fb]">Current Word Evidence</h3>
      <p className="mt-1 text-[#aeb7c5]">
        Read-only context from this analysis. It does not fill proposal fields, select a source sense, or validate a user-entered citation.
      </p>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded border border-[#303843] bg-[#10161c] p-2">
          <div className="font-semibold uppercase tracking-[0.1em] text-[#8ea4ba]">ANALYZED WORD</div>
          <div className="mt-1 break-words font-mono text-sm text-[#f5f7fb]">
            {context?.analyzedWord ?? "not supplied"}
          </div>
        </div>
        <div className="min-w-0 rounded border border-[#303843] bg-[#10161c] p-2">
          <div className="font-semibold uppercase tracking-[0.1em] text-[#8ea4ba]">ANALYSIS LANGUAGE / PROFILE</div>
          <div className="mt-1 break-words">
            {visibleDiscovery
              ? `${visibleDiscovery.inputLanguage} · ${visibleDiscovery.inputProfile}`
              : "not emitted"}
          </div>
          {visibleDiscovery ? (
            <div className="break-words text-[#9fb1bf]">
              Analysis source status: {visibleDiscovery.sourceFact.sourceStatus}
            </div>
          ) : null}
        </div>
      </div>

      {!context ? (
        <p className="mt-2" data-testid="single-word-evidence-context-unavailable">
          Analysis context was not supplied. Source and structural evidence are not inferred here.
        </p>
      ) : null}
      {context && !contextMatchesTarget ? (
        <p className="mt-2 rounded border border-[#674b3a] bg-[#1a1411] p-2 text-[#efccaa]" data-testid="single-word-evidence-word-mismatch">
          Evidence context is for {context.analyzedWord}, while this workbench belongs to {analyzedWord}. Source and structural details are withheld to prevent cross-word mixing.
        </p>
      ) : null}
      {contextMatchesTarget && !discoveryState ? (
        <p className="mt-2" data-testid="single-word-discovery-not-emitted">
          Discovery evidence: NOT_EMITTED. Exact source, Voice-path provenance, and structural candidates are unavailable in this analysis payload.
        </p>
      ) : null}
      {contextMatchesTarget && discoveryState?.kind === "missing" ? (
        <p className="mt-2" data-testid="single-word-discovery-missing">
          Discovery evidence: MISSING · {discoveryState.missing}
          {discoveryState.note ? ` · ${discoveryState.note}` : ""}. No source meaning or structural claim is inferred from the missing payload.
        </p>
      ) : null}
      {contextMatchesTarget && discovery && !discoveryMatchesContext ? (
        <p className="mt-2 rounded border border-[#674b3a] bg-[#1a1411] p-2 text-[#efccaa]" data-testid="single-word-discovery-word-mismatch">
          Discovery input {discovery.inputWord} does not match analyzed word {context?.analyzedWord}; its evidence is withheld.
        </p>
      ) : null}

      {visibleDiscovery ? (
        <div className="mt-3 space-y-2">
          <section data-testid="single-word-current-source-evidence" className="rounded border border-[#303843] bg-[#10161c] p-2">
            <h4 className="font-semibold text-[#dce9ca]">Albanian Kaikki whole-word source</h4>
            {sourceContextIsAlbanian ? (
              <div className="mt-1">
                Exact-form lookup: {sourceStatus?.status ?? "NOT_EMITTED"}
                {sourceStatus?.queryForm ? ` · query ${sourceStatus.queryForm}` : ""}
                {sourceStatus?.reasonCode ? ` · ${sourceStatus.reasonCode}` : ""}
              </div>
            ) : (
              <p className="mt-1 text-[#aeb7c5]">NOT_APPLICABLE_FOR_LANGUAGE · The Albanian source result is withheld outside an identified Albanian analysis context; no Albanian lexical conclusion is displayed.</p>
            )}
            {sourceStatus?.status === "SOURCE_NOT_FOUND" ? (
              <p className="mt-1 text-[#aeb7c5]">The exact-form lookup returned no source record; this does not establish lexical absence.</p>
            ) : null}
            {sourceStatus?.status === "UNAVAILABLE" ? (
              <p className="mt-1 text-[#aeb7c5]">The source was unavailable; no lexical conclusion follows.</p>
            ) : null}
            {sourceStatus?.status === "NOT_QUERIED" ? (
              <p className="mt-1 text-[#aeb7c5]">The source was not queried; no lexical conclusion follows.</p>
            ) : null}
            {sourceContextIsAlbanian && sourceStatus?.status === "MATCHES_FOUND" && sourceFacts.length === 0 ? (
              <p className="mt-1 text-[#aeb7bf]">
                MATCHES_FOUND was emitted without a displayable exact-form source fact in this payload.
              </p>
            ) : null}
            {sourceFacts.length > 0 ? (
              <>
                <p className="mt-1 text-[#9fb1bf]">Source senses are shown read-only; none is selected for a component proposal.</p>
                <ol className="mt-2 space-y-2">
                  {sourceFacts.map((fact) => (
                    <li key={fact.sourceRecordId} className="min-w-0 rounded border border-[#26323d] p-2">
                      <div className="break-words font-mono">{fact.sourceRecordId}</div>
                      <div className="break-words text-[#aeb7c5]">
                        Entry {fact.entryLocator} · {fact.form} · {fact.partOfSpeech ?? "part of speech Unknown / Null"}
                      </div>
                      <div className="break-words text-[#9fb1bf]">
                        {fact.language} · {fact.sourceStatus} · {fact.attestationTruth.toUpperCase()} · {fact.sourceSnapshot.sourceFamilyId} · SHA-256 {fact.sourceSnapshot.sha256}
                      </div>
                      <div className="break-all text-[#9fb1bf]">Source snapshot: {fact.sourceSnapshot.sourceUrl}</div>
                      {fact.senses.length > 0 ? (
                        <ul className="mt-1 space-y-1">
                          {fact.senses.map((sense, senseIndex) => (
                            <li key={`${fact.sourceRecordId}:${sense.senseId ?? senseIndex}`} className="break-words">
                              Sense {sense.senseId ?? "UNKNOWN_OR_NULL"}: {sense.glosses.length ? sense.glosses.join("; ") : "Unknown / Null"}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-1">Source senses: not emitted.</div>
                      )}
                      {fact.ipaObservations.length > 0 ? (
                        <div className="mt-1 text-[#9fb1bf]">
                          Source-reported IPA observations: {fact.ipaObservations.map((observation) => observation.ipa ?? "Unknown / Null").join("; ")}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </section>

          <section data-testid="single-word-current-voice-evidence" className="rounded border border-[#315147] bg-[#101714] p-2">
            <h4 className="font-semibold text-[#a9d2bf]">Written Seven-Voices path</h4>
            {writtenInput ? (
              <>
                <div className="mt-1 font-mono text-base text-[#f5f7fb]">{displayVoicePath(writtenInput.voicePath)}</div>
                <div className="break-words">
                  Authority: {writtenInput.representationAuthority} · pronunciation: {writtenInput.pronunciationAuthority}
                </div>
                <div className="break-words text-[#a9d2bf]">
                  {writtenInput.events.length
                    ? writtenInput.events.map((event) => `${event.voice} at source position ${event.sourcePosition} (${event.sourceCharacter})`).join(" · ")
                    : "No written Voice events"}
                </div>
                <div className="break-words text-[#9fb1bf]">
                  Positions are zero-based Unicode code points in the NFC written input; sequence status: {writtenInput.inputVoiceSequenceStatus}.
                </div>
              </>
            ) : (
              <p className="mt-1">Written path provenance: NOT_EMITTED or input-form mismatch. A selected derived path is not substituted for spelling.</p>
            )}
            {selectedPath ? (
              <div className="mt-2 rounded border border-[#263a33] p-2">
                <div className="font-semibold">
                  {selectedPath.selectionKind === "profile_solver_selected" ? "Solver-selected path" : "Selected derived path"}
                </div>
                <div className="font-mono text-sm">{displayVoicePath(selectedPath.voicePath)}</div>
                <div className="break-words text-[#a9d2bf]">
                  Selection: {selectedPath.selectionKind} · legacy source: {selectedPath.legacySource} · relation to written path: {selectedPath.relationshipToWritten}
                </div>
                <div className="text-[#9fb1bf]">This derived sequence is displayed separately; it is not a literal spelling inventory or an independent pronunciation claim.</div>
              </div>
            ) : (
              <div className="mt-2 rounded border border-[#263a33] p-2">
                <div className="font-semibold">Legacy derived path (separate from spelling)</div>
                <div className="font-mono text-sm">{displayVoicePath(visibleDiscovery.derivedStructure.voicePath)}</div>
                <div className="text-[#9fb1bf]">
                  Source: {visibleDiscovery.derivedStructure.voicePathSource}. Written provenance is not available; pronunciation authority is not inferred.
                </div>
              </div>
            )}
          </section>

          <section data-testid="single-word-current-structural-evidence" className="rounded border border-[#3f3a2b] bg-[#15130f] p-2">
            <h4 className="font-semibold text-[#f0ddb0]">Structural candidates</h4>
            {structuralHypotheses.length ? (
              <ul className="mt-1 space-y-2">
                {structuralHypotheses.map((hypothesis) => (
                  <li key={hypothesis.hypothesisId} className="min-w-0 break-words">
                    <div className="font-mono">{hypothesis.hypothesisId} · embryo {hypothesis.embryo}</div>
                    <div>Expansion: {hypothesis.expansionChain.join(" → ") || "not emitted"}</div>
                    <div className="text-[#c5b995]">Reason codes: {hypothesis.reasonCodes.join(", ") || "none emitted"}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1">No structural hypotheses emitted; this level remains UNKNOWN_OR_NULL.</p>
            )}
            <p className="mt-1 text-[#c5b995]">Structure supplies candidate form only. It does not assign component meaning, morphology, historical derivation, or embryo function.</p>
          </section>
        </div>
      ) : null}

      {contextMatchesTarget && draftTargetWord !== analyzedWord ? (
        <p className="mt-2 rounded border border-[#674b3a] bg-[#1a1411] p-2 text-[#efccaa]" data-testid="single-word-proposal-evidence-target-mismatch">
          The editable proposal target is {draftTargetWord}; evidence above remains tied to analyzed word {analyzedWord} and is not transferred.
        </p>
      ) : null}
    </section>
  );
}

function validationMessageForReasonCode(reasonCode: string): string {
  const segmentMatch = /^SEGMENT_(\d+)_(.+)$/u.exec(reasonCode);
  if (segmentMatch) {
    const [, number, reason] = segmentMatch;
    switch (reason) {
      case "EXACT_SPELLING_REQUIRED":
        return `Component ${number} spelling: enter one component of up to 80 characters.`;
      case "MEANING_MALFORMED":
        return `Component ${number} meaning: use 300 characters or fewer.`;
      case "GRAMMATICAL_ROLE_MALFORMED":
        return `Component ${number} grammatical role: use 200 characters or fewer.`;
      case "MEANING_AND_ROLE_REQUIRED_OR_MARK_UNRESOLVED":
        return `Component ${number}: enter both a meaning and role, or mark it not yet explained.`;
      case "LANGUAGE_REQUIRED":
        return `Component ${number} language: enter a language matching the target language.`;
      case "LANGUAGE_MUST_MATCH_TARGET":
        return `Component ${number} language must match the target language.`;
      case "DIALECT_MALFORMED":
        return `Component ${number} dialect: use 80 characters or fewer.`;
      case "EVIDENCE_STATUS_UNSUPPORTED":
        return `Component ${number} evidence status: select one of the listed statuses.`;
      case "EVIDENCE_REFERENCE_MALFORMED":
        return `Component ${number} evidence reference: use 500 characters or fewer.`;
      case "CITATION_REFERENCE_REQUIRED":
        return `Component ${number} evidence reference: add a citation locator (up to 500 characters) or change the evidence status.`;
      case "UNRESOLVED_FLAG_REQUIRED":
        return `Component ${number}: set whether it is not yet explained.`;
      case "MALFORMED":
        return `Component ${number}: check the spelling, meaning, role, language, dialect, and evidence fields.`;
      default:
        return `Component ${number}: review the field values and limits shown above.`;
    }
  }

  const transformationMatch = /^TRANSFORMATION_(\d+)_(.+)$/u.exec(reasonCode);
  if (transformationMatch) {
    const [, number, reason] = transformationMatch;
    if (reason === "SOURCE_AND_TARGET_REQUIRED") {
      return `Transformation ${number}: enter both From and To values.`;
    }
    if (reason === "MALFORMED") {
      return `Transformation ${number}: From/To allow 80 characters each, explanation 300, and evidence reference 500.`;
    }
  }

  switch (reasonCode) {
    case "MALFORMED_PROPOSAL":
      return "Proposal: check that all fields have valid values.";
    case "TARGET_WORD_REQUIRED_AS_ONE_SUPPORTED_TOKEN":
      return "Exact target word: enter one supported word of up to 80 Unicode code points.";
    case "TARGET_LANGUAGE_REQUIRED":
      return "Target language: enter a language of up to 80 characters.";
    case "TARGET_DIALECT_MALFORMED":
      return "Target dialect: use 80 characters or fewer.";
    case "TWO_TO_TWELVE_ORDERED_SEGMENTS_REQUIRED":
      return "Components: add between 2 and 12 ordered components.";
    case "UNRESOLVED_CONNECTING_MATERIAL_MALFORMED":
      return "Connecting material: use 500 characters or fewer.";
    case "ZERO_TO_EIGHT_TRANSFORMATIONS_REQUIRED":
      return "Transformations: keep the list between 0 and 8 items.";
    case "FUNCTIONAL_EXPLANATION_REQUIRED":
      return "Proposed functional explanation: enter 1–1,000 characters.";
    case "TRANSPARENCY_LEVEL_UNSUPPORTED":
      return "Transparency: select one of the listed descriptions.";
    case "ORTHOGRAPHIC_STRUCTURE_ANALYSIS_FAILED":
      return "Written Voice analysis is unavailable for this target word.";
    default:
      return "This field needs correction. Check its label and the limits shown above.";
  }
}

export function SingleWordMotivationWorkbenchV0_1({
  initialTargetWord,
  currentWordEvidence,
}: {
  initialTargetWord: string;
  currentWordEvidence?: SingleWordCurrentWordEvidenceContextV0_1;
}) {
  const [targetWord, setTargetWord] = useState(initialTargetWord);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [targetDialect, setTargetDialect] = useState("");
  const [segments, setSegments] = useState<DraftSegment[]>([blankSegment(), blankSegment()]);
  const [selectedComponentSource, setSelectedComponentSource] = useState<SelectedComponentSourceLookupV0_1 | null>(null);
  const [unresolvedConnectingMaterial, setUnresolvedConnectingMaterial] = useState("");
  const [transformations, setTransformations] = useState<DraftTransformation[]>([]);
  const [mechanicalOperations, setMechanicalOperations] = useState<DraftMechanicalOperation[]>([]);
  const [examinedMechanicalDraft, setExaminedMechanicalDraft] = useState<ExaminedMechanicalDraft | null>(null);
  const [functionalExplanation, setFunctionalExplanation] = useState("");
  const [transparency, setTransparency] = useState<SingleWordTransparencyV0_1>("UNKNOWN_OR_NULL");

  const input = useMemo<SingleWordFunctionalMotivationInputV0_1>(() => ({
    targetWord,
    targetLanguage,
    targetDialect,
    segments,
    unresolvedConnectingMaterial,
    transformations,
    functionalExplanation,
    transparency,
  }), [targetWord, targetLanguage, targetDialect, segments, unresolvedConnectingMaterial, transformations, functionalExplanation, transparency]);
  const result = useMemo(() => buildSingleWordFunctionalMotivationProposalV0_1(input), [input]);
  const mechanicalDraftSnapshot = useMemo(() => JSON.stringify({ input, mechanicalOperations }), [input, mechanicalOperations]);
  const currentMechanicalResult = examinedMechanicalDraft?.snapshot === mechanicalDraftSnapshot
    ? examinedMechanicalDraft.result
    : null;
  const mechanicalResultIsStale = examinedMechanicalDraft !== null && currentMechanicalResult === null;
  const notSubmittedResult = useMemo(() => notSubmittedMechanicalInterpretationV0_1(
    targetWord,
    segments.map((segment) => segment.exactSpelling),
  ), [targetWord, segments]);

  function updateSegment(index: number, update: Partial<DraftSegment>) {
    if (
      selectedComponentSource?.componentIndex === index &&
      typeof update.exactSpelling === "string" &&
      update.exactSpelling !== selectedComponentSource.exactSpelling
    ) {
      setSelectedComponentSource(null);
    }
    setSegments((current) => current.map((segment, at) => at === index ? { ...segment, ...update } : segment));
  }

  function removeSegment(index: number) {
    setSelectedComponentSource(null);
    setSegments((current) => current.filter((_, at) => at !== index));
  }

  function updateTransformation(index: number, update: Partial<DraftTransformation>) {
    setTransformations((current) => current.map((item, at) => at === index ? { ...item, ...update } : item));
  }

  function updateMechanicalOperation(index: number, update: Partial<DraftMechanicalOperation>) {
    setMechanicalOperations((current) => current.map((item, at) => at === index ? { ...item, ...update } : item));
  }

  function moveMechanicalOperation(index: number, offset: -1 | 1) {
    setMechanicalOperations((current) => {
      const nextIndex = index + offset;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex]!, next[index]!];
      return next;
    });
  }

  function examineMechanicalDraft() {
    const examined = examineSingleWordMechanicalInterpretationV0_1({
      submitted: true,
      targetWord,
      componentSpellings: segments.map((segment) => segment.exactSpelling),
      operations: mechanicalOperations.map((operation) => ({
        ...operation,
        position: operation.position === "" ? Number.NaN : operation.position,
      })),
    });
    setExaminedMechanicalDraft({ snapshot: mechanicalDraftSnapshot, result: examined });
  }

  function clearInterpretation() {
    setTargetWord(initialTargetWord);
    setTargetLanguage("");
    setTargetDialect("");
    setSegments([blankSegment(), blankSegment()]);
    setSelectedComponentSource(null);
    setUnresolvedConnectingMaterial("");
    setTransformations([]);
    setMechanicalOperations([]);
    setExaminedMechanicalDraft(null);
    setFunctionalExplanation("");
    setTransparency("UNKNOWN_OR_NULL");
  }

  return (
    <section
      aria-label="Single-word functional motivation workbench"
      data-testid="single-word-motivation-workbench"
      className="rounded-[12px] border border-[#53604a] bg-[#111710] p-4"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b9cf8a]">
        SINGLE-WORD MOTIVATION WORKBENCH
      </div>
      <h2 className="mt-1 text-base font-semibold text-[#f5f7fb]">Propose components inside one word</h2>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-[#aeb7c5]">
        This is a user-authored functional motivation proposal. Segment citations are entered by you and are not independently verified here; a proposed compound is not an attested compound or an embryo meaning.
      </p>
      <p className="mt-1 max-w-3xl text-xs leading-5 text-[#aeb7c5]">
        Keep component languages aligned with the target language; record dialect differences separately.
      </p>
      <p data-testid="single-word-motivation-field-limits" className="mt-1 max-w-4xl text-xs leading-5 text-[#aeb7c5]">
        Limits: target word 80 Unicode code points; target/component language and dialect 80 characters; component spelling 80, meaning 300, role 200; evidence references and connecting material 500; transformation endpoints 80, explanation 300, reference 500; functional explanation 1,000 characters. Use 2–12 components and at most 8 transformations.
      </p>

      <CurrentWordEvidenceSectionV0_1
        analyzedWord={initialTargetWord}
        draftTargetWord={targetWord}
        context={currentWordEvidence}
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Exact target word
          <input aria-label="Exact target word" maxLength={80} className={inputClass} value={targetWord} onChange={(event) => setTargetWord(event.target.value)} />
        </label>
        <label className={labelClass}>
          Target language
          <input aria-label="Target language" maxLength={80} className={inputClass} value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)} placeholder="Language or code" />
        </label>
        <label className={labelClass}>
          Target dialect (optional)
          <input aria-label="Target dialect" maxLength={80} className={inputClass} value={targetDialect} onChange={(event) => setTargetDialect(event.target.value)} placeholder="Unknown / not specified" />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {segments.map((segment, index) => (
          <fieldset key={index} className="rounded-lg border border-[#354234] bg-[#0d1117] p-3">
            <legend className="px-1 text-xs font-semibold text-[#dce9ca]">Component {index + 1}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Exact component spelling
                <input aria-label={`Component ${index + 1} exact spelling`} maxLength={80} className={inputClass} value={segment.exactSpelling} onChange={(event) => updateSegment(index, { exactSpelling: event.target.value })} />
              </label>
              <label className={labelClass}>
                Proposed meaning
                <input aria-label={`Component ${index + 1} proposed meaning`} maxLength={300} className={inputClass} value={segment.proposedMeaning} onChange={(event) => updateSegment(index, { proposedMeaning: event.target.value })} disabled={segment.unresolved} />
              </label>
              <label className={labelClass}>
                Proposed grammatical role
                <input aria-label={`Component ${index + 1} grammatical role`} maxLength={200} className={inputClass} value={segment.proposedGrammaticalRole} onChange={(event) => updateSegment(index, { proposedGrammaticalRole: event.target.value })} disabled={segment.unresolved} />
              </label>
              <label className={labelClass}>
                Language
                <input aria-label={`Component ${index + 1} language`} maxLength={80} className={inputClass} value={segment.language} onChange={(event) => updateSegment(index, { language: event.target.value })} />
              </label>
              <label className={labelClass}>
                Dialect (optional)
                <input aria-label={`Component ${index + 1} dialect`} maxLength={80} className={inputClass} value={segment.dialect} onChange={(event) => updateSegment(index, { dialect: event.target.value })} />
              </label>
              <label className={labelClass}>
                Segment evidence status
                <select
                  aria-label={`Component ${index + 1} evidence status`}
                  className={inputClass}
                  value={segment.evidenceStatus}
                  onChange={(event) => updateSegment(index, { evidenceStatus: event.target.value as SingleWordSegmentEvidenceStatusV0_1 })}
                >
                  <option value="USER_PROPOSED">User proposed</option>
                  <option value="CITATION_ENTERED_UNVERIFIED">Citation entered; unverified</option>
                  <option value="UNKNOWN_OR_NULL">Unknown / Null</option>
                </select>
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Evidence source / citation locator
                <input aria-label={`Component ${index + 1} evidence reference`} maxLength={500} className={inputClass} value={segment.evidenceReference} onChange={(event) => updateSegment(index, { evidenceReference: event.target.value })} placeholder="URL, work and entry/sense locator, or leave blank" />
                <span className="mt-1 block text-[11px] leading-4 text-[#9fb1bf]">Up to 500 characters; required when evidence status is “Citation entered; unverified.”</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#c5ced8] sm:col-span-2">
                <input aria-label={`Component ${index + 1} not yet explained`} type="checkbox" checked={segment.unresolved} onChange={(event) => updateSegment(index, { unresolved: event.target.checked })} />
                Component not yet explained
              </label>
            </div>
            <button
              type="button"
              aria-label={"Check source for component " + (index + 1)}
              data-testid="single-word-component-source-check"
              className="mt-2 rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!segment.exactSpelling.trim()}
              onClick={() => setSelectedComponentSource({ componentIndex: index, exactSpelling: segment.exactSpelling })}
            >
              Check source
            </button>
            {selectedComponentSource?.componentIndex === index ? (
              <div data-testid="single-word-component-source-evidence" className="mt-3 rounded border border-[#46505c] bg-[#10131d] p-2">
                <p className="text-xs text-[#d5d9e8]">
                  <strong>Selected exact component spelling:</strong>{" "}
                  <span data-testid="single-word-component-source-spelling">{selectedComponentSource.exactSpelling}</span>
                </p>
                <p className="mt-1 text-xs text-[#aeb4ce]">
                  <strong>User-proposed meaning (as entered):</strong>{" "}
                  {segment.unresolved ? "UNKNOWN_OR_NULL" : segment.proposedMeaning || "UNKNOWN_OR_NULL"}. USER_PROPOSED.
                  This Albanian form lookup does not verify that meaning, the recorded language/dialect, or an exact sense alignment.
                </p>
                <p className="mt-1 text-xs text-[#aeb4ce]">
                  <strong>User-proposed grammatical role:</strong>{" "}
                  {segment.unresolved ? "UNKNOWN_OR_NULL" : segment.proposedGrammaticalRole || "UNKNOWN_OR_NULL"}. USER_PROPOSED.
                </p>
                <p className="mt-1 text-xs text-[#aeb4ce]">
                  <strong>Recorded language/dialect (as entered):</strong>{" "}
                  {segment.language || "UNKNOWN_OR_NULL"}{segment.dialect ? " · " + segment.dialect : ""}.
                </p>
                <FjaloriCrossSourceEvidenceV0_1
                  key={selectedComponentSource.componentIndex + ":" + selectedComponentSource.exactSpelling}
                  word={selectedComponentSource.exactSpelling}
                  context="component"
                  proposalMeaning={segment.unresolved ? "" : segment.proposedMeaning}
                  componentProposal={{
                    componentId: String(index),
                    exactSpelling: segment.exactSpelling,
                    proposedMeaning: segment.proposedMeaning,
                    proposedGrammaticalRole: segment.proposedGrammaticalRole,
                    language: segment.language,
                    dialect: segment.dialect,
                    unresolved: segment.unresolved,
                  }}
                />
              </div>
            ) : null}
            {segments.length > 2 ? (
              <button type="button" className="mt-2 rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca]" onClick={() => removeSegment(index)}>
                Remove component {index + 1}
              </button>
            ) : null}
          </fieldset>
        ))}
        <button type="button" data-testid="single-word-add-component" className="rounded border border-[#53604a] px-3 py-1.5 text-xs font-semibold text-[#dce9ca] hover:bg-[#1b2418]" onClick={() => setSegments((current) => [...current, blankSegment()])}>
          Add component
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Unexplained connecting material or role
          <textarea aria-label="Unexplained connecting material" maxLength={500} className={inputClass} rows={2} value={unresolvedConnectingMaterial} onChange={(event) => setUnresolvedConnectingMaterial(event.target.value)} placeholder="Keep unexplained material explicit; do not repair it silently." />
        </label>
        <label className={labelClass}>
          Proposed functional explanation
          <textarea aria-label="Proposed functional explanation" maxLength={1000} className={inputClass} rows={2} value={functionalExplanation} onChange={(event) => setFunctionalExplanation(event.target.value)} placeholder="How might the proposed component meanings motivate the word's function?" />
          <span data-testid="single-word-functional-explanation-count" className="mt-1 block text-[11px] leading-4 text-[#9fb1bf]">{functionalExplanation.length}/1,000 characters · enter at least one character.</span>
        </label>
        <label className={labelClass}>
          Transparency description
          <select aria-label="Transparency description" className={inputClass} value={transparency} onChange={(event) => setTransparency(event.target.value as SingleWordTransparencyV0_1)}>
            <option value="UNKNOWN_OR_NULL">Unknown / Null</option>
            <option value="ATOMIC">Atomic</option>
            <option value="METAPHORICAL">Metaphorical</option>
            <option value="OPAQUE">Opaque</option>
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-lg border border-[#354234] bg-[#0d1117] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#dce9ca]">Declared transformations</div>
          <button type="button" data-testid="single-word-add-transformation" className="rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca] disabled:cursor-not-allowed disabled:opacity-50" disabled={transformations.length >= 8} onClick={() => setTransformations((current) => [...current, blankTransformation()])}>
            Add transformation
          </button>
        </div>
        {transformations.length ? transformations.map((transformation, index) => (
          <div key={index} className="mt-2 grid gap-2 sm:grid-cols-2">
            <label className={labelClass}>From<input aria-label={`Transformation ${index + 1} from`} maxLength={80} className={inputClass} value={transformation.from} onChange={(event) => updateTransformation(index, { from: event.target.value })} /></label>
            <label className={labelClass}>To<input aria-label={`Transformation ${index + 1} to`} maxLength={80} className={inputClass} value={transformation.to} onChange={(event) => updateTransformation(index, { to: event.target.value })} /></label>
            <label className={labelClass}>Explanation<input aria-label={`Transformation ${index + 1} explanation`} maxLength={300} className={inputClass} value={transformation.explanation} onChange={(event) => updateTransformation(index, { explanation: event.target.value })} /></label>
            <label className={labelClass}>Evidence reference (optional)<input aria-label={`Transformation ${index + 1} evidence reference`} maxLength={500} className={inputClass} value={transformation.evidenceReference} onChange={(event) => updateTransformation(index, { evidenceReference: event.target.value })} /></label>
            <div data-testid="single-word-transformation-unverified" className="flex flex-wrap items-center gap-2 text-xs text-[#d5c28f] sm:col-span-2">
              <span>User-declared, unverified; this transformation is recorded and never applied to make the spelling match.</span>
              <button type="button" aria-label={`Remove transformation ${index + 1}`} className="underline" onClick={() => setTransformations((current) => current.filter((_, at) => at !== index))}>Remove</button>
            </div>
          </div>
        )) : <p className="mt-2 text-xs text-[#9fb1bf]">None declared.</p>}
      </div>

      <section
        aria-label="Mechanical replay"
        data-testid="single-word-mechanical-replay"
        className="mt-4 rounded-lg border border-[#53604a] bg-[#0d1117] p-3"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#dce9ca]">Mechanical replay</h3>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-[#aeb7c5]">
              This separately replays only the exact edits you declare at zero-based Unicode code-point positions. It does not verify meaning, morphology, etymology, pronunciation, or a source relationship.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="single-word-examine-interpretation"
              className="rounded border border-[#82985d] bg-[#26311d] px-3 py-1.5 text-xs font-semibold text-[#f0f5e7]"
              onClick={examineMechanicalDraft}
            >
              Examine Interpretation
            </button>
            <button
              type="button"
              data-testid="single-word-clear-interpretation"
              className="rounded border border-[#53604a] px-3 py-1.5 text-xs text-[#dce9ca]"
              onClick={clearInterpretation}
            >
              Clear / reset interpretation
            </button>
          </div>
        </div>

        <div className="mt-3 rounded border border-[#303843] bg-[#10131d] p-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold text-[#dce9ca]">Explicit ordered mechanical operations</div>
            <button
              type="button"
              data-testid="single-word-add-mechanical-operation"
              className="rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={mechanicalOperations.length >= 8}
              onClick={() => setMechanicalOperations((current) => [...current, blankMechanicalOperation()])}
            >
              Add mechanical operation
            </button>
          </div>
          <p className="mt-1 text-[11px] leading-4 text-[#9fb1bf]">
            Position is measured in Unicode code points of the current intermediate spelling. Expected text must match exactly; a rejected edit stops the remaining sequence.
          </p>
          {mechanicalOperations.length ? mechanicalOperations.map((operation, index) => (
            <fieldset key={index} data-testid="single-word-mechanical-operation" className="mt-2 rounded border border-[#354234] p-2">
              <legend className="px-1 text-[11px] font-semibold text-[#dce9ca]">Operation {index + 1}</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <label className={labelClass}>
                  Operation type
                  <select
                    aria-label={`Mechanical operation ${index + 1} type`}
                    className={inputClass}
                    value={operation.kind}
                    onChange={(event) => {
                      const kind = event.target.value as MechanicalEditKindV0_1;
                      updateMechanicalOperation(index, {
                        kind,
                        expectedText: kind === "INSERT" ? "" : operation.expectedText,
                        replacementText: kind === "OMIT" ? "" : operation.replacementText,
                      });
                    }}
                  >
                    <option value="INSERT">Insert</option>
                    <option value="OMIT">Omit</option>
                    <option value="SUBSTITUTE">Substitute</option>
                  </select>
                </label>
                <label className={labelClass}>
                  Zero-based position
                  <input
                    aria-label={`Mechanical operation ${index + 1} position`}
                    type="number"
                    min={0}
                    step={1}
                    inputMode="numeric"
                    className={inputClass}
                    value={operation.position}
                    onChange={(event) => updateMechanicalOperation(index, {
                      position: event.target.value === "" ? "" : Number(event.target.value),
                    })}
                  />
                </label>
                {operation.kind !== "INSERT" ? (
                  <label className={labelClass}>
                    Exact expected text
                    <input
                      aria-label={`Mechanical operation ${index + 1} expected text`}
                      maxLength={80}
                      className={inputClass}
                      value={operation.expectedText}
                      onChange={(event) => updateMechanicalOperation(index, { expectedText: event.target.value })}
                    />
                  </label>
                ) : null}
                {operation.kind !== "OMIT" ? (
                  <label className={labelClass}>
                    Replacement text
                    <input
                      aria-label={`Mechanical operation ${index + 1} replacement text`}
                      maxLength={80}
                      className={inputClass}
                      value={operation.replacementText}
                      onChange={(event) => updateMechanicalOperation(index, { replacementText: event.target.value })}
                    />
                  </label>
                ) : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <button type="button" aria-label={`Move mechanical operation ${index + 1} up`} disabled={index === 0} className="underline disabled:opacity-40" onClick={() => moveMechanicalOperation(index, -1)}>Move up</button>
                <button type="button" aria-label={`Move mechanical operation ${index + 1} down`} disabled={index === mechanicalOperations.length - 1} className="underline disabled:opacity-40" onClick={() => moveMechanicalOperation(index, 1)}>Move down</button>
                <button type="button" aria-label={`Remove mechanical operation ${index + 1}`} className="underline text-[#f0c5b8]" onClick={() => setMechanicalOperations((current) => current.filter((_, at) => at !== index))}>Remove</button>
                <span className="text-[#d5c28f]">USER_DECLARED_UNVERIFIED · never treated as linguistic evidence</span>
              </div>
            </fieldset>
          )) : <p className="mt-2 text-xs text-[#9fb1bf]">No mechanical edits declared; Examine will compare the exact component concatenation as entered.</p>}
        </div>

        <div aria-live="polite" className="mt-3 rounded border border-[#303843] bg-[#10131d] p-3 text-xs leading-5 text-[#d7dde7]">
          {mechanicalResultIsStale ? (
            <p data-testid="single-word-mechanical-result-stale" className="mb-2 rounded border border-[#746541] bg-[#18140e] p-2 text-[#f0ddb0]">
              STALE — interpretation inputs changed after the last examination. The previous replay is hidden; examine the current draft to see a new result.
            </p>
          ) : null}
          {currentMechanicalResult ? (
            <div data-testid="single-word-mechanical-result" data-status={currentMechanicalResult.status}>
              <div><strong>Status:</strong> {currentMechanicalResult.status}</div>
              <div><strong>Exact target, unchanged:</strong> <span className="font-mono">{currentMechanicalResult.targetWord}</span></div>
              <div><strong>Raw component concatenation:</strong> <span className="font-mono">{currentMechanicalResult.rawConcatenation || "∅"}</span></div>
              <div><strong>Last valid intermediate:</strong> <span className="font-mono">{currentMechanicalResult.lastValidIntermediate || "∅"}</span></div>
              {currentMechanicalResult.status === "EXAMINED" ? (
                <>
                  <div><strong>Final mechanical spelling:</strong> <span className="font-mono">{currentMechanicalResult.finalMechanicalSpelling}</span></div>
                  <div><strong>Exact comparison:</strong> {currentMechanicalResult.exactComparison}</div>
                  <div><strong>NFC equivalence (separate from exact spelling):</strong> {currentMechanicalResult.nfcEquivalent === null ? "NOT_COMPUTED" : currentMechanicalResult.nfcEquivalent ? "YES" : "NO"}</div>
                </>
              ) : (
                <div className="text-[#f0ddb0]">No final mechanical spelling was produced. Review rejected operations before examining again.</div>
              )}
              {currentMechanicalResult.operationResults.length ? (
                <ol data-testid="single-word-mechanical-operation-ledger" className="mt-2 list-inside list-decimal space-y-1">
                  {currentMechanicalResult.operationResults.map((operation, index) => (
                    <li key={index}>
                      <span className="font-semibold">{operation.kind} @ {operation.position ?? "invalid"}: {operation.status}</span>
                      {operation.intermediateBefore !== null ? <span className="font-mono"> · {operation.intermediateBefore} → {operation.intermediateAfter ?? "not applied"}</span> : null}
                      {operation.reasonCodes.length ? <span> · {operation.reasonCodes.join(", ")}</span> : null}
                    </li>
                  ))}
                </ol>
              ) : null}
              {currentMechanicalResult.reasonCodes.length ? <div className="mt-2 text-[#f0ddb0]">Reason codes: {currentMechanicalResult.reasonCodes.join(", ")}</div> : null}
              {currentMechanicalResult.warnings.length ? (
                <ul data-testid="single-word-mechanical-warnings" className="mt-2 list-inside list-disc text-[#f0ddb0]">
                  {currentMechanicalResult.warnings.map((item, index) => <li key={`${item.code}:${index}`}>{item.code}: {item.message}</li>)}
                </ul>
              ) : <p className="mt-2 text-[#9fb1bf]">No digraph or Unicode warnings reported.</p>}
              <p className="mt-2 border-t border-[#303843] pt-2 text-[#d5c28f]">
                Mechanical spelling replay only · {currentMechanicalResult.authority} · linguistic validity {currentMechanicalResult.linguisticValidity}. This result does not establish a source fact, component meaning, derivation, historical origin, spoken Voice path, or functional operation.
              </p>
            </div>
          ) : (
            <div data-testid="single-word-mechanical-result" data-status="NOT_SUBMITTED">
              <div><strong>Status:</strong> {notSubmittedResult.status}</div>
              <div><strong>Exact target:</strong> <span className="font-mono">{notSubmittedResult.targetWord}</span></div>
              <div><strong>Current raw component concatenation:</strong> <span className="font-mono">{notSubmittedResult.rawConcatenation || "∅"}</span></div>
              <p className="mt-1 text-[#9fb1bf]">No mechanical interpretation has been submitted for examination. This is not a linguistic conclusion.</p>
            </div>
          )}
        </div>
      </section>

      <div className="mt-4" aria-live="polite">
        {result.status === "INVALID" ? (
          <div data-testid="single-word-proposal-incomplete" className="rounded border border-[#584c34] bg-[#18140e] p-3 text-xs leading-5 text-[#f0ddb0]">
            <p className="font-semibold">Correct these fields to see the proposal:</p>
            <ul data-testid="single-word-validation-messages" className="mt-1 list-inside list-disc">
              {result.reasonCodes.map((reasonCode) => (
                <li key={reasonCode}>{validationMessageForReasonCode(reasonCode)}</li>
              ))}
            </ul>
          </div>
        ) : (
          <article data-testid="single-word-proposal-result" className="rounded-lg border border-[#53604a] bg-[#111710] p-3 text-sm leading-6 text-[#d7dde7]">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="font-mono text-base text-white">{result.proposal.target.exactWord}</strong>
              <span>{result.proposal.target.language}{result.proposal.target.dialect ? ` · ${result.proposal.target.dialect}` : ""}</span>
              <span className="rounded-full border border-[#746541] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#f0ddb0]">PROPOSED</span>
            </div>
            <div className="mt-2 font-mono">{result.proposal.segments.map((segment) => segment.exactSpelling).join(" + ")} → {result.proposal.reconstruction.exactConcatenation}</div>
            <div>Target spelling: <span className="font-mono">{result.proposal.reconstruction.targetSpelling}</span> · {result.proposal.reconstruction.formComparison}</div>
            <div className="mt-2 space-y-1">
              {result.proposal.segments.map((segment, index) => (
                <div key={`${index}:${segment.exactSpelling}`} data-testid="single-word-proposal-segment">
                  <span className="font-mono">{segment.exactSpelling}</span> — {segment.proposedMeaning ?? "meaning Unknown / Null"} · role {segment.proposedGrammaticalRole ?? "Unknown / Null"} · {segment.language}{segment.dialect ? ` (${segment.dialect})` : ""} · {evidenceStatusLabel(segment.evidence.status)}{segment.evidence.sourceReference ? ` · ${segment.evidence.sourceReference}` : ""}
                  {segment.unresolved ? " · not yet explained" : ""}
                  {segment.evidence.status === "CITATION_ENTERED_UNVERIFIED" ? " · citation entered by user; not independently verified" : ""}
                </div>
              ))}
            </div>
            {result.proposal.unresolvedConnectingMaterial ? <div className="mt-2">Unexplained connecting material: {result.proposal.unresolvedConnectingMaterial}</div> : null}
            {result.proposal.declaredTransformations.map((transformation, index) => (
              <div key={index} className="mt-1 text-[#d5c28f]">
                Declared transform {transformation.from} → {transformation.to}: user-declared and unverified; not applied.
              </div>
            ))}
            <div className="mt-2"><strong>Functional motivation:</strong> {result.proposal.functionalMotivation.explanation} · {transparencyLabel(result.proposal.functionalMotivation.transparency)}</div>
            <div className="mt-1">Strict embryo meaning: <strong>Unknown / Null</strong> · compound attestation: not claimed · historical origin: not claimed.</div>
            <div className="mt-2 rounded border border-[#303843] bg-[#0b0f0c] p-2">
              <div className="font-semibold">Written Seven-Voices events</div>
              <div className="font-mono">{result.proposal.writtenStructure.status === "COMPLETE" ? result.proposal.writtenStructure.voicePath.join(" → ") || "∅" : "Unknown / Null"}</div>
              <div className="text-xs text-[#9fb1bf]">
                {result.proposal.writtenStructure.status === "COMPLETE"
                  ? `${result.proposal.writtenStructure.eventCount} events retained in order; source code-point positions ${result.proposal.writtenStructure.voiceEvents.map((event) => event.sourcePosition).join(", ") || "none"}.`
                  : `Structure unavailable: ${result.proposal.writtenStructure.reasonCode ?? "unknown"}.`}
                {" "}Orthographic only; pronunciation authority not established.
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
