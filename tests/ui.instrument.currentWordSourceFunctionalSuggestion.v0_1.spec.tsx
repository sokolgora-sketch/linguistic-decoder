import { fireEvent, render, screen } from "@testing-library/react";
import {
  buildCurrentWordDaAnchoredEmbryoCandidateV0_1,
  buildCurrentWordExploratoryMotivationV0_1,
  buildCurrentWordSourceFunctionalSuggestionV0_1,
  projectFreeOperatorFamilyFunctionalNetworkV0_1,
  type CurrentWordSourceFunctionalSuggestionDraftV0_1,
  type RuntimeAlbanianSourceSenseSelectionV0_1,
} from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";
import { DA_FREE_OPERATOR_PROFILE_V0_1 } from "@/shared/freeOperatorProfile.v0_1";
import { PROTO_ROOTS_V1 } from "@/shared/protoRoots.v1";
import { CurrentWordSourceFunctionalSuggestionV0_1 } from "@/ui/instrument/sections/CurrentWordSourceFunctionalSuggestionV0_1";
import { CurrentWordSymbolicDraftV0_1, buildCurrentWordSymbolicDraftProjectionV0_1 } from "@/ui/instrument/sections/CurrentWordSymbolicDraftV0_1";
import type { SymbolicFunctionalCompositionResultV0_3 } from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import {
  ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";

const DIVISION = "d:division";
const LIGHT = "d:light";
const INITIATE = "voice-a:initiate-ground";
const EXPAND = "voice-e:expand-outward";

function validDraft(overrides: Partial<CurrentWordSourceFunctionalSuggestionDraftV0_1> = {}): CurrentWordSourceFunctionalSuggestionDraftV0_1 {
  return {
    analyzedWord: "NDARJE",
    draftTargetWord: "NDARJE",
    language: "Albanian",
    variety: "Standard Albanian",
    sourceTargetForm: "NDARJE",
    targetSenseLabel: "Action/state corresponding to NDAJ or NDAHEM",
    targetSenseDefinition: "Action or state of separating, as described through the related verbs.",
    targetSourceLabel: "FJALË — NDARJE",
    targetSourceUrl: "https://fjale.al/ndarje",
    targetSourceLocator: "sense 1; action/state according to NDAJ and NDAHEM",
    relatedVerbForm: "NDAJ",
    verbFunctionText: "separate things or people that are together; divide a whole into parts",
    verbSourceLabel: "FJALË — NDAJ",
    verbSourceUrl: "https://fjale.al/ndaj",
    verbSourceLocator: "senses 1 and 5",
    sourceReportsActionRelation: true,
    alternativeSenseLabel: "Part or compartment",
    alternativeSenseDefinition: "A part into which something has been divided.",
    ...overrides,
  };
}

function fillNdarjeForm() {
  fireEvent.click(screen.getByText("Optional manual research fallback · enter separate source claims"));
  const values: ReadonlyArray<readonly [string, string]> = [
    ["Exact source target form", "NDARJE"],
    ["Source-reported target sense label", "Action/state corresponding to NDAJ or NDAHEM"],
    ["Source target sense paraphrase", "Action or state of separating according to the related verbs."],
    ["Related source verb form", "NDAJ"],
    ["Source verb function paraphrase", "separate things or people that are together; divide a whole into parts"],
    ["Target source label", "FJALË — NDARJE"],
    ["Target source URL", "https://fjale.al/ndarje"],
    ["Target source locator", "sense 1; action/state according to NDAJ and NDAHEM"],
    ["Verb source label", "FJALË — NDAJ"],
    ["Verb source URL", "https://fjale.al/ndaj"],
    ["Verb source locator", "senses 1 and 5"],
    ["Alternative source sense label", "Part or compartment"],
    ["Alternative source sense paraphrase", "A part into which something has been divided."],
  ];
  for (const [label, value] of values) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
  fireEvent.click(screen.getByLabelText("Source explicitly relates this action sense to the verb"));
}

function runtimeNdarjeSense(): RuntimeAlbanianSourceSenseSelectionV0_1 {
  return {
    exactSourceForm: "ndarje",
    apiUrl: "https://fjalorishqip.org/api/v1/fjala/ndarje.json",
    licence: "CC BY-SA 4.0",
    analysisLanguage: "sq",
    analysisVariety: "Standard Albanian",
    recordSources: ["sq-wiktionary", "editor"],
    selectedSense: {
      entryIndex: 1,
      senseIndex: 1,
      partOfSpeech: "noun",
      gloss: "division; separation",
      glossLanguage: "en",
      senseSource: "sq-wiktionary",
      tags: ["noun"],
      entrySources: ["sq-wiktionary", "editor"],
    },
    alternativeSenses: [{
      entryIndex: 1,
      senseIndex: 2,
      partOfSpeech: "noun",
      gloss: "a divided part",
      glossLanguage: "en",
      senseSource: "editor",
      tags: [],
      entrySources: ["sq-wiktionary", "editor"],
    }],
  };
}

function exactNdarjeSourceFact(
  overrides: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1> = {},
): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  return {
    sourceRecordId: "kaikki-albanian-jsonl:word=ndarje:ordinal=0",
    entryLocator: "word=ndarje#Albanian#1",
    physicalRecordOrdinal: 0,
    language: "Albanian",
    languageCode: "sq",
    form: "ndarje",
    partOfSpeech: "noun",
    senses: [
      { senseId: "ndarje-sense-1", glosses: ["division; separation"] },
      { senseId: "ndarje-sense-2", glosses: ["a part into which something has been divided"] },
    ],
    ipaObservations: [],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1,
    sourceSnapshot: {
      sourceFamilyId: "kaikki-albanian-jsonl-v1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/meaning/n/nd/ndarje.html",
      sha256: "b".repeat(64),
      bytes: 128,
    },
    ...overrides,
  };
}

function evaluatedNdarje(associationCandidateId = DIVISION, includeExpand = true): SymbolicFunctionalCompositionResultV0_3 {
  const empty = buildCurrentWordSymbolicDraftProjectionV0_1({
    exactSpelling: "NDARJE",
    language: "sq",
    variety: "Standard Albanian",
    selections: { spectrumCandidateByOccurrenceId: {}, voiceDraftByEventId: {} },
  });
  if (!empty.structure.ok) throw new Error("NDARJE structure did not compile in test fixture");
  const occurrence = empty.structure.spectrumOccurrences.find(({ unit }) => unit === "D");
  const aEvent = empty.structure.voiceEvents.find(({ voice, position }) => voice === "A" && position === 2);
  const eEvent = empty.structure.voiceEvents.find(({ voice, position }) => voice === "E" && position === 5);
  if (!occurrence || !aEvent || !eEvent) throw new Error("NDARJE D/A/E test occurrences were not found");
  return buildCurrentWordSymbolicDraftProjectionV0_1({
    exactSpelling: "NDARJE",
    language: "sq",
    variety: "Standard Albanian",
    selections: {
      spectrumCandidateByOccurrenceId: { [occurrence.occurrenceId]: associationCandidateId },
      voiceDraftByEventId: {
        [aEvent.eventId]: { operatorCandidateId: INITIATE, operandOccurrenceId: occurrence.occurrenceId },
        ...(includeExpand ? { [eEvent.eventId]: { operatorCandidateId: EXPAND, operandVoiceEventId: aEvent.eventId, operandOccurrenceId: "" } } : {}),
      },
    },
  }).evaluation;
}

