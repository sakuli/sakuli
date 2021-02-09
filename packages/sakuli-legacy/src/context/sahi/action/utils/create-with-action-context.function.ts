import { TestExecutionContext } from "@sakuli/core";
import { ifPresent } from "@sakuli/commons";
import * as util from "util";

export function createWithActionContext(ctx: TestExecutionContext) {
  return function runAsAction<ARGS extends any[], R>(
    name: string,
    fn: (...args: ARGS) => Promise<R>
  ): (...args: ARGS) => Promise<R> {
    function logFinishedAction(error: any) {
      const log = [`Finish action ${name}`];
      ifPresent(ctx.getCurrentTestAction(), (action) => {
        log.push(error ? `with errors` : `successfully`);
        log.push(
          `after ${
            (new Date().getTime() - action.startDate!.getTime()) / 1000
          }s`
        );
      });

      util.types.isNativeError(error)
        ? ctx.logger.trace(log.join(" "), error.stack)
        : ctx.logger.trace(log.join(" "));
    }
    return async (...args: ARGS): Promise<R> => {
      ctx.startTestAction({ id: name });
      ctx.logger.trace(`Start action ${name}`);
      let res: any;
      let actionError = undefined;
      try {
        res = await fn(...args);
      } catch (error) {
        actionError = error;
        throw error;
      } finally {
        logFinishedAction(actionError);
        ctx.endTestAction();
      }
      return res;
    };
  };
}
