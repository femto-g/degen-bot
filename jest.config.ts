import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  transform: {
    // "^.+\\.jsx?$": "babel-jest",
    "^.+.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.base.json",
      },
    ],
  },
};

export default config;
