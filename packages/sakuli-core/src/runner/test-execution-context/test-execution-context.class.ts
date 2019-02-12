import {TestSuiteContext} from "./test-suite-context.class";
import {Maybe, SimpleLogger, throwIfAbsent} from "@sakuli/commons";
import {
    FinishedMeasurable,
    getDuration,
    isFinished,
    isStarted,
    Measurable,
    StartedMeasurable
} from "./measureable.interface";
import {TestCaseContext} from "./test-case-context.class";
import {TestStepContext} from "./test-step-context.class";
import {TestActionContext} from "./test-action-context.class";
import {toJson} from "./test-context-entity-to-json.function";
import {TestExecutionContextRaw} from "./test-execution-context-raw.interface";
import {TestContextEntityState} from "./test-context-entity-state.class";

export type TestExecutionChangeListener = (state: TestExecutionContext) => void;

/**
 * An execution-context is the main bridge between sakuli and any api that runs on sakuli
 *
 */
export class TestExecutionContext implements Measurable {

    private changeListeners: TestExecutionChangeListener[] = [];
    startDate: Date | null = null;
    endDate: Date | null = null;
    readonly testSuites: TestSuiteContext[] = [];
    error: Maybe<Error>;

    constructor(
        readonly logger: SimpleLogger
    ) {
    }

    startExecution() {
        this.startDate = new Date();
        this.logger.info( "Started Execution");
        this.emitChange();
    }

    isExecutionStarted(): this is StartedMeasurable {
        return isStarted(this);
    }

    isExecutionFinished(): this is FinishedMeasurable {
        return this.isExecutionStarted() && isFinished(this);
    }

    endExecution() {
        if (this.startDate) {
            this.endDate = new Date();
        } else {
            throw new Error('You cannot end an execution before it has been started. Please call TestExecutionContext::startExecution before call endExecution')
        }
        this.logger.info( "Finished Execution");
        this.emitChange();
    }

    get entites() {
        return [
            ...this.testSuites,
            ...this.testCases,
            ...this.testSteps,
            ...this.testActions
        ]
    }

    get testCases() {
        return this.testSuites.reduce((tc, ts)=> [...ts.testCases], [] as TestCaseContext[])
    }

    get testSteps() {
        return this.testCases.reduce((ts, tc) => [...tc.testSteps], [] as TestStepContext[]);
    }

    get testActions() {
        return this.testSteps.reduce((ta, ts) => [...ts.testActions], [] as TestActionContext[]);
    }

    get duration() {
        if (this.isExecutionFinished()) {
            return getDuration(this);
        } else {
            throw new Error('Cannot get duration until execution is marked as finished. Please call TestExecutionContext::endExecution() before accessing duration')
        }
    }

    startTestSuite(testSuite: Partial<TestSuiteContext> = {}) {
        if (this.isExecutionStarted()) {
            this.testSuites.push(new TestSuiteContext);
            this.updateCurrentTestSuite({startDate: new Date()});
            this.updateCurrentTestSuite(testSuite);
            this.emitChange();
        } else {
            throw Error('You have to start execution before starting a testsuite');
        }
    }

    getCurrentTestSuite(): Maybe<TestSuiteContext> {
        return [...this.testSuites].pop();
    }

    updateCurrentTestSuite(testSuite: Partial<TestSuiteContext>) {
        const current = throwIfAbsent(
            this.getCurrentTestSuite(),
            Error('There is no current Testsuite to update. Please ensure that you already called TestExecutionContext::startTestSuite()')
        );
        this.testSuites[this.testSuites.length - 1] = Object.assign(
            (new TestSuiteContext),
            current,
            testSuite
        );
        this.emitChange();
    }

    endTestSuite() {
        this.updateCurrentTestSuite({endDate: new Date()});
        this.emitChange();
    }

    startTestCase(testCase: Partial<TestCaseContext> = {}) {
        const suite = throwIfAbsent(
            this.getCurrentTestSuite(),
            Error(`Cannot start testcase because no test suite has been started`)
        );
        this.updateCurrentTestSuite({
            testCases: [
                ...suite.testCases,
                Object.assign(new TestCaseContext, testCase)
            ]
        });
        this.updateCurrentTestCase({startDate: new Date()});
        this.emitChange();
    }

