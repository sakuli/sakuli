import {Argv} from "yargs";
import {createStructureAndFillConfig} from "../../init-command/createStructure";

export = {
    command: 'project [directory] [suiteName] [url]',
    describe: 'Generates a default project structure',
    builder(argv: Argv) {
        return argv.positional('directory', {
            describe: 'path where the sakuli project should be created'
            }).demandOption('directory')
            .positional('suiteName', {
                describe: 'name of the testsuite',
                default: 'sakuli'
            })
            .positional('url', {
                describe: 'url of the test',
                default: 'https://sakuli.io'
            });
    },
    async handler(opts: any) {
        console.log("creating project structure");
        createStructureAndFillConfig(opts.directory, opts.suiteName, opts.url);
        process.exit(0);
    }
};