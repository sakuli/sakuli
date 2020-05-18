import { TestSuiteContext } from "./test-suite-context.class";
import { addSeconds } from "date-fns";
import { toJson } from "./test-context-entity-to-json.function";
import { TestCaseContext } from "./test-case-context.class";
import { TestStepContext } from "./test-step-context.class";
import { TestActionContext } from "./test-action-context.class";

describe("toJson", () => {
  it("should transform testsuite", () => {
    const suite = new TestSuiteContext();
    const startDate = new Date();
    const endDate = addSeconds(new Date(), 5);
    suite.startDate = startDate;
    suite.endDate = endDate;
    (suite.id = "test"),
      expect(toJson(suite)).toMatchSnapshot({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
  });

  it("should transform testcase", () => {
    const testCase = new TestCaseContext();
    const startDate = new Date();
    const endDate = addSeconds(new Date(), 5);
    testCase.startDate = startDate;
    testCase.endDate = endDate;
    (testCase.id = "test"),
      expect(toJson(testCase)).toMatchSnapshot({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
  });

  it("should transform teststep", () => {
    const step = new TestStepContext();
    const startDate = new Date();
    const endDate = addSeconds(new Date(), 5);
    step.startDate = startDate;
    step.endDate = endDate;
    (step.id = "test"),
      expect(toJson(step)).toMatchSnapshot({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
  });

  it("should transform testaction", () => {
    const action = new TestActionContext();
    const startDate = new Date();
    const endDate = addSeconds(new Date(), 5);
    action.startDate = startDate;
    action.endDate = endDate;
    (action.id = "test"),
      expect(toJson(action)).toMatchSnapshot({
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      });
  });

  it("should throw if suite is not valid", () => {
    const suite = new TestSuiteContext();
    expect(() => toJson(suite)).toThrow();
  });

  it("should throw if case is not valid", () => {
    const testCase = new TestCaseContext();
    expect(() => toJson(testCase)).toThrow();
  });

  it("should throw if step is not valid", () => {
    const step = new TestStepContext();
    expect(() => toJson(step)).toThrow();
  });

  it("should throw if action is not valid", () => {
    const action = new TestActionContext();
    expect(() => toJson(action)).toThrow();
  });
});
