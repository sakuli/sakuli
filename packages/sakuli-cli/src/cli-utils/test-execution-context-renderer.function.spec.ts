import { testExecutionContextRenderer } from "./test-execution-context-renderer.function";
import { TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";

describe("testExecutionContextRenderer", () => {
  it("should log info about starting tests", async () => {
    const lg = new SimpleLogger();
    lg.info = jest.fn();
    const ctx = new TestExecutionContext(lg);
    const rnd = testExecutionContextRenderer(ctx);
    ctx.startExecution();
    ctx.startTestSuite();
    ctx.startTestCase();
    ctx.endTestCase();
    ctx.endTestSuite();
    ctx.endExecution();
    await rnd;

    expect(lg.info).toHaveBeenNthCalledWith(1, "Started Execution");
    expect(lg.info).toHaveBeenNthCalledWith(2, "Started Testsuite UNNAMED");
  });
});
