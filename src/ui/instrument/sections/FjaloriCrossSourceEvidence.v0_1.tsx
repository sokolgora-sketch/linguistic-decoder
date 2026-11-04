"use client";

import { useEffect, useState } from "react";

const FJALORI_API_ROOT = "https://fjalorishqip.org/api/v1/fjala";
const FETCH_TIMEOUT_MS = 8_000;
const MAX_WORD_CODEPOINTS = 64;
const MAX_RECORD_ENTRIES = 20;
const MAX_RECORD_SENSES = 200;
const MAX_DESCRIPTION_CODEPOINTS = 2_000;
const MAX_SENSE_GLOSS_CODEPOINTS = 2_000;
const MAX_SOURCE_IDS = 24;
const MAX_SENSE_TAGS = 24;

type FjaloriDescription = Readonly<{ text: string; source: "ai"; attribution: string }>;
type FjaloriSense = Readonly<{
  gloss: string;
  lang: "en" | "sq";
  source: string;
  tags: readonly string[];
}>;
type FjaloriEntry = Readonly<{
  pos: string | null;
  sources: readonly string[];
  senses: readonly FjaloriSense[];
}>;
type UserSenseAssessment = "POTENTIALLY_SUPPORTS_PROPOSAL" | "DOES_NOT_SUPPORT_PROPOSAL" | "UNDECIDED";
type EvidenceState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "unavailable" }>
  | Readonly<{ status: "invalid" }>
  | Readonly<{
      status: "available";
      description: FjaloriDescription | null;
      entries: readonly FjaloriEntry[];
      entrySources: readonly (readonly string[])[];
      recordSources: readonly string[];
      hasWiktionaryDerivedSenses: boolean;
      hasPartOfSpeech: boolean;
    }>;

