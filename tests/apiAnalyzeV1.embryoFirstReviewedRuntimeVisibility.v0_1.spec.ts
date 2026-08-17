import { GET } from "../app/api/analyze-v1/route";

async function analyzeV1(word: string): Promise<any> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function candidatesFrom(body: any): any[] {
  expect(Array.isArray(body?.candidates)).toBe(true);
  return body.candidates;
}

function rootMapKey(body: any, embryo: string): any {
  const keys = Array.isArray(body?.rootMap?.keys)
    ? body.rootMap.keys
    : [];

  return keys.find(
    (key: any) => String(key?.token ?? "") === embryo,
  );
}

function reviewedFunctionalEvidenceText(key: any): string {
  return Array.isArray(key?.evidence)
    ? key.evidence.join("\n")
    : "";
}

function validatedFunctionalCandidates(body: any): any[] {
  return candidatesFrom(body).filter(
    (candidate: any) =>
      candidate?.validationOutcome === "validated" &&
      candidate?.rankGroup === "validatedFunctionalMotivation",
  );
}

describe(
  "analyze-v1 visible reviewed embryo-first runtime candidates v0.1",
  () => {
    it("surfaces reviewed DA as the first validated functional candidate for damage", async () => {
      const body = await analyzeV1("damage");
      const candidates = candidatesFrom(body);
      const candidate = candidates[0];

      expect(candidate).toBeTruthy();
      expect(candidate.candidateId).toBe(
        "albanian-da-dam-damage-functional",
      );
      expect(candidate.embryo).toBe("DA");
      expect(candidate.embryoSize).toBe(2);
      expect(candidate.candidateLanguage).toBe("sq");
      expect(candidate.embryoLanguage).toBe("sq");
      expect(candidate.isolatedStandaloneForm).toBe("da");
      expect(candidate.plainStandaloneGloss).toBe(
        "split / divide",
      );
      expect(candidate.sourceKind).toBe(
        "reviewed_dictionary_source",
      );
      expect(candidate.claimType).toBe(
        "functionalMotivation",
      );
      expect(candidate.validationOutcome).toBe("validated");
      expect(candidate.rankGroup).toBe(
        "validatedFunctionalMotivation",
      );
      expect(candidate.originClaim).toBe("not_claimed");
      expect(candidate.historicalRelation).toBe(
        "not_evaluated",
      );
      expect(candidate.userDecisionPosture).toBe(
        "user_decides",
      );
      expect(String(candidate.semanticBridge)).toContain(
        "split or divided",
      );
      expect(String(candidate.claimBoundary)).toContain(
        "not historical origin",
      );

      const da = rootMapKey(body, "DA");

      expect(da).toBeTruthy();
      expect(
        reviewedFunctionalEvidenceText(da),
      ).toContain(
        "reviewed functional free-operator evidence",
      );
      expect(
        reviewedFunctionalEvidenceText(da),
      ).toContain(
        "historicalOriginClaim=not_claimed",
      );
      expect(
        reviewedFunctionalEvidenceText(da),
      ).toContain(
        "winnerClaim=not_claimed",
      );
    });

    it("surfaces reviewed DI as the first validated functional candidate for study", async () => {
      const body = await analyzeV1("study");
      const candidates = candidatesFrom(body);
      const candidate = candidates[0];

      expect(candidate).toBeTruthy();
      expect(candidate.candidateId).toBe(
        "albanian-di-know-functional",
      );
      expect(candidate.embryo).toBe("DI");
      expect(candidate.embryoSize).toBe(2);
      expect(candidate.candidateLanguage).toBe("sq");
      expect(candidate.embryoLanguage).toBe("sq");
      expect(candidate.isolatedStandaloneForm).toBe("di");
      expect(candidate.plainStandaloneGloss).toBe(
        "know / knowledge",
      );
      expect(candidate.sourceKind).toBe(
        "reviewed_dictionary_source",
      );
      expect(candidate.claimType).toBe(
        "functionalMotivation",
      );
      expect(candidate.validationOutcome).toBe("validated");
      expect(candidate.rankGroup).toBe(
        "validatedFunctionalMotivation",
      );
      expect(candidate.originClaim).toBe("not_claimed");
      expect(candidate.historicalRelation).toBe(
        "not_evaluated",
      );
      expect(candidate.userDecisionPosture).toBe(
        "user_decides",
      );
      expect(String(candidate.semanticBridge)).toContain(
        "study and learning",
      );
      expect(String(candidate.claimBoundary)).toContain(
        "not historical origin",
      );

      const di = rootMapKey(body, "DI");

      expect(di).toBeTruthy();
      expect(
        reviewedFunctionalEvidenceText(di),
      ).toContain(
        "reviewed functional free-operator evidence",
      );
      expect(
        reviewedFunctionalEvidenceText(di),
      ).toContain(
        "historicalOriginClaim=not_claimed",
      );
      expect(
        reviewedFunctionalEvidenceText(di),
      ).toContain(
        "winnerClaim=not_claimed",
      );
    });

    it("surfaces reviewed AT functional evidence for father without making an origin claim", async () => {
      const body = await analyzeV1("father");

      const validated =
        validatedFunctionalCandidates(
          body,
        );

      const at =
        validated.find(
          (candidate: any) =>
            candidate
              ?.candidateId ===
            "albanian-at-father-functional",
        );

      expect(at).toMatchObject({
        candidateId:
          "albanian-at-father-functional",
        candidateLanguage: "sq",
        displayForm: "AT",
        embryo: "AT",
        isolatedStandaloneForm:
          "at",
        plainStandaloneGloss:
          "father",
        claimType:
          "functionalMotivation",
        validationOutcome:
          "validated",
        rankGroup:
          "validatedFunctionalMotivation",
        originClaim:
          "not_claimed",
        historicalRelation:
          "not_evaluated",
        userDecisionPosture:
          "user_decides",
      });

      const atKey =
        rootMapKey(
          body,
          "AT",
        );

      expect(atKey).toBeTruthy();

      expect(
        reviewedFunctionalEvidenceText(
          atKey,
        ),
      ).toContain(
        "reviewed functional free-operator evidence",
      );

      expect(
        reviewedFunctionalEvidenceText(
          atKey,
        ),
      ).toContain(
        "The Albanian inherited lexicon",
      );

      expect(
        reviewedFunctionalEvidenceText(
          atKey,
        ),
      ).toContain(
        "historicalOriginClaim=not_claimed",
      );

      expect(
        body
          ?.analysisStatusV0_1
          ?.reviewedOperators,
      ).toContain(
        "AT",
      );

      expect(
        body
          ?.analysisStatusV0_1
          ?.status,
      ).toBe(
        "reviewed_functional_evidence",
      );
    });
  },
);
