// src/components/PatternAtlasCard.tsx

import React from "react";
import {
  runSevenVoicesStressTestV1,
  type SevenVoicesStressTestV1,
} from "@/shared/sevenVoicesStressTest.v1";

export default function PatternAtlasCard({
  voicePath,
  stress_test_v1,
}: {
  voicePath: string;
  stress_test_v1?: SevenVoicesStressTestV1 | null;
}) {
  // Back-compat: if caller didn’t pass stress_test_v1, derive it deterministically from voicePath.
  const derived: SevenVoicesStressTestV1 | null =
    voicePath && voicePath.trim().length > 0
      ? runSevenVoicesStressTestV1({ word: "", voicePathRaw: voicePath })
      : null;

  const st: SevenVoicesStressTestV1 | null = stress_test_v1 ?? derived;

  const polarity = st?.classification?.polarity ?? "unknown";
  const classificationIsNull = !!st && st.classification === null;

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
            <div className="text-xs opacity-80">{polarity}</div>
          </div>

          {classificationIsNull ? (
            <div className="mt-2 text-xs opacity-80">incomplete stress test</div>
          ) : null}

          <div className="mt-2 text-sm opacity-80">{st.ui.summary}</div>
        </div>
      ) : null}
    </div>
  );
}
