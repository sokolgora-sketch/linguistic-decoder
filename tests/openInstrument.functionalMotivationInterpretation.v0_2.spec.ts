import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildFunctionalMotivationInterpretationV0_2,
  isFunctionalMotivationInterpretationV0_2,
} from "@/shared/openInstrument/functionalMotivationInterpretation.v0_2";
import { buildMotivationEngineDiscoveryV0_1 } from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import { createAlbanianLexicalSubstrateWitnessAdapterV0_1 } from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import { createLatinLexicalSubstrateWitnessAdapterV0_1 } from "@/shared/openInstrument/latinLexicalSubstrate.v0_1";
import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  createEnglishKaikkiGenericWitnessSourceAdapterV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
} from "@/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import type { GenericFunctionalWitnessSourceAdapterV1 } from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

async function analysisFor(word: string, alphabet = "auto") {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet,
  });
  return enginePayloadToAnalysisResult(payload);
}

async function discoveryFor(
  word: string,
  inputLanguage = "en",
  inputProfile?: string,
  sourceAdapters?: readonly GenericFunctionalWitnessSourceAdapterV1[],
) {
  const heart = buildHeartInstrumentV1(word);
  return {
    heart,
    discovery: buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage,
      inputProfile: inputProfile ?? heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word, inputLanguage === "sq" ? "albanian" : "auto"),
      heart,
      sourceAdapters,
    }),
  };
}

function englishSourceRecordForTest() {
  const record = {
    word: "di",
    lang: "English",
    lang_code: "en",
    pos: "noun",
    senses: [{ id: "fixture.di.1", glosses: ["learning"] }],
  };
  const result = adaptEnglishKaikkiJsonlRecordV0_1({
    recordBytes: new TextEncoder().encode(JSON.stringify(record)),
    recordOrdinal: 1,
    verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  });
  if (!result.ok) throw new Error(`English fixture did not adapt: ${result.reasonCode}`);
  return result.record;
}

