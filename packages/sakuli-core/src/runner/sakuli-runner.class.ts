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

    execute(project: Project) {
        
        project.testFiles.forEach(testFile => {
            const testFileContent = readFileSync(testFile.path);
            this.contextProvider.forEach(cp => cp.tearUp(project));
            this.testFileExecutor.execute(testFileContent.toString(), this.createContext())
            this.contextProvider.forEach(cp => cp.tearDown());
        })
    }

    private createContext() {
        return this.contextProvider.reduce((ctx, provider) => ({ ...ctx, ...provider.getContext() }), {});
    }

}