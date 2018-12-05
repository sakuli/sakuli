import {Sakuli} from "@sakuli/core";
import {CommandModule, Argv} from 'yargs'

export function migrationCommandProvider(sakuli: Sakuli): CommandModule {
    return ({
        command: 'migrate [path]',
        describe: 'Transforms all legacy testsuites into new syntax',
        handler(args: Argv) {
            console.log('Will migrate');
        }
    })
}