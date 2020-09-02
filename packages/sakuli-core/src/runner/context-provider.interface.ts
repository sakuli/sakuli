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

  onUnhandledRejection?(
    error: {} | null | undefined,
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;

  onUncaughtException?(
    error: {} | null | undefined,
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;

  onSignal?(
    signal: Signals,
    project: Project,
    testExecutionContext: TestExecutionContext
  ): Promise<void>;
}
