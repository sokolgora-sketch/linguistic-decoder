import {
  ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1,
  createAlbIpaNorthernToskObservationV0_1,
  normalizeAlbIpaSampaPhoneSequenceV0_1,
} from "@/shared/openInstrument/albIpaNorthernTosk.v0_1";
import {
  projectAlbanianPronunciationSourceObservationV0_1,
} from "@/shared/openInstrument/albanianPhonologicalCategoryProjector.v0_1";

describe("alb-ipa Northern Tosk source adapter v0.1", () => {
  it("normalizes the source SAMPA phone sequence without word rules", () => {
    expect(normalizeAlbIpaSampaPhoneSequenceV0_1("p y k @")).toBe("pykə");
    expect(normalizeAlbIpaSampaPhoneSequenceV0_1("tS a j i")).toBe("tʃaji");
    expect(normalizeAlbIpaSampaPhoneSequenceV0_1("unknown")).toBeNull();
  });

  it("preserves exact source profile and archive provenance", () => {
    const observation = createAlbIpaNorthernToskObservationV0_1({
      lexicalForm: "fati",
      speakerId: "s01",
      rawPhoneSequence: "f a t i",
      variantOrder: 0,
      sourceLocator: "recordings/derived/align/s01/words.TextGrid:KAN-MAU-MAU",
    });

    expect(observation).toMatchObject({
      sourceProfileId: ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1,
      sourceScope: "TOSK_EXPLICIT",
      sourceProfileQualifier: "NORTHERN_TOSK_EXPLICIT",
      sourceNotation: "SAMPA_KAN_MAU_PHONE_TRANSCRIPTION",
      notationKind: "PHONEMIC",
      rawIpa: "/fati/",
      provenance: {
        gitCommit: "60855d1ffe6471bd9a3aa12aa03afdc11f36e690",
        archiveSha256:
          "aced72224e60b6f9a20f6dda831a1558ca9d4a906d53031f887f48328601572a",
      },
    });
  });

  it("enters the existing frozen Northern-Tosk projector", () => {
    const observation = createAlbIpaNorthernToskObservationV0_1({
      lexicalForm: "fati",
      speakerId: "s01",
      rawPhoneSequence: "f a t i",
      variantOrder: 0,
      sourceLocator: "fixture",
    });

    expect(observation).not.toBeNull();
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation!)).toMatchObject({
      status: "SUPPORTED",
      categories: ["LOW_CENTRAL_OR_BACK", "HIGH_FRONT_UNROUNDED"],
      sourceProfileId: ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1,
      sourceScope: "TOSK_EXPLICIT",
    });
  });

  it("preserves Null for unsupported source symbols under the existing authority", () => {
    const observation = createAlbIpaNorthernToskObservationV0_1({
      lexicalForm: "për",
      speakerId: "s01",
      rawPhoneSequence: "p @ 4",
      variantOrder: 0,
      sourceLocator: "fixture",
    });

    expect(observation).not.toBeNull();
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation!)).toMatchObject({
      status: "UNRESOLVED",
      categories: [null],
      reasonCodes: expect.arrayContaining(["SYMBOL_AUTHORITY_MISSING"]),
    });
  });
});
