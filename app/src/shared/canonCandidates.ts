
// src/shared/canonCandidates.ts

import type { Candidate } from './engineShape';

export const CANON_CANDIDATES: Record<string, Candidate[]> = {
  study: [
    {
      id: 'lat_study_01',
      language: 'latin',
      family: 'latin',
      form: 'studium',
      decomposition: {
        parts: [
          { role: 'action', form: 'stu-', gloss: 'to apply oneself, be eager' },
          { role: 'instrument', form: '-di-', gloss: 'knowing, thinking' },
          { role: 'unit', form: '-um', gloss: 'state, formed result' },
        ],
        functionalStatement:
          'Deliberate effort of knowing that leads to a formed inner state.',
      },
      voices: {
        voiceSequence: ['U', 'I', 'U'],
        ringPath: [1, 1, 1],
        dominantVoices: { U: 2, I: 1 },
      },
      ruleChecks: {
        soundPathOk: true,
        functionalDecompOk: true,
        sevenVoicesAlignmentOk: true,
        consonantMeaningOk: true,
        harmonyOk: true,
      },
      principleSignals: {
        truthOk: true, expansionOk: true, insightOk: true, balanceOk: true,
        unityOk: true, networkIntegrityOk: true, evolutionOk: true,
        notes: [
          'Classical etymology agrees this is the historical Latin source.',
          'Functional story matches common use: focused effort to learn.',
        ],
      },
      morphology: {
        base: 'stud',
        affixes: ['-ium'],
        wordSums: ['stud + ium → studium (zeal, study)', 'stud + ens → studens (one who studies)'],
        notes: ['Root stud- is productive in Latin with consistent meaning of eager application / study.'],
      },
      fitTag: 'strong',
      status: 'pass',
      confidenceTag: 'solid',
      consonantProfile: 'build',
      consonantProfileOk: true,
      consonantSignals: [
        "Edge cluster 'st' (Plosive + Sibilant) supports focused effort / building an inner state.",
      ],
      axes: {
        principles: 'pass',
        morphology: 'pass',
        consonants: 'pass',
      },
      morphologyMatrix: {
        pivot: 'stud',
        meaning: 'deliberate effort / inner state of focus',
        morphemes: [
          { form: 'stud', role: 'root', gloss: 'zeal, focused effort' },
          { form: 'ium', role: 'suffix', gloss: 'state / condition' },
          { form: 'ens', role: 'suffix', gloss: 'person / agent' },
        ],
        wordSums: [
          { parts: ['stud', 'ium'], result: 'studium', gloss: 'state of focused effort' },
          { parts: ['stud', 'ens'], result: 'students', gloss: 'those in a focused effort to learn' },
        ],
      },
    },
    {
      id: 'alb_study_01',
      language: 'albanian',
      family: 'albanian',
      form: "s'tu-di-m",
      decomposition: {
        parts: [
          { role: 'action', form: "s'tu", gloss: 'what is not yours / outside you' },
          { role: 'instrument', form: 'di', gloss: 'to know' },
          { role: 'unit', form: 'm', gloss: 'to make it mine / into me' },
        ],
        functionalStatement:
          'Turning what is not yours into something you know and make your own.',
      },
      voices: {
        voiceSequence: ['U', 'I'],
        ringPath: [1, 1],
        dominantVoices: { U: 1, I: 1 },
      },
      ruleChecks: {
        soundPathOk: true,
        functionalDecompOk: true,
        sevenVoicesAlignmentOk: true,
        consonantMeaningOk: true,
        harmonyOk: true,
      },
      principleSignals: {
        truthOk: true, expansionOk: true, insightOk: true, balanceOk: true,
        unityOk: true, networkIntegrityOk: true, evolutionOk: true,
        notes: [
          'Functional decomposition matches the Seven-Voices logic of study as making what is not yours become yours.',
          'Presented as a functional origin, not as the exclusive historical source.',
        ],
      },
      morphology: {
        base: "s'tu-di-m",
        affixes: [],
        wordSums: ["s'tu + di + m → s'tu-di-m (what is not yours → know → make it yours)"],
        notes: ['Expressed as a functional, three-part structure matching the Seven-Voices action/instrument/unit pattern.'],
      },
      fitTag: 'strong',
      status: 'pass',
      confidenceTag: 'solid',
      consonantProfile: 'build',
      consonantProfileOk: true,
      consonantSignals: [
        "Consonant pattern matches the idea of moving what is not yours into your own knowledge.",
      ],
      axes: {
        principles: 'pass',
        morphology: 'pass',
        consonants: 'pass',
      },
      morphologyMatrix: {
        pivot: "s'tu",
        meaning: 'what is not yours → to know → make it yours',
        morphemes: [
          { form: "s'tu", role: 'root', gloss: 'not yours' },
          { form: 'di', role: 'root', gloss: 'know' },
          { form: 'm', role: 'suffix', gloss: 'make / become yours' },
        ],
        wordSums: [
          { parts: ["s'tu", 'di', 'm'], result: "s'tu-di-m", gloss: 'turn not-yours into known/owned knowledge' },
        ],
      },
    },
  ],
  damage: [
    {
      id: 'lat_damage_01',
      language: 'latin',
      family: 'latin',
      form: 'damnum',
      decomposition: {
        parts: [
          { role: 'action', form: 'dam-', gloss: 'to harm, to break, to reduce' },
          { role: 'instrument', form: '-n-', gloss: 'acting force / impact' },
          { role: 'unit', form: '-um', gloss: 'state, resulting condition' },
        ],
        functionalStatement:
          'An act that breaks or reduces something, leaving it in a harmed state.',
      },
      voices: {
        voiceSequence: ['A','E'],
        ringPath: [3,2],
        dominantVoices: {A:1, E:1},
      },
      ruleChecks: {
        soundPathOk: true,
        functionalDecompOk: true,
        sevenVoicesAlignmentOk: true,
        consonantMeaningOk: true,
        harmonyOk: true,
      },
      principleSignals: {
        truthOk: true, expansionOk: true, insightOk: true, balanceOk: true,
        unityOk: true, networkIntegrityOk: true, evolutionOk: true,
        notes: [
          'Matches standard historical Latin origin.',
          'Functional story fits: an act that reduces or harms, leaving a damaged state.',
        ],
      },
      morphology: {
        base: 'dam',
        affixes: ['-num'],
        wordSums: [
          'dam + num → damnum (damage, loss)',
          'damn + atio → damnatio (condemnation, infliction of loss)',
        ],
        notes: ['Root dam-/damn- forms a family of Latin words about loss and condemnation.'],
      },
      fitTag: 'strong',
      status: 'pass',
      confidenceTag: 'solid',
      consonantProfile: 'cut',
      consonantProfileOk: true,
      consonantSignals: [
        "Plosive + Nasal pattern (d + m) around outer rings matches 'cut that leaves a harmed state'.",
      ],
      axes: {
        principles: 'pass',
        morphology: 'pass',
        consonants: 'pass',
      },
      morphologyMatrix: {
        pivot: 'dam',
        meaning: 'act that cuts / reduces, leaving a harmed state',
        morphemes: [
          { form: 'dam', role: 'root', gloss: 'harm / loss' },
          { form: 'num', role: 'suffix', gloss: 'resulting state' },
          { form: 'atio', role: 'suffix', gloss: 'act of / process' },
        ],
        wordSums: [
          { parts: ['dam', 'num'], result: 'damnum', gloss: 'state of harm / loss' },
          { parts: ['dam', 'n', 'atio'], result: 'damnatio', gloss: 'infliction / condemnation into harm' },
        ],
      },
    },
    {
      id: 'alb_damage_01',
      language: 'albanian',
      family: 'albanian',
      form: 'dëm',
      decomposition: {
        parts: [
          { role: 'action', form: 'd-', gloss: 'to cut, to separate, to remove' },
          { role: 'instrument', form: 'ë', gloss: 'embodied impact / felt condition' },
          { role: 'unit', form: 'm', gloss: 'the thing that now carries the loss' },
        ],
        functionalStatement:
          'A cut or removal that leaves a thing carrying loss or harm as its new condition.',
      },
      voices: {
        voiceSequence: ['A','E'],
        ringPath: [3,2],
        dominantVoices: {A:1, E:1},
      },
      ruleChecks: {
        soundPathOk: true,
        functionalDecompOk: true,
        sevenVoicesAlignmentOk: true,
        consonantMeaningOk: true,
        harmonyOk: true,
      },
      principleSignals: {
        truthOk: true, expansionOk: true, insightOk: true, balanceOk: true,
        unityOk: true, networkIntegrityOk: true, evolutionOk: true,
        notes: [
          'Functional decomposition matches the idea of damage as a cut/loss that remains.',
          'Presented as a functional origin, not as the exclusive historical source.',
        ],
      },
      morphology: {
        base: 'dëm',
        affixes: ['-tim', '-tar', '-shpërblim'],
        wordSums: [
          'dëm → dëm (harm, loss)',
          'dëm + tim → dëmtim (damaging, act of causing harm)',
          'dëm + shpërblim → dëmshpërblim (compensation for damage)',
        ],
        notes: ['Productive root in Albanian forming a clear family of “harm / damage / compensation” words.'],
      },
      fitTag: 'strong',
      status: 'pass',
      confidenceTag: 'solid',
      consonantProfile: 'cut',
      consonantProfileOk: true,
      consonantSignals: [
        "Same Plosive + Nasal pattern supports 'harm / loss that remains as a condition'.",
      ],
      axes: {
        principles: 'pass',
        morphology: 'pass',
        consonants: 'pass',
      },
      morphologyMatrix: {
        pivot: 'dëm',
        meaning: 'cut / loss that remains as a condition',
        morphemes: [
          { form: 'dëm', role: 'root', gloss: 'harm, loss' },
          { form: 'tim', role: 'suffix', gloss: 'act / process of causing' },
        ],
        wordSums: [
          { parts: ['dëm'], result: 'dëm', gloss: 'harm, loss' },
          { parts: ['dëm', 'tim'], result: 'dëmtim', gloss: 'act of damaging / causing loss' },
        ],
      },
    },
  ],
};
