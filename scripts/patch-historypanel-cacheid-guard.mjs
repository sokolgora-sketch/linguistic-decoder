import fs from "node:fs";

const path = "src/components/HistoryPanel.tsx";
const src = fs.readFileSync(path, "utf8");

const needle = "onClick={() => onLoadAnalysis(h.cacheId)}";
const replacement = "onClick={() => { if (h.cacheId) onLoadAnalysis(h.cacheId); }}";

if (!src.includes(needle)) {
  console.error("PATCH FAILED: target onClick not found. No changes made.");
  process.exit(1);
}

fs.writeFileSync(path, src.replace(needle, replacement), "utf8");
console.log("Patched:", path);
