// UI Telemetry Events (v0.1)
// Pure UI-layer events. No coupling to engine payload or telemetry VM.

export type UiTelemetryEventV0_1 = {
  at: number; // Date.now()
  type:
    | "analyze_click"
    | "analyze_request_start"
    | "analyze_request_done";
  word?: string;
  mode?: "strict" | "open";
  ok?: boolean;
  ms?: number;
};
