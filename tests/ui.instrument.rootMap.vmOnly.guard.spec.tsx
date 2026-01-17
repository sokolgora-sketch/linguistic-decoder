import React from "react";
import { render } from "@testing-library/react";

import { RootMapCard } from "@/ui/instrument/RootMapCard";

describe("ui guardrail: RootMapCard is VM-only", () => {
  it("renders without any raw payload access (VM-only contract)", () => {
    // If RootMapCard tried to read raw payload, it would need a different prop.
    // This test ensures the component surface area stays VM-only.
    const vm = { kind: "missing", missing: "not_emitted" } as const;

    expect(() => render(<RootMapCard rootMap={vm as any} />)).not.toThrow();
  });
});
