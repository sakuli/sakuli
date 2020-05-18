import { createWithActionContext } from "./create-with-action-context.function";
import { createTestExecutionContextMock } from "../../../__mocks__";
import { TestExecutionContext } from "@sakuli/core/dist";

describe("create-with-action-context", () => {
  let ctx: TestExecutionContext;
  let withActionContext: <ARGS extends any[], R>(
    name: string,
    fn: (...args: ARGS) => Promise<R>
  ) => (...args: ARGS) => Promise<R>;

  beforeEach(() => {
    ctx = createTestExecutionContextMock();
    withActionContext = createWithActionContext(ctx);
  });

  describe("successful execution", () => {
    let actionMock: <ARGS extends any[], R>(...args: ARGS) => Promise<R>;
    let wrappedAction: <ARGS extends any[]>(...args: ARGS) => Promise<any>;

    beforeEach(() => {
      actionMock = jest.fn().mockResolvedValue("Works");
      wrappedAction = withActionContext("dummy", actionMock);
    });

    it("should invoke action and return its result", async () => {
      await wrappedAction(1, "Test");
      expect(ctx.startTestAction).toHaveBeenCalledWith(
        expect.objectContaining({ id: "dummy" })
      );
      expect(ctx.endTestAction).toHaveBeenCalled();
    });

    it("should start and stop an action in context", async () => {
      await wrappedAction(1, "Test");
      expect(ctx.startTestAction).toHaveBeenCalledWith(
        expect.objectContaining({ id: "dummy" })
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
      wrappedAction = withActionContext("dummy", actionMock);
    });

    it("should invoke action and throw an error", async () => {
      const wrappedActionResultPromise = wrappedAction(1, "Test");
      await expect(wrappedActionResultPromise).rejects.toThrowError(
        /Error in Action/
      );
      expect(actionMock).toHaveBeenCalledWith(1, "Test");
    });

    it("should start and finish an action anyway", async () => {
      await expect(wrappedAction(1, "Test")).rejects.toThrowError(
        /Error in Action/
      );
      expect(ctx.startTestAction).toHaveBeenCalledWith(
        expect.objectContaining({ id: "dummy" })
      );
      expect(ctx.updateCurrentTestAction).toHaveBeenCalledWith(
        expect.objectContaining({ error: actionError })
      );
      expect(ctx.endTestAction).toHaveBeenCalled();
    });
  });
});
