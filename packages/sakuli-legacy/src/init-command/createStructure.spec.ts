import {createStructureAndFillConfig} from "./createStructure";
import {existsSync, readdir, readFileSync, rmdirSync, unlinkSync,} from "fs";

import {cwd} from "process";


const TESTDIR = cwd();
const SCHEMA = "/testScheme";
const newBaseDir = `${TESTDIR}/${SCHEMA}`;

describe("Schema test", () => {
    it("should create directory and files", () => {
        // SET UP
        clear(newBaseDir);

        // GIVEN

        // WHEN
        createStructureAndFillConfig(TESTDIR, SCHEMA, "url");

        // THEN
        readdir(newBaseDir, (err, files) => {
            expect(err).toBeNull();
            expect(files).toContain("testsuite.suite");
            expect(files).toContain("testsuite.properties");
            expect(files).toContain("case1");
        })
    });

    it("should fill the files with text", () => {
        // SET UP
        clear(newBaseDir);

        // GIVEN

        // WHEN
        createStructureAndFillConfig(TESTDIR, SCHEMA, "starturl");

        // THEN
        const contentProperties = readFileSync(`${newBaseDir}/testsuite.properties`, 'utf8');
        expect(contentProperties).toContain("testScheme");

        const contentSuite = readFileSync(`${newBaseDir}/testsuite.suite`, 'utf8');
        expect(contentSuite).toContain("case1/check.js starturl");
    });

    afterAll(() => clear(newBaseDir))
});

const clear = (baseDir : string) => {
    if (existsSync(baseDir)) {
        unlinkSync(baseDir + '/testsuite.suite');
        unlinkSync(baseDir + '/testsuite.properties');
        unlinkSync(baseDir + '/case1/check.js');
        rmdirSync(baseDir + '/case1');
        rmdirSync(baseDir);
    }
};
