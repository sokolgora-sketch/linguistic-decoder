import { buildHeartChunkSegmentations } from "../src/shared/openInstrument/heartChunkSegmentation.v0.1";

describe("Open Instrument Heart chunk segmentation helper", () => {
  const studySegmentations = buildHeartChunkSegmentations("study");

  it("returns exactly five study segmentations", () => {
    expect(studySegmentations).toHaveLength(5);
  });

  it("uses deterministic study segmentation IDs", () => {
    expect(studySegmentations.map((item) => item.segmentationId)).toEqual([
      "study.segmentation.001",
      "study.segmentation.002",
      "study.segmentation.003",
      "study.segmentation.004",
      "study.segmentation.005",
    ]);
  });

  it("returns the required study chunk arrays", () => {
    expect(studySegmentations.map((item) => item.chunks)).toEqual([
      ["STU", "DY"],
      ["STU", "DI"],
      ["SHTU", "DI"],
      ["S", "TU", "DI"],
      ["STUD", "I"],
    ]);
  });

  it("returns the required voice paths", () => {
    expect(studySegmentations.map((item) => item.voicePath)).toEqual([
      ["U", "Y"],
      ["U", "I"],
      ["U", "I"],
      ["U", "I"],
      ["U", "I"],
    ]);
  });

  it("returns the required segmentation types", () => {
    expect(studySegmentations.map((item) => item.segmentationType)).toEqual([
      "visible_syllable_like",
      "vowel_anchor_split",
      "soft_variant_split",
      "micro_chunk_split",
      "root_like_split",
    ]);
  });

  it("returns the required legal transforms", () => {
    expect(studySegmentations.map((item) => item.legalTransforms)).toEqual([
      [],
      ["FINAL_Y_TO_I"],
      ["S_TO_SH", "FINAL_Y_TO_I"],
      ["FINAL_Y_TO_I"],
      ["FINAL_Y_TO_I"],
    ]);
  });

  it("marks DI as a FINAL_Y_TO_I variant", () => {
    const variants = studySegmentations.flatMap((item) => item.chunkVariants);
    expect(variants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          chunk: "DI",
          variantOf: "DY",
          legalTransform: "FINAL_Y_TO_I",
        }),
      ]),
    );
  });

  it("marks SHTU as an S_TO_SH variant", () => {
    expect(studySegmentations[2].chunkVariants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          chunk: "SHTU",
          variantOf: "STU",
          legalTransform: "S_TO_SH",
        }),
      ]),
    );
  });

  it("labels all function hints as ZE-RO doctrine", () => {
    const hintSources = studySegmentations.flatMap((item) =>
      item.functionHints.map((hint) => hint.functionHintSource),
    );
    expect(hintSources).not.toHaveLength(0);
    expect(new Set(hintSources)).toEqual(new Set(["ZE-RO doctrine"]));
  });

  it("keeps Brain from being the segmentation authority", () => {
    expect(studySegmentations.every((item) => item.status === "candidate_structure")).toBe(
      true,
    );
  });

  it("records risk notes for transformed segmentations", () => {
    const transformed = studySegmentations.filter(
      (item) => item.legalTransforms.length > 0,
    );
    expect(transformed.every((item) => item.riskNotes.length > 0)).toBe(true);
    expect(transformed.map((item) => item.riskNotes.join(" ")).join(" ")).toMatch(
      /Y→I|s↔sh|false-positive|terminal I/,
    );
  });

  it("returns a safe explicit placeholder for unsupported words", () => {
    const [placeholder] = buildHeartChunkSegmentations("memory");
    expect(placeholder).toEqual(
      expect.objectContaining({
        segmentationId: "memory.segmentation.001",
        word: "memory",
        normalizedWord: "memory",
        chunks: ["MEMORY"],
        chunkVariants: [],
        voicePath: [],
        segmentationType: "root_like_split",
        legalTransforms: [],
        functionHints: [],
        status: "unsupported_word",
      }),
    );
    expect(placeholder.riskNotes.join(" ")).toMatch(/Unsupported word/);
  });
});
