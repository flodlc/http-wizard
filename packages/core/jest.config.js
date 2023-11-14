/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testEnvironment: 'node',
};
