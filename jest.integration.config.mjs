import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "node",
  testMatch: [
    "**/tests/apiAnalyzeV1.evidence.smoke.curl.spec.ts",
    "**/tests/apiAnalyzeV1.stability.repeat.smoke.spec.ts",
  ],
  // critical: no parallelism for Next dev servers
  maxWorkers: 1,
  // keep timeouts generous
  testTimeout: 180000,
  moduleNameMapper: {
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ["<rootDir>/tests/jest.integration.env.cjs", "<rootDir>/tests/jest.polyfills.cjs"],
};

export default createJestConfig(customJestConfig);
