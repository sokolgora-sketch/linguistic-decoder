import { buildHeartSummaryText } from "./heartSummaryText";
import { buildEngineMetaSummary } from "./engineMetaSummary";
import {
  buildSymbolicSummary,
  buildLanguageFamiliesView,
  AnalyzeWordResultUI,
} from "../shared/resultsUI";

export type ShareSource = {
  word: string;
  analysis: AnalyzeWordResultUI;
};

export function buildShareSnippet(source: ShareSource): string {
  const { word, analysis } = source;

  const primaryPath = analysis?.primaryPath;
  const heartLine = primaryPath
    ? buildHeartSummaryText({ word, primaryPath })
    : null;

  const meta = buildEngineMetaSummary(analysis);
  let engineLine: string | null = null;
  if (meta) {
    const engineBuild =
      (meta as any).versionLine && (meta as any).versionLine !== "unknown" ? (meta as any).versionLine : "core-2";

    const engineMode =
      (meta as any).modeLabel && (meta as any).modeLabel !== "unknown" ? (meta as any).modeLabel : "strict";

    const engineAlphabet =
      meta.alphabetLabel && meta.alphabetLabel !== "unknown" ? meta.alphabetLabel : "auto";

    engineLine = `${engineBuild} · ${engineMode} · ${engineAlphabet}`;
  }

  const header = `Linguistic Decoder — ${word}`;

  const symbolicSummary = buildSymbolicSummary(analysis);
  let symbolicLine: string | null = null;
  if (symbolicSummary) {
    const { label, notes } = symbolicSummary;
    const firstNote = notes[0];
    if (firstNote) {
      symbolicLine = `Symbolic (experimental): ${label} — ${firstNote}`;
    } else {
      symbolicLine = `Symbolic (experimental): ${label}`;
    }
  }

  const languageFamilies = buildLanguageFamiliesView(analysis);
  let languagesLine: string | null = null;
  if (languageFamilies.length > 0) {
    const families = languageFamilies.slice(0, 2).map((family) => {
      let familyString = `${family.language} – ${family.form}`;
      const tag = family.tags[0];
      if (family.pivot && tag) {
        familyString += ` (pivot: ${family.pivot}, tag: ${tag})`
      } else if (family.pivot) {
        familyString += ` (pivot: ${family.pivot})`
      } else if (tag) {
        familyString += ` (tag: ${tag})`
      }
      return familyString;
    });
    languagesLine = `Languages: ${families.join("; ")}`;
  }

  return [
    header,
    heartLine ? `Summary: ${heartLine}` : null,
    engineLine ? `Engine: ${engineLine}` : null,
    languagesLine,
    symbolicLine,
  ]
    .filter(Boolean)
    .join("\n");
}

// Public-facing snippet: strip dev noise like "(experimental)" labels,
// but reuse the same core structure as buildShareSnippet.
export function buildPublicShareSnippet(source: ShareSource): string {
  const devSnippet = buildShareSnippet(source);
  return cleanShareSnippetForPublic(devSnippet);
}

// Pure string transformer: take a dev-style snippet and clean it for public use.
export function cleanShareSnippetForPublic(snippet: string): string {
  const lines = snippet.split("\n");

  const cleaned = lines.map((line) => {
    // Turn "Symbolic (experimental): ..." into "Symbolic: ..."
    if (line.startsWith("Symbolic (experimental):")) {
      return line.replace("Symbolic (experimental):", "Symbolic:");
    }
    // For any other line, just remove " (experimental)" if present
    return line.replace(" (experimental)", "");
  });

  return cleaned.join("\n");
}