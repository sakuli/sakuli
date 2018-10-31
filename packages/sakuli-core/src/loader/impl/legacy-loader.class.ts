import { ProjectLoader } from "../loader.interface";
import { Testsuite } from "../model/testsuite.class";
import { readdir } from '../../util/fs.utils';
import { Project } from "../model/project.class";
import { join } from "path";
import { parseSahiTestsuiteDefiniton } from "./parse-sahi-testsuite-definition.function";
import { readSync, readFileSync } from "fs";

export class LegacyLoader implements ProjectLoader {

    async load(path: string): Promise<Project> {                
        const rootdirContents = await readdir(path);        
        const parentdirContents = await readdir(join('..', path));
        const sakuliPropertiesFile = parentdirContents.find(dir => dir === 'sakuli.properties');
        const testsuitePropertiesFile = parentdirContents.find(dir => dir === 'testsuite.properties');
        const testsuiteSuiteFile = rootdirContents.find(dir => dir === 'testsuite.suite');

        const testSuiteFiles = parseSahiTestsuiteDefiniton(readFileSync(join(path, testsuiteSuiteFile)).toString());

        
        return Promise.resolve(null);
    }

    

}