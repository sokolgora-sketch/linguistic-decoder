import { HeroV0_1 } from "@/components/landing/Hero.v0.1";
import { StatsCardsV0_1 } from "@/components/landing/StatsCards.v0.1";
import { HowItWorksV0_1 } from "@/components/landing/HowItWorks.v0.1";
import { ScientificFoundationV0_1 } from "@/components/landing/ScientificFoundation.v0.1";
import { FAQV0_1 } from "@/components/landing/FAQ.v0.1";

export function LandingPageV0_1() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 space-y-10">
      <HeroV0_1 />
      <StatsCardsV0_1 />
      <HowItWorksV0_1 />
      <ScientificFoundationV0_1 />
      <FAQV0_1 />
      <footer className="pt-6 text-xs text-neutral-500">
        ZË-RO — calibration-grade linguistic decoder. Deterministic scoring. Baseline-locked research harnesses.
      </footer>
    </main>
  );
}
