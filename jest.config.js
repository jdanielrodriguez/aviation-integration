/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/test/**/*.test.ts",
    "**/tests/**/*.test.ts",
    "**/src/tests/**/*.test.ts",
    "**/src/test/**/*.test.ts"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/migrations/",
    "dist/migrations/"
  ]
};
