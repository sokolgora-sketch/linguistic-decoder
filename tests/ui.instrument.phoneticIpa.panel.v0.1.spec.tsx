import React from "react";
import { render, screen } from "@testing-library/react";
import { PhoneticIpaPanelV0_1 } from "@/ui/instrument/sections/PhoneticIpaPanel.v0.1";

describe("ui/instrument: PhoneticIpaPanel v0.1", () => {
  it("renders present ipa + ring labels + unmapped", () => {
    render(
      <PhoneticIpaPanelV0_1
        pom={{
          kind: "present",
          value: { ipa: "/ɹɪðəm/", voices: ["I", "Ë"], unmapped: ["ɹ", "ð", "m"] },
        }}
      />
    );

    expect(screen.getByText("/ɹɪðəm/")).toBeInTheDocument();
    expect(screen.getByText("unmapped:")).toBeInTheDocument();

    // ring labels are rendered as "· inner" / "· outer" (not plain "inner")
    expect(screen.getByText(/·\s*inner/i)).toBeInTheDocument();
    expect(screen.getByText(/·\s*outer/i)).toBeInTheDocument();
  });

  it("renders missing state", () => {
    render(
      <PhoneticIpaPanelV0_1
        pom={{ kind: "missing", missing: "not_emitted", note: "phoneticIpaV0_1" }}
      />
    );
    expect(screen.getByText(/Not provided\./i)).toBeInTheDocument();
    expect(screen.getByText(/\[not_emitted · phoneticIpaV0_1\]/i)).toBeInTheDocument();
  });
});
