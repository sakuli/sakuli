import {SakuliRunner, TestExecutionContext} from ".";
import {TestExecutionLifecycleHooks} from "./context-provider.interface";
import {TestScriptExecutor} from "./test-script-executor.interface";
import mockFs from 'mock-fs'
import {mockPartial} from "sneer";

describe('SakuliRunner', () => {

    const createContextProviderMock = (): jest.Mocked<TestExecutionLifecycleHooks> => ({
        onProject: jest.fn(),
        afterExecution: jest.fn(),
        requestContext: jest.fn(),
        afterRunFile: jest.fn(),
        beforeRunFile: jest.fn(),
        beforeExecution: jest.fn()
    });

    const createScriptExecutorMock = (): jest.Mocked<TestScriptExecutor> => ({
        execute: jest.fn((_, ctx) => ({...ctx}))
    });

    const testExecutionContext: TestExecutionContext = mockPartial<TestExecutionContext>({
        startTestCase: jest.fn(),
        endTestSuite: jest.fn(),
        startTestSuite: jest.fn(),
        getCurrentTestCase: jest.fn(),
        updateCurrentTestCase: jest.fn(),
        startExecution: jest.fn(),
        endExecution: jest.fn()
    });

    describe('basic execution flow', () => {
        let sakuliRunner: SakuliRunner;
        let ctxProvider1: jest.Mocked<TestExecutionLifecycleHooks>;
        let ctxProvider2: jest.Mocked<TestExecutionLifecycleHooks>;
        let scriptExecutor: jest.Mocked<TestScriptExecutor>;
        const projectWithThreeTestFiles = {
            rootDir: 'somedir',
            testFiles: [
                {path: 'root/test1.js'},
                {path: 'root/test2.js'},
                {path: 'root/test3.js'}
            ]
        };
        beforeEach(() => {
            ctxProvider1 = createContextProviderMock();
            ctxProvider2 = createContextProviderMock();
            scriptExecutor = createScriptExecutorMock();
            sakuliRunner = new SakuliRunner(
                [ctxProvider1, ctxProvider2],
                testExecutionContext,
                scriptExecutor
            );

            mockFs({
                somedir: {
                    root: {
                        'test1.js': 'done(); // test 1',
                        'test2.js': 'done(); // test 2',
                        'test3.js': 'done(); // test 3',
                    }
                }
            })
        });

        it('should tearUp all providers for each test', async done => {
            await sakuliRunner.execute(projectWithThreeTestFiles);
            expect(ctxProvider1.onProject).toHaveBeenCalledTimes(1);
            expect(ctxProvider1.onProject).toHaveBeenCalledWith(projectWithThreeTestFiles, testExecutionContext);

            expect(ctxProvider2.onProject).toHaveBeenCalledTimes(1);
            expect(ctxProvider2.onProject).toHaveBeenCalledWith(projectWithThreeTestFiles, testExecutionContext);
            done();
        });

        it('should tearDown all providers for each test', async done => {
            await sakuliRunner.execute(projectWithThreeTestFiles);

            expect(ctxProvider1.afterExecution).toHaveBeenCalledTimes(1);
            expect(ctxProvider2.afterExecution).toHaveBeenCalledTimes(1);
            done();
        });

        xit('should execute with a merged context object from all contextproviders', async done => {
            ctxProvider1.requestContext.mockReturnValue({ctx1: 'ctx1', common: 'ignore'});
            ctxProvider2.requestContext.mockReturnValue({ctx2: 'ctx2', common: 'overridden'});
            await sakuliRunner.execute(projectWithThreeTestFiles);
            expect(scriptExecutor.execute).toHaveBeenNthCalledWith(1, '// test 1', expect.anything());
            expect(scriptExecutor.execute).toHaveBeenNthCalledWith(2, '// test 2', expect.anything());
            expect(scriptExecutor.execute).toHaveBeenNthCalledWith(3, '// test 3', expect.anything());
            done();
        });

        it('should get all proceed contexts from execute', async done => {
            ctxProvider1.requestContext.mockReturnValue({ctx1: 'ctx1', common: 'ignore'});
            ctxProvider2.requestContext.mockReturnValue({ctx2: 'ctx2', common: 'overridden'});
            const result = await sakuliRunner.execute(projectWithThreeTestFiles);
            expect(result).toEqual(expect.objectContaining({
                common: 'overridden',
                ctx1: 'ctx1',
                ctx2: 'ctx2'
            }));
            done();
        });

        afterEach(() => {
            mockFs.restore()
        })
    })


});
