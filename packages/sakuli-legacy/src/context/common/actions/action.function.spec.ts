import {runAsAction} from "./action.function";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {SimpleLogger} from "@sakuli/commons";

function createTestExecutionContextMock() {
  return mockPartial<TestExecutionContext>({
    startTestAction: jest.fn(),
    endTestAction: jest.fn(),
    getCurrentTestAction: jest.fn(),
    logger: mockPartial<SimpleLogger>({
      trace: jest.fn()
    }),
  });
}

describe("create-with-action-context", () => {

  let ctx: TestExecutionContext;
  let withActionContext: any;

  beforeEach(() => {
    ctx = createTestExecutionContextMock();
  });

  it("should execute successfully", async () => {
      withActionContext = runAsAction(ctx, "myAction", () => "worked");
      await withActionContext();

      expect(ctx.logger.trace).toHaveBeenCalledTimes(2);
      expect(ctx.startTestAction).toHaveBeenCalled();
      expect(ctx.endTestAction).toHaveBeenCalled();
  });

  it("should log an error if action did throw an error", async () => {
      withActionContext = runAsAction(ctx, "myAction", () => {throw Error("myError");});

      await expect(withActionContext()).rejects.toThrow("Error in action: myAction \nmyError");

      expect(ctx.logger.trace).toHaveBeenCalledTimes(2);
      expect(ctx.startTestAction).toHaveBeenCalled();
      expect(ctx.endTestAction).toHaveBeenCalled();
  });

});
