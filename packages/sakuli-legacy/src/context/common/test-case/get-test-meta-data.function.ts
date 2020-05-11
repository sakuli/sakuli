import { ifPresent } from "@sakuli/commons";
import { TestExecutionContext } from "@sakuli/core";
import { TestMetaData } from "./test-meta-data.interface";

export const getTestMetaData = (ctx: TestExecutionContext): TestMetaData => {
  const suiteName = ifPresent(
    ctx.getCurrentTestSuite(),
    (suite) =>
      ifPresent(
        suite.id,
        (id) => id,
        () => "UNKNOWN_TESTSUITE"
      ),
    () => "UNKNOWN_TESTSUITE"
  );
  let caseName = ifPresent(
    ctx.getCurrentTestCase(),
    (testCase) => testCase.id,
    () => null
  );
  caseName = ifPresent(
    caseName,
    () => caseName,
    () => {
      return ifPresent(
        ctx.getCurrentTestSuite(),
        (ts) => `testcase_${ts.testCases.length}`,
        () => "testcase_1"
      );
    }
  );

  return {
    suiteName,
    caseName: caseName || "testcase_1",
  };
};
