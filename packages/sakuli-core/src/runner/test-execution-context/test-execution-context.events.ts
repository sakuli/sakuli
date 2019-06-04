import {TestContextEntity} from "./test-context-entity.class";
import {TestSuiteContext} from "./test-suite-context.class";
import {TestCaseContext} from "./test-case-context.class";
import {TestStepContext} from "./test-step-context.class";
import {TestActionContext} from "./test-action-context.class";

export const START_EXECUTION = 'START_EXECUTION';
export const END_EXECUTION = 'END_EXECUTION';
export const START_TESTSUITE = 'START_TESTSUITE';
export const UPDATE_TESTSUITE = 'UPDATE_TESTSUITE';
export const END_TESTSUITE = 'END_TESTSUITE';
export const START_TESTCASE = 'START_TESTCASE';
export const UPDATE_TESTCASE = 'UPDATE_TESTCASE';
export const END_TESTCASE = 'END_TESTCASE';
export const START_TESTSTEP = 'START_TESTSTEP';
export const UPDATE_TESTSTEP = 'UPDATE_TESTSTEP';
export const END_TESTSTEP = 'END_TESTSTEP';
export const START_TESTACTION = 'START_TESTACTION';
export const UPDATE_TESTACTION = 'UPDATE_TESTACTION';
export const END_TESTACTION = 'END_TESTACTION';

export type TestExecutionContextEventTypes =
 | typeof START_EXECUTION
 | typeof END_EXECUTION
 | typeof START_TESTSUITE
 | typeof UPDATE_TESTSUITE
 | typeof END_TESTSUITE
 | typeof START_TESTCASE
 | typeof UPDATE_TESTCASE
 | typeof END_TESTCASE
 | typeof START_TESTSTEP
 | typeof UPDATE_TESTSTEP
 | typeof END_TESTSTEP
 | typeof START_TESTACTION
 | typeof UPDATE_TESTACTION
 | typeof END_TESTACTION

type TestExecutionContextEntityEventListener<T extends TestContextEntity> = (e: T) => void;

export type TestSuiteChangeListener = TestExecutionContextEntityEventListener<TestSuiteContext>;
export type TestCaseChangeListener = TestExecutionContextEntityEventListener<TestCaseContext>;
export type TestStepChangeListener = TestExecutionContextEntityEventListener<TestStepContext>;
export type TestActionChangeListener = TestExecutionContextEntityEventListener<TestActionContext>;