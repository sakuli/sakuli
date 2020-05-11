import { TestCaseContext } from "./test-case-context.class";
import { TestSuiteContext } from "./test-suite-context.class";
import { TestStepContext } from "./test-step-context.class";
import { TestContextEntity } from "./test-context-entity.class";
import {
    SakuliContextEntityRaw,
    SakuliContextTestActionRaw,
    SakuliContextTestCaseRaw,
    SakuliContextTestStepRaw,
    SakuliContextTestSuiteRaw,
} from "./test-context-entity-raw.interface";
import { TestActionContext } from "./test-action-context.class";
import { stripIndents } from "common-tags";
import { validateSync } from "class-validator";

function toJsonBase(e: TestContextEntity): SakuliContextEntityRaw {
  if (e.isValid()) {
    return {
      id: e.id || "",
      startDate: e.startDate,
      endDate: e.endDate,
      criticalTime: e.criticalTime,
      warningTime: e.warningTime,
      error: e.error,
      state: e.state,
    };
  } else {
    throw Error(stripIndents`
            Cannot convert an invalid ContextEntity (${e.kind}).
            ${validateSync(e).map(
              (err) => stripIndents`
                - ${err.toString()}
            `
            )}
            
            
        `);
  }
}

export function toJson(e: TestSuiteContext): SakuliContextTestSuiteRaw;
export function toJson(e: TestCaseContext): SakuliContextTestCaseRaw;
export function toJson(e: TestStepContext): SakuliContextTestStepRaw;
export function toJson(e: TestActionContext): SakuliContextTestActionRaw;
export function toJson(e: TestContextEntity): SakuliContextEntityRaw {
  if (e instanceof TestSuiteContext) {
    return <SakuliContextTestSuiteRaw>{
      ...toJsonBase(e),
      testCases: e.testCases.map((tc) => toJson(tc)),
    };
  }
  if (e instanceof TestCaseContext) {
    return <SakuliContextTestCaseRaw>{
      ...toJsonBase(e),
      testSteps: e.testSteps.map((ts) => toJson(ts)),
    };
  }
  if (e instanceof TestStepContext) {
    return <SakuliContextTestStepRaw>{
      ...toJsonBase(e),
      testActions: e.testActions.map((ta) => toJson(ta)),
    };
  }
  return toJsonBase(e);
}
