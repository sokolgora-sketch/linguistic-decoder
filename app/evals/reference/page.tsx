"use client";

import Link from "next/link";
import { useState } from "react";
import {
  EvalsPaperSnapshotsSectionV0_1,
  type PaperSnapshotTabV0_1,
} from "@/ui/evals/EvalsPaperSnapshots.v0.1";

export default function EvalsReferencePage() {
  const [paperSnapshotTab, setPaperSnapshotTab] =
    useState<PaperSnapshotTabV0_1>("paper1");

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 md:px-10">
        <div className="mb-6 rounded-[14px] border border-[#2f3742] bg-[#13171d] px-5 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#d7dde7]">
                evals · reference
              </div>
              <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-white">
                Paper snapshots reference
              </h1>
              <p className="max-w-[760px] text-[14px] leading-7 text-[#bac3d2]">
                Published comparison context only. This page is not live scoring
                and does not show the run you just scored in the workbench.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/evals"
                className="rounded-[10px] border border-[#355a7a] bg-[#101a24] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9fd3ff] transition hover:border-[#4d7fa8] hover:bg-[#132031] hover:text-[#d7eeff]"
              >
                ← Back to evals
              </Link>
              <Link
                href="/evals/help"
                className="rounded-[10px] border border-[#5a4b22] bg-[#1f1a10] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#f3d38b] transition hover:border-[#8a7636] hover:bg-[#2a2418] hover:text-[#fff1c2]"
              >
                Help
              </Link>
              <Link
                href="/"
                className="rounded-[10px] border border-[#3a3a3a] bg-[#161616] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#d8d8d8] transition hover:border-[#666] hover:text-white"
              >
                Home
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[12px] border border-[#5a2424] bg-[#1f1010] px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ffd0d0]">
                Reference only
              </div>
              <div className="mt-1 text-[13px] leading-6 text-[#e7c5c5]">
                These are published paper snapshots, not the current run in your
                live workbench.
              </div>
            </div>

            <div className="rounded-[12px] border border-[#5a4b22] bg-[#1b160d] px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#fff1c2]">
                Not live scoring
              </div>
              <div className="mt-1 text-[13px] leading-6 text-[#d9cba5]">
                Use <span className="font-mono text-[#fff1c2]">/evals</span> to
                paste, score, inspect, and export live runs.
              </div>
            </div>

            <div className="rounded-[12px] border border-[#2f3742] bg-[#171c23] px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d7deea]">
                Why this page exists
              </div>
              <div className="mt-1 text-[13px] leading-6 text-[#bac3d2]">
                It keeps paper context nearby while protecting the live workbench
                from reference clutter.
              </div>
            </div>
          </div>
        </div>

        <EvalsPaperSnapshotsSectionV0_1
          paperSnapshotTab={paperSnapshotTab}
          setPaperSnapshotTab={setPaperSnapshotTab}
        />
      </div>
    </main>
  );
}
