import type { EnginePayload } from "../shared/engineShape";

export interface EngineMetaSummary {
  engineLabel: string;
  build: string;
  modeLabel: string;
  alphabetLabel: string;
  rawVersion?: string;
}

export function buildEngineMetaSummary(raw?: any): EngineMetaSummary {
  const meta = raw?.meta ?? {};
  const options = raw?.options ?? {};

  const engineLabel = "SevenVoices Core";
  const modeLabel = meta.mode ?? options.mode ?? "unknown";
  const alphabetLabel = options.alphabet ?? meta.alphabet ?? "unknown";
  
  const engineVersion = meta.engineVersion;
  const rawVersion = engineVersion && engineVersion !== "unknown" ? engineVersion : undefined;
  
  const build = rawVersion ?? "unknown";

  return {
    engineLabel,
    build,
    modeLabel,
    alphabetLabel,
    rawVersion,
  };
}
