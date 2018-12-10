import {SakuliInstance} from "@sakuli/core";
import {CommandModule, Argv} from 'yargs'

export function migrationCommandProvider(sakuli: SakuliInstance): CommandModule {
    return ({
        command: 'migrate [path]',
        describe: 'Transforms all legacy testsuites into new syntax',
        handler(args: Argv) {
            console.log('Will migrate');
        }
    })
}