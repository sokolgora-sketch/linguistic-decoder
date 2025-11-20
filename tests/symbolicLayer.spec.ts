// tests/symbolicLayer.spec.ts

import { analyzeWord } from '../src/engine/analyzeWord';

describe('Symbolic Layer', () => {
  it('should be defined for "study" and contain notes', async () => {
    const res = await analyzeWord('study', 'full');
    
    expect(res.symbolic).toBeDefined();
    expect(res.symbolic?.notes).toBeInstanceOf(Array);
    expect(res.symbolic!.notes.length).toBeGreaterThanOrEqual(1);
    expect(res.symbolic?.label).toBe('Zheji-inspired symbolic reading (experimental)');
  });

  it('should be defined for "damage" and contain notes', async () => {
    const res = await analyzeWord('damage', 'full');
    
    expect(res.symbolic).toBeDefined();
    expect(res.symbolic?.notes).toBeInstanceOf(Array);
    expect(res.symbolic!.notes.length).toBeGreaterThanOrEqual(1);
  });

  it('should be undefined for non-canonical words like "hope"', async () => {
    const res = await analyzeWord('hope', 'full');
    
    expect(res.symbolic).toBeUndefined();
  });
});
