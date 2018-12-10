import { Project } from "../loader/model/project.interface";
import { ContextProvider } from "./context-provider.interface";
import { TestScriptExecutor } from "./test-script-executor.interface";
import { readFileSync } from "fs";
import { JsScriptExecutor } from "./js-script-executor.class";
import { join } from "path";
import {Sakuli} from "../sakuli.class";

export class SakuliRunner {

    constructor(
        readonly contextProvider: ContextProvider[],
        readonly testFileExecutor: TestScriptExecutor = new JsScriptExecutor
    ) { }

    /**
     * Tears up all context providers, merges their results of getContext and pass this result to the testFile Executor
     * Tears down all service providers after execution of each testFile
     * 
     * @param project The Project Structure found by a Project loader
     * @returns a merged object from all provided contexts after their execution
     */
    async execute(project: Project): Promise<any> {
        Sakuli().testExecutionContext.startExecution();
        this.contextProvider.forEach(cp => cp.tearUp(project));
        const context = this.createContext();
        const results = project.testFiles.reduce((ctx, testFile) => {
            const testFileContent = readFileSync(join(project.rootDir, testFile.path));
            Sakuli().testExecutionContext.startTestSuite({id: testFile.path});
            const resultCtx = this.testFileExecutor.execute(testFileContent.toString(), ctx);
            Sakuli().testExecutionContext.endTestSuite();
            return resultCtx;
        }, context);
        Sakuli().testExecutionContext.endExecution();
        await Sakuli().testExecutionContext.allEntitiesFinished;
        this.contextProvider.forEach(cp => cp.tearDown());
        return results;
    }

    private createContext() {
        return this.contextProvider.reduce((ctx, provider) => ({ ...ctx, ...provider.getContext() }), {});
    }

}