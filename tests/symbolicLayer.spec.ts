// tests/symbolicLayer.spec.ts

import { analyzeWord } from '../src/engine/analyzeWord';

describe('Symbolic Layer', () => {
  it('should be defined for "study" and contain notes', () => {
    const res = analyzeWord('study', 'strict');
    
    expect(res.symbolic).toBeDefined();
    expect(res.symbolic?.notes).toBeInstanceOf(Array);
    expect(res.symbolic!.notes.length).toBeGreaterThanOrEqual(1);
    expect(res.symbolic?.label).toBe('Zheji-inspired symbolic reading (experimental)');
  });

  it('should be defined for "damage" and contain notes', () => {
    const res = analyzeWord('damage', 'strict');
    
    expect(res.symbolic).toBeDefined();
    expect(res.symbolic?.notes).toBeInstanceOf(Array);
    expect(res.symbolic!.notes.length).toBeGreaterThanOrEqual(1);
  });

  it('should be undefined for non-canonical words like "hope"', () => {
    const res = analyzeWord('hope', 'strict');
    
    expect(res.symbolic).toBeUndefined();
  });
});
