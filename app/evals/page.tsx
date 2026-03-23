import { EvalsPageClientV0_1 } from "@/ui/evals/EvalsPageClient.v0.1";

export const metadata = {
  title: "ZË-RO — Evals",
  description:
    "Deterministic scorer for evalRun and V1..V7 bucket JSON. Bring model outputs, score them, inspect the signal, and export the report.",
};

export default function Page() {
  return <EvalsPageClientV0_1 />;
}
