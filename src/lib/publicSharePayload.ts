import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import type { PublicShareRecord } from "./publicShare.types";

/**
 * Pure builder: turns a full AnalyzeWordResultUI into a minimal public record.
 * No IO, no Firebase – just shaping data for public sharing.
 *
 * Contract:
 * - Always emits required fields.
 * - Omits optional fields when absent (no undefined keys in the record).
 */
export function buildPublicSharePayload(
  result: AnalyzeWordResultUI,
  id: string,
  now: Date = new Date(),
): PublicShareRecord {
  const r = result as any;

  const record: PublicShareRecord = {
    id,
    word: r.word,
    createdAt: now.toISOString(),
    engineLabel: r.engineMeta?.engineLabel ?? "SevenVoices Core",
    heartSummary: r.heartSummary?.primary ?? "",
    version: "v1",
  };

  const zheji = r.zhejiSummary?.statement;
  if (typeof zheji === "string" && zheji.length > 0) {
    record.zhejiSummary = zheji;
  }

  const symbolic = r.symbolicSummary?.summary;
  if (typeof symbolic === "string" && symbolic.length > 0) {
    record.symbolicSummary = symbolic;
  }

  return record;
}
