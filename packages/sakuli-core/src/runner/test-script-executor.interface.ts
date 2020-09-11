import { RunningScriptOptions } from "vm";

export interface TestScriptExecutor {
  execute<T = {}>(
    source: string,
    context: T,
    options?: RunningScriptOptions
  ): Promise<T>;
}
