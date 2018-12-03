import { Project } from "../loader/model/project.interface";
import { ContextProvider } from "./context-provider.interface";
import { TestScriptExecutor } from "./test-script-executor.interface";
import { readFileSync } from "fs";
import { JsScriptExecutor } from "./js-script-executor.class";
import { join } from "path";

export class SakuliRunner {

    constructor(
        readonly contextProvider: ContextProvider[],
        readonly testFileExecutor: TestScriptExecutor = new JsScriptExecutor
    ) { }

    /**
     * Tears up all context providers, merges theire results of getContext and pass this result to the testFile Executor
     * Tears down all service providers after execution of each testFile
     * 
     * @param project The Project Structure found by a Project loader
     * @returns a merged object from all provided contexts after their execution
     */
    execute(project: Project): any {
        this.contextProvider.forEach(cp => cp.tearUp(project));
        const context = this.createContext();
        const results = project.testFiles.reduce((ctx, testFile) => {
            const testFileContent = readFileSync(join(project.rootDir, testFile.path));
            return this.testFileExecutor.execute(testFileContent.toString(), ctx)
        }, context)
        this.contextProvider.forEach(cp => cp.tearDown());
        return results;
    }

    private createContext() {
        return this.contextProvider.reduce((ctx, provider) => ({ ...ctx, ...provider.getContext() }), {});
    }

}