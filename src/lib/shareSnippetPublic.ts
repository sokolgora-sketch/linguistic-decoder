import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import { buildHeartSummaryText } from "@/lib/heartSummaryText";

// Temporary structural helpers until shared types are extended
type EngineMetaShape = {
  engineLabel?: string;
  build?: string;
  modeLabel?: string;
  alphabetLabel?: string;
};

type OptionsShape = {
  mode?: string;
  modeLabel?: string;
  alphabet?: string;
  alphabetLabel?: string;
};

type ZhejiShape = {
  functionalStatement?: string;
  subject?: string;
  object?: string;
  modifier?: string;
  rootPolarity?: string;
  tension?: string;
};

type SymbolicShape = {
  summary?: string;
};

export function buildPublicSummarySnippet(result: AnalyzeWordResultUI): string {
  const { word } = result;

  const engine = (result as any).engineMeta as EngineMetaShape | undefined;
  const options = ((result as any).options ?? {}) as OptionsShape;
  const zheji = (result as any).zheji as ZhejiShape | undefined;
  const symbolic = (result as any).symbolic as SymbolicShape | undefined;

  const engineLine = engine
    ? `Engine: ${engine.engineLabel ?? "SevenVoices Core"} (build ${engine.build ?? "unknown"}, mode ${options.modeLabel ?? options.mode ?? "strict"}, alphabet ${options.alphabetLabel ?? options.alphabet ?? "auto"})`
    : undefined;

  const heartLine = result.primaryPath
    ? `Heart: ${buildHeartSummaryText({
        word: result.word,
        primaryPath: result.primaryPath,
      })}`
    : undefined;

  const zhejiLine = zheji?.functionalStatement
    ? `Structure: ${zheji.functionalStatement} [subject: ${zheji.subject ?? "-"}, object: ${zheji.object ?? "-"}, modifier: ${zheji.modifier ?? "-"}, polarity: ${zheji.rootPolarity ?? "-"}, tension: ${zheji.tension ?? "-"}]`
    : undefined;

  const symbolicLine = symbolic?.summary
    ? `Symbolic reading: ${symbolic.summary}`
    : undefined;

  const lines = [
    `Word: ${word}`,
    engineLine,
    heartLine,
    zhejiLine,
    symbolicLine,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

export { buildPublicSummarySnippet as buildShareSnippetPublic };