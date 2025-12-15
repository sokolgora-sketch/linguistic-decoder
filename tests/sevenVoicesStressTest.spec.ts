
import { runSevenVoicesStressTest } from '../src/engine/sevenVoicesStressTest';

describe('runSevenVoicesStressTest', () => {
  it('should find a strong match for a known pattern', () => {
    const result = runSevenVoicesStressTest({
      word: 'damage',
      language: 'en',
      primaryVoicePath: 'A → A → E',
    });

    expect(result.vowelPath).toBe('A → A → E');
    expect(result.vowels).toEqual(['A', 'A', 'E']);

    // Check for a specific strong match
    const s1Match = result.matches.find(m => m.patternId === 'S1');
    expect(s1Match).toBeDefined();
    expect(s1Match?.strength).toBe('strong');

    // Check that the corresponding family is present
    const systemsFamily = result.families.find(f => f.family === 'SYSTEMS');
    expect(systemsFamily).toBeDefined();
    expect(systemsFamily?.strongest).toBe('strong');
    expect(systemsFamily?.patterns).toContain('S1');
  });

  it('should find a medium (prefix) match', () => {
    const result = runSevenVoicesStressTest({
        word: "testing",
        language: "en",
        primaryVoicePath: "A → I → O" // A -> I is a pattern
    });

    expect(result.vowelPath).toBe("A → I → O");
    const i2Match = result.matches.find(m => m.patternId === 'I2'); // I2 is ["A", "I"]
    expect(i2Match).toBeDefined();
    expect(i2Match?.strength).toBe('medium');
    expect(i2Match?.reason).toContain('prefix');

    const identityFamily = result.families.find(f => f.family === 'IDENTITY');
    expect(identityFamily).toBeDefined();
    expect(identityFamily?.strongest).toBe('medium');
  });

    it('should return an empty set of matches for an unknown path', () => {
        const result = runSevenVoicesStressTest({
            word: 'example',
            language: 'en',
            primaryVoicePath: 'Y → Y → Y',
        });

        expect(result.matches.length).toBe(0);
        expect(result.families.length).toBe(0);
        expect(result.tensions).toContain('No strong pattern match found for this vowel path.');
    });
});
