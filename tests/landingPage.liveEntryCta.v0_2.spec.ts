import fs from "node:fs";

describe("LandingPage v0.2 live entry CTA posture", () => {
  it("promotes /chat as the live Open Instrument entry and demotes preview-only surfaces", () => {
    const text = fs.readFileSync("src/components/landing/LandingPage.v0.2.tsx", "utf8");

    expect(text).not.toContain(
      'Deterministic evals now live. Open Instrument and Voice Lab are intentionally closed for now.'
    );

    expect(text).toContain(
      'Deterministic evals now live. Open Instrument is live at /chat. Voice Lab remains preview-only while Evals stays the deterministic scoring entry point.'
    );

    expect(text).toContain(
      'Open Instrument is live at /chat. Instrument Preview is static, Voice Lab remains preview-only, and Evals stays the deterministic scoring entry point.'
    );

    expect(text).toContain('href="/chat"');
    expect(text).toContain('label="Open Instrument Live"');
    expect(text).toContain('href="/instrument-preview"');
    expect(text).toContain('label="Instrument Preview (static)"');
  });
});
