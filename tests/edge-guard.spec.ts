
import { solveWord } from '@/functions/sevenVoicesCore';
import { getManifest } from '@/engine/manifest';

const manifest = getManifest();
const baseOpts = { manifest, edgeWeight: manifest.edgeWeight, opCost: manifest.opCost, maxOps: 1, beamWidth: 8, allowDelete: false, allowClosure: false };

test('edge bias does not flip "hope" primary up to 0.5', () => {
  const baseline = (solveWord('hope', { ...baseOpts, edgeWeight: 0 }, 'latin') as any)
    .primaryPath.voicePath.join('→');

  for (const w of [0.15, 0.25, 0.4, 0.5]) {
    const got = (solveWord('hope', { ...baseOpts, edgeWeight: w }, 'latin') as any)
      .primaryPath.voicePath.join('→');
    expect(got).toBe(baseline); // stability assertion
  }
});
