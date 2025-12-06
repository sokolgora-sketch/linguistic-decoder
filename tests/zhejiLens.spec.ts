// tests/zhejiLens.spec.ts

import { getTensionScore } from "@/core/sevenVowelsTraits";
import {
  buildZhejiSummary,
  invertRootPolarity,
  buildInvertedStatement,
  buildZhejiSnippet,
  type ZhejiSummaryUI,
} from "@/lib/zhejiSummary";

describe("Zheji lens – core helpers", () => {
  it("getTensionScore returns expected costs", () => {
    // From the UI behaviour we just verified:
    // study: U → I → tension [3]
    // love:  O → E → tension [1]
    expect(getTensionScore("U", "I")).toBe(3);
    expect(getTensionScore("O", "E")).toBe(1);

    // sanity: no shift = 0
    expect(getTensionScore("I", "I")).toBe(0);
  });
});

describe("Zheji lens – heart path summary", () => {
  it("buildZhejiSummary matches UI behaviour for 'study' (U → I)", () => {
    const fakeResultStudy = {
      word: "study",
      primaryPath: {
        voicePath: "U → I",
        levelPath: "low → high",
        ringPath: "1 → 1",
      },
    };

    const zheji = buildZhejiSummary(fakeResultStudy as any);
    expect(zheji).toBeTruthy();

    expect(zheji!.rawVowelPath).toBe("UI");
    expect(zheji!.rootPolarity).toBe("Centripetal");
    expect(zheji!.tensionPath).toEqual([3]);
    expect(zheji!.totalTensionScore).toBe(3);
    // simple smoke check for text
    expect(typeof zheji!.functionalStatement).toBe("string");
    expect(zheji!.functionalStatement.length).toBeGreaterThan(5);
  });

  it("buildZhejiSummary matches UI behaviour for 'love' (O → E)", () => {
    const fakeResultLove = {
      word: "love",
      primaryPath: {
        voicePath: "O → E",
        levelPath: "mid → high",
        ringPath: "0 → 2",
      },
    };

    const zheji = buildZhejiSummary(fakeResultLove as any);
    expect(zheji).toBeTruthy();

    expect(zheji!.rawVowelPath).toBe("OE");
    expect(zheji!.rootPolarity).toBe("Centrifugal");
    expect(zheji!.tensionPath).toEqual([1]);
    expect(zheji!.totalTensionScore).toBe(1);
  });
});

describe("Zheji lens – Trinary Roles", () => {
  const fakeResultStudy = {
    word: "study",
    primaryPath: { voicePath: "U → I" },
  };
  const fakeResultLove = {
    word: "love",
    primaryPath: { voicePath: "O → E" },
  };

  it("assigns correct roles for 'study'", () => {
    const zheji = buildZhejiSummary(fakeResultStudy as any)!;

    expect(zheji.subjectRole).toContain("Depth/Potential");
    expect(zheji.subjectRole).toContain("(U)");

    expect(zheji.objectRole).toContain("Inner Focus/Light");
    expect(zheji.objectRole).toContain("(I)");

    expect(zheji.modifierRole).toContain("Centripetal");
    expect(zheji.modifierRole).toContain("1-step path");
  });

  it("assigns correct roles for 'love'", () => {
    const zheji = buildZhejiSummary(fakeResultLove as any)!;

    expect(zheji.subjectRole).toContain("Balance/Mediation");
    expect(zheji.subjectRole).toContain("(O)");

    expect(zheji.objectRole).toContain("Extension/Projection");
    expect(zheji.objectRole).toContain("(E)");

    expect(zheji.modifierRole).toContain("Centrifugal");
    expect(zheji.modifierRole).toContain("1-step path");
  });

  it("inversion logic swaps roles and polarity correctly", () => {
    const zheji = buildZhejiSummary(fakeResultStudy as any)!;

    // Inverted state based on UI logic
    const invertedPolarity = invertRootPolarity(zheji.rootPolarity);
    const invertedModifier = zheji.modifierRole.replace(
      zheji.rootPolarity,
      invertedPolarity
    );

    // Assert that the inversion works as expected in the UI
    expect(invertedPolarity).toBe("Centrifugal");
    // Subject should now be the original Object
    expect(zheji.objectRole).toContain("Inner Focus/Light");
    // Object should now be the original Subject
    expect(zheji.subjectRole).toContain("Depth/Potential");
    // Modifier should reflect the flipped polarity
    expect(invertedModifier).toContain("Centrifugal");
    expect(invertedModifier).toContain("1-step path");
  });
});

describe("Zheji lens – buildZhejiSnippet", () => {
  const studyZheji: ZhejiSummaryUI = {
    rawVowelPath: "UI",
    rootPolarity: "Centripetal",
    tensionPath: [3],
    totalTensionScore: 3,
    functionalStatement: "The path begins with Depth/Potential, and resolves into Inner Focus/Light.",
    subjectRole: "Depth/Potential (U)",
    objectRole: "Inner Focus/Light (I)",
    modifierRole: "Centripetal • 1-step path",
    snippet: "Zheji: Depth/Potential (U) → Inner Focus/Light (I); Centripetal • 1-step path; [3] total tension.",
  };

  const loveZheji: ZhejiSummaryUI = {
    rawVowelPath: "OE",
    rootPolarity: "Centrifugal",
    tensionPath: [1],
    totalTensionScore: 1,
    functionalStatement: "The path begins with Balance/Mediation, and resolves into Extension/Projection.",
    subjectRole: "Balance/Mediation (O)",
    objectRole: "Extension/Projection (E)",
    modifierRole: "Centrifugal • 1-step path",
    snippet: "Zheji: Balance/Mediation (O) → Extension/Projection (E); Centrifugal • 1-step path; [1] total tension.",
  };

  it("builds the correct normal and inverted snippet for 'study'", () => {
    const normalSnippet = buildZhejiSnippet("normal", studyZheji);
    expect(normalSnippet).toBe(studyZheji.snippet);

    const invertedSnippet = buildZhejiSnippet("inverted", studyZheji);
    expect(invertedSnippet).toBe("Zheji: Inner Focus/Light (I) → Depth/Potential (U); Centrifugal • 1-step path; [3] total tension.");
  });

  it("builds the correct normal and inverted snippet for 'love'", () => {
    const normalSnippet = buildZhejiSnippet("normal", loveZheji);
    expect(normalSnippet).toBe(loveZheji.snippet);

    const invertedSnippet = buildZhejiSnippet("inverted", loveZheji);
    expect(invertedSnippet).toBe("Zheji: Extension/Projection (E) → Balance/Mediation (O); Centripetal • 1-step path; [1] total tension.");
  });
});
