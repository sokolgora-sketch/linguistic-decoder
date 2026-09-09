import fs from "node:fs";
import path from "node:path";
import {
  runControlledSemanticContrastiveProviderExecutionV0_2,
  type ControlledSemanticContrastiveAuthorizationV0_2,
  type ControlledSemanticContrastiveExecutionPacketV0_2,
} from "@/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_2";

const repoRoot = process.cwd();
const packetPath = process.env.OI_CONTROLLED_CONTRASTIVE_SEMANTIC_PACKET ?? path.join(repoRoot, "docs/open-instrument/fixtures/controlled-semantic-contrastive-run/open-instrument-controlled-semantic-contrastive-run-packet-v0.2.json");
const authorizationPath = process.env.OI_CONTROLLED_CONTRASTIVE_SEMANTIC_AUTHORIZATION;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

async function main(): Promise<void> {
  if (!authorizationPath) {
    console.log(JSON.stringify({ status: "blocked", reasonCodes: ["CONTRASTIVE_AUTHORIZATION_FILE_REQUIRED", "REAL_PROVIDER_EXECUTION_NOT_PERFORMED"], packetPath }, null, 2));
    return;
  }
  const packet = readJson<ControlledSemanticContrastiveExecutionPacketV0_2>(packetPath);
  const authorization = readJson<ControlledSemanticContrastiveAuthorizationV0_2>(authorizationPath);
  const result = await runControlledSemanticContrastiveProviderExecutionV0_2(packet, authorization);
  console.log(JSON.stringify(result, null, 2));
}

void main();
