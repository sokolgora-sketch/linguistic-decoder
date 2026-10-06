import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildMotivationEngineDiscoveryV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import {
  createAlbanianLexicalSubstrateWitnessAdapterV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import {
  createLatinLexicalSubstrateWitnessAdapterV0_1,
} from "@/shared/openInstrument/latinLexicalSubstrate.v0_1";

async function analysisFor(word: string, alphabet = "auto") {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet,
  });
  return enginePayloadToAnalysisResult(payload);
}

describe("Motivation Engine Discovery first vertical v0.1", () => {
  it("retrieves Albanian DI generically from study structure without a word shortcut", async () => {
    const word = "study";
    const heart = buildHeartInstrumentV1(word);
    const result = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
    });

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.candidates.some((candidate) =>
      candidate.sourceFact.sourceId === "reviewed.external.di.knowledge.candidate.v0_1",
    )).toBe(true);
    expect(result.candidates.some((candidate) =>
      candidate.candidateEmbryo === "DI" && candidate.candidateVoicePath.includes("I"),
    )).toBe(true);
    expect(result.candidates.every((candidate) => candidate.noSingleWinner)).toBe(true);
    expect(result.candidates.every((candidate) => candidate.userDecisionPosture === "user_decides")).toBe(true);
    expect(result.candidates.every((candidate) => candidate.candidateStatus === "experimental")).toBe(true);

    const di = result.candidates.find((candidate) => candidate.candidateEmbryo === "DI");
    expect(di?.structuralComparison).toMatchObject({
      matchClassification: "STRUCTURAL_MOTIVATION_CANDIDATE",
      presentationClassification: "STRUCTURAL_MOTIVATION",
      matchedQuery: "DI",
      inputRepresentationKind: "production_spoken",
      candidateRepresentationKind: "orthographic_profile_derived",
      representationCompatibility: "CROSS_REPRESENTATION",
      voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
      consonantalCarrierRelationship: "INPUT_CARRIER_CONTEXT_ONLY",
    });
    expect(di?.structuralComparison.inputVoicePath.length).toBeGreaterThan(0);
    expect(di?.structuralComparison.candidateVoicePath).toEqual(["I"]);
    expect(di?.structuralComparison.candidateConsonantalStructure).toBeNull();
    expect(di?.structuralComparison.authorizedOperationIds).toContain("y_to_i");
    expect(di?.functionalInterpretation).toMatchObject({
      status: "REVIEWED_HYPOTHESIS",
      truthClassification: "hypothesis",
      evidenceKind: "reviewed_functional_evidence",
      statement: "knowledge can motivate study and learning functionally without making a historical-origin claim",
    });
    expect(di?.functionalInterpretation.evidenceRefs).toContain(
      "reviewed.external.di.knowledge.candidate.citation.v0_1",
    );
    const da = result.candidates.find((candidate) => candidate.candidateEmbryo === "DA");
    expect(da?.functionalInterpretation).toMatchObject({
      status: "UNKNOWN_OR_NULL",
      truthClassification: "unknown_or_null",
      statement: null,
      evidenceKind: "none",
      reason: "INSUFFICIENT_FUNCTIONAL_EVIDENCE",
    });
    expect(da?.functionalInterpretation.evidenceRefs).toEqual([]);
    expect(di?.structuralComparison.matchReason).toContain("SHTU + DI");
    expect(di?.structuralComparison.matchReason).toContain("carrier forms: shtu + di");
    expect(di?.structuralComparison.matchReason).toContain("authorized operations:");
    expect(di?.structuralComparison.matchReason).toContain("y_to_i");
  });

  it("uses the same generic retrieval for a previously unprepared positive input", async () => {
    const word = "studies";
    const heart = buildHeartInstrumentV1(word);
    const result = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
    });

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.candidates.map((candidate) => candidate.candidateEmbryo)).toContain("DI");
    expect(result.candidates.map((candidate) => candidate.candidateId).join("\n")).not.toContain("study:");
  });

  it("keeps an unsupported generic input as an explicit Null", async () => {
    const word = "learning";
    const heart = buildHeartInstrumentV1(word);
    const result = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
    });

    expect(result.status).toBe("NO_MATCHES");
    expect(result.candidates).toEqual([]);
    expect(result.unknownOrNull.reason).toBe("NO_GENERIC_AUTHORIZED_SOURCE_WITNESS");
    expect(result.interpretation.status).toBe("UNKNOWN_OR_NULL");
  });

  it("enters the explicit Albanian profile without promoting spelling to spoken authority", async () => {
    const word = "zemër";
    const heart = buildHeartInstrumentV1(word);
    const result = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor(word, "albanian"),
      heart,
    });

    expect(result.inputLanguage).toBe("sq");
    expect(result.sourceFact.representation).toBe("albanian_profile");
    expect(result.derivedStructure.voicePath).toEqual(["E", "Ë"]);
    expect(result.derivedStructure.structuralHypotheses[0]?.embryo).toBe("EM");
    expect(result.derivedStructure.gamma.status).toBe("profile_derived");
    expect(result.derivedStructure.zeroConsonantalStructuralComposition.status).toBe("NULL");
    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.candidates.some((candidate) =>
      candidate.candidateForm === "zemër" &&
      candidate.sourceFact.sourceId === "research.external.albanian-zemer-heart.scale50.v0_1",
    )).toBe(true);
    const self = result.candidates.find((candidate) => candidate.candidateForm === "zemër");
    expect(self?.structuralComparison.matchClassification).toBe("EXACT_LEXICAL_SELF_MATCH");
    expect(self?.structuralComparison.presentationClassification).toBe("LEXICAL_ENTRY_CONFIRMATION");
    expect(self?.structuralComparison.inputRepresentationKind).toBe("albanian_profile");
    expect(self?.structuralComparison.candidateRepresentationKind).toBe("orthographic_profile_derived");
    expect(self?.structuralComparison.voiceRelationship).toBe("NOT_COMPARABLE_ACROSS_REPRESENTATIONS");
    expect(self?.structuralComparison.candidateConsonantalStructure).toBeNull();
    expect(self?.structuralComparison.matchReason).toContain("lexical entry confirmation");
    expect(self?.functionalInterpretation).toMatchObject({
      status: "NOT_APPLICABLE_SELF_MATCH",
      truthClassification: "unknown_or_null",
      statement: null,
      reason: "LEXICAL_SELF_MATCH_NOT_FUNCTIONAL_MOTIVATION",
    });
  });

  it("does not classify a cross-language homograph as lexical self-match", async () => {
    const word = "di";
    const heart = buildHeartInstrumentV1(word);
    const result = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
    });

    const albanianWitness = result.candidates.find((candidate) => candidate.candidateForm === "di");
    expect(albanianWitness).toBeDefined();
    expect(albanianWitness?.structuralComparison.matchClassification).toBe("STRUCTURAL_MOTIVATION_CANDIDATE");
    expect(albanianWitness?.structuralComparison.presentationClassification).toBe("STRUCTURAL_MOTIVATION");
  });

  it("retrieves an independently selected Albanian lexical record through the same generic substrate", async () => {
    const word = "gjak";
    const heart = buildHeartInstrumentV1(word);
    const result = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor(word, "albanian"),
      heart,
    });

    expect(result.candidates.some((candidate) =>
      candidate.candidateForm === "gjak" &&
      candidate.sourceFact.sourceId === "research.external.albanian-gjak-blood.scale50.v0_1",
    )).toBe(true);
    expect(result.candidates.every((candidate) => candidate.noSingleWinner)).toBe(true);
    expect(result.userDecisionPosture).toBe("user_decides");
  });

  it("does not reuse an English Heart path for an explicitly Albanian input", async () => {
    const word = "study";
    const heart = buildHeartInstrumentV1(word);
    expect(heart.canonicalSpokenVoicePath?.length).toBeGreaterThan(0);

    const result = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor(word, "albanian"),
      heart,
    });

    expect(result.derivedStructure.voicePathSource).toBe("albanian_profile");
    expect(result.sourceFact.representation).toBe("albanian_profile");
    expect(result.derivedStructure.gamma.status).toBe("profile_derived");
    expect(result.derivedStructure.zeroConsonantalStructuralComposition.status).toBe("NULL");
  });

  it("keeps the comparison word-independent and preserves a valid Null control", async () => {
    const word = "learning";
    const heart = buildHeartInstrumentV1(word);
    const result = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis: await analysisFor(word),
      heart,
    });

    expect(result.status).toBe("NO_MATCHES");
    expect(result.candidates).toEqual([]);
    expect(JSON.stringify(result)).not.toMatch(/study|zemër|candidate ===/i);
  });

  it("composes a pre-existing Latin source through the same generic seam", async () => {
    const word = "bamoar";
    const heart = buildHeartInstrumentV1(word);
    const result = buildMotivationEngineDiscoveryV0_1({
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

    const latin = result.candidates.find(
      (candidate) => candidate.candidateLanguage === "Latin",
    );
    expect(result.status).toBe("MATCHES_FOUND");
    expect(latin).toMatchObject({
      candidateForm: "amo",
      candidateGloss: "to like, to love",
      candidateEmbryo: "AMO",
      candidateVoicePath: [],
      functionalInterpretation: {
        status: "UNKNOWN_OR_NULL",
        statement: null,
        evidenceKind: "none",
        reason: "INSUFFICIENT_FUNCTIONAL_EVIDENCE",
      },
      historicalRelation: "not_claimed",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(latin?.sourceFact.sourceId).toBe("research.external.latin-amo-love.v0_1");
    expect(latin?.sourceFact.evidenceRefs).toContain(
      "research.external.lewis-short-amo-love.citation.v0_1",
    );
    expect(latin?.sourceFact.sourceUrlOrArchiveRef).toContain("atlas.perseus.tufts.edu");
    expect(latin?.structuralComparison.candidateRepresentationKind).toBe(
      "orthographic_profile_derived",
    );
    expect(latin?.structuralComparison.candidateVoicePath).toEqual([]);
    expect(latin?.structuralComparison.candidateConsonantalStructure).toBeNull();
    expect(latin?.structuralComparison.voiceRelationship).toBe("UNKNOWN");
    expect(latin?.structuralComparison.matchReason).toContain("AMO");
    expect(result.candidates.every((candidate) => candidate.noSingleWinner)).toBe(true);
  });

  it("keeps the Latin adapter source-bound and deterministic", () => {
    const adapter = createLatinLexicalSubstrateWitnessAdapterV0_1();
    const query = {
      schemaVersion: "open-instrument.generic-functional-witness-discovery.v1" as const,
      embryo: "AMO",
      voicePath: ["A", "O"] as const,
      queryNormalization: "EXACT_NFC" as const,
    };
    const first = adapter.query(query);
    const second = adapter.query(query);

    expect(adapter.adapterId).toBe("latin-generic-lexical-substrate.v0_1");
    expect(first).toEqual(second);
    expect(first).toMatchObject({
      ok: true,
      records: [
        {
          language: "Latin",
          sourceForm: "amo",
          gloss: "to like, to love",
          sourceStatus: "research_candidate",
        },
      ],
    });
    expect(JSON.stringify(first)).not.toMatch(/targetWord|semanticBridge|historicalOriginClaim|winnerClaim/);
  });
});
