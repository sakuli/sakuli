import { createTestsuite } from "./create-structure";
import { readdirSync, readFileSync } from "fs";
import { stripIndents } from 'common-tags';
import { tmpdir } from "os";
import mock from "mock-fs";

describe("Scheme test", () => {
    const TEST_SUITE = "testsuite";
    const CUR_DIR = tmpdir();
    const TEST_SUITE_DIR = `${CUR_DIR}/${TEST_SUITE}`;

    beforeEach(() => {
        mock();
    });

    afterEach(() => {
        mock.restore();
    });

    it("should create files and directory in testsuite", () => {
        // GIVEN

        // WHEN
        createTestsuite(CUR_DIR, TEST_SUITE);

        // THEN
        expect(readdirSync(TEST_SUITE_DIR)).toEqual(["case1", "testsuite.properties", "testsuite.suite"]);
    });

    it("should create file in testcase", () => {
        // GIVEN

        // WHEN
        createTestsuite(CUR_DIR, TEST_SUITE);

        // THEN
        expect(readdirSync(`${TEST_SUITE_DIR}/case1`)).toEqual(["check.js"]);
    });

    it("should create testsuite.properties with config", () => {
        // GIVEN

        // WHEN
        createTestsuite(CUR_DIR, TEST_SUITE);

        // THEN
        expect(readFileSync(`${TEST_SUITE_DIR}/testsuite.properties`, 'utf8'))
            .toBe(
                stripIndents`testsuite.id=${TEST_SUITE}
                testsuite.browser=chrome`
            );
    });

    it("should create testsuite.suite with config", () => {
        // GIVEN

        // WHEN
        createTestsuite(CUR_DIR, TEST_SUITE);

        // THEN
        expect(readFileSync(`${TEST_SUITE_DIR}/testsuite.suite`, 'utf8'))
            .toBe("case1/check.js https://sakuli.io");
    });

    it("should create empty check.js", () => {
        // GIVEN

        // WHEN
        createTestsuite(CUR_DIR, TEST_SUITE);

        // THEN
        expect(readFileSync(`${TEST_SUITE_DIR}/case1/check.js`, 'utf8'))
            .toBe("");
    });
});
