import { Project } from "@sakuli/core";
import { Argv, CommandModule } from "yargs";
import { LegacyLoader } from "..";
import { join } from "path";
import { migrateV1Code } from "./legacy-migration.function";
import { readFileSync, writeFileSync } from "fs";

export function migrationCommandProvider(): CommandModule {
  return {
    command: "migrate [path]",
    describe: "Transforms all legacy testsuites into new syntax",
    builder(argv: Argv) {
      return argv
        .positional("path", {
          describe: "path to a legacy suite",
        })
        .demandOption("path");
    },
    async handler({ path }: any) {
      console.log(`Will migrate ${path} :)`);
      const project: Project = new Project(path);
      try {
        const loader = new LegacyLoader();
        const legacyProject = await loader.load(project);
        legacyProject.testFiles
          .map((file) => join(project.rootDir, file.path))
          .forEach((file) => {
            console.log("Migrating " + file);
            try {
              const v1Code = readFileSync(file).toString();
              const v2Code = migrateV1Code(v1Code);
              const newFile = file + ".new";

              console.log(`Writing output to ${newFile}`);
              writeFileSync(newFile, v2Code);
            } catch (e) {
              console.error(
                `Failed to load file ${file}. Reason: ${e.message}`
              );
            }
          });
        console.log("Migration done");
      } catch (e) {
        console.error(
          `Failed to load project from ${path}. Reason: ${e.message}`
        );
      }
    },
  };
}
