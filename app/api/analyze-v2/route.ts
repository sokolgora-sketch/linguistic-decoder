/**
 * Neutral Analyze response contract V2.
 * The V1 path is retained as a deprecated URL alias and emits this same
 * response shape; new first-party callers use this route explicitly.
 */
export { GET, POST } from "../analyze-v1/route";

export const dynamic = "force-dynamic";
