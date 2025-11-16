
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
    expect(families[0].label).toBe('Albanian');
    expect((families[0] as any).dialect).toBe('geg');
  });

  it('Vetëvendosje → Albanian (Tosk)', async () => {
    const families = await mapWordToLanguageFamilies('Vetëvendosje', vp('Vetëvendosje', 'albanian'), false);
    expect(families[0].label).toBe('Albanian');
    expect((families[0] as any).dialect).toBe('tosk');
  });

  it('mapper returns at least one family', async () => {
    const families = await mapWordToLanguageFamilies('hope', vp('hope','latin'), false);
    expect(families.length).toBeGreaterThan(0);
  });

  it('ë closure biases Albanian', async () => {
    const a = await mapWordToLanguageFamilies('vete', vp('vete','latin'), false);
    const b = await mapWordToLanguageFamilies('vetë', vp('vetë','albanian'), false);
    expect(a[0].label).not.toBe('Albanian');   // often Latin first without cues
    expect(b[0].label).toBe('Albanian');
  });
});
