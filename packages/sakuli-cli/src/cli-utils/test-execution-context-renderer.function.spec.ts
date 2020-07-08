import { testExecutionContextRenderer, logEntityOnStart, logEntityOnEnd } from "./test-execution-context-renderer.function";
import { TestExecutionContext, TestContextEntity, TestActionContext, TestContextEntityStates, TestContextEntityState } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";
import {mockPartial} from "sneer";


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

describe("logEntityOn functions", () => {

    const tce = mockPartial<TestContextEntity>({
        id: "123",
        state: 4,
        duration: 1
    });

    const name = "name"

    it("should return the right output with correct state", () => {

    expect(logEntityOnStart(tce,name)).toBe("Started name 123");
    expect(logEntityOnEnd(tce,name)).toBe("Finished name 123 with state Error 1s");
    });
})

