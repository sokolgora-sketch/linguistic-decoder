import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import type { PublicShareRecord } from "./publicShare.types";

/**
 * Pure builder: turns a full AnalyzeWordResultUI into a minimal public record.
 * No IO, no Firebase – just shaping data for public sharing.
 */
export function buildPublicSharePayload(
  result: AnalyzeWordResultUI,
  id: string,
  now: Date = new Date(),
): PublicShareRecord {
  const r = result as any;
  return {
    id,
    word: r.word,
    createdAt: now.toISOString(),
    engineLabel: r.engineMeta?.engineLabel ?? "SevenVoices Core",
    heartSummary: r.heartSummary?.primary ?? "",
    zhejiSummary: r.zhejiSummary?.statement,
    symbolicSummary: r.symbolicSummary?.summary,
    version: "v1",
  };
}
