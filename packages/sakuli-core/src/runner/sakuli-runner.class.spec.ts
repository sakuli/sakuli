import {SakuliRunner, TestExecutionContext} from ".";
import {TestExecutionLifecycleHooks} from "./context-provider.interface";
import {TestScriptExecutor} from "./test-script-executor.interface";
import mockFs from 'mock-fs'
import {mockPartial} from "sneer";

type RequiredLifecycleHooks = Required<TestExecutionLifecycleHooks>;

describe('SakuliRunner', () => {

    const createContextProviderMock = (): jest.Mocked<TestExecutionLifecycleHooks> => ({
        onProject: jest.fn(),
        afterExecution: jest.fn(),
        requestContext: jest.fn(),
        afterRunFile: jest.fn(),
        beforeRunFile: jest.fn(),
        beforeExecution: jest.fn(),
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
        endExecution: jest.fn(),
        getCurrentTestAction: jest.fn(),
        getCurrentTestSuite: jest.fn()
    });

    describe('basic execution flow', () => {
        let sakuliRunner: SakuliRunner;
        let lifecycleHooks1: jest.Mocked<TestExecutionLifecycleHooks>;
        let lifecycleHooks2: jest.Mocked<TestExecutionLifecycleHooks>;
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
            lifecycleHooks1 = createContextProviderMock();
            lifecycleHooks2 = createContextProviderMock();
            scriptExecutor = createScriptExecutorMock();
            sakuliRunner = new SakuliRunner(
                [lifecycleHooks1, lifecycleHooks2],
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
            expect(lifecycleHooks1.onProject).toHaveBeenCalledTimes(1);
            expect(lifecycleHooks1.onProject).toHaveBeenCalledWith(projectWithThreeTestFiles, testExecutionContext);

            expect(lifecycleHooks2.onProject).toHaveBeenCalledTimes(1);
            expect(lifecycleHooks2.onProject).toHaveBeenCalledWith(projectWithThreeTestFiles, testExecutionContext);
            done();
        });

        it('should tearDown all providers for each test', async done => {
            await sakuliRunner.execute(projectWithThreeTestFiles);

            expect(lifecycleHooks1.afterExecution).toHaveBeenCalledTimes(1);
            expect(lifecycleHooks2.afterExecution).toHaveBeenCalledTimes(1);
            done();
        });

        it('should execute with a merged context object from all lifecyclehooks', async done => {
            lifecycleHooks1.requestContext!.mockReturnValue(Promise.resolve({ctx1: 'ctx1', common: 'ignore'}));
            lifecycleHooks2.requestContext!.mockReturnValue(Promise.resolve({ctx2: 'ctx2', common: 'overridden'}));
            await sakuliRunner.execute(projectWithThreeTestFiles);
            const expectedContext = expect.objectContaining({
                ctx1: 'ctx1',
                ctx2: 'ctx2',
                common: 'overridden'
            });
            expect(scriptExecutor.execute).toHaveBeenNthCalledWith(1, 'done(); // test 1', expectedContext, expect.anything());
            expect(scriptExecutor.execute).toHaveBeenNthCalledWith(2, 'done(); // test 2', expectedContext, expect.anything());
            expect(scriptExecutor.execute).toHaveBeenNthCalledWith(3, 'done(); // test 3', expectedContext, expect.anything());
            done();
        });

        it('should get all proceed contexts from execute', async () => {
            lifecycleHooks1.requestContext!.mockReturnValue(Promise.resolve({ctx1: 'ctx1', common: 'ignore'}));
            lifecycleHooks2.requestContext!.mockReturnValue(Promise.resolve({ctx2: 'ctx2', common: 'overridden'}));
            const result = await sakuliRunner.execute(projectWithThreeTestFiles);
            return expect(result).toEqual(expect.objectContaining({
                common: 'overridden',
                ctx1: 'ctx1',
                ctx2: 'ctx2'
            }));
        });

        it('should call beforeRunFile of lifecyclehooks for each file', async done => {
            await sakuliRunner.execute(projectWithThreeTestFiles);
            expect(lifecycleHooks1.beforeRunFile).toHaveBeenCalledTimes(3);
            expect(lifecycleHooks2.beforeRunFile).toHaveBeenCalledTimes(3);
            done();
        });

        it('should call afterRunFile of lifecyclehooks for each file', async done => {
            await sakuliRunner.execute(projectWithThreeTestFiles);
            expect(lifecycleHooks1.afterRunFile).toHaveBeenCalledTimes(3);
            expect(lifecycleHooks2.afterRunFile).toHaveBeenCalledTimes(3);
            done();
        });

        afterEach(() => {
            mockFs.restore()
        })
    })


});
