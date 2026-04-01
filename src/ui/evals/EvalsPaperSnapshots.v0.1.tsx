export type PaperSnapshotTabV0_1 = "paper1" | "paper2";

export const EVALS_PAPER_SNAPSHOTS_V0_1 = [
  {
    id: "paper1",
    tabLabel: "FRESH-CHAT",
    tabDetail: "12 independent sessions per provider",
    title: "Fresh-chat · n=12 runs each",
    summary: "Source: LingBuzz/009799",
    badges: ["fresh-chat", "paper v0.1", "snapshot"],
    providers: [
      {
        provider: "OpenAI",
        model: "chatgpt-5-2-thinking",
        bestDisplay: "−0.871",
        bestMagnitude: 0.871,
        meanDisplay: "−0.775",
      },
      {
        provider: "DeepSeek",
        model: "deepseek-thinking",
        bestDisplay: "−0.808",
        bestMagnitude: 0.808,
        meanDisplay: "−0.362",
      },
      {
        provider: "xAI",
        model: "grok-expert",
        bestDisplay: "−0.759",
        bestMagnitude: 0.759,
        meanDisplay: "−0.225",
      },
      {
        provider: "Google",
        model: "gemini-3-thinking",
        bestDisplay: "−0.706",
        bestMagnitude: 0.706,
        meanDisplay: "−0.238",
      },
      {
        provider: "Anthropic",
        model: "claude-4.6-sonnet-extended",
        bestDisplay: "−0.393",
        bestMagnitude: 0.393,
        meanDisplay: "−0.096",
      },
    ],
  },
  {
    id: "paper2",
    tabLabel: "SAME-THREAD",
    tabDetail: "10 sequential turns per provider",
    title: "Same-thread · n=10 runs each",
    summary: "Source: LingBuzz/009808",
    badges: ["same-thread", "paper v0.1", "snapshot"],
    providers: [
      {
        provider: "xAI",
        model: "grok-expert",
        bestDisplay: "−0.917",
        bestMagnitude: 0.917,
        meanDisplay: "−0.559",
        regimeLabel: "stabilization/re-lock",
        regimeTone: "good",
      },
      {
        provider: "OpenAI",
        model: "chatgpt-5-2-thinking",
        bestDisplay: "−0.758",
        bestMagnitude: 0.758,
        meanDisplay: "−0.391",
        regimeLabel: "oscillatory recovery",
        regimeTone: "mid",
      },
      {
        provider: "DeepSeek",
        model: "deepseek-thinking",
        bestDisplay: "−0.527",
        bestMagnitude: 0.527,
        meanDisplay: "−0.059",
        regimeLabel: "recovery w/o retention",
        regimeTone: "mid",
      },
      {
        provider: "Anthropic",
        model: "claude-4.6-sonnet-extended",
        bestDisplay: "−0.310",
        bestMagnitude: 0.31,
        meanDisplay: "−0.019",
        regimeLabel: "weak mixed",
        regimeTone: "weak",
      },
      {
        provider: "Google",
        model: "gemini-3-thinking",
        bestDisplay: "−0.479",
        bestMagnitude: 0.479,
        meanDisplay: "+0.485",
        regimeLabel: "⚠ inversion/lock",
        regimeTone: "inverted",
      },
    ],
    emphasisNote:
      "Google is the only provider where mean r went positive (+0.485) under same-thread feedback — the only direction inversion in the battery.",
  },
] as const;

type PaperSnapshotProviderV0_1 = {
  provider: string;
  model: string;
  bestDisplay: string;
  bestMagnitude: number;
  meanDisplay: string;
  regimeLabel?: string;
  regimeTone?: "good" | "mid" | "weak" | "inverted";
};

