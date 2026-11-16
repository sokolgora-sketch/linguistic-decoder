import { DI_FREE_OPERATOR_PROFILE_V0_1 } from "@/shared/freeOperatorProfile.v0_1";
import {
  STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2,
  type FunctionalMotivationResearchClaimLayerV0_2,
} from "@/shared/openInstrument/functionalMotivationResearchReference.v0_2";
import {
  projectFunctionalMotivationTraceV0_1,
  type FunctionalMotivationTraceInputV0_1,
  type FunctionalMotivationTraceOperationV0_1,
  type FunctionalMotivationTraceSourceV0_1,
} from "@/shared/openInstrument/functionalMotivationTrace.v0_1";
import {
  FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_V0_3 as methodExpansion,
  type ResearchFormV0_3,
} from "@/shared/openInstrument/functionalMotivationResearchMethodExpansion.v0_3";

export type FunctionalMotivationMethodExampleIdV0_1 = "STUDIM" | "STUDY" | "GJITHÇKA";

export type FunctionalMotivationMethodSourceVMV0_1 = FunctionalMotivationTraceSourceV0_1;

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

export type FunctionalMotivationMethodPatternVMV0_1 = Readonly<{
  action: FunctionalMotivationMethodClaimVMV0_1;
  patient: FunctionalMotivationMethodClaimVMV0_1;
  result: FunctionalMotivationMethodClaimVMV0_1;
  wholeWordFunction: FunctionalMotivationMethodClaimVMV0_1;
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

export type FunctionalMotivationMethodTraceStepVMV0_1 = Readonly<{
  id: string;
  title: string;
  from: string;
  relationshipType: string;
  to: string;
  claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
  status: string;
  sources: readonly FunctionalMotivationMethodSourceVMV0_1[];
  evidenceNote: string;
  supportBoundary: string;
  exactOperation: string | null;
}>;

export type FunctionalMotivationMethodSourceFidelityVMV0_1 = Readonly<{
  classification:
    | "PETRO_ZHEJI_SOURCE_REPORTED"
    | "PETRO_ZHEJI_INSPIRED_RECONSTRUCTION"
    | "ZERO_ORIGINAL_DOCTRINE"
    | "OPEN_INSTRUMENT_ENGINEERING"
    | "UNKNOWN";
  statement: string;
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
  reasoningTrace?: readonly FunctionalMotivationMethodTraceStepVMV0_1[];
  sourceFidelity?: readonly FunctionalMotivationMethodSourceFidelityVMV0_1[];
  motivationEquation?: Readonly<{
    equation: string;
    roles: readonly string[];
    claimLayer: FunctionalMotivationResearchClaimLayerV0_2;
    status: string;
    attribution?: FunctionalMotivationMethodClaimVMV0_1;
    explanationPattern?: FunctionalMotivationMethodPatternVMV0_1;
    sourceAuthorityPromotion: "NONE";
  }>;
  surfaceReconciliation?: Readonly<{
    operationLedgerId: string;
    status: "EXACT_MATCH";
    initialForm: string;
    finalForm: string;
    operationCount: number;
    cost: number;
    inverseStatus: "EXACT_MATCH";
    inverseForm: string;
  }>;
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
    sourceId: source?.sourceId ?? url,
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

function sourceIdsForUrls(urls: readonly string[]): string[] {
  return [...new Set(urls)].map((url) => sourceForUrl(url).sourceId);
}

const specimen = STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2;
const study = methodExpansion.studyComparison;
const gjithcka = methodExpansion.gjithckaCase;

function allStudimSources(): FunctionalMotivationMethodSourceVMV0_1[] {
  const urls = [
    ...specimen.target.selectedMeaning.sourceReferences,
    ...specimen.sourceFacts.flatMap((claim) => claim.sourceReferences),
    ...specimen.alternativeReadings.flatMap((claim) => claim.sourceReferences),
  ];
  return uniqueSources(urls);
}

function studimFactSources(claimId: string): FunctionalMotivationMethodSourceVMV0_1[] {
  const claim = specimen.sourceFacts.find((item) => item.claimId === claimId);
  return claim ? uniqueSources(claim.sourceReferences) : [];
}

function buildStudimReasoningSteps(): FunctionalMotivationTraceInputV0_1["reasoningSteps"] {
  const selectedMeaningSources = sourceIdsForUrls(specimen.target.selectedMeaning.sourceReferences);
  const diSources = sourceIdsForUrls(studimFactSources("di-lexical-function").map(({ url }) => url));
  const shtojSources = sourceIdsForUrls(studimFactSources("shtoj-lexical-function").map(({ url }) => url));
  return [
    {
      id: "whole-word-sense",
      title: "Whole-word function",
      from: specimen.target.exactSpelling,
      relationshipType: "selected lexical sense",
      to: specimen.target.selectedMeaning.text,
      claimLayer: "SOURCE_FACT",
      status: specimen.target.selectedMeaning.evidenceStatus,
      sourceIds: selectedMeaningSources,
      evidenceNote: "The cited STUDIM and STUDIOJ entries provide the selected learning/studying context; both citations remain unverified.",
      supportBoundary: "The selected sense supplies the whole-word context. It does not establish the proposed component segmentation.",
    },
    {
      id: "di-target-span",
      title: "Observed candidate embryo in the target",
      from: "STUDIM code-point span [3,5): DI",
      relationshipType: "exact orthographic substring",
      to: "DI",
      claimLayer: "DERIVED_STRUCTURE",
      status: "OBSERVED_IN_TARGET_SPELLING",
      sourceIds: [],
      evidenceNote: "The substring and zero-based code-point span are derived from the exact target spelling.",
      supportBoundary: "An observed substring does not by itself establish a morpheme boundary or independent component function.",
    },
    {
      id: "di-lexical-function",
      title: "DI lexical embryo candidate",
      from: "DI",
      relationshipType: "independently cited lexical function",
      to: "know / knowledge",
      claimLayer: "SOURCE_FACT",
      status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: diSources,
      evidenceNote: "FJALË's DI entry is recorded as lexical evidence; its citation status is unverified.",
      supportBoundary: "The DI entry supports this lexical function, but does not prove that DI is a historical or grammatical component of STUDIM.",
    },
    {
      id: "shtoj-context",
      title: "Expansion context for the proposed increase function",
      from: "SHTOJ",
      relationshipType: "cited lexical context for a proposed form",
      to: "add / increase",
      claimLayer: "SOURCE_FACT",
      status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: shtojSources,
      evidenceNote: "FJALË's SHTOJ entry is source context; its citation status is unverified.",
      supportBoundary: "SHTOJ does not attest SHTU as a component of STUDIM. The SHTU spelling and its proposed function remain USER_PROPOSAL.",
    },
    {
      id: "shtu-stu-correspondence",
      title: "Proposed spelling correspondence",
      from: "SHTU",
      relationshipType: "user-declared target-side form correspondence",
      to: "STU",
      claimLayer: "USER_PROPOSAL",
      status: "USER_DECLARED_UNVERIFIED · linguistic applicability NOT_ASSESSED",
      sourceIds: [],
      evidenceNote: "The existing operation ledger verifies only an exact mechanical replay; no linguistic source for this omission is entered.",
      supportBoundary: "Mechanical replay and inverse reconstruction do not establish that H omission is linguistically applicable.",
      operationLedgerId: "shtu-stu-h-omission",
    },
    {
      id: "component-interaction",
      title: "Conditional component interaction",
      from: "SHTU (proposed add / increase) + DI (know / knowledge)",
      relationshipType: "exploratory functional synthesis",
      to: specimen.functionalProposal.synthesis.text,
      claimLayer: specimen.functionalProposal.synthesis.claimLayer,
      status: specimen.functionalProposal.synthesis.proposalStatus,
      sourceIds: [...shtojSources, ...diSources],
      evidenceNote: "The cited SHTOJ and DI lexical entries are contextual evidence only; both citations remain unverified.",
      supportBoundary: "Neither entry source-establishes the SHTU + DI segmentation or this synthesis. Treat it as a conditional ZË-RO proposal, not a source-reported meaning or historical derivation.",
    },
    {
      id: "surface-reconstruction",
      title: "Target-side spelling reconstruction",
      from: specimen.exactSegmentation.components.map((component) => component.exactSpelling).join(" + "),
      relationshipType: "exact concatenation",
      to: specimen.exactSegmentation.targetSpelling,
      claimLayer: "DERIVED_STRUCTURE",
      status: specimen.exactSegmentation.expectedComparison,
      sourceIds: [],
      evidenceNote: "Computed directly from the recorded component strings and target spelling.",
      supportBoundary: "An exact surface match accounts for spelling; it does not validate the segmentation, morphology, or functional interpretation.",
      reconstructsSurface: true,
    },
    {
      id: "ordinary-morphology-alternative",
      title: "Separate lexical-morphological alternative",
      from: "STUDIM",
      relationshipType: "separate lexical context",
      to: "STUDIOJ; the specific -IM derivation is not established here",
      claimLayer: specimen.alternativeReadings[0]!.claimLayer,
      status: specimen.alternativeReadings[0]!.evidenceStatus,
      sourceIds: sourceIdsForUrls(specimen.alternativeReadings[0]!.sourceReferences),
      evidenceNote: "The STUDIM and STUDIOJ entries are cited as the basis for keeping this alternative visible; citation status is unverified.",
      supportBoundary: "The specific -IM derivation is not independently verified here and remains separate from the proposed STU + DI + M analysis.",
    },
    {
      id: "unresolved-material",
      title: "Unresolved material",
      from: "M at target position 5",
      relationshipType: "component function",
      to: "UNKNOWN_OR_NULL",
      claimLayer: "UNKNOWN_OR_NULL",
      status: "NOT_ESTABLISHED",
      sourceIds: [],
      evidenceNote: "No supporting source or component function is recorded for M in the specimen.",
      supportBoundary: "Do not infer an autonomous meaning for M or treat the whole-word reading as structurally complete at the component-function level.",
    },
  ];
}

const studimSourceFidelity: FunctionalMotivationMethodSourceFidelityVMV0_1[] = [
  {
    classification: "PETRO_ZHEJI_SOURCE_REPORTED",
    statement: "No claim in this trace is classified as directly reported from a Petro Zheji source.",
  },
  {
    classification: "PETRO_ZHEJI_INSPIRED_RECONSTRUCTION",
    statement: "Only the stepwise presentation is locally described as Zheji-inspired; this is not an implementation of the complete historical Symbolic Algorithm.",
  },
  {
    classification: "ZERO_ORIGINAL_DOCTRINE",
    statement: "The SHTU + DI reading and its conditional functional synthesis remain a ZË-RO user proposal, not an attributed doctrine claim.",
  },
  {
    classification: "OPEN_INSTRUMENT_ENGINEERING",
    statement: "The trace view model, evidence links, and UI rendering are Open Instrument engineering; they grant no source or production authority.",
  },
  {
    classification: "UNKNOWN",
    statement: "Whether this trace corresponds to any complete historical Zheji algorithm remains unknown.",
  },
];

function allGjithckaSources(): FunctionalMotivationMethodSourceVMV0_1[] {
  const ids: string[] = [
    ...gjithcka.target.sourceReferenceIds,
    ...gjithcka.components.flatMap((component) => component.sourceReferenceIds),
    ...gjithcka.sourceReportedFormation.sourceReferenceIds,
    ...methodExpansion.familyContrasts.flatMap((contrast) => contrast.sourceReportedFormation.sourceReferenceIds),
  ];
  return sourcesForIds(ids);
}

const studimTraceInput: FunctionalMotivationTraceInputV0_1 = {
  target: {
    exactSpelling: specimen.target.exactSpelling,
    language: specimen.target.language,
    variety: specimen.target.variety,
    grammaticalCategory: "noun",
    selectedSense: specimen.target.selectedMeaning.text,
    evidenceStatus: specimen.target.selectedMeaning.evidenceStatus,
    sourceIds: sourceIdsForUrls(specimen.target.selectedMeaning.sourceReferences),
    expectedCodePoints: specimen.writtenStructure.exactCodePoints,
    expectedWrittenVoices: specimen.writtenStructure.writtenVoices as FunctionalMotivationTraceInputV0_1["target"]["expectedWrittenVoices"],
  },
  sources: allStudimSources(),
  terms: [
    {
      id: "shtu",
      spelling: "SHTU",
      functionText: "proposed increase function",
      claimLayer: "USER_PROPOSAL",
      status: "USER_PROPOSED",
      sourceIds: [],
      roleNote: "A proposed function-bearing form associated with SHTOJ; its form and membership in STUDIM are not established as an allomorph.",
    },
    {
      id: "di",
      spelling: "DI",
      functionText: "know / knowledge",
      claimLayer: "SOURCE_FACT",
      status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: sourceIdsForUrls(studimFactSources("di-lexical-function").map(({ url }) => url)),
      roleNote: "Independent Albanian lexical form; proposed membership in STUDIM remains unverified.",
      freeOperatorClassification: DI_FREE_OPERATOR_PROFILE_V0_1.directFreeOperator.categories.join(", "),
    },
    {
      id: "shtoj",
      spelling: "SHTOJ",
      functionText: "add / increase",
      claimLayer: "SOURCE_FACT",
      status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: sourceIdsForUrls(studimFactSources("shtoj-lexical-function").map(({ url }) => url)),
      roleNote: "Cited lexical context only; it does not attest SHTU as a STUDIM component. No Zheji operator status is asserted; no SHTOJ free-operator profile is asserted.",
    },
    {
      id: "stu",
      spelling: "STU",
      functionText: "target-side spelling used for the proposed SHTU root realization",
      claimLayer: "USER_PROPOSAL",
      status: "USER_PROPOSED",
      sourceIds: [],
      roleNote: "Actual target-side written component; its relation to proposed SHTU remains unverified.",
    },
    {
      id: "m",
      spelling: "M",
      functionText: "UNKNOWN_OR_NULL",
      claimLayer: "UNKNOWN_OR_NULL",
      status: "UNKNOWN_OR_NULL",
      sourceIds: [],
      roleNote: "UNKNOWN_OR_NULL; final target-side material; no function or autonomous meaning is established.",
    },
  ],
  equation: {
    contributorTermIds: ["shtu", "di"],
    resultText: "Increasing or acquiring knowledge",
    targetDescription: "the activity of studying",
    claimLayer: specimen.functionalProposal.synthesis.claimLayer,
    status: specimen.functionalProposal.synthesis.proposalStatus,
    sourceIds: sourceIdsForUrls([
      ...studimFactSources("shtoj-lexical-function").map(({ url }) => url),
      ...studimFactSources("di-lexical-function").map(({ url }) => url),
    ]),
    attribution: {
      text: "PETRO_ZHEJI_INSPIRED_RECONSTRUCTION · local ZË-RO explanatory framework; not a universal formula authored by Zheji or a historical attribution.",
      claimLayer: "USER_PROPOSAL",
      status: "USER_PROPOSED",
      sourceIds: [],
    },
    explanationPattern: {
      action: {
        text: "increase",
        claimLayer: "USER_PROPOSAL",
        status: "USER_PROPOSED",
        sourceIds: [],
      },
      patient: {
        text: "knowledge",
        claimLayer: "SOURCE_FACT",
        status: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: sourceIdsForUrls(studimFactSources("di-lexical-function").map(({ url }) => url)),
      },
      result: {
        text: "acquisition of knowledge",
        claimLayer: "LOGICAL_INFERENCE",
        status: "USER_PROPOSED",
        sourceIds: [],
      },
      wholeWordFunction: {
        text: "studying",
        claimLayer: "SOURCE_FACT",
        status: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: sourceIdsForUrls(specimen.target.selectedMeaning.sourceReferences),
      },
    },
  },
  functionalReading: {
    text: `${specimen.functionalProposal.roots.map((root) => `${root.proposedSpelling} (${root.proposedFunction})`).join(" + ")} → ${specimen.functionalProposal.synthesis.text}`,
    claimLayer: specimen.functionalProposal.synthesis.claimLayer,
    status: specimen.functionalProposal.synthesis.proposalStatus,
    sourceIds: sourceIdsForUrls([
      ...studimFactSources("shtoj-lexical-function").map(({ url }) => url),
      ...studimFactSources("di-lexical-function").map(({ url }) => url),
    ]),
  },
  surfaceReconstruction: {
    components: specimen.exactSegmentation.components.map((component) => ({
      spelling: component.exactSpelling,
      functionText: component.proposedRole ?? "Function not established",
      claimLayer: component.claimLayer,
      status: component.unresolved ? "UNKNOWN_OR_NULL" : component.claimLayer,
      unresolved: component.unresolved,
    })),
    expectedStatus: specimen.exactSegmentation.expectedComparison,
    note: "Exact concatenation is spelling accounting; it does not settle the morphology or etymology. The function of final M remains UNKNOWN_OR_NULL.",
    sourceIds: [],
  },
  operations: [{ id: "shtu-stu-h-omission", input: specimen.operationLedgers[0]!.operationLedgerInput }],
  alternatives: specimen.alternativeReadings.map((claim) => ({
    text: claim.description,
    claimLayer: claim.claimLayer,
    status: claim.evidenceStatus,
    sourceIds: sourceIdsForUrls(claim.sourceReferences),
  })),
  contrasts: specimen.contrastCases.map((contrast) => ({
    text: `${contrast.exactForm}: ${contrast.statedContribution}`,
    claimLayer: contrast.claimLayer,
    status: contrast.claimLayer,
    sourceIds: [],
  })),
  unresolved: specimen.unresolvedClaims.map(({ text, claimLayer }) => ({
    text: presentUnknownText(text), claimLayer, status: "UNKNOWN_OR_NULL", sourceIds: [],
  })),
  notes: [
    "SHTOJ is cited as lexical context for add/increase; it does not attest SHTU as a component of STUDIM.",
    "STU + DI + M is the exact target spelling split. Final M remains UNKNOWN_OR_NULL.",
    "The H omission is a replayable user-declared operation; linguistic applicability remains NOT_ASSESSED.",
    "Strict embryo meaning is UNKNOWN_OR_NULL. Source authority promotion: NONE. Historical origin: NOT CLAIMED.",
  ],
  reasoningSteps: buildStudimReasoningSteps(),
  sourceFidelity: studimSourceFidelity,
};

const gjithckaTraceInput: FunctionalMotivationTraceInputV0_1 = {
  target: {
    exactSpelling: gjithcka.target.exactSpelling,
    language: gjithcka.target.language,
    variety: gjithcka.target.variety,
    grammaticalCategory: gjithcka.target.grammaticalCategory,
    selectedSense: gjithcka.target.selectedSense,
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
    sourceIds: sourceIdsForUrls(gjithcka.target.sourceReferenceIds.flatMap((id) => {
      const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
      return source ? [source.url] : [];
    })),
    expectedCodePoints: gjithcka.target.exactCodePoints,
    expectedWrittenVoices: gjithcka.target.writtenVoiceEvents,
  },
  sources: allGjithckaSources(),
  terms: gjithcka.components.map((component, index) => ({
    id: index === 0 ? "gjithe" : "cka",
    spelling: component.exactSpelling,
    functionText: component.proposedFunction,
    claimLayer: component.claimLayer,
    status: component.evidenceStatus,
    sourceIds: sourceIdsForUrls(component.sourceReferenceIds.flatMap((id) => {
      const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
      return source ? [source.url] : [];
    })),
    roleNote: `Source-linked lexical function: ${component.proposedFunction}. This supports the recorded lexical function, not a historical derivation by itself.`,
  })),
  equation: {
    contributorTermIds: ["gjithe", "cka"],
    resultText: "everything",
    targetDescription: "all things; everything",
    claimLayer: gjithcka.functionalReading.claimLayer,
    status: gjithcka.functionalReading.interpretationStatus,
    sourceIds: sourceIdsForUrls(gjithcka.components.flatMap((component) => component.sourceReferenceIds).flatMap((id) => {
      const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
      return source ? [source.url] : [];
    })),
    attribution: {
      text: "Source-reported compound notation: Myrta (2014) reports Topalli (2011), GJITHË + ÇKA → GJITHÇKA. This notation is separate from the functional inference below.",
      claimLayer: "SOURCE_FACT",
      status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: sourceIdsForUrls(gjithcka.sourceReportedFormation.sourceReferenceIds.flatMap((id) => {
        const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
        return source ? [source.url] : [];
      })),
    },
  },
  functionalReading: {
    text: gjithcka.functionalReading.text,
    claimLayer: gjithcka.functionalReading.claimLayer,
    status: gjithcka.functionalReading.interpretationStatus,
    sourceIds: sourceIdsForUrls(gjithcka.components.flatMap((component) => component.sourceReferenceIds).flatMap((id) => {
      const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
      return source ? [source.url] : [];
    })),
  },
  surfaceReconstruction: {
    components: gjithcka.components.map((component) => ({
      spelling: component.exactSpelling,
      functionText: component.proposedFunction,
      claimLayer: component.claimLayer,
      status: component.evidenceStatus,
    })),
    expectedStatus: gjithcka.rawConcatenationComparison,
    note: "The source-reported component notation concatenates to GJITHËÇKA; the recorded OMIT ledger separately replays the declared Ë omission to the exact target spelling.",
    sourceIds: sourceIdsForUrls(gjithcka.sourceReportedFormation.sourceReferenceIds.flatMap((id) => {
      const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
      return source ? [source.url] : [];
    })),
    reconciliationOperationId: "gjithcka-boundary-e-omission",
  },
  operations: [{ id: "gjithcka-boundary-e-omission", input: gjithcka.operationLedgerInput }],
  alternatives: gjithcka.alternativeReadings.map((claim) => ({
    text: claim.description,
    claimLayer: claim.claimLayer,
    status: "evidenceStatus" in claim ? claim.evidenceStatus : claim.claimLayer,
    sourceIds: claim.claimLayer === "SOURCE_FACT"
      ? sourceIdsForUrls(gjithcka.sourceReportedFormation.sourceReferenceIds.flatMap((id) => {
          const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
          return source ? [source.url] : [];
        }))
      : [],
  })),
  contrasts: methodExpansion.familyContrasts.map((contrast) => ({
    text: `${contrast.target.exactSpelling}: ${contrast.sourceReportedFormation.exactNotation}; boundary Ë ${contrast.sourceReportsUnstressedEStatus === "RETAINED_IN_LISTED_FORM" ? "retained in the listed form" : "reported lost"}.`,
    claimLayer: contrast.sourceReportedFormation.claimLayer,
    status: contrast.sourceReportedFormation.evidenceStatus,
    sourceIds: sourceIdsForUrls(contrast.sourceReportedFormation.sourceReferenceIds.flatMap((id) => {
      const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
      return source ? [source.url] : [];
    })),
  })),
  unresolved: gjithcka.unresolvedClaims.map(({ text, claimLayer }) => ({
    text: presentUnknownText(text), claimLayer, status: claimLayer, sourceIds: [],
  })),
  notes: [
    "The cited Myrta passage records the component notation; it does not make OMIT an executable linguistic rule.",
    methodExpansion.orthographicGeneralization.reason,
    "Source authority promotion: NONE. Historical origin: NOT CLAIMED.",
  ],
  reasoningSteps: [
    {
      id: "whole-word-sense", title: "Whole-word sense", from: gjithcka.target.exactSpelling,
      relationshipType: "selected lexical sense", to: gjithcka.target.selectedSense,
      claimLayer: "SOURCE_FACT", status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: sourceIdsForUrls(gjithcka.target.sourceReferenceIds.flatMap((id) => {
        const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
        return source ? [source.url] : [];
      })),
      evidenceNote: "The selected FJALË sense is the whole-word functional context; citation remains unverified.",
      supportBoundary: "The whole-word meaning does not by itself establish component boundaries or a functional derivation.",
    },
    {
      id: "gjithe-lexical-function", title: "GJITHË lexical contribution", from: "GJITHË",
      relationshipType: "source-linked lexical function", to: "all / whole",
      claimLayer: "SOURCE_FACT", status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: sourceIdsForUrls(gjithcka.components[0]!.sourceReferenceIds.flatMap((id) => {
        const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
        return source ? [source.url] : [];
      })),
      evidenceNote: "FJALË records an all/whole lexical meaning for GJITHË.",
      supportBoundary: "This is source-reported lexical evidence, not by itself proof of the target formation.",
    },
    {
      id: "cka-lexical-function", title: "ÇKA lexical contribution", from: "ÇKA",
      relationshipType: "source-linked lexical function", to: "what / that which",
      claimLayer: "SOURCE_FACT", status: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: sourceIdsForUrls(gjithcka.components[1]!.sourceReferenceIds.flatMap((id) => {
        const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
        return source ? [source.url] : [];
      })),
      evidenceNote: "FJALË records interrogative and relative readings for ÇKA.",
      supportBoundary: "This is source-reported lexical evidence, not by itself proof of the target formation.",
    },
    {
      id: "reported-component-notation", title: "Reported compound notation",
      from: gjithcka.sourceReportedFormation.exactNotation,
      relationshipType: "source-reported structural notation", to: gjithcka.targetSpelling,
      claimLayer: gjithcka.sourceReportedFormation.claimLayer,
      status: gjithcka.sourceReportedFormation.evidenceStatus,
      sourceIds: sourceIdsForUrls(gjithcka.sourceReportedFormation.sourceReferenceIds.flatMap((id) => {
        const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
        return source ? [source.url] : [];
      })),
      evidenceNote: "Myrta 2014 reports the notation; the citation and licensing remain unverified/not assessed.",
      supportBoundary: "The source report is not promoted to an executable engine rule or a historical-origin claim.",
      exactStructure: "Reported notation is GJITHË + ÇKA → GJITHÇKA; raw uppercase concatenation remains GJITHËÇKA.",
    },
    {
      id: "functional-component-interaction", title: "Proposed functional interaction",
      from: "GJITHË (all / whole) + ÇKA (what / that which)",
      relationshipType: "functional composition", to: "all + what/that which → everything",
      claimLayer: "LOGICAL_INFERENCE", status: "USER_PROPOSED",
      sourceIds: sourceIdsForUrls(gjithcka.components.flatMap((component) => component.sourceReferenceIds).flatMap((id) => {
        const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
        return source ? [source.url] : [];
      })),
      evidenceNote: "The lexical functions are separately cited; the component interaction is the proposed functional reading.",
      supportBoundary: "The inference does not establish historical origin or a universal boundary operation.",
    },
    {
      id: "surface-reconstruction", title: "Exact component concatenation",
      from: "GJITHË + ÇKA", relationshipType: "raw concatenation", to: "GJITHËÇKA versus GJITHÇKA",
      claimLayer: "DERIVED_STRUCTURE", status: "MISMATCH",
      sourceIds: [], evidenceNote: "The exact component strings concatenate without deleting Ë.",
      supportBoundary: "Mechanical spelling mismatch is retained and is not treated as proof for or against linguistic applicability.",
      reconstructsSurface: true,
    },
    {
      id: "boundary-e-omission", title: "Declared reversible spelling operation",
      from: "GJITHËÇKA", relationshipType: "user-declared mechanical replay", to: "GJITHÇKA",
      claimLayer: "DERIVED_STRUCTURE", status: "USER_DECLARED_UNVERIFIED · linguistic applicability NOT_ASSESSED",
      sourceIds: sourceIdsForUrls(gjithcka.sourceReportedFormation.sourceReferenceIds.flatMap((id) => {
        const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
        return source ? [source.url] : [];
      })),
      evidenceNote: "The existing OMIT ledger replays the declared boundary Ë deletion; its inverse reconstructs the exact input spelling.",
      supportBoundary: "A successful reversible replay does not authorize an automatic linguistic rule or promote the Myrta citation.",
      operationLedgerId: "gjithcka-boundary-e-omission",
    },
    ...gjithcka.alternativeReadings.map((claim, index) => ({
      id: `alternative-${index + 1}`, title: "Alternative interpretation",
      from: "GJITHÇKA", relationshipType: "coexisting interpretation", to: claim.description,
      claimLayer: claim.claimLayer,
      status: "evidenceStatus" in claim ? claim.evidenceStatus : claim.claimLayer,
      sourceIds: claim.claimLayer === "SOURCE_FACT"
        ? sourceIdsForUrls(gjithcka.sourceReportedFormation.sourceReferenceIds.flatMap((id) => {
            const source = methodExpansion.sourceReferences.find((reference) => reference.sourceId === id);
            return source ? [source.url] : [];
          }))
        : [],
      evidenceNote: "The alternative remains separately classified; selection is left to the user.",
      supportBoundary: "Alternatives may coexist; this display does not select a historical winner.",
    })),
    ...gjithcka.unresolvedClaims.map((claim) => ({
      id: claim.claimId, title: "Unresolved claim", from: "GJITHÇKA",
      relationshipType: "authority boundary", to: claim.text,
      claimLayer: claim.claimLayer, status: claim.claimLayer,
      sourceIds: [], evidenceNote: "No additional authority is recorded for this claim.",
      supportBoundary: "Keep this question UNKNOWN_OR_NULL; no product rule or historical origin is asserted.",
    })),
  ],
};

export const FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1 = {
  STUDIM: studimTraceInput,
  GJITHÇKA: gjithckaTraceInput,
} as const;

function projectTraceOperationForCard(
  operation: FunctionalMotivationTraceOperationV0_1,
): FunctionalMotivationMethodOperationVMV0_1 {
  return {
    before: operation.before,
    after: operation.after,
    operationId: operation.operationId,
    kind: operation.kind,
    operationCount: operation.operationCount,
    cost: operation.cost,
    position: operation.position,
    positionUnit: operation.positionUnit,
    removedText: operation.removedText,
    removedSpan: operation.removedSpan,
    voicesBefore: operation.voicesBefore,
    voicesAfter: operation.voicesAfter,
    omittedVoices: operation.omittedVoices,
    inverseStatus: operation.inverseStatus,
    inverseForm: operation.inverseForm,
    mechanicalStatus: operation.mechanicalStatus,
    authority: operation.authority,
    evidenceStatus: operation.evidenceStatus,
    linguisticApplicability: operation.linguisticApplicability,
  };
}

function projectTraceExample(
  id: FunctionalMotivationMethodExampleIdV0_1,
  title: string,
  summary: string,
  input: FunctionalMotivationTraceInputV0_1,
): FunctionalMotivationMethodExampleVMV0_1 {
  const result = projectFunctionalMotivationTraceV0_1(input);
  if (result.status !== "READY") {
    throw new Error(`Functional motivation trace projection rejected: ${result.reasonCodes.join(",")}`);
  }
  const projection = result.projection;
  return {
    id,
    title,
    summary,
    forms: [{
      exactSpelling: projection.target.exactSpelling,
      language: projection.target.language,
      variety: projection.target.variety,
      grammaticalCategory: projection.target.grammaticalCategory,
      selectedSense: projection.target.selectedSense,
      codePoints: projection.target.codePoints,
      writtenVoices: projection.target.writtenVoices,
      evidenceStatus: projection.target.evidenceStatus,
    }],
    motivationEquation: projection.motivationEquation,
    components: projection.components,
    functionalReading: projection.functionalReading,
    reconstruction: projection.reconstruction,
    operations: projection.operations.map(projectTraceOperationForCard),
    alternatives: projection.alternatives.map(({ text, claimLayer, status }) => ({ text, claimLayer, status })),
    contrasts: projection.contrasts.map(({ text, claimLayer, status }) => ({ text, claimLayer, status })),
    unresolved: projection.unresolved.map(({ text }) => text),
    notes: projection.notes,
    sources: projection.sources,
    reasoningTrace: projection.reasoningTrace,
    sourceFidelity: projection.sourceFidelity,
    surfaceReconciliation: projection.surfaceReconciliation,
  };
}

const studimExample = projectTraceExample(
  "STUDIM",
  "STUDIM · proposed two-root reading",
  "A method specimen that keeps a functional proposal, exact spelling reconstruction, ordinary morphology and unknown material separate.",
  FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.STUDIM,
);

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

const gjithckaExample = projectTraceExample(
  "GJITHÇKA",
  "GJITHÇKA · boundary omission example",
  "A source-reported component notation shown beside its exact concatenation mismatch and reversible mechanical replay.",
  FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.GJITHÇKA,
);

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
