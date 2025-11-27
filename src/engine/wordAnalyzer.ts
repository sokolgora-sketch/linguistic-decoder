// keep this near the other buildDamage*Analysis helpers
import type { CandidateForm, CandidateAnalysis } from "@/core/engineShape";
import type { VowelId } from "@/core/sevenVoices";
import { VOWEL_TRAITS } from "@/core/sevenVoices";

function buildDamageFrAnalysis(c: CandidateForm): CandidateAnalysis {
  const vowelPath: VowelId[] = ["A", "O", "E"];

  const dominantVowel: VowelId = "O";
  const oTraits = VOWEL_TRAITS["O"];

  const traitsSummary =
    `O as mediator rounds the sharp A-cut into a canopy, linking DA-harm to AO-protection. ` +
    `O (${oTraits.polarity}, ${oTraits.role}): ${oTraits.personality}`;

  return {
    language: c.language,
    form: c.form,
    decomposition: ["DA", "M"],
    functionalStatement:
      "Like English 'damage', French 'dommage' carries the same DA-cut root but softens it " +
      "with an O-mediated, more buffered sense of harm—often moral or situational rather than purely physical.",
    vowelPath,
    notes: [
      "French keeps the DA root and adds an O-opening and E-settling, matching a more diffuse, situational harm.",
      "O in the middle matches mediation / cushioning of the blow; the final vowel lets the condition settle.",
    ],
    dominantVowel,
    traitsSummary,
  };
}
