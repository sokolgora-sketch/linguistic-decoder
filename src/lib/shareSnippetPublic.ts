import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import { buildHeartSummaryText } from "@/lib/heartSummaryText";

export function buildPublicSummarySnippet(result: AnalyzeWordResultUI): string {
  const { word } = result;

  const engine = result.engineMeta;
  const options = result.options ?? {};

  const engineLine = engine
    ? `Engine: ${engine.engineLabel ?? "SevenVoices Core"} (build ${engine.build ?? "unknown"}, mode ${options.modeLabel ?? options.mode ?? "strict"}, alphabet ${options.alphabetLabel ?? options.alphabet ?? "auto"})`
    : undefined;

  const heartLine = result.primaryPath
    ? `Heart: ${buildHeartSummaryText({
        word: result.word,
        primaryPath: result.primaryPath,
      })}`
    : undefined;

  const zheji = result.zheji;
  const zhejiLine = zheji?.functionalStatement
    ? `Structure: ${zheji.functionalStatement} [subject: ${zheji.subject ?? "-"}, object: ${zheji.object ?? "-"}, modifier: ${zheji.modifier ?? "-"}, polarity: ${zheji.rootPolarity ?? "-"}, tension: ${zheji.tension ?? "-"}]`
    : undefined;

  const symbolic = result.symbolic;
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
