import {
  BRACKETS,
  BATTERY_CASES,
  BATTERY_CASES_BY_ID,
  BATTERY_CASES_BY_SERIES_LABEL,
  type BatteryCase,
  type BatteryBracket,
  type BracketId
} from "./batteryRegistry.v0.1";

export function getAllBatteryCases(): BatteryCase[] {
  return BATTERY_CASES;
}

export function getBatteryCaseById(caseId: string): BatteryCase | null {
  return BATTERY_CASES_BY_ID[caseId] ?? null;
}

export function getBatteryCaseBySeriesLabel(
  seriesLabel: string
): BatteryCase | null {
  return BATTERY_CASES_BY_SERIES_LABEL[seriesLabel] ?? null;
}

export function getBracket(bracketId: BracketId): BatteryBracket {
  return BRACKETS[bracketId];
}

export function getIntendedBracketForCase(caseId: string): BatteryBracket | null {
  const batteryCase = getBatteryCaseById(caseId);
  if (!batteryCase) return null;
  return getBracket(batteryCase.intendedBracketId);
}

export function getControlBracketForCase(caseId: string): BatteryBracket | null {
  const batteryCase = getBatteryCaseById(caseId);
  if (!batteryCase) return null;
  return getBracket(batteryCase.controlBracketId);
}

export function getBatteryCasesBySection(
  section: BatteryCase["section"]
): BatteryCase[] {
  return BATTERY_CASES.filter((batteryCase) => batteryCase.section === section);
}

export function getSupportCases(): BatteryCase[] {
  return BATTERY_CASES.filter(
    (batteryCase) => batteryCase.scientificStatus === "support"
  );
}

export function getPressureCases(): BatteryCase[] {
  return BATTERY_CASES.filter(
    (batteryCase) => batteryCase.scientificStatus === "pressure"
  );
}

export function getMixedCases(): BatteryCase[] {
  return BATTERY_CASES.filter(
    (batteryCase) => batteryCase.scientificStatus === "mixed"
  );
}
