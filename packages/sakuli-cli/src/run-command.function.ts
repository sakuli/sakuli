import {Argv, CommandModule} from "yargs";
import {CommandModuleProvider, SakuliInstance, TestExecutionContext} from "@sakuli/core";
import {createCombinedLogConsumer, createFileLogConsumer, ifPresent, isPresent} from "@sakuli/commons";
import chalk from "chalk";
import {testExecutionContextRenderer} from "./cli-utils/test-execution-context-renderer.function";
import { EOL } from "os";

async function renderError(e: Error) {
    console.error(chalk.red(e.toString()));
    if(e.stack) {
        console.error(chalk.gray(e.stack.replace(e.toString(), '').trim()));
    }
}

export const runCommand: CommandModuleProvider = (sakuli: SakuliInstance): CommandModule => {
    function findError(testExecutionContext: TestExecutionContext) {
        return testExecutionContext.entities.find(e => isPresent(e.error));
    }

    return ({
        command: 'run [path]',
        describe: 'Runs a Sakuli Suite',
        builder(argv: Argv) {
            return argv.positional('path', {
                describe: 'path to Sakuli suite'
            }).demandOption('path');
        },

        async handler(runOptions: any) {
            const logConsumer = createCombinedLogConsumer(
                createFileLogConsumer({path: 'sakuli.log'})
            );
            const cleanLogConsumer = logConsumer(sakuli.testExecutionContext.logger);
            const rendering = testExecutionContextRenderer(sakuli.testExecutionContext);
            try {
                await sakuli.run(runOptions);
                await rendering;
                await ifPresent(sakuli.testExecutionContext.error, async error => {
                    console.log(chalk`Error during Execution: \n`);
                    await renderError(error);
                }, () => Promise.resolve());
                await ifPresent(findError(sakuli.testExecutionContext), async errorEntity => {
                    await ifPresent(errorEntity.error, async e => {
                        console.log(chalk`\n{underline Failed to successfully finish {yellow ${errorEntity.kind}} {yellow.bold ${errorEntity.id || ''}}}:\n`);
                        await renderError(e);
                    });
                }, () => Promise.resolve());
            } catch (e) {
                await renderError(e);
            } finally {
                cleanLogConsumer();
                process.exit(sakuli.testExecutionContext.resultState)
            }
        }
    })
};
