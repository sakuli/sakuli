import { Forwarder } from "./forwarder.interface";
import { TestExecutionContext } from "../runner";
import { Project } from "../loader";

/**
 * Connecting a forwarder to TestExecutionContext ctx
 *
 * It will immediately call the setup method of the forwarder (if present)
 *
 * It will register event-listener on the ctx for this event:
 *
 * ctx-event | forwarder-method
 *
 * @param forwarder
 * @param ctx
 * @param project
 *
 * @returns a function which invokes the forward and teardown methods (if present)
 */
export const connectForwarderToTestExecutionContext = async (
  forwarder: Forwarder,
  ctx: TestExecutionContext,
  project: Project
): Promise<() => Promise<void>> => {
  const forwardings: Promise<any>[] = [];
  if (forwarder.setup) {
    await forwarder.setup(project, ctx.logger);
  }
  ctx.on("END_TESTSUITE", (suite) => {
    if (forwarder.forwardSuiteResult) {
      forwardings.push(forwarder.forwardSuiteResult(suite, ctx));
    }
  });
  ctx.on("END_TESTCASE", (testCase) => {
    if (forwarder.forwardCaseResult) {
      forwardings.push(forwarder.forwardCaseResult(testCase, ctx));
    }
  });
  ctx.on("END_TESTSTEP", (step) => {
    if (forwarder.forwardStepResult) {
      forwardings.push(forwarder.forwardStepResult(step, ctx));
    }
  });

  ctx.on("END_TESTACTION", (action) => {
    if (forwarder.forwardActionResult) {
      forwardings.push(forwarder.forwardActionResult(action, ctx));
    }
  });

  ctx.on("END_EXECUTION", (context) => {
    if (forwarder.forward) {
      forwardings.push(forwarder.forward(context));
    }
  });
  return async () => {
    ctx.logger.trace(`Start forwarding...`);
    for (const forwarding of forwardings) {
      try {
        await forwarding;
      } catch (e) {
        ctx.logger.error(
          `There were errors during forwarding: ${JSON.stringify(
            e.message || e
          )}`,
          e.stack
        );
      }
    }
    ctx.logger.trace(`Forwarding completed.`);
    if (forwarder.tearDown) {
      return forwarder.tearDown();
    } else {
      return Promise.resolve();
    }
  };
};
