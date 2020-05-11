import {
    createPackageJson,
    createTestcaseDirectory,
    createTestcaseFile,
    createTestsuiteDirectory,
    createTestsuiteProperties,
    createTestsuiteSuite,
} from "./create-structure";
import { existsSync, lstatSync, mkdtempSync, readdirSync, readFileSync, rmdirSync, unlinkSync, } from "fs";
import { stripIndents } from "common-tags";
import { join } from "path";
import { tmpdir } from "os";

describe("Scheme test", () => {
  const TEST_SUITE = "testsuite";
  let CUR_DIR: string;

  beforeEach(() => {
    CUR_DIR = mkdtempSync(join(tmpdir(), "testsuite-"));
  });

  afterEach(() => {
    deleteFolderRecursive(CUR_DIR);
  });

  it("should create testsuite directory", () => {
    // GIVEN

    // WHEN
    createTestsuiteDirectory(CUR_DIR);

    // THEN
    expect(existsSync(`${CUR_DIR}/${TEST_SUITE}`));
  });

  it("should create testsuite.properties with config", () => {
    // GIVEN

    // WHEN
    createTestsuiteProperties(CUR_DIR, TEST_SUITE);

    // THEN
    expect(readFileSync(`${CUR_DIR}/testsuite.properties`, "utf8")).toBe(
      stripIndents`
                testsuite.id=${TEST_SUITE}
                testsuite.browser=chrome
                #testsuite.name=\${testsuite.id}
                #testsuite.warningTime=0
                #testsuite.criticalTime=0
                #testsuite.uiOnly=false
                
                #log.level=INFO
                #sakuli.log.maxAge=14
                #sakuli.log.folder=\${sakuli.testsuite.folder}/_logs
                #sakuli.environment.similarity.default=0.99
                #sakuli.autoHighlight=false
                #sakuli.highlight.seconds=0.2
                #sakuli.typeDelay=300
                #sakuli.clickDelay=0.2
                #sakuli.encryption.key=""
                #sakuli.screenshot.onError=true
                #sakuli.screenshot.dir=\${sakuli.log.folder}/_screenshots
                `
    );
  });

  it("should create testsuite.suite with config", () => {
    // GIVEN

    // WHEN
    createTestsuiteSuite(CUR_DIR);

    // THEN
    expect(readFileSync(`${CUR_DIR}/testsuite.suite`, "utf8")).toBe(
      "case1/check.js https://sakuli.io"
    );
  });

  it("should create testcase directory", () => {
    // GIVEN

    // WHEN
    createTestcaseDirectory(CUR_DIR);

    // THEN
    expect(existsSync(`${CUR_DIR}/case1`));
  });

  it("should create empty check.js", () => {
    // GIVEN

    // WHEN
    createTestcaseDirectory(CUR_DIR);
    createTestcaseFile(CUR_DIR);

    // THEN
    expect(readFileSync(`${CUR_DIR}/case1/check.js`, "utf8")).toBe("");
  });

  it("should create recursive directory for testsuite", () => {
    // GIVEN

    // WHEN
    createTestcaseDirectory(`${CUR_DIR}/foo`);

    // THEN
    expect(existsSync(`${CUR_DIR}/foo/${TEST_SUITE}`));
  });

  it("should create package.json", () => {
    // GIVEN
    const packageJson = {
      name: TEST_SUITE,
      version: "1.0.0",
      description: "",
      main: "index.js",
      scripts: {
        test: `sakuli run ${TEST_SUITE}`,
      },
      author: "",
      license: "ISC",
      dependencies: {
        "@sakuli/cli": "^2.1.3",
      },
    };

    // WHEN
    createPackageJson(CUR_DIR, TEST_SUITE);

    // THEN
    expect(readFileSync(`${CUR_DIR}/package.json`, { encoding: "utf8" })).toBe(
      JSON.stringify(packageJson, null, 4)
    );
  });
});

const deleteFolderRecursive = (path: string) => {
  if (existsSync(path)) {
    readdirSync(path).forEach((file) => {
      const curPath = join(path, file);
      if (lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        unlinkSync(curPath);
      }
    });
    rmdirSync(path);
  }
};
