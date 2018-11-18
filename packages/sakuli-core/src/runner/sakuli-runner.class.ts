import { Project } from "../loader/model/project.interface";
import { ContextProvider } from "./context-provider.interface";
import { TestScriptExecutor } from "./test-script-executor.interface";

export class SakuliRunner {

    constructor(
        readonly contextProvider: ContextProvider[],
        readonly testFileExecutor: TestScriptExecutor
    ) {}

    execute(project: Project) {
        this.contextProvider.forEach(cp => cp.tearUp(project));
        // this.testFileExecutor.execute('file-to-test.js', this.createContext())
        this.contextProvider.forEach(cp => cp.tearDown());
    }

    private createContext() {
        return this.contextProvider.reduce((ctx, provider) => ( {...ctx, ...provider.getContext()}))
    }

}