// UI defensive rendering helpers.
// Purpose: prevent React runtime crashes caused by rendering raw objects/arrays in text slots.

export function safeText(x: unknown): string {
  if (x == null) return "—";
  if (typeof x === "string") return x.length ? x : "—";
  if (typeof x === "number" || typeof x === "boolean") return String(x);

  // Arrays/objects: stringify (best effort) so UI never throws.
  try {
    const s = JSON.stringify(x);
    // JSON.stringify can return undefined for functions/symbols; fallback to String.
    return typeof s === "string" && s.length ? s : String(x);
  } catch {
    return String(x);
  }
}
