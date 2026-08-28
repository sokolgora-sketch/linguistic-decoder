import React from "react";

import type {
  CandidateRowVM,
  FunctionalCandidateComponentVM,
  PresentOrMissing,
  TelemetryViewModel,
  Vowel,
} from "@/ui/telemetry/types";

import {
  SEVEN_PRINCIPLES,
  VOWELS_7,
} from "@/shared/sevenPrinciples.v1";

import {
  PRINCIPLES_V0_1,
} from "@/v1/principles.vocab.v0.1";

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

type SevenVoiceDisplayItemV0_1 = {
  vowel: Vowel;
  index1: number;
  principle: string;
  color: string;
  note: string;
};

function titleCaseCanonValueV0_1(
  value: unknown,
): string {
  const text =
    String(value ?? "")
      .trim()
      .toLocaleLowerCase("en-US");

  if (!text) return "";

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
}

function buildSevenVoiceDisplayItemV0_1(
  vowel: Vowel,
): SevenVoiceDisplayItemV0_1 | null {
  const traits =
    SEVEN_PRINCIPLES[
      vowel as keyof typeof SEVEN_PRINCIPLES
    ];

  const vocabulary =
    PRINCIPLES_V0_1.find(
      (entry) =>
        entry.vowel === vowel,
    );

  if (
    !traits ||
    !vocabulary
  ) {
    return null;
  }

  return {
    vowel,
    index1: traits.index1,
    principle: vocabulary.label,
    color:
      titleCaseCanonValueV0_1(
        traits.color,
      ),
    note: traits.note,
  };
}

function functionalSevenVoiceItemsV0_1(
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
): SevenVoiceDisplayItemV0_1[] {
  if (
    value?.kind !== "present" ||
    !Array.isArray(value.value) ||
    value.value.length === 0
  ) {
    return [];
  }

  const items =
    value.value.map(
      (vowel) =>
        buildSevenVoiceDisplayItemV0_1(
          vowel,
        ),
    );

  if (
    items.some(
      (item) => item === null,
    )
  ) {
    return [];
  }

  return items as
    SevenVoiceDisplayItemV0_1[];
}

