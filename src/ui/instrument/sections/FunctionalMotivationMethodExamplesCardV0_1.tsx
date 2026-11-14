"use client";

import { useState } from "react";
import {
  getFunctionalMotivationMethodExampleV0_1,
  type FunctionalMotivationMethodExampleIdV0_1,
  type FunctionalMotivationMethodExampleVMV0_1,
} from "@/ui/instrument/sections/functionalMotivationMethodExamplesAdapter.v0_1";

const panelClass = "min-w-0 rounded-lg border border-[#303a45] bg-[#0d1117] p-3";
const labelClass = "text-[11px] font-semibold uppercase tracking-wide text-[#9fb1bf]";

function MethodExampleDetails({ example }: { example: FunctionalMotivationMethodExampleVMV0_1 }) {
  return (
    <article data-testid="functional-method-example-details" className="mt-3 min-w-0 space-y-3 text-sm leading-6 text-[#d7dde7]">
      <header className={panelClass}>
        <h3 className="text-base font-semibold text-white">{example.title}</h3>
        <p className="mt-1 break-words text-xs text-[#aeb7c5]">{example.summary}</p>
      </header>

      <section className={panelClass} aria-label="Target forms and written structure">
        <h4 className={labelClass}>Whole word and written structure</h4>
        <div className="mt-2 space-y-3">
          {example.forms.map((form) => (
            <div key={`${form.language}:${form.exactSpelling}`} className="min-w-0 border-t border-[#303a45] pt-2 first:border-0 first:pt-0">
              <p className="break-words">
                <strong className="font-mono text-white">{form.exactSpelling}</strong>
                {" · "}{form.language}{form.variety ? ` · ${form.variety}` : ""}{" · "}{form.grammaticalCategory}
              </p>
              <p className="mt-1 break-words"><strong>Selected sense:</strong> {form.selectedSense}</p>
              <p className="mt-1 break-words font-mono text-xs" data-testid={`functional-method-code-points-${example.id}`}>
                Code points: {form.codePoints.join(" · ")}
              </p>
              <p className="break-words font-mono text-xs" data-testid={`functional-method-written-voices-${form.exactSpelling}`}>
                Written Voices: {form.writtenVoices.join(" → ") || "∅"}
              </p>
              <p className="break-words text-xs text-[#b9c6d4]">Evidence status: {form.evidenceStatus}. Orthographic representation; pronunciation authority is not established.</p>
            </div>
          ))}
        </div>
      </section>

      {example.components.length > 0 ? (
        <section className={panelClass} aria-label="Proposed components">
          <h4 className={labelClass}>Component contributions</h4>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            {example.components.map((component, index) => (
              <li key={`${component.spelling}:${index}`} className="break-words" data-testid="functional-method-component">
                <span className="font-mono text-white">{component.spelling}</span>
                {component.span ? ` · code-point span [${component.span.start},${component.span.end})` : ""}
                {` — ${component.function} · ${component.claimLayer} · ${component.status}`}
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <p className={panelClass} data-testid="functional-method-no-components">
          No component decomposition is proposed for English STUDY.
        </p>
      )}

      <section className={panelClass} aria-label="Functional reading and reconstruction">
        <h4 className={labelClass}>Functional reading</h4>
        <p className="mt-2 break-words" data-testid="functional-method-reading">
          {example.functionalReading.text}
          {" · "}<strong>{example.functionalReading.claimLayer}</strong>
          {" · "}{example.functionalReading.status}
        </p>
        <h4 className={`${labelClass} mt-3`}>Spelling reconstruction</h4>
        <p className="mt-1 break-words" data-testid="functional-method-reconstruction">
          <span className="font-mono">{example.reconstruction.text}</span>
          {" · "}<strong>{example.reconstruction.status}</strong>
        </p>
        <p className="mt-1 break-words text-xs text-[#aeb7c5]">{example.reconstruction.note}</p>
      </section>

      <section className={panelClass} aria-label="Declared mechanical operations">
        <h4 className={labelClass}>Declared operation ledger</h4>
        {example.operations.length === 0 ? (
          <p className="mt-2 break-words" data-testid="functional-method-no-operations">
            No mechanical correspondence is asserted for this comparison.
          </p>
        ) : example.operations.map((operation, index) => (
          <div key={`${operation.operationId}:${index}`} className="mt-2 space-y-1 break-words" data-testid="functional-method-operation">
            <p className="font-mono text-white">{operation.before} → {operation.after}</p>
            <p>
              {operation.kind} ({operation.operationId}) · {operation.operationCount} operation · cost {operation.cost} · {operation.mechanicalStatus}
            </p>
            {operation.position !== null ? (
              <p>
                Position {operation.position} ({operation.positionUnit})
                {operation.removedSpan ? ` · removed span [${operation.removedSpan.start},${operation.removedSpan.end})` : ""}
                {operation.removedText ? ` · exact removed text “${operation.removedText}”` : ""}
              </p>
            ) : null}
            <p className="font-mono text-xs">Voices before: {operation.voicesBefore.join(" → ") || "∅"}</p>
            <p className="font-mono text-xs">Voices after: {operation.voicesAfter.join(" → ") || "∅"}</p>
            {operation.omittedVoices.length > 0 ? (
              <p className="font-mono text-xs" data-testid="functional-method-omitted-voices">
                Omitted Voice events retained in the ledger: {operation.omittedVoices.join(" · ")}
              </p>
            ) : null}
            <p>
              Inverse replay: {operation.inverseForm ?? "Unknown / Null"} · {operation.inverseStatus}
            </p>
            <p className="text-xs text-[#b9c6d4]">
              Authority {operation.authority} · evidence {operation.evidenceStatus} · linguistic applicability {operation.linguisticApplicability}
            </p>
          </div>
        ))}
      </section>

      {example.alternatives.length > 0 ? (
        <section className={panelClass} aria-label="Alternative interpretations">
          <h4 className={labelClass}>Alternative interpretations and excluded senses</h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {example.alternatives.map((alternative, index) => (
              <li key={`${alternative.text}:${index}`} className="break-words" data-testid="functional-method-alternative">
                {alternative.text} · {alternative.claimLayer} · {alternative.status}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {example.contrasts.length > 0 ? (
        <section className={panelClass} aria-label="Family or spelling contrasts">
          <h4 className={labelClass}>Contrasts</h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {example.contrasts.map((contrast, index) => (
              <li key={`${contrast.text}:${index}`} className="break-words" data-testid="functional-method-contrast">
                {contrast.text} · {contrast.claimLayer} · {contrast.status}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {example.unresolved.length > 0 ? (
        <section className={panelClass} aria-label="Open questions">
          <h4 className={labelClass}>Open questions · UNKNOWN_OR_NULL</h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {example.unresolved.map((claim) => <li key={claim} className="break-words">{claim}</li>)}
          </ul>
        </section>
      ) : null}

      <section className={panelClass} aria-label="Method boundaries and provenance">
        <h4 className={labelClass}>Method boundaries and provenance</h4>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {example.notes.map((note) => <li key={note} className="break-words">{note}</li>)}
        </ul>
        {example.sources.length > 0 ? (
          <div className="mt-3 border-t border-[#303a45] pt-2">
            <h5 className="text-xs font-semibold text-white">Source references</h5>
            <ul className="mt-1 space-y-2">
              {example.sources.map((source) => (
                <li key={source.url} className="min-w-0 break-words text-xs">
                  <a className="break-all text-[#a9d2ff] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]" href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                  <span className="block break-words text-[#aeb7c5]">{source.locator}</span>
                  <span className="block text-[#aeb7c5]">{source.citationStatus} · licensing {source.licensingStatus}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="mt-3 border-t border-[#303a45] pt-2 text-xs text-[#d5c28f]">
          These are read-only research examples. They do not fill or change the current proposal; alternatives may coexist, and interpretation remains with the user.
        </p>
      </section>
    </article>
  );
}

export function FunctionalMotivationMethodExamplesCardV0_1() {
  const [selectedId, setSelectedId] = useState<FunctionalMotivationMethodExampleIdV0_1 | "">("");
  const example = getFunctionalMotivationMethodExampleV0_1(selectedId);

  return (
    <section
      aria-label="Functional motivation method examples"
      data-testid="functional-method-examples-card"
      className="mt-4 min-w-0 rounded-[12px] border border-[#35516a] bg-[#10161e] p-4"
    >
      <h3 className="text-sm font-semibold text-white">How a functional reading is built</h3>
      <p id="functional-method-examples-help" className="mt-1 max-w-3xl break-words text-xs leading-5 text-[#aeb7c5]">
        Inspect the source meaning, proposed components, exact spelling operations, written Voices, alternatives and claims without a supported answer in these existing research examples.
      </p>
      <label htmlFor="functional-method-example-select" className="mt-3 block text-xs font-medium text-[#c5ced8]">
        Choose a read-only method example
      </label>
      <select
        id="functional-method-example-select"
        aria-describedby="functional-method-examples-help"
        aria-label="Choose a read-only method example"
        data-testid="functional-method-example-selector"
        className="mt-1 min-h-10 w-full min-w-0 rounded border border-[#46505c] bg-[#0d1117] px-2 py-2 text-sm text-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]"
        value={selectedId}
        onChange={(event) => setSelectedId(event.target.value as FunctionalMotivationMethodExampleIdV0_1 | "")}
      >
        <option value="">Select an example</option>
        <option value="STUDIM">STUDIM · proposed two-root reading</option>
        <option value="STUDY">STUDY · selected-sense comparison</option>
        <option value="GJITHÇKA">GJITHÇKA · boundary omission example</option>
      </select>
      <div aria-live="polite">
        {example ? <MethodExampleDetails example={example} /> : (
          <p className="mt-3 rounded border border-[#303a45] bg-[#0d1117] p-3 text-xs leading-5 text-[#aeb7c5]" data-testid="functional-method-example-empty">
            No example is selected. The examples are not defaults for the current word or interpretation.
          </p>
        )}
      </div>
    </section>
  );
}
