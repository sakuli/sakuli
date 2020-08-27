import {
  TestScriptExecutor,
  TestScriptExecutorOptions,
} from "./test-script-executor.interface";
import { createContext, RunningScriptOptions, Script } from "vm";
import { isPromise } from "./is-promise.function";

export class JsScriptExecutor implements TestScriptExecutor {
  constructor(readonly options: TestScriptExecutorOptions = {}) {}

  async execute<T = {}>(
    source: string,
    context: T,
    _options: TestScriptExecutorOptions = {}
  ): Promise<T> {
    const options = { ...this.options, ..._options };
    const script = new Script(source, {
      filename: options.filename,
      displayErrors: true,
    });
    return new Promise<T>((res, rej) => {
      if (options.timeout) {
        setTimeout(rej, options.timeout);
      }
      let sandbox: T;
      sandbox = <T>(
        createContext(
          Object.assign({}, context, console, { done: () => res(sandbox) })
        )
      );
      const result = script.runInNewContext(sandbox, {
        ...(options as RunningScriptOptions),
        displayErrors: true,
      });

      if (isPromise(result)) {
        result.then(res).catch(rej);
      }

      if (!options.waitUntilDone) {
        res(sandbox);
      }
    });
  }
}
