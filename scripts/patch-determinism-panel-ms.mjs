import fs from "node:fs";

const path = "src/components/DeterminismComparatorPanel.tsx";
const src = fs.readFileSync(path, "utf8");

// This is the exact failing expression from your build error.
// We replace it with a safe formatter that doesn't rely on TypeScript narrowing.
const needle = "{r.ok ? `${r.msAvg}ms avg · ${r.msMax}ms max` : `${r.ms}ms`}";

const replacement = `{(() => {
  const anyR: any = r as any;
  if (typeof anyR.msAvg === "number" && typeof anyR.msMax === "number") {
    return \`\${anyR.msAvg}ms avg · \${anyR.msMax}ms max\`;
  }
  if (typeof anyR.ms === "number") return \`\${anyR.ms}ms\`;
  if (typeof anyR.ms === "string") return anyR.ms;
  return "";
})()}`;

if (!src.includes(needle)) {
  console.error("PATCH FAILED: target expression not found. No changes made.");
  process.exit(1);
}

const next = src.replace(needle, replacement);
fs.writeFileSync(path, next, "utf8");
console.log("Patched:", path);
