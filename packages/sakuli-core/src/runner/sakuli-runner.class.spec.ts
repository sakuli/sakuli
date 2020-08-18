import { SakuliRunner, TestExecutionContext } from ".";
import { TestExecutionLifecycleHooks } from "./context-provider.interface";
import { TestScriptExecutor } from "./test-script-executor.interface";
import { mockPartial } from "sneer";
import { Project } from "../loader/model";
import { tmpdir } from "os";
import { join, sep } from "path";
import { promises as fs } from "fs";
import Mocked = jest.Mocked;
import { SimpleLogger } from "@sakuli/commons";

describe("SakuliRunner", () => {
  let tempDir: string;
  beforeEach(async () => (tempDir = await fs.mkdtemp(`${tmpdir()}${sep}`)));
  afterEach(async () => fs.unlink(tempDir).catch(() => {}));

  const createContextProviderMock = (): jest.Mocked<
    TestExecutionLifecycleHooks
  > => ({
    onProject: jest.fn(),
    afterExecution: jest.fn(),
    requestContext: jest.fn(),
    afterRunFile: jest.fn(),
    beforeRunFile: jest.fn(),
    beforeExecution: jest.fn(),
  });

  const createScriptExecutorMock = (): Mocked<TestScriptExecutor> =>
    mockPartial<TestScriptExecutor>({
      execute: jest.fn((_: any, ctx: any) => Promise.resolve({ ...ctx })),
    }) as Mocked<TestScriptExecutor>;

  const testExecutionContext: TestExecutionContext = mockPartial<
    TestExecutionContext
  >({
    startTestCase: jest.fn(),
    endTestSuite: jest.fn(),
    startTestSuite: jest.fn(),
    getCurrentTestCase: jest.fn(),
    updateCurrentTestCase: jest.fn(),
    startExecution: jest.fn(),
    endExecution: jest.fn(),
    getCurrentTestAction: jest.fn(),
    getCurrentTestSuite: jest.fn(),
    logger: mockPartial<SimpleLogger>({
      trace: jest.fn(),
    }),
  });

  let sakuliRunner: SakuliRunner;
  let lifecycleHooks1: jest.Mocked<TestExecutionLifecycleHooks>;
  let lifecycleHooks2: jest.Mocked<TestExecutionLifecycleHooks>;
  let scriptExecutor: jest.Mocked<TestScriptExecutor>;
  let projectWithThreeTestFiles: Project;

  beforeEach(async () => {
    await fs.mkdir(join(tempDir, "somedir/root"), { recursive: true });
    for (let i of [1, 2, 3]) {
      await fs.writeFile(
        join(tempDir, `somedir/root/test${i}.js`),
        `done(); // test ${i}`
      );
    }
    lifecycleHooks1 = createContextProviderMock();
    lifecycleHooks2 = createContextProviderMock();
    scriptExecutor = createScriptExecutorMock();
    projectWithThreeTestFiles = mockPartial<Project>({
      rootDir: join(tempDir, "somedir"),
      testFiles: [
        { path: "root/test1.js" },
        { path: "root/test2.js" },
        { path: "root/test3.js" },
      ],
    });
    sakuliRunner = new SakuliRunner(
      [lifecycleHooks1, lifecycleHooks2],
      testExecutionContext,
      scriptExecutor
    );
  });

  it("should tearUp all providers for each test", async (done) => {
    await sakuliRunner.execute(projectWithThreeTestFiles);
    expect(lifecycleHooks1.onProject).toHaveBeenCalledTimes(1);
    expect(lifecycleHooks1.onProject).toHaveBeenCalledWith(
      projectWithThreeTestFiles,
      testExecutionContext
    );

    expect(lifecycleHooks2.onProject).toHaveBeenCalledTimes(1);
    expect(lifecycleHooks2.onProject).toHaveBeenCalledWith(
      projectWithThreeTestFiles,
      testExecutionContext
    );
    done();
  });

  it("should tearDown all providers for each test", async (done) => {
    await sakuliRunner.execute(projectWithThreeTestFiles);
    expect(lifecycleHooks1.afterExecution).toHaveBeenCalledTimes(1);
    expect(lifecycleHooks2.afterExecution).toHaveBeenCalledTimes(1);
    done();
  });

  it("should execute with a merged context object from all lifecyclehooks", async (done) => {
    (lifecycleHooks1.requestContext as jest.Mock).mockReturnValue(
      Promise.resolve({
        ctx1: "ctx1",
        common: "ignore",
      }) as any
    );
    (lifecycleHooks2.requestContext as jest.Mock).mockReturnValue(
      Promise.resolve({
        ctx2: "ctx2",
        common: "overridden",
      }) as any
    );
    await sakuliRunner.execute(projectWithThreeTestFiles);
    const expectedContext = expect.objectContaining({
      ctx1: "ctx1",
      ctx2: "ctx2",
      common: "overridden",
      ...global,
    });
    expect(scriptExecutor.execute).toHaveBeenNthCalledWith(
      1,
      "done(); // test 1",
      expectedContext,
      expect.anything()
    );
    expect(scriptExecutor.execute).toHaveBeenNthCalledWith(
      2,
      "done(); // test 2",
      expectedContext,
      expect.anything()
    );
    expect(scriptExecutor.execute).toHaveBeenNthCalledWith(
      3,
      "done(); // test 3",
      expectedContext,
      expect.anything()
    );
    done();
  });

  it("should get all proceed contexts from execute", async () => {
    (lifecycleHooks1.requestContext as jest.Mock).mockReturnValue(
      Promise.resolve({
        ctx1: "ctx1",
        common: "ignore",
      }) as any
    );
    (lifecycleHooks2.requestContext as jest.Mock).mockReturnValue(
      Promise.resolve({
        ctx2: "ctx2",
        common: "overridden",
      }) as any
    );
    const result = await sakuliRunner.execute(projectWithThreeTestFiles);
    return expect(result).toEqual(
      expect.objectContaining({
        common: "overridden",
        ctx1: "ctx1",
        ctx2: "ctx2",
      })
    );
  });

  it("should call beforeRunFile of lifecyclehooks for each file", async (done) => {
    await sakuliRunner.execute(projectWithThreeTestFiles);
    expect(lifecycleHooks1.beforeRunFile).toHaveBeenCalledTimes(3);
    expect(lifecycleHooks2.beforeRunFile).toHaveBeenCalledTimes(3);
    done();
  });

  it("should call afterRunFile of lifecyclehooks for each file", async (done) => {
    await sakuliRunner.execute(projectWithThreeTestFiles);
    expect(lifecycleHooks1.afterRunFile).toHaveBeenCalledTimes(3);
    expect(lifecycleHooks2.afterRunFile).toHaveBeenCalledTimes(3);
    done();
  });

  it("should catch execution errors and still call afterExecution hooks", async (done) => {
    // GIVEN
    const bundleHook = mockPartial<TestExecutionLifecycleHooks>({
      readFileContent: jest.fn(() =>
        Promise.reject(Error("Failed to bundle due to syntax errors"))
      ),
    });

    const scriptExecutor = createScriptExecutorMock();
    const sakuliRunner = new SakuliRunner(
      [lifecycleHooks1, lifecycleHooks2, bundleHook],
      testExecutionContext,
      scriptExecutor
    );

    // WHEN
    await sakuliRunner.execute(projectWithThreeTestFiles);

    // THEN
    expect(lifecycleHooks1.afterExecution).toBeCalledTimes(1);
    expect(lifecycleHooks2.afterExecution).toBeCalledTimes(1);
    done();
  });
});
