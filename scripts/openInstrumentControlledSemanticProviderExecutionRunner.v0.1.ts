import fs from "node:fs";
import path from "node:path";
import {
  runControlledSemanticProviderExecutionV0_1,
  type ControlledSemanticExecutionAuthorizationV0_1,
  type ControlledSemanticExecutionPacketV0_1,
} from "@/shared/openInstrument/controlledSemanticProviderExecution.v0_1";

const repoRoot = process.cwd();
const packetPath = process.env.OI_CONTROLLED_SEMANTIC_PACKET ?? path.join(repoRoot, "docs/open-instrument/fixtures/controlled-semantic-provider-run/open-instrument-controlled-semantic-provider-run-packet-v0.1.json");
const authorizationPath = process.env.OI_CONTROLLED_SEMANTIC_AUTHORIZATION;

function readJson<T>(filePath: string): T { return JSON.parse(fs.readFileSync(filePath, "utf8")) as T; }

async function main(): Promise<void> {
  if (!authorizationPath) {
    console.log(JSON.stringify({ status: "blocked", reasonCodes: ["AUTHORIZATION_FILE_REQUIRED", "REAL_PROVIDER_EXECUTION_NOT_PERFORMED"], packetPath }, null, 2));
    return;
  }

  const packet = readJson<ControlledSemanticExecutionPacketV0_1>(packetPath);
  const authorization = readJson<ControlledSemanticExecutionAuthorizationV0_1>(authorizationPath);
  const result = await runControlledSemanticProviderExecutionV0_1(packet, authorization);
  console.log(JSON.stringify(result, null, 2));
}

void main();
