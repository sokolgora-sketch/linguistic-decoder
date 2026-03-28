import React from "react";
import { render, screen } from "@testing-library/react";
import { BridgePreviewSummaryCardV0_1 } from "@/ui/voicelab/BridgePreviewSummaryCard.v0.1";
import type { ZeroVoiceLabBridgePreviewModelV0_1 } from "@/shared/voicelab/bridgePreviewModel.v0.1";

describe("BridgePreviewSummaryCard.v0.1", () => {
  it("renders the preview summary fields for voicelab evidence", () => {
    const model: ZeroVoiceLabBridgePreviewModelV0_1 = {
      importKind: "voicelab_evidence",
      sourceVersion: "voicelab.evidence.v0.2",
      capturedAt: "2026-03-28T10:16:34.531Z",
      vowelsRecorded: 7,
      aAnchorHz: 728,
      singerMode: "singer",
      selectedVowel: "I",
      targetPitchHz: 220,
      seedStage: null,
      seedLocked: null,
    };

    render(<BridgePreviewSummaryCardV0_1 model={model} />);

    expect(screen.getByText("VoiceLab Bridge Preview")).toBeInTheDocument();
    expect(screen.getByText("voicelab_evidence")).toBeInTheDocument();
    expect(screen.getByText("voicelab.evidence.v0.2")).toBeInTheDocument();
    expect(screen.getByText("2026-03-28T10:16:34.531Z")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("728")).toBeInTheDocument();
    expect(screen.getByText("singer")).toBeInTheDocument();
    expect(screen.getByText("I")).toBeInTheDocument();
    expect(screen.getByText("220")).toBeInTheDocument();
  });

  it("renders fallbacks and seed fields for a locked seed model", () => {
    const model: ZeroVoiceLabBridgePreviewModelV0_1 = {
      importKind: "sgi_seed",
      sourceVersion: "sgi.seed.v0.2",
      capturedAt: "2026-03-28T10:16:41.961Z",
      vowelsRecorded: 7,
      aAnchorHz: 728,
      singerMode: null,
      selectedVowel: null,
      targetPitchHz: null,
      seedStage: "locked",
      seedLocked: true,
    };

    render(<BridgePreviewSummaryCardV0_1 model={model} />);

    expect(screen.getByText("sgi_seed")).toBeInTheDocument();
    expect(screen.getByText("sgi.seed.v0.2")).toBeInTheDocument();
    expect(screen.getByText("locked")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();

    const emDashes = screen.getAllByText("—");
    expect(emDashes.length).toBeGreaterThanOrEqual(3);
  });
});
