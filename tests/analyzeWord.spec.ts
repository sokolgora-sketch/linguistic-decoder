import { analyzeWord } from "@/engine/analyzeWord";
import type { AnalyzeWordResult } from "@/shared/engineShape";

describe("analyzeWord contract", () => {
  it("study has correct Latin and Albanian pivots and matrix sources", () => {
    const result: AnalyzeWordResult = analyzeWord("study");

    const latinCandidate = result.languageFamilies.find(c => c.language === 'Latin');
    const albanianCandidate = result.languageFamilies.find(c => c.language === 'Albanian');

    expect(latinCandidate?.morphologyMatrix?.pivot).toBe('stud');
    expect(latinCandidate?.morphologyMatrix?.source).toBe('manual');
    
    expect(albanianCandidate?.morphologyMatrix?.pivot).toBe("s'tu");
    expect(albanianCandidate?.morphologyMatrix?.source).toBe('manual');
  });

  it("damage has correct Latin and Albanian pivots and matrix sources", () => {
    const result: AnalyzeWordResult = analyzeWord("damage");

    const latinCandidate = result.languageFamilies.find(c => c.language === 'Latin');
    const albanianCandidate = result.languageFamilies.find(c => c.language === 'Albanian');

    expect(latinCandidate?.morphologyMatrix?.pivot).toBe('dam');
    expect(latinCandidate?.morphologyMatrix?.source).toBe('manual');
    
    expect(albanianCandidate?.morphologyMatrix?.pivot).toBe('dëm');
    expect(albanianCandidate?.morphologyMatrix?.source).toBe('manual');
  });

  it("love (no manual matrix) gets an auto-generated matrix", () => {
    const result: AnalyzeWordResult = analyzeWord("love");

    const latinCandidate = result.languageFamilies.find(c => c.language === 'Latin');
    const albanianCandidate = result.languageFamilies.find(c => c.language === 'Albanian');
    
    expect(latinCandidate?.morphologyMatrix?.source).toBe('auto');
    expect(latinCandidate?.morphologyMatrix?.pivot).toBe('am-');

    expect(albanianCandidate?.morphologyMatrix?.source).toBe('auto');
    expect(albanianCandidate?.morphologyMatrix?.pivot).toBe('dash');
  });

  it("at least one symbolic tag on each canon candidate has a valid axis", () => {
    const checkSymbolicAxes = (word: string) => {
      const result: AnalyzeWordResult = analyzeWord(word);
      const validAxes = ["energy", "substance", "form", "time", "space"];

      for (const candidate of result.languageFamilies) {
        if (candidate.symbolic) {
          const hasValidAxis = candidate.symbolic.some((tag: any) => validAxes.includes(tag.axis));
          expect(hasValidAxis).toBe(true);
        }
      }
    };

    checkSymbolicAxes("study");
    checkSymbolicAxes("damage");
  });
});
