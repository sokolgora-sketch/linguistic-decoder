import { execSync } from "node:child_process";
execSync("npx tsx scripts/validation.report.runner.v0.2.ts", { stdio: "inherit" });
