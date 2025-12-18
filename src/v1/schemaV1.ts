import { z } from "zod";

/**
 * v1 Contract Guard
 * - Does NOT change engine behavior.
 * - Validates that the engine + API always return a stable shape.
 * - .passthrough() keeps forward-compat (extra fields won't break).
 */

export const AnalysisCandidateV1Schema = z
  .object({
    language: z.string(),
    form: z.string(),
    decomposition: z.array(z.string()),
    vowelPath: z.string(),
    functionalStatement: z.string().optional(),
  })
  .passthrough();

export const AnalysisResultV1Schema = z
  .object({
    word: z.string(),
    normalizedWord: z.string(),
    candidates: z.array(AnalysisCandidateV1Schema),
    engineVersion: z.string(),
  })
  .passthrough();

export type AnalysisResultV1 = z.infer<typeof AnalysisResultV1Schema>;
