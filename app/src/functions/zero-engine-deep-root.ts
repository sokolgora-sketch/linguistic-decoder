// src/functions/zero-engine-deep-root.ts
// This file will contain the DeepRoot builder logic and related helpers.
// For now, it exports a `computeDeepRoot` function for testing.

import { buildDeepRootFromHeart } from './zero-layer2-mind';
import {
  makeHeartDamage,
  makeHeartDemtim,
  makeHeartStudy,
  makeHeartMathematics,
  makeHeartReligion,
  makeHeartMystery,
  makeHeartPhilosophy,
  makeHeartFilozofi,
  makeHeartLanguage,
} from './zero-engine-smoke';
import type { DeepRootResult } from './zero-heart-types';

/**
 * Test helper to generate a DeepRootResult for a canonical word.
 * This wraps the smoke test's Heart builders and the Mind layer.
 */
export function computeDeepRoot(word: string): DeepRootResult | null {
  const w = word.toLowerCase();
  let heart;

  switch (w) {
    case 'damage':
      heart = makeHeartDamage();
      break;
    case 'dëmtim':
      heart = makeHeartDemtim();
      break;
    case 'study':
      heart = makeHeartStudy();
      break;
    case 'mathematics':
      heart = makeHeartMathematics();
      break;
    case 'religion':
      heart = makeHeartReligion();
      break;
    case 'mystery':
      heart = makeHeartMystery();
      break;
    case 'philosophy':
      heart = makeHeartPhilosophy();
      break;
    case 'filozofi':
      heart = makeHeartFilozofi();
      break;
    case 'language':
      heart = makeHeartLanguage();
      break;
    default:
      return null;
  }

  return buildDeepRootFromHeart(heart);
}
