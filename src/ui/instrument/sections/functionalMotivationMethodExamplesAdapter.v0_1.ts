import {
  buildCrossLanguageOperationLedgerV0_2,
  type CrossLanguageOperationLedgerInputV0_2,
} from "@/shared/openInstrument/crossLanguageOperationLedger.v0_2";
import {
  STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2,
  type FunctionalMotivationResearchClaimLayerV0_2,
} from "@/shared/openInstrument/functionalMotivationResearchReference.v0_2";
import {
  FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_V0_3 as methodExpansion,
  type ResearchFormV0_3,
} from "@/shared/openInstrument/functionalMotivationResearchMethodExpansion.v0_3";

export type FunctionalMotivationMethodExampleIdV0_1 = "STUDIM" | "STUDY" | "GJITHÇKA";

export type FunctionalMotivationMethodSourceVMV0_1 = Readonly<{
  label: string;
  url: string;
  locator: string;
  citationStatus: "CITATION_ENTERED_UNVERIFIED";
  licensingStatus: "NOT_ASSESSED";
}>;

export type FunctionalMotivationMethodFormVMV0_1 = Readonly<{
  exactSpelling: string;
  language: string;
  variety: string;
  grammaticalCategory: string;
  selectedSense: string;
  codePoints: readonly string[];
  writtenVoices: readonly string[];
  evidenceStatus: "CITATION_ENTERED_UNVERIFIED";
}>;

export type FunctionalMotivationMethodClaimVMV0_1 = Readonly<{
  text: string;
  claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
  status: string;
}>;

export type FunctionalMotivationMethodComponentVMV0_1 = Readonly<{
  spelling: string;
  span: Readonly<{ start: number; end: number }> | null;
  function: string;
  claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
  status: string;
}>;

export type FunctionalMotivationMethodOperationVMV0_1 = Readonly<{
  before: string;
  after: string;
  operationId: string;
  kind: string;
  operationCount: number;
  cost: number;
  position: number | null;
  positionUnit: string;
  removedText: string | null;
  removedSpan: Readonly<{ start: number; end: number }> | null;
  voicesBefore: readonly string[];
  voicesAfter: readonly string[];
  omittedVoices: readonly string[];
  inverseStatus: string;
  inverseForm: string | null;
  mechanicalStatus: string;
  authority: string;
  evidenceStatus: string;
  linguisticApplicability: string;
}>;

export type FunctionalMotivationMethodExampleVMV0_1 = Readonly<{
  id: FunctionalMotivationMethodExampleIdV0_1;
  title: string;
  summary: string;
  forms: readonly FunctionalMotivationMethodFormVMV0_1[];
  components: readonly FunctionalMotivationMethodComponentVMV0_1[];
  functionalReading: FunctionalMotivationMethodClaimVMV0_1;
  reconstruction: Readonly<{ text: string; status: string; note: string }>;
  operations: readonly FunctionalMotivationMethodOperationVMV0_1[];
  alternatives: readonly FunctionalMotivationMethodClaimVMV0_1[];
  contrasts: readonly FunctionalMotivationMethodClaimVMV0_1[];
  unresolved: readonly string[];
  notes: readonly string[];
  sources: readonly FunctionalMotivationMethodSourceVMV0_1[];
}>;

function formatEvents(events: readonly Readonly<{ voice: string; position: number }>[]): string[] {
  return events.map(({ voice, position }) => `${voice}@${position}`);
}

function presentUnknownText(text: string): string {
  return text.replace(/\bunresolved\b/giu, "not established");
}

function projectV0_3Form(
  form: ResearchFormV0_3,
): FunctionalMotivationMethodFormVMV0_1 {
  return {
    exactSpelling: form.exactSpelling,
    language: form.language,
    variety: form.variety,
    grammaticalCategory: form.grammaticalCategory,
    selectedSense: form.selectedSense,
    codePoints: form.exactCodePoints.map(({ character, position }) => `${character}@${position}`),
    writtenVoices: formatEvents(form.writtenVoiceEvents),
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
  };
}

