import { LandingPageV0_2 } from "@/components/landing/LandingPage.v0.2";

export const metadata = {
  title: "ZË-RO — Deterministic Vowel-Aperture Grounding Probe",
  description:
    "A deterministic, baseline-locked instrument to test whether an LLM encodes vowel-aperture ↔ semantic ordering. Paste outputs, score, export PDF.",
};

export default function Page() {
  return <LandingPageV0_2 />;
}
