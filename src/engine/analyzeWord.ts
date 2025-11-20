// src/engine/analyzeWord.ts
import type { AnalyzeWordResult } from '@/shared/engineShape';
import { ENGINE_VERSION } from './version';
import { solveWord } from '@/functions/sevenVoicesCore';
import { enginePayloadToAnalysisResult } from '@/shared/analysisAdapter';
import { getManifest } from './manifest';
import type { Alphabet } from '@/lib/runAnalysis';
import type { SolveOptions } from '@/functions/sevenVoicesCore';

function runSevenVoices(word: string, opts: { mode: 'strict' | 'explore' }): any {
  const manifest = getManifest();
  const isStrict = opts.mode === 'strict';

  const solveOpts: SolveOptions = {
    beamWidth: 8,
    maxOps: isStrict ? 1 : 2,
    allowDelete: !isStrict,
    allowClosure: !isStrict,
    opCost: manifest.opCost,
    alphabet: 'auto',
    manifest,
    edgeWeight: manifest.edgeWeight,
  };

  const analysis = solveWord(word, solveOpts, 'auto');
  const result = enginePayloadToAnalysisResult({
    ...analysis,
    word: word,
    mode: opts.mode === 'strict' ? 'strict' : 'open',
    alphabet: 'auto',
    engineVersion: ENGINE_VERSION,
  });

  return result;
}

function attachCanonCandidates(base: any): any {
  // This logic is already handled inside enginePayloadToAnalysisResult,
  // which is called by runSevenVoices. So this is a pass-through.
  return base;
}
function attachMorphology(base: any): any {
  // This logic is also handled inside enginePayloadToAnalysisResult
  // via the canon candidates. Pass-through.
  return base;
}
function attachSymbolicLayer(base: any): any {
  // This is also handled inside enginePayloadToAnalysisResult
  return base;
}

export function analyzeWord(word: string, mode: 'strict' | 'explore' = 'strict'): AnalyzeWordResult {
  const base = runSevenVoices(word, { mode });
  const withCanon = attachCanonCandidates(base);
  const withMorph = attachMorphology(withCanon);
  const withSymbols = attachSymbolicLayer(withMorph);

  const join = (arr: any[]) => (arr || []).join(' → ');

  const result: AnalyzeWordResult = {
    word: word,
    sanitized: withSymbols.core.input.normalized,

    primaryPath: {
      voicePath: join(withSymbols.core.voices.vowelVoices),
      levelPath: join(withSymbols.core.voices.levelPath),
      ringPath: join(withSymbols.core.voices.ringPath),
    },

    frontier: (withSymbols.debug?.rawEnginePayload?.frontierPaths || []).map((alt: any, idx: number) => ({
      id: `alt-${idx + 1}`,
      voicePath: join(alt.voicePath),
      levelPath: join(alt.levelPath.map((l: number) => l === 1 ? 'high' : l === 0 ? 'mid' : 'low')),
      ringPath: join(alt.ringPath),
    })),

    languageFamilies: (withSymbols.candidates || []).map((lf: any) => ({
      language: lf.language,
      form: lf.form,
      gloss: lf.decomposition.functionalStatement,
      passes: lf.status === 'pass',
      experimental: lf.status === 'experimental',
      speculative: lf.confidenceTag === 'speculative',
      voicePath: join(lf.voices?.voiceSequence),
      levelPath: 'N/A', // This data isn't on the candidate level in the old model
      ringPath: join(lf.voices?.ringPath),
      morphologyMatrix: lf.morphologyMatrix,
      symbolic: lf.symbolic,
    })),

    meta: {
      engineVersion: withSymbols.core.engineVersion,
      createdAt: new Date().toISOString(),
    },
  };

  return result;
}
