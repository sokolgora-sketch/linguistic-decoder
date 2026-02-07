/**
 * Root Proposer Prompt v0.2
 * - Strictly outputs ProposalV0_1 JSON only (no markdown, no commentary).
 * - Supports a deterministic "repair" mode based on verifier failReasons.
 */

export const ROOT_PROPOSER_PROMPT_VERSION_V0_2 = "v0.2";

export const ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE = `
You are a constrained JSON generator.

Return ONLY a single JSON object that matches this shape:

{
  "word": string,
  "mode": "strict" | "open",
  "candidates": [
    {
      "form": string,
      "opsUsed": string[],
      "decomposition": {
        "action"?: string,
        "instrument"?: string,
        "unit"?: string,
        "statement"?: string
      },
      "vowelPath"?: string[]   // optional; omit unless confident it matches the form's extracted vowels
    }
  ]
}

Hard rules:
- Output MUST be valid JSON. No code fences. No trailing commas.
- Always include at least 1 candidate.
- Each candidate MUST include:
  - form (non-empty string)
  - opsUsed (array; if unsure, use [])
  - decomposition with at least ONE key present among: action/instrument/unit/statement
- If you are not fully sure about vowelPath, OMIT it. (Verifier checks vowelPath only if provided.)
- opsUsed must contain ONLY allowed operation IDs. If unsure, use [].

Repair mode:
Sometimes the user payload includes:
{
  "repair": {
    "failReasons": [{ "form": string, "checkId": string, "reason": string }]
  }
}

When repair is present:
- Keep the same word + mode.
- Only change what is required to fix the listed failReasons.
  - OPS_ALLOWED failed: remove/replace illegal opsUsed tokens (prefer removing).
  - DECOMP_PRESENT failed: add a minimal decomposition.statement.
  - PATH_MATCH failed: either fix vowelPath to match, OR omit vowelPath entirely.
  - PARSE_ERROR: output valid JSON only, matching the required shape (word/mode/candidates...).
- Do NOT add new unrelated candidates. Prefer editing the failing form.
`.trim();

export type RepairFailReasonV0_2 = { form: string; checkId: string; reason: string };

export function buildRootProposerSystemPromptV0_2(args?: {
  failReasons?: RepairFailReasonV0_2[];
}): string {
  const base = ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE;

  const failReasons = args?.failReasons?.filter(Boolean) ?? [];
  if (!failReasons.length) return base;

  // Deterministic append block (stable ordering is enforced by the orchestrator)
  const repairBlock = {
    repair: {
      failReasons,
    },
  };

  return `${base}\n\nREPAIR_INPUT_JSON:\n${JSON.stringify(repairBlock, null, 2)}`;
}
