import {Argv, CommandModule} from "yargs";
import {CommandModuleProvider, Sakuli, SakuliRunOptions} from "@sakuli/core";

export const runCommand: CommandModuleProvider = (sakuli: Sakuli): CommandModule => {
    return ({
        command: 'run [path]',
        describe: 'Runs a Sakuli Suite',
        builder(argv: Argv) {
            return argv.positional('path', {
                describe: 'path to Sakuli suite'
            }).demandOption('path');
        },
        async handler(runOptions: SakuliRunOptions) {
            console.log('Running a test in ', runOptions.path);
            await sakuli.run(runOptions);
        }
    })
}