/**
 * Legacy endpoint shim.
 * Keep /api/analyze alive as an alias for the current neutral Analyze V2 API.
 *
 * This ensures we have exactly one real engine path.
 */
export { GET, POST } from "../analyze-v2/route";

// keep dynamic behavior consistent with v1 (safe default)
export const dynamic = "force-dynamic";
