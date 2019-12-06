import { SakuliInstance, TestExecutionContext, Project } from "@sakuli/core";
import { mockPartial, mockRecursivePartial } from 'sneer'
import { runCommand } from "./run-command.function";
import { Argv, CommandModule } from 'yargs';
import { testExecutionContextRenderer } from "../cli-utils/test-execution-context-renderer.function";
import { SimpleLogger, LogLevel } from "@sakuli/commons/dist";

jest.mock('../cli-utils/test-execution-context-renderer.function', () => ({
    testExecutionContextRenderer: jest.fn()
}))

describe('runCommand', () => {

    let sakuli: SakuliInstance;
    let argv: Argv;
    let command: CommandModule<any, any>;
    let testExecutionContext: TestExecutionContext;
    let project: Project;
    let logger: SimpleLogger;
    let logLevelMock: jest.Mock;
    beforeEach(() => {
        argv = mockPartial<Argv>({
            positional: jest.fn().mockImplementation(() => argv),
            demandOption: jest.fn().mockImplementation(() => argv)
        })
        
        project = mockPartial<Project>({
            objectFactory: jest.fn(),
            testFiles: []
        });
        sakuli = mockRecursivePartial<SakuliInstance>({
            testExecutionContext: {
                entities: [],
                logger: {
                    logLevel: undefined
                }
            },
            run: jest.fn(),
            initializeProject: jest.fn().mockImplementation(() => project)
        });
        command = runCommand(sakuli);
    })

    it('should require path', () => {
        (command.builder as Function)(argv as any);
        expect(argv.demandOption).toHaveBeenCalledWith('path');
    })

    describe('handler', () => {
        const runOptions = Symbol('run-options-placeholder');
        let processExitMock: jest.Mock;
        beforeEach(async () => {
            processExitMock = (jest.spyOn(process, 'exit').mockImplementation((() => { }) as any) as any);
        });

        afterEach(() => {
            processExitMock.mockRestore();
        })

        it('handler should init renderer with sakuli context', async () => {
            await command.handler(runOptions);
            expect(testExecutionContextRenderer).toHaveBeenCalledWith(testExecutionContext);
        });

        it('should instantiate project with runoptions', async () => {
            await command.handler(runOptions);
            expect(sakuli.initializeProject).toHaveBeenCalledWith(runOptions);
            expect(project.objectFactory).toHaveBeenCalled();
        });

        it('should render how much files are detected', async () => {

        });

        it('should set loglevel', async () => {
            (<jest.Mock>project.objectFactory).mockReturnValue({
                logLevel: LogLevel.DEBUG
            })
            await command.handler(runOptions);
            expect(logLevelMock).toHaveBeenCalledWith('DEBUG');
        });
    })
});

