// @ts-nocheck
import { TextEncoder, TextDecoder } from "util";
import { randomFillSync } from "crypto";
import type { Config } from "jest";

// polyfill for jest crypto function (because of Injective ts sdk)
window.crypto = {
  getRandomValues(buffer) {
    return randomFillSync(buffer);
  },
};

// polyfill for jest formatToJson function
Intl.DateTimeFormat.prototype.formatToJson = function (date: Date) {
  const _this = this as Intl.DateTimeFormat;
  return Object.fromEntries(
    _this
      .formatToParts(date)
      .filter((item) => item.type !== "literal")
      .map((item) => [item.type, item.value]),
  ) as Record<Intl.DateTimeFormatPartTypes, string>;
};

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// const config: Config = {
//   preset: "ts-jest/presets/js-with-ts",
//   testEnvironment: "node",
//   globals: {
//     "ts-jest": {
//       tsconfig: "<rootDir>/test/tsconfig.json",
//     },
//   },
//   transform: {
//     "^.+\\.ts?$": ["ts-jest", { isolatedModules: true }],
//   },
//   projects: [
//     {
//       displayName: "migrate-staking",
//       testMatch: "<rootDir>/src/tests/migrate-staking.test.ts",
//     },
//   ],
// };
//
// export default config;
