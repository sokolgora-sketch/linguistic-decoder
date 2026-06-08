import {
  ZHEJI_PROMPT_CONTRACT_METADATA_V0_1,
  type ZhejiPromptContractMetadataV0_1,
} from "./zhejiTransparencyTypes.v0.1";

export interface BuildZhejiPromptContractSectionInputV0_1 {
  word: string;
  segmentationId: string;
  chunks: readonly string[];
  voicePathHint: string;
  doctrineHints: Readonly<Record<string, string>>;
}

export interface ZhejiPromptContractSectionV0_1 {
  metadata: ZhejiPromptContractMetadataV0_1;
  section: string;
}

function formatDoctrineHints(
  doctrineHints: Readonly<Record<string, string>>,
): string {
  return Object.entries(doctrineHints)
    .map(([voice, hint]) => `- ${voice}: ${hint}`)
    .join("\n");
}

export function buildZhejiPromptContractSectionV0_1(
  input: BuildZhejiPromptContractSectionInputV0_1,
): ZhejiPromptContractSectionV0_1 {
  const chunks = input.chunks.join(" + ");
  const doctrineHintText = formatDoctrineHints(input.doctrineHints);

  return {
    metadata: ZHEJI_PROMPT_CONTRACT_METADATA_V0_1,
    section: [
      "ZHEJI SEMANTIC TRANSPARENCY ADDITION",
      "",
      `Word: ${input.word}`,
      `Segmentation ID: ${input.segmentationId}`,
      `Heart-approved chunks: ${chunks}`,
      `Voice path hint: ${input.voicePathHint}`,
      "",
      "Compact Seven-Voice doctrine hints for this replay:",
      doctrineHintText,
      "",
      "For every non-null chunk candidate, include analysisLayers.",
      "analysisLayers.formal.isPresent is true only when documented historical, lexical, dictionary, cognate, or established comparative evidence supports the candidate.",
      "analysisLayers.formal.evidenceNote must be short, or null when formal evidence is not present.",
      "analysisLayers.symbolic.isPresent is true only when candidate meaning aligns with the supplied doctrine hints for this embryo morpheme.",
      "analysisLayers.symbolic.evidenceNote must be short, or null when symbolic evidence is not present.",
      "For every non-null chunk candidate, include semanticTransparency.",
      "semanticTransparency.level must be exactly one of: atomic, metaphorical, opaque.",
      "semanticTransparency.reason must be short and auditable.",
      "semanticTransparency.decomposition is optional. If uncertain, omit it.",
      "Use atomic only when candidate meaning is directly motivated as a literal, physical, or functional sum of smallest meaningful parts inside that language.",
      "Use metaphorical when roots or structure exist but the embryo meaning requires conceptual leap.",
      "Use opaque when no useful internal structural explanation exists for the embryo meaning.",
      "This layer inspects semantic/function motivation. It does not declare winner, history, or origin.",
      "Do not return transparencyContrast.",
      "Do not return transparencyContrastNote.",
      "Do not score, rank, choose a winner, claim origin, or modify candidateType.",
    ].join("\n"),
  };
}
