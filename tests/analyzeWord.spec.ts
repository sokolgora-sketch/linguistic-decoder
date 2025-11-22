// tests/analyzeWord.spec.ts
import { analyzeWord } from '@/engine/analyzeWord';
import type { LanguageFamilyCandidate } from '@/shared/engineShape';

describe('analyzeWord contract', () => {
  it('study has correct Latin and Albanian pivots and matrix sources', () => {
    const result = analyzeWord('study', 'strict');
    const latinCandidate = result.languageFamilies.find(c => c.language === 'latin');
    const albanianCandidate = result.languageFamilies.find(c => c.language === 'albanian');

    expect(latinCandidate?.morphologyMatrix?.pivot).toBe('stud');
    expect(latinCandidate?.morphologyMatrix?.source).toBe('manual');
    
    expect(albanianCandidate?.morphologyMatrix?.pivot).toBe("s'tu");
    expect(albanianCandidate?.morphologyMatrix?.source).toBe('manual');

    // Check for symbolic tags
    expect(latinCandidate?.symbolic).toBeDefined();
    expect(albanianCandidate?.symbolic).toBeDefined();
  });

  it('damage has correct Latin and Albanian pivots and matrix sources', () => {
    const result = analyzeWord('damage', 'strict');
    const latinCandidate = result.languageFamilies.find(c => c.language === 'latin');
    const albanianCandidate = result.languageFamilies.find(c => c.language === 'albanian');

    expect(latinCandidate?.morphologyMatrix?.pivot).toBe('dam');
    expect(latinCandidate?.morphologyMatrix?.source).toBe('manual');
    
    expect(albanianCandidate?.morphologyMatrix?.pivot).toBe('dëm');
    expect(albanianCandidate?.morphologyMatrix?.source).toBe('manual');

    // Check for symbolic tags
    expect(latinCandidate?.symbolic).toBeDefined();
    expect(albanianCandidate?.symbolic).toBeDefined();
  });

  it('love (no manual matrix) gets an auto-generated matrix', () => {
    const result = analyzeWord('love', 'strict');
    const latinCandidate = result.languageFamilies.find(c => c.language === 'latin');
    const albanianCandidate = result.languageFamilies.find(c => c.language === 'albanian');
    
    expect(latinCandidate?.morphologyMatrix?.source).toBe('auto');
    expect(latinCandidate?.morphologyMatrix?.pivot).toBe('am-');

    expect(albanianCandidate?.morphologyMatrix?.source).toBe('auto');
    expect(albanianCandidate?.morphologyMatrix?.pivot).toBe('dash-');
  });

  it('at least one symbolic tag on each canon candidate has a valid axis', () => {
    const studyResult = analyzeWord('study', 'strict');
    const damageResult = analyzeWord('damage', 'strict');
    const validAxes: string[] = ['love', 'religion', 'mathematics', 'law', 'power', 'creation'];

    const checkSymbolicAxes = (candidates: LanguageFamilyCandidate[]) => {
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
