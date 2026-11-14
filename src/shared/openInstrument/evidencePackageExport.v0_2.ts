import { z } from "zod";
import {
  isAnalysisStatusV0_2,
} from "@/shared/analysisStatus.v0_2";
import { migrateAnalysisStatusV0_1ToV0_2 as migrateLegacyStatus } from "@/shared/analysisStatus.v0_2";
import { stableStringify } from "@/shared/engineContract.v1";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";
import { hasLegacyInterpretationFieldsV2, projectNeutralInterpretationNodeV2 } from "@/shared/analyzeWordResult.v2.contract";
import { migrateLegacyInterpretationTextAtInputV0_1 } from "@/shared/openInstrument/neutralInterpretationInputMigration.v0_1";
import {
  buildEvidencePackageExportV0_1,
} from "@/shared/openInstrument/evidencePackageExport.v0_1";
import type { EvidenceLedgerModel } from "@/ui/ledger/ledgerModel";
import type { TelemetryViewModel } from "@/ui/telemetry/types";

export const EVIDENCE_PACKAGE_EXPORT_SCHEMA_VERSION_V0_2 =
  "open-instrument.evidence-package-export.v0.2" as const;
export const EVIDENCE_PACKAGE_EXPORT_PURPOSE_V0_2 =
  "VM-derived evidence export for audit and handoff; no historical proof; multiple interpretations may coexist and remain for user review." as const;

const legacySchema = z.object({
  schemaVersion: z.literal(EVIDENCE_PACKAGE_EXPORT_SCHEMA_VERSION_V0_2),
  purpose: z.literal(EVIDENCE_PACKAGE_EXPORT_PURPOSE_V0_2),
  input: z.object({
    word: z.string().min(1),
    normalizedWord: z.string().optional(),
    mode: z.enum(["strict", "open"]).optional(),
    engineVersion: z.string().optional(),
  }).strict(),
  summary: z.object({
    voicePath: z.array(z.enum(["A", "E", "I", "O", "U", "Y", "Ë"])).optional(),
    voicePathSurface: z.array(z.enum(["A", "E", "I", "O", "U", "Y", "Ë"])).optional(),
    voicePathFunctional: z.array(z.enum(["A", "E", "I", "O", "U", "Y", "Ë"])).optional(),
    voicePathCarrier: z.array(z.enum(["A", "E", "I", "O", "U", "Y", "Ë"])).optional(),
    voicePathDelta: z.enum(["MATCH", "SHIFT", "DIVERGE", "NOT_EMITTED"]),
  }).strict(),
  counts: z.object({
    candidates: z.number().finite().int().nonnegative(),
    ops: z.number().finite().int().nonnegative().optional(),
    notes: z.number().finite().int().nonnegative().optional(),
    signals: z.number().finite().int().nonnegative().optional(),
    rejections: z.number().finite().int().nonnegative().optional(),
  }).strict(),
  candidates: z.array(z.record(z.unknown())),
  ledger: z.object({ sections: z.array(z.object({
    key: z.enum(["normalization", "ops", "signals"]),
    title: z.string(),
    state: z.enum(["present", "none", "missing"]),
    items: z.array(z.string()),
  }).strict()) }).strict().optional(),
  analysisStatusV0_2: z.unknown().refine(isAnalysisStatusV0_2).optional(),
  interpretationDecisionPolicy: z.unknown().refine(isInterpretationDecisionPolicyV0_1),
}).strict();

export type EvidencePackageExportV0_2 = z.infer<typeof legacySchema>;
export type EvidencePackageExportBuildResultV0_2 =
  | { ok: true; value: EvidencePackageExportV0_2 }
  | { ok: false; reason: string };

export function buildEvidencePackageExportV0_2(
  vm: TelemetryViewModel,
  ledgerModel?: EvidenceLedgerModel,
): EvidencePackageExportBuildResultV0_2 {
  const legacy = buildEvidencePackageExportV0_1(vm, ledgerModel);
  if (!legacy.ok) return legacy;
  const neutralized = projectNeutralInterpretationNodeV2(legacy.value);
  if (neutralized === null || typeof neutralized !== "object" || Array.isArray(neutralized)) {
    return { ok: false, reason: "neutral evidence package projection failed" };
  }
  const output = neutralized as Record<string, unknown>;
  delete output.analysisStatusV0_1;
  output.schemaVersion = EVIDENCE_PACKAGE_EXPORT_SCHEMA_VERSION_V0_2;
  output.purpose = EVIDENCE_PACKAGE_EXPORT_PURPOSE_V0_2;
  output.interpretationDecisionPolicy = INTERPRETATION_DECISION_POLICY_V0_1;

  const vmRecord = vm as unknown as Record<string, unknown>;
  const neutralStatus = vmRecord.analysisStatusV0_2;
  const statusValue = neutralStatus !== null && typeof neutralStatus === "object" &&
    !Array.isArray(neutralStatus) && (neutralStatus as Record<string, unknown>).kind === "present"
    ? (neutralStatus as Record<string, unknown>).value
    : undefined;
  if (isAnalysisStatusV0_2(statusValue)) output.analysisStatusV0_2 = statusValue;
  else {
    const legacyStatus = vmRecord.analysisStatusV0_1;
    const oldValue = legacyStatus !== null && typeof legacyStatus === "object" &&
      !Array.isArray(legacyStatus) && (legacyStatus as Record<string, unknown>).kind === "present"
      ? (legacyStatus as Record<string, unknown>).value
      : undefined;
    const migratedInput = migrateLegacyInterpretationTextAtInputV0_1({
      analysisStatusV0_1: oldValue,
    }) as Record<string, unknown>;
    const migrated = migrateLegacyStatus(migratedInput.analysisStatusV0_1);
    if (migrated) output.analysisStatusV0_2 = migrated;
  }

  if (hasLegacyInterpretationFieldsV2(output)) return { ok: false, reason: "legacy interpretation-selection fields remain" };
  const parsed = legacySchema.safeParse(output);
  if (!parsed.success) return { ok: false, reason: parsed.error.message };
  return { ok: true, value: parsed.data };
}

export function serializeEvidencePackageExportV0_2(
  value: EvidencePackageExportV0_2,
): { ok: true; value: string } | { ok: false; reason: string } {
  if (hasLegacyInterpretationFieldsV2(value)) return { ok: false, reason: "legacy interpretation-selection fields remain" };
  const parsed = legacySchema.safeParse(value);
  if (!parsed.success) return { ok: false, reason: parsed.error.message };
  try {
    return { ok: true, value: `${stableStringify(parsed.data, 2)}\n` };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "serialization failed" };
  }
}
