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
import { FjaloriCrossSourceEvidenceV0_1 } from "@/ui/instrument/sections/FjaloriCrossSourceEvidence.v0_1";

type DraftSegment = SingleWordFunctionalMotivationSegmentInputV0_1;
type DraftTransformation = SingleWordFunctionalMotivationTransformationInputV0_1;
type SelectedComponentSourceLookupV0_1 = Readonly<{ componentIndex: number; exactSpelling: string }>;

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
}: {
  initialTargetWord: string;
}) {
  const [targetWord, setTargetWord] = useState(initialTargetWord);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [targetDialect, setTargetDialect] = useState("");
  const [segments, setSegments] = useState<DraftSegment[]>([blankSegment(), blankSegment()]);
  const [selectedComponentSource, setSelectedComponentSource] = useState<SelectedComponentSourceLookupV0_1 | null>(null);
  const [unresolvedConnectingMaterial, setUnresolvedConnectingMaterial] = useState("");
  const [transformations, setTransformations] = useState<DraftTransformation[]>([]);
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
                  {segment.unresolved ? "UNKNOWN_OR_NULL" : segment.proposedMeaning || "UNKNOWN_OR_NULL"}.
                  This Albanian form lookup does not verify that meaning, the recorded language/dialect, or an exact sense alignment.
                </p>
                <p className="mt-1 text-xs text-[#aeb4ce]">
                  <strong>Recorded language/dialect (as entered):</strong>{" "}
                  {segment.language || "UNKNOWN_OR_NULL"}{segment.dialect ? " · " + segment.dialect : ""}.
                </p>
                <FjaloriCrossSourceEvidenceV0_1
                  key={selectedComponentSource.componentIndex + ":" + selectedComponentSource.exactSpelling}
                  word={selectedComponentSource.exactSpelling}
                  context="component"
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
