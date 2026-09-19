export const SOURCE_SLICE_SERIALIZATION_V1 =
  "open-instrument.source-slice-serialization.v1" as const;

export type CanonicalSourceSliceInputV1 = Readonly<{
  sourceFormat: string;
  sourceTraditionId: string;
  exactEntryXml: string;
}>;

const XML_DECLARATION_V1 =
  '<?xml version="1.0" encoding="UTF-8"?>' as const;
const SOURCE_SLICE_COMMENT_V1 =
  "<!-- Exact entryFree fragments from PerseusDL/lexica at the pinned commit in the manifest. -->" as const;

function escapeXmlAttributeV1(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;")
    .replaceAll(">", "&gt;");
}

function requireSingleLineAttributeV1(value: string, fieldName: string): string {
  if (
    value.length === 0 ||
    value.includes("\r") ||
    value.includes("\n")
  ) {
    throw new Error(`${fieldName} must be a non-empty single-line string`);
  }
  return value;
}

/**
 * Serializes the current entry-attestation sourceSlice representation.
 *
 * The returned string uses literal LF boundaries and is intended to be
 * persisted as UTF-8. exactEntryXml is preserved byte-for-byte when encoded
 * as UTF-8; no XML parsing, trimming, or normalization is performed on it.
 */
export function serializeCanonicalSourceSliceV1(
  input: CanonicalSourceSliceInputV1,
): string {
  const sourceFormat = requireSingleLineAttributeV1(
    input.sourceFormat,
    "sourceFormat",
  );
  const sourceTraditionId = requireSingleLineAttributeV1(
    input.sourceTraditionId,
    "sourceTraditionId",
  );

  return [
    XML_DECLARATION_V1,
    SOURCE_SLICE_COMMENT_V1,
    `<sourceSlice sourceFormat="${escapeXmlAttributeV1(sourceFormat)}" sourceTraditionId="${escapeXmlAttributeV1(sourceTraditionId)}">`,
    input.exactEntryXml,
    "</sourceSlice>",
    "",
  ].join("\n");
}
