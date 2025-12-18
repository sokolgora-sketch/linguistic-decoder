import nextJest from 'next/jest.js';

// Next.js integration: load env + path aliases
const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jsdom',

  // Add TypeScript + ESM support
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },

  // Allow JSX and ESM modules (like lucide-react)
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react|@radix-ui)/)',
  ],

  // Map @/ → src/
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // Optional setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Silence noisy Firebase & React warnings
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/out/'],
};

export default createJestConfig(customJestConfig);
