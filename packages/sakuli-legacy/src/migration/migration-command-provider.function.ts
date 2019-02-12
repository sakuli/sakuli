import {SakuliInstance} from "@sakuli/core";
import {Argv, CommandModule} from 'yargs'
import {LegacyLoader} from "..";
import {join} from "path";
import {migrateV1Code} from "./legacy-migration.function";
import {readFileSync, writeFileSync} from "fs";

export function migrationCommandProvider(sakuli: SakuliInstance): CommandModule {
    return ({
        command: 'migrate [path]',
        describe: 'Transforms all legacy testsuites into new syntax',
        builder(argv: Argv) {
            return argv.positional('path', {
                describe: 'path to a legacy suite'
            }).demandOption('path');
        },
        async handler({path}: any) {
            console.log(`Will migrate ${path} :)`);
            const loader = new LegacyLoader();
            const project = await loader.load(path);
            project.testFiles
                .map(file => join(process.cwd(), project.rootDir, file.path))
                .forEach(file => {
                    const v1Code = readFileSync(file).toString();
                    const v2Code = migrateV1Code(v1Code);

                    console.log('migrating ' + file);
                    writeFileSync(file, v1Code);
                    writeFileSync(file + '.new', v2Code);
                });
            console.log('Migration done');
        }
    })
}