function fullSevenVoiceKeyV0_1():
  SevenVoiceDisplayItemV0_1[] {
  return VOWELS_7
    .map(
      (vowel) =>
        buildSevenVoiceDisplayItemV0_1(
          vowel as Vowel,
        ),
    )
    .filter(
      (
        item,
      ): item is SevenVoiceDisplayItemV0_1 =>
        item !== null,
    );
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

function presentFunctionalComponents(
  row: CandidateRowVM,
): FunctionalCandidateComponentVM[] {
  if (
    row.functionalComponents?.kind !==
      "present" ||
    !Array.isArray(
      row.functionalComponents.value,
    )
  ) {
    return [];
  }

  return row.functionalComponents.value;
}

function candidateTokens(
  row: CandidateRowVM,
): string[] {
  const components =
    presentFunctionalComponents(row);

  if (components.length > 0) {
    return components
      .map((component) =>
        String(
          component.embryo ?? "",
        )
          .trim()
          .toUpperCase(),
      )
      .filter(Boolean);
  }

  const embryo =
    presentString(row.embryo);

  if (embryo) {
    return [
      embryo
        .trim()
        .toUpperCase(),
    ];
  }

  const form =
    presentString(row.form);

  if (!form) {
    return [];
  }

  const parts =
    form
      .split(/\s*\+\s*/u)
      .map((part) =>
        part.trim().toUpperCase(),
      )
      .filter(Boolean);

  return parts.length > 0
    ? parts
    : [];
}

function isFunctionalCandidate(
  row: CandidateRowVM,
): boolean {
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
}

function isCompositionCandidate(
  row: CandidateRowVM,
): boolean {
  const sourceKind =
    presentString(
      row.sourceKind,
    );

  if (
    sourceKind ===
      "rootmap_functional_composition"
  ) {
    return true;
  }

  return (
    candidateTokens(row).length > 1
  );
}

function validationScore(
  row: CandidateRowVM,
): number {
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
}

function usefulFunctionalCandidate(
  rows: CandidateRowVM[],
): CandidateRowVM | null {
  const functional =
    rows.filter(
      isFunctionalCandidate,
    );

  if (functional.length === 0) {
    return null;
  }

  const supported =
    functional.filter(
      (row) => {
        const validation =
          presentString(
            row.validationOutcome,
          );

        return (
          validation ===
            "validated" ||
          validation ===
            "partial"
        );
      },
    );

  if (supported.length > 0) {
    return (
      [...supported].sort(
        (a, b) => {
          // Embryo-first canonical rule:
          //
          // 1. stronger evidence first;
          // 2. then the smallest functional embryo/component set;
          // 3. then the smallest textual embryo;
          // 4. preserve emitted order as the final tie-breaker.
          //
          // A larger partial composition must never displace a
          // smaller validated functional embryo merely because it
          // contains multiple components.
          const validationDelta =
            validationScore(b) -
            validationScore(a);

          if (
            validationDelta !== 0
          ) {
            return validationDelta;
          }

          const aTokens =
            candidateTokens(a);

          const bTokens =
            candidateTokens(b);

          const tokenDelta =
            aTokens.length -
            bTokens.length;

          if (
            tokenDelta !== 0
          ) {
            return tokenDelta;
          }

          const sizeDelta =
            aTokens
              .join("")
              .length -
            bTokens
              .join("")
              .length;

          return (
            sizeDelta ||
            a.index - b.index
          );
        },
      )[0] ?? null
    );
  }

  // Slice E:
  // Proposed candidates are used only when no Reviewed/Partial
  // functional result exists. The verifier already orders them
  // from the smallest accepted embryo set to larger expansions,
  // so preserve that order instead of composition-first ranking.
  return (
    [...functional].sort(
      (a, b) => {
        const aTokens =
          candidateTokens(a);

        const bTokens =
          candidateTokens(b);

        const tokenDelta =
          aTokens.length -
          bTokens.length;

        if (tokenDelta !== 0) {
          return tokenDelta;
        }

        const sizeDelta =
          aTokens
            .join("")
            .length -
          bTokens
            .join("")
            .length;

        return (
          sizeDelta ||
          a.index -
            b.index
        );
      },
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

  const rows =
    Array.isArray(
      vm.candidates,
    )
      ? vm.candidates
      : [];

  const primaryCandidate =
    usefulFunctionalCandidate(
      rows,
    );

  if (!primaryCandidate) {
    return (
      <NoSupportedFunctionalCandidate
        word={word}
      />
    );
  }

  const rootTokens =
    Array.isArray(
      rootMap?.tokens,
    )
      ? rootMap.tokens
          .map((item) =>
            String(
              item.token ?? "",
            )
              .trim()
              .toUpperCase(),
          )
          .filter(Boolean)
      : [];

  const keys =
    Array.isArray(
      rootMap?.keys,
    )
      ? rootMap.keys
      : [];

  const keyByToken =
    new Map(
      keys.map((key) => [
        String(
          key.token ?? "",
        )
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

  const primaryValidation =
    presentString(
      primaryCandidate
        .validationOutcome,
    );

  const isResearchFunctionalCandidate =
    presentString(
      primaryCandidate
        .sourceKind,
    ) ===
      "multi_source_research_witness" &&
    presentString(
      primaryCandidate
        .claimType,
    ) ===
      "functionalMotivation" &&
    presentString(
      primaryCandidate
        .claimBoundary,
    ) ===
      "research_functional_hypothesis_only";

  const useLegacyRootMapComposition =
    !isCompositionCandidate(
      primaryCandidate,
    ) &&
    primaryValidation ===
      "validated" &&
    !presentString(
      primaryCandidate
        .functionalStatement,
    ) &&
    rootTokens.length > 1 &&
    rootTokens.some((token) =>
      reviewed.has(token),
    ) &&
    Boolean(
      String(
        rootMap?.composedMeaning ??
          "",
      ).trim(),
    );


  const legacyCompositionVowelPath:
    PresentOrMissing<Vowel[]> | undefined =
    useLegacyRootMapComposition
      ? (() => {
          if (
            !Array.isArray(
              rootMap?.tokens,
            ) ||
            rootMap.tokens.length === 0
          ) {
            return undefined;
          }

          const voices: Vowel[] = [];

          for (
            const token of
              rootMap.tokens
          ) {
            const rawPath =
              String(
                token?.vowel_path ??
                  "",
              )
                .normalize("NFC")
                .trim()
                .toUpperCase();

            if (!rawPath) {
              return undefined;
            }

            const parts =
              rawPath.includes("→")
                ? rawPath.split("→")
                : rawPath.includes("-")
                  ? rawPath.split("-")
                  : rawPath.split("");

            for (
              const rawPart of parts
            ) {
              const part =
                rawPart.trim();

              if (
                !part ||
                !(
                  VOWELS_7 as
                    readonly string[]
                ).includes(part)
              ) {
                return undefined;
              }

              voices.push(
                part as Vowel,
              );
            }
          }

          return voices.length > 0
            ? {
                kind: "present",
                value: voices,
              }
            : undefined;
        })()
      : undefined;

  // The active alignment is owned by the candidate actually
  // displayed in this card:
  //
  // - first-class candidate: its own candidate vowelPath
  // - legacy RootMap composition: its own token vowel_path sequence
  //
  // Never borrow vm.readout.voicePathFunctional merely because the
  // wider run has a functional path.
  const displayedCandidateVowelPath =
    useLegacyRootMapComposition
      ? legacyCompositionVowelPath
      : primaryCandidate
          .vowelPath;

  const functionalPath =
    renderedPath(
      displayedCandidateVowelPath,
    );

  const functionalSevenVoices =
    functionalSevenVoiceItemsV0_1(
      displayedCandidateVowelPath,
    );

  const functionalPrinciplePath =
    functionalSevenVoices
      .map(
        (item) =>
          `${item.vowel} (${item.index1}) — ${item.principle}`,
      )
      .join(" → ");

  const functionalColorPath =
    functionalSevenVoices
      .map(
        (item) => item.color,
      )
      .join(" → ");

  const functionalNotePath =
    functionalSevenVoices
      .map(
        (item) => item.note,
      )
      .join(" → ");

  const sevenVoiceKey =
    fullSevenVoiceKeyV0_1();

  let tokens: string[] = [];
  let language =
    "Language not emitted";
  let evidenceStatus:
    | "Reviewed"
    | "Partial"
    | "Proposed" =
    "Proposed";

  let composedMeaning = "";
  let candidateExpression = "";

  const componentRows: Array<{
    token: string;
    gloss: string;
    state:
      | "reviewed"
      | "structural"
      | "partial"
      | "research"
      | "proposed";
  }> = [];

  if (
    useLegacyRootMapComposition
  ) {
    tokens = rootTokens;

    candidateExpression =
      rootTokens.join(" + ");

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
                keyByToken.get(
                  token,
                )?.language,
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

    if (
      languages.length > 0
    ) {
      language =
        languages.join(" + ");
    }

    composedMeaning =
      String(
        rootMap
          ?.composedMeaning ??
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
    tokens =
      candidateTokens(
        primaryCandidate,
      );

    if (tokens.length === 0) {
      return (
        <NoSupportedFunctionalCandidate
          word={word}
        />
      );
    }

    const emittedEmbryo =
      presentString(
        primaryCandidate.embryo,
      );

    // Preserve the embryo-first display contract for one-embryo
    // candidates: DI / DA / AT should lead rather than a carrier
    // or lexical form such as lowercase "di".
    candidateExpression =
      tokens.length === 1 &&
      emittedEmbryo
        ? tokens[0]
        : presentString(
            primaryCandidate.form,
          ) ??
          tokens.join(" + ");

    evidenceStatus =
      evidenceStateFromCandidate(
        primaryCandidate,
      );

    const components =
      presentFunctionalComponents(
        primaryCandidate,
      );

    const componentByToken =
      new Map(
        components.map(
          (component) => [
            String(
              component.embryo ??
                "",
            )
              .trim()
              .toUpperCase(),
            component,
          ],
        ),
      );

    const candidateLanguage =
      humanLanguage(
        presentString(
          primaryCandidate.language,
        ),
      );

    const componentLanguages =
      Array.from(
        new Set(
          tokens
            .map((token) => {
              const component =
                componentByToken.get(
                  token,
                );

              return humanLanguage(
                presentString(
                  component?.language,
                ),
              );
            })
            .filter(
              (
                value,
              ): value is string =>
                Boolean(value),
            ),
        ),
      );

    const rootLanguages =
      Array.from(
        new Set(
          tokens
            .map((token) =>
              humanLanguage(
                keyByToken.get(
                  token,
                )?.language,
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

    if (candidateLanguage) {
      language =
        candidateLanguage;
    } else if (
      componentLanguages.length > 0
    ) {
      language =
        componentLanguages.join(
          " + ",
        );
    } else if (
      rootLanguages.length > 0
    ) {
      language =
        rootLanguages.join(" + ");
    }

    const standaloneGloss =
      presentString(
        primaryCandidate
          .plainStandaloneGloss,
      );

    composedMeaning =
      (
        isResearchFunctionalCandidate
          ? presentString(
              primaryCandidate
                .semanticBridge,
            )
          : null
      ) ??
      presentString(
        primaryCandidate
          .functionalStatement,
      ) ??
      (
        tokens.length === 1
          ? standaloneGloss
          : null
      ) ??
      "";

    const fallbackState:
      | "reviewed"
      | "partial"
      | "research"
      | "proposed" =
      isResearchFunctionalCandidate
        ? "research"
        : evidenceStatus ===
            "Reviewed"
          ? "reviewed"
          : evidenceStatus ===
              "Partial"
            ? "partial"
            : "proposed";

    for (const token of tokens) {
      const component =
        componentByToken.get(
          token,
        );

      const key =
        keyByToken.get(token);

      const emittedState =
        presentString(
          component
            ?.evidenceState,
        )?.toLowerCase();

      const state:
        | "reviewed"
        | "structural"
        | "partial"
        | "research"
        | "proposed" =
        emittedState ===
          "reviewed" ||
        emittedState ===
          "structural" ||
        emittedState ===
          "partial" ||
        emittedState ===
          "research" ||
        emittedState ===
          "proposed"
          ? emittedState
          : key
              ? reviewed.has(
                  token,
                )
                ? "reviewed"
                : "structural"
              : fallbackState;

      componentRows.push({
        token,
        gloss:
          presentString(
            component
              ?.plainMeaning,
          ) ??
          (
            tokens.length === 1
              ? standaloneGloss
              : null
          ) ??
          (
            String(
              key?.gloss ?? "",
            ).trim() ||
            "meaning not emitted"
          ),
        state,
      });
    }
  }

  const candidate =
    candidateExpression ||
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
          {isResearchFunctionalCandidate
            ? "Research hypothesis"
            : `Evidence: ${evidenceStatus}`}
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

      {sevenVoiceKey.length > 0 ? (
        <div
          data-testid="functional-seven-voice-model"
          className="mt-3 rounded-lg border border-violet-300 bg-violet-50 p-4 dark:border-violet-400/25 dark:bg-violet-500/5"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-200">
            ZË-RO Seven-Voice model
          </div>

          {functionalSevenVoices.length > 0 ? (
            <div
              data-testid="functional-seven-voice-alignment"
              className="mt-3"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">
                Active candidate alignment
              </div>

          <div
            data-testid="functional-principle-path"
            className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100"
          >
            {`Principles: ${functionalPrinciplePath}`}
          </div>

          <div
            data-testid="functional-color-path"
            className="mt-1 text-sm text-slate-800 dark:text-slate-200"
          >
            {`Colors: ${functionalColorPath}`}
          </div>

          <div
            data-testid="functional-note-path"
            className="mt-1 text-sm text-slate-800 dark:text-slate-200"
          >
            {`Musical notes: ${functionalNotePath}`}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {functionalSevenVoices.map(
              (item) => (
                <div
                  key={`active-${item.vowel}`}
                  className="flex items-center gap-2 rounded-md border border-slate-300 bg-white/80 px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-black/20 dark:text-slate-200"
                >
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full border border-black/15"
                    style={{
                      backgroundColor:
                        item.color.toLowerCase(),
                    }}
                  />

                  <span className="font-mono font-semibold">
                    {`${item.vowel} (${item.index1})`}
                  </span>

                  <span>
                    {item.principle}
                  </span>

                  <span>
                    {item.color}
                  </span>

                  <span>
                    {`Note ${item.note}`}
                  </span>
                </div>
              ),
            )}
          </div>

            </div>
          ) : null}

          <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-400">
            Full seven-key
          </div>

          <div
            data-testid="seven-voice-key"
            className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7"
          >
            {sevenVoiceKey.map(
              (item) => (
                <div
                  key={`key-${item.vowel}`}
                  className="rounded-md border border-slate-300 bg-white/80 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-black/20 dark:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full border border-black/15"
                      style={{
                        backgroundColor:
                          item.color.toLowerCase(),
                      }}
                    />

                    <span className="font-mono font-semibold">
                      {`${item.vowel} (${item.index1})`}
                    </span>
                  </div>

                  <div className="mt-1 font-medium">
                    {item.principle}
                  </div>

                  <div className="mt-0.5">
                    {item.color}
                  </div>

                  <div className="mt-0.5">
                    {`Note ${item.note}`}
                  </div>
                </div>
              ),
            )}
          </div>

          <div className="mt-3 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
            Canonical ZË-RO model mapping. These principle, color, and musical-note correspondences are functional model metadata, not a historical-origin or external scientific-proof claim.
          </div>
        </div>
      ) : null}

      <div className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
        Functional motivation, not historical etymology.
      </div>
    </section>
  );
}
