// tests/canonCandidates.spec.ts

import { enginePayloadToAnalysisResult } from '@/shared/analysisAdapter';
import type { EnginePayload } from '@/shared/engineShape';

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
  };

  test('it returns canonical candidates for "study"', () => {
    const payload: EnginePayload = {
      ...basePayload,
      word: 'study',
    };

    const result = enginePayloadToAnalysisResult(payload);

    expect(result.candidates).toHaveLength(2);
    for (const c of result.candidates) {
      expect(c.status).toBe('pass');
      expect(c.fitTag).toBe('strong');
      expect(c.morphology).toBeDefined();
      expect(c.id).toContain('study');
    }
  });

  test('it returns canonical candidates for "damage"', () => {
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
    };

    const result = enginePayloadToAnalysisResult(payload);

    expect(result.candidates).toHaveLength(2);
    for (const c of result.candidates) {
      expect(c.status).toBe('pass');
      expect(c.fitTag).toBe('strong');
      expect(c.morphology).toBeDefined();
      expect(c.id).toContain('damage');
    }
  });

  test('it falls back to placeholder candidates for other words', () => {
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
  });
});
