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
  Vowel,
  WordMatrix,
  DeepRootSummary,
} from '@/shared/engineShape';
import { ENGINE_VERSION } from './version';
import { solveWord } from '@/functions/sevenVoicesCore';
import { getManifest } from './manifest';
import type { SolveOptions } from '@/functions/sevenVoicesCore';
import { CANON_CANDIDATES } from '@/shared/canonCandidates';
import { computeMath7ForResult } from "./math7";
import { computeDeepRoot } from '@/functions/deepRootEngine';

function runSevenVoices(word: string, opts: { mode: 'strict' | 'open' }): any {
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

  // A simplified adaptation for the pipeline
  return {
    word: word,
    sanitized: word.toLowerCase().replace(/[^a-zë]/g, ''),
    primaryPath: analysis.primaryPath,
    frontier: analysis.frontierPaths,
    languageFamilies: [], // will be populated by canon candidates
    meta: {
      engineVersion: ENGINE_VERSION,
      createdAt: new Date().toISOString(),
      mode: opts.mode,
    },
    // For later pipeline steps
    rawPayload: analysis,
  };
}

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

function attachCanonCandidates(base: any): any {
  const word = base.word.toLowerCase();
  const canon = CANON_CANDIDATES[word] || [];

  // Words whose canon entries are treated as having true "manual" matrices
  const MANUAL_MATRIX_WORDS = new Set(['study', 'damage', 'dëmtim', 'mathematics']);

  const languageFamilies: LanguageFamilyCandidate[] = canon.map(
    (c: Candidate): LanguageFamilyCandidate => {
      const treatAsManual =
        MANUAL_MATRIX_WORDS.has(word) && !!c.morphologyMatrix;

      const matrix: MorphologyMatrix = treatAsManual
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

function attachMorphology(base: any): any {
  // Logic is now inside attachCanonCandidates for simplicity. This is a pass-through.
  return base;
}

function buildSymbolicLayer(base: any): SymbolicLayer | undefined {
  const notes: string[] = [];

  (base.languageFamilies as LanguageFamilyCandidate[]).forEach((candidate) => {
    if (candidate.symbolic) {
      candidate.symbolic.forEach((tag: SymbolicTag) => notes.push(tag.note));
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

export function analyzeWord(word: string, mode: 'strict' | 'open' = 'strict'): AnalyzeWordResult {
  const base = runSevenVoices(word, { mode });
  const withCanon = attachCanonCandidates(base);
  const withMorph = attachMorphology(withCanon);

  const symbolic = buildSymbolicLayer(withCanon);

  const join = (arr: any[]) => (arr || []).join(' → ');

  const result: AnalyzeWordResult = {
    word: word,
    sanitized: withCanon.sanitized,

    primaryPath: {
      voicePath: join(withCanon.primaryPath.voicePath),
      levelPath: join(
        withCanon.primaryPath.levelPath.map((l: number) =>
          l === 1 ? 'high' : l === 0 ? 'mid' : 'low'
        ),
      ),
      ringPath: join(withCanon.primaryPath.ringPath),
    },

    frontier: (withCanon.frontier || []).map((alt: any, idx: number) => ({
      id: `alt-${idx + 1}`,
      voicePath: join(alt.voicePath),
      levelPath: join(
        alt.levelPath.map((l: number) =>
          l === 1 ? 'high' : l === 0 ? 'mid' : 'low'
        ),
      ),
      ringPath: join(alt.ringPath),
    })),

    languageFamilies: withCanon.languageFamilies,

    meta: {
      engineVersion: withCanon.meta.engineVersion,
      createdAt: withCanon.meta.createdAt,
      mode: mode,
      alphabet: withCanon.rawPayload.alphabet,
      solveMs: withCanon.rawPayload.solveMs,
    },
    symbolic,
  };

  // 🔢 Heart math
  const math7 = computeMath7ForResult(result);

  // 🧩 Compact Word Matrix summary
  const wordMatrix = buildWordMatrix(
    result.word,
    result.languageFamilies,
    math7 || undefined
  );
  
  // 🔎 Attach DeepRoot proto-root layer (best effort, non-blocking)
  const deepRoot = computeDeepRoot(result);

  return { ...result, math7, wordMatrix, deepRoot };
}


function buildWordMatrix(
  word: string,
  families: LanguageFamilyCandidate[],
  math7?: { primary?: { principlesPath?: string[] } }
): WordMatrix | null {
  if (!families || families.length === 0) return null;

  const primary =
    families.find(f => f.passes && !f.speculative) ?? families[0];
  if (!primary || !primary.morphologyMatrix) return null;

  const m = primary.morphologyMatrix;

  const root = m.pivot;
  const suffixes =
    m.morphemes?.filter(mm => mm.role !== "root").map(mm => mm.form) ?? [];

  const wordSums =
    m.wordSums?.map(ws => `${ws.parts.join(" + ")} → ${ws.result}`) ?? [];

  const principles = math7?.primary?.principlesPath ?? [];

  const symbolicNotes =
    primary.symbolic?.map(tag => tag.note).join(" | ");

  return {
    word,
    languageFamily: primary.language,
    morphology: {
      root,
      suffixes: suffixes.length ? suffixes : undefined,
      gloss: m.meaning,
    },
    meaning: primary.gloss,
    wordSums: wordSums.length ? wordSums : undefined,
    principles,
    symbolicNotes,
  };
}
