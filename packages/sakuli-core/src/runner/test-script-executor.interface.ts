export interface TestScriptExecutor {
    execute<T = {}>(source: string, context: T):T;
}