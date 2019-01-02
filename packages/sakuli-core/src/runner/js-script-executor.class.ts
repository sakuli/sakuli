import {TestScriptExecutor} from "./test-script-executor.interface";
import {Context, createContext, RunningScriptOptions, Script} from "vm";
import {inspect} from "util";

export interface JsScriptExecutorOptions {
    waitUntilDone?: boolean
}

export class JsScriptExecutor implements TestScriptExecutor {

    constructor(readonly options: RunningScriptOptions & JsScriptExecutorOptions = {}) {
    }

    async execute<T = {}>(source: string, context: T): Promise<T> {
        const script = new Script(source, {
            filename: this.options.filename,
            displayErrors: true
        });
        return new Promise<T>((res, rej) => {
            if (this.options.timeout) {
                setTimeout(rej, this.options.timeout);
            }
            let sandbox: T;
            sandbox = <T>createContext(Object.assign({},
                context,
                console,
                {done: () => res(sandbox)}
            ));
            script.runInNewContext(sandbox, {
                ...this.options,
                displayErrors: true
            });
            if(!this.options.waitUntilDone) {
                res(sandbox);
            }
        })
    }

}