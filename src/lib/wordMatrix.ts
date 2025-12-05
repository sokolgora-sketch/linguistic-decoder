import type { AnalyzeWordResult } from "@/lib/schema";
import type { WordMatrixUI } from "@/shared/resultsUI";

export function buildWordMatrixUI(analysis: AnalyzeWordResult): WordMatrixUI | undefined {
  if (!analysis.primaryPath || !analysis.languageFamilies?.length) return undefined;

  return {
    word: analysis.word,
    primary: {
      label: "Primary path",
      voicePath: analysis.primaryPath.voicePath,
      notes: "Placeholder note",
    },
    canon: analysis.languageFamilies.map(fam => ({
      language: fam.language,
      form: fam.form,
      voicePath: fam.voicePath,
      notes: "—",
    })),
    deepRoot: {
      label: "Proto-root",
      notes: "Experimental proto-root suggestions (DeepRoot v1, UI-only).",
    },
  };
}
