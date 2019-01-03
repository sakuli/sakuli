import {Project} from "../loader/model";
import {TestExecutionLifecycleHooks} from "./context-provider.interface";
import {TestScriptExecutor} from "./test-script-executor.interface";
import {readFileSync} from "fs";
import {JsScriptExecutor} from "./js-script-executor.class";
import {join, resolve} from "path";
import {Sakuli} from "../sakuli.class";
import {TestExecutionContext} from "./test-execution-context";
import {TestFile} from "../loader/model/test-file.interface";

export class SakuliRunner implements TestExecutionLifecycleHooks {

    constructor(
        readonly lifecycleHooks: TestExecutionLifecycleHooks[],
        readonly testExecutionContext: TestExecutionContext,
        readonly testFileExecutor: TestScriptExecutor = new JsScriptExecutor,
    ) {
    }

    /**
     * Tears up all context providers, merges their results of getContext and pass this result to the testFile Executor
     * Tears down all service providers after execution of each testFile
     *
     * @param project The Project Structure found by a Project loader
     * @returns a merged object from all provided contexts after their execution
     */
    async execute(project: Project): Promise<any> {
        this.testExecutionContext.startExecution();
        // onProject Phase
        this.onProject(project, this.testExecutionContext);
        const context = this.requestContext(this.testExecutionContext);
        let result = {};
        this.beforeExecution(project, this.testExecutionContext);
        for (const testFile of project.testFiles) {
            this.lifecycleHooks.forEach(cp => cp.beforeRunFile(testFile, project, this.testExecutionContext));
            const testFileContent = readFileSync(join(project.rootDir, testFile.path));
            try {
                const executor = new JsScriptExecutor({
                    filename: resolve(join(project.rootDir, testFile.path)),
                    waitUntilDone: true
                });
                this.beforeRunFile(testFile, project, this.testExecutionContext);
                const resultCtx = await executor.execute(testFileContent.toString(), context);
                this.afterRunFile(testFile, project, this.testExecutionContext);
                result = {...result, ...resultCtx};
            } catch (error) {
                //this.testExecutionContext.updateCurrentTestSuite({error});
            }
        }
        this.afterExecution(project, this.testExecutionContext);
        this.testExecutionContext.endExecution();
        return result;
    }

    onProject(project: Project, tec: TestExecutionContext) {
        this.lifecycleHooks.forEach(cp => cp.onProject(project, tec));
    }

    beforeExecution(project: Project, testExecutionContext: TestExecutionContext) {
        this.lifecycleHooks.forEach(cp => cp.beforeExecution(project, testExecutionContext));
    }

    afterExecution(project: Project, testExecutionContext: TestExecutionContext): void {
        this.lifecycleHooks.forEach(cp => cp.afterExecution(project, testExecutionContext));
    }

    afterRunFile(file: TestFile, project: Project, testExecutionContext: TestExecutionContext): void {
        this.lifecycleHooks.forEach(cp => cp.afterRunFile(file, project, testExecutionContext));
    }

    beforeRunFile(file: TestFile, project: Project, testExecutionContext: TestExecutionContext): void {
        this.lifecycleHooks.forEach(cp => cp.beforeRunFile(file, project, testExecutionContext));
    }

    requestContext(testExecutionContext: TestExecutionContext): any {
        return this.lifecycleHooks.reduce((ctx, provider) => ({...ctx, ...provider.requestContext(this.testExecutionContext)}), {});
    }
}