import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

describe("Evals floating notice hierarchy v0.1", () => {
  it("locks the stronger floating notice tier labels in source", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "src/ui/evals/EvalsPageClient.v0.1.tsx"),
      "utf8"
    );

    expect(src).toContain("Unsupported input · cannot score");
    expect(src).toContain("cannot be scored here");
    expect(src).toContain("Error · scoring/export failed");
    expect(src).toContain(
      'noticeIsWarn ? "Warning · review before continuing" : "Note · informational only"'
    );
  });
});
