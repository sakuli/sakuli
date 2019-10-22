import { mkdirSync, writeFileSync } from "fs";
import { stripIndent } from 'common-tags';

export const createTestsuite = (directory: string, suiteName: string) => {
    const rootDir = directory + `/${suiteName}`;
    mkdirSync(rootDir, {recursive: true});
    createTestsuiteProperties(rootDir, suiteName);
    createTestsuiteSuite(rootDir);
    createTestcaseInTestsuite(rootDir);
};

const createTestsuiteProperties = (path: string, suiteName: string) => {
    writeFileSync(
        `${path}/testsuite.properties`,
        stripIndent`
        testsuite.id=${suiteName}
        testsuite.browser=chrome
        `,
        {encoding: 'utf8'});
};

const createTestsuiteSuite = (path: string) => {
    writeFileSync(`${path}/testsuite.suite`, 'case1/check.js https://sakuli.io', {encoding: 'utf8'});
};

const createTestcaseInTestsuite = (path: string) => {
    mkdirSync(`${path}/case1`, {recursive: true});
    writeFileSync(`${path}/case1/check.js`, "", {encoding: 'utf8'});
};