function daCandidate(overrides: Partial<Parameters<typeof buildCurrentWordDaAnchoredEmbryoCandidateV0_1>[0]> = {}) {
  const base = {
    analyzedWord: "NDARJE",
    draftTargetWord: "NDARJE",
    identityMatches: true,
    language: "Albanian",
    variety: "Standard Albanian",
    selectedSourceSense: runtimeNdarjeSense(),
    evaluation: evaluatedNdarje(),
    proposedOccurrenceId: null,
    ...overrides,
  };
  const unselected = buildCurrentWordDaAnchoredEmbryoCandidateV0_1(base);
  const occurrenceId = base.proposedOccurrenceId ?? unselected.occurrences[0]?.occurrenceId ?? null;
  return buildCurrentWordDaAnchoredEmbryoCandidateV0_1({ ...base, proposedOccurrenceId: occurrenceId });
}

function generatedDaCandidate(
  overrides: Partial<Parameters<typeof buildCurrentWordDaAnchoredEmbryoCandidateV0_1>[0]> = {},
) {
  const noOperations = buildCurrentWordSymbolicDraftProjectionV0_1({
    exactSpelling: "NDARJE",
    language: "sq",
    variety: "Standard Albanian",
    selections: { spectrumCandidateByOccurrenceId: {}, voiceDraftByEventId: {} },
  }).evaluation;
  return buildCurrentWordDaAnchoredEmbryoCandidateV0_1({
    analyzedWord: "NDARJE",
    draftTargetWord: "NDARJE",
    identityMatches: true,
    language: "Albanian",
    variety: "Standard Albanian",
    selectedSourceSense: null,
    exactSourceFacts: [exactNdarjeSourceFact()],
    evaluation: noOperations,
    proposedOccurrenceId: null,
    ...overrides,
  });
}

