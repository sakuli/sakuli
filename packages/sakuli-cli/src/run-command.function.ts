import {Argv, CommandModule} from "yargs";
import {CommandModuleProvider, SakuliInstance, TestExecutionContext} from "@sakuli/core";
import {ifPresent, isPresent} from "@sakuli/commons";
import Youch from "youch";
import forTerminal from "youch-terminal";
import chalk from "chalk";
import {createWriteStream} from "fs";
import {testExecutionContextRenderer} from "./cli-utils/test-execution-context-renderer.function";
import * as os from "os";

async function renderError(e: Error) {
    const youch = (new Youch(e, {}));
    const errorJson = await youch.toJSON().then(forTerminal);
    console.log(errorJson);
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
            const logStream = createWriteStream('sakuli.log', {flags: 'a'});
            sakuli.testExecutionContext.logger.onEvent(e => {
                try {
                    logStream.write(`[${e.time}] ${e.level} ${e.message}`);
                    logStream.write(os.EOL);
                    e.data.forEach(d => {
                        logStream.write(`${JSON.stringify(d, null, 2)}`);
                        logStream.write(os.EOL);
                    });
                } catch (e) {
                    // ignore
                }
            });
            const rendering = testExecutionContextRenderer(sakuli.testExecutionContext);
            const testExecutionContext = await sakuli.run(runOptions);
            await rendering;
            try {
                await ifPresent(testExecutionContext.error, async error => {
                    console.log(chalk`Error during Execution: \n`);
                    await renderError(error);
                });
                await ifPresent(findError(testExecutionContext), async errorEntity => {
                    await ifPresent(errorEntity.error, async e => {
                        console.log(chalk`Failed to successfully finish {yellow ${errorEntity.kind}} {yellow.bold ${errorEntity.id || ''}}`);
                        await renderError(e);
                    });
                });
            } catch (e) {
                await renderError(e);
            } finally {
                logStream.close();
                process.exit(testExecutionContext.resultState)
            }
        }
    })
};