import {TestExecutionContext} from "../runner/test-execution-context";
import {Project} from "../loader";
import {
    FinishedMeasurable,
    TestActionContext,
    TestCaseContext,
    TestStepContext,
    TestSuiteContext
} from "../runner/test-execution-context";
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
     * @param entity
     * @param project
     */
    forwardSuiteResult?(entity: TestSuiteContext & FinishedMeasurable, project: Project): Promise<void>;

    /**
     * Is called once a TestCase has finished. Also Contains information about TestSteps of the TestCase
     * @param entity
     * @param project
     */
    forwardCaseResult?(entity: TestCaseContext & FinishedMeasurable, project: Project): Promise<void>;

    /**
     * Is called once a TestStep has finished
     * @param entity
     * @param project
     */
    forwardStepResult?(entity: TestStepContext & FinishedMeasurable, project: Project): Promise<void>;

    /**
     * Is called once a TestStep has finished
     * @param entity
     * @param project
     */
    forwardActionResult(entity: TestActionContext & FinishedMeasurable, project: Project): Promise<void>

    /**
     * Is called after the test execution has finished. This is useful to send additional information or teardown
     * handles, connections etc.
     *
     * If you dont want to forward intermediate results everything should be implemented in this method
     * @param ctx
     * @param project
     */
    forward?(ctx: TestExecutionContext, project: Project): Promise<any>



    /**
     * Is called right after the promise returned from forward method is resolved
     */
    tearDown?(): Promise<void>;

}