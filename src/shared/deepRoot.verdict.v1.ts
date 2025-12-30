/**
 * DR5 — Verdict Highlight v1 (Closest Under Rules, No Scores)
 *
 * Deterministically selects which hypotheses to "highlight" without scoring.
 * Tie-breakers:
 *  1) pass/fail (overallPass)
 *  2) fewest opsCount
 *  3) fewest segments
 *  4) clean proto-root matches (more exact carrier matches)
 *  5) ring-fit ok (if present)
 *  6) stable last resort: language priority list, then id lexicographic
 */

export type VerdictLabelV1 = "closest_under_rules";

export type DeepRootVerdictV1 = {
  label: VerdictLabelV1;
  highlighted: string[]; // hypothesis ids
  reasons: string[];     // reason codes (human-auditable)
};

type AnyHypothesis = {
  id?: string;
  segments?: any[];
  carriers?: any[];
  checks?: any[];
  opsCount?: number;
};

const DEFAULT_LANG_PRIORITY = [
  "sq", // Albanian
  "grc",
  "el",
  "la",
  "sa",
  "sem",
  "sl",
  "de",
  "en",
];

function toStr(x: any): string {
  return String(x ?? "");
}

function boolish(x: any): boolean {
  return x === true;
}

function overallPass(h: AnyHypothesis): boolean {
  const checks = Array.isArray(h.checks) ? h.checks : [];
  if (checks.length === 0) return false; // conservative: no checks => not "passed"
  return checks.every((c) => boolish((c as any)?.ok));
}

function ringFitOk(h: AnyHypothesis): boolean {
  const checks = Array.isArray(h.checks) ? h.checks : [];
  // Accept multiple schema variants:
  // - { code: "RING_FIT_OK", ok: true }
  // - { id: "ring_fit", ok: true }
  // - { kind: "ring_fit", ok: true }
  return checks.some((c) => {
    const code = toStr((c as any)?.code).toLowerCase();
    const id = toStr((c as any)?.id).toLowerCase();
    const kind = toStr((c as any)?.kind).toLowerCase();
    const ok = boolish((c as any)?.ok);
    if (!ok) return false;
    return (
      code.includes("ring") ||
      code.includes("ring_fit") ||
      id.includes("ring") ||
      id.includes("ring_fit") ||
      kind.includes("ring") ||
      kind.includes("ring_fit")
    );
  });
}

function exactCarrierCount(h: AnyHypothesis): number {
  const carriers = Array.isArray(h.carriers) ? h.carriers : [];
  let n = 0;
  for (const c of carriers) {
    const ops = Array.isArray((c as any)?.ops) ? (c as any).ops.map(toStr) : [];
    if (ops.includes("exact")) n += 1;
  }
  return n;
}

function segmentCount(h: AnyHypothesis): number {
  return Array.isArray(h.segments) ? h.segments.length : 9999;
}

function opsCount(h: AnyHypothesis): number {
  const n = (h as any)?.opsCount;
  if (typeof n === "number" && Number.isFinite(n)) return n;
  // fallback: sum carrier op counts minus "exact"
  const carriers = Array.isArray(h.carriers) ? h.carriers : [];
  let sum = 0;
  for (const c of carriers) {
    const ops = Array.isArray((c as any)?.ops) ? (c as any).ops.map(toStr) : [];
    for (const op of ops) {
      if (op === "exact") continue;
      sum += 1;
    }
  }
  return sum;
}

function primaryLang(h: AnyHypothesis): string {
  const carriers = Array.isArray(h.carriers) ? h.carriers : [];
  const first = carriers[0];
  const lang = toStr((first as any)?.lang).toLowerCase();
  return lang || "xx";
}

function langRank(lang: string, priority: string[]): number {
  const i = priority.indexOf(lang);
  return i === -1 ? 9999 : i;
}

function stableId(h: AnyHypothesis, idx: number): string {
  const id = toStr(h.id);
  return id.length ? id : `h${idx}`;
}

export function selectHighlightedHypotheses(
  hypotheses: AnyHypothesis[],
  opts?: {
    maxHighlighted?: number;
    languagePriority?: string[];
  }
): DeepRootVerdictV1 {
  const list = Array.isArray(hypotheses) ? hypotheses.map((h) => h ?? {}) : [];
  const maxHighlighted = Math.max(1, Math.min(5, (opts?.maxHighlighted ?? 1)));
  const langPriority = Array.isArray(opts?.languagePriority) && opts!.languagePriority!.length > 0
    ? opts!.languagePriority!
    : DEFAULT_LANG_PRIORITY;

  const ranked = list
    .map((h, idx) => {
      const id = stableId(h, idx);
      const pass = overallPass(h);
      const oc = opsCount(h);
      const sc = segmentCount(h);
      const ex = exactCarrierCount(h);
      const rf = ringFitOk(h);
      const lang = primaryLang(h);

      return {
        h,
        id,
        idx,
        pass,
        oc,
        sc,
        ex,
        rf,
        lang,
      };
    })
    .sort((a, b) => {
      // 1) pass first
      if (a.pass !== b.pass) return a.pass ? -1 : 1;
      // 2) fewest ops
      if (a.oc !== b.oc) return a.oc - b.oc;
      // 3) fewest segments
      if (a.sc !== b.sc) return a.sc - b.sc;
      // 4) more exact matches
      if (a.ex !== b.ex) return b.ex - a.ex;
      // 5) ring-fit ok (true first)
      if (a.rf !== b.rf) return a.rf ? -1 : 1;
      // 6) language priority (last resort)
      const ar = langRank(a.lang, langPriority);
      const br = langRank(b.lang, langPriority);
      if (ar !== br) return ar - br;
      // 7) stable id tie-break
      if (a.id !== b.id) return a.id < b.id ? -1 : 1;
      return a.idx - b.idx;
    });

  const highlighted = ranked.slice(0, maxHighlighted).map((x) => x.id);

  const reasons: string[] = [];
  if (ranked.length === 0) {
    reasons.push("NO_HYPOTHESES");
  } else {
    const top = ranked[0];
    reasons.push(top.pass ? "PASS_FIRST" : "NO_PASS_AVAILABLE");
    reasons.push(`OPS_${top.oc}`);
    reasons.push(`SEGS_${top.sc}`);
    reasons.push(`EXACT_${top.ex}`);
    if (top.rf) reasons.push("RING_FIT_OK");
    reasons.push(`LANG_${top.lang || "xx"}`);
    reasons.push("DETERMINISTIC_TIEBREAK");
  }

  return {
    label: "closest_under_rules",
    highlighted,
    reasons,
  };
}
