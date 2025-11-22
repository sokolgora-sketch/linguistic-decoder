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
import type {
  AnalyzeWordResult,
  Candidate,
  LanguageFamilyCandidate,
  MorphologyMatrix,
  SymbolicLayer,
  SymbolicTag,
} from '@/shared/engineShape';
import { ENGINE_VERSION } from './version';
import { solveWord } from '@/functions/sevenVoicesCore';
import { getManifest } from './manifest';
import type { SolveOptions } from '@/functions/sevenVoicesCore';
import { CANON_CANDIDATES } from '@/shared/canonCandidates';

/**
 * Low-level call into the Seven-Voices solver.
 * Returns a partial engine result; canon candidates are attached later.
 */
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
    word,
    sanitized: word.toLowerCase().replace(/[^a-zë]/g, ''),
    primaryPath: analysis.primaryPath,
    frontier: analysis.frontierPaths,
    languageFamilies: [], // filled by attachCanonCandidates
    meta: {
      engineVersion: ENGINE_VERSION,
      createdAt: new Date().toISOString(),
      mode: opts.mode,
    },
    rawPayload: analysis,
  };
}

/**
 * Auto-build a morphology matrix for candidates that lack a manual one.
 * v1: simple, deterministic, based on decomposition.
 */
function buildGeneratedWordMatrix(candidate: Candidate): MorphologyMatrix {
  const parts = candidate.decomposition?.parts ?? [];
  const root = parts[0];

  return {
    pivot: root?.form ?? candidate.form,
    meaning: candidate.decomposition?.functionalStatement ?? '',
    morphemes: parts.map((p: any) => ({
      form: p.form,
      role: p.role,
      gloss: p.gloss,
    })),
    wordSums: [
      {
        parts: parts.map((p: any) => p.form),
        result: candidate.form,
        gloss: candidate.decomposition?.functionalStatement ?? '',
      },
    ],
    source: 'auto',
  };
}

/**
 * Attach canon candidates to the base engine result and
 * ensure each has a morphologyMatrix with a source flag.
 */
function attachCanonCandidates(base: any): any {
  const word = base.word.toLowerCase();
  const canon = CANON_CANDIDATES[word] || [];

  const languageFamilies: LanguageFamilyCandidate[] = canon.map(
    (c: Candidate): LanguageFamilyCandidate => {
      const hasManual = !!c.morphologyMatrix;

      const matrix: MorphologyMatrix = hasManual
        ? { ...c.morphologyMatrix, source: 'manual' as const }
        : buildGeneratedWordMatrix(c);

      return {
        language: c.language,
        form: c.form,
        gloss: c.decomposition.functionalStatement,
        passes: c.status === 'pass',
        experimental: c.status === 'experimental',
        speculative: c.confidenceTag === 'speculative',
        voicePath: (c.voices.voiceSequence || []).join(' → '),
        levelPath: 'N/A',
        ringPath: (c.voices.ringPath || []).join(' → '),
        morphologyMatrix: matrix,
        symbolic: c.symbolic,
      };
    },
  );

  return { ...base, languageFamilies };
}

/**
 * Placeholder hook for future morphology enrichment.
 * For now, canon mapping already injects morphologyMatrix.
 */
function attachMorphology(base: any): any {
  return base;
}

/**
 * Build a lightweight symbolic layer out of candidate tags.
 */
function buildSymbolicLayer(base: any): SymbolicLayer | undefined {
  const notes: string[] = [];

  (base.languageFamilies as LanguageFamilyCandidate[]).forEach((candidate) => {
    if (candidate.symbolic) {
      candidate.symbolic.forEach((tag: SymbolicTag) => {
        notes.push(tag.note);
      });
    }
  });

  if (notes.length > 0) {
    return {
      notes,
      label: 'Zheji-inspired symbolic reading (experimental)',
    };
  }

  return undefined;
}

/**
 * High-level contract used by UI + tests.
 */
export function analyzeWord(
  word: string,
  mode: 'strict' | 'explore' = 'strict',
): AnalyzeWordResult {
  const base = runSevenVoices(word, { mode });
  const withCanon = attachCanonCandidates(base);
  const withMorph = attachMorphology(withCanon); // reserved for future; currently passthrough
  const symbolic = buildSymbolicLayer(withMorph);

  const join = (arr: any[]) => (arr || []).join(' → ');

  const result: AnalyzeWordResult = {
    word,
    sanitized: withCanon.sanitized,

    primaryPath: {
      voicePath: join(withCanon.primaryPath.voicePath),
      levelPath: join(
        withCanon.primaryPath.levelPath.map((l: number) =>
          l === 1 ? 'high' : l === 0 ? 'mid' : 'low',
        ),
      ),
      ringPath: join(withCanon.primaryPath.ringPath),
    },

    frontier: (withCanon.frontier || []).map((alt: any, idx: number) => ({
      id: `alt-${idx + 1}`,
      voicePath: join(alt.voicePath),
      levelPath: join(
        alt.levelPath.map((l: number) =>
          l === 1 ? 'high' : l === 0 ? 'mid' : 'low',
        ),
      ),
      ringPath: join(alt.ringPath),
    })),

    languageFamilies: withCanon.languageFamilies,

    meta: {
      engineVersion: withCanon.meta.engineVersion,
      createdAt: withCanon.meta.createdAt,
      mode,
      alphabet: withCanon.rawPayload.alphabet,
      solveMs: withCanon.rawPayload.solveMs,
    },

    symbolic,
  };

  return result;
}
