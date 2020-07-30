import { TestExecutionContext } from "@sakuli/core";
import { ifPresent } from "@sakuli/commons";

export function createWithActionContext(ctx: TestExecutionContext) {
  return function runAsAction<ARGS extends any[], R>(
    name: string,
    fn: (...args: ARGS) => Promise<R>
  ): (...args: ARGS) => Promise<R> {
    return async (...args: ARGS): Promise<R> => {
      ctx.startTestAction({ id: name });
      ctx.logger.trace(`Start action ${name}`);
      let res: any;
      try {
        res = await fn(...args);
      } catch (error) {
        ctx.updateCurrentTestAction({ error });
        throw error;
      } finally {
        const log = [`Finish action ${name}`];
        ifPresent(ctx.getCurrentTestAction(), (action) => {
          log.push(action.error ? `with errors` : `successfully`);
          log.push(
            `after ${
              (new Date().getTime() - action!.startDate!.getTime()) / 1000
            }s`
          );
        });
        ctx.logger.trace(log.join(" "));
        ctx.endTestAction();
      }
      return res;
    };
  };
}
