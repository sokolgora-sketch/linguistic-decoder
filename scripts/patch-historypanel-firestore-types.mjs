import fs from "node:fs";

const path = "src/components/HistoryPanel.tsx";
let src = fs.readFileSync(path, "utf8");

// If types already imported, do nothing.
if (src.includes("QueryDocumentSnapshot") && src.includes("DocumentData") && src.includes("from \"firebase/firestore\"")) {
  console.log("No change: firestore types appear to be already imported.");
  process.exit(0);
}

// Insert type imports after the last import line.
const lines = src.split("\n");
let lastImportIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith("import ")) lastImportIdx = i;
}

// Fallback: if no imports, insert at top.
const insertAt = lastImportIdx >= 0 ? lastImportIdx + 1 : 0;

const importLine = 'import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";';

lines.splice(insertAt, 0, importLine);

src = lines.join("\n");
fs.writeFileSync(path, src, "utf8");
console.log("Patched:", path);
