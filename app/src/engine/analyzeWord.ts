/**
 * ❤️ ANALYZE WORD HEART (HIGH-LEVEL RESULT)
 *
 * This file wraps the Seven-Voices engine + canon candidates + symbolic layer
 * into a single AnalyzeWordResult shape used by the UI and tests.
 *
 * Contract is locked by:
 *  - tests/analyzeWord.spec.ts
 *  - tests/canonCandidates.spec.ts
 *  - tests/symbolicLayer.spec.ts
 *
 * IMPORTANT:
 *  - Do NOT change field names or types (e.g. keep primaryPath.voicePath as string[]).
 *  - Do NOT let auto-refactor / AI tools rewrite this file.
 *  - Only extend with OPTIONAL fields, and only if tests stay green.
 */
// src/engine/analyzeWord.ts
import type { AnalyzeWordResult, Candidate, LanguageFamilyCandidate, MorphologyMatrix, SymbolicLayer, SymbolicTag, Vowel, Morpheme } from '@/shared/engineShape';
import { ENGINE_VERSION } from './version';
import { solveWord } from '@/functions/sevenVoicesCore';
import { getManifest } from './manifest';
import type { SolveOptions } from '@/functions/sevenVoicesCore';
import { CANON_CANDIDATES } from '@/shared/canonCandidates';
import { wordMatrixExamples } from "./wordMatrix";
import { getVoiceMeta } from '@/shared/sevenVoices';

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
  
  return {
    word: word,
    sanitized: word.toLowerCase().replace(/[^a-zë]/g, ''),
    primaryPath: analysis.primaryPath,
    frontier: analysis.frontierPaths,
    languageFamilies: [], 
    meta: {
        engineVersion: ENGINE_VERSION,
        createdAt: new Date().toISOString(),
        mode: opts.mode,
    },
    rawPayload: analysis,
  };
}


/**
 * v1: pure, deterministic, no network calls.
 * Auto-generates a WordMatrix for candidates that don't have a manual one.
 */
export function buildGeneratedWordMatrix(candidate: Candidate, word: string): MorphologyMatrix {
  const root = candidate.decomposition.parts[0] ?? { form: candidate.form, gloss: 'word', role: 'root' };
  
  const morphemes: Morpheme[] = candidate.decomposition.parts.map(p => ({
      form: p.form,
      role: p.role,
      gloss: p.gloss,
  }));

  return {
    pivot: root.form,
    meaning: candidate.decomposition.functionalStatement,
    morphemes: morphemes,
    wordSums: [
      {
        parts: candidate.decomposition.parts.map(p => p.form),
        result: candidate.form,
        gloss: candidate.decomposition.functionalStatement,
      }
    ],
    source: 'auto',
  };
}


function attachCanonCandidates(base: any): any {
    const word = base.word.toLowerCase();
    const canon = CANON_CANDIDATES[word] || [];
    
    const candidates = canon.map((c: Candidate): Candidate => {
        const hasManualMatrix = !!c.morphologyMatrix;
        const baseMatrix = hasManualMatrix
          ? c.morphologyMatrix!
          : buildGeneratedWordMatrix(c, word);

        const matrixWithSource: MorphologyMatrix = {
          ...baseMatrix,
          source: hasManualMatrix ? 'manual' : 'auto',
        };

        return {
            ...c,
            morphologyMatrix: matrixWithSource,
        };
    });

    return { ...base, languageFamilies: candidates };
}

function attachMorphology(base: any): any {
  // Logic is now inside attachCanonCandidates for simplicity. This is a pass-through.
  return base;
}

function buildSymbolicLayer(base: any): SymbolicLayer | undefined {
    const notes: string[] = [];
    base.languageFamilies.forEach((candidate: LanguageFamilyCandidate) => {
        if (candidate.symbolic) {
            candidate.symbolic.forEach(tag => notes.push(tag.note));
        }
    });

    if (notes.length > 0) {
        return {
            notes: notes,
            label: 'Zheji-inspired symbolic reading (experimental)',
        };
    }
    return undefined;
}


export function analyzeWord(word: string, mode: 'strict' | 'explore' = 'strict'): AnalyzeWordResult {
  const base = runSevenVoices(word, { mode });
  const withCanon = attachCanonCandidates(base);
  const withMorph = attachMorphology(withCanon);
  const symbolic = buildSymbolicLayer(withCanon);

  const join = (arr: any[]) => (arr || []).join(' → ');

  const baseResult: AnalyzeWordResult = {
    word: word,
    sanitized: withCanon.sanitized,

    primaryPath: {
      voicePath: join(withCanon.primaryPath.voicePath),
      levelPath: join(withCanon.primaryPath.levelPath.map((l: number) => l === 1 ? 'high' : l === 0 ? 'mid' : 'low')),
      ringPath: join(withCanon.primaryPath.ringPath),
    },

    frontier: (withCanon.frontier || []).map((alt: any, idx: number) => ({
      id: `alt-${idx + 1}`,
      voicePath: join(alt.voicePath),
      levelPath: join(alt.levelPath.map((l: number) => l === 1 ? 'high' : l === 0 ? 'mid' : 'low')),
      ringPath: join(alt.ringPath),
    })),

    languageFamilies: withCanon.languageFamilies.map((c: Candidate) => ({
      language: c.language,
      form: c.form,
      gloss: c.decomposition.functionalStatement,
      passes: c.status === 'pass',
      experimental: c.status === 'experimental',
      speculative: c.confidenceTag === 'speculative',
      voicePath: (c.voices.voiceSequence || []).join(' → '),
      levelPath: 'N/A',
      ringPath: (c.voices.ringPath || []).join(' → '),
      morphologyMatrix: c.morphologyMatrix, // Pass the matrix through directly
      symbolic: c.symbolic,
    })),

    meta: {
      engineVersion: withCanon.meta.engineVersion,
      createdAt: withCanon.meta.createdAt,
      mode: mode,
      alphabet: withCanon.rawPayload.alphabet,
      solveMs: withCanon.rawPayload.solveMs,
    },
    symbolic,
  };

  // The matrix is now attached to the candidate, not the top level.
  // This logic can be simplified as it's now part of the candidate data.
  const matrix = withCanon.languageFamilies.find((c: any) => c.morphologyMatrix)?.morphologyMatrix;

  return {
    ...baseResult,
    wordMatrix: matrix ?? null,
  };
}
