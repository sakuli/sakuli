import {Project} from "../loader/model";
import {TestFile} from "../loader/model/test-file.interface";
import {TestExecutionContext} from "./test-execution-context";

export interface TestExecutionLifecycleHooks<T = any> {

    onProject(project: Project, testExecutionContext: TestExecutionContext): void;

    beforeExecution(project: Project, testExecutionContext: TestExecutionContext): void;
    afterExecution(project: Project, testExecutionContext: TestExecutionContext): void;

    requestContext(testExecutionContext: TestExecutionContext): T

    beforeRunFile(file: TestFile, project: Project, testExecutionContext: TestExecutionContext): void;

    afterRunFile(file: TestFile, project: Project, testExecutionContext: TestExecutionContext): void;
}