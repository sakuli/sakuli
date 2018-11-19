import { Project } from "../loader/model/project.interface";
import { ContextProvider } from "./context-provider.interface";
import { TestScriptExecutor } from "./test-script-executor.interface";
import { readFileSync } from "fs";
import { JsScriptExecutor } from "./js-script-executor.class";

export class SakuliRunner {

    constructor(
        readonly contextProvider: ContextProvider[],
        readonly testFileExecutor: TestScriptExecutor = new JsScriptExecutor
    ) { }

    execute(project: Project): any {    
        this.contextProvider.forEach(cp => cp.tearUp(project));
        const context = this.createContext();
        const results = project.testFiles.reduce((ctx, testFile) => {
            const testFileContent = readFileSync(testFile.path);
            return this.testFileExecutor.execute(testFileContent.toString(), ctx)
        }, context)
        this.contextProvider.forEach(cp => cp.tearDown());
        return results;
    }

    private createContext() {
        return this.contextProvider.reduce((ctx, provider) => ({ ...ctx, ...provider.getContext() }), {});
    }

}