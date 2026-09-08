import fs from "node:fs";
import path from "node:path";
import {
  runControlledSemanticContrastiveProviderExecutionV0_1,
  type ControlledSemanticContrastiveAuthorizationV0_1,
  type ControlledSemanticContrastiveExecutionPacketV0_1,
} from "@/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_1";

const repoRoot = process.cwd();
const packetPath = process.env.OI_CONTROLLED_CONTRASTIVE_SEMANTIC_PACKET ?? path.join(repoRoot, "docs/open-instrument/fixtures/controlled-semantic-contrastive-run/open-instrument-controlled-semantic-contrastive-run-packet-v0.1.json");
const authorizationPath = process.env.OI_CONTROLLED_CONTRASTIVE_SEMANTIC_AUTHORIZATION;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

async function main(): Promise<void> {
  if (!authorizationPath) {
    console.log(JSON.stringify({ status: "blocked", reasonCodes: ["CONTRASTIVE_AUTHORIZATION_FILE_REQUIRED", "REAL_PROVIDER_EXECUTION_NOT_PERFORMED"], packetPath }, null, 2));
    return;
  }
  const packet = readJson<ControlledSemanticContrastiveExecutionPacketV0_1>(packetPath);
  const authorization = readJson<ControlledSemanticContrastiveAuthorizationV0_1>(authorizationPath);
  const result = await runControlledSemanticContrastiveProviderExecutionV0_1(packet, authorization);
  console.log(JSON.stringify(result, null, 2));
}

void main();
