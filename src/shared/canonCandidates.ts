
// src/shared/canonCandidates.ts

import type { Candidate, EnginePayload } from './engineShape';

// The canonical candidates are now functions that receive the payload.
// This allows them to react to the computed primary path and consonant field.
function getStudyCandidates(payload: EnginePayload): Candidate[] {
  const primary = payload.primaryPath;

  const baseVoiceSequence = primary.voicePath;
  const dominant = baseVoiceSequence.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {});

  const latinCandidate: Candidate = {
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
      functionalStatement: 'Deliberate effort of knowing that leads to a formed inner state.',
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
    consonantProfiles: ['carry', 'build'],
    consonantProfileOk: true,
    consonantSignals: ["Plosive window 'st' is smooth, aligning with 'building' a line of thought."],
  };

  const albanianCandidate: Candidate = {
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
      functionalStatement: 'Turning what is not yours into something you know and make your own.',
    },
    voices: {
      voiceSequence: ['U', 'I'],
      ringPath: [1, 1],
      dominantVoices: { U: 1, I: 1 },
    },
    ruleChecks: {
      soundPathOk: true, functionalDecompOk: true, sevenVoicesAlignmentOk: true,
      consonantMeaningOk: true, harmonyOk: true,
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
    consonantProfiles: ['carry'],
    consonantProfileOk: true,
    consonantSignals: ["Consonant structure supports the 'carrying' of knowledge."],
  };

  return [latinCandidate, albanianCandidate];
}

function getDamageCandidates(payload: EnginePayload): Candidate[] {
  const primary = payload.primaryPath;
  const dominant = primary.voicePath.reduce<Record<string, number>>((acc, v) => {
    acc[v] = (acc[v] ?? 0) + 1;
    return acc;
  }, {});

  const latinCandidate: Candidate = {
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
      functionalStatement: 'An act that breaks or reduces something, leaving it in a harmed state.',
    },
    voices: {
      voiceSequence: primary.voicePath,
      ringPath: primary.ringPath,
      dominantVoices: dominant,
    },
    ruleChecks: {
      soundPathOk: true, functionalDecompOk: true, sevenVoicesAlignmentOk: true,
      consonantMeaningOk: true, harmonyOk: true,
    },
    principleSignals: {
      truthOk: true, expansionOk: true, insightOk: true, balanceOk: true,
      unityOk: true, networkIntegrityOk: true, evolutionOk: true,
      notes: ['Matches standard historical Latin origin.', 'Functional story fits: an act that reduces or harms, leaving a damaged state.'],
    },
    morphology: {
      base: 'dam',
      affixes: ['-num'],
      wordSums: ['dam + num → damnum (damage, loss)', 'damn + atio → damnatio (condemnation, infliction of loss)'],
      notes: ['Root dam-/damn- forms a family of Latin words about loss and condemnation.'],
    },
    fitTag: 'strong',
    status: 'pass',
    confidenceTag: 'solid',
    consonantProfiles: ['cut', 'carry'],
    consonantProfileOk: true,
    consonantSignals: [
      "Plosive 'd' aligns with 'cut' profile.",
      "Nasal 'm' aligns with 'carry' profile, matching the idea of a lasting state of harm.",
    ],
  };

  const albanianCandidate: Candidate = {
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
      functionalStatement: 'A cut or removal that leaves a thing carrying loss or harm as its new condition.',
    },
    voices: {
      voiceSequence: primary.voicePath,
      ringPath: primary.ringPath,
      dominantVoices: dominant,
    },
    ruleChecks: {
      soundPathOk: true, functionalDecompOk: true, sevenVoicesAlignmentOk: true,
      consonantMeaningOk: true, harmonyOk: true,
    },
    principleSignals: {
      truthOk: true, expansionOk: true, insightOk: true, balanceOk: true,
      unityOk: true, networkIntegrityOk: true, evolutionOk: true,
      notes: ['Functional decomposition matches the idea of damage as a cut/loss that remains.', 'Presented as a functional origin, not as the exclusive historical source.'],
    },
    morphology: {
      base: 'dëm',
      affixes: ['-tim', '-tar', '-shpërblim'],
      wordSums: ['dëm → dëm (harm, loss)', 'dëm + tim → dëmtim (damaging, act of causing harm)', 'dëm + shpërblim → dëmshpërblim (compensation for damage)'],
      notes: ['Productive root in Albanian forming a clear family of “harm / damage / compensation” words.'],
    },
    fitTag: 'strong',
    status: 'pass',
    confidenceTag: 'solid',
    consonantProfiles: ['cut', 'carry'],
    consonantProfileOk: true,
    consonantSignals: [
      "Plosive 'd' supports the 'cut' profile.",
      "Nasal 'm' supports the 'carry' profile, reinforcing the idea of a resulting state.",
    ],
  };

  return [latinCandidate, albanianCandidate];
}


export const CANON_CANDIDATES: Record<string, (payload: EnginePayload) => Candidate[]> = {
  study: getStudyCandidates,
  damage: getDamageCandidates,
};
