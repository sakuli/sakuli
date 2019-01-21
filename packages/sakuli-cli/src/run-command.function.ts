import {Argv, CommandModule} from "yargs";
import {CommandModuleProvider, SakuliInstance, SakuliRunOptions, TestExecutionContext} from "@sakuli/core";
import renderExecution from "./components";
import {ifPresent, isPresent} from "@sakuli/commons";
import Youch from "youch";
import forTerminal from "youch-terminal";
import chalk from "chalk";

async function renderError(e: Error) {
    const youch = (new Youch(e, {}));
    const errorJson = await youch.toJSON().then(forTerminal);
    console.log(errorJson);
}

export const runCommand: CommandModuleProvider = (sakuli: SakuliInstance): CommandModule => {
    function findError(testExecutionContext: TestExecutionContext) {
        return testExecutionContext.entites.find(e => isPresent(e.error));
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
            const unmount = renderExecution(sakuli.testExecutionContext);
            const testExecutionContext = await sakuli.run(runOptions);
            try {
                await ifPresent(findError(testExecutionContext), async errorEntity => {
                    await ifPresent(errorEntity.error, async e => {
                        console.log(chalk`Failed to successfully finish {yellow ${errorEntity.kind}} {yellow.bold ${errorEntity.id || ''}}`);
                        await renderError(e);
                    });
                });
                setTimeout(() => {
                    unmount();
                    process.exit(testExecutionContext.resultState)
                }, 500);
            } catch(e) {
                await renderError(e);
            }
        }
    })
};