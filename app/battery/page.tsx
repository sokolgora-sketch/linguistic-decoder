import Link from "next/link";
import BatteryIndexTableV0_1 from "@/ui/battery/BatteryIndexTable.v0.1";

export default function BatteryPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Battery registry
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            Read-only registry surface for battery cases, bracket assignments,
            paper-aligned status labels, and evidence-pack references.
          </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/evals"
                className="inline-flex items-center rounded-[8px] border border-[#355a7a] bg-[#101a24] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9fd3ff] transition hover:border-[#4d7fa8] hover:bg-[#132031] hover:text-[#d7eeff]"
              >
                ← Back to Evals workbench
              </Link>
            </div>
        </div>

        <BatteryIndexTableV0_1 />
      </div>
    </main>
  );
}
