// src/lib/engineMetaSummary.ts

/**
 * The structured summary of engine metadata, returned by the helper.
 */
export interface EngineMetaSummaryUI {
  engineName: string;
  versionLine: string;
  modeLabel: string;
  alphabetLabel: string;
  notes?: string;
}

/**
 * Builds a structured, UI-friendly summary of the engine metadata.
 * It's defensive and handles missing or partial data.
 */
export function buildEngineMetaSummary(
  raw: any // Keep this loose to handle different analysis shapes
): EngineMetaSummaryUI {
  const engineVersion = raw?.engineVersion ?? raw?.meta?.engineVersion ?? 'unknown';
  const mode = raw?.mode ?? raw?.meta?.mode ?? 'unknown';
  const alphabet = raw?.alphabet ?? raw?.meta?.alphabet ?? 'unknown';

  const parts = engineVersion.split('-');
  const versionLine = parts.length > 2 ? parts.slice(-2).join('-') : engineVersion;

  return {
    engineName: "SevenVoices Core",
    versionLine,
    modeLabel: mode,
    alphabetLabel: alphabet,
    notes: `Raw version: ${engineVersion}`,
  };
}
