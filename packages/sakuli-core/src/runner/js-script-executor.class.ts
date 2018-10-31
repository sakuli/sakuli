import { TestScriptExecutor } from "./test-script-executor.interface";
import { createContext, Script, Context, RunningScriptOptions } from "vm";

export class JsScriptExecutor implements TestScriptExecutor {

    constructor(readonly options: RunningScriptOptions = {}) {}

    execute<T = {}>(source: string, context: T): T {
        const script = new Script(source)
        const sandbox = createContext(context);
        script.runInContext(sandbox, this.options);
        return sandbox as T;
    }

}