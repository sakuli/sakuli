import { TestExecutionContext } from "../runner";
import { SimpleLogger } from "@sakuli/commons";
import { Forwarder } from "./forwarder.interface";
import { mockPartial } from "sneer";
import { Project } from "../loader";
import { connectForwarderToTestExecutionContext } from "./connect-forwarder-to-test-execution-context.function";

describe("connectForwarderToTestExecutionContext", () => {
  let ctx: TestExecutionContext;
  const project = new Project("");
  let forwarder: Forwarder;

  const logger: SimpleLogger = mockPartial<SimpleLogger>({
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  });

  beforeEach(() => {
    ctx = new TestExecutionContext(logger);
  });

  describe("full implemented forwarder", () => {
    let teardown: () => Promise<void>;

    function simulateExecution() {
      ctx.startExecution();
      ctx.startTestSuite({ id: "suite1" });
      ctx.startTestCase({ id: "case1" });
      ctx.startTestStep({});
      ctx.updateCurrentTestStep({ id: "step1" });
      ctx.endTestStep();
      ctx.startTestStep({ id: "step2" });
      ctx.endTestStep();
      ctx.endTestCase();
      ctx.endTestSuite();
      ctx.endExecution();
    }

    beforeEach(async () => {
      forwarder = mockPartial<Forwarder>({
        setup: jest.fn(() => Promise.resolve()),
        tearDown: jest.fn(() => Promise.resolve()),
        forward: jest.fn(() => Promise.resolve()),
        forwardStepResult: jest.fn(() => Promise.resolve()),
        forwardActionResult: jest.fn(() => Promise.resolve()),
        forwardCaseResult: jest.fn(() => Promise.resolve()),
        forwardSuiteResult: jest.fn(() => Promise.resolve()),
      });
      teardown = await connectForwarderToTestExecutionContext(
        forwarder,
        ctx,
        project
      );

      simulateExecution();
    });

    it("should call setup", () => {
      expect(forwarder.setup).toHaveBeenCalledWith(project, ctx.logger);
    });

    it("should call forwardSuiteResult", () => {
      expect(forwarder.forwardSuiteResult).toHaveBeenCalledWith(
        expect.objectContaining({ id: "suite1" }),
        ctx
      );
    });

    it("should call forwardCaseResult", () => {
      expect(forwarder.forwardCaseResult).toHaveBeenCalledWith(
        expect.objectContaining({ id: "case1" }),
        ctx
      );
    });

    it("should call forwardStepResult", () => {
      expect(forwarder.forwardStepResult).toHaveBeenCalledWith(
        expect.objectContaining({ id: "step1" }),
        ctx
      );
      expect(forwarder.forwardStepResult).toHaveBeenCalledWith(
        expect.objectContaining({ id: "step2" }),
        ctx
      );
    });

    it("should call forward", () => {
      expect(forwarder.forward).toHaveBeenCalledWith(ctx);
    });

    it("should call teardown when returned teardown function is invoked", async () => {
      expect(forwarder.tearDown).toHaveBeenCalledTimes(0);
      await teardown();
      expect(forwarder.tearDown).toHaveBeenCalledTimes(1);
    });

    it("should log an error in case a forwarder rejects", async () => {
      //GIVEN
      const expectedError = Error("forwarder does not forward...");
      (forwarder.forward as jest.Mock).mockRejectedValue(expectedError);

      let rejectionTeardown = await connectForwarderToTestExecutionContext(
        forwarder,
        ctx,
        project
      );

      simulateExecution();

      //WHEN
      await rejectionTeardown();

      //THEN
      expect(logger.error).toHaveBeenCalledWith(
        `There were errors during forwarding: ${JSON.stringify(
          expectedError.message
        )}`,
        expect.any(String)
      );
      expect(forwarder.tearDown).toHaveBeenCalledTimes(1);
    });
  });
});
