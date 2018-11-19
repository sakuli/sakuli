import { TestFile } from "../loader/model/test-file.interface";

export interface TestScriptExecutor {
    execute<T = {}>(source: string, context: T):T;
}