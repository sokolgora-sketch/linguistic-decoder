/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: { jsx: 'react-jsx' } }],
  },
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    'lucide-react': '<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js'
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/tests/history.firestore.spec.ts",
    "<rootDir>/tests/mapper.spec.ts",
    "<rootDir>/tests/engine.smoke.test.ts",
    "<rootDir>/tests/gold.spec.ts",
    "<rootDir>/tests/baseline.spec.ts",
    "<rootDir>/tests/edge-guard.spec.ts",
    "<rootDir>/tests/words/hope.spec.ts",
  ],
};
