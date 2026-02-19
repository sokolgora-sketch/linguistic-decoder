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

/**
 * ESLint v9 + newer @typescript-eslint removed some legacy rules.
 * FlatCompat will still emit them if they exist in .eslintrc.json,
 * and ESLint will hard-error on unknown rule names even if "off".
 * So we delete them from the legacy object before compat runs.
 */
function stripMissingTypeScriptEslintRules(cfg) {
  const missing = ["@typescript-eslint/no-var-requires"];

  if (cfg && cfg.rules) {
    for (const r of missing) delete cfg.rules[r];
  }
  if (cfg && Array.isArray(cfg.overrides)) {
    for (const ov of cfg.overrides) {
      if (ov && ov.rules) {
        for (const r of missing) delete ov.rules[r];
      }
    }
  }
  return cfg;
}

stripMissingTypeScriptEslintRules(legacy);

const eslintConfig = [
  {
    ignores: [
    ".next-int/**",
    ".next/**",
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

  // Force TS-ESLint type-aware project to include tests/scripts/app/etc.
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: __dirname,
      },
    },
  },
];

export default eslintConfig;
