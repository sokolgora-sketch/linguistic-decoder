import React from "react";
import { render, screen } from "@testing-library/react";
import { SoundRootsCard } from "@/ui/instrument/SoundRootsCard";

describe("Instrument UI: SoundRootsCard", () => {
  it("renders without leaking [object Object]", () => {
    const soundRoots: any = {
      kind: "present",
      value: {
        domains: ["rain_water"],
        claimedDomains: ["rain_water", "wind_air"],
        missingDomains: ["wind_air"],
        warnings: [{ code: "SOUNDROOTS_DOMAIN_CLAIM_UNSUPPORTED", domain: "wind_air" }],
        matches: [{ domain: "rain_water", gloss: "rain", carrier: "drip", root: "drip" }],
      },
    };

    render(<SoundRootsCard soundRoots={soundRoots} word="study" normalizedWord="study" />);

    expect(screen.getByText("SoundRoots")).toBeInTheDocument();
    expect(screen.getAllByText(/rain_water/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/\[object Object\]/i)).toBeNull();
  });

  it("renders missing state", () => {
    const soundRoots: any = { kind: "missing", missing: "not_emitted", note: "soundRoots" };
    render(<SoundRootsCard soundRoots={soundRoots} word="study" normalizedWord="study" />);
    expect(screen.getByText(/STATE:\s*MISSING/i)).toBeInTheDocument();
  });
});