    getCurrentTestCase(): Maybe<TestCaseContext> {
        const suite = throwIfAbsent(
            this.getCurrentTestSuite(),
            Error(`Cannot get testcase because no test suite has been started`)
        );
        return [...suite.testCases].pop();
    }

    updateCurrentTestCase(testCaseContext: Partial<TestCaseContext>) {
        const suite = throwIfAbsent(
            this.getCurrentTestSuite(),
            Error(`Cannot get testcase because no test suite has been started`)
        );
        const testCase = throwIfAbsent(
            this.getCurrentTestCase(),
            Error(`Cannot get testcase because no test suite has been started`)
        );
        suite.testCases[suite.testCases.length - 1] = Object.assign(
            new TestCaseContext,
            testCase,
            testCaseContext
        );
        this.updateCurrentTestSuite({
            testCases: suite.testCases
        });
        this.emitChange();
    }

    endTestCase() {
        this.updateCurrentTestCase({
            endDate: new Date()
        });
        this.emitChange();
    }

    startTestStep(testStep: Partial<TestStepContext> = {}) {
        const testcase = throwIfAbsent(
            this.getCurrentTestCase(),
            Error(`Cannot start teststep because no testcase has been started`)
        );
        this.updateCurrentTestCase({
            testSteps: [
                ...testcase.testSteps,
                Object.assign(new TestStepContext, testStep)
            ]
        });
        this.updateCurrentTestStep({startDate: new Date()});
        this.emitChange();
    }

    updateCurrentTestStep(testStep: Partial<TestStepContext>) {
        const testCase = throwIfAbsent(
            this.getCurrentTestCase(),
            Error(`Cannot get testcase because no test suite has been started`)
        );
        const step = throwIfAbsent(
            this.getCurrentTestStep(),
            Error(`Cannot get teststep because no test case has been started`)
        );
        testCase.testSteps[testCase.testSteps.length - 1] = Object.assign(
            new TestStepContext,
            step,
            testStep
        );
        this.updateCurrentTestCase({
            testSteps: testCase.testSteps
        });
        this.emitChange();
    }

    getCurrentTestStep(): Maybe<TestStepContext> {
        const testcase = throwIfAbsent(
            this.getCurrentTestCase(),
            Error(`Cannot get teststep because no testcase has been started`)
        );
        return [...testcase.testSteps].pop();
    }

    endTestStep() {
        this.updateCurrentTestStep({
            endDate: new Date()
        });
        this.emitChange();
    }

    startTestAction(testaction: Partial<TestActionContext>) {
        const testStep = throwIfAbsent(
            this.getCurrentTestStep(),
            Error(`Cannot start testaction because no teststep has been started`)
        );
        this.updateCurrentTestStep({
            testActions: [
                ...testStep.testActions,
                Object.assign(new TestActionContext, testaction)
            ]
        });
        this.updateCurrentTestAction({startDate: new Date()});
        this.emitChange();
    }

    updateCurrentTestAction(testaction: Partial<TestActionContext>): any {
        const testStep = throwIfAbsent(
            this.getCurrentTestStep(),
            Error(`Cannot get teststep because no testcase has been started`)
        );
        const action = throwIfAbsent(
            this.getCurrentTestAction(),
            Error(`Cannot get testaction because no teststep has been started`)
        );
        testStep.testActions[testStep.testActions.length - 1] = Object.assign(
            new TestActionContext,
            action,
            testaction
        );
        this.updateCurrentTestStep({
            testActions: testStep.testActions
        });
        this.emitChange();
    }

    getCurrentTestAction(): Maybe<TestActionContext> {
        const teststep = throwIfAbsent(
            this.getCurrentTestStep(),
            Error(`Cannot get testaction because no teststep has been started`)
        );
        return [...teststep.testActions].pop();
    }

    endTestAction() {
        this.updateCurrentTestAction({endDate: new Date});
        this.emitChange();
    }

    private emitChange() {
        this.changeListeners.forEach(listener => {
            listener(this);
        })
    }

    onChange(listener: TestExecutionChangeListener) {
        this.changeListeners.push(listener);
    }

    get resultState(): TestContextEntityState {
        return Math.max(...this.testSuites.map(ts => ts.state)) as TestContextEntityState;
    }

    toJson(): TestExecutionContextRaw {
        return ({
            duration: this.duration,
            startDate: this.startDate,
            endDate: this.endDate,
            testSuites: this.testSuites.map(ts => toJson(ts)),
            error: this.error
        });
    }

}