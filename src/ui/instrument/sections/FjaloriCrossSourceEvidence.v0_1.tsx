"use client";

import { useEffect, useState } from "react";

const TARGET_FORMS = new Map<string, string>([
  ["pelar", "pelar"],
  ["bletar", "bletar"],
  ["luleshitës", "luleshitës"],
  ["fuzhnjar", "fuzhnjar"],
  ["qymyrtar", "qymyrtar"],
]);

type FjaloriDescription = Readonly<{ text: string; source: string }>;
type EvidenceState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "unavailable" }>
  | Readonly<{
      status: "available";
      descriptions: readonly FjaloriDescription[];
      hasWiktionaryDerivedSenses: boolean;
      hasPartOfSpeech: boolean;
    }>;

function canonicalTargetForm(value: string): string | null {
  const normalized = value.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
  return TARGET_FORMS.get(normalized) ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readFjaloriEvidence(
  payload: unknown,
  canonicalForm: string,
): EvidenceState | null {
  if (!isRecord(payload) || typeof payload.word !== "string" ||
      payload.word.normalize("NFC").trim().toLocaleLowerCase("sq-AL") !== canonicalForm ||
      !Array.isArray(payload.entries) || payload.entries.length === 0) {
    return null;
  }

  const descriptions: FjaloriDescription[] = [];
  let hasWiktionaryDerivedSenses = false;
  let hasPartOfSpeech = false;

  for (const entry of payload.entries) {
    if (!isRecord(entry)) continue;
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

    const description = entry.description;
    if (isRecord(description) && description.source === "ai" &&
        typeof description.text === "string" && description.text.trim().length > 0) {
      descriptions.push(Object.freeze({
        text: description.text,
        source: description.source,
      }));
    }
  }

  return Object.freeze({
    status: "available",
    descriptions: Object.freeze(descriptions),
    hasWiktionaryDerivedSenses,
    hasPartOfSpeech,
  });
}

export function FjaloriCrossSourceEvidenceV0_1({ word }: Readonly<{ word: string }>) {
  const canonicalForm = canonicalTargetForm(word);
  const [evidence, setEvidence] = useState<EvidenceState>({ status: "loading" });

  useEffect(() => {
    if (!canonicalForm) return;
    const controller = new AbortController();
    setEvidence({ status: "loading" });

    void fetch(
      `https://fjalorishqip.org/api/v1/fjala/${encodeURIComponent(canonicalForm)}.json`,
      { cache: "force-cache", signal: controller.signal },
    )
      .then(async (response) => {
        if (!response.ok) throw new Error("Fjalori API response unavailable");
        return readFjaloriEvidence(await response.json() as unknown, canonicalForm);
      })
      .then((result) => {
        if (!controller.signal.aborted) {
          setEvidence(result ?? { status: "unavailable" });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setEvidence({ status: "unavailable" });
      });

    return () => controller.abort();
  }, [canonicalForm]);

  if (!canonicalForm) return null;

  const apiUrl = `https://fjalorishqip.org/api/v1/fjala/${encodeURIComponent(canonicalForm)}.json`;

  return (
    <section
      data-testid="fjalori-cross-source-evidence"
      className="mt-3 rounded-lg border border-[#4b536c] bg-[#141824] p-3 text-xs leading-5 text-[#d5d9e8]"
    >
      <div className="font-semibold uppercase tracking-[0.12em] text-[#c4c9ed]">
        FjaloriShqip · bounded source note
      </div>
      {evidence.status === "loading" ? (
        <p className="mt-1">Loading this allowlisted FjaloriShqip entry…</p>
      ) : evidence.status === "unavailable" ? (
        <p className="mt-1" data-testid="fjalori-evidence-null">
          UNKNOWN_OR_NULL — this FjaloriShqip entry could not be verified in the current response.
        </p>
      ) : (
        <>
          {evidence.descriptions.length ? (
            <div className="mt-2 space-y-2">
              {evidence.descriptions.map((description, index) => (
                <article className="rounded border border-[#343a50] bg-[#10131d] p-2" key={`${index}:${description.text}`}>
                  <div className="font-semibold text-[#f0f1fa]">
                    Albanian description · author-produced, AI-assisted · entry {index + 1}
                  </div>
                  <p className="mt-1 text-sm">{description.text}</p>
                  <p className="mt-1 text-[10px] text-[#aeb4ce]">
                    Attribution: Endrit Rushiti / FjaloriShqip · CC BY-SA 4.0
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-1" data-testid="fjalori-evidence-null">
              UNKNOWN_OR_NULL — no attributable Albanian author description is available for this entry.
            </p>
          )}
          {evidence.hasWiktionaryDerivedSenses ? (
            <p className="mt-2 text-[#b7bfd9]">
              The entry also identifies English gloss data as en-wiktionary (processed by kaikki.org); it is Wiktionary/Kaikki-derived, not independent corroboration of the Kaikki lexical fact.
            </p>
          ) : null}
          <p className="mt-2 text-[#d3c99c]" data-testid="fjalori-alignment-boundary">
            FORM_MATCH_ONLY — no shared source sense ID is exposed here; sense alignment is UNKNOWN_OR_NULL.
            {evidence.hasPartOfSpeech ? " Part-of-speech field attribution is UNKNOWN and is not used for alignment." : " No source-attributed part-of-speech field is available."}
            {" "}This descriptive item does not change functional operation, AGENT, etymology, pronunciation, or embryo interpretation.
          </p>
        </>
      )}
      <p className="mt-2 text-[10px] text-[#aeb4ce]">
        <a href={apiUrl} target="_blank" rel="noreferrer" className="underline">FjaloriShqip API record</a>
        {" · "}
        <a href="https://fjalorishqip.org/burimet/" target="_blank" rel="noreferrer" className="underline">source attribution</a>
        {" · "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline">CC BY-SA 4.0 terms</a>
      </p>
    </section>
  );
}
