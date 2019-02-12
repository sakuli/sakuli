import {TestExecutionLifecycleHooks} from "../context-provider.interface";
import {Project, TestExecutionContext} from "../..";
import {Sakuli} from '../../sakuli.class';
import {TestFile} from "../../loader/model/test-file.interface";

export interface SakuliExecutionContext {
    Sakuli: typeof Sakuli
}

export function isSakuliExecutionContext(ctx: any): ctx is SakuliExecutionContext {
    return "Sakuli" in ctx && ctx.Sakuli === Sakuli;
}

export class SakuliExecutionContextProvider implements TestExecutionLifecycleHooks<SakuliExecutionContext> {

    constructor() {}

    onProject(project: Project): void {

    }

    afterExecution(): void {

    }

    requestContext(): SakuliExecutionContext {
        return ({ Sakuli: Sakuli })
    }

    afterRunFile(file: TestFile, project: Project, testExecutionContext: TestExecutionContext): void {
    }

    beforeRunFile(file: TestFile, project: Project, testExecutionContext: TestExecutionContext): void {
    }

    beforeExecution(project: Project, testExecutionContext: TestExecutionContext): void {
    }


}