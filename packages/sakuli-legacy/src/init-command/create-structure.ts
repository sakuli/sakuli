import { mkdirSync, writeFileSync } from "fs";
import { stripIndent } from 'common-tags';

export const createTestsuite = (directory: string, suiteName: string) => {
    const rootDir = directory + `/${suiteName}`;
    mkdirSync(rootDir, {recursive: true});
    console.log(`Created directory ${suiteName}`);
    createTestsuiteProperties(rootDir, suiteName);
    createTestsuiteSuite(rootDir);
    createTestcaseInTestsuite(rootDir);
};

export const createPackageJson = (path: string, suiteName: string) => {
    const packageJson = {
        name: suiteName,
        version: "1.0.0",
        description: "",
        main: "index.js",
        scripts: {
            test: `sakuli run ${suiteName}`
        },
        author: "",
        license: "ISC",
        dependencies: {
            "@sakuli/cli": "^2.1.3",
        },
    };

    writeFileSync(`${path}/package.json`, JSON.stringify(packageJson, null, 4));
    console.log("Created file package.json")
};

const createTestsuiteProperties = (path: string, suiteName: string) => {
    writeFileSync(
        `${path}/testsuite.properties`,
        stripIndent`
        testsuite.id=${suiteName}
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
        `,
        {encoding: 'utf8'});
    console.log('Created file testsuite.properties');
};

const createTestsuiteSuite = (path: string) => {
    writeFileSync(`${path}/testsuite.suite`, 'case1/check.js https://sakuli.io', {encoding: 'utf8'});
    console.log('Created file testsuite.suite');
};

const createTestcaseInTestsuite = (path: string) => {
    mkdirSync(`${path}/case1`, {recursive: true});
    console.log('Created directory /case1');
    writeFileSync(`${path}/case1/check.js`, "", {encoding: 'utf8'});
    console.log('Created file /case1/check.js');
};