import { TestExecutionContext } from "./test-execution-context.class";
import { TestSuiteContext } from "./test-suite-context.class";
import { mockPartial } from "sneer";
import { SimpleLogger } from "@sakuli/commons";
import {
  END_EXECUTION,
  END_TESTACTION,
  END_TESTCASE,
  END_TESTSTEP,
  END_TESTSUITE,
  START_EXECUTION,
  START_TESTACTION,
  START_TESTCASE,
  START_TESTSTEP,
  START_TESTSUITE,
  TestExecutionContextEventTypes,
  UPDATE_TESTACTION,
  UPDATE_TESTCASE,
  UPDATE_TESTSTEP,
  UPDATE_TESTSUITE,
} from "./test-execution-context.events";

describe("TestExecutionContext", () => {
  let tec: TestExecutionContext;
  const loggerMock = mockPartial<SimpleLogger>({
    log: jest.fn(),
    info: jest.fn(),
  });
  beforeEach(() => (tec = new TestExecutionContext(loggerMock)));

  describe("positive", () => {
    beforeEach(() => tec.startExecution());

    const { objectContaining, any, arrayContaining } = expect;
    const validContextEntity = (moreMatcher: object = {}) =>
      objectContaining({
        id: any(String),
        startDate: any(Date),
        endDate: any(Date),
        ...moreMatcher,
      });

    it("should add multiple testsuitecontexts", () => {
      tec.startTestSuite({ id: "First-Suite" });
      tec.endTestSuite();
      tec.startTestSuite({ id: "Second-Suite" });
      tec.updateCurrentTestSuite({
        warningTime: 40,
        criticalTime: 50,
      });
      tec.endTestSuite();
      expect(tec.testSuites.length).toBe(2);
      expect(tec.testSuites).toEqual(
        arrayContaining([any(TestSuiteContext), any(TestSuiteContext)])
      );
      expect(tec.testSuites).toEqual(
        arrayContaining([
          validContextEntity(),
          validContextEntity({
            warningTime: any(Number),
            criticalTime: any(Number),
          }),
        ])
      );
    });

    it("should add testcases within testcases", () => {
      tec.startTestSuite({ id: "First-Suite" });
      tec.startTestCase({ id: "First-Case" });
      tec.endTestCase();
      tec.endTestSuite();
      tec.startTestSuite({ id: "Second-Suite" });
      tec.startTestCase({ id: "Second-Case" });
      tec.endTestCase();
      tec.startTestCase({ id: "Third-Case" });
      tec.endTestCase();
      tec.endTestSuite();

      expect(tec.testSuites.length).toBe(2);
      expect(tec.testSuites[0].testCases.length).toBe(1);
      expect(tec.testSuites[1].testCases.length).toBe(2);
    });

    describe("complex", () => {
      beforeEach(() => {
        tec.startTestSuite({ id: "S001" });
        tec.endTestSuite();

        tec.startTestSuite({ id: "S002" });
        tec.startTestCase({ id: "S002C001" });
        tec.startTestStep();
        tec.updateCurrentTestStep({ id: "late added" });
        tec.startTestAction({});
        tec.updateCurrentTestAction({ id: "Action" });
        tec.endTestAction();
        tec.endTestStep();
        tec.endTestCase();
        tec.startTestCase({ id: "S002C002" });
        tec.endTestCase();
        tec.startTestCase({ id: "S002C003" });
        tec.endTestCase();
        tec.endTestSuite();

        tec.startTestSuite({ id: "S003" });
        tec.startTestCase({ id: "S003C001" });
        tec.endTestCase();
        tec.endTestSuite();
        tec.endExecution();
      });

      it("should have a valid finished state", () => {
        expect(tec.isExecutionStarted()).toBeTruthy();
        expect(tec.isExecutionFinished()).toBeTruthy();
        expect(tec.duration).toEqual(expect.any(Number));
      });

      it("should aggregate all entities correctly", () => {
        expect(tec.testSuites.length).toBe(3);
        expect(tec.testCases.length).toBe(4);
        expect(tec.testSteps.length).toBe(1);
        expect(tec.testActions.length).toBe(1);
      });

      it("should have correctly set state to entities", () => {
        expect(tec.testSuites).toEqual(
          arrayContaining([
            validContextEntity({ id: "S001" }), // S001
            validContextEntity({
              // S002
              id: "S002",
              testCases: arrayContaining([
                validContextEntity({
                  // S002C001
                  id: "S002C001",
                  testSteps: arrayContaining([
                    validContextEntity({
                      id: "late added",
                      testActions: arrayContaining([
                        validContextEntity({
                          kind: "action",
                          id: "Action",
                        }),
                      ]),
                    }),
                  ]),
                }),
                validContextEntity({
                  id: "S002C002",
                }),
                validContextEntity({
                  id: "S002C003",
                }),
              ]),
            }),
            validContextEntity(),
          ])
        );
      });
    });
  });

  describe("negative", () => {
    it("should throw for duration request if execution is not finished", () => {
      tec.startExecution();
      expect(() => tec.duration).toThrow();
    });

    it("should throw when starting testsuite before execution", () => {
      expect(() => {
        tec.startTestSuite();
      }).toThrow();
    });

    it("should throw when starting testcase before testsuite is started", () => {
      tec.startExecution();
      expect(() => {
        tec.startTestCase();
      }).toThrow();
    });

    it("should throw when starting teststep before testcase is started", () => {
      tec.startExecution();
      tec.startTestSuite();
      expect(() => {
        tec.startTestStep();
      }).toThrow();
    });

    it("should throw if execution is ended before its started", () => {
      expect(() => tec.endExecution()).toThrow();
    });
  });

  describe("events", () => {
    type EventSpies = {
      startExecution: jest.Mock;
      endExecution: jest.Mock;
      startTestSuite: jest.Mock;
      updateTestSuite: jest.Mock;
      endTestSuite: jest.Mock;
      startTestCase: jest.Mock;
      updateTestCase: jest.Mock;
      endTestCase: jest.Mock;
      startTestStep: jest.Mock;
      updateTestStep: jest.Mock;
      endTestStep: jest.Mock;
      startTestAction: jest.Mock;
      updateTestAction: jest.Mock;
      endTestAction: jest.Mock;
    };
    let spies: EventSpies;
    beforeEach(() => {
      spies = {
        startExecution: jest.fn(),
        endExecution: jest.fn(),
        startTestSuite: jest.fn(),
        updateTestSuite: jest.fn(),
        endTestSuite: jest.fn(),
        startTestCase: jest.fn(),
        updateTestCase: jest.fn(),
        endTestCase: jest.fn(),
        startTestStep: jest.fn(),
        updateTestStep: jest.fn(),
        endTestStep: jest.fn(),
        startTestAction: jest.fn(),
        updateTestAction: jest.fn(),
        endTestAction: jest.fn(),
      };
      tec.on(START_EXECUTION, spies.startExecution);
      tec.on(END_EXECUTION, spies.endExecution);
      tec.on(START_TESTSUITE, spies.startTestSuite);
      tec.on(UPDATE_TESTSUITE, spies.updateTestSuite);
      tec.on(END_TESTSUITE, spies.endTestSuite);
      tec.on(START_TESTCASE, spies.startTestCase);
      tec.on(UPDATE_TESTCASE, spies.updateTestCase);
      tec.on(END_TESTCASE, spies.endTestCase);
      tec.on(START_TESTSTEP, spies.startTestStep);
      tec.on(UPDATE_TESTSTEP, spies.updateTestStep);
      tec.on(END_TESTSTEP, spies.endTestStep);
      tec.on(START_TESTACTION, spies.startTestAction);
      tec.on(UPDATE_TESTACTION, spies.updateTestAction);
      tec.on(END_TESTACTION, spies.endTestAction);

      // Prevent code from autoformatting: https://stackoverflow.com/a/19492318/2218197
      // @formatter:off
      tec.startExecution();
      tec.startTestSuite({ id: "S001" });
      tec.updateCurrentTestSuite({});
      tec.endTestSuite();
      tec.startTestSuite({ id: "S002" });
      tec.startTestCase({ id: "S002C001" });
      tec.startTestStep();
      tec.updateCurrentTestStep({ id: "late added" });
      tec.startTestAction({});
      tec.updateCurrentTestAction({ id: "Action" });
      tec.endTestAction();
      tec.endTestStep();
      tec.endTestCase();
      tec.startTestCase({ id: "S002C002" });
      tec.updateCurrentTestCase({});
      tec.endTestCase();
      tec.endTestSuite();
      tec.endExecution();
      // @formatter:on
    });

    it.each(<[TestExecutionContextEventTypes, number, keyof EventSpies][]>[
      [START_EXECUTION, 1, "startExecution"],
      [END_EXECUTION, 1, "endExecution"],
      [START_TESTSUITE, 2, "startTestSuite"],
      [UPDATE_TESTSUITE, 1, "updateTestSuite"],
      [END_TESTSUITE, 2, "endTestSuite"],
      [START_TESTCASE, 2, "startTestCase"],
      [UPDATE_TESTCASE, 1, "updateTestCase"],
      [END_TESTCASE, 2, "endTestCase"],
      [START_TESTSTEP, 1, "startTestStep"],
      [UPDATE_TESTSTEP, 1, "updateTestStep"],
      [END_TESTSTEP, 1, "endTestStep"],
      [START_TESTACTION, 1, "startTestAction"],
      [UPDATE_TESTACTION, 1, "updateTestAction"],
      [END_TESTACTION, 1, "endTestAction"],
    ])(
      "should invoke event %s %i times",
      (
        event: TestExecutionContextEventTypes,
        times: number,
        spy: keyof EventSpies
      ) => {
        expect(spies[spy]).toBeCalledTimes(times);
      }
    );
  });
});
