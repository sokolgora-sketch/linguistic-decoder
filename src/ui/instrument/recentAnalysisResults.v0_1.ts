import type { TelemetryViewModel } from "@/ui/telemetry/types";

export const MAX_RECENT_ANALYSIS_PICKER_RESULTS_V0_1 = 12;

export type RecentAnalysisMessageV0_1 = Readonly<{
  id: string;
  role: "user" | "assistant";
  instrumentPayload?: unknown | null;
}>;

export type RecentAnalysisResultV0_1 = Readonly<{
  id: string;
  vm: TelemetryViewModel;
  payload: unknown;
}>;

export type RecentAnalysisAdapterV0_1 = (raw: unknown) => TelemetryViewModel;

/**
 * Projects successful analyses already held by the active chat session into
 * the existing telemetry VM. This is a bounded presentation list only:
 * there is no persistence, ranking, similarity calculation, or retention
 * policy beyond the small UI window.
 */
export function projectRecentAnalysisResultsV0_1(
  messages: readonly RecentAnalysisMessageV0_1[],
  adapt: RecentAnalysisAdapterV0_1,
): RecentAnalysisResultV0_1[] {
  return messages
    .filter(
      (message) =>
        message.role === "assistant" &&
        message.instrumentPayload !== undefined &&
        message.instrumentPayload !== null,
    )
    .slice(-MAX_RECENT_ANALYSIS_PICKER_RESULTS_V0_1)
    .reverse()
    .map((message) => ({
      id: message.id,
      vm: adapt(message.instrumentPayload),
      payload: message.instrumentPayload,
    }));
}
