// tests/words/love.spec.ts

import { enginePayloadToAnalysisResult } from '@/shared/analysisAdapter';
import type { EnginePayload } from '@/shared/engineShape';

const rawResult: EnginePayload = {
  word: 'love',
  engineVersion: 'test-v1',
  mode: 'strict',
  alphabet: 'auto',
  primaryPath: {
    voicePath: ['A', 'E'],
    ringPath: [3, 2],
    levelPath: [1, 1],
    ops: [],
    checksums: { V: 6, E: 1, C: 1 },
    kept: 2,
  },
  frontierPaths: [],
  windows: ['l', 'v'],
  windowClasses: ['Lateral', 'LabiodentalFricative'],
  signals: [],
  languageFamilies: [
    {
      familyId: 'latin',
      confidence: 0.9,
      label: 'Latin',
      rationale: 'Direct link from lubere/libere',
      forms: ['amor', 'libido'],
      signals: [],
    },
  ],
  edgeWindows: [],
};

describe('word: love', () => {
  it('canonical families and symbolic layer exist', () => {
    const r = enginePayloadToAnalysisResult(rawResult);

    expect(r.candidates && r.candidates.length).toBeGreaterThan(0);

    const latin = r.candidates.find((c: any) => c.language === 'Latin');
    const sq = r.candidates.find((c: any) => c.language === 'Albanian');

    expect(latin?.consonantProfileOk).toBe(true);
    expect(latin?.morphologyMatrix?.pivot).toBe("am-");

    expect(sq?.consonantProfileOk).toBe(true);
    expect(sq?.morphologyMatrix?.pivot).toBe('dash');

    expect(r.symbolicCore).toBeDefined();
    expect(r.symbolicCore?.notes.length).toBeGreaterThan(0);
  });
});
