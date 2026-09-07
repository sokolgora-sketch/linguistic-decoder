export const OPEN_INSTRUMENT_RAW_SOURCE_ENTRY_CAPTURE_VERSION_V0_1 =
  "open-instrument.raw-source-entry-capture.v0_1" as const;

export type OpenInstrumentRawSourceEntryCaptureV0_1 = {
  captureVersion: typeof OPEN_INSTRUMENT_RAW_SOURCE_ENTRY_CAPTURE_VERSION_V0_1;
  sourceTraditionId: string;
  sourceUrlOrArchiveRef: string;
  sourceDateOrVersion?: string | null;
  rawEntryText: string;
};

export type OpenInstrumentRawSourceSenseCandidateV0_1 = {
  label: string | null;
  text: string;
};

export type OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1 =
  | "RAW_CAPTURE_INVALID"
  | "UNSUPPORTED_SOURCE_TRADITION"
  | "SOURCE_URL_MISSING"
  | "HEADWORD_NOT_FOUND"
  | "HEADWORD_AMBIGUOUS"
  | "LOCATOR_NOT_FOUND"
  | "MULTIPLE_SENSES_REVIEW_REQUIRED"
  | "ATTESTED_FORM_NOT_FOUND"
  | "GLOSS_NOT_FOUND"
  | "INVALID_OPTIONAL_DATE_VERSION"
  | "REVIEW_REQUIRED";

export type OpenInstrumentRawSourceEntryCaptureCandidateV0_1 = {
  sourceTraditionId: string;
  sourceUrlOrArchiveRef: string;
  sourceDateOrVersionCandidate: string | null;
  headwordCandidates: readonly string[];
  entryLocatorCandidates: readonly string[];
  senseCandidates: readonly OpenInstrumentRawSourceSenseCandidateV0_1[];
  attestedFormCandidates: readonly string[];
  attestedGlossCandidates: readonly string[];
  diagnostics: readonly OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1[];
  reviewStatus: "RAW_CAPTURE_REVIEW_REQUIRED";
};

export type OpenInstrumentRawSourceEntryCaptureResultV0_1 =
  | {
      ok: true;
      candidate: OpenInstrumentRawSourceEntryCaptureCandidateV0_1;
    }
  | {
      ok: false;
      candidate: null;
      diagnostics: readonly OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1[];
      reviewStatus: "REVIEW_REQUIRED";
    };

const SUPPORTED_SOURCE_TRADITIONS_V0_1 = new Set([
  "fjale.fjalor-shqip.v0_1",
  "scaife.lewis-short.v0_1",
]);

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeTextV0_1(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").trim();
  return normalized || null;
}

