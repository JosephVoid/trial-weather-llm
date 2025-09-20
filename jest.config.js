module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testTimeout: 100000,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
