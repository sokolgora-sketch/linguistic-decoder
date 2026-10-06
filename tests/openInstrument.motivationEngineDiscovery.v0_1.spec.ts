import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildMotivationEngineDiscoveryV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";

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
});
