import {Forwarder} from "./forwarder.interface";
import {TestExecutionContext} from "../runner/test-execution-context";
import {Project} from "../loader/model";

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
): Promise<(() => Promise<void>)> => {
    const forwardings: Promise<any>[] = [];
    if(forwarder.setup) {
        await forwarder.setup(project, ctx.logger);
    }
    ctx.on("END_TESTSUITE", suite => {
        if(forwarder.forwardSuiteResult) {
            forwardings.push(forwarder.forwardSuiteResult(suite, project));
        }
    });
    ctx.on("END_TESTCASE", testCase => {
        if(forwarder.forwardCaseResult) {
            forwardings.push(forwarder.forwardCaseResult(testCase, project));
        }
    });
    ctx.on("END_TESTSTEP", step => {
        if(forwarder.forwardStepResult) {
            forwardings.push(forwarder.forwardStepResult(step, project));
        }
    });

    ctx.on("END_TESTACTION", action => {
        if(forwarder.forwardActionResult) {
            forwardings.push(forwarder.forwardActionResult(action, project));
        }
    });

    ctx.on("END_EXECUTION", ctx => {
        if(forwarder.forward) {
            forwardings.push(forwarder.forward(ctx, project));
        }
    });
    return async () => {
        await Promise.all(forwardings);
        if(forwarder.tearDown) {
            return forwarder.tearDown();
        } else {
            return Promise.resolve();
        }
    }
};