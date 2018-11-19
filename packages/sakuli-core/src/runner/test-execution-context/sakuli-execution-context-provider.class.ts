import { ContextProvider } from "../context-provider.interface";
import { Project } from "../..";
import { TestExecutionContext } from "./test-execution-context.class";
import { throwIfAbsent, ifPresent } from "@sakuli/commons/dist";

export interface SakuliExecutionContext {
    sakuliContext: TestExecutionContext
}

export function isSakuliExecutionContext(ctx: any): ctx is SakuliExecutionContext {
    return "sakuliContext" in ctx;
}

export class SakuliExecutionContextProvider implements ContextProvider<SakuliExecutionContext> {
    sakuliContext: TestExecutionContext | null = null;

    private errorMessage = 'TestExecutionContext is not initialized please call tearUp on this provider to create context';

    constructor(
        private executionContextCreator: () => TestExecutionContext = () => new TestExecutionContext
    ) {}

    tearUp(project: Project): void {
        this.sakuliContext = this.executionContextCreator();
        this.sakuliContext.startExecution();
    }

    tearDown(): void {
        throwIfAbsent(
            this.sakuliContext,
            Error(this.errorMessage)
        ).endExecution();
    }

    getContext(): SakuliExecutionContext {
        return ifPresent(this.sakuliContext,
            sakuliContext => ({sakuliContext}),
            () => {throw Error(this.errorMessage)}
        )
    }


}