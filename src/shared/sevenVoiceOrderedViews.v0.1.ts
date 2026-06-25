export const sevenVoiceOrderedViewsSchemaVersion =
  "open-instrument.seven-voice-ordered-views.v0.1" as const;

export const symbolicMathOrder = Object.freeze([
  "A",
  "E",
  "I",
  "O",
  "U",
  "Y",
  "Ë",
] as const);

export const acousticVoiceLabOrder = Object.freeze([
  "A",
  "O",
  "E",
  "Ë",
  "U",
  "Y",
  "I",
] as const);

export const evalBucketOrder = Object.freeze([
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
] as const);

export type SevenVoiceKey = (typeof symbolicMathOrder)[number];
export type SevenVoiceLevel = "high" | "mid" | "low";
export type SevenVoiceGenderPolarity = "male" | "female" | "androgynous";
export type SevenVoiceAcousticHeight = "open" | "mid" | "close";
export type SevenVoiceAcousticBackness = "front" | "central" | "back";

export type SevenVoiceRegistryEntry = Readonly<{
  key: SevenVoiceKey;
  displayLabel: SevenVoiceKey;
  symbolicMathIndex: number;
  math7Value: number;
  symbolicLevel: SevenVoiceLevel;
  symbolicRing: number;
  symbolicColor: string;
  genderPolarity: SevenVoiceGenderPolarity;
  principleLabel: string;
  acousticLabel: string;
  acousticHeight: SevenVoiceAcousticHeight;
  acousticBackness: SevenVoiceAcousticBackness;
}>;

export const sevenVoiceRegistry = Object.freeze({
  A: Object.freeze({
    key: "A",
    displayLabel: "A",
    symbolicMathIndex: 1,
    math7Value: 1,
    symbolicLevel: "high",
    symbolicRing: 3,
    symbolicColor: "red",
    genderPolarity: "male",
    principleLabel: "A",
    acousticLabel: "open central",
    acousticHeight: "open",
    acousticBackness: "central",
  }),
  E: Object.freeze({
    key: "E",
    displayLabel: "E",
    symbolicMathIndex: 2,
    math7Value: 2,
    symbolicLevel: "high",
    symbolicRing: 2,
    symbolicColor: "orange",
    genderPolarity: "female",
    principleLabel: "E",
    acousticLabel: "mid front",
    acousticHeight: "mid",
    acousticBackness: "front",
  }),
  I: Object.freeze({
    key: "I",
    displayLabel: "I",
    symbolicMathIndex: 3,
    math7Value: 3,
    symbolicLevel: "high",
    symbolicRing: 1,
    symbolicColor: "yellow",
    genderPolarity: "male",
    principleLabel: "I",
    acousticLabel: "close front",
    acousticHeight: "close",
    acousticBackness: "front",
  }),
  O: Object.freeze({
    key: "O",
    displayLabel: "O",
    symbolicMathIndex: 4,
    math7Value: 4,
    symbolicLevel: "mid",
    symbolicRing: 0,
    symbolicColor: "green",
    genderPolarity: "androgynous",
    principleLabel: "O",
    acousticLabel: "mid back",
    acousticHeight: "mid",
    acousticBackness: "back",
  }),
  U: Object.freeze({
    key: "U",
    displayLabel: "U",
    symbolicMathIndex: 5,
    math7Value: 5,
    symbolicLevel: "low",
    symbolicRing: 1,
    symbolicColor: "blue",
    genderPolarity: "female",
    principleLabel: "U",
    acousticLabel: "close back",
    acousticHeight: "close",
    acousticBackness: "back",
  }),
  Y: Object.freeze({
    key: "Y",
    displayLabel: "Y",
    symbolicMathIndex: 6,
    math7Value: 6,
    symbolicLevel: "low",
    symbolicRing: 2,
    symbolicColor: "indigo",
    genderPolarity: "male",
    principleLabel: "Y",
    acousticLabel: "close front",
    acousticHeight: "close",
    acousticBackness: "front",
  }),
  Ë: Object.freeze({
    key: "Ë",
    displayLabel: "Ë",
    symbolicMathIndex: 7,
    math7Value: 7,
    symbolicLevel: "low",
    symbolicRing: 3,
    symbolicColor: "violet",
    genderPolarity: "female",
    principleLabel: "Ë",
    acousticLabel: "mid central",
    acousticHeight: "mid",
    acousticBackness: "central",
  }),
} satisfies Record<SevenVoiceKey, SevenVoiceRegistryEntry>);

export const sevenVoiceOrderedViews = Object.freeze({
  symbolicMathOrder,
  acousticVoiceLabOrder,
  evalBucketOrder,
});

export type SevenVoiceOrderedViewName =
  | "symbolicMathOrder"
  | "acousticVoiceLabOrder"
  | "evalBucketOrder";

export function isSevenVoiceKey(value: string): value is SevenVoiceKey {
  return Object.prototype.hasOwnProperty.call(sevenVoiceRegistry, value);
}

export function lookupSevenVoice(key: SevenVoiceKey): SevenVoiceRegistryEntry {
  return sevenVoiceRegistry[key];
}

export function orderedVoicesForView(
  viewName: Exclude<SevenVoiceOrderedViewName, "evalBucketOrder">,
): readonly SevenVoiceKey[] {
  return sevenVoiceOrderedViews[viewName];
}

export function orderedRegistryEntriesForView(
  viewName: Exclude<SevenVoiceOrderedViewName, "evalBucketOrder">,
): readonly SevenVoiceRegistryEntry[] {
  return orderedVoicesForView(viewName).map((voice) => lookupSevenVoice(voice));
}