function normalizeLinesV0_1(rawEntryText: string): string[] {
  return rawEntryText
    .normalize("NFC")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function sortReasonCodesV0_1(
  reasonCodes: Iterable<OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1>,
): OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1[] {
  return [...new Set(reasonCodes)].sort();
}

function candidateResultV0_1(
  input: OpenInstrumentRawSourceEntryCaptureV0_1,
  values: Omit<
    OpenInstrumentRawSourceEntryCaptureCandidateV0_1,
    "sourceTraditionId" | "sourceUrlOrArchiveRef" | "sourceDateOrVersionCandidate" | "diagnostics" | "reviewStatus"
  >,
  diagnostics: Iterable<OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1>,
): OpenInstrumentRawSourceEntryCaptureResultV0_1 {
  const sortedDiagnostics = sortReasonCodesV0_1(diagnostics);
  const candidate: OpenInstrumentRawSourceEntryCaptureCandidateV0_1 = {
    ...values,
    sourceTraditionId: input.sourceTraditionId,
    sourceUrlOrArchiveRef: input.sourceUrlOrArchiveRef,
    sourceDateOrVersionCandidate:
      input.sourceDateOrVersion === undefined || input.sourceDateOrVersion === null
        ? null
        : normalizeTextV0_1(input.sourceDateOrVersion),
    diagnostics: sortedDiagnostics,
    reviewStatus: "RAW_CAPTURE_REVIEW_REQUIRED",
  };

  return {
    ok: true,
    candidate,
  };
}

function parseFjaleV0_1(
  input: OpenInstrumentRawSourceEntryCaptureV0_1,
  lines: readonly string[],
): OpenInstrumentRawSourceEntryCaptureResultV0_1 {
  const header = lines[0] ?? "";
  const headerMatch = header.match(/^(.+?)\s+[A-Za-zÇËçë]+(?:\.|;|$)/u);
  const headwordText = normalizeTextV0_1(headerMatch?.[1]);
  const headwordCandidates = headwordText
    ? headwordText.split(/\s*[/;,]\s*/).map(normalizeTextV0_1).filter((value): value is string => value !== null)
    : [];
  const locatorCandidates = header.includes(";") ? [header] : [];
  const numberedSenseLines = lines.slice(1).flatMap((line) => {
    const match = line.match(/^(\d+)\.\s*(.+)$/u);
    return match
      ? [{ label: `sense ${match[1]}`, text: match[2].trim() }]
      : [];
  });
  const fallbackSenseLines =
    numberedSenseLines.length === 0 && lines[1]
      ? [{ label: null, text: lines.slice(1).join(" ") }]
      : numberedSenseLines;
  const diagnostics = new Set<OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1>();

  if (headwordCandidates.length === 0) diagnostics.add("HEADWORD_NOT_FOUND");
  if (headwordCandidates.length > 1) diagnostics.add("HEADWORD_AMBIGUOUS");
  if (locatorCandidates.length === 0) diagnostics.add("LOCATOR_NOT_FOUND");
  if (fallbackSenseLines.length === 0) diagnostics.add("GLOSS_NOT_FOUND");
  if (fallbackSenseLines.length > 1) diagnostics.add("MULTIPLE_SENSES_REVIEW_REQUIRED");

  return candidateResultV0_1(
    input,
    {
      headwordCandidates,
      entryLocatorCandidates: locatorCandidates,
      senseCandidates: fallbackSenseLines,
      attestedFormCandidates: headwordCandidates,
      attestedGlossCandidates: fallbackSenseLines.map((sense) => sense.text),
    },
    diagnostics,
  );
}

function parseScaifeV0_1(
  input: OpenInstrumentRawSourceEntryCaptureV0_1,
  lines: readonly string[],
): OpenInstrumentRawSourceEntryCaptureResultV0_1 {
  const headwordLine = lines[0] ?? "";
  const headword = normalizeTextV0_1(headwordLine.split(",")[0]);
  const locator = normalizeTextV0_1(lines[1]);
  const locatorLabel = normalizeTextV0_1(locator?.split(";")[1]);
  const senseLines = lines.slice(2).flatMap((line) => {
    const numbered = line.match(/^(\d+)\.\s*(.+)$/u);
    return numbered
      ? [{ label: locatorLabel ?? `sense ${numbered[1]}`, text: numbered[2].trim() }]
      : line
        ? [{ label: locatorLabel, text: line }]
        : [];
  });
  const diagnostics = new Set<OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1>();

  if (!headword) diagnostics.add("HEADWORD_NOT_FOUND");
  if (!locator || !locator.toLocaleLowerCase("en-US").includes("headword")) {
    diagnostics.add("LOCATOR_NOT_FOUND");
  }
  if (senseLines.length === 0) diagnostics.add("GLOSS_NOT_FOUND");
  if (senseLines.length > 1) diagnostics.add("MULTIPLE_SENSES_REVIEW_REQUIRED");

  return candidateResultV0_1(
    input,
    {
      headwordCandidates: headword ? [headword] : [],
      entryLocatorCandidates: locator ? [locator] : [],
      senseCandidates: senseLines,
      attestedFormCandidates: headword ? [headword] : [],
      attestedGlossCandidates: senseLines.map((sense) => sense.text),
    },
    diagnostics,
  );
}

export function captureRawSourceEntryV0_1(
  value: unknown,
): OpenInstrumentRawSourceEntryCaptureResultV0_1 {
  if (!isRecordV0_1(value)) {
    return {
      ok: false,
      candidate: null,
      diagnostics: ["RAW_CAPTURE_INVALID"],
      reviewStatus: "REVIEW_REQUIRED",
    };
  }

  const captureVersion = normalizeTextV0_1(value.captureVersion);
  const sourceTraditionId = normalizeTextV0_1(value.sourceTraditionId);
  const sourceUrlOrArchiveRef = normalizeTextV0_1(value.sourceUrlOrArchiveRef);
  const rawEntryText = normalizeTextV0_1(value.rawEntryText);
  const sourceDateOrVersion =
    value.sourceDateOrVersion === undefined || value.sourceDateOrVersion === null
      ? null
      : normalizeTextV0_1(value.sourceDateOrVersion);
  const diagnostics = new Set<OpenInstrumentRawSourceEntryCaptureReasonCodeV0_1>();

  if (captureVersion !== OPEN_INSTRUMENT_RAW_SOURCE_ENTRY_CAPTURE_VERSION_V0_1) {
    diagnostics.add("RAW_CAPTURE_INVALID");
  }
  if (!sourceTraditionId || !SUPPORTED_SOURCE_TRADITIONS_V0_1.has(sourceTraditionId)) {
    diagnostics.add("UNSUPPORTED_SOURCE_TRADITION");
  }
  if (!sourceUrlOrArchiveRef) diagnostics.add("SOURCE_URL_MISSING");
  if (!rawEntryText) diagnostics.add("RAW_CAPTURE_INVALID");
  if (
    value.sourceDateOrVersion !== undefined &&
    value.sourceDateOrVersion !== null &&
    !sourceDateOrVersion
  ) {
    diagnostics.add("INVALID_OPTIONAL_DATE_VERSION");
  }
  for (const field of ["captureVersion", "sourceTraditionId", "sourceUrlOrArchiveRef", "rawEntryText"]) {
    if (value[field] !== undefined && typeof value[field] !== "string") {
      diagnostics.add("RAW_CAPTURE_INVALID");
    }
  }
  if (
    value.sourceDateOrVersion !== undefined &&
    value.sourceDateOrVersion !== null &&
    typeof value.sourceDateOrVersion !== "string"
  ) {
    diagnostics.add("INVALID_OPTIONAL_DATE_VERSION");
  }

  const sortedDiagnostics = sortReasonCodesV0_1(diagnostics);
  if (sortedDiagnostics.length > 0) {
    return {
      ok: false,
      candidate: null,
      diagnostics: sortedDiagnostics,
      reviewStatus: "REVIEW_REQUIRED",
    };
  }

  const input = {
    captureVersion: captureVersion as typeof OPEN_INSTRUMENT_RAW_SOURCE_ENTRY_CAPTURE_VERSION_V0_1,
    sourceTraditionId: sourceTraditionId as string,
    sourceUrlOrArchiveRef: sourceUrlOrArchiveRef as string,
    sourceDateOrVersion,
    rawEntryText: rawEntryText as string,
  };
  const lines = normalizeLinesV0_1(input.rawEntryText);
  const result = sourceTraditionId === "fjale.fjalor-shqip.v0_1"
    ? parseFjaleV0_1(input, lines)
    : parseScaifeV0_1(input, lines);

  if (!result.ok) return result;
  return {
    ok: true,
    candidate: {
      ...result.candidate,
      diagnostics: sortReasonCodesV0_1([
        ...result.candidate.diagnostics,
        "REVIEW_REQUIRED",
      ]),
    },
  };
}
