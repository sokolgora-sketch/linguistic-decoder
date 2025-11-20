
// If your exported API differs, adjust this import to your real entry:
import { runAnalysis } from '@/lib/runAnalysis';
import { getManifest } from '@/engine/manifest';

const manifest = getManifest();

type Vowel = 'A'|'E'|'I'|'O'|'U'|'Y'|'Ë';
type Primary = { voicePath: Vowel[]; ringPath: number[] };

const opts: any = {
  beamWidth: 8, 
  maxOps: 1, 
  allowDelete: false, 
  allowClosure: false,
  edgeWeight: manifest.edgeWeight,
  opCost: manifest.opCost,
  manifest,
};

function norm(v: string[] | string) {
  const arr = Array.isArray(v) ? v : v.split(/[\s>,-]+/);
  return arr.map(s => s.normalize('NFC').toUpperCase()).join('→');
}

function expectPrimary(word: string, expectedPath: string, expectedRings: number[]) {
  const { primaryPath } = runAnalysis(word, opts, 'auto') as { primaryPath: Primary };
  expect(norm(primaryPath.voicePath)).toBe(norm(expectedPath));
  expect(primaryPath.ringPath).toEqual(expectedRings);
}

describe('Seven-Voices core — smoke', () => {
  test('study → U→I (rings 1→1)', () => {
    expectPrimary('study', 'U→I', [1,1]);
  });

  test('damage → A→E (rings 3→2)', () => {
    expectPrimary('damage', 'A→E', [3,2]);
  });

  test('hope → O→E (rings 0→2)', () => {
    expectPrimary('hope', 'O→E', [0,2]);
  });
});
