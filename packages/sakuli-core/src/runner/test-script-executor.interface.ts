import {RunningScriptOptions} from "vm";

export interface TestScriptExecutorOptions extends RunningScriptOptions{
    waitUntilDone?: boolean
}

export interface TestScriptExecutor {
    execute<T = {}>(source: string, context: T, options?: TestScriptExecutorOptions): Promise<T>;
}