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

type DraftSegment = SingleWordFunctionalMotivationSegmentInputV0_1;
type DraftTransformation = SingleWordFunctionalMotivationTransformationInputV0_1;

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

export function SingleWordMotivationWorkbenchV0_1({
  initialTargetWord,
}: {
  initialTargetWord: string;
}) {
  const [targetWord, setTargetWord] = useState(initialTargetWord);
  const [targetLanguage, setTargetLanguage] = useState("");
  const [targetDialect, setTargetDialect] = useState("");
  const [segments, setSegments] = useState<DraftSegment[]>([blankSegment(), blankSegment()]);
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
    setSegments((current) => current.map((segment, at) => at === index ? { ...segment, ...update } : segment));
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

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          Exact target word
          <input aria-label="Exact target word" className={inputClass} value={targetWord} onChange={(event) => setTargetWord(event.target.value)} />
        </label>
        <label className={labelClass}>
          Target language
          <input aria-label="Target language" className={inputClass} value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)} placeholder="Language or code" />
        </label>
        <label className={labelClass}>
          Target dialect (optional)
          <input aria-label="Target dialect" className={inputClass} value={targetDialect} onChange={(event) => setTargetDialect(event.target.value)} placeholder="Unknown / not specified" />
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {segments.map((segment, index) => (
          <fieldset key={index} className="rounded-lg border border-[#354234] bg-[#0d1117] p-3">
            <legend className="px-1 text-xs font-semibold text-[#dce9ca]">Component {index + 1}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Exact component spelling
                <input aria-label={`Component ${index + 1} exact spelling`} className={inputClass} value={segment.exactSpelling} onChange={(event) => updateSegment(index, { exactSpelling: event.target.value })} />
              </label>
              <label className={labelClass}>
                Proposed meaning
                <input aria-label={`Component ${index + 1} proposed meaning`} className={inputClass} value={segment.proposedMeaning} onChange={(event) => updateSegment(index, { proposedMeaning: event.target.value })} disabled={segment.unresolved} />
              </label>
              <label className={labelClass}>
                Proposed grammatical role
                <input aria-label={`Component ${index + 1} grammatical role`} className={inputClass} value={segment.proposedGrammaticalRole} onChange={(event) => updateSegment(index, { proposedGrammaticalRole: event.target.value })} disabled={segment.unresolved} />
              </label>
              <label className={labelClass}>
                Language
                <input aria-label={`Component ${index + 1} language`} className={inputClass} value={segment.language} onChange={(event) => updateSegment(index, { language: event.target.value })} />
              </label>
              <label className={labelClass}>
                Dialect (optional)
                <input aria-label={`Component ${index + 1} dialect`} className={inputClass} value={segment.dialect} onChange={(event) => updateSegment(index, { dialect: event.target.value })} />
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
                <input aria-label={`Component ${index + 1} evidence reference`} className={inputClass} value={segment.evidenceReference} onChange={(event) => updateSegment(index, { evidenceReference: event.target.value })} placeholder="URL, work and entry/sense locator, or leave blank" />
              </label>
              <label className="flex items-center gap-2 text-xs text-[#c5ced8] sm:col-span-2">
                <input aria-label={`Component ${index + 1} not yet explained`} type="checkbox" checked={segment.unresolved} onChange={(event) => updateSegment(index, { unresolved: event.target.checked })} />
                Component not yet explained
              </label>
            </div>
            {segments.length > 2 ? (
              <button type="button" className="mt-2 rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca]" onClick={() => setSegments((current) => current.filter((_, at) => at !== index))}>
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
          <textarea aria-label="Unexplained connecting material" className={inputClass} rows={2} value={unresolvedConnectingMaterial} onChange={(event) => setUnresolvedConnectingMaterial(event.target.value)} placeholder="Keep unexplained material explicit; do not repair it silently." />
        </label>
        <label className={labelClass}>
          Proposed functional explanation
          <textarea aria-label="Proposed functional explanation" className={inputClass} rows={2} value={functionalExplanation} onChange={(event) => setFunctionalExplanation(event.target.value)} placeholder="How might the proposed component meanings motivate the word's function?" />
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
            <label className={labelClass}>From<input aria-label={`Transformation ${index + 1} from`} className={inputClass} value={transformation.from} onChange={(event) => updateTransformation(index, { from: event.target.value })} /></label>
            <label className={labelClass}>To<input aria-label={`Transformation ${index + 1} to`} className={inputClass} value={transformation.to} onChange={(event) => updateTransformation(index, { to: event.target.value })} /></label>
            <label className={labelClass}>Explanation<input aria-label={`Transformation ${index + 1} explanation`} className={inputClass} value={transformation.explanation} onChange={(event) => updateTransformation(index, { explanation: event.target.value })} /></label>
            <label className={labelClass}>Evidence reference (optional)<input aria-label={`Transformation ${index + 1} evidence reference`} className={inputClass} value={transformation.evidenceReference} onChange={(event) => updateTransformation(index, { evidenceReference: event.target.value })} /></label>
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
          Complete a single target word and language, at least two ordered components, meanings and roles for interpreted components, and a proposed functional explanation. Orthographic Voice analysis supports words up to 80 Unicode code points.
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