function projectStudimForm(): FunctionalMotivationMethodFormVMV0_1 {
  const target = STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2.target;
  const structure = STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2.writtenStructure;
  return {
    exactSpelling: target.exactSpelling,
    language: target.language,
    variety: target.variety,
    grammaticalCategory: "noun",
    selectedSense: target.selectedMeaning.text,
    codePoints: structure.exactCodePoints.map(({ character, position }) => `${character}@${position}`),
    writtenVoices: formatEvents(structure.writtenVoices),
    evidenceStatus: target.selectedMeaning.evidenceStatus,
  };
}

function sourceLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const path = decodeURIComponent(parsed.pathname).replace(/^\/+|\/+$/gu, "");
    const lemma = path.split("/").at(-1);
    return parsed.hostname === "fjale.al" && lemma
      ? `FJALË · ${lemma.toLocaleUpperCase("sq-AL")}`
      : parsed.hostname;
  } catch {
    return "Source reference";
  }
}

function sourceForUrl(url: string): FunctionalMotivationMethodSourceVMV0_1 {
  const source = methodExpansion.sourceReferences.find((item) => item.url === url);
  return {
    label: source ? `${source.sourceName} · ${source.title}` : sourceLabel(url),
    url,
    locator: source?.locator ?? "Reference recorded in the STUDIM v0.2 specimen; no more specific locator is supplied here.",
    citationStatus: "CITATION_ENTERED_UNVERIFIED",
    licensingStatus: "NOT_ASSESSED",
  };
}

function uniqueSources(urls: readonly string[]): FunctionalMotivationMethodSourceVMV0_1[] {
  return [...new Set(urls)].map(sourceForUrl);
}

function sourcesForIds(ids: readonly string[]): FunctionalMotivationMethodSourceVMV0_1[] {
  const urls = ids.flatMap((id) => {
    const source = methodExpansion.sourceReferences.find((item) => item.sourceId === id);
    return source ? [source.url] : [];
  });
  return uniqueSources(urls);
}

function projectOperation(
  input: CrossLanguageOperationLedgerInputV0_2,
): FunctionalMotivationMethodOperationVMV0_1 | null {
  const result = buildCrossLanguageOperationLedgerV0_2(input);
  if (result.status !== "READY") return null;

  const ledger = result.ledger;
  const application = ledger.operations[0];
  if (!application || application.status !== "APPLIED" || !application.after) return null;

  return {
    before: application.before,
    after: application.after,
    operationId: application.operationId,
    kind: application.kind,
    operationCount: ledger.operationCount,
    cost: ledger.totalCost,
    position: application.positions[0] ?? null,
    positionUnit: ledger.positionUnit,
    removedText: application.removedText,
    removedSpan: application.removedSpan,
    voicesBefore: formatEvents(ledger.initialWrittenVoices.events),
    voicesAfter: formatEvents(ledger.finalWrittenVoices.events),
    omittedVoices: ledger.omittedVoiceEvents.map(({ voice, position }) => `${voice}@${position}`),
    inverseStatus: ledger.inverseReplay.status,
    inverseForm: ledger.inverseReplay.reconstructedInitialForm,
    mechanicalStatus: ledger.mechanicalReconstructionStatus,
    authority: ledger.relationship.authority,
    evidenceStatus: ledger.relationship.evidenceStatus,
    linguisticApplicability: ledger.relationship.linguisticApplicabilityStatus,
  };
}

const specimen = STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2;
const study = methodExpansion.studyComparison;
const gjithcka = methodExpansion.gjithckaCase;

const studimOperation = projectOperation(specimen.operationLedgers[0]!.operationLedgerInput);
const gjitheOperation = projectOperation(gjithcka.operationLedgerInput);

function componentSpan(
  components: typeof specimen.exactSegmentation.components,
): FunctionalMotivationMethodComponentVMV0_1[] {
  let start = 0;
  return components.map((component) => {
    const end = start + Array.from(component.exactSpelling).length;
    const view = {
      spelling: component.exactSpelling,
      span: { start, end },
      function: component.proposedRole ?? "Function not established",
      claimLayer: component.claimLayer,
      status: component.unresolved ? "UNKNOWN_OR_NULL" : component.claimLayer,
    } satisfies FunctionalMotivationMethodComponentVMV0_1;
    start = end;
    return view;
  });
}

