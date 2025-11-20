
// src/shared/analysisAdapter.ts

import type {
  EnginePayload,
  Vowel,
  LanguageFamily,
  EnginePath,
  AnalysisResult,
  AnalysisCore,
  AnalysisCoreInput,
  AnalysisCoreVoices,
  AnalysisConsonants,
  AnalysisHeartPaths,
  Candidate,
  TensionLevel,
} from './engineShape';

// --- Helper Functions ---

function normalizeWord(word: string): string {
  return word.toLowerCase().trim();
}

function mapMode(mode: 'strict' | 'open'): 'strict' | 'explore' {
  return mode === 'open' ? 'explore' : 'strict';
}

function guessLanguageFromFamilies(families?: LanguageFamily[]): {
  languageGuess: string;
  confidence: 'low' | 'medium' | 'high';
  dialectGuess?: string;
} {
  if (!families || families.length === 0) {
    return { languageGuess: 'unknown', confidence: 'low', dialectGuess: 'unknown' };
  }

  const topFamily = families.reduce(
    (max, fam) => (fam.confidence > max.confidence ? fam : max),
    families[0]
  );

  let confidence: 'low' | 'medium' | 'high';
  if (topFamily.confidence > 0.66) {
    confidence = 'high';
  } else if (topFamily.confidence > 0.33) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    languageGuess: topFamily.familyId,
    confidence: confidence,
    dialectGuess: topFamily.dialect ?? 'unknown',
  };
}

function countVoices(voices: Vowel[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const voice of voices) {
    counts[voice] = (counts[voice] || 0) + 1;
  }
  return counts;
}

function mapLevels(levelPath: number[]): ('high' | 'mid' | 'low')[] {
  // if n >= 2 → 'high'
  // if n === 1 → 'mid'
  // else → 'low'.
  return levelPath.map(n => {
    if (n >= 2) return 'high';
    if (n === 1) return 'mid';
    return 'low';
  });
}

function estimateTension(primaryPath: EnginePath): TensionLevel {
  const ops = primaryPath.ops ?? [];
  const nonKeepOps = ops.filter(op => op !== 'keep').length;

  if (nonKeepOps <= 1) {
    return 'low';
  }
  if (nonKeepOps <= 3) {
    return 'medium';
  }
  return 'high';
}

function makeStudyCandidates(payload: EnginePayload): Candidate[] {
  const primary = payload.primaryPath;

  // We'll reuse the word-level voices as the base for candidate voices.
  const baseVoiceSequence = primary.voicePath;
  const baseRingPath = primary.ringPath;

  // Helper to count dominant voices.
  const dominant = baseVoiceSequence.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {});

  // Latin candidate: studium
  const latinCandidate: Candidate = {
    id: 'lat_study_01',
    language: 'latin',
    family: 'latin',
    form: 'studium',
    decomposition: {
      parts: [
        {
          role: 'action',
          form: 'stu-',
          gloss: 'to apply oneself, be eager'
        },
        {
          role: 'instrument',
          form: '-di-',
          gloss: 'knowing, thinking'
        },
        {
          role: 'unit',
          form: '-um',
          gloss: 'state, formed result'
        }
      ],
      functionalStatement:
        'Deliberate effort of knowing that leads to a formed inner state.'
    },
    voices: {
      // Conceptually: U → I → U (depth → insight → stabilized state).
      voiceSequence: ['U', 'I', 'U'],
      ringPath: [1, 1, 1],
      dominantVoices: {
        U: 2,
        I: 1
      }
    },
    ruleChecks: {
      soundPathOk: true,
      functionalDecompOk: true,
      sevenVoicesAlignmentOk: true,
      consonantMeaningOk: true,
      harmonyOk: true
    },
    principleSignals: {
      truthOk: true,
      expansionOk: true,
      insightOk: true,
      balanceOk: true,
      unityOk: true,
      networkIntegrityOk: true,
      evolutionOk: true,
      notes: [
        'Classical etymology agrees this is the historical Latin source.',
        'Functional story matches common use: focused effort to learn.'
      ]
    },
    status: 'pass',
    confidenceTag: 'solid'
  };

  // Albanian functional candidate: s'tu-di-m
  const albanianCandidate: Candidate = {
    id: 'alb_study_01',
    language: 'albanian',
    family: 'albanian',
    form: "s'tu-di-m",
    decomposition: {
      parts: [
        {
          role: 'action',
          form: "s'tu",
          gloss: 'what is not yours / outside you'
        },
        {
          role: 'instrument',
          form: 'di',
          gloss: 'to know'
        },
        {
          role: 'unit',
          form: 'm',
          gloss: 'to make it mine / into me'
        }
      ],
      functionalStatement:
        'Turning what is not yours into something you know and make your own.'
    },
    voices: {
      // Conceptually: U → I (depth → insight).
      voiceSequence: ['U', 'I'],
      ringPath: [1, 1],
      dominantVoices: {
        U: 1,
        I: 1
      }
    },
    ruleChecks: {
      soundPathOk: true,
      functionalDecompOk: true,
      sevenVoicesAlignmentOk: true,
      consonantMeaningOk: true,
      harmonyOk: true
    },
    principleSignals: {
      truthOk: true,
      expansionOk: true,
      insightOk: true,
      balanceOk: true,
      unityOk: true,
      networkIntegrityOk: true,
      evolutionOk: true,
      notes: [
        'Functional decomposition matches the Seven-Voices logic of study as making what is not yours become yours.',
        'Presented as a functional origin, not as the exclusive historical source.'
      ]
    },
    status: 'pass',
    confidenceTag: 'solid'
  };

  return [latinCandidate, albanianCandidate];
}

