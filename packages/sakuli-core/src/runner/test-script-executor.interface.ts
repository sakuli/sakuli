export interface TestScriptExecutor {
    execute<T = {}>(source: string, context: T): Promise<T>;
}