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
      symbolic: [
          { axis: 'creation', source: 'hybrid', note: 'U-I path suggests a unified insight, a flow toward a specific point.' },
          { axis: 'law', source: 'zheji', note: 'The consonants "st" and "d" create a container for this inner process.' },
      ],
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
        meaning: 'what is not yours → you know it → you make it yours',
        morphemes: [
          { form: "s'tu", role: 'root',   gloss: 'what is not yours' },
          { form: 'di',  role: 'root',   gloss: 'know' },
          { form: 'm',   role: 'suffix', gloss: 'make / become yours' },
        ],
        wordSums: [
          {
            parts: ["s'tu", 'di', 'm'],
            result: "s'tu-di-m",
            gloss: 'turn what is not yours into your own knowledge',
          },
        ],
      },
      symbolic: [
          { axis: 'creation', source: 'zheji', note: 'Albanian functional path s\'tu-di-m implies making external knowledge internal.' },
      ],
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
        meaning: 'cut / act that leaves something in a harmed state',
        morphemes: [
          { form: 'dam', role: 'root', gloss: 'harm, loss, reduction' },
          { form: 'num', role: 'suffix', gloss: 'thing / unit / result' },
          { form: 'atio', role: 'suffix', gloss: 'act of / process' },
        ],
        wordSums: [
          { parts: ['dam', 'num'], result: 'damnum', gloss: 'a harmed thing / damaged state' },
          { parts: ['dam', 'n', 'atio'], result: 'damnatio', gloss: 'inflicted state of loss / condemnation' },
        ],
      },
      symbolic: [
          { axis: 'law', source: 'zheji', note: 'A-E path (action/expansion) suggests a breaking out or transgression.' },
          { axis: 'power', source: 'hybrid', note: 'The "d" and "m" consonants suggest a cutting action resulting in a material state.' },
      ],
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
        meaning: 'harm / loss that remains as a condition',
        morphemes: [
          { form: 'dëm', role: 'root',   gloss: 'harm, loss' },
          { form: 'tim', role: 'suffix', gloss: 'act of causing / process' },
        ],
        wordSums: [
          {
            parts: ['dëm', 'tim'],
            result: 'dëmtim',
            gloss: 'the act of causing harm / damaging',
          },
        ],
      },
      symbolic: [
          { axis: 'law', source: 'zheji', note: 'Albanian "dëm" as a cut (d-) that becomes a state (ë) in matter (m).' },
      ],
    },
  ],
  mode: [
    {
      id: 'lat_mode_01',
      language: 'latin',
      family: 'latin',
      form: 'modus',
      decomposition: {
        parts: [
          { role: 'action', form: 'mod-', gloss: 'to measure, set a limit' },
          { role: 'instrument', form: '-u-', gloss: 'a manner or way' },
          { role: 'unit', form: '-s', gloss: 'a specific instance' },
        ],
        functionalStatement: 'A specific instance of a measured way or manner.',
      },
      voices: {
        voiceSequence: ['O', 'U'],
        ringPath: [0, 1],
        dominantVoices: { O: 1, U: 1 },
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
        notes: ['Classical Latin source for words related to mode, model, and modification.'],
      },
      morphology: {
        base: 'mod',
        affixes: ['-us'],
        wordSums: ['mod + us → modus (measure, manner, mode)'],
        notes: ['Root mod- is productive in Latin with consistent meaning of measure and manner.'],
      },
      fitTag: 'strong',
      status: 'pass',
      confidenceTag: 'solid',
      consonantProfile: 'build',
      consonantProfileOk: true,
      consonantSignals: ["Consonant pattern (m-d) supports a 'measured/bounded state'"],
      axes: {
        principles: 'pass',
        morphology: 'pass',
        consonants: 'pass',
      },
      morphologyMatrix: {
        pivot: 'mode',
        meaning: 'measure, manner',
        morphemes: [
          { form: 'mod(e)', role: 'root', gloss: 'measure, manner' },
          { form: 'i', role: 'suffix', gloss: 'process / become' },
          { form: 'fy', role: 'suffix', gloss: 'make / cause' },
          { form: 'fic', role: 'root', gloss: 'making / doing' },
          { form: 'ate', role: 'suffix', gloss: 'act / result of doing' },
          { form: 'ion', role: 'suffix', gloss: 'state / result' },
          { form: 'ity', role: 'suffix', gloss: 'quality / state' },
          { form: 'al', role: 'suffix', gloss: 'relating to / of the nature of' },
          { form: 'bi', role: 'prefix', gloss: 'two / double' },
          { form: 'com', role: 'prefix', gloss: 'together / with' },
          { form: 'ac', role: 'prefix', gloss: 'toward / intensifier' },
          { form: 'une', role: 'prefix', gloss: 'single / one' },
        ],
        wordSums: [
          { parts: ['mode', 'i', 'fy'], result: 'modify', gloss: 'to make or cause a change in measure/form' },
          { parts: ['mode', 'i', 'fy', 'es'], result: 'modifies', gloss: 'acts that change or adjust something' },
          { parts: ['mode', 'i', 'fy', 'ing'], result: 'modifying', gloss: 'the process of changing or adjusting' },
          { parts: ['mode', 'i', 'fic', 'ate', 'ion', 's'], result: 'modifications', gloss: 'results of acts of changing the mode' },
          { parts: ['ac', 'com', 'mode', 'ate', 'ion'], result: 'accommodation', gloss: 'bringing into a fitting mode / making fit' },
          { parts: ['com', 'mode', 'ity'], result: 'commodity', gloss: 'a thing made to a shared mode / standard' },
          { parts: ['une', 'i', 'mode', 'al'], result: 'unimodal', gloss: 'having a single mode / pattern' },
          { parts: ['bi', 'mode', 'al'], result: 'bimodal', gloss: 'having two modes / patterns' },
          { parts: ['mode', 'al', 'ity'], result: 'modality', gloss: 'the way / manner in which something is done' },
          { parts: ['mode', 'al', 'ity', 'es'], result: 'modalities', gloss: 'different ways / manners / modes' },
        ],
      },
    },
  ],
  love: [
    {
        id: 'lat_love_01',
        language: 'latin',
        family: 'latin',
        form: 'amor',
        decomposition: {
            parts: [
                { role: 'action', form: 'am-', gloss: 'love, fondness' },
                { role: 'unit', form: 'or', gloss: 'agent/bearer of quality' },
            ],
            functionalStatement: 'One who carries or embodies love.',
        },
        voices: { voiceSequence: ['O', 'E'], ringPath: [0, 2], dominantVoices: {} },
        ruleChecks: { soundPathOk: true, functionalDecompOk: true, sevenVoicesAlignmentOk: true, consonantMeaningOk: true, harmonyOk: true },
        principleSignals: { truthOk: true, expansionOk: true, insightOk: true, balanceOk: true, unityOk: true, networkIntegrityOk: true, evolutionOk: true },
        fitTag: 'strong',
        status: 'pass',
        confidenceTag: 'solid',
        consonantProfile: 'flow',
        consonantProfileOk: true,
        consonantSignals: ['liquid / sonorant frame around open vowels'],
        axes: { principles: 'pass', morphology: 'pass', consonants: 'pass' },
        morphologyMatrix: {
            pivot: 'am',
            meaning: 'warm, directed affection / friendly love',
            morphemes: [
                { form: 'am', role: 'root', gloss: 'love, fondness, friendly affection' },
                { form: 'or', role: 'suffix', gloss: 'agent / bearer of quality' },
            ],
            wordSums: [{ parts: ['am', 'or'], result: 'amor', gloss: 'one who carries/embodies love' }],
        },
        symbolic: [
            { axis: 'love', source: 'hybrid', note: "Latin 'amor' makes love a carried quality — something you bear." },
        ]
    },
    {
        id: 'alb_love_01',
        language: 'albanian',
        family: 'albanian',
        form: 'dashuri',
        decomposition: {
            parts: [
                { role: 'action', form: 'dash-', gloss: 'to love, to like' },
                { role: 'instrument', form: '-ur-', gloss: 'state/quality' },
                { role: 'unit', form: '-i', gloss: 'noun marker' },
            ],
            functionalStatement: 'The state or quality of loving.',
        },
        voices: { voiceSequence: ['A', 'U', 'I'], ringPath: [3, 1, 1], dominantVoices: {} },
        ruleChecks: { soundPathOk: true, functionalDecompOk: true, sevenVoicesAlignmentOk: true, consonantMeaningOk: true, harmonyOk: true },
        principleSignals: { truthOk: true, expansionOk: true, insightOk: true, balanceOk: true, unityOk: true, networkIntegrityOk: true, evolutionOk: true },
        fitTag: 'strong',
        status: 'pass',
        confidenceTag: 'solid',
        consonantProfile: 'bind',
        consonantProfileOk: true,
        consonantSignals: ['soft fricatives and sonorants shaping attachment'],
        axes: { principles: 'pass', morphology: 'pass', consonants: 'pass' },
        morphologyMatrix: {
            pivot: 'dash',
            meaning: 'intentional affection / chosen closeness',
            morphemes: [
                { form: 'dash', role: 'root', gloss: 'to love, to like' },
                { form: 'ur', role: 'suffix', gloss: 'state / quality' },
                { form: 'i', role: 'suffix', gloss: 'noun marker' },
            ],
            wordSums: [{ parts: ['dash', 'ur', 'i'], result: 'dashuri', gloss: 'the state/quality of loving' }],
        },
        symbolic: [
             { axis: 'love', source: 'hybrid', note: "Albanian 'dashuri' frames love as a chosen state, not just a feeling." },
        ]
    }
  ]
};
