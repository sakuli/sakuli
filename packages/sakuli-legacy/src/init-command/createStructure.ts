import { appendFileSync, mkdirSync } from "fs";

export const createStructureAndFillConfig = (directory: string, suiteName: string, startUrl: string) => {
    const rootDir = directory + `/${suiteName}`;
    mkdirSync(rootDir, {recursive: true});
    appendFileSync(rootDir + '/testsuite.properties', `testsuite.id=${suiteName}\ntestsuite.browser=chrome`);
    appendFileSync(rootDir + '/testsuite.suite', `case1/check.js ${startUrl}`);

    mkdirSync(rootDir + '/case1', {recursive: true});
    appendFileSync(rootDir + '/case1/check.js', "");
};