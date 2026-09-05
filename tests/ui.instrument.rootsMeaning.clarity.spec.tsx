import React from "react";
import { render, screen } from "@testing-library/react";
import MeaningPanel from "@/ui/instrument/MeaningPanel";
import { RootMapCard } from "@/ui/instrument/RootMapCard";
import { SoundRootsCard } from "@/ui/instrument/SoundRootsCard";

function present<T>(value: T) {
  return { kind: "present", value } as const;
}

describe("Open Instrument roots/meaning clarity", () => {
  it("frames MeaningPanel as deterministic inspection, not proof", () => {
    render(
      <MeaningPanel
        vm={{
          detection: { principles: "Unity → Insight", delta: "DIVERGE", voicePathFunctional: "U-I" },
          counts: { candidates: 2 },
          evidence: {
            normalizationSteps: present(["trim"]),
            ops: present([]),
            signals: present(["vowel-path"]),
            notes: present(["vm-only"]),
          },
        }}
      />
    );

    expect(screen.getByText("Meaning")).toBeInTheDocument();
    expect(screen.getByText(/Human-readable deterministic reading/i)).toBeInTheDocument();
    expect(screen.getByText("Deterministic reading")).toBeInTheDocument();
    expect(screen.getByText("Inspection evidence posture")).toBeInTheDocument();
    expect(screen.getByText(/Boundary: deterministic reading/i)).toBeInTheDocument();
    expect(screen.getByText(/not a historical-chain claim/i)).toBeInTheDocument();
  });

  it("makes RootMapCard readable while keeping the hypothesis boundary explicit", () => {
    render(
      <RootMapCard
        word="study"
        normalizedWord="study"
        rootMap={present({
          tokens: [
            { token: "SHTU", role: "action", vowel_path: "U" },
            { token: "DI", role: "instrument", vowel_path: "I" },
          ],
          keys: [
            {
              token: "SHTU",
              language: "sq",
              gloss: "add / increase / put-on",
              status: "supported",
              ops: ["s_to_sh"],
              evidence: ["sq: shtu"],
            },
          ],
          carriers: [{ token: "SHTU", language: "sq", carrierForm: "shtu" }],
          spans: [{ token: "SHTU", start: 0, end: 4 }],
          composedMeaning: "add / increase / put-on + know",
        })}
      />
    );

    expect(screen.getByText("Root Map")).toBeInTheDocument();
    expect(screen.getByText("Constructed reading (hypothesis)")).toBeInTheDocument();
    expect(screen.getByText(/not origin proof/i)).toBeInTheDocument();
    expect(screen.getByText(/no forced answer/i)).toBeInTheDocument();
    expect(screen.getByText("Keys")).toBeInTheDocument();
  });

  it("separates matched, claimed, missing, and warning SoundRoots signals", () => {
    render(
      <SoundRootsCard
        word="study"
        normalizedWord="study"
        soundRoots={present({
          domains: ["learning"],
          claimedDomains: ["learning", "memory"],
          missingDomains: ["memory"],
          warnings: [{ code: "SOUNDROOTS_DOMAIN_CLAIM_UNSUPPORTED", domain: "memory" }],
          matches: [{ domain: "learning", gloss: "learn", carrier: "stu", root: "SHTU" }],
        })}
      />
    );

    expect(screen.getByText("SoundRoots")).toBeInTheDocument();
    expect(screen.getByText("Domains matched")).toBeInTheDocument();
    expect(screen.getByText("Claimed domains")).toBeInTheDocument();
    expect(screen.getByText("Missing domains")).toBeInTheDocument();
    expect(screen.getByText("Warnings")).toBeInTheDocument();
    expect(screen.getByText(/unsupported claims/i)).toBeInTheDocument();
  });
});
