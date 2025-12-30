import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jsdom",

  // Load jest-dom once for all tests
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],

  // Support your @/ alias
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Keep tests in /tests
  testMatch: ["<rootDir>/tests/**/*.spec.(ts|tsx)"],
};

export default createJestConfig(customJestConfig);