describe("current-word source functional suggestion v0.1", () => {
  it("generates unselected DA-to-sense functional candidates from exact target facts without manual sense or Voice choices", () => {
    const sourceFact = exactNdarjeSourceFact({ form: "NDARJE" });
    const candidate = generatedDaCandidate({ exactSourceFacts: [sourceFact] });
    const generated = candidate.generatedFunctionalMotivation;

    expect(generated.status).toBe("CANDIDATES_AVAILABLE");
    expect(generated.reasonCodes).toEqual([]);
    expect(generated.candidates).toHaveLength(2);
    expect(generated.candidates.map(({ targetSenseOrdinal }) => targetSenseOrdinal)).toEqual([1, 2]);
    expect(generated.candidates[0]).toMatchObject({
      occurrence: { exactSurface: "DA", span: { start: 1, end: 3 } },
      targetSource: { provider: "KAIKKI", sourceFact, senseOrdinal: 1, senseId: "ndarje-sense-1" },
      targetSenseGlosses: ["division; separation"],
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      generatedBy: "DA_REVIEWED_SOURCE_PLUS_EXACT_FORM",
      selectionStatus: "UNSELECTED",
      wholeWordStatus: "PARTIAL_NULL",
      sourceAuthorityPromotion: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    });
    expect(generated.candidates[0].familyNetwork).toMatchObject({
      status: "CONDITIONAL_FAMILY_READING",
      embryo: {
        form: "da",
        functionText: "to split, cut, divide",
        sourceStatus: "reviewed_accepted",
        claimLayer: "SOURCE_FACT",
      },
      directForms: expect.arrayContaining([
        expect.objectContaining({ form: "daj", profileClassification: "DIRECT_FREE_OPERATOR_FORM" }),
      ]),
      derivativeFamilyForms: expect.arrayContaining([
        expect.objectContaining({ form: "ndaj", profileClassification: "DERIVATIVE_FAMILY_SUPPORT" }),
        expect.objectContaining({ form: "ndarë", profileClassification: "DERIVATIVE_FAMILY_SUPPORT" }),
      ]),
      target: {
        exactForm: "NDARJE",
        senseText: "division; separation",
        sourceIdentity: sourceFact.sourceRecordId,
        evidenceStatus: "OBSERVED_EXTERNAL_SNAPSHOT",
        claimLayer: "SOURCE_FACT",
      },
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      evidenceStatus: "GENERATED_UNSELECTED_CANDIDATE",
      selectionStatus: "UNSELECTED",
      wholeWordStatus: "PARTIAL_NULL",
      sourceAuthorityPromotion: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    });
    expect(generated.candidates[0].familyNetwork.functionalEquation).toContain("to split, cut, divide");
    expect(generated.candidates[0].familyNetwork.functionalEquation).toContain("NDARJE sense “division; separation”");
    expect(generated.candidates[0].functionalReading).toContain("divide / share");
    expect(generated.candidates[0].functionalReading).toContain("divided");
    expect(generated.candidates[0].functionalReading).toContain("bounded functional point of comparison");
    expect(generated.candidates[0].functionalReading).toContain("intermediate result-state function remains UNKNOWN_OR_NULL");
    expect(generated.candidates[0].functionalReading).toContain("does not establish that the listed forms descend from one another");
    expect(generated.candidates[0].functionalReading).toContain("NDARJE has this morphology");
    expect(generated.candidates[0].familyNetwork.directForms.find(({ form }) => form === "daj")?.carrierAnnotation).toMatchObject({
      gloss: "split / divide",
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      evidenceStatus: "CANDIDATE_CARRIER_ANNOTATION_NOT_SOURCE_FACT",
      sourceIds: [],
    });
    expect(generated.candidates[0].familyNetwork.derivativeFamilyForms.find(({ form }) => form === "ndare")?.carrierAnnotation).toBeNull();
    expect(candidate.exactCodePoints).toEqual(
      Array.from("NDARJE").map((character, position) => ({ character, position })),
    );
    expect(candidate.writtenVoices).toEqual([
      { voice: "A", position: 2 },
      { voice: "E", position: 5 },
    ]);
    expect(generated.candidates[0].unresolvedMaterial).toEqual(expect.arrayContaining([
      "Intermediate result-state function remains UNKNOWN_OR_NULL unless independently characterized",
      "N@0 functional association UNKNOWN_OR_NULL",
      "R@3 functional association UNKNOWN_OR_NULL",
      "J@4 functional association UNKNOWN_OR_NULL",
      "A@2 symbolic role UNKNOWN_OR_NULL; written Voice preserved",
      "E@5 symbolic role UNKNOWN_OR_NULL; written Voice preserved",
    ]));
  });

  it("reuses the generic family projection for NDAJ but keeps its whole-word sense Null without exact-source evidence", () => {
    const candidate = generatedDaCandidate();
    if (!candidate.standaloneEvidence) throw new Error("expected the reviewed DA source evidence");
    const projection = projectFreeOperatorFamilyFunctionalNetworkV0_1({
      profile: DA_FREE_OPERATOR_PROFILE_V0_1,
      protoRoot: PROTO_ROOTS_V1.find(({ id }) => id === "DA") ?? null,
      reviewedEmbryo: candidate.standaloneEvidence,
      targetForm: "NDAJ",
      targetSense: null,
    });

    expect(projection.status).toBe("PARTIAL_NULL");
    expect(projection.directForms).toEqual(expect.arrayContaining([
      expect.objectContaining({ form: "daj", profileClassification: "DIRECT_FREE_OPERATOR_FORM" }),
    ]));
    expect(projection.derivativeFamilyForms).toEqual(expect.arrayContaining([
      expect.objectContaining({
        form: "ndaj",
        profileClassification: "DERIVATIVE_FAMILY_SUPPORT",
        carrierAnnotation: expect.objectContaining({
          gloss: "divide / share",
          claimLayer: "EXPLORATORY_HYPOTHESIS",
          sourceIds: [],
        }),
      }),
    ]));
    expect(projection.target).toBeNull();
    expect(projection.functionalEquation).toBeNull();
    expect(projection.explanation).toBeNull();
    expect(projection.reasonCodes).toContain("EXACT_TARGET_SOURCE_SENSE_NOT_AVAILABLE");
    expect(projection.wholeWordStatus).toBe("PARTIAL_NULL");
  });

  it("keeps a second DA-family target available with or without an optional carrier annotation", () => {
    const candidate = generatedDaCandidate();
    if (!candidate.standaloneEvidence) throw new Error("expected the reviewed DA source evidence");
    const protoRoot = PROTO_ROOTS_V1.find(({ id }) => id === "DA");
    if (!protoRoot) throw new Error("expected the existing DA ProtoRoots record");

    // Synthetic shape-only input: NDAJ is not asserted here as live source evidence.
    const targetSense = {
      exactSourceForm: "ndaj",
      glosses: ["separation"],
      sourceIdentity: "synthetic-test-fixture:NDAJ-sense-not-live-evidence",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED" as const,
    };
    const project = (root: typeof protoRoot) => projectFreeOperatorFamilyFunctionalNetworkV0_1({
      profile: DA_FREE_OPERATOR_PROFILE_V0_1,
      protoRoot: root,
      reviewedEmbryo: candidate.standaloneEvidence!,
      targetForm: "NDAJ",
      targetSense,
    });

    const withCarrierAnnotation = project(protoRoot);
    const withoutOptionalCarrierAnnotation = project({
      ...protoRoot,
      carriers: protoRoot.carriers.filter(({ lang, form }) =>
        !(lang === "sq" && form.toLocaleLowerCase("sq-AL") === "ndarë"),
      ),
    });

    expect(withCarrierAnnotation.status).toBe("CONDITIONAL_FAMILY_READING");
    expect(withCarrierAnnotation.target).toMatchObject({
      exactForm: "ndaj",
      senseText: "separation",
      sourceIdentity: "synthetic-test-fixture:NDAJ-sense-not-live-evidence",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
    });
    expect(withCarrierAnnotation.explanation).toContain("NDARË “divided”");
    expect(withCarrierAnnotation.explanation).toContain("intermediate result-state function remains UNKNOWN_OR_NULL");
    expect(withCarrierAnnotation.reasonCodes).toEqual([]);

    expect(withoutOptionalCarrierAnnotation.status).toBe("CONDITIONAL_FAMILY_READING");
    expect(withoutOptionalCarrierAnnotation.derivativeFamilyForms.find(({ form }) => form === "ndarë")?.carrierAnnotation).toBeNull();
    expect(withoutOptionalCarrierAnnotation.functionalEquation).toContain("NDAJ sense “separation”");
    expect(withoutOptionalCarrierAnnotation.explanation).not.toContain("NDARË “divided”");
    expect(withoutOptionalCarrierAnnotation.explanation).toContain("intermediate result-state function remains UNKNOWN_OR_NULL");
    expect(withoutOptionalCarrierAnnotation.reasonCodes).toEqual([]);
  });

  it("keeps a valid conditional reading when ProtoRoots enrichment is absent", () => {
    const candidate = generatedDaCandidate();
    const reviewedEmbryo = candidate.standaloneEvidence;
    if (!reviewedEmbryo) throw new Error("expected the reviewed DA source evidence");

    // Synthetic contract fixture only; it is not a live NDARJE source record.
    const projection = projectFreeOperatorFamilyFunctionalNetworkV0_1({
      profile: DA_FREE_OPERATOR_PROFILE_V0_1,
      protoRoot: null,
      reviewedEmbryo,
      targetForm: "NDARJE",
      targetSense: {
        exactSourceForm: "ndarje",
        glosses: ["division; separation"],
        sourceIdentity: "synthetic-test-fixture:NDARJE-sense-not-live-evidence",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      },
    });

    expect(projection.status).toBe("CONDITIONAL_FAMILY_READING");
    expect(projection.reasonCodes).toEqual([]);
    expect(projection.directForms.every(({ carrierAnnotation }) => carrierAnnotation === null)).toBe(true);
    expect(projection.derivativeFamilyForms.every(({ carrierAnnotation }) => carrierAnnotation === null)).toBe(true);
    expect(projection.functionalEquation).toContain("ProtoRoots carrier annotations are UNKNOWN_OR_NULL");
    expect(projection.functionalEquation).toContain("intermediate result-state function UNKNOWN_OR_NULL");
    expect(projection.wholeWordStatus).toBe("PARTIAL_NULL");
  });

  it("ignores a mismatched ProtoRoots record without contaminating the valid base reading", () => {
    const candidate = generatedDaCandidate();
    const reviewedEmbryo = candidate.standaloneEvidence;
    const daProtoRoot = PROTO_ROOTS_V1.find(({ id }) => id === "DA");
    if (!reviewedEmbryo || !daProtoRoot) throw new Error("expected reviewed DA evidence and its ProtoRoots record");

    // Synthetic mismatched record deliberately carries colliding forms to prove it is ignored.
    const mismatchedProtoRoot = {
      ...daProtoRoot,
      id: "DI",
      carriers: [
        { lang: "sq", form: "da", gloss: "unrelated root contamination" },
        { lang: "sq", form: "ndaj", gloss: "unrelated family contamination" },
      ],
    };
    const projection = projectFreeOperatorFamilyFunctionalNetworkV0_1({
      profile: DA_FREE_OPERATOR_PROFILE_V0_1,
      protoRoot: mismatchedProtoRoot,
      reviewedEmbryo,
      targetForm: "NDARJE",
      targetSense: {
        exactSourceForm: "ndarje",
        glosses: ["division; separation"],
        sourceIdentity: "synthetic-test-fixture:NDARJE-sense-not-live-evidence",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      },
    });

    expect(projection.status).toBe("CONDITIONAL_FAMILY_READING");
    expect(projection.reasonCodes).toEqual([]);
    expect(projection.explanation).toContain("mismatched record ignored");
    expect(projection.explanation).toContain("ProtoRoots carrier annotations are UNKNOWN_OR_NULL");
    expect(JSON.stringify(projection)).not.toContain("unrelated root contamination");
    expect(JSON.stringify(projection)).not.toContain("unrelated family contamination");
    expect([...projection.directForms, ...projection.derivativeFamilyForms]
      .every(({ carrierAnnotation }) => carrierAnnotation === null)).toBe(true);
  });

  it("keeps the base proposal when derivative-family profile data is absent and marks that layer Null", () => {
    const candidate = generatedDaCandidate();
    const reviewedEmbryo = candidate.standaloneEvidence;
    const protoRoot = PROTO_ROOTS_V1.find(({ id }) => id === "DA");
    if (!reviewedEmbryo || !protoRoot) throw new Error("expected reviewed DA evidence and its ProtoRoots record");

    const projection = projectFreeOperatorFamilyFunctionalNetworkV0_1({
      profile: { ...DA_FREE_OPERATOR_PROFILE_V0_1, derivativeFamilySupport: undefined },
      protoRoot,
      reviewedEmbryo,
      targetForm: "NDARJE",
      targetSense: {
        exactSourceForm: "ndarje",
        glosses: ["division; separation"],
        sourceIdentity: "synthetic-test-fixture:NDARJE-sense-not-live-evidence",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      },
    });

    expect(projection.status).toBe("CONDITIONAL_FAMILY_READING");
    expect(projection.reasonCodes).toEqual([]);
    expect(projection.derivativeFamilyForms).toEqual([]);
    expect(projection.functionalEquation).toContain("derivative-family support UNKNOWN_OR_NULL");
    expect(projection.unresolvedMaterial).toContain("Derivative-family forms and function remain UNKNOWN_OR_NULL");
    expect(projection.functionalEquation).toContain("intermediate result-state function UNKNOWN_OR_NULL");
    expect(projection.wholeWordStatus).toBe("PARTIAL_NULL");
  });

  it("withholds the conditional reading when the reviewed embryo or its source identity is missing", () => {
    const candidate = generatedDaCandidate();
    const reviewedEmbryo = candidate.standaloneEvidence;
    const protoRoot = PROTO_ROOTS_V1.find(({ id }) => id === "DA");
    if (!reviewedEmbryo || !protoRoot) throw new Error("expected reviewed DA evidence and its ProtoRoots record");

    const targetSense = {
      exactSourceForm: "ndarje",
      glosses: ["division; separation"],
      sourceIdentity: "synthetic-test-fixture:NDARJE-sense-not-live-evidence",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED" as const,
    };
    const missingEmbryo = projectFreeOperatorFamilyFunctionalNetworkV0_1({
      profile: DA_FREE_OPERATOR_PROFILE_V0_1,
      protoRoot,
      reviewedEmbryo: null,
      targetForm: "NDARJE",
      targetSense,
    });
    expect(missingEmbryo.status).toBe("PARTIAL_NULL");
    expect(missingEmbryo.embryo).toBeNull();
    expect(missingEmbryo.functionalEquation).toBeNull();
    expect(missingEmbryo.reasonCodes).toContain("REVIEWED_EMBRYO_NOT_AVAILABLE");

    const missingIdentity = projectFreeOperatorFamilyFunctionalNetworkV0_1({
      profile: DA_FREE_OPERATOR_PROFILE_V0_1,
      protoRoot,
      reviewedEmbryo: { ...reviewedEmbryo, sourceId: " " },
      targetForm: "NDARJE",
      targetSense,
    });
    expect(missingIdentity.status).toBe("PARTIAL_NULL");
    expect(missingIdentity.reasonCodes).toContain("REVIEWED_EMBRYO_SOURCE_IDENTITY_NOT_AVAILABLE");
    expect(missingIdentity.functionalEquation).toBeNull();
  });

  it("shows the staged DA-family explanation automatically without selecting a sense, DA mapping, or Voice operator", () => {
    render(
      <CurrentWordSourceFunctionalSuggestionV0_1
        analyzedWord="NDARJE"
        draftTargetWord="NDARJE"
        language="Albanian"
        variety="Standard Albanian"
        identityMatches
        sourceFacts={[exactNdarjeSourceFact({
          senses: [{ senseId: "ndarje-sense-1", glosses: ["division; separation"] }],
        })]}
      />,
    );

    const network = screen.getByTestId("current-word-da-family-functional-network");
    expect(network).toHaveTextContent("DA");
    expect(network).toHaveTextContent("DAJ");
    expect(network).toHaveTextContent("NDAJ");
    expect(network).toHaveTextContent("NDARË");
    expect(network).toHaveTextContent("divided");
    expect(network).toHaveTextContent("NDARJE");
    expect(network).toHaveTextContent("division; separation");
    expect(network).toHaveTextContent("EXPLORATORY_HYPOTHESIS");
    expect(network).toHaveTextContent("UNSELECTED");
    expect(network).toHaveTextContent("PARTIAL_NULL");
    expect(network).toHaveTextContent("sourceAuthorityPromotion NONE");
    expect(network).toHaveTextContent("historicalOrigin NOT_CLAIMED");
    expect(network).toHaveTextContent("no_single_winner / user_decides");
    expect(screen.getByTestId("current-word-da-candidate-structure")).toHaveTextContent(
      "N@0 · D@1 · A@2 · R@3 · J@4 · E@5 · written Voices A@2 → E@5",
    );
    expect(screen.getByLabelText("Propose DA at code-point span 1 to 3")).not.toBeChecked();
    expect(screen.getByTestId("current-word-source-functional-manual-fallback")).not.toHaveAttribute("open");
    const unresolved = screen.getByTestId("current-word-da-generated-unresolved");
    expect(unresolved).toHaveTextContent("N@0 functional association UNKNOWN_OR_NULL");
    expect(unresolved).toHaveTextContent("R@3 functional association UNKNOWN_OR_NULL");
    expect(unresolved).toHaveTextContent("J@4 functional association UNKNOWN_OR_NULL");
  });

  it.each([
    ["no exact target source fact", [], "EXACT_TARGET_SOURCE_FACTS_NOT_AVAILABLE"],
    ["a source fact for another form", [exactNdarjeSourceFact({ form: "NDAJ" })], "EXACT_TARGET_SOURCE_FACTS_NOT_AVAILABLE"],
    ["a non-fact record", [exactNdarjeSourceFact({ attestationTruth: "candidate" as unknown as "fact" })], "EXACT_TARGET_SOURCE_FACTS_NOT_AVAILABLE"],
    ["a source record without a valid snapshot identity", [exactNdarjeSourceFact({ sourceSnapshot: { sourceFamilyId: "fixture", sourceUrl: "https://example.invalid", sha256: "not-a-hash", bytes: 0 } })], "EXACT_TARGET_SOURCE_FACTS_NOT_AVAILABLE"],
  ])("keeps generated DA motivation Null for %s", (_label, exactSourceFacts, reasonCode) => {
    const candidate = generatedDaCandidate({ exactSourceFacts });
    expect(candidate.generatedFunctionalMotivation.status).toBe("PARTIAL_NULL");
    expect(candidate.generatedFunctionalMotivation.candidates).toEqual([]);
    expect(candidate.generatedFunctionalMotivation.reasonCodes).toContain(reasonCode);
  });

  it("does not force the DA function onto an unrelated exact-form source sense", () => {
    const sourceFact = exactNdarjeSourceFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=dallim:ordinal=0",
      entryLocator: "word=dallim#Albanian#1",
      form: "dallim",
      senses: [{ senseId: "dallim-sense-1", glosses: ["act of distinguishing"] }],
    });
    const candidate = generatedDaCandidate({
      analyzedWord: "DALLIM",
      draftTargetWord: "DALLIM",
      exactSourceFacts: [sourceFact],
    });

    expect(candidate.generatedFunctionalMotivation.status).toBe("PARTIAL_NULL");
    expect(candidate.generatedFunctionalMotivation.candidates).toEqual([]);
    expect(candidate.generatedFunctionalMotivation.reasonCodes).toContain(
      "DA_FUNCTIONAL_DOMAIN_NOT_MATCHED_TO_TARGET_SENSE",
    );
  });

  it.each([
    ["unconfirmed analysis identity", { identityMatches: false }, "ANALYSIS_IDENTITY_NOT_CONFIRMED"],
    ["changed target identity", { draftTargetWord: "NDAJ" }, "CURRENT_WORD_IDENTITY_MISMATCH"],
    ["non-Albanian language", { language: "English" }, "TARGET_LANGUAGE_NOT_ALBANIAN"],
    ["non-Albanian variety", { variety: "English" }, "TARGET_VARIETY_REQUIRED"],
  ])("withholds generated DA candidates for %s", (_label, overrides, reasonCode) => {
    const candidate = generatedDaCandidate(overrides);
    expect(candidate.generatedFunctionalMotivation.status).toBe("PARTIAL_NULL");
    expect(candidate.generatedFunctionalMotivation.candidates).toEqual([]);
    expect(candidate.generatedFunctionalMotivation.reasonCodes).toContain(reasonCode);
  });

  it("computes a repeatable conditional function from an explicitly entered exact target relation", () => {
    const first = buildCurrentWordSourceFunctionalSuggestionV0_1(validDraft());
    const second = buildCurrentWordSourceFunctionalSuggestionV0_1(validDraft());
    expect(first).toEqual(second);
    expect(first.status).toBe("CONDITIONAL_SUGGESTION");
    expect(first.result?.ok).toBe(true);
    if (!first.result?.ok) return;

    const { content } = first.result;
    expect(content.target.codePoints).toEqual(Array.from("NDARJE").map((character, position) => ({ character, position })));
    expect(content.target.writtenVoices).toEqual([{ voice: "A", position: 2 }, { voice: "E", position: 5 }]);
    expect(content.target.pronunciationAuthority).toBe("NOT_ESTABLISHED");
    expect(content.compositions).toHaveLength(1);
    expect(content.compositions[0]).toMatchObject({
      resultText: "Action/process corresponding to the verb function: separate things or people that are together; divide a whole into parts",
      claimLayer: "LOGICAL_INFERENCE",
      status: "COMPOSED_FROM_SOURCE_RELATION",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      linguisticApplicability: "NOT_ASSESSED",
      provenance: {
        relation: { claimLayer: "SOURCE_FACT", evidenceStatus: "CITATION_ENTERED_UNVERIFIED", sourceIds: ["entered-target-source-citation"] },
        function: { claimLayer: "SOURCE_FACT", evidenceStatus: "CITATION_ENTERED_UNVERIFIED", sourceIds: ["entered-verb-source-citation"] },
      },
    });
    expect(content.target.alternativeSenses).toEqual([expect.objectContaining({
      label: "Part or compartment",
      functionalFrame: "OTHER",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
    })]);
    expect(content.segmentations).toEqual([]);
    expect(content.consonantStructures.filter(({ character }) => ["N", "R", "J"].includes(character)).every(({ status }) => status === "UNKNOWN_OR_NULL")).toBe(true);
    expect(content.voiceEvents.map(({ voice, position, roleStatus }) => ({ voice, position, roleStatus }))).toEqual([
      { voice: "A", position: 2, roleStatus: "UNKNOWN_OR_NULL" },
      { voice: "E", position: 5, roleStatus: "UNKNOWN_OR_NULL" },
    ]);
    expect(content.selection).toEqual({ mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" });
    expect(content.sourceAuthorityPromotion).toBe("NONE");
    expect(content.historicalOrigin).toBe("NOT_CLAIMED");

    const normalizedSourceForm = buildCurrentWordSourceFunctionalSuggestionV0_1(validDraft({ sourceTargetForm: " ndarje " }));
    expect(normalizedSourceForm.status).toBe("CONDITIONAL_SUGGESTION");
  });

  it.each([
    ["rejects a different target source form", { sourceTargetForm: "NDAJ" }, "SOURCE_TARGET_FORM_MISMATCH"],
    ["rejects a changed draft identity", { draftTargetWord: "NDAJ" }, "CURRENT_WORD_IDENTITY_MISMATCH"],
    ["rejects a non-Albanian target context", { language: "English" }, "TARGET_LANGUAGE_NOT_ALBANIAN"],
    ["rejects a language label that merely contains Albanian", { language: "not Albanian" }, "TARGET_LANGUAGE_NOT_ALBANIAN"],
    ["requires an explicit source-reported relation", { sourceReportsActionRelation: false }, "SOURCE_ACTION_RELATION_NOT_ENTERED"],
    ["rejects a partial alternative sense", { alternativeSenseDefinition: "" }, "ALTERNATIVE_SENSE_INCOMPLETE"],
  ])("%s", (_label, overrides, reasonCode) => {
    const result = buildCurrentWordSourceFunctionalSuggestionV0_1(validDraft(overrides));
    expect(result.status).toBe("PARTIAL_NULL");
    expect(result.result).toBeNull();
    expect(result.reasonCodes).toContain(reasonCode);
  });

  it("keeps source-not-found as Null until the user enters and classifies separate citations", () => {
    render(
      <CurrentWordSourceFunctionalSuggestionV0_1
        analyzedWord="NDARJE"
        draftTargetWord="NDARJE"
        language="Albanian"
        variety="Standard Albanian"
        identityMatches
        runtimeSourceStatus={{ status: "SOURCE_NOT_FOUND", reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND" }}
      />,
    );
    expect(screen.getByTestId("current-word-source-suggestion-runtime-status")).toHaveTextContent("SOURCE_NOT_FOUND");
    expect(screen.getByTestId("current-word-exploratory-null")).toHaveTextContent("SOURCE_SENSE_NOT_SELECTED");
    expect(screen.getByTestId("current-word-source-functional-null")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.queryByTestId("current-word-source-functional-suggestion-text")).not.toBeInTheDocument();

    fillNdarjeForm();
    expect(screen.getByTestId("current-word-source-functional-suggestion-text")).toHaveTextContent("NDARJE: Action/process corresponding to the verb function");
    expect(screen.getByTestId("current-word-source-functional-suggestion-text")).toHaveTextContent("separate things or people that are together; divide a whole into parts");
    expect(screen.getByTestId("current-word-source-functional-suggestion-text").parentElement).toHaveTextContent("LOGICAL_INFERENCE");
    expect(screen.getByTestId("current-word-source-functional-suggestion-text").parentElement).toHaveTextContent("CITATION_ENTERED_UNVERIFIED");
    expect(screen.getByTestId("current-word-source-functional-suggestion-text").parentElement).toHaveTextContent("NOT_ASSESSED");
    expect(screen.getByTestId("current-word-source-functional-alternative")).toHaveTextContent("Part or compartment");
    expect(screen.getByTestId("current-word-source-functional-relation")).toHaveTextContent("Why suggested");
    expect(screen.getByTestId("current-word-source-functional-details")).not.toHaveAttribute("open");
    fireEvent.click(screen.getByText("View source and structural accounting"));
    expect(screen.getByTestId("current-word-source-functional-code-points")).toHaveTextContent("N@0 · D@1 · A@2 · R@3 · J@4 · E@5");
    expect(screen.getByText(/source authority promotion: NONE/)).toBeInTheDocument();
    expect(screen.getByText(/Unassigned target Voice roles: A@2, E@5 · UNKNOWN_OR_NULL/)).toBeInTheDocument();
    expect(screen.getByText(/Unassigned consonant associations: N@0, D@1, R@3, J@4 · UNKNOWN_OR_NULL/)).toBeInTheDocument();
  });

  it("generates a conditional reading from the selected runtime sense and computed evaluator outputs", () => {
    const selection = runtimeNdarjeSense();
    const evaluation = evaluatedNdarje();
    if (!evaluation.ok) throw new Error("expected successful symbolic evaluation");
    const projection = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: selection,
      evaluation,
    });

    expect(projection.status).toBe("CONDITIONAL_SUGGESTION");
    expect(projection.sourceContent?.ok).toBe(true);
    if (!projection.sourceContent?.ok) return;
    expect(projection.sourceContent.content.target.codePoints).toEqual(
      Array.from("NDARJE").map((character, position) => ({ character, position })),
    );
    expect(projection.sourceContent.content.target.writtenVoices).toEqual([
      { voice: "A", position: 2 },
      { voice: "E", position: 5 },
    ]);
    expect(projection.sourceContent.content.target.selectedSense).toMatchObject({
      label: "division; separation",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      functionalFrame: "UNKNOWN_OR_NULL",
    });
    expect(projection.computedContributions.map(({ contribution }) => contribution)).toEqual([
      "INITIATE / GROUND(division) → initiated(division)",
      "EXPAND / OUTWARD(initiated(division)) → expanded(initiated(division))",
    ]);
    expect(projection.conditionalExplanation).toContain("could be proposed as a conditional functional framing");
    expect(projection.reasonCodes).toContain("SOURCE_SYMBOLIC_RELATION_NOT_REPORTED");
    expect(projection.wholeWordStatus).toBe("PARTIAL_NULL");
    expect(projection.sourceAuthorityPromotion).toBe("NONE");
    expect(projection.historicalOrigin).toBe("NOT_CLAIMED");
    expect(projection.noSingleWinner).toBe(true);
    expect(projection.userDecisionPosture).toBe("user_decides");

    const changed = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: selection,
      evaluation: evaluatedNdarje(LIGHT),
    });
    expect(changed.computedContributions[0]?.outputText).toBe("initiated(light)");
    expect(changed.conditionalExplanation).toContain("initiated(light)");
    expect(changed.conditionalExplanation).not.toContain("initiated(division)");
  });

  it("surfaces the reviewed standalone DA record and exact substring without selecting a target mapping", () => {
    const candidate = buildCurrentWordDaAnchoredEmbryoCandidateV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      identityMatches: true,
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation: evaluatedNdarje(),
      proposedOccurrenceId: null,
    });

    expect(candidate.status).toBe("CANDIDATE_AVAILABLE");
    expect(candidate.occurrences).toEqual([expect.objectContaining({
      exactSurface: "DA",
      span: { start: 1, end: 3 },
    })]);
    expect(candidate.selectedOccurrenceId).toBeNull();
    expect(candidate.targetMappingEvidenceStatus).toBe("NOT_SELECTED");
    expect(candidate.functionalReading).toBeNull();
    expect(candidate.standaloneEvidence).toMatchObject({
      operator: "DA",
      sourceForm: "da",
      dialect: "Gheg Albanian",
      sourceStatus: "reviewed_accepted",
      citationStatus: "reviewed_accepted",
      claimLayer: "SOURCE_FACT",
      freeOperatorCategories: expect.arrayContaining(["free_operator_attested"]),
    });
    expect(candidate.derivativeFamilySupport).toEqual(expect.arrayContaining([
      expect.objectContaining({ form: "ndaj", categories: ["derivative_family_support"] }),
      expect.objectContaining({ form: "ndarë", categories: ["derivative_family_support"] }),
    ]));
    expect(candidate.homophoneCollisionAlternatives).toEqual(expect.arrayContaining([
      expect.objectContaining({ form: "da", glossTerms: ["give", "gave", "given"], categories: ["homophone_collision"] }),
    ]));
    expect(candidate.exactCodePoints).toEqual(Array.from("NDARJE").map((character, position) => ({ character, position })));
    expect(candidate.writtenVoices).toEqual([{ voice: "A", position: 2 }, { voice: "E", position: 5 }]);
    expect(candidate.wholeWordStatus).toBe("PARTIAL_NULL");
    expect(candidate.sourceAuthorityPromotion).toBe("NONE");
    expect(candidate.historicalOrigin).toBe("NOT_CLAIMED");
    expect(candidate.noSingleWinner).toBe(true);
    expect(candidate.userDecisionPosture).toBe("user_decides");
  });

  it("builds a conditional DA-anchored reading only after explicit target-mapping selection", () => {
    const candidate = daCandidate();

    expect(candidate.status).toBe("CONDITIONAL_PROPOSAL");
    expect(candidate.selectedOccurrenceId).toBe(candidate.occurrences[0]?.occurrenceId);
    expect(candidate.targetMappingEvidenceStatus).toBe("USER_PROPOSED");
    expect(candidate.functionalReading).toContain("standalone Gheg source record reports da");
    expect(candidate.functionalReading).toContain("contains DA at code-point span [1,3)");
    expect(candidate.functionalReading).toContain("source-reported function “to split, cut, divide” may help motivate");
    expect(candidate.functionalReading).toContain("division; separation");
    expect(candidate.functionalReading).toContain("initiated(division)");
    expect(candidate.functionalReading).toContain("expanded(initiated(division))");
    expect(candidate.functionalReading).toContain("not an established morpheme or derivation");
    expect(candidate.computedVoiceOperations.map(({ voice, position, outputText }) => ({ voice, position, outputText }))).toEqual([
      { voice: "A", position: 2, outputText: "initiated(division)" },
      { voice: "E", position: 5, outputText: "expanded(initiated(division))" },
    ]);
    expect(candidate.overlappingVoiceEvents).toEqual([{ voice: "A", position: 2 }]);
    expect(candidate.writtenVoices).toContainEqual({ voice: "E", position: 5 });
    expect(candidate.unresolvedMaterial).toEqual(expect.arrayContaining([
      "N@0 functional association UNKNOWN_OR_NULL",
      "R@3 functional association UNKNOWN_OR_NULL",
      "J@4 functional association UNKNOWN_OR_NULL",
      "INTERNAL_SEGMENTATION_OR_MORPHOLOGY_NOT_ESTABLISHED",
    ]));
    expect(candidate.selectedSourceSense).toMatchObject({
      label: "division; separation",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
    });
    expect(candidate.alternatives).toEqual([expect.objectContaining({
      label: "a divided part",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
    })]);
    expect(candidate.reasoningTrace).not.toBeNull();
    expect(candidate.reasoningTrace?.target.exactSpelling).toBe("NDARJE");
    expect(candidate.reasoningTrace?.target.expectedWrittenVoices).toEqual([
      { voice: "A", position: 2 }, { voice: "E", position: 5 },
    ]);
    expect(candidate.reasoningTrace?.selection).toEqual({
      mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides",
    });
    expect(candidate.reasoningTrace?.sourceAuthorityPromotion).toBe("NONE");
    expect(candidate.reasoningTrace?.historicalOrigin).toBe("NOT_CLAIMED");
    expect(candidate.wholeWordStatus).toBe("PARTIAL_NULL");
  });

  it("recomputes the conditional reading from changed evaluator outputs", () => {
    const changed = daCandidate({ evaluation: evaluatedNdarje(LIGHT) });
    expect(changed.functionalReading).toContain("initiated(light)");
    expect(changed.functionalReading).toContain("expanded(initiated(light))");
    expect(changed.functionalReading).not.toContain("initiated(division)");
  });

  it("withholds the generated candidate reading when a selected Voice dependency is broken", () => {
    const evaluation = evaluatedNdarje();
    if (!evaluation.ok) throw new Error("expected successful symbolic evaluation");
    const brokenEvaluation = {
      ...evaluation,
      operationTrace: evaluation.operationTrace.map((trace) =>
        trace.kind === "APPLY_VOICE_OPERATOR" && trace.targetVoiceEventId === "voice:E@5"
          ? { ...trace, dependsOn: [] }
          : trace,
      ),
    } as SymbolicFunctionalCompositionResultV0_3;
    const candidate = daCandidate({ evaluation: brokenEvaluation });

    expect(candidate.status).toBe("PARTIAL_NULL");
    expect(candidate.functionalReading).toBeNull();
    expect(candidate.reasonCodes).toContain("SYMBOLIC_VOICE_OPERATION_NOT_VERIFIABLY_COMPUTED:draft-voice-1");
    expect(candidate.wholeWordStatus).toBe("PARTIAL_NULL");
  });

  it("keeps a checked proposal explicit but PARTIAL_NULL when no computed Voice output or source sense is available", () => {
    const noOperations = buildCurrentWordSymbolicDraftProjectionV0_1({
      exactSpelling: "NDARJE",
      language: "sq",
      variety: "Standard Albanian",
      selections: { spectrumCandidateByOccurrenceId: {}, voiceDraftByEventId: {} },
    }).evaluation;
    const unselected = buildCurrentWordDaAnchoredEmbryoCandidateV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      identityMatches: true,
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation: noOperations,
      proposedOccurrenceId: null,
    });
    const partial = buildCurrentWordDaAnchoredEmbryoCandidateV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      identityMatches: true,
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: null,
      evaluation: noOperations,
      proposedOccurrenceId: unselected.occurrences[0]?.occurrenceId ?? null,
    });

    expect(partial.status).toBe("PARTIAL_NULL");
    expect(partial.selectedOccurrenceId).toBe(unselected.occurrences[0]?.occurrenceId);
    expect(partial.targetMappingEvidenceStatus).toBe("USER_PROPOSED");
    expect(partial.functionalReading).toBeNull();
    expect(partial.reasonCodes).toEqual(expect.arrayContaining([
      "TARGET_SOURCE_SENSE_NOT_SELECTED",
      "NO_VERIFIABLY_COMPUTED_VOICE_OUTPUTS",
    ]));
    expect(partial.wholeWordStatus).toBe("PARTIAL_NULL");
  });

  it("keeps target identity, language, source sense and occurrence boundaries explicit", () => {
    const otherWord = buildCurrentWordSymbolicDraftProjectionV0_1({
      exactSpelling: "DALLIM",
      language: "sq",
      variety: "Standard Albanian",
      selections: { spectrumCandidateByOccurrenceId: {}, voiceDraftByEventId: {} },
    });
    const generic = buildCurrentWordDaAnchoredEmbryoCandidateV0_1({
      analyzedWord: "DALLIM",
      draftTargetWord: "DALLIM",
      identityMatches: true,
      language: "sq",
      variety: "Standard Albanian",
      selectedSourceSense: null,
      evaluation: otherWord.evaluation,
      proposedOccurrenceId: null,
    });
    expect(generic.occurrences.map(({ exactSurface, span }) => ({ exactSurface, span }))).toEqual([
      { exactSurface: "DA", span: { start: 0, end: 2 } },
    ]);
    expect(generic.functionalReading).toBeNull();
    expect(generic.targetMappingEvidenceStatus).toBe("NOT_SELECTED");

    const wrongIdentity = daCandidate({ draftTargetWord: "NDAJ" });
    expect(wrongIdentity.status).toBe("PARTIAL_NULL");
    expect(wrongIdentity.reasonCodes).toContain("CURRENT_WORD_IDENTITY_MISMATCH");
    expect(wrongIdentity.functionalReading).toBeNull();

    const wrongLanguage = daCandidate({ language: "English" });
    expect(wrongLanguage.status).toBe("PARTIAL_NULL");
    expect(wrongLanguage.reasonCodes).toContain("TARGET_LANGUAGE_NOT_ALBANIAN");
    expect(wrongLanguage.functionalReading).toBeNull();

    const unconfirmedIdentity = daCandidate({ identityMatches: false });
    expect(unconfirmedIdentity.status).toBe("PARTIAL_NULL");
    expect(unconfirmedIdentity.reasonCodes).toContain("ANALYSIS_IDENTITY_NOT_CONFIRMED");
    expect(unconfirmedIdentity.functionalReading).toBeNull();
    expect(unconfirmedIdentity.selectedSourceSense).toBeNull();
    expect(unconfirmedIdentity.alternatives).toEqual([]);

    const invalidOccurrence = daCandidate({ proposedOccurrenceId: "stale-occurrence" });
    expect(invalidOccurrence.status).toBe("PARTIAL_NULL");
    expect(invalidOccurrence.reasonCodes).toContain("DA_TARGET_MAPPING_SELECTION_NOT_IN_CURRENT_CANDIDATES");
    expect(invalidOccurrence.functionalReading).toBeNull();
  });

  it("requires explicit UI authorization and resets it when the selected sense changes", () => {
    const props = {
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      identityMatches: true,
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation: evaluatedNdarje(),
    };
    const { rerender } = render(<CurrentWordSourceFunctionalSuggestionV0_1 {...props} />);
    const checkbox = screen.getByLabelText("Propose DA at code-point span 1 to 3");
    expect(checkbox).not.toBeChecked();
    expect(screen.getByTestId("current-word-da-not-selected")).toHaveTextContent("no target mapping or interpretation is selected automatically");
    expect(screen.getByTestId("current-word-source-functional-manual-fallback")).not.toHaveAttribute("open");

    fireEvent.click(checkbox);
    expect(screen.getByTestId("current-word-exploratory-explanation")).toHaveTextContent("may help motivate");
    expect(screen.getByTestId("current-word-da-computed-operations")).toHaveTextContent("A@2");
    expect(screen.getByTestId("current-word-da-overlapping-voices")).toHaveTextContent("A@2");
    expect(screen.getByTestId("current-word-exploratory-selected-sense")).toHaveTextContent("SOURCE_FACT");
    expect(screen.getByTestId("current-word-exploratory-alternatives")).toHaveTextContent("a divided part");
    expect(screen.getByTestId("current-word-exploratory-decision")).toHaveTextContent("no_single_winner · user_decides");
    expect(screen.getAllByTestId("current-word-exploratory-explanation")).toHaveLength(1);
    expect(screen.queryByTestId("current-word-exploratory-computed-contributions")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("View DA candidate trace and evidence"));
    expect(screen.getByTestId("current-word-da-reasoning-trace")).toHaveTextContent("input");
    expect(screen.getByTestId("current-word-da-reasoning-trace")).toHaveTextContent("output");

    rerender(<CurrentWordSourceFunctionalSuggestionV0_1
      {...props}
      selectedSourceSense={{
        ...runtimeNdarjeSense(),
        selectedSense: { ...runtimeNdarjeSense().selectedSense, senseIndex: 2, gloss: "a divided part" },
      }}
    />);
    expect(screen.getByLabelText("Propose DA at code-point span 1 to 3")).not.toBeChecked();
    expect(screen.getByTestId("current-word-da-not-selected")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Propose DA at code-point span 1 to 3"));
    rerender(<CurrentWordSourceFunctionalSuggestionV0_1 {...props} identityMatches={false} />);
    expect(screen.getByLabelText("Propose DA at code-point span 1 to 3")).not.toBeChecked();
    expect(screen.getByTestId("current-word-da-not-selected")).toBeInTheDocument();

    rerender(<CurrentWordSourceFunctionalSuggestionV0_1
      {...props}
      analyzedWord="DALLIM"
      draftTargetWord="DALLIM"
      identityMatches={false}
      selectedSourceSense={null}
      evaluation={undefined}
    />);
    expect(screen.getByLabelText("Propose DA at code-point span 0 to 2")).not.toBeChecked();
    expect(screen.getByTestId("current-word-da-not-selected")).toBeInTheDocument();
  });

  it("keeps the selected DA mapping visibly partial when evaluator inputs are absent", () => {
    const evaluation = buildCurrentWordSymbolicDraftProjectionV0_1({
      exactSpelling: "NDARJE",
      language: "sq",
      variety: "Standard Albanian",
      selections: { spectrumCandidateByOccurrenceId: {}, voiceDraftByEventId: {} },
    }).evaluation;
    render(<CurrentWordSourceFunctionalSuggestionV0_1
      analyzedWord="NDARJE"
      draftTargetWord="NDARJE"
      language="Albanian"
      variety="Standard Albanian"
      identityMatches
      selectedSourceSense={runtimeNdarjeSense()}
      evaluation={evaluation}
    />);
    fireEvent.click(screen.getByLabelText("Propose DA at code-point span 1 to 3"));
    expect(screen.getByTestId("current-word-da-proposal-null")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-da-proposal-null")).toHaveTextContent("NO_VERIFIABLY_COMPUTED_VOICE_OUTPUTS");
    expect(screen.getByTestId("current-word-da-candidate-details")).toHaveTextContent("EXPLORATORY_HYPOTHESIS / USER_PROPOSED");
    expect(screen.queryByTestId("current-word-exploratory-explanation")).not.toBeInTheDocument();
  });

  it("keeps unresolved structure and broken Voice dependencies partial", () => {
    const evaluation = evaluatedNdarje();
    if (!evaluation.ok) throw new Error("expected evaluator success result");
    const brokenEvaluation = {
      ...evaluation,
      operationTrace: evaluation.operationTrace.map((trace) => trace.kind === "APPLY_VOICE_OPERATOR" && trace.targetVoiceEventId === "voice:E@5"
        ? { ...trace, dependsOn: [] }
        : trace),
    } as SymbolicFunctionalCompositionResultV0_3;
    const projection = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation: brokenEvaluation,
    });
    expect(projection.status).toBe("PARTIAL_NULL");
    expect(projection.wholeWordStatus).toBe("PARTIAL_NULL");
    expect(projection.computedContributions).toHaveLength(1);
    expect(projection.unresolved).toContain("VOICE_OPERATION_NOT_VERIFIABLY_COMPUTED:draft-voice-1");
    expect(projection.conditionalExplanation).toContain("initiated(division)");

    const mismatched = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDAJ",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation,
    });
    expect(mismatched.status).toBe("PARTIAL_NULL");
    expect(mismatched.sourceContent).toBeNull();
    expect(mismatched.reasonCodes).toContain("CURRENT_WORD_IDENTITY_MISMATCH");
    expect(mismatched.conditionalExplanation).toBeNull();
  });

  it("withholds a direct Voice result when its spectrum-selection dependency is absent", () => {
    const evaluation = evaluatedNdarje();
    if (!evaluation.ok) throw new Error("expected successful symbolic evaluation");
    const brokenEvaluation = {
      ...evaluation,
      operationTrace: evaluation.operationTrace.map((trace) =>
        trace.kind === "APPLY_VOICE_OPERATOR" && trace.targetVoiceEventId === "voice:A@2"
          ? { ...trace, dependsOn: [] }
          : trace,
      ),
    } as SymbolicFunctionalCompositionResultV0_3;

    const projection = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation: brokenEvaluation,
    });

    expect(projection.status).toBe("PARTIAL_NULL");
    expect(projection.computedContributions).toHaveLength(0);
    expect(projection.unresolved).toContain("VOICE_OPERATION_NOT_VERIFIABLY_COMPUTED:draft-voice-0");
    expect(projection.conditionalExplanation).toBeNull();
  });

  it("withholds entered source relationships when the current draft target differs", () => {
    render(
      <CurrentWordSourceFunctionalSuggestionV0_1
        analyzedWord="NDARJE"
        draftTargetWord="NDAJ"
        language="Albanian"
        variety="Standard Albanian"
        identityMatches={false}
      />,
    );
    expect(screen.getByTestId("current-word-source-suggestion-identity-null")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.queryByLabelText("Exact source target form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("current-word-source-functional-suggestion-text")).not.toBeInTheDocument();
  });

  it("keeps the conditional source suggestion separate from the unselected symbolic graph", () => {
    render(
      <CurrentWordSymbolicDraftV0_1
        analyzedWord="NDARJE"
        draftTargetWord="NDARJE"
        targetLanguage="Albanian"
        targetDialect="Standard Albanian"
        currentWordEvidence={{
          analyzedWord: "NDARJE",
          discovery: { kind: "present", value: {
            inputWord: "NDARJE",
            inputLanguage: "sq",
            inputProfile: "Standard Albanian",
            sourceFact: { language: "Albanian" },
            exactLexicalSourceStatus: { status: "SOURCE_NOT_FOUND", reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND" },
            exactLexicalSourceFacts: [],
          } },
        } as never}
      />,
    );
    expect(screen.getByTestId("current-word-source-functional-null")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByLabelText("Spectrum association for D at position 1")).toHaveValue("");
    expect(screen.getByLabelText("Voice operator for A@2")).toHaveValue("");
    expect(screen.getByTestId("current-word-symbolic-result")).toHaveTextContent("UNKNOWN_OR_NULL");

    fireEvent.change(screen.getByLabelText("Spectrum association for D at position 1"), { target: { value: "d:division" } });
    fireEvent.change(screen.getByLabelText("Voice operator for A@2"), { target: { value: "voice-a:initiate-ground" } });
    fireEvent.change(screen.getByLabelText("Explicit operand for A@2"), { target: { value: "spectrum:spectrum:D@1-2" } });
    fireEvent.change(screen.getByLabelText("Voice operator for E@5"), { target: { value: "voice-e:expand-outward" } });
    fireEvent.change(screen.getByLabelText("Explicit operand for E@5"), { target: { value: "voice:voice:A@2" } });
    expect(screen.getAllByTestId("current-word-symbolic-computed-output").map((node) => node.textContent)).toEqual([
      expect.stringContaining("initiated(division)"),
      expect.stringContaining("expanded(initiated(division))"),
    ]);
    expect(screen.getAllByTestId("current-word-symbolic-computed-output").every((node) => node.textContent?.includes("USER_PROPOSED / EXPLORATORY_HYPOTHESIS"))).toBe(true);
  });
});
