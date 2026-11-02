"use client";

import { useEffect, useState } from "react";

const FJALORI_API_ROOT = "https://fjalorishqip.org/api/v1/fjala";
const FETCH_TIMEOUT_MS = 8_000;
const MAX_WORD_CODEPOINTS = 64;
const MAX_RECORD_ENTRIES = 20;
const MAX_DESCRIPTION_CODEPOINTS = 2_000;
const MAX_SOURCE_IDS = 24;

type FjaloriDescription = Readonly<{ text: string; source: "ai"; attribution: string }>;
type EvidenceState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "unavailable" }>
  | Readonly<{
      status: "available";
      description: FjaloriDescription | null;
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

function readFjaloriEvidence(payload: unknown, canonicalWord: string): EvidenceState | null {
  if (!isRecord(payload) || typeof payload.word !== "string" ||
      payload.word.normalize("NFC").trim().toLocaleLowerCase("sq-AL") !== canonicalWord ||
      payload.licence !== "CC BY-SA 4.0" || isGplOnlyOrUnverified(payload) ||
      !Array.isArray(payload.entries) || payload.entries.length > MAX_RECORD_ENTRIES) {
    return null;
  }

  const recordSources = stringIds(payload.sources);
  const entrySources: (readonly string[])[] = [];
  let hasWiktionaryDerivedSenses = false;
  let hasPartOfSpeech = false;

  for (const entry of payload.entries) {
    if (!isRecord(entry) || isGplOnlyOrUnverified(entry)) return null;
    const sources = stringIds(entry.sources);
    entrySources.push(sources);

    if (typeof entry.pos === "string" && entry.pos.trim().length > 0) {
      hasPartOfSpeech = true;
    }
    if (Array.isArray(entry.senses)) {
      for (const sense of entry.senses) {
        if (isRecord(sense) && sense.lang === "en" && sense.source === "en-wiktionary") {
          hasWiktionaryDerivedSenses = true;
        }
      }
    }
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
    entrySources: Object.freeze(entrySources),
    recordSources,
    hasWiktionaryDerivedSenses,
    hasPartOfSpeech,
  });
}

export function FjaloriCrossSourceEvidenceV0_1({ word }: Readonly<{ word: string }>) {
  const canonicalWord = canonicalAlbanianWord(word);
  const [evidence, setEvidence] = useState<EvidenceState>({ status: "loading" });

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
        if (!response.ok) throw new Error("Fjalori API response unavailable");
        return readFjaloriEvidence(await response.json() as unknown, canonicalWord);
      })
      .then((result) => {
        if (!disposed && !timedOut) {
          setEvidence(result ?? { status: "unavailable" });
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
          UNKNOWN_OR_NULL — the exact FjaloriShqip record or attributable description could not be verified in this response.
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
                <a href={wordPageUrl} target="_blank" rel="noreferrer" className="underline">Original FjaloriShqip record</a>
                <a href={apiUrl} target="_blank" rel="noreferrer" className="underline">FjaloriShqip API record</a>
                <a href="https://github.com/EndritRushiti/FjaloriShqip/blob/main/DATA-LICENSE.md" target="_blank" rel="noreferrer" className="underline">Data sources and license</a>
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
          <p className="mt-2 text-[#d3c99c]" data-testid="fjalori-alignment-boundary">
            FORM_MATCH_ONLY — this record exposes no shared source sense ID; exact cross-source sense alignment is UNKNOWN_OR_NULL.
            {evidence.hasPartOfSpeech ? " Part-of-speech attribution is not used to align senses." : " No part-of-speech field is available."}
            {" "}The source description remains separate from the existing ZË-RO interpretation and does not change functional operation, AGENT, pronunciation, or embryo interpretation.
          </p>
          {canonicalWord === "dritare" && evidence.description ? (
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
