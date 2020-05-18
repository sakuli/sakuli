import { TestExecutionContext } from "@sakuli/core";

export function runAsAction<
  T extends (...args: any[]) => void | any | Promise<any>
>(ctx: TestExecutionContext, name: string, fn: T): T {
  return (async (...args: any[]) => {
    return await fn(...args);
  }) as T;
}
