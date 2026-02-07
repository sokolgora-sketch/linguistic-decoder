import fs from "fs";
import path from "path";
import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";

function readJson(p: string) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

describe("Verifier API: corpus gold (v0.1)", () => {
  const dir = path.join(process.cwd(), "tests/__fixtures__/verifier.proposals");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();

  test.each(files)("fixture: %s", (f) => {
    const proposal = readJson(path.join(dir, f));
    const out = verifyProposalV0_1(proposal as any);
    expect(out).toMatchSnapshot();
  });
});
