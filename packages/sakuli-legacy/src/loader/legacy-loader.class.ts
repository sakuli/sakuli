import {Project, ProjectLoader} from '@sakuli/core'
import {join} from 'path';
import {readdir,  readFileSync,} from 'fs-extra';
import {parseSahiTestsuiteDefiniton} from './parse-sahi-testsuite-definition.function';
import {ifPresent, JavaPropertiesFileSource, throwIfAbsent} from '@sakuli/commons';

export class LegacyLoader implements ProjectLoader {

    async readProperties(project: Project) {
        const path = project.rootDir;
        const rootdirContents = await readdir(path);
        const parentdirContents = await readdir(join(path, '..'));
        const files: string[] = [];
        ifPresent(parentdirContents.find(dir => dir === 'sakuli.properties'),
            f => files.push(join(path, '..', f)),
        );

        const testsuitePropertiesFile = throwIfAbsent(
            rootdirContents.find(dir => dir === 'testsuite.properties'),
            new Error(`Unable to find file testsuite.properties in ${path}`)
        );
        files.push(testsuitePropertiesFile);
        await project.installPropertySource(new JavaPropertiesFileSource(files));
    }

    async load(project: Project): Promise<Project> {
        const path = project.rootDir;
        const rootDirContents = await readdir(project.rootDir);
        await this.readProperties(project);
        const testsuiteSuiteFile = rootDirContents.find(dir => dir === 'testsuite.suite');
        const testSuiteFiles = ifPresent(testsuiteSuiteFile,
            file => parseSahiTestsuiteDefiniton(readFileSync(join(path, file)).toString()),
            () => { throw Error(`Unable to find testsuite.suite in ${path}`) }
        );
        testSuiteFiles.forEach(tsf => project.addTestFile(tsf));

        return project;
    }

}