export function EvalsPaperSnapshotsSectionV0_1({
  paperSnapshotTab,
  setPaperSnapshotTab,
}: {
  paperSnapshotTab: PaperSnapshotTabV0_1;
  setPaperSnapshotTab: (value: PaperSnapshotTabV0_1) => void;
}) {
  const activePaper =
    EVALS_PAPER_SNAPSHOTS_V0_1.find((p) => p.id === paperSnapshotTab) ??
    EVALS_PAPER_SNAPSHOTS_V0_1[0];

  const activeProviders = activePaper.providers as ReadonlyArray<PaperSnapshotProviderV0_1>;

  const sourceHref =
    activePaper.id === "paper1"
      ? "https://ling.auf.net/lingbuzz/009799"
      : "https://ling.auf.net/lingbuzz/009808";

  const sourceLabel =
    activePaper.id === "paper1"
      ? "Source: LingBuzz/009799"
      : "Source: LingBuzz/009808";

  const activeRefClass = "border-[#5a2424] bg-[#1f1010] text-[#fca5a5]";

  function parseSignedDisplay(value: string) {
    const n = Number(value.replace(/−/g, "-").trim());
    return Number.isFinite(n) ? n : 0;
  }

  function magnitudeBarClass(magnitude: number) {
    if (magnitude >= 0.8) return "bg-[#d93333]";
    if (magnitude >= 0.6) return "bg-[#e0622a]";
    if (magnitude >= 0.4) return "bg-[#d49b17]";
    return "bg-[#737373]";
  }

  function regimeToneClass(tone?: "good" | "mid" | "weak" | "inverted") {
    if (tone === "good") return "border-[#21452a] bg-[#112017] text-[#4ade80]";
    if (tone === "mid") return "border-[#5b4a20] bg-[#1d1a12] text-[#f3d38b]";
    if (tone === "inverted")
      return "border-[#6a2e2e] bg-[#261515] text-[#ffb4b4]";
    return "border-[#3f3f3f] bg-[#161616] text-[#c4c4c4]";
  }

  return (
    <details className="group mt-8 overflow-hidden rounded-[12px] border border-[#333] bg-[#141414]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-[#161616] px-5 py-4 text-left transition hover:bg-[#1a1a1a] [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#dcdcdc]">
            Paper snapshots
          </div>
          <div className="mt-1 text-[16px] font-semibold text-white">
            Paper v0.1 snapshot · reference only
          </div>
          <div className="mt-1 text-[12px] leading-6 text-[#9a9a9a]">
            Fresh-chat and same-thread battery results from LingBuzz/009799 and
            009808.
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9a9a9a]">
            <span className="text-[#d6d6d6]">2 reference batteries</span>
            <span className="h-1 w-1 rounded-full bg-[#4a4a4a]" />
            <span>paper v0.1</span>
            <span className="h-1 w-1 rounded-full bg-[#4a4a4a]" />
            <span>not live data</span>
          </div>
        </div>

        <div className="shrink-0 text-[12px] text-[#8f8f8f] transition group-hover:text-white group-open:rotate-180">
          ▼
        </div>
      </summary>

      <div className="space-y-5 border-t border-[#2b2b2b] px-5 py-5">
        <div className="grid gap-3 md:grid-cols-2">
          {EVALS_PAPER_SNAPSHOTS_V0_1.map((paper) => {
            const active = paper.id === paperSnapshotTab;

            return (
              <button
                key={paper.id}
                type="button"
                className={
                  active
                    ? `rounded-[10px] border px-4 py-4 text-left transition ${activeRefClass}`
                    : "rounded-[10px] border border-[#3a3a3a] bg-[#101010] px-4 py-4 text-left text-[#b8b8b8] transition hover:border-[#666] hover:text-white"
                }
                onClick={(e) => {
                  e.preventDefault();
                  setPaperSnapshotTab(paper.id as PaperSnapshotTabV0_1);
                }}
              >
                <div className="text-[12px] font-semibold uppercase tracking-[0.1em]">
                  {paper.tabLabel}
                </div>
                <div
                  className={`mt-2 text-[12px] leading-6 ${active ? "opacity-90" : "text-[#8f8f8f]"}`}
                >
                  {paper.tabDetail}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-[12px] border border-[#2f2f2f] bg-[#101010] px-5 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[14px] font-semibold text-white">
                {activePaper.title}
              </div>
              <div className="text-[12px] leading-6 text-[#9a9a9a]">
                {activePaper.tabDetail}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${activeRefClass}`}
              >
                {activePaper.tabLabel}
              </span>
              <a
                href={sourceHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#3a3a3a] bg-[#141414] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#d8d8d8] transition hover:border-[#666] hover:text-white"
              >
                {sourceLabel}
              </a>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {activeProviders.map((row) => {
              const meanValue = parseSignedDisplay(row.meanDisplay);
              const meanMagnitude = Math.abs(meanValue);

              const bestBarClass = magnitudeBarClass(row.bestMagnitude);
              const meanBarClass =
                meanValue > 0
                  ? "bg-[#ef4444]"
                  : magnitudeBarClass(meanMagnitude);

              const meanToneClass =
                meanValue > 0 ? "text-[#fca5a5]" : "text-[#d7d7d7]";

              return (
                <div
                  key={`${row.provider}-${row.model}`}
                  className="rounded-[10px] border border-[#262626] bg-[#121212] px-4 py-4 transition hover:border-[#3a3a3a] hover:bg-[#151515]"
                >
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.95fr)]">
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-white">
                        {row.provider}
                      </div>
                      <div className="mt-1 text-[12px] leading-6 text-[#cfcfcf]">
                        {row.model}
                      </div>

                      <div className="mt-3">
                        {typeof row.regimeLabel === "string" &&
                        row.regimeLabel.length > 0 ? (
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${regimeToneClass(row.regimeTone)}`}
                          >
                            {row.regimeLabel}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6f6f6f]">
                            independent fresh-chat runs
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-[8px] border border-[#242424] bg-[#0f0f0f] px-3 py-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">
                          Best <span className="normal-case">ρ</span>
                        </div>
                        <div className="mt-2 font-mono text-[18px] text-white">
                          {row.bestDisplay}
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1a1a1a]">
                          <div
                            className={`h-full rounded-full ${bestBarClass}`}
                            style={{
                              width: `${Math.max(10, Math.round(row.bestMagnitude * 100))}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="rounded-[8px] border border-[#242424] bg-[#0f0f0f] px-3 py-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8f8f8f]">
                          Mean <span className="normal-case">ρ</span>
                        </div>
                        <div
                          className={`mt-2 font-mono text-[18px] ${meanToneClass}`}
                        >
                          {row.meanDisplay}
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1a1a1a]">
                          <div
                            className={`h-full rounded-full ${meanBarClass}`}
                            style={{
                              width: `${Math.max(10, Math.round(meanMagnitude * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {"emphasisNote" in activePaper &&
          typeof activePaper.emphasisNote === "string" ? (
            <div className="mt-4 rounded-[10px] border border-[#5a2424] bg-[#1b1111] px-4 py-4 text-[12px] leading-6 text-[#e1b4b4]">
              {activePaper.emphasisNote}
            </div>
          ) : null}
        </div>
      </div>
    </details>
  );
}
