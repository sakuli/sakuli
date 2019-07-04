import {
    FinishedMeasurable,
    TestActionContext,
    TestCaseContext,
    TestExecutionContext,
    TestStepContext,
    TestSuiteContext
} from "../runner/test-execution-context";
import {Project} from "../loader";
import {SimpleLogger} from "@sakuli/commons";

export interface Forwarder {

    /**
     * Is called after all project loader has run and before TestExecution has started
     * @param project
     * @param logger
     */
    setup?(project: Project, logger: SimpleLogger): Promise<void>;

    /**
     * Is called once a TestSuite has finished. Also Contains information about TestCases and TestSteps of the TestSuite
     * @param entity: Current TestSuiteContext to forward
     * @param ctx: Current TestExecutionContext
     */
    forwardSuiteResult?(entity: TestSuiteContext & FinishedMeasurable, ctx: TestExecutionContext): Promise<void>;

    /**
     * Is called once a TestCase has finished. Also Contains information about TestSteps of the TestCase
     * @param entity: Current TestCaseContext to forward
     * @param ctx: Current TestExecutionContext
     */
    forwardCaseResult?(entity: TestCaseContext & FinishedMeasurable, ctx: TestExecutionContext): Promise<void>;

    /**
     * Is called once a TestStep has finished
     * @param entity: Current TestStepContext to forward
     * @param ctx: Current TestExecutionContext
     */
    forwardStepResult?(entity: TestStepContext & FinishedMeasurable, ctx: TestExecutionContext): Promise<void>;

    /**
     * Is called once a TestAction has finished
     * @param entity: Current TestActionContext to forward
     * @param ctx: Current TestExecutionContext
     */
    forwardActionResult(entity: TestActionContext & FinishedMeasurable, ctx: TestExecutionContext): Promise<void>

    /**
     * Is called after the test execution has finished. This is useful to send additional information or teardown
     * handles, connections etc.
     *
     * If you dont want to forward intermediate results everything should be implemented in this method
     * @param ctx: Current TestExecutionContext
     */
    forward?(ctx: TestExecutionContext): Promise<any>

    /**
     * Is called right after the promise returned from forward method is resolved
     */
    tearDown?(): Promise<void>;
}