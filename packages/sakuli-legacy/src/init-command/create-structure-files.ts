import { stripIndent } from "common-tags";

export const packageJson = (suiteName: string) => {
    const json = {
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
    return JSON.stringify(json, null, 4);
};

export const testsuiteProperties = (suiteName: string) => {
    return stripIndent`
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
    `;
};