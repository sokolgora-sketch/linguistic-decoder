// BRAIN-0 — CandidateRecord Normalization Law v0.1
// Deterministic canonicalization + validation.
// Never guesses. Never invents values. Only trims/squeezes whitespace.
// If it doesn't normalize into this schema, it does not exist to the Heart.

import type {
  CandidateRecord,
  CandidateRecordNormalizeResult,
} from "./candidateRecord.v0.1";
import { CANDIDATE_RECORD_VERSION } from "./candidateRecord.v0.1";
import { CR_ERR } from "./candidateRecord.errors.v0.1";
import type { AllowedOpId } from "../ops/allowedOps.v0.1";
import { normalizeToAllowedOpId } from "../ops/allowedOps.v0.1";

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

/** deterministic whitespace squeeze + trim */
function cleanText(x: unknown): string {
  const s = String(x ?? "");
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Canonical tag: trim -> uppercase, then validate.
 * Used for stable root IDs like "DI", "SHTU", "MAT".
 */
function canonicalTag(x: unknown): string {
  return cleanText(x).toUpperCase();
}

/**
 * Canonical op token -> AllowedOpId
 * - Accepts legacy spellings via normalizeToAllowedOpId()
 * - Returns null if unmapped (=> reject)
 */
function canonicalOpId(x: unknown): AllowedOpId | null {
  return normalizeToAllowedOpId(x);
}

/** stable unique (keeps first occurrence order) */
function uniqStable<T>(arr: readonly T[]): T[] {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const v of arr) {
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

/**
 * Normalize + validate.
 * - Required fields: v, languageId, languageName, form, gloss, roots[], source{kind/ref/version}
 * - Ops: optional but validated if present
 * - Explains: optional, validated if present
 */
export function normalizeCandidateRecord(input: unknown): CandidateRecordNormalizeResult {
  const errors: string[] = [];

  if (!isPlainObject(input)) {
    return { ok: false, errors: [CR_ERR.NOT_OBJECT] };
  }

  // version
  if (input.v !== CANDIDATE_RECORD_VERSION) errors.push(CR_ERR.BAD_VERSION);

  // required text fields
  const languageId = cleanText(input.languageId);
  const languageName = cleanText(input.languageName);
  const form = cleanText(input.form);
  const gloss = cleanText(input.gloss);

  if (!languageId) errors.push(CR_ERR.EMPTY_LANGUAGE_ID);
  if (!languageName) errors.push(CR_ERR.EMPTY_LANGUAGE_NAME);
  if (!form) errors.push(CR_ERR.EMPTY_FORM);
  if (!gloss) errors.push(CR_ERR.EMPTY_GLOSS);

  // roots (required)
  const rootsRaw = Array.isArray(input.roots) ? (input.roots as unknown[]) : [];
  const roots = uniqStable(rootsRaw.map(canonicalTag)).filter(Boolean);

  if (roots.length === 0) errors.push(CR_ERR.ROOTS_EMPTY);
  for (const r of roots) {
    // strict token law for stable keys
    if (!/^[A-Z0-9_-]{1,24}$/.test(r)) {
      errors.push(`${CR_ERR.ROOT_BAD_TOKEN}:${r}`);
    }
  }    // opsUsed (optional array; enforced AllowedOpId vocabulary if present)
  const opsRaw = Array.isArray((input as any).opsUsed) ? ((input as any).opsUsed as unknown[]) : [];
  const opsTmp: AllowedOpId[] = [];
  for (const raw of opsRaw) {
    const mapped = canonicalOpId(raw);
    if (!mapped) {
      const bad = cleanText(raw);
      errors.push(`${CR_ERR.OPS_BAD_TOKEN}:${bad.slice(0, 64)}`);
      continue;
    }
    opsTmp.push(mapped);
  }
  const opsUsed = uniqStable(opsTmp);




  // explains (optional)
  let explains: CandidateRecord["explains"] | undefined = undefined;
  const explainsIn = (input as any).explains;
  if (Array.isArray(explainsIn)) {
    const ex: { segment: string; note?: string }[] = [];
    for (const it of explainsIn as any[]) {
      const seg = cleanText(it?.segment);
      const note = it?.note == null ? undefined : cleanText(it?.note);
      if (!seg || seg.length > 32 || /[\r\n]/.test(seg)) {
        errors.push(`${CR_ERR.EXPLAINS_BAD_SEGMENT}:${seg}`);
        continue;
      }
      ex.push(note ? { segment: seg, note } : { segment: seg });
    }
    explains = ex.length ? ex : undefined;
  }

  // source (required)
  const sourceObj = (input as any).source;
  const kind = cleanText(sourceObj?.kind);
  const ref = cleanText(sourceObj?.ref);
  const version = cleanText(sourceObj?.version);

  if (kind !== "SEED" && kind !== "DATASET") errors.push(CR_ERR.SOURCE_BAD_KIND);
  if (!ref) errors.push(CR_ERR.SOURCE_EMPTY_REF);
  if (!version) errors.push(CR_ERR.SOURCE_EMPTY_VERSION);

  // functionTag (optional, constrained)
  const functionTagRaw = cleanText((input as any).functionTag);
  const functionTag =
    functionTagRaw === "ACTION" ||
    functionTagRaw === "FUNCTION" ||
    functionTagRaw === "UNIT" ||
    functionTagRaw === "UNKNOWN"
      ? (functionTagRaw as CandidateRecord["functionTag"])
      : undefined;

  if (errors.length) return { ok: false, errors: uniqStable(errors) };

  const record: CandidateRecord = {
    v: CANDIDATE_RECORD_VERSION,
    languageId,
    languageName,
    form,
    gloss,
    roots,
    explains,
    opsUsed,
    functionTag,
    source: { kind: kind as any, ref, version },
  };

  return { ok: true, record };
}
