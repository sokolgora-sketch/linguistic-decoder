export interface UICandidateRow {
  id: string;
  language: string;
  form: string;
  status?: string | null;
  vowelPath?: string | null;
  functionalStatement?: string | null;
  raw: any; // for Copy Candidate JSON
}

function str(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

export function buildCandidateRows(result: any): UICandidateRow[] {
  const arr = Array.isArray(result?.candidates) ? result.candidates : [];
  return arr.map((c: any, idx: number) => ({
    id: str(c?.id) ?? `cand_${idx}`,
    language: str(c?.language) ?? "Unknown",
    form: str(c?.form) ?? "—",
    status: str(c?.status),
    vowelPath: str(c?.vowelPath),
    functionalStatement: str(c?.functionalStatement) ?? str(c?.function),
    raw: c,
  }));
}
