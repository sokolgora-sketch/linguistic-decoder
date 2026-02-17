import type { ClaimPacketV0_1 } from "../../src/shared/verifier/claimPacket.v0.1";

export type ClaimPacketGoldCaseV0_1 = {
  name: string;
  packet: ClaimPacketV0_1;
  expectPassed: boolean;
};

export const CLAIM_PACKETS_GOLD_V0_1: ClaimPacketGoldCaseV0_1[] = [
  {
    name: "pass: candidate claimed vowelPath matches oracle primary",
    expectPassed: true,
    packet: {
      claimPacketVersion: "v0.1",
      proposal: {
        word: "study",
        mode: "strict",
        candidates: [
          {
            form: "studim",
            opsUsed: ["noop"],
            decomposition: { note: "gold-case" },
            vowelPath: "U-I",
          },
        ],
      },
      proposalVerification: null,
      oracle: {
        word: "study",
        mode: "strict",
        primaryVoicePath: ["U", "I"],
        evidenceRefs: ["oracle.primaryVoicePath:gold"],
      },
    },
  },
  {
    name: "fail: word mismatch",
    expectPassed: false,
    packet: {
      claimPacketVersion: "v0.1",
      proposal: {
        word: "damage",
        mode: "strict",
        candidates: [
          {
            form: "damage",
            opsUsed: ["noop"],
            decomposition: { note: "gold-case" },
            vowelPath: "A-A-E",
          },
        ],
      },
      proposalVerification: null,
      oracle: {
        word: "damages", // mismatch on purpose
        mode: "strict",
        primaryVoicePath: ["A", "A", "E"],
        evidenceRefs: ["oracle.word:gold"],
      },
    },
  },
  {
    name: "fail: insufficient oracle primaryVoicePath",
    expectPassed: false,
    packet: {
      claimPacketVersion: "v0.1",
      proposal: {
        word: "love",
        mode: "open",
        candidates: [
          {
            form: "love",
            opsUsed: ["noop"],
            decomposition: { note: "gold-case" },
            vowelPath: "O-E",
          },
        ],
      },
      proposalVerification: null,
      oracle: {
        word: "love",
        mode: "open",
        primaryVoicePath: [],
        evidenceRefs: ["oracle.primaryVoicePath:empty"],
      },
    },
  },
];
