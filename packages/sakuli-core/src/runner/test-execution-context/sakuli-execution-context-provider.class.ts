import {ContextProvider} from "../context-provider.interface";
import {Project} from "../..";
import {Sakuli} from '../../sakuli.class';

export interface SakuliExecutionContext {
    Sakuli: typeof Sakuli
}

export function isSakuliExecutionContext(ctx: any): ctx is SakuliExecutionContext {
    return "Sakuli" in ctx && ctx.Sakuli === Sakuli;
}

export class SakuliExecutionContextProvider implements ContextProvider<SakuliExecutionContext> {

    constructor() {}

    tearUp(project: Project): void {

    }

    tearDown(): void {

    }

    getContext(): SakuliExecutionContext {
        return ({ Sakuli: Sakuli })
    }


}