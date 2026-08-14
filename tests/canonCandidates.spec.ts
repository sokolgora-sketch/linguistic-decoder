// tests/canonCandidates.spec.ts

import { enginePayloadToAnalysisResult } from '@/shared/analysisAdapter';
import type { EnginePayload, Candidate } from '@/shared/engineShape';
import { CANON_CANDIDATES } from '@/shared/canonCandidates';

describe('Canonical Candidate Adapter', () => {
  const basePayload: Omit<EnginePayload, 'word'> = {
    engineVersion: 'test-v1',
    mode: 'strict',
    alphabet: 'auto',
    primaryPath: {
      voicePath: ['U', 'I'],
      ringPath: [1, 1],
      levelPath: [1, 1],
      ops: [],
      checksums: { V: 55, E: 0, C: 2 },
      kept: 2,
    },
    frontierPaths: [],
    windows: ['st', 'd'],
    windowClasses: ['SibilantFricative', 'Plosive'],
    signals: [],
    languageFamilies: [],
    edgeWindows: ["prefix 's' -> SibilantFricative"]
  };

  const indexByLanguage = (candidates: Candidate[]) => {
    return candidates.reduce(
      (acc, c) => ({ ...acc, [c.language]: c }),
      {} as Record<string, Candidate>
    );
  };

  it('it returns canonical candidates for "study" with consonant profiles and axes', () => {
    const payload: EnginePayload = {
      ...basePayload,
      word: 'study',
    };

    const result = enginePayloadToAnalysisResult(payload);

    expect(result.candidates).toHaveLength(4);

    const composedCandidate =
      result.candidates.find(
        (candidate: any) =>
          candidate?.candidateId ===
          "rootmap-composition:sq:shtu+di",
      );

    expect(composedCandidate).toBeTruthy();
    expect(
      (composedCandidate as any)
        ?.displayForm,
    ).toBe("SHTU + DI");

    expect(
      (composedCandidate as any)
        ?.validationOutcome,
    ).toBe("partial");

    expect(
      (composedCandidate as any)
        ?.rankGroup,
    ).toBe(
      "partialFunctionalMotivation",
    );
    expect(result.consonants).toBeDefined();
    expect(result.consonants!.field.smoothHits + result.consonants!.field.spikyHits).toBeGreaterThanOrEqual(1);

    const reviewed = result.candidates[0] as any;
    expect(reviewed.candidateId).toBe("albanian-di-know-functional");
    expect(reviewed.embryo).toBe("DI");
    expect(reviewed.validationOutcome).toBe("validated");
    expect(reviewed.rankGroup).toBe("validatedFunctionalMotivation");
    expect(reviewed.originClaim).toBe("not_claimed");
    expect(reviewed.userDecisionPosture).toBe("user_decides");

    const canonCandidates = result.candidates.filter(
      (candidate) =>
        candidate.id === "latin-studium" ||
        candidate.id === "albanian-studim",
    );

    expect(canonCandidates).toHaveLength(2);

    for (const c of canonCandidates) {
      expect(c.status).toBe('experimental');
      expect(c.confidenceTag).toBe('speculative');
      expect(c.fitTag).toBe('weak');
      expect(c.morphology).toBeDefined();
      expect(c.id).toContain('stud');
      // consonant checks
      expect(c.consonantProfile).toBe('build');
      expect(c.consonantProfileOk).toBe(true);
      expect(c.consonantSignals && c.consonantSignals.length).toBeGreaterThan(0);
      // axes checks
      expect(c.axes).toBeDefined();
      expect(c.axes?.principles).toBe('pass');
      expect(c.axes?.morphology).toBe('pass');
      expect(c.axes?.consonants).toBe('pass');
    }
  });

  it('study has a morphology matrix for Latin and Albanian', () => {
    const payload: EnginePayload = { ...basePayload, word: 'study' };
    const result = enginePayloadToAnalysisResult(payload);
    
    const langs = result.candidates.reduce(
      (acc, c) => ({ ...acc, [c.language]: c }),
      {} as Record<string, Candidate>
    );
  
    expect(langs['Latin'].morphologyMatrix?.pivot).toBe('stud');
    expect(langs['Albanian'].morphologyMatrix?.pivot).toBe("s'tu");
  });

  it('it returns canonical candidates for "damage" with consonant profiles and axes', () => {
    const payload: EnginePayload = {
      ...basePayload,
      word: 'damage',
      primaryPath: { // A more fitting path for damage
        voicePath: ['A', 'E'],
        ringPath: [3, 2],
        levelPath: [1, 1],
        ops: [],
        checksums: { V: 6, E: 1, C: 1 },
        kept: 2,
      },
      windows: ['m', 'g'],
      windowClasses: ['Nasal', 'Plosive'],
      edgeWindows: ["prefix 'd' -> Plosive"],
    };

    const result = enginePayloadToAnalysisResult(payload);

    expect(result.candidates).toHaveLength(3);
    expect(result.consonants).toBeDefined();
    expect(result.consonants!.field.smoothHits + result.consonants!.field.spikyHits).toBeGreaterThanOrEqual(1);

    const reviewed = result.candidates[0] as any;
    expect(reviewed.candidateId).toBe(
      "albanian-da-dam-damage-functional",
    );
    expect(reviewed.embryo).toBe("DA");
    expect(reviewed.validationOutcome).toBe("validated");
    expect(reviewed.rankGroup).toBe("validatedFunctionalMotivation");
    expect(reviewed.originClaim).toBe("not_claimed");
    expect(reviewed.userDecisionPosture).toBe("user_decides");

    const canonCandidates = result.candidates.filter(
      (candidate) =>
        candidate.id === "latin-damnum" ||
        candidate.id === "albanian-dëm",
    );

    expect(canonCandidates).toHaveLength(2);

    for (const c of canonCandidates) {
      expect(c.status).toBe('experimental');
      expect(c.confidenceTag).toBe('speculative');
      expect(c.fitTag).toBe('weak');
      expect(c.morphology).toBeDefined();
      expect(c.id).toMatch(/dam|dëm/);
      // consonant checks
      expect(c.consonantProfile).toBe('cut');
      expect(c.consonantProfileOk).toBe(true);
      expect(c.consonantSignals && c.consonantSignals.length).toBeGreaterThan(0);
      // axes checks
      expect(c.axes).toBeDefined();
      expect(c.axes?.principles).toBe('pass');
      expect(c.axes?.morphology).toBe('pass');
      expect(c.axes?.consonants).toBe('pass');
    }
  });

  it('damage has a morphology matrix for Latin and Albanian', () => {
    const entry = CANON_CANDIDATES['damage'];
    expect(entry).toBeDefined();
  
    const langs = indexByLanguage(entry);
  
    expect(langs['Latin'].form.toLowerCase()).toBe('damnum');
    expect(langs['Latin'].morphologyMatrix?.pivot).toBe('dam');
  
    expect(langs['Albanian'].form.toLowerCase()).toBe('dëm');
    expect(langs['Albanian'].morphologyMatrix?.pivot).toBe('dëm');
  });

  it('it falls back to placeholder candidates for other words', () => {
    const payload: EnginePayload = {
      ...basePayload,
      word: 'unknownword',
      languageFamilies: [
        { familyId: 'latin', confidence: 0.5, label: 'Latin', rationale: '', forms: [], signals: [] },
      ],
    };

    const result = enginePayloadToAnalysisResult(payload);

    expect(result.candidates).toHaveLength(1);
    const candidate = result.candidates[0];
    expect(candidate.status).toBe('experimental');
    expect(candidate.confidenceTag).toBe('speculative');
    expect(candidate.morphology).toBeUndefined();
    expect(candidate.fitTag).toBeUndefined();
    // Consonant profile should be undefined for non-canon candidates for now
    expect(candidate.consonantProfile).toBeUndefined();
    expect(candidate.consonantProfileOk).toBeUndefined();
    expect(candidate.consonantSignals).toBeUndefined();
    // axes should be undefined for non-canon
    expect(candidate.axes).toBeUndefined();
  });

  it('mode has a Latin morphology matrix with pivot "mode"', () => {
    const entry = CANON_CANDIDATES['mode'];
    expect(entry).toBeDefined();
    const langs = indexByLanguage(entry);
    expect(langs['Latin'].morphologyMatrix?.pivot).toBe('mode');
  });
});
