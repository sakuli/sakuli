import {Argv, CommandModule} from "yargs";
import {CommandModuleProvider, Sakuli, SakuliInstance, SakuliRunOptions, TestExecutionContext} from "@sakuli/core";
import renderExecution from "./components";
import {ifPresent, isPresent} from "@sakuli/commons";
import Youch from "youch";
import forTerminal from "youch-terminal";
import chalk from "chalk";

export const runCommand: CommandModuleProvider = (sakuli: SakuliInstance): CommandModule => {
    function findError(tect: TestExecutionContext) {
        return Sakuli().testExecutionContext.entites.find(e => isPresent(e.error));
    }

    return ({
        command: 'run [path]',
        describe: 'Runs a Sakuli Suite',
        builder(argv: Argv) {
            return argv.positional('path', {
                describe: 'path to Sakuli suite'
            }).demandOption('path');
        },

        async handler(runOptions: SakuliRunOptions) {
            const unmount = renderExecution();
            const testExecutionContext = await sakuli.run(runOptions);
            await new Promise(res => setTimeout(() => {unmount(); res();}, 500));
            ifPresent(findError(testExecutionContext), errorEntity => {
                ifPresent(errorEntity.error, async e => {
                    const youch = (new Youch(e, {}));
                    const errorJson = await youch.toJSON().then(forTerminal);
                    process.stdout.write(chalk`Failed to successfully finish {yellow ${errorEntity.kind}} {yellow.bold ${errorEntity.id || ''}}`);
                    process.stdout.write(errorJson);

                })
            })
            process.exit(testExecutionContext.resultState)
        }
    })
};