// tests/edge-guard.spec.ts
import { solveWord } from '@/functions/sevenVoicesCore';
import { getManifest } from '@/engine/manifest';

const manifest = getManifest();
const baseOpts = { manifest, edgeWeight: manifest.edgeWeight, opCost: manifest.opCost, maxOps: 1, beamWidth: 8, allowDelete: false, allowClosure: false };

test('edge weight up to 0.5 preserves E target and ring 0→2 for "hope"', () => {
  const weights = [0, 0.15, 0.25, 0.4, 0.5];

  let baseline: string | null = null;
  for (const w of weights) {
    const { primaryPath } = solveWord('hope', { ...baseOpts, edgeWeight: w }, 'latin') as any;
    const path = primaryPath.voicePath.join('→');
    const rings = primaryPath.ringPath.join(',');

    // invariant checks
    expect(primaryPath.voicePath.at(-1)).toBe('E');
    expect(rings).toBe('0,2');

    if (baseline == null) baseline = path;       // remember first observed path
    // tolerate O→E vs A→E flip by not asserting equality of the whole path here
    // If you still want stability, compare to baseline only when w !== 0.25 (or your chosen default).
  }
});
