import type { ProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";

function stripFences(t: string): string {
  const s = String(t ?? "").trim();
  // remove ```json ... ``` and ``` ... ```
  return s
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

export function tryParseJsonV0_2(t: string): unknown | null {
  const s = stripFences(t);
  try {
    return JSON.parse(s);
  } catch {
    // try extracting first {...last}
    const i = s.indexOf("{");
    const j = s.lastIndexOf("}");
    if (i >= 0 && j > i) {
      const chunk = s.slice(i, j + 1);
      try {
        return JSON.parse(chunk);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export function sanitizeProposalV0_2(
  parsed: unknown,
  word: string,
  mode: "strict" | "open"
): ProposalV0_1 | null {
  if (!parsed || typeof parsed !== "object") return null;

  const candidatesRaw: any[] = Array.isArray((parsed as any).candidates) ? (parsed as any).candidates : [];
  const cleanCandidates = candidatesRaw
    .filter((c) => c && typeof c === "object" && typeof (c as any).form === "string" && String((c as any).form).trim())
    .map((c) => {
      const opsUsed = Array.isArray((c as any).opsUsed) ? (c as any).opsUsed : [];
      const decomposition =
        (c as any).decomposition && typeof (c as any).decomposition === "object" ? (c as any).decomposition : {};
      const vowelPath = (c as any).vowelPath;
      const language = (c as any).language;
      return { form: String((c as any).form), language, opsUsed, decomposition, vowelPath };
    });

  return {
    word,
    mode,
    candidates: cleanCandidates,
  } as any;
}
