import type { EnginePayload } from "../shared/engineShape";

export interface EngineMetaSummary {
  engineLabel: string;
  build: string;
  modeLabel: string;
  alphabetLabel: string;
  rawVersion: string;
  engineName: string; // Alias for backward compatibility
  versionLine: string; // Alias for backward compatibility
  notes: string; // Alias for backward compatibility
}

export function buildEngineMetaSummary(raw?: any): EngineMetaSummary {
  const meta = raw?.meta ?? {};
  const options = raw?.options ?? {};

  const engineLabel = "SevenVoices Core";
  const modeLabel = meta.mode ?? options.mode ?? "unknown";
  const alphabetLabel = options.alphabet ?? meta.alphabet ?? "unknown";
  const rawVersion = meta.engineVersion ?? "unknown";
  const parts = rawVersion.split('-');
  const build = parts.length > 2 ? parts.slice(-2).join('-') : rawVersion;

  const engineName = engineLabel;
  const versionLine = rawVersion;
  const notes = `Raw version: ${rawVersion}`;

  return {
    engineLabel,
    modeLabel,
    alphabetLabel,
    rawVersion,
    build,
    engineName,
    versionLine,
    notes,
  };
}
