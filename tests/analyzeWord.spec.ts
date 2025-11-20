// tests/analyzeWord.spec.ts
import { analyzeWord } from '@/engine/analyzeWord';

describe('analyzeWord contract', () => {
  it('study has correct Latin and Albanian pivots', () => {
    const result = analyzeWord('study', 'strict');
    const latinCandidate = result.languageFamilies.find(c => c.language === 'latin');
    const albanianCandidate = result.languageFamilies.find(c => c.language === 'albanian');

    expect(latinCandidate?.morphologyMatrix?.pivot).toBe('stud');
    expect(albanianCandidate?.morphologyMatrix?.pivot).toBe("s'tu");

    // Check for symbolic tags
    expect(latinCandidate?.symbolic).toBeDefined();
    expect(albanianCandidate?.symbolic).toBeDefined();
  });

  it('damage has correct Latin and Albanian pivots', () => {
    const result = analyzeWord('damage', 'strict');
    const latinCandidate = result.languageFamilies.find(c => c.language === 'latin');
    const albanianCandidate = result.languageFamilies.find(c => c.language === 'albanian');

    expect(latinCandidate?.morphologyMatrix?.pivot).toBe('dam');
    expect(albanianCandidate?.morphologyMatrix?.pivot).toBe('dëm');

    // Check for symbolic tags
    expect(latinCandidate?.symbolic).toBeDefined();
    expect(albanianCandidate?.symbolic).toBeDefined();
  });

  it('at least one symbolic tag on each canon candidate has a valid axis', () => {
    const studyResult = analyzeWord('study', 'strict');
    const damageResult = analyzeWord('damage', 'strict');
    const validAxes: string[] = ['love', 'religion', 'mathematics', 'law', 'power', 'creation'];

    const checkSymbolicAxes = (candidates: any[]) => {
      for (const candidate of candidates) {
        if (candidate.symbolic) {
          const hasValidAxis = candidate.symbolic.some((tag: any) => validAxes.includes(tag.axis));
          expect(hasValidAxis).toBe(true);
        }
      }
    };
    
    checkSymbolicAxes(studyResult.languageFamilies);
    checkSymbolicAxes(damageResult.languageFamilies);
  });
});
