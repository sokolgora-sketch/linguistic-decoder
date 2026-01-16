// src/shared/deepRoot.rootMap.v1.ts
//
// DeepRoot RootMap v0.1 — Functional Key Decoder
// Contract types only (no runtime logic).

export type RootTokenRoleV1 = "action" | "instrument" | "unit" | "modifier" | "unknown";

export type RootTokenV1 = {
  token: string; // e.g. "DA"
  role?: RootTokenRoleV1;
  vowel_path?: string; // optional (if token contains vowels)
};

export type RootKeyStatusV1 = "supported" | "speculative";

export type RootKeyV1 = {
  token: string; // must match a token in tokens[]
  language: string; // "Albanian" | "Latin" | ...
  gloss: string; // "split / divide"
  evidence: string[]; // short bullets, no essays
  status: RootKeyStatusV1;
  ops?: string[]; // transforms used to align form
};

export type RootCarrierV1 = {
  token: string;
  language: string;
  carrierForm: string; // e.g. "dam-" / "pater"
  note?: string; // "form carrier; no internal breakdown"
};

export type RootMapV1 = {
  tokens: RootTokenV1[];
  keys: RootKeyV1[];
  carriers?: RootCarrierV1[];
  composedMeaning: string; // short compositional statement
  notes?: string[]; // guardrails / why something is missing
};
