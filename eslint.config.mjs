/**
 * ESLint v9 flat config bridge.
 * Source of truth: .eslintrc.json (legacy)
 * This file exists ONLY to make ESLint v9 run the existing rules.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const legacy = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".eslintrc.json"), "utf8")
);

export default [
  // ESLint v9 replacement for .eslintignore
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/.cache/**",
    ],
  },

  ...compat.config(legacy),
];