function canonicalAlbanianWord(value: string): string | null {
  if (value.length > MAX_WORD_CODEPOINTS * 2 + 16) return null;
  const normalized = value.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
  if ([...normalized].length > MAX_WORD_CODEPOINTS || !/^[a-zçëâêîôû]+$/u.test(normalized)) {
    return null;
  }
  return normalized;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringIds(value: unknown): readonly string[] {
  if (!Array.isArray(value) || value.length > MAX_SOURCE_IDS) return [];
  return Object.freeze(value.filter((item): item is string =>
    typeof item === "string" && item.length > 0 && item.length <= 100,
  ));
}

function isGplOnlyOrUnverified(record: Record<string, unknown>): boolean {
  const licence = typeof record.licence === "string" ? record.licence : "";
  const rawSources = Array.isArray(record.sources) ? record.sources : [];
  return record.unverified === true || /\bGPL\b/i.test(licence) ||
    rawSources.length > MAX_SOURCE_IDS || rawSources.includes("hunspell-sq");
}

function readFjaloriEvidence(payload: unknown, canonicalWord: string): Extract<EvidenceState, { status: "available" }> | null {
  if (!isRecord(payload) || typeof payload.word !== "string" ||
      payload.word.normalize("NFC").trim().toLocaleLowerCase("sq-AL") !== canonicalWord ||
      payload.licence !== "CC BY-SA 4.0" || isGplOnlyOrUnverified(payload) ||
      !Array.isArray(payload.entries) || payload.entries.length > MAX_RECORD_ENTRIES) {
    return null;
  }

  const recordSources = stringIds(payload.sources);
  const entrySources: (readonly string[])[] = [];
  const entries: FjaloriEntry[] = [];
  let hasWiktionaryDerivedSenses = false;
  let hasPartOfSpeech = false;
  let totalSenseCount = 0;

  for (const entry of payload.entries) {
    if (!isRecord(entry) || isGplOnlyOrUnverified(entry)) return null;
    const sources = stringIds(entry.sources);
    entrySources.push(sources);

    const pos = typeof entry.pos === "string" && entry.pos.trim().length > 0 && entry.pos.length <= 80
      ? entry.pos
      : null;
    if (pos) {
      hasPartOfSpeech = true;
    }
    if (!Array.isArray(entry.senses)) return null;

    const senses: FjaloriSense[] = [];
    for (const sense of entry.senses) {
      if (!isRecord(sense) ||
          typeof sense.gloss !== "string" ||
          sense.gloss.trim().length === 0 ||
          [...sense.gloss].length > MAX_SENSE_GLOSS_CODEPOINTS ||
          (sense.lang !== "en" && sense.lang !== "sq") ||
          typeof sense.source !== "string" ||
          sense.source.trim().length === 0 ||
          sense.source.length > 100) {
        return null;
      }
      const tags = sense.tags === undefined
        ? []
        : Array.isArray(sense.tags) && sense.tags.length <= MAX_SENSE_TAGS &&
          sense.tags.every((tag) => typeof tag === "string" && tag.length > 0 && tag.length <= 100)
          ? sense.tags as string[]
          : null;
      if (tags === null) return null;

      senses.push(Object.freeze({
        gloss: sense.gloss,
        lang: sense.lang,
        source: sense.source,
        tags: Object.freeze([...tags]),
      }));
      totalSenseCount++;
      if (totalSenseCount > MAX_RECORD_SENSES) return null;
      if (sense.lang === "en" && sense.source === "en-wiktionary") {
        hasWiktionaryDerivedSenses = true;
      }
    }
    entries.push(Object.freeze({ pos, sources, senses: Object.freeze(senses) }));
  }

  let description: FjaloriDescription | null = null;
  const candidateDescription = payload.description;
  const attributions = Array.isArray(payload.attribution) ? payload.attribution : [];
  const aiAttribution = attributions.find((item): item is string =>
    typeof item === "string" && item.length <= 300 && /AI/i.test(item) && item.includes("CC BY-SA 4.0"),
  );
  if (isRecord(candidateDescription) && candidateDescription.source === "ai" &&
      typeof candidateDescription.text === "string" &&
      candidateDescription.text.trim().length > 0 &&
      [...candidateDescription.text].length <= MAX_DESCRIPTION_CODEPOINTS &&
      recordSources.includes("ai") && aiAttribution) {
    description = Object.freeze({
      text: candidateDescription.text,
      source: "ai",
      attribution: aiAttribution,
    });
  }

  return Object.freeze({
    status: "available",
    description,
    entries: Object.freeze(entries),
    entrySources: Object.freeze(entrySources),
    recordSources,
    hasWiktionaryDerivedSenses,
    hasPartOfSpeech,
  });
}

export function FjaloriCrossSourceEvidenceV0_1({
  word,
  context = "word-reading",
  proposalMeaning,
}: Readonly<{ word: string; context?: "word-reading" | "component"; proposalMeaning?: string }>) {
  const canonicalWord = canonicalAlbanianWord(word);
  const [evidence, setEvidence] = useState<EvidenceState>({ status: "loading" });
  const [selectedSense, setSelectedSense] = useState<Readonly<{
    entryIndex: number;
    senseIndex: number;
    proposalMeaning: string;
  }> | null>(null);
  const [userAssessment, setUserAssessment] = useState<UserSenseAssessment | null>(null);

  useEffect(() => {
    setSelectedSense(null);
    setUserAssessment(null);
  }, [canonicalWord, proposalMeaning]);

  useEffect(() => {
    if (!canonicalWord) return;

    const controller = new AbortController();
    let disposed = false;
    let timedOut = false;
    setEvidence({ status: "loading" });
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, FETCH_TIMEOUT_MS);

    void fetch(
      `${FJALORI_API_ROOT}/${encodeURIComponent(canonicalWord)}.json`,
      { cache: "force-cache", signal: controller.signal },
    )
      .then(async (response) => {
        if (!response.ok) return { kind: "unavailable" } as const;
        let payload: unknown;
        try {
          payload = await response.json() as unknown;
        } catch {
          return { kind: "invalid" } as const;
        }
        const parsed = readFjaloriEvidence(payload, canonicalWord);
        return parsed ? { kind: "available", evidence: parsed } as const : { kind: "invalid" } as const;
      })
      .then((result) => {
        if (!disposed && !timedOut) {
          if (result.kind === "available") setEvidence(result.evidence);
          else setEvidence({ status: result.kind });
        }
      })
      .catch(() => {
        if (!disposed) setEvidence({ status: "unavailable" });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [canonicalWord]);

  if (!canonicalWord) return null;

  const apiUrl = `${FJALORI_API_ROOT}/${encodeURIComponent(canonicalWord)}.json`;
  const wordPageUrl = `https://fjalorishqip.org/fjala/${encodeURIComponent(canonicalWord)}/`;

  return (
    <section
      data-testid="fjalori-cross-source-evidence"
      className="mt-3 rounded-lg border border-[#4b536c] bg-[#141824] p-3 text-xs leading-5 text-[#d5d9e8]"
    >
      <div className="font-semibold uppercase tracking-[0.12em] text-[#c4c9ed]">
        FjaloriShqip · Albanian meaning evidence
      </div>
      {evidence.status === "loading" ? (
        <p className="mt-1">Loading this bounded FjaloriShqip word record…</p>
      ) : evidence.status === "unavailable" ? (
        <p className="mt-1" data-testid="fjalori-evidence-null">
          SOURCE_UNAVAILABLE · UNKNOWN_OR_NULL — this FjaloriShqip request did not return a usable response. That does not establish that the word is absent from Albanian or other sources.
        </p>
      ) : evidence.status === "invalid" ? (
        <p className="mt-1" data-testid="fjalori-evidence-null">
          INVALID_SOURCE_RESPONSE · UNKNOWN_OR_NULL — the response was not valid JSON or did not match the bounded FjaloriShqip record shape. This does not establish that the word is absent.
        </p>
      ) : (
        <>
          {evidence.description ? (
            <article className="mt-2 rounded border border-[#343a50] bg-[#10131d] p-2">
              <div className="font-semibold text-[#f0f1fa]" data-testid="fjalori-source-description-label">
                SOURCE-DESCRIBED ALBANIAN MEANING · FjaloriShqip, author-produced with AI assistance
              </div>
              <p className="mt-1 text-sm" data-testid="fjalori-source-description">
                {evidence.description.text}
              </p>
              <p className="mt-1 text-[10px] text-[#aeb4ce]">
                Attribution: {evidence.description.attribution}. The description is not independent scientific corroboration.
              </p>
              <p className="mt-1 text-[10px] text-[#aeb4ce]">
                Record sources: {evidence.recordSources.join(" · ") || "source lineage unavailable"} · entry records: {evidence.entrySources.length}
              </p>
              <div className="mt-1 space-y-1 text-[10px] text-[#aeb4ce]" data-testid="fjalori-entry-lineages">
                {evidence.entrySources.map((sources, index) => (
                  <div key={`${index}:${sources.join(",")}`}>
                    Entry {index + 1} lineage: {sources.join(" · ") || "source identity unavailable"}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                {context === "word-reading" ? (
                  <>
                    <a href={wordPageUrl} target="_blank" rel="noreferrer" className="underline">Original FjaloriShqip record</a>
                    <a href={apiUrl} target="_blank" rel="noreferrer" className="underline">FjaloriShqip API record</a>
                    <a href="https://github.com/EndritRushiti/FjaloriShqip/blob/main/DATA-LICENSE.md" target="_blank" rel="noreferrer" className="underline">Data sources and license</a>
                  </>
                ) : null}
                <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline">CC BY-SA 4.0 terms</a>
              </div>
              <p className="mt-1 text-[10px] text-[#aeb4ce]">
                GPL-only Hunspell entries marked unverified are suppressed. Displayed description data is CC BY-SA 4.0.
              </p>
            </article>
          ) : (
            <p className="mt-1" data-testid="fjalori-evidence-null">
              UNKNOWN_OR_NULL — no attributable Albanian author description is available for this record.
            </p>
          )}
          {evidence.hasWiktionaryDerivedSenses ? (
            <p className="mt-2 text-[#b7bfd9]" data-testid="fjalori-lineage-boundary">
              English entry senses identify en-wiktionary/Kaikki lineage; they are not independent corroboration of the Kaikki lexical fact.
            </p>
          ) : null}
          {context === "component" ? (
            <section className="mt-3 rounded border border-[#3d465c] bg-[#10131d] p-2" data-testid="fjalori-component-senses">
              <h3 className="font-semibold text-[#f0f1fa]">Individual source senses · response order</h3>
              <p className="mt-1 text-[10px] text-[#aeb4ce]">
                No sense is ranked or matched automatically against the proposed meaning. Entry and sense numbers are positions in this response, not source-issued IDs; no stable source sense ID is supplied here.
              </p>
              {evidence.entries.some((entry) => entry.senses.length > 0) ? (
                <div className="mt-2 space-y-2">
                  {evidence.entries.map((entry, entryIndex) => (
                    <section key={`entry-${entryIndex}`} className="rounded border border-[#343a50] p-2" data-testid="fjalori-source-entry">
                      <h4 className="font-semibold">
                        Source-reported part of speech: {entry.pos ?? "UNKNOWN_OR_NULL"} · Entry {entryIndex + 1}
                      </h4>
                      <p className="text-[10px] text-[#aeb4ce]">
                        Entry sources: {entry.sources.join(" · ") || "UNKNOWN_OR_NULL"}
                      </p>
                      {entry.senses.length ? (
                        <ol className="mt-1 space-y-2">
                          {entry.senses.map((sense, senseIndex) => {
                            const isSelected = selectedSense?.entryIndex === entryIndex &&
                              selectedSense.senseIndex === senseIndex &&
                              selectedSense.proposalMeaning === (proposalMeaning ?? "");
                            return (
                              <li key={`sense-${senseIndex}`} className="rounded bg-[#171c28] p-2" data-testid="fjalori-source-sense">
                                <p className="text-[10px] text-[#aeb4ce]">
                                  Response locator: Entry {entryIndex + 1} · Sense {senseIndex + 1} · gloss language {sense.lang}
                                </p>
                                <p className="mt-1" data-testid="fjalori-source-sense-gloss">{sense.gloss}</p>
                                <p className="mt-1 text-[10px] text-[#aeb4ce]">
                                  Sense source attribution: {sense.source}
                                  {sense.tags.length ? ` · source tags: ${sense.tags.join(" · ")}` : ""}
                                </p>
                                {isSelected ? (
                                  <div className="mt-2 rounded border border-[#53604a] p-2" data-testid="fjalori-selected-sense">
                                    <p className="font-semibold">Selected by you for inspection · USER_INTERPRETATION</p>
                                    <label className="mt-1 block text-[10px] text-[#c5ced8]">
                                      USER_INTERPRETATION assessment
                                      <select
                                        aria-label={`USER_INTERPRETATION assessment for entry ${entryIndex + 1} sense ${senseIndex + 1}`}
                                        className="mt-1 w-full rounded border border-[#46505c] bg-[#0d1117] px-2 py-1 text-xs text-[#f5f7fb]"
                                        value={userAssessment ?? ""}
                                        onChange={(event) => setUserAssessment(event.target.value ? event.target.value as UserSenseAssessment : null)}
                                      >
                                        <option value="">Not assessed</option>
                                        <option value="POTENTIALLY_SUPPORTS_PROPOSAL">POTENTIALLY_SUPPORTS_PROPOSAL</option>
                                        <option value="DOES_NOT_SUPPORT_PROPOSAL">DOES_NOT_SUPPORT_PROPOSAL</option>
                                        <option value="UNDECIDED">UNDECIDED</option>
                                      </select>
                                    </label>
                                    <p className="mt-1 text-[10px] text-[#aeb4ce]">
                                      This local assessment does not change the proposal, evidence ledger, source sense, or engine result.
                                      {userAssessment ? ` Current assessment: ${userAssessment}.` : " No assessment entered."}
                                    </p>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="mt-2 rounded border border-[#53604a] px-2 py-1 text-[10px] text-[#dce9ca]"
                                    aria-label={`Select source sense entry ${entryIndex + 1} sense ${senseIndex + 1} for inspection`}
                                    onClick={() => {
                                      setSelectedSense({ entryIndex, senseIndex, proposalMeaning: proposalMeaning ?? "" });
                                      setUserAssessment(null);
                                    }}
                                  >
                                    Select sense for inspection
                                  </button>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                      ) : (
                        <p className="mt-1 text-[10px] text-[#aeb4ce]">This source entry has no usable senses in the response.</p>
                      )}
                    </section>
                  ))}
                </div>
              ) : (
                <p className="mt-2" data-testid="fjalori-no-usable-senses">
                  NO_USABLE_SENSES · UNKNOWN_OR_NULL — the validated record contains no individual senses with usable gloss text.
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                <a href={wordPageUrl} target="_blank" rel="noreferrer" className="underline">Original FjaloriShqip record</a>
                <a href={apiUrl} target="_blank" rel="noreferrer" className="underline">FjaloriShqip API record</a>
                <a href="https://github.com/EndritRushiti/FjaloriShqip/blob/main/DATA-LICENSE.md" target="_blank" rel="noreferrer" className="underline">Data sources and license</a>
              </div>
            </section>
          ) : null}
          <p className="mt-2 text-[#d3c99c]" data-testid="fjalori-alignment-boundary">
            FORM_MATCH_ONLY — this record exposes no shared source sense ID; exact cross-source sense alignment is UNKNOWN_OR_NULL.
            {evidence.hasPartOfSpeech ? " Part-of-speech attribution is not used to align senses." : " No part-of-speech field is available."}
            {" "}The source description remains separate from the existing ZË-RO interpretation and does not change functional operation, AGENT, pronunciation, or embryo interpretation.
          </p>
          {context === "word-reading" && canonicalWord === "dritare" && evidence.description ? (
            <aside className="mt-2 rounded border border-[#594a2b] bg-[#19170f] p-2 text-[#e6d9ae]" data-testid="fjalori-dritare-separation">
              <div><strong>Source-described meaning:</strong> the exact FjaloriShqip Albanian description is shown above as the meaning stated in that record.</div>
              <div className="mt-1"><strong>Existing ZË-RO reading:</strong> remains separately displayed in this Albanian Word Reading panel; this form match does not align its senses.</div>
              <div className="mt-1"><strong>Structure and history:</strong> any source-authored etymology shown by ZË-RO remains attributed source text, not independently verified by this description. Embryo-level function is UNKNOWN_OR_NULL.</div>
            </aside>
          ) : null}
        </>
      )}
    </section>
  );
}
