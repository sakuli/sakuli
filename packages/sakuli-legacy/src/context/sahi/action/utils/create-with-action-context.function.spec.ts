import { createWithActionContext } from "./create-with-action-context.function";
import { createTestExecutionContextMock } from "../../../__mocks__";
import { TestExecutionContext } from "@sakuli/core";

describe("create-with-action-context", () => {
  let ctx: TestExecutionContext;
  let withActionContext: <ARGS extends any[], R>(
    name: string,
    fn: (...args: ARGS) => Promise<R>
  ) => (...args: ARGS) => Promise<R>;
  const actionName = "dummy";

  beforeEach(() => {
    ctx = createTestExecutionContextMock();
    withActionContext = createWithActionContext(ctx);
  });

  describe("successful execution", () => {
    let actionMock: <ARGS extends any[], R>(...args: ARGS) => Promise<R>;
    let wrappedAction: <ARGS extends any[]>(...args: ARGS) => Promise<any>;

    beforeEach(() => {
      actionMock = jest.fn().mockResolvedValue("Works");
      wrappedAction = withActionContext(actionName, actionMock);
    });

    it("should invoke action and return its result", async () => {
      await wrappedAction(1, "Test");
      expect(ctx.startTestAction).toHaveBeenCalledWith(
        expect.objectContaining({ id: actionName })
      );
      expect(ctx.logger.trace).toHaveBeenNthCalledWith(
        1,
        `Start action ${actionName}`
      );
      expect(ctx.endTestAction).toHaveBeenCalled();
    });
  });

  describe("error in execution", () => {
    let actionMock: <ARGS extends any[], R>(...args: ARGS) => Promise<R>;
    let wrappedAction: <ARGS extends any[]>(...args: ARGS) => Promise<any>;
    let actionError: Error;

    beforeEach(() => {
      actionError = Error("Error in Action");
      actionMock = jest.fn().mockRejectedValue(actionError);
      wrappedAction = withActionContext(actionName, actionMock);
    });

    it("should invoke action and throw an error", async () => {
      //GIVEN
      const error = Error("Error in Action");

      //WHEN
      const wrappedActionResultPromise = wrappedAction(1, "Test");

      //THEN
      await expect(wrappedActionResultPromise).rejects.toThrowError(error);
      expect(actionMock).toHaveBeenCalledWith(1, "Test");
      expect(ctx.logger.trace).toHaveBeenNthCalledWith(
        1,
        `Start action ${actionName}`
      );
      expect(ctx.logger.trace).toHaveBeenNthCalledWith(
        2,
        `Finish action ${actionName} with errors`,
        expect.stringMatching(error.message)
      );
      expect(ctx.getCurrentTestAction).toHaveBeenCalledTimes(1);
    });

    it("should start and finish an action anyway", async () => {
      //GIVEN
      const error = Error("Error in Action");

      //WHEN
      await expect(wrappedAction(1, "Test"))
        //THEN
        .rejects.toThrowError(error);
      expect(ctx.startTestAction).toHaveBeenCalledWith(
        expect.objectContaining({ id: "dummy" })
      );
      expect(ctx.endTestAction).toHaveBeenCalled();
      expect(ctx.logger.trace).toHaveBeenNthCalledWith(
        1,
        `Start action ${actionName}`
      );
      expect(ctx.logger.trace).toHaveBeenNthCalledWith(
        2,
        `Finish action ${actionName} with errors`,
        expect.stringMatching(error.message)
      );
      expect(ctx.getCurrentTestAction).toHaveBeenCalledTimes(1);
    });
  });
});
