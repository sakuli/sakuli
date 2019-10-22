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
                stripIndents`
                testsuite.id=${TEST_SUITE}
                testsuite.browser=chrome
                #testsuite.name=\${testsuite.id}
                #testsuite.warningTime=0
                #testsuite.criticalTime=0
                #testsuite.uiOnly=false
                
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

    it("should create recursive directory for testsuite", () => {
        // GIVEN

        // WHEN
        createTestsuite(`${CUR_DIR}/foo`, TEST_SUITE);

        // THEN
        expect(readdirSync(`${CUR_DIR}/foo/${TEST_SUITE}`)).toEqual(["case1", "testsuite.properties", "testsuite.suite"]);

    });
});
