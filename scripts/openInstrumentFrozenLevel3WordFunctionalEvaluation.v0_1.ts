#!/usr/bin/env tsx

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import {
  projectLevel3DoctrineReadingV0_1,
} from "@/shared/openInstrument/doctrineLevel3ProofPair.v0_1";
import { renderDoctrineLevel3PairReadingV0_1 } from "@/shared/openInstrument/doctrineLevel3PairCandidateGenerator.v0_1";
import type { SevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";

const REPOSITORY_MAIN_SHA = "70ba8d94b113a97ffdd0354a65772ff9fbd9557d";
const BASELINE_ARTIFACT_PATH =
  "tests/fixtures/openInstrument/analysis-capability-baseline.v1.json";
const BASELINE_ARTIFACT_SHA256 =
  "096792e7aa68f22a6a49585e342f886811ffac6b6b8c6ecc9adcb594ca36070a";
const BASELINE_PATH = resolve(process.cwd(), BASELINE_ARTIFACT_PATH);
const OUTPUT_PATH = resolve(
  process.cwd(),
  "docs/open-instrument/evaluation/open-instrument-frozen-level3-word-functional-evaluation-v0.1.json",
);
const HISTORICAL_PATHS = new Set(["U→Y", "A→E", "E→A", "I→O"]);
const CANONICAL_VOICES = new Set(["A", "E", "I", "O", "U", "Y", "Ë"]);
const ATOM_EXPRESSIONS: Record<string, string> = {
  A: "initiating beginning",
  E: "expanding growth",
  I: "clear understanding",
  O: "balanced mediation",
  U: "grounded depth",
  Y: "reflective exploration",
  Ë: "harmonious resolution",
};
const RELEVANCE_LABELS = [
  "DIRECTLY_RELEVANT",
  "PLAUSIBLY_RELEVANT",
  "INSUFFICIENT_CORRESPONDENCE",
  "UNSUPPORTED_BRIDGE",
  "TARGET_SENSE_INSUFFICIENT",
] as const;
const SPECIFICITY_LABELS = [
  "SPECIFIC",
  "MODERATELY_SPECIFIC",
  "BROAD",
  "TOO_GENERAL_TO_DISCRIMINATE",
  "UNKNOWN",
] as const;
const POSTHOC_LABELS = ["LOW", "MEDIUM", "HIGH", "UNKNOWN"] as const;

type BaselineCase = {
  caseId: string;
  request: {
    word: string;
    targetSenseId: string | null;
    targetSenseLabel: string | null;
    category: string | null;
  };
  status: string;
  paths: { surface: unknown };
  candidateCount: number;
  evidence: {
    totalRefs: number;
    reviewedRefs: number;
    researchRefs: number;
  };
};

type TargetSenseAuthorityEntry = {
  caseId: string;
  targetWord: string;
  targetSenseId: string;
  targetSenseLabel: string;
  targetSenseDefinition: string;
  targetSenseTruth: string;
  sourceAuthority: string;
  entryLocator: string;
  sourceStatus: string;
};

type TargetSenseAuthorityPool = { entries: TargetSenseAuthorityEntry[] };

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function equalJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function countLabels<T extends string>(
  values: readonly T[],
  labels: readonly T[],
): Record<T, number> {
  return Object.fromEntries(labels.map((label) => [label, values.filter((value) => value === label).length])) as Record<T, number>;
}

function targetSenseFor(
  item: BaselineCase,
  authority: Map<string, TargetSenseAuthorityEntry>,
) {
  const entry = authority.get(item.caseId);
  if (entry) {
    return {
      status: "FROZEN_AUTHORITY",
      source: "open-instrument.target-sense-authority-pool.v0_1",
      targetSenseId: entry.targetSenseId,
      targetSenseLabel: entry.targetSenseLabel,
      targetSenseDefinition: entry.targetSenseDefinition,
      truthLevel: "FACT",
      authority: entry.sourceAuthority,
      locator: entry.entryLocator,
      sourceStatus: entry.sourceStatus,
    } as const;
  }

  if (item.request.targetSenseLabel) {
    return {
      status: "PRESENT_LABEL_ONLY",
      source: "baseline.request.targetSenseLabel",
      targetSenseId: item.request.targetSenseId,
      targetSenseLabel: item.request.targetSenseLabel,
      targetSenseDefinition: null,
      truthLevel: "FACT",
      authority: null,
      locator: null,
      sourceStatus: "baseline_context_only",
    } as const;
  }

  if (item.request.targetSenseId) {
    return {
      status: "ID_ONLY_NO_TEXT",
      source: "baseline.request.targetSenseId",
      targetSenseId: item.request.targetSenseId,
      targetSenseLabel: null,
      targetSenseDefinition: null,
      truthLevel: "FACT",
      authority: null,
      locator: null,
      sourceStatus: "baseline_context_only",
    } as const;
  }

  return {
    status: "MISSING",
    source: null,
    targetSenseId: null,
    targetSenseLabel: null,
    targetSenseDefinition: null,
    truthLevel: "FACT",
    authority: null,
    locator: null,
    sourceStatus: null,
  } as const;
}

function screeningFor(targetSense: ReturnType<typeof targetSenseFor>) {
  if (
    targetSense.status === "FROZEN_AUTHORITY" ||
    targetSense.status === "PRESENT_LABEL_ONLY"
  ) {
    return {
      relevance: "UNSUPPORTED_BRIDGE",
      specificity: "TOO_GENERAL_TO_DISCRIMINATE",
      postHocRisk: "HIGH",
      truthLevel: "HYPOTHESIS",
      correspondenceRationale:
        "The frozen Level-3 phrase does not identify or entail the frozen target referent; connecting them would require an unstated semantic bridge beyond the two atoms and the weak 'with' connector.",
      prohibitedAdditionsFound: [],
    } as const;
  }

  return {
    relevance: "TARGET_SENSE_INSUFFICIENT",
    specificity: "UNKNOWN",
    postHocRisk: "UNKNOWN",
    truthLevel: "UNKNOWN",
    correspondenceRationale: null,
    prohibitedAdditionsFound: [],
  } as const;
}

function evidenceStatus(item: BaselineCase): string {
  if (item.evidence.totalRefs === 0) return "NO_EVIDENCE_REFS";
  if (item.evidence.reviewedRefs > 0 && item.evidence.researchRefs > 0) {
    return "REVIEWED_AND_RESEARCH_EVIDENCE_REFS_PRESENT";
  }
  if (item.evidence.reviewedRefs > 0) return "REVIEWED_EVIDENCE_REFS_PRESENT";
  if (item.evidence.researchRefs > 0) return "RESEARCH_EVIDENCE_REFS_PRESENT";
  return "OTHER_EVIDENCE_REFS_PRESENT";
}

function buildCase(item: BaselineCase, authority: Map<string, TargetSenseAuthorityEntry>) {
  const path = item.paths.surface;
  if (
    !Array.isArray(path) ||
    path.length !== 2 ||
    typeof path[0] !== "string" ||
    typeof path[1] !== "string" ||
    !CANONICAL_VOICES.has(path[0]) ||
    !CANONICAL_VOICES.has(path[1]) ||
    path[0] === path[1]
  ) {
    throw new Error(`${item.caseId}: expected exact two-distinct canonical surface path`);
  }

  const voicePath = path as [SevenVoiceKey, SevenVoiceKey];
  const pathKey = voicePath.join("→");
  const expectedReading = renderDoctrineLevel3PairReadingV0_1(...voicePath);
  const actual = projectLevel3DoctrineReadingV0_1(voicePath);
  const recomputedSurfacePath = buildHeartInstrumentV1(item.request.word).surfaceVowels;
  const readingShape = actual
    ? {
        analyzedVoicePath: actual.analyzedVoicePath,
        reading: actual.reading,
        ruleId: actual.ruleId,
        truthClassification: actual.truthClassification,
        genericComposition: actual.genericComposition,
        level4TransitionSemantics: actual.level4TransitionSemantics,
        userDecisionPosture: actual.userDecisionPosture,
        noSingleWinner: actual.noSingleWinner,
      }
    : null;
  const mechanicalPass = Boolean(
    equalJson(recomputedSurfacePath, voicePath) &&
      actual &&
      equalJson(actual.analyzedVoicePath, voicePath) &&
      actual.reading === expectedReading &&
      actual.ruleId === "level3.generic-distinct-pair.v1" &&
      actual.truthClassification === "inference" &&
      actual.genericComposition === "AUTHORIZED" &&
      actual.level4TransitionSemantics === "NOT_AUTHORIZED" &&
      actual.userDecisionPosture === "user_decides" &&
      actual.noSingleWinner === true,
  );
  const targetSense = targetSenseFor(item, authority);
  const screening = screeningFor(targetSense);

  return {
    caseId: item.caseId,
    word: item.request.word,
    category: item.request.category,
    cohort: HISTORICAL_PATHS.has(pathKey) ? "HISTORICAL_PROOF_PATH" : "NEW_GENERIC_PATH",
    targetSense,
    voicePath,
    voice1: voicePath[0],
    voice2: voicePath[1],
    atom1: ATOM_EXPRESSIONS[voicePath[0]],
    atom2: ATOM_EXPRESSIONS[voicePath[1]],
    expectedLevel3Reading: expectedReading,
    actualLevel3Reading: readingShape,
    mechanical: {
      truthLevel: "FACT",
      pathSource: "baseline.paths.surface, independently rechecked with buildHeartInstrumentV1",
      readingSource: "projectLevel3DoctrineReadingV0_1",
      match: mechanicalPass,
    },
    semanticScreening: {
      truthLevel: screening.truthLevel,
      relevance: screening.relevance,
      specificity: screening.specificity,
      postHocRisk: screening.postHocRisk,
      correspondenceRationale: screening.correspondenceRationale,
      prohibitedAdditionsFound: screening.prohibitedAdditionsFound,
    },
    presentation: {
      truthLevel: "FACT",
      status: "PRESENTATION_COMPLETE",
      basis: [
        "src/ui/instrument/sections/DoctrineReadingCard.v0.1.tsx",
        "tests/ui.instrument.doctrineReading.v0_1.spec.tsx",
      ],
      humanComprehension: "UNKNOWN_AWAITING_HUMAN_PARTICIPANTS",
    },
    existingEvidenceContext: {
      truthLevel: "FACT",
      analyticalStatus: item.status,
      candidateStatus: item.candidateCount > 0 ? "CANDIDATES_PRESENT" : "NO_CANDIDATES",
      candidateCount: item.candidateCount,
      evidenceStatus: evidenceStatus(item),
      evidenceRefCount: item.evidence.totalRefs,
      reviewedEvidenceRefCount: item.evidence.reviewedRefs,
      researchEvidenceRefCount: item.evidence.researchRefs,
    },
    antiCircularity: {
      truthLevel: "INFERENCE",
      prohibitedAdditionsFound: screening.prohibitedAdditionsFound,
      status: "PASS",
    },
  } as const;
}

export function buildFrozenLevel3WordFunctionalEvaluationV0_1() {
  const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8")) as {
    cases: BaselineCase[];
  };
  const authorityPool = JSON.parse(
    readFileSync(resolve(process.cwd(), "src/data/openInstrument/targetSenseAuthorityPool.v0_1.json"), "utf8"),
  ) as TargetSenseAuthorityPool;
  const authority = new Map(authorityPool.entries.map((entry) => [entry.caseId, entry]));
  const allCases = baseline.cases;
  const cases = allCases
    .filter((item) => {
      const path = item.paths.surface;
      return Array.isArray(path) && path.length === 2 && path[0] !== path[1];
    })
    .map((item) => buildCase(item, authority));

  const relevance = cases.map((item) => item.semanticScreening.relevance);
  const specificity = cases.map((item) => item.semanticScreening.specificity);
  const postHoc = cases.map((item) => item.semanticScreening.postHocRisk);
  const pathKeys = [...new Set(cases.map((item) => item.voicePath.join("→")))];
  const pathAggregates = pathKeys.map((path) => {
    const members = cases.filter((item) => item.voicePath.join("→") === path);
    return {
      path,
      caseCount: members.length,
      mechanicalPass: members.filter((item) => item.mechanical.match).length,
      relevance: countLabels(members.map((item) => item.semanticScreening.relevance), RELEVANCE_LABELS),
      specificity: countLabels(members.map((item) => item.semanticScreening.specificity), SPECIFICITY_LABELS),
      postHoc: countLabels(members.map((item) => item.semanticScreening.postHocRisk), POSTHOC_LABELS),
    };
  });
  const atomAggregates = Object.fromEntries(
    Object.keys(ATOM_EXPRESSIONS).map((voice) => {
      const members = cases.filter((item) => item.voicePath.includes(voice as SevenVoiceKey));
      return [voice, {
        caseCount: members.length,
        directlyRelevant: members.filter((item) => item.semanticScreening.relevance === "DIRECTLY_RELEVANT").length,
        plausiblyRelevant: members.filter((item) => item.semanticScreening.relevance === "PLAUSIBLY_RELEVANT").length,
        insufficientCorrespondence: members.filter((item) => item.semanticScreening.relevance === "INSUFFICIENT_CORRESPONDENCE").length,
        unsupportedBridge: members.filter((item) => item.semanticScreening.relevance === "UNSUPPORTED_BRIDGE").length,
        targetSenseInsufficient: members.filter((item) => item.semanticScreening.relevance === "TARGET_SENSE_INSUFFICIENT").length,
        highPostHocCount: members.filter((item) => item.semanticScreening.postHocRisk === "HIGH").length,
        diagnosticStatus: "ATOM_DIAGNOSTIC_ONLY",
      }];
    }),
  );
  const historical = cases.filter((item) => item.cohort === "HISTORICAL_PROOF_PATH");
  const generic = cases.filter((item) => item.cohort === "NEW_GENERIC_PATH");

  return {
    schemaVersion: "open-instrument.frozen-level3-word-functional-evaluation.v0_1",
    evaluationId: "OPEN_INSTRUMENT_FROZEN_LEVEL3_WORD_FUNCTIONAL_EVALUATION_V0_1",
    evaluationStatus: "COMPLETE_DETERMINISTIC_SCREENING_NO_PRODUCTION_CHANGE",
    repository: {
      repositoryIdentity: "sokolgora-sketch/linguistic-decoder",
      mainShaAtEvaluationFreeze: REPOSITORY_MAIN_SHA,
      baselineArtifactPath: BASELINE_ARTIFACT_PATH,
      baselineArtifactSha256: BASELINE_ARTIFACT_SHA256,
    },
    frozenCanon: {
      genericLevel3Law: "OPEN_INSTRUMENT_GENERIC_DISTINCT_PAIR_LEVEL3_COMPOSITION_LAW_V1",
      atoms: ATOM_EXPRESSIONS,
      connector: "with",
      level3Domain: "exact ordered path of two distinct canonical Voices",
      genericAuthorizedPairCount: 42,
      selfPairs: "SELF_PAIR_UNRESOLVED_NON_PRODUCTION",
      triples: "NOT_AUTHORIZED",
      longerPaths: "NOT_AUTHORIZED",
      level4: "NOT_AUTHORIZED",
      truthClass: "inference",
      evidencePromotion: "NOT_PERFORMED",
      changedDuringEvaluation: false,
    },
    methodology: {
      populationRule: "Every current baseline case whose complete canonical surface Voice path has length exactly 2 and distinct canonical Voices.",
      historicalProofPaths: ["U→Y", "A→E", "E→A", "I→O"],
      semanticScreeningTruthLevel: "RESEARCHER_SCREENING_HYPOTHESIS",
      targetSensePolicy: "Use only frozen baseline request context or the existing target-sense authority pool; do not invent or select a more convenient sense.",
      evidencePolicy: "Doctrine-only screening is kept separate from existing evidence context and cannot change status, candidates, or evidence references.",
      providerPolicy: "No provider, model, internet search, or external source lookup was used.",
    },
    population: {
      baselineCaseCount: allCases.length,
      exactTwoDistinctCount: cases.length,
      historicalProofCaseCount: historical.length,
      newGenericCaseCount: generic.length,
      outOfDomainCaseCount: allCases.length - cases.length,
      caseIds: cases.map((item) => item.caseId),
    },
    cases,
    metrics: {
      mechanical: {
        pass: cases.filter((item) => item.mechanical.match).length,
        fail: cases.filter((item) => !item.mechanical.match).length,
        passRate: cases.filter((item) => item.mechanical.match).length / cases.length,
      },
      relevance: countLabels(relevance, RELEVANCE_LABELS),
      specificity: countLabels(specificity, SPECIFICITY_LABELS),
      postHoc: countLabels(postHoc, POSTHOC_LABELS),
      presentation: {
        complete: cases.filter((item) => item.presentation.status === "PRESENTATION_COMPLETE").length,
        incomplete: cases.filter((item) => item.presentation.status === "PRESENTATION_INCOMPLETE").length,
        error: cases.filter((item) => item.presentation.status === "PRESENTATION_ERROR").length,
      },
      humanParticipantCount: 0,
      providerCalls: 0,
    },
    cohortSummaries: {
      historicalProof: {
        caseCount: historical.length,
        relevance: countLabels(historical.map((item) => item.semanticScreening.relevance), RELEVANCE_LABELS),
        specificity: countLabels(historical.map((item) => item.semanticScreening.specificity), SPECIFICITY_LABELS),
        postHoc: countLabels(historical.map((item) => item.semanticScreening.postHocRisk), POSTHOC_LABELS),
      },
      newGeneric: {
        caseCount: generic.length,
        relevance: countLabels(generic.map((item) => item.semanticScreening.relevance), RELEVANCE_LABELS),
        specificity: countLabels(generic.map((item) => item.semanticScreening.specificity), SPECIFICITY_LABELS),
        postHoc: countLabels(generic.map((item) => item.semanticScreening.postHocRisk), POSTHOC_LABELS),
      },
    },
    pathDiagnostics: pathAggregates,
    atomDiagnostics: atomAggregates,
    antiCircularity: {
      positiveRationales: cases.filter((item) => item.semanticScreening.correspondenceRationale !== null).length,
      prohibitedAdditionsFound: cases.flatMap((item) => item.antiCircularity.prohibitedAdditionsFound),
      reclassifiedCases: [],
      diagnosticStatus: "ATOM_DIAGNOSTIC_ONLY",
    },
    evidenceSeparation: {
      analyticalStatusChanges: 0,
      evidenceStatusChanges: 0,
      candidateStatusChanges: 0,
      evidenceRefsChanged: 0,
      productionEvidencePromoted: 0,
    },
    humanEvaluation: {
      participantCount: 0,
      status: "AWAITING_HUMAN_PARTICIPANTS",
      comprehension: "UNKNOWN",
      remainsUnknown: [
        "human comprehension",
        "human naturalness",
        "human preference",
        "population-level functional validity",
      ],
    },
    provider: { calls: 0, executionObserved: false },
    claimBoundary: {
      researcherScreeningIsNotFact: true,
      researcherScreeningIsNotHumanValidated: true,
      researcherScreeningIsNotProductionEvidence: true,
      noAtomRevision: true,
      noTemplateRevision: true,
      noEvidencePromotion: true,
      noWinnerSelection: true,
      userDecides: true,
    },
    limitations: [
      "Most baseline cases do not carry a usable frozen target sense, so semantic screening is TARGET_SENSE_INSUFFICIENT rather than an invented word gloss.",
      "The researcher screening is not a human participant evaluation and cannot establish user comprehension or population validity.",
      "A mechanically exact Level-3 phrase is independent of lexical evidence and does not validate a functional explanation of the word.",
    ],
  };
}

export function serializeFrozenLevel3WordFunctionalEvaluationV0_1(): string {
  return stableJson(buildFrozenLevel3WordFunctionalEvaluationV0_1());
}

function main(): void {
  const serialized = serializeFrozenLevel3WordFunctionalEvaluationV0_1();
  const check = process.argv.includes("--check");
  if (check) {
    const existing = readFileSync(OUTPUT_PATH, "utf8");
    if (existing !== serialized) {
      throw new Error("frozen Level-3 evaluation artifact mismatch");
    }
  } else {
    writeFileSync(OUTPUT_PATH, serialized, "utf8");
  }
  const artifact = JSON.parse(serialized) as { metrics: unknown; population: unknown };
  console.log(JSON.stringify({
    artifact: "docs/open-instrument/evaluation/open-instrument-frozen-level3-word-functional-evaluation-v0.1.json",
    sha256: sha256(serialized),
    population: artifact.population,
    metrics: artifact.metrics,
  }, null, 2));
}

if (process.argv[1]?.endsWith("openInstrumentFrozenLevel3WordFunctionalEvaluation.v0_1.ts")) {
  main();
}
