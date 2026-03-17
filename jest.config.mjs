import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jsdom",

  // Must run BEFORE test files + before modules import undici/next/server.
  setupFiles: ["<rootDir>/tests/jest.polyfills.cjs"],

  // If you have jest-dom etc, keep it here (optional).
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],

  moduleNameMapper: {
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: ["<rootDir>/tests/**/*.spec.(ts|tsx)"],

  // CI safety: exclude the two Next spin-up smoke tests from unit test runs.
  // They still run under `npm run test:integration`.
  testPathIgnorePatterns: [
    "<rootDir>/tests/apiAnalyzeV1\\.(evidence\\.smoke\\.curl|stability\\.repeat\\.smoke)\\.spec\\.ts$",
  ],
  modulePathIgnorePatterns: ["<rootDir>/.firebase/"],
  watchPathIgnorePatterns: ["<rootDir>/.firebase/"],
};

export default createJestConfig(customJestConfig);
