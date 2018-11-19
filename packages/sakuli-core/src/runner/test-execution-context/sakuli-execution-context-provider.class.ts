import { ContextProvider } from "../context-provider.interface";
import { Project } from "../..";
import { TestExecutionContext } from "./test-execution-context.class";

export interface SakuliExecutionContext {
    sakuliContext: TestExecutionContext
}

export class SakuliExecutionContextProvider implements ContextProvider<SakuliExecutionContext> {
    sakuliContext: TestExecutionContext = new TestExecutionContext();
    constructor() {
        
    }

    tearUp(project: Project): void {
        this.sakuliContext.startExecution();
    }

    tearDown(): void {
        this.sakuliContext.endExecution();
    }

    getContext(): SakuliExecutionContext {
        return ({
            sakuliContext: new TestExecutionContext
        })
    }


}