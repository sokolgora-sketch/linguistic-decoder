// src/shared/devFlags.ts
/**
 * Dev-only flags that can be derived from a request URL.
 * Keep this file tiny + boring: it is not product logic.
 */
export function devFlagOriginClaimGatesFromUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url, "http://localhost");
    return u.searchParams.get("ocg") === "1";
  } catch {
    return false;
  }
}
