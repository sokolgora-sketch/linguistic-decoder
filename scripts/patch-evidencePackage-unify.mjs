import fs from "fs";

const path = "app/api/analyze-v1/route.ts";
let t = fs.readFileSync(path, "utf8");

// A) Remove duplicated Backfill block in POST (keep only one instance if duplicated)
t = t.replace(
  /(\n\s*\/\/ Backfill: ensure sevenPrinciplesSpectrum is always present \(null allowed\)\n\s*if\s*\(\(evidencePackage as any\)\?\.sevenPrinciplesSpectrum === undefined\)\s*\{\n[\s\S]*?\n\s*\}\n)\s*\/\/ Backfill: ensure sevenPrinciplesSpectrum is always present \(null allowed\)\n\s*if\s*\(\(evidencePackage as any\)\?\.sevenPrinciplesSpectrum === undefined\)\s*\{\n[\s\S]*?\n\s*\}\n/,
  "$1"
);

// B) Normalize EvidencePackage version string everywhere
t = t.replace(/version:\s*"v0\.1"/g, 'version: "evidence_package.v0.1"');

// C) Replace ONLY the GET EvidencePackage build block (between ui creation and checked.safeParse)
const getFnIdx = t.indexOf("export async function GET");
if (getFnIdx === -1) {
  console.error("PATCH FAILED: cannot find GET handler");
  process.exit(1);
}

const uiNeedle = "const ui = adaptAnalyzeV1ToUI(out as any);";
const checkedNeedle = "const checked = AnalyzeWordResultV1ContractSchema.safeParse(out);";

const uiIdx = t.indexOf(uiNeedle, getFnIdx);
if (uiIdx === -1) {
  console.error("PATCH FAILED: cannot find ui line inside GET");
  process.exit(1);
}

const checkedIdx = t.indexOf(checkedNeedle, uiIdx);
if (checkedIdx === -1) {
  console.error("PATCH FAILED: cannot find checked.safeParse line after ui line inside GET");
  process.exit(1);
}

// Keep indentation from the file (we’ll reuse the leading whitespace of the ui line)
const lineStart = t.lastIndexOf("\n", uiIdx) + 1;
const indentMatch = t.slice(lineStart, uiIdx).match(/^\s*/);
const I = indentMatch ? indentMatch[0] : "      ";

const replacement =
`${I}${uiNeedle}

${I}// EvidencePackage is optional and must never break /api/analyze-v1.
${I}// Build it ONLY from Telemetry VM (VM-only) and swallow errors defensively.
${I}let evidencePackage: any = {
${I}  version: "evidence_package.v0.1",
${I}  sevenPrinciplesSpectrum: null,
${I}};
${I}try {
${I}  const telemetryVm = buildTelemetryVmForEvidencePackage({
${I}    word,
${I}    mode: modeParsed ?? mode,
${I}    out,
${I}    heartInstrumentV1,
${I}  });

${I}  evidencePackage = buildEvidencePackageFromVM(telemetryVm as any, {
${I}    ledgerModel: (ui as any)?.ledgerModel ?? undefined,
${I}  });

${I}  // Backfill: ensure sevenPrinciplesSpectrum is always present (null allowed)
${I}  if ((evidencePackage as any)?.sevenPrinciplesSpectrum === undefined) {
${I}    const tvm: any = telemetryVm as any;
${I}    (evidencePackage as any).sevenPrinciplesSpectrum =
${I}      tvm?.sevenPrinciplesSpectrum ??
${I}      tvm?.readout?.sevenPrinciplesSpectrum ??
${I}      null;
${I}  }

${I}  // If adapter returns undefined/null/non-object, keep minimal object
${I}  if (!evidencePackage || typeof evidencePackage !== "object") {
${I}    evidencePackage = {
${I}      version: "evidence_package.v0.1",
${I}      sevenPrinciplesSpectrum: null,
${I}      signals: ["EVIDENCE_PACKAGE_MALFORMED"],
${I}    };
${I}  }
${I}} catch (_e) {
${I}  evidencePackage = {
${I}    version: "evidence_package.v0.1",
${I}    sevenPrinciplesSpectrum: null,
${I}    signals: ["EVIDENCE_PACKAGE_BUILD_FAILED"],
${I}  };
${I}}

`;

// Replace from the start of ui line to just before checked.safeParse line
t = t.slice(0, lineStart) + replacement + t.slice(checkedIdx);

// Safety: ensure GET/POST still exist
if (!t.includes("export async function GET") || !t.includes("export async function POST")) {
  console.error("PATCH FAILED: GET/POST functions missing after patch.");
  process.exit(1);
}

fs.writeFileSync(path, t, "utf8");
console.log("PATCH OK:", path);
