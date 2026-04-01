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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#b8b8b8]">
              ZË-RO evals
            </div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-white">
              Paper snapshots reference
            </h1>
            <p className="max-w-[760px] text-[14px] leading-7 text-[#9a9a9a]">
              Reference-only paper battery snapshots moved out of the live evals
              workbench. This page is for published comparison context, not live
              scoring.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/evals"
              className="rounded-[10px] border border-[#3a3a3a] bg-[#161616] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#d8d8d8] transition hover:border-[#666] hover:text-white"
            >
              ← Back to evals
            </Link>
            <Link
              href="/"
              className="rounded-[10px] border border-[#3a3a3a] bg-[#161616] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#d8d8d8] transition hover:border-[#666] hover:text-white"
            >
              Home
            </Link>
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
