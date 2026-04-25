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
        </div>

        <BatteryIndexTableV0_1 />
      </div>
    </main>
  );
}
