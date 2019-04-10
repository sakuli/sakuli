import {CommandModuleProvider} from "@sakuli/core";
import {Argv, CommandModule} from "yargs";


export const createCommand: CommandModuleProvider = (): CommandModule => {
    return ({
        command: 'create',
        describe: `Create new Sakuli objects`,
        builder(argv: Argv) {
            return argv.commandDir("./create-commands");
        },
        handler() {
        }
    });
};
