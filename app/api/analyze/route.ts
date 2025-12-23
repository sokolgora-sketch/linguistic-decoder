/**
 * Legacy endpoint shim.
 * Keep /api/analyze alive, but delegate to /api/analyze-v1 to prevent drift.
 *
 * This ensures we have exactly one real engine path.
 */
export { GET, POST } from "../analyze-v1/route";

// keep dynamic behavior consistent with v1 (safe default)
export const dynamic = "force-dynamic";
