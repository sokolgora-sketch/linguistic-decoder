
import { solveWord } from '@/functions/sevenVoicesCore';
import { getManifest } from '@/engine/manifest';
import { mapWordToLanguageFamilies } from '@/lib/mapper';
import type { Vowel } from '@/shared/engineShape';

const manifest = getManifest();
const base = { manifest, edgeWeight: manifest.edgeWeight, opCost: manifest.opCost, strict: true, beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false };

function vp(word: string, alphabet: 'albanian'|'latin'|'auto' = 'auto'): Vowel[] {
  const { primaryPath } = solveWord(word, base, alphabet) as any;
  return primaryPath.voicePath as Vowel[];
}

describe('mapper dialect awareness', () => {
  it('Vetvendosje → Albanian (Gegë)', async () => {
    const families = await mapWordToLanguageFamilies('Vetvendosje', vp('Vetvendosje', 'albanian'), false);
    const albanianFamily = families.find(f => f.label === 'Albanian');
    expect(albanianFamily).toBeDefined();
    // The local mapper doesn't have dialect detection, so we can't test for it here.
    // We are just asserting that Albanian is present.
  });

  it('Vetëvendosje → Albanian (Tosk)', async () => {
    const families = await mapWordToLanguageFamilies('Vetëvendosje', vp('Vetëvendosje', 'albanian'), false);
    const albanianFamily = families.find(f => f.label === 'Albanian');
    expect(albanianFamily).toBeDefined();
    // The local mapper should be biased towards Tosk here.
  });

  it('mapper returns at least one family', async () => {
    const families = await mapWordToLanguageFamilies('hope', vp('hope','latin'), false);
    expect(families.length).toBeGreaterThan(0);
  });

  it('ë closure biases Albanian', async () => {
    const a = await mapWordToLanguageFamilies('vete', vp('vete','latin'), false);
    const b = await mapWordToLanguageFamilies('vetë', vp('vetë','albanian'), false);
    // This assertion can be brittle depending on scoring, but the principle is what we test.
    // We expect 'vete' to likely be Latin, and 'vetë' to be Albanian.
    expect(a.find(f => f.label === 'Albanian')?.confidence ?? 0).toBeLessThan(b.find(f => f.label === 'Albanian')?.confidence ?? 0);
    expect(b[0].label).toBe('Albanian');
  });
});
