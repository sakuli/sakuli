import { Project, ProjectLoader } from "@sakuli/core";
import { join } from "path";
import { readdirSync, readFileSync } from "fs";
import { parseSahiTestsuiteDefiniton } from "./parse-sahi-testsuite-definition.function";
import { DecoratedClassDefaultsSource, ifPresent, JavaPropertiesFileSource, throwIfAbsent, } from "@sakuli/commons";
import { LegacyProjectProperties } from "./legacy-project-properties.class";

export class LegacyLoader implements ProjectLoader {
  async readProperties(project: Project) {
    const path = project.rootDir;
    const rootdirContents = readdirSync(path);
    const parentdirContents = readdirSync(join(path, ".."));
    const files: string[] = [];
    ifPresent(
      parentdirContents.find((dir) => dir === "sakuli.properties"),
      (f) => files.push(join(path, "..", f))
    );

    const testsuitePropertiesFile = throwIfAbsent(
      rootdirContents.find((dir) => dir === "testsuite.properties"),
      new Error(`Unable to find file testsuite.properties in ${path}`)
    );
    files.push(join(path, testsuitePropertiesFile));
    await project.installPropertySource(new JavaPropertiesFileSource(files));
  }

  async load(project: Project): Promise<Project> {
    const path = project.rootDir;
    const rootDirContents = readdirSync(project.rootDir);
    await project.installPropertySource(
      new DecoratedClassDefaultsSource(LegacyProjectProperties)
    );
    await this.readProperties(project);
    const testsuiteSuiteFile = rootDirContents.find(
      (dir) => dir === "testsuite.suite"
    );
    const testSuiteFiles = ifPresent(
      testsuiteSuiteFile,
      (file) =>
        parseSahiTestsuiteDefiniton(readFileSync(join(path, file)).toString()),
      () => {
        throw Error(`Unable to find testsuite.suite in ${path}`);
      }
    );
    testSuiteFiles.forEach((tsf) => project.addTestFile(tsf));

    return project;
  }
}
