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
import {EventEmitter} from "events";
import {
    END_EXECUTION,
    END_TESTACTION, END_TESTCASE, END_TESTSTEP, END_TESTSUITE,
    START_EXECUTION, START_TESTACTION, START_TESTCASE, START_TESTSTEP, START_TESTSUITE,
    TestExecutionContextEventTypes, UPDATE_TESTACTION, UPDATE_TESTCASE, UPDATE_TESTSTEP, UPDATE_TESTSUITE
} from "./test-execution-context.events";

export type TestExecutionChangeListener = (state: TestExecutionContext) => void;

/**
 * An execution-context is the main bridge between sakuli and any api that runs on sakuli
 *
 */
export class TestExecutionContext extends EventEmitter implements Measurable  {

    startDate: Date | null = null;
    endDate: Date | null = null;
    readonly testSuites: TestSuiteContext[] = [];
    error: Maybe<Error>;

    constructor(
        readonly logger: SimpleLogger
    ) {
        super();
    }

    on(e: typeof START_EXECUTION, cb: (e: TestExecutionContext) => void): this;
    on(e: typeof END_EXECUTION, cb: (e: TestExecutionContext) => void): this;
    on(e: typeof START_TESTSUITE , cb:(e: TestSuiteContext) => void): this;
    on(e: typeof UPDATE_TESTSUITE , cb:(e: TestSuiteContext) => void): this;
    on(e: typeof END_TESTSUITE , cb:(e: TestSuiteContext) => void): this;
    on(e: typeof START_TESTCASE , cb:(e: TestCaseContext) => void): this;
    on(e: typeof UPDATE_TESTCASE , cb:(e: TestCaseContext) => void): this;
    on(e: typeof END_TESTCASE , cb:(e: TestCaseContext) => void): this;
    on(e: typeof START_TESTSTEP , cb:(e: TestStepContext) => void): this;
    on(e: typeof UPDATE_TESTSTEP , cb:(e: TestStepContext) => void): this;
    on(e: typeof END_TESTSTEP , cb:(e: TestStepContext) => void): this;
    on(e: typeof START_TESTACTION , cb:(e: TestActionContext) => void): this;
    on(e: typeof UPDATE_TESTACTION , cb:(e: TestActionContext) => void): this;
    on(e: typeof END_TESTACTION , cb:(e: TestActionContext) => void): this;
    on(e: 'change', cb: (e: TestExecutionContext) => void): this;
    on(type: TestExecutionContextEventTypes | 'change', listener: (...args: any[]) => void): this {
        return super.on(type, listener);
    }

    startExecution() {
        this.startDate = new Date();
        this.logger.info( "Started Execution");
        this.emit(START_EXECUTION, this);
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
        this.emit(END_EXECUTION, this);
        this.emitChange();
    }

