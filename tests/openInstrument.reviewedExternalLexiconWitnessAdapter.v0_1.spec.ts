import {
  createReviewedExternalLexiconWitnessAdapterV0_1,
} from "@/shared/openInstrument/reviewedExternalLexiconWitnessAdapter.v0_1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  queryGenericFunctionalWitnessesV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

function query(embryo: string) {
  return {
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    embryo,
    voicePath: ["A"] as const,
    queryNormalization: "EXACT_NFC" as const,
  };
}

describe("reviewed external lexicon generic witness adapter v0.1", () => {
  it("projects the existing reviewed AT row by embryo without a target row", () => {
    const result = queryGenericFunctionalWitnessesV1(query("AT"), [
      createReviewedExternalLexiconWitnessAdapterV0_1(),
    ]);

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toMatchObject({
      sourceId: "reviewed.external.albanian-at.father.candidate.v0_1",
      sourceForm: "at",
      gloss: "father",
      language: "sq",
      sourceStatus: "reviewed_candidate",
      sourceAuthorityStatus: "reviewed_accepted",
      sourceAttestation: "SOURCE_RECORD_ONLY",
      functionalCorrespondence: "NOT_EVALUATED",
      targetMeaning: "NOT_CLAIMED",
      historicalRelation: "NOT_CLAIMED",
      winnerClaim: "NOT_CLAIMED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(result.matches[0]?.citationRefs).toEqual([
      "reviewed.external.albanian-at.father.citation.v0_1",
    ]);
    expect(result.matches[0]?.sourceProvenance).toMatchObject({
      sourceRecordId:
        "reviewed.external.albanian-at.father.candidate.v0_1",
      entryLocator: "at [m] (tg) {2} 'father'; Alb. atë [m] (tg) 'father' (AE 83)",
      sourceUrlOrArchiveRef: "https://ieed.ullet.net/alb.html",
    });
    expect(JSON.stringify(result)).not.toContain("targetWord");
    expect(JSON.stringify(result)).not.toContain("semanticBridge");
  });

  it("queries all existing reviewed production rows generically and rejects absent embryos", () => {
    const adapter = createReviewedExternalLexiconWitnessAdapterV0_1();
    const productionRows = ["AT", "DA", "DI"].map((embryo) =>
      queryGenericFunctionalWitnessesV1(query(embryo), [adapter]),
    );

    expect(
      productionRows.map((result) => result.matches[0]?.sourceId).sort(),
    ).toEqual([
      "reviewed.external.albanian-at.father.candidate.v0_1",
      "reviewed.external.di.knowledge.candidate.v0_1",
      "reviewed.external.gheg-da.damage.candidate.v0_1",
    ]);

    const result = queryGenericFunctionalWitnessesV1(query("HA"), [
      adapter,
    ]);

    expect(result).toMatchObject({
      status: "NO_MATCHES",
      matches: [],
      evidenceStatus: "NO_EXTERNAL_EVIDENCE",
    });
  });

  it("keeps output deterministic and immutable", () => {
    const adapter = createReviewedExternalLexiconWitnessAdapterV0_1();
    const first = queryGenericFunctionalWitnessesV1(query("AT"), [adapter]);
    const second = queryGenericFunctionalWitnessesV1(query("AT"), [adapter]);

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.matches[0])).toBe(true);
  });
});
