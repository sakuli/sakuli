import {
  entityOnEndLogMessage,
  entityOnStartLogMessage,
  testExecutionContextRenderer,
} from "./test-execution-context-renderer.function";
import {
  LogMode,
  SakuliCoreProperties,
  TestContextEntity,
  TestExecutionContext,
} from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";
import { mockPartial } from "sneer";

describe("testExecutionContextRenderer", () => {
  let logger = mockPartial<SimpleLogger>({
    info: jest.fn(),
  });
  let ctx: TestExecutionContext;

  function simulateTestExecution(executionContext: TestExecutionContext) {
    executionContext.startExecution();
    executionContext.startTestSuite({ id: "Testsuite" });
    executionContext.startTestCase({ id: "Testcase" });
    executionContext.startTestStep({ id: "Teststep" });
    executionContext.endTestStep();
    executionContext.endTestCase();
    executionContext.endTestSuite();
    executionContext.endExecution();
  }

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    ctx = new TestExecutionContext(logger);
  });

  it("should log info about starting tests", async () => {
    const rendering = testExecutionContextRenderer(
      ctx,
      mockPartial<SakuliCoreProperties>({
        getLogMode: () => LogMode.LOG_FILE,
      })
    );
    simulateTestExecution(ctx);
    await rendering;

    expect(logger.info).toHaveBeenNthCalledWith(1, "Started Execution");
    expect(logger.info).toHaveBeenNthCalledWith(
      2,
      "Started Testsuite Testsuite"
    );
    expect(logger.info).toHaveBeenNthCalledWith(3, "Started Testcase Testcase");
    expect(logger.info).toHaveBeenNthCalledWith(
      4,
      expect.stringMatching(/Finished Step Teststep with state Ok/)
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      5,
      expect.stringMatching(/Finished Testcase Testcase with state Ok/)
    );
    expect(logger.info).toHaveBeenNthCalledWith(
      6,
      expect.stringMatching(/Finished Testsuite Testsuite with state Ok/)
    );
    expect(logger.info).toHaveBeenNthCalledWith(7, "Finished Execution");
  });

  it("should not log to console if log mode is ci", async () => {
    //GIVEN
    const properties = mockPartial<SakuliCoreProperties>({
      getLogMode: () => LogMode.CI,
    });
    const rendering = testExecutionContextRenderer(ctx, properties);
    jest.spyOn(console, "log");

    //WHEN
    simulateTestExecution(ctx);
    await rendering;

    //THEN
    expect(logger.info).toBeCalledTimes(7);
    expect(console.log).not.toHaveBeenCalled();
  });

  it("should log to console if log mode is logfile", async () => {
    //GIVEN
    const properties = mockPartial<SakuliCoreProperties>({
      getLogMode: () => LogMode.LOG_FILE,
    });
    const rendering = testExecutionContextRenderer(ctx, properties);
    jest.spyOn(console, "log");

    //WHEN
    simulateTestExecution(ctx);
    await rendering;

    //THEN
    expect(logger.info).toBeCalledTimes(7);
    expect(console.log).toBeCalledTimes(7);
  });
});

describe("logEntityOn functions", () => {
  const tce = mockPartial<TestContextEntity>({
    id: "123",
    state: 4,
    duration: 1,
  });

  const name = "name";

  it("should return logging output for entity on start", () => {
    expect(entityOnStartLogMessage(tce, name)).toBe("Started name 123");
  });

  it("should return logging output for entity on end", () => {
    expect(entityOnEndLogMessage(tce, name)).toBe(
      "Finished name 123 with state Error 1s"
    );
  });
});
