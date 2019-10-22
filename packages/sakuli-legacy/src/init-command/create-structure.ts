import { appendFileSync, mkdirSync } from "fs";
import {stripIndents} from 'common-tags';

export const createTestsuite = (directory: string, suiteName: string) => {
    const rootDir = directory + `/${suiteName}`;
    mkdirSync(rootDir, {recursive: true});
    appendFileSync(
        rootDir + '/testsuite.properties',
        stripIndents`testsuite.id=${suiteName}
        testsuite.browser=chrome`
    );
    appendFileSync(
        rootDir + '/testsuite.suite',
        'case1/check.js https://sakuli.io'
    );

    mkdirSync(rootDir + '/case1', {recursive: true});
    appendFileSync(rootDir + '/case1/check.js', "");
};