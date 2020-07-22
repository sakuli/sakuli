import { TestExecutionContext } from "@sakuli/core";

export function runAsAction<
  T extends (...args: any[]) => void | any | Promise<any>
>(ctx: TestExecutionContext, name: string, fn: T): T {
  return (async (...args: any[]) => {
    ctx.startTestAction({
      id: name,
    });
    ctx.logger.info(`Start action ${name}`);
    let res: any;
    try {
      res = await fn(...args);
    } catch (e) {
      throw Error(`Error in action: ${name} \n${e.message || e}`);
    } finally {
      const log = [`Finish action ${name}`];
      if (ctx.getCurrentTestAction()) {
        log.push(
          `after ${
            (new Date().getTime() -
              ctx.getCurrentTestAction()!.startDate!.getTime()) /
            1000
          }s`
        );
      }
      ctx.logger.info(log.join(" "));
      ctx.endTestAction();
    }
    return res;
  }) as T;
}
