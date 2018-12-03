import { TestCaseContext } from "./test-case-context.class";
import { TestSuiteContext } from "./test-suite-context.class";
import { TestStepContext } from "./test-step-context.class";
import { TestContextEntity } from "./test-context-entity.class";
import { SakuliContextTestSuiteRaw, SakuliContextTestCaseRaw, SakuliContextTestStepRaw, SakuliContextEntityRaw, SakuliContextTestActionRaw } from "./test-context-entity-raw.interface";
import { inspect } from "util";
import { TestActionContext } from "./test-action-context.class";

function toJsonBase(e: TestContextEntity): SakuliContextEntityRaw {
    if(e.isValid()) {
        return ({
            startDate: e.startDate,
            endDate: e.endDate,
            criticalTime: e.criticalTime,
            warningTime: e.warningTime,
            error: e.error,
            state: e.state
        })
    } else {
        //console.log(e);
        throw Error('Cannot convert an invalid ContextEntity');
    }
}

export function toJson(e: TestSuiteContext): SakuliContextTestSuiteRaw;
export function toJson(e: TestCaseContext): SakuliContextTestCaseRaw;
export function toJson(e: TestStepContext): SakuliContextTestStepRaw;
export function toJson(e: TestActionContext): SakuliContextTestActionRaw;
export function toJson(e: TestContextEntity): SakuliContextEntityRaw {    
    if(e instanceof TestSuiteContext) {
        return (<SakuliContextTestSuiteRaw>{
                ...toJsonBase(e),
                testCases: e.testCases.map(tc => toJson(tc))
            })
    }
    if(e instanceof TestCaseContext) {
        return (<SakuliContextTestCaseRaw>{
                ...toJsonBase(e),
                testSteps: e.testSteps.map(ts => toJson(ts))
            })
    }
    if(e instanceof TestStepContext) {
        return (<SakuliContextTestStepRaw>{
                ...toJsonBase(e),
                testActions: e.testActions.map(ta => toJson(ta))
            })
    }
    return toJsonBase(e);
}