import { chooseProfile, extractWindowClassesWithProfile, baseForTests } from "@/functions/sevenVoicesC";

const classes = (word: string, profileId: string) => {
  const P = chooseProfile(word, profileId);
  const seq = baseForTests(word);
  return extractWindowClassesWithProfile(word, seq, P);
};

describe("window→class (deterministic)", () => {
  // Latin
  it("study (latin) → ['Plosive']", () => {
    expect(classes("study", "latin")).toEqual(["Plosive"]);
  });
  it("damage (latin) → ['Nasal']", () => {
    expect(classes("damage", "latin")).toEqual(["Nasal"]);
  });

  // Albanian
  it("zemër (albanian) → ['Nasal']", () => {
    expect(classes("zemër", "albanian")).toEqual(["Nasal"]);
  });
  it("gjuhë (albanian) → ['NonSibilantFricative']", () => {
    expect(classes("gjuhë", "albanian")).toEqual(["NonSibilantFricative"]);
  });

  // Sanskrit
  it("śakti (sanskrit) → ['Plosive']", () => {
    expect(classes("śakti", "sanskrit")).toEqual(["Plosive"]);
  });
  it("moksha (sanskrit) → ['SibilantFricative']", () => {
    expect(classes("moksha", "sanskrit")).toEqual(["SibilantFricative"]);
  });

  // Ancient Greek
  it("physis (ancient_greek) → ['SibilantFricative']", () => {
    expect(classes("physis", "ancient_greek")).toEqual(["SibilantFricative"]);
  });
  it("philos (ancient_greek) → ['Liquid']", () => {
    expect(classes("philos", "ancient_greek")).toEqual(["Liquid"]);
  });

  // PIE
  it("*h₁éḱwos (pie) → ['Plosive']", () => {
    expect(classes("*h₁éḱwos", "pie")).toEqual(["Plosive"]);
  });
  it("*dʰugh₂ter (pie) → ['Plosive']", () => {
    expect(classes("*dʰugh₂ter", "pie")).toEqual(["Plosive"]);
  });
});
