// src/v1/rootMap.v1.schema.ts
//
// DeepRoot RootMap v0.1 — Functional Key Decoder
// Zod schema only (contract validation).

import { z } from "zod";

export const RootTokenRoleV1Schema = z.enum([
  "action",
  "instrument",
  "unit",
  "modifier",
  "unknown",
]);

export const RootTokenV1Schema = z.object({
  token: z.string(),
  role: RootTokenRoleV1Schema.optional(),
  vowel_path: z.string().optional(),
});

export const RootKeyStatusV1Schema = z.enum(["supported", "speculative"]);

export const RootKeyV1Schema = z.object({
  token: z.string(),
  language: z.string(),
  gloss: z.string(),
  evidence: z.array(z.string()),
  status: RootKeyStatusV1Schema,
  ops: z.array(z.string()).optional(),
});

export const RootCarrierV1Schema = z.object({
  token: z.string(),
  language: z.string(),
  carrierForm: z.string(),
  note: z.string().optional(),
});

export const RootMapV1Schema = z.object({
  tokens: z.array(RootTokenV1Schema),
  keys: z.array(RootKeyV1Schema),
  carriers: z.array(RootCarrierV1Schema).optional(),
  composedMeaning: z.string(),
  notes: z.array(z.string()).optional(),
});
