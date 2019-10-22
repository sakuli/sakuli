import {Argv} from "yargs";
import {createTestsuite} from "../../init-command/create-structure";
import chalk from "chalk";

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
        try {
            console.log(`creating project structure ${opts.path}`);
            createTestsuite(opts.directory, opts.suiteName);
            process.exit(0);
        } catch (e) {
            console.log(chalk`{red.bold An error occured}: ${e}`);
            process.exit(-1);
        }
    }
};