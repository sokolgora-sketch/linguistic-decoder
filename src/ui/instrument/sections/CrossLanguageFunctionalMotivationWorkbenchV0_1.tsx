"use client";

import { useMemo, useState } from "react";
import {
  buildCrossLanguageFunctionalMotivationV0_1,
  CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1,
  type CrossLanguageCorrespondenceInputV0_1,
  type CrossLanguageEvidenceStatusV0_1,
  type CrossLanguageBoundaryOperationWitnessInputV0_1,
  type CrossLanguageOperationApplicationInputV0_1,
  type CrossLanguageWitnessInputV0_1,
  type FunctionalArchitectureContributionInputV0_1,
  type FunctionalArchitectureInputV0_1,
  type FunctionalArchitectureParallelInputV0_1,
} from "@/shared/openInstrument/crossLanguageFunctionalMotivation.v0_1";
import type { GenericFunctionalWitnessV1 } from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import type { SingleWordFunctionalMotivationBuildResultV0_1 } from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";

const inputClass = "mt-1 w-full rounded border border-[#46505c] bg-[#0d1117] px-2 py-1.5 text-sm text-[#f5f7fb] placeholder:text-[#7f8b99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]";
const labelClass = "block text-xs font-medium text-[#c5ced8]";

function nextId(prefix: string, ids: readonly string[]): string {
  let suffix = ids.length + 1;
  while (ids.includes(`${prefix}-${suffix}`)) suffix += 1;
  return `${prefix}-${suffix}`;
}

function blankWitness(witnessId: string): CrossLanguageWitnessInputV0_1 {
  return {
    kind: "USER_PROPOSED",
    witnessId,
    exactForm: "",
    language: "",
    variety: "",
    proposedMeaning: "",
    evidenceStatus: "USER_PROPOSED",
    evidenceReference: "",
  };
}

function blankContribution(contributionId: string): FunctionalArchitectureContributionInputV0_1 {
  return {
    contributionId,
    exactForm: "",
    proposedMeaning: "",
    functionalRole: "",
    evidenceStatus: "USER_PROPOSED",
    evidenceReference: "",
  };
}

function blankArchitecture(architectureId: string, label: string): FunctionalArchitectureInputV0_1 {
  return {
    architectureId,
    label,
    language: "",
    exactForm: "",
    contributions: [blankContribution(`${architectureId}-contribution-1`)],
  };
}

function blankParallel(): FunctionalArchitectureParallelInputV0_1 {
  return {
    parallelId: "functional-parallel-1",
    architectures: [
      blankArchitecture("architecture-a", "Structure A"),
      blankArchitecture("architecture-b", "Structure B"),
    ],
    proposedSimilarity: "",
    differences: "",
    unresolvedMaterial: "",
  };
}

function blankBoundaryOperationWitness(targetForm: string, witnessId: string): CrossLanguageBoundaryOperationWitnessInputV0_1 {
  return {
    witnessId,
    targetForm,
    language: "",
    componentForms: [],
    rawConcatenation: "",
    boundaryAfterComponentIndex: 0,
    boundaryPosition: 0,
    affectedInputSpan: { start: 0, end: 0 },
    boundaryInput: "",
    boundaryOutput: "",
    declaredResultForm: "",
    linguisticRuleName: "",
    linguisticRuleAttribution: "",
    linguisticRuleReference: "",
    sourceReferences: [],
    evidenceStatus: "USER_PROPOSED",
    functionalInterpretation: "",
  };
}

function clearBoundaryDependentState(): Pick<
  CrossLanguageBoundaryOperationWitnessInputV0_1,
  | "boundaryPosition"
  | "affectedInputSpan"
  | "boundaryInput"
  | "boundaryOutput"
  | "declaredResultForm"
  | "linguisticRuleName"
  | "linguisticRuleAttribution"
  | "linguisticRuleReference"
  | "sourceReferences"
  | "evidenceStatus"
  | "functionalInterpretation"
> {
  return {
    boundaryPosition: 0,
    affectedInputSpan: { start: 0, end: 0 },
    boundaryInput: "",
    boundaryOutput: "",
    declaredResultForm: "",
    linguisticRuleName: "",
    linguisticRuleAttribution: "",
    linguisticRuleReference: "",
    sourceReferences: [],
    evidenceStatus: "UNKNOWN_OR_NULL",
    functionalInterpretation: "",
  };
}

function evidenceLabel(status: CrossLanguageEvidenceStatusV0_1 | "SOURCE_RECORD_ONLY"): string {
  switch (status) {
    case "SOURCE_RECORD_ONLY":
      return "source record only; functional correspondence not evaluated";
    case "USER_PROPOSED":
      return "user proposed; not independently verified";
    case "CITATION_ENTERED_UNVERIFIED":
      return "citation entered; not independently verified";
    case "UNKNOWN_OR_NULL":
      return "Unknown / Null";
  }
}