function projectGJITHEComponents(): FunctionalMotivationMethodComponentVMV0_1[] {
  return gjithcka.components.map((component) => ({
    spelling: component.exactSpelling,
    span: component.codePointSpan,
    function: component.proposedFunction,
    claimLayer: component.claimLayer,
    status: component.evidenceStatus,
  }));
}

function allStudimSources(): FunctionalMotivationMethodSourceVMV0_1[] {
  const urls = [
    ...specimen.target.selectedMeaning.sourceReferences,
    ...specimen.sourceFacts.flatMap((claim) => claim.sourceReferences),
    ...specimen.alternativeReadings.flatMap((claim) => claim.sourceReferences),
  ];
  return uniqueSources(urls);
}

function allGjithckaSources(): FunctionalMotivationMethodSourceVMV0_1[] {
  const ids: string[] = [
    ...gjithcka.target.sourceReferenceIds,
    ...gjithcka.components.flatMap((component) => component.sourceReferenceIds),
    ...gjithcka.sourceReportedFormation.sourceReferenceIds,
    ...methodExpansion.familyContrasts.flatMap((contrast) => contrast.sourceReportedFormation.sourceReferenceIds),
  ];
  return sourcesForIds(ids);
}

const studimExample: FunctionalMotivationMethodExampleVMV0_1 = {
  id: "STUDIM",
  title: "STUDIM · proposed two-root reading",
  summary: "A method specimen that keeps a functional proposal, exact spelling reconstruction, ordinary morphology and unknown material separate.",
  forms: [projectStudimForm()],
  components: componentSpan(specimen.exactSegmentation.components),
  functionalReading: {
    text: `${specimen.functionalProposal.roots.map((root) => `${root.proposedSpelling} (${root.proposedFunction})`).join(" + ")} → ${specimen.functionalProposal.synthesis.text}`,
    claimLayer: specimen.functionalProposal.synthesis.claimLayer,
    status: specimen.functionalProposal.synthesis.proposalStatus,
  },
  reconstruction: {
    text: `${specimen.exactSegmentation.components.map(({ exactSpelling }) => exactSpelling).join(" + ")} = ${specimen.exactSegmentation.targetSpelling}`,
    status: specimen.exactSegmentation.expectedComparison,
    note: "Exact concatenation is spelling accounting; it does not settle the morphology or etymology.",
  },
  operations: studimOperation ? [studimOperation] : [],
  alternatives: specimen.alternativeReadings.map((claim) => ({
    text: claim.description,
    claimLayer: claim.claimLayer,
    status: claim.evidenceStatus,
  })),
  contrasts: specimen.contrastCases.map((contrast) => ({
    text: `${contrast.exactForm}: ${contrast.statedContribution}`,
    claimLayer: contrast.claimLayer,
    status: contrast.claimLayer,
  })),
  unresolved: specimen.unresolvedClaims.map(({ text }) => presentUnknownText(text)),
  notes: [
    "SHTOJ is cited as lexical context for add/increase; it does not attest SHTU as a component of STUDIM.",
    "STU + DI + M is the exact target spelling split. Final M remains UNKNOWN_OR_NULL.",
    "The H omission is a replayable user-declared operation; linguistic applicability remains NOT_ASSESSED.",
    "Strict embryo meaning is UNKNOWN_OR_NULL. Source authority promotion: NONE. Historical origin: NOT CLAIMED.",
  ],
  sources: allStudimSources(),
};

