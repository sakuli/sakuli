import { TestExecutionContext } from "@sakuli/core";

export const prepareContext = (ctx: TestExecutionContext) => {
  ctx.startExecution();
  ctx.startTestSuite();
  ctx.startTestCase();
  ctx.startTestStep();
};
