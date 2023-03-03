/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
    axios: "axios/dist/node/axios.cjs",
  },
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["./*/**"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/public/",
    "/coverage/",
    "./interfaces/",
    "./api/",
    "./src/reportWebVitals.ts",
    "./src/setupTests.ts",
    "./src/react-app-env.d.ts",
  ],
};
