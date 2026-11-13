import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildFunctionalMotivationInterpretationV0_2,
} from "@/shared/openInstrument/functionalMotivationInterpretation.v0_2";
import {
  buildFunctionalMotivationInterpretationV0_3,
  isFunctionalMotivationInterpretationV0_3,
  migrateFunctionalMotivationInterpretationV0_2ToV0_3,
} from "@/shared/openInstrument/functionalMotivationInterpretation.v0_3";
import { buildMotivationEngineDiscoveryV0_1 } from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";

async function discoveryFor(word: string) {
  const heart = buildHeartInstrumentV1(word);
  const payload = await runAnalysisDeterministic(word, { mode: "strict", alphabet: "auto" });
  const discovery = buildMotivationEngineDiscoveryV0_1({
    word,
    inputLanguage: "en",
    inputProfile: heart.spokenPronunciation.sourceProfileId,
    analysis: enginePayloadToAnalysisResult(payload),
    heart,
  });
  return { heart, discovery };
}

function hasLegacySelectionKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasLegacySelectionKey);
  if (value === null || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) =>
    key === "noSingleWinner" || key === "winnerClaim" || hasLegacySelectionKey(child),
  );
}

describe("Functional Motivation Interpretation v0.3 migration", () => {
  it("replaces legacy selection assertions and preserves every alternative's evidence", async () => {
    const { heart, discovery } = await discoveryFor("study");
    const legacy = buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: { id: "study.sense", label: "acquiring knowledge", authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE" },
      heart,
    });
    const migrated = migrateFunctionalMotivationInterpretationV0_2ToV0_3(legacy);
    expect(migrated).not.toBeNull();
    if (!migrated) return;

    expect(migrated.schemaVersion).toBe("open-instrument.functional-motivation-interpretation.v0_3");
    expect(migrated.interpretationDecisionPolicy).toMatchObject({
      multipleInterpretationsMayCoexist: true,
      automaticInterpretationSelection: "DISABLED",
      interpretationDecisionAuthority: "USER_DECIDES",
      alternativeProvenance: "PRESERVED_PER_INTERPRETATION",
      alternativeClaimStatus: "PRESERVED_PER_INTERPRETATION",
    });
    expect(migrated.candidates.map(({ candidateId }) => candidateId)).toEqual(
      legacy.candidates.map(({ candidateId }) => candidateId),
    );
    for (const [index, alternative] of migrated.candidates.entries()) {
      const source = legacy.candidates[index];
      expect(alternative.sourceFact).toEqual(source?.sourceFact);
      expect(alternative.reviewedFunctionalEvidence).toEqual(source?.reviewedFunctionalEvidence);
      expect(alternative.hypothesis).toEqual(source?.hypothesis);
      expect(alternative.unresolved).toEqual(source?.unresolved);
      expect(alternative.userDecisionPosture).toBe("user_decides");
    }
    expect(hasLegacySelectionKey(migrated)).toBe(false);
    expect(isFunctionalMotivationInterpretationV0_3(migrated)).toBe(true);
  });

  it("builds the neutral contract and rejects unsafe or malformed migration inputs", async () => {
    const { heart, discovery } = await discoveryFor("study");
    const result = buildFunctionalMotivationInterpretationV0_3({
      discovery,
      targetSense: null,
      heart,
    });
    expect(isFunctionalMotivationInterpretationV0_3(result)).toBe(true);
    expect(result.input.targetSense).toBeNull();
    expect(result.candidates.every((item) => item.hypothesis.status === "UNKNOWN_OR_NULL" || item.hypothesis.status === "HYPOTHESIS")).toBe(true);

    const unsafeLegacy = JSON.parse(JSON.stringify(buildFunctionalMotivationInterpretationV0_2({
      discovery,
      targetSense: null,
      heart,
    }))) as Record<string, unknown>;
    unsafeLegacy.noSingleWinner = false;
    expect(migrateFunctionalMotivationInterpretationV0_2ToV0_3(unsafeLegacy)).toBeNull();

    const unsafeCurrent = JSON.parse(JSON.stringify(result)) as Record<string, unknown>;
    unsafeCurrent.interpretationDecisionPolicy = {
      ...(unsafeCurrent.interpretationDecisionPolicy as Record<string, unknown>),
      automaticInterpretationSelection: "ENABLED",
    };
    expect(isFunctionalMotivationInterpretationV0_3(unsafeCurrent)).toBe(false);
  });
});
