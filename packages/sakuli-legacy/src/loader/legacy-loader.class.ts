import { ProjectLoader, Project } from '@sakuli/core'
import { join } from 'path';
import { pathExists, readdir, readFileSync } from 'fs-extra';
import { parseSahiTestsuiteDefiniton } from './parse-sahi-testsuite-definition.function';
import { throwIfAbsent, ifPresent } from '@sakuli/commons';
import { marshallPropertiesToObject } from '../properties/marshall-properties-to-object.function';
import { LegacyProjectProperties } from './legacy-project-properties.class';
import PropertiesReader from 'properties-reader'
import { LegacyProject } from './legacy-project.class';

export class LegacyLoader implements ProjectLoader {

    async validateFileExists(path: string, errorMessage: string) {
        try {
            pathExists(path)
        } catch (e) {
            throw Error(errorMessage);
        }
    }

    async readProperties(path: string) {
        const rootdirContents = await readdir(path);
        const parentdirContents = await readdir(join(path, '..'));
        const sakuliProperties = ifPresent(
            parentdirContents.find(dir => dir === 'sakuli.properties'),
            f => PropertiesReader(join(path, '..', f)),
            () => null
        );

        const testsuitePropertiesFile = throwIfAbsent(
            rootdirContents.find(dir => dir === 'testsuite.properties'),
            new Error(`Unable to find file testsuite.properties in ${path}`)
        );

        const propertyReader = ifPresent(sakuliProperties, 
            p => p.append(join(path, testsuitePropertiesFile)),
            () => PropertiesReader(join(path, testsuitePropertiesFile))
        )

        return marshallPropertiesToObject(LegacyProjectProperties, propertyReader);
    }

    async load(path: string): Promise<LegacyProject> {
        const rootdirContents = await readdir(path);
        const properties = await this.readProperties(path);
        const testsuiteSuiteFile = rootdirContents.find(dir => dir === 'testsuite.suite');
        const testSuiteFiles = ifPresent(testsuiteSuiteFile, 
            file => parseSahiTestsuiteDefiniton(readFileSync(join(path, file)).toString()),
            () => { throw Error(`Unable to find testsuite.suite in ${path}`) }
        );
        
        return Promise.resolve({
            properties,
            rootDir: path,
            testFiles: testSuiteFiles
        });
    }

}