import { runAsAction } from "./action.function";
//import { TestExecutionContext } from "@sakuli/core/dist";
import { mockPartial } from "sneer";
import { TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";

function createTestExecutionContextMock() {
  return mockPartial<TestExecutionContext>({
    startTestSuite: jest.fn(),
    startTestCase: jest.fn(),
    startTestAction: jest.fn(),
    endTestAction: jest.fn(),
    getCurrentTestAction: jest.fn(),
    updateCurrentTestAction: jest.fn(),
    endTestSuite: jest.fn(),
    getCurrentTestCase: jest.fn(),
    updateCurrentTestCase: jest.fn(),
    logger: mockPartial<SimpleLogger>({
      info: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    }),
  });
}



describe("create-with-action-context", () => {

//   T extends (...args: any[]) => void | any | Promise<any>
// >(ctx: TestExecutionContext, name: string, fn: T): T {

  let ctx: TestExecutionContext;
  let withActionContext: any;

  beforeEach(() => {
    ctx = createTestExecutionContextMock();
  });


  it("should execute successfully", async () => {
      withActionContext = runAsAction(ctx, "myAction", () => "worked");
      await withActionContext();

      expect(ctx.logger.trace).toHaveBeenCalledTimes(2);
      expect(ctx.endTestAction).toHaveBeenCalled();
  });

  //Error in action: ${name} \n${e.message}

  it("should log an error if action did throw an error", async () => {
      withActionContext = runAsAction(ctx, "myAction", () => {throw Error("myError");});

      await expect(withActionContext()).rejects.toThrow("Error in action: myAction \nmyError");

      expect(ctx.logger.trace).toHaveBeenCalledTimes(2);
      expect(ctx.endTestAction).toHaveBeenCalled();
  });

});
