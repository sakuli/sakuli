import { LogMode, Project, SakuliCoreProperties, SakuliInstance, SakuliPresetProvider, } from "@sakuli/core";
import { mockPartial, mockRecursivePartial } from "sneer";
import { runCommand } from "./run-command.function";
import { ArgumentsCamelCase, Argv, CommandModule } from "yargs";
import { testExecutionContextRenderer } from "../cli-utils/test-execution-context-renderer.function";
import * as ensurePathModule from "@sakuli/commons/dist/fs/ensure-path.function";
import { ensurePath, LogLevel } from "@sakuli/commons";
import chalk from "chalk";
import { createLogConsumer } from "../create-log-consumer.function";
import { renderErrorsFromContext } from "./run-command/render-errors-from-context.function";
import { renderError } from "./run-command/render-error.function";

jest.mock("../cli-utils/test-execution-context-renderer.function", () => ({
  testExecutionContextRenderer: jest.fn(),
}));

jest.mock("../create-log-consumer.function", () => ({
  createLogConsumer: jest.fn(),
}));

jest.mock("./run-command/render-errors-from-context.function", () => ({
  renderErrorsFromContext: jest.fn(),
}));

jest.mock("./run-command/render-error.function", () => ({
  renderError: jest.fn(),
}));

describe("runCommand", () => {
  let sakuli: SakuliInstance;
  let argv: Argv;
  let command: CommandModule<any, any>;
  let project: Project;
  let logLevelMock: jest.Mock;
  let preset: SakuliPresetProvider;
  beforeEach(() => {
    jest.resetAllMocks();
    argv = mockPartial<Argv>({
      positional: jest.fn().mockImplementation(() => argv),
      demandOption: jest.fn().mockImplementation(() => argv),
    });

    project = mockRecursivePartial<Project>({
      objectFactory: jest.fn(),
      testFiles: [{ path: "" }, { path: "" }],
    });
    preset = mockPartial<SakuliPresetProvider>({
      name: "sakuliPreset",
    });
    sakuli = mockRecursivePartial<SakuliInstance>({
      testExecutionContext: {
        entities: [],
        logger: {
          info: jest.fn(),
          trace: jest.fn(),
          logLevel: undefined,
        },
        resultState: 4,
      },
      presetProvider: [preset],
      run: jest.fn(),
      initializeProject: jest.fn().mockImplementation(() => project),
    });
    logLevelMock = jest.fn();
    Object.defineProperty(sakuli.testExecutionContext.logger, "logLevel", {
      get: () => logLevelMock(),
      set: (v) => logLevelMock(v),
    });
    command = runCommand(sakuli);
  });

  afterEach(() => jest.restoreAllMocks());

  it("should require path", () => {
    (command.builder as Function)(argv as any);
    expect(argv.demandOption).toHaveBeenCalledWith("path");
  });

  describe("handler", () => {
    const runOptions: ArgumentsCamelCase = {_: [], $0: "run-options-placeholder"};
    let processExitMock: jest.Mock;
    const properties = mockPartial<SakuliCoreProperties>({
      sakuliLogFolder: "sakuli/log/folder",
      logMode: LogMode.LOG_FILE,
    });
    beforeEach(async () => {
      processExitMock = jest
        .spyOn(process, "exit")
        .mockImplementation((() => {}) as any) as any;
      jest
        .spyOn(ensurePathModule, "ensurePath")
        .mockImplementation(async () => {});
      (<jest.Mock>project.objectFactory).mockReturnValue(properties);
    });

    afterEach(() => {
      processExitMock.mockRestore();
    });

    it("should init renderer with sakuli context", async () => {
      await command.handler(runOptions);
      expect(testExecutionContextRenderer).toHaveBeenCalledWith(
        sakuli.testExecutionContext,
        properties
      );
    });

    it("should instantiate project with runoptions", async () => {
      await command.handler(runOptions);
      expect(sakuli.initializeProject).toHaveBeenCalledWith(runOptions);
      expect(project.objectFactory).toHaveBeenCalled();
    });

    it("should render how much files are detected", async () => {
      jest.spyOn(console, "log");
      await command.handler(runOptions);
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(chalk`{bold 2} Testcases`)
      );
    });

    it("should set loglevel to info if not defined", async () => {
      (<jest.Mock>project.objectFactory).mockReturnValue({
        logLevel: "",
      });
      await command.handler(runOptions);
      expect(logLevelMock).toHaveBeenCalledWith(LogLevel.INFO);
    });

    it("should set loglevel", async () => {
      (<jest.Mock>project.objectFactory).mockReturnValue({
        logLevel: "DEBUG",
      });
      await command.handler(runOptions);
      expect(logLevelMock).toHaveBeenCalledWith(LogLevel.DEBUG);
    });

    it("should ensure logpath", async () => {
      (<jest.Mock>project.objectFactory).mockReturnValue({
        sakuliLogFolder: "sakuli/log/folder",
      });
      await command.handler(runOptions);
      expect(ensurePath).toHaveBeenCalledWith("sakuli/log/folder");
    });

    it("should initialize a logConsumer", async () => {
      //GIVEN
      const sakuliCoreProperties = mockPartial<SakuliCoreProperties>({
        sakuliLogFolder: "sakuli/log/folder",
      });
      (<jest.Mock<SakuliCoreProperties>>project.objectFactory).mockReturnValue(
        sakuliCoreProperties
      );

      //WHEN
      await command.handler(runOptions);

      //THEN
      expect(createLogConsumer).toHaveBeenCalledWith(
        sakuli.testExecutionContext.logger,
        sakuliCoreProperties
      );
    });

    it("should call sakuli run", async () => {
      await command.handler(runOptions);
      expect(sakuli.run).toHaveBeenCalledWith(project);
      expect(sakuli.testExecutionContext.logger.info).toHaveBeenCalledWith(
        `Loaded Sakuli with ${preset.name}`
      );
    });

    it("should call render errors from context", async () => {
      await command.handler(runOptions);
      expect(renderErrorsFromContext).toHaveBeenLastCalledWith(
        sakuli.testExecutionContext
      );
    });

    it("should exit the process with sakulis resultState", async () => {
      await command.handler(runOptions);
      expect(process.exit).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(sakuli.testExecutionContext.resultState);
    });

    it("should exit with 1 when an error occurs during execution", async () => {
      const dummyError = Error("Dummy");
      (<jest.Mock>createLogConsumer).mockImplementation(() => {
        throw dummyError;
      });
      await command.handler(runOptions);
      expect(renderError).toHaveBeenCalledWith(dummyError);
      expect(process.exit).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(1);
    });
  });
});
