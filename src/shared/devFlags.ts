// src/shared/devFlags.ts
export function devFlagOriginClaimGatesFromUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url, "http://localhost");
    return u.searchParams.get("ocg") === "1";
  } catch {
    return false;
  }
}
