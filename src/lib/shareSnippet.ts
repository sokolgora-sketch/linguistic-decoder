import { buildHeartSummaryText } from "./heartSummaryText";
import { buildEngineMetaSummary } from "./engineMetaSummary";

export type ShareSource = {
  word: string;
  // you can tighten this later – for now "any" keeps TS happy and matches the tests
  analysis: any;
};

// ...

export function buildShareSnippet(source: ShareSource): string {
  const { word, analysis } = source;

  const primaryPath = analysis?.heart?.primaryPath;
  const heartLine = primaryPath
    ? buildHeartSummaryText({ word, primaryPath })
    : null;

  const meta = buildEngineMetaSummary(analysis);
  let engineLine: string | null = null;
  if (meta && typeof meta === 'object') {
    engineLine = `${meta.versionLine || ''} · ${meta.modeLabel || ''} · ${meta.alphabetLabel || ''}`;
  } else if (meta) {
    engineLine = String(meta);
  }

  const header = `Linguistic Decoder — ${word}`;

  return [
    header,
    heartLine ? `Summary: ${heartLine}` : null,
    engineLine ? `Engine: ${engineLine}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