const studyExample: FunctionalMotivationMethodExampleVMV0_1 = {
  id: "STUDY",
  title: "STUDY · selected-sense comparison",
  summary: "A selected English learning sense compared with Albanian STUDIM by meaning and orthographic overlap only.",
  forms: [projectV0_3Form(study.english), projectV0_3Form(study.albanian)],
  components: [],
  functionalReading: {
    text: study.selectedSenseRelation.text,
    claimLayer: study.selectedSenseRelation.claimLayer,
    status: study.selectedSenseRelation.status,
  },
  reconstruction: {
    text: `Shared written sequence ${study.sharedWrittenSequence.exactSequence} · no component decomposition or word reconstruction asserted`,
    status: study.mechanicalCorrespondence.status,
    note: "The correspondence is orthographic and sense-conditioned; no shared semantic root or historical relationship is claimed.",
  },
  operations: [],
  alternatives: study.excludedEnglishSenseExamples.map((sense) => ({
    text: `Excluded sense: ${sense}`,
    claimLayer: "UNKNOWN_OR_NULL",
    status: "NOT_SELECTED",
  })),
  contrasts: study.structuralDifferences.map((difference) => ({
    text: `Position ${difference.position}: STUDIM ${difference.albanian ?? "∅"} · STUDY ${difference.english ?? "∅"}. ${difference.note}`,
    claimLayer: difference.claimLayer,
    status: "ORTHOGRAPHIC_COMPARISON_ONLY",
  })),
  unresolved: [],
  notes: [
    "The written English Voice Y is preserved as Y; it is not converted to I.",
    "No English roots are proposed. Mechanical correspondence is NOT_ASSERTED.",
    "The selected-sense relation is USER_PROPOSED. Source authority promotion: NONE; user_decides.",
  ],
  sources: sourcesForIds([...study.english.sourceReferenceIds, ...study.albanian.sourceReferenceIds]),
};

const gjithckaExample: FunctionalMotivationMethodExampleVMV0_1 = {
  id: "GJITHÇKA",
  title: "GJITHÇKA · boundary omission example",
  summary: "A source-reported component notation shown beside its exact concatenation mismatch and reversible mechanical replay.",
  forms: [projectV0_3Form(gjithcka.target)],
  components: projectGJITHEComponents(),
  functionalReading: {
    text: gjithcka.functionalReading.text,
    claimLayer: gjithcka.functionalReading.claimLayer,
    status: gjithcka.functionalReading.interpretationStatus,
  },
  reconstruction: {
    text: `${gjithcka.components.map(({ exactSpelling }) => exactSpelling).join(" + ")} = ${gjithcka.rawConcatenation} · target ${gjithcka.targetSpelling}`,
    status: gjithcka.rawConcatenationComparison,
    note: "The operation ledger separately replays the declared Ë omission to the exact target spelling.",
  },
  operations: gjitheOperation ? [gjitheOperation] : [],
  alternatives: gjithcka.alternativeReadings.map((claim) => ({
    text: claim.description,
    claimLayer: claim.claimLayer,
    status: "evidenceStatus" in claim ? claim.evidenceStatus : claim.claimLayer,
  })),
  contrasts: methodExpansion.familyContrasts.map((contrast) => ({
    text: `${contrast.target.exactSpelling}: ${contrast.sourceReportedFormation.exactNotation}; boundary Ë ${contrast.sourceReportsUnstressedEStatus === "RETAINED_IN_LISTED_FORM" ? "retained in the listed form" : "reported lost"}.`,
    claimLayer: contrast.sourceReportedFormation.claimLayer,
    status: contrast.sourceReportedFormation.evidenceStatus,
  })),
  unresolved: gjithcka.unresolvedClaims.map(({ text }) => presentUnknownText(text)),
  notes: [
    "The cited Myrta passage records the component notation; it does not make OMIT an executable linguistic rule.",
    methodExpansion.orthographicGeneralization.reason,
    "Source authority promotion: NONE. Historical origin: NOT CLAIMED.",
  ],
  sources: allGjithckaSources(),
};

export const FUNCTIONAL_MOTIVATION_METHOD_EXAMPLES_V0_1: readonly FunctionalMotivationMethodExampleVMV0_1[] = [
  studimExample,
  studyExample,
  gjithckaExample,
];

export function getFunctionalMotivationMethodExampleV0_1(
  id: FunctionalMotivationMethodExampleIdV0_1 | "",
): FunctionalMotivationMethodExampleVMV0_1 | null {
  return id ? FUNCTIONAL_MOTIVATION_METHOD_EXAMPLES_V0_1.find((example) => example.id === id) ?? null : null;
}
