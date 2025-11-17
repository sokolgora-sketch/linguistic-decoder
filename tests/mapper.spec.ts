
import { runAnalysis } from '@/lib/runAnalysis';
import { getManifest } from '@/engine/manifest';
import { detectAlphabetFair } from '@/lib/alphabet/autoDetect';
import type { Vowel } from '@/shared/engineShape';
import type { Alphabet } from '@/lib/runAnalysis';

const manifest = getManifest();
const base: any = { manifest, edgeWeight: manifest.edgeWeight, opCost: manifest.opCost, maxOps: 1, beamWidth: 8, allowDelete: false, allowClosure: false, alphabet: "auto" };

function vp(word: string, alphabet: Alphabet = 'auto'): Vowel[] {
  const { primaryPath } = runAnalysis(word, base, alphabet) as any;
  return primaryPath.voicePath as Vowel[];
}

function families(word:string, voicePath: Vowel[]) {
    return detectAlphabetFair(word, voicePath, 'auto');
}


describe('mapper dialect awareness', () => {
  it('Vetvendosje → Albanian (Gegë)', () => {
    const { scores } = families('Vetvendosje', vp('Vetvendosje', 'albanian'));
    const albanianFamily = scores.find(f => f.family === 'albanian');
    expect(albanianFamily).toBeDefined();
    expect((albanianFamily as any).dialect).toBe('geg');
  });

  it('Vetëvendosje → Albanian (Tosk)', () => {
    const { scores } = families('Vetëvendosje', vp('Vetëvendosje', 'albanian'));
    const albanianFamily = scores.find(f => f.family === 'albanian');
    expect(albanianFamily).toBeDefined();
    expect((albanianFamily as any).dialect).toBe('tosk');
  });

  it('mapper returns at least one family', () => {
    const { scores } = families('hope', vp('hope','latin'));
    expect(scores.length).toBeGreaterThan(0);
  });

  it('ë biases Albanian', () => {
    const a = families('vete', vp('vete','latin'));
    const b = families('vetë', vp('vetë','albanian'));

    const confidenceA = a.scores.find(f => f.family === 'albanian')?.score ?? 0;
    const confidenceB = b.scores.find(f => f.family === 'albanian')?.score ?? 0;

    expect(confidenceA).toBeLessThan(confidenceB);
    expect(b.winner).toBe('albanian');
  });
});
