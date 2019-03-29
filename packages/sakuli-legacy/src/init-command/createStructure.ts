import {openSync, appendFileSync, mkdirSync, writeSync, readFileSync} from "fs";

export const createStructureAndFillConfig = (directory: string, suitName: string, startUrl: string) => {
    const newDir = directory + '/' + suitName;
    createStructure(newDir);
    fillProperties(newDir + '/testsuite.properties',
        readAndReplaceConfigFile('src/init-command/config/testsuite.properties', newDir));

    fillProperties(newDir + '/testsuite.suite', 'case1/check.js ' + startUrl);
};

const fillProperties = (filePath: string, input: string) => {
    const file = openSync(filePath, 'w');
    writeSync(file, new Buffer(input))
};

const createStructure = (directory: string) => {
    mkdirSync(directory, {recursive: true});
    appendFileSync(directory + '/testsuite.properties', "");
    appendFileSync(directory + '/testsuite.suite', "");

    mkdirSync(directory + '/case1', {recursive: true});
    appendFileSync(directory + '/case1/check.js', "");
};

const readAndReplaceConfigFile = (dir: string, prop: string) => {
    const content = readFileSync(dir, 'utf8');
    return content.replace(/{{suiteName}}/g, prop);

};