    get entities() {
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
            const newTestSuite = Object.assign(new TestSuiteContext(), testSuite, {startDate: new Date()});
            this.testSuites.push(newTestSuite);
            this.emit(START_TESTSUITE, newTestSuite);
            this.emitChange();
        } else {
            throw Error('You have to start execution before starting a testsuite');
        }
    }

    getCurrentTestSuite(): Maybe<TestSuiteContext> {
        return [...this.testSuites].pop();
    }

    updateCurrentTestSuite(testSuite: Partial<TestSuiteContext>): TestSuiteContext {
        const updatedTestSuite = this._updateCurrentTestSuite(testSuite);
        this.emit(UPDATE_TESTSUITE, updatedTestSuite);
        this.emitChange();
        return updatedTestSuite;
    }

    private _updateCurrentTestSuite(testSuite: Partial<TestSuiteContext>): TestSuiteContext {
        const current = throwIfAbsent(
            this.getCurrentTestSuite(),
            Error('There is no current Testsuite to update. Please ensure that you already called TestExecutionContext::startTestSuite()')
        );
        const updatedTestSuite = this.testSuites[this.testSuites.length - 1] = Object.assign(
            (new TestSuiteContext),
            current,
            testSuite
        );
        return updatedTestSuite;
    }

    endTestSuite() {
        const updatedTestSuite = this._updateCurrentTestSuite({endDate: new Date()});
        this.emit(END_TESTSUITE, updatedTestSuite);
        this.emitChange();
    }

    startTestCase(testCase: Partial<TestCaseContext> = {}) {
        const suite = throwIfAbsent(
            this.getCurrentTestSuite(),
            Error(`Cannot start testcase because no test suite has been started`)
        );
        const newTestCase = Object.assign(new TestCaseContext, testCase, {startDate: new Date()});
        this._updateCurrentTestSuite({
            testCases: [
                ...suite.testCases,
                newTestCase
            ]
        });
        this.emit(START_TESTCASE, newTestCase);
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
        const updateTestCase = this._updateCurrentTestCase(testCaseContext);
        this.emit(UPDATE_TESTCASE, updateTestCase);
        this.emitChange();
        return updateTestCase;
    }

    private _updateCurrentTestCase(testCaseContext: Partial<TestCaseContext>) {
        const suite = throwIfAbsent(
            this.getCurrentTestSuite(),
            Error(`Cannot get testcase because no test suite has been started`)
        );
        const testCase = throwIfAbsent(
            this.getCurrentTestCase(),
            Error(`Cannot get testcase because no test suite has been started`)
        );
        const updatedTestCase = suite.testCases[suite.testCases.length - 1] = Object.assign(
            new TestCaseContext,
            testCase,
            testCaseContext
        );
        this._updateCurrentTestSuite({
            testCases: suite.testCases
        });
        return updatedTestCase;
    }

    endTestCase() {
        const updatedTestCase = this._updateCurrentTestCase({
            endDate: new Date()
        });
        this.emit(END_TESTCASE, updatedTestCase);
        this.emitChange();
    }

    startTestStep(testStep: Partial<TestStepContext> = {}) {
        const testcase = throwIfAbsent(
            this.getCurrentTestCase(),
            Error(`Cannot start teststep because no testcase has been started`)
        );
        const newTestStep = Object.assign(new TestStepContext, testStep, {startDate: new Date()});
        this._updateCurrentTestCase({
            testSteps: [
                ...testcase.testSteps,
                newTestStep
            ]
        });
        this.emit(START_TESTSTEP, newTestStep);
        this.emitChange();
    }

    updateCurrentTestStep(testStep: Partial<TestStepContext>) {
        const updatedTestStep = this._updateCurrentTestStep(testStep);
        this.emit(UPDATE_TESTSTEP, updatedTestStep);
        this.emitChange();
        return updatedTestStep;
    }

    private _updateCurrentTestStep(testStep: Partial<TestStepContext>) {
        const testCase = throwIfAbsent(
            this.getCurrentTestCase(),
            Error(`Cannot get testcase because no test suite has been started`)
        );
        const step = throwIfAbsent(
            this.getCurrentTestStep(),
            Error(`Cannot get teststep because no test case has been started`)
        );
        const updatedTestStep = testCase.testSteps[testCase.testSteps.length - 1] = Object.assign(
            new TestStepContext,
            step,
            testStep
        );
        this._updateCurrentTestCase({
            testSteps: testCase.testSteps
        });
        return updatedTestStep;
    }

    endTestStep() {
        const updatedStep = this._updateCurrentTestStep({
            endDate: new Date()
        });
        this.emit(END_TESTSTEP, updatedStep);
        this.emitChange();
    }

    getCurrentTestStep(): Maybe<TestStepContext> {
        const testcase = throwIfAbsent(
            this.getCurrentTestCase(),
            Error(`Cannot get teststep because no testcase has been started`)
        );
        return [...testcase.testSteps].pop();
    }

    startTestAction(testAction: Partial<TestActionContext>) {
        const testStep = throwIfAbsent(
            this.getCurrentTestStep(),
            Error(`Cannot start testaction because no teststep has been started`)
        );
        const newAction = Object.assign(new TestActionContext, testAction, {startDate: new Date()});
        this._updateCurrentTestStep({
            testActions: [
                ...testStep.testActions,
                newAction
            ]
        });
        this.emit(START_TESTACTION, newAction);
        this.emitChange();
    }

    updateCurrentTestAction(testAction: Partial<TestActionContext>): TestActionContext {
        const updatedAction = this._updateCurrentTestAction(testAction);
        this.emit(UPDATE_TESTACTION, updatedAction);
        this.emitChange();
        return updatedAction;
    }

    /**
     * The actual logic to update a test action - will not emit any event
     * @param testAction
     * @private
     */
    private _updateCurrentTestAction(testAction: Partial<TestActionContext>): TestActionContext {
        const testStep = throwIfAbsent(
            this.getCurrentTestStep(),
            Error(`Cannot get teststep because no testcase has been started`)
        );
        const action = throwIfAbsent(
            this.getCurrentTestAction(),
            Error(`Cannot get testaction because no teststep has been started`)
        );
        const updatedAction = testStep.testActions[testStep.testActions.length - 1] = Object.assign(
            new TestActionContext,
            action,
            testAction
        );
        this._updateCurrentTestStep({
            testActions: testStep.testActions
        });
        return updatedAction;
    }

    endTestAction() {
        const finishedAction = this._updateCurrentTestAction({endDate: new Date});
        this.emit(END_TESTACTION, finishedAction);
        this.emitChange();
    }

    getCurrentTestAction(): Maybe<TestActionContext> {
        const testStep = throwIfAbsent(
            this.getCurrentTestStep(),
            Error(`Cannot get testaction because no teststep has been started`)
        );
        return [...testStep.testActions].pop();
    }

    private emitChange() {
        this.emit('change', this);
    }

    onChange(listener: TestExecutionChangeListener) {
        this.on('change', listener);
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