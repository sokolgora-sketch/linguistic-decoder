// src/components/PatternAtlasCard.tsx

import React from "react";
import { runSevenVoicesStressTestV1 } from "@/shared/sevenVoicesStressTest.v1";

type StressTestUI = {
  label: string;
  summary: string;
  voicePath: string;
};

type StressTestV1 = {
  ui: StressTestUI;
  classification: {
    polarity: "centrifugal" | "centripetal" | "orbital";
  } | null;
} | null;

export default function PatternAtlasCard({
  voicePath,
  stress_test_v1,
}: {
  voicePath: string;
  stress_test_v1?: StressTestV1;
}) {
  // Back-compat: if caller didn’t pass stress_test_v1, derive it deterministically from voicePath.
  const derived: StressTestV1 =
    voicePath && voicePath.trim().length > 0
      ? (runSevenVoicesStressTestV1({ word: "", voicePathRaw: voicePath }) as any)
      : null;

  const st = (stress_test_v1 ?? derived) as StressTestV1;

  const polarity: "centrifugal" | "centripetal" | "orbital" | "unknown" =
    st?.classification?.polarity ?? "unknown";

  const isUnknown = polarity === "unknown";

  return (
    <div className="rounded-xl border p-4">
      {/* Keep exact title string for existing tests + UX consistency */}
      <div className="text-sm font-semibold">Pattern Atlas (v1)</div>

      <div className="mt-2 text-sm">
        <div className="opacity-70">Voice path</div>
        <div className="font-mono">{voicePath}</div>
      </div>

      {st ? (
        <div className="mt-4 rounded-lg bg-muted/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">{st.ui.label}</div>

            <div className="flex items-center gap-2">
              <div className="text-xs opacity-80">{polarity}</div>
              {isUnknown ? (
                <div className="text-[11px] rounded-md border px-2 py-0.5 opacity-80">
                  incomplete stress test
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-2 text-sm opacity-80">{st.ui.summary}</div>
        </div>
      ) : null}
    </div>
  );
}
