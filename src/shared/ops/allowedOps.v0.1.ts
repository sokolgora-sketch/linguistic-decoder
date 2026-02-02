// src/shared/ops/allowedOps.v0.1.ts
// Canonical allowed op IDs (v0.1).
// Single source of truth for transform op vocabulary across shared/engine/docs.

export type AllowedOpId =
  | "exact"
  | "vowel_swap"
  | "y_to_i"
  | "final_swap"
  | "s_to_sh"
  | "sh_to_s"
  | "g_to_gj"
  | "gj_to_g"
  | "final_a_to_e"
  | "final_e_to_a"
  | "optional_h_removed"
  | "optional_h_added"
  | "optional_j_removed"
  | "optional_j_added"
  | "compound";

export const ALLOWED_OP_IDS_V0_1: readonly AllowedOpId[] = Object.freeze([
  "exact",
  "vowel_swap",
  "y_to_i",
  "final_swap",
  "s_to_sh",
  "sh_to_s",
  "g_to_gj",
  "gj_to_g",
  "final_a_to_e",
  "final_e_to_a",
  "optional_h_removed",
  "optional_h_added",
  "optional_j_removed",
  "optional_j_added",
  "compound",
]);

const SET = new Set<string>(ALLOWED_OP_IDS_V0_1 as unknown as string[]);

/**
 * Map messy external tokens into canonical AllowedOpId.
 * Returns null if unknown (caller decides whether to reject or ignore).
 *
 * NOTE: permissive + deterministic. No inference beyond explicit mappings.
 */
export function normalizeToAllowedOpId(token: unknown): AllowedOpId | null {
  const raw = String(token ?? "").trim();
  if (!raw) return null;

  // 1) already canonical
  if (SET.has(raw)) return raw as AllowedOpId;

  // 2) normalize simple spacing
  const t = raw.replace(/\s+/g, " ");

  // 3) human tokens → canonical
  if (t === "Y↔I" || t === "Y<->I" || t.toUpperCase() === "Y/I") return "y_to_i";
  if (t === "S↔SH" || t === "S<->SH") return "s_to_sh";

  // 4) engine legacy tokens
  if (t === "identity") return "exact";
  if (t === "compound") return "compound";

  // 5) kebab-case engine tokens → canonical (best-effort)
  if (t === "s-to-sh") return "s_to_sh";
  if (t === "sh-to-s") return "sh_to_s";
  if (t === "g-to-gj") return "g_to_gj";
  if (t === "gj-to-g") return "gj_to_g";
  if (t === "final-a-to-e") return "final_a_to_e";
  if (t === "final-e-to-a") return "final_e_to_a";

  // 6) kebab-case with ë (treat as terminal marker swap)
  if (t === "final-a-to-ë" || t === "final-ë-to-a") return "final_swap";

  // 7) optional h/j around gu/gi (expressed as inserts in older engine notes)
  if (t === "insert-h-around-gu") return "optional_h_added";
  if (t === "insert-j-around-gi") return "optional_j_added";

  return null;
}
