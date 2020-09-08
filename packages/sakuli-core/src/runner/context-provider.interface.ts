import { Project } from "../loader/model";
import { TestFile } from "../loader/model/test-file.interface";
import { TestExecutionContext } from "./test-execution-context";
import Signals = NodeJS.Signals;

export interface TestExecutionLifecycleHooks<T = any> {
  onProject?(
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;

  beforeExecution?(
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;

  afterExecution?(
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;

  readFileContent?(
    file: TestFile,
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<string>;

  requestContext?(
    testExecutionContext: TestExecutionContext,
    project: Project
  ): Promise<T>;

  beforeRunFile?(
    file: TestFile,
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;

  afterRunFile?(
    file: TestFile,
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;

  /**
   * Invoked in case an unhandled error occurs during Sakuli execution like unhandled rejection or unexpected exception.
   * This is an emergency hook to ensure that registered lifecycle hooks get the chance to cleanup resources before
   * Sakuli terminates.
   * @param error The unhandled error which caused the invocation of this hook
   * @param project The currently executed project
   * @param testExecutionContext The current test execution context
   */
  onUnhandledError?(
    error: any,
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;

  /**
   * Invoked on process signals received by Sakuli. See {@link nodeSignals} for a list of forwarded signals.
   * @param signal The signal received by Sakuli
   * @param project The currently executed project
   * @param testExecutionContext The current test execution context
   */
  onSignal?(
    signal: Signals,
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;
}
