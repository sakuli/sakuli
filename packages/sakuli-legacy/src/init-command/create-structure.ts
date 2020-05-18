import { mkdirSync, writeFileSync } from "fs";
import { packageJson, testsuiteProperties } from "./create-structure-files";

export const createTestsuiteDirectory = (directory: string) => {
  mkdirSync(directory, { recursive: true });
};

export const createTestsuiteProperties = (path: string, suiteName: string) => {
  writeFileSync(
    `${path}/testsuite.properties`,
    testsuiteProperties(suiteName),
    { encoding: "utf8" }
  );
};

export const createTestsuiteSuite = (path: string) => {
  writeFileSync(`${path}/testsuite.suite`, "case1/check.js https://sakuli.io", {
    encoding: "utf8",
  });
};

export const createTestcaseDirectory = (path: string) => {
  mkdirSync(`${path}/case1`, { recursive: true });
};

export const createTestcaseFile = (path: string) => {
  writeFileSync(`${path}/case1/check.js`, "", { encoding: "utf8" });
};

export const createPackageJson = (path: string, suiteName: string) => {
  writeFileSync(`${path}/package.json`, packageJson(suiteName));
};
