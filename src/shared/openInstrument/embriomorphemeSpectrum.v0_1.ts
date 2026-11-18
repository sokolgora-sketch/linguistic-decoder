export const EMBRIOMORPHEME_SPECTRUM_SCHEMA_V0_1 =
  "open-instrument.embriomorpheme-spectrum.v0_1" as const;

export type EmbriomorphemeAssociationV0_1 = Readonly<{
  candidateId: string;
  unit: string;
  association: string;
  provenanceClass:
    | "OWNER_SUPPLIED_PROVISIONAL_RESEARCH_ASSOCIATION"
    | "TARGET_LOCAL_USER_PROPOSAL_NOT_IN_FIFTEEN_UNIT_TABLE";
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  evidenceStatus: "USER_PROPOSED";
  sourceIds: readonly [];
  citationStatus: "NO_CITATION_ENTERED";
  historicalStatus: "NOT_CLAIMED";
}>;

export type EmbriomorphemeSpectrumEntryV0_1 = Readonly<{
  unit: string;
  associations: readonly EmbriomorphemeAssociationV0_1[];
}>;

function association(
  unit: string,
  associationText: string,
  provenanceClass: EmbriomorphemeAssociationV0_1["provenanceClass"] =
    "OWNER_SUPPLIED_PROVISIONAL_RESEARCH_ASSOCIATION",
): EmbriomorphemeAssociationV0_1 {
  const slug = associationText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return Object.freeze({
    candidateId: `${unit.toLowerCase()}:${slug}`,
    unit,
    association: associationText,
    provenanceClass,
    claimLayer: "EXPLORATORY_HYPOTHESIS",
    evidenceStatus: "USER_PROPOSED",
    sourceIds: [] as const,
    citationStatus: "NO_CITATION_ENTERED",
    historicalStatus: "NOT_CLAIMED",
  });
}

function entry(unit: string, associationTexts: readonly string[]): EmbriomorphemeSpectrumEntryV0_1 {
  return Object.freeze({ unit, associations: Object.freeze(associationTexts.map((text) => association(unit, text))) });
}

/**
 * Owner-supplied working hypotheses for exploratory ZË-RO composition.
 * These entries are not source-verified definitions, historical etymologies,
 * or universal consonant meanings. A core unit with no associations is
 * structural-only and has no proposed functional meaning.
 */
export const EMBRIOMORPHEME_SPECTRUM_V0_1: readonly EmbriomorphemeSpectrumEntryV0_1[] =
  Object.freeze([
    entry("R", ["circular motion", "cycle", "rhythm"]),
    entry("L", ["linear flow", "spreading", "liquid"]),
    entry("D", ["division", "direction", "light", "cut"]),
    entry("M", ["matter", "mother", "result", "closure"]),
    entry("N", ["enclosure", "inside", "negation", "origin"]),
    entry("SH", ["sharpness", "separation", "intensity"]),
    entry("GJ", ["gathering", "continuity", "mass"]),
    entry("B", ["being", "substance", "growth"]),
    entry("P", ["surface", "expansion", "appearance"]),
    entry("T", ["touch", "cut", "boundary"]),
    entry("K", ["hardness", "angle", "corner"]),
    entry("V", ["void", "opening", "womb"]),
    entry("S", ["structure", "solidity", "sibilance"]),
    entry("Z", ["sound", "darkness", "deep"]),
    entry("F", ["breath", "spirit", "force"]),
    entry("C", ["point", "cut", "sharp"]),
    entry("DH", ["earth", "thickness", "density"]),
    entry("H", ["breath", "space", "opening"]),
    entry("J", ["link", "joining", "flow"]),
    entry("LL", ["light", "flame", "clarity"]),
    entry("NJ", ["unity", "softness", "inside"]),
    entry("Q", ["center", "circle", "enclosure"]),
    entry("RR", ["rapid motion", "flow", "rush"]),
    entry("TH", ["point", "sharpness", "piercing"]),
    entry("X", ["binding", "solid", "form"]),
    entry("XH", ["heat", "intensity", "burst"]),
    entry("ZH", ["sound", "echo", "vibration"]),
    entry("G", []),
  ]);

/** Ç is a separate target-local proposal and is not part of the 15-unit table. */
export const TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1: readonly EmbriomorphemeAssociationV0_1[] =
  Object.freeze([
    association("Ç", "release", "TARGET_LOCAL_USER_PROPOSAL_NOT_IN_FIFTEEN_UNIT_TABLE"),
    association("Ç", "emit", "TARGET_LOCAL_USER_PROPOSAL_NOT_IN_FIFTEEN_UNIT_TABLE"),
  ]);

export function getEmbriomorphemeSpectrumEntryV0_1(
  unit: string,
): EmbriomorphemeSpectrumEntryV0_1 | undefined {
  return EMBRIOMORPHEME_SPECTRUM_V0_1.find((candidate) => candidate.unit === unit);
}

export function getEmbriomorphemeAssociationV0_1(
  candidateId: string,
): EmbriomorphemeAssociationV0_1 | undefined {
  return [
    ...EMBRIOMORPHEME_SPECTRUM_V0_1.flatMap((candidate) => candidate.associations),
    ...TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1,
  ].find((candidate) => candidate.candidateId === candidateId);
}
