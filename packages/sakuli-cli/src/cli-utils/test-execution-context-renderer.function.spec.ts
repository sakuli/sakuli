import {
  entityOnEndLogMessage,
  entityOnStartLogMessage,
  testExecutionContextRenderer,
} from "./test-execution-context-renderer.function";
import { TestContextEntity, TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";
import { mockPartial } from "sneer";

describe("testExecutionContextRenderer", () => {
  it("should log info about starting tests", async () => {
    const logger = mockPartial<SimpleLogger>({
      info: jest.fn(),
    });
    const ctx = new TestExecutionContext(logger);
    const rendering = testExecutionContextRenderer(ctx);
    ctx.startExecution();
    ctx.startTestSuite({ id: "Testsuite" });
    ctx.startTestCase({ id: "Testcase" });
    ctx.startTestStep({ id: "Teststep" });
    ctx.endTestStep();
    ctx.endTestCase();
    ctx.endTestSuite();
    ctx.endExecution();
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
