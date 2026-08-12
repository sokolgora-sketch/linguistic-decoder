import React from "react";

import type {
  CandidateRowVM,
  PresentOrMissing,
  TelemetryViewModel,
  Vowel,
} from "@/ui/telemetry/types";

function renderedPath(
  value:
    | {
        kind: "present";
        value: Vowel[];
      }
    | {
        kind: "missing";
        missing: string;
        note?: string;
      }
    | undefined,
): string | null {
  if (
    value?.kind !== "present" ||
    !Array.isArray(value.value) ||
    value.value.length === 0
  ) {
    return null;
  }

  return value.value.join(" → ");
}

function presentString(
  value:
    | PresentOrMissing<string>
    | undefined,
): string | null {
  if (
    value?.kind !== "present" ||
    typeof value.value !== "string"
  ) {
    return null;
  }

  const text =
    value.value.trim();

  return text || null;
}

function humanLanguage(
  value: string | null | undefined,
): string | null {
  const language =
    String(value ?? "")
      .trim();

  if (!language) return null;

  const known: Record<string, string> = {
    sq: "Albanian",
    en: "English",
    la: "Latin",
    latin: "Latin",
    albanian: "Albanian",
    english: "English",
  };

  return (
    known[language.toLowerCase()] ??
    language
  );
}

function usefulFunctionalCandidate(
  rows: CandidateRowVM[],
): CandidateRowVM | null {
  const functional =
    rows.filter((row) => {
      const claimType =
        presentString(
          row.claimType,
        );

      const embryo =
        presentString(
          row.embryo,
        );

      return (
        claimType ===
          "functionalMotivation" ||
        (
          claimType === null &&
          Boolean(embryo)
        )
      );
    });

  if (functional.length === 0) {
    return null;
  }

  const score = (
    row: CandidateRowVM,
  ): number => {
    const validation =
      presentString(
        row.validationOutcome,
      );

    if (validation === "validated") {
      return 3;
    }

    if (validation === "partial") {
      return 2;
    }

    return 1;
  };

  return (
    [...functional].sort(
      (a, b) =>
        score(b) - score(a) ||
        a.index - b.index,
    )[0] ?? null
  );
}

function evidenceStateFromCandidate(
  row: CandidateRowVM,
): "Reviewed" | "Partial" | "Proposed" {
  const validation =
    presentString(
      row.validationOutcome,
    );

  if (validation === "validated") {
    return "Reviewed";
  }

  if (validation === "partial") {
    return "Partial";
  }

  return "Proposed";
}

function NoSupportedFunctionalCandidate({
  word,
}: {
  word: string;
}) {
  return (
    <section
      data-testid="functional-motivation-card"
      className="rounded-xl border border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/40"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-300">
        Functional motivation
      </div>

      <div className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">
        No supported functional candidate yet.
      </div>

      {word ? (
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {`No supported functional-motivation result is currently available for "${word}".`}
        </div>
      ) : null}

      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Functional motivation, not historical etymology.
      </div>
    </section>
  );
}

