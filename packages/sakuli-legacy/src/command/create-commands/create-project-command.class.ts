import {Argv} from "yargs";
import {createTestsuite} from "../../init-command/createStructure";

export = {
    command: 'project [directory] [suiteName]',
    describe: 'Generates a default project structure',
    builder(argv: Argv) {
        return argv.positional('directory', {
            describe: 'path where the sakuli project should be created'
            }).demandOption('directory')
            .positional('suiteName', {
                describe: 'name of the testsuite',
                default: 'sakuli'
            });
    },
    async handler(opts: any) {
        console.log("creating project structure");
        createTestsuite(opts.directory, opts.suiteName);
        process.exit(0);
    }
};