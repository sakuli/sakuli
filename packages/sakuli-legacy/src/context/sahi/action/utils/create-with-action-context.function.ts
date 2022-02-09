import { TestExecutionContext } from "@sakuli/core";

export function createWithActionContext(ctx: TestExecutionContext) {
  return function runAsAction<ARGS extends any[], R>(
    name: string,
    fn: (...args: ARGS) => Promise<R>
  ): (...args: ARGS) => Promise<R> {
    function createActionDurationString() {
      const actionStartTime = ctx.getCurrentTestAction()?.startDate?.getTime();
      return actionStartTime
        ? ` after ${(new Date().getTime() - actionStartTime) / 1000}s`
        : "";
    }

    return async (...args: ARGS): Promise<R> => {
      ctx.startTestAction({ id: name });
      ctx.logger.trace(`Start action ${name}`);
      let res: any;
      try {
        res = await fn(...args);
        ctx.logger.trace(
          `Finish action ${name} successfully${createActionDurationString()}`
        );
      } catch (error: any) {
        ctx.logger.trace(
          `Finish action ${name} with errors${createActionDurationString()}`,
          error.stack
        );
        throw error;
      } finally {
        ctx.endTestAction();
      }
      return res;
    };
  };
}