export function CrossLanguageFunctionalMotivationWorkbenchV0_1({
  parentProposal,
  sourceWitnesses = [],
}: {
  parentProposal: SingleWordFunctionalMotivationBuildResultV0_1;
  sourceWitnesses?: readonly GenericFunctionalWitnessV1[];
}) {
  const [targetSenseLabel, setTargetSenseLabel] = useState("");
  const [targetSenseEvidenceStatus, setTargetSenseEvidenceStatus] = useState<CrossLanguageEvidenceStatusV0_1>("UNKNOWN_OR_NULL");
  const [targetSenseReference, setTargetSenseReference] = useState("");
  const [witnesses, setWitnesses] = useState<CrossLanguageWitnessInputV0_1[]>([]);
  const [correspondences, setCorrespondences] = useState<CrossLanguageCorrespondenceInputV0_1[]>([]);
  const [proposedSynthesis, setProposedSynthesis] = useState("");
  const [unresolvedText, setUnresolvedText] = useState("");
  const [functionalParallel, setFunctionalParallel] = useState<FunctionalArchitectureParallelInputV0_1 | null>(null);
  const [boundaryOperationWitness, setBoundaryOperationWitness] = useState<CrossLanguageBoundaryOperationWitnessInputV0_1 | null>(null);

  const input = useMemo(() => ({
    targetSense: {
      label: targetSenseLabel,
      evidenceStatus: targetSenseEvidenceStatus,
      evidenceReference: targetSenseReference,
    },
    witnesses,
    correspondences,
    proposedSynthesis,
    unresolvedMaterial: unresolvedText.split("\n").map((item) => item.trim()).filter(Boolean),
    functionalParallel,
    sourceWitnesses,
    boundaryOperationWitness,
  }), [targetSenseLabel, targetSenseEvidenceStatus, targetSenseReference, witnesses, correspondences, proposedSynthesis, unresolvedText, functionalParallel, sourceWitnesses, boundaryOperationWitness]);
  const result = useMemo(
    () => buildCrossLanguageFunctionalMotivationV0_1(parentProposal, input),
    [parentProposal, input],
  );
  const parent = parentProposal.status === "READY" ? parentProposal.proposal : null;
  const hasCrossLanguageContent = witnesses.length > 0 || correspondences.length > 0 || boundaryOperationWitness !== null || Boolean(
    proposedSynthesis.trim() || targetSenseLabel.trim() || targetSenseReference.trim() || unresolvedText.trim() || functionalParallel,
  );

  function updateWitness(witnessId: string, update: Partial<CrossLanguageWitnessInputV0_1>) {
    setWitnesses((current) => current.map((witness) => witness.witnessId === witnessId
      ? { ...witness, ...update } as CrossLanguageWitnessInputV0_1
      : witness));
  }

  function addWitness() {
    setWitnesses((current) => [...current, blankWitness(nextId("witness", current.map((item) => item.witnessId)))]);
  }

  function addCorrespondence() {
    setCorrespondences((current) => [...current, {
      relationId: nextId("relation", current.map((item) => item.relationId)),
      targetComponentIndex: 0,
      witnessId: witnesses[0]?.witnessId ?? "",
      proposedRelationship: "",
      applications: [],
    }]);
  }

  function updateCorrespondence(relationId: string, update: Partial<CrossLanguageCorrespondenceInputV0_1>) {
    setCorrespondences((current) => current.map((item) => item.relationId === relationId ? { ...item, ...update } : item));
  }

  function updateApplication(
    relationId: string,
    applicationId: string,
    update: Partial<CrossLanguageOperationApplicationInputV0_1>,
  ) {
    setCorrespondences((current) => current.map((relation) => relation.relationId === relationId
      ? { ...relation, applications: relation.applications.map((application) => application.applicationId === applicationId ? { ...application, ...update } : application) }
      : relation));
  }

  function addApplication(relationId: string, operationId: CrossLanguageOperationApplicationInputV0_1["operationId"]) {
    setCorrespondences((current) => current.map((relation) => {
      if (relation.relationId !== relationId) return relation;
      const applicationId = nextId(`${relationId}-application`, relation.applications.map((item) => item.applicationId));
      const application: CrossLanguageOperationApplicationInputV0_1 = {
        applicationId,
        operationId,
        positions: operationId === "TRANSPOSE_ADJACENT.v0_1" ? [0, 1] : [],
      };
      return { ...relation, applications: [...relation.applications, application] };
    }));
  }

  function updateParallel(update: Partial<FunctionalArchitectureParallelInputV0_1>) {
    setFunctionalParallel((current) => current ? { ...current, ...update } : current);
  }

  function updateArchitecture(architectureId: string, update: Partial<FunctionalArchitectureInputV0_1>) {
    setFunctionalParallel((current) => current ? {
      ...current,
      architectures: current.architectures.map((architecture) => architecture.architectureId === architectureId
        ? { ...architecture, ...update }
        : architecture),
    } : current);
  }

  function updateContribution(architectureId: string, contributionId: string, update: Partial<FunctionalArchitectureContributionInputV0_1>) {
    setFunctionalParallel((current) => current ? {
      ...current,
      architectures: current.architectures.map((architecture) => architecture.architectureId === architectureId
        ? { ...architecture, contributions: architecture.contributions.map((contribution) => contribution.contributionId === contributionId ? { ...contribution, ...update } : contribution) }
        : architecture),
    } : current);
  }

  function addContribution(architectureId: string) {
    setFunctionalParallel((current) => current ? {
      ...current,
      architectures: current.architectures.map((architecture) => architecture.architectureId === architectureId
        ? { ...architecture, contributions: [...architecture.contributions, blankContribution(nextId(`${architectureId}-contribution`, architecture.contributions.map((item) => item.contributionId)))] }
        : architecture),
    } : current);
  }

  function updateBoundaryWitness(update: Partial<CrossLanguageBoundaryOperationWitnessInputV0_1>) {
    setBoundaryOperationWitness((current) => current ? { ...current, ...update } : current);
  }

  function updateBoundaryComponents(text: string) {
    const componentForms = text.split("\n");
    setBoundaryOperationWitness((current) => {
      if (!current || componentForms.join("\n") === current.componentForms.join("\n")) return current;
      return {
        ...current,
        ...clearBoundaryDependentState(),
        language: "",
        componentForms,
        rawConcatenation: componentForms.join(""),
        boundaryAfterComponentIndex: 0,
      };
    });
  }

  function updateBoundaryComponentBoundary(boundaryAfterComponentIndex: number) {
    setBoundaryOperationWitness((current) => {
      if (!current || !Number.isInteger(boundaryAfterComponentIndex) ||
        boundaryAfterComponentIndex < 0 || boundaryAfterComponentIndex >= current.componentForms.length - 1 ||
        boundaryAfterComponentIndex === current.boundaryAfterComponentIndex) return current;
      return {
        ...current,
        ...clearBoundaryDependentState(),
        boundaryAfterComponentIndex,
      };
    });
  }

  return (
    <section
      aria-label="Cross-language functional motivation"
      data-testid="cross-language-functional-motivation"
      className="mt-4 rounded-[12px] border border-[#53604a] bg-[#111710] p-4"
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#dce9ca]">Cross-language functional witnesses</h3>
      <p className="mt-1 max-w-4xl text-xs leading-5 text-[#aeb7c5]">
        A witness is a separate-language proposal or an existing source record. A replayed spelling operation does not establish morphology, cognacy, historical origin, or functional truth. Citations entered here remain unverified.
      </p>

      {!parent ? (
        <p className="mt-3 text-sm text-[#d5c28f]">Complete a valid target-language Single Word proposal before attaching witnesses.</p>
      ) : (
        <>
          <div data-testid="cross-language-target-components" className="mt-3 rounded border border-[#354234] bg-[#0d1117] p-3">
            <strong className="text-xs text-[#dce9ca]">Target components</strong>
            <p className="mt-1 font-mono text-sm">{parent.segments.map((segment) => segment.exactSpelling).join(" + ")}</p>
            <ol className="mt-2 list-inside list-decimal text-xs leading-5 text-[#c5ced8]">
              {parent.segments.map((segment, index) => (
                <li key={`${index}:${segment.exactSpelling}`}>
                  <span className="font-mono">{segment.exactSpelling}</span> · {segment.language}{segment.dialect ? ` (${segment.dialect})` : ""} · {segment.unresolved ? "meaning UNKNOWN_OR_NULL" : segment.proposedMeaning ?? "meaning UNKNOWN_OR_NULL"}
                </li>
              ))}
            </ol>
            {hasCrossLanguageContent ? <p className="mt-2 text-xs text-[#aeb7c5]">
              Target written Voices: <span className="font-mono">{parent.writtenStructure.status === "COMPLETE" ? parent.writtenStructure.voicePath.join(" → ") || "∅" : "UNKNOWN_OR_NULL"}</span>. Orthographic sequence is retained from the validated Single Word proposal.
            </p> : null}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              Target sense label (optional)
              <input aria-label="Cross-language target sense label" maxLength={300} className={inputClass} value={targetSenseLabel} onChange={(event) => setTargetSenseLabel(event.target.value)} />
            </label>
            <label className={labelClass}>
              Target sense evidence status
              <select aria-label="Cross-language target sense evidence status" className={inputClass} value={targetSenseEvidenceStatus} onChange={(event) => setTargetSenseEvidenceStatus(event.target.value as CrossLanguageEvidenceStatusV0_1)}>
                <option value="UNKNOWN_OR_NULL">Unknown / Null</option>
                <option value="USER_PROPOSED">User proposed</option>
                <option value="CITATION_ENTERED_UNVERIFIED">Citation entered; unverified</option>
              </select>
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Target sense citation or locator (unverified)
              <input aria-label="Cross-language target sense evidence reference" maxLength={500} className={inputClass} value={targetSenseReference} onChange={(event) => setTargetSenseReference(event.target.value)} />
            </label>
          </div>

          <div className="mt-4 rounded-lg border border-[#354234] bg-[#0d1117] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs text-[#dce9ca]">Foreign-language witnesses</strong>
              <button type="button" data-testid="cross-language-add-witness" className="rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca]" onClick={addWitness}>Add witness</button>
            </div>
            {!witnesses.length ? <p className="mt-2 text-xs text-[#9fb1bf]">No witness added. User proposals and existing generic source records stay distinct.</p> : null}
            {witnesses.map((witness, index) => (
              <fieldset key={witness.witnessId} className="mt-3 rounded border border-[#303843] p-3">
                <legend className="px-1 text-xs font-semibold">Witness {index + 1}</legend>
                <label className={labelClass}>
                  Witness source
                  <select
                    aria-label={`Witness ${index + 1} source type`}
                    className={inputClass}
                    value={witness.kind}
                    onChange={(event) => {
                      if (event.target.value === "EXISTING_GENERIC_SOURCE_WITNESS" && sourceWitnesses.length) {
                        updateWitness(witness.witnessId, {
                          kind: "EXISTING_GENERIC_SOURCE_WITNESS",
                          genericWitnessId: sourceWitnesses[0]!.witnessId,
                        });
                      } else {
                        updateWitness(witness.witnessId, blankWitness(witness.witnessId));
                      }
                    }}
                  >
                    <option value="USER_PROPOSED">User-proposed witness</option>
                    {sourceWitnesses.length ? <option value="EXISTING_GENERIC_SOURCE_WITNESS">Existing generic source record</option> : null}
                  </select>
                </label>
                {witness.kind === "EXISTING_GENERIC_SOURCE_WITNESS" ? (
                  <>
                    <label className={`${labelClass} mt-2`}>
                      Existing source record
                      <select aria-label={`Witness ${index + 1} existing source record`} className={inputClass} value={witness.genericWitnessId} onChange={(event) => updateWitness(witness.witnessId, { genericWitnessId: event.target.value })}>
                        {sourceWitnesses.map((source) => <option key={source.witnessId} value={source.witnessId}>{source.sourceForm} · {source.language} · {source.gloss} · {source.sourceId}</option>)}
                      </select>
                    </label>
                    <p className="mt-2 text-xs text-[#aeb7c5]">The selected record attests only its recorded source form/gloss. Its functional correspondence remains NOT_EVALUATED.</p>
                  </>
                ) : (
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <label className={labelClass}>Exact witness form<input aria-label={`Witness ${index + 1} exact form`} maxLength={80} className={inputClass} value={witness.exactForm} onChange={(event) => updateWitness(witness.witnessId, { exactForm: event.target.value })} /></label>
                    <label className={labelClass}>Language<input aria-label={`Witness ${index + 1} language`} maxLength={100} className={inputClass} value={witness.language} onChange={(event) => updateWitness(witness.witnessId, { language: event.target.value })} /></label>
                    <label className={labelClass}>Variety (optional)<input aria-label={`Witness ${index + 1} variety`} maxLength={100} className={inputClass} value={witness.variety} onChange={(event) => updateWitness(witness.witnessId, { variety: event.target.value })} /></label>
                    <label className={labelClass}>Proposed meaning<input aria-label={`Witness ${index + 1} proposed meaning`} maxLength={300} className={inputClass} value={witness.proposedMeaning} onChange={(event) => updateWitness(witness.witnessId, { proposedMeaning: event.target.value })} /></label>
                    <label className={labelClass}>Evidence status<select aria-label={`Witness ${index + 1} evidence status`} className={inputClass} value={witness.evidenceStatus} onChange={(event) => updateWitness(witness.witnessId, { evidenceStatus: event.target.value as CrossLanguageEvidenceStatusV0_1 })}><option value="USER_PROPOSED">User proposed</option><option value="CITATION_ENTERED_UNVERIFIED">Citation entered; unverified</option><option value="UNKNOWN_OR_NULL">Unknown / Null</option></select></label>
                    <label className={labelClass}>Citation / locator<input aria-label={`Witness ${index + 1} citation`} maxLength={500} className={inputClass} value={witness.evidenceReference} onChange={(event) => updateWitness(witness.witnessId, { evidenceReference: event.target.value })} /></label>
                  </div>
                )}
                <button type="button" aria-label={`Remove witness ${index + 1}`} className="mt-2 text-xs underline" onClick={() => setWitnesses((current) => current.filter((item) => item.witnessId !== witness.witnessId))}>Remove witness</button>
              </fieldset>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[#354234] bg-[#0d1117] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs text-[#dce9ca]">Component-to-witness correspondence ledger</strong>
              <button type="button" data-testid="cross-language-add-correspondence" className="rounded border border-[#53604a] px-2 py-1 text-xs text-[#dce9ca]" onClick={addCorrespondence}>Add correspondence</button>
            </div>
            {!correspondences.length ? <p className="mt-2 text-xs text-[#9fb1bf]">No spelling correspondence entered.</p> : null}
            {correspondences.map((relation, index) => (
              <fieldset key={relation.relationId} data-testid="cross-language-correspondence-editor" className="mt-3 rounded border border-[#303843] p-3">
                <legend className="px-1 text-xs font-semibold">Correspondence {index + 1}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className={labelClass}>Target component<select aria-label={`Correspondence ${index + 1} target component`} className={inputClass} value={String(relation.targetComponentIndex)} onChange={(event) => updateCorrespondence(relation.relationId, { targetComponentIndex: Number(event.target.value) })}>{parent.segments.map((segment, segmentIndex) => <option key={segmentIndex} value={segmentIndex}>{segment.exactSpelling} · {segment.language}</option>)}</select></label>
                  <label className={labelClass}>Witness<select aria-label={`Correspondence ${index + 1} witness`} className={inputClass} value={relation.witnessId} onChange={(event) => updateCorrespondence(relation.relationId, { witnessId: event.target.value })}><option value="">Select a witness</option>{witnesses.map((witness) => <option key={witness.witnessId} value={witness.witnessId}>{witness.witnessId} · {witness.kind === "USER_PROPOSED" ? witness.exactForm || "incomplete form" : (sourceWitnesses.find((source) => source.witnessId === witness.genericWitnessId)?.sourceForm ?? "source witness")}</option>)}</select></label>
                  <label className={`${labelClass} sm:col-span-2`}>Proposed functional relationship<input aria-label={`Correspondence ${index + 1} proposed relationship`} maxLength={500} className={inputClass} value={relation.proposedRelationship} onChange={(event) => updateCorrespondence(relation.relationId, { proposedRelationship: event.target.value })} placeholder="Functional witness by analogy; no historical relation claimed" /></label>
                </div>
                <div className="mt-3 rounded border border-[#354234] p-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold">Reusable operation applications</span>
                    <div className="flex gap-2">
                      {CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1.map((definition) => (
                        <button key={definition.operationId} type="button" aria-label={`Correspondence ${index + 1} add ${definition.kind}`} className="rounded border border-[#53604a] px-2 py-1 text-[11px]" onClick={() => addApplication(relation.relationId, definition.operationId)}>Add {definition.kind}</button>
                      ))}
                    </div>
                  </div>
                  {relation.applications.map((application, applicationIndex) => (
                    <div key={application.applicationId} className="mt-2 grid gap-2 sm:grid-cols-2">
                      <label className={labelClass}>Operation {applicationIndex + 1}<select aria-label={`Correspondence ${index + 1} operation ${applicationIndex + 1}`} className={inputClass} value={application.operationId} onChange={(event) => updateApplication(relation.relationId, application.applicationId, { operationId: event.target.value as CrossLanguageOperationApplicationInputV0_1["operationId"], positions: event.target.value === "IDENTITY.v0_1" ? [] : [0, 1] })}>{CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1.map((definition) => <option key={definition.operationId} value={definition.operationId}>{definition.kind} · cost {definition.cost}</option>)}</select></label>
                      {application.operationId === "TRANSPOSE_ADJACENT.v0_1" ? (
                        <label className={labelClass}>Left zero-based code-point position<input aria-label={`Correspondence ${index + 1} operation ${applicationIndex + 1} left position`} type="number" min={0} className={inputClass} value={application.positions[0] ?? ""} onChange={(event) => {
                          const left = event.target.value === "" ? Number.NaN : Number(event.target.value);
                          updateApplication(relation.relationId, application.applicationId, { positions: [left, left + 1] });
                        }} /><span className="mt-1 block text-[11px] text-[#9fb1bf]">The next code point is the right position; both positions are recorded.</span></label>
                      ) : <p className="self-end text-[11px] text-[#9fb1bf]">Identity has no position parameter and cost 0.</p>}
                      <button type="button" aria-label={`Correspondence ${index + 1} remove operation ${applicationIndex + 1}`} className="text-left text-xs underline sm:col-span-2" onClick={() => updateCorrespondence(relation.relationId, { applications: relation.applications.filter((item) => item.applicationId !== application.applicationId) })}>Remove application</button>
                    </div>
                  ))}
                </div>
                <button type="button" aria-label={`Remove correspondence ${index + 1}`} className="mt-2 text-xs underline" onClick={() => setCorrespondences((current) => current.filter((item) => item.relationId !== relation.relationId))}>Remove correspondence</button>
              </fieldset>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            <label className={labelClass}>User-proposed whole-word functional synthesis<textarea aria-label="Cross-language proposed synthesis" maxLength={1000} className={inputClass} rows={2} value={proposedSynthesis} onChange={(event) => setProposedSynthesis(event.target.value)} placeholder="A conditional, exploratory explanation of the target word's function" /></label>
            <label className={labelClass}>Unresolved material (one note per line)<textarea aria-label="Cross-language unresolved material" maxLength={10000} className={inputClass} rows={2} value={unresolvedText} onChange={(event) => setUnresolvedText(event.target.value)} /></label>
          </div>

          <div className="mt-4 rounded-lg border border-[#354234] bg-[#0d1117] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs text-[#dce9ca]">Optional functional-architecture parallel</strong>
              {functionalParallel ? <button type="button" data-testid="cross-language-remove-parallel" className="rounded border border-[#53604a] px-2 py-1 text-xs" onClick={() => setFunctionalParallel(null)}>Remove parallel</button> : <button type="button" data-testid="cross-language-add-parallel" className="rounded border border-[#53604a] px-2 py-1 text-xs" onClick={() => setFunctionalParallel(blankParallel())}>Add functional parallel</button>}
            </div>
            <p className="mt-1 text-xs leading-5 text-[#aeb7c5]">Enter each structure, its proposed contributions and roles, similarities, differences, and unresolved material. A user-entered citation is not source verification; the comparison itself remains user-proposed.</p>
            {functionalParallel ? (
              <>
                {functionalParallel.architectures.map((architecture, architectureIndex) => (
                  <fieldset key={architecture.architectureId} className="mt-3 rounded border border-[#303843] p-3">
                    <legend className="px-1 text-xs font-semibold">{architecture.label}</legend>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className={labelClass}>Structure label<input aria-label={`Parallel structure ${architectureIndex + 1} label`} maxLength={200} className={inputClass} value={architecture.label} onChange={(event) => updateArchitecture(architecture.architectureId, { label: event.target.value })} /></label>
                      <label className={labelClass}>Language<input aria-label={`Parallel structure ${architectureIndex + 1} language`} maxLength={200} className={inputClass} value={architecture.language} onChange={(event) => updateArchitecture(architecture.architectureId, { language: event.target.value })} /></label>
                      <label className={`${labelClass} sm:col-span-2`}>Exact word or phrase<input aria-label={`Parallel structure ${architectureIndex + 1} exact form`} maxLength={200} className={inputClass} value={architecture.exactForm} onChange={(event) => updateArchitecture(architecture.architectureId, { exactForm: event.target.value })} /></label>
                    </div>
                    {architecture.contributions.map((contribution, contributionIndex) => (
                      <div key={contribution.contributionId} className="mt-3 grid gap-2 rounded border border-[#354234] p-2 sm:grid-cols-2">
                        <label className={labelClass}>Contribution form<input aria-label={`Parallel structure ${architectureIndex + 1} contribution ${contributionIndex + 1} form`} maxLength={120} className={inputClass} value={contribution.exactForm} onChange={(event) => updateContribution(architecture.architectureId, contribution.contributionId, { exactForm: event.target.value })} /></label>
                        <label className={labelClass}>Proposed meaning<input aria-label={`Parallel structure ${architectureIndex + 1} contribution ${contributionIndex + 1} meaning`} maxLength={300} className={inputClass} value={contribution.proposedMeaning} onChange={(event) => updateContribution(architecture.architectureId, contribution.contributionId, { proposedMeaning: event.target.value })} /></label>
                        <label className={labelClass}>Functional role<input aria-label={`Parallel structure ${architectureIndex + 1} contribution ${contributionIndex + 1} role`} maxLength={200} className={inputClass} value={contribution.functionalRole} onChange={(event) => updateContribution(architecture.architectureId, contribution.contributionId, { functionalRole: event.target.value })} /></label>
                        <label className={labelClass}>Evidence status<select aria-label={`Parallel structure ${architectureIndex + 1} contribution ${contributionIndex + 1} evidence status`} className={inputClass} value={contribution.evidenceStatus} onChange={(event) => updateContribution(architecture.architectureId, contribution.contributionId, { evidenceStatus: event.target.value as CrossLanguageEvidenceStatusV0_1 })}><option value="USER_PROPOSED">User proposed</option><option value="CITATION_ENTERED_UNVERIFIED">Citation entered; unverified</option><option value="UNKNOWN_OR_NULL">Unknown / Null</option></select></label>
                        <label className={`${labelClass} sm:col-span-2`}>Citation / locator (not independently verified)<input aria-label={`Parallel structure ${architectureIndex + 1} contribution ${contributionIndex + 1} citation`} maxLength={500} className={inputClass} value={contribution.evidenceReference} onChange={(event) => updateContribution(architecture.architectureId, contribution.contributionId, { evidenceReference: event.target.value })} /></label>
                        {architecture.contributions.length > 1 ? <button type="button" className="text-left text-xs underline sm:col-span-2" aria-label={`Remove parallel structure ${architectureIndex + 1} contribution ${contributionIndex + 1}`} onClick={() => updateArchitecture(architecture.architectureId, { contributions: architecture.contributions.filter((item) => item.contributionId !== contribution.contributionId) })}>Remove contribution</button> : null}
                      </div>
                    ))}
                    <button type="button" aria-label={`Add contribution to parallel structure ${architectureIndex + 1}`} className="mt-2 rounded border border-[#53604a] px-2 py-1 text-xs" onClick={() => addContribution(architecture.architectureId)}>Add contribution</button>
                  </fieldset>
                ))}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <label className={labelClass}>Proposed similarity<input aria-label="Functional parallel proposed similarity" maxLength={1000} className={inputClass} value={functionalParallel.proposedSimilarity} onChange={(event) => updateParallel({ proposedSimilarity: event.target.value })} /></label>
                  <label className={labelClass}>Differences<input aria-label="Functional parallel differences" maxLength={1000} className={inputClass} value={functionalParallel.differences} onChange={(event) => updateParallel({ differences: event.target.value })} /></label>
                  <label className={`${labelClass} sm:col-span-2`}>Unresolved relationships<input aria-label="Functional parallel unresolved material" maxLength={1000} className={inputClass} value={functionalParallel.unresolvedMaterial} onChange={(event) => updateParallel({ unresolvedMaterial: event.target.value })} /></label>
                </div>
              </>
            ) : null}
          </div>

          <div data-testid="cross-language-boundary-witness-editor" className="mt-4 rounded-lg border border-[#66532e] bg-[#0d1117] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs text-[#dce9ca]">Optional attributed boundary-operation witness</strong>
              {boundaryOperationWitness ? (
                <button type="button" data-testid="cross-language-remove-boundary-witness" className="rounded border border-[#53604a] px-2 py-1 text-xs" onClick={() => setBoundaryOperationWitness(null)}>Remove boundary witness</button>
              ) : (
                <button type="button" data-testid="cross-language-add-boundary-witness" className="rounded border border-[#53604a] px-2 py-1 text-xs" onClick={() => setBoundaryOperationWitness(blankBoundaryOperationWitness(parent.target.exactWord, "boundary-witness-1"))}>Add boundary witness</button>
              )}
            </div>
            <p className="mt-1 text-xs leading-5 text-[#aeb7c5]">Records a user-declared spelling reconstruction with code-point coordinates. The form does not execute a language rule or verify its source attribution.</p>
            {boundaryOperationWitness ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className={labelClass}>Witness language<input aria-label="Boundary witness language" maxLength={100} className={inputClass} value={boundaryOperationWitness.language} onChange={(event) => updateBoundaryWitness({ language: event.target.value })} /></label>
                <label className={labelClass}>Target exact spelling<input aria-label="Boundary witness target form" className={inputClass} value={boundaryOperationWitness.targetForm} readOnly /></label>
                <label className={labelClass}>Component forms (one exact form per line)<textarea aria-label="Boundary witness component forms" maxLength={1000} className={inputClass} rows={2} value={boundaryOperationWitness.componentForms.join("\n")} onChange={(event) => updateBoundaryComponents(event.target.value)} /></label>
                <label className={labelClass}>Raw concatenation (preserved)<input aria-label="Boundary witness raw concatenation" className={`${inputClass} font-mono`} value={boundaryOperationWitness.rawConcatenation} readOnly /></label>
                <label className={labelClass}>Boundary after component<select aria-label="Boundary witness component boundary" className={inputClass} value={boundaryOperationWitness.boundaryAfterComponentIndex} onChange={(event) => updateBoundaryComponentBoundary(Number(event.target.value))}>{boundaryOperationWitness.componentForms.slice(0, -1).map((form, index) => <option key={`${index}:${form}`} value={index}>{index + 1}: {form}</option>)}</select></label>
                <label className={labelClass}>Boundary position (zero-based code points)<input aria-label="Boundary witness position" type="number" min={0} className={inputClass} value={boundaryOperationWitness.boundaryPosition} onChange={(event) => updateBoundaryWitness({ boundaryPosition: event.target.value === "" ? Number.NaN : Number(event.target.value) })} /></label>
                <label className={labelClass}>Affected input span start (inclusive code point)<input aria-label="Boundary witness span start" type="number" min={0} className={inputClass} value={boundaryOperationWitness.affectedInputSpan.start} onChange={(event) => updateBoundaryWitness({ affectedInputSpan: { ...boundaryOperationWitness.affectedInputSpan, start: event.target.value === "" ? Number.NaN : Number(event.target.value) } })} /></label>
                <label className={labelClass}>Affected input span end (exclusive code point)<input aria-label="Boundary witness span end" type="number" min={0} className={inputClass} value={boundaryOperationWitness.affectedInputSpan.end} onChange={(event) => updateBoundaryWitness({ affectedInputSpan: { ...boundaryOperationWitness.affectedInputSpan, end: event.target.value === "" ? Number.NaN : Number(event.target.value) } })} /></label>
                <label className={labelClass}>Exact boundary input<input aria-label="Boundary witness input" maxLength={80} className={`${inputClass} font-mono`} value={boundaryOperationWitness.boundaryInput} onChange={(event) => updateBoundaryWitness({ boundaryInput: event.target.value })} /></label>
                <label className={labelClass}>Declared boundary output<input aria-label="Boundary witness output" maxLength={80} className={`${inputClass} font-mono`} value={boundaryOperationWitness.boundaryOutput} onChange={(event) => updateBoundaryWitness({ boundaryOutput: event.target.value })} /></label>
                <label className={labelClass}>Declared resulting spelling<input aria-label="Boundary witness declared result" maxLength={120} className={`${inputClass} font-mono`} value={boundaryOperationWitness.declaredResultForm} onChange={(event) => updateBoundaryWitness({ declaredResultForm: event.target.value })} /></label>
                <label className={labelClass}>Attributed rule name<input aria-label="Boundary witness rule name" maxLength={200} className={inputClass} value={boundaryOperationWitness.linguisticRuleName} onChange={(event) => updateBoundaryWitness({ linguisticRuleName: event.target.value })} /></label>
                <label className={labelClass}>Rule attribution<input aria-label="Boundary witness rule attribution" maxLength={300} className={inputClass} value={boundaryOperationWitness.linguisticRuleAttribution} onChange={(event) => updateBoundaryWitness({ linguisticRuleAttribution: event.target.value })} /></label>
                <label className={labelClass}>Rule reference / locator<input aria-label="Boundary witness rule reference" maxLength={1000} className={inputClass} value={boundaryOperationWitness.linguisticRuleReference} onChange={(event) => updateBoundaryWitness({ linguisticRuleReference: event.target.value })} /></label>
                <label className={labelClass}>Evidence status<select aria-label="Boundary witness evidence status" className={inputClass} value={boundaryOperationWitness.evidenceStatus} onChange={(event) => updateBoundaryWitness({ evidenceStatus: event.target.value as CrossLanguageEvidenceStatusV0_1 })}><option value="USER_PROPOSED">User proposed</option><option value="CITATION_ENTERED_UNVERIFIED">Citation entered; unverified</option><option value="UNKNOWN_OR_NULL">Unknown / Null</option></select></label>
                <label className={`${labelClass} sm:col-span-2`}>Source references (one per line)<textarea aria-label="Boundary witness source references" maxLength={12000} className={inputClass} rows={2} value={boundaryOperationWitness.sourceReferences.join("\n")} onChange={(event) => updateBoundaryWitness({ sourceReferences: event.target.value.split("\n").filter((line) => line.length > 0) })} /></label>
                <label className={`${labelClass} sm:col-span-2`}>Separate user-proposed functional interpretation<textarea aria-label="Boundary witness functional interpretation" maxLength={1000} className={inputClass} rows={2} value={boundaryOperationWitness.functionalInterpretation} onChange={(event) => updateBoundaryWitness({ functionalInterpretation: event.target.value })} /></label>
              </div>
            ) : null}
          </div>

          {!hasCrossLanguageContent ? (
            <p data-testid="cross-language-proposal-empty" className="mt-3 text-xs text-[#9fb1bf]">Add a witness, synthesis, unresolved note, target sense, or functional parallel to create a cross-language proposal.</p>
          ) : result.status === "INVALID" ? (
            <div data-testid="cross-language-proposal-invalid" className="mt-3 rounded border border-[#8b5b42] bg-[#1a120f] p-3 text-xs text-[#f1c8a7]">
              Incomplete or invalid cross-language proposal: {result.reasonCodes.join(" · ")}
            </div>
          ) : (
            <article data-testid="cross-language-proposal-result" className="mt-3 rounded border border-[#53604a] bg-[#0b100b] p-3 text-xs leading-5 text-[#d7dde7]">
              <h4 className="font-semibold text-white">Cross-language proposal result</h4>
              <p className="mt-1">Target sense: {result.proposal.target.sense.label ?? "Unknown / Null"} · {evidenceLabel(result.proposal.target.sense.evidenceStatus)}.</p>
              <p>Target Voices: <span className="font-mono">{result.proposal.targetWrittenVoices.path.join(" → ") || "UNKNOWN_OR_NULL"}</span>. Strict embryo meaning: UNKNOWN_OR_NULL.</p>
              {result.proposal.witnesses.map((witness) => (
                <p key={witness.witnessId} data-testid="cross-language-witness-result" className="mt-1">
                  <strong>{witness.exactForm}</strong> · {witness.language}{witness.variety ? ` (${witness.variety})` : ""} · {witness.proposedMeaning ?? "Unknown / Null"} · {evidenceLabel(witness.evidenceStatus)}.
                  {witness.sourceRecord ? ` Source ${witness.sourceRecord.sourceId}; ${witness.sourceRecord.sourceStatus}; functional correspondence ${witness.sourceRecord.functionalCorrespondence}.` : ""}
                  {witness.evidenceReference ? ` Reference: ${witness.evidenceReference}.` : ""}
                </p>
              ))}
              {result.proposal.correspondences.map((relation) => (
                <div key={relation.relationId} data-testid="cross-language-correspondence-result" data-status={relation.formStatus} className="mt-2 rounded border border-[#66532e] p-2">
                  <p><strong className="font-mono">{relation.input} → {relation.output}</strong> · target component {relation.targetComponentForm} to witness {relation.witnessForm} · {relation.formStatus}.</p>
                  <p>Applications: {relation.operationCount}; cost: {relation.totalCost}; independently verified correspondences counted: {relation.independentVerifiedCorrespondenceCount}.</p>
                  {relation.applications.map((application) => (
                    <p key={application.applicationId} className="font-mono">{application.sequence}. {application.kind} [{application.positions.join(", ")}] {application.before} → {application.after ?? "not applied"} · cost {application.cost} · {application.status}{application.reasonCodes.length ? ` · ${application.reasonCodes.join(", ")}` : ""}</p>
                  ))}
                  <p>Authority: {relation.authority}; linguistic validity: {relation.linguisticValidity}; Voice conservation: {relation.voiceConservation}{relation.unresolvedVoices.length ? ` · unresolved Voices: ${relation.unresolvedVoices.join("; ")}` : ""}.</p>
                </div>
              ))}
              {result.proposal.boundaryOperationWitness ? (
                <div data-testid="cross-language-boundary-witness-result" data-status={result.proposal.boundaryOperationWitness.mechanicalReconstructionStatus} className="mt-2 rounded border border-[#66532e] p-2">
                  <p><strong>{result.proposal.boundaryOperationWitness.language} · {result.proposal.boundaryOperationWitness.componentForms.join(" + ")} = {result.proposal.boundaryOperationWitness.rawConcatenation}</strong></p>
                  <p className="font-mono">Boundary after component {result.proposal.boundaryOperationWitness.boundaryAfterComponentIndex + 1}, code-point position {result.proposal.boundaryOperationWitness.boundaryPosition}: {result.proposal.boundaryOperationWitness.boundaryInput} → {result.proposal.boundaryOperationWitness.boundaryOutput} · input span [{result.proposal.boundaryOperationWitness.affectedInputSpan.start}, {result.proposal.boundaryOperationWitness.affectedInputSpan.end}) · output span [{result.proposal.boundaryOperationWitness.affectedOutputSpan.start}, {result.proposal.boundaryOperationWitness.affectedOutputSpan.end}).</p>
                  <p>Declared result: <span className="font-mono">{result.proposal.boundaryOperationWitness.declaredResultForm}</span> · reconstructed: <span className="font-mono">{result.proposal.boundaryOperationWitness.reconstructedForm}</span> · {result.proposal.boundaryOperationWitness.mechanicalReconstructionStatus}.</p>
                  <p>Attributed rule: {result.proposal.boundaryOperationWitness.linguisticRule.name}{result.proposal.boundaryOperationWitness.linguisticRule.attribution ? ` · ${result.proposal.boundaryOperationWitness.linguisticRule.attribution}` : ""}{result.proposal.boundaryOperationWitness.linguisticRule.reference ? ` · ${result.proposal.boundaryOperationWitness.linguisticRule.reference}` : ""}. Evidence: {evidenceLabel(result.proposal.boundaryOperationWitness.evidenceStatus)}; linguistic applicability: {result.proposal.boundaryOperationWitness.linguisticApplicabilityStatus}; authority: {result.proposal.boundaryOperationWitness.authority}; operation cost: null.</p>
                  {result.proposal.boundaryOperationWitness.sourceReferences.length ? <p>Source references: {result.proposal.boundaryOperationWitness.sourceReferences.join(" · ")}</p> : null}
                  <p>Canonical written Voices: {result.proposal.boundaryOperationWitness.writtenVoices.status === "COMPLETE" ? result.proposal.boundaryOperationWitness.writtenVoices.path.join(" → ") || "∅" : `UNKNOWN_OR_NULL (${result.proposal.boundaryOperationWitness.writtenVoices.unresolvedReason})`}{result.proposal.boundaryOperationWitness.unresolvedVoices.length ? ` · unresolved: ${result.proposal.boundaryOperationWitness.unresolvedVoices.join("; ")}` : ""}.</p>
                  <p>User-proposed functional interpretation: {result.proposal.boundaryOperationWitness.functionalInterpretation.text ?? "Unknown / Null"} · {result.proposal.boundaryOperationWitness.functionalInterpretation.status}. Source authority promotion: NONE.</p>
                </div>
              ) : null}
              <p className="mt-2">User-proposed synthesis: {result.proposal.functionalSynthesis.text ?? "Unknown / Null"} · {result.proposal.functionalSynthesis.status}.</p>
              {result.proposal.functionalParallel ? (
                <div data-testid="cross-language-functional-parallel-result" className="mt-2 rounded border border-[#354234] p-2">
                  <strong>Functional parallel · {result.proposal.functionalParallel.status}</strong>
                  {result.proposal.functionalParallel.architectures.map((architecture) => (
                    <div key={architecture.architectureId} className="mt-1">
                      <p>{architecture.label}: <span className="font-mono">{architecture.exactForm}</span> · {architecture.language} · written Voices {architecture.writtenVoices.status === "COMPLETE" ? architecture.writtenVoices.path.join(" → ") || "∅" : `UNKNOWN_OR_NULL (${architecture.writtenVoices.unresolvedReason})`}.</p>
                      <ul className="list-inside list-disc">{architecture.contributions.map((contribution) => <li key={contribution.contributionId}><span className="font-mono">{contribution.exactForm}</span> · {contribution.proposedMeaning || "Unknown / Null"} · role {contribution.functionalRole || "Unknown / Null"} · {evidenceLabel(contribution.evidenceStatus)}{contribution.evidenceReference ? ` · ${contribution.evidenceReference}` : ""}</li>)}</ul>
                    </div>
                  ))}
                  <p className="mt-1">Proposed similarity: {result.proposal.functionalParallel.proposedSimilarity ?? "Unknown / Null"}. Differences: {result.proposal.functionalParallel.differences ?? "Unknown / Null"}. Relationship authority: USER_PROPOSED; automatic semantic evaluation: NOT_PERFORMED; historical relation: NOT_CLAIMED.</p>
                  {result.proposal.functionalParallel.unresolvedMaterial.map((item) => <p key={item}>Unresolved: {item}</p>)}
                </div>
              ) : null}
              {result.proposal.unresolvedMaterial.map((item, index) => <p key={`${index}:${item}`}>Unresolved: {item}</p>)}
              <p className="mt-2 text-[#d5c28f]">No source authority promotion. No historical origin claim. No single winner; user decides.</p>
            </article>
          )}
        </>
      )}
    </section>
  );
}
