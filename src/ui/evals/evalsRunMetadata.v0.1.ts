export function normalizeEvalsMetaTextV0_1(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeRunIdTemplateV0_1(template: unknown): string {
  const cleaned = normalizeEvalsMetaTextV0_1(template);
  if (!cleaned) return "battery.{NN}";
  return cleaned.includes("{NN}") ? cleaned : `${cleaned}.{NN}`;
}