describe("Functional Motivation Interpretation v0.2 projector", () => {
  it("keeps source facts and structure while failing closed without target sense", async () => {
    const { heart, discovery } = await discoveryFor("study");
    const result = buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: null,
      heart,
    });

    const di = result.candidates.find((candidate) => candidate.candidateEmbryo === "DI");
    expect(result.status).toBe("NO_SUPPORTED_INTERPRETATION");
    expect(result.input.targetSense).toBeNull();
    expect(result.input.derivedStructure.layer).toBe("DERIVED_STRUCTURE");
    expect(result.input.derivedStructure.nucleusEvents.length).toBeGreaterThan(0);
    expect(di?.sourceFact.layer).toBe("SOURCE_FACT");
    expect(di?.reviewedFunctionalEvidence.authorityStatus).toBe("REVIEWED_ACCEPTED");
    expect(di?.hypothesis).toMatchObject({
      layer: "UNKNOWN_OR_NULL",
      status: "UNKNOWN_OR_NULL",
      reason: "MISSING_TARGET_SENSE",
      statement: null,
    });
    expect(di?.historicalRelation).toBe("not_claimed");
    expect(di?.winnerClaim).toBe("not_claimed");
    expect(result.noSingleWinner).toBe(true);
    expect(result.userDecisionPosture).toBe("user_decides");
    expect(result.claimBoundary.consonantSemantics).toBe("not_generated");
    expect(result.claimBoundary.spellingDerivedPronunciation).toBe("not_authorized");
  });

  it("keeps cross-representation evidence Null even with an explicit target sense", async () => {
    const { heart, discovery } = await discoveryFor("study");
    const result = buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: {
        id: "user_sense_learning",
        label: "learning",
        authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE",
      },
      heart,
    });

    const di = result.candidates.find((candidate) => candidate.candidateEmbryo === "DI");
    expect(result.status).toBe("NO_SUPPORTED_INTERPRETATION");
    expect(di?.hypothesis.status).toBe("UNKNOWN_OR_NULL");
    expect(di?.hypothesis.layer).toBe("UNKNOWN_OR_NULL");
    expect(di?.hypothesis.reason).toBe("NO_AUTHORIZED_STRUCTURAL_RELATION");
    expect(di?.reviewedFunctionalEvidence.claimBoundary).toBe(
      "functional evidence only; not historical origin",
    );
    const da = result.candidates.find((candidate) => candidate.candidateEmbryo === "DA");
    expect(da?.hypothesis.reason).toBe("NO_AUTHORIZED_STRUCTURAL_RELATION");
  });

  it("emits a hypothesis only for comparable, target-bound reviewed evidence", async () => {
    const { heart, discovery } = await discoveryFor("study");
    const comparableDiscovery = {
      ...discovery,
      candidates: discovery.candidates.map((candidate) =>
        candidate.candidateEmbryo === "DI"
          ? {
              ...candidate,
              structuralComparison: {
                ...candidate.structuralComparison,
                candidateRepresentationKind: "production_spoken" as const,
                representationCompatibility: "SAME_REPRESENTATION" as const,
                voiceRelationship: "EXACT_ORDERED_VOICE_MATCH" as const,
              },
            }
          : candidate,
      ),
    };
    const result = buildFunctionalMotivationInterpretationV0_2({
      discovery: comparableDiscovery,
      targetSense: {
        id: "user_sense_learning",
        label: "learning",
        authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE",
      },
      heart,
    });

    const di = result.candidates.find((candidate) => candidate.candidateEmbryo === "DI");
    expect(result.status).toBe("INTERPRETATIONS_FOUND");
    expect(di?.hypothesis).toMatchObject({
      status: "HYPOTHESIS",
      layer: "ZRO_FUNCTIONAL_HYPOTHESIS",
    });
    expect(di?.hypothesis.evidenceRefs.length).toBeGreaterThan(0);

    const unbound = buildFunctionalMotivationInterpretationV0_2({
      discovery: comparableDiscovery,
      targetSense: {
        id: "user_sense_reading_room",
        label: "room used for reading",
        authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE",
      },
      heart,
    });
    const unboundDi = unbound.candidates.find((candidate) => candidate.candidateEmbryo === "DI");
    expect(unboundDi?.hypothesis.reason).toBe("TARGET_SENSE_NOT_BOUND_TO_REVIEWED_EVIDENCE");
  });

  it("preserves English lexical source facts, exact citations, and source status without promotion", async () => {
    const englishSourceRecord = englishSourceRecordForTest();
    const englishSourceAdapter = createEnglishKaikkiGenericWitnessSourceAdapterV0_1([
      englishSourceRecord,
    ]);
    const englishAdapter: GenericFunctionalWitnessSourceAdapterV1 = {
      adapterId: englishSourceAdapter.adapterId,
      candidateVoicePathPolicy: englishSourceAdapter.candidateVoicePathPolicy,
      query: (input) => {
        const response = englishSourceAdapter.query({
          ...input,
          embryo: input.embryo.normalize("NFC").trim().toLocaleLowerCase("en-US"),
        });
        if (!response.ok) return response;
        return {
          ok: true as const,
          records: response.records.map((record) => ({
            ...record,
            queryForm: input.embryo,
          })),
        };
      },
    };
    const { heart, discovery } = await discoveryFor(
      "study",
      "en",
      undefined,
      [englishAdapter],
    );
    const englishCandidate = discovery.candidates.find(
      (candidate) => candidate.candidateLanguage === "English" && candidate.candidateEmbryo === "DI",
    );
    expect(englishCandidate).toBeDefined();
    if (!englishCandidate) return;

    const exactEnglishCitationRefs = [
      "https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl",
      englishSourceRecord.entryLocator,
    ];
    expect(englishCandidate).toMatchObject({
      candidateLanguage: "English",
      candidateForm: "di",
      candidateGloss: "learning",
      sourceFact: {
        sourceStatus: "research_candidate",
        evidenceRefs: exactEnglishCitationRefs,
        sourceUrlOrArchiveRef: exactEnglishCitationRefs[0],
        entryLocator: englishSourceRecord.entryLocator,
      },
    });

    const sourceOnlyComparableDiscovery = {
      ...discovery,
      candidates: discovery.candidates.map((candidate) =>
        candidate.candidateId === englishCandidate.candidateId
          ? {
              ...candidate,
              structuralComparison: {
                ...candidate.structuralComparison,
                candidateRepresentationKind: "production_spoken" as const,
                representationCompatibility: "SAME_REPRESENTATION" as const,
                voiceRelationship: "EXACT_ORDERED_VOICE_MATCH" as const,
                authorizedOperationIds: ["fixture.authorized.structural.relation"],
              },
            }
          : candidate,
      ),
    };
    const englishResult = buildFunctionalMotivationInterpretationV0_2({
      discovery: sourceOnlyComparableDiscovery,
      targetSense: {
        id: "user_sense_learning",
        label: "learning",
        authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE",
      },
      heart,
    });
    const projectedEnglish = englishResult.candidates.find(
      (candidate) => candidate.candidateId === englishCandidate.candidateId,
    );
    expect(projectedEnglish).toBeDefined();
    if (!projectedEnglish) return;

    expect(projectedEnglish).toMatchObject({
      candidateLanguage: "English",
      candidateForm: "di",
      candidateGloss: "learning",
      historicalRelation: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(projectedEnglish?.sourceFact).toMatchObject({
      sourceId: englishCandidate.sourceFact.sourceId,
      sourceStatus: "research_candidate",
      citationRefs: exactEnglishCitationRefs,
      sourceUrlOrArchiveRef: exactEnglishCitationRefs[0],
      entryLocator: englishSourceRecord.entryLocator,
    });
    expect(projectedEnglish?.reviewedFunctionalEvidence).toMatchObject({
      sourceStatus: "research_candidate",
      authorityStatus: "UNKNOWN_OR_NULL",
      evidenceRefs: [],
    });
    expect(projectedEnglish?.hypothesis).toMatchObject({
      layer: "UNKNOWN_OR_NULL",
      status: "UNKNOWN_OR_NULL",
      statement: null,
      reason: "INSUFFICIENT_FUNCTIONAL_EVIDENCE",
    });
  });

  it("preserves Albanian profile structure without promoting spelling to spoken authority", async () => {
    const { heart, discovery } = await discoveryFor("zemër", "sq", "albanian");
    const result = buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: null,
      heart,
    });

    expect(result.input.derivedStructure.voicePathSource).toBe("albanian_profile");
    expect(result.input.derivedStructure.nucleusEvents.map((event) => event.voice)).toEqual(["E", "Ë"]);
    expect(result.input.derivedStructure.zeroConsonantalStructuralComposition.status).toBe("NULL");
    const selfMatch = result.candidates.find((candidate) => candidate.candidateForm === "zemër");
    expect(selfMatch?.correspondence.matchClassification).toBe("EXACT_LEXICAL_SELF_MATCH");
    expect(selfMatch?.hypothesis.reason).toBe("LEXICAL_SELF_MATCH_NOT_FUNCTIONAL_MOTIVATION");
  });

  it("preserves repeated Voice events and consonant repetition as structure only", async () => {
    const { heart, discovery } = await discoveryFor("banana");
    const result = buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: null,
      heart,
    });
    const events = result.input.derivedStructure.nucleusEvents;
    expect(events.map((event) => event.pathIndex)).toEqual(
      events.map((_event, index) => index),
    );
    expect(events.some((event) => event.recurrenceIndex > 1)).toBe(true);
    const gamma = result.input.derivedStructure.gamma.orderedUnits;
    expect(gamma.length).toBeGreaterThan(0);
    expect(new Set(gamma).size).toBeLessThan(gamma.length);
    expect(result.claimBoundary.consonantSemantics).toBe("not_generated");
  });

  it("keeps Latin lexical-only candidates Null when pronunciation authority is absent", async () => {
    const word = "bamoar";
    const heart = buildHeartInstrumentV1(word);
    const discovery = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
      sourceAdapters: [
        createAlbanianLexicalSubstrateWitnessAdapterV0_1(),
        createLatinLexicalSubstrateWitnessAdapterV0_1(),
      ],
    });
    const result = buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: {
        id: "user_sense_affection",
        label: "affection",
        authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE",
      },
      heart,
    });

    const latin = result.candidates.find((candidate) => candidate.candidateLanguage === "Latin");
    expect(latin?.correspondence.candidateVoicePathStatus).toBe("NULL_UNAUTHORIZED");
    expect(latin?.hypothesis.status).toBe("UNKNOWN_OR_NULL");
    expect(latin?.hypothesis.reason).toBe("NO_AUTHORIZED_STRUCTURAL_RELATION");
    expect(latin?.sourceFact.entryLocator).toContain("amo");
  });

  it("covers a previously unprepared input selected by a declared inflection rule", async () => {
    // Selection rule declared before inspecting the result: pluralize the
    // prepared base ending in y using the repository's ordinary -ies pattern.
    const previouslyUnpreparedInput = "study".replace(/y$/u, "ies");
    const { heart, discovery } = await discoveryFor(previouslyUnpreparedInput);
    const result = buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: null,
      heart,
    });

    expect(result.candidates.some((candidate) => candidate.candidateEmbryo === "DI")).toBe(true);
    expect(result.candidates.every((candidate) => candidate.noSingleWinner)).toBe(true);
    expect(result.candidates.every((candidate) => candidate.userDecisionPosture === "user_decides")).toBe(true);
  });

  it("rejects malformed interpretation payloads instead of letting the UI consume them", async () => {
    const { heart, discovery } = await discoveryFor("study");
    const result = buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: null,
      heart,
    });
    expect(isFunctionalMotivationInterpretationV0_2(result)).toBe(true);

    const malformed = JSON.parse(JSON.stringify(result)) as Record<string, unknown>;
    malformed.schemaVersion = "wrong.version";
    expect(isFunctionalMotivationInterpretationV0_2(malformed)).toBe(false);

    const provenanceMismatch = JSON.parse(JSON.stringify(result)) as Record<string, unknown>;
    const candidates = provenanceMismatch.candidates as Array<Record<string, unknown>>;
    const first = candidates[0];
    if (first) {
      const sourceFact = first.sourceFact as Record<string, unknown>;
      sourceFact.candidateId = "different-candidate";
    }
    expect(isFunctionalMotivationInterpretationV0_2(provenanceMismatch)).toBe(false);

    const malformedCorrespondence = JSON.parse(JSON.stringify(result)) as Record<string, unknown>;
    const malformedCandidates = malformedCorrespondence.candidates as Array<Record<string, unknown>>;
    const malformedFirst = malformedCandidates[0];
    if (malformedFirst) {
      const correspondence = malformedFirst.correspondence as Record<string, unknown>;
      correspondence.operationIds = null;
    }
    expect(isFunctionalMotivationInterpretationV0_2(malformedCorrespondence)).toBe(false);
  });
});
