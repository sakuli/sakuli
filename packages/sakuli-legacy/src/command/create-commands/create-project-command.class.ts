import {Argv} from "yargs";
import {createTestsuite} from "../../init-command/create-structure";

export = {
    command: 'project [path] [suiteName]',
    describe: 'Generates a default project structure',
    builder(argv: Argv) {
        return argv.positional('path', {
                describe: 'Path to create testsuite',
                default: process.cwd(),
            })
            .positional('suiteName', {
                describe: 'Name of testsuite',
                default: 'sakuli',
            });
    },
    async handler(opts: any) {
        console.log("creating project structure");
        createTestsuite(opts.directory, opts.suiteName);
        process.exit(0);
    }
};