export function EmbryoExpansionContextCardV0_1({
  vm,
}: {
  vm: TelemetryViewModel;
}) {
  const rootMap =
    vm.rootMap?.kind === "present"
      ? vm.rootMap.value
      : null;

  const status =
    vm.analysisStatusV0_1?.kind ===
    "present"
      ? vm.analysisStatusV0_1.value
      : null;

  const word =
    String(
      vm.readout.word ?? "",
    ).trim();

  const rootTokens =
    Array.isArray(
      rootMap?.tokens,
    )
      ? rootMap.tokens
          .map((item) =>
            String(item.token ?? "")
              .trim()
              .toUpperCase(),
          )
          .filter(Boolean)
      : [];

  const functionalPath =
    renderedPath(
      vm.readout.voicePathFunctional,
    );

  let tokens: string[] = [];
  let language =
    "Language not emitted";
  let evidenceStatus:
    | "Reviewed"
    | "Partial"
    | "Proposed" =
    "Proposed";

  let composedMeaning = "";

  const componentRows: Array<{
    token: string;
    gloss: string;
    state:
      | "reviewed"
      | "structural"
      | "partial"
      | "proposed";
  }> = [];

  if (rootTokens.length > 0) {
    tokens =
      rootTokens;

    const keys =
      Array.isArray(
        rootMap?.keys,
      )
        ? rootMap.keys
        : [];

    const keyByToken =
      new Map(
        keys.map((key) => [
          String(key.token ?? "")
            .trim()
            .toUpperCase(),
          key,
        ]),
      );

    const reviewed =
      new Set(
        (
          status?.reviewedOperators ??
          []
        ).map((token) =>
          String(token)
            .trim()
            .toUpperCase(),
        ),
      );

    const reviewedCount =
      tokens.filter((token) =>
        reviewed.has(token),
      ).length;

    evidenceStatus =
      reviewedCount ===
      tokens.length
        ? "Reviewed"
        : "Partial";

    const languages =
      Array.from(
        new Set(
          tokens
            .map((token) =>
              humanLanguage(
                keyByToken.get(token)
                  ?.language,
              ),
            )
            .filter(
              (
                value,
              ): value is string =>
                Boolean(value),
            ),
        ),
      );

    if (languages.length > 0) {
      language =
        languages.join(" + ");
    }

    composedMeaning =
      String(
        rootMap?.composedMeaning ??
          "",
      ).trim();

    for (const token of tokens) {
      const key =
        keyByToken.get(token);

      componentRows.push({
        token,
        gloss:
          String(
            key?.gloss ?? "",
          ).trim() ||
          "meaning not emitted",
        state:
          reviewed.has(token)
            ? "reviewed"
            : "structural",
      });
    }
  } else {
    const candidate =
      usefulFunctionalCandidate(
        Array.isArray(
          vm.candidates,
        )
          ? vm.candidates
          : [],
      );

    if (!candidate) {
      return (
        <NoSupportedFunctionalCandidate
          word={word}
        />
      );
    }

    const embryo =
      presentString(
        candidate.embryo,
      ) ??
      presentString(
        candidate.form,
      );

    if (!embryo) {
      return (
        <NoSupportedFunctionalCandidate
          word={word}
        />
      );
    }

    tokens = [
      embryo
        .trim()
        .toUpperCase(),
    ];

    language =
      humanLanguage(
        presentString(
          candidate.language,
        ),
      ) ??
      "Language not emitted";

    evidenceStatus =
      evidenceStateFromCandidate(
        candidate,
      );

    const gloss =
      presentString(
        candidate.plainStandaloneGloss,
      ) ??
      "meaning not emitted";

    composedMeaning =
      presentString(
        candidate.functionalStatement,
      ) ??
      gloss;

    componentRows.push({
      token: tokens[0],
      gloss,
      state:
        evidenceStatus === "Reviewed"
          ? "reviewed"
          : evidenceStatus === "Partial"
            ? "partial"
            : "proposed",
    });
  }

  const candidate =
    tokens.join(" + ");

  return (
    <section
      data-testid="functional-motivation-card"
      className="rounded-xl border border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-400/35 dark:bg-emerald-500/5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
            Functional motivation
          </div>

          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Language
          </div>

          <div className="mt-1 text-xl font-semibold text-slate-950 dark:text-slate-100">
            {language}
          </div>
        </div>

        <div className="shrink-0 rounded-full border border-amber-400/50 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
          {`Evidence: ${evidenceStatus}`}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
          Candidate
        </div>

        <div className="mt-1 font-mono text-2xl font-semibold text-slate-950 dark:text-white">
          {candidate}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {componentRows.map(
          ({
            token,
            gloss,
            state,
          }) => (
            <div
              key={token}
              className="rounded-lg border border-slate-300 bg-white/70 p-3 dark:border-slate-700 dark:bg-black/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-base font-semibold text-slate-950 dark:text-white">
                  {token}
                </div>

                <span
                  className={
                    state === "reviewed"
                      ? "rounded-full border border-emerald-400/50 bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
                      : "rounded-full border border-amber-400/50 bg-amber-100 px-2 py-0.5 text-[11px] text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"
                  }
                >
                  {`${token} · ${state}`}
                </span>
              </div>

              <div className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-200">
                {gloss}
              </div>
            </div>
          ),
        )}
      </div>

      <div className="mt-5 rounded-lg border border-blue-300 bg-blue-50 p-4 dark:border-blue-400/25 dark:bg-blue-500/5">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-200">
          {`How it can motivate "${word || "this word"}"`}
        </div>

        <div className="mt-2 text-base leading-7 text-slate-900 dark:text-slate-100">
          {composedMeaning ||
            "A functional explanation was not emitted."}
        </div>
      </div>

      {functionalPath ? (
        <div className="mt-4 font-mono text-sm text-slate-700 dark:text-slate-300">
          {`Functional path: ${functionalPath}`}
        </div>
      ) : null}

      <div className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
        Functional motivation, not historical etymology.
      </div>
    </section>
  );
}