export function enginePayloadToAnalysisResult(payload: EnginePayload): AnalysisResult {
  const normalized = normalizeWord(payload.word);

  // 1) Input / language guess
  const lg = guessLanguageFromFamilies(payload.languageFamilies);

  const inputCore: AnalysisCoreInput = {
    raw: payload.word,
    normalized,
    alphabet: payload.alphabet,
    languageGuess: lg.languageGuess,
    languageConfidence: lg.confidence,
    dialectGuess: lg.dialectGuess,
    mode: mapMode(payload.mode)
  };

  // 2) Voices from primaryPath
  const primary = payload.primaryPath;
  const levelPath = mapLevels(primary.levelPath ?? []);

  const voicesCore: AnalysisCoreVoices = {
    vowelVoices: primary.voicePath,
    ringPath: primary.ringPath,
    levelPath,
    dominantVoices: countVoices(primary.voicePath)
  };

  // 3) Consonants from windows / windowClasses (placeholder harmony)
  const clusters = (payload.windows || []).map((w, idx) => ({
    cluster: w,
    classes: [payload.windowClasses?.[idx] ?? 'unknown'],
    orbitSlots: [],
    harmonyScore: 0.5
  }));

  const consonantsCore: AnalysisConsonants = {
    clusters,
    overallHarmony: {
      byVoice: {},
      globalHarmonyScore: 0.5
    }
  };

  // 4) Heart paths summary
  const heartPathsCore: AnalysisHeartPaths = {
    primary: {
      voiceSequence: primary.voicePath,
      ringPath: primary.ringPath,
      tensionLevel: estimateTension(primary)
    },
    frontierCount: payload.frontierPaths?.length ?? 0
  };

  const core: AnalysisCore = {
    word: payload.word,
    engineVersion: payload.engineVersion,
    input: inputCore,
    voices: voicesCore,
    consonants: consonantsCore,
    heartPaths: heartPathsCore
  };

  // 5) Map languageFamilies -> experimental candidates (placeholder)
  let candidates: Candidate[];

  const normalizedWord = normalized; // from earlier in the function

  if (normalizedWord === 'study') {
    // Real, hand-crafted candidates for the word "study".
    candidates = makeStudyCandidates(payload);
  } else {
    // Default: placeholder candidates from languageFamilies.
    candidates = (payload.languageFamilies ?? []).map((lf, idx) => {
      return {
        id: `family_${lf.familyId}_${idx}`,
        language: lf.familyId,
        family: lf.familyId,
        form: payload.word,
        decomposition: {
          parts: [],
          functionalStatement: lf.rationale || ''
        },
        voices: {
          voiceSequence: primary.voicePath,
          ringPath: primary.ringPath,
          dominantVoices: countVoices(primary.voicePath)
        },
        ruleChecks: {
          soundPathOk: true,
          functionalDecompOk: false, // no real decomposition yet
          sevenVoicesAlignmentOk: true,
          consonantMeaningOk: true,
          harmonyOk: true
        },
        principleSignals: {
          truthOk: true,
          expansionOk: true,
          insightOk: true,
          balanceOk: true,
          unityOk: true,
          networkIntegrityOk: true,
          evolutionOk: true,
          notes: [
            'Placeholder candidate generated from languageFamilies; no real origin decomposition yet.'
          ]
        },
        status: 'experimental',
        confidenceTag: 'speculative'
      };
    });
  }

  const debug = {
    rawEnginePayload: payload,
    signals: payload.signals ?? [],
    edgeWindows: payload.edgeWindows ?? []
  };

  return {
    core,
    candidates,
    debug
  };
}
