import { Argv, CommandModule } from "yargs";
import { CommandModuleProvider, SakuliCoreProperties, SakuliInstance } from "@sakuli/core";
import { ensure, ensurePath, ifPresent, invokeIfPresent, isPresent, Maybe, LogLevel } from "@sakuli/commons";
import chalk from "chalk";
import { testExecutionContextRenderer } from "../cli-utils/test-execution-context-renderer.function";
import { createLogConsumer } from "../create-log-consumer.function";
import { join } from "path";
import { renderError } from "./run-command/render-error.function";
import { renderErrorsFromContext } from "./run-command/render-errors-from-context.function";

export const runCommand: CommandModuleProvider = (sakuli: SakuliInstance): CommandModule => {
    return ({
        command: 'run [path]',
        describe: 'Runs a Sakuli Suite',
        builder(argv: Argv) {
            return argv.positional('path', {
                describe: 'path to Sakuli suite'
            }).demandOption('path');
        },

        async handler(runOptions: any) {

            const rendering = testExecutionContextRenderer(sakuli.testExecutionContext);
            let cleanLogConsumer: Maybe<() => void>;
            try {
                const project = await sakuli.initializeProject(runOptions);
                const coreProps = project.objectFactory(SakuliCoreProperties);

                console.log(chalk`Initialized Sakuli with {bold ${project.testFiles.length.toString()}} Testcases\n`);
                const logLevel = LogLevel[coreProps.logLevel.toUpperCase() as keyof typeof LogLevel];
                sakuli.testExecutionContext.logger.logLevel = ifPresent(logLevel,
                    () => logLevel,
                    () => LogLevel.INFO
                );
                const logPath = ensure<string>(coreProps.sakuliLogFolder, '');
                await ensurePath(logPath);
                const logFile = join(logPath, 'sakuli.log');
                console.log(chalk`Writing logs to: {bold.gray ${logFile}}`);
                cleanLogConsumer = createLogConsumer(
                    sakuli.testExecutionContext.logger,
                    logFile
                );

                await sakuli.run(project);
                await rendering;
                await ifPresent(sakuli.testExecutionContext.error, async error => {
                    console.log(chalk`Error during Execution: \n`);
                    await renderError(error);
                }, () => Promise.resolve());

               await renderErrorsFromContext(sakuli.testExecutionContext);
            } catch (e) {
                await renderError(e);
            } finally {
                invokeIfPresent(cleanLogConsumer);
                process.exit(sakuli.testExecutionContext.resultState)
            }
        }
    })
};
