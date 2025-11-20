
import { mapPathToPrinciples, getVoiceMeta, SEVEN_VOICES } from '../src/shared/sevenVoices';

describe('Seven Voices metadata', () => {
  it('maps U→I path to Unity→Insight', () => {
    const summary = mapPathToPrinciples(['U', 'I']);

    expect(summary.principlePath).toEqual(['Unity', 'Insight']);
    expect(summary.dominantVoices.sort()).toEqual(['I', 'U']);
    expect(summary.dominantPrinciples.sort()).toEqual(['Insight', 'Unity']);
    expect(summary.sevenWords.length).toBe(7);
    expect(summary.sevenWords[0]).toBe('Truth');
    expect(summary.sevenWords[6]).toBe('Evolution');
  });

  it('Voice meta matches engine manifest for O', () => {
    const o = getVoiceMeta('O');
    expect(o.ring).toBe(0);
    expect(o.principle).toBe('Balance');
  });
});
