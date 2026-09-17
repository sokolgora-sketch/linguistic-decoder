import {
  buildGenericFunctionalWitnessRuntimeProjectionV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessRuntimeProjection.v1";
import type {
  GenericFunctionalWitnessSourceAdapterV1,
  GenericFunctionalWitnessSourceRecordV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import {
  discoverStructuralHypothesesV0_1,
} from "../src/shared/structuralHypothesisDiscovery.v0_1";

function sourceRecord(
  sourceId: string,
  sourceForm: string,
  languageVariety: string | null = null,
): GenericFunctionalWitnessSourceRecordV1 {
  return {
    queryForm: "SHI",
    sourceId,
    evidenceFamily: "lexical_dictionary",
    language: "Albanian",
    languageVariety,
    sourceForm,
    sourceFormNormalization: "EXACT_PRESERVED",
    gloss: `${sourceId} source gloss`,
    citationRefs: [`${sourceId}.citation`],
    embryoRelation: "exact_form",
    relationOperationIds: ["fixture_exact_form"],
    attestationTruth: "fact",
    sourceStatus: "research_candidate",
    sourceProvenance: {
      sourceRecordId: sourceId,
      sourceTraditionId: "fixture.tradition",
      sourceTitle: `${sourceId} source title`,
      sourceDateOrVersion: "fixture v1",
      sourceUrlOrArchiveRef: `fixture://${sourceId}`,
      entryLocator: `${sourceId} entry`,
      sourceHashOrArchiveHash: null,
      languageVariety,
    },
  };
}

function adapterFor(
  adapterId: string,
  records: readonly GenericFunctionalWitnessSourceRecordV1[],
): GenericFunctionalWitnessSourceAdapterV1 {
  return {
    adapterId,
    query(input) {
      return {
        ok: true,
        records: input.embryo === "SHI" ? records : [],
      };
    },
  };
}

const structuralHypothesisForShi = {
  hypothesisId: "logic-structural:fresh-target:SHI:fixture",
  embryo: "SHI",
} as any;

describe("Lane 4 generic witness runtime projection", () => {
  it("queries by embryo for a fresh target without a target-word row", () => {
    const projection = buildGenericFunctionalWitnessRuntimeProjectionV1(
      {
        targetWord: "fresh-target",
        structuralHypothesis: structuralHypothesisForShi,
        targetSense: { id: "sense:fresh", label: "a supplied sense" },
      },
      [
        adapterFor("fixture.albanian", [
          sourceRecord("fixture.shi", "shi", "Gheg"),
        ]),
      ],
    );

    expect(projection?.discovery.status).toBe("MATCHES_FOUND");
    expect(projection?.targetWord).toBe("fresh-target");
    expect(projection?.discovery.matches[0]?.sourceForm).toBe("shi");
    expect(projection?.correspondences[0]?.verdict).toBe("UNKNOWN");
    expect(projection?.correspondences[0]?.targetSenseBinding).toBe(
      "TARGET_SENSE_PRESENT_NOT_BOUND",
    );
    expect(projection?.correspondences[0]?.historicalRelation).toBe(
      "NOT_CLAIMED",
    );
    expect(projection?.correspondences[0]?.functionalAcceptance).toBe(
      "NOT_AUTHORIZED",
    );
  });

  it("preserves Evidence Null for a valid structural embryo with no match", () => {
    const [hypothesis] = discoverStructuralHypothesesV0_1("banana");
    expect(hypothesis).toBeTruthy();

    const projection = buildGenericFunctionalWitnessRuntimeProjectionV1(
      {
        targetWord: "banana",
        structuralHypothesis: hypothesis!,
      },
      [adapterFor("fixture.empty", [])],
    );

    expect(projection?.discovery.status).toBe("NO_MATCHES");
    expect(projection?.discovery.evidenceStatus).toBe("NO_EXTERNAL_EVIDENCE");
    expect(projection?.correspondences).toEqual([]);
  });

  it("keeps multiple source witnesses deterministic and winner-free", () => {
    const projection = buildGenericFunctionalWitnessRuntimeProjectionV1(
      {
        targetWord: "fresh-target",
        structuralHypothesis: structuralHypothesisForShi,
      },
      [
        adapterFor("fixture.zeta", [sourceRecord("fixture.zeta", "shi")]),
        adapterFor("fixture.alpha", [
          sourceRecord("fixture.alpha", "shi", "Tosk"),
        ]),
      ],
    );

    expect(projection?.discovery.matches.map((match) => match.sourceId)).toEqual([
      "fixture.alpha",
      "fixture.zeta",
    ]);
    expect(projection?.correspondences).toHaveLength(2);
    expect(
      projection?.correspondences.every(
        (correspondence) =>
          correspondence.verdict === "UNKNOWN" &&
          correspondence.winnerClaim === "NOT_CLAIMED" &&
          correspondence.noSingleWinner,
      ),
    ).toBe(true);
  });

  it("is deterministic, immutable, and does not project a structural Null", () => {
    const [hypothesis] = discoverStructuralHypothesesV0_1("banana");
    const input = {
      targetWord: "banana",
      structuralHypothesis: hypothesis!,
    };
    const first = buildGenericFunctionalWitnessRuntimeProjectionV1(input, [
      adapterFor("fixture.empty", []),
    ]);
    const second = buildGenericFunctionalWitnessRuntimeProjectionV1(input, [
      adapterFor("fixture.empty", []),
    ]);

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first?.discovery)).toBe(true);
    expect(
      buildGenericFunctionalWitnessRuntimeProjectionV1(
        {
          targetWord: "xyz",
          structuralHypothesis: null as any,
        },
        [],
      ),
    ).toBeNull();
  });
});
