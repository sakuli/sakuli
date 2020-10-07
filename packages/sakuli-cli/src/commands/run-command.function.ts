import { Argv, CommandModule } from "yargs";
import {
  CommandModuleProvider,
  SakuliCoreProperties,
  SakuliInstance,
} from "@sakuli/core";
import {
  ensure,
  ensurePath,
  ifPresent,
  invokeIfPresent,
  LogLevel,
  Maybe,
} from "@sakuli/commons";
import chalk from "chalk";
import { testExecutionContextRenderer } from "../cli-utils/test-execution-context-renderer.function";
import { createLogConsumer } from "../create-log-consumer.function";
import { renderError } from "./run-command/render-error.function";
import { renderErrorsFromContext } from "./run-command/render-errors-from-context.function";

export const runCommand: CommandModuleProvider = (
  sakuli: SakuliInstance
): CommandModule => {
  return {
    command: "run [path]",
    describe: "Runs a Sakuli Suite",
    builder(argv: Argv) {
      return argv
        .positional("path", {
          describe: "path to Sakuli suite",
        })
        .demandOption("path");
    },

    async handler(runOptions: any) {
      let cleanLogConsumer: Maybe<() => void>;
      try {
        const project = await sakuli.initializeProject(runOptions);
        const coreProps = project.objectFactory(SakuliCoreProperties);
        const testContextRenderer = testExecutionContextRenderer(
          sakuli.testExecutionContext,
          coreProps
        );
        console.log(
          chalk`Initialized Sakuli with {bold ${project.testFiles.length.toString()}} Testcases\n`
        );
        const logLevel =
          LogLevel[
            (coreProps.logLevel || "").toUpperCase() as keyof typeof LogLevel
          ];
        sakuli.testExecutionContext.logger.logLevel = ifPresent(
          logLevel,
          () => logLevel,
          () => LogLevel.INFO
        );
        const logPath = ensure<string>(coreProps.sakuliLogFolder, "");
        await ensurePath(logPath);

        cleanLogConsumer = createLogConsumer(
          sakuli.testExecutionContext.logger,
          coreProps
        );

        sakuli.testExecutionContext.logger.info(
          `Loaded Sakuli with ${sakuli.presetProvider.map(
            (preset) => preset.name
          )}`
        );

        sakuli.testExecutionContext.logger.trace(
          `Starting project execution with Sakuli...`
        );
        await sakuli.run(project);
        sakuli.testExecutionContext.logger.trace(
          `Sakuli finished project execution.`
        );

        await testContextRenderer;

        await ifPresent(
          sakuli.testExecutionContext.error,
          async (error) => {
            console.log(chalk`Error during Execution: \n`);
            await renderError(error);
          },
          () => Promise.resolve()
        );

        await renderErrorsFromContext(sakuli.testExecutionContext);
        process.exitCode = sakuli.testExecutionContext.resultState;
      } catch (e) {
        await renderError(e);
        process.exitCode = 1;
      } finally {
        invokeIfPresent(cleanLogConsumer);
      }
    },
  };
};
