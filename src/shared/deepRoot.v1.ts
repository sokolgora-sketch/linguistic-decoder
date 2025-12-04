// src/shared/deepRoot.v1.ts

export type DeepRootCandidateV1 = {
  language: string;
  form: string;
  decomposition: string;
  vowelPath: string;
  functionalStatement: string;
  notes?: string;
};

export type DeepRootSummaryV1 = {
  word: string;
  candidates: DeepRootCandidateV1[];
  notes?: string;
};

/**
 * V1: very small, hard-coded DeepRoot suggestions for our canon test words.
 * Safe: uses `any` and optional chaining so it never crashes if the shape changes.
 *
 * Later we can replace this with real engine-driven DeepRoot logic.
 */
export function buildDeepRootSummaryV1(result: any): DeepRootSummaryV1 {
  const rawWord = (result?.word ?? result?.meta?.word ?? "").toString();
  const word = rawWord.toLowerCase().trim();
  const candidates: DeepRootCandidateV1[] = [];

  if (!word) {
    return {
      word: "",
      candidates: [],
      notes: "No word provided for DeepRoot.",
    };
  }

  // --- STUDY ---
  if (word === "study") {
    candidates.push(
      {
        language: "Albanian",
        form: "studim",
        decomposition: "s'tu-di-m",
        vowelPath: "U → I",
        functionalStatement:
          "What is not yours (s'tu) → you know it (di) → you make it yours (m).",
        notes: "Seven-Voices reading: U (breath) moving into I (focus/point).",
      },
      {
        language: "Latin",
        form: "studium",
        decomposition: "stud-ium",
        vowelPath: "U → I",
        functionalStatement:
          "Persistent, focused pursuit; energy (U) pushed into a single point (I).",
      }
    );
  }

  // --- DAMAGE ---
  if (word === "damage") {
    candidates.push(
      {
        language: "Albanian",
        form: "dëm",
        decomposition: "dëm",
        vowelPath: "Ë",
        functionalStatement:
          "A broken or diminished unit; something that should be whole is now less.",
        notes: "Proto-root sense of loss / reduction in the unit (Ë as unit/mother).",
      },
      {
        language: "Latin",
        form: "damnum",
        decomposition: "dam-num",
        vowelPath: "A → U",
        functionalStatement:
          "An act (A) that results in a reduced share or portion (U).",
      }
    );
  }

  // --- LOVE ---
  if (word === "love") {
    candidates.push(
      {
        language: "Albanian",
        form: "dashuri",
        decomposition: "dash-ur-i",
        vowelPath: "A → U → I",
        functionalStatement:
          "Impulse/desire (A) flows into a shared bond (U) and finally a defined point/person (I).",
        notes: "Matches your reading of love as a path from raw force to focused union.",
      },
      {
        language: "Latin",
        form: "amor",
        decomposition: "am-or",
        vowelPath: "A → O",
        functionalStatement:
          "Act/drive (A) seeking balance and union in the other (O as mediator).",
      }
    );
  }

  return {
    word,
    candidates,
    notes:
      candidates.length > 0
        ? "Experimental proto-root suggestions (DeepRoot v1, UI-only)."
        : "DeepRoot not defined yet for this word.",
  };
}
